import { Card, Typography, Row, Col, Button } from 'antd';
import {
    DashboardOutlined,
    ExclamationCircleOutlined,
    CheckCircleOutlined,
    ArrowRightOutlined,
    FilterOutlined,
    ClusterOutlined,
    BarChartOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface EmptyStateCardProps {
    selectedGroup?: string;
    onGroupSelect?: (group: string) => void;//eslint-disable-line
}

export const EmptyStateCard: React.FC<EmptyStateCardProps> = ({
    selectedGroup = 'all',
    onGroupSelect
}) => {
    const handleGroupSelect = (groupKey: string) => {
        onGroupSelect?.(groupKey);
    };

    const groupOptions = [
        {
            key: 'all',
            title: 'All Metrics',
            description: 'Monitor all service metrics including all indicators',
            icon: <DashboardOutlined />,
            color: '#1890ff',
            gradient: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
            features: ['Performance Monitoring', 'Resource Usage', 'Request Analytics']
        },
        {
            key: 'errors',
            title: 'Negative Metrics',
            description: 'Focus on error tracking, failure rates, and service reliability metrics',
            icon: <ExclamationCircleOutlined />,
            color: '#ff4d4f',
            gradient: 'linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)',
            features: ['Error Rates', 'Failed Requests', 'Exception Tracking']
        },
        {
            key: 'filters',
            title: 'Filter Metrics',
            description: 'Focus on Network, Listener and HTTP filter metrics',
            icon: <FilterOutlined />,
            color: 'rgb(13, 171, 210)',
            gradient: 'linear-gradient(135deg,rgb(13, 171, 210) 0%,rgb(117, 204, 255) 100%)',
            features: ['HTTP Filter Metrics', 'Network Filter Metrics', 'Listener Filter Metrics']
        },
        {
            key: 'clusters',
            title: 'Cluster Metrics',
            description: 'Focus on Cluster, Upstream, Health and Outlier Detection',
            icon: <ClusterOutlined />,
            color: 'rgb(44, 155, 4)',
            gradient: 'linear-gradient(135deg,rgb(44, 155, 4) 0%,rgb(59, 184, 14) 100%)',
            features: ['Cluster Metrics', 'Upstream Requests', 'Outlier Detection']
        }
    ];

    return (
        <div style={{
            minHeight: '70vh',
            background: 'linear-gradient(135deg, #f0f2f5 0%, #e6f7ff 100%)',
            padding: '40px 24px',
            borderRadius: '12px'
        }}>
            {/* Header Section */}
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                    fontSize: '32px',
                    color: 'white',
                    boxShadow: '0 8px 24px rgba(24, 144, 255, 0.3)'
                }}>
                    <DashboardOutlined />
                </div>

                <Title level={2} style={{
                    color: '#262626',
                    marginBottom: '12px',
                    fontWeight: 600
                }}>
                    Welcome to Metrics Dashboard
                </Title>

                <Text style={{
                    color: '#8c8c8c',
                    fontSize: '16px',
                    display: 'block',
                    maxWidth: '600px',
                    margin: '0 auto 20px',
                    lineHeight: '1.6'
                }}>
                    Get started by selecting a metric group and choosing a service to monitor
                </Text>

                <Button
                    type="primary"
                    size="large"
                    icon={<BarChartOutlined />}
                    onClick={() => window.location.href = '/grafana'}
                    style={{
                        background: 'linear-gradient(135deg, #722ed1 0%, #1890ff 100%)',
                        border: 'none',
                        height: '48px',
                        padding: '0 32px',
                        fontSize: '16px',
                        fontWeight: 500,
                        boxShadow: '0 4px 16px rgba(114, 46, 209, 0.3)',
                        borderRadius: '8px'
                    }}
                >
                    Advanced Metrics
                </Button>
            </div>

            {/* Step Indicator */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    background: 'white',
                    padding: '12px 24px',
                    borderRadius: '24px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    border: '1px solid #f0f0f0'
                }}>
                    <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: selectedGroup ? '#52c41a' : '#1890ff',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 600,
                        marginRight: '8px'
                    }}>
                        {selectedGroup ? <CheckCircleOutlined /> : '1'}
                    </div>
                    <Text style={{ color: '#595959', fontWeight: 500 }}>
                        Choose Metric Group
                    </Text>

                    <ArrowRightOutlined style={{
                        color: '#d9d9d9',
                        margin: '0 16px',
                        fontSize: '12px'
                    }} />

                    <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: '#d9d9d9',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 600,
                        marginRight: '8px'
                    }}>
                        2
                    </div>
                    <Text style={{ color: '#8c8c8c' }}>
                        Select Service
                    </Text>
                </div>
            </div>

            {/* Group Selection Cards */}
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <Row gutter={[16, 16]} justify="center">
                    {groupOptions.map((option) => {
                        const isSelected = selectedGroup === option.key;
                        return (
                            <Col xs={8} md={6} key={option.key}>
                                <Card
                                    hoverable
                                    onClick={() => handleGroupSelect(option.key)}
                                    style={{
                                        height: '380px',
                                        borderRadius: '16px',
                                        border: isSelected ? `2px solid ${option.color}` : '1px solid #f0f0f0',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        boxShadow: isSelected
                                            ? `0 8px 32px ${option.color}25`
                                            : '0 4px 16px rgba(0,0,0,0.08)',
                                        transform: isSelected ? 'translateY(-4px)' : 'none',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                    styles={{
                                        body: {
                                            padding: '24px 20px',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between'
                                        }
                                    }}
                                >
                                    {/* Selection Badge */}
                                    {isSelected && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '16px',
                                            right: '16px',
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            background: option.color,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '12px'
                                        }}>
                                            <CheckCircleOutlined />
                                        </div>
                                    )}

                                    {/* Header */}
                                    <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                                        <div style={{
                                            width: '56px',
                                            height: '56px',
                                            borderRadius: '14px',
                                            background: option.gradient,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto 12px',
                                            fontSize: '20px',
                                            color: 'white',
                                            boxShadow: `0 4px 16px ${option.color}30`
                                        }}>
                                            {option.icon}
                                        </div>

                                        <Title level={5} style={{
                                            color: isSelected ? option.color : '#262626',
                                            marginBottom: '6px',
                                            transition: 'color 0.3s ease'
                                        }}>
                                            {option.title}
                                        </Title>

                                        <Text style={{
                                            color: '#8c8c8c',
                                            lineHeight: '1.4',
                                            fontSize: '13px'
                                        }}>
                                            {option.description}
                                        </Text>
                                    </div>

                                    {/* Features */}
                                    <div style={{ flex: 1 }}>
                                        <div style={{
                                            background: '#fafafa',
                                            borderRadius: '8px',
                                            padding: '12px',
                                            minHeight: '120px'
                                        }}>
                                            <Text style={{
                                                fontSize: '11px',
                                                color: '#8c8c8c',
                                                fontWeight: 500,
                                                marginBottom: '6px',
                                                display: 'block'
                                            }}>
                                                INCLUDED FEATURES
                                            </Text>
                                            {option.features.map((feature, index) => (
                                                <div key={index} style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    marginBottom: '4px'
                                                }}>
                                                    <div style={{
                                                        width: '4px',
                                                        height: '4px',
                                                        borderRadius: '50%',
                                                        background: option.color,
                                                        marginRight: '8px'
                                                    }} />
                                                    <Text style={{
                                                        fontSize: '12px',
                                                        color: '#595959'
                                                    }}>
                                                        {feature}
                                                    </Text>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action Indicator */}
                                    <div style={{
                                        marginTop: '12px',
                                        textAlign: 'center',
                                        padding: '13px',
                                        background: isSelected ? `${option.color}08` : '#f9f9f9',
                                        borderRadius: '8px',
                                        border: isSelected ? `1px solid ${option.color}20` : '1px solid #f0f0f0'
                                    }}>
                                        <Text style={{
                                            fontSize: '11px',
                                            color: isSelected ? option.color : '#8c8c8c',
                                            fontWeight: 500
                                        }}>
                                            {isSelected ? 'SELECTED' : 'CLICK TO SELECT'}
                                        </Text>
                                    </div>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>

                {/* Next Step Indicator */}
                <div style={{
                    textAlign: 'center',
                    marginTop: '32px',
                    padding: '24px',
                    background: 'white',
                    borderRadius: '12px',
                    border: '1px solid #f0f0f0'
                }}>
                    <Text style={{
                        color: '#8c8c8c',
                        fontSize: '14px'
                    }}>
                        💡 After selecting a metric group, choose a service from the dropdown above to start monitoring
                    </Text>
                </div>
            </div>
        </div>
    );
};
