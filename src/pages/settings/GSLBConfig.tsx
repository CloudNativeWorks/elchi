/**
 * GSLB Configuration Settings
 * Manage GSLB settings for the project (zone, DNS secret, default TTL, etc.)
 */

import React, { useState, useEffect } from 'react';
import {
    Card,
    Form,
    Input,
    InputNumber,
    Switch,
    Button,
    Typography,
    Spin,
    Modal,
    Divider,
    Alert,
    Space,
    Tag
} from 'antd';
import { SaveOutlined, DeleteOutlined, ExclamationCircleOutlined, GlobalOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { useCustomGetQuery } from '@/common/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { gslbApi } from '../gslb/gslbApi';
import { GSLBConfig } from '../gslb/types';
import { DNS_SECRET_MIN_LENGTH } from '../gslb/constants';

const { Text, Paragraph, Title } = Typography;
const { confirm } = Modal;

const GSLBConfigComponent: React.FC = () => {
    const { project } = useProjectVariable();
    const queryClient = useQueryClient();
    const [isConfigured, setIsConfigured] = useState(false);
    const [showSecretInput, setShowSecretInput] = useState(false);
    const [originalZone, setOriginalZone] = useState<string | null>(null);

    // Fetch GSLB config
    const { data: gslbConfig, isLoading, refetch } = useCustomGetQuery({
        queryKey: `gslb-config-${project}`,
        enabled: !!project,
        path: `setting/gslb?project=${project}`,
        refetchOnWindowFocus: false
    });

    const [form] = Form.useForm();

    // Set configured state and form values
    useEffect(() => {
        if (gslbConfig?.gslb_config) {
            const config = gslbConfig.gslb_config;
            setIsConfigured(true);
            setOriginalZone(config.zone || null);
            form.setFieldsValue({
                enabled: config.enabled,
                zone: config.zone,
                failover_zones: config.failover_zones || [],
                default_ttl: config.default_ttl,
                // Don't set dns_secret in form, keep it empty (masked)
            });
        } else {
            setIsConfigured(false);
            setOriginalZone(null);
            form.resetFields();
            // Set defaults for new config
            form.setFieldsValue({
                enabled: false,
                failover_zones: [],
                default_ttl: 60
            });
        }
    }, [gslbConfig, form]);

    // Save mutation
    const saveMutation = useMutation({
        mutationFn: async (config: GSLBConfig) => {
            return await gslbApi.updateGslbConfig(project, config);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`gslb-config-${project}`] });
            refetch();
            setShowSecretInput(false);
        },
        onError: (error: any) => {
            console.error('Failed to save GSLB config:', error);
        }
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: async () => {
            return await gslbApi.deleteGslbConfig(project);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`gslb-config-${project}`] });
            refetch();
            setOriginalZone(null);
            setIsConfigured(false);
        },
        onError: (error: any) => {
            console.error('Failed to delete GSLB config:', error);
        }
    });

    const handleSave = async () => {
        try {
            const values = await form.validateFields();

            // If dns_secret is empty and we're updating (not creating), don't send it
            const config: GSLBConfig = {
                enabled: values.enabled,
                zone: values.zone,
                failover_zones: values.failover_zones || [],
                dns_secret: values.dns_secret || '',
                default_ttl: values.default_ttl
            };

            // If updating and dns_secret is empty, remove it from payload
            if (isConfigured && !values.dns_secret) {
                delete (config as any).dns_secret;
            }

            await saveMutation.mutateAsync(config);
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    const handleDelete = () => {
        confirm({
            title: 'Delete GSLB Configuration',
            icon: <ExclamationCircleOutlined />,
            content: (
                <div>
                    <p>Are you sure you want to delete the GSLB configuration?</p>
                    <p><strong>Warning:</strong> This will only work if there are no existing GSLB records.</p>
                </div>
            ),
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk() {
                deleteMutation.mutate();
            },
        });
    };

    // DNS domain validation pattern
    const dnsPattern = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*$/;

    return (
        <>
            <div style={{ padding: '20px' }}>
                <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                        <GlobalOutlined style={{ color: '#1890ff', fontSize: 24 }} />
                        <Title level={4} style={{ margin: 0 }}>GSLB Configuration</Title>
                    </div>
                    <Text type="secondary">
                        Configure Global Server Load Balancing (GSLB) with DNS-based health checking and automatic failover.
                    </Text>
                </div>

                <Card style={{ borderRadius: 8 }}>
                    <Spin spinning={isLoading} size="large" tip="Loading GSLB configuration...">
                        <Form
                            form={form}
                            layout="vertical"
                            size="large"
                        >
                            {/* Enabled Switch */}
                            <Form.Item
                                name="enabled"
                                label="Enable GSLB"
                                valuePropName="checked"
                            >
                                <Switch />
                            </Form.Item>

                            <Divider />

                            {/* Zone */}
                            <Form.Item
                                name="zone"
                                label="DNS Zone"
                                rules={[
                                    { required: true, message: 'Zone is required when GSLB is enabled' },
                                    { pattern: dnsPattern, message: 'Invalid DNS domain format' }
                                ]}
                                extra={
                                    isConfigured && originalZone ? (
                                        <Alert
                                            message="Zone cannot be changed after creation"
                                            description={`Current zone: ${originalZone}`}
                                            type="warning"
                                            showIcon
                                            style={{ marginTop: 8 }}
                                        />
                                    ) : (
                                        'Main DNS zone (e.g., global.example.com). This is immutable after creation.'
                                    )
                                }
                            >
                                <Input
                                    placeholder="global.example.com"
                                    disabled={isConfigured && !!originalZone}
                                />
                            </Form.Item>

                            {/* Failover Zones */}
                            <Form.List name="failover_zones">
                                {(fields, { add, remove, move }) => (
                                    <>
                                        <Form.Item
                                            label="Failover Zones (Optional)"
                                            extra={
                                                <Space direction="vertical" size={4} style={{ marginTop: 8 }}>
                                                    <Text type="secondary" strong style={{ color: '#faad14' }}>
                                                        First zone in the list is the default for auto-created records
                                                    </Text>
                                                </Space>
                                            }
                                        >
                                            <Space direction="vertical" style={{ width: '100%' }} size="small">
                                                {fields.map((field, index) => (
                                                    <div key={field.key} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', width: '100%' }}>
                                                        <Tag color={index === 0 ? 'gold' : 'blue'} style={{ marginTop: 5, width: 70, textAlign: 'center', flexShrink: 0 }}>
                                                            {index === 0 ? 'DEFAULT' : `#${index + 1}`}
                                                        </Tag>
                                                        <Form.Item
                                                            name={field.name}
                                                            rules={[
                                                                { required: true, message: 'Zone required' },
                                                                { pattern: dnsPattern, message: 'Invalid DNS format' }
                                                            ]}
                                                            style={{ marginBottom: 0, flex: 1 }}
                                                        >
                                                            <Input style={{ width: '100%' }} placeholder="backup.example.com" size="large" />
                                                        </Form.Item>
                                                        <div style={{ marginTop: 5, display: 'flex', gap: 4, flexShrink: 0 }}>
                                                            {index > 0 && (
                                                                <Button
                                                                    size="small"
                                                                    onClick={() => move(index, index - 1)}
                                                                    title="Move up"
                                                                >
                                                                    ↑
                                                                </Button>
                                                            )}
                                                            {index < fields.length - 1 && (
                                                                <Button
                                                                    size="small"
                                                                    onClick={() => move(index, index + 1)}
                                                                    title="Move down"
                                                                >
                                                                    ↓
                                                                </Button>
                                                            )}
                                                            <Button
                                                                danger
                                                                size="small"
                                                                icon={<CloseOutlined />}
                                                                onClick={() => remove(field.name)}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                                <Button
                                                    type="dashed"
                                                    onClick={() => add()}
                                                    icon={<PlusOutlined />}
                                                    style={{ width: '100%', marginTop: 8 }}
                                                >
                                                    Add Failover Zone
                                                </Button>
                                            </Space>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>

                            {/* DNS Secret */}
                            <Form.Item label="DNS Secret">
                                {isConfigured && !showSecretInput ? (
                                    <div>
                                        <Text type="secondary">
                                            Secret is configured (masked for security)
                                        </Text>
                                        <br />
                                        <Button
                                            type="link"
                                            onClick={() => {
                                                confirm({
                                                    title: 'Change DNS Secret',
                                                    icon: <ExclamationCircleOutlined />,
                                                    content: (
                                                        <div>
                                                            <p>Are you sure you want to change the DNS secret?</p>
                                                            <Alert
                                                                message="Important: You must update the secret in CoreDNS configuration as well"
                                                                description="If you change the DNS secret here, CoreDNS will not be able to fetch GSLB records until you update the X-Elchi-Secret header in your CoreDNS plugin configuration."
                                                                type="error"
                                                                showIcon
                                                                style={{ marginTop: 12 }}
                                                            />
                                                        </div>
                                                    ),
                                                    okText: 'Change Secret',
                                                    okType: 'danger',
                                                    cancelText: 'Cancel',
                                                    width: 600,
                                                    onOk() {
                                                        setShowSecretInput(true);
                                                    },
                                                });
                                            }}
                                            style={{ padding: 0 }}
                                        >
                                            Change Secret
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <Form.Item
                                            name="dns_secret"
                                            noStyle
                                            rules={[
                                                {
                                                    required: !isConfigured,
                                                    message: 'DNS secret is required when GSLB is enabled'
                                                },
                                                {
                                                    min: DNS_SECRET_MIN_LENGTH,
                                                    message: `DNS secret must be at least ${DNS_SECRET_MIN_LENGTH} characters`
                                                }
                                            ]}
                                        >
                                            <Input.Password
                                                placeholder="Enter secret key (min 8 characters)"
                                                autoComplete="new-password"
                                            />
                                        </Form.Item>
                                        {isConfigured && (
                                            <Alert
                                                message="CoreDNS Configuration Required"
                                                description="After changing the DNS secret, you must update the X-Elchi-Secret header in your CoreDNS plugin configuration. Otherwise, CoreDNS will not be able to fetch GSLB records."
                                                type="error"
                                                showIcon
                                                style={{ marginTop: 8 }}
                                            />
                                        )}
                                    </>
                                )}
                                <Paragraph type="secondary" style={{ marginTop: 8, marginBottom: 0 }}>
                                    CoreDNS authentication secret (minimum {DNS_SECRET_MIN_LENGTH} characters)
                                </Paragraph>
                            </Form.Item>

                            {/* Default TTL */}
                            <Form.Item
                                name="default_ttl"
                                label="Default TTL (seconds)"
                                rules={[
                                    { required: true, message: 'Default TTL is required' },
                                    { type: 'number', min: 30, max: 86400, message: 'TTL must be between 30 and 86400 seconds' }
                                ]}
                                extra="Default Time-to-Live for auto-created GSLB records (recommended: 30-300)"
                            >
                                <InputNumber
                                    min={30}
                                    max={86400}
                                    style={{ width: '100%' }}
                                    placeholder="60"
                                />
                            </Form.Item>

                            {/* Action Buttons */}
                            <Form.Item>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <Button
                                        type="primary"
                                        icon={<SaveOutlined />}
                                        onClick={handleSave}
                                        loading={saveMutation.isPending}
                                        size="large"
                                        style={{ flex: 1 }}
                                    >
                                        {isConfigured ? 'Update Configuration' : 'Create Configuration'}
                                    </Button>
                                    {isConfigured && (
                                        <Button
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={handleDelete}
                                            loading={deleteMutation.isPending}
                                            size="large"
                                        >
                                            Delete
                                        </Button>
                                    )}
                                </div>
                            </Form.Item>
                        </Form>
                    </Spin>
                </Card>
            </div>
        </>
    );
};

export default GSLBConfigComponent;
