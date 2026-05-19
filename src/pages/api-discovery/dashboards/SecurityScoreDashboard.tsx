import React, { useMemo } from 'react';
import {
    Card,
    Space,
    Button,
    Typography,
    Alert,
    Progress,
    Tag,
    Row,
    Col,
    Segmented,
    Empty,
} from 'antd';
import { ReloadOutlined, SafetyCertificateOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { useApiInventorySecurityScore } from '@/hooks/useApiDiscovery';
import InfoLabel from '../components/InfoLabel';
import SamplingBadge from '../components/SamplingBadge';
import { formatCompactNumber } from '../lib/formatNumber';
import { WIN_OPTIONS, readWin } from '../lib/timeWindow';
import type { SecurityGrade, SecurityScoreComponent } from '../types';

const { Text, Title, Paragraph } = Typography;

// Grade → colour. Kept consistent across the score gauge, component
// chips and the sidebar legend.
const GRADE_COLOR: Record<string, string> = {
    A: '#10b981',
    B: '#22c55e',
    C: '#f59e0b',
    D: '#f97316',
    F: '#ef4444',
    'N/A': '#9ca3af',
};
const gradeColor = (g: string): string => GRADE_COLOR[g] ?? '#9ca3af';

// Each scoring component deep-links to the dashboard tab that explains it.
const COMPONENT_VIEW: Record<string, string> = {
    auth_coverage: 'auth',
    transport_security: 'transport',
    risk_exposure: 'risk',
    attack_surface: 'listeners',
    threat_activity: 'bots',
};

const SecurityScoreDashboard: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    // Time window is derived from the URL (single source of truth) so a
    // `?win=` carried in from another dashboard takes effect even when
    // this pane was already mounted by the Tabs container.
    const rangeMin = readWin(searchParams);

    const { from, to } = useMemo(() => {
        const now = dayjs();
        return { from: now.subtract(rangeMin, 'minute').toISOString(), to: now.toISOString() };
    }, [rangeMin]);

    const params = useMemo(() => ({ from, to }), [from, to]);
    const { data, isLoading, isFetching, refetch, isClickhouseUnavailable, isClickhouseQueryFailed } =
        useApiInventorySecurityScore(params);

    const changeRange = (v: number) => {
        const np = new URLSearchParams(searchParams);
        np.set('win', String(v));
        setSearchParams(np, { replace: true });
    };

    // Jump to the component's dedicated dashboard tab, carrying the
    // current time window so the destination shows the same period.
    const goToTab = (view: string) => {
        const np = new URLSearchParams();
        if (view !== 'listeners') np.set('view', view);
        np.set('win', String(rangeMin));
        setSearchParams(np, { replace: true });
    };

    if (isClickhouseUnavailable) {
        return (
            <Alert
                type="warning"
                showIcon
                message="Security score unavailable"
                description={
                    <Text>
                        ClickHouse is not configured on the controller (HTTP 503). Set{' '}
                        <code>CLICKHOUSE_URI</code> to enable the security score.
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
                message="Security score query failed"
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

    const score = data?.score ?? null;
    const grade: SecurityGrade = data?.grade ?? 'N/A';
    const components = data?.components ?? [];
    const noTraffic = !isLoading && (score === null || grade === 'N/A');

    return (
        <div>
            {/* Hero / range */}
            <Card size="small" style={{ marginBottom: 12, borderRadius: 10 }}>
                <Space wrap size={16} style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Space wrap size={16}>
                        <div
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: 12,
                                background: `${gradeColor(grade)}26`,
                                color: gradeColor(grade),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 24,
                            }}
                        >
                            <SafetyCertificateOutlined />
                        </div>
                        <div>
                            <Text
                                type="secondary"
                                style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, display: 'block' }}
                            >
                                <InfoLabel info={
                                    <div>
                                        <div style={{ fontWeight: 600, marginBottom: 4 }}>API Security Score</div>
                                        <div>
                                            A single A–F grade for the project, derived from five
                                            weighted components: authentication coverage (30%),
                                            transport security (25%), risk exposure (20%), attack
                                            surface (15%) and threat activity (10%). Computed from
                                            ClickHouse event traffic in the selected window.
                                        </div>
                                    </div>
                                }>
                                    Security posture
                                </InfoLabel>
                            </Text>
                            <Title level={4} style={{ margin: 0 }}>API Security Score</Title>
                        </div>
                    </Space>
                    <Space size={8}>
                        <SamplingBadge />
                        <Segmented
                            options={WIN_OPTIONS}
                            value={rangeMin}
                            onChange={(v) => changeRange(Number(v))}
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

            {noTraffic ? (
                <Card size="small" style={{ borderRadius: 10 }}>
                    <div style={{ padding: '40px 0' }}>
                        <Empty
                            description={
                                <div>
                                    <Text strong>No traffic in the selected window</Text>
                                    <div>
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            The security score needs collected API events to compute. Try a
                                            wider time range.
                                        </Text>
                                    </div>
                                </div>
                            }
                        />
                    </div>
                </Card>
            ) : (
                <Row gutter={[12, 12]}>
                    {/* Score gauge */}
                    <Col xs={24} md={8}>
                        <Card
                            size="small"
                            style={{ borderRadius: 10, height: '100%' }}
                            styles={{ body: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 } }}
                            loading={isLoading}
                        >
                            <Progress
                                type="dashboard"
                                percent={score ?? 0}
                                strokeColor={gradeColor(grade)}
                                strokeWidth={9}
                                size={190}
                                format={() => (
                                    <div>
                                        <div style={{ fontSize: 52, fontWeight: 700, lineHeight: 1, color: gradeColor(grade) }}>
                                            {grade}
                                        </div>
                                        <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>
                                            {score ?? '—'} / 100
                                        </div>
                                    </div>
                                )}
                            />
                            {data?.totals && (
                                <Space split={<span style={{ color: 'var(--border-default)' }}>·</span>} style={{ marginTop: 14 }}>
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        {formatCompactNumber(data.totals.endpoints)} endpoints
                                    </Text>
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        {formatCompactNumber(data.totals.events_analyzed)} events analysed
                                    </Text>
                                </Space>
                            )}
                            {data?.computed_at && (
                                <Text type="secondary" style={{ fontSize: 10, marginTop: 4 }}>
                                    Computed {new Date(data.computed_at).toLocaleString()}
                                </Text>
                            )}
                        </Card>
                    </Col>

                    {/* Components */}
                    <Col xs={24} md={16}>
                        <Card
                            size="small"
                            title={<InfoLabel info="The five weighted components that make up the overall score. Click a component to jump to the tab that explains it.">Components</InfoLabel>}
                            style={{ borderRadius: 10, height: '100%' }}
                            loading={isLoading}
                        >
                            <Space direction="vertical" size={10} style={{ width: '100%', display: 'flex' }}>
                                {components.map((c: SecurityScoreComponent, i: number) => {
                                    // Defensive — a malformed component row must not
                                    // produce NaN%/undefined in the render.
                                    const cScore = typeof c.score === 'number' ? c.score : 0;
                                    const cWeight = typeof c.weight === 'number' ? c.weight : 0;
                                    const view = COMPONENT_VIEW[c.key];
                                    return (
                                        <div key={c.key ?? i}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                                <Space size={8}>
                                                    <Text strong style={{ fontSize: 13 }}>{c.label ?? c.key ?? '—'}</Text>
                                                    <Tag color={gradeColor(c.grade)} className="auto-width-tag" style={{ margin: 0, fontSize: 10 }}>
                                                        {c.grade ?? '—'}
                                                    </Tag>
                                                    <Text type="secondary" style={{ fontSize: 11 }}>
                                                        weight {Math.round(cWeight * 100)}%
                                                    </Text>
                                                </Space>
                                                <Space size={8}>
                                                    <Text strong style={{ fontVariantNumeric: 'tabular-nums', fontSize: 13, color: gradeColor(c.grade) }}>
                                                        {cScore}
                                                    </Text>
                                                    {view && (
                                                        <Button
                                                            type="link"
                                                            size="small"
                                                            style={{ padding: 0, fontSize: 11 }}
                                                            onClick={() => goToTab(view)}
                                                        >
                                                            View <ArrowRightOutlined style={{ fontSize: 9 }} />
                                                        </Button>
                                                    )}
                                                </Space>
                                            </div>
                                            <Progress
                                                percent={cScore}
                                                strokeColor={gradeColor(c.grade)}
                                                showInfo={false}
                                                size="small"
                                            />
                                            {c.summary && (
                                                <Paragraph type="secondary" style={{ fontSize: 11, margin: '2px 0 0' }}>
                                                    {c.summary}
                                                </Paragraph>
                                            )}
                                        </div>
                                    );
                                })}
                            </Space>
                        </Card>
                    </Col>
                </Row>
            )}
        </div>
    );
};

export default SecurityScoreDashboard;
