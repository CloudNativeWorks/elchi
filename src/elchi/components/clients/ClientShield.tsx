/**
 * Client detail "Shield" tab: the edge's LIVE shield state — service status,
 * recent logs, and the on-disk config file set. Both reads dispatch a real
 * command to the connected edge (admin/owner-only on the backend), so they are
 * fetched on demand and refreshable.
 */

import React from 'react';
import { Alert, Badge, Button, Card, Col, Row, Space, Table, Tag, Tooltip, Typography } from 'antd';
import { ReloadOutlined, SafetyOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { shieldApi } from '@/pages/shield/shieldApi';
import { isShieldAdmin } from '@/pages/shield/utils';
import { ShieldSecurityEvent } from '@/pages/shield/types';

const { Text } = Typography;

interface ClientShieldProps {
    clientId: string;
    /** Edge hostname — shield stamps its instance as `<hostname>-shield`, which
     *  scopes the recent-findings panel to this edge. */
    hostname?: string;
}

const actionColor = (a: string): string => {
    switch (a) {
        case 'block': return 'red';
        case 'detect': return 'orange';
        case 'shadow': return 'geekblue';
        default: return 'default';
    }
};

// systemd reports composite strings like "active (running)" / "inactive (dead)"
// — match on keywords so the dot colour reflects the real state instead of
// falling through to a misleading yellow "warning".
const statusBadge = (status?: string) => {
    if (!status) return <Badge status="warning" text="unknown" />;
    const s = status.toLowerCase();
    if (s.includes('fail') || s.includes('error')) return <Badge status="error" text={status} />;
    if (s.includes('active') || s.includes('running')) return <Badge status="success" text={status} />;
    if (s.includes('inactive') || s.includes('dead') || s.includes('stopped')) return <Badge status="default" text={status} />;
    return <Badge status="warning" text={status} />;
};

// Slim count pill for card-title badges (replaces the bulky antd Tag which
// inherits a global min-height: 30px).
const CountPill: React.FC<{ count: React.ReactNode; tone?: 'primary' | 'danger' }> = ({ count, tone = 'primary' }) => {
    const color = tone === 'danger' ? 'var(--color-error)' : 'var(--color-primary)';
    return (
        <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 20,
            height: 18,
            padding: '0 6px',
            borderRadius: 9,
            fontSize: 11,
            fontWeight: 600,
            lineHeight: 1,
            color,
            background: `color-mix(in srgb, ${color} 14%, transparent)`,
            border: `1px solid color-mix(in srgb, ${color} 35%, transparent)`,
            fontVariantNumeric: 'tabular-nums',
        }}>
            {count}
        </span>
    );
};

// Tone (text + tint bg) for the slim log-level pill in Recent Logs.
const levelTone = (level?: string): { color: string; bg: string } => {
    switch ((level || '').toLowerCase()) {
        case 'error': return { color: 'var(--color-error)', bg: 'color-mix(in srgb, var(--color-error) 14%, transparent)' };
        case 'warn': case 'warning': return { color: 'var(--color-warning)', bg: 'color-mix(in srgb, var(--color-warning) 14%, transparent)' };
        case 'info': return { color: 'var(--color-primary)', bg: 'color-mix(in srgb, var(--color-primary) 12%, transparent)' };
        default: return { color: 'var(--text-tertiary)', bg: 'var(--bg-elevated)' };
    }
};

const ClientShield: React.FC<ClientShieldProps> = ({ clientId, hostname }) => {
    const { project } = useProjectVariable();
    const admin = isShieldAdmin();

    // shield stamps its instance as `<hostname>-shield`; scope findings to it.
    const instance = hostname ? `${hostname}-shield` : '';

    const statusQuery = useQuery({
        queryKey: ['shield-client-status', clientId, project],
        queryFn: () => shieldApi.getClientStatus(clientId, project),
        enabled: admin && !!clientId && !!project,
        refetchOnWindowFocus: false,
        retry: false,
    });

    // Recent security findings on THIS edge (last 7 days), from central ClickHouse.
    const eventsQuery = useQuery({
        queryKey: ['shield-client-events', instance, project],
        queryFn: () => shieldApi.getSecurityEvents(project, {
            instance,
            findings_only: true,
            from: dayjs().subtract(7, 'day').toISOString(),
            to: dayjs().toISOString(),
            limit: 20,
        }),
        enabled: admin && !!instance && !!project,
        refetchOnWindowFocus: false,
        retry: false,
    });

    const filesQuery = useQuery({
        queryKey: ['shield-client-files', clientId, project],
        queryFn: () => shieldApi.getClientFiles(clientId, project),
        enabled: admin && !!clientId && !!project,
        refetchOnWindowFocus: false,
        retry: false,
    });

    if (!admin) {
        return (
            <Alert
                type="info"
                showIcon
                message="Admin access required"
                description="Reading the edge's live shield state dispatches a command to the client; only Admin and Owner roles can do this."
                style={{ borderRadius: 8 }}
            />
        );
    }

    const shield = statusQuery.data?.shield;
    const files = filesQuery.data?.shield?.current_files ?? [];
    const logs = shield?.logs ?? [];

    // The dispatch can also come back as a 200 whose envelope says the edge
    // errored before producing a shield payload (success:false, no `shield`).
    const statusEnvelopeError = statusQuery.data && !statusQuery.data.shield
        ? (statusQuery.data.error || 'The client returned no shield status (is elchi-shield installed on this edge?)')
        : null;
    const filesEnvelopeError = filesQuery.data && !filesQuery.data.shield
        ? (filesQuery.data.error || 'The client returned no file listing')
        : null;

    return (
        <Row gutter={[16, 16]}>
            <Col span={24}>
                <Card
                    size="small"
                    style={{ borderRadius: 12 }}
                    title={
                        <Space>
                            <SafetyOutlined />
                            <span>Shield Service</span>
                            {!statusQuery.isFetching && statusBadge(shield?.service_status)}
                        </Space>
                    }
                    extra={
                        <Button
                            size="small"
                            icon={<ReloadOutlined />}
                            loading={statusQuery.isFetching}
                            onClick={() => statusQuery.refetch()}
                        >
                            Refresh
                        </Button>
                    }
                >
                    {statusQuery.isError && (
                        <Alert
                            type="warning"
                            showIcon
                            message="Could not read shield status"
                            description={(statusQuery.error as Error)?.message}
                            style={{ marginBottom: 12, borderRadius: 8 }}
                        />
                    )}
                    {statusEnvelopeError && (
                        <Alert
                            type="warning"
                            showIcon
                            message="Edge returned an error"
                            description={statusEnvelopeError}
                            style={{ marginBottom: 12, borderRadius: 8 }}
                        />
                    )}

                    <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                        Recent Logs
                    </Text>
                    <div
                        style={{
                            marginTop: 8,
                            maxHeight: 280,
                            overflowY: 'auto',
                            fontFamily: 'monospace',
                            fontSize: 12,
                            // --bg-hover has subtle contrast in BOTH themes
                            // (--bg-elevated is plain white in light mode).
                            background: 'var(--bg-hover)',
                            border: '1px solid var(--border-default)',
                            borderRadius: 8,
                            padding: 12,
                        }}
                    >
                        {logs.length === 0 && (
                            <Text type="secondary">No logs available (the shield service may not be running on this edge).</Text>
                        )}
                        {logs.map((l, i) => {
                            const tone = levelTone(l.level);
                            return (
                                <div key={i} style={{ marginBottom: 2, whiteSpace: 'pre-wrap' }}>
                                    <span style={{
                                        display: 'inline-block',
                                        height: 16,
                                        lineHeight: '16px',
                                        padding: '0 6px',
                                        marginRight: 6,
                                        borderRadius: 5,
                                        fontSize: 10,
                                        fontWeight: 600,
                                        letterSpacing: 0.4,
                                        textTransform: 'uppercase',
                                        color: tone.color,
                                        background: tone.bg,
                                        verticalAlign: 'middle',
                                    }}>
                                        {(l.level || 'log').toLowerCase()}
                                    </span>
                                    <Text type="secondary" style={{ marginRight: 6, fontSize: 11 }}>{l.timestamp}</Text>
                                    <span>{l.message}</span>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </Col>

            <Col span={24}>
                <Card
                    size="small"
                    style={{ borderRadius: 12 }}
                    title={
                        <Space>
                            <span>Live Config Files</span>
                            <Tooltip title="The shield config files actually on this edge's disk right now — compare against the project's policies to spot drift.">
                                <CountPill count={files.length} />
                            </Tooltip>
                        </Space>
                    }
                    extra={
                        <Button
                            size="small"
                            icon={<ReloadOutlined />}
                            loading={filesQuery.isFetching}
                            onClick={() => filesQuery.refetch()}
                        >
                            Refresh
                        </Button>
                    }
                >
                    {filesQuery.isError && (
                        <Alert
                            type="warning"
                            showIcon
                            message="Could not read the edge's file set"
                            description={(filesQuery.error as Error)?.message}
                            style={{ marginBottom: 12, borderRadius: 8 }}
                        />
                    )}
                    {filesEnvelopeError && (
                        <Alert
                            type="warning"
                            showIcon
                            message="Edge returned an error"
                            description={filesEnvelopeError}
                            style={{ marginBottom: 12, borderRadius: 8 }}
                        />
                    )}
                    <Table
                        size="small"
                        dataSource={files}
                        rowKey="path"
                        loading={filesQuery.isFetching}
                        pagination={false}
                        columns={[
                            {
                                title: 'Path',
                                dataIndex: 'path',
                                key: 'path',
                                render: (p: string) => <Text style={{ fontFamily: 'monospace' }}>{p}</Text>,
                            },
                            {
                                title: 'SHA-256',
                                dataIndex: 'sha256',
                                key: 'sha256',
                                render: (s: string) => (
                                    <Text copyable={{ text: s }} style={{ fontFamily: 'monospace', fontSize: 12 }}>
                                        {s ? `${s.slice(0, 12)}…` : '—'}
                                    </Text>
                                ),
                            },
                            {
                                title: 'Mode',
                                dataIndex: 'mode',
                                key: 'mode',
                                width: 90,
                                render: (m: string) => <Tag className='auto-width-tag'>{m || '-'}</Tag>,
                            },
                        ]}
                    />
                </Card>
            </Col>

            <Col span={24}>
                <Card
                    size="small"
                    style={{ borderRadius: 12 }}
                    title={
                        <Space>
                            <span>Recent Security Findings</span>
                            <Tooltip title="What shield blocked/detected on this edge in the last 7 days (from the central audit store).">
                                <CountPill count={eventsQuery.data?.data?.length ?? 0} tone="danger" />
                            </Tooltip>
                        </Space>
                    }
                    extra={
                        <Space>
                            <Link to="/shield?tab=events">View all →</Link>
                            <Button
                                size="small"
                                icon={<ReloadOutlined />}
                                loading={eventsQuery.isFetching}
                                onClick={() => eventsQuery.refetch()}
                            >
                                Refresh
                            </Button>
                        </Space>
                    }
                >
                    {eventsQuery.isError && (
                        <Alert
                            type="warning"
                            showIcon
                            message="Could not load security findings"
                            description={(eventsQuery.error as Error)?.message}
                            style={{ marginBottom: 12, borderRadius: 8 }}
                        />
                    )}
                    {!instance ? (
                        <Text type="secondary">No hostname for this client — cannot scope findings to this edge.</Text>
                    ) : (
                        <Table
                            size="small"
                            dataSource={eventsQuery.data?.data ?? []}
                            rowKey={(r: ShieldSecurityEvent, i) => `${r.request_id}-${r.ts}-${r.engine}-${r.rule_id}-${i ?? 0}`}
                            loading={eventsQuery.isFetching}
                            pagination={false}
                            locale={{ emptyText: `No findings for instance "${instance}" in the last 7 days (verify the edge's --instance-id if you expected some)` }}
                            columns={[
                                {
                                    title: 'Time', dataIndex: 'ts', key: 'ts', width: 160,
                                    render: (ts: string) => <Text style={{ fontSize: 12 }}>{dayjs(ts).format('YYYY-MM-DD HH:mm:ss')}</Text>,
                                },
                                {
                                    title: 'Action', dataIndex: 'action', key: 'action', width: 80,
                                    render: (a: string) => <Tag className="auto-width-tag" color={actionColor(a)}>{a}</Tag>,
                                },
                                {
                                    title: 'Engine', dataIndex: 'engine', key: 'engine', width: 110,
                                    render: (e: string) => <Tag className="auto-width-tag">{e || '-'}</Tag>,
                                },
                                {
                                    title: 'Request', key: 'request',
                                    render: (_: unknown, r: ShieldSecurityEvent) => (
                                        <Text style={{ fontFamily: 'monospace', fontSize: 12 }}>{r.method} {r.host}{r.path}</Text>
                                    ),
                                },
                                {
                                    title: 'Reason', dataIndex: 'reason', key: 'reason', ellipsis: true,
                                    render: (reason: string) => <Text type="secondary" style={{ fontSize: 12 }}>{reason || '—'}</Text>,
                                },
                            ]}
                        />
                    )}
                </Card>
            </Col>
        </Row>
    );
};

export default ClientShield;
