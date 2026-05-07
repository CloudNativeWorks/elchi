import React from 'react';
import { Button, Select, Tag } from 'antd';
import { CloseOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useWafEditor } from '../../state/wafEditorStore';

interface CrsBulkActionBarProps {
    selectedCount: number;
    /** How many of the selected rules are already present in the chosen target set. */
    alreadyInTargetCount: number;
    targetSetId: string | null;
    onChangeTarget: (id: string) => void;
    onApply: () => void;
    onClear: () => void;
}

/**
 * Sticky bottom action bar that appears when at least one rule is selected.
 * Lets the user pick the target set (defaults to active set) and bulk-add.
 */
const CrsBulkActionBar: React.FC<CrsBulkActionBarProps> = ({
    selectedCount,
    alreadyInTargetCount,
    targetSetId,
    onChangeTarget,
    onApply,
    onClear,
}) => {
    const { state } = useWafEditor();
    const setOptions = state.editor.sets.map((s) => ({ label: s.name, value: s.id }));

    if (selectedCount === 0) return null;

    const newCount = Math.max(0, selectedCount - alreadyInTargetCount);
    const allAlreadyAdded = newCount === 0;

    return (
        <div
            style={{
                position: 'sticky',
                bottom: 0,
                zIndex: 2,
                background: 'var(--card-bg)',
                borderTop: '1px solid var(--border-default)',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                boxShadow: '0 -4px 12px rgba(0,0,0,0.04)',
            }}
        >
            <Tag color="processing" style={{ fontSize: 13, padding: '4px 10px' }}>
                {selectedCount} rule{selectedCount === 1 ? '' : 's'} selected
            </Tag>
            {alreadyInTargetCount > 0 && (
                <Tag color="success" style={{ fontSize: 12 }}>
                    {alreadyInTargetCount} already in target
                </Tag>
            )}
            <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Add to:</span>
            <Select
                value={targetSetId ?? undefined}
                onChange={onChangeTarget}
                options={setOptions}
                style={{ minWidth: 180 }}
                placeholder="Pick a set"
                size="middle"
            />
            <div style={{ flex: 1 }} />
            <Button icon={<CloseOutlined />} onClick={onClear}>
                Clear
            </Button>
            <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                onClick={onApply}
                disabled={!targetSetId || allAlreadyAdded}
            >
                {allAlreadyAdded
                    ? 'Nothing new to add'
                    : `Add ${newCount} rule${newCount === 1 ? '' : 's'}`}
            </Button>
        </div>
    );
};

export default CrsBulkActionBar;
