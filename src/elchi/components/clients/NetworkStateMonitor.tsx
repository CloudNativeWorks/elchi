import React, { useState, useEffect, useCallback } from 'react';
import { Card, Table, Tag, Button, Space, Divider, Typography, Tabs, Alert, Spin } from 'antd';
import { 
    ReloadOutlined, 
    NetworkOutlined, 
    SafetyCertificateOutlined,
    InfoCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import { useNetworkOperations } from '@/hooks/useNetworkOperations';
import { NetworkState } from '@/hooks/useClientNetworks';
import NetworkSafetyHandler from './NetworkSafetyHandler';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface NetworkStateMonitorProps {
    clientId: string;
    autoRefresh?: boolean;
    refreshInterval?: number; // in seconds
    onStateChange?: (state: NetworkState | null) => void;
}

const NetworkStateMonitor: React.FC<NetworkStateMonitorProps> = ({
    clientId,
    autoRefresh = true,
    refreshInterval = 30,
    onStateChange
}) => {
    const { getNetworkState } = useNetworkOperations();
    const [networkState, setNetworkState] = useState<NetworkState | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const fetchNetworkState = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await getNetworkState(clientId);
            if (response.success && response.network_state) {
                setNetworkState(response.network_state);
                setLastUpdated(new Date());
                onStateChange?.(response.network_state);
            } else {
                setError(response.error || 'Failed to fetch network state');
                setNetworkState(null);
                onStateChange?.(null);
            }
        } catch (err: any) {
            const errorMessage = err?.message || 'Failed to fetch network state';
            setError(errorMessage);
            setNetworkState(null);
            onStateChange?.(null);
        } finally {
            setLoading(false);
        }
    }, [clientId, getNetworkState, onStateChange]);

    useEffect(() => {
        fetchNetworkState();
    }, [fetchNetworkState]);

    useEffect(() => {
        if (!autoRefresh) return;

        const interval = setInterval(fetchNetworkState, refreshInterval * 1000);
        return () => clearInterval(interval);
    }, [autoRefresh, refreshInterval, fetchNetworkState]);

    const getInterfaceStatus = (iface: any) => {
        if (iface.state === 'up' && iface.has_carrier) {
            return <Tag color="green" icon={<CheckCircleOutlined />}>Active</Tag>;
        } else if (iface.state === 'up' && !iface.has_carrier) {
            return <Tag color="orange" icon={<ExclamationCircleOutlined />}>No Carrier</Tag>;
        } else {
            return <Tag color="red" icon={<CloseCircleOutlined />}>Down</Tag>;
        }
    };

    const interfaceColumns = [
        {
            title: 'Interface',
            dataIndex: 'name',
            key: 'name',
            width: '20%',
            render: (text: string) => <Text strong>{text}</Text>
        },
        {
            title: 'Status',
            key: 'status',
            width: '15%',
            render: (record: any) => getInterfaceStatus(record)
        },
        {
            title: 'IP Addresses',
            dataIndex: 'addresses',
            key: 'addresses',
            width: '30%',
            render: (addresses: string[]) => (
                <div>
                    {addresses && addresses.length > 0 ? (
                        addresses.map((addr, idx) => (
                            <Tag key={idx} style={{ marginBottom: 2 }}>{addr}</Tag>
                        ))
                    ) : (
                        <Text type="secondary">No addresses</Text>
                    )}
                </div>
            )
        },
        {
            title: 'MTU',
            dataIndex: 'mtu',
            key: 'mtu',
            width: '10%'
        },
        {
            title: 'MAC Address',
            dataIndex: 'mac_address',
            key: 'mac_address',
            width: '25%',
            render: (text: string) => text || <Text type="secondary">N/A</Text>
        }
    ];

    const routeColumns = [
        {
            title: 'Destination',
            dataIndex: 'to',
            key: 'to',
            width: '25%'
        },
        {
            title: 'Gateway',
            dataIndex: 'via',
            key: 'via',
            width: '20%',
            render: (text: string) => text || 'direct'
        },
        {
            title: 'Interface',
            dataIndex: 'interface',
            key: 'interface',
            width: '15%'
        },
        {
            title: 'Table',
            dataIndex: 'table',
            key: 'table',
            width: '10%',
            render: (text: number) => text === 0 || text === 254 ? 'main' : text
        },
        {
            title: 'Metric',
            dataIndex: 'metric',
            key: 'metric',
            width: '10%',
            render: (text: number) => text || '-'
        },
        {
            title: 'Scope',
            dataIndex: 'scope',
            key: 'scope',
            width: '20%',
            render: (text: string) => text || 'global'
        }
    ];

    const policyColumns = [
        {
            title: 'From',
            dataIndex: 'from',
            key: 'from',
            width: '25%',
            render: (text: string) => text || 'any'
        },
        {
            title: 'To',
            dataIndex: 'to',
            key: 'to',
            width: '25%',
            render: (text: string) => text || 'any'
        },
        {
            title: 'Table',
            dataIndex: 'table',
            key: 'table',
            width: '15%'
        },
        {
            title: 'Priority',
            dataIndex: 'priority',
            key: 'priority',
            width: '15%'
        },
        {
            title: 'Interface',
            dataIndex: 'iif',
            key: 'iif',
            width: '20%',
            render: (text: string) => text || 'any'
        }
    ];

    const showNetworkStateInfo = () => {
        NetworkSafetyHandler.showNetworkStateInfo(networkState);
    };

    if (error) {
        return (
            <Card
                title={
                    <Space>
                        <NetworkOutlined />
                        <span>Network State Monitor</span>
                    </Space>
                }
                extra={
                    <Button 
                        icon={<ReloadOutlined />} 
                        onClick={fetchNetworkState}
                        loading={loading}
                    >
                        Retry
                    </Button>
                }
            >
                <Alert
                    message="Failed to Load Network State"
                    description={error}
                    type="error"
                    showIcon
                    action={
                        <Button size="small" onClick={fetchNetworkState}>
                            Try Again
                        </Button>
                    }
                />
            </Card>
        );
    }

    return (
        <Card
            title={
                <Space>
                    <NetworkOutlined />
                    <span>Network State Monitor</span>
                    {lastUpdated && (
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Updated: {lastUpdated.toLocaleTimeString()}
                        </Text>
                    )}
                </Space>
            }
            extra={
                <Space>
                    <Button 
                        icon={<InfoCircleOutlined />} 
                        onClick={showNetworkStateInfo}
                        disabled={!networkState}
                        size="small"
                    >
                        Details
                    </Button>
                    <Button 
                        icon={<ReloadOutlined />} 
                        onClick={fetchNetworkState}
                        loading={loading}
                        size="small"
                    >
                        Refresh
                    </Button>
                </Space>
            }
        >
            {loading && !networkState ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <Spin size="large" />
                    <div style={{ marginTop: 16 }}>
                        <Text>Loading network state...</Text>
                    </div>
                </div>
            ) : networkState ? (
                <Tabs defaultActiveKey="interfaces" size="small">
                    <TabPane tab={`Interfaces (${networkState.interfaces?.length || 0})`} key="interfaces">
                        <Table
                            dataSource={networkState.interfaces || []}
                            columns={interfaceColumns}
                            rowKey="name"
                            size="small"
                            pagination={false}
                            scroll={{ x: 'max-content' }}
                        />
                    </TabPane>
                    
                    <TabPane tab={`Routes (${networkState.routes?.length || 0})`} key="routes">
                        <Table
                            dataSource={networkState.routes || []}
                            columns={routeColumns}
                            rowKey={(record, index) => `${record.to}-${record.via}-${index}`}
                            size="small"
                            pagination={{ pageSize: 10, showSizeChanger: true }}
                            scroll={{ x: 'max-content' }}
                        />
                    </TabPane>
                    
                    <TabPane tab={`Policies (${networkState.policies?.length || 0})`} key="policies">
                        <Table
                            dataSource={networkState.policies || []}
                            columns={policyColumns}
                            rowKey={(record, index) => `${record.from}-${record.table}-${index}`}
                            size="small"
                            pagination={false}
                            scroll={{ x: 'max-content' }}
                        />
                    </TabPane>
                    
                    {networkState.current_netplan_yaml && (
                        <TabPane tab="Current Configuration" key="config">
                            <div style={{ 
                                backgroundColor: '#f5f5f5', 
                                padding: 16, 
                                borderRadius: 6,
                                fontFamily: 'monospace',
                                fontSize: 12,
                                whiteSpace: 'pre-wrap',
                                overflowX: 'auto'
                            }}>
                                {networkState.current_netplan_yaml}
                            </div>
                        </TabPane>
                    )}
                </Tabs>
            ) : (
                <Alert
                    message="No Network State Available"
                    description="Unable to retrieve network state information. Please try refreshing."
                    type="warning"
                    showIcon
                />
            )}
            
            {autoRefresh && (
                <div style={{ 
                    marginTop: 16, 
                    padding: 8, 
                    backgroundColor: '#f6ffed', 
                    borderRadius: 4,
                    border: '1px solid #b7eb8f',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                }}>
                    <SafetyCertificateOutlined style={{ color: '#52c41a' }} />
                    <Text style={{ fontSize: 12, color: '#389e0d' }}>
                        Auto-refresh enabled (every {refreshInterval}s)
                    </Text>
                </div>
            )}
        </Card>
    );
};

export default NetworkStateMonitor;