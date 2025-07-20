import React from "react";
import { Card, Typography, Button, Space } from "antd";
import { NavLink } from "react-router-dom";
import { useCustomGetQuery } from "@/common/api";
import { 
    RocketOutlined,
    SettingOutlined,
    PlayCircleOutlined,
    ArrowRightOutlined,
    ThunderboltOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

export interface ResourceTemplate {
    name: string;
    scenario: number;
    description: string;
    components: ComponentTemplate[];
}

export interface ComponentTemplate {
    name: string;
    title: string;
    description: string;
}

const QuickStart: React.FC = () => {
    const { data: dataQuery } = useCustomGetQuery({
        queryKey: `templates`,
        enabled: true,
        path: `scenario/scenario_list`,
    });

    return (
        <div style={{ 
            padding: '20px',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            minHeight: '100vh'
        }}>

            {/* Templates Inline Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: 16
            }}>
                {dataQuery && dataQuery?.map((template: ResourceTemplate) => (
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
                                                {component.title}
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
                                to={`/scenario/${template.scenario}`}
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
            </div>

            {/* Footer Info */}
            <div style={{
                marginTop: 32,
                textAlign: 'center',
                padding: '20px',
                background: 'white',
                borderRadius: 10,
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
            }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 8
                }}>
                    <ThunderboltOutlined style={{ color: '#056ccd' }} />
                    <span style={{ fontWeight: 600, color: '#374151', marginRight: 4 }}>
                        Quick & Easy Setup
                    </span>
                </div>
                <Text style={{ color: '#64748b', fontSize: 13 }}>
                    Each template guides you through a step-by-step wizard to configure multiple Envoy components in a single workflow.
                </Text>
            </div>
        </div>
    );
}

export default QuickStart;
