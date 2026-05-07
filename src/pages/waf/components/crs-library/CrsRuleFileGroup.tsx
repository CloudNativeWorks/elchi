import React, { useState } from 'react';
import { Badge, Button, Checkbox, Tag, Tooltip, Typography } from 'antd';
import {
    CaretRightOutlined,
    CheckCircleFilled,
    DownOutlined,
    FileOutlined,
    FolderAddOutlined,
} from '@ant-design/icons';
import { CrsRule } from '../../types';
import CrsRuleListItem from './CrsRuleListItem';

const { Text } = Typography;

interface CrsRuleFileGroupProps {
    filename: string;
    rules: CrsRule[];
    selectedIds: Set<number>;
    onToggleRule: (ruleId: number) => void;
    onToggleAll: (filename: string, ruleIds: number[], select: boolean) => void;
    onAddRule: (rule: CrsRule) => void;
    onIncludeFile: (filename: string) => void;
    canAdd: boolean;
    addedRuleIds: Set<number>;
    addedFiles: Set<string>;
    activeSetName?: string;
}

/**
 * Collapsible file group. Shows file checkbox (select all in file),
 * "Include file" button (adds Include @owasp_crs/<file>), and
 * the per-rule list inside. Closed by default.
 */
const CrsRuleFileGroup: React.FC<CrsRuleFileGroupProps> = ({
    filename,
    rules,
    selectedIds,
    onToggleRule,
    onToggleAll,
    onAddRule,
    onIncludeFile,
    canAdd,
    addedRuleIds,
    addedFiles,
    activeSetName,
}) => {
    const [open, setOpen] = useState(false);

    const ruleIds = rules.map((r) => r.characteristics.id);
    const fileSelectedCount = ruleIds.filter((id) => selectedIds.has(id)).length;
    const fileAllSelected = fileSelectedCount === ruleIds.length && ruleIds.length > 0;
    const fileSomeSelected = fileSelectedCount > 0 && !fileAllSelected;

    const fileIncluded = addedFiles.has(filename);
    const addedRuleCount = ruleIds.filter((id) => addedRuleIds.has(id)).length;

    return (
        <div style={{ borderBottom: '1px solid var(--border-default)' }}>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 12px',
                    cursor: 'pointer',
                    background: 'var(--bg-elevated, transparent)',
                }}
                onClick={() => setOpen((v) => !v)}
            >
                <Checkbox
                    checked={fileAllSelected}
                    indeterminate={fileSomeSelected}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => onToggleAll(filename, ruleIds, e.target.checked)}
                />
                <span style={{ color: 'var(--text-secondary)' }}>
                    {open ? <DownOutlined /> : <CaretRightOutlined />}
                </span>
                <FileOutlined style={{ color: 'var(--text-secondary)' }} />
                <Text strong style={{ flex: 1 }}>
                    {filename}
                </Text>
                {addedRuleCount > 0 && !fileIncluded && (
                    <Tooltip
                        title={`${addedRuleCount} rule${addedRuleCount === 1 ? '' : 's'} from this file already in ${activeSetName ?? 'the active set'}`}
                    >
                        <Tag
                            icon={<CheckCircleFilled />}
                            color="success"
                            style={{ marginInlineEnd: 0 }}
                        >
                            {addedRuleCount}/{ruleIds.length}
                        </Tag>
                    </Tooltip>
                )}
                <Badge count={rules.length} style={{ backgroundColor: 'var(--color-primary)' }} />
                {fileIncluded ? (
                    <Tooltip title={`Already included in ${activeSetName ?? 'the active set'}`}>
                        <Button
                            size="small"
                            icon={<CheckCircleFilled style={{ color: 'var(--color-success)' }} />}
                            disabled
                            onClick={(e) => e.stopPropagation()}
                        >
                            Included
                        </Button>
                    </Tooltip>
                ) : (
                    <Tooltip title="Add `Include @owasp_crs/<file>` to the active set">
                        <Button
                            size="small"
                            icon={<FolderAddOutlined />}
                            disabled={!canAdd}
                            onClick={(e) => {
                                e.stopPropagation();
                                onIncludeFile(filename);
                            }}
                        >
                            Include
                        </Button>
                    </Tooltip>
                )}
            </div>
            {open && (
                <div>
                    {rules.map((r) => (
                        <CrsRuleListItem
                            key={r.characteristics.id}
                            rule={r}
                            selected={selectedIds.has(r.characteristics.id)}
                            added={addedRuleIds.has(r.characteristics.id)}
                            activeSetName={activeSetName}
                            onToggle={() => onToggleRule(r.characteristics.id)}
                            onAddOne={() => onAddRule(r)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default React.memo(CrsRuleFileGroup);
