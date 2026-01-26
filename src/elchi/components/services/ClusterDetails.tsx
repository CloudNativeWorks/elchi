import React, { useEffect, useState, useRef } from 'react';
import { Select, Table, Card, Typography, Spin, Alert, Badge, Input, Button, Collapse, Row, Col, Statistic } from 'antd';
import { useClusterDetails } from '@/hooks/useClusterDetails';
import { DatabaseOutlined, CheckCircleOutlined, WarningOutlined, SearchOutlined, CaretRightOutlined, ReloadOutlined } from '@ant-design/icons';

const { Text } = Typography;


interface ClusterDetailsProps {
    name: string;
    project: string;
    version?: string;
    envoys?: any;
}

const metricLabels: Record<string, string> = {
    'cx_connect_fail': 'Connection Failures',
    'cx_total': 'Total Connections',
    'rq_error': 'Request Errors',
    'rq_success': 'Successful Requests',
    'rq_timeout': 'Request Timeouts',
    'rq_total': 'Total Requests',
    'cx_active': 'Active Connections',
    'rq_active': 'Active Requests'
};

interface MetricChange {
    value: number;
    timestamp: number;
}

interface MetricChanges {
    [key: string]: {
        [metricName: string]: MetricChange;
    };
}

const ClusterDetails: React.FC<ClusterDetailsProps> = ({ name, project, version, envoys }) => {
    const { loading, error, clusterData, fetchClusterDetails } = useClusterDetails({ name, project, version });
    const [selectedClient, setSelectedClient] = useState<string>();
    const [metricChanges, setMetricChanges] = useState<MetricChanges>({});
    const previousMetrics = useRef<any>({});
    const [searchText, setSearchText] = useState('');
    const [manualRefreshLoading, setManualRefreshLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [showError, setShowError] = useState(false);

    const calculateMetricChanges = (newData: any[]) => {
        if (!Array.isArray(newData)) return {};

        const changes: MetricChanges = {};
        const newMetrics: any = {};

        // FIRST PASS: Collect all new metrics
        newData.forEach(data => {
            if (!data?.Result?.EnvoyAdmin?.body?.cluster_statuses) return;
            const clientName = data.identity.client_name;

            if (!newMetrics[clientName]) {
                newMetrics[clientName] = {};
            }

            data.Result.EnvoyAdmin.body.cluster_statuses.forEach((cluster: any) => {
                cluster.host_statuses?.forEach((host: any) => {
                    const address = host.address?.socket_address ?
                        `${host.address.socket_address.address}:${host.address.socket_address.port_value}` :
                        'unknown';

                    host.stats?.forEach((stat: any) => {
                        if (!stat.value || !metricLabels[stat.name]) return;

                        const key = `${address}-${stat.name}`;
                        const newValue = parseInt(stat.value);

                        // Store the new value
                        newMetrics[clientName][key] = newValue;
                    });
                });
            });
        });

        // SECOND PASS: Calculate changes by comparing with previous metrics
        Object.keys(newMetrics).forEach(clientName => {
            changes[clientName] = {};

            Object.keys(newMetrics[clientName]).forEach(key => {
                const newValue = newMetrics[clientName][key];
                const prevValue = previousMetrics.current[clientName]?.[key];

                // Only record POSITIVE changes when previous value exists
                if (prevValue !== undefined && newValue > prevValue) {
                    changes[clientName][key] = {
                        value: newValue - prevValue,
                        timestamp: Date.now()
                    };
                }
            });
        });

        // ATOMIC UPDATE: Replace previous metrics with new metrics
        previousMetrics.current = newMetrics;

        return changes;
    };

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetchClusterDetails();
            if (result?.success && result.data) {
                const changes = calculateMetricChanges(result.data);
                setMetricChanges(changes);
            }
            setInitialLoading(false);
        };

        fetchData();
        const interval = setInterval(fetchData, 15000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (error) {
            setShowError(true);
            const timer = setTimeout(() => {
                if (!loading) {
                    setShowError(false);
                }
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, loading]);

    useEffect(() => {
        if (clusterData?.length > 0 && !selectedClient) {
            setSelectedClient(clusterData[0].identity.client_name);
        }
    }, [clusterData]);

    const selectedClientData = clusterData?.find(data => data.identity.client_name === selectedClient);
    const clusterStatuses = selectedClientData?.Result?.EnvoyAdmin?.body?.cluster_statuses || [];

    // Sort cluster statuses by name to maintain consistent order
    const sortedClusterStatuses = [...clusterStatuses].sort((a, b) => a.name.localeCompare(b.name));

    // Filter based on search text
    const filteredClusterStatuses = sortedClusterStatuses.filter(cluster => {
        const searchLower = searchText.toLowerCase();
        if (!searchLower) return true;

        // Search in cluster name
        if (cluster.name.toLowerCase().includes(searchLower)) return true;

        // Search in host addresses if host_statuses exists
        const hostStatuses = cluster.host_statuses || [];
        return hostStatuses.some(host => 
            host.hostname?.toLowerCase().includes(searchLower) ||
            host.address?.socket_address?.address.toLowerCase().includes(searchLower) ||
            (host.address?.socket_address && `${host.address.socket_address.address}:${host.address.socket_address.port_value}`.toLowerCase().includes(searchLower))
        );
    });

    //eslint-disable-next-line
    const ValueChange = ({ value, metricKey }: { value: number, metricKey: string }) => {
        const change = selectedClient ? metricChanges[selectedClient]?.[metricKey] : undefined;
        const [visible, setVisible] = useState(true);

        useEffect(() => {
            if (change) {
                setVisible(true);
                const timer = setTimeout(() => setVisible(false), 5000);
                return () => clearTimeout(timer);
            }
        }, [change?.value]);

        if (!change || !visible) return null;

        const isPositive = change.value > 0;
        const timeDiff = Date.now() - change.timestamp;
        if (timeDiff > 5000) return null;

        return (
            <span style={{
                marginLeft: 8,
                color: isPositive ? '#52c41a' : '#ff4d4f',
                fontSize: '12px',
                opacity: visible ? 1 : 0,
                transition: 'opacity 1s ease-in-out',
                fontWeight: 'bold',
                background: isPositive ? 'rgba(82, 196, 26, 0.1)' : 'rgba(255, 77, 79, 0.1)',
                padding: '2px 6px',
                borderRadius: '4px',
            }}>
                {isPositive ? '+' : ''}{change.value}
            </span>
        );
    };

    const columns = [
        {
            title: 'Cluster',
            dataIndex: 'name',
            key: 'name',
            width: '20%',
            render: (text: string) => (
                <Text strong style={{ fontSize: '13px' }}>{text}</Text>
            )
        },
        {
            title: 'Server Status & Metrics',
            dataIndex: 'host_statuses',
            key: 'hosts',
            width: '80%',
            render: (hosts: any[] = []) => {
                if (!hosts?.length) {
                    return <Text type="secondary" style={{ fontSize: '13px' }}>No host status available</Text>;
                }

                const summary = {
                    total: hosts.length,
                    healthy: hosts.filter(h => {
                        // If failed_active_health_check is true, consider unhealthy
                        if (h.health_status?.failed_active_health_check === true) {
                            return false;
                        }
                        // Otherwise use eds_health_status
                        return h.health_status?.eds_health_status === 'HEALTHY';
                    }).length,
                    totalConnections: 0,
                    activeConnections: 0,
                    totalRequests: 0,
                    errorRequests: 0
                };

                hosts.forEach(host => {
                    const stats = host.stats || [];
                    stats.forEach((stat: any) => {
                        if (stat.name === 'cx_total' && stat.value) summary.totalConnections += parseInt(stat.value);
                        if (stat.name === 'cx_active' && stat.value) summary.activeConnections += parseInt(stat.value);
                        if (stat.name === 'rq_total' && stat.value) summary.totalRequests += parseInt(stat.value);
                        if (stat.name === 'rq_error' && stat.value) summary.errorRequests += parseInt(stat.value);
                    });
                });

                return (
                    <div>
                        <Row gutter={[16, 16]} style={{ marginBottom: 12 }}>
                            <Col span={6}>
                                <Statistic 
                                    title="Total Servers"
                                    value={summary.total}
                                    suffix={`/ ${summary.healthy} healthy`}
                                    valueStyle={{ fontSize: '16px' }}
                                />
                            </Col>
                            <Col span={6}>
                                <Statistic 
                                    title="Total Connections"
                                    value={summary.totalConnections}
                                    suffix={`/ ${summary.activeConnections} active`}
                                    valueStyle={{ fontSize: '16px' }}
                                />
                            </Col>
                            <Col span={6}>
                                <Statistic 
                                    title="Total Requests"
                                    value={summary.totalRequests}
                                    valueStyle={{ fontSize: '16px' }}
                                />
                            </Col>
                            <Col span={6}>
                                <Statistic 
                                    title="Error Requests"
                                    value={summary.errorRequests}
                                    valueStyle={{ fontSize: '16px', color: summary.errorRequests > 0 ? '#ff4d4f' : undefined }}
                                />
                            </Col>
                        </Row>

                        <Collapse 
                            ghost
                            expandIcon={({ isActive }) => (
                                <CaretRightOutlined 
                                    rotate={isActive ? 90 : 0} 
                                />
                            )}
                            items={hosts.map((host, idx) => {
                                // Check failed_active_health_check first, if true then unhealthy
                                const isHealthy = host.health_status?.failed_active_health_check === true 
                                    ? false 
                                    : host.health_status?.eds_health_status === 'HEALTHY';
                                const address = host.address?.socket_address ? 
                                    `${host.address.socket_address.address}:${host.address.socket_address.port_value}` :
                                    'No address';
                                const stats = host.stats || [];
                                const filteredStats = stats.filter((stat: any) => metricLabels[stat.name]);
                                const pairs = [];
                                
                                for (let i = 0; i < filteredStats.length; i += 2) {
                                    pairs.push(filteredStats.slice(i, i + 2));
                                }

                                return {
                                    key: idx,
                                    label: (
                                        <div style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: 12,
                                            width: '100%',
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: '300px' }}>
                                                {isHealthy ? (
                                                    <CheckCircleOutlined style={{ color: 'var(--color-success)', fontSize: 13 }} />
                                                ) : (
                                                    <WarningOutlined style={{ color: 'var(--color-danger)', fontSize: 13 }} />
                                                )}
                                                <Text strong style={{ fontSize: '13px' }}>{host.hostname || address}</Text>
                                                <Badge 
                                                    status={isHealthy ? 'success' : 'error'}
                                                    text={<Text style={{ fontSize: '12px' }}>
                                                        {host.health_status?.failed_active_health_check === true 
                                                            ? 'UNHEALTHY' 
                                                            : (host.health_status?.eds_health_status || 'Unknown')}
                                                    </Text>}
                                                />
                                            </div>

                                            <div style={{ 
                                                display: 'flex', 
                                                gap: 24,
                                                marginLeft: 'auto',
                                                alignItems: 'center'
                                            }}>
                                                {host.stats?.find((s: any) => s.name === 'cx_active')?.value && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                        <Badge status="processing" />
                                                        <Text type="secondary" style={{ fontSize: '12px' }}>
                                                            Active Conn:
                                                        </Text>
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <Text strong style={{ fontSize: '12px' }}>
                                                                {host.stats?.find((s: any) => s.name === 'cx_active')?.value || 0}
                                                            </Text>
                                                            <ValueChange 
                                                                value={parseInt(host.stats?.find((s: any) => s.name === 'cx_active')?.value || '0')}
                                                                metricKey={`${address}-cx_active`}
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                {host.stats?.find((s: any) => s.name === 'rq_error')?.value > 0 && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                        <Badge status="error" />
                                                        <Text type="secondary" style={{ fontSize: '12px' }}>
                                                            Errors:
                                                        </Text>
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <Text strong style={{ 
                                                                fontSize: '12px',
                                                                color: 'var(--color-danger)'
                                                            }}>
                                                                {host.stats?.find((s: any) => s.name === 'rq_error')?.value || 0}
                                                            </Text>
                                                            <ValueChange 
                                                                value={parseInt(host.stats?.find((s: any) => s.name === 'rq_error')?.value || '0')}
                                                                metricKey={`${address}-rq_error`}
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                {host.stats?.find((s: any) => s.name === 'rq_total')?.value > 0 && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                        <Badge status="default" />
                                                        <Text type="secondary" style={{ fontSize: '12px' }}>
                                                            Total Req:
                                                        </Text>
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <Text strong style={{ fontSize: '12px' }}>
                                                                {host.stats?.find((s: any) => s.name === 'rq_total')?.value || 0}
                                                            </Text>
                                                            <ValueChange 
                                                                value={parseInt(host.stats?.find((s: any) => s.name === 'rq_total')?.value || '0')}
                                                                metricKey={`${address}-rq_total`}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ),
                                    children: (
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(2, 1fr)',
                                            gap: 8,
                                            padding: '8px 24px',
                                            background: 'var(--bg-surface)',
                                            borderRadius: 6
                                        }}>
                                            {pairs.map((pair, pairIdx) => (
                                                <React.Fragment key={pairIdx}>
                                                    {pair.map((stat: any, statIdx: number) => {
                                                        const value = parseInt(stat.value || '0');
                                                        return (
                                                            <div key={statIdx} style={{
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                alignItems: 'center',
                                                                padding: '8px 12px',
                                                                background: 'var(--card-bg)',
                                                                borderRadius: 6,
                                                                border: '1px solid var(--border-default)'
                                                            }}>
                                                                <Text type="secondary" style={{ fontSize: '13px' }}>
                                                                    {metricLabels[stat.name]}:
                                                                </Text>
                                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                    {stat.type === 'GAUGE' ? (
                                                                        <Badge 
                                                                            status={value > 0 ? 'processing' : 'default'} 
                                                                            text={value.toString()} 
                                                                        />
                                                                    ) : (
                                                                        <Text strong style={{ fontSize: '13px' }}>
                                                                            {value.toLocaleString()}
                                                                        </Text>
                                                                    )}
                                                                    <ValueChange 
                                                                        value={value}
                                                                        metricKey={`${address}-${stat.name}`}
                                                                    />
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    )
                                };
                            })}
                            style={{ marginBottom: 16 }}
                        />
                    </div>
                );
            }
        }
    ];

    const handleManualRefresh = async () => {
        setManualRefreshLoading(true);
        const result = await fetchClusterDetails();
        if (result?.success && result.data) {
            const changes = calculateMetricChanges(result.data);
            setMetricChanges(changes);
        }
        setManualRefreshLoading(false);
    };

    if (initialLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '40px',
                background: 'var(--card-bg)',
                borderRadius: 8,
                boxShadow: 'var(--shadow-sm)'
            }}>
                <Spin size="large" />
            </div>
        );
    }

    if (showError && error) {
        return (
            <Alert 
                type="error" 
                message={error} 
                style={{
                    marginBottom: 16,
                    transition: 'opacity 0.3s ease-in-out'
                }}
            />
        );
    }

    if (!loading && !selectedClientData?.Result?.EnvoyAdmin?.body) {
        return (
            <Alert
                type="error"
                message="Unable to fetch cluster details. The Envoy admin interface might be unavailable."
                description="Please check if Envoy is running and accessible."
                showIcon
                style={{
                    marginBottom: 16,
                    transition: 'opacity 0.3s ease-in-out'
                }}
            />
        );
    }

    return (
        <div>
            <div style={{ 
                marginBottom: 8, 
                marginTop: 0,
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                gap: 16
            }}>
                <Input
                    prefix={<SearchOutlined style={{ color: 'var(--text-secondary)' }} />}
                    placeholder="Search cluster name or IP address"
                    style={{ width: 300 }}
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    allowClear
                    disabled={!selectedClientData}
                />
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <DatabaseOutlined style={{ fontSize: 16, color: 'var(--color-primary)' }} />
                    <Select
                        style={{ width: 200 }}
                        value={selectedClient}
                        onChange={setSelectedClient}
                        options={envoys?.envoys?.map((envoy: any) => {
                            const isConnected = envoy.connected;
                            const isAvailable = clusterData?.some(data => data.identity.client_name === envoy.client_name);
                            return {
                                label: (
                                    <span style={{
                                        color: !isConnected ? 'var(--text-disabled)' : undefined,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 6
                                    }}>
                                        <Badge
                                            status={isConnected ? 'success' : 'error'}
                                            style={{ marginRight: 4 }}
                                        />
                                        {envoy.client_name}
                                    </span>
                                ),
                                value: envoy.client_name,
                                disabled: !isAvailable
                            };
                        }) || []}
                        loading={loading}
                        placeholder="Select client"
                    />
                    <Button
                        icon={<ReloadOutlined spin={manualRefreshLoading} />}
                        onClick={handleManualRefresh}
                        title="Refresh metrics"
                        disabled={!selectedClientData}
                    />
                </div>
            </div>

            <Card 
                style={{ 
                    borderRadius: 12, 
                    boxShadow: '0 2px 8px rgba(5,117,230,0.06)', 
                    margin: '0 auto',
                    position: 'relative',
                }}
            >
                <Table
                    dataSource={filteredClusterStatuses}
                    columns={columns}
                    rowKey="name"
                    pagination={false}
                    size="middle"
                    style={{
                        opacity: (loading || manualRefreshLoading) ? 0.6 : 1,
                        transition: 'opacity 0.2s'
                    }}
                    loading={{
                        spinning: loading && !selectedClientData,
                        tip: 'Loading cluster details...'
                    }}
                />
                {(manualRefreshLoading || (loading && selectedClientData)) && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'var(--bg-loading)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backdropFilter: 'blur(1px)',
                        borderRadius: 12,
                        zIndex: 1
                    }}>
                        <Spin size="large" />
                    </div>
                )}
            </Card>
        </div>
    );
};

export default ClusterDetails; 