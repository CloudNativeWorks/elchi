import React, { useState, useEffect } from 'react';
import { 
    Card, 
    Form, 
    Input, 
    Switch, 
    Button, 
    Space, 
    Typography, 
    Alert, 
    Spin, 
    Modal, 
    message,
    InputNumber,
    Divider,
    Row,
    Col
} from 'antd';
import { 
    SaveOutlined, 
    DeleteOutlined, 
    ExclamationCircleOutlined, 
    WifiOutlined, 
    UserOutlined,
    LockOutlined,
    DatabaseOutlined,
    SafetyOutlined
} from '@ant-design/icons';
import { useCustomGetQuery, api } from '@/common/api';
import { useMutation } from '@tanstack/react-query';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import ElchiButton from '@/elchi/components/common/ElchiButton';

const { Text, Title } = Typography;

interface LdapConfig {
    enabled: boolean;
    server: string;
    port: number;
    base_dn: string;
    user_filter: string;
    bind_user: string;
    bind_password: string;
    tls_enabled: boolean;
    tls_skip_verify: boolean;
}

const LdapConfig: React.FC = () => {
    const { project } = useProjectVariable();
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [testCredentials, setTestCredentials] = useState({ username: '', password: '' });
    const [testModalVisible, setTestModalVisible] = useState(false);

    // Get LDAP configuration
    const { data: ldapConfigData, isLoading, refetch } = useCustomGetQuery({
        queryKey: `ldap-config-${project}`,
        enabled: !!project,
        path: `setting/ldap-config?project=${project}`,
        refetchOnWindowFocus: false
    });

    // Check if LDAP config exists
    const hasLdapConfig = !!ldapConfigData?.ldap_config;

    // Save/Update LDAP configuration
    const saveLdapMutation = useMutation({
        mutationFn: async (config: LdapConfig) => {
            const response = await api.post(`/api/v3/setting/ldap-config?project=${project}`, config);
            return response.data;
        },
        onSuccess: () => {
            messageApi.success('LDAP configuration saved successfully');
            refetch();
        },
        onError: (error: any) => {
            messageApi.error(`Failed to save LDAP configuration: ${error.message}`);
        }
    });

    // Delete LDAP configuration
    const deleteLdapMutation = useMutation({
        mutationFn: async () => {
            const response = await api.delete(`/api/v3/setting/ldap-config?project=${project}`);
            return response.data;
        },
        onSuccess: () => {
            messageApi.success('LDAP configuration deleted successfully');
            refetch();
        },
        onError: (error: any) => {
            messageApi.error(`Failed to delete LDAP configuration: ${error.message}`);
        }
    });

    // Test LDAP connection
    const testConnectionMutation = useMutation({
        mutationFn: async () => {
            const response = await api.post(`/api/v3/setting/ldap-config/test?project=${project}`);
            return response.data;
        },
        onSuccess: (data) => {
            messageApi.success(data.message || 'LDAP connection test successful');
        },
        onError: (error: any) => {
            messageApi.error(`LDAP connection test failed: ${error.message}`);
        }
    });

    // Test LDAP authentication
    const testAuthMutation = useMutation({
        mutationFn: async ({ username, password }: { username: string; password: string }) => {
            const response = await api.post(`/api/v3/setting/ldap-config/test-auth?project=${project}`, {
                username,
                password
            });
            return response.data;
        },
        onSuccess: (data) => {
            messageApi.success(data.message || 'LDAP authentication test successful');
            setTestModalVisible(false);
            setTestCredentials({ username: '', password: '' });
        },
        onError: (error: any) => {
            messageApi.error(`LDAP authentication test failed: ${error.message}`);
        }
    });

    // Load form data when LDAP config is fetched
    useEffect(() => {
        if (ldapConfigData?.ldap_config) {
            form.setFieldsValue(ldapConfigData.ldap_config);
        }
    }, [ldapConfigData, form]);

    const handleSave = () => {
        form.validateFields().then((values) => {
            // If password is masked (contains only asterisks), don't send it
            const payload = { ...values };
            if (payload.bind_password && /^\*+$/.test(payload.bind_password)) {
                delete payload.bind_password;
            }
            saveLdapMutation.mutate(payload);
        });
    };

    const handleDelete = () => {
        Modal.confirm({
            title: 'Delete LDAP Configuration',
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure you want to delete the LDAP configuration? This action cannot be undone.',
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk() {
                deleteLdapMutation.mutate();
            }
        });
    };

    const handleTestConnection = () => {
        testConnectionMutation.mutate();
    };

    const handleTestAuth = () => {
        if (!testCredentials.username || !testCredentials.password) {
            messageApi.error('Please enter both username and password');
            return;
        }
        testAuthMutation.mutate(testCredentials);
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                <Space direction="vertical" align="center">
                    <Spin size="large" />
                    <Text type="secondary">Loading LDAP configuration...</Text>
                </Space>
            </div>
        );
    }

    return (
        <>
            {contextHolder}
            <div style={{ padding: '20px' }}>
                <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                        <SafetyOutlined style={{ color: '#1890ff', fontSize: 24 }} />
                        <Title level={4} style={{ margin: 0 }}>LDAP Configuration</Title>
                    </div>
                    <Text type="secondary">
                        Configure LDAP authentication for centralized user management and Single Sign-On (SSO) integration.
                    </Text>
                </div>

                <Card style={{ borderRadius: 8 }}>
                    <Form
                        form={form}
                        layout="vertical"
                        initialValues={{
                            enabled: false,
                            port: 636,
                            tls_enabled: true,
                            tls_skip_verify: false
                        }}
                    >
                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    name="enabled"
                                    label="Enable LDAP Authentication"
                                    valuePropName="checked"
                                >
                                    <Switch 
                                        checkedChildren="Enabled" 
                                        unCheckedChildren="Disabled"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Divider orientation="left">Server Configuration</Divider>
                        
                        <Row gutter={24}>
                            <Col span={16}>
                                <Form.Item
                                    name="server"
                                    label="LDAP Server"
                                    rules={[{ required: true, message: 'Please enter LDAP server address' }]}
                                >
                                    <Input 
                                        prefix={<DatabaseOutlined />}
                                        placeholder="ldap.company.com"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="port"
                                    label="Port"
                                    rules={[{ required: true, message: 'Please enter port number' }]}
                                >
                                    <InputNumber 
                                        style={{ width: '100%' }}
                                        min={1}
                                        max={65535}
                                        placeholder="636"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    name="base_dn"
                                    label="Base DN"
                                    rules={[{ required: true, message: 'Please enter base DN' }]}
                                >
                                    <Input placeholder="dc=company,dc=com" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    name="user_filter"
                                    label="User Filter"
                                    rules={[{ required: true, message: 'Please enter user filter' }]}
                                    help="Example valid values: (uid={username}), (sAMAccountName={username}), (&(objectClass=person)(uid={username}))"
                                >
                                    <Input placeholder="(uid={username})" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Divider orientation="left">Bind Configuration</Divider>

                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    name="bind_user"
                                    label="Bind User DN"
                                    rules={[{ required: true, message: 'Please enter bind user DN' }]}
                                >
                                    <Input 
                                        prefix={<UserOutlined />}
                                        placeholder="cn=elchi-service,ou=serviceaccounts,dc=company,dc=com"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    name="bind_password"
                                    label="Bind Password"
                                    rules={[{ required: true, message: 'Please enter bind password' }]}
                                >
                                    <Input.Password 
                                        prefix={<LockOutlined />}
                                        placeholder="Enter bind user password"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Divider orientation="left">TLS Configuration</Divider>

                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item
                                    name="tls_enabled"
                                    label="Enable TLS"
                                    valuePropName="checked"
                                >
                                    <Switch 
                                        checkedChildren="Enabled" 
                                        unCheckedChildren="Disabled"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="tls_skip_verify"
                                    label="Skip TLS Verification"
                                    valuePropName="checked"
                                >
                                    <Switch 
                                        checkedChildren="Skip" 
                                        unCheckedChildren="Verify"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                        <Space>
                            <ElchiButton
                                type="primary"
                                icon={<SaveOutlined />}
                                onClick={handleSave}
                                loading={saveLdapMutation.isPending}
                            >
                                Save Configuration
                            </ElchiButton>
                            
                            <ElchiButton
                                icon={<WifiOutlined />}
                                onClick={handleTestConnection}
                                loading={testConnectionMutation.isPending}
                                disabled={!hasLdapConfig}
                            >
                                Test Connection
                            </ElchiButton>

                            <ElchiButton
                                icon={<UserOutlined />}
                                onClick={() => setTestModalVisible(true)}
                                disabled={!hasLdapConfig}
                            >
                                Test Authentication
                            </ElchiButton>
                        </Space>

                        <ElchiButton
                            danger
                            icon={<DeleteOutlined />}
                            onClick={handleDelete}
                            loading={deleteLdapMutation.isPending}
                            disabled={!hasLdapConfig}
                        >
                            Delete Configuration
                        </ElchiButton>
                    </div>
                </Card>

                {/* Test Authentication Modal */}
                <Modal
                    title="Test LDAP Authentication"
                    open={testModalVisible}
                    onCancel={() => {
                        setTestModalVisible(false);
                        setTestCredentials({ username: '', password: '' });
                    }}
                    footer={[
                        <Button
                            key="cancel"
                            onClick={() => {
                                setTestModalVisible(false);
                                setTestCredentials({ username: '', password: '' });
                            }}
                        >
                            Cancel
                        </Button>,
                        <Button
                            key="test"
                            type="primary"
                            icon={<UserOutlined />}
                            loading={testAuthMutation.isPending}
                            onClick={handleTestAuth}
                        >
                            Test Authentication
                        </Button>
                    ]}
                >
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Text type="secondary">
                            Enter test credentials to verify LDAP authentication is working correctly.
                        </Text>
                        
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Username"
                            value={testCredentials.username}
                            onChange={(e) => setTestCredentials(prev => ({ ...prev, username: e.target.value }))}
                        />
                        
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Password"
                            value={testCredentials.password}
                            onChange={(e) => setTestCredentials(prev => ({ ...prev, password: e.target.value }))}
                        />
                    </Space>
                </Modal>
            </div>
        </>
    );
};

export default LdapConfig;