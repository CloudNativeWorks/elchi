import React from 'react';
import { Button, Input, Space, Tag, Tooltip, Typography } from 'antd';
import {
    DeleteOutlined,
    FireOutlined,
    HistoryOutlined,
    RedoOutlined,
    SaveOutlined,
    UndoOutlined,
} from '@ant-design/icons';
import ElchiButton from '@/elchi/components/common/ElchiButton';
import { useWafEditor } from '../../state/wafEditorStore';

const { Text } = Typography;

interface WafTopBarProps {
    isCreateMode: boolean;
    isSaving: boolean;
    onSave: () => void;
    onDelete?: () => void;
    onOpenHistory?: () => void;
}

/**
 * Page header — name field + dirty indicator + actions.
 * In create mode the name is editable; in edit mode it's locked (backend
 * treats name as immutable; see WAF_REDESIGN_BACKEND_PLAN.md §6.1).
 */
const WafTopBar: React.FC<WafTopBarProps> = ({
    isCreateMode,
    isSaving,
    onSave,
    onDelete,
    onOpenHistory,
}) => {
    const { state, dispatch, canUndo, canRedo } = useWafEditor();
    const { name } = state.editor;
    const { dirty } = state.ui;

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '12px 16px',
                background: 'var(--card-bg)',
                borderRadius: 12,
                boxShadow: 'var(--shadow-sm)',
            }}
        >
            <FireOutlined style={{ color: 'var(--color-danger)', fontSize: 24 }} />

            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
                {isCreateMode ? (
                    <Input
                        value={name}
                        onChange={(e) => dispatch({ type: 'SET_NAME', name: e.target.value })}
                        placeholder="WAF config name (e.g. production-waf)"
                        size="large"
                        style={{ maxWidth: 480, fontSize: 18, fontWeight: 600 }}
                    />
                ) : (
                    <Tooltip title="Names are immutable after creation">
                        <Text strong style={{ fontSize: 20 }}>
                            {name || 'Untitled WAF'}
                        </Text>
                    </Tooltip>
                )}
                {dirty && (
                    <Tag color="orange" style={{ marginLeft: 4 }}>
                        Unsaved changes
                    </Tag>
                )}
            </div>

            <Space size={4}>
                <Tooltip title="Undo (⌘Z)">
                    <Button
                        type="text"
                        icon={<UndoOutlined />}
                        disabled={!canUndo}
                        onClick={() => dispatch({ type: 'UNDO' })}
                        aria-label="Undo"
                    />
                </Tooltip>
                <Tooltip title="Redo (⌘⇧Z)">
                    <Button
                        type="text"
                        icon={<RedoOutlined />}
                        disabled={!canRedo}
                        onClick={() => dispatch({ type: 'REDO' })}
                        aria-label="Redo"
                    />
                </Tooltip>
                <span style={{ width: 8, display: 'inline-block' }} />
                {!isCreateMode && onOpenHistory && (
                    <Tooltip title="History">
                        <Button icon={<HistoryOutlined />} onClick={onOpenHistory}>
                            History
                        </Button>
                    </Tooltip>
                )}
                <ElchiButton
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={onSave}
                    loading={isSaving}
                    size="middle"
                >
                    {isCreateMode ? 'Create' : 'Save'} <span style={{ opacity: 0.7, fontSize: 11, marginLeft: 4 }}>⌘S</span>
                </ElchiButton>
                {!isCreateMode && onDelete && (
                    <Button danger type="primary" icon={<DeleteOutlined />} onClick={onDelete}>
                        Delete
                    </Button>
                )}
            </Space>
        </div>
    );
};

export default WafTopBar;
