/**
 * Content-inspection engine forms: Coraza WAF (+OWASP CRS), GraphQL guard,
 * OpenAPI positive validation, DLP (lives under checks.body.dlp on the wire,
 * presented as an engine card for UX).
 */

import React from 'react';
import { Col, Input, Row } from 'antd';
import {
    CorazaSpec,
    DlpSpec,
    GraphqlSpec,
    OpenApiSpec,
} from '../../state/model';
import {
    DataFilePathField,
    FieldShell,
    NumberField,
    SelectField,
    SwitchField,
    TagsField,
} from '../fields';
import type { EngineFormProps } from './authForms';

export const CorazaForm: React.FC<EngineFormProps<CorazaSpec>> = ({ value, onChange, disabled, dataFiles }) => {
    const set = (patch: Partial<CorazaSpec>) => onChange({ ...value, ...patch });
    return (
        <>
            <Row gutter={16}>
                <Col xs={24} md={12}>
                    <SwitchField label="Include OWASP CRS" tooltip="Load the embedded OWASP Core Rule Set (no rule files needed). Recommended: start the route in detect mode, watch detections, then switch to block." disabled={disabled} value={value.include_owasp} onChange={v => set({ include_owasp: v })} />
                    <NumberField label="Paranoia Level" tooltip="CRS strictness 1–4. Higher blocks more (and false-positives more). Empty = CRS default (1)." min={1} max={4} disabled={disabled} value={value.paranoia_level} onChange={v => set({ paranoia_level: v })} />
                    <NumberField label="Detection Paranoia Level" tooltip="Rules from this level up only DETECT (score) without contributing to blocking decisions." min={1} max={4} disabled={disabled} value={value.detection_paranoia_level} onChange={v => set({ detection_paranoia_level: v })} />
                </Col>
                <Col xs={24} md={12}>
                    <NumberField label="Inbound Anomaly Threshold" tooltip="Request blocks once its accumulated CRS score reaches this. Lower = stricter. Empty = CRS default (5)." min={1} disabled={disabled} value={value.inbound_anomaly_threshold} onChange={v => set({ inbound_anomaly_threshold: v })} />
                    <NumberField label="Outbound Anomaly Threshold" tooltip="Same for the response side. Empty = CRS default (4)." min={1} disabled={disabled} value={value.outbound_anomaly_threshold} onChange={v => set({ outbound_anomaly_threshold: v })} />
                    <TagsField label="Exclude Rule IDs" tooltip="CRS rule ids to disable (false-positive tuning), e.g. 942100." placeholder="942100" disabled={disabled} value={value.exclude_rule_ids} onChange={v => set({ exclude_rule_ids: v })} />
                </Col>
            </Row>
            <FieldShell label="Custom Directives" tooltip="Raw Coraza/ModSecurity SecLang directives appended after the CRS (advanced)." hint="One directive per line, e.g. SecRule REQUEST_URI …">
                <Input.TextArea
                    rows={4}
                    style={{ fontFamily: 'monospace', fontSize: 12 }}
                    value={value.directives}
                    disabled={disabled}
                    placeholder={'# SecRule REQUEST_URI "@contains /old-api" "id:1001,phase:1,deny,status:410"'}
                    onChange={e => set({ directives: e.target.value || undefined })}
                />
            </FieldShell>
            <DataFilePathField label="Directives File" tooltip="Alternative: a SecLang rules file on the edge (upload it in Data Files)." disabled={disabled} value={value.directives_file} onChange={v => set({ directives_file: v })} dataFiles={dataFiles} />
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
