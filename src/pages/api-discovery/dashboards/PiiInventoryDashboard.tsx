import React, { useMemo, useState } from 'react';
import { Card, Table, Tag, Tooltip, Space, Button, Typography, Empty, Row, Col } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ReloadOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useApiInventoryPii } from '@/hooks/useApiDiscovery';
import InfoLabel from '../components/InfoLabel';
import EndpointPath from '../components/EndpointPath';
import { methodColor } from '../lib/methodColor';
import { formatCompactNumber } from '../lib/formatNumber';
import { PII_CATEGORY_META } from '../lib/riskFlagCatalog';
import { antdToSort, columnSortOrder, type SortState } from '../lib/tableSort';
import type { InventoryDoc, PiiSortField } from '../types';

const { Text, Title } = Typography;

const DEFAULT_SORT: SortState<PiiSortField> = { sort_by: 'last_seen', sort_order: 'desc' };

// Distinct purple-amber palette so PII chips read as a category, not a
// generic tag. Falls back to 'purple' for unknown categories.
const PII_TAG_COLOR: Record<string, string> = {
    email: 'magenta',
    phone: 'purple',
    ssn: 'red',
    credit_card: 'volcano',
    iban: 'geekblue',
};

const piiColor = (c: string): string => PII_TAG_COLOR[c] ?? 'purple';

const PiiInventoryDashboard: React.FC = () => {
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
    const [pageSize, setPageSize] = useState(20);
    const [offset, setOffset] = useState(0);
    const [sort, setSort] = useState<SortState<PiiSortField>>(DEFAULT_SORT);

    const params = useMemo(
        () => ({
            sort_by: sort.sort_by,
            sort_order: sort.sort_order,
            limit: pageSize,
            offset,
        }),
        [sort, pageSize, offset],
    );

    const { data, isLoading, isFetching, refetch, error } = useApiInventoryPii(params);
    const totalCount = data?.total_count ?? 0;
    const currentPage = Math.floor(offset / pageSize) + 1;

    // Client-side filter when user clicks a category card. Cheap because
    // the endpoint list is already paginated to <=100.
    const filteredEndpoints = useMemo(() => {
        const rows = data?.endpoints ?? [];
        if (!categoryFilter) return rows;
        return rows.filter((r) => (r.pii_categories ?? []).includes(categoryFilter));
    }, [data, categoryFilter]);

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
            title: 'PII detected',
            dataIndex: 'pii_categories',
            key: 'pii_categories',
            render: (cats: string[]) => {
                if (!cats?.length) return <Text type="secondary">—</Text>;
                return (
                    <Space size={[4, 4]} wrap>
                        {cats.map((c) => (
                            <Tooltip key={c} title={PII_CATEGORY_META[c]?.description}>
                                <Tag
                                    className="auto-width-tag"
                                    color={piiColor(c)}
                                    style={{ fontSize: 11, margin: 0, cursor: 'help' }}
                                >
                                    {PII_CATEGORY_META[c]?.label ?? c}
                                </Tag>
                            </Tooltip>
                        ))}
                    </Space>
                );
            },
        },
        {
            title: 'Calls',
            dataIndex: 'seen_count',
            key: 'seen_count',
            width: 110,
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
            width: 160,
            sorter: true,
            sortOrder: columnSortOrder(sort, 'last_seen'),
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

    return (
        <div>
            <Card size="small" style={{ marginBottom: 12, borderRadius: 10 }}>
                <Space wrap size={16}>
                    <div
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: 12,
                            background: 'rgba(139, 92, 246, 0.15)',
                            color: '#8b5cf6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 24,
                        }}
                    >
                        <SafetyCertificateOutlined />
                    </div>
                    <div>
                        <Text
                            type="secondary"
                            style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, display: 'block' }}
                        >
                            <InfoLabel info={
                                <div>
                                    <div style={{ fontWeight: 600, marginBottom: 4 }}>PII inventory</div>
                                    <div>
                                        Endpoints where the collector has detected PII-shaped data
                                        (email, phone, SSN, credit-card numbers, IBANs). The raw PII
                                        values are NEVER stored — only the category names.
                                    </div>
                                </div>
                            }>
                                Endpoints touching PII
                            </InfoLabel>
                        </Text>
                        <Title
                            level={3}
                            style={{
                                margin: 0,
                                color: '#8b5cf6',
                                fontVariantNumeric: 'tabular-nums',
                            }}
                        >
                            {formatCompactNumber(totalCount)}
                        </Title>
                    </div>
                    <Button
                        icon={<ReloadOutlined spin={isFetching} />}
                        onClick={() => refetch()}
                        loading={isFetching}
                    >
                        Refresh
                    </Button>
                </Space>
            </Card>

            {/* Category cards — click to filter the table */}
            {(data?.categories?.length ?? 0) > 0 && (
                <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
                    {data!.categories.map((c) => {
                        const active = categoryFilter === c.category;
                        const color = piiColor(c.category);
                        return (
                            <Col key={c.category} xs={12} md={6} lg={4}>
                                <Card
                                    size="small"
                                    hoverable
                                    onClick={() =>
                                        setCategoryFilter(active ? null : c.category)
                                    }
                                    style={{
                                        borderRadius: 10,
                                        borderColor: active ? `var(--color-primary)` : 'var(--border-default)',
                                        background: active ? 'var(--color-primary-light)' : undefined,
                                        cursor: 'pointer',
                                    }}
                                    styles={{ body: { padding: 12 } }}
                                >
                                    <Space direction="vertical" size={4} style={{ width: '100%' }}>
                                        <Tag
                                            className="auto-width-tag"
                                            color={color}
                                            style={{ margin: 0, fontSize: 11 }}
                                        >
                                            {PII_CATEGORY_META[c.category]?.label ?? c.category}
                                        </Tag>
                                        <Title level={3} style={{ margin: 0, fontVariantNumeric: 'tabular-nums' }}>
                                            {formatCompactNumber(c.endpoint_count)}
                                        </Title>
                                        <Text type="secondary" style={{ fontSize: 11 }}>
                                            endpoints
                                        </Text>
                                    </Space>
                                </Card>
                            </Col>
                        );
                    })}
                    {categoryFilter && (
                        <Col xs={12} md={6} lg={4} style={{ display: 'flex', alignItems: 'center' }}>
                            <Button onClick={() => setCategoryFilter(null)}>Clear filter</Button>
                        </Col>
                    )}
                </Row>
            )}

            <Card
                size="small"
                style={{ borderRadius: 10, border: '1px solid var(--border-default)' }}
                styles={{ body: { padding: 0 } }}
            >
                <Table<InventoryDoc>
                    className="api-discovery-table"
                    rowKey="_id"
                    columns={columns}
                    dataSource={filteredEndpoints}
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
                                            <Text type="secondary">Failed to load PII inventory.</Text>
                                        ) : categoryFilter ? (
                                            <Text type="secondary">
                                                No endpoints with category{' '}
                                                <Tag color={piiColor(categoryFilter)}>
                                                    {PII_CATEGORY_META[categoryFilter]?.label ?? categoryFilter}
                                                </Tag>{' '}
                                                on this page.
                                            </Text>
                                        ) : (
                                            <Text type="secondary">No PII observed yet — clean.</Text>
                                        )
                                    }
                                />
                            </div>
                        ),
                    }}
                    pagination={{
                        current: currentPage,
                        pageSize,
                        total: categoryFilter ? filteredEndpoints.length : totalCount,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50', '100'],
                        showTotal: (total, range) =>
                            `${range[0]}–${range[1]} of ${total.toLocaleString()} endpoints`,
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

export default PiiInventoryDashboard;
