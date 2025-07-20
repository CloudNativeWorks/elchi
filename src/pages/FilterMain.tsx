import React, { useState } from "react";
import { Card, Typography, Statistic, Button, Modal, Badge, Space } from "antd";
import { NavLink } from "react-router-dom";
import CountUp from 'react-countup';
import { 
    InfoCircleOutlined,
    EyeOutlined,
    GlobalOutlined,
    SendOutlined,
    ApiOutlined,
    SafetyOutlined,
    ThunderboltOutlined,
    ControlOutlined,
    SecurityScanOutlined,
    MonitorOutlined,
    SettingOutlined,
    ClusterOutlined,
    FilterOutlined,
    AimOutlined,
    CompressOutlined,
    KeyOutlined,
    CodeOutlined,
    UserOutlined,
    RightOutlined
} from '@ant-design/icons';
import { useCustomGetQuery } from "@/common/api";
import { useProjectVariable } from "@/hooks/useProjectVariable";

const { Title, Text } = Typography;

const formatter = (value: number | string) => {
    const numericValue = typeof value === 'number' ? value : parseFloat(value);
    return <CountUp end={numericValue} duration={1.2} />;
};

// Filter icons mapping
const getFilterIcon = (filterName: string) => {
    const iconMap: { [key: string]: JSX.Element } = {
        'Http Inspector': <EyeOutlined />,
        'Local Rate Limit': <ThunderboltOutlined />,
        'Original Dst': <AimOutlined />,
        'Original Src': <AimOutlined />,
        'Proxy Protocol': <KeyOutlined />,
        'TLS Inspector': <SecurityScanOutlined />,
        'Connection Limit': <ControlOutlined />,
        'Http Connection Manager': <GlobalOutlined />,
        'Local Ratelimit': <ThunderboltOutlined />,
        'RBAC': <KeyOutlined />,
        'Tcp Proxy': <KeyOutlined />,
        'DNS Filter': <SendOutlined />,
        'Adaptive Concurrency': <MonitorOutlined />,
        'Admission Control': <ControlOutlined />,
        'Bandwidth Limit': <ThunderboltOutlined />,
        'Basic Auth': <UserOutlined />,
        'Buffer': <SettingOutlined />,
        'Compressor': <CompressOutlined />,
        'Cors': <SafetyOutlined />,
        'Csrf Policy': <KeyOutlined />,
        'Lua': <CodeOutlined />,
        'OAuth2': <KeyOutlined />,
        'Router': <KeyOutlined />,
        'Stateful Session': <ClusterOutlined />
    };
    return iconMap[filterName] || <FilterOutlined />;
};

const filters = [
    {
        category: 'Listener Filters',
        icon: <EyeOutlined />,
        color: '#667eea',
        bgColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        filters: [
            {
                name: 'Http Inspector',
                path: '/filters/listener/l_http_inspector',
                value: 225,
                data: "The HTTP Inspector filter detects whether incoming connections are using the HTTP protocol. This filter analyzes incoming traffic to identify HTTP requests and ensures proper routing. It plays a critical role in correctly processing HTTP and HTTPS traffic.",
                canonical_name: "envoy.filters.listener.http_inspector"
            },
            { 
                name: 'Local Rate Limit', 
                path: '/filters/listener/l_local_ratelimit', 
                value: 225, 
                data: "The Local Rate Limit filter restricts the connection rate on a specific listener. This filter is used to prevent overload and ensure fair resource usage. Custom limits can be defined for each IP address or connection.",
                canonical_name: "envoy.filters.listener.local_ratelimit" 
            },
            { 
                name: 'Original Dst', 
                path: '/filters/listener/l_original_dst', 
                value: 225, 
                data: "The Original Destination filter preserves the original destination address of incoming connections and uses this information to route traffic correctly. This is particularly useful in proxy scenarios and NAT (Network Address Translation) situations.",
                canonical_name: "envoy.filters.listener.original_dst" 
            },
            { 
                name: 'Original Src', 
                path: '/filters/listener/l_original_src', 
                value: 225, 
                data: "The Original Source filter preserves the source IP address of incoming connections and uses this information to route traffic correctly. This filter is particularly important for security and monitoring scenarios.",
                canonical_name: "envoy.filters.listener.original_src" 
            },
            { 
                name: 'Proxy Protocol', 
                path: '/filters/listener/l_proxy_protocol', 
                value: 225, 
                data: "The Proxy Protocol filter enables the transmission of client information (IP address, port, etc.) between proxy servers. This protocol is used to preserve client information between load balancers and proxy chains.",
                canonical_name: "envoy.filters.listener.proxy_protocol" 
            },
            { 
                name: 'TLS Inspector', 
                path: '/filters/listener/l_tls_inspector', 
                value: 225, 
                data: "The TLS Inspector filter detects whether incoming connections are using the TLS protocol. This filter identifies SSL/TLS connections and ensures they are processed appropriately. It is a critical component for secure communication.",
                canonical_name: "envoy.filters.listener.tls_inspector" 
            },
        ]
    },
    {
        category: 'Network Filters',
        icon: <GlobalOutlined />,
        color: '#f093fb',
        bgColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        filters: [
            { 
                name: 'Connection Limit', 
                path: '/filters/network/connection_limit', 
                value: 225, 
                data: "The Connection Limit filter restricts the number of concurrent connections to a specific network endpoint. This helps prevent resource exhaustion and ensures service availability under high load conditions.",
                canonical_name: "envoy.filters.network.connection_limit" 
            },
            { 
                name: 'Http Connection Manager', 
                path: '/filters/network/hcm', 
                value: 225, 
                data: "The HTTP Connection Manager is a core component that handles HTTP/1.1 and HTTP/2 traffic. It manages connection lifecycle, request/response processing, and provides a foundation for HTTP-based features.",
                canonical_name: "envoy.filters.network.http_connection_manager" 
            },
            { 
                name: 'Local Ratelimit', 
                path: '/filters/network/n_local_ratelimit', 
                value: 225, 
                data: "The Network Local Rate Limit filter controls the rate of network connections. It helps prevent service overload and ensures fair resource distribution across different clients and connections.",
                canonical_name: "envoy.filters.network.local_ratelimit" 
            },
            { 
                name: 'RBAC', 
                path: '/filters/network/network_rbac', 
                value: 225, 
                data: "The Network RBAC (Role-Based Access Control) filter enforces access control policies at the network level. It allows or denies connections based on configured rules and policies.",
                canonical_name: "envoy.filters.network.rbac" 
            },
            { 
                name: 'Tcp Proxy', 
                path: '/filters/network/tcp_proxy', 
                value: 225, 
                data: "The TCP Proxy filter enables TCP connection forwarding and load balancing. It provides essential functionality for TCP-based services and applications.",
                canonical_name: "envoy.filters.network.tcp_proxy" 
            },
        ]
    },
    {
        category: 'UDP Listener Filters',
        icon: <SendOutlined />,
        color: '#4facfe',
        bgColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        filters: [
            { 
                name: 'DNS Filter', 
                path: '/filters/udp/l_dns_filter', 
                value: 225, 
                data: "The DNS Filter processes DNS queries and responses. It provides DNS-specific functionality and can be used for DNS-based routing and filtering.",
                canonical_name: "envoy.filters.udp.dns_filter" 
            },
        ]
    },
    {
        category: 'HTTP Filters',
        icon: <ApiOutlined />,
        color: '#43e97b',
        bgColor: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        filters: [
            { 
                name: 'Adaptive Concurrency', 
                path: '/filters/http/adaptive_concurrency', 
                value: 50, 
                data: "The Adaptive Concurrency filter dynamically adjusts the number of concurrent requests based on system load and response times. It helps maintain optimal performance under varying conditions.",
                canonical_name: "envoy.filters.http.adaptive_concurrency" 
            },
            { 
                name: 'Admission Control', 
                path: '/filters/http/admission_control', 
                value: 50, 
                data: "The Admission Control filter manages request admission based on system health and load. It helps prevent service degradation during high traffic periods.",
                canonical_name: "envoy.filters.http.admission_control" 
            },
            { 
                name: 'Bandwidth Limit', 
                path: '/filters/http/bandwidth_limit', 
                value: 50, 
                data: "The Bandwidth Limit filter controls the rate of data transfer for HTTP requests and responses. It helps manage network resources and prevent bandwidth exhaustion.",
                canonical_name: "envoy.filters.http.bandwidth_limit" 
            },
            { 
                name: 'Basic Auth', 
                path: '/filters/http/basic_auth', 
                value: 125, 
                data: "The Basic Auth filter implements HTTP Basic Authentication. It validates user credentials and controls access to protected resources.",
                canonical_name: "envoy.filters.http.basic_auth" 
            },
            { 
                name: 'Buffer', 
                path: '/filters/http/buffer', 
                value: 50, 
                data: "The Buffer filter manages request and response buffering. It helps handle large payloads and provides control over memory usage.",
                canonical_name: "envoy.filters.http.buffer" 
            },
            { 
                name: 'Compressor', 
                path: '/filters/http/compressor', 
                value: 50, 
                data: "The Compressor filter provides HTTP compression capabilities. It reduces bandwidth usage by compressing response bodies.",
                canonical_name: "envoy.filters.http.compressor" 
            },
            { 
                name: 'Cors', 
                path: '/filters/http/cors', 
                value: 50, 
                data: "The CORS filter implements Cross-Origin Resource Sharing policies. It enables secure cross-origin requests and responses.",
                canonical_name: "envoy.filters.http.cors" 
            },
            { 
                name: 'Csrf Policy', 
                path: '/filters/http/csrf_policy', 
                value: 50, 
                data: "The CSRF Policy filter protects against Cross-Site Request Forgery attacks. It validates request origins and tokens to prevent unauthorized actions.",
                canonical_name: "envoy.filters.http.csrf" 
            },
            { 
                name: 'Local Ratelimit', 
                path: '/filters/http/h_local_ratelimit', 
                value: 50, 
                data: "The HTTP Local Rate Limit filter controls the rate of HTTP requests. It helps prevent service overload and ensures fair resource usage.",
                canonical_name: "envoy.filters.http.local_ratelimit" 
            },
            { 
                name: 'Lua', 
                path: '/filters/http/lua', 
                value: 50, 
                data: "The Lua filter enables custom request/response processing using Lua scripts. It provides flexibility for implementing custom logic and transformations.",
                canonical_name: "envoy.filters.http.lua" 
            },
            { 
                name: 'OAuth2', 
                path: '/filters/http/oauth2', 
                value: 500, 
                data: "The OAuth2 filter implements OAuth 2.0 authentication and authorization. It handles token validation and access control for OAuth2-protected resources.",
                canonical_name: "adaptive_concurrency" 
            },
            { 
                name: 'RBAC', 
                path: '/filters/http/http_rbac', 
                value: 500, 
                data: "The HTTP RBAC filter enforces role-based access control for HTTP requests. It allows or denies access based on configured policies and user roles.",
                canonical_name: "envoy.filters.http.rbac" 
            },
            { 
                name: 'Router', 
                path: '/filters/http/http_router', 
                value: 225, 
                data: "The HTTP Router filter handles request routing and load balancing. It's a core component that determines how requests are forwarded to upstream services.",
                canonical_name: "envoy.filters.http.router" 
            },
            { 
                name: 'Stateful Session', 
                path: '/filters/http/stateful_session', 
                value: 50, 
                data: "The Stateful Session filter maintains session state across requests. It enables session-based routing and load balancing.",
                canonical_name: "envoy.filters.http.stateful_session" 
            },
        ]
    },
];

const FilterMain: React.FC = () => {
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
        path: `custom/count/filters?project=${project}&collection=filters`,
    });

    return (
        <div style={{ 
            padding: '20px',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            minHeight: '100vh'
        }}>

            {filters.map((categoryItem) => (
                <div key={categoryItem.category} style={{ marginBottom: 40 }}>
                    {/* Compact Category Header */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        marginBottom: 20,
                        padding: '12px 20px',
                        background: 'white',
                        borderRadius: 10,
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 1px 6px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            background: categoryItem.bgColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: 16
                        }}>
                            {categoryItem.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                            <Title level={4} style={{ 
                                margin: 0, 
                                color: '#1a202c',
                                fontSize: 18
                            }}>
                                {categoryItem.category}
                            </Title>
                        </div>
                        <Badge 
                            count={categoryItem.filters.length} 
                            style={{ 
                                background: categoryItem.color,
                                fontSize: 12,
                                fontWeight: 600
                            }} 
                        />
                    </div>

                    {/* Filters Inline Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: 16
                    }}>
                        {categoryItem.filters.map((filter) => (
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
                                    e.currentTarget.style.borderColor = categoryItem.color;
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
                                            background: `${categoryItem.color}15`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: categoryItem.color,
                                            fontSize: 14
                                        }}>
                                            {getFilterIcon(filter.name)}
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
                                        e.currentTarget.style.background = categoryItem.color + '08';
                                        e.currentTarget.style.borderColor = categoryItem.color + '30';
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
                                                    color: categoryItem.color,
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
                </div>
            ))}

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
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
                        }}>
                            <FilterOutlined />
                        </div>
                        <span style={{ fontSize: 17, fontWeight: 600, color: '#2c3e50' }}>
                            {modalTitle} Filter Details
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
                                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: 20,
                                boxShadow: '0 6px 20px rgba(79, 172, 254, 0.25)'
                            }}>
                                <FilterOutlined />
                            </div>
                            <div>
                                <h3 style={{
                                    margin: 0,
                                    fontSize: 17,
                                    fontWeight: 600,
                                    color: '#1a202c',
                                    marginBottom: 3
                                }}>
                                    {modalTitle} Filter
                                </h3>
                                <p style={{
                                    margin: 0,
                                    fontSize: 13,
                                    color: '#64748b'
                                }}>
                                    Envoy proxy filter component documentation
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
                            background: 'rgba(79, 172, 254, 0.05)',
                            borderRadius: 8,
                            border: '1px solid rgba(79, 172, 254, 0.1)'
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
                                    background: '#4facfe'
                                }}></div>
                                <span style={{
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: '#1e40af',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    Filter Component
                                </span>
                            </div>
                            <p style={{
                                margin: 0,
                                fontSize: 12,
                                color: '#1e40af',
                                lineHeight: 1.5
                            }}>
                                This filter provides essential functionality for Envoy's request/response processing pipeline.
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
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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

export default FilterMain;