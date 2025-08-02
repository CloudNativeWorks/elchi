import React from 'react';
import { Card, Typography, Tag, Space, Row, Col, Divider } from 'antd';
import { CloudServerOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

const General: React.FC = () => {
    const appInfo = {
        name: 'Elchi',
        version: window.APP_CONFIG.VERSION,
        apiVersion: 'v3',
        supportedEnvoyVersions: window.APP_CONFIG.AVAILABLE_VERSIONS,
    };

    return (
        <div style={{ width: '100%', padding: '12px' }}>
            <div style={{ marginBottom: '24px' }}>
                <Title level={3} style={{ margin: '0 0 8px 0', color: '#1f2937' }}>
                    General Information
                </Title>
                <Text type="secondary">Application details and configuration</Text>
            </div>

            <Row gutter={[24, 24]}>
                {/* Application Info Card */}
                <Col xs={24} lg={12}>
                    <Card
                        style={{
                            borderRadius: '12px',
                            background: 'linear-gradient(90deg, #056ccd 0%, #00c6fb 100%)',
                            border: 'none',
                            color: 'white',
                            height: '100%'
                        }}
                        styles={{ body: { padding: '24px' } }}
                    >
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <Space>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <img 
                                        src="/favicon.ico" 
                                        alt="Elchi Logo" 
                                        style={{ 
                                            width: '24px', 
                                            height: '24px'
                                        }} 
                                    />
                                </div>
                                <div>
                                    <Text style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>
                                        {appInfo.name}
                                    </Text>
                                    <br />
                                    <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>
                                        Proxy Management Platform
                                    </Text>
                                </div>
                            </Space>
                            
                            <Divider style={{ borderColor: 'rgba(255,255,255,0.3)', margin: '12px 0' }} />
                            
                            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>
                                        Application Version
                                    </Text>
                                    <Tag 
                                        color="success" 
                                        style={{ 
                                            fontSize: '12px', 
                                            fontWeight: 'bold',
                                            border: 'none',
                                            background: 'rgba(255,255,255,0.9)',
                                            color: '#056ccd'
                                        }}
                                    >
                                        {appInfo.version}
                                    </Tag>
                                </div>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>
                                        API Version
                                    </Text>
                                    <Tag 
                                        color="processing" 
                                        style={{ 
                                            fontSize: '12px', 
                                            fontWeight: 'bold',
                                            border: 'none',
                                            background: 'rgba(255,255,255,0.9)',
                                            color: '#00c6fb'
                                        }}
                                    >
                                        {appInfo.apiVersion}
                                    </Tag>
                                </div>
                            </Space>
                        </Space>
                    </Card>
                </Col>

                {/* Envoy Versions Card */}
                <Col xs={24} lg={12}>
                    <Card
                        style={{
                            borderRadius: '12px',
                            border: '1px solid #e1e5e9',
                            height: '100%'
                        }}
                        styles={{ body: { padding: '24px' } }}
                    >
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <Space>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <CloudServerOutlined style={{ color: 'white', fontSize: '20px' }} />
                                </div>
                                <div>
                                    <Text style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937' }}>
                                        Supported Envoy Versions
                                    </Text>
                                    <br />
                                    <Text type="secondary" style={{ fontSize: '14px' }}>
                                        Compatible proxy server versions
                                    </Text>
                                </div>
                            </Space>
                            
                            <Divider style={{ margin: '12px 0' }} />
                            
                            <div style={{ 
                                display: 'flex', 
                                flexWrap: 'wrap', 
                                gap: '8px',
                                maxHeight: '120px',
                                overflowY: 'auto',
                                padding: '4px'
                            }}>
                                {appInfo.supportedEnvoyVersions.map((version, index) => (
                                    <Tag 
                                        key={version}
                                        color="cyan"
                                        style={{ 
                                            fontSize: '11px',
                                            fontWeight: '500',
                                            margin: 0,
                                            borderRadius: '6px',
                                            background: 'linear-gradient(135deg, #e6fffb 0%, #b5f5ec 100%)',
                                            border: '1px solid #87e8de',
                                            color: '#006d75'
                                        }}
                                    >
                                        {version}
                                    </Tag>
                                ))}
                            </div>
                            
                            <div style={{ 
                                marginTop: '8px',
                                padding: '8px 12px',
                                background: '#f6ffed',
                                borderRadius: '6px',
                                border: '1px solid #b7eb8f'
                            }}>
                                <Text style={{ fontSize: '12px', color: '#52c41a', fontWeight: '500' }}>
                                    Total: {appInfo.supportedEnvoyVersions.length} versions supported
                                </Text>
                            </div>
                        </Space>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default General;