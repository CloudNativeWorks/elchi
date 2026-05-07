/**
 * WAF Configuration Detail Page (redesigned)
 *
 * Two-pane layout: sidebar (sets, library, advanced) + main editor with tabs
 * (Editor / Live .conf / Test / History). State lives in WafEditorProvider.
 *
 * The page mirrors the legacy backend shape on save via wafAdapter; once the
 * §3.1 backend migration ships, the adapter shrinks to a passthrough.
 */

import React, { useEffect, useState } from 'react';
import { Alert, Modal, Spin, App as AntApp } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { useProjectVariable } from '@/hooks/useProjectVariable';
import { wafApi, WafConfigError } from './wafApi';
import { useWafMutations } from './hooks/useWafMutations';

import { WafEditorProvider, useWafEditor } from './state/wafEditorStore';
import { normalizeFromApi, serializeToApi } from './utils/wafAdapter';
import { useWafKeyboard } from './hooks/useWafKeyboard';

import WafShell from './components/layout/WafShell';
import WafTopBar from './components/layout/WafTopBar';
import WafSidebar from './components/layout/WafSidebar';
import WafMainTabs from './components/layout/WafMainTabs';

import DirectiveEditor from './components/editor/DirectiveEditor';
import ConfPreviewPane from './components/conf-preview/ConfPreviewPane';
import OverviewPane from './components/overview/OverviewPane';
import HistoryPane from './components/history/HistoryPane';
import AdvancedDrawer from './components/advanced/AdvancedDrawer';
import CrsLibraryDrawer from './components/crs-library/CrsLibraryDrawer';
import CrsSetupDrawer from './components/crs-setup/CrsSetupDrawer';
import HowToDrawer from './components/howto/HowToDrawer';
import PresetPickerModal from './components/presets/PresetPickerModal';
import TemplateBuilderDrawer from './components/TemplateBuilderDrawer';

const { confirm } = Modal;

const WafDetailInner: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { project } = useProjectVariable();
    const isCreateMode = id === 'create';
    const { message } = AntApp.useApp();

    const { state, dispatch, getState } = useWafEditor();

    const [libraryOpen, setLibraryOpen] = useState(false);
    const [setupOpen, setSetupOpen] = useState(false);
    const [howToOpen, setHowToOpen] = useState(false);
    const [advancedOpen, setAdvancedOpen] = useState(false);
    const [templateOpen, setTemplateOpen] = useState(false);
    const [presetOpen, setPresetOpen] = useState(isCreateMode);

    // Fetch WAF config for edit mode
    const { data: wafConfig, isLoading, error } = useQuery({
        queryKey: ['waf-config', id, project],
        queryFn: () => wafApi.getWafConfig(id!, project),
        enabled: !isCreateMode && !!id && !!project,
    });

    // Hydrate editor state when config loads (or when entering create mode).
    //
    // Two guards:
    //   1. Skip hydration if the editor is dirty. React-Query refetches on
    //      window focus / cache invalidation could otherwise overwrite the
    //      user's in-progress edits with stale server data.
    //   2. Preserve the active set across hydrate by matching by NAME, since
    //      hydration always assigns fresh client IDs. Without this, every
    //      successful save bounces the user back to the default set.
    useEffect(() => {
        if (isCreateMode) {
            // Only hydrate the empty editor once on mount; don't keep wiping
            // it on subsequent renders.
            const current = getState();
            if (current.editor.sets.length === 0 && current.editor.name === '') {
                dispatch({ type: 'HYDRATE', state: normalizeFromApi(null) });
            }
            return;
        }
        if (!wafConfig) return;
        const current = getState();
        if (current.ui.dirty) return; // user has unsaved work — don't blow it away

        const previousActiveName = current.ui.activeSetId
            ? current.editor.sets.find((s) => s.id === current.ui.activeSetId)?.name
            : undefined;

        const next = normalizeFromApi(wafConfig);
        dispatch({ type: 'HYDRATE', state: next });

        if (previousActiveName) {
            const matchedId = next.sets.find((s) => s.name === previousActiveName)?.id;
            if (matchedId) {
                // Restore selection on the next tick so HYDRATE's defaults land first.
                queueMicrotask(() => dispatch({ type: 'SELECT_SET', id: matchedId }));
            }
        }
    }, [wafConfig, isCreateMode, dispatch, getState]);

    const { createMutation, updateMutation, deleteMutation, isLoading: isSaving } =
        useWafMutations(id, project);

    const handleSaveError = (e: unknown) => {
        if (e instanceof WafConfigError) {
            if (e.code === 'WAF_NAME_TAKEN') {
                message.error(`A WAF config with this name already exists in this project. Pick a different name.`);
                return;
            }
        }
        const msg = e instanceof Error ? e.message : 'Failed to save';
        message.error(msg);
    };

    const handleSave = () => {
        let payload;
        try {
            payload = serializeToApi(getState().editor, project);
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Failed to save';
            message.error(msg);
            return;
        }
        if (isCreateMode) {
            createMutation.mutate(payload, {
                onSuccess: () => dispatch({ type: 'CLEAR_DIRTY' }),
                onError: handleSaveError,
            });
        } else {
            updateMutation.mutate(payload, {
                onSuccess: () => dispatch({ type: 'CLEAR_DIRTY' }),
                onError: handleSaveError,
            });
        }
    };

    useWafKeyboard({ onSave: handleSave });

    const handleDelete = () => {
        confirm({
            title: 'Delete WAF Config',
            icon: <ExclamationCircleOutlined />,
            content: `Are you sure you want to delete "${wafConfig?.name}"?`,
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk() {
                deleteMutation.mutate(undefined, {
                    onError: (e) => {
                        if (e instanceof WafConfigError && e.code === 'WAF_IN_USE') {
                            const refs = e.references ?? [];
                            Modal.error({
                                title: 'Cannot delete — WAF is in use',
                                content: (
                                    <div>
                                        <p>
                                            This WAF is referenced by {refs.length} resource
                                            {refs.length === 1 ? '' : 's'}. Remove or update them first:
                                        </p>
                                        <ul style={{ margin: 0, paddingLeft: 20 }}>
                                            {refs.map((r) => (
                                                <li key={r.id}>
                                                    <code>{r.type}</code> · {r.name}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ),
                            });
                            return;
                        }
                        const msg = e instanceof Error ? e.message : 'Failed to delete';
                        message.error(msg);
                    },
                });
            },
        });
    };

    const activeSet = state.editor.sets.find((s) => s.id === state.ui.activeSetId);
    const editorTab = activeSet
        ? <DirectiveEditor onOpenTemplate={() => setTemplateOpen(true)} />
        : <OverviewPane />;

    if (isLoading) {
        return (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!isCreateMode && (error || !wafConfig)) {
        return (
            <Alert
                message="Error"
                description="Failed to load WAF configuration"
                type="error"
                showIcon
            />
        );
    }

    return (
        <div style={{ height: 'calc(100vh - 120px)', minHeight: 600, display: 'flex', flexDirection: 'column' }}>
            <WafShell
                header={
                    <WafTopBar
                        isCreateMode={isCreateMode}
                        isSaving={isSaving}
                        onSave={handleSave}
                        onDelete={!isCreateMode ? handleDelete : undefined}
                        onOpenHistory={
                            !isCreateMode
                                ? () => dispatch({ type: 'SET_ACTIVE_TAB', tab: 'history' })
                                : undefined
                        }
                    />
                }
                sidebar={
                    <WafSidebar
                        onOpenOverview={() => dispatch({ type: 'SELECT_SET', id: null })}
                        onOpenLibrary={() => setLibraryOpen(true)}
                        onOpenAdvanced={() => setAdvancedOpen(true)}
                        onOpenCrsSetup={() => setSetupOpen(true)}
                        onOpenHowTo={() => setHowToOpen(true)}
                    />
                }
                main={
                    <WafMainTabs
                        editor={editorTab}
                        preview={<ConfPreviewPane />}
                        history={
                            !isCreateMode && id ? (
                                <HistoryPane configId={id} currentConfig={wafConfig ?? undefined} />
                            ) : undefined
                        }
                    />
                }
            />

            <CrsLibraryDrawer open={libraryOpen} onClose={() => setLibraryOpen(false)} />
            <CrsSetupDrawer open={setupOpen} onClose={() => setSetupOpen(false)} />
            <HowToDrawer open={howToOpen} onClose={() => setHowToOpen(false)} />
            <AdvancedDrawer open={advancedOpen} onClose={() => setAdvancedOpen(false)} />
            <TemplateBuilderDrawer
                visible={templateOpen}
                onClose={() => setTemplateOpen(false)}
                onAddDirective={(directive) => {
                    if (activeSet) {
                        dispatch({ type: 'ADD_DIRECTIVE', setId: activeSet.id, text: directive });
                    }
                    setTemplateOpen(false);
                }}
            />
            <PresetPickerModal
                open={presetOpen}
                onClose={() => setPresetOpen(false)}
                onPick={(preset) => {
                    setPresetOpen(false);
                    dispatch({
                        type: 'ADD_SET',
                        name: preset.setName,
                        directives: preset.directives,
                        markDefault: true,
                    });
                }}
            />
        </div>
    );
};

const WafDetail: React.FC = () => (
    <WafEditorProvider>
        <WafDetailInner />
    </WafEditorProvider>
);

// When the user actively interacts with the editor (selects a set, etc.),
// flip out of overview mode automatically. We watch this in WafDetailInner via
// a small bridge: when activeSetId changes from null -> defined, OverviewPane
// is hidden by clearing showOverview. The bridge below keeps the interface
// minimal; the parent already does the right thing because it derives from
// activeSet directly.
export default WafDetail;
