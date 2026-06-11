import React, { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    AutoComplete,
    Button,
    Card,
    Col,
    Form,
    Input,
    Modal,
    Radio,
    Row,
    Space,
    Spin,
    Tag,
    Typography,
    Upload,
} from 'antd';
import {
    ArrowLeftOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
    FileAddOutlined,
    InfoCircleOutlined,
    PlusOutlined,
    SafetyOutlined,
    SaveOutlined,
    UploadOutlined,
} from '@ant-design/icons';
import MonacoEditor from '@monaco-editor/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { useTheme } from '@/contexts/ThemeContext';
import { Base64FromBytes } from '@/utils/typed-config-op';
import { shieldApi } from './shieldApi';
import { ShieldFile, ShieldFileForm, ShieldPolicyRequest } from './types';
import { useShieldMutations } from './hooks/useShieldMutations';
import {
    isShieldAdmin,
    textToBase64,
    tryDecodeText,
    base64ByteLength,
    MAX_INLINE_BUNDLE_BYTES,
} from './utils';
import { shieldFieldHelp, MODE_PRESETS, SHIELD_POLICY_INFO } from './constants/fieldHelp';
import ShieldExamplesDrawer from './components/ShieldExamplesDrawer';

const { Title, Text } = Typography;
const { confirm } = Modal;

interface ShieldFormModel {
    name: string;
    files: ShieldFileForm[];
}

/** Editor language from the file extension (shield parses .json as JSON, the rest as YAML). */
const editorLanguage = (path?: string): string =>
    path?.trim().toLowerCase().endsWith('.json') ? 'json' : 'yaml';

/** API file → form row (decode inline base64 for the editor; keep binary as base64). */
const toFormFile = (f: ShieldFile): ShieldFileForm => {
    if (f.download_url) {
        return { path: f.path, source: 'download', download_url: f.download_url, sha256: f.sha256, mode: f.mode };
    }
    const text = f.content !== undefined ? tryDecodeText(f.content) : '';
    return {
        path: f.path,
        source: 'inline',
        contentText: text ?? undefined,
        contentBase64: text === null ? f.content : undefined,
        sha256: f.sha256,
        mode: f.mode,
    };
};

/** Form row → API file (encode editor text to base64). */
const toApiFile = (f: ShieldFileForm): ShieldFile => {
    const base: ShieldFile = { path: f.path.trim(), mode: f.mode?.trim() || undefined };
    if (f.source === 'download') {
        return { ...base, download_url: f.download_url?.trim(), sha256: f.sha256?.trim() };
    }
    return {
        ...base,
        content: f.contentBase64 ?? textToBase64(f.contentText ?? ''),
        sha256: f.sha256?.trim() || undefined,
    };
};

const ShieldDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { project } = useProjectVariable();
    const { isDark } = useTheme();
    const [form] = Form.useForm<ShieldFormModel>();
    const admin = isShieldAdmin();
    const isCreateMode = id === 'create';

    const [saveError, setSaveError] = useState<string | null>(null);
    const [examplesOpen, setExamplesOpen] = useState(false);
    const [examplesTargetIdx, setExamplesTargetIdx] = useState<number | null>(null);

    const { data: policy, isLoading, isError: loadError, error: loadErrorObj } = useQuery({
        queryKey: ['shield-policy', id, project],
        queryFn: () => shieldApi.getPolicy(id!, project),
        enabled: !!project && !!id && !isCreateMode,
        retry: false,
    });

    const { createMutation, updateMutation, deleteMutation, isLoading: isMutating } =
        useShieldMutations(isCreateMode ? undefined : id, project);

    // Hydrate the form from the fetched policy (edit mode).
    useEffect(() => {
        if (policy) {
            form.setFieldsValue({
                name: policy.name,
                files: (policy.files ?? []).map(toFormFile),
            });
        }
    }, [policy, form]);

    const initialValues: ShieldFormModel = useMemo(
        () => ({ name: '', files: [{ path: '', source: 'inline', contentText: '' }] }),
        []
    );

    const handleSave = async () => {
        setSaveError(null);
        try {
            const values = await form.validateFields();

            // Cross-row checks the per-field rules can't express: duplicate paths
            // and the project-wide 3 MiB inline cap (backend rejects both; catching
            // them here gives instant feedback).
            const seen = new Map<string, number>();
            for (const [i, f] of values.files.entries()) {
                const clean = f.path.trim();
                if (seen.has(clean)) {
                    setSaveError(`Duplicate file path "${clean}" (rows ${seen.get(clean)! + 1} and ${i + 1}) — paths must be unique.`);
                    return;
                }
                seen.set(clean, i);
            }
            const inlineBytes = values.files.reduce((sum, f) => {
                if (f.source !== 'inline') return sum;
                if (f.contentBase64) return sum + base64ByteLength(f.contentBase64);
                return sum + new TextEncoder().encode(f.contentText ?? '').length;
            }, 0);
            if (inlineBytes > MAX_INLINE_BUNDLE_BYTES) {
                setSaveError(
                    `Total inline content is ${(inlineBytes / (1024 * 1024)).toFixed(1)} MiB — the project-wide cap is 3 MiB. ` +
                    'Switch large files to a Download URL.'
                );
                return;
            }

            const body: ShieldPolicyRequest = {
                name: values.name.trim(),
                project,
                files: values.files.map(toApiFile),
            };
            if (isCreateMode) {
                await createMutation.mutateAsync(body);
            } else {
                await updateMutation.mutateAsync(body);
            }
        } catch (err: unknown) {
            const e = err as { message?: string; errorFields?: unknown[] };
            if (e?.errorFields) return; // antd validation errors already shown inline
            setSaveError(e?.message || 'Save failed');
        }
    };

    const handleDelete = () => {
        confirm({
            title: 'Delete Shield Policy',
            icon: <ExclamationCircleOutlined />,
            content: (
                <span>
                    Are you sure you want to delete <b>{policy?.name ?? id}</b>?<br />
                    The remaining policies re-deploy to every connected edge. Deleting the
                    LAST policy pushes an explicit &quot;inspection off&quot; config (a true clear).
                </span>
            ),
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: () => deleteMutation.mutateAsync(),
        });
    };

    if (!isCreateMode && isLoading) {
        return <div style={{ textAlign: 'center', padding: 64 }}><Spin size="large" /></div>;
    }

    if (!isCreateMode && loadError) {
        return (
            <>
                <Space style={{ marginBottom: 16 }}>
                    <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/shield')}>Back to Shield Policies</Button>
                </Space>
                <Alert
                    type="error"
                    showIcon
                    message="Could not load the shield policy"
                    description={(loadErrorObj as Error)?.message || 'The policy may not exist in this project.'}
                    style={{ borderRadius: 8 }}
                />
            </>
        );
    }

    return (
        <>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Space>
                    <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/shield')} />
                    <SafetyOutlined style={{ color: 'var(--color-primary)', fontSize: 24 }} />
                    <Title level={4} style={{ margin: 0 }}>
                        {isCreateMode ? 'New Shield Policy' : `Shield Policy: ${policy?.name ?? ''}`}
                    </Title>
                    {!isCreateMode && policy && (
                        <Tag className='auto-width-tag' color="purple">v{policy.version}</Tag>
                    )}
                </Space>
                {admin && (
                    <Space>
                        {!isCreateMode && (
                            <Button danger icon={<DeleteOutlined />} loading={deleteMutation.isPending} onClick={handleDelete}>
                                Delete
                            </Button>
                        )}
                        <Button type="primary" icon={<SaveOutlined />} loading={isMutating} onClick={handleSave}>
                            {isCreateMode ? 'Create & Deploy' : 'Save & Deploy'}
                        </Button>
                    </Space>
                )}
            </div>

            {/* What does this do? */}
            <Alert
                message="How shield policies work"
                description={SHIELD_POLICY_INFO}
                type="info"
                showIcon
                icon={<InfoCircleOutlined />}
                closable
                style={{ marginBottom: 16, borderRadius: 8 }}
            />

            {!admin && (
                <Alert
                    message="Read-only view"
                    description="Only Admin and Owner roles can create, edit, delete or deploy shield policies."
                    type="warning"
                    showIcon
                    style={{ marginBottom: 16, borderRadius: 8 }}
                />
            )}

            {saveError && (
                <Alert
                    message="Could not save the policy"
                    description={<span style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: 12 }}>{saveError}</span>}
                    type="error"
                    showIcon
                    closable
                    onClose={() => setSaveError(null)}
                    style={{ marginBottom: 16, borderRadius: 8 }}
                />
            )}

            <Form<ShieldFormModel>
                form={form}
                layout="vertical"
                initialValues={initialValues}
                disabled={!admin}
            >
                <Card style={{ borderRadius: 12, marginBottom: 16 }}>
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="name"
                                label={shieldFieldHelp.name.label}
                                tooltip={{ title: shieldFieldHelp.name.tooltip, icon: <InfoCircleOutlined /> }}
                                extra={shieldFieldHelp.name.extra}
                                rules={shieldFieldHelp.name.rules}
                            >
                                <Input placeholder={shieldFieldHelp.name.placeholder} disabled={!admin || !isCreateMode} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                <Form.List name="files">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <Card
                                    key={key}
                                    size="small"
                                    style={{ marginBottom: 12, borderRadius: 12 }}
                                    title={
                                        <Space>
                                            <FileAddOutlined />
                                            <Form.Item noStyle shouldUpdate>
                                                {() => {
                                                    const p = form.getFieldValue(['files', name, 'path']);
                                                    return <Text strong>{p || `File #${name + 1}`}</Text>;
                                                }}
                                            </Form.Item>
                                        </Space>
                                    }
                                    extra={admin && fields.length > 1 && (
                                        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)} />
                                    )}
                                >
                                    <Row gutter={16}>
                                        <Col xs={24} sm={10}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'path']}
                                                label={shieldFieldHelp.path.label}
                                                tooltip={{ title: shieldFieldHelp.path.tooltip, icon: <InfoCircleOutlined /> }}
                                                extra={shieldFieldHelp.path.extra}
                                                rules={shieldFieldHelp.path.rules}
                                                required
                                            >
                                                <Input placeholder={shieldFieldHelp.path.placeholder} style={{ fontFamily: 'monospace' }} />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={8}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'source']}
                                                label={shieldFieldHelp.source.label}
                                                tooltip={{ title: shieldFieldHelp.source.tooltip, icon: <InfoCircleOutlined /> }}
                                            >
                                                <Radio.Group
                                                    options={[
                                                        { label: 'Inline', value: 'inline' },
                                                        { label: 'Download URL', value: 'download' },
                                                    ]}
                                                    optionType="button"
                                                    buttonStyle="solid"
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={6}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'mode']}
                                                label={shieldFieldHelp.mode.label}
                                                tooltip={{ title: shieldFieldHelp.mode.tooltip, icon: <InfoCircleOutlined /> }}
                                                extra={shieldFieldHelp.mode.extra}
                                                rules={shieldFieldHelp.mode.rules}
                                            >
                                                {/* AutoComplete (not Select): presets PLUS any custom octal like 0700 */}
                                                <AutoComplete
                                                    options={MODE_PRESETS}
                                                    placeholder={shieldFieldHelp.mode.placeholder}
                                                    allowClear
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Form.Item noStyle shouldUpdate>
                                        {() => {
                                            const source = form.getFieldValue(['files', name, 'source']);
                                            const path = form.getFieldValue(['files', name, 'path']);
                                            const b64 = form.getFieldValue(['files', name, 'contentBase64']);

                                            if (source === 'download') {
                                                return (
                                                    <Row gutter={16}>
                                                        <Col xs={24} sm={14}>
                                                            <Form.Item
                                                                {...restField}
                                                                name={[name, 'download_url']}
                                                                label={shieldFieldHelp.download_url.label}
                                                                tooltip={{ title: shieldFieldHelp.download_url.tooltip, icon: <InfoCircleOutlined /> }}
                                                                extra={shieldFieldHelp.download_url.extra}
                                                                rules={shieldFieldHelp.download_url.rules}
                                                                required
                                                            >
                                                                <Input placeholder={shieldFieldHelp.download_url.placeholder} style={{ fontFamily: 'monospace' }} />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col xs={24} sm={10}>
                                                            <Form.Item
                                                                {...restField}
                                                                name={[name, 'sha256']}
                                                                label={shieldFieldHelp.sha256.label}
                                                                tooltip={{ title: shieldFieldHelp.sha256.tooltip, icon: <InfoCircleOutlined /> }}
                                                                extra={shieldFieldHelp.sha256.extra}
                                                                rules={[
                                                                    { required: true, message: 'SHA-256 is required for downloads (the fetch is verified against it)' },
                                                                    ...shieldFieldHelp.sha256.rules,
                                                                ]}
                                                            >
                                                                <Input placeholder={shieldFieldHelp.sha256.placeholder} style={{ fontFamily: 'monospace' }} />
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                );
                                            }

                                            if (b64) {
                                                return (
                                                    <Alert
                                                        type="info"
                                                        showIcon
                                                        style={{ marginBottom: 8, borderRadius: 8 }}
                                                        message={`Binary content (${(base64ByteLength(b64) / 1024).toFixed(1)} KB) — uploaded file, not editable inline`}
                                                        action={admin && (
                                                            <Button size="small" danger onClick={() => {
                                                                const files = form.getFieldValue('files');
                                                                files[name] = { ...files[name], contentBase64: undefined, contentText: '' };
                                                                form.setFieldsValue({ files: [...files] });
                                                            }}>
                                                                Clear
                                                            </Button>
                                                        )}
                                                    />
                                                );
                                            }

                                            return (
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'contentText']}
                                                    label={
                                                        <Space>
                                                            {shieldFieldHelp.content.label}
                                                            {admin && (
                                                                <>
                                                                    <Button
                                                                        size="small"
                                                                        type="link"
                                                                        onClick={() => { setExamplesTargetIdx(name); setExamplesOpen(true); }}
                                                                    >
                                                                        Examples / Templates
                                                                    </Button>
                                                                    <Upload
                                                                        showUploadList={false}
                                                                        beforeUpload={(file) => {
                                                                            if (file.size > MAX_INLINE_BUNDLE_BYTES) {
                                                                                setSaveError(
                                                                                    `"${file.name}" is ${(file.size / (1024 * 1024)).toFixed(1)} MiB — inline content is capped at 3 MiB per project. ` +
                                                                                    'Host the file and use a Download URL instead.'
                                                                                );
                                                                                return false;
                                                                            }
                                                                            const reader = new FileReader();
                                                                            reader.onload = (e) => {
                                                                                const b64u = Base64FromBytes(e.target?.result as ArrayBuffer);
                                                                                const text = tryDecodeText(b64u);
                                                                                const files = form.getFieldValue('files');
                                                                                files[name] = text !== null
                                                                                    ? { ...files[name], contentText: text, contentBase64: undefined }
                                                                                    : { ...files[name], contentBase64: b64u, contentText: undefined };
                                                                                form.setFieldsValue({ files: [...files] });
                                                                            };
                                                                            reader.readAsArrayBuffer(file);
                                                                            return false;
                                                                        }}
                                                                    >
                                                                        <Button size="small" type="link" icon={<UploadOutlined />}>Upload</Button>
                                                                    </Upload>
                                                                </>
                                                            )}
                                                        </Space>
                                                    }
                                                    tooltip={{ title: shieldFieldHelp.content.tooltip, icon: <InfoCircleOutlined /> }}
                                                    extra={shieldFieldHelp.content.extra}
                                                    required
                                                    rules={[{ required: true, message: 'Inline content is required (or switch the source to Download URL)' }]}
                                                    valuePropName="value"
                                                    getValueFromEvent={(v: string | undefined) => v ?? ''}
                                                >
                                                    <MonacoEditor
                                                        height="340px"
                                                        language={editorLanguage(path)}
                                                        theme={isDark ? 'vs-dark' : 'light'}
                                                        options={{
                                                            minimap: { enabled: false },
                                                            fontSize: 13,
                                                            lineNumbers: 'on',
                                                            scrollBeyondLastLine: false,
                                                            automaticLayout: true,
                                                            tabSize: 2,
                                                            insertSpaces: true,
                                                            wordWrap: 'on',
                                                            folding: true,
                                                            readOnly: !admin,
                                                        }}
                                                    />
                                                </Form.Item>
                                            );
                                        }}
                                    </Form.Item>
                                </Card>
                            ))}
                            {admin && (
                                <Button
                                    type="dashed"
                                    onClick={() => add({ path: '', source: 'inline', contentText: '' })}
                                    block
                                    icon={<PlusOutlined />}
                                    style={{ marginBottom: 24 }}
                                >
                                    Add File
                                </Button>
                            )}
                        </>
                    )}
                </Form.List>
            </Form>

            <ShieldExamplesDrawer
                open={examplesOpen}
                onClose={() => setExamplesOpen(false)}
                onUseTemplate={(content) => {
                    if (examplesTargetIdx !== null) {
                        const files = form.getFieldValue('files');
                        files[examplesTargetIdx] = { ...files[examplesTargetIdx], contentText: content, contentBase64: undefined };
                        form.setFieldsValue({ files: [...files] });
                    }
                    setExamplesOpen(false);
                }}
            />
        </>
    );
};

export default ShieldDetail;
