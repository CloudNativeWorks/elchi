import React, { useMemo, useState } from 'react';
import {
    Card,
    Table,
    Tag,
    Space,
    Button,
    Select,
    Segmented,
    Empty,
    Typography,
    Tooltip,
    Alert,
    message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    ReloadOutlined,
    SwapOutlined,
    CameraOutlined,
    WarningOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import {
    useApiInventoryChanges,
    useApiInventorySnapshots,
    useCreateInventorySnapshot,
} from '@/hooks/useApiDiscovery';
import useAuth from '@/hooks/useUserDetails';
import EndpointPath from '../components/EndpointPath';
import InfoLabel from '../components/InfoLabel';
import { methodColor } from '../lib/methodColor';
import { formatCompactNumber } from '../lib/formatNumber';
import { riskFlagLabel } from '../lib/riskFlagCatalog';
import type { DriftChange, DriftChangeType, DriftMode } from '../types';

const { Text, Title } = Typography;

const DEFAULT_LIMIT = 20;

// type → label + colour. The three high-priority signals (auth_downgrade,
// new_pii_category, status_regress) use the alarming red/volcano/gold family.
const DRIFT_META: Record<DriftChangeType, { label: string; color: string; warn?: boolean }> = {
    new_operation: { label: 'New endpoint', color: 'green' },
    new_method: { label: 'New method', color: 'cyan' },
    removed_operation: { label: 'Removed', color: 'default' },
    auth_downgrade: { label: 'Auth downgrade', color: 'red', warn: true },
    new_pii_category: { label: 'New PII', color: 'volcano', warn: true },
    new_risk_flag: { label: 'New risk flag', color: 'orange' },
    risk_increase: { label: 'Risk ↑', color: 'orange' },
    status_regress: { label: 'Status regress', color: 'gold', warn: true },
    zombie_resurrection: { label: 'Zombie revived', color: 'purple' },
};

const MODE_OPTIONS: { label: string; value: DriftMode }[] = [
    { label: 'All', value: 'all' },
    { label: 'New', value: 'new' },
    { label: 'Removed', value: 'removed' },
    { label: 'Auth', value: 'auth' },
    { label: 'PII', value: 'pii' },
    { label: 'Risk', value: 'risk' },
    { label: 'Status', value: 'status' },
    { label: 'Zombie', value: 'zombie' },
];

// Renders the type-specific `detail` payload as a short human string.
const renderDetail = (c: DriftChange): React.ReactNode => {
    const d = c.detail ?? {};
    switch (c.type) {
        case 'auth_downgrade':
            return (
                <Text type="secondary" style={{ fontSize: 12 }}>
                    now reachable without auth
                    {Array.isArray(d.added_auth_schemes) && d.added_auth_schemes.length > 0
                        ? ` · +schemes: ${d.added_auth_schemes.join(', ')}`
                        : ''}
                </Text>
            );
        case 'new_pii_category':
            return <Text type="secondary" style={{ fontSize: 12 }}>+PII: {(d.new_pii_categories ?? []).join(', ')}</Text>;
        case 'new_risk_flag':
            return (
                <Space size={4} wrap>
                    {(d.new_risk_flags ?? []).map((f: string) => (
                        <Tag key={f} className="auto-width-tag" color="orange" style={{ margin: 0, fontSize: 10 }}>
                            {riskFlagLabel(f)}
                        </Tag>
                    ))}
                </Space>
            );
        case 'risk_increase':
            return (
                <Text type="secondary" style={{ fontSize: 12 }}>
                    risk {d.baseline_max_risk_score ?? '?'} → <Text strong style={{ color: 'var(--color-error)' }}>{d.current_max_risk_score ?? '?'}</Text>
                </Text>
            );
        case 'status_regress':
            return (
                <Space size={4} wrap>
                    {(d.new_error_status_codes ?? []).map((s: number | string) => (
                        <Tag key={String(s)} className="auto-width-tag" color="gold" style={{ margin: 0, fontSize: 10 }}>
                            {s}
                        </Tag>
                    ))}
                </Space>
            );
        case 'zombie_resurrection':
            return (
                <Text type="secondary" style={{ fontSize: 12 }}>
                    silent since {d.baseline_last_seen ? new Date(d.baseline_last_seen).toLocaleDateString() : '?'} — active again
                </Text>
            );
        default:
            return <Text type="secondary">—</Text>;
    }
};

const DriftDashboard: React.FC = () => {
    const userDetail = useAuth();
    const isAdminOrOwner = ['owner', 'admin'].includes(userDetail?.role?.toLowerCase() || '');

    const [since, setSince] = useState<string>('24h');
    const [sinceTouched, setSinceTouched] = useState(false);
    const [mode, setMode] = useState<DriftMode>('all');
    const [offset, setOffset] = useState(0);
    const [pageSize, setPageSize] = useState(DEFAULT_LIMIT);

    const snapshotsQuery = useApiInventorySnapshots();
    const createSnapshot = useCreateInventorySnapshot();

    // Default the baseline to the NEWEST snapshot once snapshots load (unless
    // the user picked one). A relative '24h' default would miss a snapshot
    // taken just now (snapshot_at > now-24h) → a confusing 404 right after the
    // first snapshot. Anchoring to the latest snapshot makes a fresh baseline
    // active immediately ("0 changes", correct).
    React.useEffect(() => {
        if (sinceTouched) return;
        const snaps = snapshotsQuery.data?.data;
        if (snaps && snaps.length > 0) setSince(snaps[0].snapshot_at);
    }, [snapshotsQuery.data, sinceTouched]);

    const params = useMemo(
        () => ({ since, mode, limit: pageSize, offset }),
        [since, mode, pageSize, offset],
    );
    const { data, isLoading, isFetching, error, refetch } = useApiInventoryChanges(params);

    const status = (error as any)?.response?.status;
    const noBaseline = status === 404;

    // since options: relative shortcuts + each known snapshot.
    const sinceOptions = useMemo(() => {
        const rel = [
            { label: 'Since 24h ago', value: '24h' },
            { label: 'Since 7 days ago', value: '7d' },
            { label: 'Since 30 days ago', value: '30d' },
        ];
        const snaps = (snapshotsQuery.data?.data ?? []).map((s) => ({
            label: `${new Date(s.snapshot_at).toLocaleString()} · ${formatCompactNumber(s.operation_count)} ops`,
            value: s.snapshot_at,
        }));
        return snaps.length
            ? [
                  { label: 'Relative', title: 'Relative', options: rel },
                  { label: 'Snapshots', title: 'Snapshots', options: snaps },
              ]
            : rel;
    }, [snapshotsQuery.data]);

    const takeSnapshot = async () => {
        try {
            const res = await createSnapshot.mutateAsync();
            message.success(`Snapshot taken — ${res.operation_count} operations frozen as a baseline.`);
            // Anchor the baseline to the just-created snapshot so it's active
            // immediately (snapshot_id == snapshot_at) instead of 404'ing.
            if (res.snapshot_id) {
                setSinceTouched(true);
                setSince(res.snapshot_id);
                setOffset(0);
            }
            snapshotsQuery.refetch();
            refetch();
        } catch (e: any) {
            const s = e?.response?.status;
            message.error(
                s === 403
                    ? 'Only an Admin or Owner can create inventory snapshots.'
                    : e?.response?.data?.error || e?.message || 'Failed to take snapshot',
            );
        }
    };

    const columns: ColumnsType<DriftChange> = [
        {
            title: 'Change',
            dataIndex: 'type',
            key: 'type',
            width: 150,
            render: (t: DriftChangeType) => {
                const m = DRIFT_META[t] ?? { label: t, color: 'default' };
                return (
                    <Tag
                        className="auto-width-tag"
                        color={m.color}
                        icon={m.warn ? <WarningOutlined /> : undefined}
                        style={{ margin: 0, fontSize: 11 }}
                    >
                        {m.label}
                    </Tag>
                );
            },
        },
        {
            title: 'Method',
            dataIndex: 'method',
            key: 'method',
            width: 90,
            render: (mth: string) =>
                mth ? (
                    <Tag className="auto-width-tag" color={methodColor(mth)} style={{ margin: 0, fontSize: 11 }}>{mth}</Tag>
                ) : (
                    <Text type="secondary">—</Text>
                ),
        },
        {
            title: 'Path',
            dataIndex: 'normalized_path',
            key: 'normalized_path',
            render: (p: string, r) => {
                const isGrpc = !!(r.grpc_service || r.grpc_method);
                const body = (
                    <Space size={6} align="center">
                        <EndpointPath path={p || '—'} />
                        {isGrpc && (
                            <Tooltip title={`gRPC: ${r.grpc_service || '?'}/${r.grpc_method || '?'}`}>
                                <Tag className="auto-width-tag" color="geekblue" style={{ margin: 0, fontSize: 10 }}>
                                    gRPC {r.grpc_method || r.grpc_service}
                                </Tag>
                            </Tooltip>
                        )}
                    </Space>
                );
                // removed_operation no longer exists in the live inventory —
                // a deep-link would 404, so render it plain (dimmed).
                if (r.type === 'removed_operation') {
                    return <span style={{ opacity: 0.6 }}>{body}</span>;
                }
                return (
                    <Link to={`/api-discovery/${encodeURIComponent(r.listener_name)}?normalized_path=${encodeURIComponent(p)}`}>
                        {body}
                    </Link>
                );
            },
        },
        {
            title: 'Host',
            dataIndex: 'host',
            key: 'host',
            width: 170,
            ellipsis: true,
            render: (h: string) => <Text style={{ fontSize: 12 }}>{h || '—'}</Text>,
        },
        {
            title: 'Detail',
            key: 'detail',
            render: (_: unknown, r) => renderDetail(r),
        },
        {
            title: 'Last Seen',
            dataIndex: 'last_seen',
            key: 'last_seen',
            width: 140,
            render: (ts: string) =>
                ts ? (
                    <Tooltip title={new Date(ts).toISOString()}>
                        <Text type="secondary" style={{ fontSize: 12 }}>{formatDistanceToNow(new Date(ts), { addSuffix: true })}</Text>
                    </Tooltip>
                ) : (
                    <Text type="secondary">—</Text>
                ),
        },
    ];

    return (
        <div>
            {/* Hero / controls */}
            <Card size="small" style={{ marginBottom: 12, borderRadius: 10 }}>
                <Space wrap size={16} style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Space wrap size={16}>
                        <div
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: 12,
                                background: 'rgba(10,127,218,0.15)',
                                color: 'var(--color-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 22,
                            }}
                        >
                            <SwapOutlined />
                        </div>
                        <div>
                            <Text type="secondary" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, display: 'block' }}>
                                <InfoLabel info="Diffs the live API surface against a baseline snapshot — new/removed endpoints, auth downgrades, new PII, risk increases, status regressions, revived zombies. Snapshots are taken daily (30-day retention) and can be triggered manually before/after a release.">
                                    API drift since baseline
                                </InfoLabel>
                            </Text>
                            <Title level={4} style={{ margin: 0 }}>
                                {formatCompactNumber(data?.total_count ?? 0)}{' '}
                                <Text type="secondary" style={{ fontSize: 13, fontWeight: 400 }}>changes</Text>
                            </Title>
                            {data?.baseline_snapshot_at && (
                                <Text type="secondary" style={{ fontSize: 11 }}>
                                    vs baseline {new Date(data.baseline_snapshot_at).toLocaleString()}
                                </Text>
                            )}
                        </div>
                    </Space>
                    <Space wrap size={8}>
                        <Select
                            value={since}
                            onChange={(v) => { setSince(v); setSinceTouched(true); setOffset(0); }}
                            options={sinceOptions as any}
                            style={{ width: 240 }}
                            size="middle"
                        />
                        {isAdminOrOwner && (
                            <Button icon={<CameraOutlined />} onClick={takeSnapshot} loading={createSnapshot.isPending}>
                                Take snapshot
                            </Button>
                        )}
                        <Button icon={<ReloadOutlined spin={isFetching} />} onClick={() => refetch()} loading={isFetching}>
                            Refresh
                        </Button>
                    </Space>
                </Space>
                <div style={{ marginTop: 12 }}>
                    <Segmented
                        options={MODE_OPTIONS}
                        value={mode}
                        onChange={(v) => { setMode(v as DriftMode); setOffset(0); }}
                    />
                </div>
            </Card>

            {noBaseline ? (
                <Card size="small" style={{ borderRadius: 10 }}>
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                            <div>
                                <Text type="secondary">No baseline snapshot to compare against yet.</Text>
                                <div style={{ marginTop: 4 }}>
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        Take the first snapshot to start tracking drift — or wait for the daily scheduler.
                                    </Text>
                                </div>
                            </div>
                        }
                    >
                        {isAdminOrOwner && (
                            <Button type="primary" icon={<CameraOutlined />} onClick={takeSnapshot} loading={createSnapshot.isPending}>
                                Take first snapshot
                            </Button>
                        )}
                    </Empty>
                </Card>
            ) : (
                <Card size="small" style={{ borderRadius: 10 }} styles={{ body: { padding: 0 } }}>
                    {error && !noBaseline && (
                        <Alert
                            type="error"
                            showIcon
                            style={{ margin: 12, borderRadius: 8 }}
                            message="Failed to load drift changes"
                            description="Try refreshing. If it persists the snapshot baseline may be unavailable."
                        />
                    )}
                    <Table<DriftChange>
                        className="api-discovery-table"
                        rowKey={(r, i) => `${r.type}_${r.host}_${r.method}_${r.normalized_path}_${i}`}
                        columns={columns}
                        dataSource={data?.data ?? []}
                        loading={isLoading}
                        size="small"
                        scroll={{ x: 'max-content' }}
                        locale={{
                            emptyText: (
                                <div style={{ padding: '40px 0' }}>
                                    <Empty
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        description={<Text type="secondary">✓ No drift in this window — the API surface matches the baseline.</Text>}
                                    />
                                </div>
                            ),
                        }}
                        pagination={{
                            current: Math.floor(offset / pageSize) + 1,
                            pageSize,
                            total: data?.total_count ?? 0,
                            showSizeChanger: true,
                            pageSizeOptions: ['20', '50', '100'],
                            showTotal: (total, range) => `${range[0]}–${range[1]} of ${total.toLocaleString()} changes`,
                            onChange: (page, size) => {
                                setPageSize(size);
                                setOffset((page - 1) * size);
                            },
                        }}
                    />
                </Card>
            )}
        </div>
    );
};

export default DriftDashboard;
