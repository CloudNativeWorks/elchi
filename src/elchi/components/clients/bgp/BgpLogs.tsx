import React, { useState, useEffect, useRef } from 'react';
import { Spin, Alert } from 'antd';
import { useOperationsApiMutation } from '@/common/operations-api';
import { OperationsType } from '@/common/types';
import LogToolbar from '../../common/LogToolBar';

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

interface BgpLogProps {
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

const BgpLogs: React.FC<BgpLogProps> = ({ clientId }) => {
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
                const data = await mutate.mutateAsync({
                    data: {
                        type: OperationsType.FRR_LOGS,
                        clients: [{ client_id: clientId }],
                        command: { count: logLineCount },
                    }
                });
                if (isMounted) {
                    const logsArr: LogItem[] =
                        data && Array.isArray(data) && data[0]?.Result?.GeneralLog?.logs
                            ? data[0].Result.GeneralLog.logs
                            : [];
                    logsArr.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
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

    useEffect(() => {
        if (logListRef.current) {
            logListRef.current.scrollTop = logListRef.current.scrollHeight;
        }
    }, [logs]);

    const filteredLogs = logs.filter(log =>
        (!searchText || log.message?.toLowerCase().includes(searchText.toLowerCase()) ||
            log.level?.toLowerCase().includes(searchText.toLowerCase()) ||
            log.module?.toLowerCase().includes(searchText.toLowerCase())) &&
        (activeLevels.length === 0 || activeLevels.includes(log.level?.toLowerCase()))
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
                    background: '#fff',
                    borderRadius: 8,
                    minHeight: 700,
                    maxHeight: 700,
                    overflowY: 'auto',
                    textAlign: 'left',
                    position: 'relative',
                    border: '1px solid #e8e8e8'
                }}
            >
                {error ? (
                    <Alert type="error" message={error} style={{ margin: 24 }} />
                ) : filteredLogs.length === 0 && !loading ? (
                    <div style={{ textAlign: 'center', color: '#888', padding: 48 }}>
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
        </div>
    );
};

export default BgpLogs;
