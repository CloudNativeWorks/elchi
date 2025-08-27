import React, { useEffect, useState } from 'react';
import { WarningOutlined, ReloadOutlined, DatabaseOutlined, ExpandAltOutlined, ShrinkOutlined } from '@ant-design/icons';
import { Divider, Typography, Select, Button, Card, Row, Col, Statistic, Alert, Spin, Badge, Collapse, Input, Pagination } from 'antd';
import { useEnvoyDetails } from '@/hooks/useEnvoyDetails';
import JsonView from 'react18-json-view';
import 'react18-json-view/src/style.css';

interface EnvoysCardProps {
    envoys: any;
    name: string;
    project: string;
    version?: string;
}

const { Text } = Typography;

const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const numBytes = typeof bytes === 'string' ? parseInt(bytes) : bytes;
    const i = Math.floor(Math.log(numBytes) / Math.log(k));
    return `${parseFloat((numBytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const isErrorResponse = (data: any): boolean => {
    return typeof data === 'string' && data.startsWith('error:');
};

const getErrorMessage = (error: string): string => {
    if (error.includes('connection refused')) {
        return 'Connection refused to Envoy admin interface';
    }
    return error.replace('error: ', '');
};

const EnvoysCard: React.FC<EnvoysCardProps> = ({ envoys, name, project, version }) => {
    const { loading, error, envoyData, fetchEnvoyDetails } = useEnvoyDetails({ name, project, version });
    const [selectedClient, setSelectedClient] = useState<string>();
    const [manualRefreshLoading, setManualRefreshLoading] = useState(false);
    let filteredEnvoys = envoys?.envoys || [];
    const errors = envoys?.errors || [];
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [isJsonExpanded, setIsJsonExpanded] = useState(false);

    useEffect(() => {
        fetchEnvoyDetails();
    }, []);

    useEffect(() => {
        if (Object.keys(envoyData).length > 0 && !selectedClient) {
            setSelectedClient(Object.keys(envoyData)[0]);
        }
    }, [envoyData, selectedClient]);

    const handleManualRefresh = async () => {
        setManualRefreshLoading(true);
        await fetchEnvoyDetails();
        setManualRefreshLoading(false);
    };

    const selectedEnvoyData = selectedClient ? envoyData[selectedClient] : null;
    const serverInfo = selectedEnvoyData?.Result?.EnvoyAdmin?.body?.server_info;
    const memory = selectedEnvoyData?.Result?.EnvoyAdmin?.body?.memory;
    const stats = selectedEnvoyData?.Result?.EnvoyAdmin?.body?.stats?.stats || [];

    if (!loading && (!envoyData || Object.keys(envoyData).length === 0)) {
        return (
            <Alert
                type="error"
                showIcon
                message="Unable to fetch envoy details. The Envoy admin interface might be unavailable."
                description="Please check if Envoy is running and accessible."
            />
        );
    }

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
            }}>
                {filteredEnvoys.map((envoy: any) => {
                    if (envoy.client_name === selectedClient) {
                        return (
                            <Text
                                key={envoy.nodeid}
                                strong
                                style={{
                                    fontSize: '12px',
                                    marginTop: 4,
                                    marginLeft: 4,
                                }}
                            >
                                Node ID:<span style={{ fontSize: '12px', marginLeft: 4, color: envoy.connected ? '#389e0d' : '#ff4d4f' }}>{envoy.nodeid}</span>
                            </Text>
                        );
                    }
                    return null;
                })}
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: -4 }}>
                    <DatabaseOutlined style={{ fontSize: 16, color: '#1890ff' }} />
                    <Select
                        style={{ width: 200 }}
                        value={selectedClient}
                        onChange={setSelectedClient}
                        options={Object.keys(envoyData).map(clientName => ({
                            label: clientName,
                            value: clientName
                        }))}
                        loading={loading || manualRefreshLoading}
                        placeholder="Select client"
                    />
                    <Button
                        icon={<ReloadOutlined spin={loading || manualRefreshLoading} />}
                        onClick={handleManualRefresh}
                        title="Refresh metrics"
                        disabled={loading || manualRefreshLoading}
                    />
                </div>
            </div>

            {error && <Alert type="error" message={error} />}

            {selectedEnvoyData && (
                <>
                    <Card style={{ width: '100%', position: 'relative' }}>
                        <div style={{
                            opacity: (loading || manualRefreshLoading) ? 0.6 : 1,
                            transition: 'opacity 0.2s'
                        }}>
                            <Row gutter={[24, 24]}>
                                <Col span={4}>
                                    <Statistic
                                        title="Envoy Version"
                                        value={serverInfo?.version?.split('/')[1] || 'N/A'}
                                    />
                                </Col>
                                <Col span={4}>
                                    <Statistic
                                        title="Uptime"
                                        value={`${Math.floor(parseInt(serverInfo?.uptime_current_epoch || '0') / 3600)}h ${Math.floor((parseInt(serverInfo?.uptime_current_epoch || '0') % 3600) / 60)}m`}
                                    />
                                </Col>
                                <Col span={4}>
                                    <Statistic
                                        title="State"
                                        value={serverInfo?.state || 'N/A'}
                                    />
                                </Col>
                                <Col span={4}>
                                    <Statistic
                                        title="Hot Restart Version"
                                        value={serverInfo?.hot_restart_version || 'N/A'}
                                    />
                                </Col>
                                <Col span={4}>
                                    <Statistic
                                        title="Concurrency"
                                        value={serverInfo?.command_line_options?.concurrency || 'N/A'}
                                    />
                                </Col>
                                {filteredEnvoys.map((envoy: any) => {
                                    if (envoy.client_name === selectedClient) {
                                        return (
                                            <React.Fragment key={envoy.nodeid}>
                                                <Col span={4}>
                                                    <Statistic
                                                        title="Downstream Address"
                                                        value={envoy.downstream_address}
                                                    />
                                                </Col>
                                                <Col span={4}>
                                                    <Statistic
                                                        title="Source Address"
                                                        value={envoy.source_address}
                                                    />
                                                </Col>
                                                <Col span={4} style={{ display: 'flex', alignItems: 'center' }}>
                                                    <Statistic
                                                        title="Control Plane Connections"
                                                        value={envoy?.connections || 0}
                                                    />
                                                </Col>
                                                <Col span={6}>
                                                    <Statistic
                                                        title="Last Connection Time"
                                                        value={new Date(
                                                            typeof envoy.lastSync === 'number'
                                                                ? envoy.lastSync * 1000
                                                                : isNaN(Number(envoy.lastSync))
                                                                    ? envoy.lastSync
                                                                    : Number(envoy.lastSync) * 1000
                                                        ).toLocaleString()}
                                                    />
                                                </Col>
                                            </React.Fragment>
                                        );
                                    }
                                    return null;
                                })}
                            </Row>
                        </div>
                        {(loading || manualRefreshLoading) && (
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'rgba(255, 255, 255, 0.4)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backdropFilter: 'blur(1px)',
                                borderRadius: 12,
                                zIndex: 1
                            }}>
                                <Spin size="large" />
                            </div>
                        )}
                    </Card>

                    <Row gutter={[16, 16]}>
                        <Col span={8}>
                            <Card
                                title={
                                    <div style={{ display: 'flex', color: '#fff', alignItems: 'center', gap: 8 }}>
                                        <Text strong style={{ color: '#fff' }}>Memory Usage</Text>
                                    </div>
                                }
                                styles={{
                                    header: {
                                        background: '#1890ff',
                                    },
                                    title: {
                                        color: '#fff',
                                    }
                                }}
                                style={{ height: '100%' }}
                            >
                                {isErrorResponse(selectedEnvoyData?.Result?.EnvoyAdmin?.body?.memory) ? (
                                    <Alert
                                        type="error"
                                        message={getErrorMessage(selectedEnvoyData?.Result?.EnvoyAdmin?.body?.memory)}
                                        showIcon
                                    />
                                ) : (
                                    <Row gutter={[16, 16]}>
                                        <Col span={12}>
                                            <Statistic
                                                title="Total Usage"
                                                value={formatBytes(memory?.total_physical_bytes || '0')}
                                            />
                                        </Col>
                                        <Col span={12}>
                                            <Statistic
                                                title="Heap Size"
                                                value={formatBytes(memory?.heap_size || '0')}
                                            />
                                        </Col>
                                        <Col span={12}>
                                            <Statistic
                                                title="Allocated"
                                                value={formatBytes(memory?.allocated || '0')}
                                            />
                                        </Col>
                                        <Col span={12}>
                                            <Statistic
                                                title="Thread Cache"
                                                value={formatBytes(memory?.total_thread_cache || '0')}
                                            />
                                        </Col>
                                    </Row>
                                )}
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card
                                title={
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <Text strong style={{ color: '#fff' }}>Listeners</Text>
                                        <Badge
                                            count={selectedEnvoyData?.Result?.EnvoyAdmin?.body?.listeners?.listener_statuses?.length || 0}
                                            style={{ backgroundColor: '#fff', color: '#1890ff' }}
                                        />
                                    </div>
                                }
                                styles={{
                                    header: {
                                        background: '#1890ff',
                                    },
                                    title: {
                                        color: '#fff',
                                    }
                                }}
                                style={{ height: '100%' }}
                            >
                                {isErrorResponse(selectedEnvoyData?.Result?.EnvoyAdmin?.body?.listeners) ? (
                                    <Alert
                                        type="error"
                                        message={getErrorMessage(selectedEnvoyData?.Result?.EnvoyAdmin?.body?.listeners)}
                                        showIcon
                                    />
                                ) : (
                                    selectedEnvoyData?.Result?.EnvoyAdmin?.body?.listeners?.listener_statuses ? (
                                        <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                                            {selectedEnvoyData.Result.EnvoyAdmin.body.listeners.listener_statuses.map((listener: any, index: number) => (
                                                <div
                                                    key={index}
                                                    style={{
                                                        padding: '8px',
                                                        background: '#fafafa',
                                                        borderRadius: '4px',
                                                        marginBottom: '8px'
                                                    }}
                                                >
                                                    <Text strong>{listener.name}</Text>
                                                    <div style={{ marginTop: 4, fontSize: '12px', color: '#666' }}>
                                                        {listener.local_address?.socket_address && (
                                                            <div>
                                                                Address: {listener.local_address.socket_address.address}:{listener.local_address.socket_address.port_value}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <Text type="secondary">No listeners configured</Text>
                                    )
                                )}
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card
                                title={
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <Text strong style={{ color: '#fff' }}>Runtime</Text>
                                    </div>
                                }
                                styles={{
                                    header: {
                                        background: '#1890ff',
                                    },
                                    title: {
                                        color: '#fff',
                                    }
                                }}
                                style={{ height: '100%' }}
                            >
                                {isErrorResponse(selectedEnvoyData?.Result?.EnvoyAdmin?.body?.runtime) ? (
                                    <Alert
                                        type="error"
                                        message={getErrorMessage(selectedEnvoyData?.Result?.EnvoyAdmin?.body?.runtime)}
                                        showIcon
                                    />
                                ) : (
                                    selectedEnvoyData?.Result?.EnvoyAdmin?.body?.runtime ? (
                                        <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                                            {Object.entries(selectedEnvoyData.Result.EnvoyAdmin.body.runtime).map(([key, value]: [string, any], index: number) => (
                                                <div
                                                    key={index}
                                                    style={{
                                                        padding: '8px',
                                                        background: '#fafafa',
                                                        borderRadius: '4px',
                                                        marginBottom: '8px'
                                                    }}
                                                >
                                                    <Text strong>{key}</Text>
                                                    <div style={{ marginTop: 4, fontSize: '12px', color: '#666' }}>
                                                        Value: {JSON.stringify(value)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <Text type="secondary">No runtime information available</Text>
                                    )
                                )}
                            </Card>
                        </Col>
                    </Row>

                    <div>
                        <Collapse
                            ghost
                            items={[
                                {
                                    key: 'stats',
                                    label: (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <Text strong>Statistics</Text>
                                            <Badge count={stats.filter((stat: any) => stat.value > 0).length} style={{ backgroundColor: '#1890ff' }} />
                                        </div>
                                    ),
                                    children: (
                                        <>
                                            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Input.Search
                                                    placeholder="Search statistics..."
                                                    style={{ width: 300 }}
                                                    onChange={(e) => setSearchText(e.target.value)}
                                                />
                                                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                                    <Text type="secondary">Total: {stats.filter((stat: any) => stat.value > 0).length}</Text>
                                                    <Select
                                                        defaultValue="40"
                                                        style={{ width: 120 }}
                                                        onChange={(value) => setPageSize(parseInt(value))}
                                                        options={[
                                                            { value: '20', label: '20 / page' },
                                                            { value: '40', label: '40 / page' },
                                                            { value: '60', label: '60 / page' },
                                                            { value: '100', label: '100 / page' },
                                                        ]}
                                                    />
                                                </div>
                                            </div>
                                            <div style={{
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(2, 1fr)',
                                                gap: 16,
                                                background: '#fafafa',
                                                padding: 20,
                                                borderRadius: 8
                                            }}>
                                                {(() => {
                                                    // Group statistics
                                                    const groupedStats = stats.reduce((acc: any, stat: any) => {
                                                        if (!stat.value) return acc;

                                                        // Clean and normalize name
                                                        let baseName = stat.name
                                                            .replace(/^(cluster|listener|http|server|admin|runtime)\./, '')
                                                            .replace(/\.(total|count|size|active|completed|success|failed)$/, '')
                                                            .replace(/(upstream|downstream)_/, '')
                                                            .replace(/(_bytes|_total)$/, '')
                                                            .replace(/(_cx|_rq)$/, '')
                                                            .replace('elchi-control-plane.', '')
                                                            .replace('extension_config_discovery.', 'config_discovery.')
                                                            .replace('dns.cares.', 'dns_');

                                                        if (!acc[baseName]) {
                                                            acc[baseName] = {
                                                                name: baseName,
                                                                total: 0,
                                                                active: 0,
                                                                success: 0,
                                                                failed: 0,
                                                                bytes: 0,
                                                                count: 0
                                                            };
                                                        }

                                                        // Categorize values
                                                        if (stat.name.includes('_active')) {
                                                            acc[baseName].active = parseInt(stat.value);
                                                        } else if (stat.name.includes('_success')) {
                                                            acc[baseName].success = parseInt(stat.value);
                                                        } else if (stat.name.includes('_failed') || stat.name.includes('_error')) {
                                                            acc[baseName].failed = parseInt(stat.value);
                                                        } else if (stat.name.includes('_bytes')) {
                                                            acc[baseName].bytes += parseInt(stat.value);
                                                        } else if (stat.name.includes('_total') || stat.name.includes('_count')) {
                                                            acc[baseName].total = parseInt(stat.value);
                                                        } else {
                                                            acc[baseName].count = parseInt(stat.value);
                                                        }

                                                        return acc;
                                                    }, {});

                                                    // Convert groups to sorted statistics
                                                    let processedStats = Object.values(groupedStats)
                                                        .map((values: any) => {
                                                            const displayName = values.name
                                                                .split('_')
                                                                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                                                .join(' ');

                                                            // Calculate total value for sorting
                                                            const totalValue = values.total + values.bytes + values.success + values.active;

                                                            return {
                                                                name: displayName,
                                                                total: values.total,
                                                                active: values.active,
                                                                success: values.success,
                                                                failed: values.failed,
                                                                bytes: values.bytes,
                                                                count: values.count,
                                                                isError: values.failed > 0,
                                                                totalValue: totalValue // Add total value for sorting
                                                            };
                                                        })
                                                        .sort((a: any, b: any) => {
                                                            // First sort by error status
                                                            if (a.isError !== b.isError) {
                                                                return a.isError ? -1 : 1;
                                                            }
                                                            // Then sort by total value
                                                            return b.totalValue - a.totalValue;
                                                        });

                                                    if (searchText) {
                                                        processedStats = processedStats.filter(stat =>
                                                            stat.name.toLowerCase().includes(searchText.toLowerCase())
                                                        );
                                                    }

                                                    // Pagination
                                                    const startIndex = (currentPage - 1) * pageSize;
                                                    const endIndex = startIndex + pageSize;
                                                    const paginatedStats = processedStats.slice(startIndex, endIndex);

                                                    return (
                                                        <>
                                                            {paginatedStats.map((stat: any, idx: number) => (
                                                                <div key={idx} style={{
                                                                    padding: '16px',
                                                                    background: '#fff',
                                                                    borderRadius: 8,
                                                                    border: `1px solid ${stat.isError ? '#ffccc7' : '#f0f0f0'}`,
                                                                    display: 'flex',
                                                                    justifyContent: 'space-between',
                                                                    alignItems: 'center',
                                                                    boxShadow: stat.isError ? '0 2px 4px rgba(255,77,79,0.1)' : '0 2px 4px rgba(0,0,0,0.02)',
                                                                    minHeight: '60px'
                                                                }}>
                                                                    <Text style={{
                                                                        fontSize: '13px',
                                                                        color: stat.isError ? '#cf1322' : '#666',
                                                                        maxWidth: '60%',
                                                                        overflow: 'hidden',
                                                                        textOverflow: 'ellipsis',
                                                                        whiteSpace: 'nowrap'
                                                                    }}>
                                                                        {stat.name}
                                                                    </Text>
                                                                    <div style={{
                                                                        display: 'flex',
                                                                        flexDirection: 'column',
                                                                        alignItems: 'flex-end',
                                                                        gap: 4
                                                                    }}>
                                                                        {stat.total > 0 && (
                                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                                                <Text type="secondary" style={{ fontSize: '12px' }}>Total:</Text>
                                                                                <Text strong>{stat.total.toLocaleString()}</Text>
                                                                                {stat.active > 0 && (
                                                                                    <Badge status="processing" text={`${stat.active} active`} />
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                        {stat.bytes > 0 && (
                                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                                                <Text type="secondary" style={{ fontSize: '12px' }}>Bytes:</Text>
                                                                                <Text strong>{formatBytes(stat.bytes)}</Text>
                                                                            </div>
                                                                        )}
                                                                        {(stat.success > 0 || stat.failed > 0) && (
                                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                                                <Text type="secondary" style={{ fontSize: '12px' }}>Success/Failed:</Text>
                                                                                <Text strong>{stat.success.toLocaleString()}</Text>
                                                                                {stat.failed > 0 && (
                                                                                    <Badge status="error" text={`${stat.failed} failed`} />
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            <div style={{
                                                                gridColumn: '1/-1',
                                                                display: 'flex',
                                                                justifyContent: 'center',
                                                                marginTop: 16
                                                            }}>
                                                                <Pagination
                                                                    current={currentPage}
                                                                    pageSize={pageSize}
                                                                    total={processedStats.length}
                                                                    onChange={(page) => setCurrentPage(page)}
                                                                    showSizeChanger={false}
                                                                />
                                                            </div>
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                        </>
                                    )
                                },
                                {
                                    key: 'config',
                                    label: (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <Text strong>Running Configuration</Text>
                                        </div>
                                    ),
                                    children: (
                                        <div style={{
                                            background: '#fafafa',
                                            padding: 20,
                                            borderRadius: 8,
                                            maxHeight: '600px',
                                            overflow: 'auto'
                                        }}>
                                            {selectedEnvoyData?.Result?.EnvoyAdmin?.body?.config_dump ? (
                                                <>
                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent: 'flex-end',
                                                        gap: 4,
                                                        position: 'sticky',
                                                        top: 0,
                                                        zIndex: 1,
                                                        padding: '4px 0',
                                                        marginRight: 4
                                                    }}>
                                                        <Button
                                                            size="small"
                                                            type="text"
                                                            style={{ padding: '4px 8px' }}
                                                            onClick={() => setIsJsonExpanded(true)}
                                                            icon={<ExpandAltOutlined />}
                                                            title="Expand All"
                                                        />
                                                        <Button
                                                            size="small"
                                                            type="text"
                                                            style={{ padding: '4px 8px' }}
                                                            onClick={() => setIsJsonExpanded(false)}
                                                            icon={<ShrinkOutlined />}
                                                            title="Collapse All"
                                                        />
                                                    </div>
                                                    <JsonView
                                                        src={selectedEnvoyData.Result.EnvoyAdmin.body.config_dump}
                                                        theme="atom"
                                                        collapsed={isJsonExpanded ? false : 4}
                                                        enableClipboard={true}
                                                        style={{
                                                            fontSize: '13px',
                                                            fontFamily: 'monospace',
                                                            backgroundColor: 'transparent'
                                                        }}
                                                    />
                                                </>
                                            ) : (
                                                <Text type="secondary">No configuration data available</Text>
                                            )}
                                        </div>
                                    )
                                },
                                {
                                    key: 'errors',
                                    label: (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <WarningOutlined style={{ color: '#ff4d4f' }} />
                                            <Text strong>Runtime Errors</Text>
                                            <Badge count={errors.length} style={{ backgroundColor: '#ff4d4f' }} />
                                        </div>
                                    ),
                                    children: (
                                        <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                                            {errors.map((err: any, i: number) => (
                                                <div key={i} style={{
                                                    marginBottom: 8,
                                                    padding: 12,
                                                    borderRadius: 6,
                                                    background: '#fff1f0',
                                                    border: '1px solid #ffccc7'
                                                }}>
                                                    <div style={{ fontWeight: 600, color: '#cf1322' }}>{err.message}</div>
                                                    <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
                                                        <span><b>Type:</b> {err.type}</span>
                                                        <Divider type="vertical" />
                                                        <span><b>Time:</b> {new Date(err.timestamp).toLocaleString()}</span>
                                                        <Divider type="vertical" />
                                                        <span><b>Node:</b> {err.nodeid}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )
                                }
                            ]}
                        />
                    </div>


                </>
            )}
            <style>{`
                @media (max-width: 900px) {
                    .envoy-main-row {
                        flex-direction: column !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default EnvoysCard;
