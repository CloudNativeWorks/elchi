import React, { useEffect, useMemo } from 'react';
import {
    Alert,
    App as AntdApp,
    Badge,
    Card,
    Col,
    Collapse,
    Form,
    Input,
    InputNumber,
    Row,
    Select,
    Space,
    Switch,
    Tooltip,
    Typography,
    message,
} from 'antd';
import {
    AuditOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
    InfoCircleOutlined,
    SaveOutlined,
    ThunderboltOutlined,
} from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { useCustomGetQuery, api } from '@/common/api';
import ElchiButton from '@/elchi/components/common/ElchiButton';
import PemField from './components/PemField';

const { Text, Title } = Typography;

// ─── Types ───────────────────────────────────────────────────────────────────

type Protocol = 'udp' | 'tcp' | 'tcp+tls';
type Facility =
    | 'local0'
    | 'local1'
    | 'local2'
    | 'local3'
    | 'local4'
    | 'local5'
    | 'local6'
    | 'local7';

interface SyslogFormValues {
    enabled: boolean;
    protocol: Protocol;
    host?: string;
    port?: number;
    facility?: Facility;
    tag?: string;
    /** mTLS UI flag — not sent to backend; controls visibility of cert/key fields. */
    use_mtls?: boolean;
    ca_cert?: string;
    client_cert?: string;
    client_key?: string;
    queue_size?: number;
    connect_timeout_ms?: number;
    write_timeout_ms?: number;
}

interface SyslogConfigData extends SyslogFormValues {
    has_ca_cert?: boolean;
    has_client_cert?: boolean;
    has_client_key?: boolean;
}

interface GetSyslogResponse {
    syslog_config: SyslogConfigData | null;
}

interface TestResponse {
    success: boolean;
    latency_ms?: number;
    error?: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const PROTOCOL_OPTIONS: { value: Protocol; label: string }[] = [
    { value: 'udp', label: 'UDP' },
    { value: 'tcp', label: 'TCP' },
    { value: 'tcp+tls', label: 'TCP + TLS' },
];

const FACILITY_OPTIONS: { value: Facility; label: string }[] = [
    'local0',
    'local1',
    'local2',
    'local3',
    'local4',
    'local5',
    'local6',
    'local7',
].map((f) => ({ value: f as Facility, label: f }));

const TAG_REGEX = /^[\x21-\x7E]*$/;

// ─── Component ───────────────────────────────────────────────────────────────

const SyslogConfig: React.FC = () => {
    const { modal } = AntdApp.useApp();
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm<SyslogFormValues>();

    const { data, isLoading, refetch } = useCustomGetQuery({
        queryKey: 'syslog-config-global',
        // useCustomGetQuery prepends Config.baseApi (= "/api/v3") automatically;
        // pass the path WITHOUT that prefix or it gets duplicated.
        path: 'setting/syslog-config',
        refetchOnWindowFocus: false,
    });

    const stored = (data as GetSyslogResponse | undefined)?.syslog_config ?? null;
    const hasConfig = !!stored;

    // Hydrate the form when GET resolves. We use an effect (not initialValues)
    // because the GET is async and initialValues only apply on first render.
    // `form` is a stable Form instance from antd's Form.useForm() so it's
    // safe to omit from deps even though linters that enforce
    // exhaustive-deps would flag it.
    useEffect(() => {
        if (stored) {
            form.setFieldsValue({
                ...stored,
                use_mtls: !!(stored.has_client_cert || stored.has_client_key),
            });
        } else {
            form.setFieldsValue({
                enabled: false,
                protocol: 'tcp',
                port: 514,
                facility: 'local0',
                tag: 'elchi-audit',
                queue_size: 10000,
                connect_timeout_ms: 5000,
                write_timeout_ms: 10000,
            });
        }
    }, [stored, form]);

    // Watch for protocol + mtls changes so conditional sections re-render.
    const protocol = Form.useWatch('protocol', form);
    const useMtls = Form.useWatch('use_mtls', form);
    const enabled = Form.useWatch('enabled', form);

    const isTls = protocol === 'tcp+tls';

    // ─── Mutations ───────────────────────────────────────────────────────────

    const saveMutation = useMutation({
        mutationFn: async (payload: SyslogFormValues) => {
            // Strip the UI-only mTLS flag.
            const { use_mtls: _ignored, ...body } = payload;
            void _ignored;
            const response = hasConfig
                ? await api.put('/api/v3/setting/syslog-config', body)
                : await api.post('/api/v3/setting/syslog-config', body);
            return response.data;
        },
        onSuccess: () => {
            messageApi.success('Syslog configuration saved');
            refetch();
        },
        onError: (error: any) => {
            const msg =
                error?.response?.data?.message || error?.message || 'Failed to save configuration';
            messageApi.error(msg);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async () => {
            const response = await api.delete('/api/v3/setting/syslog-config');
            return response.data;
        },
        onSuccess: () => {
            messageApi.success('Syslog configuration deleted');
            form.resetFields();
            refetch();
        },
        onError: (error: any) => {
            const msg =
                error?.response?.data?.message ||
                error?.message ||
                'Failed to delete configuration';
            messageApi.error(msg);
        },
    });

    const testMutation = useMutation({
        mutationFn: async (payload: SyslogFormValues): Promise<TestResponse> => {
            const { use_mtls: _ignored, ...body } = payload;
            void _ignored;
            const response = await api.post<TestResponse>('/api/v3/setting/syslog-config/test', body);
            return response.data;
        },
        onSuccess: (resp) => {
            // Test endpoint returns 200 even on failure; switch on `success`.
            if (resp.success) {
                messageApi.success(
                    `✓ Connected${resp.latency_ms != null ? ` (${resp.latency_ms} ms)` : ''}`,
                );
            } else {
                messageApi.error(`✗ Test failed: ${resp.error || 'unknown error'}`);
            }
        },
        onError: (error: any) => {
            const msg =
                error?.response?.data?.message ||
                error?.message ||
                'Test request failed';
            messageApi.error(msg);
        },
    });

    // ─── Handlers ────────────────────────────────────────────────────────────

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            saveMutation.mutate(stripMtlsIfUnused(values));
        } catch {
            // antd already surfaces field errors inline
        }
    };

    const handleTest = async () => {
        try {
            const values = await form.validateFields();
            testMutation.mutate(stripMtlsIfUnused(values));
        } catch {
            // validation errors already surfaced
        }
    };

    const handleDelete = () => {
        modal.confirm({
            title: 'Delete syslog configuration?',
            icon: <ExclamationCircleOutlined />,
            content:
                'Audit log forwarding to the SIEM will stop within 30 seconds. Audit logs in MongoDB are not affected.',
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: () => deleteMutation.mutate(),
        });
    };

    // ─── Status badge ────────────────────────────────────────────────────────

    const statusBadge = useMemo(() => {
        if (!stored) {
            return (
                <Badge
                    status="default"
                    text={<Text type="secondary">Not configured</Text>}
                />
            );
        }
        if (stored.enabled) {
            return <Badge status="success" text="Forwarding active" />;
        }
        return (
            <Badge
                status="default"
                text={<Text type="secondary">Disabled (config saved)</Text>}
            />
        );
    }, [stored]);

    // ─── Render ──────────────────────────────────────────────────────────────

    return (
        <>
            {contextHolder}
            <Card
                style={{ borderRadius: 12 }}
                styles={{ body: { padding: 20 } }}
                loading={isLoading}
            >
                <Space
                    direction="horizontal"
                    style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}
                    align="start"
                >
                    <div>
                        <Title level={5} style={{ margin: 0 }}>
                            <AuditOutlined style={{ marginInlineEnd: 8 }} />
                            Audit Log Forwarding (Syslog / SIEM)
                        </Title>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Forward audit events to a remote SIEM (Splunk, QRadar, Elastic…) via
                            RFC5424 syslog. Global setting — applies to every project.
                        </Text>
                    </div>
                    {statusBadge}
                </Space>

                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        enabled: false,
                        protocol: 'tcp',
                        port: 514,
                        facility: 'local0',
                        tag: 'elchi-audit',
                        queue_size: 10000,
                        connect_timeout_ms: 5000,
                        write_timeout_ms: 10000,
                    }}
                >
                    {/* ─── Basic ─── */}
                    <Form.Item
                        label="Enable forwarding"
                        name="enabled"
                        valuePropName="checked"
                        extra="When off, the configuration stays saved but no events are sent."
                    >
                        <Switch />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col xs={24} md={6}>
                            <Form.Item label="Protocol" name="protocol" rules={[{ required: true }]}>
                                <Select options={PROTOCOL_OPTIONS} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Host"
                                name="host"
                                rules={[
                                    {
                                        required: enabled,
                                        message: 'Host is required when forwarding is enabled',
                                    },
                                ]}
                            >
                                <Input placeholder="siem.example.com" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={6}>
                            <Form.Item
                                label="Port"
                                name="port"
                                rules={[
                                    {
                                        required: enabled,
                                        message: 'Port is required when forwarding is enabled',
                                    },
                                    {
                                        type: 'number',
                                        min: 1,
                                        max: 65535,
                                        message: 'Port must be 1–65535',
                                    },
                                ]}
                            >
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* ─── TLS section ─── (visible only when protocol is tcp+tls) */}
                    {isTls && (
                        <Collapse
                            defaultActiveKey={['tls']}
                            ghost
                            items={[
                                {
                                    key: 'tls',
                                    label: <Text strong>TLS</Text>,
                                    children: (
                                        <>
                                            <Alert
                                                type="info"
                                                showIcon
                                                style={{ marginBottom: 12 }}
                                                message="Provide a CA certificate if the SIEM uses a private/self-signed CA. For mTLS, also enable client authentication."
                                            />
                                            <PemField
                                                label="CA Certificate"
                                                formItemName="ca_cert"
                                                hasStored={!!stored?.has_ca_cert}
                                                formValue={form.getFieldValue('ca_cert')}
                                                setFormValue={(v) =>
                                                    form.setFieldValue('ca_cert', v)
                                                }
                                                hint="Optional. Required only if the SIEM uses a private CA."
                                            />

                                            <Form.Item
                                                label="Use client certificate (mTLS)"
                                                name="use_mtls"
                                                valuePropName="checked"
                                                extra="Required by SIEMs that authenticate the WAF with mTLS. Both certificate AND key must be provided together."
                                            >
                                                <Switch />
                                            </Form.Item>

                                            {useMtls && (
                                                <>
                                                    <PemField
                                                        label="Client Certificate"
                                                        formItemName="client_cert"
                                                        hasStored={!!stored?.has_client_cert}
                                                        formValue={form.getFieldValue('client_cert')}
                                                        setFormValue={(v) =>
                                                            form.setFieldValue('client_cert', v)
                                                        }
                                                    />
                                                    <PemField
                                                        label="Client Key"
                                                        formItemName="client_key"
                                                        hasStored={!!stored?.has_client_key}
                                                        formValue={form.getFieldValue('client_key')}
                                                        setFormValue={(v) =>
                                                            form.setFieldValue('client_key', v)
                                                        }
                                                    />
                                                </>
                                            )}

                                            <Alert
                                                type="warning"
                                                showIcon
                                                style={{ marginTop: 8, fontSize: 12 }}
                                                message="To remove a stored certificate"
                                                description="The backend has no per-PEM clear endpoint. Either delete the entire configuration and re-create it without certs, or switch protocol to TCP/UDP (certs stay stored but unused)."
                                            />
                                        </>
                                    ),
                                },
                            ]}
                        />
                    )}

                    {/* ─── Advanced (collapsed by default) ─── */}
                    <Collapse
                        ghost
                        items={[
                            {
                                key: 'advanced',
                                label: <Text strong>Advanced</Text>,
                                children: (
                                    <Row gutter={16}>
                                        <Col xs={24} md={6}>
                                            <Form.Item label="Facility" name="facility">
                                                <Select options={FACILITY_OPTIONS} allowClear />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={6}>
                                            <Form.Item
                                                label="Tag (APP-NAME)"
                                                name="tag"
                                                rules={[
                                                    { max: 48, message: 'Max 48 characters' },
                                                    {
                                                        pattern: TAG_REGEX,
                                                        message:
                                                            'Printable ASCII only — no whitespace or control chars',
                                                    },
                                                ]}
                                            >
                                                <Input placeholder="elchi-audit" />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={4}>
                                            <Form.Item
                                                label="Queue size"
                                                name="queue_size"
                                                rules={[
                                                    {
                                                        type: 'number',
                                                        min: 0,
                                                        max: 100000,
                                                        message: '0–100000',
                                                    },
                                                ]}
                                            >
                                                <InputNumber style={{ width: '100%' }} />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={4}>
                                            <Form.Item
                                                label="Connect timeout (ms)"
                                                name="connect_timeout_ms"
                                                rules={[{ type: 'number', min: 0 }]}
                                            >
                                                <InputNumber style={{ width: '100%' }} />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={4}>
                                            <Form.Item
                                                label="Write timeout (ms)"
                                                name="write_timeout_ms"
                                                rules={[{ type: 'number', min: 0 }]}
                                            >
                                                <InputNumber style={{ width: '100%' }} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                ),
                            },
                        ]}
                    />

                    {/* ─── Actions ─── */}
                    <Space
                        style={{ width: '100%', justifyContent: 'space-between', marginTop: 16 }}
                    >
                        <Space>
                            <ElchiButton
                                type="primary"
                                icon={<SaveOutlined />}
                                onClick={handleSave}
                                loading={saveMutation.isPending}
                            >
                                {hasConfig ? 'Save changes' : 'Save'}
                            </ElchiButton>
                            <Tooltip title="Tests connectivity from one controller pod; other pods may have different network access.">
                                <ElchiButton
                                    icon={<ThunderboltOutlined />}
                                    onClick={handleTest}
                                    loading={testMutation.isPending}
                                >
                                    Test connection
                                </ElchiButton>
                            </Tooltip>
                        </Space>
                        <ElchiButton
                            danger
                            icon={<DeleteOutlined />}
                            onClick={handleDelete}
                            disabled={!hasConfig}
                            loading={deleteMutation.isPending}
                        >
                            Delete
                        </ElchiButton>
                    </Space>

                    <div style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: 12 }}>
                        <InfoCircleOutlined style={{ marginInlineEnd: 6 }} />
                        Configuration changes take effect within ~30 seconds across controllers.
                    </div>

                    {/* Test result hint when last test failed */}
                    {testMutation.isError && (
                        <Alert
                            type="error"
                            showIcon
                            icon={<CloseCircleOutlined />}
                            style={{ marginTop: 12 }}
                            message="Test request failed"
                            description="See the toast message for details. Check controller logs if connectivity issues persist."
                        />
                    )}
                    {testMutation.data && testMutation.data.success === false && (
                        <Alert
                            type="warning"
                            showIcon
                            icon={<CloseCircleOutlined />}
                            style={{ marginTop: 12 }}
                            message="Connection test failed"
                            description={testMutation.data.error || 'Unknown error'}
                        />
                    )}
                    {testMutation.data && testMutation.data.success === true && (
                        <Alert
                            type="success"
                            showIcon
                            icon={<CheckCircleOutlined />}
                            style={{ marginTop: 12 }}
                            message={`Connected${
                                testMutation.data.latency_ms != null
                                    ? ` (${testMutation.data.latency_ms} ms)`
                                    : ''
                            }`}
                        />
                    )}
                </Form>
            </Card>
        </>
    );
};

/**
 * Drop client_cert / client_key from the payload when mTLS is off so we
 * never ship orphan PEMs that would fail backend validation.
 */
const stripMtlsIfUnused = (values: SyslogFormValues): SyslogFormValues => {
    if (values.use_mtls) return values;
    const { client_cert: _c, client_key: _k, ...rest } = values;
    void _c;
    void _k;
    return rest;
};

export default SyslogConfig;
