import React from 'react';
import { Card, Typography, Row, Col, Progress, Tag, Tooltip, Button, Alert } from 'antd';
import { HddOutlined, ReloadOutlined, DatabaseOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { DecodeToken } from '@/utils/tools';
import { api } from '@/common/api';

const { Text } = Typography;

// Owner/Admin only — the backend gates this endpoint the same way.
const isOwnerOrAdmin = (): boolean =>
    ['owner', 'admin'].includes(DecodeToken(Cookies.get('bb_token'))?.role);

const SKIP_GLOBAL_ERROR = { _skipGlobalErrorNotification: true } as const;

const fmtBytes = (n?: number): string => {
    if (!n || n <= 0) return '0 B';
    const u = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i = Math.min(Math.floor(Math.log(n) / Math.log(1024)), u.length - 1);
    return `${(n / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${u[i]}`;
};

interface CHTable { name: string; kind: string; bytes: number; rows: number; }
interface CHStorage {
    disk: { free_bytes: number; total_bytes: number; keep_free_bytes: number };
    tables: CHTable[];
    total_bytes: number; discovery_bytes: number; security_bytes: number;
    per_hour_bytes: number; per_day_bytes: number; per_day_bytes_24h_avg: number;
    projected_7d_bytes: number; retention_days: number;
    headroom_bytes: number; days_until_full: number;
}
interface MongoStorage {
    data_bytes: number; storage_bytes: number; index_bytes: number;
    fs_used_bytes: number; fs_total_bytes: number;
    inventory: { endpoints: number; new_last_hour: number; new_last_24h: number };
}
interface StorageStats {
    generated_at: string;
    clickhouse_available: boolean;
    clickhouse?: CHStorage;
    mongodb: MongoStorage;
}

// One labelled metric tile.
const Stat: React.FC<{ label: string; value: string; hint?: string; color?: string }> = ({ label, value, hint, color }) => (
    <div style={{ padding: '10px 14px', background: 'var(--bg-hover)', borderRadius: 10, border: '1px solid var(--border-default)' }}>
        <Text style={{ fontSize: 10.5, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--text-tertiary)', display: 'block' }}>
            {label}{hint && <Tooltip title={hint}><InfoCircleOutlined style={{ marginLeft: 4, fontSize: 10 }} /></Tooltip>}
        </Text>
        <Text style={{ fontSize: 19, fontWeight: 700, color: color || 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{value}</Text>
    </div>
);

const CARD_STYLE: React.CSSProperties = {
    borderRadius: 12, border: '1px solid var(--border-default)', background: 'var(--card-bg)',
};

const StorageStatsCard: React.FC<{ active?: boolean }> = ({ active = true }) => {
    const admin = isOwnerOrAdmin();
    const query = useQuery({
        queryKey: ['storage-stats'],
        queryFn: async (): Promise<StorageStats> =>
            (await api.get('/api/v3/setting/storage-stats', SKIP_GLOBAL_ERROR)).data?.data,
        enabled: admin,
        // Only poll while the General tab is visible — antd Tabs keeps panes
        // mounted, so without this the 30s poll would run on other settings tabs.
        refetchInterval: active ? 30000 : false,
        refetchOnWindowFocus: false,
        retry: false,
    });

    if (!admin) return null;

    const d = query.data;
    const ch = d?.clickhouse;
    const mongo = d?.mongodb;

    const usedNow = (ch?.total_bytes ?? 0) + (mongo?.storage_bytes ?? 0);
    const free = ch?.disk?.free_bytes ?? 0;
    const total = ch?.disk?.total_bytes ?? 0;
    const usedPct = total > 0 ? Math.min(100, Math.round((total - free) / total * 100)) : 0;
    const fits = (ch?.headroom_bytes ?? 0) >= 0;

    return (
        <Card
            style={CARD_STYLE}
            styles={{ body: { padding: 20 } }}
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 11, background: 'linear-gradient(135deg, var(--color-primary) 0%, #1d4ed8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <HddOutlined style={{ color: '#fff', fontSize: 20 }} />
                    </div>
                    <div>
                        <Text style={{ fontSize: 15, fontWeight: 700 }}>Storage</Text>
                        <div><Text type="secondary" style={{ fontSize: 12.5 }}>Live ClickHouse + MongoDB usage and {ch?.retention_days ?? 7}-day projection</Text></div>
                    </div>
                </div>
            }
            extra={<Button size="small" icon={<ReloadOutlined />} loading={query.isFetching} onClick={() => query.refetch()}>Refresh</Button>}
        >
            {query.isError && <Alert type="warning" showIcon style={{ marginBottom: 12 }} message="Could not load storage stats" description={(query.error as Error)?.message} />}

            {/* Headline metrics */}
            <Row gutter={[12, 12]}>
                <Col xs={12} md={6}><Stat label="Used now" value={fmtBytes(usedNow)} hint="ClickHouse on-disk + MongoDB storage" /></Col>
                <Col xs={12} md={6}><Stat label="Written last 1h" value={fmtBytes(ch?.per_hour_bytes)} hint="ClickHouse (raw + audit + rollups), estimated from current bytes/row" /></Col>
                <Col xs={12} md={6}><Stat label={`Projected ${ch?.retention_days ?? 7}d (at this rate)`} value={fmtBytes(ch?.projected_7d_bytes)} hint="Steady-state size the TTL'd tables converge to, from the 24h average rate" /></Col>
                <Col xs={12} md={6}><Stat label="Free disk" value={fmtBytes(free)} hint="ClickHouse data disk free space" color={fits ? 'var(--color-success)' : 'var(--color-error)'} /></Col>
            </Row>

            {/* Disk bar + fit status */}
            {total > 0 && (
                <div style={{ marginTop: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <Text style={{ fontSize: 12 }}>Disk: {fmtBytes(total - free)} / {fmtBytes(total)} used</Text>
                        <Text style={{ fontSize: 12 }} type="secondary">reserve {fmtBytes(ch?.disk?.keep_free_bytes)}</Text>
                    </div>
                    <Progress percent={usedPct} status={usedPct > 90 ? 'exception' : 'normal'} showInfo />
                    <Alert
                        type={fits ? 'success' : 'error'}
                        showIcon
                        style={{ marginTop: 8, borderRadius: 8 }}
                        message={fits
                            ? `The ${ch?.retention_days ?? 7}-day steady state fits — headroom ${fmtBytes(ch?.headroom_bytes)}.`
                            : `At this rate the ${ch?.retention_days ?? 7}-day steady state exceeds free disk by ${fmtBytes(Math.abs(ch?.headroom_bytes ?? 0))}.`}
                    />
                </div>
            )}

            {/* Breakdown */}
            <Row gutter={[12, 12]} style={{ marginTop: 16 }}>
                <Col xs={24} md={8}>
                    <div style={{ padding: 12, border: '1px solid var(--border-default)', borderRadius: 10 }}>
                        <Text strong><DatabaseOutlined /> ClickHouse</Text>
                        <div style={{ marginTop: 6, fontSize: 12.5 }}>
                            <div>Discovery (api_events): <Text strong>{fmtBytes(ch?.discovery_bytes)}</Text></div>
                            <div>Security (shield audit): <Text strong>{fmtBytes(ch?.security_bytes)}</Text></div>
                            <div>Total: <Text strong>{fmtBytes(ch?.total_bytes)}</Text> {!d?.clickhouse_available && <Tag color="default">unavailable</Tag>}</div>
                            <div style={{ color: 'var(--text-tertiary)' }}>last 24h: {fmtBytes(ch?.per_day_bytes_24h_avg)}/day</div>
                        </div>
                    </div>
                </Col>
                <Col xs={24} md={8}>
                    <div style={{ padding: 12, border: '1px solid var(--border-default)', borderRadius: 10 }}>
                        <Text strong><DatabaseOutlined /> MongoDB</Text>
                        <div style={{ marginTop: 6, fontSize: 12.5 }}>
                            <div>Storage: <Text strong>{fmtBytes(mongo?.storage_bytes)}</Text> (data {fmtBytes(mongo?.data_bytes)} + idx {fmtBytes(mongo?.index_bytes)})</div>
                            <div>Inventory endpoints: <Text strong>{(mongo?.inventory?.endpoints ?? 0).toLocaleString()}</Text></div>
                            <div style={{ color: 'var(--text-tertiary)' }}>new: {mongo?.inventory?.new_last_hour ?? 0}/1h · {mongo?.inventory?.new_last_24h ?? 0}/24h</div>
                        </div>
                    </div>
                </Col>
                <Col xs={24} md={8}>
                    <div style={{ padding: 12, border: '1px solid var(--border-default)', borderRadius: 10 }}>
                        <Text strong>Notes</Text>
                        <div style={{ marginTop: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                            ClickHouse grows with req/s (TTL caps it at {ch?.retention_days ?? 7}d). MongoDB grows with distinct endpoints, not traffic. Numbers measured live from system tables; updates every 30s.
                        </div>
                    </div>
                </Col>
            </Row>
        </Card>
    );
};

export default StorageStatsCard;
