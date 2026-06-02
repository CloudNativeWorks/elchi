import React, { useMemo, useState } from 'react';
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
    Switch,
    InputNumber,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { ReloadOutlined, WarningOutlined } from '@ant-design/icons';
import { Link, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { useChartTheme } from '@/utils/chartTheme';
import { useApiInventoryErrors } from '@/hooks/useApiDiscovery';
import InfoLabel from '../components/InfoLabel';
import EndpointPath from '../components/EndpointPath';
import { methodColor } from '../lib/methodColor';
import { formatCompactNumber } from '../lib/formatNumber';
import { WIN_OPTIONS, readWin } from '../lib/timeWindow';
import type { ErrorHotspot } from '../types';

echarts.use([LineChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

const { Text, Title } = Typography;

// Error-rate heat colour.
const rateColor = (pct: number): string =>
    pct >= 10 ? '#ef4444' : pct >= 1 ? '#f59e0b' : pct > 0 ? '#d4a012' : 'var(--text-tertiary)';

const ErrorsDashboard: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    // Window derived from the URL — honours a carried-in `?win=`.
    const rangeMin = readWin(searchParams);
    const [minErrorRate, setMinErrorRate] = useState<number>(0);

    const changeRange = (v: number) => {
        const np = new URLSearchParams(searchParams);
        np.set('win', String(v));
        setSearchParams(np, { replace: true });
    };
    const [includeSeries, setIncludeSeries] = useState(true);
    const [pageSize, setPageSize] = useState(20);
    const [offset, setOffset] = useState(0);

    const { from, to } = useMemo(() => {
        const now = dayjs();
        return { from: now.subtract(rangeMin, 'minute').toISOString(), to: now.toISOString() };
    }, [rangeMin]);

    const params = useMemo(
        () => ({
            from,
            to,
            min_error_rate: minErrorRate > 0 ? minErrorRate : undefined,
            include_series: includeSeries,
            limit: pageSize,
            offset,
        }),
        [from, to, minErrorRate, includeSeries, pageSize, offset],
    );
    const { data, isLoading, isFetching, refetch, isClickhouseUnavailable, isClickhouseQueryFailed } =
        useApiInventoryErrors(params);

    const { options: themeOpts } = useChartTheme();

    const seriesOption = useMemo(() => {
        const pts = data?.time_series?.points ?? [];
        if (pts.length === 0) return null;
        return {
            ...themeOpts,
            tooltip: { ...themeOpts.tooltip, trigger: 'axis' },
            // Pin the legend to the top-centre — the theme default lets it
            // float into the plotting area and overlap the series.
            legend: { ...themeOpts.legend, data: ['4xx', '5xx'], top: 4, left: 'center' },
            grid: { left: 50, right: 20, top: 40, bottom: 28 },
            xAxis: {
                ...themeOpts.xAxis,
                type: 'time',
            },
            yAxis: { ...themeOpts.yAxis, type: 'value' },
            series: [
                {
                    name: '4xx',
                    type: 'line',
                    stack: 'err',
                    showSymbol: false,
                    areaStyle: { opacity: 0.25 },
                    itemStyle: { color: '#f59e0b' },
                    lineStyle: { color: '#f59e0b' },
                    data: pts.map((p) => [p.bucket, p.error_4xx]),
                },
                {
                    name: '5xx',
                    type: 'line',
                    stack: 'err',
                    showSymbol: false,
                    areaStyle: { opacity: 0.25 },
                    itemStyle: { color: '#ef4444' },
                    lineStyle: { color: '#ef4444' },
                    data: pts.map((p) => [p.bucket, p.error_5xx]),
                },
            ],
        };
    }, [data, themeOpts]);

    const columns: ColumnsType<ErrorHotspot> = [
        {
            title: 'Method',
            dataIndex: 'method',
            key: 'method',
            width: 90,
            render: (m: string) =>
                m ? (
                    <Tag className="auto-width-tag" color={methodColor(m)} style={{ margin: 0, fontSize: 11 }}>
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
            width: 150,
            ellipsis: true,
            render: (n: string) => (
                <Link to={`/api-discovery/${encodeURIComponent(n)}`} style={{ fontSize: 12 }}>
                    {n}
                </Link>
            ),
        },
        {
            title: 'Calls',
            dataIndex: 'total_events',
            key: 'total_events',
            width: 100,
            align: 'right',
            render: (n: number) => (
                <Tooltip title={`Exact: ${(n ?? 0).toLocaleString()}`}>
                    <Text style={{ fontVariantNumeric: 'tabular-nums', fontSize: 12.5 }}>{formatCompactNumber(n ?? 0)}</Text>
                </Tooltip>
            ),
        },
        {
            title: '4xx',
            dataIndex: 'error_4xx',
            key: 'error_4xx',
            width: 90,
            align: 'right',
            render: (n: number) => (
                <Text style={{ fontVariantNumeric: 'tabular-nums', fontSize: 12, color: n > 0 ? '#f59e0b' : 'var(--text-tertiary)' }}>
                    {formatCompactNumber(n ?? 0)}
                </Text>
            ),
        },
        {
            title: '5xx',
            dataIndex: 'error_5xx',
            key: 'error_5xx',
            width: 90,
            align: 'right',
            render: (n: number) => (
                <Text style={{ fontVariantNumeric: 'tabular-nums', fontSize: 12, color: n > 0 ? '#ef4444' : 'var(--text-tertiary)' }}>
                    {formatCompactNumber(n ?? 0)}
                </Text>
            ),
        },
        {
            title: 'Error rate',
            dataIndex: 'error_rate',
            key: 'error_rate',
            width: 110,
            align: 'right',
            render: (pct: number) => {
                const c = rateColor(pct ?? 0);
                return (
                    <span
                        style={{
                            display: 'inline-flex',
                            padding: '1px 8px',
                            borderRadius: 4,
                            background: 'var(--bg-elevated)',
                            border: `1px solid ${c}33`,
                            color: c,
                            fontFamily: 'monospace',
                            fontWeight: 600,
                            fontSize: 11,
                        }}
                    >
                        {(pct ?? 0).toFixed(1)}%
                    </span>
                );
            },
        },
    ];

    if (isClickhouseUnavailable) {
        return (
            <Alert
                type="warning"
                showIcon
                message="Error analysis unavailable"
                description={
                    <Text>
                        ClickHouse is not configured (HTTP 503). Set <code>CLICKHOUSE_URI</code> to enable
                        error analysis.
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
                message="Error analysis query failed"
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

    const summary = data?.summary;
    const hotspots = data?.hotspots ?? [];
    const totalCount = data?.count ?? hotspots.length;
    const currentPage = Math.floor(offset / pageSize) + 1;

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
                                background: 'rgba(239, 68, 68, 0.15)',
                                color: 'var(--color-error)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 24,
                            }}
                        >
                            <WarningOutlined />
                        </div>
                        <div>
                            <Text
                                type="secondary"
                                style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, display: 'block' }}
                            >
                                <InfoLabel info="4xx / 5xx hotspots — the endpoints producing the most error responses, with a project-wide summary and an optional error timeline.">
                                    Error analysis
                                </InfoLabel>
                            </Text>
                            <Title level={4} style={{ margin: 0 }}>Errors</Title>
                        </div>
                    </Space>
                    <Space size={8} wrap>
                        <Tooltip title="Hide endpoints below this error rate (server-side).">
                            <Space size={4}>
                                <Text type="secondary" style={{ fontSize: 11 }}>Min rate</Text>
                                <InputNumber
                                    size="small"
                                    min={0}
                                    max={100}
                                    value={minErrorRate}
                                    onChange={(v) => {
                                        setMinErrorRate(typeof v === 'number' ? v : 0);
                                        setOffset(0);
                                    }}
                                    style={{ width: 72 }}
                                    addonAfter="%"
                                />
                            </Space>
                        </Tooltip>
                        <Tooltip title="Append the 4xx/5xx error timeline.">
                            <Space size={4}>
                                <Switch size="small" checked={includeSeries} onChange={setIncludeSeries} />
                                <Text type="secondary" style={{ fontSize: 11 }}>Timeline</Text>
                            </Space>
                        </Tooltip>
                        <Segmented options={WIN_OPTIONS} value={rangeMin} onChange={(v) => changeRange(Number(v))} />
                        <Button icon={<ReloadOutlined spin={isFetching} />} onClick={() => refetch()} loading={isFetching}>
                            Refresh
                        </Button>
                    </Space>
                </Space>
            </Card>

            {/* Summary tiles */}
            <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
                <Col xs={8}>
                    <Card size="small" style={{ borderRadius: 10 }} styles={{ body: { padding: 14 } }} loading={isLoading}>
                        <Text type="secondary" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, display: 'block' }}>
                            Total 4xx
                        </Text>
                        <Title level={3} style={{ margin: '2px 0 0', color: '#f59e0b', fontVariantNumeric: 'tabular-nums' }}>
                            {formatCompactNumber(summary?.total_4xx ?? 0)}
                        </Title>
                    </Card>
                </Col>
                <Col xs={8}>
                    <Card size="small" style={{ borderRadius: 10 }} styles={{ body: { padding: 14 } }} loading={isLoading}>
                        <Text type="secondary" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, display: 'block' }}>
                            Total 5xx
                        </Text>
                        <Title level={3} style={{ margin: '2px 0 0', color: '#ef4444', fontVariantNumeric: 'tabular-nums' }}>
                            {formatCompactNumber(summary?.total_5xx ?? 0)}
                        </Title>
                    </Card>
                </Col>
                <Col xs={8}>
                    <Card size="small" style={{ borderRadius: 10 }} styles={{ body: { padding: 14 } }} loading={isLoading}>
                        <Text type="secondary" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, display: 'block' }}>
                            Overall error rate
                        </Text>
                        <Title
                            level={3}
                            style={{ margin: '2px 0 0', color: rateColor(summary?.overall_error_rate ?? 0), fontVariantNumeric: 'tabular-nums' }}
                        >
                            {(summary?.overall_error_rate ?? 0).toFixed(1)}%
                        </Title>
                    </Card>
                </Col>
            </Row>

            {/* Timeline */}
            {includeSeries && (
                <Card size="small" title="Error timeline (4xx / 5xx)" style={{ borderRadius: 10, marginBottom: 12 }} loading={isLoading}>
                    {seriesOption ? (
                        <ReactEChartsCore echarts={echarts} option={seriesOption} style={{ height: 240 }} notMerge />
                    ) : (
                        <div style={{ padding: '40px 0' }}>
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<Text type="secondary">No timeline data in this window.</Text>} />
                        </div>
                    )}
                </Card>
            )}

            {/* Hotspots */}
            <Card
                size="small"
                title={<InfoLabel info="Endpoints ranked by total error responses (4xx + 5xx). Click a path to inspect its error events.">Error hotspots</InfoLabel>}
                style={{ borderRadius: 10, border: '1px solid var(--border-default)' }}
                styles={{ body: { padding: 0 } }}
            >
                <Table<ErrorHotspot>
                    className="api-discovery-table"
                    rowKey={(r) => `${r.listener_name}|${r.method}|${r.normalized_path}`}
                    columns={columns}
                    scroll={{ x: 'max-content' }}
                    dataSource={hotspots}
                    loading={isLoading}
                    size="middle"
                    locale={{
                        emptyText: (
                            <div style={{ padding: '40px 0' }}>
                                <Empty
                                    description={
                                        <div>
                                            <Text strong>No error hotspots</Text>
                                            <div>
                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                    No endpoint exceeded the error-rate filter in this window.
                                                </Text>
                                            </div>
                                        </div>
                                    }
                                />
                            </div>
                        ),
                    }}
                    pagination={{
                        current: currentPage,
                        pageSize,
                        total: totalCount,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50', '100'],
                        showTotal: (total, range) => `${range[0]}–${range[1]} of ${total.toLocaleString()} hotspots`,
                        onChange: (page, size) => {
                            setPageSize(size);
                            setOffset((page - 1) * size);
                        },
                    }}
                />
            </Card>
        </div>
    );
};

export default ErrorsDashboard;
