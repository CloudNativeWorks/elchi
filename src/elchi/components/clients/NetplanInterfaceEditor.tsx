import React, { useState, useEffect } from 'react';
import {
    Button, Form, Input, Typography, Row, Col, Switch,
    Card, Space, Divider, InputNumber, Select
} from 'antd';
import { CheckOutlined, CloseOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useNetworkOperations } from '@/hooks/useNetworkOperations';
import { showErrorNotification } from '@/common/notificationHandler';

const { Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface NetplanInterfaceEditorProps {
    interface: any; // InterfaceState from proto
    allInterfaces: any[]; // All interfaces for context
    routingTables: { id: number; name: string; }[]; // Available routing tables
    onCancel: () => void;
    onSuccess: () => void;
    clientId: string;
}

const NetplanInterfaceEditor: React.FC<NetplanInterfaceEditorProps> = ({
    interface: currentInterface,
    allInterfaces,
    routingTables,
    onCancel,
    onSuccess,
    clientId
}) => {
    const [form] = Form.useForm();
    const { applyNetplanConfig } = useNetworkOperations();
    const [loading, setLoading] = useState(false);
    const [safetyMode, setSafetyMode] = useState(true);
    const [yamlPreview, setYamlPreview] = useState('');
    const [showPreview, setShowPreview] = useState(false);

    // Form state
    const [dhcp4, setDhcp4] = useState(false);
    // Removed unused state variables - they are managed through form.getFieldsValue() instead

    useEffect(() => {
        // Initialize form with current interface data
        if (currentInterface) {
            // For now, set dhcp4 to false since we don't have that info in InterfaceState
            setDhcp4(false);

            form.setFieldsValue({
                dhcp4: false,
                addresses: currentInterface.addresses?.join('\n') || '',
                mtu: currentInterface.mtu || 1500,
                gateway: '',
                routingTable: 254, // Default to main table
                routes: []
            });
        }
    }, [currentInterface, form]);

    const generateNetplanYAML = () => {
        const formValues = form.getFieldsValue();

        let yaml = 'network:\n  version: 2\n  ethernets:\n';

        // Add current interface configuration
        yaml += `    ${currentInterface.name}:\n`;
        yaml += `      dhcp4: ${formValues.dhcp4 || false}\n`;

        if (!formValues.dhcp4 && formValues.addresses) {
            const addressList = formValues.addresses.split('\n')
                .map((addr: string) => addr.trim())
                .filter((addr: string) => addr);

            if (addressList.length > 0) {
                yaml += '      addresses:\n';
                addressList.forEach((addr: string) => {
                    yaml += `        - "${addr}"\n`;
                });
            }
        }

        if (formValues.mtu && formValues.mtu !== 1500) {
            yaml += `      mtu: ${formValues.mtu}\n`;
        }

        // Add gateway if specified
        if (formValues.gateway && !formValues.dhcp4) {
            yaml += '      routes:\n';
            yaml += '        - to: "0.0.0.0/0"\n';
            yaml += `          via: "${formValues.gateway}"\n`;

            // Add table if not main table (254)
            if (formValues.routingTable && formValues.routingTable !== 254) {
                yaml += `          table: ${formValues.routingTable}\n`;
            }
        }

        // Add routing policy if using custom table
        if (formValues.routingTable && formValues.routingTable !== 254 && !formValues.dhcp4) {
            // Extract network from first address for routing policy
            const firstAddress = formValues.addresses?.split('\n')[0]?.trim();
            if (firstAddress) {
                const network = firstAddress; // Use the full CIDR
                yaml += '      routing-policy:\n';
                yaml += `        - from: "${network}"\n`;
                yaml += `          table: ${formValues.routingTable}\n`;
                yaml += '          priority: 100\n';
            }
        }

        // Add other interfaces to maintain their configuration
        allInterfaces.forEach(iface => {
            if (iface.name !== currentInterface.name) {
                yaml += `    ${iface.name}:\n`;
                yaml += `      dhcp4: ${iface.dhcp4 || false}\n`;

                if (iface.addresses && iface.addresses.length > 0) {
                    yaml += '      addresses:\n';
                    iface.addresses.forEach((addr: string) => {
                        yaml += `        - "${addr}"\n`;
                    });
                }

                if (iface.mtu && iface.mtu !== 1500) {
                    yaml += `      mtu: ${iface.mtu}\n`;
                }
            }
        });

        return yaml;
    };

    const handlePreview = () => {
        const yaml = generateNetplanYAML();
        setYamlPreview(yaml);
        setShowPreview(true);
    };

    const handleFinish = async () => {
        setLoading(true);
        try {
            const yaml = generateNetplanYAML();

            const response = await applyNetplanConfig(clientId, {
                yaml_content: yaml,
                test_mode: safetyMode,
                preserve_controller_connection: true,
                test_timeout_seconds: 10
            });

            // Global notification system will handle success notifications

            if (response.success) {
                onSuccess();
            }
        } catch (error: any) {
            showErrorNotification(error, 'Failed to update interface');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card
            title={
                <Space>
                    <SafetyCertificateOutlined style={{ color: safetyMode ? 'var(--color-success)' : 'var(--color-danger)' }} />
                    <span style={{ color: 'var(--text-primary)' }}>Edit Interface: {currentInterface.name}</span>
                </Space>
            }
            style={{
                width: '100%',
                boxShadow: 'var(--shadow-md)',
                background: 'var(--card-bg)',
                border: '1px solid var(--border-default)'
            }}
            extra={
                <Space>
                    <Text style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Safety Mode</Text>
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
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                style={{ marginTop: 16 }}
            >
                <Row gutter={24}>
                    <Col span={24}>
                        <Form.Item
                            name="dhcp4"
                            valuePropName="checked"
                            label="DHCP4 Configuration"
                        >
                            <Switch
                                checkedChildren="DHCP"
                                unCheckedChildren="Static"
                                onChange={setDhcp4}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                {!dhcp4 && (
                    <>
                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    name="addresses"
                                    label="IP Addresses"
                                    rules={[
                                        { required: !dhcp4, message: 'IP addresses are required for static configuration' }
                                    ]}
                                    extra="Enter one IP address per line with CIDR notation (e.g., 192.168.1.100/24)"
                                >
                                    <TextArea
                                        rows={3}
                                        placeholder="192.168.1.100/24&#10;10.0.0.10/8"
                                        style={{ fontFamily: 'monospace' }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={24}>
                            <Col span={8}>
                                <Form.Item
                                    name="gateway"
                                    label="Default Gateway"
                                    rules={[
                                        { pattern: /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/, message: 'Please enter a valid IP address' }
                                    ]}
                                    extra="Default route gateway (optional)"
                                >
                                    <Input placeholder="192.168.1.1" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="routingTable"
                                    label="Routing Table"
                                    extra="Table for this interface's routes"
                                >
                                    <Select
                                        placeholder="Select table"
                                    >
                                        {routingTables
                                            .filter((table, index, arr) =>
                                                arr.findIndex(t => t.id === table.id) === index
                                            )
                                            .map((table, index) => (
                                                <Option key={`routing-table-${table.id}-${table.name}-${index}`} value={table.id}>
                                                    {table.name} ({table.id})
                                                </Option>
                                            ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="mtu"
                                    label="MTU"
                                    extra="Maximum Transmission Unit"
                                >
                                    <InputNumber
                                        min={576}
                                        max={9000}
                                        style={{ width: '100%' }}
                                        placeholder="1500"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </>
                )}

                <Row gutter={24}>
                    <Col span={24}>
                        <Form.Item label={<span style={{ color: 'var(--text-primary)' }}>Current Interface Status</span>}>
                            <Card size="small" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}>
                                <Space direction="vertical" style={{ width: '100%', color: 'var(--text-primary)' }}>
                                    <div><strong>Name:</strong> {currentInterface.name}</div>
                                    <div><strong>State:</strong> {currentInterface.state}</div>
                                    <div><strong>Carrier:</strong> {currentInterface.has_carrier ? 'Yes' : 'No'}</div>
                                    {currentInterface.mac_address && (
                                        <div><strong>MAC:</strong> {currentInterface.mac_address}</div>
                                    )}
                                    <div><strong>Current MTU:</strong> {currentInterface.mtu}</div>
                                    {currentInterface.addresses?.length > 0 && (
                                        <div><strong>Current IPs:</strong> {currentInterface.addresses.join(', ')}</div>
                                    )}
                                </Space>
                            </Card>
                        </Form.Item>
                    </Col>
                </Row>

                {showPreview && (
                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item label="Generated Netplan YAML">
                                <TextArea
                                    value={yamlPreview}
                                    rows={10}
                                    readOnly
                                    style={{ fontFamily: 'monospace', fontSize: 12 }}
                                />
                                <Button
                                    size="small"
                                    style={{ marginTop: 8 }}
                                    onClick={() => setShowPreview(false)}
                                >
                                    Hide Preview
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                )}

                <Divider />

                <Row justify="space-between" align="middle">
                    <Col>
                        <Button onClick={handlePreview}>
                            Preview YAML
                        </Button>
                    </Col>
                    <Col>
                        <Space>
                            <Button
                                onClick={onCancel}
                                icon={<CloseOutlined />}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                icon={<CheckOutlined />}
                                style={{
                                    background: safetyMode ? 'var(--gradient-success)' : undefined
                                }}
                            >
                                Apply Configuration
                            </Button>
                        </Space>
                    </Col>
                </Row>
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
        </Card>
    );
};

export default NetplanInterfaceEditor;