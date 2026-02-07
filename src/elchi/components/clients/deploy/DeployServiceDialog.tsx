import { useState, useEffect, useCallback } from 'react';
import { Drawer, Button, Alert, Modal, Typography, App as AntdApp } from 'antd';
import { ClientListTable } from './ClientListTable';
import { useDeployUndeployService } from '@/hooks/useServiceActions';
import { OperationsType } from '@/common/types';
import { useCustomGetQuery, api } from '@/common/api';
import { DeployLineIcon } from '@/assets/svg/icons';
import { CloudUploadOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { showWarningNotification } from '@/common/notificationHandler';

const { Text } = Typography;


interface DeployServiceDialogProps {
    open: boolean;
    onClose: () => void;
    serviceName: string;
    project: string;
    action: OperationsType;
    existingClients: Array<{ client_id: string; downstream_address: string; interface_id?: string; ip_mode?: string }>;
    onSuccess?: () => void;
    version?: string;
}

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

export function DeployServiceDialog({ open, onClose, serviceName, project, action: initialAction, existingClients, onSuccess, version }: DeployServiceDialogProps) {
    const { project: currentProject } = useProjectVariable();
    const { modal } = AntdApp.useApp();
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [downstreamAddresses, setDownstreamAddresses] = useState<Record<string, string>>({});
    const [selectedInterfaces, setSelectedInterfaces] = useState<Record<string, string>>({});
    const [selectedIpModes, setSelectedIpModes] = useState<Record<string, string>>({});
    const [action, setAction] = useState<OperationsType>(initialAction);
    const [clientVersions, setClientVersions] = useState<Record<string, ClientVersionInfo>>({});
    const [loadingVersions, setLoadingVersions] = useState(false);
    const [interfaceData, setInterfaceData] = useState<Record<string, OpenStackInterface[]>>({});
    const [interfaceLoading, setInterfaceLoading] = useState<Record<string, boolean>>({});
    const [interfaceErrors, setInterfaceErrors] = useState<Record<string, string>>({});
    const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
    const [openStackErrorConfirmVisible, setOpenStackErrorConfirmVisible] = useState(false);

    const { executeAction, loading } = useDeployUndeployService({
        name: serviceName,
        project,
        version
    });

    const { data: clients, error: clientsError, isLoading: clientsLoading } = useCustomGetQuery({
        queryKey: `client_list_${project}_${version}`,
        enabled: open && !!project,
        path: `api/op/clients?project=${project}${version ? `&version=${version}` : ''}&with_service_ips=true`,
        directApi: true
    });

    const fetchOpenStackInterfaces = useCallback(async (clientId: string, osUuid: string, osProjectId: string) => {
        setInterfaceLoading(prev => ({ ...prev, [clientId]: true }));

        try {
            const response = await api.get(`/api/op/clients/${clientId}/openstack/interfaces?os_uuid=${osUuid}&osp_project=${osProjectId}&project=${currentProject}`);
            if (response.data?.data) {
                setInterfaceData(prev => ({ ...prev, [clientId]: response.data.data }));
                // Clear any previous error for this client
                setInterfaceErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[clientId];
                    return newErrors;
                });
            }
        } catch (error: any) {
            console.error('Error fetching OpenStack interfaces:', error);
            setInterfaceData(prev => ({ ...prev, [clientId]: [] }));

            // Store the error message
            let errorMessage = 'Unknown error occurred';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            setInterfaceErrors(prev => ({ ...prev, [clientId]: errorMessage }));
        } finally {
            setInterfaceLoading(prev => ({ ...prev, [clientId]: false }));
        }
    }, [currentProject]);

    // Fetch available versions for all clients in a single batch request
    const fetchClientVersions = useCallback(async (clientList: any[]) => {
        if (!clientList || clientList.length === 0) return;

        setLoadingVersions(true);
        const versionMap: Record<string, ClientVersionInfo> = {};

        // Filter only connected clients for version requests
        const connectedClients = clientList.filter(client => client.connected);

        try {
            // Send batch request only for connected clients
            const payload = {
                type: "ENVOY_VERSION",
                clients: connectedClients.map(client => ({
                    client_id: client.client_id,
                    downstream_address: client.downstream_address || ""
                })),
                envoy_version: {
                    operation: "GET_VERSIONS"
                }
            };

            const response = await api.post(`/api/op/clients?project=${currentProject}`, payload);
            const data = response.data;

            // Process response - it should be an array of results for each client
            const results = Array.isArray(data) ? data : [data];

            results.forEach((result) => {
                // Use client_id from the response itself
                const clientId = result.client_id;
                if (clientId) {
                    if (result?.success && result?.envoy_version?.downloaded_versions) {
                        versionMap[clientId] = {
                            client_id: clientId,
                            downloaded_versions: result.envoy_version.downloaded_versions
                        };
                    } else {
                        versionMap[clientId] = {
                            client_id: clientId,
                            downloaded_versions: [],
                            error: result?.error || result?.envoy_version?.error_message || 'Failed to fetch versions'
                        };
                    }
                }
            });
        } catch (error) {
            console.log(error)
            // If batch request fails, mark only connected clients as error
            connectedClients.forEach(client => {
                versionMap[client.client_id] = {
                    client_id: client.client_id,
                    downloaded_versions: [],
                    error: 'Error fetching versions'
                };
            });
        }

        // For disconnected clients, mark them as offline with no versions
        const disconnectedClients = clientList.filter(client => !client.connected);
        disconnectedClients.forEach(client => {
            versionMap[client.client_id] = {
                client_id: client.client_id,
                downloaded_versions: [],
                error: 'Client offline'
            };
        });

        setClientVersions(versionMap);
        setLoadingVersions(false);
    }, []);

    const handleInterfaceSelect = useCallback((clientId: string, interfaceId: string) => {
        setSelectedInterfaces(prev => ({ ...prev, [clientId]: interfaceId }));
    }, []);

    const handleIpModeSelect = useCallback((clientId: string, ipMode: string) => {
        setSelectedIpModes(prev => ({ ...prev, [clientId]: ipMode }));
    }, []);

    const handleRedeploy = useCallback(async (client: any) => {
        // Validate downstream address
        const address = downstreamAddresses[client.client_id];
        if (!address) {
            showWarningNotification('Please enter downstream address.');
            return;
        }

        // Validate IP address
        const isValidIP = (ip: string) => {
            const ipRegex = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/;
            return ipRegex.test(ip);
        };

        if (!isValidIP(address)) {
            showWarningNotification('Please enter a valid IP address.');
            return;
        }

        // Validate OpenStack interface if needed
        const isOpenStack = client.provider === 'openstack' && client.metadata?.os_uuid && client.metadata?.os_project_id;
        if (isOpenStack && !selectedInterfaces[client.client_id]) {
            showWarningNotification('Please select an OpenStack interface.');
            return;
        }

        // Show confirmation dialog
        modal.confirm({
            title: 'Confirm Redeploy',
            icon: <ExclamationCircleOutlined style={{ color: 'var(--color-primary)' }} />,
            content: (
                <div>
                    <p>Are you sure you want to redeploy the service to <Text strong>{client.name}</Text>?</p>
                    <ul style={{ paddingLeft: 20, marginTop: 8, marginBottom: 0 }}>
                        <li>Downstream address: <Text code>{address}</Text></li>
                        {isOpenStack && selectedInterfaces[client.client_id] && (
                            <li>OpenStack interface: <Text code>{selectedInterfaces[client.client_id]}</Text></li>
                        )}
                        <li>This will restart the service on the client</li>
                    </ul>
                </div>
            ),
            okText: 'Yes, Redeploy',
            cancelText: 'Cancel',
            onOk: async () => {
                // Execute redeploy (single client deploy)
                const result = await executeAction(OperationsType.DEPLOY, [{
                    client_id: client.client_id,
                    downstream_address: address,
                    interface_id: selectedInterfaces[client.client_id] || undefined,
                    ip_mode: selectedIpModes[client.client_id] || 'fixed'
                }]);

                if (result.success) {
                    onSuccess?.();
                }
            }
        });
    }, [downstreamAddresses, selectedInterfaces, selectedIpModes, executeAction, onSuccess]);

    const handleConfirmDelete = async () => {
        setDeleteConfirmVisible(false);
        await performAction();
    };

    const handleConfirmOpenStackErrorDelete = async () => {
        setOpenStackErrorConfirmVisible(false);
        await performAction();
    };

    const performAction = async () => {
        if (action === OperationsType.DEPLOY) {
            // Only validate new clients (non-existing)
            const newClients = selectedRowKeys.filter(id => !isExistingClient(id));

            const missing = newClients.some(id => !downstreamAddresses[id]);
            if (missing) {
                showWarningNotification('Please enter downstream address for all selected clients.');
                return;
            }

            // Validate IP addresses
            const isValidIP = (ip: string) => {
                const ipRegex = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/;
                return ipRegex.test(ip);
            };

            const invalidIPs = newClients.filter(id => {
                const address = downstreamAddresses[id];
                return address && !isValidIP(address);
            });

            if (invalidIPs.length > 0) {
                showWarningNotification('Please enter valid IP addresses for all selected clients.');
                return;
            }

            // Validate OpenStack interface selection - only for new clients (non-existing)
            const openStackClients = newClients.filter(id => {
                const client = clients?.find(c => c.client_id === id);
                return client?.provider === 'openstack' && client.metadata?.os_uuid && client.metadata?.os_project_id;
            });

            const missingInterfaces = openStackClients.filter(id => !selectedInterfaces[id]);
            if (missingInterfaces.length > 0) {
                const clientNames = clients?.filter(c => missingInterfaces.includes(c.client_id))
                    .map(c => c.name)
                    .join(', ');
                showWarningNotification(`Please select OpenStack interfaces for: ${clientNames}`);
                return;
            }

            // Check version compatibility - only for new clients (non-existing)
            if (version) {
                const incompatibleClients = newClients.filter(id => {
                    const clientVersion = clientVersions[id];
                    return clientVersion &&
                        clientVersion.downloaded_versions &&
                        !clientVersion.downloaded_versions.includes(version);
                });

                if (incompatibleClients.length > 0) {
                    const clientNames = clients?.filter(c => incompatibleClients.includes(c.client_id))
                        .map(c => c.name)
                        .join(', ');
                    // Throw error to be caught by global error handler
                    throw new Error(`Cannot deploy: Version ${version} is not available on clients: ${clientNames}. Please install the version first.`);
                }
            }
        }

        // For DEPLOY: only send to new clients (non-existing)
        // For UNDEPLOY: send to all selected clients
        const clientsToProcess = action === OperationsType.DEPLOY
            ? selectedRowKeys.filter(id => !isExistingClient(id))
            : selectedRowKeys;

        const result = await executeAction(action, clientsToProcess.map(id => ({
            client_id: id,
            downstream_address: downstreamAddresses[id],
            interface_id: selectedInterfaces[id] || undefined,
            ip_mode: selectedIpModes[id] || 'fixed'
        })));

        if (!result.success) {
            return;
        }

        // Success and error handling is done by global handlers
        onSuccess?.();
        onClose();
    };

    useEffect(() => {
        if (!open) {
            setSelectedRowKeys([]);
            setDownstreamAddresses({});
            setSelectedInterfaces({});
            setSelectedIpModes({});
            setClientVersions({});
            setInterfaceData({});
            setInterfaceLoading({});
            setInterfaceErrors({});
            setDeleteConfirmVisible(false);
            setOpenStackErrorConfirmVisible(false);
        } else {
            setAction(OperationsType.DEPLOY);
            if (existingClients.length > 0) {
                const clientIds = existingClients.map(c => c.client_id);
                const addresses = Object.fromEntries(
                    existingClients.map(c => [c.client_id, c.downstream_address])
                );
                const interfaces = Object.fromEntries(
                    existingClients.filter(c => c.interface_id).map(c => [c.client_id, c.interface_id!])
                );
                const ipModes = Object.fromEntries(
                    existingClients.map(c => [c.client_id, c.ip_mode || 'fixed'])
                );

                // Only set if not already set to avoid overriding user changes
                if (selectedRowKeys.length === 0) {
                    setSelectedRowKeys(clientIds);
                }
                // Always update addresses to ensure fresh data
                setDownstreamAddresses(prev => ({ ...prev, ...addresses }));
                setSelectedInterfaces(prev => ({ ...prev, ...interfaces }));
                setSelectedIpModes(prev => ({ ...prev, ...ipModes }));
            }
        }
    }, [open, existingClients]);

    // Fetch versions when clients are loaded
    useEffect(() => {
        if (open && clients && clients.length > 0) {
            fetchClientVersions(clients);
            // Auto-fetch interfaces for OpenStack clients
            const openStackClients = clients.filter(client =>
                client.provider === 'openstack' &&
                client.metadata?.os_uuid &&
                client.metadata?.os_project_id
            );
            openStackClients.forEach(client => {
                fetchOpenStackInterfaces(client.client_id, client.metadata.os_uuid, client.metadata.os_project_id);
            });
        }
    }, [open, clients, fetchClientVersions, fetchOpenStackInterfaces]);

    // Re-apply existing client interface selections after interfaceData is loaded
    useEffect(() => {
        if (!open || existingClients.length === 0) return;

        // For each existing client with interface_id, ensure the selection is applied
        existingClients.forEach(existingClient => {
            // Always set the interface selection if it exists in existingClients
            if (existingClient.interface_id && !selectedInterfaces[existingClient.client_id]) {
                setSelectedInterfaces(prev => ({
                    ...prev,
                    [existingClient.client_id]: existingClient.interface_id!
                }));
            }

            // Also ensure IP mode is set
            if (existingClient.ip_mode && !selectedIpModes[existingClient.client_id]) {
                setSelectedIpModes(prev => ({
                    ...prev,
                    [existingClient.client_id]: existingClient.ip_mode!
                }));
            }
        });
    }, [open, interfaceData, existingClients]);

    // Handle selection when switching between DEPLOY and UNDEPLOY modes
    useEffect(() => {
        if (!clients) return;

        if (action === OperationsType.UNDEPLOY) {
            // Clear all selections when switching to Remove mode
            setSelectedRowKeys([]);
        } else if (action === OperationsType.DEPLOY) {
            // Auto-select existing clients when switching to Deploy mode
            const existingClientIds = existingClients?.map(c => c.client_id) || [];
            setSelectedRowKeys(existingClientIds);
        }
    }, [action, clients, existingClients]);

    const handleSubmit = async () => {
        if (selectedRowKeys.length === 0) {
            showWarningNotification('Please select at least one client.');
            return;
        }

        // Show confirmation modal for UNDEPLOY action
        if (action === OperationsType.UNDEPLOY) {
            // Check if any selected OpenStack clients have interface errors
            const selectedOpenStackClientsWithErrors = selectedRowKeys.filter(clientId => {
                const client = clients?.find(c => c.client_id === clientId);
                const isOpenStack = client?.provider === 'openstack' && client.metadata?.os_uuid && client.metadata?.os_project_id;
                return isOpenStack && interfaceErrors[clientId];
            });

            if (selectedOpenStackClientsWithErrors.length > 0) {
                setOpenStackErrorConfirmVisible(true);
                return;
            }

            setDeleteConfirmVisible(true);
            return;
        }

        // For DEPLOY action, proceed directly
        await performAction();
    };

    const isExistingClient = useCallback((clientId: string) =>
        existingClients.some(c => c.client_id === clientId), [existingClients]);

    const handleAddressChange = useCallback((id: string, val: string) => {
        if (action === OperationsType.UNDEPLOY || (action === OperationsType.DEPLOY && isExistingClient(id))) {
            return;
        }
        setDownstreamAddresses(prev => ({ ...prev, [id]: val }));
    }, [action, isExistingClient]);

    const isAddressEditDisabled = useCallback((id: string) =>
        action === OperationsType.UNDEPLOY || (action === OperationsType.DEPLOY && isExistingClient(id))
        , [action, isExistingClient]);

    return (
        <>
            <Drawer
                open={open}
                onClose={onClose}
                placement="right"
                width={1350}
                title={
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8
                        }}>
                            <DeployLineIcon style={{ width: 20, height: 20, color: 'var(--text-primary)' }} />
                            <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
                                Manage Service
                            </span>
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12
                        }}>
                            <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>Active Mode:</span>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <Button
                                    onClick={() => setAction(OperationsType.DEPLOY)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '4px 16px',
                                        background: action === OperationsType.DEPLOY ? 'var(--color-primary-light)' : 'var(--card-bg)',
                                        borderColor: action === OperationsType.DEPLOY ? 'var(--color-primary)' : 'var(--border-default)',
                                        color: action === OperationsType.DEPLOY ? 'var(--color-primary)' : 'var(--text-secondary)',
                                        borderRadius: '6px 0 0 6px'
                                    }}
                                >
                                    <CloudUploadOutlined style={{ fontSize: '14px', marginRight: 4 }} />
                                    Deploy
                                </Button>
                                <Button
                                    onClick={() => setAction(OperationsType.UNDEPLOY)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '4px 16px',
                                        background: action === OperationsType.UNDEPLOY ? 'var(--color-danger-light)' : 'var(--card-bg)',
                                        borderColor: action === OperationsType.UNDEPLOY ? 'var(--color-danger)' : 'var(--border-default)',
                                        color: action === OperationsType.UNDEPLOY ? 'var(--color-danger)' : 'var(--text-secondary)',
                                        borderRadius: '0 6px 6px 0',
                                        marginLeft: '-1px'
                                    }}
                                >
                                    <DeleteOutlined style={{ fontSize: '14px', marginRight: 4 }} />
                                    Remove
                                </Button>
                            </div>
                        </div>
                    </div>
                }
                footer={
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '20px 24px',
                        background: 'var(--bg-surface)',
                        borderTop: '1px solid var(--border-default)',
                        borderRadius: '0 0 12px 12px',
                        margin: '-24px -24px 0 -24px'
                    }}>
                        <div style={{ color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500 }}>
                            {selectedRowKeys.length > 0 ? (
                                <span style={{ color: 'var(--color-primary)' }}>
                                    <strong>{selectedRowKeys.length}</strong> client{selectedRowKeys.length > 1 ? 's' : ''} selected
                                </span>
                            ) : (
                                'Select clients to continue'
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <button
                                onClick={onClose}
                                style={{
                                    position: 'relative',
                                    border: 'none',
                                    cursor: 'pointer',
                                    borderRadius: 12,
                                    height: 40,
                                    minWidth: 100,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 12,
                                    fontWeight: 600,
                                    letterSpacing: '0.2px',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    background: 'var(--btn-secondary-bg)',
                                    boxShadow: 'var(--shadow-sm)',
                                    color: 'var(--text-secondary)',
                                    overflow: 'hidden',
                                    outline: 'none'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-1px) scale(1.02)';
                                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                                    e.currentTarget.style.background = 'var(--btn-secondary-hover-bg)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                                    e.currentTarget.style.background = 'var(--btn-secondary-bg)';
                                }}
                                onMouseDown={e => {
                                    e.currentTarget.style.transform = 'translateY(0) scale(0.98)';
                                }}
                                onMouseUp={e => {
                                    e.currentTarget.style.transform = 'translateY(-1px) scale(1.02)';
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={selectedRowKeys.length === 0 || loading || (action === OperationsType.DEPLOY && selectedRowKeys.every(id => isExistingClient(id)))}
                                style={{
                                    position: 'relative',
                                    border: 'none',
                                    cursor: selectedRowKeys.length === 0 || loading || (action === OperationsType.DEPLOY && selectedRowKeys.every(id => isExistingClient(id))) ? 'not-allowed' : 'pointer',
                                    borderRadius: 12,
                                    height: 40,
                                    minWidth: 140,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 12,
                                    fontWeight: 600,
                                    letterSpacing: '0.2px',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    background: action === OperationsType.UNDEPLOY ?
                                        'linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f87171 100%)' :
                                        'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #06b6d4 100%)',
                                    boxShadow: action === OperationsType.UNDEPLOY ?
                                        '0 8px 20px var(--shadow-danger-color), 0 3px 10px var(--shadow-color), inset 0 1px 0 var(--inset-light-top)' :
                                        '0 8px 20px var(--shadow-blue-color), 0 3px 10px var(--shadow-color), inset 0 1px 0 var(--inset-light-top)',
                                    color: 'var(--text-on-primary)',
                                    overflow: 'hidden',
                                    outline: 'none',
                                    opacity: selectedRowKeys.length === 0 || loading || (action === OperationsType.DEPLOY && selectedRowKeys.every(id => isExistingClient(id))) ? 0.5 : 1
                                }}
                                onMouseEnter={e => {
                                    if (selectedRowKeys.length === 0 || loading || (action === OperationsType.DEPLOY && selectedRowKeys.every(id => isExistingClient(id)))) return;
                                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
                                    e.currentTarget.style.boxShadow = action === OperationsType.UNDEPLOY ?
                                        '0 12px 30px var(--shadow-danger-color-hover), 0 6px 20px var(--shadow-color), inset 0 1px 0 var(--inset-light-top-hover)' :
                                        '0 12px 30px var(--shadow-blue-color-hover), 0 6px 20px var(--shadow-color), inset 0 1px 0 var(--inset-light-top-hover)';
                                    e.currentTarget.style.background = action === OperationsType.UNDEPLOY ?
                                        'linear-gradient(135deg, #b91c1c 0%, #dc2626 50%, #ef4444 100%)' :
                                        'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #0891b2 100%)';
                                }}
                                onMouseLeave={e => {
                                    if (selectedRowKeys.length === 0 || loading || (action === OperationsType.DEPLOY && selectedRowKeys.every(id => isExistingClient(id)))) return;
                                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                    e.currentTarget.style.boxShadow = action === OperationsType.UNDEPLOY ?
                                        '0 8px 20px var(--shadow-danger-color), 0 3px 10px var(--shadow-color), inset 0 1px 0 var(--inset-light-top)' :
                                        '0 8px 20px var(--shadow-blue-color), 0 3px 10px var(--shadow-color), inset 0 1px 0 var(--inset-light-top)';
                                    e.currentTarget.style.background = action === OperationsType.UNDEPLOY ?
                                        'linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f87171 100%)' :
                                        'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #06b6d4 100%)';
                                }}
                                onMouseDown={e => {
                                    if (selectedRowKeys.length === 0 || loading || (action === OperationsType.DEPLOY && selectedRowKeys.every(id => isExistingClient(id)))) return;
                                    e.currentTarget.style.transform = 'translateY(0) scale(0.98)';
                                }}
                                onMouseUp={e => {
                                    if (selectedRowKeys.length === 0 || loading || (action === OperationsType.DEPLOY && selectedRowKeys.every(id => isExistingClient(id)))) return;
                                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
                                }}
                            >
                                <div style={{
                                    position: 'absolute',
                                    top: '1px',
                                    left: 0,
                                    right: 0,
                                    height: '40%',
                                    background: 'linear-gradient(180deg, var(--inset-light-top-hover) 0%, transparent 100%)',
                                    borderRadius: '12px 12px 0 0',
                                    zIndex: 1
                                }} />
                                <span style={{
                                    fontSize: 12,
                                    fontWeight: 600,
                                    letterSpacing: '0.2px',
                                    textShadow: '0 1px 2px var(--shadow-text)',
                                    zIndex: 1,
                                    whiteSpace: 'nowrap'
                                }}>
                                    {loading ? 'Processing...' : (action === OperationsType.DEPLOY ? 'Deploy Service' : 'Remove Service')}
                                </span>
                            </button>
                        </div>
                    </div>
                }
            >
                {clientsError && (
                    <Alert
                        type="error"
                        message="Client list could not be loaded."
                        showIcon
                        style={{
                            marginBottom: 16,
                            borderRadius: 8
                        }}
                    />
                )}
                <div style={{
                    background: 'var(--bg-surface)',
                    borderRadius: 10,
                    marginBottom: 10,
                    maxWidth: '100%',
                    height: 'calc(100vh - 200px)',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <div style={{
                        fontSize: 13,
                        color: 'var(--text-secondary)',
                        marginBottom: 12,
                        padding: '16px 16px 0'
                    }}>
                        {action === OperationsType.DEPLOY ?
                            'Select clients to deploy the service and specify downstream addresses.' :
                            'Select clients to undeploy the service from.'
                        }
                        {action === OperationsType.DEPLOY && version && Object.keys(clientVersions).length > 0 && (
                            (() => {
                                const incompatibleClients = clients?.filter(c => {
                                    // Only check online clients for version compatibility
                                    if (!c.connected) return false;

                                    const versionInfo = clientVersions[c.client_id];
                                    return versionInfo?.downloaded_versions && !versionInfo.downloaded_versions.includes(version);
                                });

                                if (incompatibleClients && incompatibleClients.length > 0) {
                                    return (
                                        <Alert
                                            type="warning"
                                            showIcon
                                            message={`${incompatibleClients.length} client(s) don't have version ${version} installed`}
                                            description="These clients are disabled for deployment. Install the required version first."
                                            style={{
                                                marginTop: 12,
                                                borderRadius: 6,
                                                fontSize: 12
                                            }}
                                        />
                                    );
                                }
                                return null;
                            })()
                        )}
                        {Object.keys(interfaceErrors).length > 0 && (
                            (() => {
                                const errorClients = clients?.filter(c => interfaceErrors[c.client_id]);

                                if (errorClients && errorClients.length > 0) {
                                    // Get the first error message as representative
                                    const firstErrorMessage = Object.values(interfaceErrors)[0];

                                    return (
                                        <Alert
                                            type="warning"
                                            showIcon
                                            message={`${errorClients.length} OpenStack client(s) have interface connection errors`}
                                            description={firstErrorMessage}
                                            style={{
                                                marginTop: 12,
                                                borderRadius: 6,
                                                fontSize: 12,
                                                marginBottom: 12
                                            }}
                                        />
                                    );
                                }
                                return null;
                            })()
                        )}
                    </div>
                    <ClientListTable
                        clients={clients}
                        selectedRowKeys={selectedRowKeys}
                        onSelectChange={setSelectedRowKeys}
                        downstreamAddresses={downstreamAddresses}
                        onAddressChange={handleAddressChange}
                        loading={clientsLoading || loadingVersions}
                        disabledAddressEdit={isAddressEditDisabled}
                        rowSelection={{
                            selectedRowKeys,
                            onChange: setSelectedRowKeys,
                            getCheckboxProps: (record: any) => {
                                const versionInfo = clientVersions[record.client_id];
                                const isVersionIncompatible = action === OperationsType.DEPLOY &&
                                    version &&
                                    versionInfo?.downloaded_versions &&
                                    !versionInfo.downloaded_versions.includes(version);

                                // Check if OpenStack client has no interfaces available
                                const isOpenStack = record.provider === 'openstack' && record.metadata?.os_uuid && record.metadata?.os_project_id;
                                const hasNoInterfaces = isOpenStack &&
                                    !interfaceLoading[record.client_id] &&
                                    (!interfaceData[record.client_id] || interfaceData[record.client_id].length === 0);
                                const hasInterfaceError = isOpenStack && interfaceErrors[record.client_id];

                                return {
                                    disabled: (action === OperationsType.UNDEPLOY && !isExistingClient(record.client_id)) ||
                                        (action === OperationsType.DEPLOY && isExistingClient(record.client_id)) ||
                                        !record.connected ||
                                        isVersionIncompatible ||
                                        (action === OperationsType.DEPLOY && (hasNoInterfaces || hasInterfaceError))
                                };
                            }
                        }}
                        clientVersions={clientVersions}
                        serviceVersion={version}
                        actionType={action}
                        onInterfaceSelect={handleInterfaceSelect}
                        interfaceData={interfaceData}
                        interfaceLoading={interfaceLoading}
                        selectedInterfaces={selectedInterfaces}
                        onIpModeSelect={handleIpModeSelect}
                        selectedIpModes={selectedIpModes}
                        interfaceErrors={interfaceErrors}
                        onRedeploy={handleRedeploy}
                        existingClients={existingClients}
                    />
                </div>
            </Drawer>

            {/* Delete Confirmation Modal */}
            <Modal
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <ExclamationCircleOutlined style={{ color: 'var(--color-danger)', fontSize: 20 }} />
                        <span>Confirm Service Removal</span>
                    </div>
                }
                open={deleteConfirmVisible}
                onCancel={() => setDeleteConfirmVisible(false)}
                onOk={handleConfirmDelete}
                okText="Remove Service"
                cancelText="Cancel"
                okButtonProps={{
                    danger: true,
                    loading: loading,
                    style: { fontWeight: 500 }
                }}
                cancelButtonProps={{
                    style: { fontWeight: 500 }
                }}
                width={500}
            >
                <div style={{ marginTop: 16 }}>
                    <p style={{ marginBottom: 16, color: 'var(--text-primary)', fontSize: 14 }}>
                        This service will be removed from the following <strong>{selectedRowKeys.length}</strong> client{selectedRowKeys.length > 1 ? 's' : ''}:
                    </p>
                    <div style={{
                        maxHeight: 200,
                        overflowY: 'auto',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-default)',
                        borderRadius: 6,
                        padding: 12
                    }}>
                        {selectedRowKeys.map((clientId, index) => {
                            const client = clients?.find(c => c.client_id === clientId);
                            return (
                                <div key={clientId} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    marginBottom: index === selectedRowKeys.length - 1 ? 0 : 8,
                                    padding: '6px 8px',
                                    background: 'var(--card-bg)',
                                    border: '1px solid var(--border-default)',
                                    borderRadius: 4,
                                    fontSize: 13
                                }}>
                                    <span style={{
                                        display: 'inline-block',
                                        width: 6,
                                        height: 6,
                                        borderRadius: '50%',
                                        background: 'var(--color-danger)'
                                    }} />
                                    <span style={{ fontWeight: 500 }}>{client?.name || clientId}</span>
                                    <span style={{ color: 'var(--text-tertiary)', fontSize: 11, marginLeft: 'auto' }}>
                                        {client?.hostname}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                    <div style={{
                        marginTop: 16,
                        padding: 12,
                        background: 'var(--color-danger-light)',
                        border: '1px solid var(--color-danger-border)',
                        borderRadius: 6
                    }}>
                        <p style={{ margin: 0, color: 'var(--color-danger)', fontSize: 13, fontWeight: 500 }}>
                            ⚠️ This action cannot be undone. Are you sure you want to continue?
                        </p>
                    </div>
                </div>
            </Modal>

            {/* OpenStack Error Confirmation Modal */}
            <Modal
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <ExclamationCircleOutlined style={{ color: 'var(--color-warning)' }} />
                        <span>OpenStack Connection Warning</span>
                    </div>
                }
                open={openStackErrorConfirmVisible}
                onCancel={() => setOpenStackErrorConfirmVisible(false)}
                onOk={handleConfirmOpenStackErrorDelete}
                okText="Yes, Remove Anyway"
                cancelText="Cancel"
                okButtonProps={{
                    danger: true,
                    loading: loading,
                    style: { fontWeight: 500 }
                }}
                cancelButtonProps={{
                    style: { fontWeight: 500 }
                }}
                width={600}
            >
                <div style={{ marginTop: 16 }}>
                    <div style={{
                        padding: 16,
                        background: 'var(--color-warning-light)',
                        border: '1px solid var(--color-warning-border)',
                        borderRadius: 8,
                        marginBottom: 16
                    }}>
                        <div style={{ color: 'var(--color-warning-dark)', fontWeight: 600, marginBottom: 8 }}>
                            ⚠️ OpenStack Connection Problem
                        </div>
                        <p style={{ margin: 0, color: 'var(--color-warning-dark)', fontSize: 14 }}>
                            Cannot connect to OpenStack, so IP addresses cannot be cleaned from OpenStack infrastructure.
                        </p>
                    </div>

                    <p style={{ marginBottom: 16, color: 'var(--text-primary)', fontSize: 14 }}>
                        Selected OpenStack clients have interface connection errors.
                        Service will be removed but <strong>IP addresses cannot be cleaned from OpenStack</strong>.
                    </p>

                    <div style={{
                        maxHeight: 150,
                        overflowY: 'auto',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-default)',
                        borderRadius: 6,
                        padding: 12
                    }}>
                        {selectedRowKeys.map((clientId) => {
                            const client = clients?.find(c => c.client_id === clientId);
                            const isOpenStack = client?.provider === 'openstack' && client.metadata?.os_uuid && client.metadata?.os_project_id;
                            const hasError = isOpenStack && interfaceErrors[clientId];

                            if (!hasError) return null;

                            return (
                                <div key={clientId} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    marginBottom: 8,
                                    padding: '6px 8px',
                                    background: 'var(--card-bg)',
                                    border: '1px solid var(--border-default)',
                                    borderRadius: 4,
                                    fontSize: 13
                                }}>
                                    <span style={{
                                        display: 'inline-block',
                                        width: 6,
                                        height: 6,
                                        borderRadius: '50%',
                                        background: 'var(--color-warning)'
                                    }} />
                                    <span style={{ fontWeight: 500 }}>{client?.name || clientId}</span>
                                    <span style={{ color: 'var(--text-tertiary)', fontSize: 11, marginLeft: 'auto' }}>
                                        OpenStack Error
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    <div style={{
                        marginTop: 16,
                        padding: 12,
                        background: 'var(--color-danger-light)',
                        border: '1px solid var(--color-danger-border)',
                        borderRadius: 6
                    }}>
                        <p style={{ margin: 0, color: 'var(--color-danger)', fontSize: 13, fontWeight: 500 }}>
                            ⚠️ Do you still want to remove the service anyway?
                        </p>
                    </div>
                </div>
            </Modal>
        </>
    );
} 