/**
 * "Test" tab — a policy dry-run. The user enters a sample request and sees
 * exactly which domain + route the edge would select, the effective mode, and
 * which engines run in order. Mirrors the edge resolver (see utils/simulate).
 *
 * This is the trust-building surface: build a policy, then prove what it does to
 * a given request without deploying.
 */

import React, { useMemo, useState } from 'react';
import { Alert, Card, Col, Input, Row, Select, Space, Tag, Typography } from 'antd';
import { ExperimentOutlined } from '@ant-design/icons';
import { usePolicyEditor } from '../state/policyStore';
import { yamlToModel } from '../utils/policyYaml';
import { SimResult, simulateRequest } from '../utils/simulate';
import { FieldShell } from '../engines/fields';

const { Text } = Typography;

const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'].map(m => ({ value: m, label: m }));

const MODE_COLOR: Record<string, string> = { block: 'red', detect: 'gold', shadow: 'blue', off: 'default' };

const PhaseChip: React.FC<{ phase: 'header' | 'body' }> = ({ phase }) => {
    const body = phase === 'body';
    return (
        <span style={{
            fontSize: 10, lineHeight: '14px', padding: '1px 6px', borderRadius: 6, marginLeft: 6,
            color: body ? '#fa8c16' : '#52c41a',
            border: `1px solid ${body ? 'rgba(250,140,22,0.55)' : 'rgba(82,196,26,0.55)'}`,
            background: body ? 'rgba(250,140,22,0.12)' : 'rgba(82,196,26,0.12)',
        }}>
            {body ? 'body' : 'header'}
        </span>
    );
};

const ResultView: React.FC<{ r: SimResult }> = ({ r }) => (
    <Card size="small" style={{ borderRadius: 12, marginTop: 12 }}>
        <Text type="secondary" style={{ fontSize: 11, fontFamily: 'monospace' }}>
            normalized: {r.normalizedHost || '∅'} {r.normalizedPath}
        </Text>

        {r.excluded ? (
            <Alert style={{ marginTop: 8, borderRadius: 8 }} type="info" showIcon
                message={<span>Bypassed — the path matches an excluded path <Text code>{r.excluded}</Text>. No inspection runs.</span>} />
        ) : r.noDomainMatch ? (
            <Alert style={{ marginTop: 8, borderRadius: 8 }} type="warning" showIcon
                message="No domain matched this host." description={r.caveats[0]} />
        ) : (
            <div style={{ marginTop: 8 }}>
                <Space direction="vertical" size={6} style={{ width: '100%' }}>
                    <div>
                        <Text type="secondary" style={{ fontSize: 12 }}>Domain</Text>{'  '}
                        <Text strong>{r.domain?.hosts.join(', ')}</Text>{' '}
                        <Text type="secondary" style={{ fontSize: 12 }}>(via <Text code>{r.domain?.matchedEntry}</Text>)</Text>
                    </div>
                    <div>
                        <Text type="secondary" style={{ fontSize: 12 }}>Route</Text>{'  '}
                        {r.route
                            ? <Text strong style={{ fontFamily: 'monospace' }}>{r.route.label}</Text>
                            : <Text type="secondary">domain default (no route matched)</Text>}
                    </div>
                    <div>
                        <Space size={8} wrap>
                            <span><Text type="secondary" style={{ fontSize: 12 }}>Mode</Text>{' '}
                                <Tag color={MODE_COLOR[r.mode] ?? 'default'} style={{ marginInlineEnd: 0 }}>{r.mode}</Tag></span>
                            <span><Text type="secondary" style={{ fontSize: 12 }}>Fail</Text>{' '}<Tag>{r.failMode}</Tag></span>
                            {r.inspectRequestBody && <Tag color="orange">inspects request body</Tag>}
                            {r.inspectResponseBody && <Tag color="orange">inspects response body</Tag>}
                        </Space>
                    </div>
                    <div>
                        <Text type="secondary" style={{ fontSize: 12 }}>Engines that run (in order)</Text>
                        <div style={{ marginTop: 4 }}>
                            {r.engines.length === 0 ? (
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    None — only the built-in header/body checks apply.
                                </Text>
                            ) : (
                                <Space size={[6, 6]} wrap>
                                    {r.engines.map((e, i) => (
                                        <span key={e.key} style={{
                                            display: 'inline-flex', alignItems: 'center',
                                            border: '1px solid var(--border-default)', borderRadius: 8, padding: '2px 8px',
                                            background: 'var(--bg-elevated, transparent)',
                                        }}>
                                            <Text type="secondary" style={{ fontSize: 11, marginRight: 4 }}>{i + 1}.</Text>
                                            <Text style={{ fontSize: 12 }}>{e.label}</Text>
                                            <PhaseChip phase={e.phase} />
                                        </span>
                                    ))}
                                </Space>
                            )}
                        </div>
                    </div>
                </Space>
            </div>
        )}

        {!r.excluded && r.caveats.length > 0 && (
            <ul style={{ margin: '10px 0 0 16px', padding: 0 }}>
                {r.caveats.map((c, i) => (
                    <li key={i}><Text type="secondary" style={{ fontSize: 12 }}>{c}</Text></li>
                ))}
            </ul>
        )}
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
