/**
 * Security-engine panel for one PolicySpec (defaults or a route): enabled
 * engines render as removable cards with their dedicated forms; "+ Add
 * protection" opens a grouped picker with plain-language descriptions.
 */

import React, { useMemo, useState } from 'react';
import { Alert, Button, Card, Empty, Input, Popover, Space, Tooltip, Typography } from 'antd';
import { DeleteOutlined, PlusOutlined, SearchOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { PolicySpec, DataFileModel } from '../../state/model';
import { ENGINE_DEFS, EngineDef, enabledEngines } from '../../engines/registry';
import { validateEngineValue } from '../../engines/validation';

const { Text } = Typography;

/**
 * Compact phase badge sized for tight contexts (small Card headers, menu rows).
 * Deliberately a plain <span>, NOT antd Tag: the app's global CSS forces
 * `padding: 4px 8px !important; font-size: 12px !important` on every .ant-tag
 * (index.css), which makes a Tag taller than a small Card header and clips it —
 * inline styles can't win against !important.
 */
const PhaseTag: React.FC<{ phase: 'header' | 'body' }> = ({ phase }) => {
    const body = phase === 'body';
    return (
        <span
            style={{
                display: 'inline-block',
                fontSize: 10,
                lineHeight: '14px',
                padding: '1px 6px',
                borderRadius: 6,
                whiteSpace: 'nowrap',
                verticalAlign: 'middle',
                color: body ? '#fa8c16' : '#52c41a',
                border: `1px solid ${body ? 'rgba(250,140,22,0.55)' : 'rgba(82,196,26,0.55)'}`,
                background: body ? 'rgba(250,140,22,0.12)' : 'rgba(82,196,26,0.12)',
            }}
        >
            {body ? 'inspects body' : 'header-only'}
        </span>
    );
};

interface EnginePanelProps {
    policy: PolicySpec;
    onChange: (p: PolicySpec) => void;
    disabled?: boolean;
    dataFiles: DataFileModel[];
    /** Compact = route-level (smaller empty state). */
    compact?: boolean;
}

const GROUP_ORDER = ['Authentication', 'Traffic Control', 'Content Inspection'] as const;

/**
 * Searchable, categorized engine picker (replaces a 13-item dropdown). Type to
 * filter by name/description/category; click a row to add it.
 */
const AddProtection: React.FC<{ available: EngineDef[]; onAdd: (key: string) => void }> = ({ available, onAdd }) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');

    const groups = useMemo(() => {
        const q = query.trim().toLowerCase();
        const match = (d: EngineDef) =>
            !q || d.label.toLowerCase().includes(q) || d.description.toLowerCase().includes(q) || d.group.toLowerCase().includes(q);
        return GROUP_ORDER
            .map(g => ({ group: g, items: available.filter(d => d.group === g && match(d)) }))
            .filter(g => g.items.length > 0);
    }, [available, query]);

    const pick = (key: string) => { onAdd(key); setOpen(false); setQuery(''); };

    const content = (
        <div style={{ width: 460, maxWidth: '90vw' }}>
            <Input
                autoFocus
                allowClear
                size="small"
                prefix={<SearchOutlined />}
                placeholder="Search protections (e.g. jwt, rate, waf, country)…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                style={{ marginBottom: 8 }}
            />
            <div style={{ maxHeight: 'min(440px, 60vh)', overflowY: 'auto' }}>
                {groups.length === 0 ? (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<Text type="secondary" style={{ fontSize: 12 }}>No protection matches “{query}”.</Text>} />
                ) : groups.map(({ group, items }) => (
                    <div key={group} style={{ marginBottom: 6 }}>
                        <Text type="secondary" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.4, padding: '0 8px' }}>{group}</Text>
                        {items.map(d => (
                            <Button
                                key={d.key}
                                type="text"
                                block
                                onClick={() => pick(d.key)}
                                style={{ height: 'auto', textAlign: 'left', padding: '6px 8px', whiteSpace: 'normal' }}
                            >
                                <div>
                                    <Space size={6}>
                                        <Text strong style={{ fontSize: 13 }}>{d.label}</Text>
                                        <PhaseTag phase={d.phase} />
                                    </Space>
                                    <div><Text type="secondary" style={{ fontSize: 12, whiteSpace: 'normal' }}>{d.description}</Text></div>
                                </div>
                            </Button>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <Popover open={open} onOpenChange={setOpen} trigger="click" placement="bottomLeft" content={content}>
            <Button type="dashed" size="small" icon={<PlusOutlined />} block>Add protection</Button>
        </Popover>
    );
};

const EnginePanel: React.FC<EnginePanelProps> = ({ policy, onChange, disabled, dataFiles, compact }) => {
    const enabled = enabledEngines(policy);
    const available = ENGINE_DEFS.filter(d => d.get(policy) === undefined);

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
                const problems = validateEngineValue(def.key, value);
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
                        {problems.length > 0 && (
                            <Alert
                                type="warning"
                                showIcon
                                style={{ marginBottom: 10, borderRadius: 8 }}
                                message={
                                    <span style={{ fontSize: 12 }}>
                                        {problems.length === 1 ? problems[0] : `${problems.length} things to fix:`}
                                        {problems.length > 1 && (
                                            <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                                                {problems.map((p, i) => <li key={i}>{p}</li>)}
                                            </ul>
                                        )}
                                    </span>
                                }
                            />
                        )}
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
                <AddProtection available={available} onAdd={addEngine} />
            )}
        </div>
    );
};

export default EnginePanel;
