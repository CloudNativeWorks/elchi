/**
 * Per-engine "can this engine actually work?" validation. The edge strict-checks
 * config, so an engine missing its load-bearing field (a JWT issuer, an OpenAPI
 * spec, any rate) is rejected there with an opaque error. We catch those in the
 * builder instead: each engine card surfaces the problem inline, and Save is
 * blocked with a located message.
 *
 * Deliberately conservative — only flags the cases where the engine genuinely
 * can't function, never style/preference, so it doesn't nag.
 */

import { PolicyFileModel, PolicySpec } from '../state/model';
import { ENGINE_DEFS } from './registry';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Validator = (v: any) => string[];

const list = (a?: unknown[]): boolean => Array.isArray(a) && a.length > 0;
const text = (s?: unknown): boolean => typeof s === 'string' && s.trim().length > 0;

/** key → validator returning a list of problems (empty = OK). */
export const ENGINE_VALIDATORS: Record<string, Validator> = {
    jwt: (v) => {
        const out: string[] = [];
        if (!text(v.issuer)) out.push('issuer is required');
        if (!text(v.public_key_file) && !text(v.hmac_secret)) {
            out.push('a verification key is required (public key file or HMAC secret)');
        }
        return out;
    },
    jwks: (v) => (!text(v.url) && !text(v.file) ? ['a JWK Set source is required (url or file)'] : []),
    api_key: (v) => (list(v.keys) ? [] : ['add at least one API key']),
    hmac_sign: (v) =>
        !text(v.secret) && !(v.secrets && Object.keys(v.secrets).length) ? ['a shared secret is required'] : [],
    http_signature: (v) => (text(v.secret) ? [] : ['a shared secret is required']),
    xfcc: (v) =>
        !v.require_present && !list(v.uris) && !list(v.dns_names) && !list(v.subjects) && !list(v.hashes)
            ? ['add an allowed identity (URI / DNS / subject / fingerprint) or enable "require present"']
            : [],
    ip_reputation: (v) =>
        !list(v.deny_cidrs) && !list(v.allow_cidrs) && !list(v.feeds) && !v.geoip
            ? ['configure at least one rule (CIDR list, threat feed, or GeoIP)']
            : [],
    rate_limit: (v) =>
        !v.requests_per_second || v.requests_per_second <= 0 ? ['requests per second must be greater than 0'] : [],
    coraza: (v) => {
        const out: string[] = [];
        if (!v.include_owasp && !text(v.directives) && !text(v.directives_file)) {
            out.push('enable the OWASP CRS or add at least one rule');
        }
        // Each excluded rule id must be a bare number or id range — the backend
        // concatenates them into SecLang and rejects anything else at load.
        const badIds = (v.exclude_rule_ids ?? []).filter((id: unknown) => !/^\d+(-\d+)?$/.test(String(id)));
        if (badIds.length) {
            out.push(`disabled rule ids must be numeric ids or ranges (e.g. 942100 or 942100-942999): ${badIds.join(', ')}`);
        }
        return out;
    },
    openapi: (v) => (text(v.spec_file) ? [] : ['an OpenAPI spec file is required']),
    dlp: (v) => (!list(v.block) && !list(v.redact) ? ['choose at least one detector to block or redact'] : []),
};

/** Problems for a single engine's value (empty = OK). */
export const validateEngineValue = (key: string, value: unknown): string[] => {
    const fn = ENGINE_VALIDATORS[key];
    if (!fn || value == null) return [];
    return fn(value);
};

const policyProblems = (p: PolicySpec, label: string): string[] => {
    const out: string[] = [];
    for (const def of ENGINE_DEFS) {
        const val = def.get(p);
        if (val === undefined) continue;
        for (const msg of validateEngineValue(def.key, val)) out.push(`${label} · ${def.label}: ${msg}`);
    }
    return out;
};

/**
 * Walk defaults + every domain/route policy and return located engine problems,
 * e.g. "api.example.com /api/ · JWT: issuer is required". Used to block Save.
 */
export const collectEngineProblems = (model: PolicyFileModel): string[] => {
    const out: string[] = [];
    const spec = model.spec;
    if (spec.defaults) out.push(...policyProblems(spec.defaults, 'Defaults'));
    // A host (including `*`) may appear only ONCE — Shield rejects the whole config
    // if the same host is defined in two domains (and, across the project, in two
    // policies). Catch the in-policy case here so Save is blocked with a clear reason.
    const seenHost = new Map<string, number>();
    (spec.domains ?? []).forEach((d, di) => {
        const host = d.hosts?.length ? d.hosts.join(', ') : `Domain #${di + 1}`;
        (d.hosts ?? []).forEach(h => {
            const key = h.trim().toLowerCase();
            if (!key) return;
            const prev = seenHost.get(key);
            if (prev !== undefined) {
                out.push(`Domain #${di + 1}: host "${h}" is already defined in domain #${prev + 1} — each host may appear only once`);
            } else {
                seenHost.set(key, di);
            }
        });
        if (d.policy) out.push(...policyProblems(d.policy, host));
        (d.routes ?? []).forEach((r, ri) => {
            const m = r.match ?? {};
            const path = m.path_exact ?? m.path_prefix ?? m.path_regex ?? `route #${ri + 1}`;
            if (r.policy) out.push(...policyProblems(r.policy, `${host} ${path}`));
        });
    });
    return out;
};
