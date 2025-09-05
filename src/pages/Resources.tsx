import { NavLink, useParams } from 'react-router-dom';
import { getFieldsByKey } from '@/common/statics/gtypes';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import CustomDataTable from '@/elchi/components/common/dataTable';
import ElchiButton from '@/elchi/components/common/ElchiButton';
import { useState } from 'react';
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
    ClearOutlined
} from '@ant-design/icons';


const { Title, Text } = Typography;

const Resources: React.FC = () => {
    const { resource } = useParams();
    const resourceStatic = getFieldsByKey(resource)
    const { project } = useProjectVariable();
    const [filters, setFilters] = useState<Record<string, any>>({});
    const [tempFilters, setTempFilters] = useState<Record<string, any>>({});

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
            'bootstrap': 'Core Proxy bootstrap configurations including admin interface and basic settings.'
        };
        return descriptions[resource] || `${resourceStatic?.prettyName || resource} configuration resources for your Proxy.`;
    };

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
                            {resourceStatic?.prettyName || resource?.charAt(0).toUpperCase() + resource?.slice(1)}
                        </Title>
                    </Space>
                    <Space>
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
                    path={`${resourceStatic.backendPath}?project=${project}`} 
                    filters={filters} 
                    isListener={resource === 'listener'} 
                />
            </Card>
        </>
    );
}

export default Resources;
