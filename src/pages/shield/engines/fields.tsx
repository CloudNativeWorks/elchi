/**
 * Small controlled field widgets shared by all engine forms. Every widget is
 * (value, onChange) controlled, renders a label with a "what does this do"
 * tooltip and an optional hint, and stays compact so a route card can host a
 * full engine form without overwhelming the page.
 */

import React from 'react';
import { AutoComplete, Input, InputNumber, Select, Switch, Tooltip, Typography } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { DataFileModel, edgePathOf } from '../state/model';

const { Text } = Typography;

interface FieldShellProps {
    label: string;
    tooltip: string;
    hint?: string;
    children: React.ReactNode;
}

export const FieldShell: React.FC<FieldShellProps> = ({ label, tooltip, hint, children }) => (
    <div style={{ marginBottom: 12 }}>
        <div style={{ marginBottom: 4 }}>
            <Text strong style={{ fontSize: 13 }}>{label}</Text>{' '}
            <Tooltip title={tooltip}>
                <InfoCircleOutlined style={{ color: 'var(--color-primary)', fontSize: 12 }} />
            </Tooltip>
        </div>
        {children}
        {hint && <div><Text type="secondary" style={{ fontSize: 11 }}>{hint}</Text></div>}
    </div>
);

interface BaseProps {
    label: string;
    tooltip: string;
    hint?: string;
    disabled?: boolean;
}

export const TextField: React.FC<BaseProps & {
    value?: string;
    onChange: (v?: string) => void;
    placeholder?: string;
    mono?: boolean;
    password?: boolean;
}> = ({ label, tooltip, hint, disabled, value, onChange, placeholder, mono, password }) => (
    <FieldShell label={label} tooltip={tooltip} hint={hint}>
        {password ? (
            <Input.Password
                size="small"
                value={value}
                disabled={disabled}
                placeholder={placeholder}
                onChange={e => onChange(e.target.value || undefined)}
            />
        ) : (
            <Input
                size="small"
                value={value}
                disabled={disabled}
                placeholder={placeholder}
                style={mono ? { fontFamily: 'monospace' } : undefined}
                onChange={e => onChange(e.target.value || undefined)}
            />
        )}
    </FieldShell>
);

export const NumberField: React.FC<BaseProps & {
    value?: number;
    onChange: (v?: number) => void;
    min?: number;
    max?: number;
    placeholder?: string;
}> = ({ label, tooltip, hint, disabled, value, onChange, min, max, placeholder }) => (
    <FieldShell label={label} tooltip={tooltip} hint={hint}>
        <InputNumber
            size="small"
            style={{ width: '100%' }}
            value={value}
            disabled={disabled}
            min={min}
            max={max}
            placeholder={placeholder}
            onChange={v => onChange(v === null ? undefined : Number(v))}
        />
    </FieldShell>
);

export const SwitchField: React.FC<BaseProps & {
    value?: boolean;
    onChange: (v?: boolean) => void;
}> = ({ label, tooltip, hint, disabled, value, onChange }) => (
    <FieldShell label={label} tooltip={tooltip} hint={hint}>
        <Switch size="small" checked={!!value} disabled={disabled} onChange={v => onChange(v || undefined)} />
    </FieldShell>
);

export const TagsField: React.FC<BaseProps & {
    value?: string[];
    onChange: (v?: string[]) => void;
    placeholder?: string;
    options?: { value: string; label?: string }[];
}> = ({ label, tooltip, hint, disabled, value, onChange, placeholder, options }) => (
    <FieldShell label={label} tooltip={tooltip} hint={hint}>
        <Select
            size="small"
            mode="tags"
            style={{ width: '100%' }}
            value={value ?? []}
            disabled={disabled}
            placeholder={placeholder}
            options={options ?? []}
            tokenSeparators={[',', ' ']}
            onChange={(v: string[]) => onChange(v.length ? v : undefined)}
        />
    </FieldShell>
);

export const SelectField: React.FC<BaseProps & {
    value?: string;
    onChange: (v?: string) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
}> = ({ label, tooltip, hint, disabled, value, onChange, options, placeholder }) => (
    <FieldShell label={label} tooltip={tooltip} hint={hint}>
        <Select
            size="small"
            style={{ width: '100%' }}
            value={value}
            disabled={disabled}
            placeholder={placeholder}
            options={options}
            allowClear
            onChange={v => onChange(v || undefined)}
        />
    </FieldShell>
);

/** Go-style duration ("30s", "5m", "1h"). */
export const DurationField: React.FC<BaseProps & {
    value?: string;
    onChange: (v?: string) => void;
    placeholder?: string;
}> = ({ label, tooltip, hint, disabled, value, onChange, placeholder = 'e.g. 30s, 5m' }) => (
    <FieldShell label={label} tooltip={tooltip} hint={hint ?? 'Format: 30s / 5m / 1h'}>
        <Input
            size="small"
            value={value}
            disabled={disabled}
            placeholder={placeholder}
            onChange={e => onChange(e.target.value || undefined)}
        />
    </FieldShell>
);

/**
 * Picks an edge file path. Suggests the policy's Data Files (uploaded in the
 * Data Files tab) as absolute edge paths; free text allowed for pre-existing
 * paths on the edge.
 */
export const DataFilePathField: React.FC<BaseProps & {
    value?: string;
    onChange: (v?: string) => void;
    dataFiles: DataFileModel[];
}> = ({ label, tooltip, hint, disabled, value, onChange, dataFiles }) => (
    <FieldShell
        label={label}
        tooltip={tooltip}
        hint={hint ?? 'Pick a file from the Data Files tab, or type an absolute path on the edge.'}
    >
        <AutoComplete
            size="small"
            style={{ width: '100%' }}
            value={value}
            disabled={disabled}
            placeholder="/etc/elchi/elchi-shield/files/…"
            options={dataFiles.map(df => ({ value: edgePathOf(df.path), label: df.path }))}
            onChange={v => onChange(v || undefined)}
        />
    </FieldShell>
);
