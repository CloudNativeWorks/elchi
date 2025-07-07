import React, { useState, useEffect, useRef } from 'react';
import { Spin, Alert, Select, Button } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { useOperationsApiMutation } from '@/common/operations-api';
import { OperationsSubType, OperationsType } from '@/common/types';
import { OperationsResponse, ServiceLogsApiResult, ServiceLogItem } from './model';
import LogToolbar from '../common/LogToolBar';
import LoggerSettingsModal from './LoggerSettingsModal';


interface ServiceLogProps {
    name: string;
    project: string;
}

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

const availableComponents = ["admin", "alternate_protocols_cache", "assert", "aws", "backtrace", "basic_auth", "cache_filter", "client", "compression", "config", "conn_handler", "connection", "credential_injector", "decompression", "dns", "dubbo", "dynamic_modules", "envoy_bug", "ext_authz", "ext_proc", "file", "filter", "forward_proxy", "geolocation", "golang", "grpc", "happy_eyeballs", "hc", "health_checker", "http", "http2", "hystrix", "init", "io", "jwt", "kafka", "key_value_store", "lua", "main", "matcher", "misc", "mongo", "multi_connection", "oauth2", "pool", "quic", "quic_stream", "rate_limit_quota", "rbac", "rds", "redis", "rocketmq", "router", "runtime", "secret", "stats", "stats_sinks", "tap", "testing", "thrift", "tracing", "udp", "upstream", "wasm", "websocket"]

const ServiceLogs: React.FC<ServiceLogProps> = ({ name, project }) => {
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

                    logsArr.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
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
    }, [name, logLineCount, refreshKey]);

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
        <div>
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

            <div 
                ref={logListRef} 
                style={{ 
                    background: '#181c20', 
                    borderRadius: 8, 
                    padding: 16, 
                    fontFamily: 'monospace', 
                    fontSize: 13, 
                    minHeight: 650, 
                    maxHeight: 650, 
                    overflowY: 'auto', 
                    textAlign: 'left',
                    position: 'relative',
                    marginTop: 12
                }}
            >
                {error ? (
                    <Alert type="error" message={error} style={{ margin: 24 }} />
                ) : filteredLogs.length === 0 && !loading ? (
                    <div style={{ textAlign: 'center', color: '#888', padding: 48 }}>
                        <div style={{ fontSize: 40, marginBottom: 12 }}>🗒️</div>
                        <div style={{ fontSize: 18, fontWeight: 500 }}>No logs found in current logs!</div>
                        <div style={{ fontSize: 14, marginTop: 4 }}>Check your search and filter criteria and refetch logs.</div>
                    </div>
                ) : (
                    <div style={{ opacity: loading ? 0.5 : 1, transition: 'opacity 0.2s' }}>
                        {filteredLogs.map((log, idx) => {
                            const lines = log.message.split('\n');
                            return (
                                <div
                                    key={idx}
                                    style={{
                                        marginBottom: 10,
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        fontFamily: 'monospace',
                                        fontSize: 13,
                                    }}
                                >
                                    <span style={{ color: '#666', minWidth: 32, textAlign: 'right', marginRight: 8, marginLeft: -5 }}>
                                        {idx + 1}
                                    </span>
                                    <span style={{ color: '#888', marginRight: 4 }}>[{log.timestamp}]</span>
                                    <span style={{ color: levelColor(log.level), fontWeight: 700, marginRight: 4 }}>[{log.level?.toUpperCase()}]</span>
                                    {log.client_name && (
                                        <span style={{ color: '#13c2c2', fontWeight: 600, marginRight: 8 }}>
                                            [{log.client_name}]
                                        </span>
                                    )}
                                    {log.component && (
                                        <span style={{ color: '#bfbfbf', marginRight: 4 }}>[{log.component}]</span>
                                    )}

                                    <span
                                        style={{
                                            flex: 1,
                                            minWidth: 0,
                                            paddingLeft: 8,
                                            display: 'block',
                                            color: '#fff',
                                        }}
                                    >
                                        {lines.map((line, i) => {
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
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
                {loading && (
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: 'rgba(24, 28, 32, 0.7)',
                        padding: '20px',
                        borderRadius: '8px',
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
        </div>
    );
};

export default ServiceLogs;
