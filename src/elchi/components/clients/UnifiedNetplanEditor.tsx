import React, { useState, useEffect } from 'react';
import {
    Button, Form, Typography, Space, Divider, Switch, Tag
} from 'antd';
import { CheckOutlined, CloseOutlined, SafetyCertificateOutlined, ApiOutlined, BookOutlined } from '@ant-design/icons';
import { useNetworkOperations, InterfaceState } from '@/hooks/useNetworkOperations';
import { showErrorNotification, showSuccessNotification } from '@/common/notificationHandler';
import MonacoEditor from '@monaco-editor/react';
import NetplanExamplesDrawer from './NetplanExamplesDrawer';
import { useTheme } from '@/contexts/ThemeContext';

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
    const { isDark } = useTheme();
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
        <div style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 16 }}>
            <div style={{
                background: isDark ? 'var(--bg-elevated)' : 'linear-gradient(135deg, #f1f3f4 0%, #e8eaed 100%)',
                borderRadius: '12px 12px 0 0',
                padding: 16,
                borderBottom: '1px solid var(--border-default)'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <SafetyCertificateOutlined style={{ color: safetyMode ? '#52c41a' : '#ff4d4f' }} />
                        <Text strong style={{ color: 'var(--text-primary)', fontSize: 14 }}>
                            Netplan Configuration Editor
                        </Text>
                    </div>
                    <Space>
                        <Button
                            size="middle"
                            icon={<BookOutlined />}
                            onClick={() => setShowExamples(true)}
                            style={{ borderRadius: 6 }}
                        >
                            Examples
                        </Button>
                        <Divider type="vertical" style={{ margin: '0 8px' }} />
                        <Text style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Safety Mode</Text>
                        <Switch
                            checked={safetyMode}
                            onChange={setSafetyMode}
                            size="small"
                            checkedChildren="ON"
                            unCheckedChildren="OFF"
                        />
                    </Space>
                </div>
            </div>
            <div style={{
                background: 'var(--card-bg)',
                borderRadius: '0 0 12px 12px',
                padding: 16
            }}>
                {/* Network Interruption Warning */}
                <div style={{
                    marginBottom: 16,
                    padding: 12,
                    backgroundColor: 'var(--color-danger-light)',
                    border: '1px solid var(--color-danger-border)',
                    borderRadius: 6,
                    borderLeft: '4px solid var(--color-danger)'
                }}>
                    <Text style={{ fontSize: 13, color: 'var(--color-danger)' }}>
                        ⚠️ <strong>Warning:</strong> Modifying network configuration may cause temporary network interruption.
                        Changes will be applied system-wide and may affect SSH connections and active services.
                        Use Safety Mode to automatically rollback if configuration fails.
                    </Text>
                </div>

                <div style={{ marginBottom: 16 }}>
                    <Text type="secondary" style={{ color: 'var(--text-secondary)' }}>
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
                    backgroundColor: 'var(--color-warning-light)',
                    border: '1px solid var(--color-warning-border)',
                    borderRadius: 6
                }}>
                    <Text style={{ fontSize: 12, color: 'var(--color-warning-dark)' }}>
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
                            border: '1px solid var(--border-default)',
                            borderRadius: 6,
                            overflow: 'hidden'
                        }}>
                            <MonacoEditor
                                height="400px"
                                language="yaml"
                                theme={isDark ? "vs-dark" : "light"}
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
                        backgroundColor: 'var(--color-info-light)',
                        borderRadius: 6,
                        border: '1px solid var(--color-info-border)'
                    }}>
                        <Text style={{ fontSize: 12, color: 'var(--color-info)' }}>
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
                        backgroundColor: 'var(--color-danger-light)',
                        border: '1px solid var(--color-danger-border)',
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
            </div>
        </div>
    );
};

export default UnifiedNetplanEditor;