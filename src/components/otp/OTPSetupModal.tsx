import React, { useState } from 'react';
import { Modal, Steps, Button, Form, Input, Space, Result } from 'antd';
import { KeyOutlined, QrcodeOutlined, SafetyOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useOTP, OTPEnableResponse } from '@/hooks/useOTP';
import { QRCodeDisplay } from './QRCodeDisplay';
import { BackupCodesDisplay } from './BackupCodesDisplay';
import { OTPInputField } from './OTPInputField';

interface OTPSetupModalProps {
    visible: boolean;
    onComplete: () => void;
    onCancel: () => void;
    username?: string;
}

type SetupStep = 'password' | 'qr-display' | 'verify' | 'complete';

export const OTPSetupModal: React.FC<OTPSetupModalProps> = ({
    visible,
    onComplete,
    onCancel,
    username
}) => {
    const [currentStep, setCurrentStep] = useState<SetupStep>('password');
    const [password, setPassword] = useState('');
    const [otpData, setOtpData] = useState<OTPEnableResponse | null>(null);
    const { enableOTP, verifyOTP, isLoading } = useOTP();
    const [form] = Form.useForm();

    const handlePasswordSubmit = async () => {
        try {
            const values = await form.validateFields();
            const response = await enableOTP(values.password);
            setOtpData(response);
            setPassword(values.password);
            setCurrentStep('qr-display');
        } catch (error) {
            // Error handled in hook
        }
    };

    const handleNext = () => {
        if (currentStep === 'qr-display') {
            setCurrentStep('verify');
        }
    };

    const handleVerify = async (otpCode: string) => {
        try {
            await verifyOTP(otpCode);
            setCurrentStep('complete');
        } catch (error) {
            // Error handled in hook
        }
    };

    const handleComplete = () => {
        setCurrentStep('password');
        setPassword('');
        setOtpData(null);
        form.resetFields();
        onComplete();
    };

    const handleModalCancel = () => {
        if (currentStep === 'complete') {
            handleComplete();
        } else {
            setCurrentStep('password');
            setPassword('');
            setOtpData(null);
            form.resetFields();
            onCancel();
        }
    };

    const steps = [
        {
            title: 'Password',
            icon: <KeyOutlined />
        },
        {
            title: 'Scan QR',
            icon: <QrcodeOutlined />
        },
        {
            title: 'Verify',
            icon: <SafetyOutlined />
        }
    ];

    const getCurrentStepIndex = () => {
        switch (currentStep) {
            case 'password':
                return 0;
            case 'qr-display':
                return 1;
            case 'verify':
            case 'complete':
                return 2;
            default:
                return 0;
        }
    };

    return (
        <Modal
            title="Enable Two-Factor Authentication (2FA)"
            open={visible}
            onCancel={handleModalCancel}
            footer={null}
            width={600}
            destroyOnHidden
            maskClosable={false}
        >
            {currentStep !== 'complete' && (
                <Steps
                    current={getCurrentStepIndex()}
                    items={steps}
                    style={{ marginBottom: 32 }}
                    size="small"
                />
            )}

            {/* Step 1: Password */}
            {currentStep === 'password' && (
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handlePasswordSubmit}
                >
                    <Form.Item
                        label="Confirm Your Password"
                        name="password"
                        rules={[{ required: true, message: 'Please enter your password' }]}
                    >
                        <Input.Password
                            prefix={<KeyOutlined />}
                            placeholder="Enter your current password"
                            size="large"
                            autoFocus
                        />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0 }}>
                        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                            <Button onClick={onCancel}>
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isLoading}
                                style={{
                                    background: 'var(--gradient-primary)',
                                    border: 'none'
                                }}
                            >
                                Continue
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            )}

            {/* Step 2: QR Code Display */}
            {currentStep === 'qr-display' && otpData && (
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                    <QRCodeDisplay qrCode={otpData.qr_code} secret={otpData.secret} />
                    <BackupCodesDisplay codes={otpData.backup_codes} username={username} />

                    <div style={{ textAlign: 'right' }}>
                        <Button
                            type="primary"
                            onClick={handleNext}
                            size="large"
                            style={{
                                background: 'var(--gradient-primary)',
                                border: 'none'
                            }}
                        >
                            I've Saved My Codes, Continue
                        </Button>
                    </div>
                </Space>
            )}

            {/* Step 3: Verify OTP */}
            {currentStep === 'verify' && (
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                    <div style={{ textAlign: 'center' }}>
                        <SafetyOutlined style={{ fontSize: 48, color: 'var(--color-primary)', marginBottom: 16 }} />
                        <h3>Verify Your Setup</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            Open your authenticator app and enter the 6-digit code to complete setup
                        </p>
                    </div>

                    <OTPInputField
                        onSubmit={handleVerify}
                        loading={isLoading}
                        allowBackupCode={false}
                    />
                </Space>
            )}

            {/* Step 4: Complete */}
            {currentStep === 'complete' && (
                <Result
                    status="success"
                    icon={<CheckCircleOutlined style={{ color: 'var(--color-success)' }} />}
                    title="2FA Enabled Successfully!"
                    subTitle="Your account is now protected with two-factor authentication. You'll need your authenticator app to login from now on."
                    extra={[
                        <Button
                            type="primary"
                            key="done"
                            onClick={handleComplete}
                            size="large"
                            style={{
                                background: 'var(--gradient-primary)',
                                border: 'none'
                            }}
                        >
                            Done
                        </Button>
                    ]}
                />
            )}
        </Modal>
    );
};
