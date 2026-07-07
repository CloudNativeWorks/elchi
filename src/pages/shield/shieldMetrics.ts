/**
 * Shield metrics helpers — PromQL range queries against VictoriaMetrics via the
 * gateway's /api/v1/query_range passthrough. Shield pushes `elchi_shield_*`
 * series (OTLP → collector → VM) with a `listener` label = the Envoy node id
 * (listener::project::ip), so project scoping is a listener regex match.
 */

import { api } from '@/common/api';
import type { MetricLineSeries } from '@/pages/api-discovery/components/MetricLineChart';

export interface VMSeries {
    metric: Record<string, string>;
    values: Array<[number, string]>;
}

/** A range-query window: ~120 points across [start,end], 5-min rate window floor. */
export const rangeParams = (rangeSec: number) => {
    const end = Math.floor(Date.now() / 1000);
    const start = end - rangeSec;
    const step = Math.max(15, Math.floor(rangeSec / 120));
    const rateWindow = Math.max(step * 4, 300); // ≥ a few 15s scrapes
    return { start, end, step, rateWindow };
};

/** Humanize a duration in seconds → compact "30s" / "5m" / "5.6h" label. */
export const humanizeDur = (sec: number): string => {
    if (sec < 60) return `${Math.round(sec)}s`;
    if (sec < 3600) return `${Math.round(sec / 60)}m`;
    const h = sec / 3600;
    return `${h % 1 === 0 ? h : h.toFixed(1)}h`;
};

/** Run a PromQL range query and return the raw VM series. */
export const queryRange = async (query: string, start: number, end: number, step: number): Promise<VMSeries[]> => {
    const res = await api.get('/api/v1/query_range', { params: { query, start, end, step }, _skipGlobalErrorNotification: true } as never);
    return res?.data?.data?.result ?? [];
};

/** Map VM series → MetricLineChart series; nameFn derives the legend from labels. */
export const toLineSeries = (
    result: VMSeries[],
    nameFn: (m: Record<string, string>) => string,
    opts?: { color?: string; stack?: string; area?: boolean },
): MetricLineSeries[] =>
    result.map((s) => ({
        name: nameFn(s.metric),
        data: s.values.map(([t, v]) => [t * 1000, Number(v) || 0] as [number, number]),
        color: opts?.color,
        stack: opts?.stack,
        area: opts?.area,
    }));

/** Latest value of a single-series PromQL result (for stat tiles). */
export const latestScalar = (result: VMSeries[]): number => {
    const vals = result?.[0]?.values;
    if (!vals || vals.length === 0) return 0;
    return Number(vals[vals.length - 1][1]) || 0;
};

/** Sum of `increase(...)` over the window (total count) for a stat tile. */
export const sumOverWindow = (result: VMSeries[]): number =>
    (result?.[0]?.values ?? []).reduce((s, [, v]) => s + (Number(v) || 0), 0);

/** Sum of the latest value across all series (e.g. by-instance → global). */
export const sumLatest = (result: VMSeries[]): number =>
    (result ?? []).reduce((acc, s) => acc + (s.values.length ? Number(s.values[s.values.length - 1][1]) || 0 : 0), 0);

/** Collapse multiple series into one combined line by summing per timestamp. */
export const sumByTime = (result: VMSeries[]): Array<[number, number]> => {
    const acc = new Map<number, number>();
    for (const s of result ?? []) for (const [t, v] of s.values) acc.set(t, (acc.get(t) || 0) + (Number(v) || 0));
    return Array.from(acc.entries()).sort((a, b) => a[0] - b[0]).map(([t, v]) => [t * 1000, v]);
};

/** Latest value per series keyed by a chosen label, sorted descending by value. */
export const topByLabel = (result: VMSeries[], labelKey: string): Array<{ label: string; value: number }> =>
    (result ?? [])
        .map((s) => ({
            label: s.metric[labelKey] || 'unknown',
            value: s.values.length ? Number(s.values[s.values.length - 1][1]) || 0 : 0,
        }))
        .sort((a, b) => b.value - a.value);

/** Latest value of the single combined series, keyed by instance (edge). */
export const latestByInstance = (result: VMSeries[]): Array<{ instance: string; value: number }> =>
    topByLabel(result, 'instance').map((r) => ({ instance: r.label, value: r.value }));

/**
 * Combined ratio (sum numerator / sum denominator) per timestamp, as a percentage.
 * Used for "blocked share of traffic (%)" where both operands are per-second rates
 * over the same window — the ratio is unit-free and valid despite the averaging.
 */
export const ratioByTime = (numer: VMSeries[], denom: VMSeries[]): Array<[number, number]> => {
    const n = new Map<number, number>();
    const d = new Map<number, number>();
    for (const s of numer ?? []) for (const [t, v] of s.values) n.set(t, (n.get(t) || 0) + (Number(v) || 0));
    for (const s of denom ?? []) for (const [t, v] of s.values) d.set(t, (d.get(t) || 0) + (Number(v) || 0));
    return Array.from(d.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([t, dv]) => [t * 1000, dv > 0 ? ((n.get(t) || 0) / dv) * 100 : 0] as [number, number]);
};

/** Timestamps (ms) where a single-series value is > 0 — e.g. changes()/reload markers. */
export const nonzeroTimestamps = (result: VMSeries[]): number[] =>
    (result?.[0]?.values ?? []).filter(([, v]) => (Number(v) || 0) > 0).map(([t]) => t * 1000);

/**
 * Drop series that are flat-zero across the whole window. The findings metric
 * pre-registers every engine×action combo, so VM returns a zero series for every
 * engine even when only a handful actually fired — filter those out so a chart
 * legend lists the engines that did something, not all 18.
 */
export const withData = (result: VMSeries[]): VMSeries[] =>
    (result ?? []).filter((s) => (s.values ?? []).some(([, v]) => (Number(v) || 0) > 0));

/**
 * Rank series by their latest value, keep the top `n` as their own stacked
 * lines, and fold the rest into a single summed "other (k)" series — so a
 * many-series stacked chart (e.g. ~18 engines) shows a legible legend while its
 * total still adds up to the same height. Zero-across-window series are dropped
 * first, so `other` only ever counts engines that actually fired.
 */
export const foldTopSeries = (
    result: VMSeries[],
    labelKey: string,
    n: number,
    stack: string,
): MetricLineSeries[] => {
    const latest = (s: VMSeries) => (s.values.length ? Number(s.values[s.values.length - 1][1]) || 0 : 0);
    const ranked = [...withData(result)].sort((a, b) => latest(b) - latest(a));
    const toData = (vals: VMSeries['values']) => vals.map(([t, v]) => [t * 1000, Number(v) || 0] as [number, number]);
    const series: MetricLineSeries[] = ranked.slice(0, n).map((s) => ({
        name: s.metric[labelKey] || 'unknown',
        data: toData(s.values),
        stack,
        area: true,
    }));
    const rest = ranked.slice(n);
    if (rest.length) {
        const acc = new Map<number, number>();
        for (const s of rest) for (const [t, v] of s.values) acc.set(t, (acc.get(t) || 0) + (Number(v) || 0));
        series.push({
            name: `other (${rest.length})`,
            data: Array.from(acc.entries()).sort((a, b) => a[0] - b[0]).map(([t, v]) => [t * 1000, v] as [number, number]),
            stack,
            area: true,
            color: '#8c8c8c',
        });
    }
    return series;
};

/** Project scope selector on the listener node-id label. */
export const projectSelector = (project: string): string => `{listener=~".*::${project}::.*"}`;
