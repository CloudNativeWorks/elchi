import React, { useState } from 'react';
import { App, Badge, Button, Input, Modal, Tooltip, Typography } from 'antd';
import {
    PlusOutlined,
    StarFilled,
    DeleteOutlined,
    EditOutlined,
    AppstoreOutlined,
    AppstoreAddOutlined,
    BookOutlined,
    FileTextOutlined,
    QuestionCircleOutlined,
    SettingOutlined,
    ProfileOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useWafEditor } from '../../state/wafEditorStore';

const { Text } = Typography;

interface SectionHeaderProps {
    icon: React.ReactNode;
    label: string;
    badge?: number;
    onClick?: () => void;
    active?: boolean;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ icon, label, badge, onClick, active }) => (
    <button
        onClick={onClick}
        style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 12px',
            background: active ? 'var(--color-primary-bg)' : 'transparent',
            color: active ? 'var(--color-primary)' : 'var(--text-primary)',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: 13,
            textAlign: 'left',
        }}
    >
        <span style={{ fontSize: 14 }}>{icon}</span>
        <span style={{ flex: 1 }}>{label}</span>
        {badge != null && badge > 0 && <Badge count={badge} style={{ backgroundColor: 'var(--color-primary)' }} />}
    </button>
);

interface WafSidebarProps {
    onOpenLibrary: () => void;
    onOpenAdvanced: () => void;
    onOpenOverview: () => void;
    onOpenCrsSetup: () => void;
    onOpenDemoConf: () => void;
    onOpenHowTo: () => void;
    onOpenLoadPreset: () => void;
}

/**
 * Left navigation:
 *   • Overview
 *   • Rule Sets — list with star for default, click to activate, hover-rename/delete
 *   • CRS Library
 *   • Advanced
 */
const WafSidebar: React.FC<WafSidebarProps> = ({ onOpenLibrary, onOpenAdvanced, onOpenOverview, onOpenCrsSetup, onOpenDemoConf, onOpenHowTo, onOpenLoadPreset }) => {
    const { state, dispatch } = useWafEditor();
    const { sets, defaultSetId } = state.editor;
    const { activeSetId } = state.ui;
    const { message } = App.useApp();

    const [adding, setAdding] = useState(false);
    const [draftName, setDraftName] = useState('');
    const [renamingId, setRenamingId] = useState<string | null>(null);
    const [renameDraft, setRenameDraft] = useState('');

    const commitAdd = () => {
        const name = draftName.trim();
        if (!name) {
            setAdding(false);
            setDraftName('');
            return;
        }
        if (sets.some((s) => s.name === name)) {
            message.warning(`A set named "${name}" already exists`);
            return; // keep the input open so user can fix it
        }
        dispatch({ type: 'ADD_SET', name });
        dispatch({ type: 'SET_ACTIVE_TAB', tab: 'editor' });
        setAdding(false);
        setDraftName('');
    };

    const commitRename = () => {
        if (!renamingId) return;
        const name = renameDraft.trim();
        if (!name) {
            setRenamingId(null);
            return;
        }
        const conflict = sets.some((s) => s.name === name && s.id !== renamingId);
        if (conflict) {
            message.warning(`A set named "${name}" already exists`);
            return; // keep editing so user can adjust
        }
        dispatch({ type: 'RENAME_SET', id: renamingId, name });
        setRenamingId(null);
        setRenameDraft('');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: 12 }}>
            <SectionHeader
                icon={<ProfileOutlined />}
                label="Overview"
                active={activeSetId === null}
                onClick={() => {
                    dispatch({ type: 'SELECT_SET', id: null });
                    onOpenOverview();
                }}
            />

            <div style={{ marginTop: 8, padding: '4px 12px' }}>
                <Text style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Rule Sets
                </Text>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {sets.map((set) => {
                    const isActive = set.id === activeSetId;
                    const isDefault = set.id === defaultSetId;
                    const isRenaming = renamingId === set.id;

                    return (
                        <div
                            key={set.id}
                            role="button"
                            tabIndex={0}
                            aria-current={isActive ? 'page' : undefined}
                            aria-label={`${set.name}${isDefault ? ' (default)' : ''}`}
                            onKeyDown={(e) => {
                                if (isRenaming) return;
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    dispatch({ type: 'SELECT_SET', id: set.id });
                                    dispatch({ type: 'SET_ACTIVE_TAB', tab: 'editor' });
                                }
                            }}
                            onClick={() => {
                                if (isRenaming) return;
                                dispatch({ type: 'SELECT_SET', id: set.id });
                                dispatch({ type: 'SET_ACTIVE_TAB', tab: 'editor' });
                            }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                padding: '6px 10px 6px 16px',
                                marginLeft: 4,
                                background: isActive ? 'var(--color-primary-bg)' : 'transparent',
                                color: isActive ? 'var(--color-primary)' : 'var(--text-primary)',
                                borderRadius: 6,
                                cursor: 'pointer',
                                fontSize: 13,
                            }}
                        >
                            <Tooltip title={isDefault ? 'Default set' : 'Click star to mark as default'}>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        dispatch({ type: 'SET_DEFAULT_SET', id: set.id });
                                    }}
                                    aria-label={isDefault ? 'Default set' : 'Mark as default'}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: isDefault ? 'var(--color-warning)' : 'var(--text-secondary)',
                                        padding: 0,
                                        display: 'flex',
                                    }}
                                >
                                    <StarFilled style={{ fontSize: 12 }} />
                                </button>
                            </Tooltip>

                            {isRenaming ? (
                                <Input
                                    size="small"
                                    autoFocus
                                    value={renameDraft}
                                    onChange={(e) => setRenameDraft(e.target.value)}
                                    onPressEnter={commitRename}
                                    onBlur={commitRename}
                                    onClick={(e) => e.stopPropagation()}
                                    style={{ flex: 1, height: 24 }}
                                />
                            ) : (
                                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {set.name}
                                </span>
                            )}

                            <Badge
                                count={set.directives.length}
                                size="small"
                                style={{ backgroundColor: 'var(--color-primary)' }}
                            />

                            {!isRenaming && (
                                <span className="waf-set-actions" style={{ display: 'flex', gap: 2 }}>
                                    <Tooltip title="Rename">
                                        <Button
                                            type="text"
                                            size="small"
                                            icon={<EditOutlined />}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setRenamingId(set.id);
                                                setRenameDraft(set.name);
                                            }}
                                        />
                                    </Tooltip>
                                    {sets.length > 1 && (
                                        <Tooltip title="Delete set">
                                            <Button
                                                type="text"
                                                size="small"
                                                danger
                                                icon={<DeleteOutlined />}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const confirmThreshold = 3;
                                                    const proceed = () =>
                                                        dispatch({ type: 'REMOVE_SET', id: set.id });
                                                    if (set.directives.length > confirmThreshold) {
                                                        Modal.confirm({
                                                            title: `Delete set "${set.name}"?`,
                                                            icon: <ExclamationCircleOutlined />,
                                                            content: `This will remove ${set.directives.length} directive${set.directives.length === 1 ? '' : 's'}. You can undo with ⌘Z right after.`,
                                                            okText: 'Delete',
                                                            okType: 'danger',
                                                            cancelText: 'Cancel',
                                                            onOk: proceed,
                                                        });
                                                    } else {
                                                        proceed();
                                                    }
                                                }}
                                            />
                                        </Tooltip>
                                    )}
                                </span>
                            )}
                        </div>
                    );
                })}

                {adding ? (
                    <div style={{ padding: '4px 12px 4px 28px' }}>
                        <Input
                            size="small"
                            autoFocus
                            value={draftName}
                            onChange={(e) => setDraftName(e.target.value)}
                            onPressEnter={commitAdd}
                            onBlur={commitAdd}
                            placeholder="Set name (e.g. strict)"
                        />
                    </div>
                ) : (
                    <Button
                        type="text"
                        size="small"
                        icon={<PlusOutlined />}
                        onClick={() => setAdding(true)}
                        style={{ marginLeft: 16, justifyContent: 'flex-start', color: 'var(--text-secondary)' }}
                    >
                        Add set
                    </Button>
                )}
            </div>

            <div style={{ marginTop: 12 }}>
                <SectionHeader icon={<BookOutlined />} label="CRS Library" onClick={onOpenLibrary} />
                <SectionHeader
                    icon={<FileTextOutlined />}
                    label="CRS Setup"
                    onClick={onOpenCrsSetup}
                />
                <SectionHeader
                    icon={<FileTextOutlined />}
                    label="Demo Conf"
                    onClick={onOpenDemoConf}
                />
                <SectionHeader
                    icon={<AppstoreAddOutlined />}
                    label="Load template"
                    onClick={onOpenLoadPreset}
                />
                <SectionHeader
                    icon={<QuestionCircleOutlined />}
                    label="How to write rules"
                    onClick={onOpenHowTo}
                />
                <SectionHeader
                    icon={<SettingOutlined />}
                    label="Advanced"
                    onClick={onOpenAdvanced}
                    badge={
                        Object.keys(state.editor.metricLabels).length +
                        Object.keys(state.editor.perAuthorityDirectives).length || undefined
                    }
                />
            </div>

            <div style={{ marginTop: 'auto', padding: '12px 4px 4px', color: 'var(--text-secondary)', fontSize: 11 }}>
                <AppstoreOutlined style={{ marginRight: 6 }} />
                {sets.length} set{sets.length === 1 ? '' : 's'} ·{' '}
                {sets.reduce((sum, s) => sum + s.directives.length, 0)} directives
            </div>
        </div>
    );
};

export default WafSidebar;
