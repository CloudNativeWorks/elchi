/**
 * Shield Security Events — a project-scoped, filterable feed of what elchi-shield
 * is blocking/detecting across the project's edges, plus summary cards and a
 * per-action time series. Data comes from the central ClickHouse via
 * /api/v3/shield/events(/summary). Admin/Owner-gated (matches the backend).
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    Alert, Badge, Button, Card, Col, DatePicker, Dropdown, Input, Row, Select, Space, Switch, Table, Tag, Tooltip, Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd';
import { ReloadOutlined, ClearOutlined, SafetyOutlined, DownloadOutlined, FilterOutlined, SearchOutlined, CloseOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { extractErrorMessage } from '@/common/notificationHandler';
import { shieldApi } from './shieldApi';
import { isShieldAdmin } from './utils';
import { ShieldSecurityEvent, ShieldEventsParams } from './types';
import MetricLineChart, { MetricLineSeries } from '@/pages/api-discovery/components/MetricLineChart';

dayjs.extend(relativeTime);

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
    // When set, `range` was derived from a relative quick-range (last N). Refresh
    // and Live recompute it from "now" so the window slides; a pinned custom
    // range leaves this undefined and the window stays fixed.
    relativeMs?: number;
    engine?: string;
    action?: string;
    severity?: string;
    node?: string; // node_id (edge) filter
    findingsOnly: boolean;
    // Free-text search, matched server-side (substring, case-insensitive) against
    // host/path/request_id — scopes the feed AND the summary/chart/top-engines.
    search: string;
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

// Relative quick-ranges. Picking one makes the window "live": Refresh and the
// Live auto-refresh recompute `now` so the window slides forward, instead of
// staying pinned to the moment the page first loaded.
const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const QUICK_RANGES: { label: string; ms: number }[] = [
    { label: 'Last 15 minutes', ms: 15 * MINUTE },
    { label: 'Last 1 hour', ms: HOUR },
    { label: 'Last 6 hours', ms: 6 * HOUR },
    { label: 'Last 12 hours', ms: 12 * HOUR },
    { label: 'Last 24 hours', ms: DAY },
    { label: 'Last 7 days', ms: 7 * DAY },
    { label: 'Last 30 days', ms: 30 * DAY },
];
const DEFAULT_RANGE_MS = HOUR;

const relativeWindow = (ms: number): [Dayjs, Dayjs] => {
    const to = dayjs();
    return [to.subtract(ms, 'millisecond'), to];
};

const defaultFilters = (): Filters => ({
    range: relativeWindow(DEFAULT_RANGE_MS),
    relativeMs: DEFAULT_RANGE_MS,
    findingsOnly: true,
    search: '',
});

// action=allow + findings-only is a contradiction (findings-only drops the
// allow stream → always zero results, with no hint why). Whenever the two
// meet, the action wins and findings-only turns off.
const normalizeFilters = (f: Filters): Filters =>
    f.action === 'allow' && f.findingsOnly ? { ...f, findingsOnly: false } : f;

// --- URL persistence --------------------------------------------------------
// The server-side filters serialize into the query string so a filtered view
// survives a reload and can be shared as a link. A relative window persists as
// `win` (it re-slides from "now" on load); a pinned custom range persists as
// absolute `from`/`to` (epoch ms). Defaults are omitted to keep URLs clean.
const EVENT_PARAM_KEYS = ['eng', 'act', 'sev', 'node', 'q', 'fo', 'win', 'from', 'to'];

const filtersToParams = (f: Filters): Record<string, string> => {
    const p: Record<string, string> = {};
    if (f.engine) p.eng = f.engine;
    if (f.action) p.act = f.action;
    if (f.severity) p.sev = f.severity;
    if (f.node) p.node = f.node;
    if (f.search.trim()) p.q = f.search.trim();
    if (!f.findingsOnly) p.fo = '0';
    if (f.relativeMs) {
        if (f.relativeMs !== DEFAULT_RANGE_MS) p.win = String(f.relativeMs);
    } else {
        p.from = String(f.range[0].valueOf());
        p.to = String(f.range[1].valueOf());
    }
    return p;
};

const filtersFromParams = (sp: URLSearchParams): Filters => {
    const f = defaultFilters();
    f.engine = sp.get('eng') || undefined;
    f.action = sp.get('act') || undefined;
    f.severity = sp.get('sev') || undefined;
    f.node = sp.get('node') || undefined;
    f.search = sp.get('q') || '';
    if (sp.get('fo') === '0') f.findingsOnly = false;
    const win = Number(sp.get('win'));
    const from = Number(sp.get('from'));
    const to = Number(sp.get('to'));
    if (win > 0) {
        f.relativeMs = win;
        f.range = relativeWindow(win);
    } else if (from > 0 && to > from) {
        f.relativeMs = undefined;
        f.range = [dayjs(from), dayjs(to)];
    }
    return normalizeFilters(f);
};

const PAGE_SIZE = 50;

const ShieldEvents: React.FC<{ active?: boolean }> = ({ active = true }) => {
    const { project } = useProjectVariable();
    const admin = isShieldAdmin();

    // Initial filters come from the URL (deep-link / reload restores the view).
    const [initialFilters] = useState<Filters>(() => filtersFromParams(new URLSearchParams(window.location.search)));
    const [draft, setDraft] = useState<Filters>(initialFilters);
    const [filters, setFilters] = useState<Filters>(initialFilters);
    const [page, setPage] = useState(1);
    const [autoRefresh, setAutoRefresh] = useState(false);

    // Mirror the applied filters into the URL (replace, not push — filter tweaks
    // shouldn't pollute browser history). The ref guard skips redundant writes:
    // a Live tick slides `range` but the serialized params (relative `win`) don't
    // change, so it must not trigger a navigation every 15s.
    const [, setSearchParams] = useSearchParams();
    const lastUrlRef = useRef('');
    useEffect(() => {
        const desired = filtersToParams(filters);
        const key = JSON.stringify(desired);
        if (lastUrlRef.current === key) return;
        lastUrlRef.current = key;
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            EVENT_PARAM_KEYS.forEach(k => next.delete(k));
            Object.entries(desired).forEach(([k, v]) => next.set(k, v));
            return next;
        }, { replace: true });
    }, [filters, setSearchParams]);

    // Server-side filter params shared by the feed + summary queries.
    const serverParams: ShieldEventsParams = useMemo(() => ({
        engine: filters.engine,
        action: filters.action,
        severity: filters.severity,
        node_id: filters.node,
        search: filters.search.trim() || undefined,
        findings_only: filters.findingsOnly,
        from: filters.range[0].toISOString(),
        to: filters.range[1].toISOString(),
    }), [filters]);

    // Live mode slides the window every 15s → a fresh queryKey per tick. Keep the
    // previous data on screen while the new tick loads (no skeleton flash) and
    // garbage-collect the abandoned per-tick cache entries quickly.
    const eventsGcTime = 120_000;

    const summaryQuery = useQuery({
        queryKey: ['shield-events-summary', project, serverParams],
        queryFn: () => shieldApi.getSecurityEventsSummary(project, serverParams),
        enabled: admin && !!project,
        refetchOnWindowFocus: false,
        retry: false,
        placeholderData: (prev) => prev,
        gcTime: eventsGcTime,
    });

    // Distinct filter values (engines/nodes) so the dropdowns reflect real data.
    // The window is rounded to the minute: dropdown options don't need 15s
    // freshness, and without rounding every Live tick would re-run the facet
    // scan (groupUniqArray over the window) for a marginally different window.
    const facetsWindow = useMemo(() => ({
        from: filters.range[0].startOf('minute').toISOString(),
        to: filters.range[1].add(59, 'second').startOf('minute').toISOString(),
    }), [filters.range]);
    const facetsQuery = useQuery({
        queryKey: ['shield-events-facets', project, facetsWindow.from, facetsWindow.to],
        queryFn: () => shieldApi.getSecurityEventsFacets(project, facetsWindow),
        enabled: admin && !!project,
        refetchOnWindowFocus: false,
        retry: false,
        placeholderData: (prev) => prev,
        gcTime: eventsGcTime,
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
        gcTime: eventsGcTime,
    });

    // Pull the time window forward to "now". For a relative quick-range this
    // slides the [from,to] window (so Refresh/Live behave like a hard reload);
    // for a pinned custom range it just refetches the same window.
    const refreshNow = useCallback(() => {
        if (filters.relativeMs) {
            const slid = relativeWindow(filters.relativeMs);
            setFilters(f => ({ ...f, range: slid }));
            // Keep the picker in sync (shows the advanced time, Apply stays
            // disabled) — but only when the draft is still on the same relative
            // range, i.e. the user isn't mid-editing a custom window.
            setDraft(d => (d.relativeMs === filters.relativeMs ? { ...d, range: slid } : d));
        } else {
            summaryQuery.refetch();
            feedQuery.refetch();
            facetsQuery.refetch();
        }
    }, [filters.relativeMs, summaryQuery, feedQuery, facetsQuery]);

    // Live mode: tick every 15s while the tab is visible. We drive it ourselves
    // (instead of react-query's refetchInterval) so a relative window actually
    // advances each tick rather than re-querying the original frozen window.
    const refreshRef = useRef(refreshNow);
    refreshRef.current = refreshNow;
    useEffect(() => {
        if (!(autoRefresh && active)) return;
        const id = setInterval(() => refreshRef.current(), 15000);
        return () => clearInterval(id);
    }, [autoRefresh, active]);

    // Resolve a relative draft to a concrete window at apply-time so the query
    // starts from the current moment.
    const resolveDraft = (f: Filters): Filters =>
        f.relativeMs ? { ...f, range: relativeWindow(f.relativeMs) } : f;

    const applyFilters = () => { const r = normalizeFilters(resolveDraft(draft)); setDraft(r); setFilters(r); setPage(1); };
    const clearFilters = () => { const d = defaultFilters(); setDraft(d); setFilters(d); setPage(1); };
    // One-click filter changes (chart brush, context menus, card/engine clicks):
    // apply on top of the *active* filters immediately, keeping the draft in sync
    // so the picker/dropdowns reflect what is actually being queried.
    const applyImmediate = useCallback((patch: Partial<Filters>) => {
        const next = normalizeFilters({ ...filters, ...patch });
        setDraft(next);
        setFilters(next);
        setPage(1);
    }, [filters]);
    // Chart drag-select → pin the brushed window as a custom range and query it.
    const onChartRangeSelect = useCallback((from: number, to: number) => {
        applyImmediate({ range: [dayjs(from), dayjs(to)], relativeMs: undefined });
    }, [applyImmediate]);
    const applyQuickRange = (val: number | 'custom') => {
        if (val === 'custom') { setDraft(d => ({ ...d, relativeMs: undefined })); return; }
        setDraft(d => ({ ...d, relativeMs: val, range: relativeWindow(val) }));
    };
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
        return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 10);
    }, [summary]);

    // Time series → one area line per action, each at its ACTUAL value (not
    // stacked: stacking drew the smaller series on top of the bigger one at a
    // misleading cumulative height, and the on-top series varied with the
    // arbitrary bucket order the query returned). Fixed order keeps the legend
    // and draw order stable across refreshes.
    const chartSeries: MetricLineSeries[] = useMemo(() => {
        const byActionSeries: Record<string, Array<[string, number]>> = {};
        (summary?.series ?? []).forEach(b => {
            (byActionSeries[b.action] ??= []).push([b.bucket, b.count]);
        });
        const order = ['block', 'detect', 'shadow', 'allow'];
        return Object.entries(byActionSeries)
            .sort(([a], [b]) => {
                const ia = order.indexOf(a), ib = order.indexOf(b);
                return (ia === -1 ? order.length : ia) - (ib === -1 ? order.length : ib);
            })
            .map(([action, data]) => ({
                name: action,
                data,
                color: ACTION_HEX[action],
                area: true,
            }));
    }, [summary]);

    const events = feedQuery.data?.data ?? [];
    // The total comes from the summary (same filter — including search), not a
    // separate count().
    const serverTotal = summary?.total ?? 0;

    // Filter dropdown options from real data (fallback to the built-in engine list).
    const facets = facetsQuery.data;
    const engineOptions = (facets?.engines?.length ? [...facets.engines].sort() : DEFAULT_ENGINES)
        .map(e => ({ label: e, value: e }));
    const nodeOptions = [...(facets?.nodes ?? [])].sort().map(n => ({ label: n, value: n }));

    // Export the FILTERED result set to CSV (redacted fields only). The search/
    // filters are server-side, so fetch up to the backend's 500-row cap in one
    // request instead of exporting just the visible page; if that fetch fails,
    // fall back to the rows already on screen (the CSV row count shows what you got).
    const [exporting, setExporting] = useState(false);
    const exportCsv = async () => {
        setExporting(true);
        let rowsSrc = events;
        try {
            const full = await shieldApi.getSecurityEvents(project, { ...serverParams, limit: 500, offset: 0 });
            if (full.data?.length) rowsSrc = full.data;
        } catch { /* keep the current page as fallback */ } finally {
            setExporting(false);
        }
        const header = ['ts', 'action', 'severity', 'engine', 'rule_id', 'method', 'host',
            'path', 'status_code', 'node_id', 'project_id', 'request_id', 'reason'];
        const rows = rowsSrc.map(e => [
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

    // Active server-side filters as removable chips — one glance shows what the
    // feed is scoped to, one click removes a dimension without touching the rest.
    const activeChips = useMemo(() => {
        const chips: { key: string; label: string; onClear: () => void }[] = [];
        if (filters.engine) chips.push({ key: 'engine', label: `engine = ${filters.engine}`, onClear: () => applyImmediate({ engine: undefined }) });
        if (filters.action) chips.push({ key: 'action', label: `action = ${filters.action}`, onClear: () => applyImmediate({ action: undefined }) });
        if (filters.severity) chips.push({ key: 'severity', label: `severity = ${filters.severity}`, onClear: () => applyImmediate({ severity: undefined }) });
        if (filters.node) chips.push({ key: 'node', label: `edge = ${filters.node}`, onClear: () => applyImmediate({ node: undefined }) });
        if (filters.search.trim()) chips.push({ key: 'search', label: `search: ${filters.search.trim()}`, onClear: () => applyImmediate({ search: '' }) });
        return chips;
    }, [filters, applyImmediate]);

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

    // Right-click "add filter" wrapper for filterable cells. The wrapper is a
    // plain span so table layout is unchanged; the menu applies immediately.
    const filterMenuCell = (items: MenuProps['items'], children: React.ReactNode) => (
        <Dropdown menu={{ items }} trigger={['contextMenu']}>
            <span style={{ cursor: 'context-menu' }}>{children}</span>
        </Dropdown>
    );

    const columns: ColumnsType<ShieldSecurityEvent> = [
        {
            title: 'Time', dataIndex: 'ts', key: 'ts', width: 170,
            render: (ts: string) => (
                <Tooltip title={dayjs(ts).fromNow()}>
                    <Text style={{ fontSize: 12 }}>{dayjs(ts).format('YYYY-MM-DD HH:mm:ss')}</Text>
                </Tooltip>
            ),
        },
        {
            title: 'Action', dataIndex: 'action', key: 'action', width: 90,
            render: (a: string) => filterMenuCell([{
                key: 'f', icon: <FilterOutlined />, label: <>Filter: action = <b>{a}</b></>,
                onClick: () => applyImmediate({ action: a }),
            }], <Tag className="auto-width-tag" color={actionColor(a)}>{a}</Tag>),
        },
        {
            title: 'Severity', dataIndex: 'severity', key: 'severity', width: 90,
            render: (s: string) => filterMenuCell([{
                key: 'f', icon: <FilterOutlined />, label: <>Filter: severity = <b>{s}</b></>,
                onClick: () => applyImmediate({ severity: s }),
            }], <Tag className="auto-width-tag" color={severityColor(s)}>{s}</Tag>),
        },
        {
            title: 'Engine', dataIndex: 'engine', key: 'engine', width: 120,
            render: (e: string) => e ? filterMenuCell([{
                key: 'f', icon: <FilterOutlined />, label: <>Filter: engine = <b>{e}</b></>,
                onClick: () => applyImmediate({ engine: e }),
            }], <Tag className="auto-width-tag">{e}</Tag>) : <Tag className="auto-width-tag">-</Tag>,
        },
        {
            title: 'Request', key: 'request',
            render: (_: unknown, r: ShieldSecurityEvent) => filterMenuCell([
                {
                    key: 'host', icon: <SearchOutlined />, label: <>Search host: <b>{r.host}</b></>,
                    onClick: () => applyImmediate({ search: r.host }),
                },
                {
                    key: 'path', icon: <SearchOutlined />, label: <>Search path: <b>{r.path}</b></>,
                    onClick: () => applyImmediate({ search: r.path }),
                },
            ], (
                <Space size={4} wrap>
                    <Tag className="auto-width-tag" color="blue">{r.method}</Tag>
                    <Text style={{ fontFamily: 'monospace', fontSize: 12 }}>{r.host}{r.path}</Text>
                </Space>
            )),
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
            render: (inst: string, r: ShieldSecurityEvent) => {
                const cell = (
                    <Tooltip title={r.node_id || inst}>
                        <Text style={{ fontSize: 12 }}>{inst || r.listener || '—'}</Text>
                    </Tooltip>
                );
                return r.node_id ? filterMenuCell([{
                    key: 'f', icon: <FilterOutlined />, label: <>Filter: edge = <b>{inst || r.node_id}</b></>,
                    onClick: () => applyImmediate({ node: r.node_id }),
                }], cell) : cell;
            },
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
                    <Space direction="vertical" size={12} style={{ width: '100%' }}>
                        {/* Time window (left) + actions (right) */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
                            <Space wrap size={8}>
                                <Select
                                    style={{ width: 160 }}
                                    value={draft.relativeMs ?? 'custom'}
                                    onChange={applyQuickRange}
                                    options={[
                                        ...QUICK_RANGES.map(r => ({ label: r.label, value: r.ms })),
                                        { label: 'Custom range', value: 'custom' },
                                    ]}
                                />
                                <RangePicker
                                    showTime
                                    style={{ width: 360, maxWidth: '100%' }}
                                    value={draft.range}
                                    // Manually editing the window pins it (custom): drop the
                                    // relative spec so Refresh/Live stop sliding it.
                                    onChange={(v) => v && v[0] && v[1] && setDraft(d => ({ ...d, range: [v[0]!, v[1]!], relativeMs: undefined }))}
                                    allowClear={false}
                                />
                            </Space>
                            <Space wrap size={8}>
                                <Tooltip title="Auto-refresh every 15s">
                                    <Space size={4}>
                                        <Switch size="small" checked={autoRefresh} onChange={setAutoRefresh} />
                                        <Text style={{ fontSize: 12 }}>Live</Text>
                                    </Space>
                                </Tooltip>
                                <Tooltip title="Export the filtered events to CSV (up to 500 rows)">
                                    <Button icon={<DownloadOutlined />} loading={exporting} disabled={events.length === 0} onClick={exportCsv}>CSV</Button>
                                </Tooltip>
                                <Button icon={<ReloadOutlined />} loading={feedQuery.isFetching || summaryQuery.isFetching}
                                    onClick={refreshNow}>
                                    Refresh
                                </Button>
                                <Button icon={<ClearOutlined />} onClick={clearFilters}>Clear</Button>
                                <Button type="primary" disabled={!dirty} onClick={applyFilters}>Apply</Button>
                            </Space>
                        </div>

                        {/* Facet filters */}
                        <Row gutter={[12, 12]}>
                            <Col xs={12} md={6}>
                                <Select
                                    placeholder="Engine" allowClear showSearch style={{ width: '100%' }}
                                    value={draft.engine}
                                    onChange={(v) => setDraft(d => ({ ...d, engine: v }))}
                                    options={engineOptions}
                                />
                            </Col>
                            <Col xs={12} md={6}>
                                <Select
                                    placeholder="Action" allowClear style={{ width: '100%' }}
                                    value={draft.action}
                                    // Picking "allow" turns findings-only off in the draft too, so
                                    // the user sees the implied change before hitting Apply.
                                    onChange={(v) => setDraft(d => ({ ...d, action: v, findingsOnly: v === 'allow' ? false : d.findingsOnly }))}
                                    options={['block', 'detect', 'shadow', 'allow'].map(a => ({ label: a, value: a }))}
                                />
                            </Col>
                            <Col xs={12} md={6}>
                                <Select
                                    placeholder="Severity" allowClear style={{ width: '100%' }}
                                    value={draft.severity}
                                    onChange={(v) => setDraft(d => ({ ...d, severity: v }))}
                                    options={['critical', 'high', 'medium', 'low', 'info'].map(s => ({ label: s, value: s }))}
                                />
                            </Col>
                            <Col xs={12} md={6}>
                                <Select
                                    placeholder="Edge (node)" allowClear showSearch style={{ width: '100%' }}
                                    value={draft.node}
                                    onChange={(v) => setDraft(d => ({ ...d, node: v }))}
                                    options={nodeOptions}
                                />
                            </Col>
                        </Row>

                        {/* Free-text search (server-side, applies with the other filters) + findings toggle */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
                            <Input
                                placeholder="Search host / path / request id"
                                value={draft.search}
                                onChange={(e) => setDraft(d => ({ ...d, search: e.target.value }))}
                                onPressEnter={applyFilters}
                                allowClear
                                style={{ flex: 1, minWidth: 240 }}
                            />
                            <Space>
                                <Switch checked={draft.findingsOnly}
                                    // Enabling findings-only while action=allow would guarantee zero
                                    // results — drop the allow filter instead.
                                    onChange={(v) => setDraft(d => ({ ...d, findingsOnly: v, action: v && d.action === 'allow' ? undefined : d.action }))} />
                                <Text style={{ fontSize: 12 }}>Findings only</Text>
                            </Space>
                        </div>

                        {/* Applied-filter chips (server-side scope at a glance) */}
                        {activeChips.length > 0 && (
                            <Space size={6} wrap>
                                <Text type="secondary" style={{ fontSize: 12 }}>Active filters:</Text>
                                {activeChips.map(c => (
                                    <Tag
                                        key={c.key}
                                        closable
                                        closeIcon={<CloseOutlined style={{ fontSize: 10 }} />}
                                        onClose={(e) => { e.preventDefault(); c.onClear(); }}
                                        style={{ borderRadius: 12, fontFamily: 'monospace', fontSize: 11 }}
                                    >
                                        {c.label}
                                    </Tag>
                                ))}
                            </Space>
                        )}
                    </Space>
                </Card>
            </Col>

            {/* Summary failure is loud: without this the cards silently show 0 while
                the feed below still lists events — a contradictory, misleading view. */}
            {summaryQuery.isError && (
                <Col span={24}>
                    <Alert type="warning" showIcon style={{ borderRadius: 8 }}
                        message="Could not load the events summary — the counts and chart below may be stale or empty"
                        description={extractErrorMessage(summaryQuery.error)} />
                </Col>
            )}

            {/* Summary cards — the action cards toggle the corresponding filter. */}
            <Col span={24}>
                <Row gutter={[16, 16]}>
                    {[
                        { label: 'Total', value: summary?.total ?? 0, color: undefined, action: undefined },
                        { label: 'Blocked', value: byAction['block'] ?? 0, color: ACTION_HEX.block, action: 'block' },
                        { label: 'Detected', value: byAction['detect'] ?? 0, color: ACTION_HEX.detect, action: 'detect' },
                        { label: 'Shadow', value: byAction['shadow'] ?? 0, color: ACTION_HEX.shadow, action: 'shadow' },
                    ].map(c => {
                        const selected = !!c.action && filters.action === c.action;
                        return (
                            <Col xs={12} md={6} key={c.label}>
                                <Tooltip title={c.action ? (selected ? 'Click to clear this action filter' : `Click to filter: action = ${c.action}`) : undefined}>
                                    <Card
                                        size="small"
                                        loading={summaryQuery.isLoading}
                                        onClick={c.action ? () => applyImmediate({ action: selected ? undefined : c.action }) : undefined}
                                        style={{
                                            borderRadius: 12,
                                            cursor: c.action ? 'pointer' : undefined,
                                            borderColor: selected ? c.color : undefined,
                                            boxShadow: selected ? `inset 0 0 0 1px ${c.color}` : undefined,
                                        }}
                                    >
                                        <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>{c.label}</Text>
                                        <div style={{ fontSize: 26, fontWeight: 600, color: c.color }}>{c.value.toLocaleString()}</div>
                                    </Card>
                                </Tooltip>
                            </Col>
                        );
                    })}
                </Row>
            </Col>

            {/* Activity chart + top engines (equal-height row) */}
            <Col xs={24} lg={16}>
                <Card
                    size="small"
                    title="Activity over time"
                    extra={<Text type="secondary" style={{ fontSize: 11 }}>Drag on the chart to zoom into a range</Text>}
                    style={{ borderRadius: 12, height: '100%' }}
                    loading={summaryQuery.isLoading}
                >
                    {chartSeries.length > 0
                        ? <MetricLineChart series={chartSeries} height={240} onRangeSelect={onChartRangeSelect} />
                        : (
                            <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Text type="secondary">No events in the selected window.</Text>
                            </div>
                        )}
                </Card>
            </Col>
            <Col xs={24} lg={8}>
                <Card size="small" title="Top engines" style={{ borderRadius: 12, height: '100%' }} loading={summaryQuery.isLoading}>
                    <div style={{ height: 240, overflowY: 'auto' }}>
                        {topEngines.length === 0 && <Text type="secondary">No findings.</Text>}
                        {topEngines.map(([engine, count]) => {
                            const max = topEngines[0]?.[1] || 1;
                            const pct = serverTotal > 0 ? (count / serverTotal) * 100 : 0;
                            const selected = filters.engine === engine;
                            // An empty engine is the sampled ALLOW stream: the request
                            // passed with no finding, so no engine is on the record.
                            // Label it honestly and don't offer an engine filter (the
                            // backend can't filter on "no engine"); it only shows up
                            // when the findings-only toggle is off.
                            const label = engine || 'allowed (no engine)';
                            const row = (
                                <div
                                    onClick={engine ? () => applyImmediate({ engine: selected ? undefined : engine }) : undefined}
                                    title={engine
                                        ? (selected ? 'Click to clear this engine filter' : `Click to filter: engine = ${engine}`)
                                        : 'Sampled allowed traffic — no engine produced a finding'}
                                    style={{
                                        cursor: engine ? 'pointer' : 'default',
                                        padding: '5px 8px',
                                        borderRadius: 8,
                                        marginBottom: 2,
                                        background: selected ? 'rgba(59, 158, 255, 0.12)' : undefined,
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                        <Tag className="auto-width-tag" style={engine ? undefined : { fontStyle: 'italic' }}>{label}</Tag>
                                        <Space size={6}>
                                            <Text type="secondary" style={{ fontSize: 11 }}>{pct.toFixed(1)}%</Text>
                                            <Text strong>{count.toLocaleString()}</Text>
                                        </Space>
                                    </div>
                                    <div style={{ height: 4, borderRadius: 2, background: 'rgba(128, 128, 128, 0.15)', overflow: 'hidden' }}>
                                        <div style={{
                                            width: `${(count / max) * 100}%`,
                                            height: '100%',
                                            borderRadius: 2,
                                            background: 'var(--color-primary)',
                                        }} />
                                    </div>
                                </div>
                            );
                            if (!engine) return <React.Fragment key="no-engine">{row}</React.Fragment>;
                            return (
                                <Dropdown
                                    key={engine}
                                    trigger={['contextMenu']}
                                    menu={{
                                        items: [{
                                            key: 'f', icon: <FilterOutlined />,
                                            label: <>Filter: engine = <b>{engine}</b></>,
                                            onClick: () => applyImmediate({ engine }),
                                        },
                                        ...(filters.engine ? [{
                                            key: 'c', icon: <CloseOutlined />, label: 'Clear engine filter',
                                            onClick: () => applyImmediate({ engine: undefined }),
                                        }] : [])],
                                    }}
                                >
                                    {row}
                                </Dropdown>
                            );
                        })}
                    </div>
                </Card>
            </Col>

            {/* Feed */}
            <Col span={24}>
                <Card
                    size="small"
                    style={{ borderRadius: 12 }}
                    title={<Space><span>Events</span><Badge count={serverTotal} overflowCount={9999999} style={{ backgroundColor: 'var(--color-primary)' }} /></Space>}
                >
                    {feedQuery.isError && (
                        <Alert type="warning" showIcon style={{ marginBottom: 12, borderRadius: 8 }}
                            message="Could not load shield events"
                            description={extractErrorMessage(feedQuery.error)} />
                    )}
                    <Table<ShieldSecurityEvent>
                        size="small"
                        rowKey={(r, i) => `${r.request_id}-${r.ts}-${r.engine}-${r.rule_id}-${i ?? 0}`}
                        dataSource={events}
                        columns={columns}
                        loading={feedQuery.isLoading}
                        expandable={{ expandedRowRender: expandedRow }}
                        scroll={{ x: 1100 }}
                        pagination={{
                            current: page,
                            pageSize: PAGE_SIZE,
                            total: serverTotal,
                            showSizeChanger: false,
                            onChange: setPage,
                            showTotal: (t) => `${t.toLocaleString()} events`,
                        }}
                    />
                </Card>
            </Col>
        </Row>
    );
};

export default ShieldEvents;
