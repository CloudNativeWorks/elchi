import React, { useState } from 'react';
import { Form, Input, Switch, Button, Card, Space, Typography, InputNumber } from 'antd';
import { SafetyCertificateOutlined, PlayCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { useNetworkOperations, NetplanConfig, NetworkResponse } from '@/hooks/useNetworkOperations';

const { TextArea } = Input;
const { Text } = Typography;

interface NetworkInterfaceConfig {
    dhcp4: boolean;
    addresses?: string[];
    routes?: Array<{
        to: string;
        via: string;
        metric?: number;
    }>;
    routing_policy?: Array<{
        from: string;
        table: number;
        priority: number;
    }>;
}

interface NetworkConfigurationFormProps {
    clientId: string;
    onSuccess?: (response: NetworkResponse) => void;
    onError?: (error: string) => void;
    initialInterfaces?: Record<string, NetworkInterfaceConfig>;
}

const NetworkConfigurationForm: React.FC<NetworkConfigurationFormProps> = ({
    clientId,
    onSuccess,
    onError,
    initialInterfaces = {}
}) => {
    const [form] = Form.useForm();
    const { applyNetplanConfig } = useNetworkOperations();
    const [loading, setLoading] = useState(false);
    const [interfaces, setInterfaces] = useState<Record<string, NetworkInterfaceConfig>>(initialInterfaces);
    const [safetyMode, setSafetyMode] = useState(true);
    const [testTimeout, setTestTimeout] = useState(10);
    const [yamlPreview, setYamlPreview] = useState('');
    const [showPreview, setShowPreview] = useState(false);

    const generateNetplanYAML = () => {
        let yaml = 'network:\n  version: 2\n  ethernets:\n';

        Object.entries(interfaces).forEach(([name, config]) => {
            yaml += `    ${name}:\n`;
            yaml += `      dhcp4: ${config.dhcp4}\n`;

            if (!config.dhcp4 && config.addresses && config.addresses.length > 0) {
                yaml += '      addresses:\n';
                config.addresses.forEach(addr => {
                    yaml += `        - "${addr}"\n`;
                });
            }

            if (config.routes && config.routes.length > 0) {
                yaml += '      routes:\n';
                config.routes.forEach(route => {
                    yaml += `        - to: "${route.to}"\n`;
                    yaml += `          via: "${route.via}"\n`;
                    if (route.metric) {
                        yaml += `          metric: ${route.metric}\n`;
                    }
                });
            }

            if (config.routing_policy && config.routing_policy.length > 0) {
                yaml += '      routing-policy:\n';
                config.routing_policy.forEach(policy => {
                    yaml += `        - from: "${policy.from}"\n`;
                    yaml += `          table: ${policy.table}\n`;
                    yaml += `          priority: ${policy.priority}\n`;
                });
            }
        });

        return yaml;
    };

    const handleNetworkResponse = (response: NetworkResponse) => {
        if (response.success) {
            if (onSuccess) {
                onSuccess(response);
            }
        } else {
            let errorMessage = response.error || 'Network configuration failed';

            if (onError) {
                onError(errorMessage);
            }
        }
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const yaml = generateNetplanYAML();

            const netplanConfig: NetplanConfig = {
                yaml_content: yaml,
                test_mode: safetyMode,
                preserve_controller_connection: true,
                test_timeout_seconds: testTimeout
            };

            const response = await applyNetplanConfig(clientId, netplanConfig);
            handleNetworkResponse(response);

        } catch (error: any) {
            const errorMessage = error?.message || 'Failed to apply network configuration';
            if (onError) {
                onError(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    const handlePreview = () => {
        const yaml = generateNetplanYAML();
        setYamlPreview(yaml);
        setShowPreview(true);
    };

    const addInterface = () => {
        const newInterfaceName = `eth${Object.keys(interfaces).length}`;
        setInterfaces({
            ...interfaces,
            [newInterfaceName]: {
                dhcp4: true,
                addresses: [],
                routes: [],
                routing_policy: []
            }
        });
    };

    const updateInterface = (name: string, config: NetworkInterfaceConfig) => {
        setInterfaces({
            ...interfaces,
            [name]: config
        });
    };

    const removeInterface = (name: string) => {
        const newInterfaces = { ...interfaces };
        delete newInterfaces[name];
        setInterfaces(newInterfaces);
    };

    return (
        <Card
            title={
                <Space>
                    <PlayCircleOutlined />
                    <span>Network Configuration</span>
                </Space>
            }
            style={{ marginBottom: 16 }}
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                {/* Safety Settings */}
                <Card
                    title={
                        <Space>
                            <SafetyCertificateOutlined style={{ color: safetyMode ? '#52c41a' : '#ff4d4f' }} />
                            <span>Safety Settings</span>
                        </Space>
                    }
                    size="small"
                    style={{ marginBottom: 16, backgroundColor: safetyMode ? '#f6ffed' : '#fff2f0' }}
                >
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Space>
                                <Text strong>Test Mode</Text>
                                <Text type="secondary">(Highly Recommended)</Text>
                            </Space>
                            <Switch
                                checked={safetyMode}
                                onChange={setSafetyMode}
                                checkedChildren="Safe"
                                unCheckedChildren="Direct"
                            />
                        </div>

                        {!safetyMode && (
                            <div style={{ color: '#ff4d4f', fontSize: '12px' }}>
                                <WarningOutlined /> Warning: Direct mode bypasses safety mechanisms and could cause connectivity loss
                            </div>
                        )}

                        {safetyMode && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Text>Test Timeout:</Text>
                                <InputNumber
                                    min={5}
                                    max={60}
                                    value={testTimeout}
                                    onChange={(value) => setTestTimeout(value || 10)}
                                    addonAfter="seconds"
                                    size="small"
                                    style={{ width: 120 }}
                                />
                            </div>
                        )}

                        <Text style={{ fontSize: '12px', color: '#666' }}>
                            {safetyMode
                                ? 'Test mode applies changes temporarily and automatically rolls back if connection is lost.'
                                : 'Direct mode applies changes immediately without rollback protection.'
                            }
                        </Text>
                    </Space>
                </Card>

                {/* Interface Configuration */}
                <Card title="Interface Configuration" size="small" style={{ marginBottom: 16 }}>
                    {Object.keys(interfaces).length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '20px 0', color: '#999' }}>
                            <Text>No interfaces configured. Click "Add Interface" to get started.</Text>
                        </div>
                    ) : (
                        <Space direction="vertical" style={{ width: '100%' }} size="middle">
                            {Object.entries(interfaces).map(([name, config]) => (
                                <Card key={name} size="small" title={name} style={{ backgroundColor: '#fafafa' }}>
                                    <Space direction="vertical" style={{ width: '100%' }}>
                                        <div>
                                            <Text>DHCP4: </Text>
                                            <Switch
                                                checked={config.dhcp4}
                                                onChange={(checked) => updateInterface(name, { ...config, dhcp4: checked })}
                                                size="small"
                                            />
                                        </div>

                                        {!config.dhcp4 && (
                                            <div>
                                                <Text>Static IP Addresses:</Text>
                                                <Input
                                                    placeholder="10.0.1.100/24"
                                                    value={config.addresses?.join(', ') || ''}
                                                    onChange={(e) => updateInterface(name, {
                                                        ...config,
                                                        addresses: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                                                    })}
                                                />
                                            </div>
                                        )}
                                    </Space>

                                    <div style={{ marginTop: 8, textAlign: 'right' }}>
                                        <Button
                                            type="text"
                                            danger
                                            size="small"
                                            onClick={() => removeInterface(name)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </Space>
                    )}

                    <div style={{ marginTop: 16, textAlign: 'center' }}>
                        <Button type="dashed" onClick={addInterface}>
                            Add Interface
                        </Button>
                    </div>
                </Card>

                {/* YAML Preview */}
                {showPreview && (
                    <Card title="Generated Netplan YAML" size="small" style={{ marginBottom: 16 }}>
                        <TextArea
                            value={yamlPreview}
                            rows={12}
                            readOnly
                            style={{ fontFamily: 'monospace', fontSize: '12px' }}
                        />
                        <div style={{ marginTop: 8, textAlign: 'right' }}>
                            <Button size="small" onClick={() => setShowPreview(false)}>
                                Hide Preview
                            </Button>
                        </div>
                    </Card>
                )}

                {/* Action Buttons */}
                <div style={{ textAlign: 'right' }}>
                    <Space>
                        <Button onClick={handlePreview}>
                            Preview YAML
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            disabled={Object.keys(interfaces).length === 0}
                        >
                            Apply Configuration
                        </Button>
                    </Space>
                </div>
            </Form>
        </Card>
    );
};

export default NetworkConfigurationForm;