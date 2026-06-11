/**
 * Content-inspection engine forms: Coraza WAF (+OWASP CRS), GraphQL guard,
 * OpenAPI positive validation, DLP (lives under checks.body.dlp on the wire,
 * presented as an engine card for UX).
 */

import React, { useState } from 'react';
import { Button, Col, Row, Space, Tag, Typography } from 'antd';
import { ToolOutlined } from '@ant-design/icons';
import {
    CorazaSpec,
    DlpSpec,
    GraphqlSpec,
    OpenApiSpec,
} from '../../state/model';
import {
    DataFilePathField,
    NumberField,
    SelectField,
    SwitchField,
    TagsField,
} from '../fields';
import type { EngineFormProps } from './authForms';
import { countCustomRules } from './coraza/directivesCodec';

// Lazy so the heavy CRS library + Monaco preview (and the wafApi chain they
// pull in) only load when the Studio is opened — keeps the engine registry's
// import graph light.
const WafStudioDrawer = React.lazy(() => import('./coraza/WafStudioDrawer'));

const { Text } = Typography;

/**
 * Coraza is presented as a launcher into the full-screen WAF Studio (CRS
 * tuning + rule library + visual/structured custom-rule editor) instead of a
 * raw SecLang textarea. The inline card shows a summary and a couple of quick
 * escape-hatch fields; everything else is authored in the Studio.
 */
export const CorazaForm: React.FC<EngineFormProps<CorazaSpec>> = ({ value, onChange, disabled, dataFiles }) => {
    const [studioOpen, setStudioOpen] = useState(false);
    const set = (patch: Partial<CorazaSpec>) => onChange({ ...value, ...patch });

    const customCount = countCustomRules(value.directives);
    const summary: string[] = [];
    if (value.include_owasp) summary.push(`OWASP CRS${value.paranoia_level ? ` · PL${value.paranoia_level}` : ''}`);
    if (customCount) summary.push(`${customCount} custom rule${customCount === 1 ? '' : 's'}`);
    if (value.exclude_rule_ids?.length) summary.push(`${value.exclude_rule_ids.length} disabled`);

    return (
        <>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 12px',
                    border: '1px solid var(--border-default)',
                    borderRadius: 10,
                    marginBottom: 12,
                    background: 'var(--bg-elevated, transparent)',
                }}
            >
                <div style={{ flex: 1, minWidth: 0 }}>
                    <Space size={6} wrap>
                        <Text strong style={{ fontSize: 13 }}>Web Application Firewall</Text>
                        {summary.length
                            ? summary.map((s) => <Tag key={s} color="blue" style={{ margin: 0 }}>{s}</Tag>)
                            : <Text type="secondary" style={{ fontSize: 12 }}>Not configured yet</Text>}
                    </Space>
                    <div>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Tune the OWASP CRS and build rules visually — no hand-typed SecLang.
                        </Text>
                    </div>
                </div>
                <Button type="primary" icon={<ToolOutlined />} disabled={disabled} onClick={() => setStudioOpen(true)}>
                    Open WAF Studio
                </Button>
            </div>

            <Row gutter={16}>
                <Col xs={24} md={12}>
                    <SwitchField label="Include OWASP CRS" tooltip="Load the embedded OWASP Core Rule Set (no rule files needed). Detailed tuning lives in WAF Studio." disabled={disabled} value={value.include_owasp} onChange={v => set({ include_owasp: v })} />
                    <TagsField label="Disabled Rule IDs" tooltip="CRS rule ids to disable (false-positive tuning), e.g. 942100." placeholder="942100" disabled={disabled} value={value.exclude_rule_ids} onChange={v => set({ exclude_rule_ids: v })} />
                </Col>
                <Col xs={24} md={12}>
                    <DataFilePathField label="Directives File" tooltip="A SecLang rules file on the edge (upload it in Data Files). Its rules are APPENDED after the WAF Studio rules — make sure rule ids don't collide, or the edge rejects the config." disabled={disabled} value={value.directives_file} onChange={v => set({ directives_file: v })} dataFiles={dataFiles} />
                </Col>
            </Row>

            {studioOpen && (
                <React.Suspense fallback={null}>
                    <WafStudioDrawer
                        open={studioOpen}
                        value={value}
                        disabled={disabled}
                        onApply={(next) => onChange(next)}
                        onClose={() => setStudioOpen(false)}
                    />
                </React.Suspense>
            )}
        </>
    );
};

export const GraphqlForm: React.FC<EngineFormProps<GraphqlSpec>> = ({ value, onChange, disabled }) => {
    const set = (patch: Partial<GraphqlSpec>) => onChange({ ...value, ...patch });
    return (
        <Row gutter={16}>
            <Col xs={24} md={12}>
                <NumberField label="Max Depth" tooltip="Maximum query nesting depth. 0/empty disables the check." min={0} disabled={disabled} value={value.max_depth} onChange={v => set({ max_depth: v })} />
                <NumberField label="Max Aliases" tooltip="Maximum field aliases per query (alias-overload protection)." min={0} disabled={disabled} value={value.max_aliases} onChange={v => set({ max_aliases: v })} />
                <NumberField label="Max Root Fields" tooltip="Maximum root-level fields per operation." min={0} disabled={disabled} value={value.max_root_fields} onChange={v => set({ max_root_fields: v })} />
                <NumberField label="Max Total Fields" tooltip="Maximum total fields across the query." min={0} disabled={disabled} value={value.max_total_fields} onChange={v => set({ max_total_fields: v })} />
                <NumberField label="Max Complexity" tooltip="Maximum computed query complexity." min={0} disabled={disabled} value={value.max_complexity} onChange={v => set({ max_complexity: v })} />
            </Col>
            <Col xs={24} md={12}>
                <NumberField label="Max Operations (batch)" tooltip="Maximum operations in a batched request." min={0} disabled={disabled} value={value.max_operations} onChange={v => set({ max_operations: v })} />
                <NumberField label="Max Fragment Depth" tooltip="Bound on fragment nesting (fragment-cycle protection)." min={0} disabled={disabled} value={value.max_fragment_depth} onChange={v => set({ max_fragment_depth: v })} />
                <SwitchField label="Block Introspection" tooltip="Reject __schema/__type introspection queries in production." disabled={disabled} value={value.block_introspection} onChange={v => set({ block_introspection: v })} />
                <TagsField label="Paths" tooltip="Request paths treated as GraphQL endpoints. Empty = engine default (/graphql)." placeholder="/graphql" disabled={disabled} value={value.paths} onChange={v => set({ paths: v })} />
                <TagsField label="Content Types" tooltip="Content types parsed as GraphQL. Empty = engine defaults." placeholder="application/json" disabled={disabled} value={value.content_types} onChange={v => set({ content_types: v })} />
            </Col>
        </Row>
    );
};

export const OpenApiForm: React.FC<EngineFormProps<OpenApiSpec>> = ({ value, onChange, disabled, dataFiles }) => {
    const set = (patch: Partial<OpenApiSpec>) => onChange({ ...value, ...patch });
    return (
        <Row gutter={16}>
            <Col xs={24} md={12}>
                <DataFilePathField label="OpenAPI Spec File" tooltip="OpenAPI 3.x document on the edge — requests are validated against it (positive security). Upload it in the Data Files tab." disabled={disabled} value={value.spec_file} onChange={v => set({ spec_file: v })} dataFiles={dataFiles} />
            </Col>
            <Col xs={24} md={12}>
                <SwitchField label="Validate Request Body" tooltip="Validate bodies against the spec's schemas (buffers the request body)." disabled={disabled} value={value.validate_request_body} onChange={v => set({ validate_request_body: v })} />
                <SwitchField label="Reject Undeclared Paths" tooltip="Block requests to paths/operations not declared in the spec." disabled={disabled} value={value.reject_undeclared_path} onChange={v => set({ reject_undeclared_path: v })} />
            </Col>
        </Row>
    );
};

const DLP_KINDS = [
    'credit_card', 'ssn', 'email', 'jwt', 'aws_access_key',
    'private_key', 'google_api_key', 'slack_token', 'github_token',
].map(k => ({ value: k }));

export const DlpForm: React.FC<EngineFormProps<DlpSpec>> = ({ value, onChange, disabled }) => {
    const set = (patch: Partial<DlpSpec>) => onChange({ ...value, ...patch });
    return (
        <Row gutter={16}>
            <Col xs={24} md={8}>
                <SelectField label="Direction" tooltip="Where DLP inspects: the response (default — stops data leaking OUT), the request, or both." options={[
                    { value: 'response', label: 'response (default)' },
                    { value: 'request', label: 'request' },
                    { value: 'both', label: 'both' },
                ]} disabled={disabled} value={value.direction} onChange={v => set({ direction: v })} />
            </Col>
            <Col xs={24} md={8}>
                <TagsField label="Block Kinds" tooltip="Detector kinds that BLOCK the message entirely (hard secrets like private keys)." options={DLP_KINDS} placeholder="private_key" disabled={disabled} value={value.block} onChange={v => set({ block: v })} />
            </Col>
            <Col xs={24} md={8}>
                <TagsField label="Redact Kinds" tooltip="Detector kinds MASKED in place (PII like credit cards, SSN, emails) — the message passes with the value redacted." options={DLP_KINDS} placeholder="credit_card" disabled={disabled} value={value.redact} onChange={v => set({ redact: v })} />
            </Col>
        </Row>
    );
};
