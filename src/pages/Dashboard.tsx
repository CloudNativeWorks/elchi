import React, { useState } from "react";
import { Card, Typography, Statistic, Button, Modal, Space } from "antd";
import { NavLink } from "react-router-dom";
import CountUp from 'react-countup';
import { useProjectVariable } from "@/hooks/useProjectVariable";
import { useCustomGetQuery } from "@/common/api";
import { 
    InfoCircleOutlined, 
    GlobalOutlined,
    ShareAltOutlined,
    CloudOutlined,
    ClusterOutlined,
    AimOutlined,
    SafetyOutlined,
    KeyOutlined,
    FilterOutlined,
    AppstoreOutlined,
    RightOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const formatter = (value: number | string) => {
    const numericValue = typeof value === 'number' ? value : parseFloat(value);
    return <CountUp end={numericValue} duration={1.2} />;
};

const resources = [
    { 
        name: 'Listeners', 
        path: '/resource/listener', 
        data: "Listeners are the primary network interface for Envoy. They handle incoming connections and manage the lifecycle of network connections. Each listener can be configured with various filters and protocols.",
        canonical_name: "listeners",
        icon: <GlobalOutlined />,
        color: '#056ccd'
    },
    { 
        name: 'Routes', 
        path: '/resource/route', 
        data: "Routes define how incoming requests are matched and forwarded to upstream services. They provide flexible routing rules based on various criteria such as path, headers, and query parameters.",
        canonical_name: "routes",
        icon: <ShareAltOutlined />,
        color: '#056ccd'
    },
    { 
        name: 'Virtual Hosts', 
        path: '/resource/virtual_host', 
        data: "Virtual Hosts enable hosting multiple domains on a single listener. They provide domain-based routing and allow different routing rules for different domains.",
        canonical_name: "virtual_hosts",
        icon: <CloudOutlined />,
        color: '#056ccd'
    },
    { 
        name: 'Clusters', 
        path: '/resource/cluster', 
        data: "Clusters represent groups of upstream hosts that provide the same service. They handle load balancing, health checking, and connection management for upstream services.",
        canonical_name: "clusters",
        icon: <ClusterOutlined />,
        color: '#056ccd'
    },
    { 
        name: 'Endpoints', 
        path: '/resource/endpoint', 
        data: "Endpoints represent individual instances of upstream services. They provide detailed information about service instances and their health status.",
        canonical_name: "endpoints",
        icon: <AimOutlined />,
        color: '#056ccd'
    },
    { 
        name: 'TLS', 
        path: '/resource/tls', 
        data: "TLS configuration manages secure communication settings. It handles certificate management, cipher suites, and other security-related parameters for encrypted connections.",
        canonical_name: "tls",
        icon: <SafetyOutlined />,
        color: '#056ccd'
    },
    { 
        name: 'Secrets', 
        path: '/resource/secret', 
        data: "Secrets manage sensitive information such as TLS certificates and keys. They provide secure storage and distribution of confidential data.",
        canonical_name: "secrets",
        icon: <KeyOutlined />,
        color: '#056ccd'
    },
    { 
        name: 'Filters', 
        path: '/filters', 
        data: "Filters provide modular processing capabilities for requests and responses. They enable various features like authentication, rate limiting, and request transformation.",
        canonical_name: "filters",
        icon: <FilterOutlined />,
        color: '#056ccd'
    },
    { 
        name: 'Extensions', 
        path: '/extensions', 
        data: "Extensions add additional functionality to Envoy. They provide custom features and integrations with external systems and services.",
        canonical_name: "extensions",
        icon: <AppstoreOutlined />,
        color: '#056ccd'
    },
];

const Dashboard: React.FC = () => {
    const { project } = useProjectVariable();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [modalTitle, setModalTitle] = useState("");

    const { data: dataQuery } = useCustomGetQuery({
        queryKey: `query_${project}`,
        enabled: true,
        path: `custom/count/all?project=${project}`,
    });

    const openModalWithFilterData = (data: string, title: string) => {
        setModalContent(data);
        setModalTitle(title);
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
    };

    return (
        <div style={{ 
            padding: '20px',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            minHeight: '100vh'
        }}>

            {/* Resources Inline Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 16
            }}>
                {resources.map((filter) => (
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
                            e.currentTarget.style.borderColor = filter.color;
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
                                    background: `${filter.color}15`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: filter.color,
                                    fontSize: 14
                                }}>
                                    {filter.icon}
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
                                e.currentTarget.style.background = filter.color + '08';
                                e.currentTarget.style.borderColor = filter.color + '30';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#fafbfc';
                                e.currentTarget.style.borderColor = '#f0f0f0';
                            }}>
                                <div>
                                    <Statistic 
                                        value={dataQuery?.[filter?.canonical_name] || 0} 
                                        formatter={formatter}
                                        valueStyle={{
                                            fontSize: 20,
                                            fontWeight: 700,
                                            color: filter.color,
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
                            <InfoCircleOutlined />
                        </div>
                        <span style={{ fontSize: 17, fontWeight: 600, color: '#2c3e50' }}>
                            {modalTitle} Details
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
                                    Envoy proxy component documentation
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
                                    Key Component
                                </span>
                            </div>
                            <p style={{
                                margin: 0,
                                fontSize: 12,
                                color: '#056ccd',
                                lineHeight: 1.5
                            }}>
                                This is a core component of Envoy's architecture that enables advanced traffic management and service communication.
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

export default Dashboard;