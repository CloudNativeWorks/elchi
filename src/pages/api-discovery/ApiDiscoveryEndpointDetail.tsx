import React, { useMemo, useState } from 'react';
import {
    Tabs,
    Card,
    Row,
    Col,
    Typography,
    Tag,
    Space,
    Spin,
    Alert,
    Empty,
    Button,
    Select,
    InputNumber,
    Input,
    Switch,
    Tooltip,
    Radio,
    Table,
    Descriptions,
    Segmented,
    Dropdown,
    Modal,
    message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    EyeOutlined,
    ReloadOutlined,
    CopyOutlined,
    LineChartOutlined,
    WarningOutlined,
    SafetyOutlined,
    ExportOutlined,
    MoreOutlined,
    DeleteOutlined,
} from '@ant-design/icons';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import ComponentLoadErrorBoundary from '@/components/ComponentLoadErrorBoundary';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { TooltipComponent, LegendComponent, TitleComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import dayjs from 'dayjs';
import { formatDistanceToNow } from 'date-fns';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import {
    useApiInventoryDetail,
    useApiInventoryEvents,
    useApiInventoryStats,
    useApiInventoryGeo,
    useApiInventoryDeleteEndpoint,
    useApiInventoryResetEndpoint,
} from '@/hooks/useApiDiscovery';
import useAuth from '@/hooks/useUserDetails';
import { useChartTheme } from '@/utils/chartTheme';
import LatencyBucketsChart from './components/LatencyBucketsChart';
import MetricLineChart, { type MetricLineSeries } from './components/MetricLineChart';
import TimeRangePicker, { defaultTimeRange, type TimeRange } from './components/TimeRangePicker';
import RiskFlagChips from './components/RiskFlagChips';
import AuthPostureBadge from './components/AuthPostureBadge';
import InfoLabel from './components/InfoLabel';
import KpiPill from './components/KpiPill';
import BackButton from './components/BackButton';
import SamplingBadge from './components/SamplingBadge';
import AuthSchemesBadge from './components/AuthSchemesBadge';
import { CONSUMER_INFO } from './lib/consumerInfo';
import { formatCompactNumber, formatBytes } from './lib/formatNumber';
import {
    riskFlagLabel,
    ENDPOINT_CATEGORY_META,
    PII_CATEGORY_META,
    KNOWN_RISK_FLAGS,
    splitFlagsByAxis,
} from './lib/riskFlagCatalog';
import { buildActionPlan, MITIGATION_TYPE_META } from './lib/riskRemediationGuide';
import { countryFlag } from './lib/countryFlag';
import { antdToSort, columnSortOrder, type SortState } from './lib/tableSort';
import type {
    InventoryDoc,
    RawEvent,
    Granularity,
    GeoCountry,
    GeoASN,
    GeoCity,
    UAFamily,
    TISource,
    RawUserAgent,
    RawSourceIP,
    EventsSortField,
} from './types';

const EVENTS_DEFAULT_SORT: SortState<EventsSortField> = { sort_by: 'ts', sort_order: 'desc' };

// Events-tab filter set. Staged in `draft`, committed to `applied` (which
// drives the query) only when the user clicks Apply — no request fires
// while typing.
interface EventFilters {
    method?: string;
    statusMin?: number;
    statusMax?: number;
    requestId: string;
    riskFlags: string[];
    minRiskScore?: number;
}
const EMPTY_EVENT_FILTERS: EventFilters = { requestId: '', riskFlags: [] };

echarts.use([PieChart, TooltipComponent, LegendComponent, TitleComponent, CanvasRenderer]);

const { Title, Text, Paragraph } = Typography;

// Small labelled wrapper — gives the events filter bar visual structure
// instead of a flat row of placeholder-only inputs.
const FilterField: React.FC<{ label: string; width?: number; children: React.ReactNode }> = ({
    label,
    width,
    children,
}) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3, width }}>
        <Text style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.6, color: 'var(--text-tertiary)' }}>
            {label}
        </Text>
        {children}
    </div>
);

// Method → tag color (mirrors METHOD_COLOR in ApiDiscoveryEndpoints).
// Keep this in sync: every method should resolve to a real preset so
// dark mode doesn't fall back to a flat grey chip.
const METHOD_HEADER_COLOR: Record<string, string> = {
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

// ---------- Overview Tab ----------

const StatusDonut: React.FC<{ statusDist: Record<string, number> }> = ({ statusDist }) => {
    const { options: themeOpts } = useChartTheme();
    const option = useMemo(() => {
        const buckets = { '1xx': 0, '2xx': 0, '3xx': 0, '4xx': 0, '5xx': 0 };
        for (const [code, n] of Object.entries(statusDist ?? {})) {
            const c = parseInt(code, 10);
            if (Number.isNaN(c)) continue;
            const k = `${Math.min(Math.max(Math.floor(c / 100), 1), 5)}xx` as keyof typeof buckets;
            buckets[k] += n;
        }
        const data = [
            { name: '2xx', value: buckets['2xx'], itemStyle: { color: '#10b981' } },
            { name: '3xx', value: buckets['3xx'], itemStyle: { color: '#3b82f6' } },
            { name: '4xx', value: buckets['4xx'], itemStyle: { color: '#f59e0b' } },
            { name: '5xx', value: buckets['5xx'], itemStyle: { color: '#ef4444' } },
            { name: '1xx', value: buckets['1xx'], itemStyle: { color: '#9ca3af' } },
        ].filter((d) => d.value > 0);
        return {
            ...themeOpts,
            // Pie/donut has no axes; explicitly null out the theme's default
            // x/y axis blocks so echarts doesn't render their lines behind
            // the chart (visible as a horizontal stripe across the donut).
            xAxis: undefined,
            yAxis: undefined,
            grid: undefined,
            tooltip: {
                ...themeOpts.tooltip,
                trigger: 'item',
                formatter: (p: any) =>
                    `<strong>${p.name}</strong><br/>${p.value.toLocaleString()} (${p.percent}%)`,
            },
            legend: { ...themeOpts.legend, bottom: 8, itemWidth: 10, itemHeight: 8 },
            series: [
                {
                    type: 'pie',
                    radius: ['46%', '70%'],
                    // Push the donut up so its bottom edge clears the legend.
                    center: ['50%', '42%'],
                    avoidLabelOverlap: false,
                    label: { show: false },
                    labelLine: { show: false },
                    data,
                },
            ],
        };
    }, [statusDist, themeOpts]);

    return <ReactEChartsCore echarts={echarts} option={option} style={{ height: 240, width: '100%' }} notMerge />;
};

const ChipCluster: React.FC<{ items?: string[]; color?: string; label: React.ReactNode; mono?: boolean }> = ({
    items,
    color,
    label,
    mono,
}) => {
    if (!items?.length) return null;
    return (
        <div>
            <div style={{ marginBottom: 6 }}>
                <Text type="secondary" style={{ fontSize: 11 }}>
                    {label}
                </Text>
            </div>
            <Space size={[6, 6]} wrap>
                {items.map((v) => (
                    <Tag
                        key={v}
                        className="auto-width-tag"
                        color={color}
                        style={{
                            margin: 0,
                            fontSize: 11,
                            fontFamily: mono ? 'Monaco, Menlo, "Ubuntu Mono", monospace' : undefined,
                            fontWeight: mono ? 400 : 500,
                        }}
                    >
                        {mono ? v : v.includes('_') ? riskFlagLabel(v) : v}
                    </Tag>
                ))}
            </Space>
        </div>
    );
};

const KpiTile: React.FC<{ label: React.ReactNode; children: React.ReactNode }> = ({ label, children }) => (
    <Card size="small" style={{ borderRadius: 8, height: '100%' }}>
        <div style={{ marginBottom: 6 }}>
            <Text type="secondary" style={{ fontSize: 11 }}>
                {label}
            </Text>
        </div>
        {children}
    </Card>
);

// Bands kept in lockstep with RISK_SCORE_LEGEND / scoreBand in riskFlagCatalog.ts.
const riskColor = (s: number): string =>
    s >= 40 ? '#ef4444' : s >= 25 ? '#fa541c' : s >= 10 ? '#f59e0b' : s > 0 ? '#fbbf24' : '#9ca3af';

// Exposure (max_posture_score) — distinct blue/purple ramp so the two
// axes never read as the same scale.
const postureColor = (s: number): string =>
    s >= 40 ? '#c41d7f' : s >= 25 ? '#722ed1' : s >= 10 ? '#1677ff' : s > 0 ? '#69b1ff' : '#9ca3af';

const OverviewTab: React.FC<{ doc: InventoryDoc }> = ({ doc }) => {
    const [overviewParams, setOverviewParams] = useSearchParams();
    // Deep-link into the Events tab in sample mode.
    const openSampleEvents = () => {
        const np = new URLSearchParams(overviewParams);
        np.set('tab', 'events');
        np.set('sample', '1');
        setOverviewParams(np, { replace: true });
    };

    return (
        <>
            <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
                <Col xs={12} md={6}>
                    <KpiTile
                        label={
                            <InfoLabel
                                info={
                                    <span>
                                        All-time cumulative request count for this exact endpoint
                                        (method + normalized path + host + listener). A running
                                        counter the collector increments on every observed request —
                                        it is <strong>not</strong> time-windowed.
                                        {doc.first_seen
                                            ? ` Counted since the endpoint was first seen: ${new Date(
                                                  doc.first_seen,
                                              ).toLocaleString()}.`
                                            : ''}
                                    </span>
                                }
                            >
                                Total Calls
                            </InfoLabel>
                        }
                    >
                        <Tooltip title={(doc.seen_count ?? 0).toLocaleString()}>
                            <Title level={3} style={{ margin: 0 }}>
                                {formatCompactNumber(doc.seen_count ?? 0)}
                            </Title>
                        </Tooltip>
                    </KpiTile>
                </Col>
                <Col xs={12} md={6}>
                    <KpiTile label={<InfoLabel info="Slowest single request ever observed for this endpoint (request → last downstream byte sent).">Max Latency</InfoLabel>}>
                        <Title level={3} style={{ margin: 0 }}>
                            {doc.latency_max_ms
                                ? doc.latency_max_ms < 1000
                                    ? `${doc.latency_max_ms.toFixed(0)}ms`
                                    : `${(doc.latency_max_ms / 1000).toFixed(1)}s`
                                : '—'}
                        </Title>
                    </KpiTile>
                </Col>
                <Col xs={12} md={6}>
                    <KpiTile
                        label={
                            <InfoLabel
                                info={
                                    <div>
                                        <div style={{ fontWeight: 600, marginBottom: 4 }}>Two-axis score — lifetime max, 0–255</div>
                                        <div style={{ marginBottom: 4 }}>
                                            <strong>T — Threat:</strong> is something dangerous happening? BOLA, BFLA, brute-force, scanner / vuln-probe, replay, rate anomaly, PII leak, behaviour anomaly.
                                        </div>
                                        <div style={{ marginBottom: 4 }}>
                                            <strong>E — Exposure:</strong> how open is it? Anonymous access, plain-text / weak TLS, missing security headers, permissive CORS, weak token TTL. Recurs on most requests, so it gets its own axis.
                                        </div>
                                        <div style={{ opacity: 0.8 }}>
                                            Each flag has a severity (Low 1 · Med 4 · High 7 · Critical 10); per request the relevant flags’ severities are summed, and this is the highest sum ever seen on this endpoint.
                                        </div>
                                    </div>
                                }
                            >
                                Threat / Exposure
                            </InfoLabel>
                        }
                    >
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                            <Tooltip title="Threat (max_risk_score)">
                                <span style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                                    <Title level={3} style={{ margin: 0, color: riskColor(doc.max_risk_score ?? 0) }}>
                                        {doc.max_risk_score ?? 0}
                                    </Title>
                                    <Text type="secondary" style={{ fontSize: 10 }}>T</Text>
                                </span>
                            </Tooltip>
                            <Text type="secondary" style={{ fontSize: 14 }}>/</Text>
                            <Tooltip title="Exposure (max_posture_score)">
                                <span style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                                    <Title level={3} style={{ margin: 0, color: postureColor(doc.max_posture_score ?? 0) }}>
                                        {doc.max_posture_score ?? 0}
                                    </Title>
                                    <Text type="secondary" style={{ fontSize: 10 }}>E</Text>
                                </span>
                            </Tooltip>
                        </div>
                    </KpiTile>
                </Col>
                <Col xs={12} md={6}>
                    <KpiTile label={<InfoLabel info="Whether requests for this endpoint have carried an auth header (Authorization, Cookie, X-Api-Key, …). 'Inconsistent' means some did and some did not — usually mid-rollout or conditional routes.">Auth Posture</InfoLabel>}>
                        <div style={{ marginTop: 4 }}>
                            <AuthPostureBadge
                                authObserved={doc.auth_observed}
                                noauthObserved={doc.noauth_observed}
                            />
                        </div>
                    </KpiTile>
                </Col>
            </Row>

            {/* Response-size KPIs — cumulative egress, peak, derived mean. */}
            <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
                <Col xs={12} md={8}>
                    <KpiTile label={<InfoLabel info="Cumulative response body bytes sent across every call to this endpoint since it was first seen. A running counter (not time-windowed) — useful for spotting heavy data egress.">Total Egress</InfoLabel>}>
                        <Tooltip title={`${(doc.response_bytes_total ?? 0).toLocaleString()} bytes`}>
                            <Title level={3} style={{ margin: 0 }}>
                                {formatBytes(doc.response_bytes_total ?? 0)}
                            </Title>
                        </Tooltip>
                    </KpiTile>
                </Col>
                <Col xs={12} md={8}>
                    <KpiTile label={<InfoLabel info="Largest single response body ever observed for this endpoint. A sudden jump can be a data-exfiltration canary (see the oversized_response risk flag).">Largest Response</InfoLabel>}>
                        <Tooltip title={`${(doc.response_bytes_max ?? 0).toLocaleString()} bytes`}>
                            <Title level={3} style={{ margin: 0 }}>
                                {formatBytes(doc.response_bytes_max ?? 0)}
                            </Title>
                        </Tooltip>
                    </KpiTile>
                </Col>
                <Col xs={24} md={8}>
                    <KpiTile label={<InfoLabel info="Derived: total egress ÷ total calls. The average response size — not a stored field.">Avg Response</InfoLabel>}>
                        <Title level={3} style={{ margin: 0 }}>
                            {doc.seen_count
                                ? formatBytes(Math.round((doc.response_bytes_total ?? 0) / doc.seen_count))
                                : '—'}
                        </Title>
                    </KpiTile>
                </Col>
            </Row>

            <Row gutter={[12, 12]} style={{ marginBottom: 16 }} align="stretch">
                <Col xs={24} md={14} style={{ display: 'flex' }}>
                    <Card
                        size="small"
                        title={
                            <InfoLabel info="Histogram of observed request durations bucketed at fixed boundaries: <5ms, 5–25ms, 25–100ms, 100–500ms, 500ms–2s, ≥2s. Counts cumulate across every call.">
                                Latency distribution
                            </InfoLabel>
                        }
                        style={{ borderRadius: 8, width: '100%' }}
                    >
                        <LatencyBucketsChart buckets={doc.latency_buckets} height={260} />
                    </Card>
                </Col>
                <Col xs={24} md={10} style={{ display: 'flex' }}>
                    <Card
                        size="small"
                        title={
                            <InfoLabel info="Breakdown of HTTP status codes returned by this endpoint, grouped by class (1xx informational, 2xx success, 3xx redirect, 4xx client error, 5xx server error).">
                                Status distribution
                            </InfoLabel>
                        }
                        style={{ borderRadius: 8, width: '100%' }}
                    >
                        <StatusDonut statusDist={doc.status_dist ?? {}} />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
                <Col span={24}>
                    <Card
                        size="small"
                        title={
                            <InfoLabel info="Aggregated metadata that the collector pulled from observed events: which risk flags fired, which PII / endpoint categories were detected, which Envoy clusters / routes served the traffic, etc.">
                                Categorisation
                            </InfoLabel>
                        }
                        style={{ borderRadius: 8 }}
                    >
                        <Space direction="vertical" size={12} style={{ width: '100%' }}>
                            {doc.risk_flags?.length ? (
                                (() => {
                                    const { threat, posture } = splitFlagsByAxis(doc.risk_flags);
                                    return (
                                        <>
                                            {threat.length > 0 && (
                                                <div>
                                                    <div style={{ marginBottom: 6 }}>
                                                        <Text type="secondary" style={{ fontSize: 11 }}>
                                                            <InfoLabel info="Active-finding flags — they feed the THREAT score (max_risk_score). Hover a chip for severity & meaning.">
                                                                Threat flags
                                                            </InfoLabel>
                                                        </Text>
                                                    </div>
                                                    <RiskFlagChips flags={threat} max={threat.length} size="md" />
                                                </div>
                                            )}
                                            {posture.length > 0 && (
                                                <div>
                                                    <div style={{ marginBottom: 6 }}>
                                                        <Text type="secondary" style={{ fontSize: 11 }}>
                                                            <InfoLabel info="Config-hygiene (posture) flags — they feed the EXPOSURE score (max_posture_score), not Threat. Hover a chip for severity & meaning.">
                                                                Exposure flags
                                                            </InfoLabel>
                                                        </Text>
                                                    </div>
                                                    <RiskFlagChips flags={posture} max={posture.length} size="md" />
                                                </div>
                                            )}
                                        </>
                                    );
                                })()
                            ) : null}
                            <ChipCluster
                                items={doc.pii_categories}
                                label={
                                    <InfoLabel info={
                                        <div>
                                            <div style={{ fontWeight: 600, marginBottom: 4 }}>PII Categories detected</div>
                                            {Object.entries(PII_CATEGORY_META).map(([k, m]) => (
                                                <div key={k} style={{ marginBottom: 2 }}>
                                                    <strong>{m.label}</strong>: {m.description}
                                                </div>
                                            ))}
                                            <div style={{ marginTop: 6, opacity: 0.8 }}>
                                                The raw PII values are NEVER stored — only the category names.
                                            </div>
                                        </div>
                                    }>
                                        PII Categories
                                    </InfoLabel>
                                }
                                color="purple"
                            />
                            <ChipCluster
                                items={doc.endpoint_categories}
                                label={
                                    <InfoLabel info={
                                        <div>
                                            <div style={{ fontWeight: 600, marginBottom: 4 }}>Endpoint Categories</div>
                                            {Object.entries(ENDPOINT_CATEGORY_META).map(([k, m]) => (
                                                <div key={k} style={{ marginBottom: 2 }}>
                                                    <strong>{m.label}</strong>: {m.description}
                                                </div>
                                            ))}
                                        </div>
                                    }>
                                        Endpoint Categories
                                    </InfoLabel>
                                }
                                color="cyan"
                            />
                            <ChipCluster
                                items={doc.method ? [doc.method] : []}
                                label={
                                    <InfoLabel info="The HTTP method of this operation. Each inventory document is a single (method, path, host) operation.">
                                        Method
                                    </InfoLabel>
                                }
                            />
                            {doc.auth_schemes?.length ? (
                                <div>
                                    <div style={{ marginBottom: 6 }}>
                                        <Text type="secondary" style={{ fontSize: 11 }}>
                                            <InfoLabel info="Consumer auth schemes fingerprinted on this operation. “None” = anonymous or non-fingerprintable auth (Basic / opaque Bearer) — not necessarily unauthenticated. Multiple schemes (e.g. JWT + None) mean some calls were authed and some were not.">
                                                Auth schemes
                                            </InfoLabel>
                                        </Text>
                                    </div>
                                    <Space size={6} wrap>
                                        <AuthSchemesBadge schemes={doc.auth_schemes} />
                                        {doc.auth_schemes.includes('none') && doc.noauth_observed && (
                                            <Tooltip title="Requests reached this endpoint with no auth header and a none / unrecognised scheme — it is anonymously reachable.">
                                                <Tag color="error" style={{ margin: 0 }}>Anonymously reachable</Tag>
                                            </Tooltip>
                                        )}
                                    </Space>
                                </div>
                            ) : null}
                            <ChipCluster
                                items={doc.clusters}
                                label={
                                    <InfoLabel info="Envoy upstream cluster name(s) that served traffic for this endpoint.">
                                        Clusters
                                    </InfoLabel>
                                }
                                color="blue"
                            />
                            <ChipCluster
                                items={doc.routes}
                                label={
                                    <InfoLabel info="Envoy route name(s) that matched requests to this endpoint.">
                                        Routes
                                    </InfoLabel>
                                }
                            />
                            <ChipCluster
                                items={doc.content_types}
                                label={
                                    <InfoLabel info="Distinct Content-Type response headers observed on this endpoint.">
                                        Content-Types
                                    </InfoLabel>
                                }
                            />
                            <ChipCluster
                                items={doc.origins}
                                mono
                                color="geekblue"
                                label={
                                    <InfoLabel info="Web origins (SPA / site) observed calling this endpoint — taken from the request Origin header. Empty for non-browser callers.">
                                        Caller Origins
                                    </InfoLabel>
                                }
                            />
                        </Space>
                    </Card>
                </Col>
            </Row>

            {(() => {
                // Consolidated Envoy remediation for this endpoint's flags.
                const actionGroups = buildActionPlan(doc.risk_flags ?? []);
                if (actionGroups.length === 0) return null;
                return (
                    <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
                        <Col span={24}>
                            <Card
                                size="small"
                                title={
                                    <InfoLabel info="Consolidated remediation for the risk flags observed on this endpoint — grouped so one Envoy change can close several at once. Each flag links to its full guide.">
                                        How to fix this endpoint
                                    </InfoLabel>
                                }
                                style={{ borderRadius: 8 }}
                            >
                                <Space direction="vertical" size={12} style={{ width: '100%' }}>
                                    {actionGroups.map((g) => {
                                        const kindMeta = MITIGATION_TYPE_META[g.fix.kind];
                                        return (
                                            <div
                                                key={g.fix.key}
                                                style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}
                                            >
                                                <div style={{ flex: 1, minWidth: 220 }}>
                                                    <Space size={8} wrap style={{ marginBottom: 6 }}>
                                                        <Text style={{ fontSize: 13, fontWeight: 600 }}>
                                                            {g.fix.label}
                                                        </Text>
                                                        <Tag
                                                            className="auto-width-tag"
                                                            style={{
                                                                margin: 0,
                                                                fontSize: 10,
                                                                color: kindMeta.color,
                                                                borderColor: `${kindMeta.color}55`,
                                                                background: `${kindMeta.color}14`,
                                                            }}
                                                        >
                                                            {kindMeta.label}
                                                        </Tag>
                                                    </Space>
                                                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                                        {g.flags.map((f) => (
                                                            <Link key={f} to={`/api-discovery/risks/${f}`}>
                                                                <Tag
                                                                    className="auto-width-tag"
                                                                    style={{ margin: 0, fontSize: 10, cursor: 'pointer' }}
                                                                >
                                                                    {riskFlagLabel(f)}
                                                                </Tag>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                                {g.fix.link && (
                                                    <Link to={g.fix.link.to}>
                                                        <Button size="small" icon={<ExportOutlined />}>
                                                            {g.fix.link.label}
                                                        </Button>
                                                    </Link>
                                                )}
                                            </div>
                                        );
                                    })}
                                </Space>
                            </Card>
                        </Col>
                    </Row>
                );
            })()}

            {doc.consumers?.length ? (
                <Card size="small" title={<InfoLabel info={CONSUMER_INFO}>Consumers (hashed)</InfoLabel>} style={{ borderRadius: 8, marginBottom: 16 }}>
                    <Space size={[6, 6]} wrap>
                        {doc.consumers.slice(0, 10).map((c) => (
                            <Tag
                                key={c}
                                className="auto-width-tag"
                                style={{
                                    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                                    fontSize: 11,
                                    margin: 0,
                                    fontWeight: 400,
                                }}
                            >
                                {c.length > 12 ? `${c.substring(0, 12)}…` : c}
                            </Tag>
                        ))}
                    </Space>
                </Card>
            ) : null}

            {doc.sample_event_ids?.length ? (
                <Card
                    size="small"
                    title="Sample events"
                    style={{ borderRadius: 8 }}
                    extra={
                        <Button size="small" type="primary" ghost icon={<EyeOutlined />} onClick={openSampleEvents}>
                            Inspect sample requests
                        </Button>
                    }
                >
                    <Paragraph type="secondary" style={{ fontSize: 11, marginBottom: 8 }}>
                        Event IDs the collector captured for this endpoint. "Inspect sample requests"
                        opens the Events tab in sample mode — it resolves these IDs to the full raw
                        events (window auto-widened to 7 days).
                    </Paragraph>
                    <Space size={[6, 6]} wrap>
                        {doc.sample_event_ids.map((id) => (
                            <Tag
                                key={id}
                                className="auto-width-tag"
                                style={{
                                    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                                    fontSize: 11,
                                    margin: 0,
                                    fontWeight: 400,
                                }}
                            >
                                {id.substring(0, 8)}…
                            </Tag>
                        ))}
                    </Space>
                </Card>
            ) : null}
        </>
    );
};

// ---------- Events Tab ----------

const STATUS_PILL_COLOR = (s: number): string => {
    if (s >= 500) return 'red';
    if (s >= 400) return 'orange';
    if (s >= 300) return 'blue';
    if (s >= 200) return 'green';
    return 'default';
};

const EventsTab: React.FC<{ id: string; methods: string[] }> = ({ id, methods }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    // Sample mode — driven by `?sample=1` so the Overview "Sample events"
    // card can deep-link straight into it. In sample mode the backend reads
    // the doc's sample_event_ids[] and auto-widens the window to 7 days, so
    // the time / method / status filters do not apply.
    const sampleMode = searchParams.get('sample') === '1';
    const setSampleMode = (on: boolean) => {
        const np = new URLSearchParams(searchParams);
        if (on) np.set('sample', '1');
        else np.delete('sample');
        setSearchParams(np, { replace: true });
        setOffset(0);
    };

    const [range, setRange] = useState<TimeRange>(() => defaultTimeRange(60));
    const [includeTotal, setIncludeTotal] = useState(false);
    // Off by default — backend ships `core` set without headers/tags/TLS to
    // save 60-80% wire size on table browsing. Flip on when investigating
    // a specific event in the expand row.
    const [fullFields, setFullFields] = useState(false);
    const [sort, setSort] = useState<SortState<EventsSortField>>(EVENTS_DEFAULT_SORT);
    const [limit, setLimit] = useState(50);
    const [offset, setOffset] = useState(0);

    // Filter inputs are staged in `draft`; only `applied` reaches the query
    // — nothing fires while the user is typing, an explicit Apply commits.
    const [draft, setDraft] = useState<EventFilters>(EMPTY_EVENT_FILTERS);
    const [applied, setApplied] = useState<EventFilters>(EMPTY_EVENT_FILTERS);

    // Inverted status range — block Apply (the backend 400s on it).
    const draftStatusInvalid =
        draft.statusMin != null && draft.statusMax != null && draft.statusMin > draft.statusMax;
    const filtersDirty = JSON.stringify(draft) !== JSON.stringify(applied);

    const applyFilters = () => {
        if (draftStatusInvalid) return;
        setApplied(draft);
        setOffset(0);
    };
    const resetFilters = () => {
        setDraft(EMPTY_EVENT_FILTERS);
        setApplied(EMPTY_EVENT_FILTERS);
        setOffset(0);
    };

    const params = useMemo(
        () =>
            sampleMode
                ? {
                    sample: true,
                    fields: (fullFields ? 'full' : 'core') as 'core' | 'full',
                    sort_by: sort.sort_by,
                    sort_order: sort.sort_order,
                    limit,
                    offset,
                }
                : {
                    from: range.from,
                    to: range.to,
                    method: applied.method,
                    status_min: applied.statusMin,
                    status_max: applied.statusMax,
                    request_id: applied.requestId || undefined,
                    risk_flag: applied.riskFlags.length ? applied.riskFlags : undefined,
                    min_risk_score: applied.minRiskScore,
                    include_total: includeTotal,
                    fields: (fullFields ? 'full' : 'core') as 'core' | 'full',
                    sort_by: sort.sort_by,
                    sort_order: sort.sort_order,
                    limit,
                    offset,
                },
        [sampleMode, range, applied, includeTotal, fullFields, sort, limit, offset],
    );

    const { data, isLoading, isFetching, refetch, error, isClickhouseUnavailable, isClickhouseQueryFailed } =
        useApiInventoryEvents(id, params);

    const columns: ColumnsType<RawEvent> = [
        {
            title: 'Time',
            dataIndex: 'ts',
            key: 'ts',
            width: 175,
            sorter: true,
            sortOrder: columnSortOrder(sort, 'ts'),
            render: (ts: string) => (
                <Tooltip title={ts}>
                    <Text style={{ fontSize: 12 }}>
                        {dayjs(ts).format('YYYY-MM-DD HH:mm:ss.SSS')}
                    </Text>
                </Tooltip>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status_code',
            key: 'status_code',
            width: 80,
            sorter: true,
            sortOrder: columnSortOrder(sort, 'status_code'),
            render: (s: number) => (
                <Tag className="auto-width-tag" color={STATUS_PILL_COLOR(s)} style={{ margin: 0 }}>
                    {s}
                </Tag>
            ),
        },
        {
            title: 'Duration',
            dataIndex: 'duration_ms',
            key: 'duration_ms',
            width: 100,
            align: 'right',
            sorter: true,
            sortOrder: columnSortOrder(sort, 'duration_ms'),
            render: (ms: number) =>
                ms < 1000 ? `${ms.toFixed(1)}ms` : `${(ms / 1000).toFixed(2)}s`,
        },
        {
            title: 'Method',
            dataIndex: 'method',
            key: 'method',
            width: 80,
            render: (m: string) =>
                m ? (
                    <Tag
                        className="auto-width-tag"
                        color={METHOD_HEADER_COLOR[m] ?? 'default'}
                        style={{ margin: 0, fontSize: 11 }}
                    >
                        {m}
                    </Tag>
                ) : (
                    <Text type="secondary">—</Text>
                ),
        },
        {
            title: 'Path',
            dataIndex: 'normalized_path',
            key: 'normalized_path',
            ellipsis: true,
            render: (p: string) => (
                <Text
                    style={{
                        fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                        fontSize: 12,
                    }}
                >
                    {p}
                </Text>
            ),
        },
        {
            title: 'Host',
            dataIndex: 'host',
            key: 'host',
            width: 160,
            ellipsis: true,
        },
        {
            title: 'Cluster',
            dataIndex: 'cluster',
            key: 'cluster',
            width: 140,
            ellipsis: true,
            render: (c: string) =>
                c ? <Text style={{ fontSize: 12 }}>{c}</Text> : <Text type="secondary">—</Text>,
        },
        {
            title: (
                <InfoLabel info="Raw source IP when compliance allows it; otherwise the hash. Hover for full value when truncated.">
                    Source
                </InfoLabel>
            ),
            key: 'source',
            width: 140,
            render: (_: any, r: RawEvent) => {
                if (r.source_ip) {
                    return (
                        <Tooltip title={r.source_ip}>
                            <Text style={{ fontFamily: 'monospace', fontSize: 11 }}>
                                {r.source_ip}
                            </Text>
                        </Tooltip>
                    );
                }
                if (r.source_ip_hash) {
                    return (
                        <Tooltip title={`hash · ${r.source_ip_hash}`}>
                            <Text
                                type="secondary"
                                style={{ fontFamily: 'monospace', fontSize: 11 }}
                            >
                                {r.source_ip_hash.substring(0, 10)}…
                            </Text>
                        </Tooltip>
                    );
                }
                return <Text type="secondary">—</Text>;
            },
        },
        {
            title: (
                <InfoLabel info="Raw User-Agent when compliance allows it; otherwise the hash. Full string available in the expand row.">
                    User-Agent
                </InfoLabel>
            ),
            key: 'ua',
            width: 220,
            ellipsis: true,
            render: (_: any, r: RawEvent) => {
                if (r.user_agent) {
                    return (
                        <Tooltip title={r.user_agent}>
                            <Text
                                style={{
                                    fontFamily: 'monospace',
                                    fontSize: 11,
                                }}
                            >
                                {r.user_agent.length > 36 ? `${r.user_agent.substring(0, 36)}…` : r.user_agent}
                            </Text>
                        </Tooltip>
                    );
                }
                if (r.user_agent_hash) {
                    return (
                        <Tooltip title={`hash · ${r.user_agent_hash}`}>
                            <Text
                                type="secondary"
                                style={{ fontFamily: 'monospace', fontSize: 11 }}
                            >
                                {r.user_agent_hash.substring(0, 10)}…
                            </Text>
                        </Tooltip>
                    );
                }
                return <Text type="secondary">—</Text>;
            },
        },
        {
            title: 'Risk',
            key: 'risk_score',
            width: 220,
            sorter: true,
            sortOrder: columnSortOrder(sort, 'risk_score'),
            render: (_: any, r: RawEvent) => {
                const score = r.risk_score ?? 0;
                const scoreColor =
                    score >= 25 ? 'var(--color-error)' : score >= 10 ? 'var(--color-warning)' : score > 0 ? '#d4a012' : 'var(--text-tertiary)';
                return (
                    <Space size={6} align="center">
                        <RiskFlagChips flags={r.risk_flags} max={2} />
                        {score > 0 && (
                            <span
                                style={{
                                    display: 'inline-flex',
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
                        )}
                    </Space>
                );
            },
        },
        {
            title: 'Request ID',
            dataIndex: 'request_id',
            key: 'request_id',
            width: 200,
            render: (r: string) =>
                r ? (
                    <Space size={4}>
                        <Text
                            style={{
                                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                                fontSize: 11,
                            }}
                        >
                            {r.length > 18 ? `${r.substring(0, 18)}…` : r}
                        </Text>
                        <Tooltip title="Copy">
                            <Button
                                size="small"
                                type="text"
                                icon={<CopyOutlined />}
                                onClick={() => {
                                    navigator.clipboard.writeText(r).then(() => {
                                        message.success('Copied');
                                    });
                                }}
                            />
                        </Tooltip>
                    </Space>
                ) : (
                    <Text type="secondary">—</Text>
                ),
        },
    ];

    if (isClickhouseUnavailable) {
        return (
            <Alert
                type="warning"
                showIcon
                message="Event data unavailable"
                description={
                    <Text>
                        ClickHouse is not configured on the controller (HTTP 503). Set{' '}
                        <code>CLICKHOUSE_URI</code> to enable the event timeline.
                    </Text>
                }
            />
        );
    }
    if (isClickhouseQueryFailed) {
        return (
            <Alert
                type="error"
                showIcon
                message="Event query failed"
                description={
                    <Space direction="vertical" size={6} style={{ width: '100%' }}>
                        <Text>
                            The query failed — usually a query timeout or a
                            transient backend issue. Try narrowing the time range or refresh.
                        </Text>
                        <Button size="small" icon={<ReloadOutlined />} onClick={() => refetch()}>
                            Retry
                        </Button>
                    </Space>
                }
            />
        );
    }

    return (
        <>
            <Card size="small" style={{ marginBottom: 12, borderRadius: 8 }}>
                {/* Row 1 — scope, time range, view options (apply on click). */}
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 12,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <Space wrap size={12}>
                        <Segmented
                            size="small"
                            value={sampleMode ? 'sample' : 'all'}
                            onChange={(v) => setSampleMode(v === 'sample')}
                            options={[
                                { label: 'All events', value: 'all' },
                                { label: 'Sample requests', value: 'sample' },
                            ]}
                        />
                        {sampleMode ? (
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                <InfoLabel info="Shows the ≤5 sample events the collector captured for this endpoint (sample_event_ids). The time window is auto-widened to 7 days so the samples are always in range — time / method / status filters do not apply.">
                                    Captured samples — 7-day window
                                </InfoLabel>
                            </Text>
                        ) : (
                            <TimeRangePicker value={range} onChange={(r) => { setRange(r); setOffset(0); }} />
                        )}
                    </Space>
                    <Space wrap size={12}>
                        {!sampleMode && (
                            <Tooltip title="Run an extra count() for exact pagination — slow on hot endpoints.">
                                <Space size={4}>
                                    <Switch size="small" checked={includeTotal} onChange={(v) => setIncludeTotal(v)} />
                                    <Text type="secondary" style={{ fontSize: 11 }}>Total</Text>
                                </Space>
                            </Tooltip>
                        )}
                        <Tooltip title="Pull headers, tags, and TLS metadata for every row. Off by default to keep the response small; turn on when investigating a specific event in the expand row.">
                            <Space size={4}>
                                <Switch size="small" checked={fullFields} onChange={(v) => setFullFields(v)} />
                                <Text type="secondary" style={{ fontSize: 11 }}>Full fields</Text>
                            </Space>
                        </Tooltip>
                        <Button
                            size="small"
                            icon={<ReloadOutlined />}
                            loading={isFetching}
                            onClick={() => refetch()}
                        >
                            Refresh
                        </Button>
                    </Space>
                </div>

                {/* Row 2 — staged filters. Nothing fires until Apply. */}
                {!sampleMode && (
                    <div
                        style={{
                            marginTop: 12,
                            paddingTop: 12,
                            borderTop: '1px solid var(--border-default)',
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 12,
                            alignItems: 'flex-end',
                        }}
                    >
                        <FilterField label="Method" width={120}>
                            <Select
                                size="small"
                                allowClear
                                placeholder="Any"
                                value={draft.method}
                                onChange={(v) => setDraft({ ...draft, method: v })}
                                options={(methods?.length ? methods : ['GET', 'POST', 'PUT', 'DELETE']).map(
                                    (m) => ({ value: m, label: m }),
                                )}
                                style={{ width: '100%' }}
                            />
                        </FilterField>
                        <FilterField label="Status range" width={172}>
                            <Space.Compact>
                                <InputNumber
                                    size="small"
                                    placeholder="Min"
                                    min={0}
                                    max={599}
                                    status={draftStatusInvalid ? 'error' : undefined}
                                    value={draft.statusMin}
                                    onChange={(v) => setDraft({ ...draft, statusMin: v ?? undefined })}
                                    onPressEnter={applyFilters}
                                    style={{ width: 86 }}
                                />
                                <InputNumber
                                    size="small"
                                    placeholder="Max"
                                    min={0}
                                    max={599}
                                    status={draftStatusInvalid ? 'error' : undefined}
                                    value={draft.statusMax}
                                    onChange={(v) => setDraft({ ...draft, statusMax: v ?? undefined })}
                                    onPressEnter={applyFilters}
                                    style={{ width: 86 }}
                                />
                            </Space.Compact>
                        </FilterField>
                        <FilterField label="Request ID" width={200}>
                            <Input
                                size="small"
                                placeholder="Exact match"
                                allowClear
                                value={draft.requestId}
                                onChange={(e) => setDraft({ ...draft, requestId: e.target.value })}
                                onPressEnter={applyFilters}
                                style={{ width: '100%' }}
                            />
                        </FilterField>
                        <FilterField label="Risk flag" width={240}>
                            <Select
                                size="small"
                                mode="multiple"
                                allowClear
                                placeholder="Any"
                                value={draft.riskFlags}
                                onChange={(v) => setDraft({ ...draft, riskFlags: v })}
                                options={KNOWN_RISK_FLAGS.map((f) => ({ value: f, label: riskFlagLabel(f) }))}
                                maxTagCount="responsive"
                                style={{ width: '100%' }}
                            />
                        </FilterField>
                        <FilterField label="Min risk" width={92}>
                            <InputNumber
                                size="small"
                                placeholder="Any"
                                min={1}
                                max={255}
                                value={draft.minRiskScore}
                                onChange={(v) => setDraft({ ...draft, minRiskScore: v ?? undefined })}
                                onPressEnter={applyFilters}
                                style={{ width: '100%' }}
                            />
                        </FilterField>
                        <Space size={6} align="center">
                            <Button
                                type="primary"
                                size="small"
                                disabled={draftStatusInvalid || !filtersDirty}
                                onClick={applyFilters}
                            >
                                Apply
                            </Button>
                            <Button size="small" onClick={resetFilters}>
                                Reset
                            </Button>
                            {draftStatusInvalid && (
                                <Text type="danger" style={{ fontSize: 11 }}>
                                    Status min must be ≤ max
                                </Text>
                            )}
                        </Space>
                    </div>
                )}
            </Card>

            <Card size="small" style={{ borderRadius: 8 }}>
                <Table<RawEvent>
                    rowKey="event_id"
                    columns={columns}
                    scroll={{ x: 'max-content' }}
                    dataSource={data?.data ?? []}
                    loading={isLoading}
                    size="small"
                    showSorterTooltip={false}
                    onChange={(_p, _f, sorter, extra) => {
                        if (extra.action !== 'sort') return;
                        setSort(antdToSort(sorter, EVENTS_DEFAULT_SORT));
                        setOffset(0);
                    }}
                    expandable={{
                        expandedRowRender: (row) => (
                            <Descriptions
                                size="small"
                                column={2}
                                bordered
                                styles={{ label: { fontSize: 11 }, content: { fontSize: 11 } }}
                            >
                                <Descriptions.Item label="Node">{row.node_id}</Descriptions.Item>
                                <Descriptions.Item label="Stream">{row.stream_id}</Descriptions.Item>
                                <Descriptions.Item label="Listener IP">{row.listener_ip || '—'}</Descriptions.Item>
                                <Descriptions.Item label="Protocol">{row.protocol}</Descriptions.Item>
                                <Descriptions.Item label="Request bytes">{row.request_bytes.toLocaleString()}</Descriptions.Item>
                                <Descriptions.Item label="Response bytes">{row.response_bytes.toLocaleString()}</Descriptions.Item>
                                <Descriptions.Item label="Content-Type">{row.content_type || '—'}</Descriptions.Item>
                                <Descriptions.Item label="Route">{row.route_name || '—'}</Descriptions.Item>
                                <Descriptions.Item label="Auth observed">{row.auth_observed ? 'yes' : 'no'}</Descriptions.Item>
                                <Descriptions.Item label="Consumer hash">{row.consumer_hash || '—'}</Descriptions.Item>
                                <Descriptions.Item label="Source IP">
                                    {row.source_ip
                                        ? <Text style={{ fontFamily: 'monospace', fontSize: 11 }}>{row.source_ip}</Text>
                                        : <Text type="secondary">— (redacted)</Text>}
                                </Descriptions.Item>
                                <Descriptions.Item label="Source IP hash">{row.source_ip_hash || '—'}</Descriptions.Item>
                                <Descriptions.Item label="User-Agent" span={2}>
                                    {row.user_agent
                                        ? <Text style={{ fontFamily: 'monospace', fontSize: 11, wordBreak: 'break-all' }}>{row.user_agent}</Text>
                                        : <Text type="secondary">— (redacted)</Text>}
                                </Descriptions.Item>
                                <Descriptions.Item label="User-Agent hash">{row.user_agent_hash || '—'}</Descriptions.Item>
                                <Descriptions.Item label="TLS version">{row.tls_version || '—'}</Descriptions.Item>
                                <Descriptions.Item label="TLS SNI">{row.tls_sni || '—'}</Descriptions.Item>
                                <Descriptions.Item label="TLS peer subject" span={2}>{row.tls_peer_subject || '—'}</Descriptions.Item>
                                {row.grpc_status !== undefined && (
                                    <Descriptions.Item label="gRPC status" span={2}>
                                        {row.grpc_status} {row.grpc_message ? `— ${row.grpc_message}` : ''}
                                    </Descriptions.Item>
                                )}
                                {row.headers && Object.keys(row.headers).length > 0 && (
                                    <Descriptions.Item label="Headers" span={2}>
                                        <pre style={{ margin: 0, fontSize: 11 }}>
                                            {JSON.stringify(row.headers, null, 2)}
                                        </pre>
                                    </Descriptions.Item>
                                )}
                                {row.tags && Object.keys(row.tags).length > 0 && (
                                    <Descriptions.Item label="Tags" span={2}>
                                        <pre style={{ margin: 0, fontSize: 11 }}>
                                            {JSON.stringify(row.tags, null, 2)}
                                        </pre>
                                    </Descriptions.Item>
                                )}
                                {!fullFields && (
                                    <Descriptions.Item label="" span={2}>
                                        <Text type="secondary" style={{ fontSize: 11 }}>
                                            Headers, tags, and TLS metadata are omitted in the default
                                            <code style={{ margin: '0 4px' }}>core</code>response.
                                            Toggle <strong>Full fields</strong> in the toolbar to
                                            include them.
                                        </Text>
                                    </Descriptions.Item>
                                )}
                            </Descriptions>
                        ),
                    }}
                    locale={{
                        emptyText: error ? (
                            <Empty description={<Text type="secondary">Failed to load events.</Text>} />
                        ) : (
                            <Empty description={<Text type="secondary">No events in selected range.</Text>} />
                        ),
                    }}
                    pagination={(() => {
                        const realTotal = data?.total_count ?? -1;
                        const knowsTotal = includeTotal && realTotal >= 0;
                        const cnt = data?.count ?? 0;
                        // When the total isn't computed (include_total=false), the
                        // backend can't tell us how many events match in total.
                        // Heuristic: if the page is full, assume at least one more
                        // page exists so antd renders the next button; this keeps
                        // navigation working without paying for the count() query.
                        const fakeTotal = offset + cnt + (cnt === limit ? limit : 0);
                        return {
                            current: data?.current_page ?? 1,
                            pageSize: limit,
                            total: knowsTotal ? realTotal : fakeTotal,
                            showSizeChanger: true,
                            pageSizeOptions: ['50', '100', '200', '500'],
                            showQuickJumper: knowsTotal,
                            showLessItems: !knowsTotal,
                            showTotal: knowsTotal
                                ? (total: number, range: [number, number]) =>
                                      `${range[0]}–${range[1]} of ${total.toLocaleString()} events`
                                : () =>
                                      `Loaded ${cnt} events${cnt === limit ? ' — more available' : ''}`,
                            onChange: (page: number, size: number) => {
                                setLimit(size);
                                setOffset((page - 1) * size);
                            },
                        };
                    })()}
                />
            </Card>
        </>
    );
};

// ---------- Analytics Tab ----------

const AnalyticsTab: React.FC<{ id: string; doc: InventoryDoc; methods: string[] }> = ({
    id,
    doc,
    methods,
}) => {
    const hasPath = !!doc.normalized_path;
    const [granularity, setGranularity] = useState<Granularity>('1m');
    const [range, setRange] = useState<TimeRange>(() => defaultTimeRange(60));
    const [method, setMethod] = useState<string | undefined>();

    const params = useMemo(
        () => ({ granularity, from: range.from, to: range.to, method }),
        [granularity, range, method],
    );

    const { data, isLoading, isFetching, refetch, isClickhouseUnavailable, isClickhouseQueryFailed } =
        useApiInventoryStats(id, params);

    // Aggregate by ts_bucket since the backend returns one row per
    // (bucket, status_class) tuple — we need both stacked (per class)
    // and rolled-up (across all classes) views.
    const aggregated = useMemo(() => {
        const buckets = data?.data ?? [];
        // Sum across status_class for every metric except events_count which
        // we ALSO keep split per class for the stacked area widget.
        const perBucket = new Map<
            string,
            {
                ts: string;
                events: number;
                eventsByClass: Record<number, number>;
                p50Sum: number;
                p95Sum: number;
                p99Sum: number;
                bytesSum: number;
                errors: number;
                clientErrors: number;
                uniqConsumers: number;
                uniqSourceIPs: number;
                maxRisk: number;
                rows: number;
            }
        >();
        for (const b of buckets) {
            const k = b.ts_bucket;
            const slot =
                perBucket.get(k) ?? {
                    ts: k,
                    events: 0,
                    eventsByClass: {},
                    p50Sum: 0,
                    p95Sum: 0,
                    p99Sum: 0,
                    bytesSum: 0,
                    errors: 0,
                    clientErrors: 0,
                    uniqConsumers: 0,
                    uniqSourceIPs: 0,
                    maxRisk: 0,
                    rows: 0,
                };
            slot.events += b.events_count;
            slot.eventsByClass[b.status_class] =
                (slot.eventsByClass[b.status_class] ?? 0) + b.events_count;
            slot.p50Sum += b.duration_p50_ms * b.events_count;
            slot.p95Sum += b.duration_p95_ms * b.events_count;
            slot.p99Sum += b.duration_p99_ms * b.events_count;
            slot.bytesSum += b.response_bytes_sum;
            slot.errors += b.error_count;
            slot.clientErrors += b.client_error_count;
            slot.uniqConsumers = Math.max(slot.uniqConsumers, b.unique_consumers);
            slot.uniqSourceIPs = Math.max(slot.uniqSourceIPs, b.unique_source_ips);
            slot.maxRisk = Math.max(slot.maxRisk, b.max_risk_score);
            slot.rows += 1;
            perBucket.set(k, slot);
        }
        return Array.from(perBucket.values()).sort((a, b) =>
            a.ts < b.ts ? -1 : a.ts > b.ts ? 1 : 0,
        );
    }, [data]);

    const statusClassColors: Record<number, string> = {
        1: '#9ca3af',
        2: '#10b981',
        3: '#3b82f6',
        4: '#f59e0b',
        5: '#ef4444',
    };

    const requestsSeries: MetricLineSeries[] = useMemo(
        () =>
            ([1, 2, 3, 4, 5] as const).map((cls) => ({
                name: `${cls}xx`,
                stack: 'requests',
                color: statusClassColors[cls],
                data: aggregated.map((b) => [b.ts, b.eventsByClass[cls] ?? 0]),
            })),
        [aggregated],
    );

    const latencySeries: MetricLineSeries[] = useMemo(
        () => [
            {
                name: 'p50',
                color: '#10b981',
                data: aggregated.map((b) => [b.ts, b.events ? b.p50Sum / b.events : 0]),
            },
            {
                name: 'p95',
                color: '#f59e0b',
                data: aggregated.map((b) => [b.ts, b.events ? b.p95Sum / b.events : 0]),
            },
            {
                name: 'p99',
                color: '#ef4444',
                data: aggregated.map((b) => [b.ts, b.events ? b.p99Sum / b.events : 0]),
            },
        ],
        [aggregated],
    );

    const errorRateSeries: MetricLineSeries[] = useMemo(
        () => [
            {
                name: 'Error rate %',
                color: '#ef4444',
                area: true,
                data: aggregated.map((b) => [b.ts, b.events ? (b.errors / b.events) * 100 : 0]),
            },
            {
                name: 'Client error rate %',
                color: '#f59e0b',
                area: true,
                data: aggregated.map((b) => [
                    b.ts,
                    b.events ? (b.clientErrors / b.events) * 100 : 0,
                ]),
            },
        ],
        [aggregated],
    );

    const throughputSeries: MetricLineSeries[] = useMemo(
        () => [
            {
                name: 'Response bytes',
                color: '#3b82f6',
                area: true,
                data: aggregated.map((b) => [b.ts, b.bytesSum]),
            },
        ],
        [aggregated],
    );

    const uniquesSeries: MetricLineSeries[] = useMemo(
        () => [
            {
                name: 'Unique consumers',
                color: '#8b5cf6',
                data: aggregated.map((b) => [b.ts, b.uniqConsumers]),
            },
            {
                name: 'Unique source IPs',
                color: '#06b6d4',
                data: aggregated.map((b) => [b.ts, b.uniqSourceIPs]),
            },
        ],
        [aggregated],
    );

    const maxRiskSeries: MetricLineSeries[] = useMemo(
        () => [
            {
                name: 'Max risk score',
                color: '#ef4444',
                data: aggregated.map((b) => [b.ts, b.maxRisk]),
            },
        ],
        [aggregated],
    );

    if (isClickhouseUnavailable) {
        return (
            <Alert
                type="warning"
                showIcon
                message="Analytics unavailable"
                description={
                    <Text>
                        ClickHouse is not configured on the controller (HTTP 503). Set{' '}
                        <code>CLICKHOUSE_URI</code> to enable rollup analytics.
                    </Text>
                }
            />
        );
    }
    if (isClickhouseQueryFailed) {
        return (
            <Alert
                type="error"
                showIcon
                message="Analytics query failed"
                description={
                    <Space direction="vertical" size={6} style={{ width: '100%' }}>
                        <Text>
                            The query failed — usually a query timeout on a
                            heavy rollup. Try a coarser granularity or a shorter time range.
                        </Text>
                        <Button size="small" icon={<ReloadOutlined />} onClick={() => refetch()}>
                            Retry
                        </Button>
                    </Space>
                }
            />
        );
    }

    return (
        <>
            <Card size="small" style={{ marginBottom: 12, borderRadius: 8 }}>
                <Space wrap size={12}>
                    <Radio.Group
                        size="small"
                        value={granularity}
                        onChange={(e) => setGranularity(e.target.value)}
                    >
                        <Radio.Button value="1m">1m</Radio.Button>
                        <Radio.Button value="1h">1h</Radio.Button>
                        <Tooltip
                            title={
                                hasPath
                                    ? '1d rollup drops normalized_path; not available for path-scoped endpoints.'
                                    : ''
                            }
                        >
                            <Radio.Button value="1d" disabled={hasPath}>
                                1d
                            </Radio.Button>
                        </Tooltip>
                    </Radio.Group>
                    <TimeRangePicker value={range} onChange={setRange} />
                    <Select
                        size="small"
                        allowClear
                        placeholder="Method"
                        value={method}
                        onChange={setMethod}
                        options={(methods?.length ? methods : ['GET', 'POST', 'PUT', 'DELETE']).map(
                            (m) => ({ value: m, label: m }),
                        )}
                        style={{ width: 110 }}
                    />
                    <Button
                        size="small"
                        icon={<ReloadOutlined />}
                        loading={isFetching}
                        onClick={() => refetch()}
                    >
                        Refresh
                    </Button>
                </Space>
            </Card>

            {isLoading ? (
                <div style={{ textAlign: 'center', padding: 60 }}>
                    <Spin />
                </div>
            ) : !aggregated.length ? (
                <Card size="small" style={{ borderRadius: 8 }}>
                    <Empty description={<Text type="secondary">No rollup data in selected range.</Text>} />
                </Card>
            ) : (
                <Row gutter={[12, 12]}>
                    <Col xs={24} md={12}>
                        <Card size="small" title="Requests over time" style={{ borderRadius: 8 }}>
                            <MetricLineChart series={requestsSeries} />
                        </Card>
                    </Col>
                    <Col xs={24} md={12}>
                        <Card
                            size="small"
                            title={
                                <InfoLabel info="p50 / p95 / p99 request duration per bucket. These are approximate — computed from a T-Digest sketch in the ClickHouse rollup, not an exact sort. Accurate to well within a few percent; ideal for trends, not for SLA cent-precision.">
                                    Latency percentiles (ms)
                                </InfoLabel>
                            }
                            style={{ borderRadius: 8 }}
                        >
                            <MetricLineChart series={latencySeries} unit="ms" />
                        </Card>
                    </Col>
                    <Col xs={24} md={12}>
                        <Card size="small" title="Error rate %" style={{ borderRadius: 8 }}>
                            <MetricLineChart
                                series={errorRateSeries}
                                yFormatter={(v) => `${v.toFixed(2)}%`}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} md={12}>
                        <Card size="small" title="Response bytes" style={{ borderRadius: 8 }}>
                            <MetricLineChart
                                series={throughputSeries}
                                yFormatter={(v) =>
                                    v >= 1e6 ? `${(v / 1e6).toFixed(1)}MB` : v >= 1e3 ? `${(v / 1e3).toFixed(1)}KB` : `${v}B`
                                }
                            />
                        </Card>
                    </Col>
                    <Col xs={24} md={12}>
                        <Card
                            size="small"
                            title={
                                <InfoLabel info="Distinct consumer identities and distinct source IPs per bucket. Both are approximate — counted with a HyperLogLog sketch in the rollup (typical error ≈ 1–2%). Exact at low cardinality; slightly fuzzy in the thousands.">
                                    Unique consumers / source IPs
                                </InfoLabel>
                            }
                            style={{ borderRadius: 8 }}
                        >
                            <MetricLineChart series={uniquesSeries} />
                        </Card>
                    </Col>
                    <Col xs={24} md={12}>
                        <Card size="small" title="Max risk score" style={{ borderRadius: 8 }}>
                            <MetricLineChart series={maxRiskSeries} />
                        </Card>
                    </Col>
                </Row>
            )}
        </>
    );
};

// ---------- Insights Tab (Geo & Threats) ----------

// UA-kind palette — mirrors the collector's ua.kind taxonomy
// (browser / bot / scanner / sdk / cli / monitor / empty / unknown).
const UA_KIND_COLORS: Record<string, string> = {
    browser: '#3b82f6',
    cli: '#8b5cf6',
    sdk: '#06b6d4',
    library: '#06b6d4',
    bot: '#fbbf24',
    crawler: '#fbbf24',
    scanner: '#ef4444',
    monitor: '#10b981',
    empty: '#475569',
    unknown: '#9ca3af',
    other: '#64748b',
};

const uaKindColor = (kind: string): string =>
    UA_KIND_COLORS[kind?.toLowerCase?.() ?? 'unknown'] ?? '#64748b';

// Black or white text for a solid hex background — antd v5 does not pick
// a contrasting text colour for custom-colour tags, so we compute it.
const readableOn = (hex: string): string => {
    const h = (hex || '').replace('#', '');
    if (h.length < 6) return '#ffffff';
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    // Perceived luminance (ITU-R BT.601).
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6 ? '#1f1f1f' : '#ffffff';
};

// Inline horizontal bar — visual weight inside table cells.
const InlineBar: React.FC<{ pct: number; color?: string; width?: number }> = ({
    pct,
    color = 'var(--color-primary)',
    width = 80,
}) => (
    <div
        style={{
            width,
            height: 6,
            background: 'var(--bg-elevated)',
            borderRadius: 3,
            overflow: 'hidden',
            display: 'inline-block',
            verticalAlign: 'middle',
        }}
    >
        <div
            style={{
                width: `${Math.min(100, Math.max(0, pct))}%`,
                height: '100%',
                background: color,
            }}
        />
    </div>
);

// Donut from echarts for kind/internal-vs-external splits.
const SmallDonut: React.FC<{
    data: Array<{ name: string; value: number; color: string }>;
    height?: number;
}> = ({ data, height = 200 }) => {
    const { options: themeOpts } = useChartTheme();
    const total = data.reduce((s, d) => s + d.value, 0);
    const option = useMemo(
        () => ({
            ...themeOpts,
            // Strip x/y axis defaults from the theme — donuts don't have
            // axes; leaving them in renders a stray axis line behind the
            // chart.
            xAxis: undefined,
            yAxis: undefined,
            grid: undefined,
            tooltip: {
                ...themeOpts.tooltip,
                trigger: 'item',
                formatter: (p: any) =>
                    `<strong>${p.name}</strong><br/>${p.value.toLocaleString()} (${total ? ((p.value / total) * 100).toFixed(1) : 0}%)`,
            },
            legend: { ...themeOpts.legend, bottom: 8, itemWidth: 10, itemHeight: 8 },
            series: [
                {
                    type: 'pie',
                    radius: ['46%', '70%'],
                    center: ['50%', '42%'],
                    avoidLabelOverlap: false,
                    label: { show: false },
                    labelLine: { show: false },
                    data: data.map((d) => ({
                        name: d.name,
                        value: d.value,
                        itemStyle: { color: d.color },
                    })),
                },
            ],
        }),
        [data, themeOpts, total],
    );
    return <ReactEChartsCore echarts={echarts} option={option} style={{ height, width: '100%' }} notMerge />;
};

const InsightsTab: React.FC<{ id: string; doc: InventoryDoc; methods: string[] }> = ({
    id,
    methods,
}) => {
    // Defaults: 24h window, top-10 cardinality, series on (the user can
    // toggle off to save the extra ClickHouse roundtrip on slow nodes).
    const [range, setRange] = useState<TimeRange>(() => defaultTimeRange(60 * 24));
    const [includeSeries, setIncludeSeries] = useState(true);
    // Raw UA / IP dimensions are off by default — backend skips two full
    // scans when this is false. Flip on when the operator wants to see
    // exact User-Agent strings / source IPs in Top lists.
    const [includeRawDims, setIncludeRawDims] = useState(false);
    const [method, setMethod] = useState<string | undefined>();
    const [top, setTop] = useState(10);

    const params = useMemo(
        () => ({
            from: range.from,
            to: range.to,
            inventory_id: id,
            method,
            top,
            include_series: includeSeries,
            include_raw_dims: includeRawDims,
        }),
        [range, id, method, top, includeSeries, includeRawDims],
    );

    const { data, isLoading, isFetching, refetch, isClickhouseUnavailable, isClickhouseQueryFailed } =
        useApiInventoryGeo(params);
    const summary = data?.data;

    if (isClickhouseUnavailable) {
        return (
            <Alert
                type="warning"
                showIcon
                message="Insights unavailable"
                description={
                    <Text>
                        ClickHouse is not configured on the controller (HTTP 503). Set{' '}
                        <code>CLICKHOUSE_URI</code> to enable geo & threat insights.
                    </Text>
                }
            />
        );
    }
    if (isClickhouseQueryFailed) {
        return (
            <Alert
                type="error"
                showIcon
                message="Insights query failed"
                description={
                    <Space direction="vertical" size={6} style={{ width: '100%' }}>
                        <Text>
                            The query failed — the geo aggregation is
                            running six parallel sub-queries, one of them likely timed out.
                            Try a shorter time range or turn off Time series.
                        </Text>
                        <Button size="small" icon={<ReloadOutlined />} onClick={() => refetch()}>
                            Retry
                        </Button>
                    </Space>
                }
            />
        );
    }

    const toolbar = (
        <Card size="small" style={{ marginBottom: 12, borderRadius: 8 }}>
            <Space wrap size={12}>
                <TimeRangePicker value={range} onChange={setRange} />
                <Select
                    size="small"
                    allowClear
                    placeholder="Method"
                    value={method}
                    onChange={setMethod}
                    options={(methods?.length ? methods : ['GET', 'POST', 'PUT', 'DELETE']).map((m) => ({
                        value: m,
                        label: m,
                    }))}
                    style={{ width: 110 }}
                />
                <Tooltip title="How many entries to keep in the top countries / ASNs / cities lists.">
                    <InputNumber
                        size="small"
                        prefix={<span style={{ color: 'var(--text-tertiary)', fontSize: 11 }}>Top</span>}
                        min={3}
                        max={50}
                        value={top}
                        onChange={(v) => setTop(typeof v === 'number' ? v : 10)}
                        style={{ width: 100 }}
                    />
                </Tooltip>
                <Tooltip title="Fetch time-series alongside the snapshot. Adds a second ClickHouse query; auto-granularity unless overridden by the backend.">
                    <Space size={4}>
                        <Switch
                            size="small"
                            checked={includeSeries}
                            onChange={(v) => setIncludeSeries(v)}
                        />
                        <Text type="secondary" style={{ fontSize: 11 }}>
                            Time series
                        </Text>
                    </Space>
                </Tooltip>
                <Tooltip title="Include exact User-Agent strings and source IPs (Top User Agents / Top Source IPs tables). Adds two ClickHouse full scans; off by default.">
                    <Space size={4}>
                        <Switch
                            size="small"
                            checked={includeRawDims}
                            onChange={(v) => setIncludeRawDims(v)}
                        />
                        <Text type="secondary" style={{ fontSize: 11 }}>
                            Raw UA / IP
                        </Text>
                    </Space>
                </Tooltip>
                <Button
                    size="small"
                    icon={<ReloadOutlined />}
                    loading={isFetching}
                    onClick={() => refetch()}
                >
                    Refresh
                </Button>
                <SamplingBadge />
            </Space>
        </Card>
    );

    if (isLoading || !summary) {
        return (
            <>
                {toolbar}
                <div style={{ textAlign: 'center', padding: 60 }}>
                    <Spin />
                </div>
            </>
        );
    }

    if (summary.total_events === 0) {
        return (
            <>
                {toolbar}
                <Card size="small" style={{ borderRadius: 8 }}>
                    <Empty
                        description={
                            <Text type="secondary">
                                No events in selected range. Try widening the time window.
                            </Text>
                        }
                    />
                </Card>
            </>
        );
    }

    const iv = summary.internal_vs_external;
    const ivTotal = iv.internal + iv.external + iv.unknown;
    const tiPct = summary.threat_intel.percentage ?? 0;

    // Country table columns
    const countryCols: ColumnsType<GeoCountry> = [
        {
            title: '',
            key: 'flag',
            width: 36,
            render: (_: any, r) => (
                <span style={{ fontSize: 18, lineHeight: 1 }}>{countryFlag(r.code) || '🏳'}</span>
            ),
        },
        {
            title: 'Country',
            dataIndex: 'name',
            key: 'name',
            render: (name: string, r) => (
                <span>
                    <Text strong style={{ fontSize: 12 }}>{name || r.code}</Text>
                    {r.code && r.name && (
                        <Text type="secondary" style={{ fontSize: 11, marginLeft: 6, fontFamily: 'monospace' }}>
                            {r.code}
                        </Text>
                    )}
                </span>
            ),
        },
        {
            title: 'Share',
            key: 'pct',
            width: 160,
            render: (_: any, r) => (
                <Space size={8}>
                    <InlineBar pct={r.percentage} />
                    <Text style={{ fontSize: 11, fontVariantNumeric: 'tabular-nums', minWidth: 42, display: 'inline-block' }}>
                        {r.percentage.toFixed(1)}%
                    </Text>
                </Space>
            ),
        },
        {
            title: 'Events',
            dataIndex: 'count',
            key: 'count',
            width: 100,
            align: 'right',
            render: (n: number) => (
                <Text style={{ fontVariantNumeric: 'tabular-nums', fontSize: 12 }}>
                    {n.toLocaleString()}
                </Text>
            ),
        },
    ];

    const asnCols: ColumnsType<GeoASN> = [
        {
            title: 'ASN',
            dataIndex: 'asn',
            key: 'asn',
            width: 100,
            render: (asn: string) => (
                <Text style={{ fontFamily: 'monospace', fontSize: 12 }}>{asn}</Text>
            ),
        },
        {
            title: 'Organisation',
            dataIndex: 'org',
            key: 'org',
            ellipsis: true,
            render: (org: string) => (
                <Text style={{ fontSize: 12 }}>{org || <Text type="secondary">—</Text>}</Text>
            ),
        },
        {
            title: 'Share',
            key: 'pct',
            width: 160,
            render: (_: any, r) => (
                <Space size={8}>
                    <InlineBar pct={r.percentage} color="#8b5cf6" />
                    <Text style={{ fontSize: 11, fontVariantNumeric: 'tabular-nums', minWidth: 42, display: 'inline-block' }}>
                        {r.percentage.toFixed(1)}%
                    </Text>
                </Space>
            ),
        },
        {
            title: 'Events',
            dataIndex: 'count',
            key: 'count',
            width: 100,
            align: 'right',
            render: (n: number) => (
                <Text style={{ fontVariantNumeric: 'tabular-nums', fontSize: 12 }}>
                    {n.toLocaleString()}
                </Text>
            ),
        },
    ];

    const cityCols: ColumnsType<GeoCity> = [
        {
            title: '',
            key: 'flag',
            width: 36,
            render: (_: any, r) => (
                <span style={{ fontSize: 16, lineHeight: 1 }}>{countryFlag(r.country) || '🏳'}</span>
            ),
        },
        {
            title: 'City',
            dataIndex: 'city',
            key: 'city',
            render: (city: string, r) => (
                <span>
                    <Text strong style={{ fontSize: 12 }}>{city || '—'}</Text>
                    {r.country && (
                        <Text type="secondary" style={{ fontSize: 11, marginLeft: 6, fontFamily: 'monospace' }}>
                            {r.country}
                        </Text>
                    )}
                </span>
            ),
        },
        {
            title: 'Share',
            key: 'pct',
            width: 160,
            render: (_: any, r) => (
                <Space size={8}>
                    <InlineBar pct={r.percentage} color="#06b6d4" />
                    <Text style={{ fontSize: 11, fontVariantNumeric: 'tabular-nums', minWidth: 42, display: 'inline-block' }}>
                        {r.percentage.toFixed(1)}%
                    </Text>
                </Space>
            ),
        },
        {
            title: 'Events',
            dataIndex: 'count',
            key: 'count',
            width: 100,
            align: 'right',
            render: (n: number) => (
                <Text style={{ fontVariantNumeric: 'tabular-nums', fontSize: 12 }}>
                    {n.toLocaleString()}
                </Text>
            ),
        },
    ];

    // UA kinds → donut data
    const uaKindData = Object.entries(summary.user_agents.kinds ?? {})
        .filter(([, v]) => v > 0)
        .sort(([, a], [, b]) => b - a)
        .map(([name, value]) => ({
            name,
            value,
            color: uaKindColor(name),
        }));

    // Internal/external donut
    const ivData = [
        { name: 'External', value: iv.external, color: '#3b82f6' },
        { name: 'Internal', value: iv.internal, color: '#10b981' },
        { name: 'Unknown', value: iv.unknown, color: '#9ca3af' },
    ].filter((d) => d.value > 0);

    // ── Time-series chart series ──
    const ts = summary.time_series;
    const seriesXAxis = (ts?.buckets ?? []).map((b) => b);

    const countrySeriesData: MetricLineSeries[] = (ts?.country_series ?? []).map((s, i) => ({
        name: countryFlag(s.label) ? `${countryFlag(s.label)} ${s.label}` : s.label,
        stack: 'countries',
        color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#6366f1', '#84cc16', '#22d3ee'][i % 10],
        data: s.values.map((v, idx) => [seriesXAxis[idx], v] as [string, number]),
    }));

    const uaSeriesData: MetricLineSeries[] = (ts?.ua_kind_series ?? []).map((s) => ({
        name: s.name || s.label,
        stack: 'ua',
        color: uaKindColor(s.label),
        data: s.values.map((v, idx) => [seriesXAxis[idx], v] as [string, number]),
    }));

    const tiSeriesData: MetricLineSeries[] = ts?.ti_hits_series
        ? [
              {
                  name: 'Threat-intel hits',
                  color: '#ef4444',
                  area: true,
                  data: ts.ti_hits_series.map((v, idx) => [seriesXAxis[idx], v] as [string, number]),
              },
          ]
        : [];

    return (
        <>
            {toolbar}

            {/* KPI row — each tile carries enough secondary signal so the
             *  card body fills the space instead of leaving a big empty
             *  rectangle. Pattern: small uppercase label + large number
             *  + supporting visual (icon / mini stat list / status pill). */}
            <Row gutter={[12, 12]} style={{ marginBottom: 12 }} align="stretch">
                <Col xs={24} md={6} style={{ display: 'flex' }}>
                    <Card size="small" style={{ borderRadius: 8, width: '100%' }}>
                        <Text
                            type="secondary"
                            style={{
                                fontSize: 10,
                                textTransform: 'uppercase',
                                letterSpacing: 1,
                                display: 'block',
                                marginBottom: 10,
                            }}
                        >
                            <InfoLabel info="Total ClickHouse events seen for this endpoint within the selected time window.">
                                Total Events
                            </InfoLabel>
                        </Text>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div
                                style={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: 12,
                                    background: 'rgba(10, 127, 218, 0.15)',
                                    color: 'var(--color-primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 28,
                                    flexShrink: 0,
                                }}
                            >
                                <LineChartOutlined />
                            </div>
                            <div style={{ minWidth: 0 }}>
                                <Tooltip title={`Exact: ${summary.total_events.toLocaleString()}`}>
                                    <Title
                                        level={2}
                                        style={{
                                            margin: 0,
                                            lineHeight: 1,
                                            color: 'var(--color-primary)',
                                            fontVariantNumeric: 'tabular-nums',
                                        }}
                                    >
                                        {formatCompactNumber(summary.total_events)}
                                    </Title>
                                </Tooltip>
                                <Text type="secondary" style={{ fontSize: 11 }}>
                                    in window
                                </Text>
                            </div>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} md={10} style={{ display: 'flex' }}>
                    <Card size="small" style={{ borderRadius: 8, width: '100%' }}>
                        <Text
                            type="secondary"
                            style={{
                                fontSize: 10,
                                textTransform: 'uppercase',
                                letterSpacing: 1,
                                display: 'block',
                                marginBottom: 10,
                            }}
                        >
                            <InfoLabel info="Split of source IPs by reachability class. Internal = loopback / RFC1918 / *.svc.cluster.local / *.local. External = public addresses. Unknown = absent or unparseable.">
                                Internal vs External
                            </InfoLabel>
                        </Text>
                        {ivTotal > 0 ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ flex: '0 0 130px' }}>
                                    <SmallDonut data={ivData} height={130} />
                                </div>
                                <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    {(
                                        [
                                            { name: 'External', value: iv.external, color: '#3b82f6' },
                                            { name: 'Internal', value: iv.internal, color: '#10b981' },
                                            { name: 'Unknown', value: iv.unknown, color: '#9ca3af' },
                                        ] as const
                                    ).map((row) => (
                                        <div
                                            key={row.name}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 8,
                                            }}
                                        >
                                            <span
                                                style={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: 2,
                                                    background: row.color,
                                                    flexShrink: 0,
                                                }}
                                            />
                                            <Text style={{ fontSize: 12, flex: 1 }}>{row.name}</Text>
                                            <Text strong style={{ fontSize: 13, fontVariantNumeric: 'tabular-nums' }}>
                                                {formatCompactNumber(row.value)}
                                            </Text>
                                            <Text type="secondary" style={{ fontSize: 11, minWidth: 42, textAlign: 'right' }}>
                                                {ivTotal > 0 ? ((row.value / ivTotal) * 100).toFixed(1) : '0'}%
                                            </Text>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <Text type="secondary" style={{ fontSize: 12 }}>No traffic samples.</Text>
                        )}
                    </Card>
                </Col>

                <Col xs={24} md={8} style={{ display: 'flex' }}>
                    <Card size="small" style={{ borderRadius: 8, width: '100%' }}>
                        <Text
                            type="secondary"
                            style={{
                                fontSize: 10,
                                textTransform: 'uppercase',
                                letterSpacing: 1,
                                display: 'block',
                                marginBottom: 10,
                            }}
                        >
                            <InfoLabel info="Number of source IPs matched against the configured threat-intel feeds (Spamhaus DROP, AbuseIPDB, custom lists). Higher = active hostile traffic.">
                                Threat Intelligence
                            </InfoLabel>
                        </Text>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div
                                style={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: 12,
                                    background:
                                        tiPct >= 1
                                            ? 'rgba(239, 68, 68, 0.15)'
                                            : tiPct > 0
                                                ? 'rgba(245, 158, 11, 0.15)'
                                                : 'rgba(16, 185, 129, 0.15)',
                                    color:
                                        tiPct >= 1
                                            ? 'var(--color-error)'
                                            : tiPct > 0
                                                ? 'var(--color-warning)'
                                                : 'var(--color-success)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 28,
                                    flexShrink: 0,
                                }}
                            >
                                {summary.threat_intel.total_hits > 0 ? <WarningOutlined /> : <SafetyOutlined />}
                            </div>
                            <div style={{ minWidth: 0 }}>
                                <Title
                                    level={2}
                                    style={{
                                        margin: 0,
                                        lineHeight: 1,
                                        color:
                                            tiPct >= 1
                                                ? 'var(--color-error)'
                                                : tiPct > 0
                                                    ? 'var(--color-warning)'
                                                    : 'var(--color-success)',
                                        fontVariantNumeric: 'tabular-nums',
                                    }}
                                >
                                    {formatCompactNumber(summary.threat_intel.total_hits)}
                                </Title>
                                <Text type="secondary" style={{ fontSize: 11 }}>
                                    hits · {tiPct.toFixed(2)}% of total ·{' '}
                                    {summary.threat_intel.total_hits > 0 ? 'review sources' : 'clean'}
                                </Text>
                            </div>
                        </div>
                        {(summary.threat_intel.top_sources?.length ?? 0) > 0 && (
                            <div style={{ marginTop: 10 }}>
                                <Space size={[4, 4]} wrap>
                                    {summary.threat_intel.top_sources!.slice(0, 4).map((s: TISource) => (
                                        <Tag
                                            key={s.source}
                                            className="auto-width-tag"
                                            color="red"
                                            style={{ fontSize: 11, margin: 0 }}
                                        >
                                            {s.source} · {s.count}
                                        </Tag>
                                    ))}
                                </Space>
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>

            {/* Country + ASN tables */}
            <Row gutter={[12, 12]} style={{ marginBottom: 12 }} align="stretch">
                <Col xs={24} md={12} style={{ display: 'flex' }}>
                    <Card
                        size="small"
                        title={
                            <InfoLabel info="Top source countries by event count. ISO-3166 α-2 codes resolved by the collector's MaxMind GeoIP lookup.">
                                Top Countries
                            </InfoLabel>
                        }
                        style={{ borderRadius: 8, width: '100%' }}
                        styles={{ body: { padding: 0 } }}
                    >
                        <Table<GeoCountry>
                            rowKey={(r) => r.code || r.name}
                            columns={countryCols}
                            dataSource={summary.top_countries ?? []}
                            pagination={false}
                            size="small"
                            locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No country data" /> }}
                        />
                    </Card>
                </Col>
                <Col xs={24} md={12} style={{ display: 'flex' }}>
                    <Card
                        size="small"
                        title={
                            <InfoLabel info="Top Autonomous System Numbers — the network operator each source IP belongs to. Filter the inventory list by ASN on the previous page for a cross-pivot.">
                                Top ASNs
                            </InfoLabel>
                        }
                        style={{ borderRadius: 8, width: '100%' }}
                        styles={{ body: { padding: 0 } }}
                    >
                        <Table<GeoASN>
                            rowKey={(r) => r.asn}
                            columns={asnCols}
                            dataSource={summary.top_asns ?? []}
                            pagination={false}
                            size="small"
                            locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No ASN data" /> }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* City + UA kinds */}
            <Row gutter={[12, 12]} style={{ marginBottom: 12 }} align="stretch">
                <Col xs={24} md={14} style={{ display: 'flex' }}>
                    <Card
                        size="small"
                        title={
                            <InfoLabel info="Top source cities — (city, country) pairs so duplicates like 'Springfield' across regions stay separate.">
                                Top Cities
                            </InfoLabel>
                        }
                        style={{ borderRadius: 8, width: '100%' }}
                        styles={{ body: { padding: 0 } }}
                    >
                        <Table<GeoCity>
                            rowKey={(r) => `${r.country}:${r.city}`}
                            columns={cityCols}
                            dataSource={summary.top_cities ?? []}
                            pagination={false}
                            size="small"
                            locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No city data" /> }}
                        />
                    </Card>
                </Col>
                <Col xs={24} md={10} style={{ display: 'flex' }}>
                    <Card
                        size="small"
                        title={
                            <InfoLabel info="Distribution of User-Agent taxonomy buckets — browser / cli / library / bot / crawler / monitor / unknown. The collector classifies each UA string at ingest.">
                                UA Kinds
                            </InfoLabel>
                        }
                        style={{ borderRadius: 8, width: '100%' }}
                    >
                        {uaKindData.length > 0 ? (
                            <SmallDonut data={uaKindData} height={200} />
                        ) : (
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No UA data" />
                        )}
                    </Card>
                </Col>
            </Row>

            {/* Raw UA / Source IP tables — compliance-gated.
             *  Both come back as arrays when the collector stores raw values,
             *  null/[] when compliance opts out. */}
            {(((summary.top_user_agents?.length ?? 0) > 0) ||
              ((summary.top_source_ips?.length ?? 0) > 0)) && (
                <Row gutter={[12, 12]} style={{ marginBottom: 12 }} align="stretch">
                    {(summary.top_user_agents?.length ?? 0) > 0 && (
                        <Col xs={24} md={14} style={{ display: 'flex' }}>
                            <Card
                                size="small"
                                title={
                                    <InfoLabel info="Exact raw User-Agent strings ranked by event count. Only populated when the collector's compliance config keeps raw UA values (Policy.StoreRawUserAgent=true). Hashed counterparts always exist in Top UA Families.">
                                        Top User Agents
                                    </InfoLabel>
                                }
                                style={{ borderRadius: 8, width: '100%' }}
                                styles={{ body: { padding: 0 } }}
                            >
                                <Table
                                    rowKey={(r: RawUserAgent) => r.value}
                                    dataSource={summary.top_user_agents ?? []}
                                    pagination={false}
                                    size="small"
                                    columns={[
                                        {
                                            title: 'User-Agent',
                                            dataIndex: 'value',
                                            key: 'value',
                                            ellipsis: true,
                                            render: (v: string) => (
                                                <Tooltip title={v}>
                                                    <Text
                                                        style={{
                                                            fontFamily: 'monospace',
                                                            fontSize: 11,
                                                        }}
                                                    >
                                                        {v}
                                                    </Text>
                                                </Tooltip>
                                            ),
                                        },
                                        {
                                            title: 'Share',
                                            key: 'pct',
                                            width: 160,
                                            render: (_: any, r: RawUserAgent) => (
                                                <Space size={8}>
                                                    <InlineBar pct={r.percentage} color="#06b6d4" />
                                                    <Text
                                                        style={{
                                                            fontSize: 11,
                                                            fontVariantNumeric: 'tabular-nums',
                                                            minWidth: 42,
                                                            display: 'inline-block',
                                                        }}
                                                    >
                                                        {r.percentage.toFixed(1)}%
                                                    </Text>
                                                </Space>
                                            ),
                                        },
                                        {
                                            title: 'Events',
                                            dataIndex: 'count',
                                            key: 'count',
                                            width: 100,
                                            align: 'right',
                                            render: (n: number) => (
                                                <Text
                                                    style={{
                                                        fontVariantNumeric: 'tabular-nums',
                                                        fontSize: 12,
                                                    }}
                                                >
                                                    {n.toLocaleString()}
                                                </Text>
                                            ),
                                        },
                                    ]}
                                />
                            </Card>
                        </Col>
                    )}
                    {(summary.top_source_ips?.length ?? 0) > 0 && (
                        <Col xs={24} md={10} style={{ display: 'flex' }}>
                            <Card
                                size="small"
                                title={
                                    <InfoLabel info="Exact source IP addresses ranked by event count. Only populated when the collector's compliance config keeps raw IPs (Policy.StoreRawSourceIP=true). Hashed counterparts power the Unique source IPs aggregate.">
                                        Top Source IPs
                                    </InfoLabel>
                                }
                                style={{ borderRadius: 8, width: '100%' }}
                                styles={{ body: { padding: 0 } }}
                            >
                                <Table
                                    rowKey={(r: RawSourceIP) => r.value}
                                    dataSource={summary.top_source_ips ?? []}
                                    pagination={false}
                                    size="small"
                                    columns={[
                                        {
                                            title: 'IP',
                                            dataIndex: 'value',
                                            key: 'value',
                                            render: (v: string) => (
                                                <Text
                                                    style={{
                                                        fontFamily: 'monospace',
                                                        fontSize: 12,
                                                    }}
                                                >
                                                    {v}
                                                </Text>
                                            ),
                                        },
                                        {
                                            title: 'Share',
                                            key: 'pct',
                                            width: 130,
                                            render: (_: any, r: RawSourceIP) => (
                                                <Space size={6}>
                                                    <InlineBar pct={r.percentage} color="#ef4444" width={60} />
                                                    <Text
                                                        style={{
                                                            fontSize: 11,
                                                            fontVariantNumeric: 'tabular-nums',
                                                            minWidth: 38,
                                                            display: 'inline-block',
                                                        }}
                                                    >
                                                        {r.percentage.toFixed(1)}%
                                                    </Text>
                                                </Space>
                                            ),
                                        },
                                        {
                                            title: 'Events',
                                            dataIndex: 'count',
                                            key: 'count',
                                            width: 90,
                                            align: 'right',
                                            render: (n: number) => (
                                                <Text
                                                    style={{
                                                        fontVariantNumeric: 'tabular-nums',
                                                        fontSize: 12,
                                                    }}
                                                >
                                                    {n.toLocaleString()}
                                                </Text>
                                            ),
                                        },
                                    ]}
                                />
                            </Card>
                        </Col>
                    )}
                </Row>
            )}

            {/* Top families */}
            {(summary.user_agents.top_families?.length ?? 0) > 0 && (
                <Card
                    size="small"
                    title={
                        <InfoLabel info="Specific User-Agent family names (Chrome, curl, Googlebot, …) ranked by event count. Each row carries its UA kind for context.">
                            Top UA Families
                        </InfoLabel>
                    }
                    style={{ borderRadius: 8, marginBottom: 12 }}
                >
                    <Space size={[8, 8]} wrap>
                        {summary.user_agents.top_families!.slice(0, 16).map((f: UAFamily) => {
                            const bg = uaKindColor(f.kind);
                            const fg = readableOn(bg);
                            return (
                                <Tag
                                    key={`${f.kind}:${f.family}`}
                                    className="auto-width-tag"
                                    color={bg}
                                    style={{ margin: 0, fontSize: 11, color: fg }}
                                >
                                    {f.family}
                                    <Text style={{ marginLeft: 6, opacity: 0.85, fontWeight: 400, color: fg }}>
                                        {f.count.toLocaleString()}
                                    </Text>
                                </Tag>
                            );
                        })}
                    </Space>
                </Card>
            )}

            {/* Time-series widgets */}
            {includeSeries && ts && (
                <Row gutter={[12, 12]}>
                    {countrySeriesData.length > 0 && (
                        <Col xs={24} md={12}>
                            <Card
                                size="small"
                                title={
                                    <InfoLabel info={`Stacked country events per bucket (${ts.granularity} granularity). Top-${countrySeriesData.length} countries plus an "other" series so totals add up.`}>
                                        Country trend
                                    </InfoLabel>
                                }
                                style={{ borderRadius: 8 }}
                            >
                                <MetricLineChart series={countrySeriesData} />
                            </Card>
                        </Col>
                    )}
                    {uaSeriesData.length > 0 && (
                        <Col xs={24} md={12}>
                            <Card
                                size="small"
                                title={
                                    <InfoLabel info={`Stacked UA-kind events per bucket (${ts.granularity}). Bot/crawler surges are visible as red bands.`}>
                                        UA kind trend
                                    </InfoLabel>
                                }
                                style={{ borderRadius: 8 }}
                            >
                                <MetricLineChart series={uaSeriesData} />
                            </Card>
                        </Col>
                    )}
                    {tiSeriesData.length > 0 && (
                        <Col xs={24}>
                            <Card
                                size="small"
                                title={
                                    <InfoLabel info={`Threat-intel hits per bucket (${ts.granularity}). Any non-zero value is a source IP from a known-bad feed reaching this endpoint.`}>
                                        Threat-intel hits
                                    </InfoLabel>
                                }
                                style={{ borderRadius: 8 }}
                            >
                                <MetricLineChart series={tiSeriesData} />
                            </Card>
                        </Col>
                    )}
                </Row>
            )}
        </>
    );
};

// ---------- Wrapper ----------

// 403 → role message; otherwise surface the backend's error text.
const inventoryErrMsg = (e: any, fallback: string): string => {
    const s = e?.response?.status;
    if (s === 403) return 'Only an Admin or Owner can manage the API inventory.';
    if (s === 404) return 'Endpoint not found — it may already be gone.';
    return e?.response?.data?.error || e?.response?.data?.message || e?.message || fallback;
};

const ApiDiscoveryEndpointDetail: React.FC = () => {
    const { project } = useProjectVariable();
    const { listenerName: encodedName, id } = useParams<{
        listenerName: string;
        id: string;
    }>();
    const listenerName = encodedName ? decodeURIComponent(encodedName) : '';
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const activeTab = (searchParams.get('tab') as 'overview' | 'events' | 'analytics' | 'insights') ?? 'overview';
    const setActiveTab = (tab: string) => {
        const next = new URLSearchParams(searchParams);
        next.set('tab', tab);
        setSearchParams(next, { replace: true });
    };

    const { data, isLoading, error, refetch } = useApiInventoryDetail(id, !!project);
    const doc = data?.data;

    // Inventory cleanup actions — Admin/Owner only.
    const userDetail = useAuth();
    const isAdminOrOwner = ['owner', 'admin'].includes(userDetail?.role?.toLowerCase() || '');
    const deleteMut = useApiInventoryDeleteEndpoint();
    const resetMut = useApiInventoryResetEndpoint();

    const handleReset = () => {
        if (!id) return;
        Modal.confirm({
            title: 'Reset counters & risk flags?',
            content:
                'Zeroes the call / byte / latency counters, status distribution, and the ' +
                'accumulated risk flags & score. first_seen and discovery metadata ' +
                '(methods, clusters, routes…) are kept. This is not a permanent freeze — the ' +
                'collector resumes accumulating from the next event.',
            okText: 'Reset',
            async onOk() {
                try {
                    const res = await resetMut.mutateAsync(id);
                    message.success(res.message || 'Counters reset');
                    if (res.note) message.info(res.note, 6);
                    refetch();
                } catch (e) {
                    message.error(inventoryErrMsg(e, 'Failed to reset endpoint'));
                    throw e;
                }
            },
        });
    };

    const handleDelete = () => {
        if (!id) return;
        Modal.confirm({
            title: 'Delete this endpoint?',
            content:
                'Removes this endpoint document from the inventory. If the endpoint still ' +
                'receives traffic, the collector will recreate it on the next request — ' +
                'permanent deletion only applies once its traffic has stopped.',
            okText: 'Delete',
            okButtonProps: { danger: true },
            async onOk() {
                try {
                    const res = await deleteMut.mutateAsync(id);
                    message.success(res.message || 'Endpoint deleted');
                    if (res.warning) message.warning(res.warning, 6);
                    navigate(`/api-discovery/${encodeURIComponent(listenerName)}`);
                } catch (e) {
                    message.error(inventoryErrMsg(e, 'Failed to delete endpoint'));
                    throw e;
                }
            },
        });
    };

    return (
        <div style={{ padding: '0px' }}>
            {/* Hero header — matches the Page 1 / Page 2 pattern: gradient
                bg + 44×44 icon box + title + subtitle on the left, action
                buttons on the right. Method tag inlines with the path so
                the whole identifier reads as one unit. */}
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
                {/* Top row — identity (back, icon, title, meta). */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0, flexWrap: 'wrap' }}>
                    <BackButton
                        onClick={() => navigate(`/api-discovery/${encodeURIComponent(listenerName)}`)}
                    />
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
                        <Space
                            size={10}
                            align="center"
                            wrap
                            style={{ display: 'flex', marginBottom: 6 }}
                        >
                            {doc?.method && (
                                <Tag
                                    className="auto-width-tag"
                                    color={METHOD_HEADER_COLOR[doc.method] ?? 'blue'}
                                    style={{
                                        fontSize: 12,
                                        margin: 0,
                                        letterSpacing: 0.3,
                                        padding: '2px 10px',
                                    }}
                                >
                                    {doc.method}
                                </Tag>
                            )}
                            <Tooltip
                                title={
                                    <div style={{ fontSize: 12 }}>
                                        <div style={{ fontWeight: 600, marginBottom: 4 }}>Normalized path</div>
                                        <div style={{ marginBottom: 6 }}>
                                            The collector templatizes dynamic path segments so that
                                            <code> /users/42 </code> and <code> /users/99 </code> collapse
                                            into one endpoint. Placeholders you may see:
                                        </div>
                                        <div style={{ lineHeight: 1.7 }}>
                                            <code>{'{id}'}</code> numeric id ·{' '}
                                            <code>{'{uuid}'}</code> UUID ·{' '}
                                            <code>{'{objectid}'}</code> Mongo ObjectID ·{' '}
                                            <code>{'{ulid}'}</code> ULID ·{' '}
                                            <code>{'{token}'}</code> JWT-like ·{' '}
                                            <code>{'{dynamic}'}</code> high-entropy / hash ·{' '}
                                            <code>{'{traversal}'}</code> <code>.</code>/<code>..</code> ·{' '}
                                            <code>{'{pii}'}</code> a segment that matched a PII pattern
                                        </div>
                                    </div>
                                }
                            >
                                <Text
                                    strong
                                    style={{
                                        fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                                        fontSize: 20,
                                        lineHeight: 1.2,
                                        wordBreak: 'break-all',
                                        cursor: 'help',
                                    }}
                                >
                                    {doc?.normalized_path || (isLoading ? '…' : '—')}
                                </Text>
                            </Tooltip>
                        </Space>
                        {doc && (
                            <Space
                                split={<span style={{ color: 'var(--border-default)' }}>·</span>}
                                size={6}
                                wrap
                                style={{ display: 'flex' }}
                            >
                                <Text type="secondary" style={{ fontSize: 12 }}>{listenerName}</Text>
                                {doc.host && (
                                    <Text
                                        type="secondary"
                                        style={{
                                            fontSize: 12,
                                            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                                        }}
                                    >
                                        {doc.host}
                                    </Text>
                                )}
                                {doc.protocol && (
                                    <Tag
                                        className="auto-width-tag"
                                        style={{ fontSize: 10, margin: 0, padding: '0 6px' }}
                                    >
                                        {doc.protocol}
                                    </Tag>
                                )}
                                {doc.first_seen && (
                                    <Tooltip title={new Date(doc.first_seen).toLocaleString()}>
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            First seen {formatDistanceToNow(new Date(doc.first_seen), { addSuffix: true })}
                                        </Text>
                                    </Tooltip>
                                )}
                                {doc.last_seen && (
                                    <Tooltip title={new Date(doc.last_seen).toLocaleString()}>
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            Last seen {formatDistanceToNow(new Date(doc.last_seen), { addSuffix: true })}
                                        </Text>
                                    </Tooltip>
                                )}
                            </Space>
                        )}
                    </div>
                </div>

                {doc && (
                    /* Bottom row — KPIs left, actions right, divider above. */
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
                            <Tooltip title={`Exact: ${(doc.seen_count ?? 0).toLocaleString()}`}>
                                <div>
                                    <KpiPill
                                        label="Calls"
                                        value={formatCompactNumber(doc.seen_count ?? 0)}
                                        accent="var(--color-primary)"
                                    />
                                </div>
                            </Tooltip>
                            <KpiPill
                                label="Max latency"
                                value={
                                    doc.latency_max_ms
                                        ? doc.latency_max_ms < 1000
                                            ? `${doc.latency_max_ms.toFixed(0)}ms`
                                            : `${(doc.latency_max_ms / 1000).toFixed(1)}s`
                                        : '—'
                                }
                                accent="var(--color-warning)"
                            />
                            <KpiPill
                                label="Threat"
                                value={String(doc.max_risk_score ?? 0)}
                                accent={
                                    (doc.max_risk_score ?? 0) >= 25
                                        ? 'var(--color-error)'
                                        : (doc.max_risk_score ?? 0) >= 10
                                            ? 'var(--color-warning)'
                                            : '#d4a012'
                                }
                            />
                            <KpiPill
                                label="Exposure"
                                value={String(doc.max_posture_score ?? 0)}
                                accent={
                                    (doc.max_posture_score ?? 0) >= 25
                                        ? '#c41d7f'
                                        : (doc.max_posture_score ?? 0) >= 10
                                            ? '#531dab'
                                            : '#1677ff'
                                }
                            />
                        </Space>
                        {isAdminOrOwner && (
                            <Dropdown
                                trigger={['click']}
                                menu={{
                                    items: [
                                        {
                                            key: 'reset',
                                            icon: <ReloadOutlined />,
                                            label: 'Reset counters & risk',
                                            onClick: handleReset,
                                        },
                                        {
                                            key: 'delete',
                                            icon: <DeleteOutlined />,
                                            label: 'Delete endpoint',
                                            danger: true,
                                            onClick: handleDelete,
                                        },
                                    ],
                                }}
                            >
                                <Button icon={<MoreOutlined />}>Actions</Button>
                            </Dropdown>
                        )}
                    </div>
                )}
            </div>

            {isLoading ? (
                <Card size="small" style={{ borderRadius: 8 }}>
                    <div style={{ textAlign: 'center', padding: 60 }}>
                        <Spin />
                    </div>
                </Card>
            ) : error || !doc ? (
                <Card size="small" style={{ borderRadius: 8 }}>
                    <Empty
                        description={
                            <Text type="secondary">
                                {error
                                    ? 'Failed to load endpoint detail.'
                                    : 'Endpoint not found in this project.'}
                            </Text>
                        }
                    />
                </Card>
            ) : (
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={[
                        {
                            key: 'overview',
                            label: (
                                <InfoLabel info="Aggregated summary from MongoDB inventory. KPIs, latency histogram, status donut, and observed categorisation accumulated across every event for this endpoint.">
                                    Overview
                                </InfoLabel>
                            ),
                            children: (
                                <ComponentLoadErrorBoundary componentName="Overview">
                                    <OverviewTab doc={doc} />
                                </ComponentLoadErrorBoundary>
                            ),
                        },
                        {
                            key: 'events',
                            label: (
                                <InfoLabel info="Raw per-request event log from ClickHouse. Up to 500 events per page over a selectable time window (max 7 days). Use this to investigate specific calls.">
                                    Events
                                </InfoLabel>
                            ),
                            children: (
                                <ComponentLoadErrorBoundary componentName="Events">
                                    <EventsTab id={id!} methods={doc.method ? [doc.method] : []} />
                                </ComponentLoadErrorBoundary>
                            ),
                        },
                        {
                            key: 'analytics',
                            label: (
                                <InfoLabel info="Time-series rollups (1-minute, 1-hour, or 1-day buckets). Latency percentiles, error rate, throughput, unique-consumer counts, and max risk score over time.">
                                    Analytics
                                </InfoLabel>
                            ),
                            children: (
                                <ComponentLoadErrorBoundary componentName="Analytics">
                                    <AnalyticsTab id={id!} doc={doc} methods={doc.method ? [doc.method] : []} />
                                </ComponentLoadErrorBoundary>
                            ),
                        },
                        {
                            key: 'insights',
                            label: (
                                <InfoLabel info="Geo & threat intelligence — top source countries, ASNs, cities, User-Agent breakdown, and threat-intel hits. Optional time-series stack per dimension.">
                                    Insights
                                </InfoLabel>
                            ),
                            children: (
                                <ComponentLoadErrorBoundary componentName="Insights">
                                    <InsightsTab id={id!} doc={doc} methods={doc.method ? [doc.method] : []} />
                                </ComponentLoadErrorBoundary>
                            ),
                        },
                    ]}
                />
            )}
        </div>
    );
};

export default ApiDiscoveryEndpointDetail;
