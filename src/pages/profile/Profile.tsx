import React, { useState } from 'react';
import { Row, Col, Typography, Space, Button, Form, Input, Statistic, Modal, Divider, Alert, Tag } from 'antd';
import {
    UserOutlined,
    MailOutlined,
    KeyOutlined,
    SafetyOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ReloadOutlined,
    WarningOutlined,
    LockOutlined,
} from '@ant-design/icons';
import useAuth from '@/hooks/useUserDetails';
import { useOTP, OTPRegenerateResponse } from '@/hooks/useOTP';
import { useOTPStatus } from '@/hooks/useOTPStatus';
import { OTPSetupModal } from '@/components/otp/OTPSetupModal';
import { BackupCodesDisplay } from '@/components/otp/BackupCodesDisplay';
import { useCustomApiMutation } from '@/common/custom-api';

const { Title, Text } = Typography;

const Profile: React.FC = () => {
    const userDetail = useAuth();
    const { status: otpStatus, refetch: refetchOTPStatus } = useOTPStatus(!!userDetail);
    const { disableOTP, regenerateBackupCodes, isLoading: otpLoading } = useOTP();
    const mutate = useCustomApiMutation();

    const [showOTPSetup, setShowOTPSetup] = useState(false);
    const [showDisableOTP, setShowDisableOTP] = useState(false);
    const [showRegenerateBackup, setShowRegenerateBackup] = useState(false);
    const [newBackupCodes, setNewBackupCodes] = useState<string[] | null>(null);

    const [emailForm] = Form.useForm();
    const [passwordForm] = Form.useForm();
    const [disableOTPForm] = Form.useForm();
    const [regenerateForm] = Form.useForm();

    const isLocalAuth = !userDetail?.auth_type || userDetail?.auth_type !== 'ldap';

    const handleUpdateEmail = async (values: { email: string; password: string }) => {
        await mutate.mutateAsync({
            method: 'put',
            path: 'api/v3/profile/email',
            data: values,
            directApi: true
        });
        emailForm.resetFields();
    };

    const handleUpdatePassword = async (values: { current_password: string; new_password: string }) => {
        await mutate.mutateAsync({
            method: 'put',
            path: 'api/v3/profile/password',
            data: values,
            directApi: true
        });
        passwordForm.resetFields();
    };

    const handleDisableOTP = async (values: { password: string; otp_code?: string; backup_code?: string }) => {
        try {
            await disableOTP(values.password, values.otp_code, values.backup_code);
            setShowDisableOTP(false);
            disableOTPForm.resetFields();
            refetchOTPStatus();
        } catch (error) {
            // Error handled by central system
        }
    };

    const handleRegenerateBackupCodes = async (values: { otp_code: string }) => {
        try {
            const response: OTPRegenerateResponse = await regenerateBackupCodes(values.otp_code);
            setNewBackupCodes(response.backup_codes);
            regenerateForm.resetFields();
        } catch (error) {
            // Error handled by central system
        }
    };

    const handleOTPSetupComplete = () => {
        setShowOTPSetup(false);
        refetchOTPStatus();
    };

    return (
        <div style={{ width: '100%', padding: '12px' }}>
            <div style={{ marginBottom: '24px' }}>
                <Title level={3} style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>
                    My Profile
                </Title>
                <Text style={{ color: 'var(--text-secondary)' }}>Manage your account settings and security</Text>
            </div>

            <Row gutter={[24, 24]}>
                {/* User Info Box */}
                <Col xs={24} lg={12}>
                    <div style={{
                        borderRadius: '12px',
                        background: 'var(--gradient-primary)',
                        color: 'white',
                        padding: '24px',
                        height: '100%',
                        boxShadow: 'var(--shadow-md)'
                    }}>
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <Space>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '12px',
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <UserOutlined style={{ fontSize: 24, color: 'white' }} />
                                </div>
                                <div>
                                    <Text style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', display: 'block' }}>
                                        {userDetail?.username}
                                    </Text>
                                    <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>
                                        {userDetail?.email}
                                    </Text>
                                </div>
                            </Space>

                            <Divider style={{ borderColor: 'rgba(255,255,255,0.3)', margin: '12px 0' }} />

                            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>
                                        Role
                                    </Text>
                                    <Tag
                                        style={{
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            background: 'rgba(255,255,255,0.2)',
                                            color: 'white',
                                            border: 'none'
                                        }}
                                    >
                                        {userDetail?.role?.toUpperCase()}
                                    </Tag>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>
                                        Authentication
                                    </Text>
                                    <Tag
                                        style={{
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            background: 'rgba(255,255,255,0.2)',
                                            color: 'white',
                                            border: 'none'
                                        }}
                                    >
                                        {(userDetail?.auth_type || 'LOCAL').toUpperCase()}
                                    </Tag>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>
                                        2FA Status
                                    </Text>
                                    <Tag
                                        style={{
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            background: otpStatus?.otp_enabled ? 'rgba(82, 196, 26, 0.3)' : 'rgba(255, 77, 79, 0.3)',
                                            color: 'white',
                                            border: 'none'
                                        }}
                                    >
                                        {otpStatus?.otp_enabled ? 'ENABLED' : 'DISABLED'}
                                    </Tag>
                                </div>
                            </Space>
                        </Space>
                    </div>
                </Col>

                {/* Security Status Box */}
                <Col xs={24} lg={12}>
                    <div style={{
                        background: 'var(--card-bg)',
                        padding: '24px',
                        borderRadius: '12px',
                        border: '1px solid var(--border-default)',
                        height: '100%'
                    }}>
                        <Space direction="vertical" style={{ width: '100%' }} size="middle">
                            <Space>
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '8px',
                                    background: 'linear-gradient(135deg, #722ed1 0%, #1890ff 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <SafetyOutlined style={{ color: 'white', fontSize: '18px' }} />
                                </div>
                                <div>
                                    <Text style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                                        Two-Factor Authentication
                                    </Text>
                                    <br />
                                    <Text style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                        Enhanced account security
                                    </Text>
                                </div>
                            </Space>

                            <Divider style={{ margin: '8px 0' }} />

                            {otpStatus?.otp_enabled ? (
                                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                                    <div style={{
                                        padding: '12px 14px',
                                        background: 'var(--color-success-light)',
                                        borderRadius: '8px',
                                        border: '1px solid var(--color-success-border)'
                                    }}>
                                        <Space size={8}>
                                            <CheckCircleOutlined style={{ color: 'var(--color-success)', fontSize: 16 }} />
                                            <Text strong style={{ color: 'var(--color-success)' }}>2FA is Active</Text>
                                        </Space>
                                    </div>
                                    <Statistic
                                        title={<span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Backup Codes Remaining</span>}
                                        value={otpStatus.backup_codes_count}
                                        suffix="/ 10"
                                        valueStyle={{
                                            color: otpStatus.backup_codes_count < 5 ? 'var(--color-warning)' : 'var(--color-success)',
                                            fontSize: 24
                                        }}
                                    />
                                    {otpStatus.backup_codes_count < 5 && (
                                        <Alert
                                            message="Low Backup Codes"
                                            description="Consider regenerating them."
                                            type="warning"
                                            showIcon
                                            style={{ fontSize: 12 }}
                                        />
                                    )}
                                    <Space style={{ marginTop: 4 }}>
                                        <Button
                                            icon={<ReloadOutlined />}
                                            onClick={() => setShowRegenerateBackup(true)}
                                            size="middle"
                                        >
                                            Regenerate
                                        </Button>
                                        <Button
                                            danger
                                            icon={<CloseCircleOutlined />}
                                            onClick={() => setShowDisableOTP(true)}
                                            size="middle"
                                        >
                                            Disable 2FA
                                        </Button>
                                    </Space>
                                </Space>
                            ) : (
                                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                                    <div style={{
                                        padding: '12px 14px',
                                        background: 'var(--color-warning-light)',
                                        borderRadius: '8px',
                                        border: '1px solid var(--color-warning-border)'
                                    }}>
                                        <Space size={8}>
                                            <WarningOutlined style={{ color: 'var(--color-warning)', fontSize: 16 }} />
                                            <Text strong style={{ color: 'var(--color-warning)' }}>2FA is Not Active</Text>
                                        </Space>
                                    </div>
                                    <Text type="secondary" style={{ fontSize: 13 }}>
                                        {isLocalAuth
                                            ? "Add an extra layer of security to your account."
                                            : "LDAP users can also use 2FA with authenticator apps."}
                                    </Text>
                                    <Button
                                        type="primary"
                                        icon={<SafetyOutlined />}
                                        onClick={() => setShowOTPSetup(true)}
                                        size="large"
                                        block
                                        style={{
                                            background: 'var(--gradient-primary)',
                                            border: 'none',
                                            marginTop: 8
                                        }}
                                    >
                                        Enable 2FA
                                    </Button>
                                </Space>
                            )}
                        </Space>
                    </div>
                </Col>

                {/* Update Email Box */}
                <Col xs={24} lg={12}>
                    <div style={{
                        background: 'var(--card-bg)',
                        padding: '24px',
                        borderRadius: '12px',
                        border: '1px solid var(--border-default)'
                    }}>
                        <Space direction="vertical" style={{ width: '100%' }} size="middle">
                            <Space>
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '8px',
                                    background: 'linear-gradient(135deg, #13c2c2 0%, #1890ff 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <MailOutlined style={{ color: 'white', fontSize: '18px' }} />
                                </div>
                                <div>
                                    <Text style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                                        Update Email
                                    </Text>
                                    <br />
                                    <Text style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                        Change your email address
                                    </Text>
                                </div>
                            </Space>

                            <Divider style={{ margin: '8px 0' }} />

                            {!isLocalAuth && (
                                <Alert
                                    message="LDAP Authentication"
                                    description="Email is managed by LDAP server."
                                    type="info"
                                    showIcon
                                    style={{ fontSize: 12 }}
                                />
                            )}
                            <Form
                                form={emailForm}
                                layout="vertical"
                                onFinish={handleUpdateEmail}
                                disabled={!isLocalAuth}
                            >
                                <Form.Item
                                    label={<span style={{ fontSize: 13 }}>New Email</span>}
                                    name="email"
                                    rules={[
                                        { required: isLocalAuth, message: 'Please enter new email' },
                                        { type: 'email', message: 'Please enter a valid email' }
                                    ]}
                                    style={{ marginBottom: 12 }}
                                >
                                    <Input
                                        prefix={<MailOutlined />}
                                        placeholder={isLocalAuth ? "Enter new email" : "Managed by LDAP"}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={<span style={{ fontSize: 13 }}>Confirm Password</span>}
                                    name="password"
                                    rules={[{ required: isLocalAuth, message: 'Please enter your password' }]}
                                    style={{ marginBottom: 12 }}
                                >
                                    <Input.Password
                                        prefix={<KeyOutlined />}
                                        placeholder={isLocalAuth ? "Enter password" : "Managed by LDAP"}
                                    />
                                </Form.Item>
                                {isLocalAuth && (
                                    <Form.Item style={{ marginBottom: 0 }}>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={mutate.isPending}
                                            block
                                            style={{
                                                background: 'var(--gradient-primary)',
                                                border: 'none'
                                            }}
                                        >
                                            Update Email
                                        </Button>
                                    </Form.Item>
                                )}
                            </Form>
                        </Space>
                    </div>
                </Col>

                {/* Change Password Box */}
                <Col xs={24} lg={12}>
                    <div style={{
                        background: 'var(--card-bg)',
                        padding: '24px',
                        borderRadius: '12px',
                        border: '1px solid var(--border-default)'
                    }}>
                        <Space direction="vertical" style={{ width: '100%' }} size="middle">
                            <Space>
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '8px',
                                    background: 'linear-gradient(135deg, #fa8c16 0%, #faad14 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <LockOutlined style={{ color: 'white', fontSize: '18px' }} />
                                </div>
                                <div>
                                    <Text style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                                        Change Password
                                    </Text>
                                    <br />
                                    <Text style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                        Update your password
                                    </Text>
                                </div>
                            </Space>

                            <Divider style={{ margin: '8px 0' }} />

                            {!isLocalAuth && (
                                <Alert
                                    message="LDAP Authentication"
                                    description="Password is managed by LDAP server."
                                    type="info"
                                    showIcon
                                    style={{ fontSize: 12 }}
                                />
                            )}
                            <Form
                                form={passwordForm}
                                layout="vertical"
                                onFinish={handleUpdatePassword}
                                disabled={!isLocalAuth}
                            >
                                <Form.Item
                                    label={<span style={{ fontSize: 13 }}>Current Password</span>}
                                    name="current_password"
                                    rules={[{ required: isLocalAuth, message: 'Please enter current password' }]}
                                    style={{ marginBottom: 12 }}
                                >
                                    <Input.Password
                                        prefix={<KeyOutlined />}
                                        placeholder={isLocalAuth ? "Enter current password" : "Managed by LDAP"}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={<span style={{ fontSize: 13 }}>New Password</span>}
                                    name="new_password"
                                    hasFeedback
                                    rules={[
                                        { required: isLocalAuth, message: 'Please enter new password' },
                                        () => ({
                                            validator(_, value) {
                                                if (!value && !isLocalAuth) {
                                                    return Promise.resolve();
                                                }

                                                if (value) {
                                                    // Minimum 12 characters
                                                    if (value.length < 12) {
                                                        return Promise.reject(new Error('Password must be at least 12 characters long.'));
                                                    }

                                                    // Require uppercase
                                                    if (!/[A-Z]/.test(value)) {
                                                        return Promise.reject(new Error('Password must contain at least one uppercase letter.'));
                                                    }

                                                    // Require lowercase
                                                    if (!/[a-z]/.test(value)) {
                                                        return Promise.reject(new Error('Password must contain at least one lowercase letter.'));
                                                    }

                                                    // Require numbers
                                                    if (!/\d/.test(value)) {
                                                        return Promise.reject(new Error('Password must contain at least one number.'));
                                                    }

                                                    // Require at least 1 special character
                                                    const specialChars = /[@$!%*?&]/.test(value);
                                                    const specialCharCount = (value.match(/[@$!%*?&]/g) || []).length;
                                                    if (!specialChars || specialCharCount < 1) {
                                                        return Promise.reject(new Error('Password must contain at least 1 special character (@$!%*?&).'));
                                                    }
                                                }
                                                return Promise.resolve();
                                            },
                                        }),
                                    ]}
                                    style={{ marginBottom: 12 }}
                                >
                                    <Input.Password
                                        prefix={<KeyOutlined />}
                                        placeholder={isLocalAuth ? "Min 12 chars, 1 uppercase, 1 lowercase, 1 number, 1 special (@$!%*?&)" : "Managed by LDAP"}
                                    />
                                </Form.Item>
                                {isLocalAuth && (
                                    <Form.Item style={{ marginBottom: 0 }}>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={mutate.isPending}
                                            block
                                            style={{
                                                background: 'var(--gradient-primary)',
                                                border: 'none'
                                            }}
                                        >
                                            Change Password
                                        </Button>
                                    </Form.Item>
                                )}
                            </Form>
                        </Space>
                    </div>
                </Col>
            </Row>

            {/* OTP Setup Modal */}
            <OTPSetupModal
                visible={showOTPSetup}
                onComplete={handleOTPSetupComplete}
                onCancel={() => setShowOTPSetup(false)}
                username={userDetail?.username}
            />

            {/* Disable OTP Modal */}
            <Modal
                title="Disable Two-Factor Authentication"
                open={showDisableOTP}
                onCancel={() => {
                    setShowDisableOTP(false);
                    disableOTPForm.resetFields();
                }}
                footer={null}
                width={500}
            >
                <Alert
                    message="Warning"
                    description="Disabling 2FA will make your account less secure. You'll need to provide your password and an OTP code or backup code."
                    type="warning"
                    showIcon
                    style={{ marginBottom: 16, fontSize: 12 }}
                />
                <Form
                    form={disableOTPForm}
                    layout="vertical"
                    onFinish={handleDisableOTP}
                >
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please enter your password' }]}
                    >
                        <Input.Password prefix={<KeyOutlined />} placeholder="Enter password" />
                    </Form.Item>
                    <Divider>Verify with OTP or Backup Code</Divider>
                    <Form.Item
                        label="OTP Code (from authenticator app)"
                        name="otp_code"
                    >
                        <Input placeholder="Enter 6-digit code" maxLength={6} />
                    </Form.Item>
                    <Text type="secondary" style={{ display: 'block', textAlign: 'center', margin: '8px 0', fontSize: 12 }}>
                        OR
                    </Text>
                    <Form.Item
                        label="Backup Code"
                        name="backup_code"
                    >
                        <Input placeholder="Enter backup code" maxLength={8} />
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button onClick={() => {
                                setShowDisableOTP(false);
                                disableOTPForm.resetFields();
                            }}>
                                Cancel
                            </Button>
                            <Button
                                danger
                                type="primary"
                                htmlType="submit"
                                loading={otpLoading}
                            >
                                Disable 2FA
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Regenerate Backup Codes Modal */}
            <Modal
                title="Regenerate Backup Codes"
                open={showRegenerateBackup}
                onCancel={() => {
                    setShowRegenerateBackup(false);
                    setNewBackupCodes(null);
                    regenerateForm.resetFields();
                }}
                footer={null}
                width={600}
            >
                {!newBackupCodes ? (
                    <>
                        <Alert
                            message="Warning"
                            description="Regenerating backup codes will invalidate all your existing codes. Make sure you have access to your authenticator app."
                            type="warning"
                            showIcon
                            style={{ marginBottom: 16, fontSize: 12 }}
                        />
                        <Form
                            form={regenerateForm}
                            layout="vertical"
                            onFinish={handleRegenerateBackupCodes}
                        >
                            <Form.Item
                                label="Enter OTP Code to Confirm"
                                name="otp_code"
                                rules={[{ required: true, message: 'Please enter OTP code' }]}
                            >
                                <Input placeholder="Enter 6-digit code from authenticator" maxLength={6} />
                            </Form.Item>
                            <Form.Item>
                                <Space>
                                    <Button onClick={() => {
                                        setShowRegenerateBackup(false);
                                        regenerateForm.resetFields();
                                    }}>
                                        Cancel
                                    </Button>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={otpLoading}
                                        style={{
                                            background: 'var(--gradient-primary)',
                                            border: 'none'
                                        }}
                                    >
                                        Regenerate Codes
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </>
                ) : (
                    <>
                        <BackupCodesDisplay codes={newBackupCodes} username={userDetail?.username} />
                        <div style={{ textAlign: 'center', marginTop: 16 }}>
                            <Button
                                type="primary"
                                onClick={() => {
                                    setShowRegenerateBackup(false);
                                    setNewBackupCodes(null);
                                    refetchOTPStatus();
                                }}
                                style={{
                                    background: 'var(--gradient-primary)',
                                    border: 'none'
                                }}
                            >
                                Done
                            </Button>
                        </div>
                    </>
                )}
            </Modal>
        </div>
    );
};

export default Profile;
