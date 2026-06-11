/**
 * Security-engine panel for one PolicySpec (defaults or a route): enabled
 * engines render as removable cards with their dedicated forms; "+ Add
 * protection" opens a grouped picker with plain-language descriptions.
 */

import React from 'react';
import { Button, Card, Dropdown, Empty, Space, Tag, Tooltip, Typography } from 'antd';
import { DeleteOutlined, PlusOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { PolicySpec, DataFileModel } from '../../state/model';
import { ENGINE_DEFS, enabledEngines } from '../../engines/registry';

const { Text } = Typography;

/**
 * Compact phase badge sized for tight contexts (small Card headers, menu rows).
 * Deliberately NOT using the repo's `auto-width-tag` class here: its
 * `align-self: flex-start !important` shoves the tag to the top of the card
 * header's flex line and clips it.
 */
const PhaseTag: React.FC<{ phase: 'header' | 'body' }> = ({ phase }) => (
    <Tag
        color={phase === 'body' ? 'orange' : 'green'}
        style={{ fontSize: 10, lineHeight: '16px', padding: '0 6px', margin: 0 }}
    >
        {phase === 'body' ? 'inspects body' : 'header-only'}
    </Tag>
);

interface EnginePanelProps {
    policy: PolicySpec;
    onChange: (p: PolicySpec) => void;
    disabled?: boolean;
    dataFiles: DataFileModel[];
    /** Compact = route-level (smaller empty state). */
    compact?: boolean;
}

const EnginePanel: React.FC<EnginePanelProps> = ({ policy, onChange, disabled, dataFiles, compact }) => {
    const enabled = enabledEngines(policy);
    const available = ENGINE_DEFS.filter(d => d.get(policy) === undefined);

    const menuItems = ['Authentication', 'Traffic Control', 'Content Inspection']
        .map(group => ({
            key: group,
            type: 'group' as const,
            label: group,
            children: available
                .filter(d => d.group === group)
                .map(d => ({
                    key: d.key,
                    label: (
                        <div style={{ maxWidth: 420, padding: '2px 0' }}>
                            <Space size={6}>
                                <Text strong>{d.label}</Text>
                                <PhaseTag phase={d.phase} />
                            </Space>
                            <div><Text type="secondary" style={{ fontSize: 12, whiteSpace: 'normal' }}>{d.description}</Text></div>
                        </div>
                    ),
                })),
        }))
        .filter(g => g.children.length > 0);

    const addEngine = (key: string) => {
        const def = ENGINE_DEFS.find(d => d.key === key);
        if (def) onChange(def.set(policy, {}));
    };

    return (
        <div>
            {enabled.length === 0 && (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    style={{ margin: compact ? '4px 0' : '12px 0' }}
                    description={
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            {compact
                                ? 'No protections on this route yet — built-in header/body checks still apply.'
                                : 'No engines enabled — the built-in header/body checks still apply per the mode above.'}
                        </Text>
                    }
                />
            )}

            {enabled.map(def => {
                const value = def.get(policy) ?? {};
                const FormComp = def.Form;
                return (
                    <Card
                        key={def.key}
                        size="small"
                        style={{ marginBottom: 8, borderRadius: 10 }}
                        title={
                            <Space size={8} align="center">
                                <ThunderboltOutlined style={{ color: 'var(--color-primary)' }} />
                                <Text strong style={{ fontSize: 13 }}>{def.label}</Text>
                                <Tooltip title={def.phase === 'body'
                                    ? 'Body-phase engine: the request/response body is buffered and inspected for this route.'
                                    : 'Header-phase engine: runs on headers only, never buffers the body — cheap.'}>
                                    <span style={{ display: 'inline-flex' }}>
                                        <PhaseTag phase={def.phase} />
                                    </span>
                                </Tooltip>
                            </Space>
                        }
                        extra={!disabled && (
                            <Tooltip title="Remove this protection">
                                <Button type="text" danger size="small" icon={<DeleteOutlined />} onClick={() => onChange(def.set(policy, undefined))} />
                            </Tooltip>
                        )}
                    >
                        <FormComp
                            value={value}
                            onChange={(v: object) => onChange(def.set(policy, v))}
                            disabled={disabled}
                            dataFiles={dataFiles}
                        />
                    </Card>
                );
            })}

            {!disabled && available.length > 0 && (
                <Dropdown
                    trigger={['click']}
                    menu={{
                        items: menuItems,
                        onClick: ({ key }) => addEngine(key),
                        // 13 engines with descriptions are taller than the viewport;
                        // without a bounded, scrollable menu the list overflows the
                        // page and the bottom entries become unreachable.
                        style: { maxHeight: 'min(480px, 60vh)', overflowY: 'auto' },
                    }}
                >
                    <Button type="dashed" size="small" icon={<PlusOutlined />} block>
                        Add protection
                    </Button>
                </Dropdown>
            )}
        </div>
    );
};

export default EnginePanel;
