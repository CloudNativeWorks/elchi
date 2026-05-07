import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Tag, Tooltip, Typography } from 'antd';
import { ClockCircleOutlined, MinusCircleFilled, PlusCircleFilled, UserOutlined } from '@ant-design/icons';
import { WafConfigVersion } from '../../types';
import { useWafEditor } from '../../state/wafEditorStore';
import { normalizeFromApi } from '../../utils/wafAdapter';
import { serializeEditor } from '../../utils/confSerializer';

const { Text } = Typography;

const MonacoDiff = React.lazy(() =>
    import('@monaco-editor/react').then((m) => ({ default: m.DiffEditor })),
);

interface VersionDiffModalProps {
    open: boolean;
    version: WafConfigVersion | null;
    /** Already-serialized .conf for the live (current) state. */
    currentText: string;
    onClose: () => void;
}

const readTheme = (): 'vs' | 'vs-dark' =>
    document.documentElement.dataset.theme === 'dark' ? 'vs-dark' : 'vs';

const formatTimestamp = (iso: string): string => {
    try {
        return new Date(iso).toLocaleString();
    } catch {
        return iso;
    }
};

interface PaneHeaderProps {
    side: 'original' | 'modified';
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    accent: 'red' | 'green';
}

const PaneHeader: React.FC<PaneHeaderProps> = ({ side, title, subtitle, accent }) => (
    <div
        style={{
            flex: 1,
            padding: '10px 14px',
            borderRight: side === 'original' ? '1px solid var(--border-default)' : undefined,
            background: 'var(--card-bg)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            minWidth: 0,
        }}
    >
        {accent === 'red' ? (
            <MinusCircleFilled style={{ color: 'var(--color-danger)' }} />
        ) : (
            <PlusCircleFilled style={{ color: 'var(--color-success)' }} />
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</div>
            {subtitle && (
                <div
                    style={{
                        fontSize: 11,
                        color: 'var(--text-secondary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                >
                    {subtitle}
                </div>
            )}
        </div>
    </div>
);

/**
 * Side-by-side diff with explicit pane headers so the user can tell
 * left from right at a glance.
 *
 * Snapshot semantics: a version captures the state *as saved*. If a rename
 * happened only in the in-memory editor and never made it into a save, no
 * snapshot will reflect the old name — the diff hint at the top spells this
 * out so users don't think the diff is broken.
 */
const VersionDiffModal: React.FC<VersionDiffModalProps> = ({ open, version, currentText, onClose }) => {
    const { state } = useWafEditor();
    const [theme, setTheme] = useState<'vs' | 'vs-dark'>(() => readTheme());

    useEffect(() => {
        const observer = new MutationObserver(() => setTheme(readTheme()));
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme', 'class'],
        });
        return () => observer.disconnect();
    }, []);

    const versionText = useMemo(() => {
        if (!version) return '';
        return serializeEditor(
            normalizeFromApi({
                id: version.config_id,
                name: version.name,
                project: '',
                created_at: version.created_at,
                updated_at: version.created_at,
                data: version.data,
            }),
        );
    }, [version]);

    return (
        <Modal
            open={open}
            onCancel={onClose}
            title={null}
            width="90vw"
            style={{ top: 24 }}
            styles={{ body: { padding: 0, height: '78vh', display: 'flex', flexDirection: 'column' } }}
            footer={null}
            destroyOnHidden
        >
            {/* Pane headers — make sides unambiguous */}
            <div
                style={{
                    display: 'flex',
                    borderBottom: '1px solid var(--border-default)',
                    flexShrink: 0,
                }}
            >
                <PaneHeader
                    side="original"
                    accent="red"
                    title={
                        <span>
                            Snapshot{' '}
                            {version && (
                                <Tag color="blue" style={{ marginInlineEnd: 0 }}>
                                    v{version.version}
                                </Tag>
                            )}
                        </span>
                    }
                    subtitle={
                        version && (
                            <span>
                                <ClockCircleOutlined /> {formatTimestamp(version.created_at)} ·{' '}
                                <UserOutlined /> {version.author_name || version.author_id || 'unknown'}
                            </span>
                        )
                    }
                />
                <PaneHeader
                    side="modified"
                    accent="green"
                    title={
                        <span>
                            Current{' '}
                            {state.ui.dirty ? (
                                <Tooltip title="You have changes that haven't been saved yet">
                                    <Tag color="orange" style={{ marginInlineEnd: 0 }}>
                                        unsaved
                                    </Tag>
                                </Tooltip>
                            ) : (
                                <Tag color="green" style={{ marginInlineEnd: 0 }}>
                                    saved
                                </Tag>
                            )}
                        </span>
                    }
                    subtitle={state.editor.name || 'untitled'}
                />
            </div>

            {/* Helper hint */}
            <div
                style={{
                    fontSize: 11,
                    color: 'var(--text-secondary)',
                    padding: '6px 14px',
                    borderBottom: '1px solid var(--border-default)',
                    flexShrink: 0,
                    background: 'var(--bg-secondary, transparent)',
                }}
            >
                <Text type="secondary" style={{ fontSize: 11 }}>
                    Red lines on the left existed in the snapshot but are gone now. Green lines on the right
                    are new or changed. Snapshots are only taken at <em>save time</em>: if you renamed
                    or edited and saved in one go, the pre-edit state was never captured and won&rsquo;t
                    appear here.
                </Text>
            </div>

            {/* Diff */}
            <div style={{ flex: 1, minHeight: 0 }}>
                <React.Suspense
                    fallback={<div style={{ padding: 24, color: 'var(--text-secondary)' }}>Loading diff…</div>}
                >
                    <MonacoDiff
                        height="100%"
                        original={versionText}
                        modified={currentText}
                        language="apache"
                        theme={theme}
                        options={{
                            readOnly: true,
                            renderSideBySide: true,
                            minimap: { enabled: false },
                            fontSize: 12.5,
                            scrollBeyondLastLine: false,
                            wordWrap: 'on',
                        }}
                    />
                </React.Suspense>
            </div>
        </Modal>
    );
};

export default VersionDiffModal;
