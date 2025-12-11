import React, { useState, useMemo } from 'react';
import { Table, Button, Popconfirm, Descriptions, Tag, Typography } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import ModernAddRoutingPolicyCard from './ModernAddRoutingPolicyCard';
import { showErrorNotification, showWarningNotification } from '@/common/notificationHandler';

const { Text } = Typography;
import { useNetworkOperations, PolicyOperation, RoutingPolicy, InterfaceState, RoutingTableDefinition } from '@/hooks/useNetworkOperations';

// Extended type with unique ID
interface PolicyWithId extends RoutingPolicy {
    _uniqueId: string;
    _originalIndex: number;
}

interface RoutingPolicyContentProps {
    clientId: string;
    policies: RoutingPolicy[];
    loading: boolean;
    interfaces: InterfaceState[];
    routingTables: RoutingTableDefinition[];
    onRefresh?: () => void;
}

const RoutingPolicyContent: React.FC<RoutingPolicyContentProps> = ({ clientId, policies, loading, interfaces, routingTables, onRefresh }) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const { managePolicies } = useNetworkOperations();
    const [actionLoading, setActionLoading] = useState(false);

    // Add unique IDs to policies to avoid duplicate key issues
    const policiesWithIds = useMemo<PolicyWithId[]>(() => {
        return policies.map((policy, index) => ({
            ...policy,
            _uniqueId: `policy-${index}-${Date.now()}`,
            _originalIndex: index
        }));
    }, [policies]);

    const handleAddPolicy = () => {
        setShowAddForm(true);
    };

    const handleCancelAdd = () => {
        setShowAddForm(false);
    };

    const handleSavePolicy = async (values: any) => {
        setActionLoading(true);
        try {
            // values: { policies: [{ from, to, table, priority, interface }] }
            const policyOperations: PolicyOperation[] = (values.policies || []).map((policy: any) => ({
                action: 'ADD',
                policy: {
                    ...(policy.from && { from: policy.from }),
                    ...(policy.to && { to: policy.to }),
                    table: Number(policy.table),
                    priority: policy.priority || 100,
                    interface: policy.interface
                }
            }));

            const response = await managePolicies(clientId, policyOperations);

            if (response.success) {
                // Only close form and refresh on success
                setShowAddForm(false);
                onRefresh?.();
            } else {
                // If response.success is false, show error but don't close form
                const errorMessage = response.message || response.error || 'Policy operation failed';
                showErrorNotification(errorMessage);
            }
        } catch (error: any) {
            // Check for detailed error message in multiple locations
            let errorMessage = 'Failed to add routing policy';

            // Check response.data.message first (backend validation errors)
            if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            // Check direct response.message 
            else if (error?.response?.message) {
                errorMessage = error.response.message;
            }
            // Check general error.message
            else if (error?.message) {
                errorMessage = error.message;
            }

            showErrorNotification(errorMessage);
        } finally {
            setActionLoading(false);
        }
    };

    const handleBatchRemove = async () => {
        if (selectedRowKeys.length === 0) {
            showWarningNotification('Please select policies to remove');
            return;
        }
        setActionLoading(true);
        try {
            // Convert to new policy operations format
            const policyOperations: PolicyOperation[] = selectedRowKeys.map((key) => {
                // Find the actual policy from the list using the unique ID
                const policyWithId = policiesWithIds.find(p => p._uniqueId === key);

                if (!policyWithId) {
                    throw new Error(`Policy not found for key: ${key}`);
                }

                return {
                    action: 'DELETE',
                    policy: {
                        ...(policyWithId.from && { from: policyWithId.from }),
                        ...(policyWithId.to && { to: policyWithId.to }),
                        table: Number(policyWithId.table),
                        priority: policyWithId.priority || 100,
                        interface: policyWithId.interface
                    }
                };
            });

            await managePolicies(clientId, policyOperations);

            // Global notification system will handle both success and safety notifications

            setSelectedRowKeys([]);
            onRefresh?.();
        } catch (error: any) {
            // Check for detailed error message in multiple locations
            let errorMessage = 'Failed to remove policies';

            // Check response.data.message first (backend validation errors)
            if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            // Check direct response.message
            else if (error?.response?.message) {
                errorMessage = error.response.message;
            }
            // Check general error.message
            else if (error?.message) {
                errorMessage = error.message;
            }

            showErrorNotification(errorMessage);
        } finally {
            setActionLoading(false);
        }
    };

    // Show add form when requested
    if (showAddForm) {
        return (
            <ModernAddRoutingPolicyCard
                interfaces={interfaces}
                routingTables={routingTables}
                onCancel={handleCancelAdd}
                onSave={handleSavePolicy}
            />
        );
    }

    const columns = [
        {
            title: 'From',
            dataIndex: 'from',
            key: 'from',
            width: '35%',
            render: (text: string) => (
                <Text style={{ fontFamily: 'monospace' }}>
                    {text || <Text type="secondary">any</Text>}
                </Text>
            ),
        },
        {
            title: 'To',
            dataIndex: 'to',
            key: 'to',
            width: '35%',
            render: (text: string) => (
                <Text style={{ fontFamily: 'monospace' }}>
                    {text || <Text type="secondary">any</Text>}
                </Text>
            ),
        },
        {
            title: 'Table',
            dataIndex: 'table',
            key: 'table',
            width: '30%',
            render: (tableId: number) => {
                const table = routingTables.find(t => t.id === tableId);
                return (
                    <div>
                        <Text strong style={{ fontFamily: 'monospace' }}>{tableId}</Text>
                        {table && <Text type="secondary" style={{ marginLeft: 8 }}>({table.name})</Text>}
                    </div>
                );
            },
        },
    ];

    const expandedRowRender = (record: any) => (
        <div style={{ padding: '16px 0', background: '#fafafa' }}>
            <Descriptions size="small" column={2} bordered>
                <Descriptions.Item label="Priority">
                    <Text style={{ fontFamily: 'monospace' }}>
                        {record.priority || <Text type="secondary">default</Text>}
                    </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Interface">
                    <Text style={{ fontFamily: 'monospace' }}>
                        {record.interface || <Text type="secondary">none</Text>}
                    </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Rule Type">
                    <Tag color="blue">Policy-based routing</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                    <Tag color="green">Active</Tag>
                </Descriptions.Item>
            </Descriptions>
        </div>
    );

    const rowSelection = {
        selectedRowKeys,
        onChange: (newSelectedRowKeys: React.Key[]) => {
            setSelectedRowKeys(newSelectedRowKeys);
        },
    };

    return (
        <div>
            <div style={{
                marginBottom: 16,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Popconfirm
                        title="Remove selected routing policies?"
                        description={`Are you sure you want to remove ${selectedRowKeys.length} routing policy(ies)? This action cannot be undone.`}
                        onConfirm={handleBatchRemove}
                        okText="Yes, Remove"
                        cancelText="Cancel"
                        disabled={selectedRowKeys.length === 0 || actionLoading}
                    >
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            disabled={selectedRowKeys.length === 0 || actionLoading}
                            style={{
                                borderRadius: 8,
                            }}
                            loading={actionLoading}
                        >
                            Remove Selected {selectedRowKeys.length > 0 && `(${selectedRowKeys.length})`}
                        </Button>
                    </Popconfirm>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddPolicy}
                    style={{
                        background: 'linear-gradient(90deg, #056ccd 0%, #00c6fb 100%)',
                        border: 'none',
                        borderRadius: 8,
                        fontWeight: 500,
                        boxShadow: '0 2px 8px rgba(0,198,251,0.10)',
                    }}
                    className="modern-add-btn"
                    loading={actionLoading}
                >
                    Add Policy
                </Button>
            </div>
            <Table
                rowSelection={rowSelection}
                dataSource={policiesWithIds}
                columns={columns}
                rowKey={(record) => record._uniqueId}
                loading={loading || actionLoading}
                pagination={false}
                size="middle"
                expandable={{
                    expandedRowRender,
                    expandRowByClick: false,
                    rowExpandable: () => true, // All rows can be expanded
                }}
                style={{
                    background: '#fff',
                    borderRadius: 12,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}
            />
        </div>
    );
};

export default RoutingPolicyContent; 