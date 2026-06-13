/**
 * Shield policy editor — a structured POLICY BUILDER. The user composes the
 * policy with components (domains, routes, protections); the YAML config file,
 * its path, hash and mode are all generated automatically. Tabs: Builder
 * (forms) | YAML (two-way) | Data Files (supporting artifacts, auto-hashed).
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Badge,
    Button,
    Collapse,
    Input,
    Modal,
    Select,
    Space,
    Spin,
    Tabs,
    Tag,
    Tooltip,
    Typography,
} from 'antd';
import {
    ArrowLeftOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
    FileTextOutlined,
    InfoCircleOutlined,
    SafetyOutlined,
    SaveOutlined,
    UndoOutlined,
    RedoOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { shieldApi } from './shieldApi';
import { useShieldMutations } from './hooks/useShieldMutations';
import { isShieldAdmin } from './utils';
import { PolicyEditorProvider, usePolicyEditor } from './state/policyStore';
import { fromApi, toApi, configPathForName } from './utils/bundleAdapter';
import { yamlToModel, collectInvalidValues } from './utils/policyYaml';
import { collectEngineProblems } from './engines/validation';
import { FieldShell } from './engines/fields';
import PolicySettings from './components/builder/PolicySettings';
import EnginePanel from './components/builder/EnginePanel';
import DomainsEditor from './components/builder/DomainsEditor';
import Section from './components/builder/Section';
import YamlTab from './components/YamlTab';
import DataFilesTab from './components/DataFilesTab';
import DryRunTab from './components/DryRunTab';
import ShieldExamplesDrawer from './components/ShieldExamplesDrawer';

const { Title, Text } = Typography;
const { confirm } = Modal;

const ShieldDetailInner: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { project } = useProjectVariable();
    const admin = isShieldAdmin();
    const isCreateMode = id === 'create';

    const { state, dispatch, pendingYamlRef } = usePolicyEditor();
    const [name, setName] = useState('');
    const [saveError, setSaveError] = useState<string | null>(null);
    const [examplesOpen, setExamplesOpen] = useState(false);

    // Warn before the browser unloads (close/reload/external nav) with unsaved
    // edits. In-app navigation away is guarded by the Back button's confirm.
    useEffect(() => {
        if (!(state.dirty && admin)) return;
        const handler = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = '';
        };
        window.addEventListener('beforeunload', handler);
        return () => window.removeEventListener('beforeunload', handler);
    }, [state.dirty, admin]);

    const { data: policy, isLoading, isError: loadError, error: loadErrorObj } = useQuery({
        queryKey: ['shield-policy', id, project],
        queryFn: () => shieldApi.getPolicy(id!, project),
        enabled: !!project && !!id && !isCreateMode,
        retry: false,
    });

    const { createMutation, updateMutation, deleteMutation, isLoading: isMutating } =
        useShieldMutations(isCreateMode ? undefined : id, project);

    // Hydrate the editor from the fetched policy.
    useEffect(() => {
        if (policy) {
            setName(policy.name);
            const hydrated = fromApi(policy);
            dispatch({
                type: 'HYDRATE',
                state: {
                    model: hydrated.model,
                    dataFiles: hydrated.dataFiles,
                    yamlMode: hydrated.yamlMode,
                    rawYaml: hydrated.rawYaml,
                    yamlModeReason: hydrated.yamlModeReason,
                    dirty: false,
                },
            });
        }
    }, [policy, dispatch]);

    const defaults = state.model.spec.defaults ?? {};
    const domains = state.model.spec.domains ?? [];
    const exclude = state.model.spec.exclude ?? [];

    const handleSave = async () => {
        setSaveError(null);
        const trimmed = name.trim();
        if (!trimmed) {
            setSaveError('Policy name is required.');
            return;
        }

        // Flush any un-applied YAML-tab edit so the last keystrokes aren't dropped
        // by the editor's debounce. Compute the EFFECTIVE state to save from.
        let effYamlMode = state.yamlMode;
        let effRawYaml = state.rawYaml;
        let effModel = state.model;
        const pending = pendingYamlRef.current;
        if (pending !== null) {
            const parsed = yamlToModel(pending);
            if (parsed.errors.length > 0) {
                setSaveError(`Fix the YAML parse error before saving — ${parsed.errors[0]}`);
                return;
            }
            if (parsed.unsupportedPaths.length > 0) {
                effYamlMode = true;
                effRawYaml = pending;
                dispatch({ type: 'ENTER_YAML_MODE', rawYaml: pending, reason: parsed.unsupportedPaths.map(p => `Unsupported field: ${p}`) });
            } else {
                effYamlMode = false;
                effRawYaml = '';
                effModel = parsed.model!;
                if (state.yamlMode) dispatch({ type: 'EXIT_YAML_MODE', model: parsed.model! });
                else dispatch({ type: 'PATCH', update: () => parsed.model! });
            }
            pendingYamlRef.current = null;
        }

        if (!effYamlMode) {
            const effDomains = effModel.spec.domains ?? [];
            if (effDomains.length === 0) {
                setSaveError('Add at least one domain — without domains the policy protects nothing.');
                return;
            }
            if (effDomains.some(d => !d.hosts || d.hosts.length === 0)) {
                setSaveError('Every domain needs at least one host (use * to match any host).');
                return;
            }
        }
        // Block invalid configs before they reach the edge, where shield
        // strict-decode would reject the whole document: a YAML parse error, or a
        // known-enum field carrying a bad value (e.g. fail_mode: fail_opent).
        const invalid = (() => {
            if (effYamlMode) {
                const parsed = yamlToModel(effRawYaml);
                if (parsed.errors.length > 0) return [`YAML parse error — ${parsed.errors[0]}`];
                return parsed.invalidValues;
            }
            return collectInvalidValues(effModel);
        })();
        if (invalid.length > 0) {
            setSaveError(`Fix this before saving — ${invalid[0]}`);
            return;
        }
        // Block engines that can't function (missing required fields) — the edge
        // would strict-reject them with an opaque error otherwise.
        if (!effYamlMode) {
            const engineProblems = collectEngineProblems(effModel);
            if (engineProblems.length > 0) {
                setSaveError(
                    engineProblems.length === 1
                        ? `Fix this before saving — ${engineProblems[0]}`
                        : `Fix ${engineProblems.length} engine issues before saving — e.g. ${engineProblems[0]}`,
                );
                return;
            }
        }
        try {
            const body = toApi({
                name: trimmed,
                project,
                model: { ...effModel, metadata: { ...(effModel.metadata ?? {}), name: trimmed } },
                yamlMode: effYamlMode,
                rawYaml: effRawYaml,
                dataFiles: state.dataFiles,
            });
            if (isCreateMode) {
                await createMutation.mutateAsync(body);
            } else {
                await updateMutation.mutateAsync(body);
            }
            dispatch({ type: 'MARK_SAVED' });
        } catch (err: unknown) {
            setSaveError((err as Error)?.message || 'Save failed');
        }
    };

    const handleBack = () => {
        if (state.dirty && admin) {
            confirm({
                title: 'Discard unsaved changes?',
                icon: <ExclamationCircleOutlined />,
                content: 'Your edits have not been saved or deployed.',
                okText: 'Discard',
                okType: 'danger',
                onOk: () => navigate('/shield'),
            });
            return;
        }
        navigate('/shield');
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

    const useTemplate = (content: string) => {
        const parsed = yamlToModel(content);
        if (parsed.errors.length === 0 && parsed.unsupportedPaths.length === 0 && parsed.model) {
            dispatch({ type: 'PATCH', update: () => parsed.model! });
        } else if (parsed.errors.length === 0) {
            dispatch({ type: 'ENTER_YAML_MODE', rawYaml: content, reason: parsed.unsupportedPaths });
        }
        setExamplesOpen(false);
    };

    const builderDisabled = !admin || state.yamlMode;

    const builderTab = useMemo(() => (
        <>
            {state.yamlMode && (
                <Alert
                    type="warning"
                    showIcon
                    style={{ marginBottom: 12, borderRadius: 8 }}
                    message="This policy is managed as raw YAML"
                    description="It contains content the builder can't represent — edit it in the YAML tab (the reasons are listed there)."
                />
            )}

            <Section
                title="Policy Defaults"
                extra={
                    <Tooltip title="These apply to every domain/route below unless a route overrides them.">
                        <InfoCircleOutlined style={{ color: 'var(--color-primary)' }} />
                    </Tooltip>
                }
            >
                <PolicySettings
                    variant="defaults"
                    policy={defaults}
                    disabled={builderDisabled}
                    onChange={p => dispatch({ type: 'PATCH', update: m => ({ ...m, spec: { ...m.spec, defaults: p } }) })}
                />
                <Collapse
                    size="small"
                    ghost
                    items={[{
                        key: 'default-engines',
                        label: <Text type="secondary" style={{ fontSize: 12 }}>Default protections (apply to every route)</Text>,
                        children: (
                            <EnginePanel
                                policy={defaults}
                                disabled={builderDisabled}
                                dataFiles={state.dataFiles}
                                onChange={p => dispatch({ type: 'PATCH', update: m => ({ ...m, spec: { ...m.spec, defaults: p } }) })}
                            />
                        ),
                    }]}
                />
                <div style={{ marginTop: 4 }}>
                    <FieldShell
                        label="Bypass paths"
                        tooltip="Request paths that bypass ALL inspection (checked before policy resolution). Use for health checks, metrics scrapes, static assets. Absolute paths, exact match, query ignored."
                    >
                        <Select
                            size="small"
                            mode="tags"
                            style={{ width: '100%' }}
                            placeholder="/healthz, /metrics"
                            disabled={builderDisabled}
                            value={exclude}
                            tokenSeparators={[',', ' ']}
                            options={[]}
                            onChange={(v: string[]) => dispatch({
                                type: 'PATCH',
                                update: m => ({ ...m, spec: { ...m.spec, exclude: v.length ? v : undefined } }),
                            })}
                        />
                    </FieldShell>
                </div>
            </Section>

            <DomainsEditor
                domains={domains}
                disabled={builderDisabled}
                dataFiles={state.dataFiles}
                onChange={d => dispatch({ type: 'PATCH', update: m => ({ ...m, spec: { ...m.spec, domains: d } }) })}
            />
        </>
    ), [state.yamlMode, state.dataFiles, defaults, domains, exclude, builderDisabled, dispatch]);

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
            {/* Top bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <Space>
                    <Button icon={<ArrowLeftOutlined />} onClick={handleBack} />
                    <SafetyOutlined style={{ color: 'var(--color-primary)', fontSize: 24 }} />
                    {isCreateMode ? (
                        <Input
                            placeholder="policy name (e.g. api-public)"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            style={{ width: 280, fontWeight: 600 }}
                            disabled={!admin}
                        />
                    ) : (
                        <Title level={4} style={{ margin: 0 }}>{policy?.name ?? ''}</Title>
                    )}
                    {!isCreateMode && policy && <Tag className='auto-width-tag' color="purple">v{policy.version}</Tag>}
                    {name.trim() && (
                        <Tooltip title="The generated config file synced to every edge in this project.">
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                <FileTextOutlined /> {configPathForName(name)}
                            </Text>
                        </Tooltip>
                    )}
                    {state.dirty && admin && <Tag className='auto-width-tag' color="orange">unsaved</Tag>}
                </Space>
                <Space>
                    {admin && (
                        <>
                            <Tooltip title="Undo"><Button icon={<UndoOutlined />} disabled={state.past.length === 0} onClick={() => dispatch({ type: 'UNDO' })} /></Tooltip>
                            <Tooltip title="Redo"><Button icon={<RedoOutlined />} disabled={state.future.length === 0} onClick={() => dispatch({ type: 'REDO' })} /></Tooltip>
                            <Button onClick={() => setExamplesOpen(true)}>Templates</Button>
                            {!isCreateMode && (
                                <Button danger icon={<DeleteOutlined />} loading={deleteMutation.isPending} onClick={handleDelete}>
                                    Delete
                                </Button>
                            )}
                            <Button type="primary" icon={<SaveOutlined />} loading={isMutating} onClick={handleSave}>
                                {isCreateMode ? 'Create & Deploy' : 'Save & Deploy'}
                            </Button>
                        </>
                    )}
                </Space>
            </div>

            {!admin && (
                <Alert
                    type="warning"
                    showIcon
                    message="Read-only view"
                    description="Only Admin and Owner roles can create, edit, delete or deploy shield policies."
                    style={{ marginBottom: 12, borderRadius: 8 }}
                />
            )}

            {saveError && (
                <Alert
                    type="error"
                    showIcon
                    closable
                    onClose={() => setSaveError(null)}
                    message="Could not save the policy"
                    description={<span style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: 12 }}>{saveError}</span>}
                    style={{ marginBottom: 12, borderRadius: 8 }}
                />
            )}

            <Tabs
                defaultActiveKey="builder"
                items={[
                    {
                        key: 'builder',
                        label: 'Builder',
                        children: builderTab,
                    },
                    {
                        key: 'yaml',
                        label: state.yamlMode ? <Badge dot><span>YAML</span></Badge> : 'YAML',
                        children: <YamlTab disabled={!admin} />,
                    },
                    {
                        key: 'files',
                        label: (
                            <span>
                                Data Files{state.dataFiles.length > 0 && <Tag className='auto-width-tag' style={{ marginLeft: 6 }}>{state.dataFiles.length}</Tag>}
                            </span>
                        ),
                        children: <DataFilesTab disabled={!admin} />,
                    },
                    {
                        key: 'test',
                        label: 'Test',
                        children: <DryRunTab />,
                    },
                ]}
            />

            <ShieldExamplesDrawer
                open={examplesOpen}
                onClose={() => setExamplesOpen(false)}
                onUseTemplate={useTemplate}
            />
        </>
    );
};

const ShieldDetail: React.FC = () => (
    <PolicyEditorProvider>
        <ShieldDetailInner />
    </PolicyEditorProvider>
);

export default ShieldDetail;
