import React, { useState, useEffect, useCallback } from 'react';
import { Form, Input, InputNumber, Switch, Button, Card, Row, Col, Divider, message, Modal, Select } from 'antd';
import { SaveOutlined, ClearOutlined } from '@ant-design/icons';
import { useBGPOperations, BGPConfig } from '@/hooks/useBGPOperations';
import { useBGPContext } from './context/BGPContext';

interface BGPConfigurationContentProps {
    clientId: string;
}

const BGPConfigurationContent: React.FC<BGPConfigurationContentProps> = ({ clientId }) => {
    const [form] = Form.useForm();
    const [config, setConfig] = useState<BGPConfig | null>(null);
    const [loadingConfig, setLoadingConfig] = useState(false);
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
        setLoadingConfig(true);
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
        } finally {
            setLoadingConfig(false);
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
                message.success('BGP configuration saved successfully');
            }
        } catch (error) {
            console.error('Failed to save BGP config:', error);
            message.error('Failed to save BGP configuration');
        }
    };



    const handleClearBGP = async () => {
        setClearing(true);
        try {
            const result = await clearBGPRoutes(clientId, '*', clearSoft, clearDirection);
            if (result.success) {
                message.success('BGP routes cleared successfully');
                setClearModalOpen(false);
            }
        } catch (error) {
            message.error('Failed to clear BGP routes: ' + error);
        } finally {
            setClearing(false);
        }
    };

    return (
        <div>
            <Col span={24}>
                <Card
                    title="BGP Configuration"
                    style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                    loading={loadingConfig}
                >
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

                        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                icon={<SaveOutlined />}
                                loading={loading}
                                style={{
                                    background: 'linear-gradient(90deg, #056ccd 0%, #00c6fb 100%)',
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
                </Card>
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
                <div style={{ marginTop: 16, color: '#faad14' }}>
                    <b>Warning:</b> This action clears all BGP routes for all neighbors (neighbor: <code>*</code>).
                </div>
            </Modal>
        </div>
    );
};

export default BGPConfigurationContent; 