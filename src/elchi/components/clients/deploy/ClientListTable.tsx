import { Table, Input } from 'antd';
import { useMemo } from 'react';

interface ClientListTableProps {
    clients: any[];
    selectedRowKeys: string[];
    onSelectChange: (selectedRowKeys: string[]) => void;//eslint-disable-line
    downstreamAddresses: Record<string, string>;
    onAddressChange: (id: string, value: string) => void;//eslint-disable-line
    loading: boolean;
    disabledAddressEdit?: (id: string) => boolean;//eslint-disable-line
    rowSelection?: any;
}

export function ClientListTable({ clients, selectedRowKeys, onSelectChange, downstreamAddresses, onAddressChange, loading, disabledAddressEdit, rowSelection }: ClientListTableProps) {
    const columns = [
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
            title: 'Version',
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
            title: 'Downstream Address',
            dataIndex: 'downstream_address',
            key: 'downstream_address',
            render: (_: any, record: any) => (
                <Input
                    placeholder="Enter downstream address"
                    value={downstreamAddresses[record.client_id]}
                    onChange={e => onAddressChange(record.client_id, e.target.value)}
                    disabled={disabledAddressEdit?.(record.client_id)}
                    style={{
                        borderRadius: 6,
                        width: '100%',
                        backgroundColor: disabledAddressEdit?.(record.client_id) ? '#fafafa' : '#fff'
                    }}
                />
            ),
        },
    ];

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
                borderRadius: 8,
                overflow: 'hidden',
                width: '100%',
                margin: '0 -1px'
            }}
            rowClassName={(record) => (selectedRowKeys.includes(record.key) ? 'ant-table-row-selected' : '')}
            className="modern-table"
            scroll={{ x: '100%', y: 500 }}
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
    );
} 