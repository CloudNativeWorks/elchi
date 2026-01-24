import React, { useState } from 'react';
import { Card, Typography, Space, Button, Input, Divider, message } from 'antd';
import { QrcodeOutlined, CopyOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

const { Text, Title, Paragraph } = Typography;

interface QRCodeDisplayProps {
    qrCode: string;  // Base64 encoded PNG
    secret: string;  // TOTP secret for manual entry
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ qrCode, secret }) => {
    const [showSecret, setShowSecret] = useState(false);

    const copySecret = () => {
        navigator.clipboard.writeText(secret);
        message.success('Secret copied to clipboard');
    };

    return (
        <Card
            style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border-default)',
                borderRadius: 12
            }}
        >
            <Space direction="vertical" align="center" style={{ width: '100%' }} size="large">
                <div style={{ textAlign: 'center' }}>
                    <QrcodeOutlined style={{ fontSize: 24, color: 'var(--color-primary)', marginBottom: 8 }} />
                    <Title level={4} style={{ margin: 0 }}>Scan QR Code</Title>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                        Use Google Authenticator, Authy, or any TOTP app
                    </Text>
                </div>

                <div
                    style={{
                        padding: 16,
                        background: 'var(--card-bg)',
                        borderRadius: 12,
                        border: '2px solid var(--border-default)',
                        display: 'inline-block'
                    }}
                >
                    <img
                        src={`data:image/png;base64,${qrCode}`}
                        alt="QR Code for 2FA"
                        style={{ display: 'block', width: 200, height: 200 }}
                    />
                </div>

                <Divider style={{ margin: '12px 0' }}>or</Divider>

                <div style={{ width: '100%' }}>
                    <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 8 }}>
                        Manual Entry (if QR scan fails):
                    </Text>
                    <Space.Compact style={{ width: '100%' }}>
                        <Input
                            value={showSecret ? secret : '••••••••••••••••'}
                            readOnly
                            style={{ flex: 1, fontFamily: 'monospace', fontSize: 13 }}
                        />
                        <Button
                            icon={showSecret ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                            onClick={() => setShowSecret(!showSecret)}
                        />
                        <Button
                            icon={<CopyOutlined />}
                            onClick={copySecret}
                        >
                            Copy
                        </Button>
                    </Space.Compact>
                    <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 6 }}>
                        Enter this code manually in your authenticator app
                    </Text>
                </div>

                <Paragraph
                    style={{
                        background: 'var(--color-warning-light)',
                        border: '1px solid var(--color-warning-border)',
                        color: 'var(--text-primary)',
                        borderRadius: 8,
                        padding: 12,
                        margin: '8px 0 0 0',
                        fontSize: 12
                    }}
                >
                    <strong style={{ color: 'var(--color-warning)' }}>Important:</strong> Keep your secret key safe. Don't share it with anyone.
                </Paragraph>
            </Space>
        </Card>
    );
};
