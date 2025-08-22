import React, { useState, useMemo } from 'react';
import { Card, Typography, Spin, Alert, Tag, Space, Collapse, Badge, Table, Input, Row, Col, Statistic, Pagination, Progress, Tooltip, Empty, Divider } from 'antd';
import { DatabaseOutlined, ClusterOutlined, ControlOutlined, SearchOutlined, GlobalOutlined, NodeIndexOutlined, TeamOutlined, ApiOutlined } from '@ant-design/icons';
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
    const [controlPlanePage, setControlPlanePage] = useState(1);
    const [controllerPage, setControllerPage] = useState(1);
    const [expandedControlPlanes, setExpandedControlPlanes] = useState<string[]>([]);
    const [expandedControllers, setExpandedControllers] = useState<string[]>([]);
    const pageSize = 10;

    const { isLoading, error, data } = useCustomGetQuery({
        queryKey: 'registry_info',
        enabled: true,
        path: 'api/v3/registry/data',
        directApi: true,
        refetchOnWindowFocus: false
    });

    const registryData: RegistryData = data;

    // Filter functions - moved inside useMemo to avoid recreating on every render
    const filteredControlPlanes = useMemo(() => {
        if (!registryData?.data?.control_plane_data?.control_planes) return [];
        
        const controlPlanes = registryData.data.control_plane_data.control_planes;
        if (!controlPlaneSearchTerm) return controlPlanes.sort((a, b) => safeStringCompare(a?.control_plane_id, b?.control_plane_id));

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
        }).sort((a, b) => safeStringCompare(a?.control_plane_id, b?.control_plane_id));
    }, [registryData, controlPlaneSearchTerm]);
    
    const filteredControllers = useMemo(() => {
        if (!registryData?.data?.controller_data?.controllers) return [];
        
        const controllers = registryData.data.controller_data.controllers;
        if (!controllerSearchTerm) return controllers.sort((a, b) => safeStringCompare(a?.controller_id, b?.controller_id));

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
        }).sort((a, b) => safeStringCompare(a?.controller_id, b?.controller_id));
    }, [registryData, controllerSearchTerm]);

    // Paginated data
    const paginatedControlPlanes = useMemo(() => {
        const startIndex = (controlPlanePage - 1) * pageSize;
        return filteredControlPlanes.slice(startIndex, startIndex + pageSize);
    }, [filteredControlPlanes, controlPlanePage]);

    const paginatedControllers = useMemo(() => {
        const startIndex = (controllerPage - 1) * pageSize;
        return filteredControllers.slice(startIndex, startIndex + pageSize);
    }, [filteredControllers, controllerPage]);

    // Calculate statistics
    const totalNodes = useMemo(() => 
        Object.values(registryData?.data?.control_plane_data?.nodes_by_control_plane || {})
            .reduce((sum, cp) => sum + (cp?.nodes?.length || 0), 0),
        [registryData]
    );
    
    const totalClients = useMemo(() => 
        Object.values(registryData?.data?.controller_data?.clients_by_controller || {})
            .reduce((sum, controller) => sum + (controller?.clients?.length || 0), 0),
        [registryData]
    );

    // Calculate active/inactive counts
    const activeThreshold = Date.now() - (5 * 60 * 1000); // 5 minutes ago
    
    const activeControlPlanes = useMemo(() => 
        filteredControlPlanes.filter(cp => {
            const lastSeen = (cp?.last_seen?.seconds || 0) * 1000;
            return lastSeen > activeThreshold;
        }).length,
        [filteredControlPlanes, activeThreshold]
    );

    const activeControllers = useMemo(() => 
        filteredControllers.filter(controller => {
            const lastSeen = (controller?.last_seen?.seconds || 0) * 1000;
            return lastSeen > activeThreshold;
        }).length,
        [filteredControllers, activeThreshold]
    );

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

    // Get status color based on last seen time
    const getStatusColor = (lastSeen: any) => {
        const timestamp = (lastSeen?.seconds || 0) * 1000;
        const now = Date.now();
        const diff = now - timestamp;
        
        if (diff < 60000) return '#52c41a'; // Green - Active (< 1 min)
        if (diff < 300000) return '#faad14'; // Orange - Warning (< 5 min)
        return '#ff4d4f'; // Red - Inactive (> 5 min)
    };

    // Prepare collapse items for detailed view
    const controlPlaneItems = paginatedControlPlanes?.map((cp, index) => {
        if (!cp) return null;

        const nodes = registryData?.data?.control_plane_data?.nodes_by_control_plane?.[cp.control_plane_id]?.nodes || [];

        const nodeColumns = [
            {
                title: 'Node ID',
                dataIndex: 'node_id',
                key: 'node_id',
                render: (text: string, record: any) => (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ 
                            width: 6, 
                            height: 6, 
                            borderRadius: '50%', 
                            backgroundColor: getStatusColor(record?.last_seen),
                            flexShrink: 0
                        }} />
                        <Text code style={{
                            fontSize: '11px',
                            background: '#f0f2f5',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            color: '#1890ff'
                        }}>
                            {text || 'N/A'}
                        </Text>
                    </div>
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
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                <Text strong style={{ fontSize: '13px' }}>{cp.control_plane_id || 'N/A'}</Text>
                                <Tag color="blue" style={{ fontSize: '10px', margin: 0 }}>{cp.version || 'N/A'}</Tag>
                                <Tooltip title={formatTimestamp(cp.last_seen?.seconds, cp.last_seen?.nanos)}>
                                    <div style={{ 
                                        width: 8, 
                                        height: 8, 
                                        borderRadius: '50%', 
                                        backgroundColor: getStatusColor(cp.last_seen),
                                        display: 'inline-block'
                                    }} />
                                </Tooltip>
                            </div>
                            <Text type="secondary" style={{ fontSize: '11px' }}>
                                {formatTimestamp(cp.last_seen?.seconds, cp.last_seen?.nanos)}
                            </Text>
                        </div>
                    </Space>
                    <Badge
                        count={nodes.length}
                        style={{
                            backgroundColor: '#52c41a',
                            boxShadow: '0 2px 4px rgba(82, 196, 26, 0.3)',
                            fontSize: '11px',
                            height: '20px',
                            minWidth: '20px',
                            lineHeight: '20px'
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
                    pagination={{ pageSize: 50, size: 'small', hideOnSinglePage: true }}
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

    const controllerItems = paginatedControllers.map((controller, index) => {
        if (!controller) return null;

        const clients = registryData?.data?.controller_data?.clients_by_controller?.[controller.controller_id]?.clients || [];

        const clientColumns = [
            {
                title: 'Client ID',
                dataIndex: 'client_id',
                key: 'client_id',
                render: (text: string, record: any) => (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ 
                            width: 6, 
                            height: 6, 
                            borderRadius: '50%', 
                            backgroundColor: getStatusColor(record?.last_seen),
                            flexShrink: 0
                        }} />
                        <Text code style={{
                            fontSize: '11px',
                            background: '#f0f2f5',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            color: '#722ed1'
                        }}>
                            {text || 'N/A'}
                        </Text>
                    </div>
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
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                <Text strong style={{ fontSize: '13px' }}>{controller.controller_id || 'N/A'}</Text>
                                <Tooltip title={formatTimestamp(controller.last_seen?.seconds, controller.last_seen?.nanos)}>
                                    <div style={{ 
                                        width: 8, 
                                        height: 8, 
                                        borderRadius: '50%', 
                                        backgroundColor: getStatusColor(controller.last_seen),
                                        display: 'inline-block'
                                    }} />
                                </Tooltip>
                            </div>
                            <Text type="secondary" style={{ fontSize: '11px' }}>
                                {formatTimestamp(controller.last_seen?.seconds, controller.last_seen?.nanos)}
                            </Text>
                        </div>
                    </Space>
                    <Badge
                        count={clients.length}
                        style={{
                            backgroundColor: '#1890ff',
                            boxShadow: '0 2px 4px rgba(24, 144, 255, 0.3)',
                            fontSize: '11px',
                            height: '20px',
                            minWidth: '20px',
                            lineHeight: '20px'
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <Title level={3} style={{ margin: '0 0 8px 0', color: '#1f2937', display: 'flex', alignItems: 'center', gap: 12 }}>
                            <ApiOutlined style={{ color: '#1890ff' }} />
                            Registry Information
                        </Title>
                        <Text type="secondary">Monitor and manage system components, control planes, and controllers</Text>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#52c41a' }} />
                            <Text type="secondary" style={{ fontSize: 12 }}>Active</Text>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#faad14' }} />
                            <Text type="secondary" style={{ fontSize: 12 }}>Warning</Text>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ff4d4f' }} />
                            <Text type="secondary" style={{ fontSize: 12 }}>Inactive</Text>
                        </div>
                    </div>
                </div>
            </div>

            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Registry Status & Statistics */}
                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={10}>
                        <Card
                            style={{
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #056ccd 0%, #00c6fb 100%)',
                                border: 'none',
                                color: 'white',
                                height: 180
                            }}
                            styles={{ body: { padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' } }}
                        >
                            <div>
                                <Space align="center" style={{ marginBottom: 16 }}>
                                    <DatabaseOutlined style={{ fontSize: '24px', color: 'white' }} />
                                    <Text style={{ color: 'white', fontSize: '18px', fontWeight: '600' }}>
                                        Registry Status
                                    </Text>
                                </Space>
                                <div style={{ marginBottom: 12 }}>
                                    <Tag
                                        className='auto-width-tag'
                                        color={registryData?.data?.status === 'connected' ? 'success' : 'error'}
                                        style={{ fontSize: '11px', fontWeight: '600', marginBottom: 8 }}
                                    >
                                        {registryData?.data?.status === 'connected' ? 'CONNECTED' : 'DISCONNECTED'}
                                    </Tag>
                                    <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px', fontWeight: '500' }}>
                                        {registryData?.data?.registry_address || 'N/A'}
                                    </div>
                                </div>
                            </div>
                            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>
                                Last updated: {registryData?.data?.timestamp ?
                                    new Date(registryData.data.timestamp).toLocaleString('en-US') :
                                    'N/A'
                                }
                            </Text>
                        </Card>
                    </Col>
                    <Col xs={24} lg={14}>
                        <Card 
                            style={{ borderRadius: '12px', height: 180 }} 
                            styles={{ body: { padding: '24px', height: '100%' } }}
                        >
                            <Title level={5} style={{ marginBottom: 20, fontSize: 16, fontWeight: '600' }}>System Overview</Title>
                            <Row gutter={[16, 16]} style={{ height: 'calc(100% - 40px)' }}>
                                <Col span={6}>
                                    <div style={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <Statistic
                                            title="Control Planes"
                                            value={filteredControlPlanes?.length || 0}
                                            prefix={<ClusterOutlined style={{ color: '#056ccd', fontSize: 16 }} />}
                                            valueStyle={{ color: '#056ccd', fontSize: '20px', fontWeight: '600' }}
                                        />
                                        <Progress 
                                            percent={Math.round((activeControlPlanes / Math.max(filteredControlPlanes?.length || 1, 1)) * 100)}
                                            size="small"
                                            strokeColor="#52c41a"
                                            showInfo={false}
                                            style={{ marginTop: 6 }}
                                        />
                                        <Text type="secondary" style={{ fontSize: 11, marginTop: 2 }}>
                                            {activeControlPlanes} active
                                        </Text>
                                    </div>
                                </Col>
                                <Col span={6}>
                                    <div style={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <Statistic
                                            title="Controllers"
                                            value={filteredControllers.length}
                                            prefix={<ControlOutlined style={{ color: '#00c6fb', fontSize: 16 }} />}
                                            valueStyle={{ color: '#00c6fb', fontSize: '20px', fontWeight: '600' }}
                                        />
                                        <Progress 
                                            percent={Math.round((activeControllers / Math.max(filteredControllers.length || 1, 1)) * 100)}
                                            size="small"
                                            strokeColor="#52c41a"
                                            showInfo={false}
                                            style={{ marginTop: 6 }}
                                        />
                                        <Text type="secondary" style={{ fontSize: 11, marginTop: 2 }}>
                                            {activeControllers} active
                                        </Text>
                                    </div>
                                </Col>
                                <Col span={6}>
                                    <div style={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <Statistic
                                            title="Total Nodes"
                                            value={totalNodes}
                                            prefix={<NodeIndexOutlined style={{ color: '#722ed1', fontSize: 16 }} />}
                                            valueStyle={{ color: '#722ed1', fontSize: '20px', fontWeight: '600' }}
                                        />
                                    </div>
                                </Col>
                                <Col span={6}>
                                    <div style={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <Statistic
                                            title="Total Clients"
                                            value={totalClients}
                                            prefix={<TeamOutlined style={{ color: '#fa8c16', fontSize: 16 }} />}
                                            valueStyle={{ color: '#fa8c16', fontSize: '20px', fontWeight: '600' }}
                                        />
                                    </div>
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
                    style={{
                        background: '#fafafa',
                        border: '1px solid #e8f4ff',
                        borderRadius: 8,
                        margin: 0
                    }}
                    styles={{
                        body: { padding: '20px' }
                    }}
                >
                    {/* Control Planes Header */}
                    <div style={{ marginBottom: 24 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <ClusterOutlined style={{ color: '#1890ff' }} />
                                    <Text strong style={{ fontSize: 16 }}>Control Planes</Text>
                                </div>
                                <Badge 
                                    count={`${filteredControlPlanes.length}/${registryData?.data?.control_plane_data?.control_planes?.length || 0}`}
                                    style={{ 
                                        backgroundColor: filteredControlPlanes.length > 0 ? '#52c41a' : '#d9d9d9',
                                        color: filteredControlPlanes.length > 0 ? '#fff' : '#666',
                                        fontSize: '11px',
                                        height: '20px',
                                        minWidth: '20px',
                                        lineHeight: '20px'
                                    }} 
                                />
                            </div>
                            <Input
                                placeholder="Search control planes and nodes..."
                                prefix={<SearchOutlined style={{ color: '#ccc' }} />}
                                value={controlPlaneSearchTerm}
                                onChange={(e) => setControlPlaneSearchTerm(e.target.value)}
                                style={{
                                    width: 320,
                                    borderRadius: '8px',
                                    boxShadow: 'none',
                                    border: '1px solid #e1e5e9'
                                }}
                                allowClear
                            />
                        </div>
                        
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Monitor control plane instances and their connected nodes. Status indicators show real-time health.
                        </Text>
                    </div>

                    <Divider style={{ margin: '20px 0' }} />
                    {controlPlaneItems.length > 0 ? (
                        <>
                            <Collapse
                                items={controlPlaneItems}
                                size="small"
                                ghost
                                style={{ background: 'transparent' }}
                                activeKey={expandedControlPlanes}
                                onChange={(keys) => setExpandedControlPlanes(keys as string[])}
                            />
                            {filteredControlPlanes.length > pageSize && (
                                <div style={{ marginTop: 16, textAlign: 'center' }}>
                                    <Pagination
                                        current={controlPlanePage}
                                        total={filteredControlPlanes.length}
                                        pageSize={pageSize}
                                        onChange={setControlPlanePage}
                                        size="small"
                                        showSizeChanger={false}
                                        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} control planes`}
                                    />
                                </div>
                            )}
                        </>
                    ) : (
                        <Empty 
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={controlPlaneSearchTerm ? 
                                `No control planes found matching "${controlPlaneSearchTerm}"` : 
                                "No control planes available"
                            }
                        />
                    )}
                </Card>

                {/* Controllers */}
                <Card
                    style={{
                        background: '#fafafa',
                        border: '1px solid #e8f4ff',
                        borderRadius: 8,
                        margin: 0
                    }}
                    styles={{
                        body: { padding: '20px' }
                    }}
                >
                    {/* Controllers Header */}
                    <div style={{ marginBottom: 24 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <ControlOutlined style={{ color: '#1890ff' }} />
                                    <Text strong style={{ fontSize: 16 }}>Controllers</Text>
                                </div>
                                <Badge 
                                    count={`${filteredControllers.length}/${registryData?.data?.controller_data?.controllers?.length || 0}`}
                                    style={{ 
                                        backgroundColor: filteredControllers.length > 0 ? '#52c41a' : '#d9d9d9',
                                        color: filteredControllers.length > 0 ? '#fff' : '#666',
                                        fontSize: '11px',
                                        height: '20px',
                                        minWidth: '20px',
                                        lineHeight: '20px'
                                    }} 
                                />
                            </div>
                            <Input
                                placeholder="Search controllers and clients..."
                                prefix={<SearchOutlined style={{ color: '#ccc' }} />}
                                value={controllerSearchTerm}
                                onChange={(e) => setControllerSearchTerm(e.target.value)}
                                style={{
                                    width: 320,
                                    borderRadius: '8px',
                                    boxShadow: 'none',
                                    border: '1px solid #e1e5e9'
                                }}
                                allowClear
                            />
                        </div>
                        
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Manage controller instances and their client connections. Track HTTP addresses and connection status.
                        </Text>
                    </div>

                    <Divider style={{ margin: '20px 0' }} />
                    {controllerItems.length > 0 ? (
                        <>
                            <Collapse
                                items={controllerItems}
                                size="small"
                                ghost
                                style={{ background: 'transparent' }}
                                activeKey={expandedControllers}
                                onChange={(keys) => setExpandedControllers(keys as string[])}
                            />
                            {filteredControllers.length > pageSize && (
                                <div style={{ marginTop: 16, textAlign: 'center' }}>
                                    <Pagination
                                        current={controllerPage}
                                        total={filteredControllers.length}
                                        pageSize={pageSize}
                                        onChange={setControllerPage}
                                        size="small"
                                        showSizeChanger={false}
                                        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} controllers`}
                                    />
                                </div>
                            )}
                        </>
                    ) : (
                        <Empty 
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={controllerSearchTerm ? 
                                `No controllers found matching "${controllerSearchTerm}"` : 
                                "No controllers available"
                            }
                        />
                    )}
                </Card>
            </Space>
        </div>
    );
};

export default RegistryInfo; 