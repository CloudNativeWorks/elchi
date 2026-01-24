import React, { useState, useEffect, useRef } from 'react';
import { Spin, Alert } from 'antd';
import { useOperationsApiMutation } from '@/common/operations-api';
import { OperationsType } from '@/common/types';
import LogToolbar from '../common/LogToolBar';
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

interface ClientLogProps {
    clientId: string;
}

interface LogItem {
    message: string;
    level: string;
    module?: string;
    timestamp: string;
    file?: string;
    metadata?: Record<string, any>;
}

const ClientLogs: React.FC<ClientLogProps> = ({ clientId }) => {
    const { project } = useProjectVariable();
    const mutate = useOperationsApiMutation();
    const [searchText, setSearchText] = useState('');
    const [logs, setLogs] = useState<LogItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [logLineCount, setLogLineCount] = useState(100);
    const [pendingLogLineCount, setPendingLogLineCount] = useState(100);
    const [refreshKey, setRefreshKey] = useState(0);
    const [maxLineLength, setMaxLineLength] = useState(100);
    const containerRef = useRef<HTMLDivElement>(null);
    const logListRef = useRef<HTMLDivElement>(null);
    const [activeLevels, setActiveLevels] = useState<string[]>([]);
    
    const logLevels = [
        { key: 'info', label: 'Info', color: 'var(--color-info)' },
        { key: 'warning', label: 'Warning', color: 'var(--color-warning)' },
        { key: 'error', label: 'Error', color: 'var(--color-danger)' },
        { key: 'debug', label: 'Debug', color: 'var(--color-purple)' },
        { key: 'trace', label: 'Trace', color: 'var(--color-cyan)' },
        { key: 'critical', label: 'Critical', color: 'var(--color-danger-dark)' },
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
                const data = await mutate.mutateAsync({
                    data: {
                        type: OperationsType.CLIENT_LOGS,
                        clients: [{ client_id: clientId }],
                        command: { count: logLineCount },
                    },
                    project
                });
                if (isMounted) {
                    const logsArr: LogItem[] =
                        data && Array.isArray(data) && data[0]?.Result?.GeneralLog?.logs
                            ? data[0].Result.GeneralLog.logs
                            : [];
                    logsArr.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()); // Newest first
                    setLogs(logsArr);
                }
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Logs not found.');
            } finally {
                setLoading(false);
            }
        };
        if (clientId) fetchLogs();
        return () => { isMounted = false; };
    }, [clientId, logLineCount, refreshKey]);

    // Removed auto-scroll effect - logs should stay at top
    // useEffect(() => {
    //     if (logListRef.current) {
    //         logListRef.current.scrollTop = logListRef.current.scrollHeight;
    //     }
    // }, [logs]);

    const filteredLogs = logs.filter(log =>
        (!searchText || log.message?.toLowerCase().includes(searchText.toLowerCase()) ||
            log.level?.toLowerCase().includes(searchText.toLowerCase()) ||
            log.module?.toLowerCase().includes(searchText.toLowerCase())) &&
        (activeLevels.length === 0 || activeLevels.includes(log.level?.toLowerCase()))
    );

    const levelColor = (level: string) => {
        switch ((level || '').toLowerCase()) {
            case 'error': return 'var(--color-danger)';
            case 'warn': return 'var(--color-warning)';
            case 'warning': return 'var(--color-warning)';
            case 'info': return 'var(--color-info)';
            case 'debug': return 'var(--color-purple)';
            case 'trace': return 'var(--color-cyan)';
            case 'critical': return 'var(--color-danger-dark)';
            default: return 'var(--text-disabled)';
        }
    };

    const formatTimestamp = (timestamp: string) => {
        try {
            const date = new Date(timestamp);
            return date.toLocaleString('tr-TR', {
                day: '2-digit',
                month: '2-digit', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });
        } catch {
            return timestamp;
        }
    };

    return (
        <div>
            <div ref={containerRef} style={{ marginBottom: 8 }}>
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

            {/* Compact Kibana-style Log Display */}
            <div
                ref={logListRef}
                style={{
                    background: 'var(--card-bg)',
                    borderRadius: 8,
                    minHeight: 700,
                    maxHeight: 700,
                    overflowY: 'auto',
                    textAlign: 'left',
                    position: 'relative',
                    border: '1px solid var(--border-default)'
                }}
            >
                {error ? (
                    <Alert type="error" message={error} style={{ margin: 24 }} />
                ) : filteredLogs.length === 0 && !loading ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 48 }}>
                        <div style={{ fontSize: 40, marginBottom: 12 }}>🗒️</div>
                        <div style={{ fontSize: 18, fontWeight: 500 }}>No logs found!</div>
                        <div style={{ fontSize: 14, marginTop: 4 }}>Check your search and filter criteria.</div>
                    </div>
                ) : (
                    <div style={{ opacity: loading ? 0.5 : 1, transition: 'opacity 0.2s' }}>
                        {/* Sticky Header */}
                        <div style={{
                            position: 'sticky',
                            top: 0,
                            zIndex: 10,
                            background: 'var(--bg-surface)',
                            borderBottom: '2px solid var(--border-default)',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '12px 16px',
                            fontSize: 12,
                            fontWeight: 600,
                            color: 'var(--text-secondary)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            {/* Line Number Header */}
                            <div style={{
                                minWidth: 40,
                                textAlign: 'right',
                                marginRight: 12,
                                color: 'var(--text-tertiary)'
                            }}>
                                #
                            </div>

                            {/* Timestamp Header */}
                            <div style={{
                                minWidth: 140,
                                marginRight: 12,
                                color: 'var(--text-secondary)'
                            }}>
                                Timestamp
                            </div>

                            {/* Level Header */}
                            <div style={{
                                minWidth: 60,
                                marginRight: 12,
                                color: 'var(--text-secondary)'
                            }}>
                                Level
                            </div>

                            {/* Message Header */}
                            <div style={{
                                flex: 1,
                                paddingLeft: 8,
                                color: 'var(--text-secondary)'
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
                                    borderBottom: '1px solid var(--border-default)',
                                    background: idx % 2 === 0 ? 'var(--bg-surface)' : 'var(--card-bg)',
                                    transition: 'background-color 0.15s ease',
                                    cursor: 'pointer',
                                    fontSize: 13
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = idx % 2 === 0 ? 'var(--bg-surface)' : 'var(--card-bg)';
                                }}
                            >
                                {/* Line Number */}
                                <div style={{
                                    minWidth: 40,
                                    textAlign: 'right',
                                    marginRight: 12,
                                    color: 'var(--text-tertiary)',
                                    fontSize: 12,
                                    lineHeight: '20px'
                                }}>
                                    {idx + 1}
                                </div>

                                {/* Timestamp */}
                                <div style={{
                                    minWidth: 140,
                                    color: 'var(--text-secondary)',
                                    fontSize: 12,
                                    marginRight: 12,
                                    lineHeight: '20px'
                                }}>
                                    {formatTimestamp(log.timestamp)}
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

                                {/* Log Message */}
                                <div style={{
                                    flex: 1,
                                    fontFamily: "'Fira Code', 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace",
                                    fontSize: 12,
                                    lineHeight: '20px',
                                    color: 'var(--text-primary)',
                                    paddingLeft: 8
                                }}>
                                    {log.message.split('\n').map((line, i) => {
                                        const match = line.match(/^(\s*)(.*)$/);
                                        const spaces = match ? match[1] : '';
                                        const wrapped = wrapWithIndent(line, spaces, maxLineLength - 20);
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
                                    
                                    {/* Metadata */}
                                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                                        <div style={{
                                            fontSize: 11,
                                            marginTop: 4,
                                            padding: '4px 8px',
                                            background: 'var(--bg-surface)',
                                            borderRadius: 4,
                                            borderLeft: '3px solid var(--color-cyan)'
                                        }}>
                                            {Object.entries(log.metadata).map(([k, v]) => (
                                                <span key={k} style={{ marginRight: 12, display: 'inline-block' }}>
                                                    <span style={{ color: 'var(--color-cyan)', fontWeight: 600 }}>{k}</span>
                                                    <span style={{ color: 'var(--text-secondary)', margin: '0 4px' }}>=</span>
                                                    <span style={{ color: 'var(--text-primary)' }}>{String(v)}</span>
                                                </span>
                                            ))}
                                        </div>
                                    )}
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
                        background: 'var(--bg-loading)',
                        padding: '20px',
                        borderRadius: '8px',
                        boxShadow: 'var(--shadow-lg)',
                        backdropFilter: 'blur(2px)'
                    }}>
                        <Spin size="large" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientLogs;
