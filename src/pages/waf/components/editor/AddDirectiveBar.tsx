import React, { useState } from 'react';
import { Button, Dropdown, Input, MenuProps, Space, Tooltip } from 'antd';
import { DownOutlined, PlusOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { COMMON_DIRECTIVES } from '../../constants/commonDirectives';

const { TextArea } = Input;

interface AddDirectiveBarProps {
    onAdd: (text: string) => void;
    onOpenTemplate: () => void;
}

/**
 * Bottom bar of the editor:
 *   [ Multiline TextArea ............................ ] [+ Add ▾]  [✨ Templates]
 *
 * The dropdown next to "Add" exposes the existing common-directive presets,
 * so users can quick-add SecRuleEngine On / Include @owasp_crs/*.conf etc.
 * without leaving the editor.
 */
const AddDirectiveBar: React.FC<AddDirectiveBarProps> = ({ onAdd, onOpenTemplate }) => {
    const [text, setText] = useState('');

    const submit = () => {
        const value = text.trim();
        if (!value) return;
        onAdd(value);
        setText('');
    };

    // Build a flat menu of common directives grouped by directive name.
    const quickMenu: MenuProps['items'] = [];
    COMMON_DIRECTIVES.forEach((group) => {
        quickMenu.push({
            type: 'group',
            label: (
                <span>
                    <strong>{group.label}</strong>
                    {group.recommended && (
                        <span
                            style={{
                                marginLeft: 6,
                                fontSize: 10,
                                padding: '1px 4px',
                                background: 'var(--color-success-bg)',
                                color: 'var(--color-success)',
                                borderRadius: 3,
                            }}
                        >
                            recommended
                        </span>
                    )}
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 400 }}>
                        {group.description}
                    </div>
                </span>
            ),
            children: group.options.map((opt, idx) => ({
                key: `${group.key}-${idx}`,
                label: (
                    <div>
                        <code style={{ fontSize: 12 }}>{opt.value}</code>
                    </div>
                ),
                onClick: () => onAdd(opt.value),
            })),
        });
    });

    return (
        <div
            style={{
                display: 'flex',
                gap: 8,
                padding: '12px 16px',
                borderTop: '1px solid var(--border-default)',
                background: 'var(--card-bg)',
            }}
        >
            <TextArea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a directive (e.g. SecRuleEngine On). Shift+Enter for newline · ⌘+Enter to add."
                autoSize={{ minRows: 1, maxRows: 6 }}
                style={{ flex: 1, fontFamily: 'monospace', fontSize: 12.5 }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                        e.preventDefault();
                        submit();
                    }
                }}
            />
            <Space.Compact>
                <Button type="primary" icon={<PlusOutlined />} onClick={submit} disabled={!text.trim()}>
                    Add
                </Button>
                <Dropdown menu={{ items: quickMenu, style: { maxHeight: 420, overflow: 'auto' } }} trigger={['click']}>
                    <Button type="primary" icon={<DownOutlined />} aria-label="Quick add presets" />
                </Dropdown>
            </Space.Compact>
            <Tooltip title="Open template builder">
                <Button icon={<ThunderboltOutlined />} onClick={onOpenTemplate}>
                    Templates
                </Button>
            </Tooltip>
        </div>
    );
};

export default AddDirectiveBar;
