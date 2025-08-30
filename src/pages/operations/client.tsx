import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Spin, Typography, Tag, Descriptions, Alert, Tabs, Divider, Drawer, Button, Row, Col } from 'antd';
import { FileTextOutlined, InfoCircleOutlined, AppstoreOutlined, BarChartOutlined, CloudDownloadOutlined } from '@ant-design/icons';
import { useCustomGetQuery } from '@/common/api';
import { DateTimeTool } from '@/utils/date-time-tool';
import ServiceInfoCard from '@components/services/ServiceInfoCard';
import ClientLogs from '@components/clients/ClientLogs';
import ClientStats from '@components/clients/ClientStats';
import ClientNetwork from '@components/clients/ClientNetwork';
import ClientVersions from '@components/clients/ClientVersions';

const { Title, Text } = Typography;

const ClientDetail: React.FC = () => {
    const { client_id } = useParams();
    const [metadataDrawerVisible, setMetadataDrawerVisible] = useState(false);
    const { isLoading: isLoadingClient, data: dataClient, error: errorClient } = useCustomGetQuery({
        queryKey: `client_detail_${client_id}`,
        enabled: !!client_id,
        path: `api/op/clients/${client_id}`,
        directApi: true
    });

    if (isLoadingClient) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}><Spin size="large" /></div>;
    }

    if (errorClient || !dataClient) {
        return <Alert type="error" message="Client not found or error occurred." showIcon style={{ margin: 32 }} />;
    }

    return (
        <div style={{ width: '100%', marginTop: '3px', padding: 0 }}>
            <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(5,117,230,0.06)', margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            <svg fill="#056ccd" viewBox="-5.4 -5.4 46.80 46.80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" width="32" height="32" style={{ marginRight: 6 }}>
                                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                <g id="SVGRepo_iconCarrier">
                                    <title>thin-client-line</title>
                                    <path d="M13,30H5a1,1,0,0,1-1-1V4A2,2,0,0,1,6,2h6a2,2,0,0,1,2,2V29A1,1,0,0,1,13,30ZM6,28h6V4H6Z"></path>
                                    <circle cx="9" cy="7.42" r="1.5"></circle>
                                    <path d="M15,34H3a1,1,0,0,1,0-2H15a1,1,0,0,1,0,2Z"></path>
                                    <rect x="7.55" y="12.2" width="3" height="1.6"></rect>
                                    <rect x="7.55" y="15.2" width="3" height="1.6"></rect>
                                    <rect x="7.55" y="18.2" width="3" height="1.6"></rect>
                                    <rect x="16" y="8" width="2" height="1.6"></rect>
                                    <rect x="20" y="8" width="2" height="1.6"></rect>
                                    <path d="M33,11.8H25a.8.8,0,0,1-.8-.8V5a.8.8,0,0,1,.8-.8h8a.8.8,0,0,1,.8.8v6A.8.8,0,0,1,33,11.8Zm-7.2-1.6h6.4V5.8H25.8Z"></path>
                                    <rect x="16" y="20" width="2" height="1.6"></rect>
                                    <rect x="20" y="20" width="2" height="1.6"></rect>
                                    <path d="M33,23.8H25a.8.8,0,0,1-.8-.8V17a.8.8,0,0,1,.8-.8h8a.8.8,0,0,1,.8.8v6A.8.8,0,0,1,33,23.8Zm-7.2-1.6h6.4V17.8H25.8Z"></path>
                                    <rect width="36" height="36" fillOpacity="0"></rect>
                                </g>
                            </svg>
                        </span>
                        <Title level={4} style={{ margin: 0 }}>{dataClient.name}</Title>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            background: dataClient.connected ? '#f6ffed' : '#fff1f0',
                            color: dataClient.connected ? '#389e0d' : '#ff4d4f',
                            borderRadius: 16,
                            padding: '4px 14px',
                            fontWeight: 700,
                            fontSize: 15,
                            boxShadow: dataClient.connected
                                ? '0 1px 4px rgba(82,196,26,0.08)'
                                : '0 1px 4px rgba(255,77,79,0.08)'
                        }}>
                            <span style={{
                                display: 'inline-block',
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                background: dataClient.connected ? '#52c41a' : '#ff4d4f',
                                marginRight: 6,
                                boxShadow: dataClient.connected ? '0 0 6px #52c41a' : 'none',
                                animation: dataClient.connected ? 'pulse 1.2s infinite' : 'none'
                            }} />
                            {dataClient.connected ? 'Live' : 'Offline'}
                        </span>
                    </div>
                </div>
                <Tabs
                    destroyOnHidden
                    defaultActiveKey="overview"
                    tabBarStyle={{
                        marginBottom: 12
                    }}
                    items={[
                        {
                            key: 'overview',
                            label: (
                                <span className="tabLabel">
                                    <InfoCircleOutlined style={{ fontSize: 18 }} />
                                    Overview
                                </span>
                            ),
                            children: (
                                <>
                                    <Descriptions column={{ xs: 1, sm: 2, md: 3 }} bordered size="middle">
                                        <Descriptions.Item label="Client ID"><Text copyable>{dataClient.client_id}</Text></Descriptions.Item>
                                        <Descriptions.Item label="Hostname">{dataClient.hostname}</Descriptions.Item>
                                        <Descriptions.Item label="OS">{dataClient.os}</Descriptions.Item>
                                        <Descriptions.Item label="Architecture">{dataClient.arch}</Descriptions.Item>
                                        <Descriptions.Item label="Kernel">{dataClient.kernel}</Descriptions.Item>
                                        <Descriptions.Item label="Version">
                                            <Tag className='auto-width-tag' color="blue">{dataClient.version}</Tag>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Last Seen">{DateTimeTool(dataClient.last_seen)}</Descriptions.Item>
                                        <Descriptions.Item label="BGP">
                                            <Tag className='auto-width-tag' color={dataClient.bgp ? "green" : "red"}>
                                                {dataClient.bgp ? "Enabled" : "Disabled"}
                                            </Tag>
                                        </Descriptions.Item>
                                        {dataClient.cloud && (
                                            <Descriptions.Item label="Cloud">
                                                <Tag className='auto-width-tag' color="cyan">{dataClient.cloud}</Tag>
                                            </Descriptions.Item>
                                        )}
                                        {dataClient.provider && (
                                            <Descriptions.Item label="Provider">
                                                <Tag className='auto-width-tag' color="orange">{dataClient.provider}</Tag>
                                            </Descriptions.Item>
                                        )}
                                        <Descriptions.Item label="Metadata">
                                            {dataClient.metadata && Object.keys(dataClient.metadata).length > 0 ? (
                                                <Button 
                                                    type="link" 
                                                    size="small"
                                                    onClick={() => setMetadataDrawerVisible(true)}
                                                    style={{ 
                                                        padding: '2px 8px',
                                                        height: 'auto',
                                                        fontSize: '13px'
                                                    }}
                                                >
                                                    {Object.keys(dataClient.metadata).length} items - Click to view
                                                </Button>
                                            ) : (
                                                <span style={{ color: '#bfbfbf' }}>No metadata</span>
                                            )}
                                        </Descriptions.Item>
                                    </Descriptions>
                                    <Divider />
                                    <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(5,117,230,0.06)', margin: '0 auto' }}>
                                        <ServiceInfoCard clientId={dataClient.client_id} />
                                    </Card>
                                </>
                            )
                        },
                        {
                            key: 'network',
                            label: (
                                <span className="tabLabel">
                                    <AppstoreOutlined style={{ fontSize: 18 }} />
                                    Network
                                </span>
                            ),
                            children: (
                                <ClientNetwork clientId={dataClient.client_id} bgpEnabled={dataClient.bgp} />
                            )
                        },
                        {
                            key: 'stats',
                            label: (
                                <span className="tabLabel">
                                    <BarChartOutlined style={{ fontSize: 18 }} />
                                    Statistics
                                </span>
                            ),
                            children: (
                                <ClientStats clientId={dataClient.client_id} />
                            )
                        },
                        {
                            key: 'logs',
                            label: (
                                <span className="tabLabel">
                                    <FileTextOutlined style={{ fontSize: 18 }} />
                                    Logs
                                </span>
                            ),
                            children: (
                                <ClientLogs clientId={dataClient.client_id} />
                            )
                        },
                        {
                            key: 'versions',
                            label: (
                                <span className="tabLabel">
                                    <CloudDownloadOutlined style={{ fontSize: 18 }} />
                                    Envoy Versions
                                </span>
                            ),
                            children: (
                                <ClientVersions 
                                    clientId={dataClient.client_id} 
                                    downstreamAddress={dataClient.downstream_address}
                                />
                            )
                        }
                    ]}
                />
            </Card>

            {/* Metadata Drawer */}
            <Drawer
                title="Client Metadata"
                open={metadataDrawerVisible}
                onClose={() => setMetadataDrawerVisible(false)}
                width={600}
                placement="right"
            >
                {dataClient.metadata && Object.keys(dataClient.metadata).length > 0 ? (
                    <Row gutter={[16, 16]} style={{ padding: '8px 0' }}>
                        {Object.entries(dataClient.metadata).map(([key, value]) => (
                            <Col xs={24} sm={12} key={key}>
                                <div style={{
                                    background: '#fafafa',
                                    border: '1px solid #f0f0f0',
                                    borderRadius: 8,
                                    padding: '12px',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>
                                    <div style={{
                                        fontSize: '12px',
                                        color: '#666',
                                        fontWeight: 500,
                                        marginBottom: '6px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}>
                                        {key}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <Text 
                                            copyable={{ text: String(value) }}
                                            style={{ 
                                                fontSize: '14px',
                                                wordBreak: 'break-all'
                                            }}
                                        >
                                            {String(value).length > 30 ? `${String(value).substring(0, 30)}...` : String(value)}
                                        </Text>
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <Text type="secondary">No metadata available</Text>
                    </div>
                )}
            </Drawer>

            <div style={{ height: 32 }} />
        </div>
    );
}

export default ClientDetail;
