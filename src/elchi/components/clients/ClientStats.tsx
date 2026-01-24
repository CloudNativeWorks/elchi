import React from 'react';
import { Card, Row, Col, Statistic, Progress, Alert, Spin, Typography, Table, Badge, Tooltip, Tag, Button } from 'antd';
import { useClientStats } from '@/hooks/useClientStats';
import { CloudServerOutlined, DesktopOutlined, DatabaseOutlined, ApiOutlined, ReloadOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface ClientStatsProps {
    clientId: string;
}

const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);

    return `${days}d ${hours}h ${minutes}m`;
};

const ClientStats: React.FC<ClientStatsProps> = ({ clientId }) => {
    const { loading, error, statsData, fetchClientStats } = useClientStats({ clientId });

    if (error) return <Alert type="error" message={error} />;

    const stats = statsData?.Result?.ClientStats;
    if (!stats) return null;

    const cpuUsage = stats.cpu.usage_percent ? Number(stats.cpu.usage_percent).toFixed(1) : 0.1;
    const memoryUsage = Number(stats.memory.usage_percent).toFixed(1) || 0.1;

    const diskColumns = [
        {
            title: 'Mount Point',
            dataIndex: 'mount_point',
            key: 'mount_point',
            render: (text: string) => <Text strong>{text}</Text>
        },
        {
            title: 'Device',
            dataIndex: 'device',
            key: 'device',
            render: (text: string) => <Text type="secondary" style={{ fontSize: '13px' }}>{text}</Text>
        },
        {
            title: 'Type',
            dataIndex: 'fs_type',
            key: 'fs_type',
            render: (text: string) => <Tag color="blue">{text}</Tag>
        },
        {
            title: 'Usage',
            key: 'usage',
            render: (_: any, record: any) => {
                const usagePercent = Number(record.usage_percent).toFixed(1);
                return (
                    <Tooltip title={`${usagePercent}%`}>
                        <Progress
                            percent={Number(usagePercent)}
                            size="small"
                            status={record.usage_percent > 90 ? "exception" : record.usage_percent > 70 ? "active" : "normal"}
                            style={{ width: 100 }}
                        />
                    </Tooltip>
                );
            }
        },
        {
            title: 'Size',
            key: 'size',
            render: (_: any, record: any) => {
                const usedFormatted = formatBytes(record.used);
                const totalFormatted = formatBytes(record.total);
                return (
                    <Text style={{ fontSize: '13px' }}>
                        {usedFormatted} / {totalFormatted}
                    </Text>
                );
            }
        }
    ];

    const networkInterfaces = Object.entries(stats.network.interfaces).map(([name, data]: [string, any]) => ({
        name,
        ...data,
        key: name
    }));

    const networkColumns = [
        {
            title: 'Interface',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <Text strong>{text}</Text>
        },
        {
            title: 'Received',
            key: 'received',
            render: (record: any) => (
                record.bytes_received ? (
                    <Text style={{ fontSize: '13px' }}>
                        {formatBytes(record.bytes_received)}
                        <Text type="secondary" style={{ fontSize: '12px' }}> ({record.packets_received} packets)</Text>
                    </Text>
                ) : '-'
            )
        },
        {
            title: 'Sent',
            key: 'sent',
            render: (record: any) => (
                <Text style={{ fontSize: '13px' }}>
                    {formatBytes(record.bytes_sent)}
                    <Text type="secondary" style={{ fontSize: '12px' }}> ({record.packets_sent} packets)</Text>
                </Text>
            )
        },
        {
            title: 'Dropped',
            dataIndex: 'dropped',
            key: 'dropped',
            render: (value: number) => value ? (
                <Badge overflowCount={999999} count={value} style={{ backgroundColor: 'var(--color-danger)' }} />
            ) : '-'
        }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: -8 }}>
                <Button
                    icon={<ReloadOutlined spin={loading} />}
                    onClick={fetchClientStats}
                    title="Refresh metrics"
                    disabled={loading}
                >
                    Refresh
                </Button>
            </div>

            {loading && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'var(--bg-loading)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 2,
                    backdropFilter: 'blur(1px)',
                    borderRadius: 12
                }}>
                    <Spin />
                </div>
            )}

            <Row gutter={[16, 16]}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title={<Text type="secondary">CPU Usage</Text>}
                            value={cpuUsage}
                            precision={1}
                            suffix="%"
                            prefix={<DesktopOutlined />}
                        />
                        <Progress
                            percent={Number(cpuUsage)}
                            size="small"
                            status={Number(cpuUsage) > 90 ? "exception" : Number(cpuUsage) > 70 ? "active" : "normal"}
                            style={{ marginTop: 8 }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title={<Text type="secondary">Memory Usage</Text>}
                            value={memoryUsage}
                            precision={1}
                            suffix="%"
                            prefix={<CloudServerOutlined />}
                        />
                        <Progress
                            percent={Number(memoryUsage)}
                            size="small"
                            status={Number(memoryUsage) > 90 ? "exception" : Number(memoryUsage) > 70 ? "active" : "normal"}
                            style={{ marginTop: 8 }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title={<Text type="secondary">Network Connections</Text>}
                            value={stats.network.connections}
                            prefix={<ApiOutlined />}
                        />
                        <div style={{ marginTop: 8, fontSize: '13px' }}>
                            <Text type="secondary">TCP: </Text>
                            <Text>{stats.network.tcp_connections}</Text>
                            <Text type="secondary" style={{ marginLeft: 12 }}>UDP: </Text>
                            <Text>{stats.network.udp_connections}</Text>
                        </div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title={<Text type="secondary">Processes</Text>}
                            value={stats.cpu.process_count}
                            prefix={<DatabaseOutlined />}
                        />
                        <div style={{ marginTop: 8, fontSize: '13px' }}>
                            <Text type="secondary">Threads: </Text>
                            <Text>{stats.cpu.thread_count}</Text>
                        </div>
                    </Card>
                </Col>
            </Row>

            <Card>
                <Row gutter={16}>
                    <Col span={6}>
                        <Statistic
                            title="Load Average (1m)"
                            value={stats.cpu.load_avg_1}
                            precision={2}
                        />
                    </Col>
                    <Col span={6}>
                        <Statistic
                            title="Load Average (5m)"
                            value={stats.cpu.load_avg_5}
                            precision={2}
                        />
                    </Col>
                    <Col span={6}>
                        <Statistic
                            title="Load Average (15m)"
                            value={stats.cpu.load_avg_15}
                            precision={2}
                        />
                    </Col>
                    <Col span={6}>
                        <Statistic
                            title="Uptime"
                            value={formatUptime(stats.system.uptime)}
                        />
                    </Col>
                </Row>
            </Card>

            <Row gutter={[16, 16]}>
                <Col span={12}>
                    <Card>
                        <div style={{
                            background: 'var(--bg-surface)',
                            margin: '-16px -16px 16px -16px',
                            padding: '12px 16px',
                            borderRadius: '6px 6px 0 0',
                            borderBottom: '1px solid var(--border-default)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12
                        }}>
                            <DatabaseOutlined style={{ fontSize: '18px', color: 'var(--text-primary)' }} />
                            <Text strong style={{ color: 'var(--text-primary)', fontSize: '14px' }}>Storage</Text>
                        </div>
                        <Table
                            dataSource={stats.disk.map((disk: any) => ({
                                ...disk,
                                key: `${disk.device}-${disk.mount_point}`,
                            }))}
                            columns={diskColumns}
                            pagination={false}
                            size="small"
                        />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card>
                        <div style={{
                            background: 'var(--bg-surface)',
                            margin: '-16px -16px 16px -16px',
                            padding: '12px 16px',
                            borderRadius: '6px 6px 0 0',
                            borderBottom: '1px solid var(--border-default)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12
                        }}>
                            <ApiOutlined style={{ fontSize: '18px', color: 'var(--text-primary)' }} />
                            <Text strong style={{ color: 'var(--text-primary)', fontSize: '14px' }}>Network Interfaces</Text>
                        </div>
                        <Table
                            dataSource={networkInterfaces}
                            columns={networkColumns}
                            pagination={false}
                            size="small"
                        />
                    </Card>
                </Col>
            </Row>

            
        </div>
    );
};

export default ClientStats; 