import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, Card, Tag, Typography, Descriptions, Badge, Tooltip } from 'antd';
import { PlusOutlined, DeleteOutlined, ReloadOutlined, EditOutlined } from '@ant-design/icons';
import EditBGPNeighborDrawer from './forms/EditBGPNeighborDrawer';
import { useBGPOperations, BGPNeighborRequest } from '@/hooks/useBGPOperations';
import { useBGPContext } from './context/BGPContext';
import { showErrorNotification } from '@/common/notificationHandler';

const { Text } = Typography;

interface BGPNeighborsContentProps {
    clientId: string;
}

const BGPNeighborsContent: React.FC<BGPNeighborsContentProps> = ({ clientId }) => {
    const [neighbors, setNeighbors] = useState<any[]>([]);
    const [showDrawer, setShowDrawer] = useState(false);
    const [editingNeighbor, setEditingNeighbor] = useState<any>(null);
    const { asNumber } = useBGPContext();

    const {
        loading,
        getBGPNeighbors,
        removeBGPNeighbor,
        addBGPNeighbor,
        updateBGPNeighbor
    } = useBGPOperations();

    useEffect(() => {
        loadNeighbors();
    }, [clientId]);

    const loadNeighbors = async () => {
        try {
            const result = await getBGPNeighbors(clientId);
            if (result.success && result.data) {
                const neighborData = result.data[0]?.Result?.Frr?.bgp?.show_neighbors?.neighbors || {};
                const formattedNeighbors = Object.entries(neighborData).map(([peer_ip, data]: [string, any]) => ({
                    peer_ip,
                    ...data
                }));
                setNeighbors(formattedNeighbors);
            }
        } catch (error) {
            console.error('Failed to load BGP neighbors:', error);
            setNeighbors([]);
        }
    };

    const getStateColor = (state: string): 'success' | 'processing' | 'warning' | 'default' | 'error' => {
        switch (state?.toLowerCase()) {
            case 'established': return 'success';
            case 'active': return 'processing';
            case 'idle': return 'warning';
            case 'connect': return 'warning';
            default: return 'default';
        }
    };

    const formatTime = (msecs: number): string => {
        if (!msecs) return 'N/A';
        const seconds = Math.floor(msecs / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ${hours % 24}h`;
        if (hours > 0) return `${hours}h ${minutes % 60}m`;
        if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
        return `${seconds}s`;
    };

    const handleEdit = (record: any, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingNeighbor(record);
        setShowDrawer(true);
    };

    const handleAdd = () => {
        setEditingNeighbor(null);
        setShowDrawer(true);
    };

    const handleSubmit = async (values: BGPNeighborRequest) => {
        if (!asNumber) {
            showErrorNotification('AS number is required');
            return;
        }

        try {
            const result = editingNeighbor 
                ? await updateBGPNeighbor(clientId, values, asNumber)
                : await addBGPNeighbor(clientId, values, asNumber);

            if (result.success) {
                setShowDrawer(false);
                setEditingNeighbor(null);
                await loadNeighbors();
            }
        } catch (error) {
            console.error('Failed to save BGP neighbor:', error);
        }
    };

    const columns = [
        {
            title: 'Peer IP',
            dataIndex: 'peer_ip',
            key: 'peer_ip',
            render: (text: string) => <Text copyable>{text}</Text>
        },
        {
            title: 'Remote AS',
            dataIndex: 'remote_as',
            key: 'remote_as',
        },
        {
            title: 'Description',
            dataIndex: 'nbr_desc',
            key: 'nbr_desc',
            render: (text: string) => text || '-'
        },
        {
            title: 'State',
            dataIndex: 'bgp_state',
            key: 'bgp_state',
            render: (state: string) => (
                <Badge status={getStateColor(state)} text={state} />
            )
        },
        {
            title: 'Last Reset',
            key: 'last_reset',
            render: (record: any) => (
                <Tooltip title={record.last_reset_due_to}>
                    {formatTime(record.last_reset_timer_msecs)}
                </Tooltip>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (record: any) => (
                <Space>
                    <Button
                        size="small"
                        type="text"
                        icon={<EditOutlined />}
                        onClick={(e) => handleEdit(record, e)}
                        title="Edit Neighbor"
                    />
                    <Popconfirm
                        title="Remove BGP neighbor?"
                        description="This action cannot be undone."
                        onConfirm={(e) => {
                            e?.stopPropagation();
                            handleDelete(record);
                        }}
                        okText="Remove"
                        cancelText="Cancel"
                    >
                        <Button
                            size="small"
                            danger
                            type="text"
                            icon={<DeleteOutlined />}
                            loading={loading}
                            title="Remove Neighbor"
                            onClick={e => e.stopPropagation()}
                        />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    const expandedRowRender = (record: any) => {
        return (
            <div style={{ padding: '12px 0' }}>
                {/* Basic Information */}
                <Descriptions bordered column={2} size="small" title="Basic Information">
                    <Descriptions.Item label="Local AS">{record.local_as}</Descriptions.Item>
                    <Descriptions.Item label="Remote AS">{record.remote_as}</Descriptions.Item>
                    <Descriptions.Item label="Local Router ID">{record.local_router_id}</Descriptions.Item>
                    <Descriptions.Item label="Remote Router ID">{record.remote_router_id || 'Unknown'}</Descriptions.Item>
                    <Descriptions.Item label="BGP Version">{record.bgp_version}</Descriptions.Item>
                    <Descriptions.Item label="Hostname">{record.hostname || 'Unknown'}</Descriptions.Item>
                    <Descriptions.Item label="Local Role">{record.local_role || 'undefined'}</Descriptions.Item>
                    <Descriptions.Item label="Remote Role">{record.remote_role || 'undefined'}</Descriptions.Item>
                    <Descriptions.Item label="External Link">
                        <Tag className='auto-width-tag' color={record.nbr_external_link ? 'blue' : 'green'}>
                            {record.nbr_external_link ? 'eBGP' : 'iBGP'}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Connection Type">
                        <Tag className='auto-width-tag' color="blue">{record.bgp_connection}</Tag>
                    </Descriptions.Item>
                </Descriptions>

                <br />

                {/* Connection Information */}
                <Descriptions bordered column={2} size="small" title="Connection Information">
                    <Descriptions.Item label="Local Host">{record.host_local}</Descriptions.Item>
                    <Descriptions.Item label="Remote Host">{record.host_foreign}</Descriptions.Item>
                    <Descriptions.Item label="Local Port">{record.port_local}</Descriptions.Item>
                    <Descriptions.Item label="Remote Port">{record.port_foreign}</Descriptions.Item>
                    <Descriptions.Item label="Next Hop">{record.nexthop}</Descriptions.Item>
                    <Descriptions.Item label="Next Hop Global">{record.nexthop_global || 'N/A'}</Descriptions.Item>
                    <Descriptions.Item label="Next Hop Local">{record.nexthop_local || 'N/A'}</Descriptions.Item>
                    <Descriptions.Item label="TCP MSS">{record.bgp_tcp_mss_synced}</Descriptions.Item>
                    <Descriptions.Item label="Connections Established">{record.connections_established}</Descriptions.Item>
                    <Descriptions.Item label="Connections Dropped">{record.connections_dropped}</Descriptions.Item>
                    <Descriptions.Item label="Connect Retry Timer">{record.connect_retry_timer}s</Descriptions.Item>
                    <Descriptions.Item label="Read/Write Thread">
                        <Space>
                            <Tag className='auto-width-tag' color="green">Read: {record.read_thread}</Tag>
                            <Tag className='auto-width-tag' color="blue">Write: {record.write_thread}</Tag>
                        </Space>
                    </Descriptions.Item>
                </Descriptions>

                <br />

                {/* Timer Information */}
                <Descriptions bordered column={2} size="small" title="Timer Information">
                    <Descriptions.Item label="Hold Time (Configured)">{(record.bgp_timer_configured_hold_time_msecs / 1000).toFixed(1)}s</Descriptions.Item>
                    <Descriptions.Item label="Hold Time (Active)">{(record.bgp_timer_hold_time_msecs / 1000).toFixed(1)}s</Descriptions.Item>
                    <Descriptions.Item label="Keepalive (Configured)">{(record.bgp_timer_configured_keep_alive_interval_msecs / 1000).toFixed(1)}s</Descriptions.Item>
                    <Descriptions.Item label="Keepalive (Active)">{(record.bgp_timer_keep_alive_interval_msecs / 1000).toFixed(1)}s</Descriptions.Item>
                    <Descriptions.Item label="Last Read">{formatTime(record.bgp_timer_last_read)}</Descriptions.Item>
                    <Descriptions.Item label="Last Write">{formatTime(record.bgp_timer_last_write)}</Descriptions.Item>
                    <Descriptions.Item label="Update Elapsed Time">{formatTime(record.bgp_in_update_elapsed_time_msecs)}</Descriptions.Item>
                    <Descriptions.Item label="State">
                        <Badge status={getStateColor(record.bgp_state)} text={record.bgp_state} />
                    </Descriptions.Item>
                </Descriptions>

                <br />

                {/* Message Statistics */}
                {record.message_stats && (
                    <>
                        <Descriptions bordered column={3} size="small" title="Message Statistics">
                            <Descriptions.Item label="Opens Sent">{record.message_stats.opens_sent}</Descriptions.Item>
                            <Descriptions.Item label="Opens Received">{record.message_stats.opens_recv}</Descriptions.Item>
                            <Descriptions.Item label="Notifications Sent">{record.message_stats.notifications_sent}</Descriptions.Item>
                            <Descriptions.Item label="Notifications Received">{record.message_stats.notifications_recv}</Descriptions.Item>
                            <Descriptions.Item label="Updates Sent">{record.message_stats.updates_sent}</Descriptions.Item>
                            <Descriptions.Item label="Updates Received">{record.message_stats.updates_recv}</Descriptions.Item>
                            <Descriptions.Item label="Keepalives Sent">{record.message_stats.keepalives_sent}</Descriptions.Item>
                            <Descriptions.Item label="Keepalives Received">{record.message_stats.keepalives_recv}</Descriptions.Item>
                            <Descriptions.Item label="Route Refresh Sent">{record.message_stats.route_refresh_sent}</Descriptions.Item>
                            <Descriptions.Item label="Total Sent">{record.message_stats.total_sent}</Descriptions.Item>
                            <Descriptions.Item label="Total Received">{record.message_stats.total_recv}</Descriptions.Item>
                            <Descriptions.Item label=""> </Descriptions.Item>
                        </Descriptions>
                        <br />
                    </>
                )}

                {/* Prefix Statistics */}
                {record.prefix_stats && (
                    <>
                        <Descriptions bordered column={2} size="small" title="Prefix Statistics">
                            <Descriptions.Item label="Inbound Filtered">{record.prefix_stats.inbound_filtered}</Descriptions.Item>
                            <Descriptions.Item label=""> </Descriptions.Item>
                        </Descriptions>
                        <br />
                    </>
                )}

                {/* Address Family Information */}
                <Descriptions bordered column={2} size="small" title="Address Family IPv4 Unicast">
                    {record.address_family_info?.ipv4_unicast ? (
                        <>
                            <Descriptions.Item label="Community Attributes">
                                <Tag className='auto-width-tag' color="blue">{record.address_family_info.ipv4_unicast.comm_attri_sent_to_nbr}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Next Hop Self">
                                <Tag className='auto-width-tag' color={record.address_family_info.ipv4_unicast.router_always_next_hop ? 'green' : 'red'}>
                                    {record.address_family_info.ipv4_unicast.router_always_next_hop ? 'Yes' : 'No'}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Accepted Prefixes">{record.address_family_info.ipv4_unicast.accepted_prefix_counter}</Descriptions.Item>
                            <Descriptions.Item label=""> </Descriptions.Item>
                        </>
                    ) : (
                        <Descriptions.Item label="IPv4 Unicast" span={2}>Not configured</Descriptions.Item>
                    )}
                </Descriptions>

                <br />

                {/* Graceful Restart Information */}
                <Descriptions bordered column={2} size="small" title="Graceful Restart">
                    <Descriptions.Item label="Local Mode">
                        <Tag className='auto-width-tag' color="blue">{record.graceful_restart_info?.local_gr_mode || 'N/A'}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Remote Mode">
                        <Tag className='auto-width-tag' color="cyan">{record.graceful_restart_info?.remote_gr_mode || 'N/A'}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="R-bit">
                        <Tag className='auto-width-tag' color={record.graceful_restart_info?.r_bit ? 'green' : 'red'}>
                            {record.graceful_restart_info?.r_bit ? 'True' : 'False'}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Restart Timers">
                        <Space direction="vertical">
                            <Text>Configured: {record.graceful_restart_info?.timers?.configured_restart_timer || 'N/A'}s</Text>
                            <Text>Received: {record.graceful_restart_info?.timers?.received_restart_timer || 'N/A'}s</Text>
                        </Space>
                    </Descriptions.Item>
                </Descriptions>

                {/* Last Reset Information */}
                {record.last_reset_due_to && (
                    <>
                        <br />
                        <Descriptions bordered column={2} size="small" title="Last Reset Information">
                            <Descriptions.Item label="Reset Reason">{record.last_reset_due_to}</Descriptions.Item>
                            <Descriptions.Item label="Reset Code">{record.last_reset_code}</Descriptions.Item>
                            <Descriptions.Item label="Reset Time" span={2}>
                                {formatTime(record.last_reset_timer_msecs)} ago
                            </Descriptions.Item>
                        </Descriptions>
                    </>
                )}
            </div>
        );
    };

    const handleDelete = async (record: any) => {
        if (!asNumber) {
            showErrorNotification('AS number is required');
            return;
        }

        try {
            const result = await removeBGPNeighbor(clientId, record.peer_ip, asNumber);
            if (result.success) {
                await loadNeighbors();
            }
        } catch (error) {
            console.error('Failed to delete BGP neighbor:', error);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAdd}
                    style={{
                        background: 'linear-gradient(90deg, #056ccd 0%, #00c6fb 100%)',
                        border: 'none',
                        borderRadius: 8
                    }}
                    className="modern-add-btn"
                >
                    Add BGP Neighbor
                </Button>
                <Button
                    icon={<ReloadOutlined />}
                    onClick={loadNeighbors}
                    loading={loading}
                    style={{ borderRadius: 8 }}
                >
                    Refresh
                </Button>
            </div>

            <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <Table
                    dataSource={neighbors}
                    columns={columns}
                    rowKey="peer_ip"
                    expandable={{
                        expandedRowRender,
                        expandRowByClick: true
                    }}
                    loading={loading}
                    pagination={false}
                />
            </Card>

            <EditBGPNeighborDrawer
                open={showDrawer}
                onClose={() => {
                    setShowDrawer(false);
                    setEditingNeighbor(null);
                }}
                onSubmit={handleSubmit}
                neighbor={editingNeighbor}
                clientId={clientId}
            />
        </div>
    );
};

export default BGPNeighborsContent; 