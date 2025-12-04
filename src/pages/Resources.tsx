import { NavLink, useParams } from 'react-router-dom';
import { getFieldsByKey } from '@/common/statics/gtypes';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import CustomDataTable from '@/elchi/components/common/dataTable';
import ElchiButton from '@/elchi/components/common/ElchiButton';
import ListenerUpgradeModal from '@/elchi/components/common/ListenerUpgradeModal';
import { useState, useEffect } from 'react';
import { Typography, Space, Card, Row, Col, Input, Button, Select } from 'antd';
import {
    SearchOutlined,
    GlobalOutlined,
    ShareAltOutlined,
    CloudOutlined,
    ClusterOutlined,
    AimOutlined,
    SafetyOutlined,
    KeyOutlined,
    FilterOutlined,
    AppstoreOutlined,
    CodeOutlined,
    ClearOutlined,
    ArrowUpOutlined
} from '@ant-design/icons';


const { Title, Text } = Typography;

const Resources: React.FC = () => {
    const { resource } = useParams();
    const resourceStatic = getFieldsByKey(resource)
    const { project } = useProjectVariable();
    const [filters, setFilters] = useState<Record<string, any>>({});
    const [tempFilters, setTempFilters] = useState<Record<string, any>>({});
    const [selectedListeners, setSelectedListeners] = useState<string[]>([]);
    const [selectedVersion, setSelectedVersion] = useState<string>('');
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    // Get the icon based on resource type - matching Sidenav icons
    const getResourceIcon = () => {
        const iconMap = {
            'listeners': <GlobalOutlined style={{ color: '#1890ff', fontSize: 24 }} />,
            'routes': <ShareAltOutlined style={{ color: '#52c41a', fontSize: 24 }} />,
            'virtual_hosts': <CloudOutlined style={{ color: '#722ed1', fontSize: 24 }} />,
            'clusters': <ClusterOutlined style={{ color: '#fa8c16', fontSize: 24 }} />,
            'endpoints': <AimOutlined style={{ color: '#13c2c2', fontSize: 24 }} />,
            'tls': <SafetyOutlined style={{ color: '#fa541c', fontSize: 24 }} />,
            'secrets': <KeyOutlined style={{ color: '#f5222d', fontSize: 24 }} />,
            'filter': <FilterOutlined style={{ color: '#eb2f96', fontSize: 24 }} />,
            'filters': <FilterOutlined style={{ color: '#eb2f96', fontSize: 24 }} />,
            'extension': <AppstoreOutlined style={{ color: '#faad14', fontSize: 24 }} />,
            'extensions': <AppstoreOutlined style={{ color: '#faad14', fontSize: 24 }} />,
            'bootstrap': <CodeOutlined style={{ color: '#096dd9', fontSize: 24 }} />
        };
        return iconMap[resourceStatic.collection] || <AppstoreOutlined style={{ color: '#1890ff', fontSize: 24 }} />;
    };

    const getResourceDescription = () => {
        const descriptions = {
            'listener': 'HTTP and TCP listeners that handle incoming traffic and route requests to upstream services.',
            'cluster': 'Upstream service clusters defining backend services and load balancing configuration.',
            'route': 'HTTP route configurations that match requests and direct them to appropriate clusters.',
            'endpoint': 'Service endpoint configurations for load balancing and health checking.',
            'virtual_host': 'Virtual host definitions for domain-based routing and SSL termination.',
            'filter': 'HTTP and network filters for request/response processing and security.',
            'filters': 'HTTP and network filters for request/response processing and security.',
            'extension': 'Proxy extensions including access loggers, tracing, and custom processors.',
            'extensions': 'Proxy extensions including access loggers, tracing, and custom processors.',
            'secret': 'TLS certificates, private keys, and other sensitive configuration data.',
            'tls': 'TLS context configurations for secure connections and certificate management.',
            'bootstrap': 'Core Proxy bootstrap configurations including admin interface and basic settings.',
            'access_log': 'Access logging configurations for tracking request/response patterns and debugging.',
            'stat_sinks': 'Statistics sinks for exporting metrics to external monitoring systems.',
            'hcefs': 'Health check event file sink for logging health check status changes.',
            'cors': 'Cross-Origin Resource Sharing (CORS) policies for web browser security.',
            'grpc_web': 'gRPC-Web filter enabling gRPC services to be called from web browsers.',
            'grpc_http1_bridge': 'gRPC HTTP/1.1 bridge for gRPC compatibility with HTTP/1.1 clients.',
            'header_mutation': 'HTTP header manipulation for request and response header modifications.',
            'header_mutation_per_route': 'Per-route header mutation overrides for specific routing rules.',
            'bandwidth_limit': 'Bandwidth limiting filter for controlling data transfer rates.',
            'compressor': 'Response compression filter supporting gzip, brotli, and other algorithms.',
            'compressor_library': 'Compression library configurations for response compression algorithms.',
            'original_ip_detection': 'Original client IP detection from X-Forwarded-For or custom headers.',
            'http_protocol_options': 'HTTP protocol options for upstream connections and behaviors.',
            'lua': 'Lua scripting filter for custom request/response processing logic.',
            'lua_per_route': 'Per-route Lua script overrides for specific routing rules.',
            'buffer': 'Request buffering filter for buffering request bodies before processing.',
            'buffer_per_route': 'Per-route buffer configuration overrides for specific routing rules.',
            'original_src': 'Original source address preservation for maintaining client IP addresses.',
            'adaptive_concurrency': 'Adaptive concurrency control for automatic load management.',
            'utm': 'URI template matching for advanced path matching patterns.',
            'admission_control': 'Admission control filter for request throttling and rate limiting.',
            'stateful_session': 'Stateful session management for maintaining user session state.',
            'stateful_session_per_route': 'Per-route stateful session overrides for specific routing rules.',
            'session_state': 'Session state storage configurations for cookie or header-based sessions.',
            'csrf_policy': 'Cross-Site Request Forgery (CSRF) protection policies.',
            'l_local_ratelimit': 'Listener-level local rate limiting for connection throttling.',
            'l_http_inspector': 'HTTP inspector listener filter for protocol detection.',
            'l_original_dst': 'Original destination listener filter for transparent proxying.',
            'l_original_src': 'Original source listener filter for preserving client addresses.',
            'l_tls_inspector': 'TLS inspector listener filter for SNI and ALPN detection.',
            'l_dns_filter': 'DNS filter for DNS request/response processing at listener level.',
            'l_udp_proxy': 'UDP proxy listener filter for UDP traffic handling.',
            'l_proxy_protocol': 'Proxy Protocol listener filter for HAProxy compatibility.',
            'connection_limit': 'Connection limiting filter for controlling concurrent connections.',
            'n_local_ratelimit': 'Network-level local rate limiting for TCP connection throttling.',
            'h_local_ratelimit': 'HTTP-level local rate limiting for request throttling.',
            'oauth2': 'OAuth 2.0 authentication filter for token-based authentication.',
            'open_telemetry': 'OpenTelemetry integration for distributed tracing and observability.',
            'http_wasm': 'WebAssembly (WASM) filter for custom HTTP processing with WASM modules.',
            'http_ext_proc': 'External processing filter for delegating request processing to external services.',
            'http_ext_proc_per_route': 'Per-route external processing overrides for specific routing rules.',
            'http_ext_authz': 'External authorization filter for delegating auth decisions to external services.',
            'http_ext_authz_per_route': 'Per-route external authorization overrides for specific routing rules.',
            'http_jwt_authn': 'JWT authentication filter for validating JSON Web Tokens.',
            'http_jwt_authn_per_route': 'Per-route JWT authentication overrides for specific routing rules.',
            'http_dynamic_forward_proxy': 'Dynamic forward proxy for on-demand DNS resolution and connection pooling.',
            'http_dynamic_forward_proxy_per_route': 'Per-route dynamic forward proxy overrides for specific routing rules.',
            'cluster_dynamic_forward_proxy': 'Cluster dynamic forward proxy for dynamic upstream resolution.'
        };
        return descriptions[resource] || `${resourceStatic?.prettyName || resource} configuration resources for your Proxy.`;
    };

    // Reset all states when resource changes
    useEffect(() => {
        setFilters({});
        setTempFilters({});
        setSelectedListeners([]);
        setSelectedVersion('');
    }, [resource]);

    const applyFilters = () => {
        setFilters(tempFilters);
    };

    const clearFilters = () => {
        setTempFilters({});
        setFilters({});
    };

    return (
        <>
            {/* Header Section - Outside Card */}
            <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <Space>
                        {getResourceIcon()}
                        <Title level={4} style={{ margin: 0 }}>
                            {resourceStatic?.groupPrettyName}
                        </Title>
                    </Space>
                    <Space>
                        {resource === 'listener' && selectedListeners.length > 0 && selectedVersion && (
                            <ElchiButton icon={<ArrowUpOutlined />} onClick={() => setShowUpgradeModal(true)}>
                                Upgrade ({selectedListeners.length}) from {selectedVersion}
                            </ElchiButton>
                        )}
                        {resource !== 'bootstrap' && (
                            <NavLink to={resourceStatic.createPath}>
                                <ElchiButton>Add New</ElchiButton>
                            </NavLink>
                        )}
                    </Space>
                </div>

                <Text type="secondary">
                    {getResourceDescription()}
                </Text>
            </div>

            {/* Filter Bar */}
            <Card
                size="small"
                style={{
                    marginBottom: 16,
                    borderRadius: 12,
                    boxShadow: '0 2px 8px rgba(5,117,230,0.06)'
                }}
            >
                <Row gutter={[16, 16]} align="middle">
                    <Col span={8}>
                        <Input
                            placeholder="Search by name..."
                            allowClear
                            prefix={<SearchOutlined />}
                            value={tempFilters.name}
                            onChange={(e) => setTempFilters(prev => ({ ...prev, name: e.target.value }))}
                            onPressEnter={applyFilters}
                        />
                    </Col>
                    <Col span={6}>
                        <Select
                            placeholder="Filter by version"
                            allowClear
                            value={tempFilters.version || undefined}
                            onChange={(value) => setTempFilters(prev => ({ ...prev, version: value }))}
                            style={{ width: '100%' }}
                            options={window.APP_CONFIG.AVAILABLE_VERSIONS.map(version => ({
                                label: version,
                                value: version
                            }))}
                        />
                    </Col>
                    <Col span={10}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Space>
                                <Button
                                    icon={<SearchOutlined />}
                                    onClick={applyFilters}
                                    style={{
                                        borderRadius: 6,
                                        background: 'white',
                                        border: '1px solid #d9d9d9',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'linear-gradient(90deg, #056ccd 0%, #00c6fb 100%)';
                                        e.currentTarget.style.color = 'white';
                                        e.currentTarget.style.borderColor = '#056ccd';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'white';
                                        e.currentTarget.style.color = 'rgba(0, 0, 0, 0.88)';
                                        e.currentTarget.style.borderColor = '#d9d9d9';
                                    }}
                                >
                                    Search
                                </Button>
                                {(Object.keys(tempFilters).length > 0 || Object.keys(filters).length > 0) && (
                                    <Button
                                        icon={<ClearOutlined />}
                                        onClick={clearFilters}
                                        style={{ borderRadius: 6 }}
                                    >
                                        Clear
                                    </Button>
                                )}
                            </Space>
                        </div>
                    </Col>
                </Row>
            </Card>

            {/* Data Table Card */}
            <Card
                style={{
                    borderRadius: 12,
                    boxShadow: '0 2px 8px rgba(5,117,230,0.06)',
                }}
                styles={{
                    body: { padding: 12 }
                }}
            >
                <CustomDataTable
                    key={resource}
                    path={`${resourceStatic.backendPath}?project=${project}`}
                    filters={filters}
                    isListener={resource === 'listener'}
                    consolidateVersions={resource !== 'listener'}
                    selectedListeners={selectedListeners}
                    onSelectionChange={(names, version) => {
                        setSelectedListeners(names);
                        setSelectedVersion(version || '');
                    }}
                />
            </Card>

            {/* Listener Upgrade Modal */}
            {resource === 'listener' && (
                <ListenerUpgradeModal
                    visible={showUpgradeModal}
                    onClose={() => {
                        setShowUpgradeModal(false);
                        setSelectedListeners([]);
                        setSelectedVersion('');
                    }}
                    selectedListeners={selectedListeners}
                    project={project}
                    currentVersion={selectedVersion || filters.version || window.APP_CONFIG?.AVAILABLE_VERSIONS?.[0] || '1.36.2'}
                    onSuccess={() => {
                        setSelectedListeners([]);
                        // Trigger data refresh by changing filters
                        setFilters({ ...filters });
                    }}
                />
            )}
        </>
    );
}

export default Resources;
