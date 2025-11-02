import React, { useState, useEffect } from 'react';
import { Modal, Table, Button, Form, Select, InputNumber, message, Space, Typography, Alert, Checkbox } from 'antd';
import { CloudServerOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useCustomGetQuery } from '@/common/api';
import { useProjectVariable } from '@/hooks/useProjectVariable';

const { Text, Title } = Typography;

interface DiscoveryModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (discoveries: DiscoveryConfig[]) => void;
    initialData?: DiscoveryConfig[];
}

interface DiscoveryConfig {
    cluster_name: string;
    protocol: 'TCP' | 'UDP';
    port: number;
    address_type: 'ExternalIP' | 'InternalIP';
    roles?: string[];
}

interface ClusterData {
    id: string;
    cluster_name: string;
    project: string;
    node_count: number;
    cluster_version: string;
    last_seen: string;
    nodes: any[];
}

const DiscoveryModal: React.FC<DiscoveryModalProps> = ({ open, onClose, onSave, initialData = [] }) => {
    const [form] = Form.useForm();
    const [selectedClusters, setSelectedClusters] = useState<DiscoveryConfig[]>(initialData);
    const [selectedClusterName, setSelectedClusterName] = useState<string | undefined>();
    const { project } = useProjectVariable();
    const [messageApi, contextHolder] = message.useMessage();

    const { data: clustersData, isLoading, error } = useCustomGetQuery({
        queryKey: 'discovery_clusters',
        enabled: open,
        path: `api/discovery/clusters?project=${project}`,
        directApi: true
    });

    useEffect(() => {
        setSelectedClusters(initialData);
        setSelectedClusterName(undefined);
        // Form will be reset by key prop change
    }, [initialData, open]);

    const handleAddCluster = () => {
        form.validateFields().then((values) => {
            const selectedRoles = [];
            if (values.role_master) selectedRoles.push('master');
            if (values.role_worker) selectedRoles.push('worker');
            
            const newDiscovery: DiscoveryConfig = {
                cluster_name: values.cluster_name,
                protocol: values.protocol,
                port: values.port,
                address_type: values.address_type,
                roles: selectedRoles.length > 0 ? selectedRoles : undefined
            };

            // Check if cluster already exists
            if (selectedClusters.some(item => item.cluster_name === newDiscovery.cluster_name)) {
                messageApi.error('This cluster is already added');
                return;
            }

            setSelectedClusters([...selectedClusters, newDiscovery]);
            form.resetFields();
            setSelectedClusterName(undefined);
        }).catch(() => {
            messageApi.error('Please fill all required fields');
        });
    };

    const handleRemoveCluster = (clusterName: string) => {
        setSelectedClusters(selectedClusters.filter(item => item.cluster_name !== clusterName));
    };

    const handleSave = () => {
        onSave(selectedClusters);
        onClose();
    };

    const columns = [
        {
            title: 'Cluster Name',
            dataIndex: 'cluster_name',
            key: 'cluster_name',
            render: (text: string) => (
                <Space>
                    <CloudServerOutlined style={{ color: '#1890ff' }} />
                    <Text strong>{text}</Text>
                </Space>
            ),
        },
        {
            title: 'Protocol',
            dataIndex: 'protocol',
            key: 'protocol',
            render: (protocol: string) => (
                <Text code style={{ color: protocol === 'TCP' ? '#52c41a' : '#1890ff' }}>
                    {protocol}
                </Text>
            ),
        },
        {
            title: 'Port',
            dataIndex: 'port',
            key: 'port',
            render: (port: number) => (
                <Text code style={{ backgroundColor: '#f0f2f5', padding: '2px 6px', borderRadius: '4px' }}>
                    {port}
                </Text>
            ),
        },
        {
            title: 'Address Type',
            dataIndex: 'address_type',
            key: 'address_type',
            render: (addressType: string) => (
                <Text code style={{
                    backgroundColor: addressType === 'ExternalIP' ? '#e6fffb' : '#f0f5ff',
                    color: addressType === 'ExternalIP' ? '#00b96b' : '#1677ff',
                    padding: '2px 6px',
                    borderRadius: '4px'
                }}>
                    {addressType}
                </Text>
            ),
        },
        {
            title: 'Roles',
            dataIndex: 'roles',
            key: 'roles',
            render: (roles: string[]) => (
                <Text type="secondary">
                    {roles && roles.length > 0 ? roles.join(', ') : 'All'}
                </Text>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: DiscoveryConfig) => (
                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveCluster(record.cluster_name)}
                    size="small"
                >
                    Remove
                </Button>
            ),
        },
    ];

    const availableClusters = Array.isArray(clustersData) ? clustersData : (clustersData?.clusters || []);
    const usedClusters = selectedClusters.map(item => item.cluster_name);
    const unusedClusters = availableClusters.filter((cluster: ClusterData) =>
        !usedClusters.includes(cluster.cluster_name)
    );

    // Get available address types for selected cluster
    const getAvailableAddressTypes = (clusterName: string) => {
        const cluster = availableClusters.find((c: ClusterData) => c.cluster_name === clusterName);
        if (!cluster || !cluster.nodes || cluster.nodes.length === 0) return [];

        const firstNode = cluster.nodes[0];
        const addresses = firstNode.addresses || {};
        const availableTypes: string[] = [];

        if (addresses.ExternalIP) availableTypes.push('ExternalIP');
        if (addresses.InternalIP) availableTypes.push('InternalIP');

        return availableTypes;
    };

    const availableAddressTypes = selectedClusterName ? getAvailableAddressTypes(selectedClusterName) : [];


    return (
        <>
            {contextHolder}
            <Modal
                title={
                    <Space>
                        <CloudServerOutlined style={{ color: '#1890ff' }} />
                        <span>Cluster Discovery Configuration</span>
                    </Space>
                }
                open={open}
                onCancel={onClose}
                width={900}
                footer={[
                    <Button key="cancel" onClick={onClose}>
                        Cancel
                    </Button>,
                    <Button key="save" type="primary" onClick={handleSave}>
                        Save Configuration
                    </Button>
                ]}
                style={{ borderRadius: 12 }}
            >
                <div style={{ marginBottom: 24 }}>
                    <Text type="secondary">
                        Configure cluster discovery for automatic endpoint detection.
                        Select clusters and specify protocols and ports for service discovery.
                    </Text>
                </div>

                {error && (
                    <Alert
                        message="Failed to load clusters"
                        description="Unable to fetch available clusters. Please try again."
                        type="error"
                        style={{ marginBottom: 16 }}
                        showIcon
                    />
                )}

                {/* Add New Cluster Form */}
                <div style={{
                    background: '#fafafa',
                    padding: 16,
                    borderRadius: 8,
                    marginBottom: 24,
                    border: '1px solid #e8f4ff'
                }}>
                    <Title level={5} style={{ marginBottom: 16 }}>Add New Cluster</Title>
                    <Form form={form} layout="vertical">
                        {/* Cluster Selection - Top */}
                        <Form.Item
                            name="cluster_name"
                            label={<span>Cluster <span style={{ color: '#ff4d4f' }}>*</span></span>}
                            rules={[{ required: true, message: 'Please select a cluster' }]}
                            style={{ marginBottom: 16 }}
                        >
                            <Select
                                placeholder="Select cluster"
                                loading={isLoading}
                                disabled={isLoading || unusedClusters.length === 0}
                                style={{ width: '100%' }}
                                onChange={(value) => {
                                    setSelectedClusterName(value);
                                }}
                                showSearch
                                filterOption={(input, option) =>
                                    (option?.value?.toString().toLowerCase() ?? '').includes(input.toLowerCase())
                                }
                            >
                                {unusedClusters.map((cluster: ClusterData, index: number) => (
                                    <Select.Option key={cluster.cluster_name || `cluster-${index}`} value={cluster.cluster_name}>
                                        <Space>
                                            <CloudServerOutlined />
                                            <span>{cluster.cluster_name}</span>
                                            <Text type="secondary" style={{ fontSize: 12 }}>
                                                ({cluster.cluster_version}, {cluster.nodes?.length || 0} nodes)
                                            </Text>
                                        </Space>
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        {/* Other Options - Below */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
                            <Form.Item
                                name="protocol"
                                label={<span>Protocol <span style={{ color: '#ff4d4f' }}>*</span></span>}
                                rules={[{ required: true, message: 'Please select protocol' }]}
                                style={{ marginBottom: 0 }}
                            >
                                <Select placeholder="Protocol">
                                    <Select.Option value="TCP">TCP</Select.Option>
                                    <Select.Option value="UDP">UDP</Select.Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="port"
                                label={<span>Port <span style={{ color: '#ff4d4f' }}>*</span></span>}
                                rules={[
                                    { required: true, message: 'Please enter port' },
                                    { type: 'number', min: 1, max: 65535, message: 'Port must be between 1-65535' }
                                ]}
                                style={{ marginBottom: 0 }}
                            >
                                <InputNumber
                                    placeholder="Port"
                                    min={1}
                                    max={65535}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>

                            <Form.Item
                                name="address_type"
                                label={<span>Address Type <span style={{ color: '#ff4d4f' }}>*</span></span>}
                                rules={[{ required: true, message: 'Please select address type' }]}
                                style={{ marginBottom: 0 }}
                            >
                                <Select
                                    placeholder="Address Type"
                                    disabled={!selectedClusterName || availableAddressTypes.length === 0}
                                >
                                    <Select.Option
                                        value="ExternalIP"
                                        disabled={!availableAddressTypes.includes('ExternalIP')}
                                    >
                                        External IP {!availableAddressTypes.includes('ExternalIP') && '(Not Available)'}
                                    </Select.Option>
                                    <Select.Option
                                        value="InternalIP"
                                        disabled={!availableAddressTypes.includes('InternalIP')}
                                    >
                                        Internal IP {!availableAddressTypes.includes('InternalIP') && '(Not Available)'}
                                    </Select.Option>
                                </Select>
                            </Form.Item>
                        </div>

                        {/* Role Selection */}
                        <div style={{ marginBottom: 16 }}>
                            <div style={{ marginBottom: 8, fontSize: 12, fontWeight: 500, color: '#595959' }}>
                                Node Roles (Optional - leave unchecked to include all nodes)
                            </div>
                            <Space>
                                <Form.Item
                                    name="role_master"
                                    valuePropName="checked"
                                    style={{ marginBottom: 0 }}
                                >
                                    <Checkbox>Control Plane (Master)</Checkbox>
                                </Form.Item>
                                <Form.Item
                                    name="role_worker"
                                    valuePropName="checked"
                                    initialValue={true}
                                    style={{ marginBottom: 0 }}
                                >
                                    <Checkbox>Worker</Checkbox>
                                </Form.Item>
                            </Space>
                        </div>

                        {/* Add Button */}
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleAddCluster}
                            disabled={isLoading || unusedClusters.length === 0}
                            style={{ width: '100%' }}
                        >
                            Add Cluster
                        </Button>
                    </Form>
                </div>

                {/* Selected Clusters Table */}
                <div>
                    <Title level={5} style={{ marginBottom: 16 }}>
                        Selected Clusters ({selectedClusters.length})
                    </Title>
                    <Table
                        columns={columns}
                        dataSource={selectedClusters}
                        rowKey="cluster_name"
                        pagination={false}
                        size="small"
                        locale={{
                            emptyText: 'No clusters added yet. Add clusters using the form above.'
                        }}
                        style={{
                            border: '1px solid #f0f0f0',
                            borderRadius: 8
                        }}
                    />
                </div>
            </Modal>
        </>
    );
};

export default DiscoveryModal;