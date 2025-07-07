import React, { useState, useEffect } from 'react';
import { Spin, Alert } from 'antd';
import { useOperationsApiMutation } from '@/common/operations-api';
import { OperationsType } from '@/common/types';
import LogToolbar from '../../common/LogToolBar';

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
    const logLevels = [
        { key: 'info', label: 'Info', color: '#40a9ff' },
        { key: 'warning', label: 'Warning', color: '#faad14' },
        { key: 'error', label: 'Error', color: '#ff4d4f' },
        { key: 'debug', label: 'Debug', color: '#b37feb' },
    ];
    const [activeLevels, setActiveLevels] = useState<string[]>([]);
    const logListRef = React.useRef<HTMLDivElement>(null);

    const toggleLevel = (level: string) => {
        setActiveLevels(prev =>
            prev.includes(level)
                ? prev.filter(l => l !== level)
                : [...prev, level]
        );
    };

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
            default: return '#bfbfbf';
        }
    };

    return (
        <div>
            <div style={{ marginBottom: 8 }}>
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
                        <div style={{ fontSize: 18, fontWeight: 500 }}>No logs found!</div>
                        <div style={{ fontSize: 14, marginTop: 4 }}>Check your search and filter criteria.</div>
                    </div>
                ) : (
                    <div style={{ opacity: loading ? 0.5 : 1, transition: 'opacity 0.2s' }}>
                                                {filteredLogs.map((log, idx) => {
                            const lineNumber = idx + 1;
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
                                        lineHeight: '1.4'
                                    }}
                                >
                                    <span style={{ color: '#666', minWidth: 32, textAlign: 'right', marginRight: 8, marginLeft: -5 }}>
                                        {lineNumber}
                                    </span>
                                    <span style={{ color: '#888', marginRight: 4 }}>[{log.timestamp}]</span>
                                    <span style={{ color: levelColor(log.level), fontWeight: 700, marginRight: 4 }}>[{log.level?.toUpperCase()}]</span>
                                    {log.module && (
                                        <span style={{ color: '#bfbfbf', marginRight: 4 }}>[{log.module}]</span>
                                    )}
                                    {log.file && (
                                        <span style={{ color: '#bfbfbf', marginRight: 4 }}>[{log.file}]</span>
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
                                        {lines.map((line, i) => (
                                            <div
                                                key={i}
                                                style={{
                                                    whiteSpace: 'pre-wrap',
                                                    wordBreak: 'break-word',
                                                    overflowWrap: 'break-word',
                                                    display: 'block',
                                                }}
                                            >
                                                {line}
                                            </div>
                                        ))}
                                        
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
        </div>
    );
};

export default BgpLogs;
