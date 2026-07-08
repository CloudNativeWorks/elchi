/**
 * "Test" tab — a policy dry-run. The user enters a sample request and sees
 * exactly which domain + route the edge would select, the effective mode, and
 * which engines run in order. Mirrors the edge resolver (see utils/simulate).
 *
 * This is the trust-building surface: build a policy, then prove what it does to
 * a given request without deploying.
 */

import React, { useMemo, useState } from 'react';
import { Alert, Card, Col, Input, Row, Select, Space, Typography } from 'antd';
import { ExperimentOutlined } from '@ant-design/icons';
import { usePolicyEditor } from '../state/policyStore';
import { yamlToModel } from '../utils/policyYaml';
import { SimResult, simulateRequest } from '../utils/simulate';
import { FieldShell } from '../engines/fields';
import ResolutionResultView from './ResolutionResultView';

const { Text } = Typography;

const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'].map(m => ({ value: m, label: m }));

const ResultView: React.FC<{ r: SimResult }> = ({ r }) => (
    <Card size="small" style={{ borderRadius: 12, marginTop: 12 }}>
        <Text type="secondary" style={{ fontSize: 11, fontFamily: 'monospace' }}>
            normalized: {r.normalizedHost || '∅'} {r.normalizedPath}
        </Text>

        <ResolutionResultView r={r} />
    </Card>
);

const DryRunTab: React.FC = () => {
    const { state } = usePolicyEditor();
    const [host, setHost] = useState('api.example.com');
    const [method, setMethod] = useState('GET');
    const [path, setPath] = useState('/api/users');
    const [contentType, setContentType] = useState('');

    // Simulate against the live builder model (or the parsed YAML in YAML mode).
    const model = useMemo(() => {
        if (state.yamlMode) return yamlToModel(state.rawYaml).model;
        return state.model;
    }, [state.yamlMode, state.rawYaml, state.model]);

    const result = useMemo(
        () => (model && (host.trim() || path.trim()) ? simulateRequest(model, { host, method, path, contentType: contentType || undefined }) : null),
        [model, host, method, path, contentType],
    );

    return (
        <Card style={{ borderRadius: 12 }} title={<Space><ExperimentOutlined style={{ color: 'var(--color-primary)' }} /><Text strong>Test a request</Text></Space>}>
            <Text type="secondary" style={{ fontSize: 12 }}>
                See which domain/route the edge would pick and what runs — a dry-run of your policy, no deploy.
            </Text>
            <Row gutter={12} align="bottom" style={{ marginTop: 12 }}>
                <Col xs={24} md={5}>
                    <FieldShell label="Method" tooltip="HTTP method of the sample request.">
                        <Select size="small" style={{ width: '100%' }} value={method} options={METHODS} onChange={setMethod} />
                    </FieldShell>
                </Col>
                <Col xs={24} md={9}>
                    <FieldShell label="Host" tooltip="Request Host/authority (port/userinfo are stripped, as on the edge).">
                        <Input size="small" style={{ fontFamily: 'monospace' }} placeholder="api.example.com" value={host} onChange={e => setHost(e.target.value)} />
                    </FieldShell>
                </Col>
                <Col xs={24} md={10}>
                    <FieldShell label="Path" tooltip="Request path (query is ignored; the path is normalized like the edge).">
                        <Input size="small" style={{ fontFamily: 'monospace' }} placeholder="/api/users" value={path} onChange={e => setPath(e.target.value)} />
                    </FieldShell>
                </Col>
            </Row>
            <Row gutter={12}>
                <Col xs={24} md={9}>
                    <FieldShell label="Content-Type (optional)" tooltip="Only needed to evaluate routes that match on content type.">
                        <Input size="small" style={{ fontFamily: 'monospace' }} placeholder="application/json" value={contentType} onChange={e => setContentType(e.target.value)} />
                    </FieldShell>
                </Col>
            </Row>

            {!model && <Alert type="warning" showIcon style={{ borderRadius: 8 }} message="The YAML doesn't parse — fix it to run the test." />}
            {result && <ResultView r={result} />}
        </Card>
    );
};

export default DryRunTab;
