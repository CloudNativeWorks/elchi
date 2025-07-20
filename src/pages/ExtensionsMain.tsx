import React, { useState } from "react";
import { Card, Typography, Statistic, Button, Modal, Space } from "antd";
import { NavLink } from "react-router-dom";
import CountUp from 'react-countup';
import { useProjectVariable } from "@/hooks/useProjectVariable";
import { useCustomGetQuery } from "@/common/api";
import { 
    InfoCircleOutlined,
    FileTextOutlined,
    CompressOutlined,
    HeartOutlined,
    ApiOutlined,
    AimOutlined,
    DatabaseOutlined,
    BarChartOutlined,
    AppstoreOutlined,
    RightOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const formatter = (value: number | string) => {
    const numericValue = typeof value === 'number' ? value : parseFloat(value);
    return <CountUp end={numericValue} duration={1.2} />;
};

// Extension icons mapping
const getExtensionIcon = (extensionName: string) => {
    const iconMap: { [key: string]: JSX.Element } = {
        'Access Log': <FileTextOutlined />,
        'Compressor Library': <CompressOutlined />,
        'HealthCheck Event File Sink': <HeartOutlined />,
        'Http Protocol Options': <ApiOutlined />,
        'Uri Template Match': <AimOutlined />,
        'Stateful Session State': <DatabaseOutlined />,
        'Stat Sinks': <BarChartOutlined />
    };
    return iconMap[extensionName] || <AppstoreOutlined />;
};

const extensions = [
    { 
        name: 'Access Log', 
        path: '/extensions/access_log', 
        data: "The Access Log extension provides detailed logging capabilities for HTTP requests and responses. It enables comprehensive monitoring and debugging of traffic patterns and request processing.",
        canonical_name: "envoy.access_loggers" 
    },
    { 
        name: 'Compressor Library', 
        path: '/extensions/compressor_library', 
        data: "The Compressor Library extension offers various compression algorithms for HTTP responses. It helps reduce bandwidth usage and improve performance by compressing response data.",
        canonical_name: "envoy.compression.compressor" 
    },
    { 
        name: 'HealthCheck Event File Sink', 
        path: '/extensions/hcefs', 
        data: "The HealthCheck Event File Sink extension captures and logs health check events to files. It provides detailed monitoring of service health status and state changes.",
        canonical_name: "envoy.health_check.event_sinks" 
    },
    { 
        name: 'Http Protocol Options', 
        path: '/extensions/http_protocol_options', 
        data: "The HTTP Protocol Options extension configures HTTP protocol-specific settings. It controls various aspects of HTTP/1.1 and HTTP/2 protocol behavior and optimization.",
        canonical_name: "envoy.upstreams.http.http_protocol_options" 
    },
    { 
        name: 'Uri Template Match', 
        path: '/extensions/utm', 
        data: "The URI Template Match extension provides flexible URI matching capabilities using template patterns. It enables sophisticated routing and request matching based on URI patterns.",
        canonical_name: "envoy.path.match.uri_template.uri_template_matcher" 
    },
    { 
        name: 'Stateful Session State', 
        path: '/extensions/session_state', 
        data: "The Stateful Session State extension manages session state information across requests. It enables session persistence and stateful routing for HTTP traffic.",
        canonical_name: "envoy.http.stateful_session.header",
        canonical_name_2: "envoy.http.stateful_session.cookie"
    },
    { 
        name: 'Stat Sinks', 
        path: '/extensions/stat_sinks', 
        data: "The Stat Sinks extension provides detailed logging capabilities for HTTP requests and responses. It enables comprehensive monitoring and debugging of traffic patterns and request processing.",
        canonical_name: "envoy.stats_sinks" 
    },
];

const ExtensionsMain: React.FC = () => {
    const { project } = useProjectVariable();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [modalTitle, setModalTitle] = useState("");

    const openModalWithFilterData = (data: string, title: string) => {
        setModalContent(data);
        setModalTitle(title);
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
    };

    const { data: dataQuery } = useCustomGetQuery({
        queryKey: `query_${project}`,
        enabled: true,
        path: `custom/count/filters?project=${project}&collection=extensions&category=extension`,
    });

    return (
        <div style={{ 
            padding: '20px',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            minHeight: '100vh'
        }}>

            {/* Extensions Inline Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 16
            }}>
                {extensions.map((filter) => (
                    <Card
                        key={filter.name}
                        size="small"
                        style={{
                            borderRadius: 10,
                            border: '1px solid #e8e8e8',
                            overflow: 'hidden',
                            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                            background: 'white'
                        }}
                        styles={{ body: { padding: '16px' } }}
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
                                    {getExtensionIcon(filter.name)}
                                </div>
                                <div>
                                    <NavLink 
                                        to={filter.path}
                                        style={{ textDecoration: 'none' }}
                                    >
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
                                            {filter.name}
                                        </Title>
                                    </NavLink>
                                </div>
                            </Space>
                            
                            <Button
                                type="text"
                                icon={<InfoCircleOutlined />}
                                size="small"
                                style={{ 
                                    color: '#8c8c8c',
                                    border: 'none',
                                    width: 28,
                                    height: 28
                                }}
                                onClick={() => openModalWithFilterData(filter.data, filter.name)}
                            />
                        </div>

                        <NavLink 
                            to={filter.path}
                            style={{ textDecoration: 'none', display: 'block' }}
                        >
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '8px 12px',
                                background: '#fafbfc',
                                borderRadius: 6,
                                border: '1px solid #f0f0f0',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#056ccd08';
                                e.currentTarget.style.borderColor = '#056ccd30';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#fafbfc';
                                e.currentTarget.style.borderColor = '#f0f0f0';
                            }}>
                                <div>
                                    <Statistic 
                                        value={
                                            (dataQuery?.[filter?.canonical_name] || 0) + 
                                            (dataQuery?.[filter?.canonical_name_2] || 0)
                                        } 
                                        formatter={formatter}
                                        valueStyle={{
                                            fontSize: 20,
                                            fontWeight: 700,
                                            color: '#056ccd',
                                            lineHeight: 1
                                        }}
                                    />
                                    <Text style={{ 
                                        color: '#8c8c8c',
                                        fontSize: 11,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                        fontWeight: 500
                                    }}>
                                        Resources
                                    </Text>
                                </div>
                                <RightOutlined style={{ 
                                    color: '#bfbfbf', 
                                    fontSize: 12 
                                }} />
                            </div>
                        </NavLink>
                    </Card>
                ))}
            </div>

            {/* Enhanced Modal */}
            <Modal
                title={
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '6px 0'
                    }}>
                        <div style={{
                            padding: 8,
                            borderRadius: 8,
                            background: 'linear-gradient(90deg, #056ccd 0%, #00c6fb 100%)',
                            color: 'white',
                            boxShadow: '0 2px 8px rgba(5, 108, 205, 0.3)'
                        }}>
                            <AppstoreOutlined />
                        </div>
                        <span style={{ fontSize: 17, fontWeight: 600, color: '#2c3e50' }}>
                            {modalTitle} Extension Details
                        </span>
                    </div>
                }
                open={isModalVisible}
                onCancel={handleModalClose}
                footer={null}
                width={650}
                style={{ top: 60 }}
                styles={{
                    body: {
                        padding: '0 20px 20px 20px'
                    }
                }}
            >
                <div style={{
                    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                    margin: '14px -20px',
                    borderRadius: 10,
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden'
                }}>
                    {/* Header Section */}
                    <div style={{
                        padding: '18px 20px',
                        background: 'white',
                        borderBottom: '1px solid #e2e8f0'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 14
                        }}>
                            <div style={{
                                minWidth: 48,
                                height: 48,
                                borderRadius: 12,
                                background: 'linear-gradient(90deg, #056ccd 0%, #00c6fb 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: 20,
                                boxShadow: '0 6px 20px rgba(5, 108, 205, 0.25)'
                            }}>
                                <AppstoreOutlined />
                            </div>
                            <div>
                                <h3 style={{
                                    margin: 0,
                                    fontSize: 17,
                                    fontWeight: 600,
                                    color: '#1a202c',
                                    marginBottom: 3
                                }}>
                                    {modalTitle} Extension
                                </h3>
                                <p style={{
                                    margin: 0,
                                    fontSize: 13,
                                    color: '#64748b'
                                }}>
                                    Envoy proxy extension component documentation
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div style={{
                        padding: '20px'
                    }}>
                        <div style={{
                            background: 'white',
                            padding: '18px',
                            borderRadius: 8,
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)'
                        }}>
                            <Typography.Paragraph style={{ 
                                margin: 0,
                                lineHeight: 1.7,
                                fontSize: 14,
                                color: '#374151',
                                textAlign: 'justify'
                            }}>
                                {modalContent}
                            </Typography.Paragraph>
                        </div>

                        {/* Key Features */}
                        <div style={{
                            marginTop: 16,
                            padding: '14px 18px',
                            background: 'rgba(5, 108, 205, 0.05)',
                            borderRadius: 8,
                            border: '1px solid rgba(5, 108, 205, 0.1)'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                marginBottom: 6
                            }}>
                                <div style={{
                                    width: 5,
                                    height: 5,
                                    borderRadius: '50%',
                                    background: '#056ccd'
                                }}></div>
                                <span style={{
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: '#056ccd',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    Extension Component
                                </span>
                            </div>
                            <p style={{
                                margin: 0,
                                fontSize: 12,
                                color: '#056ccd',
                                lineHeight: 1.5
                            }}>
                                This extension provides additional functionality to enhance Envoy's capabilities.
                            </p>
                        </div>
                    </div>
                </div>
                
                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: 14
                }}>
                    <Button 
                        onClick={handleModalClose}
                        type="primary"
                        size="middle"
                        style={{
                            background: 'linear-gradient(90deg, #056ccd 0%, #00c6fb 100%)',
                            border: 'none',
                            borderRadius: 6,
                            fontWeight: 500,
                            paddingLeft: 20,
                            paddingRight: 20
                        }}
                    >
                        Got it
                    </Button>
                </div>
            </Modal>
        </div>
    );
}

export default ExtensionsMain;