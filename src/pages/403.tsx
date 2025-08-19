import React from 'react';
import { Button, Typography, Space } from 'antd';
import { LockOutlined, HomeOutlined, ContactsOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const Err403: React.FC = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    const handleGoBack = () => {
        window.history.back();
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
        }}>
            <div style={{
                borderRadius: '16px',
                padding: '48px',
                textAlign: 'center',
                maxWidth: '600px',
                width: '100%'
            }}>
                {/* Animated Lock Icon */}
                <div style={{
                    marginBottom: '24px',
                    position: 'relative'
                }}>
                    <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                        animation: 'pulse 2s infinite',
                        boxShadow: '0 10px 30px rgba(255, 107, 107, 0.3)'
                    }}>
                        <LockOutlined style={{ 
                            fontSize: '60px', 
                            color: 'white'
                        }} />
                    </div>
                </div>

                {/* Error Code */}
                <Title level={1} style={{
                    fontSize: '72px',
                    margin: '0 0 16px 0',
                    background: 'linear-gradient(90deg, #056ccd 0%, #00c6fb 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontWeight: 'bold'
                }}>
                    403
                </Title>

                {/* Main Message */}
                <Title level={2} style={{
                    color: '#2c3e50',
                    marginBottom: '16px',
                    fontSize: '32px',
                    fontWeight: '600'
                }}>
                    Access Denied
                </Title>

                {/* Description */}
                <Text style={{
                    color: '#7f8c8d',
                    fontSize: '16px',
                    lineHeight: '1.6',
                    display: 'block',
                    marginBottom: '32px',
                    maxWidth: '400px',
                    margin: '0 auto 32px auto'
                }}>
                    Sorry, you don't have permission to access this resource. 
                    Please contact your administrator if you believe this is an error.
                </Text>

                {/* Action Buttons */}
                <Space size="large" style={{ marginTop: '24px' }}>
                    <Button
                        type="primary"
                        size="large"
                        icon={<HomeOutlined />}
                        onClick={handleGoHome}
                        style={{
                            height: '48px',
                            padding: '0 24px',
                            borderRadius: '8px',
                            background: 'linear-gradient(90deg, #056ccd 0%, #00c6fb 100%)',
                            border: 'none',
                            fontSize: '16px',
                            fontWeight: '500',
                            boxShadow: '0 4px 12px rgba(5, 108, 205, 0.3)'
                        }}
                    >
                        Go Home
                    </Button>
                    
                    <Button
                        size="large"
                        onClick={handleGoBack}
                        style={{
                            height: '48px',
                            padding: '0 24px',
                            borderRadius: '8px',
                            border: '2px solid #e9ecef',
                            fontSize: '16px',
                            fontWeight: '500'
                        }}
                    >
                        Go Back
                    </Button>
                </Space>

                {/* Help Text */}
                <div style={{
                    marginTop: '40px',
                    padding: '20px',
                    background: '#f8f9fa',
                    borderRadius: '12px',
                    border: '1px solid #e9ecef'
                }}>
                    <Space align="center">
                        <ContactsOutlined style={{ color: '#6c757d', fontSize: '18px' }} />
                        <Text style={{ color: '#6c757d', fontSize: '14px' }}>
                            Need help? Contact your system administrator for access permissions.
                        </Text>
                    </Space>
                </div>
            </div>

            {/* CSS Animation */}
            <style>{`
                @keyframes pulse {
                    0% {
                        transform: scale(1);
                        box-shadow: 0 10px 30px rgba(255, 107, 107, 0.3);
                    }
                    50% {
                        transform: scale(1.05);
                        box-shadow: 0 15px 40px rgba(255, 107, 107, 0.4);
                    }
                    100% {
                        transform: scale(1);
                        box-shadow: 0 10px 30px rgba(255, 107, 107, 0.3);
                    }
                }
            `}</style>
        </div>
    );
};

export default Err403;