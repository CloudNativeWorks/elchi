import { NavLink, useParams } from 'react-router-dom';
import { getFieldsByKey } from '@/common/statics/gtypes';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import CustomDataTable from '@/elchi/components/common/dataTable';
import CustomListenerDataTable from '@/elchi/components/common/listenerDataTable';
import ElchiButton from '@/elchi/components/common/ElchiButton';
import { useState } from 'react';
import { Input, Typography, Space, Card } from 'antd';
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
    CodeOutlined
} from '@ant-design/icons';


const { Title, Text } = Typography;

const Resources: React.FC = () => {
    const { resource } = useParams();
    const resourceStatic = getFieldsByKey(resource)
    const { project } = useProjectVariable();
    const [searchText, setSearchText] = useState('');

    // Get the icon based on resource type - matching Sidenav icons
    const getResourceIcon = () => {
        const iconMap = {
            'listener': <GlobalOutlined style={{ color: '#1890ff', fontSize: 24 }} />,
            'route': <ShareAltOutlined style={{ color: '#52c41a', fontSize: 24 }} />,
            'virtual_host': <CloudOutlined style={{ color: '#722ed1', fontSize: 24 }} />,
            'cluster': <ClusterOutlined style={{ color: '#fa8c16', fontSize: 24 }} />,
            'endpoint': <AimOutlined style={{ color: '#13c2c2', fontSize: 24 }} />,
            'tls': <SafetyOutlined style={{ color: '#fa541c', fontSize: 24 }} />,
            'secret': <KeyOutlined style={{ color: '#f5222d', fontSize: 24 }} />,
            'filter': <FilterOutlined style={{ color: '#eb2f96', fontSize: 24 }} />,
            'filters': <FilterOutlined style={{ color: '#eb2f96', fontSize: 24 }} />,
            'extension': <AppstoreOutlined style={{ color: '#faad14', fontSize: 24 }} />,
            'extensions': <AppstoreOutlined style={{ color: '#faad14', fontSize: 24 }} />,
            'bootstrap': <CodeOutlined style={{ color: '#096dd9', fontSize: 24 }} />
        };
        return iconMap[resource] || <AppstoreOutlined style={{ color: '#1890ff', fontSize: 24 }} />;
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
                        <Input.Search
                            placeholder="Search resources..."
                            allowClear
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            style={{ width: 250 }}
                            prefix={<SearchOutlined />}
                        />
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
                {resource !== 'listener' ?
                    <CustomDataTable path={`${resourceStatic.backendPath}?project=${project}`} searchText={searchText} /> :
                    <CustomListenerDataTable path={`${resourceStatic.backendPath}?project=${project}`} searchText={searchText} />
                }
            </Card>
        </>
    );
}

export default Resources;
