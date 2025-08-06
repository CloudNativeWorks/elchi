import React, { useState, useEffect, useRef } from 'react';
import { Spin, Alert, Select, Button, Card } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { useOperationsApiMutation } from '@/common/operations-api';
import { OperationsSubType, OperationsType } from '@/common/types';
import { OperationsResponse, ServiceLogsApiResult, ServiceLogItem } from './model';
import LogToolbar from '@/elchi/components/common/LogToolBar';
import LoggerSettingsModal from './LoggerSettingsModal';
import { useProjectVariable } from '@/hooks/useProjectVariable';

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
    
    console.warn('Timestamp parse edilemedi:', timestamp);
    return 0;
}

const availableComponents = ["admin", "alternate_protocols_cache", "assert", "aws", "backtrace", "basic_auth", "cache_filter", "client", "compression", "config", "conn_handler", "connection", "credential_injector", "decompression", "dns", "dubbo", "dynamic_modules", "envoy_bug", "ext_authz", "ext_proc", "file", "filter", "forward_proxy", "geolocation", "golang", "grpc", "happy_eyeballs", "hc", "health_checker", "http", "http2", "hystrix", "init", "io", "jwt", "kafka", "key_value_store", "lua", "main", "matcher", "misc", "mongo", "multi_connection", "oauth2", "pool", "quic", "quic_stream", "rate_limit_quota", "rbac", "rds", "redis", "rocketmq", "router", "runtime", "secret", "stats", "stats_sinks", "tap", "testing", "thrift", "tracing", "udp", "upstream", "wasm", "websocket"]

const Logs: React.FC = () => {
    const { project } = useProjectVariable();
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
                const data: OperationsResponse<ServiceLogsApiResult>[] = await mutate.mutateAsync({
                    data: {
                        type: OperationsType.SERVICE,
                        sub_type: OperationsSubType.SUB_LOGS,
                        clients: [],
                        command: { name: name, project: project, count: logLineCount, components: activeComponents, levels: activeLevels, search: searchText },
                    }
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
                        
                        return timeA - timeB;
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
    }, [name, logLineCount, refreshKey, activeComponents, activeLevels, searchText]);

    useEffect(() => {
        if (logListRef.current) {
            logListRef.current.scrollTop = logListRef.current.scrollHeight;
        }
    }, [logs]);

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

    return (
        <div style={{ width: '100%', marginTop: '0px', padding: 0 }}>
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
                        <div style={{ marginBottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                                <LogToolbar
                                    searchText={searchText}
                                    onSearchTextChange={setSearchText}
                                    logLevels={logLevels}
                                    activeLevels={activeLevels}
                                    onToggleLevel={toggleLevel}
                                    pendingLogLineCount={pendingLogLineCount}
                                    onPendingLogLineCountChange={v => setPendingLogLineCount(Number(v) || 100)}
                                    onRefresh={() => {
                                        setLogLineCount(pendingLogLineCount);
                                        setRefreshKey(k => k + 1);
                                    }}
                                    serviceLog={true}
                                    selectedService={name}
                                    onServiceChange={setName}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                                <Button
                                    icon={<SettingOutlined />}
                                    onClick={() => setIsLoggerSettingsOpen(true)}
                                    title="Manage Log Levels"
                                >
                                    Log Levels
                                </Button>
                            </div>
                        </div>
                        {availableComponents.length > 0 && (
                            <div style={{ marginTop: 0 }}>
                                <Select
                                    mode="multiple"
                                    allowClear
                                    style={{ width: '100%' }}
                                    placeholder="Filter by components..."
                                    value={activeComponents}
                                    onChange={setActiveComponents}
                                    options={availableComponents.map(comp => ({
                                        label: comp,
                                        value: comp
                                    }))}
                                    maxTagCount="responsive"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Log Display */}
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
                    {!name ? (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            padding: '115px 10px',
                            textAlign: 'center',
                            background: 'linear-gradient(135deg, rgb(240, 242, 245) 0%, rgb(230, 247, 255) 100%)'
                        }}>
                            <div style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: '50%',
                                width: 120,
                                height: 120,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 32,
                                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
                            }}>
                                <div style={{ fontSize: 48, color: '#fff' }}>📊</div>
                            </div>

                            <h1 style={{
                                fontSize: 32,
                                fontWeight: 700,
                                color: '#2c3e50',
                                margin: 0,
                                marginBottom: 16,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
                                        {log.message.split('\n').map((line, i) => {
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
                                        })}
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

                <LoggerSettingsModal
                    open={isLoggerSettingsOpen}
                    onClose={() => setIsLoggerSettingsOpen(false)}
                    name={name}
                    project={project}
                />
            </Card>
        </div>
    );
};

export default Logs;
