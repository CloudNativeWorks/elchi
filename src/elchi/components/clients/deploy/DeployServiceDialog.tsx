import { useState, useEffect, useCallback } from 'react';
import { Drawer, Button, message, Alert } from 'antd';
import { ClientListTable } from './ClientListTable';
import { useDeployUndeployService } from '@/hooks/useServiceActions';
import { OperationsType } from '@/common/types';
import { useCustomGetQuery, api } from '@/common/api';
import { DeployLineIcon } from '@/assets/svg/icons';
import { CloudUploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { useProjectVariable } from '@/hooks/useProjectVariable';


interface DeployServiceDialogProps {
    open: boolean;
    onClose: () => void;
    serviceName: string;
    project: string;
    action: OperationsType;
    existingClients: Array<{ client_id: string; downstream_address: string; interface_id?: string }>;
    onSuccess?: () => void;
    version?: string;
}

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

export function DeployServiceDialog({ open, onClose, serviceName, project, action: initialAction, existingClients, onSuccess, version }: DeployServiceDialogProps) {
    const { project: currentProject } = useProjectVariable();
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [downstreamAddresses, setDownstreamAddresses] = useState<Record<string, string>>({});
    const [selectedInterfaces, setSelectedInterfaces] = useState<Record<string, string>>({});
    const [action, setAction] = useState<OperationsType>(initialAction);
    const [messageApi, contextHolder] = message.useMessage();
    const [clientVersions, setClientVersions] = useState<Record<string, ClientVersionInfo>>({});
    const [loadingVersions, setLoadingVersions] = useState(false);
    const [interfaceData, setInterfaceData] = useState<Record<string, OpenStackInterface[]>>({});
    const [interfaceLoading, setInterfaceLoading] = useState<Record<string, boolean>>({});

    const { executeAction, loading } = useDeployUndeployService({
        name: serviceName,
        project,
        version
    });

    const { data: clients, error: clientsError, isLoading: clientsLoading } = useCustomGetQuery({
        queryKey: `client_list_${project}_${version}`,
        enabled: open && !!project,
        path: `api/op/clients?project=${project}${version ? `&version=${version}` : ''}`,
        directApi: true
    });

    const fetchOpenStackInterfaces = useCallback(async (clientId: string, osUuid: string, osProjectId: string) => {
        setInterfaceLoading(prev => ({ ...prev, [clientId]: true }));
        
        try {
            const response = await api.get(`/api/op/clients/${clientId}/openstack/interfaces?os_uuid=${osUuid}&osp_project=${osProjectId}&project=${currentProject}`);
            if (response.data?.data) {
                setInterfaceData(prev => ({ ...prev, [clientId]: response.data.data }));
            }
        } catch (error: any) {
            console.error('Error fetching OpenStack interfaces:', error);
            setInterfaceData(prev => ({ ...prev, [clientId]: [] }));
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
            
            const response = await api.post('/api/op/clients', payload);
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

    useEffect(() => {
        if (!open) {
            setSelectedRowKeys([]);
            setDownstreamAddresses({});
            setSelectedInterfaces({});
            setClientVersions({});
            setInterfaceData({});
            setInterfaceLoading({});
        } else {
            setAction(OperationsType.DEPLOY);
            if (existingClients.length > 0 && selectedRowKeys.length === 0) {
                const clientIds = existingClients.map(c => c.client_id);
                const addresses = Object.fromEntries(
                    existingClients.map(c => [c.client_id, c.downstream_address])
                );
                const interfaces = Object.fromEntries(
                    existingClients.filter(c => c.interface_id).map(c => [c.client_id, c.interface_id!])
                );
                setSelectedRowKeys(clientIds);
                setDownstreamAddresses(addresses);
                setSelectedInterfaces(interfaces);
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

    const handleSubmit = async () => {
        if (selectedRowKeys.length === 0) {
            messageApi.warning('Please select at least one client.');
            return;
        }

        if (action === OperationsType.DEPLOY) {
            const missing = selectedRowKeys.some(id => !downstreamAddresses[id]);
            if (missing) {
                messageApi.warning('Please enter downstream address for all selected clients.');
                return;
            }

            // Validate IP addresses
            const isValidIP = (ip: string) => {
                const ipRegex = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/;
                return ipRegex.test(ip);
            };

            const invalidIPs = selectedRowKeys.filter(id => {
                const address = downstreamAddresses[id];
                return address && !isValidIP(address);
            });

            if (invalidIPs.length > 0) {
                messageApi.error('Please enter valid IP addresses for all selected clients.');
                return;
            }

            // Validate OpenStack interface selection
            const openStackClients = selectedRowKeys.filter(id => {
                const client = clients?.find(c => c.client_id === id);
                return client?.provider === 'openstack' && client.metadata?.os_uuid && client.metadata?.os_project_id;
            });

            const missingInterfaces = openStackClients.filter(id => !selectedInterfaces[id]);
            if (missingInterfaces.length > 0) {
                const clientNames = clients?.filter(c => missingInterfaces.includes(c.client_id))
                                          .map(c => c.name)
                                          .join(', ');
                messageApi.error(`Please select OpenStack interfaces for: ${clientNames}`);
                return;
            }

            // Check version compatibility
            if (version) {
                const incompatibleClients = selectedRowKeys.filter(id => {
                    const clientVersion = clientVersions[id];
                    return clientVersion && 
                           clientVersion.downloaded_versions && 
                           !clientVersion.downloaded_versions.includes(version);
                });

                if (incompatibleClients.length > 0) {
                    const clientNames = clients?.filter(c => incompatibleClients.includes(c.client_id))
                                               .map(c => c.name)
                                               .join(', ');
                    messageApi.error(`Cannot deploy: Version ${version} is not available on clients: ${clientNames}. Please install the version first.`);
                    return;
                }
            }
        }

        try {
            const result = await executeAction(action, selectedRowKeys.map(id => ({
                client_id: id,
                downstream_address: downstreamAddresses[id],
                interface_id: selectedInterfaces[id] || undefined
            })));

            if (!result.success) {
                messageApi.error(result.error);
                return;
            }

            messageApi.success(action === OperationsType.DEPLOY ? 'Deploy Success!' : 'Remove Success!');
            onSuccess?.();
            onClose();
        } catch (
        // eslint-disable-next-line no-unused-vars
        error
        ) {
            messageApi.error('Operation failed. Please try again.');
        }
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
            {contextHolder}
            <Drawer
                open={open}
                onClose={onClose}
                placement="right"
                width={1200}
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
                            <DeployLineIcon style={{ width: 20, height: 20, color: '#262626' }} />
                            <span style={{ fontSize: 16, fontWeight: 600, color: '#262626' }}>
                                Manage Service
                            </span>
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12
                        }}>
                            <span style={{ fontSize: 14, color: '#262626' }}>Active Mode:</span>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <Button
                                    onClick={() => setAction(OperationsType.DEPLOY)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '4px 16px',
                                        background: action === OperationsType.DEPLOY ? '#e6f4ff' : '#fff',
                                        borderColor: action === OperationsType.DEPLOY ? '#1890ff' : '#d9d9d9',
                                        color: action === OperationsType.DEPLOY ? '#1890ff' : '#595959',
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
                                        background: action === OperationsType.UNDEPLOY ? '#fff1f0' : '#fff',
                                        borderColor: action === OperationsType.UNDEPLOY ? '#ff4d4f' : '#d9d9d9',
                                        color: action === OperationsType.UNDEPLOY ? '#ff4d4f' : '#595959',
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
                        justifyContent: 'flex-end',
                        gap: 8,
                        padding: '16px 0'
                    }}>
                        <Button
                            onClick={onClose}
                            style={{ borderRadius: 6 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            danger={action === OperationsType.UNDEPLOY}
                            loading={loading}
                            onClick={handleSubmit}
                            style={{
                                borderRadius: 6,
                                fontWeight: 500,
                                color: '#fff',
                                background: action === OperationsType.UNDEPLOY ?
                                    'linear-gradient(90deg,rgba(233, 13, 13, 0.86) 0%,rgba(251, 130, 130, 0.76) 100%)' :
                                    'linear-gradient(90deg, #056ccd 0%, #00c6fb 100%)',
                                boxShadow: action === OperationsType.UNDEPLOY ?
                                    '0 1px 2px rgba(255,77,79,0.2)' :
                                    '0 1px 2px rgba(24,144,255,0.2)'
                            }}
                        >
                            {action === OperationsType.DEPLOY ? 'Deploy' : 'Remove'}
                        </Button>
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
                    background: '#fafafa',
                    borderRadius: 10,
                    marginBottom: 10,
                    maxWidth: '100%',
                    minHeight: 550
                }}>
                    <div style={{
                        fontSize: 13,
                        color: '#666',
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
                                
                                return {
                                    disabled: (action === OperationsType.UNDEPLOY && !isExistingClient(record.client_id)) || 
                                            !record.connected || 
                                            isVersionIncompatible ||
                                            hasNoInterfaces
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
                        fetchOpenStackInterfaces={fetchOpenStackInterfaces}
                    />
                </div>
            </Drawer>
        </>
    );
} 