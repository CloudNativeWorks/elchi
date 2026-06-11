/**
 * OWASP CRS tuning controls for WAF Studio. Rich, explained inputs instead of
 * bare number fields: a master switch, Segmented paranoia levels with a
 * one-line risk hint, and Slider+number anomaly thresholds. Writes the typed
 * numeric fields of `CorazaSpec` (shield applies them; they are not raw rules).
 */

import React from 'react';
import { Button, InputNumber, Segmented, Slider, Switch, Tag, Tooltip, Typography } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { CorazaSpec } from '../../../state/model';

const { Text } = Typography;

const PARANOIA_HINT: Record<number, string> = {
    1: 'Baseline — very few false positives. The recommended starting point.',
    2: 'Stricter — catches more, some tuning needed for false positives.',
    3: 'Aggressive — high coverage, expect to add exclusions.',
    4: 'Maximum — paranoid; only for hardened, well-understood APIs.',
};

const labelRow = (label: string, tooltip: string, extra?: React.ReactNode) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
        <Text strong style={{ fontSize: 13 }}>{label}</Text>
        <Tooltip title={tooltip}>
            <InfoCircleOutlined style={{ color: 'var(--color-primary)', fontSize: 12 }} />
        </Tooltip>
        <div style={{ flex: 1 }} />
        {extra}
    </div>
);

interface CrsTuningSectionProps {
    value: CorazaSpec;
    onChange: (patch: Partial<CorazaSpec>) => void;
    disabled?: boolean;
}

const ParanoiaPicker: React.FC<{
    label: string;
    tooltip: string;
    value?: number;
    onChange: (v?: number) => void;
    disabled?: boolean;
}> = ({ label, tooltip, value, onChange, disabled }) => (
    <div style={{ marginBottom: 16 }}>
        {labelRow(label, tooltip)}
        <Segmented
            disabled={disabled}
            value={value ?? 0}
            onChange={(v) => onChange(Number(v) === 0 ? undefined : Number(v))}
            options={[
                { label: 'Default', value: 0 },
                { label: 'PL1', value: 1 },
                { label: 'PL2', value: 2 },
                { label: 'PL3', value: 3 },
                { label: 'PL4', value: 4 },
            ]}
        />
        {value != null && (
            <div style={{ marginTop: 4 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>{PARANOIA_HINT[value]}</Text>
            </div>
        )}
    </div>
);

const ThresholdSlider: React.FC<{
    label: string;
    tooltip: string;
    defaultLabel: string;
    value?: number;
    onChange: (v?: number) => void;
    disabled?: boolean;
}> = ({ label, tooltip, defaultLabel, value, onChange, disabled }) => (
    <div style={{ marginBottom: 16 }}>
        {labelRow(
            label,
            tooltip,
            value != null ? (
                <Button type="link" size="small" disabled={disabled} style={{ padding: 0, height: 'auto' }} onClick={() => onChange(undefined)}>
                    reset to default
                </Button>
            ) : (
                <Tag style={{ fontSize: 11 }}>{defaultLabel}</Tag>
            ),
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Slider
                style={{ flex: 1 }}
                min={1}
                max={20}
                disabled={disabled}
                value={value ?? (Number(defaultLabel.replace(/\D/g, '')) || 5)}
                onChange={(v) => onChange(v)}
            />
            <InputNumber
                size="small"
                min={1}
                style={{ width: 72 }}
                disabled={disabled}
                value={value}
                placeholder={defaultLabel.replace(/\D/g, '')}
                onChange={(v) => onChange(v == null ? undefined : Number(v))}
            />
        </div>
        <Text type="secondary" style={{ fontSize: 11 }}>Lower = stricter (blocks at a smaller accumulated score).</Text>
    </div>
);

const CrsTuningSection: React.FC<CrsTuningSectionProps> = ({ value, onChange, disabled }) => {
    const on = !!value.include_owasp;
    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: on ? 16 : 0 }}>
                <Switch checked={on} disabled={disabled} onChange={(v) => onChange({ include_owasp: v || undefined })} />
                <div>
                    <Text strong style={{ fontSize: 14 }}>OWASP Core Rule Set</Text>
                    <div>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Load the embedded CRS — broad protection out of the box. Tune its strictness below.
                        </Text>
                    </div>
                </div>
            </div>

            {on && (
                <div style={{ paddingLeft: 4 }}>
                    <ParanoiaPicker
                        label="Paranoia Level"
                        tooltip="CRS strictness 1–4. Higher blocks more (and false-positives more). Default = CRS default (1)."
                        value={value.paranoia_level}
                        onChange={(v) => onChange({ paranoia_level: v })}
                        disabled={disabled}
                    />
                    <ParanoiaPicker
                        label="Detection Paranoia Level"
                        tooltip="Rules from this level up only DETECT (score) without contributing to blocking. Default = same as paranoia level."
                        value={value.detection_paranoia_level}
                        onChange={(v) => onChange({ detection_paranoia_level: v })}
                        disabled={disabled}
                    />
                    <ThresholdSlider
                        label="Inbound Anomaly Threshold"
                        tooltip="A request blocks once its accumulated CRS score reaches this. Default = CRS default (5)."
                        defaultLabel="default 5"
                        value={value.inbound_anomaly_threshold}
                        onChange={(v) => onChange({ inbound_anomaly_threshold: v })}
                        disabled={disabled}
                    />
                    <ThresholdSlider
                        label="Outbound Anomaly Threshold"
                        tooltip="Same for the response side. Default = CRS default (4)."
                        defaultLabel="default 4"
                        value={value.outbound_anomaly_threshold}
                        onChange={(v) => onChange({ outbound_anomaly_threshold: v })}
                        disabled={disabled}
                    />
                </div>
            )}
        </div>
    );
};

export default CrsTuningSection;
