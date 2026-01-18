import React, { useState } from 'react';
import { Input, Button, Space, Typography } from 'antd';
import { KeyOutlined, SwapOutlined } from '@ant-design/icons';

const { Text, Link } = Typography;

interface OTPInputFieldProps {
    onSubmit: (code: string) => void;
    loading?: boolean;
    allowBackupCode?: boolean;
}

export const OTPInputField: React.FC<OTPInputFieldProps> = ({
    onSubmit,
    loading = false,
    allowBackupCode = true
}) => {
    const [useBackupCode, setUseBackupCode] = useState(false);
    const [otpValue, setOtpValue] = useState('');
    const [backupCode, setBackupCode] = useState('');

    const handleSubmit = () => {
        const code = useBackupCode ? backupCode : otpValue;
        if (code) {
            onSubmit(code);
        }
    };

    const toggleMode = () => {
        setUseBackupCode(!useBackupCode);
        setOtpValue('');
        setBackupCode('');
    };

    return (
        <Space direction="vertical" style={{ width: '100%', alignItems: 'center' }} size="middle">
            {!useBackupCode ? (
                <>
                    <div
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && otpValue.length === 6) {
                                handleSubmit();
                            }
                        }}
                        style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                    >
                        <style dangerouslySetInnerHTML={{
                            __html: `
                            .custom-otp-input input.ant-input.ant-otp-input,
                            .custom-otp-input input.ant-input-lg.ant-otp-input,
                            input.ant-input.ant-otp-input,
                            input.ant-input-lg.ant-otp-input,
                            .ant-input-otp input[class*="ant-input"],
                            .custom-otp-input input[class*="ant-input"] {
                                width: 48px !important;
                                min-width: 48px !important;
                                max-width: 48px !important;
                                height: 52px !important;
                                min-height: 52px !important;
                                max-height: 52px !important;
                                font-size: 26px !important;
                                font-weight: 600 !important;
                                border: 1.5px solid var(--border-default) !important;
                                border-radius: 8px !important;
                                text-align: center !important;
                                transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
                                background: var(--input-bg) !important;
                                color: var(--text-primary) !important;
                                line-height: 48px !important;
                                padding: 0 !important;
                                margin: 0 4px !important;
                                box-shadow: var(--shadow-sm) !important;
                            }
                            .custom-otp-input input.ant-input.ant-otp-input:hover,
                            input.ant-input.ant-otp-input:hover,
                            .ant-input-otp input[class*="ant-input"]:hover {
                                border-color: var(--color-primary) !important;
                                transform: translateY(-1px) !important;
                                box-shadow: 0 4px 8px var(--shadow-primary) !important;
                            }
                            .custom-otp-input input.ant-input.ant-otp-input:focus,
                            input.ant-input.ant-otp-input:focus,
                            .ant-input-otp input[class*="ant-input"]:focus,
                            .ant-input-otp input[class*="ant-input"]:focus-within {
                                border-color: var(--color-primary) !important;
                                border-width: 2px !important;
                                box-shadow: 0 0 0 3px var(--shadow-primary), 0 4px 12px var(--shadow-primary) !important;
                                outline: none !important;
                                transform: translateY(-2px) scale(1.02) !important;
                            }
                            .custom-otp-input input.ant-input.ant-otp-input:disabled,
                            input.ant-input.ant-otp-input:disabled,
                            .ant-input-otp input[class*="ant-input"]:disabled {
                                background: var(--bg-disabled) !important;
                                border-color: var(--border-default) !important;
                                opacity: 0.6 !important;
                                cursor: not-allowed !important;
                                transform: none !important;
                            }
                            .custom-otp-input,
                            .custom-otp-input.ant-input-otp,
                            div.ant-input-otp,
                            span.ant-input-otp {
                                gap: 8px !important;
                            }
                        ` }} />
                        <Input.OTP
                            length={6}
                            value={otpValue}
                            onChange={setOtpValue}
                            size="large"
                            disabled={loading}
                            className="custom-otp-input"
                            style={{
                                maxWidth: '370px',
                                width: '100%',
                                gap: '8px'
                            }}
                            formatter={(str) => str.toUpperCase()}
                        />
                    </div>
                </>
            ) : (
                <>
                    <Text type="secondary" style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>
                        Enter one of your backup codes
                    </Text>
                    <Input
                        prefix={<KeyOutlined style={{ color: 'var(--color-primary)', fontSize: 18 }} />}
                        placeholder="XXXX-XXXX"
                        value={backupCode}
                        onChange={(e) => setBackupCode(e.target.value.toUpperCase())}
                        size="large"
                        disabled={loading}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && backupCode) {
                                handleSubmit();
                            }
                        }}
                        maxLength={8}
                        style={{
                            textTransform: 'uppercase',
                            fontSize: 18,
                            fontWeight: 600,
                            letterSpacing: 2,
                            textAlign: 'center',
                            height: 52,
                            borderRadius: 8,
                            border: '1.5px solid var(--border-default)',
                            background: 'var(--card-bg)',
                            boxShadow: 'var(--shadow-sm)'
                        }}
                    />
                </>
            )}

            <Button
                type="primary"
                onClick={handleSubmit}
                loading={loading}
                disabled={useBackupCode ? !backupCode : otpValue.length !== 6}
                size="large"
                block
                style={{
                    marginTop: 16,
                    height: 48,
                    fontSize: 16,
                    fontWeight: 600,
                    borderRadius: 8,
                    background: 'var(--gradient-primary)',
                    border: 'none',
                    boxShadow: '0 2px 4px var(--shadow-primary)'
                }}
            >
                Verify
            </Button>

            {allowBackupCode && (
                <div style={{ textAlign: 'center', marginTop: 8 }}>
                    <Link
                        onClick={toggleMode}
                        disabled={loading}
                        style={{ fontSize: 13 }}
                    >
                        <SwapOutlined style={{ marginRight: 4 }} />
                        {useBackupCode ? 'Use authenticator code' : 'Use backup code instead'}
                    </Link>
                </div>
            )}
        </Space>
    );
};
