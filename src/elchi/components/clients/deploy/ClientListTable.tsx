import { Table, Input, Select, Spin, Tag, Button, Drawer, Descriptions, Space } from 'antd';
import { useMemo, useCallback, useState } from 'react';
import { OperationsType } from '@/common/types';
import { InfoCircleOutlined } from '@ant-design/icons';
import OpenStackNetworkDetails from './OpenStackNetworkDetails';

interface ClientVersionInfo {
    client_id: string;
    downloaded_versions?: string[];
    error?: string;
}

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
    network?: NetworkDetail;
    network_details?: NetworkDetail;
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
    onRedeploy?: (client: any) => void;//eslint-disable-line
    existingClients?: Array<{ client_id: string; downstream_address: string; interface_id?: string; ip_mode?: string }>;
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
    interfaceErrors = {},
    onRedeploy,
    existingClients = []
}: ClientListTableProps) {
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
            render: (text: string, record: any) => {
                const isDeployed = existingClients.some(ec => ec.client_id === record.client_id);
                return (
                    <div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8
                        }}>
                            <span style={{
                                fontWeight: 500,
                                color: 'var(--text-primary)',
                                fontSize: 14
                            }}>
                                {text}
                            </span>
                            {isDeployed && (
                                <Tag
                                    color="green"
                                    style={{
                                        margin: 0,
                                        fontSize: 10,
                                        lineHeight: '16px',
                                        padding: '0 6px',
                                        borderRadius: 4
                                    }}
                                >
                                    Deployed
                                </Tag>
                            )}
                        </div>
                        <div style={{
                            fontSize: 11,
                            color: 'var(--text-tertiary)',
                            marginTop: 2
                        }}>
                            {record.client_id}
                        </div>
                    </div>
                );
            }
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
                    background: connected ? 'var(--color-success-light)' : 'var(--color-danger-light)',
                    color: connected ? 'var(--color-success)' : 'var(--color-danger)',
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
                        background: connected ? 'var(--color-success)' : 'var(--color-danger)',
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
                    background: 'var(--bg-surface)',
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                    width: 'fit-content',
                    border: '1px solid var(--border-default)'
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
                    return <span style={{ color: 'var(--text-disabled)', fontSize: 12 }}>Offline</span>;
                }

                // If no version info yet, show loading
                if (!versionInfo) {
                    return <span style={{ color: 'var(--text-disabled)', fontSize: 12 }}>Loading...</span>;
                }

                // If there's an error, show it
                if (versionInfo.error) {
                    return <span style={{ color: 'var(--color-danger)', fontSize: 12 }}>{versionInfo.error}</span>;
                }

                // If no versions available
                if (!versionInfo.downloaded_versions || versionInfo.downloaded_versions.length === 0) {
                    return <span style={{ color: 'var(--text-disabled)', fontSize: 12 }}>No versions</span>;
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
                                        background: isCurrentServiceVersion ? 'var(--color-primary-light)' : 'var(--bg-surface)',
                                        borderRadius: 4,
                                        fontSize: 11,
                                        fontWeight: isCurrentServiceVersion ? 600 : 400,
                                        color: isCurrentServiceVersion ? 'var(--color-primary)' : 'var(--text-secondary)',
                                        border: isCurrentServiceVersion ? '1px solid var(--color-info-border)' : '1px solid var(--border-default)',
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
                    return <span style={{ color: 'var(--text-disabled)', fontSize: 12 }}>-</span>;
                }

                return (
                    <span style={{
                        display: 'inline-flex',
                        background: 'var(--color-success-light)',
                        color: 'var(--color-success)',
                        alignItems: 'center',
                        borderRadius: 4,
                        padding: '2px 12px',
                        fontWeight: 600,
                        fontSize: 12,
                        boxShadow: 'var(--color-success-shadow)'
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
                                backgroundColor: disabledAddressEdit?.(record.client_id) ? 'var(--bg-surface)' : 'var(--card-bg)'
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
                                backgroundColor: disabledAddressEdit?.(record.client_id) ? 'var(--bg-surface)' : 'var(--card-bg)',
                                marginBottom: 8
                            }}
                            suffix={
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.6 }}>
                                        <path d="M12 2L4 8v16l12 6 12-6V8L12 2z" fill="#da1a32" />
                                        <path d="M8 12h8v4H8z" fill="#ffffff" />
                                    </svg>
                                    <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>OpenStack</span>
                                </div>
                            }
                        />

                        {/* Interface Selection */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '6px 8px',
                            background: 'var(--bg-surface)',
                            border: '1px solid var(--border-default)',
                            borderRadius: 4,
                            fontSize: 12
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--text-secondary)">
                                    <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A0.5,0.5 0 0,0 7,13.5A0.5,0.5 0 0,0 7.5,14A0.5,0.5 0 0,0 8,13.5A0.5,0.5 0 0,0 7.5,13M16.5,13A0.5,0.5 0 0,0 16,13.5A0.5,0.5 0 0,0 16.5,14A0.5,0.5 0 0,0 17,13.5A0.5,0.5 0 0,0 16.5,13Z" />
                                </svg>
                                <span style={{ fontWeight: 500 }}>Interface:</span>
                            </div>

                            {isLoading ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <Spin size="small" />
                                    <span style={{ color: 'var(--text-secondary)' }}>Loading...</span>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Select
                                        size="small"
                                        placeholder={interfaces.length === 0 ? "No interfaces available" : "Select interface"}
                                        value={selectedInterface}
                                        onChange={(value) => handleInterfaceChange(record.client_id, value)}
                                        style={{ fontSize: 11, width: '180px' }}
                                        status={actionType === OperationsType.DEPLOY && !selectedInterface ? 'error' : undefined}
                                        disabled={interfaces.length === 0 || disabledAddressEdit?.(record.client_id)}
                                        optionLabelProp="shortLabel"
                                        title={selectedInterface ? interfaces.find(i => i.id === selectedInterface)?.name || '' : ''}
                                        options={interfaces.map(iface => {
                                            const shortName = iface.name || iface.id.substring(0, 13);
                                            return {
                                                value: iface.id,
                                                shortLabel: shortName.length > 30 ? `${shortName.substring(0, 30)}...` : shortName,
                                                label: (
                                                    <div style={{ fontSize: 11 }}>
                                                        <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                                                            {iface.name || iface.id.substring(0, 8)}
                                                        </div>
                                                        <div style={{ color: 'var(--text-secondary)', fontSize: 10 }}>
                                                            IP: {iface.fixed_ips.map(ip => ip.ip_address).join(', ')} | Status: {iface.status || 'N/A'}
                                                        </div>
                                                    </div>
                                                )
                                            };
                                        })}
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
                                            color: 'var(--color-primary)',
                                            whiteSpace: 'nowrap',
                                            flexShrink: 0
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
                            background: 'var(--bg-surface)',
                            border: '1px solid var(--border-default)',
                            borderRadius: 4,
                            fontSize: 12,
                            marginTop: 4
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--text-secondary)">
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
                                background: 'var(--color-danger-light)',
                                border: '1px solid var(--color-danger-border)',
                                borderRadius: 4,
                                fontSize: 11,
                                color: 'var(--color-danger)'
                            }}>
                                ⚠ Interface selection required for deployment
                            </div>
                        )}
                    </div>
                );
            },
        },
        // Actions column - only show if onRedeploy is provided and action type is DEPLOY
        ...(onRedeploy && actionType === OperationsType.DEPLOY ? [{
            title: 'ReDeploy',
            key: 'actions',
            width: 65,
            fixed: 'right' as const,
            render: (_: any, record: any) => {
                // Check if this client is already deployed (exists in existingClients)
                const isDeployed = existingClients.some(ec => ec.client_id === record.client_id);

                if (!isDeployed) {
                    return null; // Don't show button for non-deployed clients
                }

                const isValid = isValidIP(downstreamAddresses[record.client_id] || '');
                const hasDownstreamAddress = !!downstreamAddresses[record.client_id];
                const isOpenStack = record.provider === 'openstack' && record.metadata?.os_uuid && record.metadata?.os_project_id;
                const hasSelectedInterface = isOpenStack ? !!selectedInterfaces[record.client_id] : true;

                const canRedeploy = record.connected && isValid && hasDownstreamAddress && hasSelectedInterface;

                return (
                    <button
                        onClick={() => canRedeploy && onRedeploy(record)}
                        disabled={!canRedeploy}
                        title="Redeploy"
                        style={{
                            position: 'relative',
                            border: 'none',
                            cursor: canRedeploy ? 'pointer' : 'not-allowed',
                            borderRadius: 8,
                            height: 32,
                            width: 32,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 12,
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #06b6d4 100%)',
                            boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3), 0 3px 10px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.15)',
                            color: '#ffffff',
                            overflow: 'hidden',
                            outline: 'none',
                            opacity: canRedeploy ? 1 : 0.5,
                            padding: 0
                        }}
                        onMouseEnter={e => {
                            if (!canRedeploy) return;
                            e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                            e.currentTarget.style.boxShadow = '0 12px 30px rgba(59, 130, 246, 0.4), 0 6px 20px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)';
                            e.currentTarget.style.background = 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #0891b2 100%)';
                        }}
                        onMouseLeave={e => {
                            if (!canRedeploy) return;
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.3), 0 3px 10px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.15)';
                            e.currentTarget.style.background = 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #06b6d4 100%)';
                        }}
                        onMouseDown={e => {
                            if (!canRedeploy) return;
                            e.currentTarget.style.transform = 'translateY(0) scale(0.95)';
                        }}
                        onMouseUp={e => {
                            if (!canRedeploy) return;
                            e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                        }}
                    >
                        <div style={{
                            position: 'absolute',
                            top: '1px',
                            left: 0,
                            right: 0,
                            height: '40%',
                            background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%)',
                            borderRadius: '8px 8px 0 0',
                            zIndex: 1
                        }} />
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ zIndex: 2, position: 'relative' }}>
                            <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12C18,13.5 17.5,14.9 16.6,16L14.8,14.2C15.5,13.5 16,12.3 16,12A4,4 0 0,0 12,8V11L8,7L12,3V6Z"/>
                        </svg>
                    </button>
                );
            }
        }] : [])
    ], [downstreamAddresses, onAddressChange, disabledAddressEdit, clientVersions, serviceVersion, actionType, isOpenStackProvider, interfaceData, interfaceLoading, selectedInterfaces, handleInterfaceChange, selectedIpModes, handleIpModeChange, interfaceErrors, onRedeploy, existingClients]);

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
                border: '1px solid var(--border-default)',
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
                    onRow={(record) => ({
                        onClick: (e) => {
                            // Don't trigger selection if clicking on an input, select, or button
                            const target = e.target as HTMLElement;
                            if (
                                target.tagName === 'INPUT' ||
                                target.tagName === 'SELECT' ||
                                target.tagName === 'BUTTON' ||
                                target.closest('.ant-select') ||
                                target.closest('.ant-select-selector') ||
                                target.closest('.ant-select-dropdown') ||
                                target.closest('.ant-input') ||
                                target.closest('.ant-btn')
                            ) {
                                e.stopPropagation();
                                return;
                            }

                            const isDisabled = rowSelection?.getCheckboxProps?.(record)?.disabled;
                            if (isDisabled) return;

                            const key = record.key;
                            const newSelectedKeys = selectedRowKeys.includes(key)
                                ? selectedRowKeys.filter(k => k !== key)
                                : [...selectedRowKeys, key];
                            onSelectChange(newSelectedKeys);
                        },
                        style: { cursor: 'pointer' }
                    })}
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
                                color: 'var(--text-secondary)',
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
                    background-color: var(--color-danger-light) !important;
                    opacity: 0.8;
                }
                .version-incompatible:hover {
                    background-color: var(--color-danger-light) !important;
                }
                .version-incompatible td {
                    color: var(--text-tertiary);
                }
            `
            }} />

            {/* Interface Detail Drawer */}
            <Drawer
                title={
                    <Space>
                        <InfoCircleOutlined style={{ color: 'var(--color-primary)' }} />
                        Interface Details
                    </Space>
                }
                open={interfaceDetailModal.visible}
                onClose={() => setInterfaceDetailModal({ visible: false, interface: null, clientRecord: null })}
                width={900}
                placement="right"
                styles={{ 
                    body: { padding: '16px' }
                }}
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
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                    {interfaceDetailModal.interface.fixed_ips.map((ip, index) => (
                                        <Tag key={index} className='auto-width-tag' color="blue" style={{ fontFamily: 'monospace' }}>
                                            {ip.ip_address}
                                        </Tag>
                                    ))}
                                </div>
                            </Descriptions.Item>
                            {interfaceDetailModal.interface.allowed_address_pairs.length > 0 && (
                                <Descriptions.Item label="Allowed Address Pairs">
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                        {interfaceDetailModal.interface.allowed_address_pairs.map((aap, index) => (
                                            <Tag key={index} className='auto-width-tag' color="purple" style={{ fontFamily: 'monospace' }}>
                                                {aap.ip_address}
                                            </Tag>
                                        ))}
                                    </div>
                                </Descriptions.Item>
                            )}
                        </Descriptions>

                        {/* Network Details Component */}
                        {interfaceDetailModal.interface.network ? (
                            <OpenStackNetworkDetails
                                network={interfaceDetailModal.interface.network}
                                clientId={interfaceDetailModal.clientRecord.client_id}
                                osUuid={interfaceDetailModal.clientRecord.metadata?.os_uuid}
                                osProjectId={interfaceDetailModal.clientRecord.metadata?.os_project_id}
                            />
                        ) : interfaceDetailModal.interface.network_details ? (
                            <OpenStackNetworkDetails
                                network={interfaceDetailModal.interface.network_details}
                                clientId={interfaceDetailModal.clientRecord.client_id}
                                osUuid={interfaceDetailModal.clientRecord.metadata?.os_uuid}
                                osProjectId={interfaceDetailModal.clientRecord.metadata?.os_project_id}
                            />
                        ) : (
                            <div style={{ padding: '16px 0', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                                Network details not available. Please ensure the interfaces API returns consolidated network data.
                                <br />
                                <small style={{ color: 'var(--text-disabled)' }}>
                                    Expected: interface.network or interface.network_details
                                </small>
                            </div>
                        )}
                    </div>
                )}
            </Drawer>
        </>
    );
} 