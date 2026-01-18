import React, { useState } from 'react';
import {
    Table, Button, Form, Input, InputNumber, Modal, Space,
    Popconfirm, Typography, Tag
} from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useNetworkOperations, TableOperation } from '@/hooks/useNetworkOperations';
import { showErrorNotification, showWarningNotification } from '@/common/notificationHandler';

const { Text } = Typography;

interface RoutingTable {
    id: number;
    name: string;
    isSystem?: boolean;
}

interface RoutingTableManagerProps {
    tables: RoutingTable[];
    routes?: any[];
    policies?: any[];
    clientId: string;
    onTableAdd?: (table: RoutingTable) => void;
    onTableDelete?: (tableId: number) => void;
    onTableUpdate?: (table: RoutingTable) => void;
    onRefresh?: () => void;
    readonly?: boolean;
}

const RoutingTableManager: React.FC<RoutingTableManagerProps> = ({
    tables,
    routes = [],
    policies = [],
    clientId,
    onTableAdd,
    onTableDelete,
    onTableUpdate,
    onRefresh,
    readonly = false
}) => {
    const [form] = Form.useForm();
    const [modalVisible, setModalVisible] = useState(false);
    const [editingTable, setEditingTable] = useState<RoutingTable | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [actionLoading, setActionLoading] = useState(false);
    const { manageTables } = useNetworkOperations();

    // System table IDs that cannot be modified
    const systemTableIds = new Set([253, 254, 255]);

    // Calculate usage counts for each table
    const calculateUsage = (tableId: number): { routes: number; policies: number } => {
        const routeCount = routes.filter(r => r.table === tableId || (tableId === 254 && !r.table)).length;
        const policyCount = policies.filter(p => p.table === tableId).length;
        return { routes: routeCount, policies: policyCount };
    };

    // Filter out unspec table (ID: 0 or name: 'unspec') and mark system tables
    const allTables = tables
        .filter(table => table.id !== 0 && table.name?.toLowerCase() !== 'unspec') // Hide unspec table
        .map(table => ({
            ...table,
            isSystem: systemTableIds.has(table.id),
            usage: calculateUsage(table.id)
        }))
        .sort((a, b) => a.id - b.id);

    const handleAdd = () => {
        setEditingTable(null);
        form.resetFields();
        setModalVisible(true);
    };

    const handleEdit = (table: RoutingTable) => {
        setEditingTable(table);
        form.setFieldsValue(table);
        setModalVisible(true);
    };

    const handleBatchRemove = async () => {
        if (selectedRowKeys.length === 0) {
            showWarningNotification('Please select tables to remove');
            return;
        }
        setActionLoading(true);
        try {
            const operations: TableOperation[] = selectedRowKeys.map((key) => {
                const keyStr = key.toString();
                const tableId = parseInt(keyStr.replace('table-', ''));
                const table = allTables.find(t => t.id === tableId);

                if (!table) {
                    throw new Error(`Table not found for key: ${key}`);
                }

                return {
                    action: 'DELETE',
                    table: {
                        id: table.id,
                        name: table.name
                    }
                };
            });

            await manageTables(clientId, operations);

            setSelectedRowKeys([]);
            onRefresh?.();
        } catch (error: any) {
            showErrorNotification(error, 'Failed to remove tables');
        } finally {
            setActionLoading(false);
        }
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);

            const table: RoutingTable = {
                id: values.id,
                name: values.name
            };

            const operation: TableOperation = {
                action: editingTable ? 'REPLACE' : 'ADD',
                table: {
                    id: table.id,
                    name: table.name
                }
            };

            await manageTables(clientId, [operation]);

            if (editingTable) {
                if (onTableUpdate) {
                    onTableUpdate(table);
                }
            } else {
                if (onTableAdd) {
                    onTableAdd(table);
                }
            }

            if (onRefresh) {
                onRefresh();
            }

            setModalVisible(false);
            form.resetFields();
        } catch (error: any) {
            showErrorNotification(error, 'Failed to save table');
        } finally {
            setLoading(false);
        }
    };

    const handleModalCancel = () => {
        setModalVisible(false);
        form.resetFields();
        setEditingTable(null);
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: '20%',
            render: (id: number) => (
                <Text strong style={{ fontFamily: 'monospace' }}>{id}</Text>
            )
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '40%',
            render: (name: string, record: any) => (
                <Space>
                    <Text style={{ fontFamily: 'monospace' }}>{name}</Text>
                    {record.isSystem && <Tag color="blue">System</Tag>}
                </Space>
            )
        },
        {
            title: 'Usage',
            key: 'usage',
            width: '30%',
            render: (record: any) => {
                const { routes: routeCount, policies: policyCount } = record.usage || { routes: 0, policies: 0 };
                const total = routeCount + policyCount;

                if (total === 0) {
                    return <Text type="secondary">Not in use</Text>;
                }

                return (
                    <Space size="small">
                        {routeCount > 0 && (
                            <Tag color="green">{routeCount} route{routeCount !== 1 ? 's' : ''}</Tag>
                        )}
                        {policyCount > 0 && (
                            <Tag color="blue">{policyCount} polic{policyCount !== 1 ? 'ies' : 'y'}</Tag>
                        )}
                    </Space>
                );
            }
        },
        {
            title: 'Actions',
            key: 'actions',
            width: '10%',
            render: (record: RoutingTable) => {
                if (record.isSystem || readonly) {
                    return <Text type="secondary">-</Text>;
                }

                return (
                    <Button
                        type="text"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        style={{ borderRadius: 6 }}
                    />
                );
            }
        }
    ];

    const rowSelection = {
        selectedRowKeys,
        onChange: (newSelectedRowKeys: React.Key[]) => {
            setSelectedRowKeys(newSelectedRowKeys);
        },
        getCheckboxProps: (record: any) => ({
            disabled: record.isSystem || readonly, // Disable system tables and in readonly mode
        }),
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
                    {!readonly && (
                        <Popconfirm
                            title="Remove selected routing tables?"
                            description={`Are you sure you want to remove ${selectedRowKeys.length} routing table(s)? This action cannot be undone.`}
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
                    )}
                </div>
                {!readonly && (
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAdd}
                        style={{
                            background: 'var(--gradient-primary)',
                            border: 'none',
                            borderRadius: 8,
                            fontWeight: 500,
                            boxShadow: '0 2px 8px var(--shadow-primary)',
                        }}
                        className="modern-add-btn"
                        loading={actionLoading}
                    >
                        Add Table
                    </Button>
                )}
            </div>
            <Table
                rowSelection={rowSelection}
                dataSource={allTables}
                columns={columns}
                rowKey={(record) => `table-${record.id}`}
                size="middle"
                pagination={false}
                loading={loading || actionLoading}
                style={{
                    background: 'var(--card-bg)',
                    borderRadius: 12,
                    boxShadow: 'var(--shadow-sm)',
                    border: '1px solid var(--border-default)'
                }}
            />

            <Modal
                title={editingTable ? 'Edit Routing Table' : 'Add Routing Table'}
                open={modalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                confirmLoading={loading}
                width={500}
            >
                <Form
                    form={form}
                    layout="vertical"
                    style={{ marginTop: 16 }}
                >
                    <Form.Item
                        name="id"
                        label="Table ID"
                        rules={[
                            { required: true, message: 'Table ID is required' },
                            { type: 'number', min: 1, max: 252, message: 'ID must be between 1-252 (253-255 are reserved)' }
                        ]}
                        extra="Valid range: 1-252 (253-255 are reserved for system tables)"
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            min={1}
                            max={252}
                            placeholder="100"
                            disabled={!!editingTable} // Don't allow ID changes
                        />
                    </Form.Item>

                    <Form.Item
                        name="name"
                        label="Table Name"
                        rules={[
                            { required: true, message: 'Table name is required' },
                            { pattern: /^[a-zA-Z][a-zA-Z0-9_-]*$/, message: 'Name must start with a letter and contain only letters, numbers, underscores, and hyphens' }
                        ]}
                        extra="A descriptive name for the table (e.g., 'mgmt', 'production')"
                    >
                        <Input
                            placeholder="management"
                            maxLength={32}
                        />
                    </Form.Item>
                </Form>

                <div style={{
                    marginTop: 16,
                    padding: 12,
                    backgroundColor: 'var(--color-success-light)',
                    borderRadius: 6,
                    border: '1px solid var(--color-success)'
                }}>
                    <Text style={{ fontSize: 12, color: 'var(--color-success)' }}>
                        💡 <strong>Tip:</strong> Routing tables allow you to create separate routing domains.
                        Use different tables for different network segments or policies.
                    </Text>
                </div>
            </Modal>
        </div>
    );
};

export default RoutingTableManager;