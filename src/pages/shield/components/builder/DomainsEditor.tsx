/**
 * Domains & routes editor (compact). Each domain is a collapsible card; its
 * routes are one-line summary rows (path · kind · methods · mode · N
 * protections) that expand inline to the full editor. This keeps a policy with
 * many routes scannable instead of a wall of always-open cards.
 *
 * Rows are keyed by a stable client-only `_uid` and split into memoized
 * DomainCard/RouteCard with stable per-uid callbacks, so editing one field
 * re-renders only that row.
 */

import React, { useCallback, useRef, useState } from 'react';
import { Button, Col, Empty, Input, Row, Segmented, Select, Space, Tooltip, Typography } from 'antd';
import {
    DeleteOutlined,
    DownOutlined,
    ExclamationCircleFilled,
    GlobalOutlined,
    PlusOutlined,
    RightOutlined,
} from '@ant-design/icons';
import { DataFileModel, DomainSpec, MatchSpec, PolicySpec, RouteSpec, uid } from '../../state/model';
import { FieldShell } from '../../engines/fields';
import { enabledEngines } from '../../engines/registry';
import { validateEngineValue } from '../../engines/validation';
import EnginePanel from './EnginePanel';
import PolicySettings, { MODE_META } from './PolicySettings';

const { Text } = Typography;

const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'].map(m => ({ value: m, label: m }));

type PathKind = 'path_prefix' | 'path_exact' | 'path_regex';
const KIND_LABEL: Record<PathKind, string> = { path_prefix: 'prefix', path_exact: 'exact', path_regex: 'regex' };

const pathKindOf = (m: MatchSpec): PathKind =>
    m.path_exact !== undefined ? 'path_exact' : m.path_regex !== undefined ? 'path_regex' : 'path_prefix';

const Dot: React.FC = () => <Text type="secondary" style={{ fontSize: 12 }}> · </Text>;

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

/** Small mode pill for the route summary (inherit = muted). */
const ModeChip: React.FC<{ mode?: string }> = ({ mode }) => {
    const meta = mode ? MODE_META[mode as keyof typeof MODE_META] : undefined;
    const color = meta?.color ?? 'var(--text-secondary, #999)';
    return (
        <span style={{
            fontSize: 11, lineHeight: '16px', padding: '0 7px', borderRadius: 6,
            color, border: `1px solid ${color}55`, background: `${color}14`, whiteSpace: 'nowrap',
        }}>
            {meta?.label ?? 'inherit'}
        </span>
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
    const m = route.match ?? {};
    const policy = route.policy ?? {};
    const kind = pathKindOf(m);
    const pathVal = m[kind] ?? '';
    const methods = m.methods?.length ? m.methods.join(', ') : 'all methods';
    const engs = enabledEngines(policy);
    const hasProblems = engs.some(d => validateEngineValue(d.key, d.get(policy) ?? {}).length > 0);

    // New/empty routes start open for editing; configured ones start collapsed.
    const [open, setOpen] = useState(() => engs.length === 0 && !policy.mode && (!pathVal || pathVal === '/'));

    const onMatch = (mm: MatchSpec) => updateRoute(ruid, { ...route, match: mm });
    const onPolicy = (p: PolicySpec) => updateRoute(ruid, { ...route, policy: p });

    return (
        <div style={{ border: '1px solid var(--border-default)', borderRadius: 10, marginBottom: 6, overflow: 'hidden' }}>
            <div
                onClick={() => setOpen(o => !o)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 10px', cursor: 'pointer', flexWrap: 'wrap' }}
            >
                <span style={{ color: 'var(--text-secondary)' }}>{open ? <DownOutlined /> : <RightOutlined />}</span>
                <Text code style={{ fontSize: 12 }}>{pathVal || '/'}</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>{KIND_LABEL[kind]}</Text>
                <Dot /><Text type="secondary" style={{ fontSize: 12 }}>{methods}</Text>
                <Dot /><ModeChip mode={policy.mode} />
                <Dot /><Text type="secondary" style={{ fontSize: 12 }}>{engs.length} protection{engs.length === 1 ? '' : 's'}</Text>
                {hasProblems && (
                    <Tooltip title="A protection on this route is missing a required field">
                        <ExclamationCircleFilled style={{ color: 'var(--color-warning, #faad14)', fontSize: 13 }} />
                    </Tooltip>
                )}
                <div style={{ flex: 1 }} />
                {!disabled && (
                    <Tooltip title="Remove route">
                        <Button type="text" danger size="small" icon={<DeleteOutlined />}
                            onClick={(e) => { e.stopPropagation(); removeRoute(ruid); }} />
                    </Tooltip>
                )}
            </div>
            {open && (
                <div style={{ padding: '4px 10px 10px', borderTop: '1px solid var(--border-light, var(--border-default))' }}>
                    <MatchEditor match={m} disabled={disabled} onChange={onMatch} />
                    <PolicySettings variant="route" policy={policy} disabled={disabled} onChange={onPolicy} />
                    <div style={{ marginTop: 8 }}>
                        <EnginePanel compact policy={policy} disabled={disabled} dataFiles={dataFiles} onChange={onPolicy} />
                    </div>
                </div>
            )}
        </div>
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
    const [open, setOpen] = useState(true);
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

    const routeCount = (domain.routes ?? []).length;
    const title = domain.hosts?.length ? domain.hosts.join(', ') : `Domain #${index + 1}`;

    return (
        <div style={{ border: '1px solid var(--border-default)', borderRadius: 12, marginBottom: 12, background: 'var(--card-bg)', overflow: 'hidden' }}>
            <div
                onClick={() => setOpen(o => !o)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', cursor: 'pointer' }}
            >
                <span style={{ color: 'var(--text-secondary)' }}>{open ? <DownOutlined /> : <RightOutlined />}</span>
                <GlobalOutlined style={{ color: 'var(--color-primary)' }} />
                <Text strong>{title}</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>· {routeCount} route{routeCount === 1 ? '' : 's'}</Text>
                <div style={{ flex: 1 }} />
                {!disabled && (
                    <Tooltip title="Remove domain">
                        <Button type="text" danger icon={<DeleteOutlined />}
                            onClick={(e) => { e.stopPropagation(); removeDomain(duid); }} />
                    </Tooltip>
                )}
            </div>

            {open && (
                <div style={{ padding: '0 14px 14px' }}>
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
                </div>
            )}
        </div>
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
                <div style={{ border: '1px dashed var(--border-default)', borderRadius: 12, marginBottom: 12, padding: 16 }}>
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
                </div>
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
