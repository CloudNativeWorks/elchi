import React, { useState, useEffect } from 'react';
import { Table, Button, Tabs, Card, Typography, Descriptions, Tag, Space, Badge } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useBGPOperations } from '@/hooks/useBGPOperations';

const { Text } = Typography;

interface BGPRoutesContentProps {
    clientId: string;
}

interface ReceivedRoute {
    network: string;
    paths: RoutePathInfo[];
}

interface RoutePathInfo {
    valid: boolean;
    bestpath?: boolean;
    selection_reason?: string;
    path_from: string;
    prefix: string;
    network: string;
    version: number;
    metric?: number;
    weight?: number;
    peer_id: string;
    origin: string;
    path?: string;
    nexthops: NextHopInfo[];
}

interface NextHopInfo {
    ip: string;
    hostname?: string;
    afi: string;
    used: boolean;
}

interface AdvertisedRoute {
    network: string;
    neighbors: AdvertisedNeighborInfo[];
}

interface AdvertisedNeighborInfo {
    neighbor_ip: string;
    router_id: string;
    bgp_table_version: number;
    local_as: number;
    default_local_pref: number;
    route_details: AdvertisedRouteDetail;
}

interface AdvertisedRouteDetail {
    addr_prefix: string;
    prefix_len: number;
    network: string;
    next_hop: string;
    weight: number;
    origin: string;
    valid: boolean;
    best: boolean;
}

const BGPRoutesContent: React.FC<BGPRoutesContentProps> = ({ clientId }) => {
    const [receivedRoutes, setReceivedRoutes] = useState<ReceivedRoute[]>([]);
    const [advertisedRoutes, setAdvertisedRoutes] = useState<AdvertisedRoute[]>([]);
    const [routesInfo, setRoutesInfo] = useState<any>(null);

    const { loading, getBGPRoutes } = useBGPOperations();

    useEffect(() => {
        loadRoutes();
    }, [clientId]);

    const loadRoutes = async () => {
        try {
            const result = await getBGPRoutes(clientId);
            if (result.success && result.data) {
                const routesData = result.data[0]?.Result?.Frr?.bgp?.routes;
                if (routesData) {
                    // Process received routes
                    const received = routesData.received;
                    if (received?.routes) {
                        const formattedReceived = Object.entries(received.routes).map(([network, data]: [string, any]) => ({
                            network,
                            paths: data.paths || []
                        }));
                        setReceivedRoutes(formattedReceived);
                    }

                    // Process advertised routes
                    const advertised = routesData.advertised || [];
                    const formattedAdvertised: AdvertisedRoute[] = [];

                    // Group advertised routes by network
                    advertised.forEach((neighborData: any) => {
                        Object.entries(neighborData.advertised || {}).forEach(([network, routeDetails]: [string, any]) => {
                            const existingRoute = formattedAdvertised.find(r => r.network === network);
                            const neighborInfo: AdvertisedNeighborInfo = {
                                neighbor_ip: neighborData.neighbor_ip,
                                router_id: neighborData.router_id,
                                bgp_table_version: neighborData.bgp_table_version,
                                local_as: neighborData.local_as,
                                default_local_pref: neighborData.default_local_pref,
                                route_details: routeDetails
                            };

                            if (existingRoute) {
                                existingRoute.neighbors.push(neighborInfo);
                            } else {
                                formattedAdvertised.push({
                                    network,
                                    neighbors: [neighborInfo]
                                });
                            }
                        });
                    });

                    setAdvertisedRoutes(formattedAdvertised);

                    // Store general info
                    setRoutesInfo({
                        totalReceived: received?.total_routes || 0,
                        totalPaths: received?.total_paths || 0,
                        routerId: received?.router_id || '',
                        advertisedCount: formattedAdvertised.length
                    });
                }
            }
        } catch (error) {
            console.error('Failed to load BGP routes:', error);
        }
    };

    // Received Routes Table Columns
    const receivedColumns = [
        {
            title: 'Network',
            dataIndex: 'network',
            key: 'network',
            width: '20%',
            render: (text: string) => <Text copyable>{text}</Text>
        },
        {
            title: 'Peer ID',
            key: 'peer_id',
            width: '15%',
            render: (record: ReceivedRoute) => {
                if (record.paths.length === 1) {
                    return record.paths[0]?.peer_id || 'Local';
                } else {
                    const uniquePeers = [...new Set(record.paths.map(p => p.peer_id))];
                    if (uniquePeers.length === 1) {
                        return uniquePeers[0] || 'Local';
                    } else {
                        return (
                            <div>
                                <Text strong>{uniquePeers[0] || 'Local'}</Text>
                                {uniquePeers.length > 1 && (
                                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                                        +{uniquePeers.length - 1} more
                                    </div>
                                )}
                            </div>
                        );
                    }
                }
            }
        },
        {
            title: 'Next Hop',
            key: 'nexthop',
            width: '15%',
            render: (record: ReceivedRoute) => {
                const bestPath = record.paths.find(p => p.bestpath) || record.paths[0];
                const nextHop = bestPath?.nexthops?.[0];
                return nextHop ? (
                    <div>
                        <Text>{nextHop.ip}</Text>
                        {nextHop.hostname && (
                            <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                                {nextHop.hostname}
                            </div>
                        )}
                    </div>
                ) : '-';
            }
        },
        {
            title: 'Origin',
            key: 'origin',
            width: '10%',
            render: (record: ReceivedRoute) => {
                const bestPath = record.paths.find(p => p.bestpath) || record.paths[0];
                return (
                    <Tag className='auto-width-tag' color={bestPath?.origin === 'IGP' ? 'blue' : bestPath?.origin === 'EGP' ? 'orange' : 'purple'}>
                        {bestPath?.origin || 'Unknown'}
                    </Tag>
                );
            }
        },
        {
            title: 'Weight',
            key: 'weight',
            width: '10%',
            render: (record: ReceivedRoute) => {
                const bestPath = record.paths.find(p => p.bestpath) || record.paths[0];
                return bestPath?.weight || 0;
            }
        },
        {
            title: 'Paths',
            key: 'paths_count',
            width: '10%',
            render: (record: ReceivedRoute) => (
                <Tag className='auto-width-tag' color="cyan">{record.paths.length}</Tag>
            )
        },
        {
            title: 'AS Path',
            key: 'as_path',
            width: '20%',
            render: (record: ReceivedRoute) => {
                const bestPath = record.paths.find(p => p.bestpath) || record.paths[0];
                return bestPath?.path || 'Local';
            }
        }
    ];

    // Advertised Routes Table Columns
    const advertisedColumns = [
        {
            title: 'Network',
            dataIndex: 'network',
            key: 'network',
            width: '25%',
            render: (text: string) => <Text copyable>{text}</Text>
        },
        {
            title: 'Next Hop',
            key: 'next_hop',
            width: '20%',
            render: (record: AdvertisedRoute) => {
                const firstNeighbor = record.neighbors[0];
                return firstNeighbor?.route_details?.next_hop || '-';
            }
        },
        {
            title: 'Origin',
            key: 'origin',
            width: '15%',
            render: (record: AdvertisedRoute) => {
                const firstNeighbor = record.neighbors[0];
                const origin = firstNeighbor?.route_details?.origin;
                return (
                    <Tag className='auto-width-tag' color={origin === 'IGP' ? 'blue' : origin === 'EGP' ? 'orange' : 'purple'}>
                        {origin || 'Unknown'}
                    </Tag>
                );
            }
        },
        {
            title: 'Weight',
            key: 'weight',
            width: '15%',
            render: (record: AdvertisedRoute) => {
                const firstNeighbor = record.neighbors[0];
                return firstNeighbor?.route_details?.weight || 0;
            }
        },
        {
            title: 'Valid',
            key: 'valid',
            width: '10%',
            render: (record: AdvertisedRoute) => {
                const firstNeighbor = record.neighbors[0];
                const valid = firstNeighbor?.route_details?.valid;
                return (
                    <Tag className='auto-width-tag' color={valid ? 'green' : 'red'}>
                        {valid ? 'Valid' : 'Invalid'}
                    </Tag>
                );
            }
        },
        {
            title: 'Neighbors',
            key: 'neighbors_count',
            width: '15%',
            render: (record: AdvertisedRoute) => (
                <Tag className='auto-width-tag' color="blue">{record.neighbors.length}</Tag>
            )
        }
    ];

    // Expanded row render for received routes
    const expandedReceivedRowRender = (record: ReceivedRoute) => {
        return (
            <div style={{ padding: '12px 0' }}>
                <Typography.Title level={5} style={{ marginBottom: 16 }}>
                    All Paths for {record.network}
                </Typography.Title>
                {record.paths.map((path, index) => (
                    <Card key={index} size="small" style={{ marginBottom: 12 }}>
                        <Descriptions bordered column={4} size="small">
                            <Descriptions.Item label="Valid">
                                <Tag className='auto-width-tag' color={path.valid ? 'green' : 'red'}>
                                    {path.valid ? 'Valid' : 'Invalid'}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Best Path">
                                <Tag className='auto-width-tag' color={path.bestpath ? 'gold' : 'default'}>
                                    {path.bestpath ? 'Yes' : 'No'}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Path From">{path.path_from}</Descriptions.Item>
                            <Descriptions.Item label="Peer ID">{path.peer_id}</Descriptions.Item>
                            <Descriptions.Item label="Version">{path.version}</Descriptions.Item>
                            <Descriptions.Item label="Origin">{path.origin}</Descriptions.Item>
                            <Descriptions.Item label="Metric">{path.metric !== undefined ? path.metric : '-'}</Descriptions.Item>
                            <Descriptions.Item label="Weight">{path.weight !== undefined ? path.weight : '-'}</Descriptions.Item>
                            <Descriptions.Item label="Selection Reason" span={4}>
                                {path.selection_reason ? (
                                    <Tag className='auto-width-tag' color="purple">{path.selection_reason}</Tag>
                                ) : (
                                    <Text type="secondary">-</Text>
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="AS Path" span={4}>
                                {path.path || <Text type="secondary">Local</Text>}
                            </Descriptions.Item>
                            <Descriptions.Item label="Next Hops" span={4}>
                                <Space direction="vertical" size="small">
                                    {path.nexthops.map((nh, nhIndex) => (
                                        <div key={nhIndex} style={{
                                            padding: '8px 12px',
                                            background: 'var(--bg-elevated)',
                                            borderRadius: 6,
                                            border: '1px solid var(--border-default)'
                                        }}>
                                            <Space>
                                                <Text strong>{nh.ip}</Text>
                                                {nh.hostname && <Text type="secondary">({nh.hostname})</Text>}
                                                <Tag className='auto-width-tag' color="blue">{nh.afi}</Tag>
                                                {nh.used && <Tag className='auto-width-tag' color="green">Used</Tag>}
                                            </Space>
                                        </div>
                                    ))}
                                </Space>
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                ))}
            </div>
        );
    };

    // Expanded row render for advertised routes
    const expandedAdvertisedRowRender = (record: AdvertisedRoute) => {
        return (
            <div style={{ padding: '12px 0' }}>
                <Typography.Title level={5} style={{ marginBottom: 16 }}>
                    Advertisement Details for {record.network}
                </Typography.Title>
                {record.neighbors.map((neighbor, index) => (
                    <Card key={index} size="small" style={{ marginBottom: 12 }}>
                        <Descriptions bordered column={2} size="small" title={`To Neighbor: ${neighbor.neighbor_ip}`}>
                            <Descriptions.Item label="Neighbor IP">
                                <Text copyable>{neighbor.neighbor_ip}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Router ID">
                                <Text copyable>{neighbor.router_id}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Local AS">{neighbor.local_as}</Descriptions.Item>
                            <Descriptions.Item label="BGP Table Version">{neighbor.bgp_table_version}</Descriptions.Item>
                            <Descriptions.Item label="Default Local Pref">{neighbor.default_local_pref}</Descriptions.Item>
                            <Descriptions.Item label="Next Hop">{neighbor.route_details.next_hop}</Descriptions.Item>
                            <Descriptions.Item label="Weight">{neighbor.route_details.weight}</Descriptions.Item>
                            <Descriptions.Item label="Origin">{neighbor.route_details.origin}</Descriptions.Item>
                            <Descriptions.Item label="Valid">
                                <Tag className='auto-width-tag' color={neighbor.route_details.valid ? 'green' : 'red'}>
                                    {neighbor.route_details.valid ? 'Valid' : 'Invalid'}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Best">
                                <Tag className='auto-width-tag' color={neighbor.route_details.best ? 'gold' : 'default'}>
                                    {neighbor.route_details.best ? 'Yes' : 'No'}
                                </Tag>
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                ))}
            </div>
        );
    };

    const tabItems = [
        {
            key: 'received',
            label: (
                <span>
                    Received Routes
                    <Badge style={{ marginLeft: 8 }} color="blue" count={routesInfo ? routesInfo.totalReceived : 0} />
                </span>
            ),
            children: (
                <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    {routesInfo && (
                        <div style={{ marginBottom: 16, padding: '12px 16px', background: 'var(--bg-elevated)', borderRadius: 8 }}>
                            <Space size="large">
                                <Text><strong>Total Routes:</strong> {routesInfo.totalReceived}</Text>
                                <Text><strong>Total Paths:</strong> {routesInfo.totalPaths}</Text>
                                <Text><strong>Router ID:</strong> {routesInfo.routerId}</Text>
                            </Space>
                        </div>
                    )}
                    <Table
                        dataSource={receivedRoutes}
                        columns={receivedColumns}
                        rowKey="network"
                        loading={loading}
                        expandable={{
                            expandedRowRender: expandedReceivedRowRender,
                            expandRowByClick: true
                        }}
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} routes`
                        }}
                        size="middle"
                    />
                </Card>
            )
        },
        {
            key: 'advertised',
            label: (
                <span>
                    Advertised Routes
                    <Badge style={{ marginLeft: 8 }} color="orange" count={routesInfo ? routesInfo.advertisedCount : 0} />
                </span>
            ),
            children: (
                <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    <Table
                        dataSource={advertisedRoutes}
                        columns={advertisedColumns}
                        rowKey="network"
                        loading={loading}
                        expandable={{
                            expandedRowRender: expandedAdvertisedRowRender,
                            expandRowByClick: true
                        }}
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} neighbors`
                        }}
                        size="middle"
                    />
                </Card>
            )
        }
    ];

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    icon={<ReloadOutlined />}
                    loading={loading}
                    onClick={loadRoutes}
                    style={{ borderRadius: 8 }}
                >
                    Refresh Routes
                </Button>
            </div>

            <Tabs
                items={tabItems}
                defaultActiveKey="received"
                tabBarStyle={{
                    marginBottom: 24,
                    borderBottom: '1px solid #e6f7ff'
                }}
                tabBarGutter={24}
            />
        </div>
    );
};

export default BGPRoutesContent; 