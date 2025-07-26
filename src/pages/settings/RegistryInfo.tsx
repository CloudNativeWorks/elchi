import React, { useState } from 'react';
import { Card, Typography, Spin, Alert, Tag, Space, Collapse, Badge, Table, Input } from 'antd';
import { DatabaseOutlined, ClusterOutlined, ControlOutlined, NodeIndexOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons';
import { useCustomGetQuery } from '@/common/api';

const { Text } = Typography;

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

// Güvenli string karşılaştırma fonksiyonu
const safeStringCompare = (a: string | null | undefined, b: string | null | undefined): number => {
    const safeA = a || '';
    const safeB = b || '';
    return safeA.localeCompare(safeB);
};

// Güvenli number karşılaştırma fonksiyonu
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
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <Alert
                message="Error"
                description="An error occurred while fetching registry information."
                type="error"
                showIcon
            />
        );
    }

    if (!data?.data) {
        return (
            <Alert
                message="No Data"
                description="Registry bilgisi bulunamadı."
                type="warning"
                showIcon
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

    // Prepare collapse items for detailed view
    const controlPlaneItems = filteredControlPlanes?.map((cp, index) => {
        if (!cp) return null;
        
        const nodes = registryData?.data?.control_plane_data?.nodes_by_control_plane?.[cp.control_plane_id]?.nodes || [];

        const nodeColumns = [
            {
                title: 'Node ID',
                dataIndex: 'node_id',
                key: 'node_id',
                render: (text: string) => <Text code style={{ fontSize: '12px' }}>{text || 'N/A'}</Text>,
                sorter: (a: any, b: any) => safeStringCompare(a?.node_id, b?.node_id),
                defaultSortOrder: 'ascend' as const
            },
            {
                title: 'Version',
                dataIndex: 'version',
                key: 'version',
                render: (version: string) => <Tag color="blue">{version || 'N/A'}</Tag>,
                sorter: (a: any, b: any) => safeStringCompare(a?.version, b?.version)
            },
            {
                title: 'Last Seen',
                dataIndex: 'last_seen',
                key: 'last_seen',
                render: (lastSeen: any) => <Text style={{ fontSize: '12px' }}>{formatTimestamp(lastSeen?.seconds, lastSeen?.nanos)}</Text>,
                sorter: (a: any, b: any) => safeNumberCompare(a?.last_seen?.seconds, b?.last_seen?.seconds)
            }
        ];

        return {
            key: index.toString(),
            label: (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <Space>
                        <NodeIndexOutlined style={{ color: '#fa8c16' }} />
                        <Text strong>{cp.control_plane_id || 'N/A'}</Text>
                        <Tag color="blue">{cp.version || 'N/A'}</Tag>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            Last seen: {formatTimestamp(cp.last_seen?.seconds, cp.last_seen?.nanos)}
                        </Text>
                    </Space>
                    <Badge count={nodes.length} style={{ backgroundColor: '#52c41a' }} title={`${nodes.length} nodes`} />
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
                render: (text: string) => <Text code style={{ fontSize: '12px' }}>{text || 'N/A'}</Text>,
                sorter: (a: any, b: any) => safeStringCompare(a?.client_id, b?.client_id),
                defaultSortOrder: 'ascend' as const
            },
            {
                title: 'Version',
                dataIndex: 'version',
                key: 'version',
                render: (version: string) => <Tag color="blue">{version || 'N/A'}</Tag>,
                sorter: (a: any, b: any) => safeStringCompare(a?.version, b?.version)
            },
            {
                title: 'Last Seen',
                dataIndex: 'last_seen',
                key: 'last_seen',
                render: (lastSeen: any) => <Text style={{ fontSize: '12px' }}>{formatTimestamp(lastSeen?.seconds, lastSeen?.nanos)}</Text>,
                sorter: (a: any, b: any) => safeNumberCompare(a?.last_seen?.seconds, b?.last_seen?.seconds)
            }
        ];

        return {
            key: index.toString(),
            label: (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <Space>
                        <UserOutlined style={{ color: '#722ed1' }} />
                        <Text strong>{controller.controller_id || 'N/A'}</Text>
                        <Tag color="blue">{controller.version || 'N/A'}</Tag>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            Last seen: {formatTimestamp(controller.last_seen?.seconds, controller.last_seen?.nanos)}
                        </Text>
                    </Space>
                    <Badge count={clients.length} style={{ backgroundColor: '#1890ff' }} title={`${clients.length} clients`} />
                </div>
            ),
            children: (
                <>
                    <Text type="secondary"><b>HTTP Address:</b> {controller.http_address || 'N/A'}</Text>
                    <Table
                        columns={clientColumns}
                        dataSource={(controllerSearchTerm ? clients.filter(client =>
                            client?.client_id?.toLowerCase()?.includes(controllerSearchTerm.toLowerCase())
                        ) : clients).sort((a, b) => safeStringCompare(a?.client_id, b?.client_id))}
                        rowKey={(record) => record?.client_id || Math.random().toString()}
                        size="small"
                        pagination={false}
                        scroll={{ x: true }}
                        style={{ marginTop: 6 }}
                    />
                </>
            )
        };
    }).filter(Boolean);

    return (
        <div style={{ width: '100%' }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                {/* Registry Status - Compact */}
                <Card size="small">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                        <Space size="large">
                            <Space>
                                <DatabaseOutlined style={{ color: '#1890ff', fontSize: '16px' }} />
                                <Text strong>Registry Status:</Text>
                                <Tag color={registryData?.data?.status === 'connected' ? 'green' : 'red'}>
                                    {registryData?.data?.status || 'Unknown'}
                                </Tag>
                            </Space>
                            <Space>
                                <Text type="secondary">Address:</Text>
                                <Text code>{registryData?.data?.registry_address || 'N/A'}</Text>
                            </Space>
                        </Space>
                        <Space>
                            <Text type="secondary">Updated:</Text>
                            <Text style={{ fontSize: '12px' }}>
                                {registryData?.data?.timestamp ? 
                                    new Date(registryData.data.timestamp).toLocaleString('en-US') : 
                                    'N/A'
                                }
                            </Text>
                        </Space>
                    </div>
                    {registryData?.data?.message && (
                        <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#f6ffed', borderRadius: '4px' }}>
                            <Text style={{ fontSize: '12px', color: '#52c41a' }}>{registryData.data.message}</Text>
                        </div>
                    )}
                </Card>

                {/* Control Planes - Expandable Details */}
                <Card
                    title={
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            <Space>
                                <ClusterOutlined style={{ color: '#fa8c16' }} />
                                <span>Control Planes</span>
                                <Badge count={filteredControlPlanes?.length || 0} style={{ backgroundColor: '#fa8c16' }} />
                                {controlPlaneSearchTerm && <Text type="secondary" style={{ fontSize: '12px' }}>({registryData?.data?.control_plane_data?.control_planes?.length || 0} total)</Text>}
                            </Space>
                            <Input
                                placeholder="Search control planes and nodes..."
                                prefix={<SearchOutlined />}
                                value={controlPlaneSearchTerm}
                                onChange={(e) => setControlPlaneSearchTerm(e.target.value)}
                                style={{ width: 300 }}
                                allowClear
                            />
                        </div>
                    }
                    size="small"
                >
                    {controlPlaneItems.length > 0 ? (
                        <Collapse
                            items={controlPlaneItems}
                            size="small"
                            ghost
                        />
                    ) : (
                        <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                            <SearchOutlined style={{ fontSize: '24px', marginBottom: '8px' }} />
                            <div>No control planes found matching "{controlPlaneSearchTerm}"</div>
                        </div>
                    )}
                </Card>

                {/* Controllers - Expandable Details */}
                <Card
                    title={
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            <Space>
                                <ControlOutlined style={{ color: '#722ed1' }} />
                                <span>Controllers</span>
                                <Badge count={filteredControllers.length} style={{ backgroundColor: '#722ed1' }} />
                                {controllerSearchTerm && <Text type="secondary" style={{ fontSize: '12px' }}>({registryData?.data?.controller_data?.controllers?.length || 0} total)</Text>}
                            </Space>
                            <Input
                                placeholder="Search controllers and clients..."
                                prefix={<SearchOutlined />}
                                value={controllerSearchTerm}
                                onChange={(e) => setControllerSearchTerm(e.target.value)}
                                style={{ width: 300 }}
                                allowClear
                            />
                        </div>
                    }
                    size="small"
                >
                    {controllerItems.length > 0 ? (
                        <Collapse
                            items={controllerItems}
                            size="small"
                            ghost
                        />
                    ) : (
                        <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                            <SearchOutlined style={{ fontSize: '24px', marginBottom: '8px' }} />
                            <div>No controllers found matching "{controllerSearchTerm}"</div>
                        </div>
                    )}
                </Card>
            </Space>
        </div>
    );
};

export default RegistryInfo; 