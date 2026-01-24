import React from 'react';
import { Spin, Tag, Badge, Alert, Card, Row, Col, Statistic, Collapse, Typography, Tooltip } from 'antd';
import { ClockCircleOutlined, CloudServerOutlined, ApiOutlined } from '@ant-design/icons';

const { Text } = Typography;


const statusColor = (active: string) => {
    if (!active) return 'default';
    if (active.toLowerCase().includes('running')) return 'success';
    if (active.toLowerCase().includes('inactive') || active.toLowerCase().includes('dead')) return 'error';
    return 'warning';
};

const formatUptime = (active: string) => {
    const match = active.match(/active \(running\) since (.*?);/);
    if (!match) return null;
    return match[1];
};

const formatCGroup = (cgroup: string[]) => {
    if (!Array.isArray(cgroup)) return [];

    return cgroup
        .filter(line => !line.trim().endsWith('.service'))
        .map(line => {
            const trimmed = line.trim();

            if (trimmed.startsWith('/system.slice/')) {
                return {
                    type: 'service',
                    command: trimmed.split('/').pop() || '',
                    pid: '',
                    params: []
                };
            }

            const [pid, ...rest] = trimmed.split(' ');

            if (rest.includes('python3')) {
                const pythonCmd = rest.join(' ');
                const scriptMatch = pythonCmd.match(/\/([^\/]+\.py)/);
                const envoyCmd = pythonCmd.match(/"([^"]+)"/)?.[1] || '';

                const envoyParams = [];
                if (envoyCmd) {
                    const baseId = envoyCmd.match(/--base-id\s+(\d+)/)?.[1];
                    const drainTime = envoyCmd.match(/--drain-time-s\s+(\d+)/)?.[1];
                    const shutdownTime = envoyCmd.match(/--parent-shutdown-time-s\s+(\d+)/)?.[1];
                    const configFile = envoyCmd.match(/-c\s+([^\s]+)/)?.[1];

                    if (baseId) envoyParams.push({ key: 'base-id', value: baseId });
                    if (drainTime) envoyParams.push({ key: 'drain-time', value: `${drainTime}s` });
                    if (shutdownTime) envoyParams.push({ key: 'shutdown-time', value: `${shutdownTime}s` });
                    if (configFile) envoyParams.push({ key: 'config', value: configFile.split('/').pop() || '' });
                }

                return {
                    type: 'python',
                    command: scriptMatch ? scriptMatch[1] : 'python3',
                    pid,
                    subCommand: 'envoy',
                    params: envoyParams
                };
            }

            if (rest[0]?.includes('/envoy')) {
                const envoyCmd = rest.join(' ');
                const params = [];

                const baseId = envoyCmd.match(/--base-id\s+(\d+)/)?.[1];
                const drainTime = envoyCmd.match(/--drain-time-s\s+(\d+)/)?.[1];
                const shutdownTime = envoyCmd.match(/--parent-shutdown-time-s\s+(\d+)/)?.[1];
                const restartEpoch = envoyCmd.match(/--restart-epoch\s+(\d+)/)?.[1];
                const configFile = envoyCmd.match(/-c\s+([^\s]+)/)?.[1];

                if (baseId) params.push({ key: 'base-id', value: baseId });
                if (drainTime) params.push({ key: 'drain-time', value: `${drainTime}s` });
                if (shutdownTime) params.push({ key: 'shutdown-time', value: `${shutdownTime}s` });
                if (restartEpoch) params.push({ key: 'restart-epoch', value: restartEpoch });
                if (configFile) params.push({ key: 'config', value: configFile.split('/').pop() || '' });

                return {
                    type: 'envoy',
                    command: 'envoy',
                    pid,
                    params
                };
            }

            return {
                type: 'system',
                command: rest.join(' '),
                pid,
                params: []
            };
        }).filter(item => item.command);
};

export const ServiceStatus: React.FC<{ statusData: any[]; loading: boolean; error: string | null }> = ({ statusData, loading, error }) => {
    if (error) return <Alert type="error" message={error} />;
    if (!statusData || statusData.length === 0) return <span style={{ color: 'var(--text-tertiary)' }}>No status info</span>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative' }}>
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
            {statusData.map((item, idx) => {
                const clientName = item.identity?.client_name;
                const status = item.Result?.Service?.status;

                if (!status) {
                    return (
                        <Card
                            key={idx}
                            style={{
                                borderRadius: 12,
                                boxShadow: '0 4px 14px 0 rgba(0,0,0,0.08)',
                                opacity: loading ? 0.7 : 1,
                                transition: 'all 0.2s'
                            }}
                        >
                            <Alert
                                type="warning"
                                message="Service status is unavailable"
                                description={clientName ? `Unable to fetch status for ${clientName}` : "Unable to fetch service status"}
                            />
                        </Card>
                    );
                }

                const activeStatus = statusColor(status.active || '');
                const uptime = status.active ? formatUptime(status.active) : null;
                const cgroupData = Array.isArray(status.cgroup) ? formatCGroup(status.cgroup) : [];

                const memoryMatch = status.memory?.match(/([\d.]+[MKG])/) || [];
                const tasksMatch = status.tasks?.match(/(\d+)/) || [];

                return (
                    <Card
                        key={idx}
                        style={{
                            borderRadius: 12,
                            boxShadow: '0 4px 14px 0 rgba(0,0,0,0.08)',
                            opacity: loading ? 0.7 : 1,
                            transition: 'all 0.2s'
                        }}
                        styles={{ body: { padding: '14px' } }}
                    >
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 16
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <Badge
                                    status={activeStatus as any}
                                    text={
                                        <Text strong style={{ fontSize: 14 }}>
                                            {status.active ?
                                                (status.active.split('(')[1]?.split(')')[0].charAt(0).toUpperCase() +
                                                    status.active.split('(')[1]?.split(')')[0].slice(1) || status.active) :
                                                'Unknown Status'
                                            }
                                        </Text>
                                    }
                                />
                                {uptime && (
                                    <Tooltip title="Running since">
                                        <Text type="secondary" style={{ fontSize: 13 }}>
                                            <ClockCircleOutlined style={{ marginRight: 6 }} />
                                            {uptime}
                                        </Text>
                                    </Tooltip>
                                )}
                            </div>
                            <Tag style={{ padding: '4px 12px', borderRadius: 4 }}>
                                {clientName || 'Unknown Client'}
                            </Tag>
                        </div>

                        <Row gutter={[24, 24]}>
                            <Col span={6}>
                                <Statistic
                                    title={<Text type="secondary">Memory Usage</Text>}
                                    value={memoryMatch[1] || 'N/A'}
                                    prefix={<CloudServerOutlined />}
                                />
                            </Col>
                            <Col span={6}>
                                <Statistic
                                    title={<Text type="secondary">CPU Time</Text>}
                                    value={status.cpu}
                                    prefix={<ClockCircleOutlined />}
                                />
                            </Col>
                            <Col span={6}>
                                <Statistic
                                    title={<Text type="secondary">Tasks</Text>}
                                    value={tasksMatch[1] || 'N/A'}
                                    prefix={<ApiOutlined />}
                                />
                            </Col>
                            <Col span={6}>
                                <Statistic
                                    title={<Text type="secondary">Status</Text>}
                                    value={status.loaded?.includes('loaded') ? 'Loaded' : (status.loaded || 'Unknown')}
                                />
                            </Col>
                        </Row>

                        {cgroupData.length > 0 && (
                            <Collapse
                                ghost
                                defaultActiveKey={['1']}
                                style={{ marginTop: 16 }}
                                items={[
                                    {
                                        key: '1',
                                        label: (
                                            <Text strong>
                                                Process Information ({cgroupData.length})
                                            </Text>
                                        ),
                                        children: (
                                            <div style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 12,
                                                background: 'var(--bg-surface)',
                                                borderRadius: 8
                                            }}>
                                                {cgroupData.map((cg, i) => (
                                                    <div 
                                                        key={i}
                                                        style={{
                                                            background: 'var(--card-bg)',
                                                            borderRadius: 8,
                                                            border: '1px solid var(--border-default)',
                                                            overflow: 'hidden'
                                                        }}
                                                    >
                                                        <div style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            padding: '8px 8px',
                                                            gap: 12,
                                                            borderBottom: cg.params.length > 0 ? '1px solid var(--border-default)' : 'none',
                                                            background: 'var(--bg-body)'
                                                        }}>
                                                            {cg.type === 'python' ? (
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                                    <Tag 
                                                                        color="blue"
                                                                        style={{ 
                                                                            padding: '2px 8px',
                                                                            borderRadius: 4,
                                                                            minWidth: 80,
                                                                            textAlign: 'center',
                                                                            fontFamily: 'monospace'
                                                                        }}
                                                                    >
                                                                        PID: {cg.pid}
                                                                    </Tag>
                                                                    <Badge 
                                                                        color="blue"
                                                                        text={
                                                                            <Text style={{ fontSize: 13 }}>
                                                                                Envoy with Hotrestarter
                                                                            </Text>
                                                                        }
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    {cg.pid && (
                                                                        <Tag 
                                                                            color={
                                                                                cg.type === 'envoy' ? 'green' :
                                                                                cg.type === 'service' ? 'purple' : 
                                                                                'default'
                                                                            }
                                                                            style={{ 
                                                                                padding: '2px 8px',
                                                                                borderRadius: 4,
                                                                                minWidth: 80,
                                                                                textAlign: 'center',
                                                                                fontFamily: 'monospace'
                                                                            }}
                                                                        >
                                                                            PID: {cg.pid}
                                                                        </Tag>
                                                                    )}
                                                                    <Badge 
                                                                        color="blue"
                                                                        text={
                                                                            <Text style={{ fontSize: 13 }}>
                                                                                {cg.command}
                                                                            </Text>
                                                                        }
                                                                    />
                                                                </>
                                                            )}
                                                        </div>
                                                        {cg.params.length > 0 && (
                                                            <div style={{
                                                                padding: '10px 16px',
                                                                display: 'flex',
                                                                flexWrap: 'wrap',
                                                                gap: 8,
                                                                background: 'var(--card-bg)'
                                                            }}>
                                                                {cg.params.map((param, idx) => (
                                                                    <Tag
                                                                        key={idx}
                                                                        style={{
                                                                            padding: '1px 8px',
                                                                            borderRadius: 4,
                                                                            border: '1px solid var(--border-default)',
                                                                            background: 'var(--bg-body)'
                                                                        }}
                                                                    >
                                                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                                                            {param.key}:
                                                                        </Text>
                                                                        <Text style={{ marginLeft: 4, fontSize: 12, fontFamily: 'monospace' }}>
                                                                            {param.value}
                                                                        </Text>
                                                                    </Tag>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )
                                    }
                                ]}
                            />
                        )}
                    </Card>
                );
            })}
        </div>
    );
};
