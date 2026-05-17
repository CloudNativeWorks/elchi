import React, { useMemo, useState } from 'react';
import {
    Card,
    Table,
    Tag,
    Tooltip,
    Space,
    Slider,
    Button,
    Typography,
    Empty,
    Row,
    Col,
    InputNumber,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ReloadOutlined, DeleteOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useApiInventoryZombies } from '@/hooks/useApiDiscovery';
import InfoLabel from '../components/InfoLabel';
import EndpointPath from '../components/EndpointPath';
import { methodColor } from '../lib/methodColor';
import { formatCompactNumber } from '../lib/formatNumber';
import { antdToSort, columnSortOrder, type SortState } from '../lib/tableSort';
import type { InventoryDoc, ZombiesSortField } from '../types';

const { Text, Title } = Typography;

const DEFAULT_SORT: SortState<ZombiesSortField> = { sort_by: 'seen_count', sort_order: 'desc' };

const ZombiesDashboard: React.FC = () => {
    const [inactiveDays, setInactiveDays] = useState(30);
    const [minSeenCount, setMinSeenCount] = useState(1000);
    const [pageSize, setPageSize] = useState(20);
    const [offset, setOffset] = useState(0);
    const [sort, setSort] = useState<SortState<ZombiesSortField>>(DEFAULT_SORT);

    const params = useMemo(
        () => ({
            inactive_days: inactiveDays,
            min_seen_count: minSeenCount,
            sort_by: sort.sort_by,
            sort_order: sort.sort_order,
            limit: pageSize,
            offset,
        }),
        [inactiveDays, minSeenCount, sort, pageSize, offset],
    );

    const { data, isLoading, isFetching, refetch, error } = useApiInventoryZombies(params);
    const totalCount = data?.total_count ?? 0;
    const currentPage = Math.floor(offset / pageSize) + 1;

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
            title: 'Lifetime calls',
            dataIndex: 'seen_count',
            key: 'seen_count',
            width: 130,
            align: 'right',
            sorter: true,
            sortOrder: columnSortOrder(sort, 'seen_count'),
            render: (n: number) => (
                <Tooltip title={`Exact: ${(n ?? 0).toLocaleString()}`}>
                    <Text style={{ fontVariantNumeric: 'tabular-nums', fontSize: 12.5 }}>
                        {formatCompactNumber(n ?? 0)}
                    </Text>
                </Tooltip>
            ),
        },
        {
            title: 'Last seen',
            dataIndex: 'last_seen',
            key: 'last_seen',
            width: 180,
            sorter: true,
            sortOrder: columnSortOrder(sort, 'last_seen'),
            render: (ts: string) =>
                ts ? (
                    <Tooltip title={new Date(ts).toISOString()}>
                        <Space size={6}>
                            <ClockCircleOutlined style={{ fontSize: 11, color: 'var(--color-warning)' }} />
                            <Text style={{ fontSize: 12, color: 'var(--color-warning)' }}>
                                {formatDistanceToNow(new Date(ts), { addSuffix: true })}
                            </Text>
                        </Space>
                    </Tooltip>
                ) : (
                    <Text type="secondary">—</Text>
                ),
        },
    ];

    return (
        <div>
            <Card
                size="small"
                style={{
                    marginBottom: 12,
                    borderRadius: 10,
                    border: `1px solid ${totalCount > 0 ? 'var(--color-warning-border)' : 'var(--border-default)'}`,
                    background:
                        totalCount > 0
                            ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, transparent 100%)'
                            : undefined,
                }}
            >
                <Row gutter={[16, 12]} align="middle">
                    <Col>
                        <Space>
                            <div
                                style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 12,
                                    background: 'rgba(148, 163, 184, 0.18)',
                                    color: 'var(--text-tertiary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 22,
                                }}
                            >
                                <DeleteOutlined />
                            </div>
                            <div>
                                <Text
                                    type="secondary"
                                    style={{
                                        fontSize: 10,
                                        textTransform: 'uppercase',
                                        letterSpacing: 1,
                                        display: 'block',
                                    }}
                                >
                                    <InfoLabel info={
                                        <div>
                                            <div style={{ fontWeight: 600, marginBottom: 4 }}>Zombie endpoints</div>
                                            <div>
                                                Previously busy endpoints that have gone quiet — typically
                                                deprecation candidates. Filtered by two criteria: <strong>inactive_days</strong>
                                                {' '}(last_seen older than this many days) and <strong>min_seen_count</strong>{' '}
                                                (was busy enough at some point to matter).
                                            </div>
                                        </div>
                                    }>
                                        Inactive {inactiveDays}+ days · ≥ {formatCompactNumber(minSeenCount)} lifetime calls
                                    </InfoLabel>
                                </Text>
                                <Title
                                    level={3}
                                    style={{
                                        margin: 0,
                                        color: totalCount > 0 ? 'var(--color-warning)' : 'var(--color-success)',
                                        fontVariantNumeric: 'tabular-nums',
                                    }}
                                >
                                    {formatCompactNumber(totalCount)}
                                </Title>
                            </div>
                        </Space>
                    </Col>
                    <Col flex="auto">
                        <Row gutter={[24, 8]}>
                            <Col xs={24} md={12}>
                                <Text style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                                    Inactive days: <strong>{inactiveDays}</strong>
                                </Text>
                                <Slider
                                    min={7}
                                    max={365}
                                    value={inactiveDays}
                                    onChange={(v) => {
                                        setInactiveDays(v as number);
                                        setOffset(0);
                                    }}
                                    marks={{ 7: '7', 30: '30', 90: '90', 180: '180', 365: '365' }}
                                />
                            </Col>
                            <Col xs={24} md={12}>
                                <Text style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                                    Min lifetime calls: <strong>{formatCompactNumber(minSeenCount)}</strong>
                                </Text>
                                <Space size={8} style={{ width: '100%' }}>
                                    <Slider
                                        min={100}
                                        max={100000}
                                        step={100}
                                        value={minSeenCount}
                                        onChange={(v) => {
                                            setMinSeenCount(v as number);
                                            setOffset(0);
                                        }}
                                        style={{ flex: 1, minWidth: 200 }}
                                    />
                                    <InputNumber
                                        size="small"
                                        min={1}
                                        max={1000000}
                                        value={minSeenCount}
                                        onChange={(v) => {
                                            setMinSeenCount(typeof v === 'number' ? v : 1000);
                                            setOffset(0);
                                        }}
                                        style={{ width: 100 }}
                                    />
                                </Space>
                            </Col>
                        </Row>
                    </Col>
                    <Col>
                        <Button
                            icon={<ReloadOutlined spin={isFetching} />}
                            onClick={() => refetch()}
                            loading={isFetching}
                        >
                            Refresh
                        </Button>
                    </Col>
                </Row>
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
                    scroll={{ x: 'max-content' }}
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
                                            <Text type="secondary">Failed to load zombies.</Text>
                                        ) : (
                                            <div>
                                                <Text strong>No zombies found</Text>
                                                <div>
                                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                                        Every endpoint with ≥ {formatCompactNumber(minSeenCount)} lifetime
                                                        calls has been active in the last {inactiveDays} days.
                                                    </Text>
                                                </div>
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
                            `${range[0]}–${range[1]} of ${total.toLocaleString()} zombies`,
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

export default ZombiesDashboard;
