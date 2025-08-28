import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Tag, Spin, Alert, Tabs, Typography, Space } from 'antd';
import { CloudOutlined, GlobalOutlined } from '@ant-design/icons';
import { api } from '@/common/api';

const { Text } = Typography;

interface NetworkDetail {
    id: string;
    name: string;
    status: string;
    admin_state_up: boolean;
    shared: boolean;
    router_external: boolean;
    provider_network_type?: string;
    provider_physical_network?: string;
    provider_segmentation_id?: number;
    mtu?: number;
    dns_domain?: string;
    description?: string;
    subnets?: string[];
}

interface SubnetDetail {
    id: string;
    name: string;
    network_id: string;
    cidr: string;
    ip_version: number;
    gateway_ip: string;
    allocation_pools: Array<{
        start: string;
        end: string;
    }>;
    dns_nameservers: string[];
    host_routes: Array<{
        destination: string;
        nexthop: string;
    }>;
    enable_dhcp: boolean;
    ipv6_address_mode?: string;
    ipv6_ra_mode?: string;
}

interface OpenStackNetworkDetailsProps {
    networkId: string;
    subnetIds: string[];
    osProjectId: string;
    project: string;
}

const OpenStackNetworkDetails: React.FC<OpenStackNetworkDetailsProps> = ({
    networkId,
    subnetIds,
    osProjectId,
    project
}) => {
    const [networkDetail, setNetworkDetail] = useState<NetworkDetail | null>(null);
    const [subnetDetails, setSubnetDetails] = useState<SubnetDetail[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNetworkDetails = async () => {
            setLoading(true);
            setError(null);
            
            try {
                // Fetch network details
                const networkResponse = await api.get(`/api/op/clients/openstack/networks/${networkId}?osp_project=${osProjectId}&project=${project}`);
                if (networkResponse.data?.data) {
                    setNetworkDetail(networkResponse.data.data);
                }

                // Fetch subnet details for each subnet
                const subnetPromises = subnetIds.map(subnetId =>
                    api.get(`/api/op/clients/openstack/subnets/${subnetId}?osp_project=${osProjectId}&project=${project}`)
                );

                const subnetResponses = await Promise.all(subnetPromises);
                const subnets = subnetResponses
                    .map(response => response.data?.data)
                    .filter(Boolean);
                
                setSubnetDetails(subnets);
            } catch (err: any) {
                console.error('Error fetching OpenStack network details:', err);
                setError(err.message || 'Failed to fetch network details');
            } finally {
                setLoading(false);
            }
        };

        if (networkId && osProjectId && project) {
            fetchNetworkDetails();
        }
    }, [networkId, subnetIds, osProjectId, project]);

    if (loading) {
        return (
            <Card>
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <Spin size="large" />
                    <div style={{ marginTop: 16, color: '#666' }}>
                        Loading network details...
                    </div>
                </div>
            </Card>
        );
    }

    if (error) {
        return (
            <Alert
                type="error"
                message="Failed to load network details"
                description={error}
                style={{ margin: '16px 0' }}
            />
        );
    }

    const networkItems = networkDetail ? [
        {
            key: 'network',
            label: (
                <Space>
                    <GlobalOutlined style={{ color: '#1890ff' }} />
                    Network Details
                </Space>
            ),
            children: (
                <Card size="small" style={{ marginTop: 8 }}>
                    <Descriptions column={2} size="small" bordered>
                        <Descriptions.Item label="Name" span={2}>
                            <Text strong>{networkDetail.name || networkDetail.id.substring(0, 8)}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="ID" span={2}>
                            <Text code style={{ fontSize: 11 }}>{networkDetail.id}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Status">
                            <Tag color={networkDetail.status === 'ACTIVE' ? 'green' : 'orange'}>
                                {networkDetail.status}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Admin State">
                            <Tag color={networkDetail.admin_state_up ? 'green' : 'red'}>
                                {networkDetail.admin_state_up ? 'UP' : 'DOWN'}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Shared">
                            <Tag color={networkDetail.shared ? 'blue' : 'default'}>
                                {networkDetail.shared ? 'Yes' : 'No'}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="External">
                            <Tag color={networkDetail.router_external ? 'purple' : 'default'}>
                                {networkDetail.router_external ? 'Yes' : 'No'}
                            </Tag>
                        </Descriptions.Item>
                        {networkDetail.provider_network_type && (
                            <Descriptions.Item label="Provider Type" span={2}>
                                <Tag color="cyan">{networkDetail.provider_network_type}</Tag>
                            </Descriptions.Item>
                        )}
                        {networkDetail.mtu && (
                            <Descriptions.Item label="MTU">
                                <Tag>{networkDetail.mtu}</Tag>
                            </Descriptions.Item>
                        )}
                        {networkDetail.description && (
                            <Descriptions.Item label="Description" span={2}>
                                {networkDetail.description}
                            </Descriptions.Item>
                        )}
                    </Descriptions>
                </Card>
            )
        }
    ] : [];

    const subnetItems = subnetDetails.map((subnet, index) => ({
        key: `subnet-${subnet.id}`,
        label: (
            <Space>
                <CloudOutlined style={{ color: '#52c41a' }} />
                {subnet.name || `Subnet ${index + 1}`}
            </Space>
        ),
        children: (
            <Card size="small" style={{ marginTop: 8 }}>
                <Descriptions column={2} size="small" bordered>
                    <Descriptions.Item label="Name" span={2}>
                        <Text strong>{subnet.name || subnet.id.substring(0, 8)}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="ID" span={2}>
                        <Text code style={{ fontSize: 11 }}>{subnet.id}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="CIDR">
                        <Tag color="geekblue" style={{ fontFamily: 'monospace' }}>
                            {subnet.cidr}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="IP Version">
                        <Tag color={subnet.ip_version === 4 ? 'blue' : 'purple'}>
                            IPv{subnet.ip_version}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Gateway IP">
                        <Text code>{subnet.gateway_ip}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="DHCP">
                        <Tag color={subnet.enable_dhcp ? 'green' : 'red'}>
                            {subnet.enable_dhcp ? 'Enabled' : 'Disabled'}
                        </Tag>
                    </Descriptions.Item>
                    {subnet.allocation_pools && subnet.allocation_pools.length > 0 && (
                        <Descriptions.Item label="Allocation Pools" span={2}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                {subnet.allocation_pools.map((pool, idx) => (
                                    <Tag key={idx} color="processing" style={{ fontFamily: 'monospace', fontSize: 11 }}>
                                        {pool.start} - {pool.end}
                                    </Tag>
                                ))}
                            </div>
                        </Descriptions.Item>
                    )}
                    {subnet.dns_nameservers && subnet.dns_nameservers.length > 0 && (
                        <Descriptions.Item label="DNS Nameservers" span={2}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                {subnet.dns_nameservers.map((dns, idx) => (
                                    <Tag key={idx} color="gold" style={{ fontFamily: 'monospace', fontSize: 11 }}>
                                        {dns}
                                    </Tag>
                                ))}
                            </div>
                        </Descriptions.Item>
                    )}
                    {subnet.host_routes && subnet.host_routes.length > 0 && (
                        <Descriptions.Item label="Host Routes" span={2}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                {subnet.host_routes.map((route, idx) => (
                                    <div key={idx} style={{ 
                                        background: '#f6f8fa',
                                        padding: '4px 8px',
                                        borderRadius: 4,
                                        fontSize: 11,
                                        fontFamily: 'monospace'
                                    }}>
                                        {route.destination} → {route.nexthop}
                                    </div>
                                ))}
                            </div>
                        </Descriptions.Item>
                    )}
                </Descriptions>
            </Card>
        )
    }));

    return (
        <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            <Tabs
                defaultActiveKey="network"
                type="card"
                size="small"
                items={[...networkItems, ...subnetItems]}
                tabBarStyle={{ marginBottom: 16 }}
            />
        </div>
    );
};

export default OpenStackNetworkDetails;