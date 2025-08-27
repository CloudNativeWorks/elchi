import { useState, useEffect, useCallback } from 'react';
import { Modal, Button, message, Alert } from 'antd';
import { ClientListTable } from './ClientListTable';
import { useDeployUndeployService } from '@/hooks/useServiceActions';
import { OperationsType } from '@/common/types';
import { useCustomGetQuery, api } from '@/common/api';
import { DeployLineIcon } from '@/assets/svg/icons';
import { CloudUploadOutlined, DeleteOutlined } from '@ant-design/icons';


interface DeployServiceDialogProps {
    open: boolean;
    onClose: () => void;
    serviceName: string;
    project: string;
    action: OperationsType;
    existingClients: Array<{ client_id: string; downstream_address: string }>;
    onSuccess?: () => void;
    version?: string;
}

interface ClientVersionInfo {
    client_id: string;
    downloaded_versions?: string[];
    error?: string;
}

export function DeployServiceDialog({ open, onClose, serviceName, project, action: initialAction, existingClients, onSuccess, version }: DeployServiceDialogProps) {
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [downstreamAddresses, setDownstreamAddresses] = useState<Record<string, string>>({});
    const [action, setAction] = useState<OperationsType>(initialAction);
    const [messageApi, contextHolder] = message.useMessage();
    const [clientVersions, setClientVersions] = useState<Record<string, ClientVersionInfo>>({});
    const [loadingVersions, setLoadingVersions] = useState(false);

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

    // Fetch available versions for all clients in a single batch request
    const fetchClientVersions = useCallback(async (clientList: any[]) => {
        if (!clientList || clientList.length === 0) return;
        
        setLoadingVersions(true);
        const versionMap: Record<string, ClientVersionInfo> = {};
        
        try {
            // Send batch request for all clients at once
            const payload = {
                type: "ENVOY_VERSION",
                clients: clientList.map(client => ({
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
            // If batch request fails, mark all clients as error
            clientList.forEach(client => {
                versionMap[client.client_id] = {
                    client_id: client.client_id,
                    downloaded_versions: [],
                    error: 'Error fetching versions'
                };
            });
        }
        
        setClientVersions(versionMap);
        setLoadingVersions(false);
    }, []);

    useEffect(() => {
        if (!open) {
            setSelectedRowKeys([]);
            setDownstreamAddresses({});
            setClientVersions({});
        } else {
            setAction(OperationsType.DEPLOY);
            if (existingClients.length > 0 && selectedRowKeys.length === 0) {
                const clientIds = existingClients.map(c => c.client_id);
                const addresses = Object.fromEntries(
                    existingClients.map(c => [c.client_id, c.downstream_address])
                );
                setSelectedRowKeys(clientIds);
                setDownstreamAddresses(addresses);
            }
        }
    }, [open, existingClients]);

    // Fetch versions when clients are loaded
    useEffect(() => {
        if (open && clients && clients.length > 0) {
            fetchClientVersions(clients);
        }
    }, [open, clients, fetchClientVersions]);

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
                downstream_address: downstreamAddresses[id]
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
            <Modal
                open={open}
                onCancel={onClose}
                closeIcon={null}
                title={
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        padding: '10px',
                        margin: '0px 0px 0px',
                        borderBottom: '1px solid #f0f0f0',
                        background: '#fff',
                        borderRadius: '12px 12px 0 0'
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
                            gap: 12,
                            padding: '4px 12px',
                        }}><span style={{ fontSize: 14, color: '#262626' }}>Active Mode: </span>
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
                        margin: '0',
                        padding: '12px 16px',
                        background: '#fafafa',
                        borderTop: '1px solid #f0f0f0',
                        borderRadius: '0 0 12px 12px'
                    }}>
                        <Button
                            key="cancel"
                            onClick={onClose}
                            style={{
                                borderRadius: 6,
                                marginRight: 8,
                                border: '1px solid #d9d9d9'
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            key="submit"
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
                width={1100}
                styles={{
                    content: {
                        padding: 0,
                        overflow: 'hidden',
                        borderRadius: 12
                    },
                    body: {
                        padding: '8px'
                    },
                    header: {
                        padding: 0,
                        border: 'none'
                    },
                    footer: {
                        padding: 0,
                        border: 'none'
                    }
                }}
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
                                
                                return {
                                    disabled: (action === OperationsType.UNDEPLOY && !isExistingClient(record.client_id)) || 
                                            !record.connected || 
                                            isVersionIncompatible
                                };
                            }
                        }}
                        clientVersions={clientVersions}
                        serviceVersion={version}
                        actionType={action}
                    />
                </div>
            </Modal>
        </>
    );
} 