/**
 * GSLB IP Address List Component
 * Manage IP addresses for GSLB record
 */

import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Tag, Tooltip, Typography, Space, Drawer, Select, App } from 'antd';
import { PlusOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined, HistoryOutlined, ArrowUpOutlined, ArrowDownOutlined, ClearOutlined, SyncOutlined } from '@ant-design/icons';
import ElchiButton from '@/elchi/components/common/ElchiButton';
import { GSLBIPAddress, GSLBStatusHistory } from '../types';
import { gslbApi } from '../gslbApi';

const { Text } = Typography;

export interface IPAddressListProps {
    ips: GSLBIPAddress[];
    onChange: (ips: GSLBIPAddress[]) => void;
    recordId?: string; // For edit mode - when provided, use API calls
    isEditMode?: boolean;
    onRefresh?: () => void; // Callback to refresh data after API calls
}

const IPAddressList: React.FC<IPAddressListProps> = ({ ips, onChange, recordId, isEditMode, onRefresh }) => {
    const { modal } = App.useApp();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAddingIP, setIsAddingIP] = useState(false);
    const [isHistoryDrawerVisible, setIsHistoryDrawerVisible] = useState(false);
    const [selectedHistory, setSelectedHistory] = useState<GSLBStatusHistory[]>([]);
    const [selectedIP, setSelectedIP] = useState<string>('');
    const [selectedIpId, setSelectedIpId] = useState<string>('');
    const [togglingHealthIP, setTogglingHealthIP] = useState<string | null>(null);
    const [isClearingHistory, setIsClearingHistory] = useState(false);
    const [form] = Form.useForm();

    const handleAdd = async () => {
        try {
            const values = await form.validateFields();

            // If in edit mode with recordId, call API
            if (isEditMode && recordId) {
                setIsAddingIP(true);
                try {
                    await gslbApi.addIpToRecord(recordId, {
                        ip: values.ip,
                        health_state: values.health_state || 'passing',
                    });

                    form.resetFields();
                    setIsModalVisible(false);

                    // Refresh data to update the table
                    if (onRefresh) {
                        onRefresh();
                    }
                } catch (error) {
                    console.error('Failed to add IP:', error);
                } finally {
                    setIsAddingIP(false);
                }
            } else {
                // Create mode - just update local state
                const newIP: GSLBIPAddress = {
                    ip: values.ip,
                    health_state: values.health_state || 'passing',
                };
                onChange([...ips, newIP]);
                form.resetFields();
                setIsModalVisible(false);
            }
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    const handleRemove = async (index: number, ip: string) => {
        // If in edit mode with recordId, call API
        if (isEditMode && recordId) {
            modal.confirm({
                title: 'Remove IP Address',
                content: `Are you sure you want to remove IP "${ip}" from this GSLB record?`,
                okText: 'Remove',
                okType: 'danger',
                cancelText: 'Cancel',
                async onOk() {
                    try {
                        await gslbApi.removeIpFromRecord(recordId, ip);

                        // Refresh data to update the table
                        if (onRefresh) {
                            onRefresh();
                        }
                    } catch (error) {
                        console.error('Failed to remove IP:', error);
                    }
                },
            });
        } else {
            // Create mode - just update local state
            const newIPs = [...ips];
            newIPs.splice(index, 1);
            onChange(newIPs);
        }
    };

    const handleShowHistory = (ip: string, ipId: string, history?: GSLBStatusHistory[]) => {
        setSelectedIP(ip);
        setSelectedIpId(ipId);
        setSelectedHistory(history || []);
        setIsHistoryDrawerVisible(true);
    };

    const handleClearHistory = async () => {
        if (!selectedIpId) {
            return;
        }

        modal.confirm({
            title: 'Clear Status History',
            content: `Are you sure you want to clear all status history for IP "${selectedIP}"? This action cannot be undone.`,
            okText: 'Clear History',
            okType: 'danger',
            cancelText: 'Cancel',
            async onOk() {
                setIsClearingHistory(true);
                try {
                    await gslbApi.clearIpHistory(selectedIpId);

                    // Close drawer and refresh data
                    setIsHistoryDrawerVisible(false);
                    if (onRefresh) {
                        onRefresh();
                    }
                } catch (error) {
                    console.error('Failed to clear history:', error);
                } finally {
                    setIsClearingHistory(false);
                }
            },
        });
    };

    const handleToggleHealth = async (ip: string, currentHealthState: 'passing' | 'warning' | 'critical' | 'recovery') => {
        // Only allow in edit mode
        if (!isEditMode || !recordId) {
            return;
        }

        setTogglingHealthIP(ip);
        try {
            // Toggle between passing and critical (warning can be set manually if needed)
            const newHealthState = currentHealthState === 'critical' ? 'passing' : 'critical';
            await gslbApi.updateIpHealthState(recordId, ip, newHealthState);

            // Refresh data to update the table
            if (onRefresh) {
                onRefresh();
            }
        } catch (error) {
            console.error('Failed to toggle IP health:', error);
        } finally {
            setTogglingHealthIP(null);
        }
    };

    const historyColumns = [
        {
            title: 'Status',
            dataIndex: 'state',
            key: 'state',
            width: 90,
            render: (state: 'passing' | 'warning' | 'critical' | 'recovery') => {
                const config = {
                    passing: { color: 'success', icon: <CheckCircleOutlined />, text: 'PASSING' },
                    warning: { color: 'warning', icon: <CheckCircleOutlined />, text: 'WARNING' },
                    critical: { color: 'error', icon: <CloseCircleOutlined />, text: 'CRITICAL' },
                    recovery: { color: 'processing', icon: <SyncOutlined spin />, text: 'RECOVERY' }
                };
                const { color, icon, text } = config[state] || config.critical;
                return (
                    <Tag className='auto-width-tag' icon={icon} color={color}>
                        {text}
                    </Tag>
                );
            },
        },
        {
            title: 'Time',
            dataIndex: 'datetime',
            key: 'datetime',
            width: 120,
            sorter: (a: GSLBStatusHistory, b: GSLBStatusHistory) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime(),
            defaultSortOrder: 'ascend' as const,
            render: (datetime: string) => (
                <Text style={{ fontSize: 13 }}>
                    {new Date(datetime).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    })}
                </Text>
            ),
        },
        {
            title: 'Code',
            dataIndex: 'response_code',
            key: 'response_code',
            width: 60,
            render: (code?: number) => (
                code !== undefined ? (
                    <Text strong style={{
                        color: code >= 200 && code < 300 ? 'var(--color-success)' : 'var(--color-danger)'
                    }}>
                        {code}
                    </Text>
                ) : <Text type="secondary">-</Text>
            ),
        },
        {
            title: 'Time',
            dataIndex: 'response_time',
            key: 'response_time',
            width: 60,
            render: (time?: number) => (
                time !== undefined ? (
                    <Text>{(time * 1000).toFixed(0)}ms</Text>
                ) : <Text type="secondary">-</Text>
            ),
        },
        {
            title: 'Error',
            dataIndex: 'error_message',
            key: 'error_message',
            width: 280,
            render: (error?: string) => (
                error ? (
                    <Text type="danger" style={{ fontSize: 12 }}>{error}</Text>
                ) : <Text type="secondary">-</Text>
            ),
        },
    ];

    const columns = [
        {
            title: 'IPv4 Address',
            dataIndex: 'ip',
            key: 'ip',
            render: (ip: string) => <Text strong>{ip}</Text>,
        },
        {
            title: 'Shard',
            key: 'shard',
            width: 100,
            render: (_: any, record: GSLBIPAddress) => {
                if (record.shard_id !== undefined && record.sub_shard_id !== undefined) {
                    return <Text>{record.shard_id}/{record.sub_shard_id}</Text>;
                }
                return <Text type="secondary">-</Text>;
            },
        },
        {
            title: 'Client ID',
            dataIndex: 'client_id',
            key: 'client_id',
            width: 120,
            render: (client_id?: string) => {
                if (client_id && client_id.trim() !== '') {
                    const truncated = client_id.length > 8 ? client_id.substring(0, 8) : client_id;
                    return (
                        <Tooltip title={client_id}>
                            <Text>{truncated}...</Text>
                        </Tooltip>
                    );
                }
                return <Text type="secondary">-</Text>;
            },
        },
        {
            title: 'Health State',
            dataIndex: 'health_state',
            key: 'health_state',
            width: 160,
            render: (health_state: 'passing' | 'warning' | 'critical' | 'recovery', record: GSLBIPAddress) => {
                const config = {
                    passing: { color: 'success', icon: <CheckCircleOutlined />, text: 'Passing' },
                    warning: { color: 'warning', icon: <CheckCircleOutlined />, text: 'Warning' },
                    critical: { color: 'error', icon: <CloseCircleOutlined />, text: 'Critical' },
                    recovery: { color: 'processing', icon: <SyncOutlined spin />, text: 'Recovery' }
                };
                const { color, icon, text } = config[health_state] || config.passing;
                return (
                    <Space direction="vertical" size={2}>
                        <Tag className='auto-width-tag' icon={icon} color={color}>
                            {text}
                        </Tag>
                        {record.current_backoff !== undefined && record.current_backoff !== null && record.current_backoff > 0 && (
                            <Text type="secondary" style={{ fontSize: 11 }}>
                                Backoff: {record.current_backoff}s
                            </Text>
                        )}
                    </Space>
                );
            },
        },
        {
            title: 'Backoff Until',
            dataIndex: 'backoff_until',
            key: 'backoff_until',
            width: 140,
            render: (backoff_until?: string | null) => {
                if (!backoff_until) {
                    return <Text type="secondary">-</Text>;
                }

                const backoffDate = new Date(backoff_until);
                const now = new Date();
                const diffInSeconds = Math.max(0, Math.floor((backoffDate.getTime() - now.getTime()) / 1000));

                const timeString = backoffDate.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                });

                return (
                    <Space direction="vertical" size={2}>
                        <Text style={{ fontSize: 13 }}>{timeString}</Text>
                        <Text type="secondary" style={{ fontSize: 11 }}>
                            ({diffInSeconds}s remaining)
                        </Text>
                    </Space>
                );
            },
        },
        ...(isEditMode ? [{
            title: 'History',
            key: 'history',
            width: 100,
            render: (_: any, record: GSLBIPAddress) => (
                record.status_history && record.status_history.length > 0 ? (
                    <Tooltip title="View status history">
                        <Button
                            type="text"
                            icon={<HistoryOutlined />}
                            onClick={() => handleShowHistory(record.ip, record.id || '', record.status_history)}
                        >
                            {record.status_history.length}
                        </Button>
                    </Tooltip>
                ) : (
                    <Text type="secondary">-</Text>
                )
            ),
        }] : []),
        {
            title: 'Actions',
            key: 'actions',
            width: 150,
            render: (_: any, record: GSLBIPAddress, index: number) => (
                <Space>
                    {isEditMode && (
                        <Tooltip title={record.health_state === 'critical' ? 'Mark as PASSING' : 'Mark as CRITICAL'}>
                            <Button
                                type="text"
                                icon={record.health_state === 'critical' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                                onClick={() => handleToggleHealth(record.ip, record.health_state)}
                                loading={togglingHealthIP === record.ip}
                                style={{
                                    color: record.health_state === 'critical' ? 'var(--color-success)' : 'var(--color-danger)'
                                }}
                            />
                        </Tooltip>
                    )}
                    {/* Show delete button only for manual IPs (is_manual=true) */}
                    {record.is_manual === true && (
                        <Tooltip title="Remove">
                            <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => handleRemove(index, record.ip)}
                            />
                        </Tooltip>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <>
            <div
                style={{
                    background: 'var(--card-bg)',
                    borderRadius: 12,
                    border: '1px solid var(--border-default)',
                    boxShadow: 'var(--shadow-sm)',
                    padding: '24px',
                    marginBottom: 16,
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>Records</div>
                    <ElchiButton
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setIsModalVisible(true)}
                    >
                        Add IP
                    </ElchiButton>
                </div>
                <Table
                    dataSource={ips}
                    columns={columns}
                    rowKey={(record) => `${record.ip}-${record.client_id || 'no-client'}`}
                    pagination={false}
                    locale={{
                        emptyText: (
                            <div style={{ padding: 40, textAlign: 'center' }}>
                                <Text type="secondary">No IP addresses added yet</Text>
                                <br />
                                <Button
                                    type="link"
                                    onClick={() => setIsModalVisible(true)}
                                >
                                    Add your first IP address
                                </Button>
                            </div>
                        )
                    }}
                />

                {ips.length > 0 && (
                    <div style={{ marginTop: 16 }}>
                        <Text type="secondary">
                            Total: {ips.length} IP{ips.length !== 1 ? 's' : ''} •{' '}
                            Passing: {ips.filter(ip => ip.health_state === 'passing').length} •{' '}
                            Warning: {ips.filter(ip => ip.health_state === 'warning').length} •{' '}
                            Critical: {ips.filter(ip => ip.health_state === 'critical').length}
                        </Text>
                    </div>
                )}
            </div>

            {/* Add IP Modal */}
            <Modal
                title="Add IP Address"
                open={isModalVisible}
                onOk={handleAdd}
                onCancel={() => {
                    form.resetFields();
                    setIsModalVisible(false);
                }}
                okText="Add"
                cancelText="Cancel"
                confirmLoading={isAddingIP}
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{ health_state: 'passing' }}
                >
                    <Form.Item
                        name="ip"
                        label="IP Address"
                        rules={[
                            { required: true, message: 'IP address is required' },
                            {
                                pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/,
                                message: 'Invalid IPv4'
                            },
                            {
                                validator: (_, value) => {
                                    if (value && ips.some(ip => ip.ip === value)) {
                                        return Promise.reject(new Error('This IP address already exists'));
                                    }
                                    return Promise.resolve();
                                }
                            }
                        ]}
                    >
                        <Input placeholder="10.0.1.100" />
                    </Form.Item>

                    <Form.Item
                        name="health_state"
                        label="Initial Health State"
                        extra="Set initial health state for this IP (useful for staged rollout or pre-deployment testing)"
                    >
                        <Select>
                            <Select.Option value="passing">Passing (Healthy - included in DNS)</Select.Option>
                            <Select.Option value="critical">Critical (Down - excluded from DNS)</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Status History Drawer */}
            <Drawer
                title={
                    <Space>
                        <HistoryOutlined style={{ fontSize: 18, color: 'var(--color-primary)' }} />
                        <div>
                            <div style={{ fontWeight: 600 }}>Status History</div>
                            <div style={{ fontSize: 12, fontWeight: 400, color: 'var(--text-secondary)' }}>{selectedIP}</div>
                        </div>
                    </Space>
                }
                placement="right"
                width={900}
                open={isHistoryDrawerVisible}
                onClose={() => setIsHistoryDrawerVisible(false)}
                extra={
                    isEditMode && selectedHistory.length > 0 && selectedIpId && (
                        <Button
                            danger
                            icon={<ClearOutlined />}
                            onClick={handleClearHistory}
                            loading={isClearingHistory}
                        >
                            Clear History
                        </Button>
                    )
                }
            >
                {selectedHistory.length > 0 ? (
                    <Table
                        dataSource={selectedHistory.map((item, index) => ({ ...item, _id: `${item.datetime}-${index}` }))}
                        columns={historyColumns}
                        rowKey="_id"
                        pagination={{
                            pageSize: 20,
                            showSizeChanger: true,
                            pageSizeOptions: ['20', '50', '100'],
                            showTotal: (total) => `Total ${total} entries`
                        }}
                        size="small"
                        scroll={{ y: 'calc(100vh - 200px)' }}
                    />
                ) : (
                    <div style={{
                        padding: 60,
                        textAlign: 'center',
                        background: 'var(--bg-surface)',
                        borderRadius: 8
                    }}>
                        <HistoryOutlined style={{ fontSize: 48, color: 'var(--text-disabled)', marginBottom: 16 }} />
                        <div>
                            <Text type="secondary">No status history available</Text>
                        </div>
                    </div>
                )}
            </Drawer>
        </>
    );
};

export default IPAddressList;
