/**
 * WAF Configuration Form Component
 * Form for name, default directives, and advanced options
 */

import React from 'react';
import { Card, Form, Input, Select, Collapse, Space, Row, Col, Typography, Button, Tag, Badge, message } from 'antd';
import { PlusOutlined, CheckOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/es/form';

const { Text } = Typography;

export interface WafFormProps {
    form: FormInstance;
    isCreateMode: boolean;
    directiveSets: { [key: string]: string[] };
    metricLabels: { [key: string]: string };
    setMetricLabels: (labels: { [key: string]: string }) => void;
    perAuthorityDirectives: { [domain: string]: string };
    setPerAuthorityDirectives: (directives: { [domain: string]: string }) => void;
    newAuthorityDomain: string;
    setNewAuthorityDomain: (domain: string) => void;
    newAuthorityDirectiveSet: string;
    setNewAuthorityDirectiveSet: (set: string) => void;
}

const WafForm: React.FC<WafFormProps> = ({
    form,
    isCreateMode,
    directiveSets,
    metricLabels,
    setMetricLabels,
    perAuthorityDirectives,
    setPerAuthorityDirectives,
    newAuthorityDomain,
    setNewAuthorityDomain,
    newAuthorityDirectiveSet,
    setNewAuthorityDirectiveSet
}) => {
    return (
        <Card
            style={{
                marginBottom: 16,
                borderRadius: 12,
                boxShadow: 'var(--shadow-sm)',
                background: 'var(--card-bg)'
            }}
        >
            <Form
                form={form}
                layout="vertical"
                autoComplete="off"
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please input WAF config name!' }]}
                        >
                            <Input
                                placeholder="e.g., production-waf-config"
                                size="large"
                                disabled={!isCreateMode}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Default Directives"
                            name="default_directives"
                            rules={[
                                { required: true, message: 'Please select default directives!' },
                                {
                                    validator: (_, value) => {
                                        if (value && !directiveSets[value]) {
                                            return Promise.reject(new Error('Default directive set must exist in directive sets!'));
                                        }
                                        return Promise.resolve();
                                    }
                                }
                            ]}
                        >
                            <Select
                                placeholder="Select default directive set"
                                size="large"
                                options={Object.keys(directiveSets).map(setName => ({
                                    label: setName,
                                    value: setName
                                }))}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Collapse
                    ghost
                    items={[
                        {
                            key: 'advanced',
                            label: <Text strong>Advanced Options (Optional)</Text>,
                            children: (
                                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                                    <Row gutter={24}>
                                        <Col span={12}>
                                            <div style={{ marginBottom: 6 }}>
                                                <Space>
                                                    <Text strong style={{ fontSize: 14 }}>Metric Labels</Text>
                                                    <Badge count={Object.keys(metricLabels).length} style={{ backgroundColor: 'var(--color-success)' }} />
                                                </Space>
                                            </div>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 6, minHeight: 32 }}>
                                                {Object.entries(metricLabels).map(([key, value]) => (
                                                    <Tag
                                                        key={key}
                                                        closable
                                                        onClose={() => {
                                                            const newLabels = { ...metricLabels };
                                                            delete newLabels[key];
                                                            setMetricLabels(newLabels);
                                                        }}
                                                        style={{ margin: 0, padding: '4px 8px', fontSize: 13 }}
                                                    >
                                                        <Text code style={{ fontSize: 12 }}>{key}</Text>
                                                        <Text style={{ margin: '0 4px' }}>=</Text>
                                                        <Text strong style={{ fontSize: 12 }}>{value}</Text>
                                                    </Tag>
                                                ))}
                                            </div>
                                            <Space.Compact style={{ width: '100%' }}>
                                                <Input
                                                    placeholder="Key"
                                                    id="metricLabelKey"
                                                    size="middle"
                                                />
                                                <Input
                                                    placeholder="Value"
                                                    id="metricLabelValue"
                                                    size="middle"
                                                />
                                                <Button
                                                    type="primary"
                                                    icon={<PlusOutlined />}
                                                    size="middle"
                                                    onClick={() => {
                                                        const keyInput = document.getElementById('metricLabelKey') as HTMLInputElement;
                                                        const valueInput = document.getElementById('metricLabelValue') as HTMLInputElement;
                                                        if (keyInput?.value && valueInput?.value) {
                                                            setMetricLabels({
                                                                ...metricLabels,
                                                                [keyInput.value]: valueInput.value
                                                            });
                                                            keyInput.value = '';
                                                            valueInput.value = '';
                                                            message.success({
                                                                content: 'Metric label added!',
                                                                icon: <CheckOutlined style={{ color: 'var(--color-success)' }} />
                                                            });
                                                        }
                                                    }}
                                                >
                                                    Add
                                                </Button>
                                            </Space.Compact>
                                        </Col>
                                        <Col span={12}>
                                            <div style={{ marginBottom: 6 }}>
                                                <Space>
                                                    <Text strong style={{ fontSize: 14 }}>Per Authority Directives</Text>
                                                    <Badge count={Object.keys(perAuthorityDirectives).length} style={{ backgroundColor: 'var(--color-purple)' }} />
                                                </Space>
                                            </div>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 6, minHeight: 32 }}>
                                                {Object.entries(perAuthorityDirectives).map(([domain, directiveSet]) => (
                                                    <Tag
                                                        key={domain}
                                                        closable
                                                        onClose={() => {
                                                            const newDirectives = { ...perAuthorityDirectives };
                                                            delete newDirectives[domain];
                                                            setPerAuthorityDirectives(newDirectives);
                                                        }}
                                                        color="purple"
                                                        style={{ margin: 0, padding: '4px 8px', fontSize: 13 }}
                                                    >
                                                        <Text code style={{ fontSize: 12, color: 'inherit' }}>{domain}</Text>
                                                        <Text style={{ margin: '0 4px', color: 'inherit' }}>→</Text>
                                                        <Text strong style={{ fontSize: 12, color: 'inherit' }}>{directiveSet}</Text>
                                                    </Tag>
                                                ))}
                                            </div>
                                            <Space.Compact style={{ width: '100%' }}>
                                                <Input
                                                    placeholder="Domain"
                                                    value={newAuthorityDomain}
                                                    onChange={(e) => setNewAuthorityDomain(e.target.value)}
                                                    size="middle"
                                                />
                                                <Select
                                                    placeholder="Directive set"
                                                    value={newAuthorityDirectiveSet || undefined}
                                                    onChange={(value) => setNewAuthorityDirectiveSet(value)}
                                                    size="middle"
                                                    style={{ minWidth: 120 }}
                                                    options={Object.keys(directiveSets).map(setName => ({
                                                        label: setName,
                                                        value: setName
                                                    }))}
                                                />
                                                <Button
                                                    type="primary"
                                                    icon={<PlusOutlined />}
                                                    size="middle"
                                                    onClick={() => {
                                                        if (newAuthorityDomain && newAuthorityDirectiveSet) {
                                                            setPerAuthorityDirectives({
                                                                ...perAuthorityDirectives,
                                                                [newAuthorityDomain]: newAuthorityDirectiveSet
                                                            });
                                                            setNewAuthorityDomain('');
                                                            setNewAuthorityDirectiveSet('');
                                                            message.success({
                                                                content: 'Authority directive added!',
                                                                icon: <CheckOutlined style={{ color: 'var(--color-success)' }} />
                                                            });
                                                        }
                                                    }}
                                                >
                                                    Add
                                                </Button>
                                            </Space.Compact>
                                        </Col>
                                    </Row>
                                </Space>
                            )
                        }
                    ]}
                />
            </Form>
        </Card>
    );
};

export default WafForm;
