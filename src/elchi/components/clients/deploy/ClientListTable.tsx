import { Table, Input, Select, Spin, Tag, Button, Modal, Descriptions, Space } from 'antd';
import { useMemo, useCallback, useState } from 'react';
import { OperationsType } from '@/common/types';
import { InfoCircleOutlined } from '@ant-design/icons';

interface ClientVersionInfo {
    client_id: string;
    downloaded_versions?: string[];
    error?: string;
}

interface OpenStackInterface {
    id: string;
    name: string;
    network_id: string;
    status: string;
    admin_state_up: boolean;
    mac_address: string;
    fixed_ips: Array<{
        subnet_id: string;
        ip_address: string;
    }>;
    allowed_address_pairs: Array<{
        ip_address: string;
        mac_address: string;
    }>;
    device_id: string;
    device_owner: string;
}

interface ClientListTableProps {
    clients: any[];
    selectedRowKeys: string[];
    onSelectChange: (selectedRowKeys: string[]) => void;//eslint-disable-line
    downstreamAddresses: Record<string, string>;
    onAddressChange: (id: string, value: string) => void;//eslint-disable-line
    loading: boolean;
    disabledAddressEdit?: (id: string) => boolean;//eslint-disable-line
    rowSelection?: any;
    clientVersions?: Record<string, ClientVersionInfo>;
    serviceVersion?: string;
    actionType?: OperationsType;
    onInterfaceSelect?: (clientId: string, interfaceId: string) => void;//eslint-disable-line
    interfaceData?: Record<string, OpenStackInterface[]>;
    interfaceLoading?: Record<string, boolean>;
    selectedInterfaces?: Record<string, string>;
}

// IP validation function outside component
const isValidIP = (ip: string) => {
    if (!ip) return true; // Empty is valid (will be caught by required validation)
    const ipRegex = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/;
    return ipRegex.test(ip);
};

export function ClientListTable({ 
    clients, 
    selectedRowKeys, 
    onSelectChange, 
    downstreamAddresses, 
    onAddressChange, 
    loading, 
    disabledAddressEdit, 
    rowSelection, 
    clientVersions, 
    serviceVersion, 
    actionType, 
    onInterfaceSelect,
    interfaceData = {},
    interfaceLoading = {},
    selectedInterfaces = {}
}: ClientListTableProps) {
    const [interfaceDetailModal, setInterfaceDetailModal] = useState<{
        visible: boolean;
        interface: OpenStackInterface | null;
    }>({ visible: false, interface: null });

    const handleInterfaceChange = useCallback((clientId: string, interfaceId: string) => {
        onInterfaceSelect?.(clientId, interfaceId);
    }, [onInterfaceSelect]);

    const isOpenStackProvider = useCallback((client: any) => {
        return client.provider === 'openstack' && client.metadata?.os_uuid && client.metadata?.os_project_id;
    }, []);

    const columns = useMemo(() => [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: any) => (
                <div>
                    <div style={{
                        fontWeight: 500,
                        color: '#262626',
                        fontSize: 14
                    }}>
                        {text}
                    </div>
                    <div style={{
                        fontSize: 11,
                        color: '#8c8c8c',
                        marginTop: 2
                    }}>
                        {record.client_id}
                    </div>
                </div>
            )
        },
        {
            title: 'Status',
            dataIndex: 'connected',
            key: 'connected',
            width: 100,
            render: (connected: boolean) => (
                <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    background: connected ? '#e6fffb' : '#fff1f0',
                    color: connected ? '#52c41a' : '#ff4d4f',
                    borderRadius: 8,
                    fontWeight: 600,
                    fontSize: 12,
                    padding: '2px 10px',
                    marginLeft: 2
                }}>
                    <span style={{
                        display: 'inline-block',
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        background: connected ? '#52c41a' : '#ff4d4f',
                        marginRight: 7,
                        animation: connected ? 'pulse 1.2s infinite' : 'none'
                    }} />
                    {connected ? 'Live' : 'Offline'}
                </span>
            )
        },
        {
            title: 'Client Version',
            dataIndex: 'version',
            key: 'version',
            width: 100,
            render: (text: string) => (
                <div style={{
                    padding: '4px 8px',
                    background: '#f5f5f5',
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 500,
                    color: '#595959',
                    width: 'fit-content',
                    border: '1px solid #f0f0f0'
                }}>
                    {text || '-'}
                </div>
            )
        },
        {
            title: 'Envoy Versions',
            key: 'envoy_versions',
            width: 150,
            render: (_: any, record: any) => {
                const versionInfo = clientVersions?.[record.client_id];
                
                // Check if client is disconnected
                if (!record.connected) {
                    return <span style={{ color: '#bfbfbf', fontSize: 12 }}>Offline</span>;
                }
                
                // If no version info yet, show loading
                if (!versionInfo) {
                    return <span style={{ color: '#bfbfbf', fontSize: 12 }}>Loading...</span>;
                }
                
                // If there's an error, show it
                if (versionInfo.error) {
                    return <span style={{ color: '#ff4d4f', fontSize: 12 }}>{versionInfo.error}</span>;
                }
                
                // If no versions available
                if (!versionInfo.downloaded_versions || versionInfo.downloaded_versions.length === 0) {
                    return <span style={{ color: '#bfbfbf', fontSize: 12 }}>No versions</span>;
                }
                
                return (
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(2, minmax(0, max-content))',
                        gap: 6,
                        alignItems: 'center'
                    }}>
                        {versionInfo.downloaded_versions.map(version => {
                            const isCurrentServiceVersion = version === serviceVersion;
                            return (
                                <div
                                    key={version}
                                    style={{
                                        padding: '2px 8px',
                                        background: isCurrentServiceVersion ? '#e6f7ff' : '#f5f5f5',
                                        borderRadius: 4,
                                        fontSize: 11,
                                        fontWeight: isCurrentServiceVersion ? 600 : 400,
                                        color: isCurrentServiceVersion ? '#1890ff' : '#595959',
                                        border: isCurrentServiceVersion ? '1px solid #91d5ff' : '1px solid #f0f0f0',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {version}
                                </div>
                            );
                        })}
                    </div>
                );
            }
        },
        {
            title: 'Services',
            key: 'service_ips',
            width: 100,
            render: (_: any, record: any) => {
                const serviceIpsCount = record.service_ips?.length || 0;
                
                if (serviceIpsCount === 0) {
                    return <span style={{ color: '#bfbfbf', fontSize: 12 }}>-</span>;
                }
                
                return (
                    <span style={{
                        display: 'inline-flex',
                        background: 'linear-gradient(90deg, #f6ffed 0%, #d9f7be 100%)',
                        color: '#52c41a',
                        alignItems: 'center',
                        borderRadius: 4,
                        padding: '2px 12px',
                        fontWeight: 600,
                        fontSize: 12,
                        boxShadow: '0 1px 4px rgba(82,196,26,0.08)'
                    }}>
                        {serviceIpsCount}
                    </span>
                );
            }
        },
        {
            title: 'Downstream Address',
            dataIndex: 'downstream_address',
            key: 'downstream_address',
            width: 350,
            render: (_: any, record: any) => {
                const value = downstreamAddresses[record.client_id] || '';
                const isValid = isValidIP(value);
                const isOpenStack = isOpenStackProvider(record);
                
                if (!isOpenStack) {
                    // Regular input for non-OpenStack clients
                    return (
                        <Input
                            key={record.client_id}
                            placeholder="Enter downstream address (e.g., 192.168.1.5)"
                            value={value}
                            onChange={e => onAddressChange(record.client_id, e.target.value)}
                            disabled={disabledAddressEdit?.(record.client_id)}
                            status={!isValid ? 'error' : undefined}
                            style={{
                                borderRadius: 6,
                                width: '100%',
                                backgroundColor: disabledAddressEdit?.(record.client_id) ? '#fafafa' : '#fff'
                            }}
                        />
                    );
                }

                // Enhanced input for OpenStack clients with interface selection
                const interfaces = interfaceData[record.client_id] || [];
                const isLoading = interfaceLoading[record.client_id];
                const selectedInterface = selectedInterfaces[record.client_id];
                const selectedInterfaceData = interfaces.find(i => i.id === selectedInterface);

                return (
                    <div>
                        {/* Main IP Address Input */}
                        <Input
                            key={record.client_id}
                            placeholder="Enter downstream address (e.g., 192.168.1.5)"
                            value={value}
                            onChange={e => onAddressChange(record.client_id, e.target.value)}
                            disabled={disabledAddressEdit?.(record.client_id)}
                            status={!isValid ? 'error' : undefined}
                            style={{
                                borderRadius: 6,
                                width: '100%',
                                backgroundColor: disabledAddressEdit?.(record.client_id) ? '#fafafa' : '#fff',
                                marginBottom: 8
                            }}
                            suffix={
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.6 }}>
                                        <path d="M12 2L4 8v16l12 6 12-6V8L12 2z" fill="#da1a32"/>
                                        <path d="M8 12h8v4H8z" fill="#ffffff"/>
                                    </svg>
                                    <span style={{ fontSize: 11, color: '#666' }}>OpenStack</span>
                                </div>
                            }
                        />
                        
                        {/* Interface Selection */}
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 8,
                            padding: '6px 8px',
                            background: '#f8f9fa',
                            border: '1px solid #e9ecef',
                            borderRadius: 4,
                            fontSize: 12
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="#666">
                                    <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A0.5,0.5 0 0,0 7,13.5A0.5,0.5 0 0,0 7.5,14A0.5,0.5 0 0,0 8,13.5A0.5,0.5 0 0,0 7.5,13M16.5,13A0.5,0.5 0 0,0 16,13.5A0.5,0.5 0 0,0 16.5,14A0.5,0.5 0 0,0 17,13.5A0.5,0.5 0 0,0 16.5,13Z"/>
                                </svg>
                                <span style={{ fontWeight: 500 }}>Interface:</span>
                            </div>
                            
                            {isLoading ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <Spin size="small" />
                                    <span style={{ color: '#666' }}>Loading...</span>
                                </div>
                            ) : (
                                <div style={{ flex: 1 }}>
                                    <Select
                                        size="small"
                                        placeholder={interfaces.length === 0 ? "No interfaces available" : "Select interface"}
                                        value={selectedInterface}
                                        onChange={(value) => handleInterfaceChange(record.client_id, value)}
                                        style={{ width: '100%', fontSize: 11 }}
                                        status={actionType === OperationsType.DEPLOY && !selectedInterface ? 'error' : undefined}
                                        disabled={interfaces.length === 0}
                                        optionLabelProp="shortLabel"
                                        options={interfaces.map(iface => ({
                                            value: iface.id,
                                            shortLabel: iface.name || `${iface.id.substring(0, 13)}...`,
                                            label: (
                                                <div style={{ fontSize: 11 }}>
                                                    <div style={{ fontWeight: 500 }}>
                                                        {iface.name || iface.id.substring(0, 8)}
                                                    </div>
                                                    <div style={{ color: '#666', fontSize: 10 }}>
                                                        IP: {iface.fixed_ips.map(ip => ip.ip_address).join(', ')} | Status: {iface.status || 'N/A'}
                                                    </div>
                                                </div>
                                            )
                                        }))}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Selected Interface Info */}
                        {selectedInterfaceData && (
                            <div style={{ 
                                marginTop: 4,
                                padding: '4px 8px',
                                background: '#e6f7ff',
                                border: '1px solid #91d5ff',
                                borderRadius: 4,
                                fontSize: 11
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: '#1890ff', fontWeight: 500 }}>
                                        ✓ {selectedInterfaceData.name || 'Interface'}
                                    </span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span style={{ color: '#666', fontSize: 10 }}>
                                            MAC: {selectedInterfaceData.mac_address}
                                        </span>
                                        <Button
                                            type="text"
                                            size="small"
                                            icon={<InfoCircleOutlined />}
                                            onClick={() => setInterfaceDetailModal({ 
                                                visible: true, 
                                                interface: selectedInterfaceData 
                                            })}
                                            style={{ 
                                                padding: '2px 4px',
                                                height: 'auto',
                                                fontSize: 10,
                                                color: '#1890ff'
                                            }}
                                        >
                                            Details
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Validation Error */}
                        {actionType === OperationsType.DEPLOY && isOpenStack && !selectedInterface && (
                            <div style={{ 
                                marginTop: 4,
                                padding: '4px 8px',
                                background: '#fff2f0',
                                border: '1px solid #ffccc7',
                                borderRadius: 4,
                                fontSize: 11,
                                color: '#ff4d4f'
                            }}>
                                ⚠ Interface selection required for deployment
                            </div>
                        )}
                    </div>
                );
            },
        },
    ], [downstreamAddresses, onAddressChange, disabledAddressEdit, clientVersions, serviceVersion, actionType, isOpenStackProvider, interfaceData, interfaceLoading, selectedInterfaces, handleInterfaceChange]);

    const sortedData = useMemo(() => {
        if (!clients) return [];

        return [...clients].sort((a, b) => {
            const aSelected = selectedRowKeys.includes(a.client_id);
            const bSelected = selectedRowKeys.includes(b.client_id);

            if (aSelected && !bSelected) return -1;
            if (!aSelected && bSelected) return 1;
            return 0;
        }).map(client => ({
            ...client,
            key: client.client_id
        }));
    }, [clients, selectedRowKeys]);

    return (
        <>
        <div style={{ 
            height: '400px', 
            overflow: 'hidden',
            border: '1px solid #f0f0f0',
            borderRadius: 8
        }}>
            <Table
                dataSource={sortedData}
                columns={columns}
                rowSelection={{
                    type: 'checkbox',
                    ...rowSelection,
                    selectedRowKeys,
                    onChange: onSelectChange,
                    getCheckboxProps: (record: any) => ({
                        disabled: rowSelection?.getCheckboxProps?.(record)?.disabled
                    }),
                    columnWidth: 48,
                    columnTitle: ' '
                }}
                loading={loading}
                size="small"
                pagination={false}
                style={{
                    width: '100%',
                    margin: 0
                }}
                rowClassName={(record) => {
                    const versionInfo = clientVersions?.[record.client_id];
                    const isIncompatible = actionType === OperationsType.DEPLOY && 
                                          serviceVersion && 
                                          versionInfo?.downloaded_versions && 
                                          !versionInfo.downloaded_versions.includes(serviceVersion);
                    
                    return `${selectedRowKeys.includes(record.key) ? 'ant-table-row-selected' : ''} ${isIncompatible ? 'version-incompatible' : ''}`;
                }}
                className="modern-table"
                scroll={{ x: '100%', y: 350 }}
                locale={{
                    emptyText: (
                        <div style={{
                            padding: '32px 0',
                            color: '#00000073',
                            fontSize: 14
                        }}>
                            No clients available
                        </div>
                    )
                }}
            />
        </div>
        <style dangerouslySetInnerHTML={{
            __html: `
                .version-incompatible {
                    background-color: #fff1f0 !important;
                    opacity: 0.8;
                }
                .version-incompatible:hover {
                    background-color: #ffebe6 !important;
                }
                .version-incompatible td {
                    color: #8c8c8c;
                }
            `
        }} />

        {/* Interface Detail Modal */}
        <Modal
            title={
                <Space>
                    <InfoCircleOutlined style={{ color: '#1890ff' }} />
                    Interface Details
                </Space>
            }
            open={interfaceDetailModal.visible}
            onCancel={() => setInterfaceDetailModal({ visible: false, interface: null })}
            footer={null}
            width={600}
        >
            {interfaceDetailModal.interface && (
                <Descriptions column={1} size="small" bordered>
                    <Descriptions.Item label="Name">
                        {interfaceDetailModal.interface.name || interfaceDetailModal.interface.id.substring(0, 8)}
                    </Descriptions.Item>
                    <Descriptions.Item label="ID">
                        <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                            {interfaceDetailModal.interface.id}
                        </span>
                    </Descriptions.Item>
                    <Descriptions.Item label="Status">
                        <Tag color={interfaceDetailModal.interface.status === 'ACTIVE' ? 'green' : 'orange'}>
                            {interfaceDetailModal.interface.status}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Admin State">
                        <Tag color={interfaceDetailModal.interface.admin_state_up ? 'green' : 'red'}>
                            {interfaceDetailModal.interface.admin_state_up ? 'UP' : 'DOWN'}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="MAC Address">
                        <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                            {interfaceDetailModal.interface.mac_address}
                        </span>
                    </Descriptions.Item>
                    <Descriptions.Item label="Network ID">
                        <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                            {interfaceDetailModal.interface.network_id}
                        </span>
                    </Descriptions.Item>
                    <Descriptions.Item label="Device ID">
                        {interfaceDetailModal.interface.device_id || '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Device Owner">
                        {interfaceDetailModal.interface.device_owner || '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Fixed IPs">
                        <div>
                            {interfaceDetailModal.interface.fixed_ips.map((ip, index) => (
                                <div key={index} style={{ marginBottom: 4 }}>
                                    <Tag color="blue" style={{ fontFamily: 'monospace' }}>
                                        {ip.ip_address}
                                    </Tag>
                                    <span style={{ color: '#666', fontSize: '12px', marginLeft: 8 }}>
                                        Subnet: {ip.subnet_id.substring(0, 8)}...
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Descriptions.Item>
                    {interfaceDetailModal.interface.allowed_address_pairs.length > 0 && (
                        <Descriptions.Item label="Allowed Address Pairs">
                            <div>
                                {interfaceDetailModal.interface.allowed_address_pairs.map((aap, index) => (
                                    <div key={index} style={{ marginBottom: 4 }}>
                                        <Tag color="purple" style={{ fontFamily: 'monospace' }}>
                                            {aap.ip_address}
                                        </Tag>
                                        <span style={{ color: '#666', fontSize: '12px', marginLeft: 8 }}>
                                            MAC: {aap.mac_address}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Descriptions.Item>
                    )}
                </Descriptions>
            )}
        </Modal>
        </>
    );
} 