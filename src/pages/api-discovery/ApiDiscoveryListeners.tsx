import React, { useMemo, useState, useEffect } from 'react';
import { Card, Table, Input, Button, Space, Typography, Tag, Tooltip, Empty, Tabs, Modal, InputNumber, Select, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    EyeOutlined,
    ReloadOutlined,
    SearchOutlined,
    RightOutlined,
    ApiOutlined,
    GlobalOutlined,
    RocketOutlined,
    UnlockOutlined,
    BugOutlined,
    SafetyCertificateOutlined,
    DeleteOutlined,
    AlertOutlined,
    LockOutlined,
    WarningOutlined,
    ReadOutlined,
    ClearOutlined,
    PlusOutlined,
    CheckCircleOutlined,
    SwapOutlined,
    TeamOutlined,
} from '@ant-design/icons';
import { Link, useSearchParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import {
    useApiInventoryListeners,
    useApiInventoryCleanupStale,
    useApiInventoryNormalizeGaps,
    useAddNormalizePattern,
} from '@/hooks/useApiDiscovery';
import useAuth from '@/hooks/useUserDetails';
import StatusDistBar from './components/StatusDistBar';
import RiskFlagChips from './components/RiskFlagChips';
import InfoLabel from './components/InfoLabel';
import KpiPill from './components/KpiPill';
import { formatCompactNumber } from './lib/formatNumber';
import { antdToSort, columnSortOrder, type SortState } from './lib/tableSort';
import NewApisDashboard from './dashboards/NewApisDashboard';
import AuthCoverageDashboard from './dashboards/AuthCoverageDashboard';
import BotScannerDashboard from './dashboards/BotScannerDashboard';
import PiiInventoryDashboard from './dashboards/PiiInventoryDashboard';
import ZombiesDashboard from './dashboards/ZombiesDashboard';
import RiskSummaryDashboard from './dashboards/RiskSummaryDashboard';
import SecurityScoreDashboard from './dashboards/SecurityScoreDashboard';
import TransportDashboard from './dashboards/TransportDashboard';
import ErrorsDashboard from './dashboards/ErrorsDashboard';
import DriftDashboard from './dashboards/DriftDashboard';
import ConsumersDashboard from './dashboards/ConsumersDashboard';
import ComponentLoadErrorBoundary from '@/components/ComponentLoadErrorBoundary';
import type { ListenerSummary, ListenerSortField, NormalizeGap } from './types';

const { Title, Text } = Typography;

// Each dashboard tab is isolated behind an error boundary — a render
// fault in one dashboard (e.g. an unexpected payload shape) renders a
// contained error card instead of crashing the whole tab strip.
const gb = (name: string, node: React.ReactNode): React.ReactNode => (
    <ComponentLoadErrorBoundary componentName={name}>{node}</ComponentLoadErrorBoundary>
);

const DEFAULT_LIMIT = 20;
const MAX_HOSTS_INLINE = 1;

// Compact host chip with subtle hostname styling — IPs vs FQDNs read
// differently at a glance so we don't rely on the chip alone for parsing.
const HostChips: React.FC<{ hosts: string[] }> = ({ hosts }) => {
    if (!hosts || hosts.length === 0) {
        return <Text type="secondary" style={{ fontSize: 11 }}>—</Text>;
    }
    const visible = hosts.slice(0, MAX_HOSTS_INLINE);
    const overflow = hosts.slice(MAX_HOSTS_INLINE);
    return (
        <Space size={[6, 6]} wrap>
            {visible.map((h) => (
                <Tag
                    key={h}
                    className="auto-width-tag"
                    style={{
                        fontSize: 11,
                        margin: 0,
                        padding: '1px 8px',
                        background: 'var(--bg-elevated)',
                        borderColor: 'var(--border-default)',
                        fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                        fontWeight: 400,
                    }}
                >
                    <GlobalOutlined style={{ fontSize: 10, marginRight: 4, opacity: 0.6 }} />
                    {h}
                </Tag>
            ))}
            {overflow.length > 0 && (
                <Tooltip
                    title={
                        <div style={{ fontSize: 11, lineHeight: 1.7 }}>
                            {overflow.map((h) => (
                                <div key={h}>{h}</div>
                            ))}
                        </div>
                    }
                >
                    <Tag
                        className="auto-width-tag"
                        style={{
                            fontSize: 11,
                            margin: 0,
                            padding: '1px 8px',
                            cursor: 'help',
                            background: 'var(--bg-elevated)',
                            borderColor: 'var(--border-default)',
                        }}
                    >
                        +{overflow.length}
                    </Tag>
                </Tooltip>
            )}
        </Space>
    );
};

// Project-level bulk cleanup of endpoints not seen for N days. Admin/
// Owner only — gated at the call site. The backend clamps `days` to
// [7, 3650] and echoes the value it actually used.
const StaleCleanupAction: React.FC<{ onDone: () => void }> = ({ onDone }) => {
    const [open, setOpen] = useState(false);
    const [days, setDays] = useState(90);
    const cleanupMut = useApiInventoryCleanupStale();

    const submit = async () => {
        try {
            const res = await cleanupMut.mutateAsync(days);
            setOpen(false);
            Modal.success({
                title: 'Stale cleanup complete',
                content: (
                    <span>
                        {res.deleted_count.toLocaleString()} endpoint
                        {res.deleted_count === 1 ? '' : 's'} deleted — not seen for {res.days} day
                        {res.days === 1 ? '' : 's'} (before{' '}
                        {new Date(res.cutoff).toLocaleString()}).
                        {res.days !== days
                            ? ` Your input of ${days} was clamped to the allowed ${res.days}.`
                            : ''}
                    </span>
                ),
            });
            if (res.warning) message.warning(res.warning, 6);
            onDone();
        } catch (e: any) {
            const s = e?.response?.status;
            message.error(
                s === 403
                    ? 'Only an Admin or Owner can clean up the API inventory.'
                    : e?.response?.data?.error || e?.response?.data?.message || e?.message ||
                          'Stale cleanup failed',
            );
        }
    };

    return (
        <>
            <Button icon={<ClearOutlined />} onClick={() => setOpen(true)}>
                Cleanup stale
            </Button>
            <Modal
                open={open}
                title="Delete stale endpoints"
                okText="Delete stale endpoints"
                okButtonProps={{ danger: true, loading: cleanupMut.isPending }}
                onOk={submit}
                onCancel={() => setOpen(false)}
            >
                <Text style={{ fontSize: 13 }}>
                    Permanently deletes every endpoint in this project whose last request is
                    older than the window below. Endpoints still receiving traffic are recreated
                    by the collector on the next request — so this only clears genuinely dead
                    entries. The exact number removed is not known in advance.
                </Text>
                <div style={{ marginTop: 14 }}>
                    <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                        Not seen for at least
                    </Text>
                    <InputNumber
                        min={7}
                        max={3650}
                        value={days}
                        onChange={(v) => setDays(typeof v === 'number' ? v : 90)}
                        addonAfter="days"
                        style={{ width: 160 }}
                    />
                    <div>
                        <Text type="secondary" style={{ fontSize: 11 }}>
                            Allowed range 7–3650 days (default 90). Out-of-range values are
                            clamped by the server.
                        </Text>
                    </div>
                </div>
            </Modal>
        </>
    );
};

const NORMALIZE_PLACEHOLDER_OPTS = ['id', 'uuid', 'objectid', 'ulid', 'token', 'dynamic'];

// Lists "ballooning" un-normalized path prefixes the collector flagged.
// Each row offers a one-click action (Admin/Owner) to append a
// path_normalize_patterns rule to the collector config.
const NormalizeGapsPanel: React.FC = () => {
    const { data, isLoading, isFetching, refetch } = useApiInventoryNormalizeGaps();
    const userDetail = useAuth();
    const isAdminOrOwner = ['owner', 'admin'].includes(userDetail?.role?.toLowerCase() || '');
    const addMut = useAddNormalizePattern();

    const [editing, setEditing] = useState<NormalizeGap | null>(null);
    const [ruleRegex, setRuleRegex] = useState('');
    const [rulePlaceholder, setRulePlaceholder] = useState('id');

    const gaps = data?.data ?? [];

    const openModal = (gap: NormalizeGap) => {
        setEditing(gap);
        setRuleRegex('');
        setRulePlaceholder('id');
    };

    const submit = async () => {
        const r = ruleRegex.trim();
        if (!r) {
            message.error('Enter a regex for the dynamic segment.');
            return;
        }
        try {
            await addMut.mutateAsync({ regex: r, placeholder: rulePlaceholder });
            message.success('Normalization rule added — the collector applies it within ~2 min.');
            setEditing(null);
            refetch();
        } catch (e: any) {
            const s = e?.response?.status;
            message.error(
                s === 403
                    ? 'Only an Admin or Owner can change the collector configuration.'
                    : e?.response?.data?.error ||
                          e?.response?.data?.message ||
                          e?.message ||
                          'Failed to add the rule',
            );
        }
    };

    // Clean state — a compact single line.
    if (!isLoading && gaps.length === 0) {
        return (
            <Card size="small" style={{ marginBottom: 16, borderRadius: 10 }}>
                <Space>
                    <CheckCircleOutlined style={{ color: 'var(--color-success)' }} />
                    <Text style={{ fontSize: 13 }}>
                        No normalization gaps — all path prefixes look healthy.
                    </Text>
                </Space>
            </Card>
        );
    }

    return (
        <Card
            size="small"
            loading={isLoading}
            style={{ marginBottom: 16, borderRadius: 10 }}
            title={
                <Space size={8}>
                    <WarningOutlined style={{ color: '#fff' }} />
                    <Text style={{ fontSize: 13.5, fontWeight: 600, color: '#fff' }}>
                        Normalization Gaps
                    </Text>
                    {gaps.length > 0 && (
                        <Tag color="orange" style={{ margin: 0 }}>
                            {gaps.length}
                        </Tag>
                    )}
                </Space>
            }
            extra={
                <Button
                    size="small"
                    icon={<ReloadOutlined spin={isFetching} />}
                    onClick={() => refetch()}
                    loading={isFetching}
                >
                    Refresh
                </Button>
            }
        >
            <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                These path prefixes are accumulating many distinct un-normalized child segments — a
                likely ID format the built-in detectors don’t recognise. Add a normalization rule so
                the segment collapses into one endpoint.
            </Text>
            {gaps.map((g) => (
                <div
                    key={g.prefix}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '8px 0',
                        borderTop: '1px solid var(--border-default)',
                    }}
                >
                    <code style={{ flex: 1, minWidth: 0, fontSize: 12, wordBreak: 'break-all' }}>
                        {g.prefix}
                    </code>
                    {g.updated_at && (
                        <Text type="secondary" style={{ fontSize: 11, flexShrink: 0 }}>
                            updated {formatDistanceToNow(new Date(g.updated_at), { addSuffix: true })}
                        </Text>
                    )}
                    {isAdminOrOwner && (
                        <Button
                            size="small"
                            icon={<PlusOutlined />}
                            onClick={() => openModal(g)}
                            style={{ flexShrink: 0 }}
                        >
                            Add normalize rule
                        </Button>
                    )}
                </div>
            ))}
            <Modal
                open={!!editing}
                title="Add normalization rule"
                okText="Add rule"
                okButtonProps={{ loading: addMut.isPending }}
                onOk={submit}
                onCancel={() => setEditing(null)}
            >
                <Text type="secondary" style={{ fontSize: 12 }}>
                    Gap prefix:
                </Text>
                <div style={{ marginBottom: 12 }}>
                    <code style={{ fontSize: 12, wordBreak: 'break-all' }}>{editing?.prefix}</code>
                </div>
                <Text style={{ fontSize: 13, fontWeight: 500 }}>Segment regex</Text>
                <div>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                        RE2 regex matching the whole dynamic segment — no <code>^</code>/
                        <code>$</code> needed. e.g. <code>{'TK-\\d+'}</code>,{' '}
                        <code>{'[0-9a-f-]{36}'}</code>.
                    </Text>
                </div>
                <Input
                    value={ruleRegex}
                    onChange={(e) => setRuleRegex(e.target.value)}
                    placeholder="\d+"
                    disabled={addMut.isPending}
                    style={{ marginTop: 6 }}
                />
                <div style={{ marginTop: 12 }}>
                    <Text style={{ fontSize: 13, fontWeight: 500 }}>Placeholder</Text>
                    <div>
                        <Select
                            value={rulePlaceholder}
                            onChange={setRulePlaceholder}
                            disabled={addMut.isPending}
                            style={{ width: 160, marginTop: 6 }}
                            options={NORMALIZE_PLACEHOLDER_OPTS.map((v) => ({
                                value: v,
                                label: `{${v}}`,
                            }))}
                        />
                    </div>
                </div>
            </Modal>
        </Card>
    );
};

const ApiDiscoveryListeners: React.FC = () => {
    const { project } = useProjectVariable();
    const [searchParams, setSearchParams] = useSearchParams();

    // Stale cleanup is Admin/Owner only.
    const userDetail = useAuth();
    const isAdminOrOwner = ['owner', 'admin'].includes(userDetail?.role?.toLowerCase() || '');

    const urlListener = searchParams.get('listener_name') ?? '';
    const urlHost = searchParams.get('host') ?? '';
    const urlLimit = parseInt(searchParams.get('limit') ?? String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT;
    const urlOffset = parseInt(searchParams.get('offset') ?? '0', 10) || 0;

    // Sort — URL-synced so a sorted view is shareable. Backend whitelist:
    // last_seen | normalized_path_count.
    const sort: SortState<ListenerSortField> = {
        sort_by:
            searchParams.get('sort_by') === 'normalized_path_count'
                ? 'normalized_path_count'
                : 'last_seen',
        sort_order: searchParams.get('sort_order') === 'asc' ? 'asc' : 'desc',
    };

    const [searchDraft, setSearchDraft] = useState<string>(urlListener);
    useEffect(() => setSearchDraft(urlListener), [urlListener]);

    const [hostDraft, setHostDraft] = useState<string>(urlHost);
    useEffect(() => setHostDraft(urlHost), [urlHost]);

    // Commit one prefix filter (listener_name | host) to the URL, resetting
    // pagination so the new result set starts from page 1.
    const commitFilter = (key: 'listener_name' | 'host', value: string) => {
        const next = new URLSearchParams(searchParams);
        if (value) next.set(key, value);
        else next.delete(key);
        next.set('offset', '0');
        setSearchParams(next, { replace: true });
    };
    const commitSearch = (value: string) => commitFilter('listener_name', value);

    const params = useMemo(
        () => ({
            ...(urlListener ? { listener_name: urlListener } : {}),
            ...(urlHost ? { host: urlHost } : {}),
            sort_by: sort.sort_by,
            sort_order: sort.sort_order,
            limit: urlLimit,
            offset: urlOffset,
        }),
        [urlListener, urlHost, sort.sort_by, sort.sort_order, urlLimit, urlOffset],
    );

    const { data, isLoading, isFetching, refetch, error } = useApiInventoryListeners(params, !!project);

    const totalCount = data?.total_count ?? 0;
    const currentPage = data?.current_page ?? 1;
    const rows = data?.data ?? [];

    // Header stats — light aggregates of the currently-loaded page; gives the
    // user a glanceable summary without an extra API call. "Across all" hint is
    // calibrated by total_count vs rows.length.
    const headerStats = useMemo(() => {
        const totalEndpoints = rows.reduce((s, r) => s + (r.normalized_path_count ?? 0), 0);
        const withRisk = rows.filter((r) => (r.risk_flags?.length ?? 0) > 0).length;
        const totalHosts = new Set(rows.flatMap((r) => r.hostnames ?? [])).size;
        return { totalEndpoints, withRisk, totalHosts };
    }, [rows]);

    const columns: ColumnsType<ListenerSummary> = [
        {
            title: 'Listener',
            dataIndex: 'listener_name',
            key: 'listener_name',
            render: (name: string) => (
                <Link
                    to={`/api-discovery/${encodeURIComponent(name)}`}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        fontWeight: 600,
                        fontSize: 13,
                    }}
                >
                    <span
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 22,
                            height: 22,
                            borderRadius: 6,
                            background: 'var(--color-primary-light)',
                            color: 'var(--color-primary)',
                            fontSize: 11,
                        }}
                    >
                        <EyeOutlined />
                    </span>
                    {name}
                    <RightOutlined style={{ fontSize: 9, opacity: 0.4 }} />
                </Link>
            ),
        },
        {
            title: (
                <InfoLabel info="Count of distinct normalized paths discovered under this listener. Paths with IDs / UUIDs are collapsed into a single template (e.g. /users/{id}).">
                    Endpoints
                </InfoLabel>
            ),
            dataIndex: 'normalized_path_count',
            key: 'normalized_path_count',
            width: 130,
            sorter: true,
            sortOrder: columnSortOrder(sort, 'normalized_path_count'),
            render: (n: number) => (
                <Tag
                    className="auto-width-tag"
                    icon={<ApiOutlined />}
                    color="processing"
                    style={{
                        fontSize: 12,
                        padding: '2px 10px',
                        margin: 0,
                    }}
                >
                    {(n ?? 0).toLocaleString()}
                </Tag>
            ),
        },
        {
            title: 'Hosts',
            dataIndex: 'hostnames',
            key: 'hostnames',
            render: (hosts: string[]) => <HostChips hosts={hosts ?? []} />,
        },
        {
            title: (
                <InfoLabel info="Risk flags observed on any endpoint under this listener. Hover a chip for its meaning and severity. The numeric score on each endpoint is the sum of severities (clamped at 255).">
                    Risk
                </InfoLabel>
            ),
            dataIndex: 'risk_flags',
            key: 'risk_flags',
            width: 280,
            render: (flags: string[]) => <RiskFlagChips flags={flags} />,
        },
        {
            title: (
                <InfoLabel info="Aggregated HTTP status distribution across the listener's endpoints. Hover the bar for exact counts by class (1xx / 2xx / 3xx / 4xx / 5xx).">
                    Status
                </InfoLabel>
            ),
            dataIndex: 'status_dist',
            key: 'status_dist',
            width: 180,
            render: (dist: Record<string, number>) => (
                <StatusDistBar statusDist={dist ?? {}} width={160} height={12} />
            ),
        },
        {
            title: 'Last Activity',
            dataIndex: 'last_seen',
            key: 'last_seen',
            width: 160,
            sorter: true,
            sortOrder: columnSortOrder(sort, 'last_seen'),
            render: (ts: string) =>
                ts ? (
                    <Tooltip title={new Date(ts).toISOString()}>
                        <Space size={4}>
                            <span
                                style={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: '50%',
                                    background:
                                        Date.now() - new Date(ts).getTime() < 60 * 60 * 1000
                                            ? 'var(--color-success)'
                                            : 'var(--text-tertiary)',
                                    display: 'inline-block',
                                }}
                            />
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                {formatDistanceToNow(new Date(ts), { addSuffix: true })}
                            </Text>
                        </Space>
                    </Tooltip>
                ) : (
                    <Text type="secondary" style={{ fontSize: 11 }}>—</Text>
                ),
        },
    ];

    // Tab view — synced via ?view= so direct links land on the right dashboard.
    const view = searchParams.get('view') ?? 'listeners';
    const setView = (next: string) => {
        const np = new URLSearchParams(searchParams);
        if (next === 'listeners') np.delete('view');
        else np.set('view', next);
        // Per-view URL state (limit/offset/listener_name) only applies to the
        // listeners tab; reset them so a deep-linked filter from one tab
        // doesn't bleed into another's pagination.
        if (next !== 'listeners') {
            np.delete('limit');
            np.delete('offset');
            np.delete('listener_name');
            np.delete('host');
            np.delete('sort_by');
            np.delete('sort_order');
        }
        setSearchParams(np, { replace: true });
    };

    const listenersTabContent = (
        <>
            {/* Hero header */}
            <div
                style={{
                    background:
                        'linear-gradient(135deg, var(--color-primary-light) 0%, transparent 100%)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 12,
                    padding: '20px 24px',
                    marginBottom: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 14,
                }}
            >
                {/* Top row — identity (icon + title + subtitle). */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                    <div
                        style={{
                            width: 44,
                            height: 44,
                            borderRadius: 10,
                            background: 'var(--color-primary)',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 22,
                            boxShadow: '0 4px 12px rgba(10, 127, 218, 0.25)',
                            flexShrink: 0,
                        }}
                    >
                        <EyeOutlined />
                    </div>
                    <div style={{ minWidth: 0 }}>
                        <Title level={3} style={{ margin: 0, lineHeight: 1.2 }}>
                            API Discovery
                        </Title>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Listeners with collected API traffic — enable{' '}
                            <code
                                style={{
                                    background: 'var(--bg-elevated)',
                                    padding: '1px 6px',
                                    borderRadius: 4,
                                    fontSize: 11,
                                }}
                            >
                                api_discovery
                            </code>{' '}
                            on a listener's HCM to start collecting events.
                        </Text>
                    </div>
                </div>

                {/* KPI / action row — divider above; KPIs left, actions right. */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 12,
                        paddingTop: 14,
                        borderTop: '1px solid var(--border-default)',
                    }}
                >
                    <Space size={24} wrap>
                        <KpiPill
                            label="Listeners"
                            value={formatCompactNumber(totalCount)}
                            accent="var(--color-primary)"
                        />
                        <KpiPill
                            label="Endpoints"
                            value={formatCompactNumber(headerStats.totalEndpoints)}
                            accent="var(--color-success)"
                        />
                        <KpiPill
                            label="With risk"
                            value={formatCompactNumber(headerStats.withRisk)}
                            accent="var(--color-warning)"
                        />
                    </Space>
                    <Space size={8} wrap>
                        <Link to="/api-discovery/risks">
                            <Button icon={<ReadOutlined />}>Risk guide</Button>
                        </Link>
                        {isAdminOrOwner && <StaleCleanupAction onDone={() => refetch()} />}
                        <Button
                            icon={<ReloadOutlined spin={isFetching} />}
                            onClick={() => refetch()}
                            loading={isFetching}
                        >
                            Refresh
                        </Button>
                    </Space>
                </div>
            </div>

            {/* Normalization gaps — un-normalized path prefixes to fix */}
            <NormalizeGapsPanel />

            {/* Search bar */}
            <Card
                size="small"
                style={{
                    marginBottom: 16,
                    borderRadius: 10,
                    border: '1px solid var(--border-default)',
                }}
                styles={{ body: { padding: '10px 12px' } }}
            >
                <Space size={8} wrap style={{ width: '100%' }}>
                    <Input
                        prefix={<SearchOutlined style={{ color: 'var(--text-tertiary)' }} />}
                        placeholder="Filter listeners by name prefix…"
                        value={searchDraft}
                        onChange={(e) => setSearchDraft(e.target.value)}
                        onPressEnter={(e) => commitSearch((e.target as HTMLInputElement).value)}
                        onBlur={() => {
                            if (searchDraft !== urlListener) commitSearch(searchDraft);
                        }}
                        allowClear
                        size="middle"
                        style={{ width: 360 }}
                    />
                    <Input
                        prefix={<GlobalOutlined style={{ color: 'var(--text-tertiary)' }} />}
                        placeholder="Filter by host prefix…"
                        value={hostDraft}
                        onChange={(e) => setHostDraft(e.target.value)}
                        onPressEnter={(e) =>
                            commitFilter('host', (e.target as HTMLInputElement).value)
                        }
                        onBlur={() => {
                            if (hostDraft !== urlHost) commitFilter('host', hostDraft);
                        }}
                        allowClear
                        size="middle"
                        style={{
                            width: 360,
                            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                        }}
                    />
                </Space>
            </Card>

            {/* Table */}
            <Card
                size="small"
                style={{ borderRadius: 10, border: '1px solid var(--border-default)' }}
                styles={{ body: { padding: 0 } }}
            >
                <Table<ListenerSummary>
                    className="api-discovery-listeners-table"
                    rowKey={(r) => `${r.project_id}:${r.listener_name}`}
                    columns={columns}
                    scroll={{ x: 'max-content' }}
                    dataSource={rows}
                    loading={isLoading}
                    size="middle"
                    rowClassName={() => 'api-discovery-row'}
                    showSorterTooltip={false}
                    onChange={(_p, _f, sorter, extra) => {
                        if (extra.action !== 'sort') return;
                        const s = antdToSort<ListenerSortField>(sorter, {
                            sort_by: 'last_seen',
                            sort_order: 'desc',
                        });
                        const next = new URLSearchParams(searchParams);
                        next.set('sort_by', s.sort_by);
                        next.set('sort_order', s.sort_order);
                        next.set('offset', '0');
                        setSearchParams(next, { replace: true });
                    }}
                    locale={{
                        emptyText: (
                            <div style={{ padding: '40px 0' }}>
                                <Empty
                                    description={
                                        error ? (
                                            <Text type="secondary">
                                                Failed to load listeners. Try Refresh.
                                            </Text>
                                        ) : (
                                            <div>
                                                <Text strong style={{ display: 'block', marginBottom: 4 }}>
                                                    No API activity yet
                                                </Text>
                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                    Enable <code>api_discovery</code> on a listener's HCM
                                                    extension to start collecting events.
                                                </Text>
                                            </div>
                                        )
                                    }
                                />
                            </div>
                        ),
                    }}
                    pagination={{
                        current: currentPage,
                        pageSize: urlLimit,
                        total: totalCount,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50', '100'],
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}–${range[1]} of ${total.toLocaleString()} listeners`,
                        onChange: (page, size) => {
                            const next = new URLSearchParams(searchParams);
                            next.set('limit', String(size));
                            next.set('offset', String((page - 1) * size));
                            setSearchParams(next, { replace: true });
                        },
                    }}
                />
            </Card>

            {/* Hover effect + first/last cell padding (scoped to this table). */}
            <style>{`
                .api-discovery-row:hover td {
                    background: var(--bg-hover, var(--bg-elevated)) !important;
                    cursor: pointer;
                }
                .api-discovery-listeners-table .ant-table-thead > tr > th:first-child,
                .api-discovery-listeners-table .ant-table-tbody > tr > td:first-child {
                    padding-left: 20px !important;
                }
                .api-discovery-listeners-table .ant-table-thead > tr > th:last-child,
                .api-discovery-listeners-table .ant-table-tbody > tr > td:last-child {
                    padding-right: 20px !important;
                }
            `}</style>
        </>
    );

    return (
        <div style={{ padding: '0px' }}>
            <Tabs
                activeKey={view}
                onChange={setView}
                size="large"
                items={[
                    {
                        key: 'listeners',
                        label: (
                            <span>
                                <EyeOutlined /> Listeners
                            </span>
                        ),
                        children: gb('Listeners', listenersTabContent),
                    },
                    {
                        key: 'new',
                        label: (
                            <span>
                                <RocketOutlined /> New APIs
                            </span>
                        ),
                        children: gb('New APIs', <NewApisDashboard />),
                    },
                    {
                        key: 'auth',
                        label: (
                            <span>
                                <UnlockOutlined /> Auth Coverage
                            </span>
                        ),
                        children: gb('Auth Coverage', <AuthCoverageDashboard />),
                    },
                    {
                        key: 'bots',
                        label: (
                            <span>
                                <BugOutlined /> Bot / Scanner
                            </span>
                        ),
                        children: gb('Bot / Scanner', <BotScannerDashboard />),
                    },
                    {
                        key: 'pii',
                        label: (
                            <span>
                                <SafetyCertificateOutlined /> PII
                            </span>
                        ),
                        children: gb('PII', <PiiInventoryDashboard />),
                    },
                    {
                        key: 'zombies',
                        label: (
                            <span>
                                <DeleteOutlined /> Zombies
                            </span>
                        ),
                        children: gb('Zombies', <ZombiesDashboard />),
                    },
                    {
                        key: 'risk',
                        label: (
                            <span>
                                <AlertOutlined /> Risk
                            </span>
                        ),
                        children: gb('Risk', <RiskSummaryDashboard />),
                    },
                    {
                        key: 'security',
                        label: (
                            <span>
                                <SafetyCertificateOutlined /> Security Score
                            </span>
                        ),
                        children: gb('Security Score', <SecurityScoreDashboard />),
                    },
                    {
                        key: 'transport',
                        label: (
                            <span>
                                <LockOutlined /> Transport
                            </span>
                        ),
                        children: gb('Transport', <TransportDashboard />),
                    },
                    {
                        key: 'errors',
                        label: (
                            <span>
                                <WarningOutlined /> Errors
                            </span>
                        ),
                        children: gb('Errors', <ErrorsDashboard />),
                    },
                    {
                        key: 'drift',
                        label: (
                            <span>
                                <SwapOutlined /> Drift
                            </span>
                        ),
                        children: gb('Drift', <DriftDashboard />),
                    },
                    {
                        key: 'consumers',
                        label: (
                            <span>
                                <TeamOutlined /> Consumers
                            </span>
                        ),
                        children: gb('Consumers', <ConsumersDashboard />),
                    },
                ]}
            />
        </div>
    );
};

export default ApiDiscoveryListeners;
