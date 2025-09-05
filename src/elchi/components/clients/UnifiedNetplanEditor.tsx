import React, { useState, useEffect } from 'react';
import { 
    Button, Form, Typography, Card, Space, Divider, Switch, Tag
} from 'antd';
import { CheckOutlined, CloseOutlined, SafetyCertificateOutlined, ApiOutlined, BookOutlined } from '@ant-design/icons';
import { useNetworkOperations, InterfaceState } from '@/hooks/useNetworkOperations';
import { showErrorNotification, showSuccessNotification } from '@/common/notificationHandler';
import MonacoEditor from '@monaco-editor/react';
import NetplanExamplesDrawer from './NetplanExamplesDrawer';

const { Text } = Typography;

interface UnifiedNetplanEditorProps {
    currentYaml?: string;
    interfaces?: InterfaceState[];
    onCancel: () => void;
    onSuccess: () => void;
    clientId: string;
}

const UnifiedNetplanEditor: React.FC<UnifiedNetplanEditorProps> = ({ 
    currentYaml,
    interfaces = [],
    onCancel, 
    onSuccess,
    clientId 
}) => {
    const [form] = Form.useForm();
    const networkOperations = useNetworkOperations();
    const applyNetplanConfig = networkOperations.applyNetplanConfig;
    const [loading, setLoading] = useState(false);
    const [safetyMode, setSafetyMode] = useState(true);
    const [yamlContent, setYamlContent] = useState(currentYaml || '');
    const [showExamples, setShowExamples] = useState(false);

    useEffect(() => {
        if (currentYaml) {
            setYamlContent(currentYaml);
        }
    }, [currentYaml]);

    const handleFinish = async () => {
        if (!yamlContent.trim()) {
            showErrorNotification('YAML content cannot be empty');
            return;
        }

        setLoading(true);
        try {
            const response = await applyNetplanConfig(clientId, {
                yaml_content: yamlContent,
                test_mode: safetyMode,
                preserve_controller_connection: true,
                test_timeout_seconds: 10
            });

            // Global notification system will handle success notifications
            
            if (response.success) {
                onSuccess();
            }
        } catch (error: any) {
            showErrorNotification(error, 'Failed to apply configuration');
        } finally {
            setLoading(false);
        }
    };

    const handleExampleSelect = (exampleYaml: string) => {
        setYamlContent(exampleYaml);
        showSuccessNotification('Example configuration loaded');
    };

    const defaultYaml = `network:
  version: 2
  ethernets:
    # Add your interface configuration here
    # Example:
    # eth0:
    #   dhcp4: true
    #   # or static configuration:
    #   # addresses:
    #   #   - "192.168.1.100/24"
    #   # routes:
    #   #   - to: "0.0.0.0/0"
    #   #     via: "192.168.1.1"
    #   # nameservers:
    #   #   addresses: [8.8.8.8, 8.8.4.4]
`;

    return (
        <Card
            title={
                <Space>
                    <SafetyCertificateOutlined style={{ color: safetyMode ? '#52c41a' : '#ff4d4f' }} />
                    <span>Netplan Configuration Editor</span>
                </Space>
            }
            style={{ 
                width: '100%',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
            extra={
                <Space>
                    <Button
                        size="small"
                        icon={<BookOutlined />}
                        onClick={() => setShowExamples(true)}
                        style={{
                            borderColor: '#ffffff40',
                            color: '#ffffff',
                            background: 'rgba(255,255,255,0.1)'
                        }}
                    >
                        Examples
                    </Button>
                    <Divider type="vertical" style={{ borderColor: '#ffffff40', margin: '0 8px' }} />
                    <Text style={{ fontSize: 12, color: '#ffffff' }}>Safety Mode</Text>
                    <Switch 
                        checked={safetyMode}
                        onChange={setSafetyMode}
                        size="small"
                        checkedChildren="ON"
                        unCheckedChildren="OFF"
                    />
                </Space>
            }
        >
            {/* Network Interruption Warning */}
            <div style={{ 
                marginBottom: 16, 
                padding: 12, 
                backgroundColor: '#fff2e8', 
                border: '1px solid #ffbb96',
                borderRadius: 6,
                borderLeft: '4px solid #ff7a00'
            }}>
                <Text style={{ fontSize: 13, color: '#d4380d' }}>
                    ⚠️ <strong>Warning:</strong> Modifying network configuration may cause temporary network interruption. 
                    Changes will be applied system-wide and may affect SSH connections and active services. 
                    Use Safety Mode to automatically rollback if configuration fails.
                </Text>
            </div>

            <div style={{ marginBottom: 16 }}>
                <Text type="secondary">
                    Edit the complete netplan YAML configuration below. This will affect all network interfaces on the system.
                </Text>
            </div>

            {/* Available Interfaces */}
            {interfaces.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                    <div style={{ marginBottom: 8 }}>
                        <Text strong style={{ fontSize: 13 }}>
                            <ApiOutlined style={{ marginRight: 4 }} />
                            Available Interfaces:
                        </Text>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {interfaces
                            .filter((iface: InterfaceState) => !iface.name.startsWith('elchi-if-') && iface.name !== 'lo')
                            .map((iface: InterfaceState, index: number) => (
                                <Tag 
                                    key={index}
                                    color={iface.state?.toLowerCase() === 'up' ? 'green' : 'orange'}
                                    style={{ marginBottom: 4 }}
                                >
                                    {iface.name}
                                    {iface.addresses?.[0] && (
                                        <span style={{ fontSize: 11, opacity: 0.8 }}>
                                            {' '}({iface.addresses[0]})
                                        </span>
                                    )}
                                </Tag>
                            ))
                        }
                    </div>
                </div>
            )}

            {/* Warning about routing */}
            <div style={{ 
                marginBottom: 16, 
                padding: 12, 
                backgroundColor: '#fff7e6', 
                border: '1px solid #ffd591',
                borderRadius: 6
            }}>
                <Text style={{ fontSize: 12, color: '#d48806' }}>
                    ⚠️ <strong>Important:</strong> Do not add routing policies or routes in this YAML configuration. 
                    Use the dedicated "Route" and "Routing Policy" tabs for routing configuration.
                </Text>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                style={{ marginTop: 16 }}
            >
                <Form.Item 
                    label="Netplan YAML Configuration"
                    extra={!currentYaml ? "No existing configuration found. Use the template below or create your own." : "Current system configuration loaded from client."}
                >
                    <div style={{ 
                        border: '1px solid #d9d9d9', 
                        borderRadius: 6,
                        overflow: 'hidden'
                    }}>
                        <MonacoEditor
                            height="400px"
                            language="yaml"
                            theme="light"
                            value={yamlContent || defaultYaml}
                            onChange={(value) => setYamlContent(value || '')}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 13,
                                lineNumbers: 'on',
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                tabSize: 2,
                                insertSpaces: true,
                                wordWrap: 'on',
                                folding: true,
                                lineDecorationsWidth: 10,
                                lineNumbersMinChars: 3
                            }}
                        />
                    </div>
                </Form.Item>

                <Divider />

                <div style={{ 
                    marginTop: 16, 
                    padding: 12, 
                    backgroundColor: '#f0f9ff', 
                    borderRadius: 6,
                    border: '1px solid #b3e5fc'
                }}>
                    <Text style={{ fontSize: 12, color: '#1976d2' }}>
                        💡 <strong>Tip:</strong> Use netplan YAML syntax. Changes will be validated and applied with safety checks. 
                        Safety mode will test changes and rollback automatically if they fail.
                    </Text>
                </div>

                <Divider />

                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginTop: 16 
                }}>
                    <div>
                        <Button 
                            onClick={onCancel}
                            icon={<CloseOutlined />}
                        >
                            Cancel
                        </Button>
                    </div>
                    <div>
                        <Button 
                            type="primary" 
                            onClick={handleFinish}
                            loading={loading}
                            icon={<CheckOutlined />}
                            style={{
                                background: safetyMode ? 'linear-gradient(90deg, #52c41a, #73d13d)' : undefined
                            }}
                        >
                            Apply Configuration
                        </Button>
                    </div>
                </div>
            </Form>

            {!safetyMode && (
                <div style={{ 
                    marginTop: 16, 
                    padding: 12, 
                    backgroundColor: '#fff2f0', 
                    border: '1px solid #ffccc7',
                    borderRadius: 6
                }}>
                    <Text type="danger" style={{ fontSize: 12 }}>
                        ⚠️ Safety mode is disabled. Changes will be applied directly without rollback protection.
                    </Text>
                </div>
            )}

            <NetplanExamplesDrawer
                open={showExamples}
                onClose={() => setShowExamples(false)}
                onSelectExample={handleExampleSelect}
            />
        </Card>
    );
};

export default UnifiedNetplanEditor;