import React, { useState } from 'react';
import { Tag, Typography, Button, Collapse, Spin } from 'antd';
import { CloudOutlined, GlobalOutlined, EyeOutlined, EyeInvisibleOutlined, CopyOutlined } from '@ant-design/icons';
import { useSubnetAvailableIPs } from '@/hooks/useSubnetAvailableIPs';
import { copyToClipboard as copyToClipboardUtil } from '@/utils/clipboard';

const { Text } = Typography;

interface SubnetCardProps {
    subnet: SubnetDetail;
    index: number;
    clientId?: string;
    osUuid?: string;
    osProjectId?: string;
}

const SubnetCard: React.FC<SubnetCardProps> = ({ subnet, index, clientId, osUuid, osProjectId }) => {
    const [showAvailableIPs, setShowAvailableIPs] = useState(false);
    const [showAllAvailable, setShowAllAvailable] = useState(false);
    const [showAllUsed, setShowAllUsed] = useState(false);
    const { data: availableIPsData, isLoading: loadingIPs } = useSubnetAvailableIPs(
        clientId || '',
        subnet.id,
        osUuid || '',
        osProjectId || '',
        showAvailableIPs && !!clientId && !!osUuid && !!osProjectId
    );

    const copyToClipboard = (text: string) => {
        copyToClipboardUtil(text, 'IP address copied to clipboard');
    };

    const copyAllIPs = (ips: string[], type: string) => {
        copyToClipboardUtil(ips.join('\n'), `${type} IP addresses copied to clipboard`);
    };

    return (
        <div style={{
            background: 'linear-gradient(135deg, #f1f3f4 0%, #e8eaed 100%)',
            border: '1px solid #dadce0',
            borderRadius: 6,
            padding: 10
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 8
            }}>
                <Text strong style={{ color: '#212529', fontSize: 13 }}>
                    {subnet.name || `Subnet ${index + 1}`}
                </Text>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>

                    {clientId && osUuid && osProjectId && (
                        <Button
                            type="primary"
                            size="middle"
                            icon={showAvailableIPs ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                            onClick={() => setShowAvailableIPs(!showAvailableIPs)}
                            style={{ fontSize: 12, padding: '2px 6px', height: 'auto', marginBottom: 4 }}
                        >
                            Available IPs
                        </Button>
                    )}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 6 }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Text style={{ fontSize: 10, color: '#64748b', marginBottom: 1 }}>Gateway</Text>
                    <Tag className='auto-width-tag' color='purple'>
                        {subnet.gateway_ip}
                    </Tag>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Text style={{ fontSize: 10, color: '#64748b', marginBottom: 1 }}>CIDR</Text>
                    <Tag className='auto-width-tag' color="geekblue" style={{ fontFamily: 'monospace', fontSize: 10 }}>
                        {subnet.cidr}
                    </Tag>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Text style={{ fontSize: 10, color: '#64748b', marginBottom: 1 }}>IP Version</Text>
                    <Tag className='auto-width-tag' color={subnet.ip_version === 4 ? 'blue' : 'purple'}>
                        IPv{subnet.ip_version}
                    </Tag>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Text style={{ fontSize: 10, color: '#64748b', marginBottom: 1 }}>DHCP</Text>
                    <Tag className='auto-width-tag' color={subnet.enable_dhcp ? 'green' : 'red'}>
                        {subnet.enable_dhcp ? 'ON' : 'OFF'}
                    </Tag>
                </div>
            </div>

            {/* Available IPs Section */}
            {showAvailableIPs && (
                <div style={{ marginTop: 8, padding: '8px', background: 'rgba(255,255,255,0.7)', borderRadius: 4 }}>
                    {loadingIPs ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Spin size="small" />
                            <Text style={{ fontSize: 11, color: '#64748b' }}>Loading IP information...</Text>
                        </div>
                    ) : availableIPsData ? (
                        <div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 8 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <Text style={{ fontSize: 10, color: '#64748b' }}>Available:</Text>
                                    <Tag color="green">{availableIPsData.total_available}</Tag>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <Text style={{ fontSize: 10, color: '#64748b' }}>Used:</Text>
                                    <Tag color="orange">{availableIPsData.total_used}</Tag>
                                </div>
                            </div>

                            {availableIPsData.available_ips.length > 0 && (
                                <Collapse size="small" ghost>
                                    <Collapse.Panel
                                        header={
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                                <Text style={{ fontSize: 11 }}>
                                                    Available IPs ({availableIPsData.available_ips.length})
                                                </Text>
                                                <Button
                                                    type="text"
                                                    size="small"
                                                    icon={<CopyOutlined />}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        copyAllIPs(availableIPsData.available_ips, 'Available');
                                                    }}
                                                    style={{ fontSize: 10, padding: '2px 4px', height: 'auto' }}
                                                />
                                            </div>
                                        }
                                        key="available"
                                    >
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 4 }}>
                                            {(showAllAvailable ? availableIPsData.available_ips : availableIPsData.available_ips.slice(0, 100))
                                                .map((ip, idx) => (
                                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Text code style={{ fontSize: 10 }}>
                                                            {ip}
                                                        </Text>
                                                        <Button
                                                            type="text"
                                                            size="small"
                                                            icon={<CopyOutlined />}
                                                            onClick={() => copyToClipboard(ip)}
                                                            style={{
                                                                fontSize: 8,
                                                                padding: '0px',
                                                                height: '12px',
                                                                width: '12px',
                                                                minWidth: 'auto',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                        </div>
                                        {availableIPsData.available_ips.length > 100 && (
                                            <div style={{ textAlign: 'center', marginTop: 8 }}>
                                                <Button
                                                    type="link"
                                                    size="small"
                                                    onClick={() => setShowAllAvailable(!showAllAvailable)}
                                                    style={{ fontSize: 10 }}
                                                >
                                                    {showAllAvailable
                                                        ? 'Show Less'
                                                        : `Load More (${availableIPsData.available_ips.length - 100} remaining)`
                                                    }
                                                </Button>
                                            </div>
                                        )}
                                    </Collapse.Panel>
                                </Collapse>
                            )}

                            {availableIPsData.used_ips.length > 0 && (
                                <Collapse size="small" ghost>
                                    <Collapse.Panel
                                        header={
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                                <Text style={{ fontSize: 11 }}>
                                                    Used IPs ({availableIPsData.used_ips.length})
                                                </Text>
                                                <Button
                                                    type="text"
                                                    size="small"
                                                    icon={<CopyOutlined />}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        copyAllIPs(availableIPsData.used_ips, 'Used');
                                                    }}
                                                    style={{ fontSize: 10, padding: '2px 4px', height: 'auto' }}
                                                />
                                            </div>
                                        }
                                        key="used"
                                    >
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 4 }}>
                                            {(showAllUsed ? availableIPsData.used_ips : availableIPsData.used_ips.slice(0, 100))
                                                .map((ip, idx) => (
                                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Text code style={{ fontSize: 10, color: '#ff7875' }}>
                                                            {ip}
                                                        </Text>
                                                        <Button
                                                            type="text"
                                                            size="small"
                                                            icon={<CopyOutlined />}
                                                            onClick={() => copyToClipboard(ip)}
                                                            style={{
                                                                fontSize: 8,
                                                                padding: '0px',
                                                                height: '12px',
                                                                width: '12px',
                                                                minWidth: 'auto',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                        </div>
                                        {availableIPsData.used_ips.length > 100 && (
                                            <div style={{ textAlign: 'center', marginTop: 8 }}>
                                                <Button
                                                    type="link"
                                                    size="small"
                                                    onClick={() => setShowAllUsed(!showAllUsed)}
                                                    style={{ fontSize: 10 }}
                                                >
                                                    {showAllUsed
                                                        ? 'Show Less'
                                                        : `Load More (${availableIPsData.used_ips.length - 100} remaining)`
                                                    }
                                                </Button>
                                            </div>
                                        )}
                                    </Collapse.Panel>
                                </Collapse>
                            )}
                        </div>
                    ) : (
                        <Text style={{ fontSize: 11, color: '#ff4d4f' }}>Failed to load IP information</Text>
                    )}
                </div>
            )}

            {(subnet.allocation_pools?.length > 0 || subnet.dns_nameservers?.length > 0 || subnet.tags?.length > 0) && (
                <div style={{
                    marginTop: 6,
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 8
                }}>
                    {/* Pools */}
                    <div>
                        {subnet.allocation_pools && subnet.allocation_pools.length > 0 && (
                            <>
                                <Text style={{ fontSize: 10, color: '#64748b', marginBottom: 2, display: 'block' }}>Pools:</Text>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                    {subnet.allocation_pools.map((pool, idx) => (
                                        <Text key={idx} code style={{ fontSize: 13, marginRight: 2 }}>
                                            {pool.start}-{pool.end}
                                        </Text>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                    {/* DNS */}
                    <div>
                        {subnet.dns_nameservers && subnet.dns_nameservers.length > 0 && (
                            <>
                                <Text style={{ fontSize: 10, color: '#64748b', marginBottom: 2, display: 'block' }}>DNS:</Text>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                    {subnet.dns_nameservers.map((dns, idx) => (
                                        <Text key={idx} code style={{ fontSize: 13, marginRight: 2 }}>
                                            {dns}
                                        </Text>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            <div style={{ marginTop: 12, fontSize: 10, color: '#9ca3af', fontFamily: 'monospace' }}>
                ID: {subnet.id}
            </div>
        </div>
    );
};

interface NetworkDetail {
    id: string;
    name: string;
    tenant_id: string;
    admin_state_up: boolean;
    status: string;
    shared: boolean;
    availability_zones: string[];
    router_external: boolean;
    dns_domain?: string;
    mtu: number;
    port_security_enabled: boolean;
    tags: string[];
    description?: string;
    subnets: SubnetDetail[];
}

interface SubnetDetail {
    id: string;
    name: string;
    tenant_id: string;
    network_id: string;
    ip_version: number;
    cidr: string;
    gateway_ip: string;
    dns_nameservers: string[];
    allocation_pools: Array<{
        start: string;
        end: string;
    }>;
    host_routes: Array<{
        destination: string;
        nexthop: string;
    }>;
    enable_dhcp: boolean;
    ipv6_address_mode?: string;
    ipv6_ra_mode?: string;
    subnetpool_id?: string;
    use_default_subnetpool: boolean;
    tags: string[];
    description?: string;
}

interface OpenStackNetworkDetailsProps {
    network: NetworkDetail;
    clientId?: string;
    osUuid?: string;
    osProjectId?: string;
}

const OpenStackNetworkDetails: React.FC<OpenStackNetworkDetailsProps> = ({
    network,
    clientId,
    osUuid,
    osProjectId
}) => {
    return (
        <div style={{ height: '100%', overflowY: 'auto', padding: 0 }}>
            {/* Network Details */}
            <div style={{
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                border: '1px solid #dee2e6',
                borderRadius: 8,
                padding: 12,
                marginBottom: 12
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: 8
                }}>
                    <GlobalOutlined style={{ color: '#495057', marginRight: 6, fontSize: 16 }} />
                    <Text strong style={{ fontSize: 14, color: '#212529' }}>
                        {network.name || network.id.substring(0, 8)}
                    </Text>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 6 }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Text style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>Status</Text>
                        <Tag className='auto-width-tag' color={network.status === 'ACTIVE' ? 'green' : 'orange'}>
                            {network.status}
                        </Tag>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Text style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>Admin State</Text>
                        <Tag className='auto-width-tag' color={network.admin_state_up ? 'green' : 'red'}>
                            {network.admin_state_up ? 'UP' : 'DOWN'}
                        </Tag>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Text style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>MTU</Text>
                        <Tag className='auto-width-tag'>{network.mtu}</Tag>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Text style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>Security</Text>
                        <Tag className='auto-width-tag' color={network.port_security_enabled ? 'green' : 'red'}>
                            {network.port_security_enabled ? 'ON' : 'OFF'}
                        </Tag>
                    </div>
                    {network.shared && (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Text style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>Shared</Text>
                            <Tag className='auto-width-tag' color="blue">YES</Tag>
                        </div>
                    )}
                    {network.router_external && (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Text style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>External</Text>
                            <Tag className='auto-width-tag' color="purple">YES</Tag>
                        </div>
                    )}
                </div>
                {network.dns_domain && (
                    <div style={{ marginTop: 8, padding: '4px 8px', background: 'rgba(255,255,255,0.8)', borderRadius: 4 }}>
                        <Text style={{ fontSize: 11, color: '#64748b' }}>DNS: </Text>
                        <Text code style={{ fontSize: 11 }}>{network.dns_domain}</Text>
                    </div>
                )}
                <div style={{ marginTop: 12, fontSize: 10, color: '#94a3b8', fontFamily: 'monospace' }}>
                    ID: {network.id}
                </div>
            </div>

            {/* Subnets */}
            {network.subnets && network.subnets.length > 0 && (
                <div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: 8,
                        fontSize: 13,
                        color: '#374151',
                        fontWeight: 600
                    }}>
                        <CloudOutlined style={{ color: '#495057', marginRight: 6, fontSize: 14 }} />
                        Subnets ({network.subnets.length})
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {network.subnets.map((subnet, index) => (
                            <SubnetCard
                                key={subnet.id}
                                subnet={subnet}
                                index={index}
                                clientId={clientId}
                                osUuid={osUuid}
                                osProjectId={osProjectId}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OpenStackNetworkDetails;