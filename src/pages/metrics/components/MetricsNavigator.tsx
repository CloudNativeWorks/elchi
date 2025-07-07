import React, { useState, useMemo } from 'react';
import { Drawer, Input, Typography, Divider } from 'antd';
import { 
    SearchOutlined, 
    MenuOutlined, 
    CloseOutlined,
    RightOutlined,
    BarChartOutlined,
    DashboardOutlined
} from '@ant-design/icons';
import { METRICS } from '../metricConfigs/MetricConfig';
import { NavigatorContainer, FloatingButton, SearchContainer, SectionHeader, MetricItem, CountBadge } from '../styles';
import { MetricConfig } from '../metricConfigs/MetricConfig';

const { Title, Text } = Typography;

interface MetricsNavigatorProps {
    selectedService?: string;
    onMetricClick: (metricIndex: number, sectionName: string) => void;//eslint-disable-line
    metrics?: MetricConfig[]; // Filtrelenmiş metrikler
}

const MetricsNavigator: React.FC<MetricsNavigatorProps> = ({ 
    selectedService, 
    onMetricClick,
    metrics
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchText, setSearchText] = useState('');

    // Group metrics by section
    const groupedMetrics = useMemo(() => {
        const metricsToUse = metrics || METRICS; // Fallback to all metrics
        return metricsToUse.reduce((acc, metric, index) => {
            if (!acc[metric.section]) {
                acc[metric.section] = [];
            }
            acc[metric.section].push({ ...metric, index });
            return acc;
        }, {} as { [key: string]: Array<typeof METRICS[0] & { index: number }> });
    }, [metrics]);

    // Filter metrics based on search
    const filteredMetrics = useMemo(() => {
        if (!searchText.trim()) {
            return groupedMetrics;
        }

        const searchLower = searchText.toLowerCase();
        const filtered: typeof groupedMetrics = {};

        Object.entries(groupedMetrics).forEach(([section, metrics]) => {
            const filteredSectionMetrics = metrics.filter(metric => 
                metric.title.toLowerCase().includes(searchLower) ||
                metric.metric.toLowerCase().includes(searchLower)
            );

            if (filteredSectionMetrics.length > 0) {
                filtered[section] = filteredSectionMetrics;
            }
        });

        return filtered;
    }, [groupedMetrics, searchText]);

    const totalMetrics = Object.values(filteredMetrics).reduce((sum, metrics) => sum + metrics.length, 0);

    const handleMetricClick = (metricIndex: number, sectionName: string) => {
        onMetricClick(metricIndex, sectionName);
        setIsOpen(false);
    };

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const renderMetricsList = () => {
        return Object.entries(filteredMetrics).map(([section, metrics]) => (
            <div key={section}>
                <SectionHeader>
                    <DashboardOutlined />
                    <Title level={5}>{section}</Title>
                    <CountBadge count={metrics.length} />
                </SectionHeader>
                
                {metrics.map((metric) => (
                    <MetricItem
                        key={metric.index}
                        $isHighlighted={false}
                        onClick={() => handleMetricClick(metric.index, section)}
                    >
                        <div>
                            <div className="metric-title"><RightOutlined/> {metric.title}</div>
                            <div className="metric-meta">
                                <Text type="secondary">{metric.metric}</Text>
                            </div>
                        </div>
                    </MetricItem>
                ))}
            </div>
        ));
    };

    return (
        <>
            <NavigatorContainer>
                <FloatingButton
                    $isOpen={isOpen}
                    onClick={handleToggle}
                    icon={isOpen ? <CloseOutlined /> : <MenuOutlined />}
                    type="primary"
                />
            </NavigatorContainer>

            <Drawer
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <BarChartOutlined style={{ color: '#1890ff' }} />
                        <span>Metrics Navigator</span>
                        <CountBadge count={totalMetrics} />
                    </div>
                }
                placement="right"
                onClose={() => setIsOpen(false)}
                open={isOpen}
                width={400}
                styles={{
                    body: {
                        padding: 0
                    },
                    header: { 
                        background: 'linear-gradient(90deg, #1890ff 0%, #096dd9 100%)',
                        color: 'white'
                    }
                }}
                closeIcon={<CloseOutlined style={{ color: 'white' }} />}
            >
                <SearchContainer>
                    <Input
                        placeholder="Search metric titles and fields..."
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        allowClear
                        size="large"
                    />
                    {searchText && (
                        <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                            {totalMetrics} metric(s) found
                        </div>
                    )}
                </SearchContainer>

                {!selectedService ? (
                    <div style={{ 
                        padding: '40px 20px', 
                        textAlign: 'center', 
                        color: '#999' 
                    }}>
                        <DashboardOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                        <div>Please select a service first</div>
                    </div>
                ) : totalMetrics === 0 ? (
                    <div style={{ 
                        padding: '40px 20px', 
                        textAlign: 'center', 
                        color: '#999' 
                    }}>
                        <SearchOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                        <div>No metrics found</div>
                        <div style={{ fontSize: '12px', marginTop: '8px' }}>
                            Try different search terms
                        </div>
                    </div>
                ) : (
                    <div style={{ height: 'calc(100vh - 180px)', overflowY: 'auto' }}>
                        {renderMetricsList()}
                    </div>
                )}

                <Divider style={{ margin: 0 }} />
                <div style={{ 
                    padding: '12px 16px', 
                    background: '#fafafa', 
                    textAlign: 'center',
                    fontSize: '12px',
                    color: '#999'
                }}>
                    Click on any metric to navigate
                </div>
            </Drawer>
        </>
    );
};

export default MetricsNavigator; 