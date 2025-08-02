import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Spin, Typography, Button, Progress, Divider } from 'antd';
import {
    LinkOutlined,
    SwapOutlined,
    ApiOutlined,
    ExclamationCircleOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    CloudServerOutlined,
    ClusterOutlined,
    WarningOutlined,
    ReloadOutlined,
    ThunderboltOutlined,
    SafetyCertificateOutlined,
    DashboardOutlined
} from '@ant-design/icons';
import { useMetricsApiMutation } from '@/common/operations-api';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import CountUp from 'react-countup';

const { Title, Text } = Typography;

interface TrafficStats {
    downstreamConnections: number;
    upstreamConnections: number;
    incomingTraffic: number;
    outgoingTraffic: number;
    totalRequests: number;
    unhealthyServers: number;
    totalServers: number;
    http4xxErrors: number;
    http5xxErrors: number;
    downstreamDestroyedFromRemote: number;
    activeListeners: number;
}

interface TrafficOverviewProps {
    // timeRange kaldırıldı - sadece son 1 dakikaya odaklanacağız
}

const TrafficOverview: React.FC<TrafficOverviewProps> = () => {
    const [stats, setStats] = useState<TrafficStats>({
        downstreamConnections: 0,
        upstreamConnections: 0,
        incomingTraffic: 0,
        outgoingTraffic: 0,
        totalRequests: 0,
        unhealthyServers: 0,
        totalServers: 0,
        http4xxErrors: 0,
        http5xxErrors: 0,
        downstreamDestroyedFromRemote: 0,
        activeListeners: 0
    });
    const [loading, setLoading] = useState(false);
    const { project } = useProjectVariable();
    const metricsApiMutation = useMetricsApiMutation();

    const fetchOverviewStats = async () => {
        setLoading(true);
        try {
            // Son 1 dakika - sabit zaman aralığı
            const now = Math.floor(Date.now() / 1000);
            const startTime = now - 60; // Son 1 dakika
            const endTime = now;

            const requests = [
                metricsApiMutation.mutateAsync({
                    name: '.*',
                    metric: 'listener_downstream_cx_active',
                    start: startTime,
                    end: endTime,
                    metricConfig: {
                        queryTemplate: `sum({__name__=~".*_%{project}_%{metric}"})`
                    }
                }),
                metricsApiMutation.mutateAsync({
                    name: '.*',
                    metric: 'cluster_upstream_cx_active',
                    start: startTime,
                    end: endTime,
                    metricConfig: {
                        queryTemplate: `sum({__name__=~".*_%{project}_%{metric}", envoy_cluster_name!="elchi-control-plane"})`
                    }
                }),
                metricsApiMutation.mutateAsync({
                    name: '.*',
                    metric: 'http_downstream_cx_rx_bytes_total',
                    start: startTime,
                    end: endTime,
                    metricConfig: {
                        queryTemplate: `sum(rate({__name__=~".*_%{project}_%{metric}", envoy_http_conn_manager_prefix!="admin"}[%{window}s]))`,
                        windowSecs: {
                            default: 15,
                            ranges: [
                                { threshold: 2 * 24 * 60 * 60, value: 300 },
                                { threshold: 24 * 60 * 60, value: 60 },
                                { threshold: 1 * 60 * 60, value: 30 }
                            ]
                        }
                    }
                }),
                metricsApiMutation.mutateAsync({
                    name: '.*',
                    metric: 'http_downstream_cx_tx_bytes_total',
                    start: startTime,
                    end: endTime,
                    metricConfig: {
                        queryTemplate: `sum(rate({__name__=~".*_%{project}_%{metric}", envoy_http_conn_manager_prefix!="admin"}[%{window}s]))`,
                        windowSecs: {
                            default: 15,
                            ranges: [
                                { threshold: 2 * 24 * 60 * 60, value: 300 },
                                { threshold: 24 * 60 * 60, value: 60 },
                                { threshold: 1 * 60 * 60, value: 30 }
                            ]
                        }
                    }
                }),
                metricsApiMutation.mutateAsync({
                    name: '.*',
                    metric: 'http_downstream_rq_total',
                    start: startTime,
                    end: endTime,
                    metricConfig: {
                        queryTemplate: `sum(rate({__name__=~".*_%{project}_%{metric}", envoy_http_conn_manager_prefix!="admin"}[%{window}s]))`,
                        windowSecs: {
                            default: 15,
                            ranges: [
                                { threshold: 2 * 24 * 60 * 60, value: 300 },
                                { threshold: 24 * 60 * 60, value: 60 },
                                { threshold: 1 * 60 * 60, value: 30 }
                            ]
                        }
                    }
                }),
                metricsApiMutation.mutateAsync({
                    name: '.*',
                    metric: 'cluster_membership_healthy',
                    start: startTime,
                    end: endTime,
                    metricConfig: {
                        queryTemplate: `sum({__name__=~".*_%{project}_%{metric}", envoy_cluster_name!="elchi-control-plane"})`
                    }
                }),
                metricsApiMutation.mutateAsync({
                    name: '.*',
                    metric: 'cluster_membership_total',
                    start: startTime,
                    end: endTime,
                    metricConfig: {
                        queryTemplate: `sum({__name__=~".*_%{project}_%{metric}", envoy_cluster_name!="elchi-control-plane"})`
                    }
                }),
                metricsApiMutation.mutateAsync({
                    name: '.*',
                    metric: 'http_downstream_rq_xx_total',
                    start: startTime,
                    end: endTime,
                    metricConfig: {
                        queryTemplate: `sum(rate({__name__=~".*_%{project}_%{metric}", envoy_http_conn_manager_prefix!="admin", envoy_response_code_class="4"}[%{window}s]))`,
                        windowSecs: {
                            default: 15,
                            ranges: [
                                { threshold: 2 * 24 * 60 * 60, value: 300 },
                                { threshold: 24 * 60 * 60, value: 60 },
                                { threshold: 1 * 60 * 60, value: 30 }
                            ]
                        }
                    }
                }),
                metricsApiMutation.mutateAsync({
                    name: '.*',
                    metric: 'http_downstream_rq_xx_total',
                    start: startTime,
                    end: endTime,
                    metricConfig: {
                        queryTemplate: `sum(rate({__name__=~".*_%{project}_%{metric}", envoy_http_conn_manager_prefix!="admin", envoy_response_code_class="5"}[%{window}s]))`,
                        windowSecs: {
                            default: 15,
                            ranges: [
                                { threshold: 2 * 24 * 60 * 60, value: 300 },
                                { threshold: 24 * 60 * 60, value: 60 },
                                { threshold: 1 * 60 * 60, value: 30 }
                            ]
                        }
                    }
                }),
                metricsApiMutation.mutateAsync({
                    name: '.*',
                    metric: 'http_downstream_cx_destroy_total',
                    start: startTime,
                    end: endTime,
                    metricConfig: {
                        queryTemplate: `sum(rate({__name__=~".*_%{project}_%{metric}", envoy_http_conn_manager_prefix!="admin"}[%{window}s]))`,
                        windowSecs: {
                            default: 15,
                            ranges: [
                                { threshold: 2 * 24 * 60 * 60, value: 300 },
                                { threshold: 24 * 60 * 60, value: 60 },
                                { threshold: 1 * 60 * 60, value: 30 }
                            ]
                        }
                    }
                }),
                metricsApiMutation.mutateAsync({
                    name: '.*',
                    metric: 'listener_manager_total_listeners_active',
                    start: startTime,
                    end: endTime,
                    metricConfig: {
                        queryTemplate: `sum({__name__=~".*_%{project}_%{metric}"})`
                    }
                })
            ];

            const results = await Promise.all(requests);

            const getMetricValue = (result: any, index: number) => {
                if (result?.data?.result?.length > 0) {
                    let totalValue = 0;

                    result.data.result.forEach((series: any) => {
                        if (series.values && series.values.length > 0) {
                            const lastPoint = series.values[series.values.length - 1];
                            const value = parseFloat(lastPoint[1]) || 0;
                            totalValue += value;
                        } else if (series.value) {
                            const value = parseFloat(series.value[1]) || 0;
                            totalValue += value;
                        }
                    });

                    return totalValue;
                }

                return 0;
            };

            const [
                downstreamCx,
                upstreamCx,
                incomingBytes,
                outgoingBytes,
                totalReqs,
                healthyServers,
                totalServers,
                http4xxErrors,
                http5xxErrors,
                downstreamDestroyed,
                activeListeners
            ] = results.map((result, index) => getMetricValue(result, index));

            setStats({
                downstreamConnections: downstreamCx,
                upstreamConnections: upstreamCx,
                incomingTraffic: incomingBytes,
                outgoingTraffic: outgoingBytes,
                totalRequests: totalReqs,
                unhealthyServers: Math.max(0, totalServers - healthyServers),
                totalServers: totalServers,
                http4xxErrors: http4xxErrors,
                http5xxErrors: http5xxErrors,
                downstreamDestroyedFromRemote: downstreamDestroyed,
                activeListeners: activeListeners
            });

        } catch (error) {
            console.error('Failed to fetch traffic overview stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleManualRefresh = () => {
        fetchOverviewStats();
    };

    useEffect(() => {
        fetchOverviewStats();
        const interval = setInterval(fetchOverviewStats, 30000);
        return () => clearInterval(interval);
    }, []);

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatNumber = (num: number) => {
        const roundedNum = Math.round(num);
        if (roundedNum >= 1000000) {
            return (roundedNum / 1000000).toFixed(1) + 'M';
        } else if (roundedNum >= 1000) {
            return (roundedNum / 1000).toFixed(1) + 'K';
        }
        return roundedNum.toString();
    };

    // Compact grouped metric card component
    const GroupedMetricCard = ({
        title,
        icon,
        gradient,
        metrics
    }: {
        title: string;
        icon: React.ReactNode;
        gradient: string;
        metrics: Array<{
            label: string;
            value: number;
            formatter?: (value: number) => string;
            customRenderer?: (value: number) => React.ReactNode;
            suffix?: string;
            color?: string;
        }>;
    }) => (
        <Card
            style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 16,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                height: 230,
                position: 'relative',
                overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 16px 48px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
            }}
        >
            {/* Gradient overlay */}
            <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '100%',
                height: '100%',
                background: gradient,
                opacity: 0.3,
                borderRadius: 16
            }} />

            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 16,
                position: 'relative',
                zIndex: 2
            }}>
                <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: 16,
                    boxShadow: '0 4px 16px rgba(5, 108, 205, 0.3)'
                }}>
                    {icon}
                </div>
                <Text style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: '#1e293b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>
                    {title}
                </Text>
            </div>

            {/* Metrics */}
            <div style={{ position: 'relative', zIndex: 2 }}>
                {metrics.map((metric, index) => (
                    <div key={index} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: index === metrics.length - 1 ? 0 : 12,
                        padding: '6px 0'
                    }}>
                        <Text style={{
                            fontSize: 12,
                            color: '#64748b',
                            fontWeight: 500
                        }}>
                            {metric.label}
                        </Text>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                            {metric.customRenderer ? (
                                <div style={{
                                    color: metric.color || '#1e293b'
                                }}>
                                    {metric.customRenderer(metric.value)}
                                </div>
                            ) : (
                                <>
                                    <Text style={{
                                        fontSize: 16,
                                        fontWeight: 700,
                                        color: metric.color || '#1e293b'
                                    }}>
                                        <CountUp
                                            end={metric.value}
                                            duration={1}
                                            formattingFn={(value) =>
                                                metric.formatter ? metric.formatter(value) : formatNumber(value)
                                            }
                                        />
                                    </Text>
                                    {metric.suffix && (
                                        <Text style={{
                                            fontSize: 11,
                                            color: '#64748b',
                                            fontWeight: 500
                                        }}>
                                            {metric.suffix}
                                        </Text>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );

    // Hero metric card for main KPIs
    const HeroMetricCard = ({
        title,
        value,
        icon,
        gradient,
        formatter,
        suffix
    }: {
        title: string;
        value: number;
        icon: React.ReactNode;
        gradient: string;
        formatter?: (value: number) => string;
        suffix?: string;
    }) => (
        <Card
            style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: 20,
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                height: 90,
                position: 'relative',
                overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.12)';
            }}
        >
            {/* Animated background */}
            <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: 20,
                height: 100,
                background: gradient,
                opacity: 0.3,
                borderRadius: '10%',
                animation: 'pulse 3s ease-in-out infinite'
            }} />

            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                height: '100%',
                position: 'relative',
                zIndex: 2
            }}>
                <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: 20,
                    boxShadow: '0 8px 24px rgba(5, 108, 205, 0.4)'
                }}>
                    {icon}
                </div>
                <div style={{ flex: 1 }}>
                    <Text style={{
                        fontSize: 11,
                        color: '#64748b',
                        textTransform: 'uppercase',
                        letterSpacing: '0.6px',
                        fontWeight: 600,
                        display: 'block',
                        marginBottom: 4
                    }}>
                        {title}
                    </Text>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                        <Text style={{
                            fontSize: 28,
                            fontWeight: 800,
                            color: '#1e293b',
                            lineHeight: 1
                        }}>
                            <CountUp
                                end={value}
                                duration={1.5}
                                formattingFn={(val) => formatter ? formatter(val) : formatNumber(val)}
                            />
                        </Text>
                        {suffix && (
                            <Text style={{
                                fontSize: 14,
                                color: '#64748b',
                                fontWeight: 600
                            }}>
                                {suffix}
                            </Text>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );

    return (
        <div style={{
            background: 'linear-gradient(90deg, rgba(5, 108, 205, 0.95) 0%, rgba(0, 198, 251, 0.85) 100%)',
            borderRadius: 24,
            padding: 24,
            marginBottom: 24,
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Animated background elements */}
            <div style={{
                position: 'absolute',
                top: -100,
                left: -100,
                width: 300,
                height: 300,
                background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
                borderRadius: '50%',
                animation: 'float 6s ease-in-out infinite'
            }} />
            <div style={{
                position: 'absolute',
                bottom: -150,
                right: -150,
                width: 400,
                height: 400,
                background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)',
                borderRadius: '50%',
                animation: 'float 8s ease-in-out infinite reverse'
            }} />

            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 32,
                position: 'relative',
                zIndex: 2
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{
                        width: 48,
                        height: 48,
                        borderRadius: 16,
                        background: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(20px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: 20,
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 4px 16px rgba(5, 108, 205, 0.3)'
                    }}>
                        <DashboardOutlined />
                    </div>
                    <div>
                        <Title level={3} style={{
                            margin: 0,
                            color: 'white',
                            fontWeight: 800,
                            fontSize: 28,
                            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                            Traffic Overview
                        </Title>
                        <Text style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: 14,
                            fontWeight: 500
                        }}>
                            Real-time network performance metrics
                        </Text>
                    </div>
                    {loading && (
                        <div style={{
                            padding: '8px 16px',
                            background: 'rgba(255, 255, 255, 0.08)',
                            borderRadius: 12,
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            boxShadow: '0 2px 8px rgba(5, 108, 205, 0.2)'
                        }}>
                            <Spin size="small" style={{ color: 'white' }} />
                        </div>
                    )}
                </div>

                <Button
                    type="text"
                    icon={<ReloadOutlined />}
                    onClick={handleManualRefresh}
                    loading={loading}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        color: 'white',
                        fontWeight: 600,
                        fontSize: 14,
                        padding: '12px 20px',
                        height: 'auto',
                        background: 'rgba(255, 255, 255, 0.08)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: 12,
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 16px rgba(5, 108, 205, 0.2)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(5, 108, 205, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(5, 108, 205, 0.2)';
                    }}
                >
                    Refresh
                </Button>
            </div>

            {/* Hero KPI */}
            <Row gutter={[24, 24]} style={{ position: 'relative', zIndex: 2, marginBottom: 24 }}>
                <Col xs={24} sm={8}>
                    <HeroMetricCard
                        title="Requests"
                        value={stats.totalRequests}
                        icon={<ThunderboltOutlined />}
                        gradient="linear-gradient(135deg, #056ccd 0%, #0369a1 100%)"
                        formatter={formatNumber}
                        suffix="/s"
                    />
                </Col>
                <Col xs={24} sm={8}>
                    <HeroMetricCard
                        title="Total Connections"
                        value={stats.downstreamConnections + stats.upstreamConnections}
                        icon={<LinkOutlined />}
                        gradient="linear-gradient(135deg, #00c6fb 0%, #06b6d4 100%)"
                        formatter={formatNumber}
                    />
                </Col>
                <Col xs={24} sm={8}>
                    <HeroMetricCard
                        title="Total Traffic"
                        value={stats.incomingTraffic + stats.outgoingTraffic}
                        icon={<SwapOutlined />}
                        gradient="linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)"
                        formatter={formatBytes}
                        suffix="/s"
                    />
                </Col>
            </Row>

            {/* Grouped Metrics */}
            <Row gutter={[24, 24]} style={{ position: 'relative', zIndex: 2 }}>
                {/* Connections Breakdown */}
                <Col xs={24} lg={8}>
                    <GroupedMetricCard
                        title="Connections"
                        icon={<CloudServerOutlined />}
                        gradient="linear-gradient(135deg, #0369a1 0%, #0284c7 100%)"
                        metrics={[
                            {
                                label: 'Downstream',
                                value: stats.downstreamConnections,
                                color: '#0369a1'
                            },
                            {
                                label: 'Upstream',
                                value: stats.upstreamConnections,
                                color: '#0ea5e9'
                            },
                            {
                                label: 'Destroyed',
                                value: stats.downstreamDestroyedFromRemote,
                                suffix: '/s',
                                color: '#f59e0b'
                            }
                        ]}
                    />
                </Col>

                {/* Traffic Breakdown */}
                <Col xs={24} lg={8}>
                    <GroupedMetricCard
                        title="Traffic"
                        icon={<SwapOutlined />}
                        gradient="linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)"
                        metrics={[
                            {
                                label: 'Incoming',
                                value: stats.incomingTraffic,
                                formatter: formatBytes,
                                suffix: '/s',
                                color: '#0891b2'
                            },
                            {
                                label: 'Outgoing',
                                value: stats.outgoingTraffic,
                                formatter: formatBytes,
                                suffix: '/s',
                                color: '#0284c7'
                            },
                            {
                                label: 'Active Listeners',
                                value: stats.activeListeners,
                                color: '#00c6fb'
                            }
                        ]}
                    />
                </Col>

                {/* Errors & Health */}
                <Col xs={24} lg={8}>
                    <GroupedMetricCard
                        title="Errors & Health"
                        icon={<SafetyCertificateOutlined />}
                        gradient="linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)"
                        metrics={[
                            {
                                label: '4xx Errors',
                                value: stats.http4xxErrors,
                                suffix: '/s',
                                color: '#f59e0b'
                            },
                            {
                                label: '5xx Errors',
                                value: stats.http5xxErrors,
                                suffix: '/s',
                                color: '#ef4444'
                            },
                            {
                                label: 'Server Health',
                                value: stats.totalServers > 0
                                    ? ((stats.totalServers - stats.unhealthyServers) / stats.totalServers) * 100
                                    : 0,
                                customRenderer: (val: number) => (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                        <span>{val.toFixed(0)}%</span>
                                        <span style={{
                                            fontSize: '10px',
                                            color: '#9ca3af',
                                            fontWeight: 400,
                                            marginTop: '2px'
                                        }}>
                                            {stats.totalServers > 0
                                                ? `${stats.totalServers - stats.unhealthyServers}/${stats.totalServers}`
                                                : '0/0'
                                            }
                                        </span>
                                    </div>
                                ),
                                color: stats.totalServers === 0 ? '#64748b' : (stats.unhealthyServers > 0 ? '#ef4444' : '#22c55e')
                            }
                        ]}
                    />
                </Col>
            </Row>

            {/* CSS Animations */}
            <style>
                {`
                    @keyframes pulse {
                        0%, 100% { 
                            transform: scale(1); 
                            opacity: 0.6; 
                        }
                        50% { 
                            transform: scale(1.05); 
                            opacity: 0.8; 
                        }
                    }
                    
                    @keyframes float {
                        0%, 100% { 
                            transform: translateY(0px) rotate(0deg); 
                        }
                        50% { 
                            transform: translateY(-20px) rotate(10deg); 
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default TrafficOverview; 