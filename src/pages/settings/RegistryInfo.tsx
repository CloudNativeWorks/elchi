import React, { useState } from 'react';
import { Card, Typography, Spin, Alert, Tag, Space, Collapse, Badge, Table, Input, Row, Col, Statistic } from 'antd';
import { DatabaseOutlined, ClusterOutlined, ControlOutlined, SearchOutlined, GlobalOutlined, CloudServerOutlined } from '@ant-design/icons';
import { useCustomGetQuery } from '@/common/api';

const { Text, Title } = Typography;

interface RegistryData {
    data: {
        client_info: {
            controller_id: string;
            http_address: string;
            version: string;
        };
        control_plane_data: {
            control_planes: Array<{
                control_plane_id: string;
                version: string;
                last_seen: {
                    seconds: number;
                    nanos: number;
                };
            }>;
            nodes_by_control_plane: {
                [key: string]: {
                    nodes: Array<{
                        node_id: string;
                        version: string;
                        last_seen: {
                            seconds: number;
                            nanos: number;
                        };
                    }>;
                };
            };
        };
        controller_data: {
            clients_by_controller: {
                [key: string]: {
                    clients: Array<{
                        client_id: string;
                        version: string;
                        last_seen: {
                            seconds: number;
                            nanos: number;
                        };
                    }>;
                };
            };
            controllers: Array<{
                controller_id: string;
                version: string;
                http_address: string;
                last_seen: {
                    seconds: number;
                    nanos: number;
                };
            }>;
        };
        message: string;
        registry_address: string;
        status: string;
        timestamp: string;
    };
    message: string;
}

const formatTimestamp = (seconds: number, nanos: number) => {
    if (seconds == null || nanos == null || isNaN(seconds) || isNaN(nanos)) {
        return 'N/A';
    }
    try {
        const date = new Date(seconds * 1000 + nanos / 1000000);
        return date.toLocaleString('en-US');
    } catch (error) {
        return 'Invalid Date';
    }
};

// Safe string comparison function
const safeStringCompare = (a: string | null | undefined, b: string | null | undefined): number => {
    const safeA = a || '';
    const safeB = b || '';
    return safeA.localeCompare(safeB);
};

// Safe number comparison function
const safeNumberCompare = (a: number | null | undefined, b: number | null | undefined): number => {
    const safeA = a || 0;
    const safeB = b || 0;
    return safeA - safeB;
};

const RegistryInfo: React.FC = () => {
    const [controlPlaneSearchTerm, setControlPlaneSearchTerm] = useState('');
    const [controllerSearchTerm, setControllerSearchTerm] = useState('');

    const { isLoading, error, data } = useCustomGetQuery({
        queryKey: 'registry_info',
        enabled: true,
        path: 'api/v3/registry/data',
        directApi: true,
        refetchOnWindowFocus: false
    });

    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '400px',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                borderRadius: '12px'
            }}>
                <Space direction="vertical" align="center">
                    <Spin size="large" />
                    <Text type="secondary">Loading registry information...</Text>
                </Space>
            </div>
        );
    }

    if (error) {
        return (
            <Alert
                message="Connection Error"
                description="An error occurred while fetching registry information."
                type="error"
                showIcon
                style={{ borderRadius: '12px' }}
            />
        );
    }

    if (!data?.data) {
        return (
            <Alert
                message="No Data Found"
                description="Registry information not found."
                type="warning"
                showIcon
                style={{ borderRadius: '12px' }}
            />
        );
    }

    const registryData: RegistryData = data;

    // Filter function
    const filterControlPlanes = () => {
        const controlPlanes = registryData?.data?.control_plane_data?.control_planes || [];
        if (!controlPlaneSearchTerm) return controlPlanes;

        return controlPlanes.filter(cp => {
            if (!cp) return false;

            // Check control plane ID
            if (cp.control_plane_id?.toLowerCase()?.includes(controlPlaneSearchTerm.toLowerCase())) {
                return true;
            }

            // Check node IDs
            const nodes = registryData?.data?.control_plane_data?.nodes_by_control_plane?.[cp.control_plane_id]?.nodes || [];
            return nodes.some(node =>
                node?.node_id?.toLowerCase()?.includes(controlPlaneSearchTerm.toLowerCase())
            );
        });
    };

    const filterControllers = () => {
        const controllers = registryData?.data?.controller_data?.controllers || [];
        if (!controllerSearchTerm) return controllers;

        return controllers.filter(controller => {
            if (!controller) return false;

            // Check controller ID
            if (controller.controller_id?.toLowerCase()?.includes(controllerSearchTerm.toLowerCase())) {
                return true;
            }

            // Check client IDs
            const clients = registryData?.data?.controller_data?.clients_by_controller?.[controller.controller_id]?.clients || [];
            return clients.some(client =>
                client?.client_id?.toLowerCase()?.includes(controllerSearchTerm.toLowerCase())
            );
        });
    };

    const filteredControlPlanes = filterControlPlanes().sort((a, b) => safeStringCompare(a?.control_plane_id, b?.control_plane_id));
    const filteredControllers = filterControllers().sort((a, b) => safeStringCompare(a?.controller_id, b?.controller_id));

    // Calculate total counts
    const totalNodes = Object.values(registryData?.data?.control_plane_data?.nodes_by_control_plane || {})
        .reduce((sum, cp) => sum + (cp?.nodes?.length || 0), 0);
    const totalClients = Object.values(registryData?.data?.controller_data?.clients_by_controller || {})
        .reduce((sum, controller) => sum + (controller?.clients?.length || 0), 0);

    // Prepare collapse items for detailed view
    const controlPlaneItems = filteredControlPlanes?.map((cp, index) => {
        if (!cp) return null;

        const nodes = registryData?.data?.control_plane_data?.nodes_by_control_plane?.[cp.control_plane_id]?.nodes || [];

        const nodeColumns = [
            {
                title: 'Node ID',
                dataIndex: 'node_id',
                key: 'node_id',
                render: (text: string) => (
                    <Text code style={{
                        fontSize: '11px',
                        background: '#f0f2f5',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        color: '#1890ff'
                    }}>
                        {text || 'N/A'}
                    </Text>
                ),
                sorter: (a: any, b: any) => safeStringCompare(a?.node_id, b?.node_id),
                defaultSortOrder: 'ascend' as const
            },
            {
                title: 'Version',
                dataIndex: 'version',
                key: 'version',
                render: (version: string) => <Tag color="processing" style={{ fontSize: '11px' }}>{version || 'N/A'}</Tag>,
                sorter: (a: any, b: any) => safeStringCompare(a?.version, b?.version)
            },
            {
                title: 'Last Seen',
                dataIndex: 'last_seen',
                key: 'last_seen',
                render: (lastSeen: any) => (
                    <Text style={{ fontSize: '11px', color: '#666' }}>
                        {formatTimestamp(lastSeen?.seconds, lastSeen?.nanos)}
                    </Text>
                ),
                sorter: (a: any, b: any) => safeNumberCompare(a?.last_seen?.seconds, b?.last_seen?.seconds)
            }
        ];

        return {
            key: index.toString(),
            label: (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '4px 0'
                }}>
                    <Space size="small">
                        <div>
                            <Text strong style={{ fontSize: '13px' }}>{cp.control_plane_id || 'N/A'}</Text>
                            <br />
                            <Space size="small">
                                <Tag color="blue" style={{ fontSize: '10px', margin: 0 }}>{cp.version || 'N/A'}</Tag>
                                <Text type="secondary" style={{ fontSize: '10px' }}>
                                    {formatTimestamp(cp.last_seen?.seconds, cp.last_seen?.nanos)}
                                </Text>
                            </Space>
                        </div>
                    </Space>
                    <Badge
                        count={nodes.length}
                        style={{
                            backgroundColor: '#52c41a',
                            boxShadow: '0 2px 4px rgba(82, 196, 26, 0.3)'
                        }}
                        title={`${nodes.length} nodes`}
                    />
                </div>
            ),
            children: (
                <Table
                    columns={nodeColumns}
                    dataSource={(controlPlaneSearchTerm ? nodes.filter(node =>
                        node?.node_id?.toLowerCase()?.includes(controlPlaneSearchTerm.toLowerCase())
                    ) : nodes).sort((a, b) => safeStringCompare(a?.node_id, b?.node_id))}
                    rowKey={(record) => record?.node_id || Math.random().toString()}
                    size="small"
                    pagination={false}
                    scroll={{ x: true }}
                    style={{
                        marginTop: '8px',
                        backgroundColor: '#fafafa',
                        borderRadius: '6px',
                        overflow: 'hidden'
                    }}
                />
            )
        };
    }).filter(Boolean);

    const controllerItems = filteredControllers.map((controller, index) => {
        if (!controller) return null;

        const clients = registryData?.data?.controller_data?.clients_by_controller?.[controller.controller_id]?.clients || [];

        const clientColumns = [
            {
                title: 'Client ID',
                dataIndex: 'client_id',
                key: 'client_id',
                render: (text: string) => (
                    <Text code style={{
                        fontSize: '11px',
                        background: '#f0f2f5',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        color: '#722ed1'
                    }}>
                        {text || 'N/A'}
                    </Text>
                ),
                sorter: (a: any, b: any) => safeStringCompare(a?.client_id, b?.client_id),
                defaultSortOrder: 'ascend' as const
            },
            {
                title: 'Last Seen',
                dataIndex: 'last_seen',
                key: 'last_seen',
                render: (lastSeen: any) => (
                    <Text style={{ fontSize: '11px', color: '#666' }}>
                        {formatTimestamp(lastSeen?.seconds, lastSeen?.nanos)}
                    </Text>
                ),
                sorter: (a: any, b: any) => safeNumberCompare(a?.last_seen?.seconds, b?.last_seen?.seconds)
            }
        ];

        return {
            key: index.toString(),
            label: (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '4px 0'
                }}>
                    <Space size="small">
                        <div>
                            <Text strong style={{ fontSize: '13px' }}>{controller.controller_id || 'N/A'}</Text>
                            <br />
                            <Space size="small">
                                <Text type="secondary" style={{ fontSize: '10px' }}>
                                    {formatTimestamp(controller.last_seen?.seconds, controller.last_seen?.nanos)}
                                </Text>
                            </Space>
                        </div>
                    </Space>
                    <Badge
                        count={clients.length}
                        style={{
                            backgroundColor: '#1890ff',
                            boxShadow: '0 2px 4px rgba(24, 144, 255, 0.3)'
                        }}
                        title={`${clients.length} clients`}
                    />
                </div>
            ),
            children: (
                <div style={{ marginTop: '8px' }}>
                    <div style={{
                        padding: '8px 12px',
                        background: 'linear-gradient(90deg, #f0f9ff 0%, #e0f2fe 100%)',
                        borderRadius: '6px',
                        marginBottom: '8px',
                        border: '1px solid #e6f7ff'
                    }}>
                        <Space>
                            <GlobalOutlined style={{ color: '#1890ff' }} />
                            <Text strong style={{ fontSize: '12px' }}>HTTP Address:</Text>
                            <Text code style={{ fontSize: '11px' }}>{controller.http_address || 'N/A'}</Text>
                        </Space>
                    </div>
                    <Table
                        columns={clientColumns}
                        dataSource={(controllerSearchTerm ? clients.filter(client =>
                            client?.client_id?.toLowerCase()?.includes(controllerSearchTerm.toLowerCase())
                        ) : clients).sort((a, b) => safeStringCompare(a?.client_id, b?.client_id))}
                        rowKey={(record) => record?.client_id || Math.random().toString()}
                        size="small"
                        pagination={false}
                        scroll={{ x: true }}
                        style={{
                            backgroundColor: '#fafafa',
                            borderRadius: '6px',
                            overflow: 'hidden'
                        }}
                    />
                </div>
            )
        };
    }).filter(Boolean);

    return (
        <div style={{ width: '100%', padding: '12px' }}>
            <div style={{ marginBottom: '24px' }}>
                <Title level={3} style={{ margin: '0 0 8px 0', color: '#1f2937' }}>
                    Registry Information
                </Title>
                <Text type="secondary">System components status and statistics</Text>
            </div>

            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Registry Status & Statistics */}
                <Row gutter={[16, 16]}>
                    <Col xs={24} lg={12}>
                        <Card
                            style={{
                                borderRadius: '12px',
                                background: 'linear-gradient(90deg, #056ccd 0%, #00c6fb 100%)',
                                border: 'none',
                                color: 'white'
                            }}
                            styles={{ body: { padding: '20px' } }}
                        >
                            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                <Space>
                                    <DatabaseOutlined style={{ fontSize: '20px', color: 'white' }} />
                                    <Text style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>
                                        Registry Status
                                    </Text>
                                </Space>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <Tag
                                        color={registryData?.data?.status === 'connected' ? 'success' : 'error'}
                                        style={{ fontSize: '12px', fontWeight: 'bold' }}
                                    >
                                        {registryData?.data?.status === 'connected' ? 'CONNECTED' : 'DISCONNECTED'}
                                    </Tag>
                                    <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '12px' }}>
                                        {registryData?.data?.registry_address || 'N/A'}
                                    </Text>
                                </div>
                                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px' }}>
                                    Last updated: {registryData?.data?.timestamp ?
                                        new Date(registryData.data.timestamp).toLocaleString('en-US') :
                                        'N/A'
                                    }
                                </Text>
                            </Space>
                        </Card>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Card style={{ borderRadius: '12px', height: '100%' }} styles={{ body: { padding: '20px' } }}>
                            <Row gutter={16} style={{ height: '100%', marginTop: '15px' }}>
                                <Col span={8} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                    <Statistic
                                        title="Control Planes"
                                        value={filteredControlPlanes?.length || 0}
                                        prefix={<ClusterOutlined style={{ color: '#056ccd' }} />}
                                        valueStyle={{ color: '#056ccd', fontSize: '20px' }}
                                    />
                                </Col>
                                <Col span={8} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                    <Statistic
                                        title="Controllers"
                                        value={filteredControllers.length}
                                        prefix={<ControlOutlined style={{ color: '#00c6fb' }} />}
                                        valueStyle={{ color: '#00c6fb', fontSize: '20px' }}
                                    />
                                </Col>
                                <Col span={8} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                    <Statistic
                                        title="Total Nodes/Clients"
                                        value={totalNodes + totalClients}
                                        prefix={<CloudServerOutlined style={{ color: '#52c41a' }} />}
                                        valueStyle={{ color: '#52c41a', fontSize: '20px' }}
                                    />
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>

                {registryData?.data?.message && (
                    <Alert
                        message={registryData.data.message}
                        type="success"
                        showIcon
                        style={{ borderRadius: '8px' }}
                    />
                )}

                {/* Control Planes */}
                <Card
                    title={
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            <Space>
                                <div style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '6px',
                                    background: 'linear-gradient(90deg, #056ccd 0%, #00c6fb 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <ClusterOutlined style={{ color: 'white', fontSize: '12px' }} />
                                </div>
                                <span style={{ fontSize: '16px', fontWeight: '600' }}>Control Planes</span>
                                {controlPlaneSearchTerm && (
                                    <Text type="secondary" style={{ fontSize: '12px' }}>
                                        ({registryData?.data?.control_plane_data?.control_planes?.length || 0} total)
                                    </Text>
                                )}
                            </Space>
                            <Input
                                placeholder="Search control planes and nodes..."
                                prefix={<SearchOutlined style={{ color: '#ccc' }} />}
                                value={controlPlaneSearchTerm}
                                onChange={(e) => setControlPlaneSearchTerm(e.target.value)}
                                style={{
                                    width: 280,
                                    borderRadius: '8px',
                                    boxShadow: 'none',
                                    border: '1px solid #e1e5e9'
                                }}
                                allowClear
                            />
                        </div>
                    }
                    style={{ borderRadius: '12px' }}
                    styles={{ body: { padding: '16px' } }}
                >
                    {controlPlaneItems.length > 0 ? (
                        <Collapse
                            items={controlPlaneItems}
                            size="small"
                            ghost
                            style={{ background: 'transparent' }}
                        />
                    ) : (
                        <div style={{
                            textAlign: 'center',
                            padding: '40px 20px',
                            color: '#999',
                            background: '#fafafa',
                            borderRadius: '8px'
                        }}>
                            <SearchOutlined style={{ fontSize: '32px', marginBottom: '12px', color: '#d9d9d9' }} />
                            <div>No control planes found matching "{controlPlaneSearchTerm}"</div>
                        </div>
                    )}
                </Card>

                {/* Controllers */}
                <Card
                    title={
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            <Space>
                                <div style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '6px',
                                    background: 'linear-gradient(90deg, #056ccd 0%, #00c6fb 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <ControlOutlined style={{ color: 'white', fontSize: '12px' }} />
                                </div>
                                <span style={{ fontSize: '16px', fontWeight: '600' }}>Controllers</span>
                                {controllerSearchTerm && (
                                    <Text type="secondary" style={{ fontSize: '12px' }}>
                                        ({registryData?.data?.controller_data?.controllers?.length || 0} total)
                                    </Text>
                                )}
                            </Space>
                            <Input
                                placeholder="Search controllers and clients..."
                                prefix={<SearchOutlined style={{ color: '#ccc' }} />}
                                value={controllerSearchTerm}
                                onChange={(e) => setControllerSearchTerm(e.target.value)}
                                style={{
                                    width: 280,
                                    borderRadius: '8px',
                                    boxShadow: 'none',
                                    border: '1px solid #e1e5e9'
                                }}
                                allowClear
                            />
                        </div>
                    }
                    style={{ borderRadius: '12px' }}
                    styles={{ body: { padding: '16px' } }}
                >
                    {controllerItems.length > 0 ? (
                        <Collapse
                            items={controllerItems}
                            size="small"
                            ghost
                            style={{ background: 'transparent' }}
                        />
                    ) : (
                        <div style={{
                            textAlign: 'center',
                            padding: '40px 20px',
                            color: '#999',
                            background: '#fafafa',
                            borderRadius: '8px'
                        }}>
                            <SearchOutlined style={{ fontSize: '32px', marginBottom: '12px', color: '#d9d9d9' }} />
                            <div>No controllers found matching "{controllerSearchTerm}"</div>
                        </div>
                    )}
                </Card>
            </Space>
        </div>
    );
};

export default RegistryInfo; 