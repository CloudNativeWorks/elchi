/**
 * Master-detail policy builder. The left rail is a compact tree of the whole
 * policy (Defaults · Bypass · Domains ▸ Routes); the right pane edits ONLY the
 * selected node. You're never looking at the entire policy at once — the
 * structure is scannable on the left, and you focus on one thing on the right.
 *
 * Reads/writes the typed model through the store (PATCH), keying domains/routes
 * by their stable client-only `_uid`.
 */

import React, { useMemo, useState } from 'react';
import { Button, Col, Empty, Input, Row, Segmented, Select, Space, Tooltip, Typography } from 'antd';
import {
    DeleteOutlined,
    DownOutlined,
    ExclamationCircleFilled,
    GlobalOutlined,
    PlusOutlined,
    RightOutlined,
    SafetyOutlined,
    StopOutlined,
} from '@ant-design/icons';
import { usePolicyEditor } from '../../state/policyStore';
import { DomainSpec, MatchSpec, PolicySpec, RouteSpec, uid } from '../../state/model';
import { FieldShell } from '../../engines/fields';
import { enabledEngines } from '../../engines/registry';
import { validateEngineValue } from '../../engines/validation';
import PolicySettings, { MODE_META } from './PolicySettings';
import EnginePanel from './EnginePanel';
import Section from './Section';

const { Text } = Typography;

const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'].map(m => ({ value: m, label: m }));

type PathKind = 'path_prefix' | 'path_exact' | 'path_regex';
const KIND_LABEL: Record<PathKind, string> = { path_prefix: 'prefix', path_exact: 'exact', path_regex: 'regex' };
const pathKindOf = (m: MatchSpec): PathKind =>
    m.path_exact !== undefined ? 'path_exact' : m.path_regex !== undefined ? 'path_regex' : 'path_prefix';
const routePath = (m: MatchSpec): string => m.path_exact ?? m.path_prefix ?? m.path_regex ?? '/';

const routeHasProblem = (p: PolicySpec): boolean =>
    enabledEngines(p).some(d => validateEngineValue(d.key, d.get(p) ?? {}).length > 0);

type Sel =
    | { kind: 'defaults' }
    | { kind: 'exclude' }
    | { kind: 'domain'; duid: string }
    | { kind: 'route'; duid: string; ruid: string };

// ─── left rail ───────────────────────────────────────────────────────────────

const NavRow: React.FC<{
    active?: boolean;
    indent?: number;
    onClick: () => void;
    icon?: React.ReactNode;
    label: React.ReactNode;
    suffix?: React.ReactNode;
    onDelete?: () => void;
}> = ({ active, indent = 0, onClick, icon, label, suffix, onDelete }) => (
    <div
        onClick={onClick}
        style={{
            display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
            padding: '6px 8px', paddingLeft: 8 + indent * 16, borderRadius: 8, marginBottom: 2,
            background: active ? 'var(--color-primary-bg, rgba(22,119,255,0.12))' : undefined,
            border: `1px solid ${active ? 'var(--color-primary-border, rgba(22,119,255,0.4))' : 'transparent'}`,
        }}
    >
        {icon}
        <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13 }}>{label}</span>
        {suffix}
        {onDelete && (
            <Tooltip title="Remove">
                <Button type="text" danger size="small" icon={<DeleteOutlined />}
                    onClick={(e) => { e.stopPropagation(); onDelete(); }} />
            </Tooltip>
        )}
    </div>
);

// ─── match / hosts editors ─────────────────────────────────────────────────

const MatchEditor: React.FC<{ match: MatchSpec; onChange: (m: MatchSpec) => void; disabled?: boolean }> = ({ match, onChange, disabled }) => {
    const kind = pathKindOf(match);
    const value = match[kind] ?? '';
    const setKind = (next: PathKind) => {
        const v = match.path_exact ?? match.path_prefix ?? match.path_regex;
        onChange({ ...match, path_exact: undefined, path_prefix: undefined, path_regex: undefined, [next]: v });
    };
    return (
        <Row gutter={12} align="top">
            <Col xs={24} md={7}>
                <FieldShell label="Path Match" tooltip="How the request path is matched: Prefix (starts with), Exact, or Regex (RE2). Uses the normalized, percent-decoded path.">
                    <Segmented size="small" disabled={disabled} value={kind}
                        options={[{ label: 'Prefix', value: 'path_prefix' }, { label: 'Exact', value: 'path_exact' }, { label: 'Regex', value: 'path_regex' }]}
                        onChange={v => setKind(v as PathKind)} />
                </FieldShell>
            </Col>
            <Col xs={24} md={9}>
                <FieldShell label="Path" tooltip="Empty matches every request to the domain (the domain's default route)." hint={kind === 'path_regex' ? 'RE2, e.g. ^/api/v[0-9]+/' : 'e.g. /api/'}>
                    <Input size="small" style={{ fontFamily: 'monospace' }} disabled={disabled} value={value}
                        placeholder={kind === 'path_exact' ? '/healthz' : kind === 'path_regex' ? '^/api/v[0-9]+/' : '/api/'}
                        onChange={e => onChange({ ...match, [kind]: e.target.value || undefined })} />
                </FieldShell>
            </Col>
            <Col xs={24} md={8}>
                <FieldShell label="Methods" tooltip="HTTP methods this route applies to. Empty = all methods.">
                    <Select size="small" mode="multiple" style={{ width: '100%' }} placeholder="All methods" disabled={disabled}
                        value={match.methods ?? []} options={METHODS}
                        onChange={v => onChange({ ...match, methods: v.length ? v : undefined })} />
                </FieldShell>
            </Col>
        </Row>
    );
};

const ModeDot: React.FC<{ mode?: string }> = ({ mode }) => {
    const color = mode ? (MODE_META[mode as keyof typeof MODE_META]?.color ?? '#999') : 'var(--text-secondary,#999)';
    return <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, display: 'inline-block', flex: '0 0 auto' }} />;
};

// ─── builder ───────────────────────────────────────────────────────────────

const PolicyBuilder: React.FC<{ disabled?: boolean }> = ({ disabled }) => {
    const { state, dispatch } = usePolicyEditor();
    const spec = state.model.spec;
    const defaults = spec.defaults ?? {};
    const domains = useMemo(() => spec.domains ?? [], [spec.domains]);
    const exclude = spec.exclude ?? [];

    const [sel, setSel] = useState<Sel>({ kind: 'defaults' });
    const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

    const patchSpec = (fn: (s: typeof spec) => typeof spec) =>
        dispatch({ type: 'PATCH', update: m => ({ ...m, spec: fn(m.spec) }) });
    const setDomains = (ds: DomainSpec[]) => patchSpec(s => ({ ...s, domains: ds }));
    const updateDomain = (duid: string, next: DomainSpec) => setDomains(domains.map(d => d._uid === duid ? next : d));

    const addDomain = () => {
        const nd: DomainSpec = { _uid: uid(), hosts: [], routes: [{ _uid: uid(), match: { path_prefix: '/' }, policy: {} }] };
        setDomains([...domains, nd]);
        setSel({ kind: 'domain', duid: nd._uid! });
    };
    const removeDomain = (duid: string) => {
        setDomains(domains.filter(d => d._uid !== duid));
        setSel({ kind: 'defaults' });
    };
    const addRoute = (duid: string) => {
        const d = domains.find(x => x._uid === duid);
        if (!d) return;
        const nr: RouteSpec = { _uid: uid(), match: { path_prefix: '/' }, policy: {} };
        updateDomain(duid, { ...d, routes: [...(d.routes ?? []), nr] });
        setSel({ kind: 'route', duid, ruid: nr._uid! });
    };
    const removeRoute = (duid: string, ruid: string) => {
        const d = domains.find(x => x._uid === duid);
        if (!d) return;
        updateDomain(duid, { ...d, routes: (d.routes ?? []).filter(r => r._uid !== ruid) });
        setSel({ kind: 'domain', duid });
    };
    const toggleCollapse = (duid: string) =>
        setCollapsed(prev => { const n = new Set(prev); if (n.has(duid)) n.delete(duid); else n.add(duid); return n; });

    // ── left rail ──
    const nav = (
        <div style={{ flex: '0 0 300px', width: 300, overflowY: 'auto', border: '1px solid var(--border-default)', borderRadius: 12, padding: 8, background: 'var(--card-bg)' }}>
            <NavRow active={sel.kind === 'defaults'} onClick={() => setSel({ kind: 'defaults' })}
                icon={<SafetyOutlined style={{ color: 'var(--color-primary)' }} />} label="Policy Defaults" />
            <NavRow active={sel.kind === 'exclude'} onClick={() => setSel({ kind: 'exclude' })}
                icon={<StopOutlined style={{ color: 'var(--text-secondary)' }} />} label="Bypass paths"
                suffix={exclude.length ? <Text type="secondary" style={{ fontSize: 11 }}>{exclude.length}</Text> : undefined} />

            <div style={{ display: 'flex', alignItems: 'center', padding: '8px 8px 4px' }}>
                <Text type="secondary" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.4, flex: 1 }}>Domains</Text>
                {!disabled && <Button type="text" size="small" icon={<PlusOutlined />} onClick={addDomain} />}
            </div>

            {domains.length === 0 && (
                <Text type="secondary" style={{ fontSize: 12, padding: '0 8px' }}>No domains yet — add one.</Text>
            )}

            {domains.map((d, di) => {
                const duid = d._uid!;
                const open = !collapsed.has(duid);
                const routes = d.routes ?? [];
                const domainProblem = routes.some(r => routeHasProblem(r.policy ?? {}));
                const title = d.hosts?.length ? d.hosts.join(', ') : `Domain #${di + 1}`;
                return (
                    <div key={duid}>
                        <NavRow
                            active={sel.kind === 'domain' && sel.duid === duid}
                            onClick={() => setSel({ kind: 'domain', duid })}
                            icon={
                                <span onClick={(e) => { e.stopPropagation(); toggleCollapse(duid); }} style={{ color: 'var(--text-secondary)', display: 'inline-flex' }}>
                                    {open ? <DownOutlined /> : <RightOutlined />}
                                </span>
                            }
                            label={<><GlobalOutlined style={{ color: 'var(--color-primary)', marginRight: 6 }} />{title}</>}
                            suffix={domainProblem ? <ExclamationCircleFilled style={{ color: 'var(--color-warning,#faad14)', fontSize: 12 }} /> : undefined}
                            onDelete={disabled ? undefined : () => removeDomain(duid)}
                        />
                        {open && routes.map((r) => {
                            const ruid = r._uid!;
                            const m = r.match ?? {};
                            const p = r.policy ?? {};
                            return (
                                <NavRow
                                    key={ruid}
                                    indent={1}
                                    active={sel.kind === 'route' && sel.ruid === ruid}
                                    onClick={() => setSel({ kind: 'route', duid, ruid })}
                                    icon={<ModeDot mode={p.mode} />}
                                    label={<span style={{ fontFamily: 'monospace', fontSize: 12 }}>{routePath(m)}</span>}
                                    suffix={routeHasProblem(p) ? <ExclamationCircleFilled style={{ color: 'var(--color-warning,#faad14)', fontSize: 12 }} /> : undefined}
                                    onDelete={disabled ? undefined : () => removeRoute(duid, ruid)}
                                />
                            );
                        })}
                        {open && !disabled && (
                            <div style={{ paddingLeft: 24 }}>
                                <Button type="link" size="small" icon={<PlusOutlined />} onClick={() => addRoute(duid)} style={{ padding: 0, fontSize: 12 }}>route</Button>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );

    // ── right detail ──
    const detail = (() => {
        if (sel.kind === 'defaults') {
            return (
                <>
                    <Section title="Policy Defaults" extra={<Text type="secondary" style={{ fontSize: 12 }}>apply to every route unless overridden</Text>}>
                        <PolicySettings variant="defaults" policy={defaults} disabled={disabled}
                            onChange={p => patchSpec(s => ({ ...s, defaults: p }))} />
                    </Section>
                    <Section title="Default protections">
                        <EnginePanel policy={defaults} disabled={disabled} dataFiles={state.dataFiles}
                            onChange={p => patchSpec(s => ({ ...s, defaults: p }))} />
                    </Section>
                </>
            );
        }
        if (sel.kind === 'exclude') {
            return (
                <Section title="Bypass paths">
                    <FieldShell
                        label="Excluded paths"
                        tooltip="Request paths that bypass ALL inspection (checked before policy resolution). Use for health checks, metrics scrapes, static assets. Absolute paths, exact match, query ignored."
                        hint="Type a path and press Enter — e.g. /healthz, /metrics"
                    >
                        <Select size="small" mode="tags" style={{ width: '100%' }} placeholder="/healthz, /metrics" disabled={disabled}
                            value={exclude} tokenSeparators={[',', ' ']} options={[]}
                            onChange={(v: string[]) => patchSpec(s => ({ ...s, exclude: v.length ? v : undefined }))} />
                    </FieldShell>
                </Section>
            );
        }
        const domain = domains.find(d => d._uid === sel.duid);
        if (!domain) return <Empty description="Select something on the left" style={{ marginTop: 64 }} />;

        if (sel.kind === 'domain') {
            return (
                <Section title={<Space><GlobalOutlined style={{ color: 'var(--color-primary)' }} />Domain</Space>}>
                    <FieldShell
                        label="Hosts"
                        tooltip="Request Hosts/authorities this domain protects. Each entry: an exact host, a leading wildcard (*.example.com), or * (any host). Most specific match wins."
                        hint="Type and press Enter — e.g. api.example.com, *.example.com, *"
                    >
                        <Select size="small" mode="tags" style={{ width: '100%' }} placeholder="api.example.com" disabled={disabled}
                            value={domain.hosts ?? []} tokenSeparators={[',', ' ']} options={[]}
                            onChange={(v: string[]) => updateDomain(domain._uid!, { ...domain, hosts: v.length ? v : undefined })} />
                    </FieldShell>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        {(domain.routes ?? []).length} route{(domain.routes ?? []).length === 1 ? '' : 's'} — pick one on the left to edit its match, mode and protections.
                    </Text>
                </Section>
            );
        }

        const route = (domain.routes ?? []).find(r => r._uid === sel.ruid);
        if (!route) return <Empty description="Select a route on the left" style={{ marginTop: 64 }} />;
        const policy = route.policy ?? {};
        const setRoute = (next: RouteSpec) =>
            updateDomain(domain._uid!, { ...domain, routes: (domain.routes ?? []).map(r => r._uid === route._uid ? next : r) });
        const host = domain.hosts?.length ? domain.hosts.join(', ') : `Domain #${domains.indexOf(domain) + 1}`;
        return (
            <>
                <div style={{ marginBottom: 10 }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>{host} </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>›</Text>
                    <Text style={{ fontFamily: 'monospace', fontSize: 13, marginLeft: 6 }}>{routePath(route.match ?? {})}</Text>
                    <Text type="secondary" style={{ fontSize: 12, marginLeft: 6 }}>({KIND_LABEL[pathKindOf(route.match ?? {})]})</Text>
                </div>
                <Section title="Match & mode">
                    <MatchEditor match={route.match ?? {}} disabled={disabled} onChange={m => setRoute({ ...route, match: m })} />
                    <PolicySettings variant="route" policy={policy} disabled={disabled} onChange={p => setRoute({ ...route, policy: p })} />
                </Section>
                <Section title="Protections">
                    <EnginePanel compact policy={policy} disabled={disabled} dataFiles={state.dataFiles} onChange={p => setRoute({ ...route, policy: p })} />
                </Section>
            </>
        );
    })();

    return (
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', height: 'calc(100vh - 240px)', minHeight: 460 }}>
            {nav}
            <div style={{ flex: 1, minWidth: 0, overflowY: 'auto', paddingRight: 4 }}>{detail}</div>
        </div>
    );
};

export default PolicyBuilder;
