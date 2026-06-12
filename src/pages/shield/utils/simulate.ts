/**
 * Client-side policy "dry-run": given a sample request (host/method/path), work
 * out which domain + route the edge would select and what the effective policy
 * is — mirroring elchi-shield's resolver:
 *   • host: most-specific match wins (exact ≫ "*.suffix" by length > "*")
 *   • path/host are normalized (percent-decoded, dot-segments collapsed)
 *   • routes are tried most-specific first (exact > regex > prefix > any)
 *   • policies fold defaults → domain → route, field-by-field, and ENGINES
 *     REPLACE WHOLESALE when a narrower scope sets them (not a union)
 *   • spec.exclude paths bypass everything
 *
 * Header / content-type route conditions can't be evaluated from host+method+
 * path alone, so a route that relies on them is reported with a caveat rather
 * than a false-certain match.
 */

import { DomainSpec, MatchSpec, PolicyFileModel, PolicySpec } from '../state/model';
import { ENGINE_DEFS, enabledEngines } from '../engines/registry';

export interface SimInput {
    host: string;
    method: string;
    path: string;
    contentType?: string;
}

export interface SimEngine {
    key: string;
    label: string;
    phase: 'header' | 'body';
}

export interface SimResult {
    normalizedHost: string;
    normalizedPath: string;
    /** Path matched a spec.exclude entry → all inspection bypassed. */
    excluded?: string;
    /** No domain matched → the no-policy default posture applies. */
    noDomainMatch?: boolean;
    domain?: { index: number; hosts: string[]; matchedEntry: string };
    /** The winning route, or undefined when the domain's default policy applies. */
    route?: { index: number; label: string };
    usedDomainDefault?: boolean;
    /** Effective resolved values. */
    mode: string;
    failMode: string;
    inspectRequestBody: boolean;
    inspectResponseBody: boolean;
    engines: SimEngine[];
    /** Caveats (e.g. unevaluated header conditions) and explanatory notes. */
    caveats: string[];
}

// ─── normalization (mirrors internal/matcher) ────────────────────────────────

export const normalizeHost = (raw: string): string => {
    let s = raw.trim().toLowerCase();
    const at = s.lastIndexOf('@');
    if (at >= 0) s = s.slice(at + 1); // strip userinfo
    if (!s.startsWith('[')) {
        const colon = s.lastIndexOf(':');
        if (colon >= 0) s = s.slice(0, colon); // strip port (skip IPv6 literals)
    }
    if (s.endsWith('.')) s = s.slice(0, -1); // strip trailing dot
    return s;
};

export const normalizePath = (raw: string): string => {
    let p = raw;
    const q = p.indexOf('?');
    if (q >= 0) p = p.slice(0, q);
    const h = p.indexOf('#');
    if (h >= 0) p = p.slice(0, h);
    try { p = decodeURIComponent(p); } catch { /* keep malformed as-is */ }
    if (!p) return raw;
    const trailing = p.endsWith('/');
    const out: string[] = [];
    for (const seg of p.split('/')) {
        if (seg === '' || seg === '.') continue;
        if (seg === '..') { out.pop(); continue; }
        out.push(seg);
    }
    let cleaned = '/' + out.join('/');
    if (cleaned !== '/' && trailing) cleaned += '/';
    return cleaned;
};

// ─── matching ────────────────────────────────────────────────────────────────

/** {matched, specificity}; specificity: exact ≫ wildcard (by suffix len) > "*". */
const hostEntryMatch = (entry: string, host: string): { matched: boolean; spec: number } => {
    const e = entry.trim().toLowerCase();
    if (e === '*') return { matched: true, spec: 0 };
    if (e.startsWith('*.')) {
        const suffix = e.slice(1); // ".example.com"
        return { matched: host.length > suffix.length && host.endsWith(suffix), spec: suffix.length };
    }
    const ex = e.endsWith('.') ? e.slice(0, -1) : e;
    return { matched: host === ex, spec: 1_000_000 }; // exact always outranks any wildcard
};

type PathKind = 'exact' | 'regex' | 'prefix' | 'any';
const pathKindOf = (m: MatchSpec): PathKind =>
    m.path_exact !== undefined ? 'exact' : m.path_regex !== undefined ? 'regex' : m.path_prefix !== undefined ? 'prefix' : 'any';
const ROUTE_SPECIFICITY: Record<PathKind, number> = { exact: 3, regex: 2, prefix: 1, any: 0 };

const pathMatches = (m: MatchSpec, np: string): boolean => {
    if (m.path_exact !== undefined) return np === m.path_exact;
    if (m.path_regex !== undefined) {
        try { return new RegExp(m.path_regex).test(np); } catch { return false; }
    }
    if (m.path_prefix !== undefined) return np.startsWith(m.path_prefix);
    return true; // no path condition
};

const methodMatches = (m: MatchSpec, method: string): boolean =>
    !m.methods || m.methods.length === 0 || m.methods.map(x => x.toUpperCase()).includes(method.toUpperCase());

const contentTypeMatches = (m: MatchSpec, ct?: string): 'yes' | 'no' | 'unknown' => {
    if (!m.content_type || m.content_type.length === 0) return 'yes';
    if (!ct) return 'unknown';
    return m.content_type.some(t => ct.toLowerCase().includes(t.toLowerCase())) ? 'yes' : 'no';
};

// ─── policy folding (defaults → domain → route) ──────────────────────────────

/** Last defined value across the chain (least-specific first). */
const pick = <T>(chain: (T | undefined)[]): T | undefined => {
    let v: T | undefined;
    for (const c of chain) if (c !== undefined) v = c;
    return v;
};

const effectiveEngines = (chain: PolicySpec[]): SimEngine[] => {
    // Engines and checks.body replace wholesale, so take the most-specific that
    // sets them — exactly what the edge does.
    const engines = pick(chain.map(p => p.engines));
    const body = pick(chain.map(p => p.checks?.body));
    const synthetic: PolicySpec = {
        engines,
        checks: body ? { body } : undefined,
    };
    // Header-phase engines run before body-phase ones; registry order within each.
    return enabledEngines(synthetic)
        .slice()
        .sort((a, b) => (a.phase === b.phase ? 0 : a.phase === 'header' ? -1 : 1))
        .map(d => ({ key: d.key, label: d.label, phase: d.phase }));
};

const domainLabel = (d: DomainSpec, i: number): string[] => d.hosts?.length ? d.hosts : [`Domain #${i + 1}`];
const routeLabel = (m: MatchSpec, i: number): string =>
    m.path_exact ?? m.path_prefix ?? m.path_regex ?? `route #${i + 1}`;

/** Simulate the edge's resolution of a request against the builder model. */
export const simulateRequest = (model: PolicyFileModel, input: SimInput): SimResult => {
    const host = normalizeHost(input.host);
    const np = normalizePath(input.path);
    const spec = model.spec;
    const defaults = spec.defaults ?? {};
    const caveats: string[] = [];

    const base: Omit<SimResult, 'mode' | 'failMode' | 'inspectRequestBody' | 'inspectResponseBody' | 'engines' | 'caveats'> = {
        normalizedHost: host,
        normalizedPath: np,
    };

    // 1) Exclude paths bypass everything (compared as normalized, query-stripped).
    for (const ex of spec.exclude ?? []) {
        if (normalizePath(ex) === np) {
            return {
                ...base, excluded: ex, mode: 'off', failMode: '—',
                inspectRequestBody: false, inspectResponseBody: false, engines: [], caveats,
            };
        }
    }

    // 2) Most-specific matching domain.
    let best: { domain: DomainSpec; index: number; entry: string; spec: number } | undefined;
    (spec.domains ?? []).forEach((d, index) => {
        let dSpec = -1;
        let entry = '';
        for (const e of d.hosts ?? []) {
            const r = hostEntryMatch(e, host);
            if (r.matched && r.spec > dSpec) { dSpec = r.spec; entry = e; }
        }
        if (dSpec >= 0 && (!best || dSpec > best.spec)) best = { domain: d, index, entry, spec: dSpec };
    });

    if (!best) {
        return {
            ...base, noDomainMatch: true, mode: '— (no policy)', failMode: '—',
            inspectRequestBody: false, inspectResponseBody: false, engines: [],
            caveats: ['No domain matched this host — the no-policy default posture applies (allow/continue unless the instance default is deny).'],
        };
    }

    base.domain = { index: best.index, hosts: domainLabel(best.domain, best.index), matchedEntry: best.entry };

    // 3) Most-specific matching route (exact > regex > prefix > any), first wins.
    const routes = (best.domain.routes ?? []).map((r, index) => ({ r, index }));
    routes.sort((a, b) => ROUTE_SPECIFICITY[pathKindOf(b.r.match ?? {})] - ROUTE_SPECIFICITY[pathKindOf(a.r.match ?? {})]);

    let winner: { r: typeof routes[number]['r']; index: number } | undefined;
    for (const { r, index } of routes) {
        const m = r.match ?? {};
        if (!pathMatches(m, np) || !methodMatches(m, input.method)) continue;
        const ct = contentTypeMatches(m, input.contentType);
        if (ct === 'no') continue;
        winner = { r, index };
        if (ct === 'unknown') caveats.push(`Route "${routeLabel(m, index)}" also requires content-type ${m.content_type?.join('/')} — not evaluated here.`);
        if (m.headers?.length) caveats.push(`Route "${routeLabel(m, index)}" also has header conditions — not evaluated here.`);
        break;
    }

    const chain: PolicySpec[] = [defaults];
    if (best.domain.policy) chain.push(best.domain.policy);
    if (winner) {
        chain.push(winner.r.policy ?? {});
        base.route = { index: winner.index, label: routeLabel(winner.r.match ?? {}, winner.index) };
    } else {
        base.usedDomainDefault = true;
        caveats.push('No route matched — the domain default policy applies.');
    }

    const mode = pick(chain.map(p => p.mode)) ?? 'block';
    const failMode = pick(chain.map(p => p.fail_mode)) ?? 'fail_open';
    const inspectRequestBody = pick(chain.map(p => p.inspect_request_body)) ?? false;
    const inspectResponseBody = pick(chain.map(p => p.inspect_response_body)) ?? false;
    const engines = effectiveEngines(chain);

    if (mode === 'off') caveats.push('Mode is "off" — the request is passed through without inspection.');

    return { ...base, mode, failMode, inspectRequestBody, inspectResponseBody, engines, caveats };
};

/** Engine label for a key (for chips that reference an engine by key). */
export const engineLabel = (key: string): string => ENGINE_DEFS.find(d => d.key === key)?.label ?? key;
