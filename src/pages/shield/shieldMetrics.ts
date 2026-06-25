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

/** Project scope selector on the listener node-id label. */
export const projectSelector = (project: string): string => `{listener=~".*::${project}::.*"}`;
