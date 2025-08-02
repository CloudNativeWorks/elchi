import { useState, useEffect } from 'react';
import { Modal, Button, message, Alert } from 'antd';
import { ClientListTable } from './ClientListTable';
import { useDeployUndeployService } from '@/hooks/useServiceActions';
import { OperationsType } from '@/common/types';
import { useCustomGetQuery } from '@/common/api';
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
}

export function DeployServiceDialog({ open, onClose, serviceName, project, action: initialAction, existingClients, onSuccess }: DeployServiceDialogProps) {
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [downstreamAddresses, setDownstreamAddresses] = useState<Record<string, string>>({});
    const [action, setAction] = useState<OperationsType>(initialAction);
    const [messageApi, contextHolder] = message.useMessage();

    const { executeAction, loading } = useDeployUndeployService({
        name: serviceName,
        project
    });

    const { data: clients, error: clientsError, isLoading: clientsLoading } = useCustomGetQuery({
        queryKey: `client_list_${project}`,
        enabled: open && !!project,
        path: `api/op/clients?project=${project}`,
        directApi: true
    });

    useEffect(() => {
        if (!open) {
            setSelectedRowKeys([]);
            setDownstreamAddresses({});
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

    const isExistingClient = (clientId: string) =>
        existingClients.some(c => c.client_id === clientId);

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
                width={800}
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
                    minHeight: 400
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
                    </div>
                    <ClientListTable
                        clients={clients}
                        selectedRowKeys={selectedRowKeys}
                        onSelectChange={setSelectedRowKeys}
                        downstreamAddresses={downstreamAddresses}
                        onAddressChange={(id, val) => {
                            if (action === OperationsType.UNDEPLOY || (action === OperationsType.DEPLOY && isExistingClient(id))) {
                                return;
                            }
                            setDownstreamAddresses(prev => ({ ...prev, [id]: val }));
                        }}
                        loading={clientsLoading}
                        disabledAddressEdit={(id) => action === OperationsType.UNDEPLOY || (action === OperationsType.DEPLOY && isExistingClient(id))}
                        rowSelection={{
                            selectedRowKeys,
                            onChange: setSelectedRowKeys,
                            getCheckboxProps: (record: any) => ({
                                disabled: (action === OperationsType.UNDEPLOY && !isExistingClient(record.client_id)) || !record.connected
                            })
                        }}
                    />
                </div>
            </Modal>
        </>
    );
} 