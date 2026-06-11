import React from 'react';
import { Button, Select, Tag } from 'antd';
import { CloseOutlined, PlusCircleOutlined } from '@ant-design/icons';

interface CrsBulkActionBarProps {
    selectedCount: number;
    /** How many of the selected rules are already present in the chosen target. */
    alreadyInTargetCount: number;
    targetId: string | null;
    onChangeTarget: (id: string) => void;
    onApply: () => void;
    onClear: () => void;
    /**
     * Targets the bulk-add can write into. When there is a single target the
     * picker is hidden (the bar just shows "Add N rules"); multiple targets
     * (e.g. the WASM-WAF page's directive sets) render the dropdown.
     */
    targets: { label: string; value: string }[];
}

/**
 * Sticky bottom action bar that appears when at least one rule is selected.
 * Callback-driven: the host supplies the target list and add/clear handlers
 * so the bar is reusable across the WAF page (multi-set) and Shield (single
 * directives blob).
 */
const CrsBulkActionBar: React.FC<CrsBulkActionBarProps> = ({
    selectedCount,
    alreadyInTargetCount,
    targetId,
    onChangeTarget,
    onApply,
    onClear,
    targets,
}) => {
    if (selectedCount === 0) return null;

    const newCount = Math.max(0, selectedCount - alreadyInTargetCount);
    const allAlreadyAdded = newCount === 0;
    const showPicker = targets.length > 1;

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
                    {alreadyInTargetCount} already added
                </Tag>
            )}
            {showPicker && (
                <>
                    <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Add to:</span>
                    <Select
                        value={targetId ?? undefined}
                        onChange={onChangeTarget}
                        options={targets}
                        style={{ minWidth: 180 }}
                        placeholder="Pick a set"
                        size="middle"
                    />
                </>
            )}
            <div style={{ flex: 1 }} />
            <Button icon={<CloseOutlined />} onClick={onClear}>
                Clear
            </Button>
            <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                onClick={onApply}
                disabled={!targetId || allAlreadyAdded}
            >
                {allAlreadyAdded
                    ? 'Nothing new to add'
                    : `Add ${newCount} rule${newCount === 1 ? '' : 's'}`}
            </Button>
        </div>
    );
};

export default CrsBulkActionBar;
