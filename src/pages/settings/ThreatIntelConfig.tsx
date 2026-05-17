/**
 * Threat-Intel Feed management — Settings → Threat Intel.
 *
 * Edits the collector's `api_collector_threatintel` singleton via
 * `/api/v3/setting/threat-intel`. The collector polls the document and
 * hot-reloads the threat-intel enricher when `version` changes.
 *
 * Contract notes:
 *  - PUT is a WHOLE-REPLACE of `feeds[]` — a feed sent without `entries`
 *    loses them. The enabled-toggle therefore fetches every feed's full
 *    entries first, then PUTs the complete set.
 *  - `enabled` is a pointer field — absent means ON. We always send an
 *    explicit boolean so a user's "off" is never silently flipped back.
 *  - Upload / PUT / DELETE are Admin/Owner only (403 otherwise).
 */

import React, { useState } from 'react';
import {
    Card,
    Table,
    Switch,
    Button,
    Typography,
    Space,
    Tag,
    Empty,
    Modal,
    Input,
    Upload,
    Alert,
    Tooltip,
    message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile } from 'antd/es/upload/interface';
import {
    ReloadOutlined,
    AlertOutlined,
    UploadOutlined,
    DeleteOutlined,
    EyeOutlined,
    InboxOutlined,
} from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { api, useCustomGetQuery } from '@/common/api';
import ComponentLoadErrorBoundary from '@/components/ComponentLoadErrorBoundary';

const { Title, Text, Paragraph } = Typography;

// ─── Types ───────────────────────────────────────────────────────────

interface TIFeedSummary {
    name: string;
    enabled?: boolean;
    entry_count: number;
}
interface ThreatIntelList {
    version: number;
    updated_at?: string;
    updated_by?: string;
    feeds: TIFeedSummary[];
}
interface TIFeedDetail {
    name: string;
    enabled?: boolean;
    entries: string[];
}

const TI_PATH = '/api/v3/setting/threat-intel';
// Cap how many entries we render in the "view" modal — feeds can hold up
// to 250k lines; the browser should not try to paint them all.
const VIEW_CAP = 2000;

const errMsg = (e: any, fallback: string): string =>
    e?.response?.status === 403
        ? 'Only an Admin or Owner can change threat-intel feeds.'
        : e?.response?.data?.message || e?.message || fallback;

const ThreatIntelConfigInner: React.FC = () => {
    const [messageApi, contextHolder] = message.useMessage();

    const { data, isLoading, isFetching, refetch } = useCustomGetQuery({
        queryKey: 'setting-threat-intel',
        enabled: true,
        path: 'setting/threat-intel',
        refetchOnWindowFocus: false,
    }) as { data?: ThreatIntelList; isLoading: boolean; isFetching: boolean; refetch: () => void };

    const feeds = data?.feeds ?? [];
    const version = data?.version ?? 0;

    // Which feed row is mid-write (toggle / delete) — drives per-row spinners.
    const [pending, setPending] = useState<string | null>(null);

    // Upload modal
    const [uploadOpen, setUploadOpen] = useState(false);
    const [uploadName, setUploadName] = useState('');
    const [uploadFile, setUploadFile] = useState<UploadFile | null>(null);

    // View-entries modal
    const [viewFeed, setViewFeed] = useState<TIFeedDetail | null>(null);
    const [viewLoading, setViewLoading] = useState(false);

    // ── Enabled toggle — whole-replace PUT, so fetch every feed's full
    //    entries first and send the complete set. ──
    const toggleMutation = useMutation({
        mutationFn: async (args: { name: string; enabled: boolean }) => {
            const details = await Promise.all(
                feeds.map((f) =>
                    api
                        .get(`${TI_PATH}/${encodeURIComponent(f.name)}`)
                        .then((r) => r.data?.feed as TIFeedDetail),
                ),
            );
            const body = {
                feeds: details.map((d) => ({
                    name: d.name,
                    enabled: d.name === args.name ? args.enabled : d.enabled ?? true,
                    entries: d.entries ?? [],
                })),
            };
            await api.put(TI_PATH, body);
        },
        onSuccess: () => {
            messageApi.success('Feed updated — the collector applies it within ~2 min.');
            refetch();
        },
        onError: (e) => messageApi.error(errMsg(e, 'Failed to update feed')),
        onSettled: () => setPending(null),
    });

    const deleteMutation = useMutation({
        mutationFn: async (name: string) => {
            await api.delete(`${TI_PATH}/${encodeURIComponent(name)}`);
        },
        onSuccess: () => {
            messageApi.success('Feed deleted.');
            refetch();
        },
        onError: (e) => messageApi.error(errMsg(e, 'Failed to delete feed')),
        onSettled: () => setPending(null),
    });

    const uploadMutation = useMutation({
        mutationFn: async () => {
            const fd = new FormData();
            fd.append('name', uploadName.trim());
            fd.append('file', uploadFile as unknown as Blob);
            // The shared `api` instance defaults to Content-Type:
            // application/json — axios v1 would then JSON-stringify the
            // FormData and the multipart fields never reach the backend.
            // Overriding to multipart/form-data makes axios skip that and
            // the browser add the proper boundary.
            const res = await api.post(`${TI_PATH}/upload`, fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return res.data as {
                added: number;
                skipped: number;
                skipped_samples?: string[];
                feed: string;
            };
        },
        onSuccess: (r) => {
            if (r.skipped > 0) {
                messageApi.warning(
                    `Feed "${r.feed}" uploaded — ${r.added} entries added, ${r.skipped} invalid line(s) skipped` +
                        (r.skipped_samples?.length ? ` (e.g. ${r.skipped_samples.slice(0, 3).join(', ')})` : ''),
                    6,
                );
            } else {
                messageApi.success(`Feed "${r.feed}" uploaded — ${r.added} entries added.`);
            }
            setUploadOpen(false);
            setUploadName('');
            setUploadFile(null);
            refetch();
        },
        onError: (e) => messageApi.error(errMsg(e, 'Failed to upload feed')),
    });

    const openView = async (name: string) => {
        setViewFeed({ name, entries: [] });
        setViewLoading(true);
        try {
            const r = await api.get(`${TI_PATH}/${encodeURIComponent(name)}`);
            setViewFeed((r.data?.feed as TIFeedDetail) ?? { name, entries: [] });
        } catch (e) {
            messageApi.error(errMsg(e, 'Failed to load feed entries'));
            setViewFeed(null);
        } finally {
            setViewLoading(false);
        }
    };

    const confirmDelete = (name: string) => {
        Modal.confirm({
            title: `Delete feed "${name}"?`,
            content: 'The collector stops blocking this feed\'s IPs on its next poll. This cannot be undone.',
            okText: 'Delete',
            okButtonProps: { danger: true },
            onOk: () => {
                setPending(name);
                return deleteMutation.mutateAsync(name);
            },
        });
    };

    const busy = toggleMutation.isPending || deleteMutation.isPending;

    const columns: ColumnsType<TIFeedSummary> = [
        {
            title: 'Feed',
            dataIndex: 'name',
            key: 'name',
            render: (n: string) => (
                <Text strong style={{ fontFamily: 'Monaco, Menlo, monospace', fontSize: 12.5 }}>
                    {n}
                </Text>
            ),
        },
        {
            title: 'Entries',
            dataIndex: 'entry_count',
            key: 'entry_count',
            width: 140,
            align: 'right',
            sorter: (a, b) => a.entry_count - b.entry_count,
            render: (n: number) => (
                <Text style={{ fontVariantNumeric: 'tabular-nums', fontSize: 12.5 }}>
                    {(n ?? 0).toLocaleString()}
                </Text>
            ),
        },
        {
            title: 'Enabled',
            dataIndex: 'enabled',
            key: 'enabled',
            width: 110,
            render: (enabled: boolean | undefined, r) => (
                <Switch
                    size="small"
                    // Pointer field — absent means ON.
                    checked={enabled ?? true}
                    loading={pending === r.name && toggleMutation.isPending}
                    disabled={busy}
                    onChange={(v) => {
                        setPending(r.name);
                        toggleMutation.mutate({ name: r.name, enabled: v });
                    }}
                />
            ),
        },
        {
            title: '',
            key: 'actions',
            width: 150,
            align: 'right',
            render: (_: unknown, r) => (
                <Space size={4}>
                    <Tooltip title="View entries">
                        <Button size="small" type="text" icon={<EyeOutlined />} onClick={() => openView(r.name)} />
                    </Tooltip>
                    <Tooltip title="Delete feed">
                        <Button
                            size="small"
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            loading={pending === r.name && deleteMutation.isPending}
                            disabled={busy}
                            onClick={() => confirmDelete(r.name)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div>
            {contextHolder}

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
                <Space>
                    <AlertOutlined style={{ color: 'var(--color-error)', fontSize: 20 }} />
                    <div>
                        <Title level={5} style={{ margin: 0 }}>Threat-Intel Feeds</Title>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            IP / CIDR blocklists for the collector&apos;s threat-intel enricher. Applied within ~2 min of a change.
                        </Text>
                    </div>
                </Space>
                <Space wrap>
                    <Tag color="geekblue" style={{ margin: 0 }}>version {version}</Tag>
                    {data?.updated_by && (
                        <Text type="secondary" style={{ fontSize: 11 }}>
                            updated by <strong>{data.updated_by}</strong>
                        </Text>
                    )}
                    <Button icon={<UploadOutlined />} type="primary" onClick={() => setUploadOpen(true)}>
                        Upload feed
                    </Button>
                    <Button icon={<ReloadOutlined spin={isFetching} />} onClick={() => refetch()}>
                        Refresh
                    </Button>
                </Space>
            </div>

            <Card size="small" style={{ borderRadius: 10, border: '1px solid var(--border-default)' }} styles={{ body: { padding: 0 } }}>
                <Table<TIFeedSummary>
                    className="api-discovery-table"
                    rowKey="name"
                    columns={columns}
                    dataSource={feeds}
                    loading={isLoading}
                    size="middle"
                    pagination={false}
                    locale={{
                        emptyText: (
                            <div style={{ padding: '40px 0' }}>
                                <Empty
                                    description={
                                        <div>
                                            <Text strong>No threat-intel feeds</Text>
                                            <div>
                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                    Upload an IP / CIDR blocklist to start flagging known-bad source IPs
                                                    (the <code>threat_intel_hit</code> risk flag).
                                                </Text>
                                            </div>
                                        </div>
                                    }
                                />
                            </div>
                        ),
                    }}
                />
            </Card>

            {/* Upload modal */}
            <Modal
                title="Upload threat-intel feed"
                open={uploadOpen}
                onCancel={() => { setUploadOpen(false); setUploadFile(null); }}
                okText="Upload"
                okButtonProps={{ disabled: !uploadName.trim() || !uploadFile, loading: uploadMutation.isPending }}
                onOk={() => uploadMutation.mutate()}
            >
                <Paragraph type="secondary" style={{ fontSize: 12 }}>
                    The file is one IP or CIDR per line — blank lines and <code>#</code> comments are ignored.
                    Invalid lines are skipped (and reported), they do not reject the feed. An existing feed of the
                    same name has its entries replaced.
                </Paragraph>
                <Space direction="vertical" size={12} style={{ width: '100%' }}>
                    <div>
                        <Text style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Feed name</Text>
                        <Input
                            placeholder="e.g. spamhaus-drop"
                            value={uploadName}
                            onChange={(e) => setUploadName(e.target.value)}
                        />
                    </div>
                    <Upload.Dragger
                        maxCount={1}
                        beforeUpload={(file) => {
                            setUploadFile(file as unknown as UploadFile);
                            return false; // prevent auto-upload; we POST on Ok
                        }}
                        onRemove={() => setUploadFile(null)}
                        fileList={uploadFile ? [uploadFile] : []}
                    >
                        <p className="ant-upload-drag-icon" style={{ marginBottom: 4 }}>
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag the blocklist file here</p>
                        <p className="ant-upload-hint" style={{ fontSize: 12 }}>
                            Plain text — one IPv4 / IPv6 address or CIDR per line.
                        </p>
                    </Upload.Dragger>
                </Space>
            </Modal>

            {/* View-entries modal */}
            <Modal
                title={viewFeed ? `Feed: ${viewFeed.name}` : ''}
                open={!!viewFeed}
                onCancel={() => setViewFeed(null)}
                footer={null}
                width={560}
            >
                {viewLoading ? (
                    <Text type="secondary">Loading entries…</Text>
                ) : viewFeed ? (
                    <>
                        <Paragraph type="secondary" style={{ fontSize: 12 }}>
                            {viewFeed.entries.length.toLocaleString()} {viewFeed.entries.length === 1 ? 'entry' : 'entries'}
                            {viewFeed.entries.length > VIEW_CAP ? ` — showing the first ${VIEW_CAP.toLocaleString()}` : ''}.
                        </Paragraph>
                        {viewFeed.entries.length > VIEW_CAP && (
                            <Alert
                                type="info"
                                showIcon
                                style={{ marginBottom: 8 }}
                                message="Large feed — the list below is truncated for display only; the feed itself is intact."
                            />
                        )}
                        <pre
                            style={{
                                margin: 0,
                                fontSize: 12,
                                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                                maxHeight: 360,
                                overflow: 'auto',
                                background: 'var(--bg-elevated)',
                                padding: 12,
                                borderRadius: 6,
                            }}
                        >
                            {viewFeed.entries.length === 0
                                ? '(no entries)'
                                : viewFeed.entries.slice(0, VIEW_CAP).join('\n')}
                        </pre>
                    </>
                ) : null}
            </Modal>
        </div>
    );
};

// Isolate behind an error boundary — a malformed feed document must not
// take down the whole Settings page.
const ThreatIntelConfig: React.FC = () => (
    <ComponentLoadErrorBoundary componentName="Threat Intel Settings">
        <ThreatIntelConfigInner />
    </ComponentLoadErrorBoundary>
);

export default ThreatIntelConfig;
