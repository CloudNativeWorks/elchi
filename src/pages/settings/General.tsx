import React from 'react';
import { Card, Typography, Tag, Space, Row, Col, Divider, Segmented } from 'antd';
import { CloudServerOutlined, SunOutlined, MoonOutlined, DesktopOutlined } from '@ant-design/icons';
import { getVersionAntdColor } from '@/utils/versionColors';
import { useTheme, ThemeMode } from '@/contexts/ThemeContext';

const { Text, Title } = Typography;

const General: React.FC = () => {
    const { mode, setMode, isDark } = useTheme();
    const appInfo = {
        name: 'Elchi',
        version: window.APP_CONFIG.VERSION,
        apiVersion: 'v3',
        supportedEnvoyVersions: window.APP_CONFIG.AVAILABLE_VERSIONS,
    };

    return (
        <div style={{ width: '100%', padding: '12px' }}>
            <div style={{ marginBottom: '24px' }}>
                <Title level={3} style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>
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
                            background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-accent) 100%)',
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
                                    background: 'var(--header-icon-bg, rgba(255, 255, 255, 0.2))',
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
                                    <Text style={{ color: 'var(--text-on-gradient, rgba(255,255,255,0.9))', fontSize: '14px' }}>
                                        Proxy Management Platform
                                    </Text>
                                </div>
                            </Space>
                            
                            <Divider style={{ borderColor: 'var(--header-divider, rgba(255,255,255,0.3))', margin: '12px 0' }} />
                            
                            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ color: 'var(--text-on-gradient, rgba(255,255,255,0.9))', fontSize: '14px' }}>
                                        Application Version
                                    </Text>
                                    <Tag 
                                        color="success" 
                                        style={{ 
                                            fontSize: '12px', 
                                            fontWeight: 'bold',
                                            border: 'none',
                                            background: 'var(--tag-on-gradient, rgba(255,255,255,0.9))',
                                            color: 'var(--color-primary)'
                                        }}
                                    >
                                        {appInfo.version}
                                    </Tag>
                                </div>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ color: 'var(--text-on-gradient, rgba(255,255,255,0.9))', fontSize: '14px' }}>
                                        API Version
                                    </Text>
                                    <Tag 
                                        color="processing" 
                                        style={{ 
                                            fontSize: '12px', 
                                            fontWeight: 'bold',
                                            border: 'none',
                                            background: 'var(--tag-on-gradient, rgba(255,255,255,0.9))',
                                            color: 'var(--color-accent)'
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
                            border: '1px solid var(--border-default)',
                            background: 'var(--card-bg)',
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
                                    background: 'linear-gradient(135deg, var(--color-success) 0%, #389e0d 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <CloudServerOutlined style={{ color: 'white', fontSize: '20px' }} />
                                </div>
                                <div>
                                    <Text style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
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
                                {appInfo.supportedEnvoyVersions.map((version) => (
                                    <Tag 
                                        key={version}
                                        color={getVersionAntdColor(version)}
                                        style={{ 
                                            fontSize: '11px',
                                            fontWeight: '500',
                                            margin: 0,
                                            borderRadius: '6px',
                                        }}
                                    >
                                        {version}
                                    </Tag>
                                ))}
                            </div>
                            
                            <div style={{
                                marginTop: '8px',
                                padding: '8px 12px',
                                background: 'var(--color-success-light)',
                                borderRadius: '6px',
                                border: '1px solid var(--color-success)'
                            }}>
                                <Text style={{ fontSize: '12px', color: 'var(--color-success)', fontWeight: '500' }}>
                                    Total: {appInfo.supportedEnvoyVersions.length} versions supported
                                </Text>
                            </div>
                        </Space>
                    </Card>
                </Col>

                {/* Theme/Appearance Card */}
                <Col xs={24} lg={12}>
                    <Card
                        style={{
                            borderRadius: '12px',
                            border: '1px solid var(--border-default)',
                            background: 'var(--card-bg)',
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
                                    background: isDark
                                        ? 'linear-gradient(135deg, var(--color-primary) 0%, #1d4ed8 100%)'
                                        : 'linear-gradient(135deg, var(--color-warning) 0%, #d97706 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {isDark ? <MoonOutlined style={{ color: 'white', fontSize: '20px' }} />
                                        : <SunOutlined style={{ color: 'white', fontSize: '20px' }} />}
                                </div>
                                <div>
                                    <Text style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                                        Appearance
                                    </Text>
                                    <br />
                                    <Text type="secondary" style={{ fontSize: '14px' }}>
                                        Customize the application theme
                                    </Text>
                                </div>
                            </Space>

                            <Divider style={{ margin: '12px 0' }} />

                            <div>
                                <Text style={{ color: 'var(--text-secondary)', marginBottom: '12px', display: 'block' }}>
                                    Theme Mode
                                </Text>
                                <Segmented
                                    value={mode}
                                    onChange={(value) => setMode(value as ThemeMode)}
                                    options={[
                                        { value: 'light', icon: <SunOutlined />, label: 'Light' },
                                        { value: 'dark', icon: <MoonOutlined />, label: 'Dark' },
                                        { value: 'system', icon: <DesktopOutlined />, label: 'System' },
                                    ]}
                                    block
                                />
                            </div>

                            <div style={{
                                marginTop: '8px',
                                padding: '8px 12px',
                                background: 'var(--bg-hover)',
                                borderRadius: '6px',
                                border: '1px solid var(--border-default)'
                            }}>
                                <Text style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                    {mode === 'system'
                                        ? `Following system preference (currently ${isDark ? 'dark' : 'light'})`
                                        : `${mode.charAt(0).toUpperCase() + mode.slice(1)} mode active`}
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