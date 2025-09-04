import { Table, Input, Select, Spin, Tag, Button, Modal, Descriptions, Space } from 'antd';
import { useMemo, useCallback, useState } from 'react';
import { OperationsType } from '@/common/types';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import OpenStackNetworkDetails from './OpenStackNetworkDetails';

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
    onIpModeSelect?: (clientId: string, ipMode: string) => void;//eslint-disable-line
    selectedIpModes?: Record<string, string>;
    interfaceErrors?: Record<string, string>;
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
    selectedInterfaces = {},
    onIpModeSelect,
    selectedIpModes = {},
    interfaceErrors = {}
}: ClientListTableProps) {
    const { project } = useProjectVariable();
    const [interfaceDetailModal, setInterfaceDetailModal] = useState<{
        visible: boolean;
        interface: OpenStackInterface | null;
        clientRecord: any | null;
    }>({ visible: false, interface: null, clientRecord: null });

    const handleInterfaceChange = useCallback((clientId: string, interfaceId: string) => {
        onInterfaceSelect?.(clientId, interfaceId);
    }, [onInterfaceSelect]);

    const handleIpModeChange = useCallback((clientId: string, ipMode: string) => {
        onIpModeSelect?.(clientId, ipMode);
    }, [onIpModeSelect]);

    const isOpenStackProvider = useCallback((client: any) => {
        return client.provider === 'openstack' && client.metadata?.os_uuid && client.metadata?.os_project_id;
    }, []);

    const columns = useMemo(() => [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a: any, b: any) => a.name.localeCompare(b.name),
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
            sorter: (a: any, b: any) => (a.service_ips?.length || 0) - (b.service_ips?.length || 0),
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
                const selectedIpMode = selectedIpModes[record.client_id] || 'fixed';
                const interfaceError = interfaceErrors[record.client_id];

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
                                        <path d="M12 2L4 8v16l12 6 12-6V8L12 2z" fill="#da1a32" />
                                        <path d="M8 12h8v4H8z" fill="#ffffff" />
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
                                    <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A0.5,0.5 0 0,0 7,13.5A0.5,0.5 0 0,0 7.5,14A0.5,0.5 0 0,0 8,13.5A0.5,0.5 0 0,0 7.5,13M16.5,13A0.5,0.5 0 0,0 16,13.5A0.5,0.5 0 0,0 16.5,14A0.5,0.5 0 0,0 17,13.5A0.5,0.5 0 0,0 16.5,13Z" />
                                </svg>
                                <span style={{ fontWeight: 500 }}>Interface:</span>
                            </div>

                            {isLoading ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <Spin size="small" />
                                    <span style={{ color: '#666' }}>Loading...</span>
                                </div>
                            ) : (
                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Select
                                        size="small"
                                        placeholder={interfaces.length === 0 ? "No interfaces available" : "Select interface"}
                                        value={selectedInterface}
                                        onChange={(value) => handleInterfaceChange(record.client_id, value)}
                                        style={{ flex: 1, fontSize: 11 }}
                                        status={actionType === OperationsType.DEPLOY && !selectedInterface ? 'error' : undefined}
                                        disabled={interfaces.length === 0 || disabledAddressEdit?.(record.client_id)}
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
                                    <Button
                                        type="text"
                                        size="small"
                                        icon={<InfoCircleOutlined />}
                                        onClick={() => {
                                            const interfaceToShow = selectedInterfaceData || (selectedInterface && interfaces.find(i => i.id === selectedInterface));
                                            if (interfaceToShow) {
                                                setInterfaceDetailModal({
                                                    visible: true,
                                                    interface: interfaceToShow,
                                                    clientRecord: record
                                                });
                                            }
                                        }}
                                        style={{
                                            padding: '2px 6px',
                                            height: 'auto',
                                            fontSize: 11,
                                            color: '#1890ff',
                                            minWidth: 'auto'
                                        }}
                                    >
                                        Details
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* IP Mode Selection */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '6px 8px',
                            background: '#f8f9fa',
                            border: '1px solid #e9ecef',
                            borderRadius: 4,
                            fontSize: 12,
                            marginTop: 4
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="#666">
                                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2M21 9V7L15 1L13.5 2.5L16.17 5.17L10.58 10.76C9.95 10.27 9.16 10 8.3 10C6.1 10 4.3 11.79 4.3 14S6.1 18 8.3 18S12.3 16.21 12.3 14C12.3 13.14 12.03 12.35 11.54 11.72L17.13 6.13L19.5 8.5L21 9Z"/>
                                </svg>
                                <span style={{ fontWeight: 500 }}>IP Mode:</span>
                            </div>
                            <div style={{ flex: 1 }}>
                                <Select
                                    size="small"
                                    value={selectedIpMode}
                                    onChange={(value) => handleIpModeChange(record.client_id, value)}
                                    style={{ width: '100%', fontSize: 11 }}
                                    disabled={disabledAddressEdit?.(record.client_id)}
                                    options={[
                                        { value: 'fixed', label: 'Fixed IP' },
                                        { value: 'aap', label: 'Allowed Address Pairs' }
                                    ]}
                                />
                            </div>
                        </div>


                        {/* Validation Error */}
                        {actionType === OperationsType.DEPLOY && isOpenStack && !selectedInterface && !interfaceError && (
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
    ], [downstreamAddresses, onAddressChange, disabledAddressEdit, clientVersions, serviceVersion, actionType, isOpenStackProvider, interfaceData, interfaceLoading, selectedInterfaces, handleInterfaceChange, selectedIpModes, handleIpModeChange, interfaceErrors]);

    const sortedData = useMemo(() => {
        if (!clients) return [];

        return [...clients].sort((a, b) => {
            // First priority: Selected items
            const aSelected = selectedRowKeys.includes(a.client_id);
            const bSelected = selectedRowKeys.includes(b.client_id);

            if (aSelected && !bSelected) return -1;
            if (!aSelected && bSelected) return 1;

            // Second priority: Online status (online first, offline last)
            if (a.connected !== b.connected) {
                return b.connected ? 1 : -1; // Online (true) first, offline (false) last
            }

            // Third priority: Name alphabetical
            return (a.name || '').localeCompare(b.name || '');
        }).map(client => ({
            ...client,
            key: client.client_id
        }));
    }, [clients, selectedRowKeys]);

    return (
        <>
            <div style={{
                flex: 1,
                height: '100%',
                overflow: 'auto',
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
                    scroll={{ x: '100%' }}
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
                onCancel={() => setInterfaceDetailModal({ visible: false, interface: null, clientRecord: null })}
                footer={null}
                width={900}
            >
                {interfaceDetailModal.interface && interfaceDetailModal.clientRecord && (
                    <div>
                        <Descriptions column={1} size="small" bordered style={{ marginBottom: 24 }}>
                            <Descriptions.Item label="Name">
                                {interfaceDetailModal.interface.name || interfaceDetailModal.interface.id.substring(0, 8)}
                            </Descriptions.Item>
                            <Descriptions.Item label="ID">
                                <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                                    {interfaceDetailModal.interface.id}
                                </span>
                            </Descriptions.Item>
                            <Descriptions.Item label="Status">
                                <Tag className='auto-width-tag' color={interfaceDetailModal.interface.status === 'ACTIVE' ? 'green' : 'orange'}>
                                    {interfaceDetailModal.interface.status}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Admin State">
                                <Tag className='auto-width-tag' color={interfaceDetailModal.interface.admin_state_up ? 'green' : 'red'}>
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
                                            <Tag className='auto-width-tag' color="blue" style={{ fontFamily: 'monospace' }}>
                                                {ip.ip_address}
                                            </Tag>
                                        </div>
                                    ))}
                                </div>
                            </Descriptions.Item>
                            {interfaceDetailModal.interface.allowed_address_pairs.length > 0 && (
                                <Descriptions.Item label="Allowed Address Pairs">
                                    <div>
                                        {interfaceDetailModal.interface.allowed_address_pairs.map((aap, index) => (
                                            <div key={index} style={{ marginBottom: 4 }}>
                                                <Tag className='auto-width-tag' color="purple" style={{ fontFamily: 'monospace' }}>
                                                    {aap.ip_address}
                                                </Tag>
                                            </div>
                                        ))}
                                    </div>
                                </Descriptions.Item>
                            )}
                        </Descriptions>

                        {/* Network Details Component */}
                        <OpenStackNetworkDetails
                            networkId={interfaceDetailModal.interface.network_id}
                            subnetIds={[...new Set(interfaceDetailModal.interface.fixed_ips.map(ip => ip.subnet_id))]}
                            osProjectId={interfaceDetailModal.clientRecord.metadata?.os_project_id}
                            project={project}
                        />
                    </div>
                )}
            </Modal>
        </>
    );
} 