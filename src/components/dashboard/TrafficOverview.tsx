import React, { useEffect, useState, startTransition, useCallback, useMemo } from 'react';
import { Card, Row, Col, Spin, Typography, Button, Drawer, Input, Space } from 'antd';
import {
    LinkOutlined,
    SwapOutlined,
    CloudServerOutlined,
    ReloadOutlined,
    ThunderboltOutlined,
    SafetyCertificateOutlined,
    DashboardOutlined,
    UnorderedListOutlined,
    SearchOutlined
} from '@ant-design/icons';
import { useMetricsApiMutation } from '@/common/operations-api';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { useDashboardRefresh } from '@/pages/dashboard/context/DashboardRefreshContext';

const { Title, Text } = Typography;

// Compact labeled stat used by the domain-detail drawer rows. Renders as a
// small pill (tiny uppercase label + bold value) so several metrics line up
// neatly on the right edge of each row.
const MetricPill: React.FC<{ label: string; value: React.ReactNode; color: string; wide?: boolean }> = ({ label, value, color, wide }) => (
    <div style={{
        minWidth: wide ? 78 : 56,
        textAlign: 'center',
        padding: '4px 10px',
        borderRadius: 8,
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-default)'
    }}>
        <div style={{ fontSize: 9, letterSpacing: 0.5, color: 'var(--text-tertiary)', fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 15, fontWeight: 700, color, lineHeight: 1.3 }}>{value}</div>
    </div>
);

// Global value store to persist CountUp values across re-renders
const countUpValues = new Map<string, number>();

// Persistent CountUp that survives any re-render
const PersistentCountUp = ({
    end,
    duration = 1,
    formatter,
    id
}: {
    end: number;
    duration?: number;
    formatter?: (value: number) => string;
    id: string;
}) => {
    // Initialize display value - use persisted value if available, otherwise start from 0 for animation
    const [displayValue, setDisplayValue] = useState(() => {
        if (countUpValues.has(id)) {
            return countUpValues.get(id)!;
        }
        // If no persisted value and we have a real end value, start from 0 for animation
        return end > 0 ? 0 : end;
    });

    // Track if we've ever set a value for this component
    const [isInitialized, setIsInitialized] = useState(() => countUpValues.has(id));

    // Handle value changes and animations
    useEffect(() => {
        if (!isInitialized) {
            // First time initialization - animate from 0 to end
            if (end > 0) {
                setIsInitialized(true);

                const startTime = Date.now();
                const animationDuration = duration * 1000;

                const animate = () => {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / animationDuration, 1);
                    const easeOut = 1 - Math.pow(1 - progress, 3);
                    const currentValue = end * easeOut;

                    setDisplayValue(currentValue);
                    countUpValues.set(id, currentValue);

                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        setDisplayValue(end);
                        countUpValues.set(id, end);
                    }
                };

                requestAnimationFrame(animate);
            } else {
                setDisplayValue(end);
                countUpValues.set(id, end);
                setIsInitialized(true);
            }
        } else {
            // Subsequent updates - only animate if value actually changed
            const currentPersisted = countUpValues.get(id) ?? displayValue;
            if (Math.abs(end - currentPersisted) > 0.001) {
                const startValue = currentPersisted;
                const startTime = Date.now();
                const animationDuration = duration * 1000;

                const animate = () => {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / animationDuration, 1);
                    const easeOut = 1 - Math.pow(1 - progress, 3);
                    const currentValue = startValue + (end - startValue) * easeOut;

                    setDisplayValue(currentValue);
                    countUpValues.set(id, currentValue);

                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        setDisplayValue(end);
                        countUpValues.set(id, end);
                    }
                };

                requestAnimationFrame(animate);
            }
        }
    }, [end, duration, id, isInitialized]);

    const formattedValue = formatter ? formatter(displayValue) : Math.round(displayValue).toString();
    return <span>{formattedValue}</span>;
};

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

interface TrafficOverviewProps { }

interface DetailedMetric {
    domain: string;
    requests: number;
    connections: number;
    upstreamConnections: number;
    incomingBytes: number;
    outgoingBytes: number;
    errors4xx: number;
    errors5xx: number;
    healthy: number;
    total: number;
    status: 'healthy' | 'warning' | 'critical';
    isCluster?: boolean; // flag for cluster metrics
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
    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalData, setModalData] = useState<DetailedMetric[]>([]);
    const [modalLoading, setModalLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const { project } = useProjectVariable();
    const metricsApiMutation = useMetricsApiMutation();
    const { triggerRefresh } = useDashboardRefresh();

    const fetchOverviewStats = useCallback(async () => {
        if (!project) return;

        setLoading(true);
        try {
            const now = Math.floor(Date.now() / 1000);
            const startTime = now - 30;
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
                            default: 5,
                            ranges: [
                                { threshold: 2 * 24 * 60 * 60, value: 300 },
                                { threshold: 24 * 60 * 60, value: 60 },
                                { threshold: 1 * 60 * 60, value: 15 }
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
                            default: 5,
                            ranges: [
                                { threshold: 2 * 24 * 60 * 60, value: 300 },
                                { threshold: 24 * 60 * 60, value: 60 },
                                { threshold: 1 * 60 * 60, value: 15 }
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
                            default: 5,
                            ranges: [
                                { threshold: 2 * 24 * 60 * 60, value: 300 },
                                { threshold: 24 * 60 * 60, value: 60 },
                                { threshold: 1 * 60 * 60, value: 15 }
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
                            default: 5,
                            ranges: [
                                { threshold: 2 * 24 * 60 * 60, value: 300 },
                                { threshold: 24 * 60 * 60, value: 60 },
                                { threshold: 1 * 60 * 60, value: 15 }
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
                            default: 5,
                            ranges: [
                                { threshold: 2 * 24 * 60 * 60, value: 300 },
                                { threshold: 24 * 60 * 60, value: 60 },
                                { threshold: 1 * 60 * 60, value: 15 }
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
                            default: 5,
                            ranges: [
                                { threshold: 2 * 24 * 60 * 60, value: 300 },
                                { threshold: 24 * 60 * 60, value: 60 },
                                { threshold: 1 * 60 * 60, value: 15 }
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

            const getMetricValue = (result: any) => {
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
            ] = results.map((result) => getMetricValue(result));


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
    }, [metricsApiMutation.mutateAsync, project]);

    const handleManualRefresh = useCallback(() => {
        fetchOverviewStats(); // Refresh Traffic Overview
        triggerRefresh(); // Trigger global refresh for all widgets
    }, [fetchOverviewStats, triggerRefresh]);

    useEffect(() => {
        fetchOverviewStats();
    }, [fetchOverviewStats]);

    const formatBytes = useCallback((bytes: number) => {
        if (bytes === 0) return '0 B';
        if (bytes < 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        // Clamp index to valid range (0 to sizes.length - 1)
        const i = Math.max(0, Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }, []);

    const formatNumber = useCallback((num: number) => {
        const roundedNum = Math.round(num);
        if (roundedNum >= 1000000) {
            return (roundedNum / 1000000).toFixed(1) + 'M';
        } else if (roundedNum >= 1000) {
            return (roundedNum / 1000).toFixed(1) + 'K';
        }
        return roundedNum.toString();
    }, []);

    const fetchDomainDetails = useCallback(async (type: 'requests' | 'connections' | 'traffic') => {
        if (!project) return [];

        setModalLoading(true);
        try {
            // Use the same time window as the main dashboard
            const now = Math.floor(Date.now() / 1000);
            const startTime = now - 30; // Son 30 saniye - same as main dashboard
            const endTime = now;

            const domainsResult = await metricsApiMutation.mutateAsync({
                name: '.*',
                metric: 'http_downstream_rq_total',
                start: startTime,
                end: endTime,
                metricConfig: {
                    queryTemplate: `{__name__=~".*_%{project}_http_downstream_rq_total"}`
                }
            });

            // Extract unique domains from metric names
            const domains = new Set<string>();
            if (domainsResult?.data?.result?.length > 0) {
                domainsResult.data.result.forEach((series: any) => {
                    const metricName = series.metric?.__name__;
                    if (metricName) {
                        // Extract domain from metric name: {domain}_{projectId}_{metric_name}
                        // Find the project ID in the metric name and extract domain
                        const projectIndex = metricName.indexOf(`_${project}_`);
                        if (projectIndex > 0) {
                            const domainPart = metricName.substring(0, projectIndex);
                            // Keep domain with underscores as is - don't convert to dots
                            domains.add(domainPart);
                        }
                    }
                });
            }

            // Helper function to extract metric values
            const getMetricValue = (result: any) => {
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

            // Now fetch metrics for each domain - optimized to fetch only relevant metrics per type
            const domainMetrics: { [key: string]: DetailedMetric } = {};

            for (const domain of domains) {
                const domainKey = domain; // Domain is already in underscore format

                if (type === 'requests') {
                    // Fetch only request-related metrics
                    const [reqRate, errors4xx, errors5xx] = await Promise.all([
                        metricsApiMutation.mutateAsync({
                            name: '.*',
                            metric: 'http_downstream_rq_total',
                            start: startTime,
                            end: endTime,
                            metricConfig: {
                                queryTemplate: `sum(rate({__name__=~"${domainKey}_%{project}_http_downstream_rq_total", envoy_http_conn_manager_prefix!="admin"}[%{window}s]))`,
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
                                queryTemplate: `sum(rate({__name__=~"${domainKey}_%{project}_http_downstream_rq_xx_total", envoy_http_conn_manager_prefix!="admin", envoy_response_code_class="4"}[%{window}s]))`,
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
                                queryTemplate: `sum(rate({__name__=~"${domainKey}_%{project}_http_downstream_rq_xx_total", envoy_http_conn_manager_prefix!="admin", envoy_response_code_class="5"}[%{window}s]))`,
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
                    ]);


                    domainMetrics[domain] = {
                        domain: domain,
                        requests: getMetricValue(reqRate),
                        connections: 0,
                        upstreamConnections: 0,
                        incomingBytes: 0,
                        outgoingBytes: 0,
                        errors4xx: getMetricValue(errors4xx),
                        errors5xx: getMetricValue(errors5xx),
                        healthy: 1,
                        total: 1,
                        status: 'healthy'
                    };

                } else if (type === 'connections') {
                    // Fetch only connection-related metrics (downstream)
                    const connResult = await metricsApiMutation.mutateAsync({
                        name: '.*',
                        metric: 'listener_downstream_cx_active',
                        start: startTime,
                        end: endTime,
                        metricConfig: {
                            queryTemplate: `sum({__name__=~"${domainKey}_%{project}_listener_downstream_cx_active"})`
                        }
                    });


                    domainMetrics[domain] = {
                        domain: domain,
                        requests: 0,
                        connections: getMetricValue(connResult),
                        upstreamConnections: 0,
                        incomingBytes: 0,
                        outgoingBytes: 0,
                        errors4xx: 0,
                        errors5xx: 0,
                        healthy: 1,
                        total: 1,
                        status: 'healthy',
                        isCluster: false
                    };

                } else if (type === 'traffic') {
                    // Fetch only traffic-related metrics
                    const [rxBytes, txBytes] = await Promise.all([
                        metricsApiMutation.mutateAsync({
                            name: '.*',
                            metric: 'http_downstream_cx_rx_bytes_total',
                            start: startTime,
                            end: endTime,
                            metricConfig: {
                                queryTemplate: `sum(rate({__name__=~"${domainKey}_%{project}_http_downstream_cx_rx_bytes_total", envoy_http_conn_manager_prefix!="admin"}[%{window}s]))`,
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
                                queryTemplate: `sum(rate({__name__=~"${domainKey}_%{project}_http_downstream_cx_tx_bytes_total", envoy_http_conn_manager_prefix!="admin"}[%{window}s]))`,
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
                    ]);


                    domainMetrics[domain] = {
                        domain: domain,
                        requests: 0,
                        connections: 0,
                        upstreamConnections: 0,
                        incomingBytes: getMetricValue(rxBytes),
                        outgoingBytes: getMetricValue(txBytes),
                        errors4xx: 0,
                        errors5xx: 0,
                        healthy: 1,
                        total: 1,
                        status: 'healthy'
                    };
                }
            }


            // For connections type, also fetch cluster (upstream) metrics
            if (type === 'connections') {
                const clusterResult = await metricsApiMutation.mutateAsync({
                    name: '.*',
                    metric: 'cluster_upstream_cx_active',
                    start: startTime,
                    end: endTime,
                    metricConfig: {
                        queryTemplate: `{__name__=~".*_%{project}_cluster_upstream_cx_active", envoy_cluster_name!="elchi-control-plane"}`
                    }
                });

                // Extract cluster metrics
                if (clusterResult?.data?.result?.length > 0) {
                    clusterResult.data.result.forEach((series: any) => {
                        const clusterName = series.metric?.envoy_cluster_name;
                        if (clusterName && clusterName !== 'elchi-control-plane') {
                            let value = 0;
                            if (series.values && series.values.length > 0) {
                                const lastPoint = series.values[series.values.length - 1];
                                value = parseFloat(lastPoint[1]) || 0;
                            } else if (series.value) {
                                value = parseFloat(series.value[1]) || 0;
                            }

                            // Add cluster as a separate entry
                            domainMetrics[`cluster:${clusterName}`] = {
                                domain: clusterName,
                                requests: 0,
                                connections: 0,
                                upstreamConnections: value,
                                incomingBytes: 0,
                                outgoingBytes: 0,
                                errors4xx: 0,
                                errors5xx: 0,
                                healthy: 1,
                                total: 1,
                                status: 'healthy',
                                isCluster: true
                            };
                        }
                    });
                }
            }

            // Convert to array and determine status
            const domainList = Object.values(domainMetrics).map(item => {
                const totalErrors = item.errors4xx + item.errors5xx;
                const errorRate = item.requests > 0 ? (totalErrors / item.requests) * 100 : 0;

                let status: 'healthy' | 'warning' | 'critical' = 'healthy';
                if (errorRate > 10) status = 'critical';
                else if (errorRate > 5) status = 'warning';

                return { ...item, status };
            });

            // Sort by the relevant metric
            domainList.sort((a, b) => {
                switch (type) {
                    case 'requests': return b.requests - a.requests;
                    case 'connections':
                        // Show clusters afterwards, then sort by value
                        if (a.isCluster && !b.isCluster) return 1;
                        if (!a.isCluster && b.isCluster) return -1;
                        return (b.connections + b.upstreamConnections) - (a.connections + a.upstreamConnections);
                    case 'traffic': return (b.incomingBytes + b.outgoingBytes) - (a.incomingBytes + a.outgoingBytes);
                    default: return 0;
                }
            });

            return domainList;
        } catch (error) {
            console.error('Failed to fetch domain details:', error);
            return [];
        } finally {
            setModalLoading(false);
        }
    }, [metricsApiMutation.mutateAsync, project]);

    const showDetailModal = useCallback((type: 'requests' | 'connections' | 'traffic') => {
        const titles = {
            requests: 'Request Details by Domain',
            connections: 'Connection Details (Listeners & Clusters)',
            traffic: 'Traffic Details by Domain'
        };
        setModalTitle(titles[type]);

        startTransition(() => {
            setModalVisible(true);
            setSearchText('');
            setModalData([]);
        });

        fetchDomainDetails(type).then(data => {
            startTransition(() => {
                setModalData(data);
            });
        });
    }, [fetchDomainDetails]);

    const handleRefreshData = useCallback(async () => {
        if (!modalVisible) return;

        let type: 'requests' | 'connections' | 'traffic' = 'requests';
        if (modalTitle.includes('Connection')) type = 'connections';
        else if (modalTitle.includes('Traffic')) type = 'traffic';

        const data = await fetchDomainDetails(type);
        setModalData(data);
    }, [modalVisible, modalTitle, fetchDomainDetails]);

    const filteredModalData = useMemo(() =>
        modalData.filter(item =>
            item.domain.toLowerCase().includes(searchText.toLowerCase())
        ), [modalData, searchText]
    );

    const getStatusColor = useCallback((status: string) => {
        switch (status) {
            case 'healthy': return 'var(--color-success)';
            case 'warning': return 'var(--color-warning)';
            case 'critical': return 'var(--color-danger)';
            default: return 'var(--border-default)';
        }
    }, []);


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
                background: 'var(--traffic-card-bg)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--traffic-card-border)',
                borderRadius: 16,
                boxShadow: 'var(--shadow-md)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                height: 230,
                position: 'relative',
                overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
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
                    boxShadow: '0 4px 16px var(--shadow-primary)'
                }}>
                    {icon}
                </div>
                <Text style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: 'var(--text-primary)',
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
                            color: 'var(--text-secondary)',
                            fontWeight: 500
                        }}>
                            {metric.label}
                        </Text>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                            {metric.customRenderer ? (
                                <div style={{
                                    color: metric.color || 'var(--text-primary)'
                                }}>
                                    {metric.customRenderer(metric.value)}
                                </div>
                            ) : (
                                <>
                                    <Text style={{
                                        fontSize: 16,
                                        fontWeight: 700,
                                        color: metric.color || 'var(--text-primary)'
                                    }}>
                                        <PersistentCountUp
                                            id={`metric-${index}-${metric.label}`}
                                            end={metric.value}
                                            duration={1}
                                            formatter={metric.formatter || formatNumber}
                                        />
                                    </Text>
                                    {metric.suffix && (
                                        <Text style={{
                                            fontSize: 11,
                                            color: 'var(--text-secondary)',
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
        suffix,
        onShowList
    }: {
        title: string;
        value: number;
        icon: React.ReactNode;
        gradient: string;
        formatter?: (value: number) => string;
        suffix?: string;
        onShowList?: () => void;
    }) => (
        <Card
            style={{
                background: 'var(--traffic-card-bg)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--traffic-card-border)',
                borderRadius: 20,
                boxShadow: 'var(--shadow-lg)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                height: 90,
                position: 'relative',
                overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
                e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            }}
        >
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
                    boxShadow: '0 8px 24px var(--shadow-primary)'
                }}>
                    {icon}
                </div>
                <div style={{ flex: 1 }}>
                    <Text style={{
                        fontSize: 11,
                        color: 'var(--text-secondary)',
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
                            color: 'var(--text-primary)',
                            lineHeight: 1
                        }}>
                            <PersistentCountUp
                                id={`hero-${title}`}
                                end={value}
                                duration={1.5}
                                formatter={formatter || formatNumber}
                            />
                        </Text>
                        {suffix && (
                            <Text style={{
                                fontSize: 14,
                                color: 'var(--text-secondary)',
                                fontWeight: 600
                            }}>
                                {suffix}
                            </Text>
                        )}
                    </div>
                </div>

                {/* Hamburger menu butonu */}
                {onShowList && (
                    <Button
                        type="text"
                        icon={<UnorderedListOutlined />}
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            onShowList();
                        }}
                        style={{
                            color: 'var(--text-secondary)',
                            border: '1px solid var(--border-default)',
                            borderRadius: 8,
                            width: 32,
                            height: 32,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'var(--bg-surface)',
                            transition: 'all 0.3s ease',
                            boxShadow: 'var(--shadow-sm)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = gradient;
                            e.currentTarget.style.color = 'white';
                            e.currentTarget.style.borderColor = 'transparent';
                            e.currentTarget.style.transform = 'scale(1.1)';
                            e.currentTarget.style.boxShadow = '0 4px 12px var(--shadow-primary)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'var(--bg-surface)';
                            e.currentTarget.style.color = 'var(--text-secondary)';
                            e.currentTarget.style.borderColor = 'var(--border-default)';
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                        }}
                    />
                )}
            </div>
        </Card>
    );

    return (
        <div style={{
            background: 'var(--gradient-primary)',
            borderRadius: 24,
            padding: 24,
            marginBottom: 0,
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
                background: 'radial-gradient(circle, var(--glass-white-light) 0%, transparent 70%)',
                borderRadius: '50%',
                animation: 'float 6s ease-in-out infinite'
            }} />
            <div style={{
                position: 'absolute',
                bottom: -150,
                right: -150,
                width: 400,
                height: 400,
                background: 'radial-gradient(circle, var(--glass-white-lighter) 0%, transparent 70%)',
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
                        background: 'var(--glass-white-medium)',
                        backdropFilter: 'blur(20px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: 20,
                        border: '1px solid var(--glass-border)',
                        boxShadow: '0 4px 16px var(--shadow-primary-color-hover)'
                    }}>
                        <DashboardOutlined />
                    </div>
                    <div>
                        <Title level={3} style={{
                            margin: 0,
                            color: 'white',
                            fontWeight: 800,
                            fontSize: 28,
                            textShadow: '0 2px 4px var(--shadow-text)'
                        }}>
                            Traffic Overview
                        </Title>
                        <Text style={{
                            color: 'var(--text-on-gradient)',
                            fontSize: 14,
                            fontWeight: 500
                        }}>
                            Real-time network performance metrics
                        </Text>
                    </div>
                    {loading && (
                        <div style={{
                            padding: '8px 16px',
                            background: 'var(--glass-white-light)',
                            borderRadius: 12,
                            backdropFilter: 'blur(10px)',
                            border: '1px solid var(--glass-border)',
                            boxShadow: '0 2px 8px var(--shadow-primary-color)'
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
                        background: 'var(--glass-white-light)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid var(--glass-white-medium)',
                        borderRadius: 12,
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 16px var(--shadow-primary-color)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--glass-white-medium)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 20px var(--shadow-primary-color-hover)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'var(--glass-white-light)';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 16px var(--shadow-primary-color)';
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
                        gradient="linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)"
                        formatter={formatNumber}
                        suffix="/s"
                        onShowList={() => showDetailModal('requests')}
                    />
                </Col>
                <Col xs={24} sm={8}>
                    <HeroMetricCard
                        title="Total Connections"
                        value={stats.downstreamConnections + stats.upstreamConnections}
                        icon={<LinkOutlined />}
                        gradient="linear-gradient(135deg, var(--color-accent) 0%, var(--color-cyan) 100%)"
                        formatter={formatNumber}
                        onShowList={() => showDetailModal('connections')}
                    />
                </Col>
                <Col xs={24} sm={8}>
                    <HeroMetricCard
                        title="Total Traffic"
                        value={stats.incomingTraffic + stats.outgoingTraffic}
                        icon={<SwapOutlined />}
                        gradient="linear-gradient(135deg, var(--color-sky) 0%, var(--color-sky-light) 100%)"
                        formatter={formatBytes}
                        suffix="/s"
                        onShowList={() => showDetailModal('traffic')}
                    />
                </Col>
            </Row>

            {/* Grouped Metrics */}
            <Row gutter={[24, 24]} style={{ position: 'relative', zIndex: 2 }}>
                {/* Errors & Health */}
                <Col xs={24} lg={8}>
                    <GroupedMetricCard
                        title="Errors & Health"
                        icon={<ThunderboltOutlined />}
                        gradient="linear-gradient(135deg, var(--color-warning) 0%, var(--color-danger) 100%)"
                        metrics={[
                            {
                                label: '4xx Errors',
                                value: stats.http4xxErrors,
                                suffix: '/s',
                                color: 'var(--color-warning)'
                            },
                            {
                                label: '5xx Errors',
                                value: stats.http5xxErrors,
                                suffix: '/s',
                                color: 'var(--color-danger)'
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
                                            color: 'var(--text-tertiary)',
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
                                color: stats.totalServers === 0 ? 'var(--text-tertiary)' : (stats.unhealthyServers > 0 ? 'var(--color-danger)' : 'var(--color-success)')
                            }
                        ]}
                    />
                </Col>
                {/* Connections Breakdown */}
                <Col xs={24} lg={8}>
                    <GroupedMetricCard
                        title="Connections"
                        icon={<LinkOutlined />}
                        gradient="linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-sky) 100%)"
                        metrics={[
                            {
                                label: 'Downstream',
                                value: stats.downstreamConnections,
                                color: 'var(--color-primary-dark)'
                            },
                            {
                                label: 'Upstream',
                                value: stats.upstreamConnections,
                                color: 'var(--color-sky-light)'
                            },
                            {
                                label: 'Destroyed',
                                value: stats.downstreamDestroyedFromRemote,
                                suffix: '/s',
                                color: 'var(--color-warning)'
                            }
                        ]}
                    />
                </Col>

                {/* Traffic Breakdown */}
                <Col xs={24} lg={8}>
                    <GroupedMetricCard
                        title="Traffic"
                        icon={<SwapOutlined />}
                        gradient="linear-gradient(135deg, var(--color-teal) 0%, var(--color-cyan) 100%)"
                        metrics={[
                            {
                                label: 'Incoming',
                                value: stats.incomingTraffic,
                                formatter: formatBytes,
                                suffix: '/s',
                                color: 'var(--color-teal)'
                            },
                            {
                                label: 'Outgoing',
                                value: stats.outgoingTraffic,
                                formatter: formatBytes,
                                suffix: '/s',
                                color: 'var(--color-sky)'
                            },
                            {
                                label: 'Active Listeners',
                                value: stats.activeListeners,
                                color: 'var(--color-accent)'
                            }
                        ]}
                    />
                </Col>

            </Row>

            {/* Detail Drawer */}
            <Drawer
                title={
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 16
                    }}>
                        <span>{modalTitle}</span>
                        <Space>
                            <Input
                                placeholder="Search..."
                                prefix={<SearchOutlined style={{ color: 'var(--text-tertiary)' }} />}
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                style={{
                                    width: 200,
                                    fontSize: 12
                                }}
                                allowClear
                            />
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={handleRefreshData}
                                loading={modalLoading}
                                size="middle"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 4
                                }}
                            >
                                Refresh
                            </Button>
                        </Space>
                    </div>
                }
                open={modalVisible}
                onClose={() => setModalVisible(false)}
                width={800}
                placement="right"
                styles={{
                    body: {
                        padding: 16,
                        height: 'calc(100vh - 55px)',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column'
                    }
                }}
            >
                {modalLoading ? (
                    <div style={{ textAlign: 'center', padding: 40, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Spin size="large" />
                        <Text style={{ display: 'block', marginTop: 16, color: 'var(--text-secondary)' }}>
                            Loading domain metrics...
                        </Text>
                    </div>
                ) : (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        {filteredModalData.length === 0 ? (
                            <div style={{
                                textAlign: 'center',
                                padding: 40,
                                color: 'var(--text-secondary)',
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {searchText ? (
                                    <>
                                        <SearchOutlined style={{ fontSize: 32, marginBottom: 16 }} />
                                        <div style={{ fontSize: 16, marginBottom: 8 }}>No domains found</div>
                                        <div style={{ fontSize: 12 }}>
                                            No domains match "{searchText}". Try adjusting your search.
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <UnorderedListOutlined style={{ fontSize: 32, marginBottom: 16, opacity: 0.5 }} />
                                        <div style={{ fontSize: 16, marginBottom: 8 }}>No data yet</div>
                                        <div style={{ fontSize: 12 }}>
                                            No metrics are available for this view right now.
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 8,
                                flex: 1,
                                overflowY: 'auto',
                                alignContent: 'flex-start',
                                paddingRight: 8
                            }}>
                                {filteredModalData.map((item, index) => {
                                    const accent = item.isCluster ? 'var(--color-sky-light)' : getStatusColor(item.status);
                                    return (
                                    <div
                                        key={item.domain}
                                        style={{
                                            background: 'var(--card-bg)',
                                            border: '1px solid var(--border-default)',
                                            borderRadius: 10,
                                            padding: '10px 14px',
                                            transition: 'border-color 0.15s ease, background 0.15s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            gap: 12,
                                            flexShrink: 0
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor = accent;
                                            e.currentTarget.style.background = 'var(--bg-hover)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor = 'var(--border-default)';
                                            e.currentTarget.style.background = 'var(--card-bg)';
                                        }}
                                    >
                                        {/* Left: rank/icon + name + status */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                                            <div style={{
                                                width: 22,
                                                height: 22,
                                                borderRadius: 6,
                                                background: accent,
                                                color: 'white',
                                                fontSize: 11,
                                                fontWeight: 700,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0
                                            }}>
                                                {item.isCluster ? <CloudServerOutlined style={{ fontSize: 12 }} /> : index + 1}
                                            </div>
                                            <Text
                                                strong
                                                ellipsis={{ tooltip: item.domain }}
                                                style={{
                                                    fontSize: 13,
                                                    fontFamily: 'Monaco, Consolas, monospace',
                                                    color: 'var(--text-primary)',
                                                    minWidth: 0
                                                }}
                                            >
                                                {item.domain}
                                            </Text>
                                            {item.isCluster && (
                                                <span style={{
                                                    fontSize: 9,
                                                    lineHeight: 1.4,
                                                    padding: '1px 6px',
                                                    background: 'var(--color-sky-light)',
                                                    color: 'white',
                                                    borderRadius: 4,
                                                    fontWeight: 700,
                                                    letterSpacing: 0.4,
                                                    flexShrink: 0
                                                }}>
                                                    CLUSTER
                                                </span>
                                            )}
                                            <span style={{
                                                width: 7,
                                                height: 7,
                                                borderRadius: '50%',
                                                background: accent,
                                                boxShadow: `0 0 6px ${accent}80`,
                                                flexShrink: 0
                                            }} />
                                        </div>

                                        {/* Right: metric pills */}
                                        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
                                            {modalTitle.includes('Request') && (
                                                <>
                                                    <MetricPill label="REQ/S" value={formatNumber(item.requests)} color="var(--color-primary)" />
                                                    <MetricPill label="4XX" value={formatNumber(item.errors4xx)} color="var(--color-warning)" />
                                                    <MetricPill label="5XX" value={formatNumber(item.errors5xx)} color="var(--color-danger)" />
                                                </>
                                            )}
                                            {modalTitle.includes('Connection') && (
                                                item.isCluster
                                                    ? <MetricPill label="UPSTREAM" value={formatNumber(item.upstreamConnections)} color="var(--color-sky-light)" wide />
                                                    : <MetricPill label="DOWNSTREAM" value={formatNumber(item.connections)} color="var(--color-primary-dark)" wide />
                                            )}
                                            {modalTitle.includes('Traffic') && (
                                                <>
                                                    <MetricPill label="IN/S" value={formatBytes(item.incomingBytes)} color="var(--color-teal)" wide />
                                                    <MetricPill label="OUT/S" value={formatBytes(item.outgoingBytes)} color="var(--color-sky)" wide />
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </Drawer>

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