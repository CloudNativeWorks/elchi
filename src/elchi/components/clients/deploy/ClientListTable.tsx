import { Table, Input } from 'antd';
import { useMemo } from 'react';
import { OperationsType } from '@/common/types';

interface ClientVersionInfo {
    client_id: string;
    downloaded_versions?: string[];
    error?: string;
}

interface ClientListTableProps {
    clients: any[];
    selectedRowKeys: string[];
    onSelectChange: (selectedRowKeys: string[]) => void;//eslint-disable-line
    downstreamAddresses: Record<string, string>;
    onAddressChange: (id: string, value: string) => void;//eslint-disable-line
    loading: boolean;
    disabledAddressEdit?: (id: string) => boolean;//eslint-disable-line
    rowSelection?: any;
    clientVersions?: Record<string, ClientVersionInfo>;
    serviceVersion?: string;
    actionType?: OperationsType;
}

// IP validation function outside component
const isValidIP = (ip: string) => {
    if (!ip) return true; // Empty is valid (will be caught by required validation)
    const ipRegex = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/;
    return ipRegex.test(ip);
};

export function ClientListTable({ clients, selectedRowKeys, onSelectChange, downstreamAddresses, onAddressChange, loading, disabledAddressEdit, rowSelection, clientVersions, serviceVersion, actionType }: ClientListTableProps) {
    const columns = useMemo(() => [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: any) => (
                <div>
                    <div style={{
                        fontWeight: 500,
                        color: '#262626',
                        fontSize: 14
                    }}>
                        {text}
                    </div>
                    <div style={{
                        fontSize: 11,
                        color: '#8c8c8c',
                        marginTop: 2
                    }}>
                        {record.client_id}
                    </div>
                </div>
            )
        },
        {
            title: 'Status',
            dataIndex: 'connected',
            key: 'connected',
            width: 100,
            render: (connected: boolean) => (
                <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    background: connected ? '#e6fffb' : '#fff1f0',
                    color: connected ? '#52c41a' : '#ff4d4f',
                    borderRadius: 8,
                    fontWeight: 600,
                    fontSize: 12,
                    padding: '2px 10px',
                    marginLeft: 2
                }}>
                    <span style={{
                        display: 'inline-block',
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        background: connected ? '#52c41a' : '#ff4d4f',
                        marginRight: 7,
                        animation: connected ? 'pulse 1.2s infinite' : 'none'
                    }} />
                    {connected ? 'Live' : 'Offline'}
                </span>
            )
        },
        {
            title: 'Client Version',
            dataIndex: 'version',
            key: 'version',
            width: 100,
            render: (text: string) => (
                <div style={{
                    padding: '4px 8px',
                    background: '#f5f5f5',
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 500,
                    color: '#595959',
                    width: 'fit-content',
                    border: '1px solid #f0f0f0'
                }}>
                    {text || '-'}
                </div>
            )
        },
        {
            title: 'Envoy Versions',
            key: 'envoy_versions',
            width: 150,
            render: (_: any, record: any) => {
                const versionInfo = clientVersions?.[record.client_id];
                
                if (!versionInfo?.downloaded_versions || versionInfo.downloaded_versions.length === 0) {
                    return <span style={{ color: '#bfbfbf', fontSize: 12 }}>Loading...</span>;
                }
                
                return (
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(2, minmax(0, max-content))',
                        gap: 6,
                        alignItems: 'center'
                    }}>
                        {versionInfo.downloaded_versions.map(version => {
                            const isCurrentServiceVersion = version === serviceVersion;
                            return (
                                <div
                                    key={version}
                                    style={{
                                        padding: '2px 8px',
                                        background: isCurrentServiceVersion ? '#e6f7ff' : '#f5f5f5',
                                        borderRadius: 4,
                                        fontSize: 11,
                                        fontWeight: isCurrentServiceVersion ? 600 : 400,
                                        color: isCurrentServiceVersion ? '#1890ff' : '#595959',
                                        border: isCurrentServiceVersion ? '1px solid #91d5ff' : '1px solid #f0f0f0',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {version}
                                </div>
                            );
                        })}
                    </div>
                );
            }
        },
        {
            title: 'Downstream Address',
            dataIndex: 'downstream_address',
            key: 'downstream_address',
            render: (_: any, record: any) => {
                const value = downstreamAddresses[record.client_id] || '';
                const isValid = isValidIP(value);
                
                return (
                    <Input
                        key={record.client_id}
                        placeholder="Enter downstream address (e.g., 192.168.1.5)"
                        value={value}
                        onChange={e => onAddressChange(record.client_id, e.target.value)}
                        disabled={disabledAddressEdit?.(record.client_id)}
                        status={!isValid ? 'error' : undefined}
                        style={{
                            borderRadius: 6,
                            width: '100%',
                            backgroundColor: disabledAddressEdit?.(record.client_id) ? '#fafafa' : '#fff'
                        }}
                    />
                );
            },
        },
    ], [downstreamAddresses, onAddressChange, disabledAddressEdit, clientVersions, serviceVersion, actionType]);

    const sortedData = useMemo(() => {
        if (!clients) return [];

        return [...clients].sort((a, b) => {
            const aSelected = selectedRowKeys.includes(a.client_id);
            const bSelected = selectedRowKeys.includes(b.client_id);

            if (aSelected && !bSelected) return -1;
            if (!aSelected && bSelected) return 1;
            return 0;
        }).map(client => ({
            ...client,
            key: client.client_id
        }));
    }, [clients, selectedRowKeys]);

    return (
        <>
        <div style={{ 
            height: '400px', 
            overflow: 'hidden',
            border: '1px solid #f0f0f0',
            borderRadius: 8
        }}>
            <Table
                dataSource={sortedData}
                columns={columns}
                rowSelection={{
                    type: 'checkbox',
                    ...rowSelection,
                    selectedRowKeys,
                    onChange: onSelectChange,
                    getCheckboxProps: (record: any) => ({
                        disabled: rowSelection?.getCheckboxProps?.(record)?.disabled
                    }),
                    columnWidth: 48,
                    columnTitle: ' '
                }}
                loading={loading}
                size="small"
                pagination={false}
                style={{
                    width: '100%',
                    margin: 0
                }}
                rowClassName={(record) => {
                    const versionInfo = clientVersions?.[record.client_id];
                    const isIncompatible = actionType === OperationsType.DEPLOY && 
                                          serviceVersion && 
                                          versionInfo?.downloaded_versions && 
                                          !versionInfo.downloaded_versions.includes(serviceVersion);
                    
                    return `${selectedRowKeys.includes(record.key) ? 'ant-table-row-selected' : ''} ${isIncompatible ? 'version-incompatible' : ''}`;
                }}
                className="modern-table"
                scroll={{ x: '100%', y: 350 }}
                locale={{
                    emptyText: (
                        <div style={{
                            padding: '32px 0',
                            color: '#00000073',
                            fontSize: 14
                        }}>
                            No clients available
                        </div>
                    )
                }}
            />
        </div>
        <style dangerouslySetInnerHTML={{
            __html: `
                .version-incompatible {
                    background-color: #fff1f0 !important;
                    opacity: 0.8;
                }
                .version-incompatible:hover {
                    background-color: #ffebe6 !important;
                }
                .version-incompatible td {
                    color: #8c8c8c;
                }
            `
        }} />
        </>
    );
} 