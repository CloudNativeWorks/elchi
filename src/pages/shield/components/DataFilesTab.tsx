/**
 * Supporting files for the policy (IP feeds, GeoIP databases, public keys,
 * OpenAPI specs). Upload-first: the file is read in the browser, its SHA-256 is
 * computed automatically (the user never types a hash) and it ships inline with
 * the bundle. Large artifacts can instead be fetched BY THE EDGE from a URL —
 * that path requires a hash for integrity, explained inline.
 */

import React, { useState } from 'react';
import { Alert, Button, Card, Collapse, Input, Space, Table, Tooltip, Typography, Upload } from 'antd';
import { DeleteOutlined, InboxOutlined, LinkOutlined } from '@ant-design/icons';
import { DataFileModel, edgePathOf } from '../state/model';
import { usePolicyEditor } from '../state/policyStore';
import { Base64FromBytes } from '@/utils/typed-config-op';
import { sha256Hex, MAX_INLINE_BUNDLE_BYTES } from '../utils';

const { Text } = Typography;

const sanitizeFileName = (name: string): string =>
    name.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^[-.]+/, '') || 'file';

const DataFilesTab: React.FC<{ disabled?: boolean }> = ({ disabled }) => {
    const { state, dispatch } = usePolicyEditor();
    const files = state.dataFiles;
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [urlDraft, setUrlDraft] = useState({ name: '', url: '', sha256: '' });
    const [urlError, setUrlError] = useState<string | null>(null);

    const setFiles = (next: DataFileModel[]) => dispatch({ type: 'SET_DATA_FILES', files: next });

    const handleUpload = (file: File): boolean => {
        setUploadError(null);
        if (file.size > MAX_INLINE_BUNDLE_BYTES) {
            setUploadError(
                `"${file.name}" is ${(file.size / (1024 * 1024)).toFixed(1)} MiB — inline content is capped at 3 MiB per project. ` +
                'Use "Fetch from URL" below for large artifacts (the edge downloads them itself, up to 512 MiB).'
            );
            return false;
        }
        const reader = new FileReader();
        reader.onload = async (e) => {
            const buffer = e.target?.result as ArrayBuffer;
            const path = `files/${sanitizeFileName(file.name)}`;
            if (files.some(f => f.path === path)) {
                setUploadError(`A data file named "${path}" already exists in this policy.`);
                return;
            }
            const hash = await sha256Hex(buffer); // automatic — never user-typed
            setFiles([...files, {
                path,
                content: Base64FromBytes(buffer),
                sha256: hash,
                size: buffer.byteLength,
            }]);
        };
        reader.readAsArrayBuffer(file);
        return false;
    };

    const addUrlFile = () => {
        setUrlError(null);
        const name = sanitizeFileName(urlDraft.name.trim() || urlDraft.url.split('/').pop() || '');
        if (!name || name === 'file') {
            setUrlError('Give the file a name (it becomes files/<name> on the edge).');
            return;
        }
        if (!/^https?:\/\//.test(urlDraft.url.trim())) {
            setUrlError('URL must start with http:// or https://');
            return;
        }
        if (!/^[0-9a-fA-F]{64}$/.test(urlDraft.sha256.trim())) {
            setUrlError('SHA-256 must be 64 hex characters — for URL fetches the hash is the only integrity guarantee, so it is required. (Tip: sha256sum <file> on the publisher side.)');
            return;
        }
        const path = `files/${name}`;
        if (files.some(f => f.path === path)) {
            setUrlError(`A data file named "${path}" already exists.`);
            return;
        }
        setFiles([...files, { path, download_url: urlDraft.url.trim(), sha256: urlDraft.sha256.trim().toLowerCase() }]);
        setUrlDraft({ name: '', url: '', sha256: '' });
    };

    return (
        <>
            <Alert
                type="info"
                showIcon
                style={{ marginBottom: 12, borderRadius: 8 }}
                message="Supporting files referenced by your policy"
                description="IP threat feeds, GeoIP databases (.mmdb), JWT public keys, OpenAPI specs… Files land on every edge under /etc/elchi/elchi-shield/files/ and are picked from the engine forms in the Builder."
            />

            {uploadError && (
                <Alert type="error" showIcon closable onClose={() => setUploadError(null)} message={uploadError} style={{ marginBottom: 12, borderRadius: 8 }} />
            )}

            <Card style={{ borderRadius: 12, marginBottom: 12 }} styles={{ body: { padding: 12 } }}>
                <Table
                    size="small"
                    dataSource={files}
                    rowKey="path"
                    pagination={false}
                    locale={{ emptyText: 'No data files — most policies don\'t need any.' }}
                    columns={[
                        {
                            title: 'File',
                            dataIndex: 'path',
                            render: (p: string) => (
                                <Tooltip title={`On the edge: ${edgePathOf(p)}`}>
                                    <Text style={{ fontFamily: 'monospace' }}>{p}</Text>
                                </Tooltip>
                            ),
                        },
                        {
                            title: 'Source',
                            key: 'source',
                            render: (_: unknown, f: DataFileModel) => f.download_url
                                ? <Tooltip title={f.download_url}><Text type="secondary" style={{ fontSize: 12 }}><LinkOutlined /> fetched by edge</Text></Tooltip>
                                : <Text type="secondary" style={{ fontSize: 12 }}>uploaded ({f.size !== undefined ? `${(f.size / 1024).toFixed(1)} KB` : '—'})</Text>,
                        },
                        {
                            title: 'Integrity',
                            dataIndex: 'sha256',
                            render: (s?: string) => s
                                ? <Tooltip title={s}><Text style={{ fontFamily: 'monospace', fontSize: 11 }}>{s.slice(0, 12)}… ✓</Text></Tooltip>
                                : <Text type="secondary">auto</Text>,
                        },
                        ...(!disabled ? [{
                            title: '', width: 40,
                            render: (_: unknown, f: DataFileModel) => (
                                <Button type="text" danger size="small" icon={<DeleteOutlined />}
                                    onClick={() => setFiles(files.filter(x => x.path !== f.path))} />
                            ),
                        }] : []),
                    ]}
                />
            </Card>

            {!disabled && (
                <>
                    <Upload.Dragger
                        multiple
                        showUploadList={false}
                        beforeUpload={handleUpload}
                        style={{ borderRadius: 12 }}
                    >
                        <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                        <p className="ant-upload-text">Click or drag files here to add them</p>
                        <p className="ant-upload-hint">
                            Integrity hash is computed automatically. Up to 3 MiB total inline per project.
                        </p>
                    </Upload.Dragger>

                    <Collapse
                        ghost
                        size="small"
                        style={{ marginTop: 8 }}
                        items={[{
                            key: 'url',
                            label: <Text type="secondary" style={{ fontSize: 12 }}>Advanced: fetch a large file from a URL (the edge downloads it, up to 512 MiB)</Text>,
                            children: (
                                <>
                                    {urlError && (
                                        <Alert type="error" showIcon closable onClose={() => setUrlError(null)} message={urlError} style={{ marginBottom: 8, borderRadius: 8 }} />
                                    )}
                                    <Space.Compact style={{ width: '100%' }}>
                                        <Input size="small" placeholder="file name (e.g. geo.mmdb)" value={urlDraft.name}
                                            onChange={e => setUrlDraft({ ...urlDraft, name: e.target.value })} style={{ width: '22%' }} />
                                        <Input size="small" placeholder="https://example.com/files/data.bin" value={urlDraft.url}
                                            onChange={e => setUrlDraft({ ...urlDraft, url: e.target.value })} style={{ width: '40%', fontFamily: 'monospace' }} />
                                        <Input size="small" placeholder="sha256 of the file (64 hex — required for integrity)" value={urlDraft.sha256}
                                            onChange={e => setUrlDraft({ ...urlDraft, sha256: e.target.value })} style={{ width: '30%', fontFamily: 'monospace' }} />
                                        <Button size="small" type="primary" onClick={addUrlFile}>Add</Button>
                                    </Space.Compact>
                                    <Text type="secondary" style={{ fontSize: 11 }}>
                                        The edge verifies the download against the hash before activating it — a mismatch rejects the file.
                                    </Text>
                                </>
                            ),
                        }]}
                    />
                </>
            )}
        </>
    );
};

export default DataFilesTab;
