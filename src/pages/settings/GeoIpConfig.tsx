/**
 * GeoIP MMDB management — a section of Settings → API Discovery.
 *
 * Manages the MaxMind `.mmdb` databases (city / asn) the collector uses
 * for geo enrichment. Files live in MongoDB GridFS; the collector polls
 * (~2 min) and pulls the newest — no restart.
 *
 *  - GET  /api/v3/setting/geoip            — status of both kinds
 *  - POST /api/v3/setting/geoip/upload     — multipart kind+file (Admin/Owner)
 *  - POST /api/v3/setting/geoip/download   — fetch db-ip Lite (Admin/Owner)
 *  - DELETE /api/v3/setting/geoip/:kind    — drop a kind (Admin/Owner)
 *
 * Upload / download can take minutes — both requests use a 5-min timeout
 * (the backend has its own 5-min deadline and finishes the publish even
 * if the client gives up).
 */

import React, { useState } from 'react';
import {
    Card,
    Row,
    Col,
    Button,
    Typography,
    Space,
    Tag,
    Modal,
    Upload,
    Descriptions,
    Tooltip,
    Alert,
    message,
} from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import {
    ReloadOutlined,
    GlobalOutlined,
    CloudDownloadOutlined,
    UploadOutlined,
    DeleteOutlined,
    InboxOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
} from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { api, useCustomGetQuery } from '@/common/api';

const { Title, Text, Paragraph } = Typography;

// ─── Types ───────────────────────────────────────────────────────────

type GeoKind = 'city' | 'asn';

interface GeoIpDatabase {
    kind: GeoKind;
    present: boolean;
    file_id?: string;
    size?: number;
    sha256?: string;
    source?: string;
    uploaded_by?: string;
    upload_date?: string;
}
interface GeoIpStatus {
    databases: GeoIpDatabase[];
}

const GEOIP_PATH = '/api/v3/setting/geoip';
// Upload / download both run for minutes — well past the api instance's
// default 115s timeout.
const LONG_TIMEOUT = 5 * 60 * 1000;

const KIND_LABEL: Record<GeoKind, string> = { city: 'City', asn: 'ASN' };
const KIND_DESC: Record<GeoKind, string> = {
    city: 'Resolves country / city / coordinates for source IPs.',
    asn: 'Resolves the network operator (ASN + organisation) for source IPs.',
};

const fmtBytes = (n?: number): string => {
    if (!n || n <= 0) return '—';
    const u = ['B', 'KB', 'MB', 'GB'];
    let v = n;
    let i = 0;
    while (v >= 1024 && i < u.length - 1) {
        v /= 1024;
        i += 1;
    }
    return `${v.toFixed(i === 0 ? 0 : 1)} ${u[i]}`;
};

const errMsg = (e: any, fallback: string): string => {
    const s = e?.response?.status;
    if (s === 403) return 'Only an Admin or Owner can change GeoIP databases.';
    if (s === 502) return 'db-ip could not be reached, or the downloaded file was invalid.';
    return e?.response?.data?.message || e?.response?.data?.error || e?.message || fallback;
};

const GeoIpConfig: React.FC = () => {
    const [messageApi, contextHolder] = message.useMessage();

    const { data, isLoading, isFetching, refetch } = useCustomGetQuery({
        queryKey: 'setting-geoip',
        enabled: true,
        path: 'setting/geoip',
        refetchOnWindowFocus: false,
    }) as { data?: GeoIpStatus; isLoading: boolean; isFetching: boolean; refetch: () => void };

    const dbOf = (kind: GeoKind): GeoIpDatabase =>
        (data?.databases ?? []).find((d) => d.kind === kind) ?? { kind, present: false };

    // The kind currently mid-operation — drives per-card spinners.
    const [busyKind, setBusyKind] = useState<GeoKind | null>(null);

    // Upload modal
    const [uploadKind, setUploadKind] = useState<GeoKind | null>(null);
    const [uploadFile, setUploadFile] = useState<UploadFile | null>(null);

    const downloadMutation = useMutation({
        mutationFn: async (kind: GeoKind) => {
            const res = await api.post(`${GEOIP_PATH}/download`, { kind }, { timeout: LONG_TIMEOUT });
            return res.data as { kind: GeoKind; source_url?: string };
        },
        onSuccess: (r) => {
            messageApi.success(`db-ip Lite ${KIND_LABEL[r.kind]} database published.`);
            refetch();
        },
        onError: (e) => messageApi.error(errMsg(e, 'Failed to download the db-ip database')),
        onSettled: () => setBusyKind(null),
    });

    const uploadMutation = useMutation({
        mutationFn: async () => {
            const fd = new FormData();
            fd.append('kind', uploadKind as string);
            fd.append('file', uploadFile as unknown as Blob);
            // Override the api instance's default application/json — axios v1
            // would otherwise JSON-stringify the FormData. multipart/form-data
            // makes it skip that; the browser adds the boundary.
            const res = await api.post(`${GEOIP_PATH}/upload`, fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
                timeout: LONG_TIMEOUT,
            });
            return res.data as { kind: GeoKind };
        },
        onSuccess: (r) => {
            messageApi.success(`${KIND_LABEL[r.kind]} database published.`);
            setUploadKind(null);
            setUploadFile(null);
            refetch();
        },
        onError: (e) => messageApi.error(errMsg(e, 'Failed to upload the database')),
        onSettled: () => setBusyKind(null),
    });

    const deleteMutation = useMutation({
        mutationFn: async (kind: GeoKind) => {
            await api.delete(`${GEOIP_PATH}/${kind}`);
        },
        onSuccess: () => {
            messageApi.success('Database deleted.');
            refetch();
        },
        onError: (e) => messageApi.error(errMsg(e, 'Failed to delete the database')),
        onSettled: () => setBusyKind(null),
    });

    const confirmDelete = (kind: GeoKind) => {
        Modal.confirm({
            title: `Delete the ${KIND_LABEL[kind]} GeoIP database?`,
            content: `The collector stops ${kind === 'city' ? 'country / city' : 'ASN'} enrichment on its next poll. You can re-upload or re-download it any time.`,
            okText: 'Delete',
            okButtonProps: { danger: true },
            onOk: () => {
                setBusyKind(kind);
                return deleteMutation.mutateAsync(kind);
            },
        });
    };

    const anyBusy = downloadMutation.isPending || uploadMutation.isPending || deleteMutation.isPending;

    const renderCard = (kind: GeoKind) => {
        const db = dbOf(kind);
        const busy = busyKind === kind && anyBusy;
        return (
            <Card
                size="small"
                style={{ borderRadius: 10, height: '100%' }}
                loading={isLoading}
                title={
                    <Space size={8}>
                        {/* Colour comes from the global .ant-card-head-title
                            rule (white on the gradient head, both themes). */}
                        <GlobalOutlined />
                        <Text strong>{KIND_LABEL[kind]} database</Text>
                        <Tag
                            icon={db.present ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                            color={db.present ? 'green' : 'default'}
                            style={{ margin: 0 }}
                        >
                            {db.present ? 'Loaded' : 'Missing'}
                        </Tag>
                    </Space>
                }
            >
                <Paragraph type="secondary" style={{ fontSize: 12, marginBottom: 10 }}>
                    {KIND_DESC[kind]}
                </Paragraph>

                {db.present ? (
                    <Descriptions column={1} size="small" styles={{ label: { width: 96 } }}>
                        <Descriptions.Item label="Size">{fmtBytes(db.size)}</Descriptions.Item>
                        <Descriptions.Item label="Source">
                            <Tag style={{ margin: 0 }}>{db.source || 'upload'}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Uploaded">
                            <Text style={{ fontSize: 12 }}>
                                {db.upload_date ? new Date(db.upload_date).toLocaleString() : '—'}
                                {db.uploaded_by ? ` · ${db.uploaded_by}` : ''}
                            </Text>
                        </Descriptions.Item>
                        {db.sha256 && (
                            <Descriptions.Item label="SHA-256">
                                <Tooltip title={db.sha256}>
                                    <Text
                                        copyable={{ text: db.sha256 }}
                                        style={{ fontFamily: 'Monaco, Menlo, monospace', fontSize: 11 }}
                                    >
                                        {db.sha256.slice(0, 16)}…
                                    </Text>
                                </Tooltip>
                            </Descriptions.Item>
                        )}
                    </Descriptions>
                ) : (
                    <Alert
                        type="info"
                        showIcon
                        style={{ marginBottom: 4 }}
                        message={`No ${KIND_LABEL[kind]} database — ${kind === 'city' ? 'country / city' : 'ASN'} enrichment is off.`}
                        description="Download the free db-ip Lite database, or upload your own MaxMind .mmdb file."
                    />
                )}

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
                    <Button
                        type={db.present ? 'default' : 'primary'}
                        icon={<CloudDownloadOutlined />}
                        loading={busyKind === kind && downloadMutation.isPending}
                        disabled={anyBusy}
                        onClick={() => {
                            setBusyKind(kind);
                            downloadMutation.mutate(kind);
                        }}
                    >
                        Download db-ip Lite
                    </Button>
                    <Button
                        icon={<UploadOutlined />}
                        disabled={anyBusy}
                        onClick={() => { setUploadKind(kind); setUploadFile(null); }}
                    >
                        Upload .mmdb
                    </Button>
                    {db.present && (
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            loading={busyKind === kind && deleteMutation.isPending}
                            disabled={anyBusy}
                            onClick={() => confirmDelete(kind)}
                        >
                            Delete
                        </Button>
                    )}
                </div>
                {busy && (downloadMutation.isPending || uploadMutation.isPending) && (
                    <Text type="secondary" style={{ fontSize: 11, display: 'block', marginTop: 8 }}>
                        Publishing… this can take a few minutes. The collector picks it up within ~2 min.
                    </Text>
                )}
            </Card>
        );
    };

    return (
        <div>
            {contextHolder}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
                <Space>
                    <GlobalOutlined style={{ color: 'var(--color-primary)', fontSize: 20 }} />
                    <div>
                        <Title level={5} style={{ margin: 0 }}>GeoIP Databases</Title>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            MaxMind <code>.mmdb</code> files powering the collector&apos;s geo enrichment. Applied within ~2 min.
                        </Text>
                    </div>
                </Space>
                <Button icon={<ReloadOutlined spin={isFetching} />} onClick={() => refetch()}>
                    Refresh
                </Button>
            </div>

            <Row gutter={[12, 12]}>
                <Col xs={24} md={12}>{renderCard('city')}</Col>
                <Col xs={24} md={12}>{renderCard('asn')}</Col>
            </Row>

            {/* Upload modal */}
            <Modal
                title={uploadKind ? `Upload ${KIND_LABEL[uploadKind]} GeoIP database` : ''}
                open={!!uploadKind}
                onCancel={() => { setUploadKind(null); setUploadFile(null); }}
                okText="Upload"
                okButtonProps={{ disabled: !uploadFile, loading: uploadMutation.isPending }}
                onOk={() => { if (uploadKind) setBusyKind(uploadKind); uploadMutation.mutate(); }}
            >
                <Paragraph type="secondary" style={{ fontSize: 12 }}>
                    A MaxMind <code>.mmdb</code> file (max 256&nbsp;MiB). The backend verifies it is a real
                    MaxMind database and that its type matches <strong>{uploadKind}</strong> — an ASN file
                    cannot be uploaded as city. Publishing can take a few minutes.
                </Paragraph>
                <Upload.Dragger
                    maxCount={1}
                    accept=".mmdb"
                    beforeUpload={(file) => {
                        setUploadFile(file as unknown as UploadFile);
                        return false; // prevent auto-upload; POST happens on Ok
                    }}
                    onRemove={() => setUploadFile(null)}
                    fileList={uploadFile ? [uploadFile] : []}
                >
                    <p className="ant-upload-drag-icon" style={{ marginBottom: 4 }}>
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag the .mmdb file here</p>
                    <p className="ant-upload-hint" style={{ fontSize: 12 }}>
                        MaxMind GeoIP2 / GeoLite2 or db-ip MMDB format.
                    </p>
                </Upload.Dragger>
            </Modal>
        </div>
    );
};

export default GeoIpConfig;
