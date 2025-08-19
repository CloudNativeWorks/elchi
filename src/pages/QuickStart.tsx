import React from "react";
import { Card, Typography, Button, Space } from "antd";
import { NavLink } from "react-router-dom";
import { useCustomGetQuery } from "@/common/api";
import { useProjectVariable } from "@/hooks/useProjectVariable";
import { 
    RocketOutlined,
    SettingOutlined,
    PlayCircleOutlined,
    ArrowRightOutlined,
    FileTextOutlined,
    PlusOutlined,
    ToolOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

export interface ResourceTemplate {
    id?: string;
    name: string;
    scenario_id?: string;
    description: string;
    components: ComponentTemplate[];
    is_default?: boolean;
}

export interface ComponentTemplate {
    type: string;
    name: string;
    selected_fields: any[];
}

const QuickStart: React.FC = () => {
    const { project } = useProjectVariable();
    
    const { data: dataQuery } = useCustomGetQuery({
        queryKey: `templates`,
        enabled: !!project,
        path: `scenario/scenarios?project=${project}`,
    });

    return (
        <div style={{ 
            padding: '20px',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            minHeight: '100vh'
        }}>

            {/* Scenario Management Section */}
            <div style={{ marginBottom: 48 }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: 16,
                    gap: 12
                }}>
                    <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: 'linear-gradient(135deg, #00c6fb 0%, #056ccd 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: 18
                    }}>
                        <ToolOutlined />
                    </div>
                    <div>
                        <Title level={4} style={{ 
                            color: '#2c3e50', 
                            margin: 0,
                            fontSize: 24,
                            fontWeight: 600
                        }}>
                            Scenarios
                        </Title>
                        <Text style={{ 
                            color: '#64748b', 
                            fontSize: 14 
                        }}>
                            Build custom proxy configurations with template-based approach
                        </Text>
                    </div>
                </div>
                
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: 16,
                    marginBottom: 24
                }}>
                    {/* Create New Scenario Card */}
                    <Card
                        size="small"
                        style={{
                            borderRadius: 12,
                            border: '2px dashed #d1d5db',
                            overflow: 'hidden',
                            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                            background: 'white',
                            cursor: 'pointer'
                        }}
                        styles={{ body: { padding: '24px', textAlign: 'center' } }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#667eea';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#d1d5db';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <NavLink to="/scenarios/create" style={{ textDecoration: 'none' }}>
                            <div>
                                <div style={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: 16,
                                    background: 'linear-gradient(135deg, #00c6fb 0%, #056ccd 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: 24,
                                    margin: '0 auto 16px auto'
                                }}>
                                    <PlusOutlined />
                                </div>
                                <Title level={5} style={{ 
                                    color: '#374151', 
                                    margin: '0 0 8px 0',
                                    fontSize: 16,
                                    fontWeight: 600
                                }}>
                                    Create New Scenario
                                </Title>
                                <Text style={{ 
                                    color: '#6b7280', 
                                    fontSize: 13,
                                    lineHeight: 1.4
                                }}>
                                    Build a custom configuration by selecting components and their fields
                                </Text>
                            </div>
                        </NavLink>
                    </Card>

                    {/* Manage Scenarios Card */}
                    <Card
                        size="small"
                        style={{
                            borderRadius: 12,
                            border: '1px solid #e5e7eb',
                            overflow: 'hidden',
                            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                            background: 'white',
                            cursor: 'pointer'
                        }}
                        styles={{ body: { padding: '24px', textAlign: 'center' } }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#667eea';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#e5e7eb';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <NavLink to="/scenarios" style={{ textDecoration: 'none' }}>
                            <div>
                                <div style={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: 16,
                                    background: 'linear-gradient(135deg,rgb(67, 252, 190) 0%,rgb(6, 112, 78) 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: 22,
                                    margin: '0 auto 16px auto'
                                }}>
                                    <FileTextOutlined />
                                </div>
                                <Title level={5} style={{ 
                                    color: '#374151', 
                                    margin: '0 0 8px 0',
                                    fontSize: 16,
                                    fontWeight: 600
                                }}>
                                    Manage Scenarios
                                </Title>
                                <Text style={{ 
                                    color: '#6b7280', 
                                    fontSize: 13,
                                    lineHeight: 1.4
                                }}>
                                    View, edit, execute and manage all your existing scenarios
                                </Text>
                            </div>
                        </NavLink>
                    </Card>
                </div>
            </div>

            {/* Templates Section Header */}
            <div style={{ marginBottom: 24 }}>
                <Title level={4} style={{ 
                    color: '#2c3e50', 
                    margin: '0 0 8px 0',
                    fontSize: 18,
                    fontWeight: 600
                }}>
                    Ready-to-Use Templates
                </Title>
                <Text style={{ 
                    color: '#64748b', 
                    fontSize: 14 
                }}>
                    Begin with ready-to-use templates for common proxy configuration patterns.
                </Text>
            </div>

            {/* Templates Inline Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: 16
            }}>
                {dataQuery?.scenarios && dataQuery.scenarios?.slice(0, 6).map((template: ResourceTemplate) => (
                    <Card
                        key={template.name}
                        size="small"
                        style={{
                            borderRadius: 10,
                            border: '1px solid #e8e8e8',
                            overflow: 'hidden',
                            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                            background: 'white'
                        }}
                        styles={{ body: { padding: '16px', height: '100%', display: 'flex', flexDirection: 'column' } }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)';
                            e.currentTarget.style.borderColor = '#056ccd';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)';
                            e.currentTarget.style.borderColor = '#e8e8e8';
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: 12
                        }}>
                            <Space size={8}>
                                <div style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 8,
                                    background: '#056ccd15',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#056ccd',
                                    fontSize: 14
                                }}>
                                    <RocketOutlined />
                                </div>
                                <div>
                                    <Title 
                                        level={5} 
                                        style={{ 
                                            color: '#2c3e50', 
                                            margin: 0,
                                            fontSize: 14,
                                            fontWeight: 600,
                                            lineHeight: 1.2
                                        }}
                                    >
                                        {template.name}
                                    </Title>
                                </div>
                            </Space>
                            
                            {/* Component Count Badge */}
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                                background: '#056ccd10',
                                padding: '2px 8px',
                                borderRadius: 12,
                                fontSize: 11,
                                fontWeight: 500,
                                color: '#056ccd',
                                border: '1px solid #056ccd20'
                            }}>
                                <SettingOutlined style={{ fontSize: 10 }} />
                                {template.components?.length || 0}
                            </div>
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <Text style={{
                                color: '#64748b',
                                fontSize: 13,
                                lineHeight: 1.5,
                                display: 'block',
                                marginBottom: 16
                            }}>
                                {template.description}
                            </Text>

                            {/* Components Preview */}
                            {template.components && template.components.length > 0 && (
                                <div style={{
                                    background: '#f8f9fa',
                                    borderRadius: 6,
                                    padding: '12px',
                                    marginBottom: 16,
                                    border: '1px solid #e2e8f0',
                                    flex: 1
                                }}>
                                    <div style={{
                                        fontSize: 11,
                                        fontWeight: 600,
                                        color: '#475569',
                                        marginBottom: 8,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}>
                                        Components Included
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: 4
                                    }}>
                                        {template.components.slice(0, 4).map((component, idx) => (
                                            <span
                                                key={idx}
                                                style={{
                                                    background: '#e6f7ff',
                                                    color: '#056ccd',
                                                    padding: '2px 6px',
                                                    borderRadius: 4,
                                                    fontSize: 10,
                                                    fontWeight: 500,
                                                    border: '1px solid #bae7ff'
                                                }}
                                            >
                                                {component.type}: {component.name}
                                            </span>
                                        ))}
                                        {template.components.length > 4 && (
                                            <span style={{
                                                color: '#64748b',
                                                fontSize: 10,
                                                fontWeight: 500,
                                                padding: '2px 4px'
                                            }}>
                                                +{template.components.length - 4} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Action Button */}
                            <NavLink 
                                to={`/scenarios/${template.scenario_id || template.id}/execute`}
                                style={{ textDecoration: 'none' }}
                            >
                                <Button
                                    type="primary"
                                    size="middle"
                                    style={{
                                        width: '100%',
                                        height: 38,
                                        background: 'linear-gradient(90deg, #056ccd 0%, #00c6fb 100%)',
                                        border: 'none',
                                        borderRadius: 6,
                                        fontWeight: 500,
                                        fontSize: 13,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 6
                                    }}
                                    icon={<PlayCircleOutlined />}
                                >
                                    Start Configuration
                                    <ArrowRightOutlined style={{ fontSize: 11 }} />
                                </Button>
                            </NavLink>
                        </div>
                    </Card>
                ))}
                
                {/* More button if there are more than 6 scenarios - Inside grid */}
                {dataQuery?.scenarios && dataQuery.scenarios.length > 6 && (
                    <Card
                        size="small"
                        style={{
                            borderRadius: 12,
                            border: '2px dashed #d1d5db',
                            overflow: 'hidden',
                            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                            background: 'white',
                            cursor: 'pointer',
                            height: '100%'
                        }}
                        styles={{ 
                            body: { 
                                padding: '24px', 
                                height: '100%', 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                textAlign: 'center'
                            } 
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#667eea';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#d1d5db';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <NavLink to="/scenarios" style={{ textDecoration: 'none', height: '100%', display: 'flex', alignItems: 'center' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: 16,
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: 24,
                                    margin: '0 auto 16px auto'
                                }}>
                                    <ArrowRightOutlined />
                                </div>
                                <Title level={5} style={{ 
                                    color: '#374151', 
                                    margin: '0 0 8px 0',
                                    fontSize: 16,
                                    fontWeight: 600
                                }}>
                                    View More Scenarios
                                </Title>
                                <Text style={{ 
                                    color: '#6b7280', 
                                    fontSize: 13,
                                    lineHeight: 1.4
                                }}>
                                    Showing 6 of {dataQuery.scenarios.length} scenarios. View all scenarios and manage them.
                                </Text>
                            </div>
                        </NavLink>
                    </Card>
                )}
            </div>

            {/* Footer Info */}
            
        </div>
    );
}

export default QuickStart;
