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
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { shieldApi } from '@/pages/shield/shieldApi';
import { isShieldAdmin } from '@/pages/shield/utils';

const { Text } = Typography;

interface ClientShieldProps {
    clientId: string;
}

const statusBadge = (status?: string) => {
    switch (status) {
        case 'active':
            return <Badge status="success" text="active" />;
        case 'inactive':
            return <Badge status="default" text="inactive" />;
        case 'failed':
            return <Badge status="error" text="failed" />;
        default:
            return <Badge status="warning" text={status || 'unknown'} />;
    }
};

const levelColor = (level?: string) => {
    switch ((level || '').toLowerCase()) {
        case 'error': return 'red';
        case 'warn': case 'warning': return 'orange';
        case 'info': return 'blue';
        default: return 'default';
    }
};

const ClientShield: React.FC<ClientShieldProps> = ({ clientId }) => {
    const { project } = useProjectVariable();
    const admin = isShieldAdmin();

    const statusQuery = useQuery({
        queryKey: ['shield-client-status', clientId, project],
        queryFn: () => shieldApi.getClientStatus(clientId, project),
        enabled: admin && !!clientId && !!project,
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
                        {logs.map((l, i) => (
                            <div key={i} style={{ marginBottom: 2, whiteSpace: 'pre-wrap' }}>
                                <Tag className='auto-width-tag' color={levelColor(l.level)} style={{ marginRight: 6 }}>
                                    {(l.level || 'log').toLowerCase()}
                                </Tag>
                                <Text type="secondary" style={{ marginRight: 6, fontSize: 11 }}>{l.timestamp}</Text>
                                <span>{l.message}</span>
                            </div>
                        ))}
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
                                <Tag className='auto-width-tag' color="blue">{files.length}</Tag>
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
        </Row>
    );
};

export default ClientShield;
