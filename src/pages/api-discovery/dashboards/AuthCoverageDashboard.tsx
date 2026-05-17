import React, { useMemo, useState } from 'react';
import {
    Card,
    Table,
    Tag,
    Tooltip,
    Space,
    Switch,
    Button,
    Typography,
    Empty,
    Alert,
    Segmented,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ReloadOutlined, LockOutlined, UnlockOutlined, SwapOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useApiInventoryAuthCoverage } from '@/hooks/useApiDiscovery';
import InfoLabel from '../components/InfoLabel';
import EndpointPath from '../components/EndpointPath';
import { methodColor, WRITE_METHODS } from '../lib/methodColor';
import { formatCompactNumber } from '../lib/formatNumber';
import { antdToSort, columnSortOrder, type SortState } from '../lib/tableSort';
import type { InventoryDoc, AuthCoverageMode, AuthCoverageSortField } from '../types';

const { Text, Title } = Typography;

const DEFAULT_SORT: SortState<AuthCoverageSortField> = { sort_by: 'seen_count', sort_order: 'desc' };

const AuthCoverageDashboard: React.FC = () => {
    const [mode, setMode] = useState<AuthCoverageMode>('unauthenticated');
    const [includeRead, setIncludeRead] = useState(false);
    const [pageSize, setPageSize] = useState(20);
    const [offset, setOffset] = useState(0);
    const [sort, setSort] = useState<SortState<AuthCoverageSortField>>(DEFAULT_SORT);

    const isInconsistent = mode === 'inconsistent';

    const params = useMemo(
        () => ({
            mode,
            include_read: includeRead,
            sort_by: sort.sort_by,
            sort_order: sort.sort_order,
            limit: pageSize,
            offset,
        }),
        [mode, includeRead, sort, pageSize, offset],
    );

    const { data, isLoading, isFetching, refetch, error } = useApiInventoryAuthCoverage(params);
    const totalCount = data?.total_count ?? 0;
    const currentPage = Math.floor(offset / pageSize) + 1;

    const columns: ColumnsType<InventoryDoc> = [
        {
            title: 'Method',
            dataIndex: 'method',
            key: 'method',
            width: 100,
            render: (m: string) => {
                if (!m) return <Text type="secondary">—</Text>;
                const isWrite = WRITE_METHODS.has(m);
                return (
                    <Tag
                        className="auto-width-tag"
                        color={methodColor(m)}
                        style={{
                            margin: 0,
                            fontSize: 11,
                            ...(isWrite ? { fontWeight: 700, letterSpacing: 0.3 } : {}),
                        }}
                    >
                        {m}
                    </Tag>
                );
            },
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
            title: 'Risk score',
            dataIndex: 'max_risk_score',
            key: 'max_risk_score',
            width: 110,
            align: 'right',
            sorter: true,
            sortOrder: columnSortOrder(sort, 'max_risk_score'),
            render: (s: number) => {
                const score = s ?? 0;
                // Bands match RISK_SCORE_LEGEND in riskFlagCatalog.ts.
                const color =
                    score >= 40
                        ? 'var(--color-error)'
                        : score >= 25
                            ? '#fa541c'
                            : score >= 10
                                ? 'var(--color-warning)'
                                : '#d4a012';
                return (
                    <span
                        style={{
                            display: 'inline-flex',
                            padding: '1px 8px',
                            borderRadius: 4,
                            background: 'var(--bg-elevated)',
                            border: `1px solid ${color}33`,
                            color,
                            fontFamily: 'monospace',
                            fontWeight: 600,
                            fontSize: 11,
                        }}
                    >
                        {score}
                    </span>
                );
            },
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
            <Card
                size="small"
                style={{
                    marginBottom: 12,
                    borderRadius: 10,
                    border: `1px solid ${totalCount > 0 ? 'var(--color-danger-border)' : 'var(--border-default)'}`,
                    background:
                        totalCount > 0
                            ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, transparent 100%)'
                            : undefined,
                }}
            >
                <Space wrap size={16}>
                    <div
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: 12,
                            background:
                                totalCount > 0
                                    ? 'rgba(239, 68, 68, 0.15)'
                                    : 'rgba(16, 185, 129, 0.15)',
                            color:
                                totalCount > 0 ? 'var(--color-error)' : 'var(--color-success)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 24,
                        }}
                    >
                        {totalCount === 0 ? (
                            <LockOutlined />
                        ) : isInconsistent ? (
                            <SwapOutlined />
                        ) : (
                            <UnlockOutlined />
                        )}
                    </div>
                    <div>
                        <Text
                            type="secondary"
                            style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, display: 'block' }}
                        >
                            <InfoLabel info={
                                isInconsistent ? (
                                    <div>
                                        <div style={{ fontWeight: 600, marginBottom: 4 }}>Inconsistent-auth endpoints</div>
                                        <div>
                                            Endpoints that have been observed with <strong>both</strong>{' '}
                                            authenticated and unauthenticated traffic
                                            (auth_observed = true AND noauth_observed = true). This is
                                            almost always a <strong>misconfiguration</strong> — an
                                            auth-bypassed code path, an over-broad cache, or a
                                            health-check route sharing the path. Treat each row as a
                                            potential auth bypass.
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <div style={{ fontWeight: 600, marginBottom: 4 }}>Unauthenticated endpoints</div>
                                        <div>
                                            Endpoints whose collected events never carried an auth header
                                            (Authorization / Cookie / X-Api-Key / …). By default the
                                            backend only returns write methods (POST/PUT/PATCH/DELETE) —
                                            the most damaging ones to leave open. Toggle "Include read
                                            methods" to also surface unauthenticated GET / HEAD / OPTIONS.
                                        </div>
                                    </div>
                                )
                            }>
                                {isInconsistent
                                    ? 'Inconsistent-auth endpoints'
                                    : includeRead
                                        ? 'Unauthenticated endpoints'
                                        : 'Unauthenticated write endpoints'}
                            </InfoLabel>
                        </Text>
                        <Title
                            level={3}
                            style={{
                                margin: 0,
                                color: totalCount > 0 ? 'var(--color-error)' : 'var(--color-success)',
                                fontVariantNumeric: 'tabular-nums',
                            }}
                        >
                            {formatCompactNumber(totalCount)}
                        </Title>
                    </div>
                    <Segmented
                        value={mode}
                        onChange={(v) => {
                            setMode(v as AuthCoverageMode);
                            setOffset(0);
                        }}
                        options={[
                            { label: 'Unauthenticated', value: 'unauthenticated' },
                            { label: 'Inconsistent', value: 'inconsistent' },
                        ]}
                    />
                    <Tooltip title="Include GET / HEAD / OPTIONS in the list. Off by default — read endpoints are typically less critical.">
                        <Space size={4}>
                            <Switch
                                size="small"
                                checked={includeRead}
                                onChange={(v) => {
                                    setIncludeRead(v);
                                    setOffset(0);
                                }}
                            />
                            <Text type="secondary" style={{ fontSize: 11 }}>
                                Include read methods
                            </Text>
                        </Space>
                    </Tooltip>
                    <Button
                        icon={<ReloadOutlined spin={isFetching} />}
                        onClick={() => refetch()}
                        loading={isFetching}
                    >
                        Refresh
                    </Button>
                </Space>
            </Card>

            {totalCount > 0 && (
                <Alert
                    type={isInconsistent ? 'error' : 'warning'}
                    showIcon
                    style={{ marginBottom: 12 }}
                    message={
                        isInconsistent
                            ? `${totalCount} endpoint${totalCount === 1 ? '' : 's'} serve both authenticated and unauthenticated traffic`
                            : `${totalCount} ${includeRead ? '' : 'write '}endpoint${
                                totalCount === 1 ? '' : 's'
                            } accept traffic without authentication`
                    }
                    description={
                        isInconsistent
                            ? 'Each row has been seen with AND without an auth header. This usually means an auth-bypass code path, an over-broad cache, or a health-check sharing the route. Investigate as a possible auth bypass.'
                            : 'Each row below has had at least one observed call with no Authorization / Cookie / X-Api-Key header. Review and gate them with auth — write endpoints are the highest priority.'
                    }
                />
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
                                            <Text type="secondary">Failed to load auth coverage.</Text>
                                        ) : (
                                            <div>
                                                <LockOutlined
                                                    style={{
                                                        color: 'var(--color-success)',
                                                        fontSize: 28,
                                                        marginBottom: 8,
                                                    }}
                                                />
                                                <div>
                                                    <Text strong>All clear</Text>
                                                </div>
                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                    {isInconsistent
                                                        ? 'No endpoint mixes authenticated and unauthenticated traffic.'
                                                        : `Every observed ${includeRead ? '' : 'write '}endpoint enforces auth.`}
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

export default AuthCoverageDashboard;
