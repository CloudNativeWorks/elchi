import React, { useState } from "react";
import { Card, Typography, Statistic, Button, Modal, Space } from "antd";
import { NavLink } from "react-router-dom";
import CountUp from 'react-countup';
import ReactMarkdown from 'react-markdown';
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
    RightOutlined,
    GlobalOutlined
} from '@ant-design/icons';
import { D_E_ACCESS_LOG, D_E_CLUSTER_DYNAMIC_FORWARD_PROXY, D_E_COMPRESSOR_LIBRARY, D_E_HEALTH_CHECK_EVENT_FILE_SINK, D_E_HTTP_PROTOCOL_OPTIONS, D_E_STAT_SINKS, D_E_STATEFUL_SESSION_STATE, D_E_URI_TEMPLATE_MATCH } from "@/common/statics/ResourceDescriptions";

const { Title, Text } = Typography;

const formatter = (value: number | string) => {
    const numericValue = typeof value === 'number' ? value : parseFloat(value);
    return <CountUp end={numericValue} duration={1.2} />;
};

// Extension icons mapping
const getExtensionIcon = (extensionName: string) => {
    const iconMap: { [key: string]: JSX.Element } = {
        'Access Log': <FileTextOutlined />,
        'Cluster Dynamic Forward Proxy': <GlobalOutlined />,
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
        data: D_E_ACCESS_LOG,
        category: "envoy.access_loggers"
    },
    {
        name: 'Cluster Dynamic Forward Proxy',
        path: '/extensions/cluster_dynamic_forward_proxy',
        data: D_E_CLUSTER_DYNAMIC_FORWARD_PROXY,
        category: "envoy.clusters"
    },
    {
        name: 'Compressor Library',
        path: '/extensions/compressor_library',
        data: D_E_COMPRESSOR_LIBRARY,
        category: "envoy.compression.compressor"
    },
    {
        name: 'HealthCheck Event File Sink',
        path: '/extensions/hcefs',
        data: D_E_HEALTH_CHECK_EVENT_FILE_SINK,
        category: "envoy.health_check.event_sinks"
    },
    {
        name: 'Http Protocol Options',
        path: '/extensions/http_protocol_options',
        data: D_E_HTTP_PROTOCOL_OPTIONS,
        category: "envoy.upstreams.http.http_protocol_options"
    },
    {
        name: 'Uri Template Match',
        path: '/extensions/utm',
        data: D_E_URI_TEMPLATE_MATCH,
        category: "envoy.path.match.uri_template.uri_template_matcher"
    },
    {
        name: 'Stateful Session State',
        path: '/extensions/session_state',
        data: D_E_STATEFUL_SESSION_STATE,
        category: "envoy.http.stateful_session.header",
        category_2: "envoy.http.stateful_session.cookie"
    },
    {
        name: 'Stat Sinks',
        path: '/extensions/stat_sinks',
        data: D_E_STAT_SINKS,
        category: "envoy.stats_sinks"
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
                                            (dataQuery?.[filter?.category] || 0) +
                                            (dataQuery?.[filter?.category_2] || 0)
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
                open={isModalVisible}
                onCancel={handleModalClose}
                footer={null}
                width={1300}
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
                                <InfoCircleOutlined />
                            </div>
                            <div>
                                <h3 style={{
                                    margin: 0,
                                    fontSize: 17,
                                    fontWeight: 600,
                                    color: '#1a202c',
                                    marginBottom: 3
                                }}>
                                    {modalTitle}
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
                            <div style={{
                                margin: 0,
                                lineHeight: 1.7,
                                fontSize: 14,
                                color: '#374151'
                            }}>
                                <ReactMarkdown
                                    components={{
                                        h1: ({ node, ...props }) => <h1 style={{ color: '#056ccd', fontSize: '18px', fontWeight: 700, margin: '20px 0 12px 0' }} {...props} />,
                                        h2: ({ node, ...props }) => <h2 style={{ color: '#056ccd', fontSize: '16px', fontWeight: 600, margin: '20px 0 12px 0' }} {...props} />,
                                        h3: ({ node, ...props }) => <h3 style={{ color: '#056ccd', fontSize: '15px', fontWeight: 600, margin: '18px 0 10px 0' }} {...props} />,
                                        p: ({ node, ...props }) => <p style={{ margin: '12px 0', lineHeight: 1.7, color: '#374151' }} {...props} />,
                                        ul: ({ node, ...props }) => <ul style={{ margin: '12px 0', paddingLeft: '20px', listStyleType: 'disc' }} {...props} />,
                                        ol: ({ node, ...props }) => <ol style={{ margin: '12px 0', paddingLeft: '20px', listStyleType: 'decimal' }} {...props} />,
                                        li: ({ node, ...props }) => <li style={{ margin: '6px 0', color: '#4a5568', lineHeight: 1.6 }} {...props} />,
                                        strong: ({ node, ...props }) => <strong style={{ color: '#2d3748', fontWeight: 600 }} {...props} />,
                                        em: ({ node, ...props }) => <em style={{ color: '#4a5568', fontStyle: 'italic' }} {...props} />,
                                        code: ({ node, ...props }) => <code style={{ background: '#f7fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '2px 6px', fontFamily: 'Monaco, Consolas, monospace', fontSize: '13px', color: '#e53e3e' }} {...props} />,
                                        blockquote: ({ node, ...props }) => (
                                            <blockquote style={{
                                                margin: '16px 0',
                                                padding: '12px 16px',
                                                background: 'rgba(5, 108, 205, 0.05)',
                                                borderLeft: '4px solid #056ccd',
                                                borderRadius: '0 8px 8px 0',
                                                color: '#2d3748'
                                            }} {...props} />
                                        )
                                    }}
                                >
                                    {modalContent}
                                </ReactMarkdown>
                            </div>
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
                        size="large"
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