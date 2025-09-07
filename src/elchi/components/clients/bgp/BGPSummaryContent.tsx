import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Typography, Space, Button, Popconfirm, Tooltip } from 'antd';
import { ReloadOutlined, UserOutlined, GlobalOutlined, DatabaseOutlined, TeamOutlined, SwapOutlined, BorderlessTableOutlined, ClearOutlined, ReloadOutlined as SoftReloadOutlined } from '@ant-design/icons';
import { useBGPOperations } from '@/hooks/useBGPOperations';
import { showSuccessNotification } from '@/common/notificationHandler';

const { Text, Title } = Typography;

interface BGPSummaryContentProps {
    clientId: string;
}

const BGPSummaryContent: React.FC<BGPSummaryContentProps> = ({ clientId }) => {
    const [summaryData, setSummaryData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [clearingNeighbor, setClearingNeighbor] = useState<string | null>(null);
    const { getBGPSummary, clearBGPRoutes } = useBGPOperations();

    const loadBGPSummary = async () => {
        setLoading(true);
        try {
            const result = await getBGPSummary(clientId);
            if (result.success && result.data) {
                const summary = result.data[0]?.Result?.Frr?.bgp?.summary;
                setSummaryData(summary);
            }
        } catch (error) {
            console.error('Failed to load BGP summary:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBGPSummary();
    }, [clientId]);

    const formatUptime = (uptime: string) => {
        return uptime || 'N/A';
    };

    const getStateColor = (state: string): 'success' | 'processing' | 'warning' | 'default' | 'error' => {
        switch (state?.toLowerCase()) {
            case 'established': return 'success';
            case 'active': return 'processing';
            case 'idle': return 'warning';
            case 'connect': return 'warning';
            default: return 'default';
        }
    };

    const handleClearRoutes = async (neighborIp: string, soft: boolean) => {
        setClearingNeighbor(neighborIp);
        try {
            const result = await clearBGPRoutes(clientId, neighborIp, soft);
            if (result.success) {
                showSuccessNotification(`BGP routes ${soft ? 'soft' : 'hard'} cleared for ${neighborIp}`);
                // Refresh summary after clear
                setTimeout(() => {
                    loadBGPSummary();
                }, 1000);
            }
        } catch (error) {
            console.error('Failed to clear BGP routes:', error);
        } finally {
            setClearingNeighbor(null);
        }
    };

    const peerColumns = [
        {
            title: 'Neighbor',
            dataIndex: 'peer_ip',
            key: 'peer_ip',
            width: 140,
            render: (text: string) => (
                <Space direction="vertical" size={2}>
                    <Space size={4}>
                    <Text style={{ fontSize: '13px' }}>{text}</Text>
                    
                        <Popconfirm
                            title="Hard Clear BGP Routes"
                            description={`This will hard reset BGP session with ${text}. Are you sure?`}
                            onConfirm={() => handleClearRoutes(text, false)}
                            okText="Hard Clear"
                            cancelText="Cancel"
                            okButtonProps={{ danger: true }}
                        >
                            <Tooltip title="Hard Clear - Reset BGP session">
                                <Button
                                    size="small"
                                    danger
                                    type="text"
                                    icon={<ClearOutlined />}
                                    loading={clearingNeighbor === text}
                                    style={{ fontSize: '10px', padding: '2px 4px', height: '20px' }}
                                />
                            </Tooltip>
                        </Popconfirm>
                        <Popconfirm
                            title="Soft Clear BGP Routes"
                            description={`This will soft refresh BGP routes with ${text}. Continue?`}
                            onConfirm={() => handleClearRoutes(text, true)}
                            okText="Soft Clear"
                            cancelText="Cancel"
                        >
                            <Tooltip title="Soft Clear - Refresh routes">
                                <Button
                                    size="small"
                                    type="text"
                                    icon={<SoftReloadOutlined />}
                                    loading={clearingNeighbor === text}
                                    style={{ fontSize: '10px', padding: '2px 4px', height: '20px', color: '#1890ff' }}
                                />
                            </Tooltip>
                        </Popconfirm>
                    </Space>
                </Space>
            )
        },
        {
            title: 'V',
            dataIndex: 'version',
            key: 'version',
            width: 50,
            align: 'right' as const
        },
        {
            title: 'AS',
            dataIndex: 'remoteAs',
            key: 'remoteAs',
            width: 80,
            align: 'right' as const
        },
        {
            title: 'MsgRcvd',
            dataIndex: 'msgRcvd',
            key: 'msgRcvd',
            width: 90,
            align: 'right' as const
        },
        {
            title: 'MsgSent',
            dataIndex: 'msgSent',
            key: 'msgSent',
            width: 90,
            align: 'right' as const
        },
        {
            title: 'State',
            key: 'state',
            width: 100,
            align: 'right' as const,
            render: (record: any) => (
                <Tag className='auto-width-tag' style={{ marginRight: -2 }} color={getStateColor(record.state)}>
                    {record.state}
                </Tag>
            )
        },
        {
            title: 'InQ',
            key: 'inq',
            width: 60,
            align: 'right' as const,
            render: () => '0'
        },
        {
            title: 'OutQ',
            key: 'outq',
            width: 60,
            align: 'right' as const,
            render: () => '0'
        },
        {
            title: 'Up/Down',
            dataIndex: 'peerUptime',
            key: 'peerUptime',
            width: 100,
            align: 'right' as const,
            render: (uptime: string) => formatUptime(uptime)
        },
        {
            title: 'PfxSnt',
            dataIndex: 'pfxSnt',
            key: 'pfxSnt',
            width: 60,
            align: 'right' as const
        },
        {
            title: 'PfxRcd',
            dataIndex: 'pfxRcd',
            key: 'pfxRcd',
            width: 60,
            align: 'right' as const
        }
    ];

    if (!summaryData) {
        return (
            <div style={{
                background: 'linear-gradient(135deg, #f1f3f4 0%, #e8eaed 100%)',
                borderRadius: 12,
                padding: 16,
                marginBottom: 16
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 12
                }}>
                    <Text strong style={{ color: '#212529', fontSize: 14 }}>
                        BGP Summary
                    </Text>
                </div>
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <Text type="secondary">No BGP summary data available</Text>
                </div>
            </div>
        );
    }

    const peers = summaryData.peers ? Object.entries(summaryData.peers).map(([ip, data]: [string, any]) => ({
        peer_ip: ip,
        ...data
    })) : [];

    return (
        <div style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 16 }}>
            <div style={{
                background: 'linear-gradient(135deg, #f1f3f4 0%, #e8eaed 100%)',
                borderRadius: '12px 12px 0 0',
                padding: 16,
                borderBottom: '1px solid #e8eaed'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <GlobalOutlined style={{ color: '#495057' }} />
                        <Text strong style={{ color: '#212529', fontSize: 14 }}>
                            BGP Summary
                        </Text>
                    </div>
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={loadBGPSummary}
                        loading={loading}
                        size="small"
                        style={{ borderRadius: 6 }}
                    >
                        Refresh
                    </Button>
                </div>
            </div>
            <div style={{ 
                background: '#fff',
                borderRadius: '0 0 12px 12px',
                padding: 16
            }}>
                {/* Global Statistics */}
                <Row gutter={16} style={{ marginBottom: 16 }}>
                    <Col xs={24} sm={12} md={4}>
                        <Card size="small" style={{ textAlign: 'center', borderRadius: 8 }}>
                            <Statistic
                                title="Router ID"
                                value={summaryData.routerId}
                                prefix={<UserOutlined style={{ color: '#1890ff' }} />}
                                valueStyle={{ fontSize: '16px', fontWeight: 'bold' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={4}>
                        <Card size="small" style={{ textAlign: 'center', borderRadius: 8 }}>
                            <Statistic
                                title="AS Number"
                                value={summaryData.asNumber}
                                prefix={<GlobalOutlined style={{ color: '#52c41a' }} />}
                                valueStyle={{ fontSize: '16px', fontWeight: 'bold' }}
                                formatter={(value) => value?.toString()}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={4}>
                        <Card size="small" style={{ textAlign: 'center', borderRadius: 8 }}>
                            <Statistic
                                title="RIB Entries"
                                value={summaryData.ribCount}
                                suffix={`(${(summaryData.ribMemory / 1024).toFixed(1)}KB)`}
                                prefix={<DatabaseOutlined style={{ color: '#fa8c16' }} />}
                                valueStyle={{ fontSize: '16px', fontWeight: 'bold' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={4}>
                        <Card size="small" style={{ textAlign: 'center', borderRadius: 8 }}>
                            <Statistic
                                title="Peers"
                                value={summaryData.peerCount}
                                suffix={`(${(summaryData.peerMemory / 1024).toFixed(1)}KB)`}
                                prefix={<TeamOutlined style={{ color: '#722ed1' }} />}
                                valueStyle={{ fontSize: '16px', fontWeight: 'bold' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={4}>
                        <Card size="small" style={{ textAlign: 'center', borderRadius: 8 }}>
                            <Statistic
                                title="Table Version"
                                value={summaryData.tableVersion}
                                prefix={<SwapOutlined style={{ color: '#c50ad1' }} />}
                                valueStyle={{ fontSize: '16px', fontWeight: 'bold' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={4}>
                        <Card size="small" style={{ textAlign: 'center', borderRadius: 8 }}>
                            <Statistic
                                title="VRF Name"
                                value={summaryData.vrfName}
                                prefix={<BorderlessTableOutlined style={{ color: '#05abb0' }} />}
                                valueStyle={{ fontSize: '16px', fontWeight: 'bold' }}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Peers Table */}
                {peers.length > 0 && (
                    <>
                        <Title level={5} style={{ marginBottom: 8, marginTop: 0 }}>
                            <TeamOutlined style={{ marginRight: 8 }} />
                            BGP Neighbors ({summaryData.displayedPeers}/{summaryData.totalPeers})
                        </Title>
                        <Table
                            dataSource={peers}
                            columns={peerColumns}
                            rowKey="peer_ip"
                            pagination={false}
                            size="small"
                            scroll={{ x: 800 }}
                            style={{
                                background: '#fafafa',
                                borderRadius: 8,
                                border: '1px solid #f0f0f0'
                            }}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default BGPSummaryContent; 