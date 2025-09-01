import React, { useState } from 'react';
import { 
    Table, Button, Form, Input, InputNumber, Modal, Space, 
    message, Popconfirm, Typography, Card, Tag 
} from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useNetworkOperations, TableOperation } from '@/hooks/useNetworkOperations';

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

    const handleDelete = async (tableId: number) => {
        setLoading(true);
        try {
            // Find the table name for the delete operation
            const tableToDelete = tables.find(table => table.id === tableId);
            const tableName = tableToDelete?.name || '';
            
            const operation: TableOperation = {
                action: 'DELETE',
                table: {
                    id: tableId,
                    name: tableName
                }
            };
            
            await manageTables(clientId, [operation]);
            message.success('Routing table deleted successfully');
            
            if (onTableDelete) {
                onTableDelete(tableId);
            }
            if (onRefresh) {
                onRefresh();
            }
        } catch (error: any) {
            message.error(`Failed to delete table: ${error?.message || error}`);
        } finally {
            setLoading(false);
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
                message.success('Routing table updated successfully');
                if (onTableUpdate) {
                    onTableUpdate(table);
                }
            } else {
                message.success('Routing table created successfully');
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
            message.error(`Failed to save table: ${error?.message || error}`);
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
            width: '15%',
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
                    <Text>{name}</Text>
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
            width: '15%',
            render: (record: RoutingTable) => {
                if (record.isSystem || readonly) {
                    return <Text type="secondary">-</Text>;
                }

                return (
                    <Space size="small">
                        <Button 
                            type="text" 
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record)}
                        />
                        <Popconfirm
                            title="Delete routing table?"
                            description="This action cannot be undone. Make sure no routes or policies are using this table."
                            onConfirm={() => handleDelete(record.id)}
                            okText="Delete"
                            okType="danger"
                            cancelText="Cancel"
                        >
                            <Button 
                                type="text" 
                                size="small"
                                danger
                                icon={<DeleteOutlined />}
                            />
                        </Popconfirm>
                    </Space>
                );
            }
        }
    ];

    return (
        <Card 
            title="Routing Tables"
            extra={
                !readonly && (
                    <Button
                        type="primary"
                        size="small"
                        icon={<PlusOutlined />}
                        onClick={handleAdd}
                    >
                        Add Table
                    </Button>
                )
            }
            size="small"
        >
            <Table
                dataSource={allTables}
                columns={columns}
                rowKey={(record, index) => `table-${record.id}-${index}`}
                size="small"
                pagination={false}
                loading={loading}
                style={{ marginTop: 8 }}
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
                    backgroundColor: '#f6ffed', 
                    borderRadius: 6,
                    border: '1px solid #b7eb8f'
                }}>
                    <Text style={{ fontSize: 12, color: '#52c41a' }}>
                        💡 <strong>Tip:</strong> Routing tables allow you to create separate routing domains. 
                        Use different tables for different network segments or policies.
                    </Text>
                </div>
            </Modal>
        </Card>
    );
};

export default RoutingTableManager;