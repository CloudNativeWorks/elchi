import React, { useMemo, useState } from 'react';
import {
    Card,
    Table,
    Tag,
    Tooltip,
    Space,
    Button,
    Typography,
    Empty,
    Row,
    Col,
    Input,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ReloadOutlined, SafetyCertificateOutlined, AlertOutlined } from '@ant-design/icons';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { TooltipComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { useChartTheme } from '@/utils/chartTheme';
import { useApiInventoryRiskSummary } from '@/hooks/useApiDiscovery';
import InfoLabel from '../components/InfoLabel';
import { formatCompactNumber } from '../lib/formatNumber';
import {
    RISK_FLAG_CATALOG,
    riskFlagLabel,
    riskClassMeta,
    severityBandColor,
} from '../lib/riskFlagCatalog';
import type { RiskFlagRow } from '../types';

echarts.use([PieChart, TooltipComponent, LegendComponent, CanvasRenderer]);

const { Text, Title } = Typography;

// Severity band → hex (cards / numbers). Kept in lockstep with the
// RISK_SCORE_LEGEND palette in riskFlagCatalog.ts.
const BAND_COLOR: Record<string, string> = {
    critical: '#ef4444',
    high: '#fa541c',
    medium: '#f59e0b',
    low: '#d4a012',
};
const BAND_ORDER = ['critical', 'high', 'medium', 'low'];

const RiskSummaryDashboard: React.FC = () => {
    const [listenerName, setListenerName] = useState('');
    const [search, setSearch] = useState('');

    const params = useMemo(
        () => ({ listener_name: listenerName || undefined }),
        [listenerName],
    );
    const { data, isLoading, isFetching, refetch, error } = useApiInventoryRiskSummary(params);

    const { options: themeOpts, isDark } = useChartTheme();

    const totalEndpoints = data?.total_endpoints ?? 0;
    const flaggedEndpoints = data?.flagged_endpoints ?? 0;
    const cleanPct = totalEndpoints > 0
        ? Math.round(((totalEndpoints - flaggedEndpoints) / totalEndpoints) * 100)
        : 100;

    const byFlag = data?.by_flag ?? [];
    const byClass = data?.by_class ?? [];
    const bySeverity = data?.by_severity ?? {};
    const maxFlagCount = byFlag.reduce((m, r) => Math.max(m, r.endpoint_count ?? 0), 0);

    // by_class → donut.
    const classDonut = useMemo(() => {
        if (byClass.length === 0) return null;
        return {
            ...themeOpts,
            xAxis: undefined,
            yAxis: undefined,
            grid: undefined,
            tooltip: {
                ...themeOpts.tooltip,
                trigger: 'item',
                formatter: (p: any) =>
                    `<strong>${p.name}</strong><br/>${p.value.toLocaleString()} findings (${p.percent}%)`,
            },
            legend: {
                ...themeOpts.legend,
                type: 'scroll',
                orient: 'vertical',
                right: 8,
                top: 'center',
            },
            series: [
                {
                    type: 'pie',
                    radius: ['46%', '74%'],
                    center: ['38%', '50%'],
                    avoidLabelOverlap: true,
                    itemStyle: { borderColor: isDark ? '#1f1f1f' : '#fff', borderWidth: 2 },
                    label: { show: false },
                    data: byClass.map((c) => ({
                        name: riskClassMeta(c.class).label,
                        value: c.endpoint_count,
                        itemStyle: { color: riskClassMeta(c.class).color },
                    })),
                },
            ],
        };
    }, [byClass, themeOpts, isDark]);

    const visibleFlags = useMemo(() => {
        if (!search.trim()) return byFlag;
        const q = search.trim().toLowerCase();
        return byFlag.filter(
            (r) =>
                r.flag.toLowerCase().includes(q) ||
                r.class.toLowerCase().includes(q),
        );
    }, [byFlag, search]);

    const columns: ColumnsType<RiskFlagRow> = [
        {
            title: 'Risk flag',
            dataIndex: 'flag',
            key: 'flag',
            render: (flag: string) => {
                const meta = RISK_FLAG_CATALOG[flag];
                return (
                    <Tooltip title={meta?.description ?? 'Flag emitted by a newer collector — not in this UI build.'}>
                        <Text
                            style={{
                                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                                fontSize: 12.5,
                                fontWeight: 500,
                                cursor: 'help',
                            }}
                        >
                            {riskFlagLabel(flag)}
                        </Text>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Class',
            dataIndex: 'class',
            key: 'class',
            width: 160,
            render: (cls: string) => {
                const m = riskClassMeta(cls);
                return (
                    <Tooltip title={m.description}>
                        <Tag
                            className="auto-width-tag"
                            style={{ margin: 0, fontSize: 11, color: m.color, borderColor: `${m.color}55`, background: `${m.color}14`, cursor: 'help' }}
                        >
                            {m.label}
                        </Tag>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Severity',
            dataIndex: 'severity_band',
            key: 'severity_band',
            width: 130,
            render: (band: string, r) => (
                <Tag className="auto-width-tag" color={severityBandColor(band)} style={{ margin: 0, fontSize: 11 }}>
                    {band} ({r.severity})
                </Tag>
            ),
        },
        {
            title: 'Findings',
            dataIndex: 'endpoint_count',
            key: 'endpoint_count',
            width: 200,
            sorter: (a, b) => a.endpoint_count - b.endpoint_count,
            defaultSortOrder: 'descend',
            render: (n: number, r) => {
                const pct = maxFlagCount > 0 ? (n / maxFlagCount) * 100 : 0;
                return (
                    <Space size={8} style={{ width: '100%' }}>
                        <div
                            style={{
                                flex: 1,
                                minWidth: 90,
                                height: 6,
                                borderRadius: 3,
                                background: 'var(--bg-elevated)',
                                overflow: 'hidden',
                            }}
                        >
                            <div
                                style={{
                                    width: `${pct}%`,
                                    height: '100%',
                                    background: BAND_COLOR[r.severity_band] ?? '#9ca3af',
                                }}
                            />
                        </div>
                        <Text style={{ fontVariantNumeric: 'tabular-nums', fontSize: 12.5, minWidth: 44, textAlign: 'right' }}>
                            {formatCompactNumber(n)}
                        </Text>
                    </Space>
                );
            },
        },
    ];

    return (
        <div>
            {/* Hero */}
            <Card
                size="small"
                style={{
                    marginBottom: 12,
                    borderRadius: 10,
                    border: `1px solid ${flaggedEndpoints > 0 ? 'var(--color-danger-border)' : 'var(--border-default)'}`,
                    background:
                        flaggedEndpoints > 0
                            ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.07) 0%, transparent 100%)'
                            : undefined,
                }}
            >
                <Space wrap size={16} style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Space wrap size={16}>
                        <div
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: 12,
                                background: flaggedEndpoints > 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                                color: flaggedEndpoints > 0 ? 'var(--color-error)' : 'var(--color-success)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 24,
                            }}
                        >
                            {flaggedEndpoints > 0 ? <AlertOutlined /> : <SafetyCertificateOutlined />}
                        </div>
                        <div>
                            <Text
                                type="secondary"
                                style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, display: 'block' }}
                            >
                                <InfoLabel info={
                                    <div>
                                        <div style={{ fontWeight: 600, marginBottom: 4 }}>Risk posture</div>
                                        <div>
                                            Distribution of <strong>risk flags</strong> across discovered
                                            endpoints, grouped by flag, by taxonomy class, and by severity
                                            band. Counts are <em>flag occurrences</em> — one endpoint with
                                            3 flags contributes 3. <strong>Flagged endpoints</strong> is the
                                            distinct count of endpoints carrying at least one flag.
                                        </div>
                                    </div>
                                }>
                                    Flagged endpoints
                                </InfoLabel>
                            </Text>
                            <Title
                                level={3}
                                style={{
                                    margin: 0,
                                    color: flaggedEndpoints > 0 ? 'var(--color-error)' : 'var(--color-success)',
                                    fontVariantNumeric: 'tabular-nums',
                                }}
                            >
                                {formatCompactNumber(flaggedEndpoints)}
                                <Text type="secondary" style={{ fontSize: 13, fontWeight: 400 }}>
                                    {' '}/ {formatCompactNumber(totalEndpoints)} endpoints · {cleanPct}% clean
                                </Text>
                            </Title>
                        </div>
                    </Space>
                    <Space size={8}>
                        <Input.Search
                            allowClear
                            placeholder="Filter by listener…"
                            style={{ width: 220 }}
                            onSearch={(v) => setListenerName(v.trim())}
                        />
                        <Button
                            icon={<ReloadOutlined spin={isFetching} />}
                            onClick={() => refetch()}
                            loading={isFetching}
                        >
                            Refresh
                        </Button>
                    </Space>
                </Space>
            </Card>

            {/* Severity band KPI cards */}
            <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
                {BAND_ORDER.map((band) => (
                    <Col key={band} xs={12} md={6}>
                        <Card
                            size="small"
                            style={{ borderRadius: 10, borderColor: `${BAND_COLOR[band]}44` }}
                            styles={{ body: { padding: 14 } }}
                        >
                            <Text
                                style={{
                                    fontSize: 10,
                                    textTransform: 'uppercase',
                                    letterSpacing: 1,
                                    color: BAND_COLOR[band],
                                    fontWeight: 600,
                                }}
                            >
                                {band}
                            </Text>
                            <Title level={3} style={{ margin: '2px 0 0', fontVariantNumeric: 'tabular-nums' }}>
                                {formatCompactNumber(bySeverity[band] ?? 0)}
                            </Title>
                            <Text type="secondary" style={{ fontSize: 11 }}>
                                findings
                            </Text>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row gutter={[12, 12]}>
                {/* by_class donut */}
                <Col xs={24} lg={9}>
                    <Card
                        size="small"
                        title={<InfoLabel info="Risk findings grouped by their taxonomy class (auth, transport, attack pattern, …).">By class</InfoLabel>}
                        style={{ borderRadius: 10, height: '100%' }}
                        loading={isLoading}
                    >
                        {classDonut ? (
                            <ReactEChartsCore
                                echarts={echarts}
                                option={classDonut}
                                style={{ height: 300, width: '100%' }}
                                notMerge
                            />
                        ) : (
                            <div style={{ padding: '60px 0' }}>
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description={<Text type="secondary">No risk flags — clean.</Text>}
                                />
                            </div>
                        )}
                    </Card>
                </Col>

                {/* by_flag table */}
                <Col xs={24} lg={15}>
                    <Card
                        size="small"
                        title={<InfoLabel info="Every risk flag observed in this project, sorted by how many endpoints carry it.">By flag</InfoLabel>}
                        extra={
                            <Input
                                allowClear
                                size="small"
                                placeholder="Search flag / class…"
                                style={{ width: 200 }}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        }
                        style={{ borderRadius: 10, height: '100%' }}
                        styles={{ body: { padding: 0 } }}
                    >
                        <Table<RiskFlagRow>
                            className="api-discovery-table"
                            rowKey="flag"
                            columns={columns}
                            dataSource={visibleFlags}
                            loading={isLoading}
                            size="small"
                            pagination={false}
                            scroll={{ y: 360 }}
                            locale={{
                                emptyText: (
                                    <div style={{ padding: '40px 0' }}>
                                        <Empty
                                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                                            description={
                                                <Text type="secondary">
                                                    {error
                                                        ? 'Failed to load risk summary.'
                                                        : search
                                                            ? 'No flag matches the search.'
                                                            : '✓ No risk flags observed — clean.'}
                                                </Text>
                                            }
                                        />
                                    </div>
                                ),
                            }}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default RiskSummaryDashboard;
