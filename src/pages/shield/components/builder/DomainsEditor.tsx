/**
 * Domains & routes editor: each domain = hosts + a list of routes; each route =
 * a match (path/method) + mode override + protections (engines). This is where
 * the user "builds the policy" — no YAML, no files.
 *
 * Rows are keyed by a stable client-only `_uid` (not array index) and split into
 * memoized DomainCard/RouteCard components with stable per-uid callbacks, so
 * editing one field re-renders only that row — not every domain/route on the
 * page. This keeps typing responsive as the policy grows to many routes.
 */

import React, { useCallback, useRef } from 'react';
import { Button, Card, Col, Empty, Input, Row, Segmented, Select, Space, Tooltip, Typography } from 'antd';
import { DeleteOutlined, GlobalOutlined, PlusOutlined } from '@ant-design/icons';
import { DataFileModel, DomainSpec, MatchSpec, PolicySpec, RouteSpec, uid } from '../../state/model';
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

interface RouteCardProps {
    route: RouteSpec;
    index: number;
    disabled?: boolean;
    dataFiles: DataFileModel[];
    updateRoute: (ruid: string, next: RouteSpec) => void;
    removeRoute: (ruid: string) => void;
}

const RouteCard: React.FC<RouteCardProps> = React.memo(({ route, index, disabled, dataFiles, updateRoute, removeRoute }) => {
    const ruid = route._uid!;
    const onMatch = (m: MatchSpec) => updateRoute(ruid, { ...route, match: m });
    const onPolicy = (p: PolicySpec) => updateRoute(ruid, { ...route, policy: p });
    const m = route.match ?? {};
    const p = m.path_exact ?? m.path_prefix ?? m.path_regex;

    return (
        <Card
            size="small"
            type="inner"
            style={{ marginBottom: 8, borderRadius: 10 }}
            title={
                <Text style={{ fontSize: 13 }}>
                    Route {index + 1}
                    {p ? <Text type="secondary" style={{ fontFamily: 'monospace', marginLeft: 8, fontSize: 12 }}>{p}</Text> : null}
                </Text>
            }
            extra={!disabled && (
                <Tooltip title="Remove route">
                    <Button type="text" danger size="small" icon={<DeleteOutlined />} onClick={() => removeRoute(ruid)} />
                </Tooltip>
            )}
        >
            <MatchEditor match={route.match ?? {}} disabled={disabled} onChange={onMatch} />
            <PolicySettings variant="route" policy={route.policy ?? {}} disabled={disabled} onChange={onPolicy} />
            <div style={{ marginTop: 8 }}>
                <EnginePanel compact policy={route.policy ?? {}} disabled={disabled} dataFiles={dataFiles} onChange={onPolicy} />
            </div>
        </Card>
    );
});
RouteCard.displayName = 'RouteCard';

interface DomainCardProps {
    domain: DomainSpec;
    index: number;
    disabled?: boolean;
    dataFiles: DataFileModel[];
    updateDomain: (duid: string, next: DomainSpec) => void;
    removeDomain: (duid: string) => void;
}

const DomainCard: React.FC<DomainCardProps> = React.memo(({ domain, index, disabled, dataFiles, updateDomain, removeDomain }) => {
    const duid = domain._uid!;
    // Latest domain, read by the stable route callbacks below without making
    // them depend on (and so re-create with) the domain object each edit.
    const domainRef = useRef(domain);
    domainRef.current = domain;

    const updateRoute = useCallback((ruid: string, next: RouteSpec) => {
        const d = domainRef.current;
        updateDomain(duid, { ...d, routes: (d.routes ?? []).map(r => (r._uid === ruid ? next : r)) });
    }, [updateDomain, duid]);

    const removeRoute = useCallback((ruid: string) => {
        const d = domainRef.current;
        updateDomain(duid, { ...d, routes: (d.routes ?? []).filter(r => r._uid !== ruid) });
    }, [updateDomain, duid]);

    const setHosts = (v: string[]) => updateDomain(duid, { ...domain, hosts: v.length ? v : undefined });
    const addRoute = () =>
        updateDomain(duid, { ...domain, routes: [...(domain.routes ?? []), { _uid: uid(), match: { path_prefix: '/' }, policy: {} }] });

    return (
        <Card
            style={{ borderRadius: 12, marginBottom: 12 }}
            title={
                <Space>
                    <GlobalOutlined style={{ color: 'var(--color-primary)' }} />
                    <Text strong>{domain.hosts?.length ? domain.hosts.join(', ') : `Domain #${index + 1}`}</Text>
                </Space>
            }
            extra={!disabled && (
                <Tooltip title="Remove domain">
                    <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeDomain(duid)} />
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
                    value={domain.hosts ?? []}
                    tokenSeparators={[',', ' ']}
                    options={[]}
                    onChange={setHosts}
                />
            </FieldShell>

            {(domain.routes ?? []).map((r, ri) => (
                <RouteCard
                    key={r._uid}
                    route={r}
                    index={ri}
                    disabled={disabled}
                    dataFiles={dataFiles}
                    updateRoute={updateRoute}
                    removeRoute={removeRoute}
                />
            ))}

            {!disabled && (
                <Button type="dashed" size="small" block icon={<PlusOutlined />} onClick={addRoute}>
                    Add route
                </Button>
            )}
        </Card>
    );
});
DomainCard.displayName = 'DomainCard';

interface DomainsEditorProps {
    domains: DomainSpec[];
    onChange: (d: DomainSpec[]) => void;
    disabled?: boolean;
    dataFiles: DataFileModel[];
}

const DomainsEditor: React.FC<DomainsEditorProps> = ({ domains, onChange, disabled, dataFiles }) => {
    // Refs keep the row callbacks stable across edits (so memoized rows aren't
    // invalidated) while still reading the latest domains/onChange.
    const domainsRef = useRef(domains);
    domainsRef.current = domains;
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    const updateDomain = useCallback((duid: string, next: DomainSpec) => {
        onChangeRef.current(domainsRef.current.map(d => (d._uid === duid ? next : d)));
    }, []);

    const removeDomain = useCallback((duid: string) => {
        onChangeRef.current(domainsRef.current.filter(d => d._uid !== duid));
    }, []);

    const addDomain = () =>
        onChange([...domains, { _uid: uid(), hosts: [], routes: [{ _uid: uid(), match: { path_prefix: '/' }, policy: {} }] }]);

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
                <DomainCard
                    key={d._uid}
                    domain={d}
                    index={di}
                    disabled={disabled}
                    dataFiles={dataFiles}
                    updateDomain={updateDomain}
                    removeDomain={removeDomain}
                />
            ))}

            {!disabled && (
                <Button type="dashed" block icon={<PlusOutlined />} onClick={addDomain}>
                    Add domain
                </Button>
            )}
        </>
    );
};

export default DomainsEditor;
