import React from 'react';
import { Card, Row, Col, Typography, Tag, Divider, Space } from 'antd';

const { Text, Paragraph } = Typography;

const General: React.FC = () => {
    const appInfo = {
        name: 'Elchi',
        version: '0.1.0',
        buildDate: '2024-01-15',
        environment: 'Production',
        apiVersion: 'v3',
        nodeVersion: '20.x',
        description: 'Cloud Native Configuration Management Platform'
    };

    return (
        <div style={{
            background: '#fff',
            padding: '12px 12px 24px 12px',
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(5,117,230,0.06)',
            margin: '4px 0'
        }}>

            <Row gutter={[24, 24]}>
                {/* Uygulama Bilgileri */}
                <Col xs={24} md={12}>
                    <Card 
                        title={
                            <Space>
                                Application Information
                            </Space>
                        }
                        size="small"
                        style={{ height: '100%' }}
                    >
                        <Space direction="vertical" style={{ width: '100%' }} size="middle">
                            <div>
                                <Text strong>Application Name:</Text>
                                <br />
                                <Text>{appInfo.name}</Text>
                            </div>
                            
                            <div>
                                <Text strong>Version:</Text>
                                <br />
                                <Tag className='auto-width-tag' color="blue">{appInfo.version}</Tag>
                            </div>
                            
                            <div>
                                <Text strong>Environment:</Text>
                                <br />
                                <Tag className='auto-width-tag' color={appInfo.environment === 'Production' ? 'green' : 'orange'}>
                                    {appInfo.environment}
                                </Tag>
                            </div>
                        </Space>
                    </Card>
                </Col>

                {/* Sistem Bilgileri */}
                <Col xs={24} md={12}>
                    <Card 
                        title={
                            <Space>
                                System Information
                            </Space>
                        }
                        size="small"
                        style={{ height: '100%' }}
                    >
                        <Space direction="vertical" style={{ width: '100%' }} size="middle">
                            <div>
                                <Text strong>API Version:</Text>
                                <br />
                                <Tag className='auto-width-tag' color="purple">{appInfo.apiVersion}</Tag>
                            </div>
                            
                            <div>
                                <Text strong>Node.js Version:</Text>
                                <br />
                                <Text>{appInfo.nodeVersion}</Text>
                            </div>
                            
                            <div>
                                <Text strong>Supported Envoy Versions:</Text>
                                <br />
                                <Space>
                                    <Tag color="cyan">v1.33.5</Tag>
                                    <Tag color="cyan">v1.34.2</Tag>
                                </Space>
                            </div>
                        </Space>
                    </Card>
                </Col>
            </Row>

            <Divider />

            {/* Açıklama */}
            <Card 
                title={
                    <Space>
                        About Application
                    </Space>
                }
                size="small"
            >
                <Paragraph>
                    <Text>{appInfo.description}</Text>
                </Paragraph>
                <Paragraph>
                    Elchi is a modern web application for managing Envoy proxy configurations. It provides a user-friendly interface for creating and managing complex network configurations.
                </Paragraph>
                
                <div style={{ marginTop: 16 }}>
                    <Text strong>Features:</Text>
                    <ul style={{ marginTop: 8, marginLeft: 16 }}>
                        <li>Visual configuration editor</li>
                        <li>Multi-Envoy version support</li>
                        <li>Real-time validation</li>
                        <li>User and group management</li>
                        <li>Project-based organization</li>
                    </ul>
                </div>
            </Card>
        </div>
    );
};

export default General; 