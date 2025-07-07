import React, { useState } from "react";
import { Col, Row, Card, Typography, Divider, Statistic, Button, Modal } from "antd";
import { NavLink } from "react-router-dom";
import CountUp from 'react-countup';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useCustomGetQuery } from "@/common/api";
import { useProjectVariable } from "@/hooks/useProjectVariable";


const { Title } = Typography;

const formatter = (value: number | string) => {
    const numericValue = typeof value === 'number' ? value : parseFloat(value);
    return <CountUp end={numericValue} />;
};

const filters = [
    {
        category: 'Listener Filters', filters: [
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
        category: 'UDP Listener Filters', filters: [
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

    const openModalWithFilterData = (data: string) => {
        setModalContent(data);
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
        <>
            {filters.map((categoryItem) => (
                <React.Fragment key={categoryItem.category}>
                    <Divider type="horizontal" orientation="left" orientationMargin="0">
                        {categoryItem.category}
                    </Divider>
                    {categoryItem.filters.length > 0 && (
                        <Row style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                            {categoryItem.filters.map((filter) => (
                                <Card variant={'borderless'} className="criclebox" key={filter.name}>
                                    <Col xs={24}>
                                        <NavLink to={filter.path}>
                                            <Title level={4}>{filter.name}</Title>
                                        </NavLink>
                                    </Col>
                                    <Col xs={24}>
                                        <Row justify="space-between" align="middle">
                                            <Statistic value={dataQuery?.[filter?.canonical_name] || 0} formatter={formatter} />
                                            <Button onClick={() => openModalWithFilterData(filter.data)}><InfoCircleOutlined /></Button>
                                        </Row>
                                    </Col>
                                </Card>
                            ))}
                        </Row>
                    )}
                </React.Fragment>
            ))}
            <Modal
                title="Filter Details"
                open={isModalVisible}
                onCancel={handleModalClose}
                footer={null}
            >
                <Typography.Paragraph>
                    {modalContent}
                </Typography.Paragraph>
            </Modal>
        </>
    );
}

export default FilterMain;