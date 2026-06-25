/**
 * Shield Security Events — a project-scoped, filterable feed of what elchi-shield
 * is blocking/detecting across the project's edges, plus summary cards and a
 * per-action time series. Data comes from the central ClickHouse via
 * /api/v3/shield/events(/summary). Admin/Owner-gated (matches the backend).
 */

import React, { useMemo, useState } from 'react';
import {
    Alert, Badge, Button, Card, Col, DatePicker, Input, Row, Select, Space, Switch, Table, Tag, Tooltip, Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ReloadOutlined, ClearOutlined, SafetyOutlined, DownloadOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import dayjs, { Dayjs } from 'dayjs';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { shieldApi } from './shieldApi';
import { isShieldAdmin } from './utils';
import { ShieldSecurityEvent, ShieldEventsParams } from './types';
import MetricLineChart, { MetricLineSeries } from '@/pages/api-discovery/components/MetricLineChart';

const { Text, Title } = Typography;
const { RangePicker } = DatePicker;

const actionColor = (a: string): string => {
    switch (a) {
        case 'block': return 'red';
        case 'detect': return 'orange';
        case 'shadow': return 'geekblue';
        case 'allow': case 'continue': return 'green';
        default: return 'default';
    }
};

const severityColor = (s: string): string => {
    switch (s) {
        case 'critical': return 'red';
        case 'high': return 'volcano';
        case 'medium': return 'gold';
        case 'low': return 'cyan';
        case 'info': return 'blue';
        default: return 'default';
    }
};

// Stable chart colour per action (echarts series color).
const ACTION_HEX: Record<string, string> = {
    block: '#cf1322', detect: '#d46b08', shadow: '#1d39c4', allow: '#389e0d',
};

// Fallback engine list when the facets endpoint has no data yet (empty window).
const DEFAULT_ENGINES = ['coraza', 'jwt', 'jwks', 'bot', 'ratelimit', 'ipreputation',
    'apikey', 'hmacsign', 'httpsig', 'xfcc', 'graphql', 'openapi', 'dlp', 'anomaly',
    'body_size', 'body_decode'];

interface Filters {
    range: [Dayjs, Dayjs];
    engine?: string;
    action?: string;
    severity?: string;
    node?: string; // node_id (edge) filter
    findingsOnly: boolean;
    search: string; // matched against host/path/request_id client-side
}

// CSV-escape a value for export. Besides quoting, neutralise spreadsheet formula
// injection: security-event fields (host/path/reason) are attacker-influenced, and
// a cell starting with = + - @ (or tab/CR) is executed as a formula by Excel/Sheets.
// Prefixing a single quote defuses it while keeping the value readable.
const csvCell = (v: unknown): string => {
    const s = String(v ?? '');
    const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
    return `"${safe.replace(/"/g, '""')}"`;
};

const defaultFilters = (): Filters => ({
    range: [dayjs().subtract(24, 'hour'), dayjs()],
    findingsOnly: true,
    search: '',
});

const PAGE_SIZE = 50;

const ShieldEvents: React.FC<{ active?: boolean }> = ({ active = true }) => {
    const { project } = useProjectVariable();
    const admin = isShieldAdmin();

    const [draft, setDraft] = useState<Filters>(defaultFilters);
    const [filters, setFilters] = useState<Filters>(defaultFilters);
    const [page, setPage] = useState(1);
    const [autoRefresh, setAutoRefresh] = useState(false);

    // Server-side filter params shared by the feed + summary queries.
    const serverParams: ShieldEventsParams = useMemo(() => ({
        engine: filters.engine,
        action: filters.action,
        severity: filters.severity,
        node_id: filters.node,
        findings_only: filters.findingsOnly,
        from: filters.range[0].toISOString(),
        to: filters.range[1].toISOString(),
    }), [filters]);

    // Only poll while Live is on AND this tab is actually visible — antd keeps the
    // pane mounted when hidden, so this stops background ClickHouse hits.
    const refetchInterval = autoRefresh && active ? 15000 : false;

    const summaryQuery = useQuery({
        queryKey: ['shield-events-summary', project, serverParams],
        queryFn: () => shieldApi.getSecurityEventsSummary(project, serverParams),
        enabled: admin && !!project,
        refetchOnWindowFocus: false,
        retry: false,
        refetchInterval,
    });

    // Distinct filter values (engines/nodes) so the dropdowns reflect real data.
    const facetsQuery = useQuery({
        queryKey: ['shield-events-facets', project, serverParams.from, serverParams.to],
        queryFn: () => shieldApi.getSecurityEventsFacets(project, {
            from: serverParams.from, to: serverParams.to,
        }),
        enabled: admin && !!project,
        refetchOnWindowFocus: false,
        retry: false,
    });

    const feedQuery = useQuery({
        queryKey: ['shield-events', project, serverParams, page],
        queryFn: () => shieldApi.getSecurityEvents(project, {
            ...serverParams,
            limit: PAGE_SIZE,
            offset: (page - 1) * PAGE_SIZE,
            // No include_total: the summary query already computes the exact total
            // (sum of its group counts over the same filter), so paying for a
            // separate ClickHouse count() on every page would be pure waste.
        }),
        enabled: admin && !!project,
        refetchOnWindowFocus: false,
        retry: false,
        placeholderData: (prev) => prev,
        refetchInterval,
    });

    const applyFilters = () => { setFilters(draft); setPage(1); };
    const clearFilters = () => { const d = defaultFilters(); setDraft(d); setFilters(d); setPage(1); };
    const dirty = JSON.stringify(draft) !== JSON.stringify(filters);

    // Summary cards: totals per action from the (engine,action,severity) groups.
    const summary = summaryQuery.data;
    const byAction = useMemo(() => {
        const m: Record<string, number> = {};
        (summary?.groups ?? []).forEach(g => { m[g.action] = (m[g.action] ?? 0) + g.count; });
        return m;
    }, [summary]);
    const topEngines = useMemo(() => {
        const m: Record<string, number> = {};
        (summary?.groups ?? []).forEach(g => { m[g.engine] = (m[g.engine] ?? 0) + g.count; });
        return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 6);
    }, [summary]);

    // Time series → one stacked-area series per action.
    const chartSeries: MetricLineSeries[] = useMemo(() => {
        const byActionSeries: Record<string, Array<[string, number]>> = {};
        (summary?.series ?? []).forEach(b => {
            (byActionSeries[b.action] ??= []).push([b.bucket, b.count]);
        });
        return Object.entries(byActionSeries).map(([action, data]) => ({
            name: action,
            data,
            color: ACTION_HEX[action],
        }));
    }, [summary]);

    const events = feedQuery.data?.data ?? [];
    // The total comes from the summary (same filter), not a separate count().
    const serverTotal = summary?.total ?? 0;
    const searching = filters.search.trim() !== '';
    const filteredEvents = useMemo(() => {
        const q = filters.search.trim().toLowerCase();
        if (!q) return events;
        return events.filter(e =>
            e.host.toLowerCase().includes(q) ||
            e.path.toLowerCase().includes(q) ||
            e.request_id.toLowerCase().includes(q));
    }, [events, filters.search]);
    // When the client-side quick-search is active it only filters the loaded
    // page, so reflect the filtered count (and collapse paging) instead of
    // advertising the full server total against a handful of visible rows.
    const displayTotal = searching ? filteredEvents.length : serverTotal;

    // Filter dropdown options from real data (fallback to the built-in engine list).
    const facets = facetsQuery.data;
    const engineOptions = (facets?.engines?.length ? [...facets.engines].sort() : DEFAULT_ENGINES)
        .map(e => ({ label: e, value: e }));
    const nodeOptions = [...(facets?.nodes ?? [])].sort().map(n => ({ label: n, value: n }));

    // Export the currently-shown rows to CSV (client-side; redacted fields only).
    const exportCsv = () => {
        const header = ['ts', 'action', 'severity', 'engine', 'rule_id', 'method', 'host',
            'path', 'status_code', 'node_id', 'project_id', 'request_id', 'reason'];
        const rows = filteredEvents.map(e => [
            e.ts, e.action, e.severity, e.engine, e.rule_id, e.method, e.host, e.path,
            e.status_code, e.node_id, e.project_id, e.request_id, e.reason,
        ].map(csvCell).join(','));
        const blob = new Blob([[header.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `shield-events-${dayjs().format('YYYYMMDD-HHmmss')}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Expanded-row detail: the full event (the columns the table omits).
    const expandedRow = (r: ShieldSecurityEvent) => (
        <Row gutter={[12, 6]} style={{ fontSize: 12, padding: '4px 8px' }}>
            {[
                ['Request ID', r.request_id], ['Policy', r.policy_id], ['Rule', r.rule_id],
                ['Node ID', r.node_id], ['Listener', r.listener], ['Instance', r.instance],
                ['Phase', r.phase], ['Direction', r.direction], ['Config version', r.config_version],
            ].map(([k, v]) => (
                <Col xs={12} md={8} key={k}>
                    <Text type="secondary">{k}: </Text>
                    <Text style={{ fontFamily: 'monospace' }} copyable={!!v}>{v || '—'}</Text>
                </Col>
            ))}
            {r.reason && <Col span={24}><Text type="secondary">Reason: </Text><Text>{r.reason}</Text></Col>}
        </Row>
    );

    if (!admin) {
        return (
            <Alert
                type="info"
                showIcon
                message="Admin access required"
                description="Shield security events are restricted to Admin and Owner roles."
                style={{ borderRadius: 8 }}
            />
        );
    }

    const columns: ColumnsType<ShieldSecurityEvent> = [
        {
            title: 'Time', dataIndex: 'ts', key: 'ts', width: 170,
            render: (ts: string) => <Text style={{ fontSize: 12 }}>{dayjs(ts).format('YYYY-MM-DD HH:mm:ss')}</Text>,
        },
        {
            title: 'Action', dataIndex: 'action', key: 'action', width: 90,
            render: (a: string) => <Tag className="auto-width-tag" color={actionColor(a)}>{a}</Tag>,
        },
        {
            title: 'Severity', dataIndex: 'severity', key: 'severity', width: 90,
            render: (s: string) => <Tag className="auto-width-tag" color={severityColor(s)}>{s}</Tag>,
        },
        {
            title: 'Engine', dataIndex: 'engine', key: 'engine', width: 120,
            render: (e: string) => <Tag className="auto-width-tag">{e || '-'}</Tag>,
        },
        {
            title: 'Request', key: 'request',
            render: (_: unknown, r: ShieldSecurityEvent) => (
                <Space size={4} wrap>
                    <Tag className="auto-width-tag" color="blue">{r.method}</Tag>
                    <Text style={{ fontFamily: 'monospace', fontSize: 12 }}>{r.host}{r.path}</Text>
                </Space>
            ),
        },
        {
            title: 'Status', dataIndex: 'status_code', key: 'status_code', width: 80,
            render: (s: number) => s ? <Tag className="auto-width-tag">{s}</Tag> : <Text type="secondary">—</Text>,
        },
        {
            title: 'Reason', dataIndex: 'reason', key: 'reason', ellipsis: true,
            render: (reason: string, r: ShieldSecurityEvent) => (
                <Tooltip title={`${reason}${r.rule_id ? ` (rule ${r.rule_id})` : ''}`}>
                    <Text type="secondary" style={{ fontSize: 12 }}>{reason || '—'}</Text>
                </Tooltip>
            ),
        },
        {
            title: 'Edge', dataIndex: 'instance', key: 'instance', width: 150,
            render: (inst: string, r: ShieldSecurityEvent) => (
                <Tooltip title={r.node_id || inst}>
                    <Text style={{ fontSize: 12 }}>{inst || r.listener || '—'}</Text>
                </Tooltip>
            ),
        },
    ];

    return (
        <Row gutter={[16, 16]}>
            <Col span={24}>
                <Space align="center">
                    <SafetyOutlined style={{ fontSize: 20, color: 'var(--color-primary)' }} />
                    <Title level={4} style={{ margin: 0 }}>Shield Security Events</Title>
                </Space>
                <Text type="secondary" style={{ display: 'block', marginTop: 4 }}>
                    What elchi-shield is blocking and detecting across this project&apos;s edges.
                </Text>
            </Col>

            {/* Filters */}
            <Col span={24}>
                <Card size="small" style={{ borderRadius: 12 }}>
                    <Row gutter={[12, 12]} align="middle">
                        <Col xs={24} md={8}>
                            <RangePicker
                                showTime
                                style={{ width: '100%' }}
                                value={draft.range}
                                onChange={(v) => v && v[0] && v[1] && setDraft(d => ({ ...d, range: [v[0]!, v[1]!] }))}
                                allowClear={false}
                            />
                        </Col>
                        <Col xs={12} md={4}>
                            <Select
                                placeholder="Engine" allowClear showSearch style={{ width: '100%' }}
                                value={draft.engine}
                                onChange={(v) => setDraft(d => ({ ...d, engine: v }))}
                                options={engineOptions}
                            />
                        </Col>
                        <Col xs={12} md={4}>
                            <Select
                                placeholder="Action" allowClear style={{ width: '100%' }}
                                value={draft.action}
                                onChange={(v) => setDraft(d => ({ ...d, action: v }))}
                                options={['block', 'detect', 'shadow', 'allow'].map(a => ({ label: a, value: a }))}
                            />
                        </Col>
                        <Col xs={12} md={4}>
                            <Select
                                placeholder="Severity" allowClear style={{ width: '100%' }}
                                value={draft.severity}
                                onChange={(v) => setDraft(d => ({ ...d, severity: v }))}
                                options={['critical', 'high', 'medium', 'low', 'info'].map(s => ({ label: s, value: s }))}
                            />
                        </Col>
                        <Col xs={12} md={4}>
                            <Space>
                                <Switch checked={draft.findingsOnly} onChange={(v) => setDraft(d => ({ ...d, findingsOnly: v }))} />
                                <Text style={{ fontSize: 12 }}>Findings only</Text>
                            </Space>
                        </Col>
                        <Col xs={24} md={8}>
                            <Input
                                placeholder="Filter host / path / request id (current page)"
                                value={draft.search}
                                onChange={(e) => setDraft(d => ({ ...d, search: e.target.value }))}
                                allowClear
                            />
                        </Col>
                        <Col xs={12} md={4}>
                            <Select
                                placeholder="Edge (node)" allowClear showSearch style={{ width: '100%' }}
                                value={draft.node}
                                onChange={(v) => setDraft(d => ({ ...d, node: v }))}
                                options={nodeOptions}
                            />
                        </Col>
                        <Col xs={24} md={12} style={{ textAlign: 'right' }}>
                            <Space wrap>
                                <Tooltip title="Auto-refresh every 15s">
                                    <Space size={4}>
                                        <Switch size="small" checked={autoRefresh} onChange={setAutoRefresh} />
                                        <Text style={{ fontSize: 12 }}>Live</Text>
                                    </Space>
                                </Tooltip>
                                <Tooltip title="Export the current page (≤50 rows) to CSV">
                                    <Button icon={<DownloadOutlined />} disabled={filteredEvents.length === 0} onClick={exportCsv}>CSV</Button>
                                </Tooltip>
                                <Button icon={<ReloadOutlined />} loading={feedQuery.isFetching || summaryQuery.isFetching}
                                    onClick={() => { summaryQuery.refetch(); feedQuery.refetch(); facetsQuery.refetch(); }}>
                                    Refresh
                                </Button>
                                <Button icon={<ClearOutlined />} onClick={clearFilters}>Clear</Button>
                                <Button type="primary" disabled={!dirty} onClick={applyFilters}>Apply</Button>
                            </Space>
                        </Col>
                    </Row>
                </Card>
            </Col>

            {/* Summary cards */}
            <Col span={24}>
                <Row gutter={[16, 16]}>
                    {[
                        { label: 'Total', value: summary?.total ?? 0, color: undefined },
                        { label: 'Blocked', value: byAction['block'] ?? 0, color: ACTION_HEX.block },
                        { label: 'Detected', value: byAction['detect'] ?? 0, color: ACTION_HEX.detect },
                        { label: 'Shadow', value: byAction['shadow'] ?? 0, color: ACTION_HEX.shadow },
                    ].map(c => (
                        <Col xs={12} md={6} key={c.label}>
                            <Card size="small" style={{ borderRadius: 12 }} loading={summaryQuery.isFetching}>
                                <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>{c.label}</Text>
                                <div style={{ fontSize: 26, fontWeight: 600, color: c.color }}>{c.value.toLocaleString()}</div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Col>

            {/* Activity chart + top engines */}
            <Col xs={24} lg={16}>
                <Card size="small" title="Activity over time" style={{ borderRadius: 12 }} loading={summaryQuery.isFetching}>
                    {chartSeries.length > 0
                        ? <MetricLineChart series={chartSeries} height={240} stackAll="actions" />
                        : <Text type="secondary">No events in the selected window.</Text>}
                </Card>
            </Col>
            <Col xs={24} lg={8}>
                <Card size="small" title="Top engines" style={{ borderRadius: 12 }} loading={summaryQuery.isFetching}>
                    {topEngines.length === 0 && <Text type="secondary">No findings.</Text>}
                    {topEngines.map(([engine, count]) => (
                        <div key={engine} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <Tag className="auto-width-tag">{engine || 'unknown'}</Tag>
                            <Text strong>{count.toLocaleString()}</Text>
                        </div>
                    ))}
                </Card>
            </Col>

            {/* Feed */}
            <Col span={24}>
                <Card
                    size="small"
                    style={{ borderRadius: 12 }}
                    title={<Space><span>Events</span><Badge count={displayTotal} overflowCount={9999999} style={{ backgroundColor: 'var(--color-primary)' }} /></Space>}
                >
                    {feedQuery.isError && (
                        <Alert type="warning" showIcon style={{ marginBottom: 12, borderRadius: 8 }}
                            message="Could not load shield events"
                            description={(feedQuery.error as Error)?.message} />
                    )}
                    <Table<ShieldSecurityEvent>
                        size="small"
                        rowKey={(r, i) => `${r.request_id}-${r.ts}-${r.engine}-${r.rule_id}-${i ?? 0}`}
                        dataSource={filteredEvents}
                        columns={columns}
                        loading={feedQuery.isFetching}
                        expandable={{ expandedRowRender: expandedRow }}
                        scroll={{ x: 1100 }}
                        pagination={{
                            current: page,
                            pageSize: PAGE_SIZE,
                            total: displayTotal,
                            showSizeChanger: false,
                            // Client-side search filters only the loaded page, so
                            // disable server paging while a search is active.
                            onChange: searching ? undefined : setPage,
                            showTotal: (t) => searching ? `${t.toLocaleString()} on this page` : `${t.toLocaleString()} events`,
                        }}
                    />
                </Card>
            </Col>
        </Row>
    );
};

export default ShieldEvents;
