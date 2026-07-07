/**
 * Shield Overview — live elchi-shield operational metrics (from VictoriaMetrics
 * via /api/v1/query_range), project-scoped on the `listener` node-id label.
 * Complements the Security Events feed (per-event forensics) with rates/latency.
 *
 * Layout: an always-visible headline strip (4 rate tiles) plus collapsible
 * sections. Quiet/empty panels are hidden so the common case stays compact, and
 * a collapsed section doesn't mount its charts until expanded.
 */

import React, { useMemo, useState } from 'react';
import { Alert, Button, Card, Col, Collapse, Progress, Row, Segmented, Space, Table, Tag, Tooltip, Typography } from 'antd';
import {
    ReloadOutlined, SafetyCertificateOutlined, ThunderboltOutlined, StopOutlined,
    EyeOutlined, ClockCircleOutlined, UnlockOutlined, LockOutlined, FieldTimeOutlined,
    DatabaseOutlined, ApartmentOutlined, DeploymentUnitOutlined, HddOutlined, FileProtectOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { isShieldAdmin } from './utils';
import {
    rangeParams, queryRange, toLineSeries, latestScalar, sumLatest, sumByTime, projectSelector,
    humanizeDur, topByLabel, ratioByTime, nonzeroTimestamps, withData, foldTopSeries, VMSeries,
} from './shieldMetrics';
import MetricLineChart, { MetricLineSeries, EventMarker, Sparkline } from '@/pages/api-discovery/components/MetricLineChart';

const { Text, Title } = Typography;

// Latency values arrive in seconds. p50/p95/p99 are frequently sub-millisecond,
// so a fixed "(v*1000).toFixed(0) ms" collapses every axis tick + tooltip to
// "0 ms". Keep the unit ms but scale precision so small values stay readable.
const fmtLatency = (v: number): string => {
    const ms = v * 1000;
    if (ms === 0) return '0 ms';
    if (ms < 0.1) return `${ms.toFixed(3)} ms`;
    if (ms < 1) return `${ms.toFixed(2)} ms`;
    if (ms < 10) return `${ms.toFixed(1)} ms`;
    return `${Math.round(ms)} ms`;
};

const fmtBytes = (b: number): string =>
    b >= 1e9 ? `${(b / 1e9).toFixed(2)} GB` : b >= 1e6 ? `${(b / 1e6).toFixed(1)} MB` : b >= 1e3 ? `${(b / 1e3).toFixed(0)} KB` : `${Math.round(b)} B`;
const fmtBytesRate = (b: number): string => `${fmtBytes(b)}/s`;

// Panel-visibility guards: `hasPoints` = the series exists at all; `hasNonzero`
// = it actually carried a value > 0 in the window (so a flat-zero "healthy"
// series doesn't earn a chart of its own).
const hasPoints = (...rs: (VMSeries[] | undefined)[]): boolean =>
    rs.some((r) => (r ?? []).some((s) => (s.values?.length ?? 0) > 0));
const hasNonzero = (...rs: (VMSeries[] | undefined)[]): boolean =>
    rs.some((r) => (r ?? []).some((s) => (s.values ?? []).some(([, v]) => (Number(v) || 0) > 0)));

const RANGES = [
    { label: '1h', value: 3600 },
    { label: '6h', value: 21600 },
    { label: '24h', value: 86400 },
    { label: '7d', value: 604800 },
];

const SYNC = 'shield-overview'; // shared crosshair group across the time charts

const Stat: React.FC<{ label: string; value: string; color?: string; icon?: React.ReactNode; spark?: number[] }> = ({ label, value, color, icon, spark }) => {
    const accent = color || 'var(--text-secondary)';
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'var(--bg-hover)', borderRadius: 10, border: '1px solid var(--border-default)' }}>
            {icon && (
                <div style={{
                    width: 38,
                    height: 38,
                    borderRadius: 9,
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    color: accent,
                    background: `color-mix(in srgb, ${accent} 14%, transparent)`,
                }}>
                    {icon}
                </div>
            )}
            <div style={{ minWidth: 0, flex: 1 }}>
                <Text style={{ fontSize: 10.5, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--text-tertiary)', display: 'block' }}>{label}</Text>
                <Text style={{ fontSize: 20, fontWeight: 700, color: color || 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{value}</Text>
            </div>
            {spark && spark.length > 1 && <Sparkline data={spark} color={typeof color === 'string' && color.startsWith('#') ? color : '#3b9eff'} />}
        </div>
    );
};

const ShieldOverview: React.FC<{ active?: boolean }> = ({ active = true }) => {
    const { project } = useProjectVariable();
    const admin = isShieldAdmin();
    const [rangeSec, setRangeSec] = useState(3600);

    const q = useQuery({
        queryKey: ['shield-metrics', project, rangeSec],
        queryFn: async () => {
            const { start, end, step, rateWindow } = rangeParams(rangeSec);
            const w = rateWindow;
            const sel = projectSelector(project);
            const selBlock = `{listener=~".*::${project}::.*",action="block"}`;
            const selDetect = `{listener=~".*::${project}::.*",action=~"detect|shadow"}`;
            const rr = (expr: string) => queryRange(expr, start, end, step);
            const rate = (m: string) => rr(`sum(rate(elchi_shield_${m}${sel}[${w}s]))`);
            // Health/pipeline series carry `instance` (the edge) but no `listener`
            // label, so they're queried globally by instance (platform-wide).
            const grate = (m: string) => rr(`sum by (instance)(rate(elchi_shield_${m}[${w}s]))`);
            const ginst = (m: string) => rr(`sum by (instance)(elchi_shield_${m})`);
            const gmax = (m: string) => rr(`max by (instance)(elchi_shield_${m})`);
            const pq = (qv: number) => rr(`histogram_quantile(${qv}, sum by (le)(rate(elchi_shield_processing_latency_seconds_bucket${sel}[${w}s])))`);
            // go_/process_ collectors are unprefixed and shared across every elchi
            // service, so scope them to shield edges by the `<host>-shield` id.
            const si = '{instance=~".+-shield"}';
            const [
                req, blk, det, findingsBlock, findingsDetect,
                p50, p95, p99, latByPhase, byEdge,
                bodyBytes, bodyMut, bodyRej,
                failOpen, failClose, timeouts, extproc, reloadConsec,
                auditQueue, auditDropped, auditExportErr,
                stageActions, stageLat,
                streamsInFlight, inflightBody, goroutines, rss, cpu,
                configAge, lastReload, buildInfo, reloadMarks,
            ] = await Promise.all([
                rate('requests_total'),
                rate('requests_blocked_total'),
                rate('detections_total'),
                rr(`sum by (engine)(rate(elchi_shield_findings_total${selBlock}[${w}s]))`),
                rr(`sum by (engine, action)(rate(elchi_shield_findings_total${selDetect}[${w}s]))`),
                pq(0.5), pq(0.95), pq(0.99),
                rr(`histogram_quantile(0.95, sum by (le, phase)(rate(elchi_shield_processing_latency_seconds_bucket${sel}[${w}s])))`),
                rr(`sum by (listener)(rate(elchi_shield_requests_total${sel}[${w}s]))`),
                rate('body_inspected_bytes_total'),
                rate('body_mutations_total'),
                rr(`sum by (reason)(rate(elchi_shield_body_budget_rejections_total${sel}[${w}s]))`),
                grate('fail_open_total'), grate('fail_close_total'), grate('timeouts_total'), grate('extproc_errors_total'),
                rr(`max by (instance)(elchi_shield_config_reload_failures_consecutive)`),
                ginst('audit_queue_depth'), grate('audit_events_dropped_total'), grate('audit_export_errors_total'),
                rr(`sum by (stage, action)(rate(elchi_shield_stage_actions_total[${w}s]))`),
                rr(`histogram_quantile(0.95, sum by (le, stage)(rate(elchi_shield_stage_latency_seconds_bucket[${w}s])))`),
                ginst('streams_in_flight'), ginst('inflight_body_bytes'),
                rr(`sum by (instance)(go_goroutines${si})`),
                rr(`sum by (instance)(process_resident_memory_bytes${si})`),
                rr(`sum by (instance)(rate(process_cpu_seconds_total${si}[${w}s]))`),
                gmax('config_age_seconds'), rr(`max by (instance)(elchi_shield_config_last_reload_success_timestamp_seconds)`),
                rr(`elchi_shield_build_info`),
                rr(`sum(changes(elchi_shield_config_last_reload_success_timestamp_seconds[${step}s]))`),
            ]);
            return {
                req, blk, det, findingsBlock, findingsDetect, p50, p95, p99, latByPhase, byEdge,
                bodyBytes, bodyMut, bodyRej, failOpen, failClose, timeouts, extproc, reloadConsec,
                auditQueue, auditDropped, auditExportErr, stageActions, stageLat,
                streamsInFlight, inflightBody, goroutines, rss, cpu, configAge, lastReload, buildInfo, reloadMarks,
            };
        },
        enabled: admin && !!project && active,
        refetchInterval: active ? 30000 : false,
        refetchOnWindowFocus: false,
        retry: false,
    });

    const d = q.data;
    const sparkOf = (res?: VMSeries[]) => sumByTime(res ?? []).map((p) => p[1]);

    // Config-reload markers, shared across the time charts (correlate a latency
    // or traffic shift with a policy push).
    const reloadMarkers: EventMarker[] = useMemo(
        () => nonzeroTimestamps(d?.reloadMarks ?? []).map((x) => ({ x, label: 'reload', color: '#8c8c8c' })),
        [d]);

    const throughput: MetricLineSeries[] = useMemo(() => [
        ...toLineSeries(d?.req ?? [], () => 'Requests/s', { color: '#389e0d' }),
        ...toLineSeries(d?.blk ?? [], () => 'Blocked/s', { color: '#cf1322' }),
        ...toLineSeries(d?.det ?? [], () => 'Detections/s', { color: '#d46b08' }),
    ], [d]);

    // Cap the stacked chart to the top-8 engines (rest folded into "other") so
    // the legend stays legible no matter how many engines fire; the table below
    // still lists the top blockers individually.
    const byEngine: MetricLineSeries[] = useMemo(
        () => foldTopSeries(d?.findingsBlock ?? [], 'engine', 8, 'engines'),
        [d]);

    const topEngines = useMemo(() => {
        const rows = topByLabel(d?.findingsBlock ?? [], 'engine').filter((r) => r.value > 0);
        const total = rows.reduce((s, r) => s + r.value, 0) || 1;
        return rows.slice(0, 6).map((r) => ({ ...r, pct: Math.round((r.value / total) * 100) }));
    }, [d]);

    const latency: MetricLineSeries[] = useMemo(() => [
        ...toLineSeries(d?.p50 ?? [], () => 'p50', { color: '#1677ff' }),
        ...toLineSeries(d?.p95 ?? [], () => 'p95', { color: '#d46b08' }),
        ...toLineSeries(d?.p99 ?? [], () => 'p99', { color: '#cf1322' }),
    ], [d]);

    const latencyByPhase: MetricLineSeries[] = useMemo(
        () => toLineSeries(d?.latByPhase ?? [], (m) => m.phase || 'other'),
        [d]);

    const blockedShare: MetricLineSeries[] = useMemo(
        () => [{ name: 'Blocked %', data: ratioByTime(d?.blk ?? [], d?.req ?? []), color: '#cf1322', area: true }],
        [d]);

    const byEdge: MetricLineSeries[] = useMemo(
        () => toLineSeries(d?.byEdge ?? [], (m) => {
            const p = (m.listener || 'edge').split('::');
            return p.length >= 3 ? `${p[0]} (${p[2]})` : (m.listener || 'edge');
        }),
        [d]);

    // Body / DLP — DLP redactions and intake truncations per second (bytes/s shown
    // as a headline stat since it dwarfs the count series on a shared axis).
    const bodyChart: MetricLineSeries[] = useMemo(() => [
        { name: 'DLP redactions/s', data: sumByTime(d?.bodyMut ?? []), color: '#722ed1', area: true },
        ...toLineSeries(withData(d?.bodyRej ?? []), (m) => `reject:${m.reason || 'other'}`, {}),
    ], [d]);

    // Detect / shadow findings by engine (would-block in monitor/shadow mode).
    const detectShadow: MetricLineSeries[] = useMemo(
        () => toLineSeries(withData(d?.findingsDetect ?? []), (m) => `${m.engine || 'unknown'} (${m.action || 'detect'})`, { stack: 'ds', area: true }),
        [d]);

    // Audit pipeline — dropped/export-error rates (queue depth is a gauge tile).
    const auditChart: MetricLineSeries[] = useMemo(() => [
        { name: 'dropped/s', data: sumByTime(d?.auditDropped ?? []), color: '#cf1322', area: true },
        { name: 'export errors/s', data: sumByTime(d?.auditExportErr ?? []), color: '#d46b08', area: true },
    ], [d]);

    // Sidecar self-health over time (leak + concurrency signals).
    const sidecarChart: MetricLineSeries[] = useMemo(() => [
        { name: 'goroutines', data: sumByTime(d?.goroutines ?? []), color: '#1677ff' },
        { name: 'streams in-flight', data: sumByTime(d?.streamsInFlight ?? []), color: '#13c2c2' },
    ], [d]);

    // Health rates over time (GLOBAL — summed across edges, not project-scoped).
    const healthChart: MetricLineSeries[] = useMemo(() => [
        { name: 'fail-close/s', data: sumByTime(d?.failClose ?? []), color: '#cf1322' },
        { name: 'timeouts/s', data: sumByTime(d?.timeouts ?? []), color: '#d46b08' },
        { name: 'ext_proc errors/s', data: sumByTime(d?.extproc ?? []), color: '#7c3aed' },
        { name: 'fail-open/s', data: sumByTime(d?.failOpen ?? []), color: '#8c8c8c' },
    ], [d]);

    // Per-stage pipeline breakdown: latest per-second rate per action + p95 latency.
    const stageBreakdown = useMemo(() => {
        type StageRow = { stage: string; total: number; p95?: number; [k: string]: number | string | undefined };
        const acts = new Set<string>();
        const m = new Map<string, StageRow>();
        const latest = (s: VMSeries) => (s.values.length ? Number(s.values[s.values.length - 1][1]) || 0 : 0);
        const get = (stage: string): StageRow => m.get(stage) || { stage, total: 0 };
        (d?.stageActions ?? []).forEach((s) => {
            const stage = s.metric.stage || '?';
            const action = s.metric.action || '?';
            acts.add(action);
            const row = get(stage);
            row[action] = latest(s);
            row.total += latest(s);
            m.set(stage, row);
        });
        (d?.stageLat ?? []).forEach((s) => {
            const stage = s.metric.stage || '?';
            const row = get(stage);
            row.p95 = latest(s);
            m.set(stage, row);
        });
        return { actions: Array.from(acts).sort(), rows: Array.from(m.values()).sort((a, b) => b.total - a.total) };
    }, [d]);

    // Per-edge config/rollout snapshot (version, config age, last reload, streak).
    const rollout = useMemo(() => {
        const m = new Map<string, { instance: string; version: string; revision: string; ageSec: number; lastReload: number; streak: number }>();
        const get = (inst: string) => m.get(inst) || { instance: inst, version: '—', revision: '', ageSec: NaN, lastReload: 0, streak: 0 };
        (d?.buildInfo ?? []).forEach((s) => {
            const inst = s.metric.instance || '?';
            const row = get(inst);
            row.version = s.metric.version || '—';
            row.revision = (s.metric.revision || '').slice(0, 8);
            m.set(inst, row);
        });
        const latest = (s: VMSeries) => (s.values.length ? Number(s.values[s.values.length - 1][1]) || 0 : 0);
        (d?.configAge ?? []).forEach((s) => { const r = get(s.metric.instance || '?'); r.ageSec = latest(s); m.set(r.instance, r); });
        (d?.lastReload ?? []).forEach((s) => { const r = get(s.metric.instance || '?'); r.lastReload = latest(s); m.set(r.instance, r); });
        (d?.reloadConsec ?? []).forEach((s) => { const r = get(s.metric.instance || '?'); r.streak = latest(s); m.set(r.instance, r); });
        return Array.from(m.values()).sort((a, b) => a.instance.localeCompare(b.instance));
    }, [d]);

    // Per-edge health snapshot (latest value per instance), worst first.
    const edges = useMemo(() => {
        const m = new Map<string, { instance: string; failOpen: number; failClose: number; timeouts: number; extproc: number; reloadFail: number }>();
        const put = (res: VMSeries[] | undefined, key: 'failOpen' | 'failClose' | 'timeouts' | 'extproc' | 'reloadFail') => {
            (res ?? []).forEach((s) => {
                const inst = s.metric.instance || '?';
                const row = m.get(inst) || { instance: inst, failOpen: 0, failClose: 0, timeouts: 0, extproc: 0, reloadFail: 0 };
                row[key] = s.values.length ? Number(s.values[s.values.length - 1][1]) || 0 : 0;
                m.set(inst, row);
            });
        };
        put(d?.failOpen, 'failOpen'); put(d?.failClose, 'failClose'); put(d?.timeouts, 'timeouts'); put(d?.extproc, 'extproc'); put(d?.reloadConsec, 'reloadFail');
        return Array.from(m.values()).sort((a, b) => (b.failClose - a.failClose) || (b.reloadFail - a.reloadFail) || (b.timeouts - a.timeouts));
    }, [d]);

    const unhealthyCount = edges.filter((e) => e.failClose > 0 || e.reloadFail > 0).length;
    const maxReloadFail = edges.reduce((mx, e) => Math.max(mx, e.reloadFail), 0);

    if (!admin) {
        return <Alert type="info" showIcon message="Admin access required" description="Shield metrics are restricted to Admin and Owner roles." style={{ borderRadius: 8 }} />;
    }

    const fmtRate = (n: number) => `${n.toFixed(n < 10 ? 2 : 0)}/s`;
    const fmtMs = (sec: number) => `${(sec * 1000).toFixed(sec < 1 ? 1 : 0)} ms`;

    // What the numbers actually mean — the step (point resolution) and rate window
    // (smoothing) both derive from the selected range, so surface them so a user
    // doesn't have to guess whether "1.22/s" is instantaneous (it isn't — it's the
    // latest point of a rate()-averaged series over `winLabel`).
    const { step, rateWindow } = rangeParams(rangeSec);
    const winLabel = humanizeDur(rateWindow);
    const stepLabel = humanizeDur(step);
    const rangeLabel = RANGES.find((r) => r.value === rangeSec)?.label ?? '';
    const reqNow = latestScalar(d?.req ?? []);
    const blkNow = latestScalar(d?.blk ?? []);
    const blockedPct = reqNow > 0 ? Math.round((blkNow / reqNow) * 100) : 0;
    const p99Now = latestScalar(d?.p99 ?? []);
    const budgetPct = Math.min(100, Math.round((p99Now / 0.2) * 100)); // vs 200ms default

    // Audit / body / runtime headline values (across all edges where global).
    const auditQueueNow = sumLatest(d?.auditQueue ?? []);
    const auditDropNow = sumLatest(d?.auditDropped ?? []);
    const auditErrNow = sumLatest(d?.auditExportErr ?? []);
    const bytesNow = latestScalar(d?.bodyBytes ?? []);
    const mutNow = latestScalar(d?.bodyMut ?? []);
    const goroutinesNow = sumLatest(d?.goroutines ?? []);
    const rssNow = sumLatest(d?.rss ?? []);
    const cpuNow = sumLatest(d?.cpu ?? []);
    const streamsNow = sumLatest(d?.streamsInFlight ?? []);
    const inflightNow = sumLatest(d?.inflightBody ?? []);

    // Panel-visibility: hide quiet panels so the common case stays compact.
    const showDetect = hasNonzero(d?.findingsDetect);
    const showBodyChart = hasNonzero(d?.bodyMut, d?.bodyRej);
    const showAuditChart = hasNonzero(d?.auditDropped, d?.auditExportErr);
    const showSidecarChart = hasPoints(d?.goroutines, d?.streamsInFlight);
    const showHealthChart = hasNonzero(d?.failClose, d?.timeouts, d?.extproc, d?.failOpen);
    const showStages = stageBreakdown.rows.length > 0;
    const showRollout = rollout.length > 0;
    const auditDegraded = auditDropNow > 0 || auditErrNow > 0;

    const secLabel = (title: string, extra?: React.ReactNode) => (
        <Space size={8} align="center">
            <Text style={{ fontSize: 13, fontWeight: 600 }}>{title}</Text>
            {extra}
        </Space>
    );
    const cardStyle = { borderRadius: 12 } as const;

    const bodyTiles = (
        <Row gutter={[16, 16]}>
            <Col xs={12} md={6}><Tooltip title="Bytes of request/response body shield decoded and inspected per second."><div><Stat label="Body inspected" value={fmtBytesRate(bytesNow)} color="#13c2c2" icon={<DatabaseOutlined />} spark={sparkOf(d?.bodyBytes)} /></div></Tooltip></Col>
            <Col xs={12} md={6}><Tooltip title="DLP redactions per second: PII/secrets rewritten out of the forwarded body (body-mutation channel)."><div><Stat label="DLP redactions" value={fmtRate(mutNow)} color="#722ed1" icon={<FileProtectOutlined />} spark={sparkOf(d?.bodyMut)} /></div></Tooltip></Col>
            <Col xs={12} md={6}><Tooltip title="Intake rejections per second: bodies truncated/blocked by the per-request cap or the process-wide in-flight budget (a DoS bound)."><div><Stat label="Intake rejections" value={fmtRate(sumLatest(d?.bodyRej ?? []))} color="#d46b08" icon={<StopOutlined />} spark={sumByTime(d?.bodyRej ?? []).map((p) => p[1])} /></div></Tooltip></Col>
            <Col xs={12} md={6}><Tooltip title="Detect/shadow findings per second across all engines (would-block but allowed)."><div><Stat label="Detect+shadow" value={fmtRate(sumLatest(d?.findingsDetect ?? []))} color="#faad14" icon={<EyeOutlined />} spark={sumByTime(d?.findingsDetect ?? []).map((p) => p[1])} /></div></Tooltip></Col>
        </Row>
    );

    const engineCard = (
        <Card size="small" title="Blocked findings by engine" style={cardStyle} loading={q.isLoading}>
            <MetricLineChart series={byEngine} height={168} unit="/s" stackAll="engines" syncGroup={SYNC} emptyText="No blocks in this window" />
            <Table
                size="small" rowKey="label" dataSource={topEngines} pagination={false} showHeader={false}
                locale={{ emptyText: 'No blocking engines yet' }} style={{ marginTop: 6 }}
                columns={[
                    { title: 'Engine', dataIndex: 'label', key: 'label', render: (v: string) => <Text style={{ fontSize: 12, fontWeight: 600 }}>{v}</Text> },
                    { title: 'Share', dataIndex: 'pct', key: 'pct', width: 130, render: (pct: number) => <Progress percent={pct} size="small" showInfo={false} strokeColor="#cf1322" /> },
                    { title: 'Rate', dataIndex: 'value', key: 'value', width: 70, align: 'right', render: (v: number) => <Text style={{ fontSize: 12 }}>{fmtRate(v)}</Text> },
                ]}
            />
        </Card>
    );

    const items = [
        {
            key: 'traffic',
            label: secLabel('Traffic & latency', <Tag color="blue">{fmtRate(reqNow)} · {blockedPct}% blocked</Tag>),
            children: (
                <Row gutter={[16, 16]}>
                    <Col xs={24} lg={12}>
                        <Card size="small" title="Throughput (req/blocked/detected per second)" style={cardStyle} loading={q.isLoading}>
                            <MetricLineChart series={throughput} height={240} unit="/s" syncGroup={SYNC} eventMarkers={reloadMarkers} />
                        </Card>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Card size="small" title="Blocked share of traffic (%)"
                            extra={<Tag color={blockedPct > 50 ? 'error' : blockedPct > 15 ? 'warning' : 'success'}>{blockedPct}% now</Tag>}
                            style={cardStyle} loading={q.isLoading}>
                            <MetricLineChart series={blockedShare} height={240} unit="%" yFormatter={(v) => `${v.toFixed(1)}%`} syncGroup={SYNC} eventMarkers={reloadMarkers} />
                        </Card>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Card size="small" title="Request processing latency (p50 / p95 / p99)"
                            extra={<Tooltip title="Dashed line = 200ms default policy timeout. The real budget is per-policy; p99 uses this share of the default."><Tag color={budgetPct > 70 ? 'error' : budgetPct > 40 ? 'warning' : 'success'}>p99 ≈ {budgetPct}% of 200ms</Tag></Tooltip>}
                            style={cardStyle} loading={q.isLoading}>
                            <MetricLineChart series={latency} height={240} yFormatter={fmtLatency} syncGroup={SYNC}
                                refLines={[{ y: 0.2, label: 'timeout 200ms (default)', color: '#f59e0b' }]} eventMarkers={reloadMarkers} />
                        </Card>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Card size="small" title="Latency by phase (p95)"
                            extra={<Text type="secondary" style={{ fontSize: 11 }}>p95 per phase</Text>}
                            style={cardStyle} loading={q.isLoading}>
                            <MetricLineChart series={latencyByPhase} height={240} yFormatter={fmtLatency} syncGroup={SYNC} emptyText="No phase latency in this window" />
                        </Card>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Card size="small" title="Requests by edge (this project)" style={cardStyle} loading={q.isLoading}>
                            <MetricLineChart series={byEdge} height={240} unit="/s" syncGroup={SYNC} />
                        </Card>
                    </Col>
                </Row>
            ),
        },
        {
            key: 'security',
            label: secLabel('Security findings', topEngines[0]
                ? <Tag color="red">{topEngines[0].label} top blocker</Tag>
                : <Tag>quiet</Tag>),
            children: (
                <Row gutter={[16, 16]}>
                    <Col span={24}>{bodyTiles}</Col>
                    <Col xs={24} lg={(showDetect || showBodyChart) ? 12 : 24}>{engineCard}</Col>
                    {showDetect && (
                        <Col xs={24} lg={12}>
                            <Card size="small" title="Would-block by engine (detect / shadow)"
                                extra={<Text type="secondary" style={{ fontSize: 11 }}>monitor modes</Text>}
                                style={cardStyle} loading={q.isLoading}>
                                <MetricLineChart series={detectShadow} height={240} unit="/s" stackAll="ds" syncGroup={SYNC} />
                            </Card>
                        </Col>
                    )}
                    {showBodyChart && (
                        <Col xs={24} lg={12}>
                            <Card size="small" title="DLP redactions & intake rejections (per second)" style={cardStyle} loading={q.isLoading}>
                                <MetricLineChart series={bodyChart} height={240} unit="/s" syncGroup={SYNC} />
                            </Card>
                        </Col>
                    )}
                </Row>
            ),
        },
        {
            key: 'audit',
            label: secLabel('Audit & pipeline',
                <>
                    <Text type="secondary" style={{ fontSize: 12 }}>across all edges</Text>
                    {auditDegraded ? <Tag color="error">audit degraded</Tag> : <Tag color="success">audit healthy</Tag>}
                </>),
            children: (
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Row gutter={[16, 16]}>
                            <Col xs={12} md={6}><Tooltip title="Current audit queue depth (bounded, drop-on-full). Persistently high = the sink can't keep up."><div><Stat label="Audit queue" value={String(Math.round(auditQueueNow))} color={auditQueueNow > 0 ? 'var(--color-warning)' : undefined} icon={<ApartmentOutlined />} spark={sumByTime(d?.auditQueue ?? []).map((p) => p[1])} /></div></Tooltip></Col>
                            <Col xs={12} md={6}><Tooltip title="Audit events dropped per second (queue full). NON-ZERO means the Security Events feed is missing records — a forensic gap."><div><Stat label="Audit dropped" value={fmtRate(auditDropNow)} color={auditDropNow > 0 ? 'var(--color-error)' : undefined} icon={<StopOutlined />} spark={sumByTime(d?.auditDropped ?? []).map((p) => p[1])} /></div></Tooltip></Col>
                            <Col xs={12} md={6}><Tooltip title="Audit export errors per second: the sink (ClickHouse/OTLP) rejected an event, e.g. unreachable."><div><Stat label="Export errors" value={fmtRate(auditErrNow)} color={auditErrNow > 0 ? 'var(--color-error)' : undefined} icon={<DatabaseOutlined />} spark={sumByTime(d?.auditExportErr ?? []).map((p) => p[1])} /></div></Tooltip></Col>
                            <Col xs={12} md={6}><Tooltip title="ext_proc stream errors per second (recovered panics, transport drops, build failures)."><div><Stat label="ext_proc errors" value={fmtRate(sumLatest(d?.extproc ?? []))} color={sumLatest(d?.extproc ?? []) > 0 ? 'var(--color-warning)' : undefined} icon={<DeploymentUnitOutlined />} spark={sumByTime(d?.extproc ?? []).map((p) => p[1])} /></div></Tooltip></Col>
                        </Row>
                    </Col>
                    {showAuditChart && (
                        <Col xs={24} lg={showStages ? 12 : 24}>
                            <Card size="small" title="Audit dropped & export errors (all edges, per second)" style={cardStyle} loading={q.isLoading}>
                                <MetricLineChart series={auditChart} height={240} unit="/s" />
                            </Card>
                        </Col>
                    )}
                    {showStages && (
                        <Col xs={24} lg={showAuditChart ? 12 : 24}>
                            <Card size="small" title="Pipeline stages (per-second actions & p95 latency)"
                                extra={<Text type="secondary" style={{ fontSize: 11 }}>which check does the work</Text>}
                                style={cardStyle} loading={q.isLoading}>
                                <Table
                                    size="small" rowKey="stage" dataSource={stageBreakdown.rows} pagination={false} scroll={{ y: 208 }}
                                    locale={{ emptyText: 'No stage activity yet' }}
                                    columns={[
                                        { title: 'Stage', dataIndex: 'stage', key: 'stage', ellipsis: true, render: (v: string) => <Text style={{ fontSize: 12, fontWeight: 600 }}>{v}</Text> },
                                        ...stageBreakdown.actions.map((a) => ({
                                            title: `${a}/s`, dataIndex: a, key: a, width: 84, align: 'right' as const,
                                            render: (v: number) => <Text style={{ fontSize: 12, color: (a === 'error' || a === 'block') && v > 0 ? 'var(--color-error)' : undefined }}>{v ? v.toFixed(2) : '—'}</Text>,
                                        })),
                                        { title: 'p95', dataIndex: 'p95', key: 'p95', width: 76, align: 'right' as const, render: (v: number) => <Text style={{ fontSize: 12 }}>{v ? fmtLatency(v) : '—'}</Text> },
                                    ]}
                                />
                            </Card>
                        </Col>
                    )}
                </Row>
            ),
        },
        {
            key: 'runtime',
            label: secLabel('Sidecar & config',
                <>
                    <Text type="secondary" style={{ fontSize: 12 }}>across all edges</Text>
                    <Tag>{Math.round(goroutinesNow)} goroutines · {fmtBytes(rssNow)}</Tag>
                </>),
            children: (
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Row gutter={[16, 16]}>
                            <Col xs={12} md={6}><Tooltip title="Total goroutines across shield edges — the canonical leak signal. A steady climb with flat traffic = a leak."><div><Stat label="Goroutines" value={String(Math.round(goroutinesNow))} color="#1677ff" icon={<DeploymentUnitOutlined />} spark={sumByTime(d?.goroutines ?? []).map((p) => p[1])} /></div></Tooltip></Col>
                            <Col xs={12} md={6}><Tooltip title="Resident memory (RSS) summed across shield edges."><div><Stat label="Memory (RSS)" value={fmtBytes(rssNow)} color="#13c2c2" icon={<HddOutlined />} spark={sumByTime(d?.rss ?? []).map((p) => p[1])} /></div></Tooltip></Col>
                            <Col xs={12} md={6}><Tooltip title="Concurrent ext_proc streams in flight (live load) and buffered body bytes (memory pressure)."><div><Stat label="Streams / body" value={`${Math.round(streamsNow)} / ${fmtBytes(inflightNow)}`} color="#722ed1" icon={<ApartmentOutlined />} spark={sumByTime(d?.streamsInFlight ?? []).map((p) => p[1])} /></div></Tooltip></Col>
                            <Col xs={12} md={6}><Tooltip title="CPU seconds per second across shield edges (≈ cores busy)."><div><Stat label="CPU" value={`${cpuNow.toFixed(2)} c`} color="#faad14" icon={<ThunderboltOutlined />} spark={sumByTime(d?.cpu ?? []).map((p) => p[1])} /></div></Tooltip></Col>
                        </Row>
                    </Col>
                    {showSidecarChart && (
                        <Col xs={24} lg={showRollout ? 12 : 24}>
                            <Card size="small" title="Goroutines & in-flight streams (leak / load signal)" style={cardStyle} loading={q.isLoading}>
                                <MetricLineChart series={sidecarChart} height={240} emptyText="No sidecar runtime metrics (check the -shield instance label)" />
                            </Card>
                        </Col>
                    )}
                    {showRollout && (
                        <Col xs={24} lg={showSidecarChart ? 12 : 24}>
                            <Card size="small" title="Config & rollout (per edge)"
                                extra={<Text type="secondary" style={{ fontSize: 11 }}>version · config age · reload fail</Text>}
                                style={cardStyle} loading={q.isLoading}>
                                <Table
                                    size="small" rowKey="instance" dataSource={rollout} pagination={false} scroll={{ y: 208 }}
                                    locale={{ emptyText: 'No edge build/config metrics yet' }}
                                    columns={[
                                        { title: 'Edge', dataIndex: 'instance', key: 'instance', ellipsis: true, render: (v: string) => <Text style={{ fontSize: 12 }}>{v}</Text> },
                                        { title: 'Version', dataIndex: 'version', key: 'version', width: 92, render: (v: string, r) => <Tooltip title={r.revision ? `rev ${r.revision}` : ''}><Tag style={{ fontSize: 11 }}>{v}</Tag></Tooltip> },
                                        { title: 'Config age', dataIndex: 'ageSec', key: 'ageSec', width: 92, align: 'right', render: (v: number) => <Text style={{ fontSize: 12 }}>{Number.isFinite(v) ? humanizeDur(v) : '—'}</Text> },
                                        { title: 'Reload fail', dataIndex: 'streak', key: 'streak', width: 88, align: 'right', render: (v: number) => <Text style={{ fontSize: 12, color: v > 0 ? 'var(--color-error)' : undefined }}>{Math.round(v)}</Text> },
                                    ]}
                                />
                            </Card>
                        </Col>
                    )}
                </Row>
            ),
        },
        {
            key: 'health',
            label: secLabel('Health',
                <>
                    <Text type="secondary" style={{ fontSize: 12 }}>across all edges</Text>
                    {unhealthyCount > 0
                        ? <Tag color="error">{unhealthyCount} edge{unhealthyCount === 1 ? '' : 's'} need attention</Tag>
                        : edges.length > 0 && <Tag color="success">all edges healthy</Tag>}
                </>),
            children: (
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Row gutter={[16, 16]}>
                            <Col xs={12} md={6}><Stat label="Fail-open" value={fmtRate(sumLatest(d?.failOpen ?? []))} icon={<UnlockOutlined />} /></Col>
                            <Col xs={12} md={6}><Stat label="Fail-close" value={fmtRate(sumLatest(d?.failClose ?? []))} color={sumLatest(d?.failClose ?? []) > 0 ? 'var(--color-error)' : undefined} icon={<LockOutlined />} /></Col>
                            <Col xs={12} md={6}><Stat label="Timeouts" value={fmtRate(sumLatest(d?.timeouts ?? []))} color={sumLatest(d?.timeouts ?? []) > 0 ? 'var(--color-warning)' : undefined} icon={<FieldTimeOutlined />} /></Col>
                            <Col xs={12} md={6}><Stat label="Reload failures (consec.)" value={String(Math.round(maxReloadFail))} color={maxReloadFail > 0 ? 'var(--color-error)' : undefined} icon={<ReloadOutlined />} /></Col>
                        </Row>
                    </Col>
                    {showHealthChart && (
                        <Col xs={24} lg={12}>
                            <Card size="small" title="Fail-close / timeouts / ext_proc errors (all edges, per second)" style={cardStyle} loading={q.isLoading}>
                                <MetricLineChart series={healthChart} height={240} unit="/s" />
                            </Card>
                        </Col>
                    )}
                    <Col xs={24} lg={showHealthChart ? 12 : 24}>
                        <Card size="small" title="Per-edge health (current)" style={cardStyle} loading={q.isLoading}>
                            <Table
                                size="small" rowKey="instance" dataSource={edges} pagination={false} scroll={{ y: 200 }}
                                locale={{ emptyText: 'No edge metrics yet' }}
                                columns={[
                                    { title: 'Edge', dataIndex: 'instance', key: 'instance', ellipsis: true, render: (v: string) => <Text style={{ fontSize: 12 }}>{v}</Text> },
                                    { title: 'Fail-close/s', dataIndex: 'failClose', key: 'failClose', width: 95, align: 'right', sorter: (a, b) => a.failClose - b.failClose, render: (v: number) => <Text style={{ color: v > 0 ? 'var(--color-error)' : undefined }}>{v.toFixed(2)}</Text> },
                                    { title: 'Timeouts/s', dataIndex: 'timeouts', key: 'timeouts', width: 90, align: 'right', render: (v: number) => <Text style={{ color: v > 0 ? 'var(--color-warning)' : undefined }}>{v.toFixed(2)}</Text> },
                                    { title: 'ext_proc/s', dataIndex: 'extproc', key: 'extproc', width: 90, align: 'right', render: (v: number) => v.toFixed(2) },
                                    { title: 'Reload fail', dataIndex: 'reloadFail', key: 'reloadFail', width: 90, align: 'right', render: (v: number) => <Text style={{ color: v > 0 ? 'var(--color-error)' : undefined }}>{Math.round(v)}</Text> },
                                ]}
                            />
                        </Card>
                    </Col>
                </Row>
            ),
        },
    ];

    const defaultKeys = ['traffic', 'security', ...(unhealthyCount > 0 || auditDegraded ? ['health'] : [])];

    return (
        <div>
            <Space align="center" style={{ justifyContent: 'space-between', width: '100%' }}>
                <Space align="center">
                    <SafetyCertificateOutlined style={{ fontSize: 20, color: 'var(--color-primary)' }} />
                    <Title level={4} style={{ margin: 0 }}>Shield Overview</Title>
                </Space>
                <Space>
                    <Segmented value={rangeSec} onChange={(v) => setRangeSec(v as number)} options={RANGES} />
                    <Button icon={<ReloadOutlined />} loading={q.isFetching} onClick={() => q.refetch()}>Refresh</Button>
                </Space>
            </Space>
            <Text type="secondary" style={{ display: 'block', marginTop: 4 }}>
                Live rates &amp; latency from VictoriaMetrics for this project&apos;s edges. Complements the per-event Security Events feed.
            </Text>
            <Text type="secondary" style={{ display: 'block', marginTop: 2, fontSize: 12 }}>
                Charts cover the last <b>{rangeLabel}</b>. Y-axis is <b>per second</b>; each point is a <b>{winLabel} average</b> at
                {' '}<b>{stepLabel}</b> resolution (so the tiles are the latest {winLabel}-averaged value, not an instant reading).
                {' '}Times are in your local zone; hover any line for exact values; auto-refreshes every 30s.
            </Text>

            {q.isError && (
                <Alert type="warning" showIcon style={{ borderRadius: 8, marginTop: 12 }}
                    message="Could not load shield metrics"
                    description="Check that elchi-shield is pushing metrics to the OTel collector → VictoriaMetrics, and that the project's edges report a node id of the form listener::project::ip." />
            )}

            {/* Headline rate tiles — always visible summary. */}
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col xs={12} md={6}><Tooltip title={`Latest ${winLabel}-averaged request rate reaching shield on this project's edges, over the last ${rangeLabel}.`}><div><Stat label="Requests" value={fmtRate(reqNow)} color="#389e0d" icon={<ThunderboltOutlined />} spark={sparkOf(d?.req)} /></div></Tooltip></Col>
                <Col xs={12} md={6}><Tooltip title={`Requests blocked per second (${winLabel} avg) — about ${blockedPct}% of incoming traffic right now. A high share is normal under an attack/demo load, alarming on real traffic.`}><div><Stat label="Blocked" value={fmtRate(blkNow)} color="#cf1322" icon={<StopOutlined />} spark={sparkOf(d?.blk)} /></div></Tooltip></Col>
                <Col xs={12} md={6}><Tooltip title="Detect-mode findings per second: shield would have blocked but only logged (policy is in detect/shadow, not block). 0.00 means every matching policy is in block mode."><div><Stat label="Detected" value={fmtRate(latestScalar(d?.det ?? []))} color="#d46b08" icon={<EyeOutlined />} spark={sparkOf(d?.det)} /></div></Tooltip></Col>
                <Col xs={12} md={6}><Tooltip title={`95th percentile of shield's own request-processing time over the ${winLabel} window — the added latency per request, not the backend's.`}><div><Stat label="Latency p95" value={fmtMs(latestScalar(d?.p95 ?? []))} color="#1677ff" icon={<ClockCircleOutlined />} spark={(d?.p95?.[0]?.values ?? []).map((v) => Number(v[1]) || 0)} /></div></Tooltip></Col>
            </Row>

            <Collapse ghost defaultActiveKey={defaultKeys} items={items} expandIconPosition="end" style={{ marginTop: 8 }} />
        </div>
    );
};

export default ShieldOverview;
