import React, { useState, useEffect } from 'react';
import { Card, Button, Space, Typography, Form, Input, Select, message, Popconfirm, Empty, Tooltip, Tag, Row, Col, Collapse } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CloudOutlined, EyeOutlined, EyeInvisibleOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { api } from '@/common/api';
import { useProjectVariable } from '@/hooks/useProjectVariable';

const { Title, Text } = Typography;
const { Panel } = Collapse;

interface CloudAuth {
    auth_url: string;
    application_credential_id?: string;
    application_credential_secret?: string;
}

interface CloudConfig {
    provider: string;
    auth: CloudAuth;
    region_name: string;
    interface?: string;
    identity_api_version?: number;
    auth_type?: string;
}


const CloudsConfig: React.FC = () => {
    const { project } = useProjectVariable();
    const [clouds, setClouds] = useState<{ [key: string]: CloudConfig }>({});
    const [editingCloud, setEditingCloud] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [expandedPanels, setExpandedPanels] = useState<string[]>([]);

    const providers = [
        { 
            value: 'openstack', 
            label: 'OpenStack', 
            icon: (
                <svg width="20" height="20" viewBox="0 0 32 32" style={{ marginRight: 8 }}>
                    <path fill="#da1a32" d="M16 2L4 8v16l12 6 12-6V8L16 2z"/>
                    <path fill="#ffffff" d="M8 12h16v8H8z"/>
                    <path fill="#da1a32" d="M10 14h12v4H10z"/>
                </svg>
            ), 
            available: true 
        },
        { 
            value: 'aws', 
            label: 'AWS', 
            icon: (
                <svg width="20" height="20" viewBox="0 0 32 32" style={{ marginRight: 8 }}>
                    <path fill="#FF9900" d="M13.5 22.1c1.8-1.4 4.4-2.1 6.6-2.1c.8 0 1.6.1 2.4.2c-.4-.5-.9-.9-1.5-1.2c-1.2-.6-2.7-.9-4.1-.9c-2.6 0-5.1.7-7.1 2c-.5.3-1 .7-1.4 1.1c.7.3 1.4.6 2 1c1.1.6 2.2 1.2 3.1 1.9z"/>
                    <path fill="#FF9900" d="M24.4 25.7c2.2-2.5 3.6-5.8 3.6-9.4c0-3.6-1.4-6.9-3.6-9.4c-.2-.2-.3-.4-.5-.6c-.1-.1-.3-.3-.4-.4c-2.4-2.7-5.9-4.4-9.8-4.4s-7.4 1.7-9.8 4.4c-.1.1-.3.3-.4.4c-.2.2-.3.4-.5.6C.8 9.4-.6 12.7-.6 16.3c0 3.6 1.4 6.9 3.6 9.4c.2.2.3.4.5.6c.1.1.3.3.4.4c2.4 2.7 5.9 4.4 9.8 4.4s7.4-1.7 9.8-4.4c.1-.1.3-.3.4-.4c.2-.2.3-.4.5-.6z"/>
                </svg>
            ), 
            available: false 
        },
        { 
            value: 'azure', 
            label: 'Azure', 
            icon: (
                <svg width="20" height="20" viewBox="0 0 32 32" style={{ marginRight: 8 }}>
                    <path fill="#0078D4" d="M12.258 4.906l-8.351 23.888 12.901-1.846 8.351-23.888z"/>
                    <path fill="#00BCF2" d="M20.807 2.214l-8.549 1.692v26.188l12.901-1.846z"/>
                </svg>
            ), 
            available: false 
        },
        { 
            value: 'gcp', 
            label: 'Google Cloud', 
            icon: (
                <svg width="20" height="20" viewBox="0 0 32 32" style={{ marginRight: 8 }}>
                    <path fill="#4285f4" d="M21 12h10v8H21z"/>
                    <path fill="#34a853" d="M1 20h10v8H1z"/>
                    <path fill="#fbbc04" d="M21 4h10v8H21z"/>
                    <path fill="#ea4335" d="M11 20h10v8H11z"/>
                </svg>
            ), 
            available: false 
        },
    ];

    useEffect(() => {
        fetchClouds();
    }, [project]);

    const fetchClouds = async () => {
        try {
            const response = await api.get(`/api/v3/setting/clouds?project=${project}`);
            if (response.data && response.data.clouds) {
                setClouds(response.data.clouds);
            }
        } catch (error: any) {
            messageApi.error('Failed to fetch cloud configurations');
            console.error('Error fetching clouds:', error);
        }
    };

    const handleSubmit = async (values: any) => {
        const cloudName = values.cloud_name;
        const cloudConfig: CloudConfig = {
            provider: 'openstack', // Currently only OpenStack is supported
            auth: {
                auth_url: values.auth_url,
                application_credential_id: values.application_credential_id,
                application_credential_secret: values.application_credential_secret,
            },
            region_name: values.region_name,
            interface: values.interface || 'public',
            identity_api_version: 3,
            auth_type: 'v3applicationcredential',
        };

        try {
            const method = editingCloud ? 'put' : 'post';
            const response = await api[method](
                `/api/v3/setting/clouds/${cloudName}?project=${project}`,
                cloudConfig
            );
            
            if (response.data) {
                messageApi.success(response.data.message || 'Cloud configuration saved successfully');
                await fetchClouds();
                form.resetFields();
                setShowAddForm(false);
                setEditingCloud(null);
            }
        } catch (error: any) {
            messageApi.error(error.response?.data?.message || 'Failed to save cloud configuration');
            console.error('Error saving cloud:', error);
        }
    };

    const handleDelete = async (cloudName: string) => {
        try {
            const response = await api.delete(
                `/api/v3/setting/clouds/${cloudName}?project=${project}`
            );
            
            if (response.data) {
                messageApi.success(response.data.message || 'Cloud configuration deleted successfully');
                await fetchClouds();
            }
        } catch (error: any) {
            messageApi.error(error.response?.data?.message || 'Failed to delete cloud configuration');
            console.error('Error deleting cloud:', error);
        }
    };

    const handleEdit = async (cloudName: string) => {
        const cloud = clouds[cloudName];
        if (cloud) {
            form.setFieldsValue({
                cloud_name: cloudName,
                auth_url: cloud.auth.auth_url,
                application_credential_id: cloud.auth.application_credential_id,
                application_credential_secret: cloud.auth.application_credential_secret,
                region_name: cloud.region_name,
                interface: cloud.interface,
            });
            setEditingCloud(cloudName);
            setShowAddForm(true);
            setExpandedPanels(['add-form']);
        }
    };


    const CloudCard = ({ name, config }: { name: string; config: CloudConfig }) => {        
        return (
            <Card
                style={{
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)',
                    border: '1px solid #e6f4ff',
                    marginBottom: 16,
                    boxShadow: '0 2px 8px rgba(24,144,255,0.08)',
                }}
                hoverable
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ marginBottom: 16 }}>
                            <Space align="center" style={{ marginBottom: 8 }}>
                                <CloudOutlined style={{ fontSize: 20, color: '#1890ff' }} />
                                <Text strong style={{ fontSize: 16 }} copyable={{ text: name }}>{name}</Text>
                                <Tag color="blue">
                                    {providers.find(p => p.value === config.provider)?.label || config.provider}
                                </Tag>
                            </Space>
                        </div>
                        
                        <Row gutter={[16, 12]}>
                            <Col xs={24} sm={12} md={8}>
                                <Text type="secondary" style={{ fontSize: 12 }}>Auth URL</Text>
                                <div>
                                    <Text copyable={{ text: config.auth.auth_url }} style={{ fontSize: 13 }}>
                                        {config.auth.auth_url}
                                    </Text>
                                </div>
                            </Col>
                            
                            <Col xs={24} sm={12} md={8}>
                                <Text type="secondary" style={{ fontSize: 12 }}>Region</Text>
                                <div>
                                    <Tag color="green">{config.region_name}</Tag>
                                </div>
                            </Col>

                            <Col xs={24} sm={12} md={8}>
                                <Text type="secondary" style={{ fontSize: 12 }}>Interface</Text>
                                <div>
                                    <Tag color="blue">{config.interface || 'public'}</Tag>
                                </div>
                            </Col>
                            
                            <Col span={24}>
                                <Text type="secondary" style={{ fontSize: 12 }}>Application Credential ID</Text>
                                <div style={{ marginTop: 4 }}>
                                    <Text code style={{ fontSize: 12 }}>
                                        {config.auth.application_credential_id}
                                    </Text>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    
                    <Space direction="vertical" align="end">
                        <Space>
                            <Tooltip title="Edit">
                                <Button
                                    type="text"
                                    icon={<EditOutlined />}
                                    onClick={() => handleEdit(name)}
                                />
                            </Tooltip>
                            <Popconfirm
                                title="Delete Cloud Configuration"
                                description={`Are you sure you want to delete "${name}"?`}
                                onConfirm={() => handleDelete(name)}
                                okText="Delete"
                                cancelText="Cancel"
                            >
                                <Tooltip title="Delete">
                                    <Button
                                        type="text"
                                        danger
                                        icon={<DeleteOutlined />}
                                    />
                                </Tooltip>
                            </Popconfirm>
                        </Space>
                    </Space>
                </div>
            </Card>
        );
    };

    const AddFormContent = () => (
        <Card
            style={{
                borderRadius: 12,
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                border: '1px solid #bae7ff',
                marginBottom: 16,
            }}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Row gutter={16}>
                    <Col xs={24} sm={12} md={6}>
                        <Form.Item
                            name="cloud_name"
                            label="Cloud Name"
                            rules={[
                                { required: true, message: 'Required' },
                                { pattern: /^[a-zA-Z0-9_-]+$/, message: 'Invalid format' }
                            ]}
                        >
                            <Input
                                placeholder="e.g., preprod"
                                disabled={!!editingCloud}
                                prefix={<CloudOutlined />}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={6}>
                        <Form.Item
                            name="region_name"
                            label="Region"
                            rules={[{ required: true, message: 'Required' }]}
                        >
                            <Input placeholder="e.g., RegionOne" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={6}>
                        <Form.Item
                            label="Provider"
                        >
                            <Select value="openstack" disabled>
                                <Select.Option value="openstack">
                                    <Space>
                                        <svg width="16" height="16" viewBox="0 0 32 32">
                                            <path fill="#da1a32" d="M16 2L4 8v16l12 6 12-6V8L16 2z"/>
                                            <path fill="#ffffff" d="M8 12h16v8H8z"/>
                                            <path fill="#da1a32" d="M10 14h12v4H10z"/>
                                        </svg>
                                        <span>OpenStack</span>
                                    </Space>
                                </Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={6}>
                        <Form.Item
                            label="API Version"
                        >
                            <Select value={3} disabled>
                                <Select.Option value={3}>Version 3</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            name="auth_url"
                            label="Authentication URL"
                            rules={[
                                { required: true, message: 'Required' },
                                { type: 'url', message: 'Invalid URL' }
                            ]}
                        >
                            <Input placeholder="https://os.example.com:5000" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={6}>
                        <Form.Item
                            name="interface"
                            label="Interface"
                            initialValue="public"
                            rules={[{ required: true, message: 'Required' }]}
                        >
                            <Select placeholder="Select interface">
                                <Select.Option value="public">Public</Select.Option>
                                <Select.Option value="internal">Internal</Select.Option>
                                <Select.Option value="admin">Admin</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={6}>
                        <Form.Item
                            label="Auth Type"
                        >
                            <Input value="Application Credential" disabled />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            name="application_credential_id"
                            label="Application Credential ID"
                            rules={[{ required: true, message: 'Required' }]}
                        >
                            <Input placeholder="Enter credential ID" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            name="application_credential_secret"
                            label="Application Credential Secret"
                            rules={[{ required: true, message: 'Required' }]}
                        >
                            <Input.Password
                                placeholder="Enter credential secret"
                                iconRender={(visible) => (visible ? <EyeInvisibleOutlined /> : <EyeOutlined />)}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item style={{ marginBottom: 0 }}>
                    <Space>
                        <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                            {editingCloud ? 'Update' : 'Save'} Configuration
                        </Button>
                        <Button 
                            onClick={() => {
                                form.resetFields();
                                setShowAddForm(false);
                                setEditingCloud(null);
                                setExpandedPanels([]);
                            }}
                            icon={<CloseOutlined />}
                        >
                            Cancel
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Card>
    );

    const cloudEntries = Object.entries(clouds);

    return (
        <>
            {contextHolder}
            <div style={{ padding: '24px' }}>
                <div style={{ marginBottom: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <Space>
                            <CloudOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                            <Title level={4} style={{ margin: 0 }}>Cloud Configurations</Title>
                            <Tag color="blue">{cloudEntries.length} configured</Tag>
                        </Space>
                        {!showAddForm && (
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => {
                                    setEditingCloud(null);
                                    form.resetFields();
                                    setShowAddForm(true);
                                    setExpandedPanels(['add-form']);
                                }}
                            >
                                Add Cloud
                            </Button>
                        )}
                    </div>
                    <Text type="secondary">
                        Configure your OpenStack cloud provider for infrastructure management and automation.
                    </Text>
                </div>

                {/* Provider Status */}
                <div style={{ marginBottom: 24 }}>
                    <Space wrap size="middle">
                        {providers.filter(provider => provider.available).map(provider => (
                            <Card
                                key={provider.value}
                                size="small"
                                style={{
                                    borderRadius: 8,
                                }}
                            >
                                <Space>
                                    <div style={{ display: 'flex', alignItems: 'center', minWidth: 20 }}>
                                        {provider.icon}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>{provider.label}</div>
                                        <Text type="secondary" style={{ fontSize: 11 }}>
                                            Available
                                        </Text>
                                    </div>
                                </Space>
                            </Card>
                        ))}
                    </Space>
                </div>

                {/* Add/Edit Form */}
                {showAddForm && (
                    <Collapse 
                        activeKey={expandedPanels}
                        onChange={(keys) => setExpandedPanels(keys as string[])}
                        style={{ marginBottom: 16 }}
                    >
                        <Panel 
                            header={
                                <Space>
                                    <CloudOutlined />
                                    <Text strong>{editingCloud ? `Edit ${editingCloud}` : 'New Cloud Configuration'}</Text>
                                </Space>
                            } 
                            key="add-form"
                        >
                            <AddFormContent />
                        </Panel>
                    </Collapse>
                )}

                {/* Cloud List */}
                {cloudEntries.length > 0 ? (
                    cloudEntries.map(([name, config]) => (
                        <CloudCard key={name} name={name} config={config} />
                    ))
                ) : (
                    !showAddForm && (
                        <Card
                            style={{
                                borderRadius: 12,
                                textAlign: 'center',
                                padding: '60px 40px',
                                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                            }}
                        >
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description={
                                    <div>
                                        <Text>No cloud configurations found</Text>
                                        <br />
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            Add your first OpenStack cloud to get started
                                        </Text>
                                    </div>
                                }
                            >
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => {
                                        setEditingCloud(null);
                                        form.resetFields();
                                        setShowAddForm(true);
                                        setExpandedPanels(['add-form']);
                                    }}
                                >
                                    Add Your First Cloud
                                </Button>
                            </Empty>
                        </Card>
                    )
                )}
            </div>
        </>
    );
};

export default CloudsConfig;