import React, { useMemo, useState } from 'react';
import {
    Card,
    Table,
    Button,
    Space,
    Typography,
    Tag,
    Tooltip,
    Empty,
    Select,
    Input,
    Slider,
    DatePicker,
    Collapse,
    Row,
    Col,
    Divider,
    Segmented,
    Dropdown,
    Popover,
    message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    EyeOutlined,
    ReloadOutlined,
    FilterOutlined,
    DownloadOutlined,
    QuestionCircleOutlined,
} from '@ant-design/icons';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { formatDistanceToNow } from 'date-fns';
import { api } from '@/common/api';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import {
    useApiInventory,
    useApiInventoryListeners,
    useApiInventoryAttackSurface,
    useApiInventoryOperations,
} from '@/hooks/useApiDiscovery';
import AuthPostureBadge from './components/AuthPostureBadge';
import AuthSchemesBadge from './components/AuthSchemesBadge';
import StatusDistBar from './components/StatusDistBar';
import RiskFlagChips from './components/RiskFlagChips';
import InfoLabel from './components/InfoLabel';
import KpiPill from './components/KpiPill';
import BackButton from './components/BackButton';
import { formatCompactNumber } from './lib/formatNumber';
import {
    KNOWN_RISK_FLAGS,
    KNOWN_PII_CATEGORIES,
    KNOWN_ENDPOINT_CATEGORIES,
    riskFlagLabel,
    threatTagColor,
    postureTagColor,
} from './lib/riskFlagCatalog';
import EndpointPath from './components/EndpointPath';
import type {
    InventoryDoc,
    InventoryListParams,
    InventoryListSortField,
    ListenerSummary,
    OperationGroup,
    OperationsListParams,
    OperationsSortField,
} from './types';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const DEFAULT_LIMIT = 20;

// Method → antd preset tag colour. Every method gets a real preset so
// every chip renders with full bg / border / text styling in dark mode
// (the `default` colour falls back to the global `.ant-tag` override
// which produces a washed-out grey chip indistinguishable from background).
const METHOD_COLOR: Record<string, string> = {
    GET: 'blue',
    POST: 'green',
    PUT: 'orange',
    PATCH: 'purple',
    DELETE: 'red',
    HEAD: 'cyan',
    OPTIONS: 'geekblue',
    CONNECT: 'magenta',
    TRACE: 'lime',
};

const PROTOCOLS = ['http/1.0', 'http/1.1', 'http/2', 'http/3', 'tcp', 'grpc'];
const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS', 'CONNECT', 'TRACE'];

// NOTE: status_min / status_max DON'T live here — the backend's
// /inventory list handler doesn't accept those params (inventory docs
// store status_dist as an aggregate object, not a status_code column).
// Status range filtering only works on /inventory/:id/events. Including
// the field in the UI here would be inert (silently dropped).
interface FilterState {
    method: string[];
    protocol: string[];
    risk_flag: string[];
    pii_category: string[];
    endpoint_category: string[];
    min_risk_score: number;
    max_risk_score: number;
    /** Prefix filters (Mongo `^value` regex) — narrow within the listener. */
    host?: string;
    normalized_path?: string;
    last_seen_from?: string;
    last_seen_to?: string;
    /** Geo cross-filter (ClickHouse-backed). All optional. */
    country?: string;
    asn?: string;
    /** Raw value cross-filters — only meaningful when collector keeps
     *  raw UA / IP (compliance config); returns empty when stripped. */
    source_ip?: string;
    user_agent?: string;
}

// Server-side sort whitelist — must stay in lockstep with the backend
// `/inventory` parseInventoryListFilter switch.
const SORT_FIELDS: InventoryListSortField[] = [
    'last_seen',
    'max_risk_score',
    'max_posture_score',
    'seen_count',
    'latency_max_ms',
];

// Sort whitelist for the path-grouped /operations endpoint.
const OPERATIONS_SORT_FIELDS: OperationsSortField[] = [
    'last_seen',
    'total_seen',
    'max_risk_score',
    'max_posture_score',
    'operation_count',
];

const DEFAULT_FILTERS: FilterState = {
    method: [],
    protocol: [],
    risk_flag: [],
    pii_category: [],
    endpoint_category: [],
    min_risk_score: 0,
    max_risk_score: 255,
};

// The two-axis scoring cheat-sheet shown behind the "Scoring guide" popover
// on the catalog toolbar.
const SCORING_MATRIX_CELL: React.CSSProperties = {
    border: '1px solid var(--border-default)',
    padding: '5px 9px',
    textAlign: 'left',
    verticalAlign: 'top',
};
const SCORING_GUIDE = (
    <div style={{ maxWidth: 400, fontSize: 12, lineHeight: 1.5 }}>
        <div style={{ marginBottom: 6 }}>
            <Tag color="volcano" className="auto-width-tag" style={{ margin: '0 6px 0 0' }}>Threat</Tag>
            active attack / abuse — “is something dangerous happening?”
        </div>
        <div style={{ marginBottom: 10 }}>
            <Tag color="geekblue" className="auto-width-tag" style={{ margin: '0 6px 0 0' }}>Exposure</Tag>
            standing config hygiene — “how open is the endpoint?”
        </div>
        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 12 }}>
            <thead>
                <tr>
                    <th style={SCORING_MATRIX_CELL} />
                    <th style={SCORING_MATRIX_CELL}>Low exposure</th>
                    <th style={SCORING_MATRIX_CELL}>High exposure</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th style={SCORING_MATRIX_CELL}>Low threat</th>
                    <td style={SCORING_MATRIX_CELL}>✅ Clean</td>
                    <td style={SCORING_MATRIX_CELL}>🔵 Boring but open → harden</td>
                </tr>
                <tr>
                    <th style={SCORING_MATRIX_CELL}>High threat</th>
                    <td style={SCORING_MATRIX_CELL}>🔴 Solid but under attack</td>
                    <td style={SCORING_MATRIX_CELL}>⛔ Open &amp; under attack — top priority</td>
                </tr>
            </tbody>
        </table>
        <div style={{ marginTop: 10, opacity: 0.85 }}>
            In short: <strong>Threat</strong> = “is it being attacked?”, <strong>Exposure</strong> ={' '}
            “is it vulnerable?”. One is an <em>event</em>, the other a <em>state</em>.
        </div>
    </div>
);

// Compute status code sum for 5xx range
const sum5xx = (dist?: Record<string, number>): number => {
    if (!dist) return 0;
    let s = 0;
    for (const [code, n] of Object.entries(dist)) {
        const c = parseInt(code, 10);
        if (c >= 500 && c < 600) s += n;
    }
    return s;
};

const ApiDiscoveryEndpoints: React.FC = () => {
    const { project } = useProjectVariable();
    const { listenerName: encodedName } = useParams<{ listenerName: string }>();
    const listenerName = encodedName ? decodeURIComponent(encodedName) : '';
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // ---------- Filter / pagination state (URL-synced) ----------
    // Filters live ONLY in the URL query string — shareable and restored
    // by browser back/forward. They are deliberately NOT mirrored to
    // localStorage: a fresh visit (or a different listener) must start
    // from clean defaults, not inherit a stale filter set.

    const hydrate = (): FilterState => {
        const fromUrl: Partial<FilterState> = {};
        const csv = (k: keyof FilterState) =>
            (searchParams.get(k) ?? '').split(',').filter(Boolean);
        const num = (k: string) => {
            const v = searchParams.get(k);
            return v !== null && v !== '' ? Number(v) : undefined;
        };
        fromUrl.method = csv('method');
        fromUrl.protocol = csv('protocol');
        fromUrl.risk_flag = csv('risk_flag');
        fromUrl.pii_category = csv('pii_category');
        fromUrl.endpoint_category = csv('endpoint_category');
        fromUrl.min_risk_score = num('min_risk_score') ?? 0;
        fromUrl.max_risk_score = num('max_risk_score') ?? 255;
        fromUrl.host = searchParams.get('host') ?? undefined;
        fromUrl.normalized_path = searchParams.get('normalized_path') ?? undefined;
        fromUrl.last_seen_from = searchParams.get('last_seen_from') ?? undefined;
        fromUrl.last_seen_to = searchParams.get('last_seen_to') ?? undefined;
        fromUrl.country = searchParams.get('country') ?? undefined;
        fromUrl.asn = searchParams.get('asn') ?? undefined;
        fromUrl.source_ip = searchParams.get('source_ip') ?? undefined;
        fromUrl.user_agent = searchParams.get('user_agent') ?? undefined;

        const hasUrl = Array.from(searchParams.keys()).some((k) =>
            ['method', 'protocol', 'risk_flag', 'pii_category', 'endpoint_category',
                'min_risk_score', 'max_risk_score', 'host', 'normalized_path',
                'last_seen_from', 'last_seen_to', 'country', 'asn',
                'source_ip', 'user_agent'].includes(k),
        );
        if (hasUrl) return { ...DEFAULT_FILTERS, ...fromUrl } as FilterState;
        return DEFAULT_FILTERS;
    };

    const [filters, setFilters] = useState<FilterState>(hydrate);
    const [draftFilters, setDraftFilters] = useState<FilterState>(filters);
    const [sortBy, setSortBy] = useState<string>(() => searchParams.get('sort_by') || 'last_seen');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(
        (searchParams.get('sort_order') as any) ?? 'desc',
    );
    const urlLimit =
        parseInt(searchParams.get('limit') ?? String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT;
    const urlOffset = parseInt(searchParams.get('offset') ?? '0', 10) || 0;

    // ---------- Catalog source + layout (URL-synced) ----------
    // source: confirmed (real endpoints, /inventory) vs attack (probe /
    // scanner noise, /attack-surface). layout: flat per-operation vs
    // path-grouped (/operations) — grouped only applies to confirmed.
    const source: 'confirmed' | 'attack' =
        searchParams.get('source') === 'attack' ? 'attack' : 'confirmed';
    const layout: 'flat' | 'grouped' =
        source === 'confirmed' && searchParams.get('layout') === 'grouped' ? 'grouped' : 'flat';
    const isAttack = source === 'attack';
    const isGrouped = layout === 'grouped';

    // Switching catalog source / layout resets pagination + sort (the sort
    // whitelists differ between flat and grouped endpoints).
    const switchView = (next: URLSearchParams) => {
        next.set('offset', '0');
        next.set('sort_by', 'last_seen');
        next.set('sort_order', 'desc');
        setSortBy('last_seen');
        setSortOrder('desc');
        setSearchParams(next, { replace: true });
    };
    const setSource = (next: 'confirmed' | 'attack') => {
        const np = new URLSearchParams(searchParams);
        if (next === 'confirmed') np.delete('source');
        else np.set('source', next);
        np.delete('layout'); // grouped is confirmed-only
        switchView(np);
    };
    const setLayout = (next: 'flat' | 'grouped') => {
        const np = new URLSearchParams(searchParams);
        if (next === 'flat') np.delete('layout');
        else np.set('layout', next);
        switchView(np);
    };

    const applyFilters = () => {
        setFilters(draftFilters);
        const next = new URLSearchParams(searchParams);
        const setOrDel = (k: string, v: unknown) => {
            if (v === undefined || v === null || v === '' ||
                (Array.isArray(v) && v.length === 0)) {
                next.delete(k);
            } else if (Array.isArray(v)) {
                next.set(k, v.join(','));
            } else {
                next.set(k, String(v));
            }
        };
        setOrDel('method', draftFilters.method);
        setOrDel('protocol', draftFilters.protocol);
        setOrDel('risk_flag', draftFilters.risk_flag);
        setOrDel('pii_category', draftFilters.pii_category);
        setOrDel('endpoint_category', draftFilters.endpoint_category);
        setOrDel(
            'min_risk_score',
            draftFilters.min_risk_score === 0 ? undefined : draftFilters.min_risk_score,
        );
        setOrDel(
            'max_risk_score',
            draftFilters.max_risk_score === 255 ? undefined : draftFilters.max_risk_score,
        );
        setOrDel('host', draftFilters.host?.trim());
        setOrDel('normalized_path', draftFilters.normalized_path?.trim());
        setOrDel('last_seen_from', draftFilters.last_seen_from);
        setOrDel('last_seen_to', draftFilters.last_seen_to);
        setOrDel('country', draftFilters.country?.trim().toUpperCase());
        setOrDel('asn', draftFilters.asn?.trim());
        setOrDel('source_ip', draftFilters.source_ip?.trim());
        setOrDel('user_agent', draftFilters.user_agent?.trim());
        next.set('offset', '0');
        setSearchParams(next, { replace: true });
    };

    const resetFilters = () => {
        setDraftFilters(DEFAULT_FILTERS);
        setFilters(DEFAULT_FILTERS);
        const next = new URLSearchParams();
        if (urlLimit !== DEFAULT_LIMIT) next.set('limit', String(urlLimit));
        setSearchParams(next, { replace: true });
    };

    // ---------- Listener summary ----------
    // useApiInventoryListeners caches per-project; supplying listener_name=<exact>
    // as a prefix filter will (in practice) match this one listener — Mongo
    // regex `^name` succeeds on exact too. The list query is cached anyway from
    // Page 1; React-Query dedups.
    const summaryQuery = useApiInventoryListeners(
        { listener_name: listenerName, limit: 1, offset: 0 },
        !!project && !!listenerName,
    );
    const summary = summaryQuery.data?.data?.find(
        (s: ListenerSummary) => s.listener_name === listenerName,
    );

    // ---------- Inventory list ----------
    const listParams = useMemo<InventoryListParams>(
        () => ({
            listener_name: listenerName,
            method: filters.method.length ? filters.method : undefined,
            protocol: filters.protocol.length ? filters.protocol : undefined,
            risk_flag: filters.risk_flag.length ? filters.risk_flag : undefined,
            pii_category: filters.pii_category.length ? filters.pii_category : undefined,
            endpoint_category: filters.endpoint_category.length
                ? filters.endpoint_category
                : undefined,
            min_risk_score: filters.min_risk_score > 0 ? filters.min_risk_score : undefined,
            max_risk_score: filters.max_risk_score < 255 ? filters.max_risk_score : undefined,
            host: filters.host?.trim() || undefined,
            normalized_path: filters.normalized_path?.trim() || undefined,
            last_seen_from: filters.last_seen_from,
            last_seen_to: filters.last_seen_to,
            country: filters.country?.trim().toUpperCase() || undefined,
            asn: filters.asn?.trim() || undefined,
            source_ip: filters.source_ip?.trim() || undefined,
            user_agent: filters.user_agent?.trim() || undefined,
            sort_by: sortBy as InventoryListSortField,
            sort_order: sortOrder,
            limit: urlLimit,
            offset: urlOffset,
        }),
        [listenerName, filters, sortBy, sortOrder, urlLimit, urlOffset],
    );

    // Path-grouped query params — /operations shares the exact /inventory
    // filter parser (same SINGULAR param names), so we reuse listParams and
    // only swap in the operations-specific sort field.
    const opsParams = useMemo<OperationsListParams>(
        () => ({ ...listParams, sort_by: sortBy as OperationsSortField }),
        [listParams, sortBy],
    );

    const ready = !!project && !!listenerName;
    // Only the active view's query runs (the others are disabled).
    const flatQuery = useApiInventory(listParams, ready && source === 'confirmed' && !isGrouped);
    const attackQuery = useApiInventoryAttackSurface(listParams, ready && isAttack);
    const opsQuery = useApiInventoryOperations(opsParams, ready && isGrouped);

    // The flat table is shared by confirmed-flat and attack-surface views.
    const flatActive = isAttack ? attackQuery : flatQuery;
    const flatData = flatActive.data;
    const opsData = opsQuery.data;
    const isLoading = isGrouped ? opsQuery.isLoading : flatActive.isLoading;
    const isFetching = isGrouped ? opsQuery.isFetching : flatActive.isFetching;
    const error = isGrouped ? opsQuery.error : flatActive.error;
    const refetch = () => (isGrouped ? opsQuery.refetch() : flatActive.refetch());

    // ---------- OpenAPI export ----------
    // Auth is a Bearer header, so a plain <a download> would 401 — fetch the
    // spec through the axios instance as a blob, then trigger the download.
    const [exporting, setExporting] = useState(false);
    const exportOpenApi = async (format: 'yaml' | 'json') => {
        if (!project) return;
        setExporting(true);
        try {
            const qp = new URLSearchParams({ project, format });
            if (listenerName) qp.set('listener_name', listenerName);
            if (filters.host?.trim()) qp.set('host', filters.host.trim());
            const res = await api.get(`/api/v3/inventory/openapi?${qp.toString()}`, {
                responseType: 'blob',
            });
            const cd = String(res.headers?.['content-disposition'] ?? '');
            const m = /filename="?([^"]+)"?/.exec(cd);
            const filename = m?.[1] || `openapi-${project}.${format}`;
            const url = URL.createObjectURL(res.data as Blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            message.success(`OpenAPI spec downloaded (${format.toUpperCase()})`);
        } catch {
            message.error('OpenAPI export failed.');
        } finally {
            setExporting(false);
        }
    };

    const columns: ColumnsType<InventoryDoc> = [
        {
            title: 'Method',
            dataIndex: 'method',
            key: 'method',
            width: 110,
            render: (m: string) => {
                if (!m) return <Text type="secondary" style={{ fontSize: 11 }}>—</Text>;
                const color = METHOD_COLOR[m] ?? 'default';
                return (
                    <Tag
                        className="auto-width-tag"
                        color={color}
                        style={{
                            margin: 0,
                            fontSize: 11,
                            letterSpacing: 0.3,
                            padding: '1px 10px',
                            minWidth: 60,
                            justifyContent: 'center',
                        }}
                    >
                        {m}
                    </Tag>
                );
            },
        },
        {
            title: 'Path',
            dataIndex: 'normalized_path',
            key: 'normalized_path',
            render: (p: string, r: InventoryDoc) => (
                <Link to={`/api-discovery/${encodeURIComponent(listenerName)}/endpoints/${r._id}`}>
                    <EndpointPath path={p} />
                </Link>
            ),
        },
        {
            title: 'Host',
            dataIndex: 'host',
            key: 'host',
            width: 200,
            ellipsis: true,
            render: (h: string) =>
                h ? (
                    <Text
                        style={{
                            fontSize: 12,
                            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                            color: 'var(--text-secondary)',
                        }}
                    >
                        {h}
                    </Text>
                ) : (
                    <Text type="secondary" style={{ fontSize: 11 }}>—</Text>
                ),
        },
        {
            title: (
                <InfoLabel info="Total number of requests collected for this endpoint since first_seen. Increments on every event flush (~250ms).">
                    Calls
                </InfoLabel>
            ),
            dataIndex: 'seen_count',
            key: 'seen_count',
            width: 100,
            align: 'right',
            sorter: true,
            sortOrder:
                sortBy === 'seen_count' ? (sortOrder === 'desc' ? 'descend' : 'ascend') : null,
            render: (n: number) => (
                <Text style={{ fontVariantNumeric: 'tabular-nums', fontSize: 12.5 }}>
                    {(n ?? 0).toLocaleString()}
                </Text>
            ),
        },
        {
            title: (
                <InfoLabel info="Server-error rate — sum of 5xx responses divided by total calls. Coloured by severity: ≥1% red, ≥0.1% amber.">
                    Errors
                </InfoLabel>
            ),
            key: 'errors',
            width: 100,
            align: 'right',
            render: (_: any, r: InventoryDoc) => {
                const errors = sum5xx(r.status_dist);
                const total = r.seen_count || 0;
                if (total === 0) {
                    return <Text type="secondary" style={{ fontSize: 11 }}>—</Text>;
                }
                const pct = (errors / total) * 100;
                if (pct === 0) {
                    // No errors at all — render as muted text so a healthy
                    // endpoint doesn't visually compete with the path/method.
                    return (
                        <Text
                            type="secondary"
                            style={{ fontSize: 12, fontVariantNumeric: 'tabular-nums' }}
                        >
                            0%
                        </Text>
                    );
                }
                const color = pct >= 1 ? 'red' : pct >= 0.1 ? 'orange' : 'gold';
                const label = pct < 0.01 ? '<0.01%' : `${pct.toFixed(2)}%`;
                return (
                    <Tag
                        className="auto-width-tag"
                        color={color}
                        style={{ margin: 0, fontVariantNumeric: 'tabular-nums' }}
                    >
                        {label}
                    </Tag>
                );
            },
        },
        {
            title: (
                <InfoLabel info="Slowest single request observed for this endpoint, in milliseconds (request → last downstream byte sent). Rendered in seconds when ≥1s; bolded when slow.">
                    Latency Max
                </InfoLabel>
            ),
            dataIndex: 'latency_max_ms',
            key: 'latency_max_ms',
            width: 120,
            align: 'right',
            sorter: true,
            sortOrder:
                sortBy === 'latency_max_ms' ? (sortOrder === 'desc' ? 'descend' : 'ascend') : null,
            render: (ms: number) => {
                if (!ms) return <Text type="secondary" style={{ fontSize: 11 }}>—</Text>;
                const slow = ms >= 1000;
                return (
                    <Text
                        style={{
                            fontSize: 12.5,
                            fontVariantNumeric: 'tabular-nums',
                            color: slow ? 'var(--color-warning)' : undefined,
                            fontWeight: slow ? 600 : 400,
                        }}
                    >
                        {slow ? `${(ms / 1000).toFixed(1)}s` : `${ms.toFixed(0)}ms`}
                    </Text>
                );
            },
        },
        {
            title: (
                <InfoLabel info={
                    <div>
                        <div style={{ fontWeight: 600, marginBottom: 4 }}>Threat — is something dangerous happening?</div>
                        <div style={{ marginBottom: 6 }}>
                            The THREAT axis (<code>max_risk_score</code>, 0–255). Active attack / abuse:
                            BOLA, BFLA, brute-force, scanner / vuln-probe / path-scan, replay,
                            rate &amp; IP anomalies, PII leak, oversized response, latency / error-rate
                            anomaly, sensitive-path, threat-intel hit.
                        </div>
                        <div style={{ marginBottom: 6, opacity: 0.85 }}>
                            <strong>How:</strong> each flag has a severity (Low 1 · Med 4 · High 7 ·
                            Critical 10). Per request the threat flags’ severities are summed; the
                            badge is the highest such sum ever seen on this endpoint (lifetime max,
                            not windowed). Config-hygiene issues live in the separate Exposure column.
                        </div>
                        <div style={{ opacity: 0.7, fontStyle: 'italic' }}>
                            Click the header to sort by threat score.
                        </div>
                    </div>
                }>
                    Threat
                </InfoLabel>
            ),
            // Backend supports sort_by=max_risk_score. The `key` doubles as
            // the sorter.field that Table.onChange forwards to our handler,
            // which translates it into the sort_by query param.
            key: 'max_risk_score',
            sorter: true,
            sortOrder:
                sortBy === 'max_risk_score'
                    ? sortOrder === 'desc'
                        ? 'descend'
                        : 'ascend'
                    : null,
            width: 280,
            render: (_: any, r: InventoryDoc) => {
                const score = r.max_risk_score ?? 0;
                const scoreColor =
                    score >= 25 ? 'var(--color-error)' : score >= 10 ? 'var(--color-warning)' : score > 0 ? '#d4a012' : 'var(--text-tertiary)';
                return (
                    <Space size={6} align="center">
                        <RiskFlagChips flags={r.risk_flags} />
                        {score > 0 && (
                            <Tooltip title={`Max risk score (sum of severities, capped at 255)`}>
                                <span
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 4,
                                        padding: '1px 6px',
                                        borderRadius: 4,
                                        background: 'var(--bg-elevated)',
                                        border: `1px solid ${scoreColor}33`,
                                        fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                                        fontSize: 11,
                                        fontWeight: 600,
                                        color: scoreColor,
                                        lineHeight: '16px',
                                    }}
                                >
                                    {score}
                                </span>
                            </Tooltip>
                        )}
                    </Space>
                );
            },
        },
        {
            title: (
                <InfoLabel info={
                    <div>
                        <div style={{ fontWeight: 600, marginBottom: 4 }}>Exposure — how open is the endpoint?</div>
                        <div style={{ marginBottom: 6 }}>
                            The EXPOSURE axis (<code>max_posture_score</code>, 0–255). Standing config
                            hygiene, independent of any active attack: anonymous access, plain-text
                            transport, weak / legacy TLS, missing HSTS / CSP / X-Frame /
                            X-Content-Type-Options, permissive CORS, version disclosure, weak token
                            TTL, internal / external host.
                        </div>
                        <div style={{ marginBottom: 6, opacity: 0.85 }}>
                            <strong>How:</strong> same severity weights (Low 1 · Med 4 · High 7 ·
                            Critical 10), but these “posture” flags get their own axis — they recur on
                            almost every request, so summing them into Threat would drown a real
                            attack. Badge = lifetime max of the per-request posture sum.
                        </div>
                        <div style={{ opacity: 0.7, fontStyle: 'italic' }}>
                            High exposure + low threat = “boring but open”; act on hardening. Click to
                            sort by exposure.
                        </div>
                    </div>
                }>
                    Exposure
                </InfoLabel>
            ),
            key: 'max_posture_score',
            sorter: true,
            sortOrder: sortBy === 'max_posture_score' ? (sortOrder === 'desc' ? 'descend' : 'ascend') : null,
            width: 110,
            render: (_: any, r: InventoryDoc) => {
                const score = r.max_posture_score ?? 0;
                return score > 0 ? (
                    <Tag color={postureTagColor(score)} className="auto-width-tag" style={{ margin: 0, fontVariantNumeric: 'tabular-nums' }}>{score}</Tag>
                ) : (
                    <Text type="secondary" style={{ fontSize: 11 }}>—</Text>
                );
            },
        },
        {
            title: 'Last Seen',
            dataIndex: 'last_seen',
            key: 'last_seen',
            width: 150,
            sorter: true,
            sortOrder: sortBy === 'last_seen' ? (sortOrder === 'desc' ? 'descend' : 'ascend') : null,
            render: (ts: string) => {
                if (!ts) return <Text type="secondary" style={{ fontSize: 11 }}>—</Text>;
                const fresh = Date.now() - new Date(ts).getTime() < 60 * 60 * 1000;
                return (
                    <Tooltip title={new Date(ts).toISOString()}>
                        <Space size={6}>
                            <span
                                style={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: '50%',
                                    background: fresh ? 'var(--color-success)' : 'var(--text-tertiary)',
                                    display: 'inline-block',
                                }}
                            />
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                {formatDistanceToNow(new Date(ts), { addSuffix: true })}
                            </Text>
                        </Space>
                    </Tooltip>
                );
            },
        },
    ];

    // Per-operation breakdown shown when a path-group is expanded.
    // A lightweight custom layout (not a nested antd Table) — an inline
    // table-in-a-table renders a heavy second header that looks out of place.
    const renderOperationsExpand = (group: OperationGroup) => {
        const W = { method: 80, protocol: 76, calls: 70, auth: 158, last: 120, detail: 56 };
        const head = (label: string, w?: number, align: 'left' | 'right' = 'left') => (
            <div
                style={{
                    width: w,
                    flex: w ? undefined : 1,
                    minWidth: w ? undefined : 180,
                    textAlign: align,
                    fontSize: 10,
                    textTransform: 'uppercase',
                    letterSpacing: 0.6,
                    color: 'var(--text-tertiary)',
                    fontWeight: 600,
                }}
            >
                {label}
            </div>
        );
        const ops = group.operations ?? [];
        return (
            <div>
                {/* light header row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '0 2px 8px', borderBottom: '1px solid var(--border-default)' }}>
                    {head('Method', W.method)}
                    {head('Protocol', W.protocol)}
                    {head('Calls', W.calls)}
                    {head('Auth', W.auth)}
                    {head('Threat / Exposure')}
                    {head('Last seen', W.last, 'right')}
                    <div style={{ width: W.detail }} />
                </div>
                {ops.map((op, i) => (
                    <div
                        key={`${op.method}__${op._id ?? op.protocol}__${i}`}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 14,
                            padding: '9px 2px',
                            borderTop: i === 0 ? 'none' : '1px solid var(--border-default)',
                        }}
                    >
                        <div style={{ width: W.method }}>
                            <Tag color={METHOD_COLOR[op.method] ?? 'default'} className="auto-width-tag" style={{ margin: 0, fontSize: 11 }}>
                                {op.method || '—'}
                            </Tag>
                        </div>
                        <div style={{ width: W.protocol }}>
                            <Text style={{ fontSize: 12 }}>{op.protocol || '—'}</Text>
                        </div>
                        <div style={{ width: W.calls }}>
                            <Text style={{ fontSize: 12, fontVariantNumeric: 'tabular-nums' }}>{formatCompactNumber(op.seen_count ?? 0)}</Text>
                        </div>
                        <div style={{ width: W.auth }}>
                            <Space direction="vertical" size={2}>
                                <AuthPostureBadge authObserved={op.auth_observed} noauthObserved={op.noauth_observed} size="sm" />
                                <AuthSchemesBadge schemes={op.auth_schemes} size="sm" />
                            </Space>
                        </div>
                        <div style={{ flex: 1, minWidth: 180 }}>
                            <Space size={6} wrap>
                                <Tooltip title="Threat score (max_risk_score)">
                                    <Tag color={threatTagColor(op.max_risk_score ?? 0)} className="auto-width-tag" style={{ margin: 0, fontSize: 11 }}>
                                        T {op.max_risk_score ?? 0}
                                    </Tag>
                                </Tooltip>
                                {(op.max_posture_score ?? 0) > 0 && (
                                    <Tooltip title="Exposure score (max_posture_score)">
                                        <Tag className='auto-width-tag' color={postureTagColor(op.max_posture_score ?? 0)} style={{ margin: 0, fontSize: 11 }}>
                                            E {op.max_posture_score}
                                        </Tag>
                                    </Tooltip>
                                )}
                                <RiskFlagChips flags={op.risk_flags} max={3} />
                            </Space>
                        </div>
                        <div style={{ width: W.last, textAlign: 'right' }}>
                            {op.last_seen ? (
                                <Tooltip title={new Date(op.last_seen).toISOString()}>
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        {formatDistanceToNow(new Date(op.last_seen), { addSuffix: true })}
                                    </Text>
                                </Tooltip>
                            ) : (
                                <Text type="secondary">—</Text>
                            )}
                        </div>
                        <div style={{ width: W.detail, textAlign: 'right' }}>
                            {/* Per-operation deep-link — operations[]._id (hex)
                               is the inventory doc id for the detail page. */}
                            {op._id && (
                                <Link to={`/api-discovery/${encodeURIComponent(listenerName)}/endpoints/${op._id}`}>
                                    <Tooltip title="Open operation detail">
                                        <Button type="link" size="small" icon={<EyeOutlined />} style={{ padding: 0 }} />
                                    </Tooltip>
                                </Link>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    // Mode-aware sort whitelist + shared handler (cancel-click flips the
    // direction so a server-sorted table never gets stuck).
    const activeSortFields: string[] = isGrouped ? OPERATIONS_SORT_FIELDS : SORT_FIELDS;
    const handleTableSort = (sorter: any, extra: { action: string }) => {
        if (extra.action !== 'sort') return;
        const s = Array.isArray(sorter) ? sorter[0] : sorter;
        const field = String(s?.columnKey ?? s?.field ?? '');
        let nextBy = sortBy;
        let nextOrder: 'asc' | 'desc';
        if (s?.order && activeSortFields.includes(field)) {
            nextBy = field;
            nextOrder = s.order === 'descend' ? 'desc' : 'asc';
        } else {
            nextOrder = sortOrder === 'desc' ? 'asc' : 'desc';
        }
        setSortBy(nextBy);
        setSortOrder(nextOrder);
        const next = new URLSearchParams(searchParams);
        next.set('sort_by', nextBy);
        next.set('sort_order', nextOrder);
        next.set('offset', '0');
        setSearchParams(next, { replace: true });
    };

    const opsColumns: ColumnsType<OperationGroup> = [
        {
            title: 'Path',
            dataIndex: 'normalized_path',
            key: 'normalized_path',
            render: (p: string) => <EndpointPath path={p} />,
        },
        {
            title: 'Host',
            dataIndex: 'host',
            key: 'host',
            width: 200,
            ellipsis: true,
            render: (h: string) =>
                h ? (
                    <Text style={{ fontSize: 12, fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace', color: 'var(--text-secondary)' }}>{h}</Text>
                ) : (
                    <Text type="secondary" style={{ fontSize: 11 }}>—</Text>
                ),
        },
        {
            title: 'Methods',
            dataIndex: 'methods',
            key: 'methods',
            width: 200,
            render: (methods: string[]) => (
                <Space size={4} wrap>
                    {(methods ?? []).map((m) => (
                        <Tag key={m} color={METHOD_COLOR[m] ?? 'default'} className="auto-width-tag" style={{ margin: 0, fontSize: 10 }}>
                            {m}
                        </Tag>
                    ))}
                </Space>
            ),
        },
        {
            title: 'Ops',
            dataIndex: 'operation_count',
            key: 'operation_count',
            width: 80,
            sorter: true,
            sortOrder: sortBy === 'operation_count' ? (sortOrder === 'desc' ? 'descend' : 'ascend') : null,
            render: (n: number) => <Text style={{ fontSize: 12, fontVariantNumeric: 'tabular-nums' }}>{n ?? 0}</Text>,
        },
        {
            title: 'Calls',
            dataIndex: 'total_seen',
            key: 'total_seen',
            width: 110,
            sorter: true,
            sortOrder: sortBy === 'total_seen' ? (sortOrder === 'desc' ? 'descend' : 'ascend') : null,
            render: (n: number) => <Text style={{ fontSize: 12, fontVariantNumeric: 'tabular-nums' }}>{formatCompactNumber(n ?? 0)}</Text>,
        },
        {
            title: <InfoLabel info="Threat axis (max_risk_score) — active attack / abuse, path rollup.">Threat</InfoLabel>,
            dataIndex: 'max_risk_score',
            key: 'max_risk_score',
            width: 90,
            sorter: true,
            sortOrder: sortBy === 'max_risk_score' ? (sortOrder === 'desc' ? 'descend' : 'ascend') : null,
            render: (n: number) => <Tag color={threatTagColor(n ?? 0)} className='auto-width-tag' style={{ margin: 0, fontSize: 11 }}>{n ?? 0}</Tag>,
        },
        {
            title: <InfoLabel info="Exposure axis (max_posture_score) — config hygiene (anonymous, plaintext, missing headers, CORS, weak TTL), path rollup.">Exposure</InfoLabel>,
            dataIndex: 'max_posture_score',
            key: 'max_posture_score',
            width: 100,
            sorter: true,
            sortOrder: sortBy === 'max_posture_score' ? (sortOrder === 'desc' ? 'descend' : 'ascend') : null,
            render: (n?: number) => (n ?? 0) > 0
                ? <Tag className='auto-width-tag' style={{ margin: 0, fontSize: 11, }} color={postureTagColor(n ?? 0)}>{n}</Tag>
                : <Text type="secondary" style={{ fontSize: 11 }}>—</Text>,
        },
        {
            title: 'Last Seen',
            dataIndex: 'last_seen',
            key: 'last_seen',
            width: 150,
            sorter: true,
            sortOrder: sortBy === 'last_seen' ? (sortOrder === 'desc' ? 'descend' : 'ascend') : null,
            render: (ts: string) =>
                ts ? (
                    <Tooltip title={new Date(ts).toISOString()}>
                        <Text type="secondary" style={{ fontSize: 12 }}>{formatDistanceToNow(new Date(ts), { addSuffix: true })}</Text>
                    </Tooltip>
                ) : (
                    <Text type="secondary">—</Text>
                ),
        },
    ];

    return (
        <div style={{ padding: '0px' }}>
            {/* Hero header — same pattern as Page 1: gradient bg, icon
                box, title + subtitle on the left, KPI pills + Refresh on
                the right. Detailed visuals (hosts list, status bar, risk
                flags) hang underneath as a thin sub-row so the strip
                stays single-glance. */}
            <div
                style={{
                    background:
                        'linear-gradient(135deg, var(--color-primary-light) 0%, transparent 100%)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 12,
                    padding: '20px 24px',
                    marginBottom: 16,
                }}
            >
                {/* Top row — identity (back, icon, title, subtitle). */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                    <BackButton onClick={() => navigate('/api-discovery')} />
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
                            {listenerName}
                        </Title>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Endpoints discovered under this listener. Click any path to drill into
                            its events, analytics, and geo insights.
                        </Text>
                    </div>
                </div>

                {/* KPI / action row — divider above; KPIs left, Refresh right. */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 12,
                        marginTop: 14,
                        paddingTop: 14,
                        borderTop: '1px solid var(--border-default)',
                    }}
                >
                    <Space size={24} wrap>
                        <KpiPill
                            label="Endpoints"
                            value={formatCompactNumber(summary?.normalized_path_count ?? 0)}
                            accent="var(--color-primary)"
                        />
                        <KpiPill
                            label="Hosts"
                            value={formatCompactNumber(summary?.hostnames?.length ?? 0)}
                            accent="var(--color-success)"
                        />
                        <KpiPill
                            label="Risk flags"
                            value={formatCompactNumber(summary?.risk_flags?.length ?? 0)}
                            accent="var(--color-warning)"
                        />
                    </Space>
                    <Space size={8} wrap>
                        <Dropdown
                            trigger={['click']}
                            disabled={exporting}
                            menu={{
                                items: [
                                    { key: 'yaml', label: 'Download YAML', onClick: () => exportOpenApi('yaml') },
                                    { key: 'json', label: 'Download JSON', onClick: () => exportOpenApi('json') },
                                ],
                            }}
                        >
                            <Button icon={<DownloadOutlined />} loading={exporting}>
                                Export OpenAPI
                            </Button>
                        </Dropdown>
                        <Button
                            icon={<ReloadOutlined spin={isFetching || summaryQuery.isFetching} />}
                            onClick={() => {
                                summaryQuery.refetch();
                                refetch();
                            }}
                            loading={isFetching || summaryQuery.isFetching}
                        >
                            Refresh
                        </Button>
                    </Space>
                </div>

                {/* Sub-strip — visual extras (hosts chips, status bar, risk chips)
                    arranged horizontally so they don't dominate the header. */}
                {summary && (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 24,
                            marginTop: 16,
                            paddingTop: 14,
                            borderTop: '1px solid var(--border-default)',
                        }}
                    >
                        {(summary.hostnames?.length ?? 0) > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <Text type="secondary" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
                                    Hosts
                                </Text>
                                <Space size={[6, 6]} wrap>
                                    {summary.hostnames.slice(0, 6).map((h: string) => (
                                        <Tag
                                            key={h}
                                            className="auto-width-tag"
                                            style={{
                                                margin: 0,
                                                fontSize: 11,
                                                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                                                fontWeight: 400,
                                            }}
                                        >
                                            {h}
                                        </Tag>
                                    ))}
                                    {summary.hostnames.length > 6 && (
                                        <Tag className="auto-width-tag" style={{ margin: 0, fontSize: 11 }}>
                                            +{summary.hostnames.length - 6}
                                        </Tag>
                                    )}
                                </Space>
                            </div>
                        )}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <Text type="secondary" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
                                Status
                            </Text>
                            <StatusDistBar
                                statusDist={summary.status_dist ?? {}}
                                width={220}
                                height={10}
                            />
                        </div>
                        {(summary.risk_flags?.length ?? 0) > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <Text type="secondary" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
                                    Risk
                                </Text>
                                <RiskFlagChips flags={summary.risk_flags} max={4} />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Filter panel */}
            <Card size="small" style={{ marginBottom: 16, borderRadius: 8 }}>
                <Collapse
                    ghost
                    defaultActiveKey={[]}
                    items={[
                        {
                            key: 'filters',
                            label: (
                                <Space>
                                    <FilterOutlined />
                                    <Text strong>Filters</Text>
                                </Space>
                            ),
                            children: (
                                <>
                                    <Row gutter={[12, 12]}>
                                        {/* Row 1 — method / protocol / risk flag (3 × md=8 = 24) */}
                                        <Col xs={24} md={8}>
                                            <Text style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                                                Method
                                            </Text>
                                            <Select
                                                mode="multiple"
                                                allowClear
                                                style={{ width: '100%' }}
                                                placeholder="Any"
                                                value={draftFilters.method}
                                                onChange={(v) => setDraftFilters({ ...draftFilters, method: v })}
                                                options={METHODS.map((m) => ({ label: m, value: m }))}
                                            />
                                        </Col>
                                        <Col xs={24} md={8}>
                                            <Text style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                                                Protocol
                                            </Text>
                                            <Select
                                                mode="multiple"
                                                allowClear
                                                style={{ width: '100%' }}
                                                placeholder="Any"
                                                value={draftFilters.protocol}
                                                onChange={(v) => setDraftFilters({ ...draftFilters, protocol: v })}
                                                options={PROTOCOLS.map((p) => ({ label: p, value: p }))}
                                            />
                                        </Col>
                                        <Col xs={24} md={8}>
                                            <Text style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                                                Risk Flag
                                            </Text>
                                            <Select
                                                mode="multiple"
                                                allowClear
                                                style={{ width: '100%' }}
                                                placeholder="Any"
                                                value={draftFilters.risk_flag}
                                                onChange={(v) =>
                                                    setDraftFilters({ ...draftFilters, risk_flag: v })
                                                }
                                                options={KNOWN_RISK_FLAGS.map((f) => ({
                                                    label: riskFlagLabel(f),
                                                    value: f,
                                                }))}
                                            />
                                        </Col>
                                        {/* Row 2 — PII / endpoint (2 × md=12 = 24) */}
                                        <Col xs={24} md={12}>
                                            <Text style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                                                PII Category
                                            </Text>
                                            <Select
                                                mode="multiple"
                                                allowClear
                                                style={{ width: '100%' }}
                                                placeholder="Any"
                                                value={draftFilters.pii_category}
                                                onChange={(v) =>
                                                    setDraftFilters({ ...draftFilters, pii_category: v })
                                                }
                                                options={KNOWN_PII_CATEGORIES.map((p) => ({
                                                    label: riskFlagLabel(p),
                                                    value: p,
                                                }))}
                                            />
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <Text style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                                                Endpoint Category
                                            </Text>
                                            <Select
                                                mode="multiple"
                                                allowClear
                                                style={{ width: '100%' }}
                                                placeholder="Any"
                                                value={draftFilters.endpoint_category}
                                                onChange={(v) =>
                                                    setDraftFilters({
                                                        ...draftFilters,
                                                        endpoint_category: v,
                                                    })
                                                }
                                                options={KNOWN_ENDPOINT_CATEGORIES.map((c) => ({
                                                    label: riskFlagLabel(c),
                                                    value: c,
                                                }))}
                                            />
                                        </Col>
                                        {/* Row 2b — host / path prefix filters (2 × md=12 = 24) */}
                                        <Col xs={24} md={12}>
                                            <Text style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                                                <InfoLabel info="Prefix match on the Host header (Mongo `^value` regex, case-sensitive). e.g. `api.` matches api.example.com.">
                                                    Host
                                                </InfoLabel>
                                            </Text>
                                            <Input
                                                placeholder="api.example.com"
                                                value={draftFilters.host ?? ''}
                                                onChange={(e) =>
                                                    setDraftFilters({ ...draftFilters, host: e.target.value })
                                                }
                                                onPressEnter={applyFilters}
                                                style={{
                                                    width: '100%',
                                                    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                                                }}
                                                allowClear
                                            />
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <Text style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                                                <InfoLabel info="Prefix match on the normalized (templated) path — e.g. `/api/v1/` matches every endpoint under that prefix. Case-sensitive.">
                                                    Path prefix
                                                </InfoLabel>
                                            </Text>
                                            <Input
                                                placeholder="/api/v1/"
                                                value={draftFilters.normalized_path ?? ''}
                                                onChange={(e) =>
                                                    setDraftFilters({ ...draftFilters, normalized_path: e.target.value })
                                                }
                                                onPressEnter={applyFilters}
                                                style={{
                                                    width: '100%',
                                                    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                                                }}
                                                allowClear
                                            />
                                        </Col>
                                        {/* Row 3 — geo + raw cross-filters (4 × md=6 = 24) */}
                                        <Col xs={12} md={6}>
                                            <Text style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                                                <InfoLabel info="ISO-3166 α-2 country code (e.g. TR, US, DE). Resolves to endpoints that have served traffic from this country within the geo filter time window (default last 7 days). Requires ClickHouse.">
                                                    Country
                                                </InfoLabel>
                                            </Text>
                                            <Input
                                                placeholder="TR"
                                                maxLength={2}
                                                value={draftFilters.country ?? ''}
                                                onChange={(e) =>
                                                    setDraftFilters({
                                                        ...draftFilters,
                                                        country: e.target.value.toUpperCase().slice(0, 2),
                                                    })
                                                }
                                                style={{
                                                    width: '100%',
                                                    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                                                    textTransform: 'uppercase',
                                                }}
                                                allowClear
                                            />
                                        </Col>
                                        <Col xs={12} md={6}>
                                            <Text style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                                                <InfoLabel info="Autonomous System Number — the network operator the source IP belongs to. Enter a number (e.g. 12735 for TurkTelecom). Same time-window semantics as Country.">
                                                    ASN
                                                </InfoLabel>
                                            </Text>
                                            <Input
                                                placeholder="12735"
                                                value={draftFilters.asn ?? ''}
                                                onChange={(e) =>
                                                    setDraftFilters({
                                                        ...draftFilters,
                                                        asn: e.target.value.replace(/[^0-9]/g, ''),
                                                    })
                                                }
                                                style={{
                                                    width: '100%',
                                                    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                                                }}
                                                allowClear
                                            />
                                        </Col>
                                        <Col xs={24} md={6}>
                                            <Text style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                                                <InfoLabel info="Exact source IP (IPv4 or IPv6) — the Envoy downstream connection IP, not parsed from X-Forwarded-For. Behind an edge / CDN, set Envoy's xff_num_trusted_hops for the real client IP. Only matches when the collector keeps raw IPs (Policy.StoreRawSourceIP=true) — otherwise returns 0 results.">
                                                    Source IP
                                                </InfoLabel>
                                            </Text>
                                            <Input
                                                placeholder="78.187.123.45"
                                                value={draftFilters.source_ip ?? ''}
                                                onChange={(e) =>
                                                    setDraftFilters({
                                                        ...draftFilters,
                                                        source_ip: e.target.value,
                                                    })
                                                }
                                                style={{
                                                    width: '100%',
                                                    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                                                }}
                                                allowClear
                                            />
                                        </Col>
                                        <Col xs={24} md={6}>
                                            <Text style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                                                <InfoLabel info="Exact User-Agent string. Only matches when the collector's compliance config keeps raw UAs (Policy.StoreRawUserAgent=true). Copy from the events tab or the Top User Agents list in Insights.">
                                                    User-Agent
                                                </InfoLabel>
                                            </Text>
                                            <Input
                                                placeholder="Mozilla/5.0 …"
                                                value={draftFilters.user_agent ?? ''}
                                                onChange={(e) =>
                                                    setDraftFilters({
                                                        ...draftFilters,
                                                        user_agent: e.target.value,
                                                    })
                                                }
                                                style={{
                                                    width: '100%',
                                                    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                                                }}
                                                allowClear
                                            />
                                        </Col>
                                        {/* Row 4 — ranges (2 × md=12 = 24) */}
                                        <Col xs={24} md={12}>
                                            <Text style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                                                Risk score range ({draftFilters.min_risk_score}–
                                                {draftFilters.max_risk_score})
                                            </Text>
                                            <Slider
                                                range
                                                min={0}
                                                max={255}
                                                value={[draftFilters.min_risk_score, draftFilters.max_risk_score]}
                                                onChange={(v) =>
                                                    setDraftFilters({
                                                        ...draftFilters,
                                                        min_risk_score: (v as number[])[0],
                                                        max_risk_score: (v as number[])[1],
                                                    })
                                                }
                                            />
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <Text style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                                                Last seen
                                            </Text>
                                            <RangePicker
                                                style={{ width: '100%' }}
                                                format="YYYY-MM-DD"
                                                placeholder={['From', 'To']}
                                                value={
                                                    draftFilters.last_seen_from && draftFilters.last_seen_to
                                                        ? [
                                                            dayjs(draftFilters.last_seen_from),
                                                            dayjs(draftFilters.last_seen_to),
                                                        ]
                                                        : null
                                                }
                                                onChange={(dates) => {
                                                    if (!dates || !dates[0] || !dates[1]) {
                                                        setDraftFilters({
                                                            ...draftFilters,
                                                            last_seen_from: undefined,
                                                            last_seen_to: undefined,
                                                        });
                                                    } else {
                                                        // Snap to start-of-day / end-of-day so the
                                                        // displayed range matches the user's mental
                                                        // model. ISO timestamps still go to the API.
                                                        setDraftFilters({
                                                            ...draftFilters,
                                                            last_seen_from: dates[0].startOf('day').toISOString(),
                                                            last_seen_to: dates[1].endOf('day').toISOString(),
                                                        });
                                                    }
                                                }}
                                                presets={[
                                                    { label: 'Today', value: [dayjs(), dayjs()] },
                                                    { label: 'Last 7 days', value: [dayjs().subtract(7, 'day'), dayjs()] },
                                                    { label: 'Last 30 days', value: [dayjs().subtract(30, 'day'), dayjs()] },
                                                ]}
                                            />
                                        </Col>
                                    </Row>
                                    <Divider style={{ margin: '12px 0' }} />
                                    <Space>
                                        <Button type="primary" onClick={applyFilters}>
                                            Apply
                                        </Button>
                                        <Button onClick={resetFilters}>Reset</Button>
                                    </Space>
                                </>
                            ),
                        },
                    ]}
                />
            </Card>

            {/* Catalog controls — confirmed vs attack-surface, flat vs grouped */}
            <div
                className="api-discovery-toggles"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 12 }}
            >
                <Space size={24} wrap>
                    <Space size={10}>
                        <span className="toggle-label">Catalog</span>
                        <Segmented
                            value={source}
                            onChange={(v) => setSource(v as 'confirmed' | 'attack')}
                            options={[
                                { label: 'Confirmed', value: 'confirmed' },
                                { label: 'Attack surface', value: 'attack' },
                            ]}
                        />
                    </Space>
                    {!isAttack && (
                        <Space size={10}>
                            <span className="toggle-label">View</span>
                            <Segmented
                                value={layout}
                                onChange={(v) => setLayout(v as 'flat' | 'grouped')}
                                options={[
                                    { label: 'Flat', value: 'flat' },
                                    { label: 'Group by path', value: 'grouped' },
                                ]}
                            />
                        </Space>
                    )}
                    <Popover content={SCORING_GUIDE} trigger="click" placement="bottomLeft">
                        <Button size="small" type="text" icon={<QuestionCircleOutlined />}>
                            Scoring guide
                        </Button>
                    </Popover>
                </Space>
                {isAttack && (
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        Probe / scanner noise (unconfirmed) — <code>/.env</code>, <code>/cgi-bin</code> probes, SPA-fallback 200s. Not part of the real API catalog.
                    </Text>
                )}
            </div>

            {/* Table */}
            <Card size="small" style={{ borderRadius: 10, border: '1px solid var(--border-default)' }} styles={{ body: { padding: 0 } }}>
                {isGrouped ? (
                    <Table<OperationGroup>
                        className="api-discovery-endpoints-table"
                        rowKey={(g) => `${g.host}__${g.normalized_path}`}
                        columns={opsColumns}
                        scroll={{ x: 'max-content' }}
                        dataSource={opsData?.data ?? []}
                        loading={isLoading}
                        size="middle"
                        expandable={{ expandedRowRender: renderOperationsExpand }}
                        locale={{
                            emptyText: error ? (
                                <Empty description={<Text type="secondary">Failed to load endpoints. Try Refresh.</Text>} />
                            ) : (
                                <Empty description={<Text type="secondary">No endpoints match the current filters.</Text>} />
                            ),
                        }}
                        onChange={(_pag, _filt, sorter, extra) => handleTableSort(sorter, extra)}
                        pagination={{
                            current: opsData?.current_page ?? 1,
                            pageSize: urlLimit,
                            total: opsData?.total_count ?? 0,
                            showSizeChanger: true,
                            pageSizeOptions: ['10', '20', '50', '100'],
                            showQuickJumper: true,
                            showTotal: (total, range) => `${range[0]}–${range[1]} of ${total.toLocaleString()} paths`,
                            onChange: (page, size) => {
                                const next = new URLSearchParams(searchParams);
                                next.set('limit', String(size));
                                next.set('offset', String((page - 1) * size));
                                setSearchParams(next, { replace: true });
                            },
                        }}
                    />
                ) : (
                    <Table<InventoryDoc>
                        className="api-discovery-endpoints-table"
                        rowKey="_id"
                        columns={columns}
                        scroll={{ x: 'max-content' }}
                        dataSource={flatData?.data ?? []}
                        loading={isLoading}
                        size="middle"
                        rowClassName={() => 'api-discovery-endpoint-row'}
                        locale={{
                            emptyText: error ? (
                                <Empty description={<Text type="secondary">Failed to load endpoints. Try Refresh.</Text>} />
                            ) : (
                                <Empty
                                    description={
                                        <Text type="secondary">
                                            {isAttack
                                                ? 'No attack-surface activity — no probe / scanner noise recorded.'
                                                : 'No endpoints match the current filters.'}
                                        </Text>
                                    }
                                />
                            ),
                        }}
                        onChange={(_pag, _filt, sorter, extra) => handleTableSort(sorter, extra)}
                        pagination={{
                            current: flatData?.current_page ?? 1,
                            pageSize: urlLimit,
                            total: flatData?.total_count ?? 0,
                            showSizeChanger: true,
                            pageSizeOptions: ['10', '20', '50', '100'],
                            showQuickJumper: true,
                            showTotal: (total, range) =>
                                `${range[0]}–${range[1]} of ${total.toLocaleString()} endpoints`,
                            onChange: (page, size) => {
                                const next = new URLSearchParams(searchParams);
                                next.set('limit', String(size));
                                next.set('offset', String((page - 1) * size));
                                setSearchParams(next, { replace: true });
                            },
                        }}
                    />
                )}
            </Card>

            <style>{`
                .api-discovery-endpoint-row:hover td {
                    background: var(--bg-hover, var(--bg-elevated)) !important;
                    cursor: pointer;
                }
                /* Give the first / last cells horizontal breathing room so
                 * content doesn't kiss the card border. Scoped by className
                 * to avoid hitting other tables on the page (filter Collapse,
                 * future summary tables, etc.). */
                .api-discovery-endpoints-table .ant-table-thead > tr > th:first-child,
                .api-discovery-endpoints-table .ant-table-tbody > tr > td:first-child {
                    padding-left: 20px !important;
                }
                .api-discovery-endpoints-table .ant-table-thead > tr > th:last-child,
                .api-discovery-endpoints-table .ant-table-tbody > tr > td:last-child {
                    padding-right: 20px !important;
                }
                /* Expanded path-grouped row: a clean tinted inset holding the
                 * custom per-operation layout. The outer first/last-cell
                 * padding (descendant selector) would leak onto this single
                 * expanded cell, so we set an even inset explicitly. */
                .api-discovery-endpoints-table .ant-table-expanded-row > td {
                    background: var(--bg-elevated) !important;
                    padding: 10px 18px !important;
                }
                /* Catalog / View are field titles, not interactive controls. */
                .api-discovery-toggles .toggle-label {
                    font-size: 11px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.6px;
                    color: var(--text-tertiary);
                    cursor: default;
                    user-select: none;
                }
                /* Separate the segmented options so they don't read as one
                 * joined bar (and so adjacent hover backgrounds don't merge). */
                .api-discovery-toggles .ant-segmented .ant-segmented-group {
                    gap: 4px;
                }
            `}</style>
        </div>
    );
};

export default ApiDiscoveryEndpoints;
