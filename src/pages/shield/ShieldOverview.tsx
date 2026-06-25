/**
 * Shield Overview — live elchi-shield operational metrics (from VictoriaMetrics
 * via /api/v1/query_range), project-scoped on the `listener` node-id label.
 * Complements the Security Events feed (per-event forensics) with rates/latency.
 */

import React, { useMemo, useState } from 'react';
import { Alert, Button, Card, Col, Divider, Row, Segmented, Space, Table, Tag, Tooltip, Typography } from 'antd';
import { ReloadOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { isShieldAdmin } from './utils';
import { rangeParams, queryRange, toLineSeries, latestScalar, sumLatest, sumByTime, projectSelector, VMSeries } from './shieldMetrics';
import MetricLineChart, { MetricLineSeries } from '@/pages/api-discovery/components/MetricLineChart';

const { Text, Title } = Typography;

const RANGES = [
    { label: '1h', value: 3600 },
    { label: '6h', value: 21600 },
    { label: '24h', value: 86400 },
    { label: '7d', value: 604800 },
];

const Stat: React.FC<{ label: string; value: string; color?: string }> = ({ label, value, color }) => (
    <div style={{ padding: '10px 14px', background: 'var(--bg-hover)', borderRadius: 10, border: '1px solid var(--border-default)' }}>
        <Text style={{ fontSize: 10.5, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--text-tertiary)', display: 'block' }}>{label}</Text>
        <Text style={{ fontSize: 20, fontWeight: 700, color: color || 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{value}</Text>
    </div>
);

const ShieldOverview: React.FC<{ active?: boolean }> = ({ active = true }) => {
    const { project } = useProjectVariable();
    const admin = isShieldAdmin();
    const [rangeSec, setRangeSec] = useState(3600);

    const q = useQuery({
        queryKey: ['shield-metrics', project, rangeSec],
        queryFn: async () => {
            const { start, end, step, rateWindow } = rangeParams(rangeSec);
            const sel = projectSelector(project);
            const selBlock = `{listener=~".*::${project}::.*",action="block"}`;
            const rate = (m: string, s = sel) => queryRange(`sum(rate(elchi_shield_${m}${s}[${rateWindow}s]))`, start, end, step);
            // Health metrics carry no listener label (not project-scoped) but DO carry
            // `instance` (the edge) — query by instance so we get both the global sum
            // (client-side) AND the per-edge breakdown from one query each.
            const grate = (m: string) => queryRange(`sum by (instance)(rate(elchi_shield_${m}[${rateWindow}s]))`, start, end, step);
            const quantile = (qv: number) => queryRange(`histogram_quantile(${qv}, sum by (le)(rate(elchi_shield_processing_latency_seconds_bucket${sel}[${rateWindow}s])))`, start, end, step);
            const [req, blk, det, findings, p50, p95, p99, byEdge, failOpen, failClose, timeouts, extproc, reloadConsec] = await Promise.all([
                rate('requests_total'),
                rate('requests_blocked_total'),
                rate('detections_total'),
                queryRange(`sum by (engine)(rate(elchi_shield_findings_total${selBlock}[${rateWindow}s]))`, start, end, step),
                quantile(0.5), quantile(0.95), quantile(0.99),
                queryRange(`sum by (listener)(rate(elchi_shield_requests_total${sel}[${rateWindow}s]))`, start, end, step),
                grate('fail_open_total'), grate('fail_close_total'), grate('timeouts_total'), grate('extproc_errors_total'),
                queryRange(`max by (instance)(elchi_shield_config_reload_failures_consecutive)`, start, end, step),
            ]);
            return { req, blk, det, findings, p50, p95, p99, byEdge, failOpen, failClose, timeouts, extproc, reloadConsec };
        },
        enabled: admin && !!project && active,
        refetchInterval: active ? 30000 : false,
        refetchOnWindowFocus: false,
        retry: false,
    });

    const d = q.data;

    const throughput: MetricLineSeries[] = useMemo(() => [
        ...toLineSeries(d?.req ?? [], () => 'Requests/s', { color: '#389e0d' }),
        ...toLineSeries(d?.blk ?? [], () => 'Blocked/s', { color: '#cf1322' }),
        ...toLineSeries(d?.det ?? [], () => 'Detections/s', { color: '#d46b08' }),
    ], [d]);

    const byEngine: MetricLineSeries[] = useMemo(
        () => toLineSeries(d?.findings ?? [], (m) => m.engine || 'unknown', { stack: 'engines', area: true }),
        [d]);

    const latency: MetricLineSeries[] = useMemo(() => [
        ...toLineSeries(d?.p50 ?? [], () => 'p50', { color: '#1677ff' }),
        ...toLineSeries(d?.p95 ?? [], () => 'p95', { color: '#d46b08' }),
        ...toLineSeries(d?.p99 ?? [], () => 'p99', { color: '#cf1322' }),
    ], [d]);

    // Per-edge requests (project-scoped, one series per listener node id).
    const byEdge: MetricLineSeries[] = useMemo(
        () => toLineSeries(d?.byEdge ?? [], (m) => {
            const p = (m.listener || 'edge').split('::');
            return p.length >= 3 ? `${p[0]} (${p[2]})` : (m.listener || 'edge');
        }),
        [d]);

    // Health rates over time (GLOBAL — summed across edges, not project-scoped).
    const healthChart: MetricLineSeries[] = useMemo(() => [
        { name: 'fail-close/s', data: sumByTime(d?.failClose ?? []), color: '#cf1322' },
        { name: 'timeouts/s', data: sumByTime(d?.timeouts ?? []), color: '#d46b08' },
        { name: 'ext_proc errors/s', data: sumByTime(d?.extproc ?? []), color: '#7c3aed' },
        { name: 'fail-open/s', data: sumByTime(d?.failOpen ?? []), color: '#8c8c8c' },
    ], [d]);

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

    return (
        <Row gutter={[16, 16]}>
            <Col span={24}>
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
            </Col>

            {q.isError && (
                <Col span={24}><Alert type="warning" showIcon style={{ borderRadius: 8 }}
                    message="Could not load shield metrics"
                    description="Check that elchi-shield is pushing metrics to the OTel collector → VictoriaMetrics, and that the project's edges report a node id of the form listener::project::ip." /></Col>
            )}

            {/* Headline rate tiles (current values) */}
            <Col span={24}>
                <Row gutter={[16, 16]}>
                    <Col xs={12} md={6}><Stat label="Requests" value={fmtRate(latestScalar(d?.req ?? []))} color="var(--color-success)" /></Col>
                    <Col xs={12} md={6}><Stat label="Blocked" value={fmtRate(latestScalar(d?.blk ?? []))} color="var(--color-error)" /></Col>
                    <Col xs={12} md={6}><Stat label="Detected" value={fmtRate(latestScalar(d?.det ?? []))} color="var(--color-warning)" /></Col>
                    <Col xs={12} md={6}><Stat label="Latency p95" value={fmtMs(latestScalar(d?.p95 ?? []))} /></Col>
                </Row>
            </Col>

            <Col xs={24} lg={12}>
                <Card size="small" title="Throughput (req/blocked/detected per second)" style={{ borderRadius: 12 }} loading={q.isLoading}>
                    <MetricLineChart series={throughput} height={240} unit="/s" />
                </Card>
            </Col>
            <Col xs={24} lg={12}>
                <Card size="small" title="Blocked findings by engine" style={{ borderRadius: 12 }} loading={q.isLoading}>
                    <MetricLineChart series={byEngine} height={240} unit="/s" stackAll="engines" />
                </Card>
            </Col>
            <Col xs={24} lg={12}>
                <Card size="small" title="Request processing latency (p50 / p95 / p99)" style={{ borderRadius: 12 }} loading={q.isLoading}>
                    <MetricLineChart series={latency} height={240} yFormatter={(v) => `${(v * 1000).toFixed(0)} ms`} />
                </Card>
            </Col>
            <Col xs={24} lg={12}>
                <Card size="small" title="Requests by edge (this project)" style={{ borderRadius: 12 }} loading={q.isLoading}>
                    <MetricLineChart series={byEdge} height={240} unit="/s" />
                </Card>
            </Col>

            {/* Health — GLOBAL across all edges (these series carry no listener label). */}
            <Col span={24}>
                <Divider orientation="left" style={{ margin: '4px 0' }}>
                    <Space size={6}>
                        <Text style={{ fontSize: 13, fontWeight: 600 }}>Health</Text>
                        <Tooltip title="fail-open/close, timeouts and ext_proc errors have no per-project label, so these are platform-wide across ALL edges, not scoped to this project.">
                            <Text type="secondary" style={{ fontSize: 12 }}>across all edges</Text>
                        </Tooltip>
                        {unhealthyCount > 0
                            ? <Tag color="error">{unhealthyCount} edge{unhealthyCount === 1 ? '' : 's'} need attention</Tag>
                            : edges.length > 0 && <Tag color="success">all edges healthy</Tag>}
                    </Space>
                </Divider>
            </Col>
            <Col span={24}>
                <Row gutter={[16, 16]}>
                    <Col xs={12} md={6}><Stat label="Fail-open" value={fmtRate(sumLatest(d?.failOpen ?? []))} /></Col>
                    <Col xs={12} md={6}><Stat label="Fail-close" value={fmtRate(sumLatest(d?.failClose ?? []))} color={sumLatest(d?.failClose ?? []) > 0 ? 'var(--color-error)' : undefined} /></Col>
                    <Col xs={12} md={6}><Stat label="Timeouts" value={fmtRate(sumLatest(d?.timeouts ?? []))} color={sumLatest(d?.timeouts ?? []) > 0 ? 'var(--color-warning)' : undefined} /></Col>
                    <Col xs={12} md={6}><Stat label="Reload failures (consec.)" value={String(Math.round(maxReloadFail))} color={maxReloadFail > 0 ? 'var(--color-error)' : undefined} /></Col>
                </Row>
            </Col>
            <Col xs={24} lg={12}>
                <Card size="small" title="Fail-close / timeouts / ext_proc errors (all edges, per second)" style={{ borderRadius: 12 }} loading={q.isLoading}>
                    <MetricLineChart series={healthChart} height={240} unit="/s" />
                </Card>
            </Col>
            <Col xs={24} lg={12}>
                <Card size="small" title="Per-edge health (current)" style={{ borderRadius: 12 }} loading={q.isLoading}>
                    <Table
                        size="small"
                        rowKey="instance"
                        dataSource={edges}
                        pagination={false}
                        scroll={{ y: 200 }}
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
    );
};

export default ShieldOverview;
