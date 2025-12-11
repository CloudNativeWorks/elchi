import React, { useState, useMemo } from 'react';
import { Card, Table, Tag, Space, Typography, Button, Drawer, Descriptions, Badge, List, Tooltip, Modal, Input, Popconfirm } from 'antd';
import { copyToClipboard } from '@/utils/clipboard';
import {
    RadarChartOutlined,
    EyeOutlined,
    ReloadOutlined,
    ClusterOutlined,
    NodeIndexOutlined,
    ClockCircleOutlined,
    CodeOutlined,
    InfoCircleOutlined,
    SearchOutlined,
    DeleteOutlined,
    AppstoreOutlined
} from '@ant-design/icons';
import { useDiscovery, useDeleteCluster, useClusterUsage } from '../../hooks/useDiscovery';
import { ClusterDiscovery, NodeInfo } from '../../types/discovery';
import { formatDistanceToNow } from 'date-fns';

const { Title, Text } = Typography;

// Add CSS styles for inactive cluster rows
const inactiveClusterStyles = `
.inactive-cluster-row {
    background-color: rgba(255, 77, 79, 0.08) !important;
    border-left: 3px solid #ff4d4f !important;
}

.inactive-cluster-row:hover {
    background-color: rgba(255, 77, 79, 0.12) !important;
}
`;

// Add styles to document head
if (typeof document !== 'undefined') {
    const existingStyle = document.getElementById('discovery-inactive-styles');
    if (!existingStyle) {
        const style = document.createElement('style');
        style.id = 'discovery-inactive-styles';
        style.textContent = inactiveClusterStyles;
        document.head.appendChild(style);
    }
}

const Discovery: React.FC = () => {
    const [selectedCluster, setSelectedCluster] = useState<ClusterDiscovery | null>(null);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [setupModalVisible, setSetupModalVisible] = useState(false);
    const [usageDrawerVisible, setUsageDrawerVisible] = useState(false);
    const [selectedClusterForUsage, setSelectedClusterForUsage] = useState<ClusterDiscovery | null>(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 100,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total: number, range: [number, number]) => `${range[0]}-${range[1]} of ${total} clusters`,
    });
    const { data: clusters, isLoading, error, refetch } = useDiscovery();
    const deleteClusterMutation = useDeleteCluster();
    
    const { data: clusterUsage, isLoading: usageLoading } = useClusterUsage(
        selectedClusterForUsage?.id || '', 
        usageDrawerVisible && !!selectedClusterForUsage?.id
    );

    // Calculate status based on last_seen time
    const getClusterStatus = (lastSeen: string) => {
        const lastSeenTime = new Date(lastSeen).getTime();
        const currentTime = new Date().getTime();
        const timeDifference = currentTime - lastSeenTime;
        const tenMinutesInMs = 10 * 60 * 1000; // 10 minutes in milliseconds

        return timeDifference > tenMinutesInMs ? 'inactive' : 'active';
    };

    // Ensure clusters is always an array and sort by status (inactive first), then by cluster name (A to Z)
    const clustersData = Array.isArray(clusters) ?
        [...clusters].sort((a, b) => {
            const statusA = getClusterStatus(a.last_seen);
            const statusB = getClusterStatus(b.last_seen);

            // Inactive clusters come first
            if (statusA === 'inactive' && statusB === 'active') return -1;
            if (statusA === 'active' && statusB === 'inactive') return 1;

            // If same status, sort by cluster name alphabetically (A to Z), case-insensitive
            const nameA = a.cluster_name.toLowerCase();
            const nameB = b.cluster_name.toLowerCase();
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
        }) : [];

    const handleViewCluster = (cluster: ClusterDiscovery) => {
        setSelectedCluster(cluster);
        setDrawerVisible(true);
    };

    const handleRefresh = () => {
        refetch();
    };

    const handleDeleteCluster = async (cluster: ClusterDiscovery) => {
        if (!cluster.id) {
            console.error('Cluster ID not found');
            return;
        }

        try {
            await deleteClusterMutation.mutateAsync(cluster.id);
        } catch (error: any) {
            console.error('Failed to delete cluster:', error);
        }
    };

    const handleViewUsage = (cluster: ClusterDiscovery) => {
        setSelectedClusterForUsage(cluster);
        setUsageDrawerVisible(true);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'green';
            case 'inactive': return 'red';
            case 'unknown': return 'default';
            default: return 'default';
        }
    };

    const setupInstructions = `# Add Elchi Helm repository
helm repo add elchi https://charts.elchi.io
helm repo update

# Install Elchi Discovery Agent
helm install elchi-discovery elchi/discovery-agent \\
  --set config.elchiEndpoint="https://your-elchi-instance.com" \\
  --set config.token="your-discovery-token" \\
  --set clusterName="my-k8s-cluster" \\
  --namespace elchi-stack \\
  --create-namespace

# Verify installation
kubectl get pods -n elchi-stack`;

    const handleShowSetup = () => {
        setSetupModalVisible(true);
    };

    const handleCopySetup = () => {
        copyToClipboard(setupInstructions, 'Setup instructions copied to clipboard!');
    };

    const getColumnSearchProps = (dataIndex: keyof ClusterDiscovery, title: string) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
            <div style={{ padding: 8 }}>
                <Input
                    placeholder={`Search ${title}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => confirm()}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <div style={{ display: 'flex', gap: 8 }}>
                    <Button
                        type="primary"
                        onClick={() => confirm()}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => {
                            clearFilters?.();
                            confirm();
                        }}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                </div>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value: any, record: ClusterDiscovery) => {
            if (dataIndex === 'last_seen') {
                // For status search, check the computed status
                const status = getClusterStatus(record.last_seen);
                return status.toLowerCase().includes(value.toLowerCase());
            }
            const fieldValue = record[dataIndex];
            return fieldValue?.toString().toLowerCase().includes(value.toLowerCase()) || false;
        },
    });

    const columns = [
        {
            title: 'Cluster Name',
            dataIndex: 'cluster_name',
            key: 'cluster_name',
            ...getColumnSearchProps('cluster_name', 'Cluster Name'),
            render: (text: string) => (
                <Space>
                    <ClusterOutlined style={{ color: '#1890ff' }} />
                    <Text strong>{text}</Text>
                </Space>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'last_seen',
            key: 'status',
            ...getColumnSearchProps('last_seen', 'Status'),
            render: (lastSeen: string) => {
                const status = getClusterStatus(lastSeen);
                return <Tag className='auto-width-tag' color={getStatusColor(status)}>{status.toUpperCase()}</Tag>;
            },
        },
        {
            title: 'Version',
            dataIndex: 'cluster_version',
            key: 'cluster_version',
            ...getColumnSearchProps('cluster_version', 'Version'),
            render: (version: string) => <Text code>{version}</Text>,
        },
        {
            title: 'Nodes',
            dataIndex: 'nodes',
            key: 'nodes',
            render: (nodes: NodeInfo[]) => (
                <Space>
                    <NodeIndexOutlined />
                    <Text>{nodes ? nodes.length : 0}</Text>
                </Space>
            ),
        },
        {
            title: 'Last Seen',
            dataIndex: 'last_seen',
            key: 'last_seen',
            render: (lastSeen: string) => (
                <Tooltip title={new Date(lastSeen).toLocaleString()}>
                    <Text type="secondary">
                        {formatDistanceToNow(new Date(lastSeen), { addSuffix: true })}
                    </Text>
                </Tooltip>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 140,
            render: (record: ClusterDiscovery) => (
                <Space size="small">
                    <Tooltip title="View Details">
                        <Button
                            type="text"
                            size="middle"
                            icon={<EyeOutlined style={{ fontSize: 16 }} />}
                            onClick={() => handleViewCluster(record)}
                            style={{
                                color: '#1890ff',
                                borderRadius: 8,
                                background: 'rgba(24, 144, 255, 0.05)',
                                border: '1px solid rgba(24, 144, 255, 0.15)',
                                width: 36,
                                height: 36,
                                transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(24, 144, 255, 0.1)';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                                e.currentTarget.style.boxShadow = '0 2px 6px rgba(24, 144, 255, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(24, 144, 255, 0.05)';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="View Usage">
                        <Button
                            type="text"
                            size="middle"
                            icon={<AppstoreOutlined style={{ fontSize: 16 }} />}
                            onClick={() => handleViewUsage(record)}
                            style={{
                                color: '#52c41a',
                                borderRadius: 8,
                                background: 'rgba(82, 196, 26, 0.05)',
                                border: '1px solid rgba(82, 196, 26, 0.15)',
                                width: 36,
                                height: 36,
                                transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(82, 196, 26, 0.1)';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                                e.currentTarget.style.boxShadow = '0 2px 6px rgba(82, 196, 26, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(82, 196, 26, 0.05)';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Delete Cluster"
                        description={`Are you sure you want to delete cluster "${record.cluster_name}"? This action cannot be undone.`}
                        onConfirm={() => handleDeleteCluster(record)}
                        onCancel={() => {}}
                        okText="Yes, Delete"
                        cancelText="Cancel"
                        okType="danger"
                        placement="topRight"
                    >
                        <Tooltip title="Delete Cluster">
                            <Button
                                type="text"
                                size="middle"
                                icon={<DeleteOutlined style={{ fontSize: 16 }} />}
                                danger
                                loading={deleteClusterMutation.isPending}
                                style={{
                                    color: '#ff4d4f',
                                    borderRadius: 8,
                                    background: 'rgba(255, 77, 79, 0.05)',
                                    border: '1px solid rgba(255, 77, 79, 0.15)',
                                    width: 36,
                                    height: 36,
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={(e) => {
                                    if (!deleteClusterMutation.isPending) {
                                        e.currentTarget.style.background = 'rgba(255, 77, 79, 0.1)';
                                        e.currentTarget.style.transform = 'translateY(-1px)';
                                        e.currentTarget.style.boxShadow = '0 2px 6px rgba(255, 77, 79, 0.2)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!deleteClusterMutation.isPending) {
                                        e.currentTarget.style.background = 'rgba(255, 77, 79, 0.05)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }
                                }}
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    if (error) {
        return (
            <Card>
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <Text type="danger">Failed to load clusters</Text>
                </div>
            </Card>
        );
    }

    return (
        <>
            <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <Space>
                        <RadarChartOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                        <Title level={4} style={{ margin: 0 }}>Kubernetes Discovery</Title>
                    </Space>
                    <Space>
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={handleRefresh}
                            loading={isLoading}
                        >
                            Refresh
                        </Button>
                        {clustersData.length > 0 && (
                            <Button
                                icon={<CodeOutlined />}
                                onClick={handleShowSetup}
                                type="dashed"
                            >
                                Setup Instructions
                            </Button>
                        )}
                    </Space>
                </div>

                <Text type="secondary">
                    Kubernetes clusters discovered and registered by discovery agents.
                </Text>
            </div>

            {clustersData.length === 0 && !isLoading && !error ? (
                <Card>
                    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                        <RadarChartOutlined style={{ fontSize: 64, color: '#d9d9d9', marginBottom: 16 }} />
                        <Title level={3} style={{ color: '#595959', marginBottom: 16 }}>No Clusters Discovered</Title>
                        <Text type="secondary" style={{ fontSize: 16, display: 'block', marginBottom: 24 }}>
                            Deploy the Elchi Discovery Agent to your Kubernetes clusters to start monitoring and managing your infrastructure.
                        </Text>

                        <div style={{
                            background: '#f6ffed',
                            border: '1px solid #b7eb8f',
                            borderRadius: 8,
                            padding: '20px',
                            marginBottom: 24,
                            textAlign: 'left'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                                <InfoCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                                <Text strong style={{ color: '#52c41a' }}>Quick Setup</Text>
                            </div>
                            <pre style={{
                                background: '#f5f5f5',
                                padding: 16,
                                borderRadius: 6,
                                margin: 0,
                                fontSize: 13,
                                lineHeight: 1.5,
                                overflow: 'auto'
                            }}>
                                {setupInstructions}
                            </pre>
                        </div>

                        <Space>
                            <Button
                                type="primary"
                                icon={<CodeOutlined />}
                                onClick={handleCopySetup}
                                size="large"
                            >
                                Copy Setup Commands
                            </Button>
                            <Button
                                icon={<InfoCircleOutlined />}
                                onClick={handleShowSetup}
                                size="large"
                            >
                                View Detailed Instructions
                            </Button>
                        </Space>
                    </div>
                </Card>
            ) : (
                <Card>
                    <Table
                        columns={columns}
                        dataSource={clustersData}
                        loading={isLoading}
                        rowKey="cluster_name"
                        rowClassName={(record) => {
                            const status = getClusterStatus(record.last_seen);
                            return status === 'inactive' ? 'inactive-cluster-row' : '';
                        }}
                        pagination={{
                            ...pagination,
                            total: clustersData.length,
                            onChange: (page, pageSize) => {
                                setPagination(prev => ({
                                    ...prev,
                                    current: page,
                                    pageSize: pageSize || prev.pageSize,
                                }));
                            },
                            onShowSizeChange: (_, size) => {
                                setPagination(prev => ({
                                    ...prev,
                                    current: 1,
                                    pageSize: size,
                                }));
                            },
                        }}
                    />
                </Card>
            )}

            <Drawer
                title={
                    <Space>
                        <ClusterOutlined style={{ color: '#1890ff' }} />
                        <span>Cluster Details: {selectedCluster?.cluster_name}</span>
                    </Space>
                }
                placement="right"
                width={1200}
                onClose={() => setDrawerVisible(false)}
                open={drawerVisible}
            >
                {selectedCluster && (
                    <Space direction="vertical" style={{ width: '100%' }} size="large">
                        <div style={{
                            borderRadius: 12,
                            marginBottom: 16,
                            border: '1px solid #f0f0f0'
                        }}>
                            <div style={{
                                background: 'linear-gradient(135deg, #f1f3f4 0%, #e8eaed 100%)',
                                padding: 16,
                                borderTopLeftRadius: 12,
                                borderTopRightRadius: 12,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <Space>
                                    <InfoCircleOutlined style={{ color: '#1890ff' }} />
                                    <Text strong style={{ fontSize: 16 }}>Cluster Information</Text>
                                </Space>
                            </div>
                            <div style={{
                                padding: 16,
                                background: 'white',
                                borderBottomLeftRadius: 12,
                                borderBottomRightRadius: 12
                            }}>
                                <Descriptions column={1} size="small">
                                    <Descriptions.Item label="Cluster Name">
                                        <Text strong>{selectedCluster.cluster_name}</Text>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Status">
                                        {(() => {
                                            const status = getClusterStatus(selectedCluster.last_seen);
                                            return (
                                                <Badge
                                                    status={getStatusColor(status) as any}
                                                    text={status.toUpperCase()}
                                                />
                                            );
                                        })()}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Version">
                                        <Text code>{selectedCluster.cluster_version}</Text>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Node Count">
                                        {selectedCluster.nodes ? selectedCluster.nodes.length : 0}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Project">
                                        {selectedCluster.project}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Last Seen">
                                        <Space>
                                            <ClockCircleOutlined />
                                            <Text>
                                                {formatDistanceToNow(new Date(selectedCluster.last_seen), { addSuffix: true })}
                                            </Text>
                                            <Text type="secondary">
                                                ({new Date(selectedCluster.last_seen).toLocaleString()})
                                            </Text>
                                        </Space>
                                    </Descriptions.Item>
                                </Descriptions>
                            </div>
                        </div>

                        <div style={{
                            borderRadius: 12,
                            marginBottom: 16,
                            border: '1px solid #f0f0f0'
                        }}>
                            <div style={{
                                background: 'linear-gradient(135deg, #f1f3f4 0%, #e8eaed 100%)',
                                padding: 16,
                                borderTopLeftRadius: 12,
                                borderTopRightRadius: 12,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <Space>
                                    <NodeIndexOutlined style={{ color: '#1890ff' }} />
                                    <Text strong style={{ fontSize: 16 }}>Nodes ({selectedCluster.nodes?.length || 0})</Text>
                                </Space>
                            </div>
                            <div style={{
                                padding: 0,
                                background: 'white',
                                borderBottomLeftRadius: 12,
                                borderBottomRightRadius: 12
                            }}>
                                <Table
                                    dataSource={selectedCluster.nodes}
                                    rowKey="name"
                                    size="small"
                                    pagination={false}
                                    style={{ borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}
                                    columns={[
                                        {
                                            title: 'Node Name',
                                            dataIndex: 'name',
                                            key: 'name',
                                            render: (text: string) => (
                                                <Space>
                                                    <NodeIndexOutlined style={{ color: '#1890ff' }} />
                                                    <Text strong>{text}</Text>
                                                </Space>
                                            ),
                                            width: '35%'
                                        },
                                        {
                                            title: 'Status',
                                            dataIndex: 'status',
                                            key: 'status',
                                            render: (status: string) => (
                                                <Badge
                                                    status={status === 'Ready' ? 'success' : status === 'NotReady' ? 'error' : 'warning'}
                                                    text={<Text strong style={{ color: status === 'Ready' ? '#52c41a' : status === 'NotReady' ? '#ff4d4f' : '#faad14' }}>{status}</Text>}
                                                />
                                            ),
                                            width: '10%'
                                        },
                                        {
                                            title: 'Version',
                                            dataIndex: 'version',
                                            key: 'version',
                                            render: (version: string) => <Text code>{version}</Text>,
                                            width: '10%'
                                        },
                                        {
                                            title: 'Roles',
                                            dataIndex: 'roles',
                                            key: 'roles',
                                            render: (roles: string[]) => (
                                                <Space size={[0, 4]} wrap>
                                                    {roles && roles.length > 0 ? (
                                                        roles.map(role => (
                                                            <Tag key={role} color="purple" style={{ marginRight: 4 }}>
                                                                {role}
                                                            </Tag>
                                                        ))
                                                    ) : (
                                                        <Text type="secondary">-</Text>
                                                    )}
                                                </Space>
                                            ),
                                            width: '10%'
                                        },
                                        {
                                            title: 'Addresses',
                                            dataIndex: 'addresses',
                                            key: 'addresses',
                                            render: (addresses: Record<string, string>) => (
                                                <Space direction="vertical" size="small">
                                                    {Object.entries(addresses).map(([type, address]) => (
                                                        <Space key={type} style={{ display: 'flex', alignItems: 'center' }}>
                                                            <Tag color="blue" style={{ margin: 0, minWidth: 80, textAlign: 'center' }}>
                                                                {type}
                                                            </Tag>
                                                            <Text copyable={{ text: address }} style={{ fontFamily: 'monospace', fontSize: 12 }}>
                                                                {address}
                                                            </Text>
                                                        </Space>
                                                    ))}
                                                </Space>
                                            ),
                                            width: '45%'
                                        }
                                    ]}
                                />
                            </div>
                        </div>
                    </Space>
                )}
            </Drawer>

            <Modal
                title={
                    <Space>
                        <CodeOutlined style={{ color: '#1890ff' }} />
                        <span>Deploy Discovery Agent</span>
                    </Space>
                }
                open={setupModalVisible}
                onCancel={() => setSetupModalVisible(false)}
                footer={[
                    <Button key="copy" type="primary" icon={<CodeOutlined />} onClick={handleCopySetup}>
                        Copy Commands
                    </Button>,
                    <Button key="close" onClick={() => setSetupModalVisible(false)}>
                        Close
                    </Button>
                ]}
                width={800}
            >
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                    <div>
                        <Title level={5}>Prerequisites</Title>
                        <List
                            size="small"
                            dataSource={[
                                'Helm 3.x installed on your local machine',
                                'Discovery token from Settings → Tokens page'
                            ]}
                            renderItem={item => (
                                <List.Item>
                                    <Space>
                                        <Badge status="default" />
                                        <Text>{item}</Text>
                                    </Space>
                                </List.Item>
                            )}
                        />
                    </div>

                    <div>
                        <Title level={5}>Installation Commands</Title>
                        <div style={{
                            background: '#f5f5f5',
                            border: '1px solid #d9d9d9',
                            borderRadius: 6,
                            padding: 16
                        }}>
                            <pre style={{
                                margin: 0,
                                fontSize: 13,
                                lineHeight: 1.6,
                                whiteSpace: 'pre-wrap'
                            }}>
                                {setupInstructions}
                            </pre>
                        </div>
                    </div>

                    <div>
                        <Title level={5}>Configuration Parameters</Title>
                        <List
                            size="small"
                            dataSource={[
                                { key: 'config.elchiEndpoint', desc: 'Your Elchi instance URL' },
                                { key: 'config.token', desc: 'Discovery token from Settings page' },
                                { key: 'clusterName', desc: 'Unique name for your cluster' }
                            ]}
                            renderItem={item => (
                                <List.Item>
                                    <Space direction="vertical" size={2}>
                                        <Text code>{item.key}</Text>
                                        <Text type="secondary" style={{ fontSize: 12 }}>{item.desc}</Text>
                                    </Space>
                                </List.Item>
                            )}
                        />
                    </div>

                    <div style={{
                        background: '#e6f7ff',
                        border: '1px solid #91d5ff',
                        borderRadius: 6,
                        padding: 12
                    }}>
                        <Space>
                            <InfoCircleOutlined style={{ color: '#1890ff' }} />
                            <Text style={{ fontSize: 13 }}>
                                <strong>Note:</strong> After installation, it may take a few moments for your cluster to appear in the discovery list.
                                The agent will automatically register your cluster and start reporting node information.
                            </Text>
                        </Space>
                    </div>
                </Space>
            </Modal>

            {/* Cluster Usage Drawer */}
            <Drawer
                title={
                    <Space>
                        <AppstoreOutlined style={{ color: '#52c41a' }} />
                        <span>Cluster Usage: {selectedClusterForUsage?.cluster_name}</span>
                    </Space>
                }
                placement="right"
                width={800}
                open={usageDrawerVisible}
                onClose={() => {
                    setUsageDrawerVisible(false);
                    setSelectedClusterForUsage(null);
                }}
            >
                {usageLoading ? (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <Typography.Text>Loading usage information...</Typography.Text>
                    </div>
                ) : clusterUsage ? (
                    <Space direction="vertical" style={{ width: '100%' }} size="large">
                        <div style={{
                            background: clusterUsage.usage_count > 0 ? '#f6ffed' : '#fff7e6',
                            border: clusterUsage.usage_count > 0 ? '1px solid #b7eb8f' : '1px solid #ffd591',
                            borderRadius: 8,
                            padding: 16,
                            textAlign: 'center'
                        }}>
                            <Space direction="vertical" size="small">
                                <Text strong style={{ fontSize: 18 }}>
                                    Usage Summary
                                </Text>
                                <Text style={{ fontSize: 24, fontWeight: 'bold', color: clusterUsage.usage_count > 0 ? '#52c41a' : '#fa8c16' }}>
                                    {clusterUsage.usage_count} Endpoint{clusterUsage.usage_count !== 1 ? 's' : ''} Using This Discovery Cluster
                                </Text>
                            </Space>
                        </div>

                        {clusterUsage.usage_count > 0 ? (
                            <div>
                                <Title level={5}>Endpoints Using This Discovery Cluster</Title>
                                <List
                                    itemLayout="vertical"
                                    dataSource={clusterUsage.endpoints}
                                    renderItem={(endpoint, index) => (
                                        <List.Item
                                            style={{
                                                background: '#fafafa',
                                                border: '1px solid #d9d9d9',
                                                borderRadius: 8,
                                                padding: 16,
                                                marginBottom: 8
                                            }}
                                        >
                                            <List.Item.Meta
                                                avatar={
                                                    <div style={{
                                                        background: '#52c41a',
                                                        color: 'white',
                                                        width: 32,
                                                        height: 32,
                                                        borderRadius: '50%',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: 14,
                                                        fontWeight: 600
                                                    }}>
                                                        {index + 1}
                                                    </div>
                                                }
                                                title={
                                                    <Space>
                                                        <Text strong style={{ fontSize: 16 }}>
                                                            {endpoint.endpoint_name}
                                                        </Text>
                                                        <Tag color="blue">{endpoint.version}</Tag>
                                                    </Space>
                                                }
                                                description={
                                                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                                        <Space>
                                                            <Text type="secondary">IP Count:</Text>
                                                            <Badge count={endpoint.ip_count} style={{ backgroundColor: '#52c41a' }} />
                                                        </Space>
                                                        <Space>
                                                            <Text type="secondary">Last Updated:</Text>
                                                            <Text>
                                                                {formatDistanceToNow(new Date(endpoint.updated_at), { addSuffix: true })}
                                                            </Text>
                                                        </Space>
                                                        <div>
                                                            <Text type="secondary">IP Addresses:</Text>
                                                            <div style={{ marginTop: 4, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                                                {endpoint.ips.map((ip) => (
                                                                    <Tag key={ip} color="cyan" style={{ fontSize: 11 }}>
                                                                        {ip}
                                                                    </Tag>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </Space>
                                                }
                                            />
                                        </List.Item>
                                    )}
                                />
                            </div>
                        ) : (
                            <div style={{
                                textAlign: 'center',
                                padding: '40px 20px',
                                background: '#fafafa',
                                borderRadius: 8,
                                border: '1px dashed #d9d9d9'
                            }}>
                                <AppstoreOutlined style={{ fontSize: 48, color: '#d9d9d9', marginBottom: 16 }} />
                                <Title level={4} style={{ color: '#8c8c8c' }}>No Endpoints Using This Discovery Cluster</Title>
                                <Text type="secondary">
                                    This cluster is not currently being used by any endpoint resources.
                                    It can be safely deleted if no longer needed.
                                </Text>
                            </div>
                        )}
                    </Space>
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <Typography.Text type="secondary">No usage data available</Typography.Text>
                    </div>
                )}
            </Drawer>
        </>
    );
};

export default Discovery;