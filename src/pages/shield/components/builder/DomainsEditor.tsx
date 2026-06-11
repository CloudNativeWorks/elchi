/**
 * Domains & routes editor: each domain = hosts + a list of routes; each route =
 * a match (path/method) + mode override + protections (engines). This is where
 * the user "builds the policy" — no YAML, no files.
 */

import React from 'react';
import { Button, Card, Col, Empty, Input, Row, Segmented, Select, Space, Tooltip, Typography } from 'antd';
import { DeleteOutlined, GlobalOutlined, PlusOutlined } from '@ant-design/icons';
import { DataFileModel, DomainSpec, MatchSpec, PolicySpec, RouteSpec } from '../../state/model';
import { FieldShell } from '../../engines/fields';
import EnginePanel from './EnginePanel';
import PolicySettings from './PolicySettings';

const { Text } = Typography;

const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'].map(m => ({ value: m, label: m }));

type PathKind = 'path_prefix' | 'path_exact' | 'path_regex';

const pathKindOf = (m: MatchSpec): PathKind =>
    m.path_exact !== undefined ? 'path_exact' : m.path_regex !== undefined ? 'path_regex' : 'path_prefix';

const MatchEditor: React.FC<{
    match: MatchSpec;
    onChange: (m: MatchSpec) => void;
    disabled?: boolean;
}> = ({ match, onChange, disabled }) => {
    const kind = pathKindOf(match);
    const value = match[kind] ?? '';

    const setKind = (next: PathKind) => {
        const v = match.path_exact ?? match.path_prefix ?? match.path_regex;
        onChange({ ...match, path_exact: undefined, path_prefix: undefined, path_regex: undefined, [next]: v });
    };

    return (
        <Row gutter={12} align="top">
            <Col xs={24} md={6}>
                <FieldShell label="Path Match" tooltip="How the request path is matched: Prefix (starts with), Exact, or Regex (RE2). Matching uses the normalized, percent-decoded path.">
                    <Segmented
                        size="small"
                        disabled={disabled}
                        value={kind}
                        options={[
                            { label: 'Prefix', value: 'path_prefix' },
                            { label: 'Exact', value: 'path_exact' },
                            { label: 'Regex', value: 'path_regex' },
                        ]}
                        onChange={v => setKind(v as PathKind)}
                    />
                </FieldShell>
            </Col>
            <Col xs={24} md={10}>
                <FieldShell label="Path" tooltip="Empty matches every request to the domain (the domain's default route)." hint={kind === 'path_regex' ? 'RE2 syntax, e.g. ^/api/v[0-9]+/' : 'e.g. /api/'}>
                    <Input
                        size="small"
                        style={{ fontFamily: 'monospace' }}
                        placeholder={kind === 'path_exact' ? '/healthz' : kind === 'path_regex' ? '^/api/v[0-9]+/' : '/api/'}
                        disabled={disabled}
                        value={value}
                        onChange={e => onChange({ ...match, [kind]: e.target.value || undefined })}
                    />
                </FieldShell>
            </Col>
            <Col xs={24} md={8}>
                <FieldShell label="Methods" tooltip="HTTP methods this route applies to. Empty = all methods.">
                    <Select
                        size="small"
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="All methods"
                        disabled={disabled}
                        value={match.methods ?? []}
                        options={METHODS}
                        onChange={v => onChange({ ...match, methods: v.length ? v : undefined })}
                    />
                </FieldShell>
            </Col>
        </Row>
    );
};

interface DomainsEditorProps {
    domains: DomainSpec[];
    onChange: (d: DomainSpec[]) => void;
    disabled?: boolean;
    dataFiles: DataFileModel[];
}

const DomainsEditor: React.FC<DomainsEditorProps> = ({ domains, onChange, disabled, dataFiles }) => {
    const setDomain = (i: number, d: DomainSpec) =>
        onChange(domains.map((x, j) => (j === i ? d : x)));

    const setRoute = (di: number, ri: number, r: RouteSpec) =>
        setDomain(di, { ...domains[di], routes: (domains[di].routes ?? []).map((x, j) => (j === ri ? r : x)) });

    return (
        <>
            {domains.length === 0 && (
                <Card style={{ borderRadius: 12, marginBottom: 12 }}>
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                            <span>
                                <Text strong>Add a domain to start protecting traffic.</Text><br />
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    A domain selects requests by Host (exact, *.wildcard, or * for all); its routes attach protections to paths.
                                </Text>
                            </span>
                        }
                    />
                </Card>
            )}

            {domains.map((d, di) => (
                <Card
                    key={di}
                    style={{ borderRadius: 12, marginBottom: 12 }}
                    title={
                        <Space>
                            <GlobalOutlined style={{ color: 'var(--color-primary)' }} />
                            <Text strong>{d.hosts?.length ? d.hosts.join(', ') : `Domain #${di + 1}`}</Text>
                        </Space>
                    }
                    extra={!disabled && (
                        <Tooltip title="Remove domain">
                            <Button type="text" danger icon={<DeleteOutlined />} onClick={() => onChange(domains.filter((_, j) => j !== di))} />
                        </Tooltip>
                    )}
                >
                    <FieldShell
                        label="Hosts"
                        tooltip="Request Hosts/authorities this domain protects. Each entry: an exact host, a leading wildcard (*.example.com), or * (any host). Most specific match wins."
                        hint="Type and press Enter — e.g. api.example.com, *.example.com, *"
                    >
                        <Select
                            size="small"
                            mode="tags"
                            style={{ width: '100%' }}
                            placeholder="api.example.com"
                            disabled={disabled}
                            value={d.hosts ?? []}
                            tokenSeparators={[',', ' ']}
                            options={[]}
                            onChange={(v: string[]) => setDomain(di, { ...d, hosts: v.length ? v : undefined })}
                        />
                    </FieldShell>

                    {(d.routes ?? []).map((r, ri) => (
                        <Card
                            key={ri}
                            size="small"
                            type="inner"
                            style={{ marginBottom: 8, borderRadius: 10 }}
                            title={
                                <Text style={{ fontSize: 13 }}>
                                    Route {ri + 1}
                                    {(() => {
                                        const m = r.match ?? {};
                                        const p = m.path_exact ?? m.path_prefix ?? m.path_regex;
                                        return p ? <Text type="secondary" style={{ fontFamily: 'monospace', marginLeft: 8, fontSize: 12 }}>{p}</Text> : null;
                                    })()}
                                </Text>
                            }
                            extra={!disabled && (
                                <Tooltip title="Remove route">
                                    <Button type="text" danger size="small" icon={<DeleteOutlined />}
                                        onClick={() => setDomain(di, { ...d, routes: (d.routes ?? []).filter((_, j) => j !== ri) })} />
                                </Tooltip>
                            )}
                        >
                            <MatchEditor match={r.match ?? {}} disabled={disabled} onChange={m => setRoute(di, ri, { ...r, match: m })} />
                            <PolicySettings
                                variant="route"
                                policy={r.policy ?? {}}
                                disabled={disabled}
                                onChange={(p: PolicySpec) => setRoute(di, ri, { ...r, policy: p })}
                            />
                            <div style={{ marginTop: 8 }}>
                                <EnginePanel
                                    compact
                                    policy={r.policy ?? {}}
                                    disabled={disabled}
                                    dataFiles={dataFiles}
                                    onChange={(p: PolicySpec) => setRoute(di, ri, { ...r, policy: p })}
                                />
                            </div>
                        </Card>
                    ))}

                    {!disabled && (
                        <Button
                            type="dashed"
                            size="small"
                            block
                            icon={<PlusOutlined />}
                            onClick={() => setDomain(di, { ...d, routes: [...(d.routes ?? []), { match: { path_prefix: '/' }, policy: {} }] })}
                        >
                            Add route
                        </Button>
                    )}
                </Card>
            ))}

            {!disabled && (
                <Button
                    type="dashed"
                    block
                    icon={<PlusOutlined />}
                    onClick={() => onChange([...domains, { hosts: [], routes: [{ match: { path_prefix: '/' }, policy: {} }] }])}
                >
                    Add domain
                </Button>
            )}
        </>
    );
};

export default DomainsEditor;
