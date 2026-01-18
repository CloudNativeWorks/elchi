import React, { useState, useEffect } from 'react';
import { Button, Spin, Alert, Tag, Space, Switch, Input, Row, Col, Select, Checkbox, Collapse, Modal, Typography } from 'antd';
import {
    PlayCircleOutlined,
    PauseCircleOutlined,
    ReloadOutlined,
    SyncOutlined,
    EditOutlined,
    SaveOutlined,
    CloseOutlined,
    FileTextOutlined,
    InfoCircleOutlined,
    CopyOutlined
} from '@ant-design/icons';

const { Paragraph } = Typography;
import { useOperationsApiMutation } from '@/common/operations-api';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { OperationsType, OperationsSubType } from '@/common/types';

interface FilebeatConfigProps {
    clientId: string;
    downstreamAddress: string;
}

interface FilebeatInput {
    type: string;
    enabled: boolean;
    id: string;
    paths: string[] | null;
}

interface ElasticsearchOutput {
    hosts: string[];
    loadbalance?: boolean;
    skip_ssl_verify?: boolean;
    api_key?: string;
    basic_auth?: {
        username: string;
        password: string;
    };
    auth_type?: string;
    api_key_configured?: boolean;
}

interface LogstashOutput {
    hosts: string[];
    loadbalance?: boolean;
}

interface FilebeatConfigData {
    inputs: FilebeatInput[] | null;
    timestamp_processor?: {
        field: string;
        layouts: string[] | null;
        test?: string[] | null;
    };
    drop_fields_processor?: {
        fields: string[] | null;
    };
    output_type?: 'elasticsearch' | 'logstash';
    filebeat_output?: {
        elasticsearch?: ElasticsearchOutput;
        logstash?: LogstashOutput;
    };
}

interface FilebeatStatusData {
    service_status: string;
    is_running: boolean;
}

const FilebeatConfig: React.FC<FilebeatConfigProps> = ({ clientId, downstreamAddress }) => {
    const { project } = useProjectVariable();
    const mutate = useOperationsApiMutation();
    const [config, setConfig] = useState<FilebeatConfigData | null>(null);
    const [status, setStatus] = useState<FilebeatStatusData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [editedConfig, setEditedConfig] = useState<FilebeatConfigData | null>(null);
    const [authMethod, setAuthMethod] = useState<'none' | 'api_key' | 'basic_auth'>('none');
    const [logs, setLogs] = useState<string[]>([]);
    const [loadingLogs, setLoadingLogs] = useState(false);
    const [showLogstashExample, setShowLogstashExample] = useState(false);

    const fetchConfig = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await mutate.mutateAsync({
                data: {
                    type: OperationsType.FILEBEAT,
                    sub_type: OperationsSubType.GET_FILEBEAT_CONFIG,
                    clients: [{ client_id: clientId, downstream_address: downstreamAddress }],
                },
                project
            });

            if (data && Array.isArray(data) && data[0]) {
                if (data[0].error) {
                    setError(data[0].error);
                    setConfig(null);
                } else if (data[0]?.filebeat?.current_config) {
                    setConfig(data[0].filebeat.current_config);
                } else if (data[0]?.filebeat?.error_message) {
                    setError(data[0].filebeat.error_message);
                    setConfig(null);
                }
            }
        } catch (err: any) {
            const errorMsg = err?.response?.data?.message || 'Failed to fetch Filebeat config';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const fetchStatus = async () => {
        try {
            const data = await mutate.mutateAsync({
                data: {
                    type: OperationsType.FILEBEAT,
                    sub_type: OperationsSubType.GET_FILEBEAT_STATUS,
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
                } else if (data[0]?.filebeat) {
                    const isRunning = data[0].filebeat.operation_summary?.is_running ??
                        data[0].filebeat.is_running ??
                        false;

                    setStatus({
                        service_status: data[0].filebeat.service_status ||
                            (data[0].filebeat.message ? data[0].filebeat.message.replace('Filebeat service status: ', '') : 'unknown'),
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
                    type: OperationsType.FILEBEAT,
                    sub_type: OperationsSubType.SUB_LOGS,
                    clients: [{ client_id: clientId, downstream_address: downstreamAddress }],
                },
                project
            });

            if (data && Array.isArray(data) && data[0]) {
                if (data[0].error) {
                    setLogs([]);
                } else if (data[0]?.filebeat?.logs) {
                    // Logs can be array of objects or array of strings
                    const logData = data[0].filebeat.logs;
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
                    type: OperationsType.FILEBEAT,
                    sub_type: action,
                    clients: [{ client_id: clientId, downstream_address: downstreamAddress }],
                },
                project
            });

            if (data && Array.isArray(data) && data[0]) {
                if (data[0]?.filebeat?.success) {
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

        // Get current output type
        const currentOutputType = editedConfig.output_type ||
            (editedConfig.filebeat_output?.elasticsearch ? 'elasticsearch' :
                editedConfig.filebeat_output?.logstash ? 'logstash' : undefined);

        // Validation for Elasticsearch
        if (currentOutputType === 'elasticsearch') {
            // Validation: API key must not be empty if auth_method is api_key
            if (authMethod === 'api_key') {
                if (!editedConfig.filebeat_output?.elasticsearch?.api_key ||
                    editedConfig.filebeat_output.elasticsearch.api_key.trim() === '') {
                    return; // Don't proceed, input will show error status
                }
            }

            // Validation: Basic auth username and password must not be empty
            if (authMethod === 'basic_auth') {
                const basicAuth = editedConfig.filebeat_output?.elasticsearch?.basic_auth;
                if (!basicAuth?.username || basicAuth.username.trim() === '' ||
                    !basicAuth?.password || basicAuth.password.trim() === '') {
                    return; // Don't proceed
                }
            }
        }

        setActionLoading('UPDATE');
        try {
            // Clean up filebeat_output based on output type
            let cleanedOutput = editedConfig.filebeat_output;

            if (cleanedOutput?.elasticsearch) {
                const elasticsearch = { ...cleanedOutput.elasticsearch };

                // Remove undefined auth fields
                if (authMethod === 'none') {
                    delete elasticsearch.api_key;
                    delete elasticsearch.basic_auth;
                } else if (authMethod === 'api_key') {
                    delete elasticsearch.basic_auth;
                    // API key must be present (validated above)
                } else if (authMethod === 'basic_auth') {
                    delete elasticsearch.api_key;
                    // Basic auth must be present (validated above)
                }

                // Remove helper fields that shouldn't be sent to backend
                delete elasticsearch.auth_type;
                delete elasticsearch.api_key_configured;

                cleanedOutput = {
                    elasticsearch
                };
            } else if (cleanedOutput?.logstash) {
                // Logstash output - no auth fields to clean
                cleanedOutput = {
                    logstash: { ...cleanedOutput.logstash }
                };
            }

            const processedConfig = {
                inputs: editedConfig.inputs || [],
                timestamp_processor: editedConfig.timestamp_processor,
                drop_fields_processor: editedConfig.drop_fields_processor,
                filebeat_output: cleanedOutput
            };

            const data = await mutate.mutateAsync({
                data: {
                    type: OperationsType.FILEBEAT,
                    sub_type: OperationsSubType.UPDATE_FILEBEAT_CONFIG,
                    clients: [{ client_id: clientId, downstream_address: downstreamAddress }],
                    filebeat: processedConfig
                },
                project
            });

            if (data && Array.isArray(data) && data[0]) {
                if (data[0]?.filebeat?.success) {
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

        // If API key is configured, set a placeholder that we'll remove on submit
        if (clonedConfig?.filebeat_output?.elasticsearch?.api_key_configured) {
            clonedConfig.filebeat_output.elasticsearch.api_key = '';
        }

        setEditedConfig(clonedConfig);

        // Detect current auth method from backend response
        if (config?.filebeat_output?.elasticsearch) {
            const authType = config.filebeat_output.elasticsearch.auth_type;
            if (authType === 'api_key' || config.filebeat_output.elasticsearch.api_key_configured) {
                setAuthMethod('api_key');
            } else if (authType === 'basic_auth' || config.filebeat_output.elasticsearch.basic_auth) {
                setAuthMethod('basic_auth');
            } else {
                setAuthMethod('none');
            }
        }
        setEditMode(true);
    };

    const cancelEdit = () => {
        setEditMode(false);
        setEditedConfig(null);
    };

    const updateInput = (index: number, field: keyof FilebeatInput, value: any) => {
        if (!editedConfig || !editedConfig.inputs) return;
        const newInputs = [...editedConfig.inputs];
        newInputs[index] = { ...newInputs[index], [field]: value };
        setEditedConfig({ ...editedConfig, inputs: newInputs });
    };

    const updateOutputType = (type: 'elasticsearch' | 'logstash') => {
        if (!editedConfig) return;

        // Clear previous output and set new type
        const newOutput: FilebeatConfigData['filebeat_output'] = {};

        if (type === 'elasticsearch') {
            newOutput.elasticsearch = {
                hosts: [],
                loadbalance: false
            };
        } else {
            newOutput.logstash = {
                hosts: [],
                loadbalance: false
            };
        }

        setEditedConfig({
            ...editedConfig,
            output_type: type,
            filebeat_output: newOutput
        });
    };

    const updateElasticsearchHosts = (hosts: string) => {
        if (!editedConfig?.filebeat_output?.elasticsearch) return;
        const hostArray = hosts.split(',').map(h => h.trim()).filter(h => h);
        setEditedConfig({
            ...editedConfig,
            filebeat_output: {
                elasticsearch: {
                    ...editedConfig.filebeat_output.elasticsearch,
                    hosts: hostArray
                }
            }
        });
    };

    const updateLogstashHosts = (hosts: string) => {
        if (!editedConfig?.filebeat_output?.logstash) return;
        const hostArray = hosts.split(',').map(h => h.trim()).filter(h => h);
        setEditedConfig({
            ...editedConfig,
            filebeat_output: {
                logstash: {
                    ...editedConfig.filebeat_output.logstash,
                    hosts: hostArray
                }
            }
        });
    };

    const updateElasticsearchField = (field: string, value: any) => {
        if (!editedConfig?.filebeat_output?.elasticsearch) return;
        setEditedConfig({
            ...editedConfig,
            filebeat_output: {
                elasticsearch: {
                    ...editedConfig.filebeat_output.elasticsearch,
                    [field]: value
                }
            }
        });
    };

    const updateLogstashField = (field: string, value: any) => {
        if (!editedConfig?.filebeat_output?.logstash) return;
        setEditedConfig({
            ...editedConfig,
            filebeat_output: {
                logstash: {
                    ...editedConfig.filebeat_output.logstash,
                    [field]: value
                }
            }
        });
    };

    if (loading && !config) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                <Spin size="large" />
            </div>
        );
    }

    const displayConfig = editMode ? editedConfig : config;
    const currentOutputType = displayConfig?.output_type ||
        (displayConfig?.filebeat_output?.elasticsearch ? 'elasticsearch' :
            displayConfig?.filebeat_output?.logstash ? 'logstash' : undefined);

    return (
        <div style={{ padding: '8px 0' }}>
            {/* Status & Actions */}
            <div style={{
                marginBottom: 16,
                padding: '10px 14px',
                background: 'var(--bg-surface)',
                borderRadius: 6,
                border: '1px solid var(--border-default)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Space size="small">
                    <div style={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        background: status?.is_running ? 'var(--color-success)' : 'var(--text-tertiary)',
                        boxShadow: status?.is_running ? '0 0 6px var(--color-success)' : 'none'
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
                        background: 'var(--card-bg)',
                        borderRadius: 8,
                        padding: 16,
                        border: '1px solid var(--border-default)'
                    }}
                >
                    {/* Header */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 16,
                        paddingBottom: 12,
                        borderBottom: '1px solid var(--border-default)'
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
                            background: 'var(--bg-surface)',
                            borderRadius: 6,
                            border: '1px solid var(--border-default)'
                        }}
                    >
                        <Row gutter={[12, 12]} align="middle">
                            {/* Filebeat Enable/Disable */}
                            <Col flex="0 0 auto">
                                <Space align="center" size="small">
                                    <Switch
                                        checked={displayConfig?.inputs?.[0]?.enabled ?? false}
                                        onChange={(checked) => editMode && updateInput(0, 'enabled', checked)}
                                        disabled={!editMode}
                                        size="small"
                                    />
                                    <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>
                                        {displayConfig?.inputs?.[0]?.enabled ? 'Enabled' : 'Disabled'}
                                    </span>
                                </Space>
                            </Col>

                            {/* Output Type */}
                            <Col flex="0 0 auto">
                                <Space align="center" size="small">
                                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Output:</span>
                                    {editMode ? (
                                        <Select
                                            value={currentOutputType}
                                            onChange={updateOutputType}
                                            style={{ width: 140 }}
                                            size="small"
                                        >
                                            <Select.Option value="elasticsearch">Elasticsearch</Select.Option>
                                            <Select.Option value="logstash">Logstash</Select.Option>
                                        </Select>
                                    ) : (
                                        <Tag className='auto-width-tag' color={currentOutputType === 'elasticsearch' ? 'blue' : 'green'} style={{ margin: 0 }}>
                                            {currentOutputType === 'elasticsearch' ? 'Elasticsearch' : 'Logstash'}
                                        </Tag>
                                    )}
                                    {currentOutputType === 'logstash' && (
                                        <Button
                                            size="small"
                                            icon={<InfoCircleOutlined />}
                                            onClick={() => setShowLogstashExample(true)}
                                        >
                                            Example
                                        </Button>
                                    )}
                                </Space>
                            </Col>
                        </Row>

                        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border-default)' }}>
                            <Space direction="vertical" style={{ width: '100%' }} size={8}>

                                {/* Elasticsearch Output */}
                                {currentOutputType === 'elasticsearch' && displayConfig?.filebeat_output?.elasticsearch && (
                                    <>
                                        {/* Hosts */}
                                        <Row gutter={12} align="middle">
                                            <Col flex="0 0 100px">
                                                <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>Hosts:</span>
                                            </Col>
                                            <Col flex="1">
                                                {editMode ? (
                                                    <Input
                                                        value={displayConfig.filebeat_output.elasticsearch.hosts?.join(', ') || ''}
                                                        onChange={(e) => updateElasticsearchHosts(e.target.value)}
                                                        placeholder="http://host:port, https://host2:port2"
                                                        size="small"
                                                    />
                                                ) : (
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                                        {displayConfig.filebeat_output.elasticsearch.hosts?.length > 0 ? (
                                                            displayConfig.filebeat_output.elasticsearch.hosts.map((host, idx) => (
                                                                <Tag className='auto-width-tag' key={idx} color="blue" style={{ margin: 0, fontSize: 11 }}>{host}</Tag>
                                                            ))
                                                        ) : (
                                                            <Tag className='auto-width-tag' color="warning" style={{ margin: 0, fontSize: 11 }}>No hosts</Tag>
                                                        )}
                                                    </div>
                                                )}
                                            </Col>
                                        </Row>

                                        {/* Load Balance & Auth - Edit Mode */}
                                        {editMode && (
                                            <>
                                                <Row gutter={12} align="middle">
                                                    <Col flex="0 0 100px">
                                                        <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>Options:</span>
                                                    </Col>
                                                    <Col flex="1">
                                                        <Space size={16}>
                                                            <Checkbox
                                                                checked={displayConfig.filebeat_output.elasticsearch.loadbalance}
                                                                onChange={(e) => updateElasticsearchField('loadbalance', e.target.checked)}
                                                                style={{ fontSize: 12 }}
                                                            >
                                                                Load Balance
                                                            </Checkbox>
                                                            <Checkbox
                                                                checked={displayConfig.filebeat_output.elasticsearch.skip_ssl_verify}
                                                                onChange={(e) => updateElasticsearchField('skip_ssl_verify', e.target.checked)}
                                                                style={{ fontSize: 12 }}
                                                            >
                                                                Skip SSL Verify
                                                            </Checkbox>
                                                        </Space>
                                                    </Col>
                                                </Row>
                                                <Row gutter={12} align="middle">
                                                    <Col flex="0 0 100px">
                                                        <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>Auth:</span>
                                                    </Col>
                                                    <Col flex="1">
                                                        <Space direction="vertical" style={{ width: '100%' }} size={6}>
                                                            <Select
                                                                value={authMethod}
                                                                onChange={(value) => {
                                                                    setAuthMethod(value);
                                                                    if (value === 'none') {
                                                                        updateElasticsearchField('api_key', undefined);
                                                                        updateElasticsearchField('basic_auth', undefined);
                                                                    } else if (value === 'api_key') {
                                                                        updateElasticsearchField('basic_auth', undefined);
                                                                    } else if (value === 'basic_auth') {
                                                                        updateElasticsearchField('api_key', undefined);
                                                                    }
                                                                }}
                                                                style={{ width: 160 }}
                                                                size="small"
                                                            >
                                                                <Select.Option value="none">None</Select.Option>
                                                                <Select.Option value="api_key">API Key</Select.Option>
                                                                <Select.Option value="basic_auth">Username/Password</Select.Option>
                                                            </Select>
                                                            {authMethod === 'api_key' && (
                                                                <div>
                                                                    <Input
                                                                        placeholder="API Key (id:secret)"
                                                                        value={displayConfig.filebeat_output.elasticsearch.api_key || ''}
                                                                        onChange={(e) => updateElasticsearchField('api_key', e.target.value)}
                                                                        size="small"
                                                                        status={(!displayConfig.filebeat_output.elasticsearch.api_key || displayConfig.filebeat_output.elasticsearch.api_key.trim() === '') ? 'error' : ''}
                                                                    />
                                                                </div>
                                                            )}
                                                            {authMethod === 'basic_auth' && (
                                                                <Space.Compact style={{ width: '100%' }} direction="vertical" size="small">
                                                                    <Input
                                                                        placeholder="Username"
                                                                        value={displayConfig.filebeat_output.elasticsearch.basic_auth?.username || ''}
                                                                        onChange={(e) => {
                                                                            updateElasticsearchField('basic_auth', {
                                                                                username: e.target.value,
                                                                                password: displayConfig.filebeat_output.elasticsearch.basic_auth?.password || ''
                                                                            });
                                                                        }}
                                                                        size="small"
                                                                        status={(!displayConfig.filebeat_output.elasticsearch.basic_auth?.username || displayConfig.filebeat_output.elasticsearch.basic_auth.username.trim() === '') ? 'error' : ''}
                                                                    />
                                                                    <Input.Password
                                                                        placeholder="Password"
                                                                        value={displayConfig.filebeat_output.elasticsearch.basic_auth?.password || ''}
                                                                        onChange={(e) => {
                                                                            updateElasticsearchField('basic_auth', {
                                                                                username: displayConfig.filebeat_output.elasticsearch.basic_auth?.username || '',
                                                                                password: e.target.value
                                                                            });
                                                                        }}
                                                                        size="small"
                                                                        status={(!displayConfig.filebeat_output.elasticsearch.basic_auth?.password || displayConfig.filebeat_output.elasticsearch.basic_auth.password.trim() === '') ? 'error' : ''}
                                                                    />
                                                                </Space.Compact>
                                                            )}
                                                        </Space>
                                                    </Col>
                                                </Row>
                                            </>
                                        )}

                                        {/* View Mode - Compact */}
                                        {!editMode && (
                                            <>
                                                <Row gutter={12} align="middle">
                                                    <Col flex="0 0 100px">
                                                        <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>Options:</span>
                                                    </Col>
                                                    <Col flex="1">
                                                        <Space size={4} wrap>
                                                            {displayConfig.filebeat_output.elasticsearch.loadbalance && (
                                                                <Tag className='auto-width-tag' color="blue" style={{ margin: 0, fontSize: 11 }}>Load Balance</Tag>
                                                            )}
                                                            {displayConfig.filebeat_output.elasticsearch.skip_ssl_verify && (
                                                                <Tag className='auto-width-tag' color="orange" style={{ margin: 0, fontSize: 11 }}>Skip SSL Verify</Tag>
                                                            )}
                                                            {!displayConfig.filebeat_output.elasticsearch.loadbalance &&
                                                                !displayConfig.filebeat_output.elasticsearch.skip_ssl_verify && (
                                                                    <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>-</span>
                                                                )}
                                                        </Space>
                                                    </Col>
                                                </Row>
                                                <Row gutter={12} align="middle">
                                                    <Col flex="0 0 100px">
                                                        <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>Auth:</span>
                                                    </Col>
                                                    <Col flex="1">
                                                        {(displayConfig.filebeat_output.elasticsearch.api_key_configured ||
                                                            displayConfig.filebeat_output.elasticsearch.auth_type === 'api_key') ? (
                                                            <Space size={4}>
                                                                <Tag className='auto-width-tag' color="green" style={{ margin: 0, fontSize: 11 }}>API Key</Tag>
                                                                <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'monospace' }}></span>
                                                            </Space>
                                                        ) : (displayConfig.filebeat_output.elasticsearch.basic_auth ||
                                                            displayConfig.filebeat_output.elasticsearch.auth_type === 'basic_auth') ? (
                                                            <Space size={4}>
                                                                <Tag className='auto-width-tag' color="purple" style={{ margin: 0, fontSize: 11 }}>Basic Auth</Tag>
                                                                <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'monospace' }}></span>
                                                            </Space>
                                                        ) : (
                                                            <Tag className='auto-width-tag' color="default" style={{ margin: 0, fontSize: 11 }}>None</Tag>
                                                        )}
                                                    </Col>
                                                </Row>
                                            </>
                                        )}
                                    </>
                                )}

                                {/* Logstash Output */}
                                {currentOutputType === 'logstash' && displayConfig?.filebeat_output?.logstash && (
                                    <>
                                        {/* Hosts */}
                                        <Row gutter={12} align="middle">
                                            <Col flex="0 0 100px">
                                                <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>Hosts:</span>
                                            </Col>
                                            <Col flex="1">
                                                {editMode ? (
                                                    <Input
                                                        value={displayConfig.filebeat_output.logstash.hosts?.join(', ') || ''}
                                                        onChange={(e) => updateLogstashHosts(e.target.value)}
                                                        placeholder="host:port, host2:port2"
                                                        size="small"
                                                    />
                                                ) : (
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                                        {displayConfig.filebeat_output.logstash.hosts?.length > 0 ? (
                                                            displayConfig.filebeat_output.logstash.hosts.map((host, idx) => (
                                                                <Tag className='auto-width-tag' key={idx} color="green" style={{ margin: 0, fontSize: 11 }}>{host}</Tag>
                                                            ))
                                                        ) : (
                                                            <Tag className='auto-width-tag' color="warning" style={{ margin: 0, fontSize: 11 }}>No hosts</Tag>
                                                        )}
                                                    </div>
                                                )}
                                            </Col>
                                        </Row>

                                        {/* Load Balance */}
                                        <Row gutter={12} align="middle">
                                            <Col flex="0 0 100px">
                                                <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>Options:</span>
                                            </Col>
                                            <Col flex="1">
                                                {editMode ? (
                                                    <Checkbox
                                                        checked={displayConfig.filebeat_output.logstash.loadbalance}
                                                        onChange={(e) => updateLogstashField('loadbalance', e.target.checked)}
                                                        style={{ fontSize: 12 }}
                                                    >
                                                        Load Balance
                                                    </Checkbox>
                                                ) : (
                                                    displayConfig.filebeat_output.logstash.loadbalance ? (
                                                        <Tag className='auto-width-tag' color="blue" style={{ margin: 0, fontSize: 11 }}>Load Balance</Tag>
                                                    ) : (
                                                        <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>-</span>
                                                    )
                                                )}
                                            </Col>
                                        </Row>
                                    </>
                                )}
                            </Space>
                        </div>
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
                                    <span style={{ fontWeight: 500 }}>Log Service Logs</span>
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
                                                background: 'var(--terminal-bg)',
                                                color: 'var(--terminal-text)',
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

            {/* Logstash Example Config Modal */}
            <Modal
                title={
                    <Space>
                        <InfoCircleOutlined style={{ color: 'var(--color-primary)' }} />
                        <span>Logstash Configuration Example</span>
                    </Space>
                }
                open={showLogstashExample}
                onCancel={() => setShowLogstashExample(false)}
                footer={[
                    <Button
                        key="copy"
                        type="primary"
                        icon={<CopyOutlined />}
                        onClick={() => {
                            const configText = `input {
  beats {
    port => 5044
  }
}

filter {
  grok {
    match => { "[log][file][path]" => "/var/log/elchi/%{DATA:elchi_app}_(system|access)\\.log" }
  }

  if [log][file][path] =~ "_system" {
    mutate { add_field => { "[@metadata][target_index]" => "elchi-system" } }
  } else {
    mutate { add_field => { "[@metadata][target_index]" => "elchi-logs" } }
  }

  if [message] =~ /^\\\\s*\\\\{/ {
    json {
      source => "message"
      remove_field => ["message"]
      tag_on_failure => ["_not_json"]
    }
  } else {
    mutate { rename => { "message" => "raw_log" } }
  }

  if "_not_json" in [tags] {
    mutate {
      rename => { "message" => "raw_log" }
    }
  }
}

output {
  elasticsearch {
    hosts => ["http://elasticsearch:9200"]
    index => "%{[@metadata][target_index]}-%{+YYYY.MM.dd}"
  }
}`;
                            navigator.clipboard.writeText(configText);
                        }}
                    >
                        Copy to Clipboard
                    </Button>,
                    <Button key="close" onClick={() => setShowLogstashExample(false)}>
                        Close
                    </Button>
                ]}
                width={800}
            >
                <Alert
                    message="Example Logstash Pipeline Configuration"
                    description="This configuration receives logs, processes them, and sends to Elasticsearch"
                    type="info"
                    showIcon
                    style={{ marginBottom: 16 }}
                />
                <div
                    style={{
                        background: '#1e1e1e',
                        color: '#d4d4d4',
                        padding: 16,
                        borderRadius: 6,
                        fontFamily: 'monospace',
                        fontSize: 12,
                        maxHeight: 500,
                        overflowY: 'auto',
                        whiteSpace: 'pre',
                        marginBottom: 0
                    }}
                >
                    {`input {
  beats {
    port => 5044
  }
}

filter {
  grok {
    match => { "[log][file][path]" => "/var/log/elchi/%{DATA:elchi_app}_(system|access)\\.log" }
  }

  if [log][file][path] =~ "_system" {
    mutate { add_field => { "[@metadata][target_index]" => "elchi-system" } }
  } else {
    mutate { add_field => { "[@metadata][target_index]" => "elchi-logs" } }
  }

  if [message] =~ /^\\s*\\{/ {
    json {
      source => "message"
      remove_field => ["message"]
      tag_on_failure => ["_not_json"]
    }
  } else {
    mutate { rename => { "message" => "raw_log" } }
  }

  if "_not_json" in [tags] {
    mutate {
      rename => { "message" => "raw_log" }
    }
  }
}

output {
  elasticsearch {
    hosts => ["http://elasticsearch:9200"]
    index => "%{[@metadata][target_index]}-%{+YYYY.MM.dd}"
  }
}`}
                </div>
            </Modal>
        </div>
    );
};

export default FilebeatConfig;
