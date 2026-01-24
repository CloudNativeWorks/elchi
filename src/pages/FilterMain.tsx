import React, { useState } from "react";
import { Card, Typography, Statistic, Button, Modal, Badge, Space } from "antd";
import { NavLink } from "react-router-dom";
import CountUp from 'react-countup';
import ReactMarkdown from 'react-markdown';
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
import { D_HTTP_ADAPTIVE_CONCURRENCY, D_HTTP_ADMISSION_CONTROL, D_HTTP_BANDWIDTH_LIMIT, D_HTTP_BASIC_AUTH, D_HTTP_BUFFER, D_HTTP_COMPRESSOR, D_HTTP_CORS, D_HTTP_CSRF_POLICY, D_HTTP_DYNAMIC_FORWARD_PROXY, D_HTTP_EXT_AUTHZ, D_HTTP_EXT_PROC, D_HTTP_GRPC_HTTP1_BRIDGE, D_HTTP_GRPC_WEB, D_HTTP_HEADER_MUTATION, D_HTTP_JWT_AUTHN, D_HTTP_LOCAL_RATE_LIMIT, D_HTTP_LUA, D_HTTP_OAUTH2, D_HTTP_ORIGINAL_SRC, D_HTTP_RBAC, D_HTTP_ROUTER, D_HTTP_STATEFUL_SESSION, D_HTTP_WASM, D_L_HTTP_INSPECTOR, D_L_LOCAL_RATE_LIMIT, D_L_ORIGINAL_DST, D_L_ORIGINAL_SRC, D_L_PROXY_PROTOCOL, D_L_TLS_INSPECTOR, D_N_CONNECTION_LIMIT, D_N_HTTP_CONNECTION_MANAGER, D_N_LOCAL_RATE_LIMIT, D_N_MONGO_PROXY, D_N_NETWORK_RBAC, D_N_REDIS_PROXY, D_N_SNI_CLUSTER, D_N_SNI_DYNAMIC_FORWARD_PROXY, D_N_TCP_PROXY, D_UDP_DNS_FILTER, D_UDP_PROXY } from "@/common/statics/ResourceDescriptions";

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
        'Mongo Proxy': <ApiOutlined />,
        'Redis Proxy': <ApiOutlined />,
        'SNI Cluster': <ApiOutlined />,
        'SNI Dynamic Forward Proxy': <GlobalOutlined />,
        'DNS Filter': <SendOutlined />,
        'UDP Proxy': <ApiOutlined />,
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
        'Stateful Session': <ClusterOutlined />,
        'External Processor': <ApiOutlined />,
        'External Authorization': <SecurityScanOutlined />,
        'JWT Authentication': <SafetyOutlined />,
        'Dynamic Forward Proxy': <GlobalOutlined />,
        'Wasm': <CodeOutlined />
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
                data: D_L_HTTP_INSPECTOR,
                canonical_name: "envoy.filters.listener.http_inspector"
            },
            {
                name: 'Local Rate Limit',
                path: '/filters/listener/l_local_ratelimit',
                value: 225,
                data: D_L_LOCAL_RATE_LIMIT,
                canonical_name: "envoy.filters.listener.local_ratelimit"
            },
            {
                name: 'Original Dst',
                path: '/filters/listener/l_original_dst',
                value: 225,
                data: D_L_ORIGINAL_DST,
                canonical_name: "envoy.filters.listener.original_dst"
            },
            {
                name: 'Original Src',
                path: '/filters/listener/l_original_src',
                value: 225,
                data: D_L_ORIGINAL_SRC,
                canonical_name: "envoy.filters.listener.original_src"
            },
            {
                name: 'Proxy Protocol',
                path: '/filters/listener/l_proxy_protocol',
                value: 225,
                data: D_L_PROXY_PROTOCOL,
                canonical_name: "envoy.filters.listener.proxy_protocol"
            },
            {
                name: 'TLS Inspector',
                path: '/filters/listener/l_tls_inspector',
                value: 225,
                data: D_L_TLS_INSPECTOR,
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
                data: D_N_CONNECTION_LIMIT,
                canonical_name: "envoy.filters.network.connection_limit"
            },
            {
                name: 'Http Connection Manager',
                path: '/filters/network/hcm',
                value: 225,
                data: D_N_HTTP_CONNECTION_MANAGER,
                canonical_name: "envoy.filters.network.http_connection_manager"
            },
            {
                name: 'Local Ratelimit',
                path: '/filters/network/n_local_ratelimit',
                value: 225,
                data: D_N_LOCAL_RATE_LIMIT,
                canonical_name: "envoy.filters.network.local_ratelimit"
            },
            {
                name: 'Mongo Proxy',
                path: '/filters/network/mongo_proxy',
                value: 225,
                data: D_N_MONGO_PROXY,
                canonical_name: "envoy.filters.network.mongo_proxy"
            },
            {
                name: 'RBAC',
                path: '/filters/network/network_rbac',
                value: 225,
                data: D_N_NETWORK_RBAC,
                canonical_name: "envoy.filters.network.rbac"
            },
            {
                name: 'Redis Proxy',
                path: '/filters/network/redis_proxy',
                value: 226,
                data: D_N_REDIS_PROXY,
                canonical_name: "envoy.filters.network.redis_proxy"
            },
            {
                name: 'SNI Dynamic Forward Proxy',
                path: '/filters/network/sni_dynamic_forward_proxy',
                value: 228,
                data: D_N_SNI_DYNAMIC_FORWARD_PROXY,
                canonical_name: "envoy.filters.network.sni_dynamic_forward_proxy"
            },
            {
                name: 'SNI Cluster',
                path: '/filters/network/sni_cluster',
                value: 227,
                data: D_N_SNI_CLUSTER,
                canonical_name: "envoy.filters.network.sni_cluster"
            },
            {
                name: 'Tcp Proxy',
                path: '/filters/network/tcp_proxy',
                value: 225,
                data: D_N_TCP_PROXY,
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
                data: D_UDP_DNS_FILTER,
                canonical_name: "envoy.filters.udp.dns_filter"
            },
            {
                name: 'UDP Proxy',
                path: '/filters/udp/l_udp_proxy',
                value: 226,
                data: D_UDP_PROXY,
                canonical_name: "envoy.filters.udp.udp_proxy"
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
                data: D_HTTP_ADAPTIVE_CONCURRENCY,
                canonical_name: "envoy.filters.http.adaptive_concurrency"
            },
            {
                name: 'Admission Control',
                path: '/filters/http/admission_control',
                value: 50,
                data: D_HTTP_ADMISSION_CONTROL,
                canonical_name: "envoy.filters.http.admission_control"
            },
            {
                name: 'Bandwidth Limit',
                path: '/filters/http/bandwidth_limit',
                value: 50,
                data: D_HTTP_BANDWIDTH_LIMIT,
                canonical_name: "envoy.filters.http.bandwidth_limit"
            },
            {
                name: 'Basic Auth',
                path: '/filters/http/basic_auth',
                value: 125,
                data: D_HTTP_BASIC_AUTH,
                canonical_name: "envoy.filters.http.basic_auth"
            },
            {
                name: 'Buffer',
                path: '/filters/http/buffer',
                value: 50,
                data: D_HTTP_BUFFER,
                canonical_name: "envoy.filters.http.buffer"
            },
            {
                name: 'Compressor',
                path: '/filters/http/compressor',
                value: 50,
                data: D_HTTP_COMPRESSOR,
                canonical_name: "envoy.filters.http.compressor"
            },
            {
                name: 'Cors',
                path: '/filters/http/cors',
                value: 50,
                data: D_HTTP_CORS,
                canonical_name: "envoy.filters.http.cors"
            },
            {
                name: 'Csrf Policy',
                path: '/filters/http/csrf_policy',
                value: 50,
                data: D_HTTP_CSRF_POLICY,
                canonical_name: "envoy.filters.http.csrf"
            },
            {
                name: 'Dynamic Forward Proxy',
                path: '/filters/http/http_dynamic_forward_proxy',
                value: 50,
                data: D_HTTP_DYNAMIC_FORWARD_PROXY,
                canonical_name: "envoy.filters.http.dynamic_forward_proxy"
            },
            {
                name: 'External Authorization',
                path: '/filters/http/http_ext_authz',
                value: 50,
                data: D_HTTP_EXT_AUTHZ,
                canonical_name: "envoy.filters.http.ext_authz"
            },
            {
                name: 'External Processor',
                path: '/filters/http/http_ext_proc',
                value: 50,
                data: D_HTTP_EXT_PROC,
                canonical_name: "envoy.filters.http.ext_proc"
            },
            {
                name: 'gRPC Web',
                path: '/filters/http/grpc_web',
                value: 50,
                data: D_HTTP_GRPC_WEB,
                canonical_name: "envoy.filters.http.grpc_web"
            },
            {
                name: 'gRPC HTTP/1.1 Bridge',
                path: '/filters/http/grpc_http1_bridge',
                value: 50,
                data: D_HTTP_GRPC_HTTP1_BRIDGE,
                canonical_name: "envoy.filters.http.grpc_http1_bridge"
            },
            {
                name: 'Header Mutation',
                path: '/filters/http/header_mutation',
                value: 50,
                data: D_HTTP_HEADER_MUTATION,
                canonical_name: "envoy.filters.http.header_mutation"
            },
            {
                name: 'JWT Authentication',
                path: '/filters/http/http_jwt_authn',
                value: 50,
                data: D_HTTP_JWT_AUTHN,
                canonical_name: "envoy.filters.http.jwt_authn"
            },
            {
                name: 'Local Ratelimit',
                path: '/filters/http/h_local_ratelimit',
                value: 50,
                data: D_HTTP_LOCAL_RATE_LIMIT,
                canonical_name: "envoy.filters.http.local_ratelimit"
            },
            {
                name: 'Lua',
                path: '/filters/http/lua',
                value: 50,
                data: D_HTTP_LUA,
                canonical_name: "envoy.filters.http.lua"
            },
            {
                name: 'OAuth2',
                path: '/filters/http/oauth2',
                value: 500,
                data: D_HTTP_OAUTH2,
                canonical_name: "envoy.filters.http.oauth2"
            },
            {
                name: 'Original Src',
                path: '/filters/http/original_src',
                value: 50,
                data: D_HTTP_ORIGINAL_SRC,
                canonical_name: "envoy.filters.http.original_src"
            },
            {
                name: 'RBAC',
                path: '/filters/http/http_rbac',
                value: 500,
                data: D_HTTP_RBAC,
                canonical_name: "envoy.filters.http.rbac"
            },
            {
                name: 'Router',
                path: '/filters/http/http_router',
                value: 225,
                data: D_HTTP_ROUTER,
                canonical_name: "envoy.filters.http.router"
            },
            {
                name: 'Stateful Session',
                path: '/filters/http/stateful_session',
                value: 50,
                data: D_HTTP_STATEFUL_SESSION,
                canonical_name: "envoy.filters.http.stateful_session"
            },
            {
                name: 'Wasm',
                path: '/filters/http/http_wasm',
                value: 50,
                data: D_HTTP_WASM,
                canonical_name: "envoy.filters.http.wasm"
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
            background: 'var(--empty-state-gradient)',
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
                        background: 'var(--bg-surface)',
                        borderRadius: 10,
                        border: '1px solid var(--border-default)',
                        boxShadow: 'var(--shadow-sm)'
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
                                color: 'var(--text-primary)',
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
                                    border: '1px solid var(--border-default)',
                                    overflow: 'hidden',
                                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                    boxShadow: 'var(--shadow-sm)',
                                    background: 'var(--bg-surface)'
                                }}
                                styles={{ body: { padding: '16px' } }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 6px 20px var(--shadow-card-hover)';
                                    e.currentTarget.style.borderColor = categoryItem.color;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                                    e.currentTarget.style.borderColor = 'var(--border-default)';
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
                                                        color: 'var(--text-primary)',
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
                                            color: 'var(--text-secondary)',
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
                                        background: 'var(--bg-elevated)',
                                        borderRadius: 6,
                                        border: '1px solid var(--border-light)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = categoryItem.color + '15';
                                            e.currentTarget.style.borderColor = categoryItem.color + '30';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'var(--bg-elevated)';
                                            e.currentTarget.style.borderColor = 'var(--border-light)';
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
                                                color: 'var(--text-secondary)',
                                                fontSize: 11,
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px',
                                                fontWeight: 500
                                            }}>
                                                Resources
                                            </Text>
                                        </div>
                                        <RightOutlined style={{
                                            color: 'var(--text-tertiary)',
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
                    background: 'var(--empty-state-gradient)',
                    margin: '14px -20px',
                    borderRadius: 10,
                    overflow: 'hidden'
                }}>
                    {/* Header Section */}
                    <div style={{
                        padding: '18px 20px',
                        background: 'var(--bg-surface)',
                        borderBottom: '1px solid var(--border-default)'
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
                                background: 'var(--gradient-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--text-on-primary)',
                                fontSize: 20,
                                boxShadow: 'var(--shadow-primary)'
                            }}>
                                <InfoCircleOutlined />
                            </div>
                            <div>
                                <h3 style={{
                                    margin: 0,
                                    fontSize: 17,
                                    fontWeight: 600,
                                    color: 'var(--text-primary)',
                                    marginBottom: 3
                                }}>
                                    {modalTitle}
                                </h3>
                                <p style={{
                                    margin: 0,
                                    fontSize: 13,
                                    color: 'var(--text-secondary)'
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
                            background: 'var(--bg-surface)',
                            padding: '18px',
                            borderRadius: 8,
                            border: '1px solid var(--border-default)',
                            boxShadow: 'var(--shadow-sm)'
                        }}>
                            <div style={{
                                margin: 0,
                                lineHeight: 1.7,
                                fontSize: 14,
                                color: 'var(--text-primary)'
                            }}>
                                <ReactMarkdown
                                    components={{
                                        h1: ({ node, ...props }) => <h1 style={{ color: 'var(--color-primary)', fontSize: '18px', fontWeight: 700, margin: '20px 0 12px 0' }} {...props} />,
                                        h2: ({ node, ...props }) => <h2 style={{ color: 'var(--color-primary)', fontSize: '16px', fontWeight: 600, margin: '20px 0 12px 0' }} {...props} />,
                                        h3: ({ node, ...props }) => <h3 style={{ color: 'var(--color-primary)', fontSize: '15px', fontWeight: 600, margin: '18px 0 10px 0' }} {...props} />,
                                        p: ({ node, ...props }) => <p style={{ margin: '12px 0', lineHeight: 1.7, color: 'var(--text-primary)' }} {...props} />,
                                        ul: ({ node, ...props }) => <ul style={{ margin: '12px 0', paddingLeft: '20px', listStyleType: 'disc' }} {...props} />,
                                        ol: ({ node, ...props }) => <ol style={{ margin: '12px 0', paddingLeft: '20px', listStyleType: 'decimal' }} {...props} />,
                                        li: ({ node, ...props }) => <li style={{ margin: '6px 0', color: 'var(--text-secondary)', lineHeight: 1.6 }} {...props} />,
                                        strong: ({ node, ...props }) => <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }} {...props} />,
                                        em: ({ node, ...props }) => <em style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }} {...props} />,
                                        code: ({ node, ...props }) => <code style={{ background: 'var(--code-bg)', border: '1px solid var(--border-default)', borderRadius: '4px', padding: '2px 6px', fontFamily: 'Monaco, Consolas, monospace', fontSize: '13px', color: 'var(--color-danger)' }} {...props} />,
                                        blockquote: ({ node, ...props }) => (
                                            <blockquote style={{
                                                margin: '16px 0',
                                                padding: '12px 16px',
                                                background: 'var(--color-primary-bg)',
                                                borderLeft: '4px solid var(--color-primary)',
                                                borderRadius: '0 8px 8px 0',
                                                color: 'var(--text-primary)'
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
                            background: 'var(--gradient-primary)',
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