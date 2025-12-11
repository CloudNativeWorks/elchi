import React, { useState, useEffect, useRef } from 'react';
import { Spin, Alert, Button, Card, Modal, Typography, Space, Row, Col, Input, Select } from 'antd';
import { RobotOutlined, FileTextOutlined } from '@ant-design/icons';
import { useOperationsApiMutation } from '@/common/operations-api';
import { OperationsSubType, OperationsType } from '@/common/types';
import { showErrorNotification, showSuccessNotification, showWarningNotification } from '@/common/notificationHandler';
import { OperationsResponse, ServiceLogsApiResult, ServiceLogItem } from './model';
import ServiceLogToolbar from '@/elchi/components/common/ServiceLogToolBar';
import LoggerSettingsDrawer from './LoggerSettingsDrawer';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { useAnalyzeLogsMutation } from '@/ai/hooks/useAIMutations';
import { LogAnalysisResult, LogAnalyzerRequest } from '@/types/aiConfig';
import { AIAnalysisRenderer, DynamicLogAnalysisRenderer } from '@/ai/AIConfigGenerator';
import { useServices } from '@/hooks/useServices';

function wrapWithIndent(line: string, indent: string, maxLen: number) {
    if (!line) return [indent];
    if (maxLen <= 0) maxLen = 100;

    const content = line.slice(indent.length);
    const result = [];

    if (!content) {
        result.push(indent);
        return result;
    }

    let i = 0;
    const safeMaxLen = Math.min(maxLen, 1000);

    while (i < content.length && result.length < 1000) {
        result.push(indent + content.slice(i, i + safeMaxLen));
        i += safeMaxLen;
    }

    return result;
}

function formatLogMessage(message: string, level: string) {
    // First check if message is JSON format
    try {
        const jsonData = JSON.parse(message);
        if (jsonData && typeof jsonData === 'object') {
            // It's JSON formatted log
            return {
                isJsonLog: true,
                message,
                jsonData,
                level: level
            };
        }
    } catch (e) {
        // Not JSON, continue with other checks
    }

    // Check if it's an HTTP access log with status codes (text format)
    const hasHttpStatus = /"\s+\d{3}\s+/.test(message);
    const hasHttpMethod = /"[A-Z]+\s+/.test(message);
    const hasTimestamp = /^\[.*?\]/.test(message);
    
    // HTTP access log detection
    const isAccessLog = (hasHttpStatus || hasHttpMethod) && hasTimestamp;
    
    if (isAccessLog) {
        // Extract key information without strict parsing
        const statusMatch = message.match(/"\s+(\d{3})\s+/);
        const httpMethodMatch = message.match(/"([A-Z]+)\s+([^\s"]+)(?:\s+HTTP)?/);
        
        const statusCode = statusMatch ? parseInt(statusMatch[1]) : null;
        const httpMethod = httpMethodMatch ? httpMethodMatch[1] : null;
        const path = httpMethodMatch ? httpMethodMatch[2] : null;
        
        return {
            isAccessLog: true,
            message,
            statusCode,
            httpMethod,
            path,
            isError: statusCode ? statusCode >= 400 : false,
            level: level
        };
    }
    
    // Check for Envoy control plane logs (CDS, LDS, etc.)
    const isControlPlaneLog = /(?:cds|lds|rds|eds|sds):/i.test(message);
    
    if (isControlPlaneLog) {
        // Extract Envoy operation info
        const operationMatch = message.match(/(cds|lds|rds|eds|sds):\s*(.*)/i);
        const operation = operationMatch ? operationMatch[1].toUpperCase() : null;
        const details = operationMatch ? operationMatch[2] : message;
        
        return {
            isControlPlaneLog: true,
            message,
            operation,
            details,
            level: level
        };
    }
    
    return { isAccessLog: false, isControlPlaneLog: false, isJsonLog: false, message };
}

function parseTimestamp(timestamp: string): number {
    if (!timestamp || typeof timestamp !== 'string') {
        return 0;
    }

    const cleanTimestamp = timestamp.trim();

    let date = new Date(cleanTimestamp);
    if (!isNaN(date.getTime())) {
        return date.getTime();
    }

    const unixSeconds = parseInt(cleanTimestamp);
    if (!isNaN(unixSeconds) && unixSeconds > 1000000000) {
        return unixSeconds * 1000;
    }

    const unixMs = parseInt(cleanTimestamp);
    if (!isNaN(unixMs) && unixMs > 1000000000000) {
        return unixMs;
    }

    // Handle YY-MM-DD HH:mm:ss.SSS format specifically
    const yymmddPattern = /^(\d{2})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})\.?(\d+)?$/;
    const yymmddMatch = cleanTimestamp.match(yymmddPattern);
    if (yymmddMatch) {
        const [, year, month, day, hour, minute, second, millisecond] = yymmddMatch;
        // Convert 2-digit year to 4-digit (assuming 20xx)
        const fullYear = parseInt(`20${year}`);
        const fullTimestamp = `${fullYear}-${month}-${day} ${hour}:${minute}:${second}${millisecond ? '.' + millisecond : ''}`;
        const parsedDate = new Date(fullTimestamp);
        if (!isNaN(parsedDate.getTime())) {
            return parsedDate.getTime();
        }
    }

    const patterns = [
        /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.?(\d+)?Z?/,
        /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/,
        /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/
    ];

    for (const pattern of patterns) {
        const match = cleanTimestamp.match(pattern);
        if (match) {
            date = new Date(cleanTimestamp);
            if (!isNaN(date.getTime())) {
                return date.getTime();
            }
        }
    }

    return 0;
}

const availableComponents = ["admin", "alternate_protocols_cache", "assert", "aws", "backtrace", "basic_auth", "cache_filter", "client", "compression", "config", "conn_handler", "connection", "credential_injector", "decompression", "dns", "dubbo", "dynamic_modules", "envoy_bug", "ext_authz", "ext_proc", "file", "filter", "forward_proxy", "geolocation", "golang", "grpc", "happy_eyeballs", "hc", "health_checker", "http", "http2", "hystrix", "init", "io", "jwt", "kafka", "key_value_store", "lua", "main", "matcher", "misc", "mongo", "multi_connection", "oauth2", "pool", "quic", "quic_stream", "rate_limit_quota", "rbac", "rds", "redis", "rocketmq", "router", "runtime", "secret", "stats", "stats_sinks", "tap", "testing", "thrift", "tracing", "udp", "upstream", "wasm", "websocket"]

const Logs: React.FC = () => {
    const { project } = useProjectVariable();
    const { services } = useServices('', true);
    const [name, setName] = useState<string>();
    const mutate = useOperationsApiMutation();
    const [searchText, setSearchText] = useState('');
    const [logs, setLogs] = useState<ServiceLogItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [logLineCount, setLogLineCount] = useState(100);
    const [pendingLogLineCount, setPendingLogLineCount] = useState(100);
    const [refreshKey, setRefreshKey] = useState(0);
    const [activeLevels, setActiveLevels] = useState<string[]>([]);
    const [maxLineLength, setMaxLineLength] = useState(100);
    const containerRef = useRef<HTMLDivElement>(null);
    const logListRef = useRef<HTMLDivElement>(null);
    const [activeComponents, setActiveComponents] = useState<string[]>([]);
    const [isLoggerSettingsOpen, setIsLoggerSettingsOpen] = useState(false);
    const [logType, setLogType] = useState<number>(0); // 0: ALL, 1: SYSTEM, 2: ACCESS

    // AI Analysis states
    const [isAIAnalysisOpen, setIsAIAnalysisOpen] = useState(false);
    const [selectedClientForAI, setSelectedClientForAI] = useState<string>('');
    const [customPrompt, setCustomPrompt] = useState<string>('');
    const [aiAnalysisResult, setAIAnalysisResult] = useState<LogAnalysisResult | null>(null);
    const [showAnalysis, setShowAnalysis] = useState(false);
    const analyzeLogsMutation = useAnalyzeLogsMutation();

    const logLevels = [
        { key: 'info', label: 'Info', color: '#40a9ff' },
        { key: 'warning', label: 'Warning', color: '#faad14' },
        { key: 'error', label: 'Error', color: '#ff4d4f' },
        { key: 'debug', label: 'Debug', color: '#b37feb' },
        { key: 'trace', label: 'Trace', color: '#13c2c2' },
        { key: 'critical', label: 'Critical', color: '#d4380d' },
    ];

    const toggleLevel = (level: string) => {
        setActiveLevels(prev =>
            prev.includes(level)
                ? prev.filter(l => l !== level)
                : [...prev, level]
        );
    };

    useEffect(() => {
        function updateMaxLineLength() {
            if (containerRef.current) {
                const width = containerRef.current.offsetWidth;
                const charWidth = 7.2;
                const padding = 220;
                const usableWidth = Math.max(width - padding, 40);
                setMaxLineLength(Math.floor(usableWidth / charWidth));
            }
        }
        updateMaxLineLength();
        window.addEventListener('resize', updateMaxLineLength);
        return () => window.removeEventListener('resize', updateMaxLineLength);
    }, []);

    useEffect(() => {
        let isMounted = true;
        const fetchLogs = async () => {
            setLoading(true);
            setError(null);
            try {
                // Get the version for the selected service
                const selectedService = services?.find(service => service.name === name);
                const serviceVersion = selectedService?.version;

                const data: OperationsResponse<ServiceLogsApiResult>[] = await mutate.mutateAsync({
                    data: {
                        type: OperationsType.SERVICE,
                        sub_type: OperationsSubType.SUB_LOGS,
                        clients: [],
                        command: { 
                            name: name, 
                            project: project, 
                            count: logLineCount, 
                            components: activeComponents, 
                            levels: activeLevels, 
                            search: searchText,
                            log_type: logType // Add log type to the request
                        },
                    },
                    project: project,
                    version: serviceVersion,
                });
                if (isMounted) {
                    const logsArr: (ServiceLogItem & { client_name?: string })[] = [];

                    if (data && Array.isArray(data)) {
                        data.forEach(item => {
                            const clientName = item.identity?.client_name;
                            const serviceLogs = item.Result?.Service?.logs || [];
                            serviceLogs.forEach(log => {
                                logsArr.push({ ...log, client_name: clientName });
                            });
                        });
                    }

                    logsArr.sort((a, b) => {
                        const timeA = parseTimestamp(a.timestamp || '');
                        const timeB = parseTimestamp(b.timestamp || '');

                        return timeB - timeA; // Newest first (descending order)
                    });
                    setLogs(logsArr);
                }
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Logs not found.');
            } finally {
                setLoading(false);
            }
        };
        if (name) fetchLogs();
        return () => { isMounted = false; };
    }, [name, logLineCount, refreshKey, activeComponents, activeLevels, searchText, services, logType]);

    // Removed auto-scroll effect - logs should stay at top
    // useEffect(() => {
    //     if (logListRef.current) {
    //         logListRef.current.scrollTop = logListRef.current.scrollHeight;
    //     }
    // }, [logs]);

    const filteredLogs = logs.filter(log =>
        (!searchText || log.message?.toLowerCase().includes(searchText.toLowerCase()) ||
            log.level?.toLowerCase().includes(searchText.toLowerCase()) ||
            log.client_name === searchText ||
            log.component?.toLowerCase().includes(searchText.toLowerCase())) &&
        (activeLevels.length === 0 || activeLevels.includes(log.level?.toLowerCase())) &&
        (activeComponents.length === 0 || (log.component && activeComponents.includes(log.component)))
    );

    const levelColor = (level: string) => {
        switch ((level || '').toLowerCase()) {
            case 'error': return '#ff4d4f';
            case 'warn': return '#faad14';
            case 'warning': return '#faad14';
            case 'info': return '#40a9ff';
            case 'debug': return '#b37feb';
            case 'trace': return '#13c2c2';
            case 'critical': return '#d4380d';
            default: return '#bfbfbf';
        }
    };

    // Get unique clients from filtered logs
    const getUniqueClients = () => {
        const clientNames = new Set<string>();
        filteredLogs.forEach(log => {
            if (log.client_name) {
                clientNames.add(log.client_name);
            }
        });
        return Array.from(clientNames);
    };

    // Handle AI Analysis
    const handleAIAnalysis = () => {
        const uniqueClients = getUniqueClients();

        if (uniqueClients.length === 0) {
            showWarningNotification('No filtered logs with client information found. Please adjust your filters.');
            return;
        }

        if (uniqueClients.length === 1) {
            // Single client - set it and show modal for optional prompt
            setSelectedClientForAI(uniqueClients[0]);
            setIsAIAnalysisOpen(true);
        } else {
            // Multiple clients - show selection modal
            setSelectedClientForAI('');
            setIsAIAnalysisOpen(true);
        }
    };

    const performAIAnalysis = async (clientName: string) => {
        // Use filtered logs instead of all logs to respect user's filtering choices
        const clientLogs = filteredLogs.filter(log => log.client_name === clientName);

        if (clientLogs.length === 0) {
            showWarningNotification(`No filtered logs found for client: ${clientName}. Please adjust your filters.`);
            return;
        }

        const request: LogAnalyzerRequest = {
            service_name: name || 'unknown',
            client_name: clientName,
            project: project,
            logs: clientLogs.map(log => ({
                message: log.message,
                level: log.level,
                component: log.component,
                timestamp: log.timestamp
            })),
            question: customPrompt.trim() || undefined, // Use custom prompt if provided
            max_logs: 100
        };

        try {
            const result = await analyzeLogsMutation.mutateAsync(request);
            setAIAnalysisResult(result);
            setShowAnalysis(true);
            setIsAIAnalysisOpen(false);
            setSelectedClientForAI('');
            setCustomPrompt('');
            showSuccessNotification('Log analysis completed!');
        } catch (error: any) {
            showErrorNotification(error, 'AI Analysis failed');
        }
    };

    const handleClientSelectionConfirm = () => {
        if (!selectedClientForAI) {
            showWarningNotification('Please select a client');
            return;
        }
        performAIAnalysis(selectedClientForAI);
    };

    return (
        <div style={{ width: '100%', marginTop: '0px', padding: 0 }}>
            {/* Toggle Buttons - Outside Card */}
            {aiAnalysisResult && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginBottom: 6,
                    gap: 8
                }}>
                    <Button
                        type={showAnalysis ? "default" : "primary"}
                        onClick={() => setShowAnalysis(false)}
                        disabled={!showAnalysis}
                        size="middle"
                    >
                        Show Logs
                    </Button>
                    <Button
                        type={showAnalysis ? "primary" : "default"}
                        icon={<RobotOutlined />}
                        onClick={() => setShowAnalysis(true)}
                        disabled={showAnalysis}
                        style={showAnalysis ? { backgroundColor: '#722ed1', borderColor: '#722ed1', color: 'white' } : {}}
                        size="middle"
                    >
                        Show Analysis
                    </Button>
                </div>
            )}

            <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(5,117,230,0.06)', margin: '0 auto' }}>

                {/* Sticky Toolbar */}
                <div
                    style={{
                        position: 'sticky',
                        top: 0,
                        zIndex: 10,
                        background: '#fff',
                        padding: '16px 0 8px 0',
                        borderBottom: '1px solid #f0f0f0',
                        marginBottom: 16
                    }}
                >
                    <div ref={containerRef} style={{ marginBottom: 8 }}>
                        <ServiceLogToolbar
                            searchText={searchText}
                            onSearchTextChange={setSearchText}
                            logLevels={logLevels}
                            activeLevels={activeLevels}
                            onToggleLevel={toggleLevel}
                            pendingLogLineCount={pendingLogLineCount}
                            onPendingLogLineCountChange={(v: number) => setPendingLogLineCount(v)}
                            onRefresh={() => {
                                setLogLineCount(pendingLogLineCount);
                                setRefreshKey(k => k + 1);
                            }}
                            selectedService={name}
                            onServiceChange={setName}
                            enableServiceSearch={true}
                            logType={logType}
                            onLogTypeChange={setLogType}
                            // Component filter props
                            availableComponents={availableComponents}
                            activeComponents={activeComponents}
                            onComponentsChange={setActiveComponents}
                            // Action button props
                            onAIAnalysis={handleAIAnalysis}
                            aiAnalysisLoading={analyzeLogsMutation.isPending}
                            aiAnalysisDisabled={!name || filteredLogs.length === 0}
                            aiAnalysisResult={aiAnalysisResult}
                            onSettingsClick={() => setIsLoggerSettingsOpen(true)}
                            settingsDisabled={!name}
                        />
                    </div>
                </div>

                {/* Main Content - Either Logs or AI Analysis */}
                <div
                    ref={logListRef}
                    style={{
                        background: '#fff',
                        borderRadius: 8,
                        minHeight: 700,
                        maxHeight: 750,
                        overflowY: 'auto',
                        textAlign: 'left',
                        position: 'relative',
                        border: '1px solid #e8e8e8'
                    }}
                >
                    {showAnalysis && aiAnalysisResult ? (
                        /* AI Analysis Results Display */
                        <div style={{ padding: 24 }}>
                            <div style={{ marginBottom: 16, padding: 12, background: '#f6f8fa', borderRadius: 6 }}>
                                <Typography.Text strong>Service: </Typography.Text>
                                <Typography.Text>{aiAnalysisResult.service_name}</Typography.Text>
                                <br />
                                <Typography.Text strong>Client: </Typography.Text>
                                <Typography.Text>{aiAnalysisResult.client_name}</Typography.Text>
                                <br />
                                <Typography.Text strong>Analyzed Logs: </Typography.Text>
                                <Typography.Text>{aiAnalysisResult.log_count}</Typography.Text>
                            </div>
                            {/* Check if we have a dynamic OpenRouter response with multiple fields */}
                            {(aiAnalysisResult.log_summary || Object.keys(aiAnalysisResult).some(key =>
                                !['service_name', 'client_name', 'log_count', 'processed_at', 'token_usage', 'analysis', 'suggestions', 'issues_found'].includes(key)
                            )) ? (
                                <DynamicLogAnalysisRenderer analysisResult={aiAnalysisResult} />
                            ) : (
                                <AIAnalysisRenderer analysis={aiAnalysisResult.analysis} />
                            )}

                            {/* Token Usage Statistics */}
                            {aiAnalysisResult.token_usage && (
                                <Card
                                    size="small"
                                    style={{ marginTop: 16 }}
                                    title={
                                        <Space>
                                            <RobotOutlined style={{ color: '#fff' }} />
                                            <Typography.Text strong style={{ color: '#fff' }}>AI Usage for This Log Analysis</Typography.Text>
                                        </Space>
                                    }
                                >
                                    <Row gutter={16}>
                                        <Col span={6}>
                                            <div>
                                                <Typography.Text type="secondary">Input Tokens:</Typography.Text>
                                                <br />
                                                <Typography.Text strong style={{ color: '#1890ff' }}>
                                                    {aiAnalysisResult.token_usage.input_tokens.toLocaleString()}
                                                </Typography.Text>
                                            </div>
                                        </Col>
                                        <Col span={6}>
                                            <div>
                                                <Typography.Text type="secondary">Output Tokens:</Typography.Text>
                                                <br />
                                                <Typography.Text strong style={{ color: '#52c41a' }}>
                                                    {aiAnalysisResult.token_usage.output_tokens.toLocaleString()}
                                                </Typography.Text>
                                            </div>
                                        </Col>
                                        <Col span={6}>
                                            <div>
                                                <Typography.Text type="secondary">Total Tokens:</Typography.Text>
                                                <br />
                                                <Typography.Text strong style={{ color: '#722ed1' }}>
                                                    {aiAnalysisResult.token_usage.total_tokens.toLocaleString()}
                                                </Typography.Text>
                                            </div>
                                        </Col>
                                        <Col span={6}>
                                            <div>
                                                <Typography.Text type="secondary">Cost (USD):</Typography.Text>
                                                <br />
                                                <Typography.Text strong style={{ color: '#fa8c16' }}>
                                                    ${aiAnalysisResult.token_usage.cost_usd.toFixed(4)}
                                                </Typography.Text>
                                            </div>
                                        </Col>
                                    </Row>
                                    <div style={{
                                        marginTop: 12,
                                        padding: '6px 12px',
                                        background: '#f6ffed',
                                        border: '1px solid #b7eb8f',
                                        borderRadius: 4,
                                        fontSize: 12,
                                        color: '#52c41a'
                                    }}>
                                        ✓ Log analysis completed • {aiAnalysisResult.log_count} logs processed
                                    </div>
                                </Card>
                            )}
                        </div>
                    ) : !name ? (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            minHeight: 700,
                            padding: '40px 10px',
                            textAlign: 'center',
                            background: 'linear-gradient(135deg, rgb(240, 242, 245) 0%, rgb(230, 247, 255) 100%)'
                        }}>
                            <div style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: '50%',
                                width: 80,
                                height: 80,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 32,
                                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
                            }}>
                                <div style={{ fontSize: 32, color: '#fff' }}><FileTextOutlined /></div>
                            </div>

                            <h1 style={{
                                fontSize: 32,
                                fontWeight: 700,
                                color: '#2c3e50',
                                margin: 0,
                                marginBottom: 16,
                                background: 'linear-gradient(135deg,rgb(5, 26, 119) 0%,rgb(0, 0, 0) 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                Service Logs
                            </h1>

                            <p style={{
                                fontSize: 18,
                                color: '#6c757d',
                                margin: 0,
                                marginBottom: 8,
                                maxWidth: 500,
                                lineHeight: 1.6
                            }}>
                                Select a service to view logs
                            </p>

                            <p style={{
                                fontSize: 14,
                                color: '#adb5bd',
                                margin: 0,
                                marginBottom: 40
                            }}>
                                Real-time log monitoring and search features
                            </p>

                            <div style={{
                                display: 'flex',
                                gap: 24,
                                marginTop: 20
                            }}>
                                <div style={{
                                    background: '#fff',
                                    padding: '20px 24px',
                                    borderRadius: 12,
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                    border: '1px solid #e9ecef',
                                    minWidth: 140
                                }}>
                                    <div style={{ fontSize: 24, marginBottom: 8 }}>🔍</div>
                                    <div style={{ fontSize: 14, fontWeight: 600, color: '#495057' }}>Advanced Search</div>
                                    <div style={{ fontSize: 12, color: '#868e96' }}>Filter & find logs</div>
                                </div>

                                <div style={{
                                    background: '#fff',
                                    padding: '20px 24px',
                                    borderRadius: 12,
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                    border: '1px solid #e9ecef',
                                    minWidth: 140
                                }}>
                                    <div style={{ fontSize: 24, marginBottom: 8 }}>⚡</div>
                                    <div style={{ fontSize: 14, fontWeight: 600, color: '#495057' }}>Real-time</div>
                                    <div style={{ fontSize: 12, color: '#868e96' }}>Live log updates</div>
                                </div>

                                <div style={{
                                    background: '#fff',
                                    padding: '20px 24px',
                                    borderRadius: 12,
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                    border: '1px solid #e9ecef',
                                    minWidth: 140
                                }}>
                                    <div style={{ fontSize: 24, marginBottom: 8 }}>📋</div>
                                    <div style={{ fontSize: 14, fontWeight: 600, color: '#495057' }}>Level Filtering</div>
                                    <div style={{ fontSize: 12, color: '#868e96' }}>Error, info, debug</div>
                                </div>
                            </div>
                        </div>
                    ) : error ? (
                        <Alert type="error" message={error} style={{ margin: 24 }} />
                    ) : filteredLogs.length === 0 && !loading ? (
                        <div style={{ textAlign: 'center', color: '#888', padding: 48 }}>
                            <div style={{ fontSize: 40, marginBottom: 12 }}>🗒️</div>
                            <div style={{ fontSize: 18, fontWeight: 500 }}>No logs found in current logs!</div>
                            <div style={{ fontSize: 14, marginTop: 4 }}>Check your search and filter criteria and refetch logs.</div>
                        </div>
                    ) : (
                        /* Kibana-style Log Display */
                        <div style={{ opacity: loading ? 0.5 : 1, transition: 'opacity 0.2s' }}>
                            {/* Sticky Header */}
                            <div style={{
                                position: 'sticky',
                                top: 0,
                                zIndex: 10,
                                background: '#f8f9fa',
                                borderBottom: '2px solid #dee2e6',
                                display: 'flex',
                                alignItems: 'center',
                                padding: '12px 16px',
                                fontSize: 12,
                                fontWeight: 600,
                                color: '#495057',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                {/* Line Number Header */}
                                <div style={{
                                    minWidth: 40,
                                    textAlign: 'right',
                                    marginRight: 12,
                                    color: '#6c757d'
                                }}>
                                    #
                                </div>

                                {/* Timestamp Header */}
                                <div style={{
                                    minWidth: 140,
                                    marginRight: 12,
                                    color: '#495057'
                                }}>
                                    Timestamp
                                </div>

                                {/* Level Header */}
                                <div style={{
                                    minWidth: 60,
                                    marginRight: 12,
                                    color: '#495057'
                                }}>
                                    Level
                                </div>

                                {/* Component Header */}
                                <div style={{
                                    minWidth: 80,
                                    marginRight: 12,
                                    color: '#495057'
                                }}>
                                    Component
                                </div>

                                {/* Client Header */}
                                <div style={{
                                    minWidth: 100,
                                    marginRight: 12,
                                    color: '#495057'
                                }}>
                                    Client
                                </div>

                                {/* Message Header */}
                                <div style={{
                                    flex: 1,
                                    paddingLeft: 8,
                                    color: '#495057'
                                }}>
                                    Message
                                </div>
                            </div>

                            {/* Log Rows */}
                            {filteredLogs.map((log, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        padding: '8px 16px',
                                        borderBottom: '1px solid #f0f0f0',
                                        background: idx % 2 === 0 ? '#fafafa' : '#fff',
                                        transition: 'background-color 0.15s ease',
                                        cursor: 'pointer',
                                        fontSize: 13
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#e6f7ff';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#fafafa' : '#fff';
                                    }}
                                >
                                    {/* Line Number */}
                                    <div style={{
                                        minWidth: 40,
                                        textAlign: 'right',
                                        marginRight: 12,
                                        color: '#bfbfbf',
                                        fontSize: 12,
                                        lineHeight: '20px'
                                    }}>
                                        {idx + 1}
                                    </div>

                                    {/* Timestamp */}
                                    <div style={{
                                        minWidth: 140,
                                        color: '#666',
                                        fontSize: 12,
                                        marginRight: 12,
                                        lineHeight: '20px'
                                    }}>
                                        {log.timestamp}
                                    </div>

                                    {/* Level Badge */}
                                    <div style={{
                                        minWidth: 60,
                                        marginRight: 12,
                                        lineHeight: '20px'
                                    }}>
                                        <span style={{
                                            background: levelColor(log.level),
                                            color: '#fff',
                                            padding: '2px 6px',
                                            borderRadius: 3,
                                            fontSize: 10,
                                            fontWeight: 600,
                                            textTransform: 'uppercase'
                                        }}>
                                            {log.level}
                                        </span>
                                    </div>

                                    {/* Component */}
                                    {log.component && (
                                        <div style={{
                                            minWidth: 80,
                                            color: '#666',
                                            fontSize: 11,
                                            marginRight: 12,
                                            lineHeight: '20px'
                                        }}>
                                            [{log.component}]
                                        </div>
                                    )}

                                    {/* Client Name */}
                                    {log.client_name && (
                                        <div style={{
                                            minWidth: 100,
                                            color: '#1890ff',
                                            fontSize: 11,
                                            marginRight: 12,
                                            fontWeight: 500,
                                            lineHeight: '20px'
                                        }}>
                                            [{log.client_name}]
                                        </div>
                                    )}

                                    {/* Log Message */}
                                    <div style={{
                                        flex: 1,
                                        fontFamily: "'Fira Code', 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace",
                                        fontSize: 12,
                                        lineHeight: '20px',
                                        color: '#2c3e50',
                                        paddingLeft: 8
                                    }}>
                                        {(() => {
                                            const formatted = formatLogMessage(log.message, log.level);
                                            
                                            if (formatted.isJsonLog) {
                                                // JSON formatted log - single line with highlighted key-value pairs
                                                return (
                                                    <div style={{
                                                        fontFamily: 'monospace',
                                                        fontSize: 12,
                                                        lineHeight: '20px',
                                                        wordBreak: 'break-word',
                                                        overflowWrap: 'break-word'
                                                    }}>
                                                        {Object.entries(formatted.jsonData).map(([key, value], idx) => (
                                                            <span key={idx}>
                                                                <span style={{
                                                                    color: '#1890ff',
                                                                    fontWeight: 600
                                                                }}>{key}</span>
                                                                <span style={{ color: '#666' }}>: </span>
                                                                <span style={{
                                                                    color: '#2c3e50',
                                                                    wordBreak: 'break-all',
                                                                    display: 'inline-block',
                                                                    maxWidth: '100%'
                                                                }}>
                                                                    {String(value)}
                                                                </span>
                                                                {idx < Object.entries(formatted.jsonData).length - 1 &&
                                                                    <span style={{ color: '#ccc' }}> | </span>
                                                                }
                                                            </span>
                                                        ))}
                                                    </div>
                                                );
                                            } else if (formatted.isAccessLog) {
                                                return (
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                                        {/* HTTP Request Info */}
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                                            {formatted.httpMethod && (
                                                                <span style={{
                                                                    background: '#1890ff',
                                                                    color: 'white',
                                                                    padding: '2px 6px',
                                                                    borderRadius: 3,
                                                                    fontSize: 10,
                                                                    fontWeight: 600
                                                                }}>
                                                                    {formatted.httpMethod}
                                                                </span>
                                                            )}
                                                            {formatted.path && (
                                                                <span style={{
                                                                    background: '#f0f0f0',
                                                                    padding: '2px 6px',
                                                                    borderRadius: 3,
                                                                    fontSize: 11,
                                                                    fontFamily: 'monospace'
                                                                }}>
                                                                    {formatted.path}
                                                                </span>
                                                            )}
                                                            {formatted.statusCode && (
                                                                <span style={{
                                                                    background: formatted.isError ? '#ff4d4f' : '#52c41a',
                                                                    color: 'white',
                                                                    padding: '2px 6px',
                                                                    borderRadius: 3,
                                                                    fontSize: 10,
                                                                    fontWeight: 600
                                                                }}>
                                                                    {formatted.statusCode}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {/* Full log message - always visible */}
                                                        <div style={{ 
                                                            marginTop: 4, 
                                                            fontSize: 12,
                                                            color: '#666',
                                                            fontFamily: "'Fira Code', 'SF Mono', Monaco, monospace"
                                                        }}>
                                                            {formatted.message}
                                                        </div>
                                                    </div>
                                                );
                                            } else if (formatted.isControlPlaneLog) {
                                                // Control plane logs - just show the full message without badges
                                                return log.message.split('\n').map((line, i) => {
                                                    const match = line.match(/^(\s*)(.*)$/);
                                                    const spaces = match ? match[1] : '';
                                                    const wrapped = wrapWithIndent(line, spaces, maxLineLength - 45);
                                                    return wrapped.map((wrappedLine, j) => (
                                                        <div
                                                            key={i + '-' + j}
                                                            style={{
                                                                whiteSpace: 'pre',
                                                                wordBreak: 'break-all',
                                                                display: 'block',
                                                            }}
                                                        >
                                                            {wrappedLine}
                                                        </div>
                                                    ));
                                                });
                                            } else {
                                                // Regular log message display
                                                return log.message.split('\n').map((line, i) => {
                                                    const match = line.match(/^(\s*)(.*)$/);
                                                    const spaces = match ? match[1] : '';
                                                    const wrapped = wrapWithIndent(line, spaces, maxLineLength - 45);
                                                    return wrapped.map((wrappedLine, j) => (
                                                        <div
                                                            key={i + '-' + j}
                                                            style={{
                                                                whiteSpace: 'pre',
                                                                wordBreak: 'break-all',
                                                                display: 'block',
                                                            }}
                                                        >
                                                            {wrappedLine}
                                                        </div>
                                                    ));
                                                });
                                            }
                                        })()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {loading && (
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            background: 'rgba(255, 255, 255, 0.9)',
                            padding: '20px',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            backdropFilter: 'blur(2px)'
                        }}>
                            <Spin size="large" />
                        </div>
                    )}
                </div>

                <LoggerSettingsDrawer
                    open={isLoggerSettingsOpen}
                    onClose={() => setIsLoggerSettingsOpen(false)}
                    name={name}
                    project={project}
                    version={services?.find(service => service.name === name)?.version || ''}
                />

                {/* Client Selection Modal - Only for multiple clients */}
                <Modal
                    title={
                        <Space>
                            <RobotOutlined style={{ color: '#722ed1' }} />
                            AI Log Analysis Setup
                        </Space>
                    }
                    open={isAIAnalysisOpen}
                    onOk={handleClientSelectionConfirm}
                    onCancel={() => {
                        setIsAIAnalysisOpen(false);
                        setSelectedClientForAI('');
                        setCustomPrompt('');
                    }}
                    confirmLoading={analyzeLogsMutation.isPending}
                    okText="Analyze Logs"
                    cancelText="Cancel"
                >
                    {getUniqueClients().length > 1 ? (
                        <>
                            <div style={{ marginBottom: 16 }}>
                                <Typography.Text type="secondary">
                                    Multiple clients detected in filtered logs. Please select which client's filtered logs you want to analyze:
                                </Typography.Text>
                            </div>
                            <Select
                                style={{ width: '100%', marginBottom: 16 }}
                                placeholder="Select a client"
                                value={selectedClientForAI}
                                onChange={setSelectedClientForAI}
                                options={getUniqueClients().map(client => ({
                                    label: `${client} (${filteredLogs.filter(log => log.client_name === client).length} filtered logs)`,
                                    value: client
                                }))}
                            />
                        </>
                    ) : (
                        <div style={{ marginBottom: 16 }}>
                            <Typography.Text type="secondary">
                                Analyzing logs for client: <strong>{selectedClientForAI}</strong> ({filteredLogs.filter(log => log.client_name === selectedClientForAI).length} filtered logs)
                            </Typography.Text>
                        </div>
                    )}

                    <div style={{ marginBottom: 16 }}>
                        <Typography.Text strong style={{ display: 'block', marginBottom: 8 }}>
                            Custom Analysis Question (Optional)
                        </Typography.Text>
                        <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>
                            Leave empty for general log analysis, or provide a specific question about the logs.
                        </Typography.Text>
                        <Input.TextArea
                            rows={3}
                            placeholder="e.g., Find all connection errors, Analyze performance issues, Look for security anomalies..."
                            value={customPrompt}
                            onChange={(e) => setCustomPrompt(e.target.value)}
                            maxLength={500}
                            showCount
                            style={{ resize: 'none' }}
                        />
                    </div>
                </Modal>
            </Card>
        </div>
    );
};

export default Logs;
