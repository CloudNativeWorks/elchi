import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, Spin, Typography, Tag, Descriptions, Alert, Tabs, Divider } from 'antd';
import { FileTextOutlined, InfoCircleOutlined, AppstoreOutlined, BarChartOutlined } from '@ant-design/icons';
import { useCustomGetQuery } from '@/common/api';
import { DateTimeTool } from '@/utils/date-time-tool';
import ServiceInfoCard from '@components/services/ServiceInfoCard';
import ClientLogs from '@components/clients/ClientLogs';
import ClientStats from '@components/clients/ClientStats';
import ClientNetwork from '@components/clients/ClientNetwork';

const { Title, Text } = Typography;

const ClientDetail: React.FC = () => {
    const { client_id } = useParams();
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
                                    <Descriptions column={1} bordered size="middle">
                                        <Descriptions.Item label="Client ID"><Text copyable>{dataClient.client_id}</Text></Descriptions.Item>
                                        <Descriptions.Item label="Hostname">{dataClient.hostname}</Descriptions.Item>
                                        <Descriptions.Item label="OS">{dataClient.os}</Descriptions.Item>
                                        <Descriptions.Item label="Arch">{dataClient.arch}</Descriptions.Item>
                                        <Descriptions.Item label="Kernel">{dataClient.kernel}</Descriptions.Item>
                                        <Descriptions.Item label="Version">
                                            <Tag className='auto-width-tag' color="blue">{dataClient.version}</Tag>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Last Seen">{DateTimeTool(dataClient.last_seen)}</Descriptions.Item>
                                        <Descriptions.Item label="Metadata">
                                            {dataClient.metadata && Object.keys(dataClient.metadata).length > 0 ? (
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                                    {Object.entries(dataClient.metadata).map(([key, value]) => (
                                                        <Tag key={key} style={{ fontSize: 12, padding: '4px 10px' }}>
                                                            <span style={{ fontWeight: 600 }}>{key}:&nbsp;</span> <span style={{ fontWeight: 400 }}>{String(value)}</span>
                                                        </Tag>
                                                    ))}
                                                </div>
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
                                <ClientNetwork clientId={dataClient.client_id} />
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
                        }
                    ]}
                />
            </Card>

            <div style={{ height: 32 }} />
        </div>
    );
}

export default ClientDetail;
