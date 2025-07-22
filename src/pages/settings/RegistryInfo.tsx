import React from 'react';
import { Card, Typography, Spin, Alert, Descriptions, Tag, Space, Divider } from 'antd';
import { DatabaseOutlined, ClusterOutlined, NodeIndexOutlined, ControlOutlined } from '@ant-design/icons';
import { useCustomGetQuery } from '@/common/api';

const { Text } = Typography;

interface RegistryData {
    data: {
        client_info: {
            controller_id: string;
            grpc_address: string;
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
                grpc_address: string;
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
    const date = new Date(seconds * 1000 + nanos / 1000000);
    return date.toLocaleString('tr-TR');
};

const RegistryInfo: React.FC = () => {
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

    const registryData: RegistryData = data;

    return (
        <div style={{ width: '100%' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Registry Status */}
                <Card 
                    title={
                        <Space>
                            <DatabaseOutlined style={{ color: '#1890ff' }} />
                            <span>Registry Status</span>
                        </Space>
                    }
                    size="small"
                >
                    <Descriptions column={2} size="small">
                        <Descriptions.Item label="Status">
                            <Tag color={registryData.data.status === 'connected' ? 'green' : 'red'}>
                                {registryData.data.status}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Registry Address">
                            {registryData.data.registry_address}
                        </Descriptions.Item>
                        <Descriptions.Item label="Message">
                            {registryData.data.message}
                        </Descriptions.Item>
                        <Descriptions.Item label="Timestamp">
                            {new Date(registryData.data.timestamp).toLocaleString('en-US')}
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                {/* Control Planes */}
                <Card 
                    title={
                        <Space>
                            <ClusterOutlined style={{ color: '#fa8c16' }} />
                            <span>Control Plane Information</span>
                        </Space>
                    }
                    size="small"
                >
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        {registryData.data.control_plane_data.control_planes.map((cp, index) => (
                            <Card key={index} type="inner" size="small">
                                <Descriptions column={2} size="small">
                                    <Descriptions.Item label="Control Plane ID">
                                        {cp.control_plane_id}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Version">
                                        <Tag color="blue">{cp.version}</Tag>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Last Seen">
                                        {formatTimestamp(cp.last_seen.seconds, cp.last_seen.nanos)}
                                    </Descriptions.Item>
                                </Descriptions>
                                
                                {/* Nodes for this control plane */}
                                {registryData.data.control_plane_data.nodes_by_control_plane[cp.control_plane_id] && (
                                    <>
                                        <Divider style={{ margin: '12px 0' }} />
                                        <Text strong>Nodes:</Text>
                                        <div style={{ marginTop: 8 }}>
                                            {registryData.data.control_plane_data.nodes_by_control_plane[cp.control_plane_id].nodes?.map((node, nodeIndex) => (
                                                <Card key={nodeIndex} type="inner" size="small" style={{ marginBottom: 8 }}>
                                                    <Descriptions column={1} size="small">
                                                        <Descriptions.Item label="Node ID">
                                                            <Text code>{node.node_id}</Text>
                                                        </Descriptions.Item>
                                                        <Descriptions.Item label="Version">
                                                            <Tag color="blue">{node.version}</Tag>
                                                        </Descriptions.Item>
                                                        <Descriptions.Item label="Last Seen">
                                                            {formatTimestamp(node.last_seen.seconds, node.last_seen.nanos)}
                                                        </Descriptions.Item>
                                                    </Descriptions>
                                                </Card>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </Card>
                        ))}
                    </Space>
                </Card>

                {/* Controllers */}
                <Card 
                    title={
                        <Space>
                            <ControlOutlined style={{ color: '#722ed1' }} />
                            <span>Controller Information</span>
                        </Space>
                    }
                    size="small"
                >
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        {registryData.data.controller_data.controllers.map((controller, index) => (
                            <Card key={index} type="inner" size="small">
                                <Descriptions column={2} size="small">
                                    <Descriptions.Item label="Controller ID">
                                        {controller.controller_id}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Version">
                                        <Tag color="blue">{controller.version}</Tag>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="GRPC Address">
                                        {controller.grpc_address}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Last Seen">
                                        {formatTimestamp(controller.last_seen.seconds, controller.last_seen.nanos)}
                                    </Descriptions.Item>
                                </Descriptions>

                                {registryData.data.controller_data.clients_by_controller[controller.controller_id] && (
                                    <>
                                        <Divider style={{ margin: '12px 0' }} />
                                        <Text strong>Clients:</Text>
                                        <div style={{ marginTop: 8 }}>
                                            {registryData.data.controller_data.clients_by_controller[controller.controller_id].clients?.map((client, clientIndex) => (
                                                <Card key={clientIndex} type="inner" size="small" style={{ marginBottom: 8 }}>
                                                    <Descriptions column={1} size="small">
                                                        <Descriptions.Item label="Client ID">
                                                            <Text code>{client.client_id}</Text>
                                                        </Descriptions.Item>
                                                        <Descriptions.Item label="Version">
                                                            <Tag color="blue">{client.version}</Tag>
                                                        </Descriptions.Item>
                                                        <Descriptions.Item label="Last Seen">
                                                            {formatTimestamp(client.last_seen.seconds, client.last_seen.nanos)}
                                                        </Descriptions.Item>
                                                    </Descriptions>
                                                </Card>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </Card>
                        ))}
                    </Space>
                </Card>
            </Space>
        </div>
    );
};

export default RegistryInfo; 