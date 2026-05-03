import React, { useMemo } from 'react';
import { Alert, Button, Card, Divider, Form, Input, Progress, Space, Spin, Tag, Tooltip, Typography, App as AntdApp } from 'antd';
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    DeleteOutlined,
    InfoCircleOutlined,
    KeyOutlined,
    ReloadOutlined,
    SafetyCertificateOutlined,
    ThunderboltOutlined,
    WarningOutlined,
} from '@ant-design/icons';
import useAuth from '@/hooks/useUserDetails';
import {
    LicenseInfo,
    getDaysUntilExpiry,
    getPlanColors,
    getPlanDisplayName,
    useActivateLicense,
    useDeleteLicense,
    useForceLicenseCheck,
    useLicenseStatus,
} from '@/hooks/useLicense';

const { Text, Title } = Typography;

const formatDateTime = (iso?: string): string => {
    if (!iso) return '—';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString();
};

const formatDate = (iso?: string): string => {
    if (!iso) return '—';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString();
};

interface FieldRowProps {
    label: string;
    children: React.ReactNode;
}

const FieldRow: React.FC<FieldRowProps> = ({ label, children }) => (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, padding: '6px 0' }}>
        <Text type="secondary" style={{ fontSize: 12, minWidth: 130 }}>{label}</Text>
        <div style={{ flex: 1, fontSize: 13, wordBreak: 'break-all' }}>{children}</div>
    </div>
);

interface LicenseCardProps {
    license: LicenseInfo;
    onRefetch: () => void;
    canManage: boolean;
}

const LicenseCard: React.FC<LicenseCardProps> = ({ license, onRefetch, canManage }) => {
    const { message } = AntdApp.useApp();
    const colors = getPlanColors(license);
    const planName = getPlanDisplayName(license);
    const limitLabel = license.client_limit === 0 ? 'Unlimited' : `${license.client_limit} client${license.client_limit === 1 ? '' : 's'}`;
    const usage = typeof license.current_clients === 'number' ? license.current_clients : null;
    const hasLimit = license.client_limit > 0;
    const usagePct = hasLimit && usage !== null
        ? Math.min(100, Math.round((usage / license.client_limit) * 100))
        : 0;
    const usageStatus: 'success' | 'normal' | 'exception' = usagePct >= 100
        ? 'exception'
        : usagePct >= 80
            ? 'normal'
            : 'success';
    const usageStrokeColor = usagePct >= 100
        ? 'var(--color-danger)'
        : usagePct >= 80
            ? 'var(--color-warning)'
            : 'var(--color-success)';

    const forceCheck = useForceLicenseCheck();
    const handleRecheck = async () => {
        try {
            await forceCheck.mutateAsync();
            message.success('License re-validated');
            onRefetch();
        } catch {
            // error toast handled by axios interceptor
        }
    };

    return (
        <div
            style={{
                border: `1px solid ${colors.border}`,
                background: colors.bg,
                borderRadius: 8,
                padding: 16,
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 12 }}>
                <Space size={12} align="center">
                    <SafetyCertificateOutlined style={{ fontSize: 22, color: colors.fg }} />
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Text strong style={{ fontSize: 18, color: colors.fg }}>{planName}</Text>
                            {license.valid ? (
                                <Tag color="success" style={{ margin: 0 }}>Active</Tag>
                            ) : (
                                <Tag color="error" style={{ margin: 0 }}>Inactive</Tag>
                            )}
                        </div>
                        <Text type="secondary" style={{ fontSize: 12 }}>{limitLabel}</Text>
                    </div>
                </Space>
                {canManage && (
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={handleRecheck}
                        loading={forceCheck.isPending}
                        size="middle"
                    >
                        Re-check now
                    </Button>
                )}
            </div>

            {usage !== null && (
                <div style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>Connected clients</Text>
                        <Text strong style={{ fontSize: 13, color: colors.fg }}>
                            {usage}
                            {hasLimit ? ` / ${license.client_limit}` : ''}
                            {!hasLimit && (
                                <Text type="secondary" style={{ fontSize: 12, marginLeft: 6 }}>(unlimited)</Text>
                            )}
                        </Text>
                    </div>
                    {hasLimit ? (
                        <Progress
                            percent={usagePct}
                            status={usageStatus}
                            strokeColor={usageStrokeColor}
                            showInfo={false}
                            size="small"
                        />
                    ) : (
                        <Progress
                            percent={100}
                            status="success"
                            strokeColor="var(--color-success)"
                            showInfo={false}
                            size="small"
                        />
                    )}
                </div>
            )}

            <Divider style={{ margin: '8px 0 12px' }} />

            <FieldRow label="License key">
                {license.license_key ? (
                    <Text style={{ fontFamily: 'monospace' }}>{license.license_key}</Text>
                ) : (
                    <Text type="secondary">Not activated</Text>
                )}
            </FieldRow>
            <FieldRow label="Activation ID">
                <Text style={{ fontFamily: 'monospace' }}>{license.activation_id || '—'}</Text>
            </FieldRow>
            <FieldRow label="Fingerprint">
                <Text style={{ fontFamily: 'monospace', fontSize: 12 }}>{license.fingerprint || '—'}</Text>
            </FieldRow>
            <FieldRow label="API key">
                {license.api_key_configured ? (
                    <Space size={6}>
                        <CheckCircleOutlined style={{ color: 'var(--color-success)' }} />
                        <Text>Configured</Text>
                        {license.api_key && (
                            <Text style={{ fontFamily: 'monospace' }} type="secondary">({license.api_key})</Text>
                        )}
                    </Space>
                ) : (
                    <Space size={6}>
                        <WarningOutlined style={{ color: 'var(--color-warning)' }} />
                        <Text type="secondary">Not configured</Text>
                    </Space>
                )}
            </FieldRow>
            <FieldRow label="Activated at">
                <Text>{formatDateTime(license.activated_at)}</Text>
            </FieldRow>
            <FieldRow label="Expires at">
                <Text>{formatDate(license.expires_at)}</Text>
            </FieldRow>
            <FieldRow label="Last checked">
                <Space size={6}>
                    <ClockCircleOutlined style={{ color: 'var(--text-secondary)' }} />
                    <Text>{formatDateTime(license.last_checked_at)}</Text>
                </Space>
            </FieldRow>
            {license.reason && (
                <FieldRow label="Reason">
                    <Text type="warning">{license.reason}</Text>
                </FieldRow>
            )}
        </div>
    );
};

interface ActivateFormValues {
    license_key: string;
    api_key: string;
}

interface ActivateLicenseFormProps {
    license?: LicenseInfo;
    onSuccess: () => void;
}

const ActivateLicenseForm: React.FC<ActivateLicenseFormProps> = ({ license, onSuccess }) => {
    const { message } = AntdApp.useApp();
    const [form] = Form.useForm<ActivateFormValues>();
    const activate = useActivateLicense();
    const isReactivation = !!license?.api_key_configured;

    const handleSubmit = async (values: ActivateFormValues) => {
        try {
            await activate.mutateAsync({
                license_key: values.license_key.trim(),
                api_key: values.api_key.trim(),
            });
            message.success('License activated');
            form.resetFields();
            onSuccess();
        } catch {
            // error toast handled by axios interceptor
        }
    };

    return (
        <Form<ActivateFormValues>
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            requiredMark={false}
            disabled={activate.isPending}
            autoComplete="off"
        >
            {/* Honeypot fields to defeat password-manager autofill heuristics. */}
            <input type="text" name="username" autoComplete="username" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" />
            <input type="password" name="password" autoComplete="current-password" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" />
            <Form.Item
                label="License key"
                name="license_key"
                rules={[{ required: true, message: 'License key is required' }]}
                extra={
                    isReactivation && license?.license_key ? (
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Re-enter your license key to re-activate. Currently saved: <Text code style={{ fontSize: 11 }}>{license.license_key}</Text>
                        </Text>
                    ) : null
                }
            >
                <Input
                    placeholder={isReactivation ? 'Enter license key to re-activate' : 'ELCHI-XXXX-XXXX-XXXX-XXXX'}
                    autoComplete="off"
                    prefix={<KeyOutlined style={{ color: 'var(--text-secondary)' }} />}
                    data-lpignore="true"
                    data-1p-ignore="true"
                    data-bwignore="true"
                    data-form-type="other"
                />
            </Form.Item>
            <Form.Item
                label={
                    <Space size={6}>
                        <span>API key</span>
                        <Tooltip
                            title={
                                isReactivation
                                    ? 'An API key is on file but you must re-enter it on every activation. The new value will replace the saved one.'
                                    : 'The API key is required and will be encrypted before storage.'
                            }
                        >
                            <InfoCircleOutlined style={{ color: 'var(--text-secondary)' }} />
                        </Tooltip>
                    </Space>
                }
                name="api_key"
                rules={[{ required: true, message: 'API key is required' }]}
                extra={
                    isReactivation ? (
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Re-enter your API key to re-activate.
                            {license?.api_key && (
                                <> Currently saved: <Text code style={{ fontSize: 11 }}>{license.api_key}</Text></>
                            )}
                        </Text>
                    ) : null
                }
            >
                <Input.Password
                    placeholder={isReactivation ? 'Enter API key to re-activate' : 'sk_live_...'}
                    autoComplete="new-password"
                    data-lpignore="true"
                    data-1p-ignore="true"
                    data-bwignore="true"
                    data-form-type="other"
                />
            </Form.Item>
            <Form.Item style={{ marginBottom: 0 }}>
                <Button
                    type="primary"
                    htmlType="submit"
                    icon={<ThunderboltOutlined />}
                    loading={activate.isPending}
                >
                    Activate license
                </Button>
            </Form.Item>
        </Form>
    );
};

interface DangerZoneProps {
    license: LicenseInfo;
    onSuccess: () => void;
}

const DangerZone: React.FC<DangerZoneProps> = ({ license, onSuccess }) => {
    const { message, modal } = AntdApp.useApp();
    const deleteLicense = useDeleteLicense();
    const planName = getPlanDisplayName(license);

    const handleDelete = () => {
        modal.confirm({
            title: 'Delete license?',
            icon: <WarningOutlined style={{ color: 'var(--color-danger)' }} />,
            content: (
                <Space direction="vertical" size={8}>
                    <Text>
                        This will revert the installation to the <Text strong>free plan (1 client max)</Text>.
                        Currently connected clients will keep working until they reconnect, then will be rejected.
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        You will need to re-enter both <Text code style={{ fontSize: 11 }}>license_key</Text> and{' '}
                        <Text code style={{ fontSize: 11 }}>api_key</Text> to re-activate.
                    </Text>
                </Space>
            ),
            okText: 'Delete license',
            okButtonProps: { danger: true, icon: <DeleteOutlined /> },
            cancelText: 'Cancel',
            centered: true,
            onOk: async () => {
                try {
                    await deleteLicense.mutateAsync();
                    message.success('License deleted; reverted to free plan');
                    onSuccess();
                } catch {
                    // error toast handled by axios interceptor
                }
            },
        });
    };

    return (
        <div
            style={{
                border: '1px solid rgba(255, 77, 79, 0.4)',
                background: 'rgba(255, 77, 79, 0.06)',
                borderRadius: 8,
                padding: 16,
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <WarningOutlined style={{ color: 'var(--color-danger)' }} />
                <Text strong style={{ color: 'var(--color-danger)' }}>Danger zone</Text>
            </div>
            <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 12 }}>
                Deleting the license reverts your installation to the free plan (1 client max). All connected clients
                beyond the new limit will continue working until they reconnect, after which they will be rejected.
            </Text>
            <Button
                danger
                icon={<DeleteOutlined />}
                onClick={handleDelete}
                loading={deleteLicense.isPending}
            >
                Delete license ({planName})
            </Button>
        </div>
    );
};

const Licensing: React.FC = () => {
    const userDetail = useAuth();
    const role = userDetail?.role || '';
    const canManage = ['owner', 'admin'].includes(role);

    const { license, isLoading, refetch } = useLicenseStatus({ polling: true });

    const expiryWarning = useMemo(() => {
        const days = getDaysUntilExpiry(license);
        if (days === null) return null;
        if (days < 0) {
            return (
                <Alert
                    type="error"
                    showIcon
                    message="License has expired"
                    description={`Expired on ${formatDate(license?.expires_at)}. The system has fallen back to the free plan. Renew or activate a new license to restore your client slots.`}
                />
            );
        }
        if (days <= 7) {
            return (
                <Alert
                    type="warning"
                    showIcon
                    message={`License expires in ${days} day${days === 1 ? '' : 's'}`}
                    description={
                        license?.client_limit && license.client_limit > 0
                            ? `Renew before ${formatDate(license?.expires_at)} to keep your ${license.client_limit} client slot${license.client_limit === 1 ? '' : 's'}.`
                            : `Renew before ${formatDate(license?.expires_at)} to avoid downgrade.`
                    }
                />
            );
        }
        return null;
    }, [license]);

    if (isLoading && !license) {
        return (
            <Card variant="borderless" style={{ boxShadow: 'none', background: 'transparent' }}>
                <div style={{ padding: 32, textAlign: 'center' }}>
                    <Spin />
                </div>
            </Card>
        );
    }

    return (
        <Card variant="borderless" style={{ boxShadow: 'none', background: 'transparent' }}>
            <Title level={5} style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <SafetyCertificateOutlined style={{ color: 'var(--color-primary)' }} />
                License
            </Title>

            <Space direction="vertical" style={{ width: '100%' }} size={16}>
                {license && (
                    <LicenseCard license={license} onRefetch={refetch} canManage={canManage} />
                )}

                {license?.last_error && (
                    <Alert
                        type="warning"
                        showIcon
                        message="Last license validation attempt failed"
                        description={
                            <Space direction="vertical" size={4}>
                                <Text>{license.last_error}</Text>
                                {license.expires_at && (
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        The cached license remains valid until {formatDate(license.expires_at)}. The system will retry every 24 hours.
                                    </Text>
                                )}
                            </Space>
                        }
                    />
                )}

                {expiryWarning}

                {!canManage && (
                    <Alert
                        type="info"
                        showIcon
                        message="Read-only access"
                        description="Only owners and administrators can activate licenses or trigger re-checks. Contact an administrator to make changes."
                    />
                )}

                {canManage && (
                    <>
                        <Divider style={{ margin: '8px 0' }} orientation="left" plain>
                            <Text type="secondary" style={{ fontSize: 12 }}>Activate license</Text>
                        </Divider>
                        <ActivateLicenseForm license={license} onSuccess={refetch} />

                        {license?.api_key_configured && (
                            <>
                                <Divider style={{ margin: '24px 0 8px' }} orientation="left" plain>
                                    <Text type="secondary" style={{ fontSize: 12 }}>Danger zone</Text>
                                </Divider>
                                <DangerZone license={license} onSuccess={refetch} />
                            </>
                        )}
                    </>
                )}
            </Space>
        </Card>
    );
};

export default Licensing;
