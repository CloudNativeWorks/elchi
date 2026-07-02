/**
 * Shield policy editor — a structured POLICY BUILDER. The user composes the
 * policy with components (domains, routes, protections); the YAML config file,
 * its path, hash and mode are all generated automatically. Tabs: Builder
 * (forms) | YAML (two-way) | Data Files (supporting artifacts, auto-hashed).
 */

import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Badge,
    Button,
    Input,
    Modal,
    Space,
    Spin,
    Tabs,
    Tag,
    Tooltip,
    Typography,
    message,
} from 'antd';
import {
    ArrowLeftOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
    FileTextOutlined,
    SafetyOutlined,
    SaveOutlined,
    UndoOutlined,
    RedoOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { shieldApi } from './shieldApi';
import { useShieldMutations } from './hooks/useShieldMutations';
import { isShieldAdmin } from './utils';
import { PolicyEditorProvider, usePolicyEditor } from './state/policyStore';
import { fromApi, toApi, configPathForName } from './utils/bundleAdapter';
import { yamlToModel, collectInvalidValues } from './utils/policyYaml';
import { collectEngineProblems } from './engines/validation';
import PolicyBuilder from './components/builder/PolicyBuilder';
import YamlTab from './components/YamlTab';
import DataFilesTab from './components/DataFilesTab';
import DryRunTab from './components/DryRunTab';
import ShieldExamplesDrawer from './components/ShieldExamplesDrawer';
import SuggestionRationalePanel from './components/SuggestionRationalePanel';
import ImportFromDiscoveryDrawer from './components/ImportFromDiscoveryDrawer';
import { suggestPolicyFromEndpoints, mergeDiscoveryIntoModel, popDiscoveryDraft, type DiscoveryDraft, type SuggestRationale } from './utils/suggestPolicy';

// A discovery suggestion is handed over either as a sessionStorage key (large
// drafts avoid the history.pushState size cap) or, as a fallback, inline in the
// router state. Read whichever is present.
const readDiscoveryDraft = (state: unknown): DiscoveryDraft | null => {
    const s = state as { discoveryDraftKey?: string; discoveryDraft?: DiscoveryDraft } | null;
    return popDiscoveryDraft(s?.discoveryDraftKey) ?? s?.discoveryDraft ?? null;
};

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
    const [rationale, setRationale] = useState<SuggestRationale[] | null>(null);
    const [importOpen, setImportOpen] = useState(false);
    const location = useLocation();
    // A discovery draft (router state) is applied exactly once per navigation.
    const draftAppliedRef = useRef(false);
    // Which policy id the editor has already hydrated, so a background refetch of
    // `policy` does NOT re-HYDRATE and wipe unsaved (incl. just-merged) edits.
    const hydratedIdRef = useRef<string | null>(null);

    // "Import from Discovery": suggest protections for the picked endpoints and
    // graft the resulting routes/engines onto the policy currently being edited.
    // Throws on failure so the drawer keeps itself open for a retry.
    const handleImportFromDiscovery = async (endpointIds: string[]) => {
        try {
            const draft = await suggestPolicyFromEndpoints(endpointIds, project);
            if (!draft?.yaml) {
                message.error('No suggestion was returned for the selected endpoints');
                return;
            }
            const parsed = yamlToModel(draft.yaml);
            if (parsed.model && parsed.errors.length === 0 && parsed.unsupportedPaths.length === 0) {
                dispatch({ type: 'PATCH', update: (cur) => mergeDiscoveryIntoModel(cur, parsed.model!) });
                setRationale(draft.rationale || []);
                message.success(`Added protections for ${draft.rationale?.length ?? 0} endpoint(s)`);
            } else {
                message.error('Could not merge the suggested protections (unsupported fields)');
            }
        } catch (e: any) {
            message.error(e?.response?.data?.error || 'Failed to build a suggested policy');
            throw e;
        }
    };

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

    // Hydrate the editor from the fetched policy. When the user arrived here to
    // ADD an API-Discovery suggestion to this EXISTING policy (router state), the
    // draft's routes/engines are merged onto the just-hydrated model (the PATCH
    // updater runs after HYDRATE, so it sees the loaded policy).
    useEffect(() => {
        // Hydrate ONCE per policy id. A later refetch of the same policy (query
        // invalidation etc.) must not re-HYDRATE and discard unsaved Builder edits.
        if (policy && hydratedIdRef.current !== id) {
            hydratedIdRef.current = id ?? null;
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

            const draft = readDiscoveryDraft(location.state);
            if (draft && !draftAppliedRef.current) {
                draftAppliedRef.current = true;
                const parsed = yamlToModel(draft.yaml);
                if (hydrated.yamlMode || !hydrated.model) {
                    message.error('This policy is in raw-YAML mode — switch it to the Builder before importing suggestions.');
                } else if (parsed.model && parsed.errors.length === 0 && parsed.unsupportedPaths.length === 0) {
                    dispatch({ type: 'PATCH', update: (cur) => mergeDiscoveryIntoModel(cur, parsed.model!) });
                    setRationale(draft.rationale || []);
                    message.success(`Added protections for ${draft.rationale?.length ?? 0} endpoint(s) — review & save`);
                } else {
                    message.error('Could not merge the suggested protections');
                }
                // Clear the router state (window.history.replaceState does NOT update
                // React Router's location.state) so a remount can't re-apply the draft.
                navigate(location.pathname, { replace: true, state: null });
            }
        }
    }, [policy, id, dispatch, location.pathname, location.state, navigate]);

    // Hydrate from an API-Discovery suggestion handed over via router state
    // (create mode only). The draft is a normal policy YAML produced by the
    // backend's findings→engines mapper; it flows through the same parse path as
    // a template. The rationale is shown above the Builder. Cleared from history
    // so a refresh doesn't re-apply it.
    useEffect(() => {
        if (!isCreateMode) return;
        const draft = readDiscoveryDraft(location.state);
        if (!draft || draftAppliedRef.current) return;
        draftAppliedRef.current = true;
        setName(draft.policy_name || '');
        setRationale(draft.rationale || []);
        const parsed = yamlToModel(draft.yaml);
        if (parsed.errors.length === 0 && parsed.unsupportedPaths.length === 0 && parsed.model) {
            dispatch({ type: 'PATCH', update: () => parsed.model! });
        } else if (parsed.errors.length === 0) {
            dispatch({ type: 'ENTER_YAML_MODE', rawYaml: draft.yaml, reason: parsed.unsupportedPaths });
        }
        // Clear router state through React Router (window.history.replaceState leaves
        // location.state intact) so a remount can't re-apply the draft.
        navigate(location.pathname, { replace: true, state: null });
    }, [isCreateMode, location.pathname, location.state, dispatch, navigate]);

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

    const builderTab = (
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
            <PolicyBuilder disabled={builderDisabled} />
        </>
    );

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
                            <Button icon={<SafetyOutlined />} onClick={() => setImportOpen(true)} disabled={state.yamlMode}>
                                Import from Discovery
                            </Button>
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

            {rationale && <SuggestionRationalePanel rationale={rationale} onDismiss={() => setRationale(null)} />}

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
            <ImportFromDiscoveryDrawer
                open={importOpen}
                onClose={() => setImportOpen(false)}
                onImport={handleImportFromDiscovery}
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
