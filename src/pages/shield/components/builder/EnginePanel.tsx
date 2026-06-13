/**
 * Security-engine panel for one PolicySpec (defaults or a route): enabled
 * engines render as removable cards with their dedicated forms; "+ Add
 * protection" opens a grouped picker with plain-language descriptions.
 */

import React, { useMemo, useState } from 'react';
import { Button, Empty, Input, Popover, Space, Tooltip, Typography } from 'antd';
import {
    CheckCircleFilled,
    DeleteOutlined,
    DownOutlined,
    ExclamationCircleFilled,
    PlusOutlined,
    RightOutlined,
    SearchOutlined,
    ThunderboltOutlined,
} from '@ant-design/icons';
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

interface EngineCardProps {
    def: EngineDef;
    policy: PolicySpec;
    disabled?: boolean;
    dataFiles: DataFileModel[];
    onChange: (p: PolicySpec) => void;
}

/**
 * One enabled protection as a collapsible row: summary (icon · name · phase ·
 * status) that expands inline to the engine's form. Keeps a route with several
 * protections scannable instead of stacking full forms. A freshly-added (empty)
 * engine opens automatically; its form is unmounted while collapsed.
 */
const EngineCard: React.FC<EngineCardProps> = ({ def, policy, disabled, dataFiles, onChange }) => {
    const value = (def.get(policy) ?? {}) as object;
    const problems = validateEngineValue(def.key, value);
    const configured = Object.keys(value).length > 0;
    const [open, setOpen] = useState(() => !configured);
    const FormComp = def.Form;

    return (
        <div style={{ border: '1px solid var(--border-default)', borderRadius: 10, marginBottom: 6, overflow: 'hidden' }}>
            <div
                onClick={() => setOpen(o => !o)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', cursor: 'pointer' }}
            >
                <span style={{ color: 'var(--text-secondary)' }}>{open ? <DownOutlined /> : <RightOutlined />}</span>
                <ThunderboltOutlined style={{ color: 'var(--color-primary)' }} />
                <Text strong style={{ fontSize: 13 }}>{def.label}</Text>
                <Tooltip title={def.phase === 'body'
                    ? 'Body-phase: buffers and inspects the body for this route.'
                    : 'Header-phase: runs on headers only, never buffers the body.'}>
                    <span style={{ display: 'inline-flex' }}><PhaseTag phase={def.phase} /></span>
                </Tooltip>
                {problems.length > 0 ? (
                    <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--color-warning, #faad14)',
                        fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 360,
                    }}>
                        <ExclamationCircleFilled />
                        {problems[0]}{problems.length > 1 ? ` (+${problems.length - 1})` : ''}
                    </span>
                ) : configured ? (
                    <Tooltip title="Configured"><CheckCircleFilled style={{ color: 'var(--color-success, #52c41a)' }} /></Tooltip>
                ) : null}
                <div style={{ flex: 1 }} />
                {!disabled && (
                    <Tooltip title="Remove this protection">
                        <Button type="text" danger size="small" icon={<DeleteOutlined />}
                            onClick={(e) => { e.stopPropagation(); onChange(def.set(policy, undefined)); }} />
                    </Tooltip>
                )}
            </div>
            {open && (
                <div style={{ padding: '8px 12px 12px', borderTop: '1px solid var(--border-light, var(--border-default))' }}>
                    {problems.length > 1 && (
                        <ul style={{ margin: '0 0 10px 16px', padding: 0 }}>
                            {problems.map((p, i) => (
                                <li key={i}><Text style={{ fontSize: 12, color: 'var(--color-warning, #faad14)' }}>{p}</Text></li>
                            ))}
                        </ul>
                    )}
                    <FormComp
                        value={value}
                        onChange={(v: object) => onChange(def.set(policy, v))}
                        disabled={disabled}
                        dataFiles={dataFiles}
                    />
                </div>
            )}
        </div>
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

            {enabled.map(def => (
                <EngineCard
                    key={def.key}
                    def={def}
                    policy={policy}
                    disabled={disabled}
                    dataFiles={dataFiles}
                    onChange={onChange}
                />
            ))}

            {!disabled && available.length > 0 && (
                <AddProtection available={available} onAdd={addEngine} />
            )}
        </div>
    );
};

export default EnginePanel;
