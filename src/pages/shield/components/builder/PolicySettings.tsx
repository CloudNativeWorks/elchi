/**
 * Mode / fail-mode / advanced knobs for one PolicySpec. `variant="defaults"`
 * shows the full surface; `variant="route"` shows a compact inherit-aware mode
 * override plus the advanced collapse.
 */

import React from 'react';
import { Col, Collapse, Input, Row, Segmented, Select, Tooltip, Typography } from 'antd';
import { PolicySpec, PolicyMode, FailMode } from '../../state/model';
import { DurationField, FieldShell, NumberField, SwitchField, TagsField } from '../../engines/fields';

const { Text } = Typography;

export const MODE_META: Record<PolicyMode, { label: string; help: string; color: string }> = {
    block: { label: 'Block', help: 'Enforce: detected attacks are rejected with 403.', color: 'var(--color-danger)' },
    detect: { label: 'Detect', help: 'Monitor: evaluate and log/metric would-be blocks, but allow the traffic. Ideal for rollout.', color: '#fa8c16' },
    shadow: { label: 'Shadow', help: 'Evaluate exactly as if blocking and record what WOULD have been blocked — traffic always allowed.', color: '#722ed1' },
    off: { label: 'Off', help: 'Skip inspection entirely for matching traffic.', color: 'var(--text-secondary, #999)' },
};

interface PolicySettingsProps {
    policy: PolicySpec;
    onChange: (p: PolicySpec) => void;
    disabled?: boolean;
    variant: 'defaults' | 'route';
}

const PolicySettings: React.FC<PolicySettingsProps> = ({ policy, onChange, disabled, variant }) => {
    const set = (patch: Partial<PolicySpec>) => onChange({ ...policy, ...patch });
    const isRoute = variant === 'route';

    const modeOptions = (Object.keys(MODE_META) as PolicyMode[]).map(m => ({
        label: (
            <Tooltip title={MODE_META[m].help}>
                <span>{MODE_META[m].label}</span>
            </Tooltip>
        ),
        value: m,
    }));

    return (
        <>
            <Row gutter={16} align="middle">
                <Col xs={24} md={isRoute ? 14 : 10}>
                    <FieldShell
                        label={isRoute ? 'Mode (overrides defaults)' : 'Mode'}
                        tooltip="What happens when a protection detects something: Block rejects (403), Detect logs but allows, Shadow records would-be blocks, Off skips inspection."
                        hint={isRoute ? 'Empty = inherit from policy defaults.' : undefined}
                    >
                        <Segmented
                            size="small"
                            disabled={disabled}
                            value={policy.mode ?? (isRoute ? '' : 'block')}
                            options={isRoute ? [{ label: 'Inherit', value: '' }, ...modeOptions] : modeOptions}
                            onChange={v => set({ mode: (v || undefined) as PolicyMode | undefined })}
                        />
                    </FieldShell>
                </Col>
                {!isRoute && (
                    <Col xs={24} md={10}>
                        <FieldShell
                            label="Failure Posture"
                            tooltip="What happens when shield itself errors or times out: fail_open lets traffic through (availability first), fail_close blocks it (security first — use for auth routes)."
                        >
                            <Segmented
                                size="small"
                                disabled={disabled}
                                value={policy.fail_mode ?? 'fail_open'}
                                options={[
                                    { label: <Tooltip title="On shield error, ALLOW the request — an engine bug never takes your API down."><span>Fail Open</span></Tooltip>, value: 'fail_open' },
                                    { label: <Tooltip title="On shield error, BLOCK the request — nothing unverified gets through. Use for authentication."><span>Fail Close</span></Tooltip>, value: 'fail_close' },
                                ]}
                                onChange={v => set({ fail_mode: v as FailMode })}
                            />
                        </FieldShell>
                    </Col>
                )}
            </Row>

            <Collapse
                size="small"
                ghost
                items={[{
                    key: 'advanced',
                    label: <Text type="secondary" style={{ fontSize: 12 }}>Advanced settings</Text>,
                    children: (
                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                {isRoute && (
                                    <FieldShell label="Failure Posture (override)" tooltip="Override the default failure posture for this route.">
                                        <Select size="small" style={{ width: '100%' }} allowClear placeholder="Inherit" disabled={disabled}
                                            value={policy.fail_mode}
                                            options={[{ value: 'fail_open', label: 'Fail Open' }, { value: 'fail_close', label: 'Fail Close' }]}
                                            onChange={v => set({ fail_mode: (v || undefined) as FailMode | undefined })}
                                        />
                                    </FieldShell>
                                )}
                                <SwitchField label="Inspect Request Body" tooltip="Buffer and inspect request bodies (needed by WAF/GraphQL/OpenAPI; body engines enable it implicitly)." disabled={disabled} value={policy.inspect_request_body} onChange={v => set({ inspect_request_body: v })} />
                                <SwitchField label="Inspect Response Body" tooltip="Buffer and inspect response bodies (needed for outbound CRS rules / response DLP)." disabled={disabled} value={policy.inspect_response_body} onChange={v => set({ inspect_response_body: v })} />
                                <NumberField label="Max Request Body Bytes" tooltip="Per-request body buffer cap. Over-limit bodies are BLOCKED (never inspected partially). Empty = 1 MiB default." min={0} placeholder="1048576" disabled={disabled} value={policy.max_request_body_bytes} onChange={v => set({ max_request_body_bytes: v })} />
                                <NumberField label="Max Response Body Bytes" tooltip="Response body cap; 0/empty = response body not inspected." min={0} disabled={disabled} value={policy.max_response_body_bytes} onChange={v => set({ max_response_body_bytes: v })} />
                                <NumberField label="Max Header Bytes" tooltip="Cap on a single header value's size. Empty = 8 KiB default." min={0} placeholder="8192" disabled={disabled} value={policy.max_header_bytes} onChange={v => set({ max_header_bytes: v })} />
                            </Col>
                            <Col xs={24} md={12}>
                                <DurationField label="Timeout" tooltip="Per-request inspection deadline; on expiry the failure posture applies." placeholder="e.g. 200ms, 1s" disabled={disabled} value={policy.timeout} onChange={v => set({ timeout: v })} />
                                <NumberField label="Anomaly Threshold" tooltip="Scoring engines (e.g. bot with emit_score) accumulate a per-request score; the request blocks when the total reaches this." min={1} disabled={disabled} value={policy.anomaly_threshold} onChange={v => set({ anomaly_threshold: v })} />
                                <NumberField label="Sampling Rate" tooltip="Fraction of ALLOWED requests audited (0–1). Blocks are always audited." min={0} max={1} disabled={disabled} value={policy.sampling_rate} onChange={v => set({ sampling_rate: v })} />
                                <FieldShell label="Log Level" tooltip="Per-policy log verbosity override.">
                                    <Select size="small" style={{ width: '100%' }} allowClear placeholder="Inherit" disabled={disabled}
                                        value={policy.log_level}
                                        options={['debug', 'info', 'warn', 'error'].map(l => ({ value: l, label: l }))}
                                        onChange={v => set({ log_level: v || undefined })}
                                    />
                                </FieldShell>
                                <TagsField label="Skip Checks" tooltip="Names of built-in checks to skip for this policy (false-positive escape hatch)." disabled={disabled} value={policy.skip_checks} onChange={v => set({ skip_checks: v })} />
                                <FieldShell label="Pipeline Order (request)" tooltip="Reorder/disable inspector stages: fast_pre_checks, body_checks, waf_engine. Omission disables a stage." hint="Leave empty for the default order.">
                                    <Select size="small" mode="multiple" style={{ width: '100%' }} allowClear placeholder="Default order" disabled={disabled}
                                        value={policy.pipeline?.request}
                                        options={['fast_pre_checks', 'body_checks', 'waf_engine'].map(sname => ({ value: sname, label: sname }))}
                                        onChange={v => {
                                            const pipeline = { ...(policy.pipeline ?? {}) };
                                            if (v?.length) pipeline.request = v; else delete pipeline.request;
                                            set({ pipeline: Object.keys(pipeline).length ? pipeline : undefined });
                                        }}
                                    />
                                </FieldShell>
                            </Col>
                        </Row>
                    ),
                }]}
            />
            {policy.checks?.headers || policy.checks?.body?.require_json || policy.checks?.body?.detect_sensitive_data ? (
                <div style={{ marginTop: 4 }}>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                        This policy also carries built-in header/body check settings (visible in the YAML tab).
                    </Text>
                </div>
            ) : null}
        </>
    );
};

export default PolicySettings;
