import React, { useState } from 'react';
import { Table, Button, message, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import AddRoutingPolicyCard from './AddRoutingPolicyCard';
import { useNetworkOperations } from '@/hooks/useNetworkOperations';

interface RoutingPolicyContentProps {
    clientId: string;
    policies: any[];
    loading: boolean;
    routingTables: { name: string; table: number; }[];
    onRefresh?: () => void;
}

const RoutingPolicyContent: React.FC<RoutingPolicyContentProps> = ({ clientId, policies, loading, routingTables, onRefresh }) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const { addRoutingPolicy, removeRoutingPolicy } = useNetworkOperations();
    const [actionLoading, setActionLoading] = useState(false);

    const handleAddPolicy = () => {
        setShowAddForm(true);
    };

    const handleCancelAdd = () => {
        setShowAddForm(false);
    };

    const handleSavePolicy = async (values: any) => {
        setActionLoading(true);
        try {
            // values: { policies: [{ from, to, table, interface }] }
            const interfacesMap: { [ifname: string]: any[] } = {};
            (values.policies || []).forEach((policy: any) => {
                if (!policy.interface) return;
                if (!interfacesMap[policy.interface]) interfacesMap[policy.interface] = [];
                interfacesMap[policy.interface].push({
                    ...(policy.from ? { from: policy.from } : {}),
                    ...(policy.to ? { to: policy.to } : {}),
                    table: Number(policy.table)
                });
            });
            const interfaces = Object.entries(interfacesMap).map(([ifname, routing_policies]) => ({ ifname, routing_policies }));
            await addRoutingPolicy(clientId, interfaces);
            message.success('Routing policy added successfully!');
            setShowAddForm(false);
            onRefresh?.(); // Refresh data after adding policy
        } catch (error: any) {
            message.error('Failed to add routing policy: ' + (error?.message || error));
        } finally {
            setActionLoading(false);
        }
    };

    const handleBatchRemove = async () => {
        if (selectedRowKeys.length === 0) {
            message.warning('Please select policies to remove');
            return;
        }
        setActionLoading(true);
        try {
            // selectedRowKeys: ["interface-from-table"] veya ["interface-to-table"] 
            // policies: [{ interface, from, to, table }]
            const toRemove = selectedRowKeys.map((key) => {
                // Find the actual policy from the list
                const policy = policies.find(p => 
                    `${p.interface}-${p.from || 'any'}-${p.to || 'any'}-${p.table}` === key
                );
                
                if (!policy) {
                    console.error('Policy not found for key:', key);
                    return null;
                }
                
                return {
                    ifname: policy.interface,
                    routing_policies: [
                        {
                            ...(policy.from ? { from: policy.from } : {}),
                            ...(policy.to ? { to: policy.to } : {}),
                            table: Number(policy.table)
                        }
                    ]
                };
            }).filter(Boolean); // Remove null entries
            
            await removeRoutingPolicy(clientId, toRemove);
            message.success(`${selectedRowKeys.length} policies removed successfully!`);
            setSelectedRowKeys([]);
            onRefresh?.(); // Refresh data after removing policies
        } catch (error: any) {
            message.error('Failed to remove policies: ' + (error?.message || error));
        } finally {
            setActionLoading(false);
        }
    };

    // Show add form when requested
    if (showAddForm) {
        return (
            <AddRoutingPolicyCard
                routingTables={routingTables}
                onCancel={handleCancelAdd}
                onSave={handleSavePolicy}
            />
        );
    }

    const columns = [
        {
            title: 'Interface',
            dataIndex: 'interface',
            key: 'interface',
            width: '15%',
        },
        {
            title: 'From',
            dataIndex: 'from',
            key: 'from',
            width: '30%',
            render: (text: string) => text || 'any',
        },
        {
            title: 'To',
            dataIndex: 'to',
            key: 'to',
            width: '30%',
            render: (text: string) => text || 'any',
        },
        {
            title: 'Table',
            dataIndex: 'table',
            key: 'table',
            width: '25%',
        },
    ];

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
                dataSource={policies}
                columns={columns}
                rowKey={(record) => `${record.interface}-${record.from || 'any'}-${record.to || 'any'}-${record.table}`}
                loading={loading || actionLoading}
                pagination={false}
                size="middle"
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