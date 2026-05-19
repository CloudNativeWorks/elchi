import React, { useMemo } from 'react';
import {
    Card,
    Space,
    Button,
    Typography,
    Alert,
    Row,
    Col,
    Segmented,
    Table,
    Tag,
    Tooltip,
    Empty,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { TooltipComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { ReloadOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { useChartTheme } from '@/utils/chartTheme';
import { useApiInventoryTransport } from '@/hooks/useApiDiscovery';
import InfoLabel from '../components/InfoLabel';
import SamplingBadge from '../components/SamplingBadge';
import EndpointPath from '../components/EndpointPath';
import { formatCompactNumber } from '../lib/formatNumber';
import { riskFlagLabel } from '../lib/riskFlagCatalog';
import { WIN_OPTIONS, readWin } from '../lib/timeWindow';
import type { WeakTransportEntry } from '../types';

echarts.use([PieChart, TooltipComponent, LegendComponent, CanvasRenderer]);

const { Text, Title } = Typography;

// Per-slice colours — secure protocols green, legacy amber, insecure red.
const TLS_COLOR: Record<string, string> = {
    TLSv1_3: '#10b981',
    TLSv1_2: '#22c55e',
    'TLSv1_0/1_1': '#f97316',
    plaintext: '#ef4444',
};
const PROTO_COLOR: Record<string, string> = {
    'http/2': '#10b981',
    'http/3': '#22c55e',
    'http/1.x': '#f59e0b',
    tcp: '#9ca3af',
};

// One KPI tile — big percentage, label, good/bad accent.
const PctTile: React.FC<{ label: React.ReactNode; pct: number; good: boolean; loading?: boolean }> = ({
    label,
    pct,
    good,
    loading,
}) => (
    <Card
        size="small"
        loading={loading}
        style={{ borderRadius: 10, height: '100%' }}
        styles={{ body: { padding: 14 } }}
    >
        <Text type="secondary" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, display: 'block' }}>
            {label}
        </Text>
        <Title
            level={3}
            style={{ margin: '2px 0 0', color: good ? 'var(--color-success)' : 'var(--color-error)', fontVariantNumeric: 'tabular-nums' }}
        >
            {pct.toFixed(1)}%
        </Title>
    </Card>
);

const TransportDashboard: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    // Window derived from the URL — honours a `?win=` carried in from
    // the Security Score "View →" jump.
    const rangeMin = readWin(searchParams);

    const changeRange = (v: number) => {
        const np = new URLSearchParams(searchParams);
        np.set('win', String(v));
        setSearchParams(np, { replace: true });
    };

    const { from, to } = useMemo(() => {
        const now = dayjs();
        return { from: now.subtract(rangeMin, 'minute').toISOString(), to: now.toISOString() };
    }, [rangeMin]);

    const params = useMemo(() => ({ from, to, top: 200 }), [from, to]);
    const { data, isLoading, isFetching, refetch, isClickhouseUnavailable, isClickhouseQueryFailed } =
        useApiInventoryTransport(params);

    const { options: themeOpts, isDark } = useChartTheme();

    const donut = (
        title: string,
        dist: Record<string, number> | undefined,
        colorMap: Record<string, string>,
    ) => {
        const entries = Object.entries(dist ?? {}).filter(([, v]) => v > 0);
        if (entries.length === 0) return null;
        return {
            ...themeOpts,
            xAxis: undefined,
            yAxis: undefined,
            grid: undefined,
            tooltip: {
                ...themeOpts.tooltip,
                trigger: 'item',
                formatter: (p: any) => `<strong>${p.name}</strong><br/>${p.value.toLocaleString()} (${p.percent}%)`,
            },
            legend: { ...themeOpts.legend, type: 'scroll', orient: 'vertical', right: 8, top: 'center' },
            series: [
                {
                    name: title,
                    type: 'pie',
                    radius: ['46%', '74%'],
                    center: ['38%', '50%'],
                    avoidLabelOverlap: true,
                    itemStyle: { borderColor: isDark ? '#1f1f1f' : '#fff', borderWidth: 2 },
                    label: { show: false },
                    data: entries.map(([name, value]) => ({
                        name,
                        value,
                        itemStyle: { color: colorMap[name] ?? '#64748b' },
                    })),
                },
            ],
        };
    };

    const tlsDonut = useMemo(() => donut('TLS', data?.tls_versions, TLS_COLOR), [data, themeOpts, isDark]);
    const protoDonut = useMemo(() => donut('Protocol', data?.protocols, PROTO_COLOR), [data, themeOpts, isDark]);

    const columns: ColumnsType<WeakTransportEntry> = [
        {
            title: 'Path',
            dataIndex: 'normalized_path',
            key: 'normalized_path',
            render: (p: string, r) => (
                <Link
                    to={`/api-discovery/${encodeURIComponent(r.listener_name)}?normalized_path=${encodeURIComponent(p)}`}
                >
                    <EndpointPath path={p || '—'} />
                </Link>
            ),
        },
        {
            title: 'Listener',
            dataIndex: 'listener_name',
            key: 'listener_name',
            width: 160,
            ellipsis: true,
            render: (n: string) => <Text style={{ fontSize: 12 }}>{n}</Text>,
        },
        {
            title: 'Host',
            dataIndex: 'host',
            key: 'host',
            width: 180,
            ellipsis: true,
            render: (h: string) =>
                h ? (
                    <Text style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{h}</Text>
                ) : (
                    <Text type="secondary">—</Text>
                ),
        },
        {
            title: 'TLS',
            dataIndex: 'tls_version',
            key: 'tls_version',
            width: 110,
            render: (v: string) => (
                <Tag className="auto-width-tag" color={TLS_COLOR[v] ? undefined : 'red'} style={{ margin: 0, fontSize: 11, color: TLS_COLOR[v], borderColor: TLS_COLOR[v] ? `${TLS_COLOR[v]}55` : undefined }}>
                    {v || 'plaintext'}
                </Tag>
            ),
        },
        {
            title: 'Protocol',
            dataIndex: 'protocol',
            key: 'protocol',
            width: 110,
            render: (p: string) => <Text style={{ fontSize: 12, fontFamily: 'monospace' }}>{p || '—'}</Text>,
        },
        {
            title: 'Issues',
            dataIndex: 'issues',
            key: 'issues',
            render: (issues: string[]) => (
                <Space size={[4, 4]} wrap>
                    {(issues ?? []).map((i) => (
                        <Tag key={i} className="auto-width-tag" color="volcano" style={{ margin: 0, fontSize: 11 }}>
                            {riskFlagLabel(i)}
                        </Tag>
                    ))}
                </Space>
            ),
        },
        {
            title: 'Events',
            dataIndex: 'event_count',
            key: 'event_count',
            width: 100,
            align: 'right',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.event_count - b.event_count,
            render: (n: number) => (
                <Tooltip title={`Exact: ${(n ?? 0).toLocaleString()}`}>
                    <Text style={{ fontVariantNumeric: 'tabular-nums', fontSize: 12.5 }}>{formatCompactNumber(n ?? 0)}</Text>
                </Tooltip>
            ),
        },
    ];

    if (isClickhouseUnavailable) {
        return (
            <Alert
                type="warning"
                showIcon
                message="Transport posture unavailable"
                description={
                    <Text>
                        ClickHouse is not configured (HTTP 503). Set <code>CLICKHOUSE_URI</code> to enable
                        TLS / transport analysis.
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
                message="Transport query failed"
                description={
                    <Space direction="vertical" size={6}>
                        <Text>The query failed — try a shorter time range.</Text>
                        <Button size="small" icon={<ReloadOutlined />} onClick={() => refetch()}>
                            Retry
                        </Button>
                    </Space>
                }
            />
        );
    }

    const s = data?.summary;
    const weak = data?.weak_transport ?? [];

    return (
        <div>
            <Card size="small" style={{ marginBottom: 12, borderRadius: 10 }}>
                <Space wrap size={16} style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Space wrap size={16}>
                        <div
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: 12,
                                background: 'rgba(16, 185, 129, 0.15)',
                                color: 'var(--color-success)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 24,
                            }}
                        >
                            <LockOutlined />
                        </div>
                        <div>
                            <Text
                                type="secondary"
                                style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, display: 'block' }}
                            >
                                <InfoLabel info="TLS version and protocol distribution across collected events, plus the endpoints still served over weak or legacy transport.">
                                    Transport posture
                                </InfoLabel>
                            </Text>
                            <Title level={4} style={{ margin: 0 }}>TLS / Transport</Title>
                        </div>
                    </Space>
                    <Space size={8}>
                        <SamplingBadge />
                        <Segmented options={WIN_OPTIONS} value={rangeMin} onChange={(v) => changeRange(Number(v))} />
                        <Button icon={<ReloadOutlined spin={isFetching} />} onClick={() => refetch()} loading={isFetching}>
                            Refresh
                        </Button>
                    </Space>
                </Space>
            </Card>

            {s && s.http2_adoption_pct < 50 && s.total_events > 0 && (
                <Alert
                    type="warning"
                    showIcon
                    style={{ marginBottom: 12 }}
                    message={`HTTP/2 adoption is ${s.http2_adoption_pct.toFixed(1)}%`}
                    description="Most traffic is still HTTP/1.x. HTTP/2 brings multiplexing and header compression — consider enabling it on the upstream listeners."
                />
            )}

            {/* Summary KPI tiles */}
            <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
                <Col xs={12} md={6}>
                    <PctTile label="Weak TLS" pct={s?.weak_tls_pct ?? 0} good={(s?.weak_tls_pct ?? 0) === 0} loading={isLoading} />
                </Col>
                <Col xs={12} md={6}>
                    <PctTile label="Plaintext" pct={s?.plaintext_pct ?? 0} good={(s?.plaintext_pct ?? 0) === 0} loading={isLoading} />
                </Col>
                <Col xs={12} md={6}>
                    <PctTile label="Legacy protocol" pct={s?.legacy_protocol_pct ?? 0} good={(s?.legacy_protocol_pct ?? 0) === 0} loading={isLoading} />
                </Col>
                <Col xs={12} md={6}>
                    <PctTile label="HTTP/2 adoption" pct={s?.http2_adoption_pct ?? 0} good={(s?.http2_adoption_pct ?? 0) >= 50} loading={isLoading} />
                </Col>
            </Row>

            {/* Donuts */}
            <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
                <Col xs={24} md={12}>
                    <Card size="small" title="TLS versions" style={{ borderRadius: 10, height: '100%' }} loading={isLoading}>
                        {tlsDonut ? (
                            <ReactEChartsCore echarts={echarts} option={tlsDonut} style={{ height: 240 }} notMerge />
                        ) : (
                            <div style={{ padding: '50px 0' }}>
                                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<Text type="secondary">No TLS data.</Text>} />
                            </div>
                        )}
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card size="small" title="Protocols" style={{ borderRadius: 10, height: '100%' }} loading={isLoading}>
                        {protoDonut ? (
                            <ReactEChartsCore echarts={echarts} option={protoDonut} style={{ height: 240 }} notMerge />
                        ) : (
                            <div style={{ padding: '50px 0' }}>
                                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<Text type="secondary">No protocol data.</Text>} />
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>

            {/* Weak transport table */}
            <Card
                size="small"
                title={<InfoLabel info="Endpoints observed over weak TLS (1.0/1.1), plaintext HTTP, or a legacy protocol. Each issue is a risk flag.">Weak transport endpoints</InfoLabel>}
                style={{ borderRadius: 10, border: '1px solid var(--border-default)' }}
                styles={{ body: { padding: 0 } }}
            >
                <Table<WeakTransportEntry>
                    className="api-discovery-table"
                    rowKey={(r) => `${r.listener_name}|${r.normalized_path}|${r.tls_version}|${r.protocol}`}
                    columns={columns}
                    scroll={{ x: 'max-content' }}
                    dataSource={weak}
                    loading={isLoading}
                    size="middle"
                    showSorterTooltip={false}
                    pagination={weak.length > 20 ? { pageSize: 20, showSizeChanger: false } : false}
                    locale={{
                        emptyText: (
                            <div style={{ padding: '40px 0' }}>
                                <Empty
                                    description={
                                        <div>
                                            <LockOutlined style={{ color: 'var(--color-success)', fontSize: 28, marginBottom: 8 }} />
                                            <div><Text strong>Transport is clean</Text></div>
                                            <Text type="secondary" style={{ fontSize: 12 }}>
                                                No weak-TLS / plaintext / legacy-protocol endpoints in this window.
                                            </Text>
                                        </div>
                                    }
                                />
                            </div>
                        ),
                    }}
                />
            </Card>
        </div>
    );
};

export default TransportDashboard;
