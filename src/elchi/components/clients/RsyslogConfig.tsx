import React, { useState, useEffect } from 'react';
import {  Button, Spin, Alert, Tag, Space, Input, Row, Col, Select, Collapse, InputNumber } from 'antd';
import {
    PlayCircleOutlined,
    PauseCircleOutlined,
    ReloadOutlined,
    SyncOutlined,
    EditOutlined,
    SaveOutlined,
    CloseOutlined,
    FileTextOutlined
} from '@ant-design/icons';
import { useOperationsApiMutation } from '@/common/operations-api';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { OperationsType, OperationsSubType } from '@/common/types';

interface RsyslogConfigProps {
    clientId: string;
    downstreamAddress: string;
}

interface RsyslogConfigData {
    target: string;
    port: number;
    protocol: 'udp' | 'tcp';
}

interface RsyslogStatusData {
    service_status: string;
    is_running: boolean;
}

const RsyslogConfig: React.FC<RsyslogConfigProps> = ({ clientId, downstreamAddress }) => {
    const { project } = useProjectVariable();
    const mutate = useOperationsApiMutation();
    const [config, setConfig] = useState<RsyslogConfigData | null>(null);
    const [status, setStatus] = useState<RsyslogStatusData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [editedConfig, setEditedConfig] = useState<RsyslogConfigData | null>(null);
    const [logs, setLogs] = useState<string[]>([]);
    const [loadingLogs, setLoadingLogs] = useState(false);

    const fetchConfig = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await mutate.mutateAsync({
                data: {
                    type: OperationsType.RSYSLOG,
                    sub_type: OperationsSubType.GET_RSYSLOG_CONFIG,
                    clients: [{ client_id: clientId, downstream_address: downstreamAddress }],
                },
                project
            });

            if (data && Array.isArray(data) && data[0]) {
                if (data[0].error) {
                    setError(data[0].error);
                    setConfig(null);
                } else if (data[0]?.rsyslog?.current_config) {
                    setConfig(data[0].rsyslog.current_config);
                } else if (data[0]?.rsyslog?.error_message) {
                    setError(data[0].rsyslog.error_message);
                    setConfig(null);
                }
            }
        } catch (err: any) {
            const errorMsg = err?.response?.data?.message || 'Failed to fetch Rsyslog config';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const fetchStatus = async () => {
        try {
            const data = await mutate.mutateAsync({
                data: {
                    type: OperationsType.RSYSLOG,
                    sub_type: OperationsSubType.GET_RSYSLOG_STATUS,
                    clients: [{ client_id: clientId, downstream_address: downstreamAddress }],
                },
                project
            });

            if (data && Array.isArray(data) && data[0]) {
                if (data[0].error) {
                    setStatus({
                        service_status: 'error',
                        is_running: false
                    });
                } else if (data[0]?.rsyslog) {
                    const isRunning = data[0].rsyslog.operation_summary?.is_running ??
                                    data[0].rsyslog.is_running ??
                                    false;

                    setStatus({
                        service_status: data[0].rsyslog.service_status || 'unknown',
                        is_running: isRunning
                    });
                }
            }
        } catch (err: any) {
            setStatus({
                service_status: 'error',
                is_running: false
            });
        }
    };

    useEffect(() => {
        fetchConfig();
        fetchStatus();
    }, [clientId, downstreamAddress]);

    const fetchLogs = async () => {
        setLoadingLogs(true);
        try {
            const data = await mutate.mutateAsync({
                data: {
                    type: OperationsType.RSYSLOG,
                    sub_type: OperationsSubType.SUB_LOGS,
                    clients: [{ client_id: clientId, downstream_address: downstreamAddress }],
                },
                project
            });

            if (data && Array.isArray(data) && data[0]) {
                if (data[0].error) {
                    setLogs([]);
                } else if (data[0]?.rsyslog?.logs) {
                    const logData = data[0].rsyslog.logs;
                    if (Array.isArray(logData)) {
                        const logLines = logData.map((log: any) => {
                            if (typeof log === 'string') {
                                return log;
                            } else if (log.message) {
                                return `[${log.timestamp || ''}] ${log.level || 'INFO'}: ${log.message}`;
                            }
                            return JSON.stringify(log);
                        });
                        setLogs(logLines);
                    }
                } else {
                    setLogs([]);
                }
            }
        } catch (err: any) {
            setLogs([]);
        } finally {
            setLoadingLogs(false);
        }
    };

    const handleServiceAction = async (action: OperationsSubType.SUB_START | OperationsSubType.SUB_STOP | OperationsSubType.SUB_RESTART) => {
        setActionLoading(action);
        try {
            const data = await mutate.mutateAsync({
                data: {
                    type: OperationsType.RSYSLOG,
                    sub_type: action,
                    clients: [{ client_id: clientId, downstream_address: downstreamAddress }],
                },
                project
            });

            if (data && Array.isArray(data) && data[0]) {
                if (data[0]?.rsyslog?.success) {
                    await fetchStatus();
                }
            }
        } catch (err: any) {
            // Error handled by central notification system
        } finally {
            setActionLoading(null);
        }
    };

    const handleSaveConfig = async () => {
        if (!editedConfig) return;

        // Validation
        if (!editedConfig.target || editedConfig.target.trim() === '') {
            return;
        }
        if (!editedConfig.port || editedConfig.port < 1 || editedConfig.port > 65535) {
            return;
        }

        setActionLoading('UPDATE');
        try {
            // Ensure protocol has a default value before sending
            const configToSend = {
                ...editedConfig,
                protocol: editedConfig.protocol || 'udp'
            };

            const data = await mutate.mutateAsync({
                data: {
                    type: OperationsType.RSYSLOG,
                    sub_type: OperationsSubType.UPDATE_RSYSLOG_CONFIG,
                    clients: [{ client_id: clientId, downstream_address: downstreamAddress }],
                    rsyslog: {
                        rsyslog_config: {
                            rsyslog_output: configToSend
                        }
                    }
                },
                project
            });

            if (data && Array.isArray(data) && data[0]) {
                if (data[0]?.rsyslog?.success) {
                    setEditMode(false);
                    await fetchConfig();
                }
            }
        } catch (err: any) {
            // Error handled by central notification system
        } finally {
            setActionLoading(null);
        }
    };

    const startEdit = () => {
        const clonedConfig = JSON.parse(JSON.stringify(config));
        // Ensure protocol has a default value
        if (!clonedConfig.protocol) {
            clonedConfig.protocol = 'udp';
        }
        setEditedConfig(clonedConfig);
        setEditMode(true);
    };

    const cancelEdit = () => {
        setEditMode(false);
        setEditedConfig(null);
    };

    if (loading && !config) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                <Spin size="large" />
            </div>
        );
    }

    const displayConfig = editMode ? editedConfig : config;

    return (
        <div style={{ padding: '8px 0' }}>
            {error && (
                <Alert
                    message="Error"
                    description={error}
                    type="error"
                    closable
                    onClose={() => setError(null)}
                    style={{ marginBottom: 16 }}
                    showIcon
                />
            )}

            {/* Status & Actions */}
            <div style={{
                marginBottom: 16,
                padding: '10px 14px',
                background: '#fafafa',
                borderRadius: 6,
                border: '1px solid #f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Space size="small">
                    <div style={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        background: status?.is_running ? '#52c41a' : '#d9d9d9',
                        boxShadow: status?.is_running ? '0 0 6px rgba(82, 196, 26, 0.6)' : 'none'
                    }} />
                    <span style={{ fontSize: 13, fontWeight: 500 }}>
                        {status?.is_running ? 'Running' : 'Stopped'}
                    </span>
                </Space>
                <Space size={4}>
                    <Button
                        type="primary"
                        size="small"
                        icon={<PlayCircleOutlined />}
                        onClick={() => handleServiceAction(OperationsSubType.SUB_START)}
                        loading={actionLoading === OperationsSubType.SUB_START}
                        disabled={status?.is_running}
                        title="Start"
                    />
                    <Button
                        size="small"
                        icon={<PauseCircleOutlined />}
                        onClick={() => handleServiceAction(OperationsSubType.SUB_STOP)}
                        loading={actionLoading === OperationsSubType.SUB_STOP}
                        disabled={!status?.is_running}
                        title="Stop"
                    />
                    <Button
                        size="small"
                        icon={<ReloadOutlined />}
                        onClick={() => handleServiceAction(OperationsSubType.SUB_RESTART)}
                        loading={actionLoading === OperationsSubType.SUB_RESTART}
                        title="Restart"
                    />
                    <Button
                        size="small"
                        icon={<SyncOutlined />}
                        onClick={() => {
                            fetchConfig();
                            fetchStatus();
                        }}
                        title="Refresh"
                    />
                </Space>
            </div>

            {/* Configuration */}
            {!displayConfig && !error ? (
                <Alert message="No configuration available" type="info" />
            ) : !displayConfig && error ? (
                <Alert
                    message="Unable to load configuration"
                    description="Please check the error message above."
                    type="warning"
                />
            ) : (
                <div
                    style={{
                        background: 'white',
                        borderRadius: 8,
                        padding: 16,
                        border: '1px solid #f0f0f0'
                    }}
                >
                    {/* Header */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 16,
                        paddingBottom: 12,
                        borderBottom: '1px solid #f0f0f0'
                    }}>
                        <span style={{ fontSize: 14, fontWeight: 600 }}>Configuration</span>
                        {!editMode ? (
                            <Button
                                type="primary"
                                size="small"
                                icon={<EditOutlined />}
                                onClick={startEdit}
                            >
                                Edit
                            </Button>
                        ) : (
                            <Space>
                                <Button
                                    size="small"
                                    icon={<CloseOutlined />}
                                    onClick={cancelEdit}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="primary"
                                    size="small"
                                    icon={<SaveOutlined />}
                                    onClick={handleSaveConfig}
                                    loading={actionLoading === 'UPDATE'}
                                >
                                    Save
                                </Button>
                            </Space>
                        )}
                    </div>

                    <div
                        style={{
                            padding: 12,
                            background: '#fafafa',
                            borderRadius: 6,
                            border: '1px solid #f0f0f0'
                        }}
                    >
                        <Space direction="vertical" style={{ width: '100%' }} size={8}>
                            {/* Target */}
                            <Row gutter={12} align="middle">
                                <Col flex="0 0 100px">
                                    <span style={{ fontSize: 12, color: '#595959', fontWeight: 500 }}>Target:</span>
                                </Col>
                                <Col flex="1">
                                    {editMode ? (
                                        <Input
                                            value={displayConfig?.target || ''}
                                            onChange={(e) => setEditedConfig({ ...editedConfig!, target: e.target.value })}
                                            placeholder="syslog.example.com or IP address"
                                            size="small"
                                            status={(!displayConfig?.target || displayConfig.target.trim() === '') ? 'error' : ''}
                                        />
                                    ) : (
                                        <Tag color="blue" style={{ margin: 0, fontSize: 11 }}>{displayConfig?.target}</Tag>
                                    )}
                                </Col>
                            </Row>

                            {/* Port */}
                            <Row gutter={12} align="middle">
                                <Col flex="0 0 100px">
                                    <span style={{ fontSize: 12, color: '#595959', fontWeight: 500 }}>Port:</span>
                                </Col>
                                <Col flex="1">
                                    {editMode ? (
                                        <InputNumber
                                            value={displayConfig?.port || 514}
                                            onChange={(value) => setEditedConfig({ ...editedConfig!, port: value || 514 })}
                                            min={1}
                                            max={65535}
                                            size="small"
                                            style={{ width: 120 }}
                                            status={(!displayConfig?.port || displayConfig.port < 1 || displayConfig.port > 65535) ? 'error' : ''}
                                        />
                                    ) : (
                                        <Tag color="green" style={{ margin: 0, fontSize: 11 }}>{displayConfig?.port}</Tag>
                                    )}
                                </Col>
                            </Row>

                            {/* Protocol */}
                            <Row gutter={12} align="middle">
                                <Col flex="0 0 100px">
                                    <span style={{ fontSize: 12, color: '#595959', fontWeight: 500 }}>Protocol:</span>
                                </Col>
                                <Col flex="1">
                                    {editMode ? (
                                        <Select
                                            value={displayConfig?.protocol || 'udp'}
                                            onChange={(value) => setEditedConfig({ ...editedConfig!, protocol: value })}
                                            style={{ width: 120 }}
                                            size="small"
                                        >
                                            <Select.Option value="udp">UDP</Select.Option>
                                            <Select.Option value="tcp">TCP</Select.Option>
                                        </Select>
                                    ) : (
                                        <Tag color={displayConfig?.protocol === 'tcp' ? 'purple' : 'orange'} style={{ margin: 0, fontSize: 11 }}>
                                            {displayConfig?.protocol?.toUpperCase()}
                                        </Tag>
                                    )}
                                </Col>
                            </Row>
                        </Space>
                    </div>
                </div>
            )}

            {/* Logs Section */}
            <div style={{ marginTop: 16 }}>
                <Collapse
                    items={[
                        {
                            key: 'logs',
                            label: (
                                <Space>
                                    <FileTextOutlined />
                                    <span style={{ fontWeight: 500 }}>Rsyslog Service Logs</span>
                                </Space>
                            ),
                            children: (
                                <div>
                                    <div style={{ marginBottom: 12, textAlign: 'right' }}>
                                        <Button
                                            size="small"
                                            icon={<SyncOutlined />}
                                            onClick={fetchLogs}
                                            loading={loadingLogs}
                                        >
                                            Refresh Logs
                                        </Button>
                                    </div>
                                    {loadingLogs ? (
                                        <div style={{ textAlign: 'center', padding: 20 }}>
                                            <Spin />
                                        </div>
                                    ) : logs.length > 0 ? (
                                        <div
                                            style={{
                                                background: '#1e1e1e',
                                                color: '#d4d4d4',
                                                padding: 12,
                                                borderRadius: 6,
                                                fontFamily: 'monospace',
                                                fontSize: 12,
                                                maxHeight: 400,
                                                overflowY: 'auto'
                                            }}
                                        >
                                            {logs.map((log, idx) => (
                                                <div key={idx} style={{ marginBottom: 4 }}>
                                                    {log}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <Alert
                                            message="No logs available"
                                            description="Click 'Refresh Logs' to fetch the latest logs."
                                            type="info"
                                        />
                                    )}
                                </div>
                            )
                        }
                    ]}
                />
            </div>
        </div>
    );
};

export default RsyslogConfig;
