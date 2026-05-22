import React, { useMemo, useState } from 'react';
import {
    Card,
    Table,
    Tag,
    Space,
    Button,
    Select,
    Empty,
    Typography,
    Tooltip,
    Drawer,
    Alert,
    Row,
    Col,
    Spin,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    ReloadOutlined,
    TeamOutlined,
    UserOutlined,
    EyeInvisibleOutlined,
    GlobalOutlined,
    AlertOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import {
    useApiInventoryConsumers,
    useApiInventoryConsumerDetail,
} from '@/hooks/useApiDiscovery';
import TimeRangePicker, { defaultTimeRange, type TimeRange } from '../components/TimeRangePicker';
import EndpointPath from '../components/EndpointPath';
import InfoLabel from '../components/InfoLabel';
import { methodColor } from '../lib/methodColor';
import { formatCompactNumber } from '../lib/formatNumber';
import { threatTagColor } from '../lib/riskFlagCatalog';
import { countryFlag } from '../lib/countryFlag';
import { CONSUMER_INFO } from '../lib/consumerInfo';
import type { ConsumerRow, ConsumerEndpoint } from '../types';

const { Text, Title } = Typography;

const shortHash = (h: string): string => (h && h.length > 14 ? `${h.slice(0, 14)}…` : h || '—');

// Mirrors the backend detail-endpoint validation: lowercase hex, 16–64 chars
// (the collector's hash width varies by build). Anything else can't drill in.
const HASH_RE = /^[a-f0-9]{16,64}$/;

const statusColor = (code: string): string => {
    const c = parseInt(code, 10);
    if (c >= 500) return 'var(--color-error)';
    if (c >= 400) return 'var(--color-warning)';
    if (c >= 300) return 'var(--color-primary)';
    return 'var(--color-success)';
};

// Compact "label → count" proportion bars for method/status distributions.
const DistBars: React.FC<{
    dist: Record<string, number>;
    // eslint-disable-next-line no-unused-vars
    colorOf?: (k: string) => string;
}> = ({ dist, colorOf }) => {
    const entries = Object.entries(dist ?? {}).sort((a, b) => b[1] - a[1]);
    const max = entries.reduce((m, [, n]) => Math.max(m, n), 0) || 1;
    if (entries.length === 0) return <Text type="secondary" style={{ fontSize: 12 }}>—</Text>;
    return (
        <Space direction="vertical" size={6} style={{ width: '100%' }}>
            {entries.map(([k, n]) => (
                <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Text style={{ fontSize: 12, minWidth: 52, fontFamily: 'Monaco, Menlo, monospace' }}>{k}</Text>
                    <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'var(--bg-elevated)', overflow: 'hidden' }}>
                        <div style={{ width: `${(n / max) * 100}%`, height: '100%', background: colorOf ? colorOf(k) : 'var(--color-primary)' }} />
                    </div>
                    <Text style={{ fontSize: 12, minWidth: 56, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                        {formatCompactNumber(n)}
                    </Text>
                </div>
            ))}
        </Space>
    );
};

const ConsumerDetailDrawer: React.FC<{ hash: string | null; range: TimeRange; onClose: () => void }> = ({ hash, range, onClose }) => {
    const { data, isLoading, isClickhouseUnavailable, isClickhouseQueryFailed, error, refetch } =
        useApiInventoryConsumerDetail(hash ?? undefined, { from: range.from, to: range.to, top: 20 }, !!hash);

    const status = (error as any)?.response?.status;
    const badHash = status === 400;
    const noActivity = !isLoading && data && data.total_events === 0;

    return (
        <Drawer
            title={
                <Space size={8}>
                    <UserOutlined />
                    <InfoLabel info={CONSUMER_INFO}>Consumer</InfoLabel>
                    {hash && <Text code style={{ fontSize: 11 }}>{shortHash(hash)}</Text>}
                </Space>
            }
            placement="right"
            width="60vw"
            open={!!hash}
            onClose={onClose}
        >
            {isLoading ? (
                <div style={{ textAlign: 'center', padding: 60 }}><Spin /></div>
            ) : isClickhouseUnavailable ? (
                <Alert type="warning" showIcon message="ClickHouse not configured" description="Consumer analytics needs ClickHouse on the controller." />
            ) : badHash ? (
                <Alert
                    type="warning"
                    showIcon
                    message="Consumer detail unavailable"
                    description={
                        (error as any)?.response?.data?.error ||
                        'This consumer hash is not a valid hex digest, so a detail profile cannot be loaded.'
                    }
                />
            ) : isClickhouseQueryFailed ? (
                <Alert type="error" showIcon message="Query failed" description={<Button size="small" onClick={() => refetch()}>Retry</Button>} />
            ) : noActivity || !data ? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<Text type="secondary">No activity for this consumer in the selected window.</Text>} />
            ) : (
                <Space direction="vertical" size={16} style={{ width: '100%' }}>
                    {/* KPI tiles */}
                    <Row gutter={[12, 12]}>
                        {[
                            { label: 'Events', value: formatCompactNumber(data.total_events), accent: 'var(--color-primary)' },
                            { label: 'Endpoints', value: formatCompactNumber(data.distinct_endpoints), accent: 'var(--color-success)' },
                            { label: 'Source IPs', value: formatCompactNumber(data.distinct_ips), accent: 'var(--color-primary)' },
                            { label: 'Max threat', value: String(data.max_risk_score), accent: 'var(--color-error)' },
                            { label: 'Critical events', value: formatCompactNumber(data.critical_events), accent: 'var(--color-warning)' },
                            { label: 'TI hits', value: formatCompactNumber(data.ti_hits), accent: data.ti_hits > 0 ? 'var(--color-error)' : 'var(--text-tertiary)' },
                        ].map((k) => (
                            <Col key={k.label} xs={12} sm={8}>
                                <Card size="small" style={{ borderRadius: 8 }} styles={{ body: { padding: '10px 12px' } }}>
                                    <Text type="secondary" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block' }}>{k.label}</Text>
                                    <Title level={4} style={{ margin: 0, color: k.accent, fontVariantNumeric: 'tabular-nums' }}>{k.value}</Title>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {/* Geo / ASN + window */}
                    <Card size="small" style={{ borderRadius: 8 }}>
                        <Space wrap size={20}>
                            <Space size={6}>
                                <GlobalOutlined style={{ color: 'var(--text-tertiary)' }} />
                                {data.geo_country ? (
                                    <Text style={{ fontSize: 13 }}>
                                        {countryFlag(data.geo_country)} {data.geo_country}
                                        {data.geo_asn ? ` · ${data.geo_asn}` : ''}
                                        {data.geo_asn_org ? ` · ${data.geo_asn_org}` : ''}
                                    </Text>
                                ) : (
                                    <Tooltip title="No geo for this consumer — geo is enriched from the source IP and needs the collector's GeoIP database (Settings → API Discovery → GeoIP) plus raw source-IP storage. Without it, location/ASN come back empty.">
                                        <Text type="secondary" style={{ fontSize: 13, cursor: 'help' }}>
                                            Unknown location
                                        </Text>
                                    </Tooltip>
                                )}
                            </Space>
                            {data.first_seen && (
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    First {formatDistanceToNow(new Date(data.first_seen), { addSuffix: true })} · Last {data.last_seen ? formatDistanceToNow(new Date(data.last_seen), { addSuffix: true }) : '—'}
                                </Text>
                            )}
                        </Space>
                    </Card>

                    <Row gutter={[12, 12]}>
                        <Col xs={24} md={12}>
                            <Card size="small" title="Methods" style={{ borderRadius: 8, height: '100%' }}>
                                <DistBars dist={data.method_dist} colorOf={() => 'var(--color-primary)'} />
                            </Card>
                        </Col>
                        <Col xs={24} md={12}>
                            <Card size="small" title="Status codes" style={{ borderRadius: 8, height: '100%' }}>
                                <DistBars dist={data.status_dist} colorOf={statusColor} />
                            </Card>
                        </Col>
                    </Row>

                    {(data.top_source_ips?.length ?? 0) > 0 && (
                        <Card
                            size="small"
                            title={
                                <InfoLabel info="Source IPs this consumer connected from, by volume. Raw IP shows only when the collector stores raw source IPs; otherwise a hashed identifier is shown.">
                                    Top source IPs
                                </InfoLabel>
                            }
                            style={{ borderRadius: 8 }}
                        >
                            <Space direction="vertical" size={8} style={{ width: '100%' }}>
                                {(() => {
                                    const ips = data.top_source_ips ?? [];
                                    const maxC = ips.reduce((m, x) => Math.max(m, x.count), 0) || 1;
                                    return ips.map((s) => (
                                        <div key={s.hash || s.ip} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <Text
                                                style={{ fontSize: 12, minWidth: 150, fontFamily: 'Monaco, Menlo, monospace' }}
                                                title={s.ip || s.hash}
                                            >
                                                {s.ip || (
                                                    <Tooltip title={`Hashed (raw IP storage off): ${s.hash}`}>
                                                        <span style={{ color: 'var(--text-tertiary)' }}>🔒 {shortHash(s.hash)}</span>
                                                    </Tooltip>
                                                )}
                                            </Text>
                                            <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'var(--bg-elevated)', overflow: 'hidden' }}>
                                                <div style={{ width: `${(s.count / maxC) * 100}%`, height: '100%', background: 'var(--color-primary)' }} />
                                            </div>
                                            <Text style={{ fontSize: 12, minWidth: 56, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                                                {formatCompactNumber(s.count)}
                                            </Text>
                                        </div>
                                    ));
                                })()}
                            </Space>
                        </Card>
                    )}

                    <Card size="small" title="Top endpoints" style={{ borderRadius: 8 }} styles={{ body: { padding: 0 } }}>
                        <Table<ConsumerEndpoint>
                            rowKey={(e) => `${e.method}_${e.listener_name}_${e.normalized_path}`}
                            size="small"
                            pagination={false}
                            dataSource={data.top_endpoints ?? []}
                            scroll={{ x: 'max-content' }}
                            columns={[
                                {
                                    title: 'Method',
                                    dataIndex: 'method',
                                    key: 'method',
                                    width: 90,
                                    render: (m: string) => <Tag className="auto-width-tag" color={methodColor(m)} style={{ margin: 0, fontSize: 11 }}>{m || '—'}</Tag>,
                                },
                                {
                                    title: 'Path',
                                    dataIndex: 'normalized_path',
                                    key: 'normalized_path',
                                    render: (p: string, r) => (
                                        <Link to={`/api-discovery/${encodeURIComponent(r.listener_name)}?normalized_path=${encodeURIComponent(p)}`}>
                                            <EndpointPath path={p || '—'} />
                                        </Link>
                                    ),
                                },
                                {
                                    title: 'Calls',
                                    dataIndex: 'count',
                                    key: 'count',
                                    width: 90,
                                    render: (n: number) => <Text style={{ fontSize: 12, fontVariantNumeric: 'tabular-nums' }}>{formatCompactNumber(n ?? 0)}</Text>,
                                },
                                {
                                    title: 'Threat',
                                    dataIndex: 'max_risk_score',
                                    key: 'max_risk_score',
                                    width: 90,
                                    render: (n: number) => <Tag className="auto-width-tag" color={threatTagColor(n ?? 0)} style={{ margin: 0, fontSize: 11 }}>{n ?? 0}</Tag>,
                                },
                            ]}
                        />
                    </Card>
                </Space>
            )}
        </Drawer>
    );
};

const ConsumersDashboard: React.FC = () => {
    const [range, setRange] = useState<TimeRange>(() => defaultTimeRange(60 * 24));
    const [top, setTop] = useState(20);
    const [selectedHash, setSelectedHash] = useState<string | null>(null);

    const params = useMemo(() => ({ from: range.from, to: range.to, top }), [range, top]);
    const { data, isLoading, isFetching, isClickhouseUnavailable, isClickhouseQueryFailed, refetch } =
        useApiInventoryConsumers(params);

    const total = data?.total_events ?? 0;
    const anon = data?.anonymous_events ?? 0;
    const named = Math.max(0, total - anon);
    const anonPct = total > 0 ? Math.round((anon / total) * 100) : 0;
    const maxEvents = (data?.top_consumers ?? []).reduce((m, c) => Math.max(m, c.events), 0) || 1;

    const columns: ColumnsType<ConsumerRow> = [
        {
            title: <InfoLabel info={CONSUMER_INFO}>Consumer</InfoLabel>,
            dataIndex: 'consumer_hash',
            key: 'consumer_hash',
            render: (h: string) => {
                const ok = HASH_RE.test(h);
                return (
                    <Tooltip title={ok ? h : 'Invalid hash format — cannot open the consumer profile.'}>
                        <Text code style={{ fontSize: 11, cursor: ok ? 'pointer' : 'default', opacity: ok ? 1 : 0.65 }}>
                            {shortHash(h)}
                        </Text>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Events',
            dataIndex: 'events',
            key: 'events',
            width: 220,
            render: (n: number, r) => (
                <Space size={8} style={{ width: '100%' }}>
                    <div style={{ flex: 1, minWidth: 90, height: 6, borderRadius: 3, background: 'var(--bg-elevated)', overflow: 'hidden' }}>
                        <div style={{ width: `${(n / maxEvents) * 100}%`, height: '100%', background: 'var(--color-primary)' }} />
                    </div>
                    <Text style={{ fontSize: 12, fontVariantNumeric: 'tabular-nums', minWidth: 50, textAlign: 'right' }}>{formatCompactNumber(n)}</Text>
                    <Text type="secondary" style={{ fontSize: 11, minWidth: 44, textAlign: 'right' }}>{r.percentage?.toFixed(1)}%</Text>
                </Space>
            ),
        },
        {
            title: 'Threat',
            dataIndex: 'max_risk_score',
            key: 'max_risk_score',
            width: 80,
            render: (n: number) => <Tag className="auto-width-tag" color={threatTagColor(n ?? 0)} style={{ margin: 0, fontSize: 11 }}>{n ?? 0}</Tag>,
        },
        {
            title: 'TI hits',
            dataIndex: 'ti_hits',
            key: 'ti_hits',
            width: 80,
            render: (n: number) =>
                n > 0 ? (
                    <Tag className="auto-width-tag" color="red" style={{ margin: 0, fontSize: 11 }}>{n}</Tag>
                ) : (
                    <Text type="secondary" style={{ fontSize: 11 }}>0</Text>
                ),
        },
        {
            title: 'IPs',
            dataIndex: 'distinct_ips',
            key: 'distinct_ips',
            width: 70,
            render: (n: number) => <Text style={{ fontSize: 12 }}>{formatCompactNumber(n ?? 0)}</Text>,
        },
        {
            title: 'Endpoints',
            dataIndex: 'distinct_endpoints',
            key: 'distinct_endpoints',
            width: 100,
            render: (n: number) => <Text style={{ fontSize: 12 }}>{formatCompactNumber(n ?? 0)}</Text>,
        },
        {
            title: 'Last Seen',
            dataIndex: 'last_seen',
            key: 'last_seen',
            width: 140,
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
        <div>
            {/* Hero / controls */}
            <Card size="small" style={{ marginBottom: 12, borderRadius: 10 }}>
                <Space wrap size={16} style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Space wrap size={16}>
                        <div
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: 12,
                                background: 'rgba(10,127,218,0.15)',
                                color: 'var(--color-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 22,
                            }}
                        >
                            <TeamOutlined />
                        </div>
                        <div>
                            <Text type="secondary" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, display: 'block' }}>
                                <InfoLabel info={CONSUMER_INFO}>
                                    Consumers (last window)
                                </InfoLabel>
                            </Text>
                            <Title level={4} style={{ margin: 0 }}>
                                {formatCompactNumber(named)}{' '}
                                <Text type="secondary" style={{ fontSize: 13, fontWeight: 400 }}>named events</Text>
                            </Title>
                        </div>
                    </Space>
                    <Space wrap size={8}>
                        <TimeRangePicker value={range} onChange={setRange} />
                        <Select
                            value={top}
                            onChange={setTop}
                            options={[10, 20, 50].map((n) => ({ value: n, label: `Top ${n}` }))}
                            style={{ width: 100 }}
                        />
                        <Button icon={<ReloadOutlined spin={isFetching} />} onClick={() => refetch()} loading={isFetching}>
                            Refresh
                        </Button>
                    </Space>
                </Space>
            </Card>

            {isClickhouseUnavailable ? (
                <Card size="small" style={{ borderRadius: 10 }}>
                    <Alert
                        type="warning"
                        showIcon
                        message="ClickHouse not configured"
                        description="Consumer analytics reads raw events from ClickHouse. Configure CLICKHOUSE_URI on the controller to enable it."
                    />
                </Card>
            ) : isClickhouseQueryFailed ? (
                <Card size="small" style={{ borderRadius: 10 }}>
                    <Alert
                        type="error"
                        showIcon
                        message="Consumer query failed"
                        description={<Button size="small" icon={<ReloadOutlined />} onClick={() => refetch()}>Retry</Button>}
                    />
                </Card>
            ) : (
                <>
                    {/* Anonymous bucket card */}
                    <Card size="small" style={{ marginBottom: 12, borderRadius: 10 }}>
                        <Space wrap size={24}>
                            <Space size={8}>
                                <EyeInvisibleOutlined style={{ color: 'var(--text-tertiary)', fontSize: 18 }} />
                                <div>
                                    <Text type="secondary" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block' }}>
                                        Anonymous traffic
                                    </Text>
                                    <Text strong style={{ fontSize: 15 }}>
                                        {formatCompactNumber(anon)} <Text type="secondary" style={{ fontSize: 12, fontWeight: 400 }}>events · {anonPct}% of all</Text>
                                    </Text>
                                </div>
                            </Space>
                            <Space size={8}>
                                <AlertOutlined style={{ color: 'var(--text-tertiary)', fontSize: 18 }} />
                                <div>
                                    <Text type="secondary" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block' }}>
                                        Total events
                                    </Text>
                                    <Text strong style={{ fontSize: 15 }}>{formatCompactNumber(total)}</Text>
                                </div>
                            </Space>
                        </Space>
                    </Card>

                    <Card size="small" style={{ borderRadius: 10 }} styles={{ body: { padding: 0 } }}>
                        <Table<ConsumerRow>
                            className="api-discovery-table"
                            rowKey="consumer_hash"
                            columns={columns}
                            dataSource={data?.top_consumers ?? []}
                            loading={isLoading}
                            size="small"
                            pagination={false}
                            scroll={{ x: 'max-content' }}
                            onRow={(r) => ({
                                onClick: () => {
                                    if (HASH_RE.test(r.consumer_hash)) setSelectedHash(r.consumer_hash);
                                },
                                style: { cursor: HASH_RE.test(r.consumer_hash) ? 'pointer' : 'default' },
                            })}
                            locale={{
                                emptyText: (
                                    <div style={{ padding: '40px 0' }}>
                                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<Text type="secondary">No named consumers in this window.</Text>} />
                                    </div>
                                ),
                            }}
                        />
                    </Card>
                </>
            )}

            <ConsumerDetailDrawer hash={selectedHash} range={range} onClose={() => setSelectedHash(null)} />
        </div>
    );
};

export default ConsumersDashboard;
