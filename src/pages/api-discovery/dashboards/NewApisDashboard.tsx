import React, { useMemo, useState } from 'react';
import { Card, Table, Tag, Tooltip, Space, Segmented, Button, Typography, Empty } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { LinkOutlined, ReloadOutlined, RocketOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useApiInventoryDiscoveries } from '@/hooks/useApiDiscovery';
import RiskFlagChips from '../components/RiskFlagChips';
import InfoLabel from '../components/InfoLabel';
import EndpointPath from '../components/EndpointPath';
import { methodColor } from '../lib/methodColor';
import { formatCompactNumber } from '../lib/formatNumber';
import { antdToSort, columnSortOrder, type SortState } from '../lib/tableSort';
import type { InventoryDoc, DiscoveriesSortField } from '../types';

const { Text, Title } = Typography;

const DEFAULT_SORT: SortState<DiscoveriesSortField> = { sort_by: 'first_seen', sort_order: 'desc' };

const WINDOW_OPTIONS = [
    { label: '24h', value: '24h' },
    { label: '72h', value: '72h' },
    { label: '7 days', value: '7d' },
    { label: '30 days', value: '30d' },
];

const NewApisDashboard: React.FC = () => {
    const [windowOpt, setWindowOpt] = useState<string>('24h');
    const [pageSize, setPageSize] = useState(20);
    const [offset, setOffset] = useState(0);
    const [sort, setSort] = useState<SortState<DiscoveriesSortField>>(DEFAULT_SORT);

    const params = useMemo(
        () => ({
            window: windowOpt,
            sort_by: sort.sort_by,
            sort_order: sort.sort_order,
            limit: pageSize,
            offset,
        }),
        [windowOpt, sort, pageSize, offset],
    );

    const { data, isLoading, isFetching, refetch, error } = useApiInventoryDiscoveries(params);

    const columns: ColumnsType<InventoryDoc> = [
        {
            title: 'Method',
            dataIndex: 'method',
            key: 'method',
            width: 100,
            render: (m: string) =>
                m ? (
                    <Tag className="auto-width-tag" color={methodColor(m)} style={{ margin: 0, fontSize: 11 }}>
                        {m}
                    </Tag>
                ) : (
                    <Text type="secondary">—</Text>
                ),
        },
        {
            title: 'Path',
            dataIndex: 'normalized_path',
            key: 'normalized_path',
            render: (p: string, r) => (
                <Link to={`/api-discovery/${encodeURIComponent(r.listener_name)}/endpoints/${r._id}`}>
                    <EndpointPath path={p} />
                </Link>
            ),
        },
        {
            title: 'Listener',
            dataIndex: 'listener_name',
            key: 'listener_name',
            width: 180,
            ellipsis: true,
            render: (n: string) => (
                <Link to={`/api-discovery/${encodeURIComponent(n)}`} style={{ fontSize: 12 }}>
                    {n}
                </Link>
            ),
        },
        {
            title: 'Host',
            dataIndex: 'host',
            key: 'host',
            width: 200,
            ellipsis: true,
            render: (h: string) =>
                h ? (
                    <Text style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                        {h}
                    </Text>
                ) : (
                    <Text type="secondary">—</Text>
                ),
        },
        {
            title: 'Risk',
            dataIndex: 'risk_flags',
            key: 'max_risk_score',
            width: 240,
            sorter: true,
            sortOrder: columnSortOrder(sort, 'max_risk_score'),
            render: (flags: string[]) => <RiskFlagChips flags={flags} max={3} />,
        },
        {
            title: 'First seen',
            dataIndex: 'first_seen',
            key: 'first_seen',
            width: 160,
            sorter: true,
            sortOrder: columnSortOrder(sort, 'first_seen'),
            render: (ts: string) =>
                ts ? (
                    <Tooltip title={new Date(ts).toISOString()}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            {formatDistanceToNow(new Date(ts), { addSuffix: true })}
                        </Text>
                    </Tooltip>
                ) : (
                    <Text type="secondary">—</Text>
                ),
        },
    ];

    const totalCount = data?.total_count ?? 0;
    const currentPage = Math.floor(offset / pageSize) + 1;

    return (
        <div>
            <Card size="small" style={{ marginBottom: 12, borderRadius: 10 }}>
                <Space wrap size={12}>
                    <RocketOutlined style={{ color: 'var(--color-primary)', fontSize: 18 }} />
                    <div>
                        <Text
                            type="secondary"
                            style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, display: 'block' }}
                        >
                            <InfoLabel info="Endpoints whose first_seen timestamp is within the selected window. New endpoints are surfaced here so operators can review and govern them before they become entrenched.">
                                New APIs discovered
                            </InfoLabel>
                        </Text>
                        <Tooltip title={`Exact: ${totalCount.toLocaleString()}`}>
                            <Title
                                level={3}
                                style={{
                                    margin: 0,
                                    color: 'var(--color-primary)',
                                    fontVariantNumeric: 'tabular-nums',
                                }}
                            >
                                {formatCompactNumber(totalCount)}{' '}
                                <Text type="secondary" style={{ fontSize: 13, fontWeight: 400 }}>
                                    in last
                                </Text>
                            </Title>
                        </Tooltip>
                    </div>
                    <Segmented
                        options={WINDOW_OPTIONS}
                        value={windowOpt}
                        onChange={(v) => {
                            setWindowOpt(String(v));
                            setOffset(0);
                        }}
                    />
                    <Button
                        icon={<ReloadOutlined spin={isFetching} />}
                        onClick={() => refetch()}
                        loading={isFetching}
                    >
                        Refresh
                    </Button>
                    {data?.window_start && (
                        <Text type="secondary" style={{ fontSize: 11 }}>
                            Since {new Date(data.window_start).toLocaleString()}
                        </Text>
                    )}
                </Space>
            </Card>

            <Card
                size="small"
                style={{ borderRadius: 10, border: '1px solid var(--border-default)' }}
                styles={{ body: { padding: 0 } }}
            >
                <Table<InventoryDoc>
                    className="api-discovery-table"
                    rowKey="_id"
                    columns={columns}
                    dataSource={data?.data ?? []}
                    loading={isLoading}
                    size="middle"
                    showSorterTooltip={false}
                    onChange={(_p, _f, sorter, extra) => {
                        if (extra.action !== 'sort') return;
                        setSort(antdToSort(sorter, DEFAULT_SORT));
                        setOffset(0);
                    }}
                    locale={{
                        emptyText: (
                            <div style={{ padding: '40px 0' }}>
                                <Empty
                                    description={
                                        error ? (
                                            <Text type="secondary">Failed to load discoveries.</Text>
                                        ) : (
                                            <div>
                                                <LinkOutlined style={{ color: 'var(--color-success)', fontSize: 28, marginBottom: 8 }} />
                                                <div>
                                                    <Text strong>All clear</Text>
                                                </div>
                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                    No new endpoints discovered in the last {windowOpt}.
                                                </Text>
                                            </div>
                                        )
                                    }
                                />
                            </div>
                        ),
                    }}
                    pagination={{
                        current: currentPage,
                        pageSize,
                        total: totalCount,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50', '100'],
                        showTotal: (total, range) =>
                            `${range[0]}–${range[1]} of ${total.toLocaleString()} discoveries`,
                        onChange: (page, size) => {
                            setPageSize(size);
                            setOffset((page - 1) * size);
                        },
                    }}
                />
            </Card>
        </div>
    );
};

export default NewApisDashboard;
