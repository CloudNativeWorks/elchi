import React, { useMemo, useState } from 'react';
import {
    Alert,
    App,
    Button,
    Drawer,
    Modal,
    Space,
    Tag,
    Tooltip,
    Typography,
} from 'antd';
import {
    AppstoreAddOutlined,
    CheckCircleFilled,
    EyeOutlined,
    PlusOutlined,
    SwapOutlined,
} from '@ant-design/icons';
import { useWafEditor } from '../../state/wafEditorStore';
import {
    PresetCategory,
    StarterPreset,
    STARTER_PRESETS,
} from '../../constants/starterPresets';

const { Text, Paragraph, Title } = Typography;

interface LoadPresetDrawerProps {
    open: boolean;
    onClose: () => void;
}

const CATEGORY_LABELS: Record<PresetCategory, { title: string; subtitle: string }> = {
    detect: {
        title: 'Detection-only',
        subtitle: 'Engine logs but never blocks. Use for tuning.',
    },
    block: {
        title: 'Blocking',
        subtitle: 'Engine actively rejects matched requests.',
    },
    utility: {
        title: 'Utility',
        subtitle: 'Build-your-own starting points.',
    },
};

/**
 * Pick a unique set name by appending `-2`, `-3`, etc. when the suggested
 * preset.setName already exists in the editor.
 */
const pickUniqueName = (base: string, existing: Set<string>): string => {
    if (!existing.has(base)) return base;
    for (let i = 2; i < 1000; i += 1) {
        const candidate = `${base}-${i}`;
        if (!existing.has(candidate)) return candidate;
    }
    return `${base}-${Date.now()}`;
};

const ModeBadge: React.FC<{ preset: StarterPreset }> = ({ preset }) => {
    if (preset.mode === 'None') {
        return <Tag style={{ marginInlineEnd: 0 }}>Empty</Tag>;
    }
    const color = preset.mode === 'On' ? 'red' : 'gold';
    return (
        <Tag color={color} style={{ marginInlineEnd: 0 }}>
            {preset.mode}
        </Tag>
    );
};

const ParanoiaBadge: React.FC<{ preset: StarterPreset }> = ({ preset }) => {
    if (preset.paranoiaLevel == null) return null;
    const tone =
        preset.paranoiaLevel === 4 ? 'volcano' : preset.paranoiaLevel === 2 ? 'orange' : 'blue';
    return (
        <Tag color={tone} style={{ marginInlineEnd: 0 }}>
            PL{preset.paranoiaLevel}
        </Tag>
    );
};

interface PresetCardProps {
    preset: StarterPreset;
    selected: boolean;
    onSelect: () => void;
}

const PresetCard: React.FC<PresetCardProps> = ({ preset, selected, onSelect }) => (
    <div
        role="button"
        tabIndex={0}
        onClick={onSelect}
        onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect();
            }
        }}
        style={{
            padding: '12px 14px',
            border: selected
                ? '1px solid var(--color-primary)'
                : '1px solid var(--border-default)',
            background: selected ? 'var(--color-primary-bg)' : 'var(--card-bg)',
            borderRadius: 8,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
            outline: 'none',
        }}
    >
        <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <Text strong style={{ fontSize: 13 }}>
                    {preset.name}
                </Text>
                <ModeBadge preset={preset} />
                <ParanoiaBadge preset={preset} />
                <Tag style={{ marginInlineEnd: 0 }}>
                    {preset.directives.length} directive{preset.directives.length === 1 ? '' : 's'}
                </Tag>
            </div>
            <Paragraph
                style={{ marginTop: 4, marginBottom: 0, fontSize: 12 }}
                type="secondary"
            >
                {preset.description}
            </Paragraph>
        </div>
        {selected && (
            <CheckCircleFilled
                style={{ color: 'var(--color-primary)', fontSize: 20, flexShrink: 0, marginTop: 2 }}
            />
        )}
    </div>
);

/**
 * Load template drawer — picks a preset and applies it to the WAF either
 * by replacing the active set's directives or by adding a new set.
 *
 * State lives entirely in component-local memory; the only redux dispatches
 * happen on apply. This makes it cheap to open and discard repeatedly.
 */
const LoadPresetDrawer: React.FC<LoadPresetDrawerProps> = ({ open, onClose }) => {
    const { state, dispatch } = useWafEditor();
    const { message } = App.useApp();

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [previewId, setPreviewId] = useState<string | null>(null);

    const groups = useMemo(() => {
        const map = new Map<PresetCategory, StarterPreset[]>();
        STARTER_PRESETS.forEach((p) => {
            const list = map.get(p.category) ?? [];
            list.push(p);
            map.set(p.category, list);
        });
        // Stable order for grouping
        return (['detect', 'block', 'utility'] as PresetCategory[])
            .map((c) => ({ category: c, presets: map.get(c) ?? [] }))
            .filter((g) => g.presets.length > 0);
    }, []);

    const selectedPreset = selectedId
        ? STARTER_PRESETS.find((p) => p.id === selectedId)
        : null;
    const previewPreset = previewId
        ? STARTER_PRESETS.find((p) => p.id === previewId)
        : null;

    const activeSet = state.editor.sets.find((s) => s.id === state.ui.activeSetId);
    const existingNames = new Set(state.editor.sets.map((s) => s.name));

    const closeAndReset = () => {
        setSelectedId(null);
        setPreviewId(null);
        onClose();
    };

    const applyAdd = () => {
        if (!selectedPreset) return;
        const name = pickUniqueName(selectedPreset.setName, existingNames);
        dispatch({
            type: 'ADD_SET',
            name,
            directives: selectedPreset.directives,
            // Don't bump default — adding extra modes shouldn't override
            // the user's existing default set.
            markDefault: false,
        });
        dispatch({ type: 'SET_ACTIVE_TAB', tab: 'editor' });
        message.success(`Added "${name}" from preset "${selectedPreset.name}"`);
        closeAndReset();
    };

    const performReplace = () => {
        if (!selectedPreset || !activeSet) return;
        dispatch({
            type: 'REPLACE_SET_DIRECTIVES',
            setId: activeSet.id,
            directives: selectedPreset.directives,
        });
        dispatch({ type: 'SELECT_SET', id: activeSet.id });
        dispatch({ type: 'SET_ACTIVE_TAB', tab: 'editor' });
        message.success(
            `Replaced "${activeSet.name}" with preset "${selectedPreset.name}" — undo with ⌘Z`,
        );
        closeAndReset();
    };

    const applyReplace = () => {
        if (!selectedPreset || !activeSet) return;
        // If the active set already has directives, ask for explicit confirm
        // — replacing is destructive of any custom edits the user made.
        if (activeSet.directives.length > 0) {
            Modal.confirm({
                title: `Replace directives in "${activeSet.name}"?`,
                content: (
                    <div style={{ fontSize: 13 }}>
                        <Paragraph style={{ marginBottom: 8 }}>
                            This swaps all <strong>{activeSet.directives.length}</strong>{' '}
                            current directive{activeSet.directives.length === 1 ? '' : 's'} for
                            the <strong>{selectedPreset.directives.length}</strong> directive
                            {selectedPreset.directives.length === 1 ? '' : 's'} from{' '}
                            <strong>{selectedPreset.name}</strong>.
                        </Paragraph>
                        <Paragraph style={{ marginBottom: 0, fontSize: 12 }} type="secondary">
                            The set name and id stay the same. You can undo with ⌘Z right after.
                        </Paragraph>
                    </div>
                ),
                okText: 'Replace',
                okType: 'danger',
                onOk: performReplace,
            });
        } else {
            performReplace();
        }
    };

    const replaceDisabled = !selectedPreset || !activeSet;
    const replaceDisabledReason = !selectedPreset
        ? 'Pick a template first'
        : !activeSet
            ? 'No active set — use "Add as new set" instead'
            : '';

    return (
        <Drawer
            title={
                <span>
                    <AppstoreAddOutlined style={{ marginInlineEnd: 8 }} />
                    Load template
                    <Tag color="purple" className="auto-width-tag" style={{ marginInlineStart: 8 }}>
                        WASM-safe
                    </Tag>
                </span>
            }
            placement="right"
            width={Math.min(960, typeof window !== 'undefined' ? window.innerWidth - 80 : 960)}
            open={open}
            onClose={closeAndReset}
            styles={{ body: { padding: 0, display: 'flex', flexDirection: 'column' } }}
            destroyOnHidden={false}
        >
            <Alert
                type="info"
                showIcon
                style={{ margin: 12 }}
                message="Curated for coraza-proxy-wasm v0.6.0"
                description={
                    <Text style={{ fontSize: 12 }}>
                        Every directive in these presets is enforced by the WASM runtime.
                        File-system audit logs, per-arg limits, and other ModSecurity-only
                        directives are deliberately omitted so nothing silently misbehaves.
                    </Text>
                }
            />

            {/* Preset list */}
            <div style={{ flex: 1, overflow: 'auto', padding: '0 16px 8px' }}>
                {groups.map((g) => (
                    <div key={g.category} style={{ marginBottom: 16 }}>
                        <div
                            style={{
                                padding: '8px 0',
                                display: 'flex',
                                alignItems: 'baseline',
                                gap: 8,
                            }}
                        >
                            <Title level={5} style={{ margin: 0 }}>
                                {CATEGORY_LABELS[g.category].title}
                            </Title>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                {CATEGORY_LABELS[g.category].subtitle}
                            </Text>
                        </div>
                        <Space direction="vertical" style={{ width: '100%' }} size={8}>
                            {g.presets.map((p) => (
                                <div key={p.id} style={{ position: 'relative' }}>
                                    <PresetCard
                                        preset={p}
                                        selected={selectedId === p.id}
                                        onSelect={() => setSelectedId(p.id)}
                                    />
                                    {p.directives.length > 0 && (
                                        <Tooltip title="Preview directives">
                                            <Button
                                                type="text"
                                                size="small"
                                                icon={<EyeOutlined />}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setPreviewId(p.id);
                                                }}
                                                style={{
                                                    position: 'absolute',
                                                    top: 8,
                                                    right: 8,
                                                    fontSize: 12,
                                                }}
                                            />
                                        </Tooltip>
                                    )}
                                </div>
                            ))}
                        </Space>
                    </div>
                ))}
            </div>

            {/* Sticky footer */}
            <div
                style={{
                    position: 'sticky',
                    bottom: 0,
                    padding: '12px 16px',
                    background: 'var(--card-bg)',
                    borderTop: '1px solid var(--border-default)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    boxShadow: '0 -4px 12px rgba(0,0,0,0.04)',
                }}
            >
                <Text type="secondary" style={{ fontSize: 12, flex: 1 }}>
                    {selectedPreset ? (
                        <>
                            Selected: <strong>{selectedPreset.name}</strong>
                            {activeSet && (
                                <>
                                    {' '}· Active set: <code>{activeSet.name}</code>
                                </>
                            )}
                        </>
                    ) : (
                        'Pick a template to enable apply.'
                    )}
                </Text>
                <Button
                    icon={<PlusOutlined />}
                    onClick={applyAdd}
                    disabled={!selectedPreset}
                >
                    Add as new set
                </Button>
                <Tooltip title={replaceDisabledReason || ''}>
                    <Button
                        type="primary"
                        icon={<SwapOutlined />}
                        onClick={applyReplace}
                        disabled={replaceDisabled}
                    >
                        Replace active set
                    </Button>
                </Tooltip>
            </div>

            {/* Preview modal — peek at the directive list before committing */}
            <Modal
                open={!!previewPreset}
                onCancel={() => setPreviewId(null)}
                onOk={() => setPreviewId(null)}
                title={previewPreset ? `Preview — ${previewPreset.name}` : 'Preview'}
                width={720}
                cancelButtonProps={{ style: { display: 'none' } }}
                okText="Close"
            >
                {previewPreset && (
                    <pre
                        style={{
                            margin: 0,
                            padding: 12,
                            background: 'var(--bg-secondary, rgba(0,0,0,0.04))',
                            border: '1px solid var(--border-default)',
                            borderRadius: 6,
                            fontFamily: 'monospace',
                            fontSize: 12,
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-all',
                            maxHeight: '60vh',
                            overflow: 'auto',
                        }}
                    >
                        {previewPreset.directives.length === 0
                            ? '# (empty preset)'
                            : previewPreset.directives.join('\n')}
                    </pre>
                )}
            </Modal>
        </Drawer>
    );
};

export default LoadPresetDrawer;
