import React, { useState, useEffect, useCallback } from 'react';
import { Form, Input, InputNumber, Switch, Button, Row, Col, Divider, Modal, Select, Typography } from 'antd';
import { SaveOutlined, ClearOutlined } from '@ant-design/icons';
import { useBGPOperations, BGPConfig } from '@/hooks/useBGPOperations';
import { useBGPContext } from './context/BGPContext';
import { showErrorNotification } from '@/common/notificationHandler';

const { Text } = Typography;

interface BGPConfigurationContentProps {
    clientId: string;
}

const BGPConfigurationContent: React.FC<BGPConfigurationContentProps> = ({ clientId }) => {
    const [form] = Form.useForm();
    const [config, setConfig] = useState<BGPConfig | null>(null);
    const { setAsNumber } = useBGPContext();
    const [clearModalOpen, setClearModalOpen] = useState(false);
    const [clearSoft, setClearSoft] = useState(true);
    const [clearDirection, setClearDirection] = useState<'in' | 'out' | 'all'>('all');
    const [clearing, setClearing] = useState(false);
    const { clearBGPRoutes } = useBGPOperations();

    const {
        loading,
        getBGPConfig,
        updateBGPConfig
    } = useBGPOperations();

    const loadBGPConfig = useCallback(async () => {
        try {
            const result = await getBGPConfig(clientId);
            if (result.success && result.data) {
                const bgpData = result.data[0]?.Result?.Frr?.bgp;
                const bgpConfig = bgpData?.config || {};

                if (bgpConfig) {
                    setConfig(bgpConfig);
                    form.setFieldsValue(bgpConfig);
                    if (bgpConfig.autonomous_system) {
                        setAsNumber(bgpConfig.autonomous_system);
                    }
                }
            }
        } catch (error) {
            console.error('Failed to load BGP config:', error);
        }
    }, [clientId, getBGPConfig, form, setAsNumber]);

    useEffect(() => {
        loadBGPConfig();
    }, []);

    const handleSaveConfig = async (values: BGPConfig) => {
        try {
            const result = await updateBGPConfig(clientId, values);
            if (result.success) {
                setConfig(values);
                if (values.autonomous_system) {
                    setAsNumber(values.autonomous_system);
                }
                // Global notification system will handle success notification
            }
        } catch (error) {
            console.error('Failed to save BGP config:', error);
            showErrorNotification(error, 'Failed to save BGP configuration');
        }
    };



    const handleClearBGP = async () => {
        setClearing(true);
        try {
            const result = await clearBGPRoutes(clientId, '*', clearSoft, clearDirection);
            if (result.success) {
                // Global notification system will handle success notification
                setClearModalOpen(false);
            }
        } catch (error) {
            showErrorNotification(error, 'Failed to clear BGP routes');
        } finally {
            setClearing(false);
        }
    };

    return (
        <div>
            <Col span={24}>
                <div style={{ borderRadius: 12, boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-default)' }}>
                    <div style={{
                        background: 'var(--bg-surface)',
                        borderRadius: '12px 12px 0 0',
                        padding: 16,
                        borderBottom: '1px solid var(--border-default)'
                    }}>
                        <Text strong style={{ color: 'var(--text-primary)', fontSize: 14 }}>
                            BGP Configuration
                        </Text>
                    </div>
                    <div style={{
                        background: 'var(--card-bg)',
                        borderRadius: '0 0 12px 12px',
                        padding: 16
                    }}>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSaveConfig}
                        initialValues={config}
                    >
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="autonomous_system"
                                    label="AS Number"
                                    rules={[{ required: true, message: 'AS Number is required' }]}
                                >
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        min={1}
                                        max={4294967295}
                                        placeholder="65001"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="router_id"
                                    label="Router ID"
                                    rules={[
                                        { required: true, message: 'Router ID is required' },
                                        { pattern: /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/, message: 'Invalid IP format' }
                                    ]}
                                >
                                    <Input placeholder="10.0.0.1" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="keepalive_time"
                                    label="Keepalive Time (seconds)"
                                >
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        min={1}
                                        max={65535}
                                        placeholder="60"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="hold_time"
                                    label="Hold Time (seconds)"
                                >
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        min={3}
                                        max={65535}
                                        placeholder="180"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Divider orientation="left" orientationMargin={0}>Address Family</Divider>
                        <Row gutter={16}>
                            <Col span={6}>
                                <Form.Item
                                    name="redistribute_connected"
                                    label="Redistribute Connected"
                                    valuePropName="checked"
                                >
                                    <Switch />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    name="redistribute_static"
                                    label="Redistribute Static"
                                    valuePropName="checked"
                                >
                                    <Switch />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    name="redistribute_kernel"
                                    label="Redistribute Kernel"
                                    valuePropName="checked"
                                >
                                    <Switch />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    name="redistribute_local"
                                    label="Redistribute Local"
                                    valuePropName="checked"
                                >
                                    <Switch />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="maximum_paths"
                                    label="Maximum Paths"
                                    extra="Maximum number of equal-cost paths"
                                >
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        min={1}
                                        max={32}
                                        placeholder="1"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="administrative_distance"
                                    label="Administrative Distance"
                                    extra="Administrative distance for BGP routes"
                                >
                                    <Input
                                        style={{ width: '100%' }}
                                        placeholder="(external-internal-local) Eg: 20-100-200"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider orientation="left" orientationMargin={0}>Advanced Settings</Divider>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item
                                    name="always_compare_med"
                                    label="Always Compare MED"
                                    valuePropName="checked"
                                >
                                    <Switch />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="log_neighbor_changes"
                                    label="Log Neighbor Changes"
                                    valuePropName="checked"
                                >
                                    <Switch />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="deterministic_med"
                                    label="Deterministic MED"
                                    valuePropName="checked"
                                >
                                    <Switch />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Divider orientation="left" orientationMargin={0}>Graceful Restart Configuration</Divider>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item
                                    name="graceful_restart_enabled"
                                    label="Enable Graceful Restart"
                                    valuePropName="checked"
                                    extra="Enable global graceful restart capability"
                                >
                                    <Switch onChange={(checked) => {
                                        if (checked) {
                                            form.setFieldValue('graceful_restart_disable', false);
                                        }
                                    }} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="preserve_forwarding_state"
                                    label="Preserve Forwarding State"
                                    valuePropName="checked"
                                    extra="Maintain FIB during restart"
                                >
                                    <Switch />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="graceful_restart_disable"
                                    label="Disable Graceful Restart"
                                    valuePropName="checked"
                                    extra="Completely disable GR functionality"
                                >
                                    <Switch onChange={(checked) => {
                                        if (checked) {
                                            form.setFieldValue('graceful_restart_enabled', false);
                                        }
                                    }} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item dependencies={['graceful_restart_enabled', 'graceful_restart_disable']}>
                            {({ getFieldValue }) => {
                                const grEnabled = getFieldValue('graceful_restart_enabled');
                                const grDisabled = getFieldValue('graceful_restart_disable');
                                return (grEnabled && !grDisabled) ? (
                                    <>
                                        <Row gutter={16}>
                                            <Col span={8}>
                                                <Form.Item
                                                    name="graceful_restart_time"
                                                    label="Restart Timer (seconds)"
                                                    extra="Maximum time for graceful restart (1-3600)"
                                                >
                                                    <InputNumber
                                                        style={{ width: '100%' }}
                                                        min={1}
                                                        max={3600}
                                                        placeholder="120"
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={8}>
                                                <Form.Item
                                                    name="graceful_stale_path_time"
                                                    label="Stale Path Timer (seconds)"
                                                    extra="Time to retain stale paths (1-3600)"
                                                >
                                                    <InputNumber
                                                        style={{ width: '100%' }}
                                                        min={1}
                                                        max={3600}
                                                        placeholder="360"
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={8}>
                                                <Form.Item
                                                    name="select_defer_time"
                                                    label="Select Defer Time (seconds)"
                                                    extra="Route selection delay (0-3600)"
                                                >
                                                    <InputNumber
                                                        style={{ width: '100%' }}
                                                        min={0}
                                                        max={3600}
                                                        placeholder="180"
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row gutter={16}>
                                            <Col span={8}>
                                                <Form.Item
                                                    name="rib_stale_time"
                                                    label="RIB Stale Timer (seconds)"
                                                    extra="RIB stale path cleanup time"
                                                >
                                                    <InputNumber
                                                        style={{ width: '100%' }}
                                                        min={1}
                                                        max={3600}
                                                        placeholder="300"
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </>
                                ) : null;
                            }}
                        </Form.Item>

                        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                icon={<SaveOutlined />}
                                loading={loading}
                                style={{
                                    background: 'var(--gradient-primary)',
                                    border: 'none',
                                    borderRadius: 8
                                }}
                                className="modern-add-btn"
                            >
                                Save Configuration
                            </Button>

                            <Button
                                icon={<ClearOutlined />}
                                loading={clearing}
                                onClick={() => setClearModalOpen(true)}
                                style={{ borderRadius: 8 }}
                                danger
                            >
                                Clear BGP
                            </Button>
                        </div>
                    </Form>
                    </div>
                </div>
            </Col>

            <Modal
                title="Clear BGP"
                open={clearModalOpen}
                onOk={handleClearBGP}
                onCancel={() => setClearModalOpen(false)}
                okText="Clear"
                okButtonProps={{ danger: true, loading: clearing }}
                cancelButtonProps={{ disabled: clearing }}
            >
                <div style={{ marginBottom: 16 }}>
                    <span style={{ marginRight: 8 }}>Soft Clear:</span>
                    <Switch checked={clearSoft} onChange={setClearSoft} />
                </div>
                <div>
                    <span style={{ marginRight: 8 }}>Direction:</span>
                    <Select
                        value={clearDirection}
                        onChange={setClearDirection}
                        style={{ width: 120 }}
                        options={[
                            { value: 'all', label: 'All' },
                            { value: 'in', label: 'In' },
                            { value: 'out', label: 'Out' }
                        ]}
                        disabled={clearing}
                    />
                </div>
                <div style={{ marginTop: 16, color: 'var(--color-warning)' }}>
                    <b>Warning:</b> This action clears all BGP routes for all neighbors (neighbor: <code>*</code>).
                </div>
            </Modal>
        </div>
    );
};

export default BGPConfigurationContent; 