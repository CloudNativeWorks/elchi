import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Spin, Typography, Button } from 'antd';
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
    ReloadOutlined
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
        http5xxErrors: 0
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

            console.log('Traffic Overview Time Range (Last 1min):', { startTime, endTime });
            
            // Paralel olarak tüm metrikleri çek
            const requests = [
                // Listener level downstream connections - instant değer
                metricsApiMutation.mutateAsync({
                    name: '.*',
                    metric: 'listener_downstream_cx_active',
                    start: startTime,
                    end: endTime,
                    metricConfig: {
                        queryTemplate: `sum({__name__=~".*_%{project}_%{metric}"})`
                    }
                }),
                // Upstream connections - instant değer  
                metricsApiMutation.mutateAsync({
                    name: '.*',
                    metric: 'cluster_upstream_cx_active',
                    start: startTime,
                    end: endTime,
                    metricConfig: {
                        queryTemplate: `sum({__name__=~".*_%{project}_%{metric}", envoy_cluster_name!="elchi-control-plane"})`
                    }
                }),
                // Gelen trafik - rate with %{window}s placeholder
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
                // Giden trafik - rate with %{window}s placeholder
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
                // Toplam requestler - rate with %{window}s placeholder
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
                // Healthy servers - instant değer
                metricsApiMutation.mutateAsync({
                    name: '.*',
                    metric: 'cluster_membership_healthy',
                    start: startTime,
                    end: endTime,
                    metricConfig: {
                        queryTemplate: `sum({__name__=~".*_%{project}_%{metric}", envoy_cluster_name!="elchi-control-plane"})`
                    }
                }),
                // Total servers - instant değer
                metricsApiMutation.mutateAsync({
                    name: '.*',
                    metric: 'cluster_membership_total',
                    start: startTime,
                    end: endTime,
                    metricConfig: {
                        queryTemplate: `sum({__name__=~".*_%{project}_%{metric}", envoy_cluster_name!="elchi-control-plane"})`
                    }
                }),
                // 4xx errors - rate with %{window}s placeholder
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
                // 5xx errors - rate with %{window}s placeholder
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
                })
            ];
            
            const results = await Promise.all(requests);
            
            console.log('Traffic Overview Raw Results:', results);
            
            // Son 1 dakika için değer hesaplama - instant query veya rate için en son değer
            const getMetricValue = (result: any, index: number) => {
                console.log(`Metric ${index}:`, result?.data?.result);
                
                if (result?.data?.result?.length > 0) {
                    let totalValue = 0;
                    
                    // Tüm serilerdeki son değerleri topla
                    result.data.result.forEach((series: any) => {
                        if (series.values && series.values.length > 0) {
                            // Son değeri al
                            const lastPoint = series.values[series.values.length - 1];
                            const value = parseFloat(lastPoint[1]) || 0;
                            totalValue += value;
                            console.log(`Series value:`, value);
                        } else if (series.value) {
                            // Instant query için tek değer
                            const value = parseFloat(series.value[1]) || 0;
                            totalValue += value;
                            console.log(`Instant value:`, value);
                        }
                    });
                    
                    console.log(`Metric ${index} total value:`, totalValue);
                    return totalValue;
                }
                
                console.log(`Metric ${index}: No data`);
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
                http5xxErrors
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
                http5xxErrors: http5xxErrors
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
        // Her 30 saniyede bir otomatik yenile
        const interval = setInterval(fetchOverviewStats, 30000);
        return () => clearInterval(interval);
    }, []); // timeRange dependency kaldırıldı

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

    const StatisticCard = ({
        title,
        value,
        icon,
        color,
        suffix,
        formatter
    }: {
        title: string;
        value: number;
        icon: React.ReactNode;
        color: string;
        suffix?: string;
        formatter?: (value: number) => string;
    }) => (
        <Card
            style={{
                borderRadius: 12,
                border: '1px solid #f0f0f0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: `${color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: color,
                    fontSize: 20
                }}>
                    {icon}
                </div>
                <div style={{ flex: 1 }}>
                    <Text style={{
                        fontSize: 12,
                        color: '#8c8c8c',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        fontWeight: 500,
                        display: 'block',
                        marginBottom: 4
                    }}>
                        {title}
                    </Text>
                    <Statistic
                        value={value}
                        formatter={(val) => {
                            const numVal = typeof val === 'number' ? val : parseFloat(val.toString());
                            if (formatter) {
                                return formatter(numVal);
                            }
                            return <CountUp end={numVal} duration={1.2} />;
                        }}
                        suffix={suffix}
                        valueStyle={{
                            fontSize: 24,
                            fontWeight: 700,
                            color: color,
                            lineHeight: 1
                        }}
                    />
                </div>
            </div>
        </Card>
    );



    return (
        <Card
            style={{
                marginBottom: 24,
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}
        >
                        <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                marginBottom: 20 
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: 'linear-gradient(90deg, #056ccd 0%, #00c6fb 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: 16
                    }}>
                        <SwapOutlined />
                    </div>
                    <Title level={4} style={{ margin: 0, color: '#2c3e50' }}>
                        Traffic Overview
                    </Title>
                    {loading && <Spin size="small" />}
                </div>
                
                <Button
                    type="text"
                    icon={<ReloadOutlined />}
                    onClick={handleManualRefresh}
                    loading={loading}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        color: '#056ccd',
                        fontWeight: 500
                    }}
                >
                    Refresh
                </Button>
            </div>

            {/* Connections Row */}
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={8}>
                    <StatisticCard
                        title="Downstream Connections"
                        value={stats.downstreamConnections}
                        icon={<CloudServerOutlined />}
                        color="#52c41a"
                        formatter={formatNumber}
                    />
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <StatisticCard
                        title="Upstream Connections"
                        value={stats.upstreamConnections}
                        icon={<ClusterOutlined />}
                        color="#13c2c2"
                        formatter={formatNumber}
                    />
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <StatisticCard
                        title="Requests"
                        value={stats.totalRequests}
                        icon={<ApiOutlined />}
                        color="#722ed1"
                        formatter={formatNumber}
                        suffix="/s"
                    />
                </Col>
            </Row>

            {/* Traffic Row */}
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col xs={24} sm={12} lg={8}>
                    <StatisticCard
                        title="Incoming Traffic"
                        value={stats.incomingTraffic}
                        icon={<ArrowDownOutlined />}
                        color="#1890ff"
                        formatter={formatBytes}
                        suffix="/s"
                    />
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <StatisticCard
                        title="Outgoing Traffic"
                        value={stats.outgoingTraffic}
                        icon={<ArrowUpOutlined />}
                        color="#fa8c16"
                        formatter={formatBytes}
                        suffix="/s"
                    />
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <StatisticCard
                        title="4xx Errors"
                        value={stats.http4xxErrors}
                        icon={<WarningOutlined />}
                        color="#fa8c16"
                        formatter={formatNumber}
                        suffix="/s"
                    />
                </Col>
            </Row>

            {/* Errors & Health Row */}
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col xs={24} sm={12} lg={8}>
                    <StatisticCard
                        title="5xx Errors"
                        value={stats.http5xxErrors}
                        icon={<ExclamationCircleOutlined />}
                        color="#ff4d4f"
                        formatter={formatNumber}
                        suffix="/s"
                    />
                </Col>
                {stats.totalServers > 0 && (
                    <>
                        <Col xs={24} sm={12} lg={8}>
                            <StatisticCard
                                title="Unhealthy Servers"
                                value={stats.unhealthyServers}
                                icon={<ExclamationCircleOutlined />}
                                color={stats.unhealthyServers > 0 ? "#ff4d4f" : "#52c41a"}
                                suffix={`/ ${stats.totalServers}`}
                            />
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <div style={{
                                padding: 20,
                                background: stats.unhealthyServers === 0 ? '#f6ffed' : '#fff2f0',
                                borderRadius: 12,
                                border: `1px solid ${stats.unhealthyServers === 0 ? '#b7eb8f' : '#ffccc7'}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 8,
                                height: '100%',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                            }}>
                                <Text style={{ 
                                    color: stats.unhealthyServers === 0 ? '#52c41a' : '#ff4d4f',
                                    fontWeight: 600,
                                    fontSize: 16,
                                    textAlign: 'center'
                                }}>
                                    {stats.unhealthyServers === 0 ? '✅ All servers healthy' : `⚠️ ${stats.unhealthyServers} server(s) down`}
                                </Text>
                            </div>
                        </Col>
                    </>
                )}
            </Row>

            
        </Card>
    );
};

export default TrafficOverview; 