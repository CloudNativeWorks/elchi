/**
 * Typed mirror of elchi-shield's config schema (internal/config/types.go —
 * property names are the EXACT yaml tags, so the model serializes straight to
 * the YAML shield parses; no field-mapping layer). SCHEMA below is the
 * allowed-key map used to detect content the builder can't represent (shield
 * strict-decodes, so unknown keys are edge-side config errors anyway).
 */

export type PolicyMode = 'block' | 'detect' | 'shadow' | 'off';
export type FailMode = 'fail_open' | 'fail_close';

// ─── Engines (spec.…​.engines.*) ─────────────────────────────────────────────

export interface JwtSpec {
    issuer?: string;
    audience?: string;
    algorithms?: string[];
    hmac_secret?: string;
    public_key_file?: string;
    required_claims?: string[];
    header_name?: string;
    leeway?: string;
}

export interface JwksSpec {
    file?: string;
    url?: string;
    issuer?: string;
    audience?: string;
    algorithms?: string[];
    required_claims?: string[];
    header_name?: string;
    leeway?: string;
    refresh_interval?: string;
    http_timeout?: string;
}

export interface CorazaSpec {
    directives?: string;
    directives_file?: string;
    include_owasp?: boolean;
    exclude_rule_ids?: string[];
    paranoia_level?: number;
    detection_paranoia_level?: number;
    inbound_anomaly_threshold?: number;
    outbound_anomaly_threshold?: number;
}

export interface RateLimitSpec {
    requests_per_second?: number;
    burst?: number;
    key?: string;
    header?: string;
}

export interface FeedSpec {
    name?: string;
    file?: string;
    format?: string;
    severity?: string;
}

export interface GeoIpSpec {
    database_file?: string;
    asn_database_file?: string;
    block_countries?: string[];
    allow_countries?: string[];
    block_asns?: number[];
    on_missing?: string;
}

export interface IpReputationSpec {
    allow_cidrs?: string[];
    deny_cidrs?: string[];
    feeds?: FeedSpec[];
    geoip?: GeoIpSpec;
}

export interface BotUaSpec {
    deny_substrings?: string[];
    block_empty?: boolean;
    score_known_bot?: number;
}

export interface BotVerifiedSpec {
    name?: string;
    file?: string;
    format?: string;
    ua_match?: string;
}

export interface BotTlsSpec {
    ja4_header?: string;
    ja3_header?: string;
    deny_ja4?: string[];
    deny_ja3?: string[];
    score_ja4?: Record<string, number>;
    tool_ja4?: string[];
}

export interface BotHeuristicsSpec {
    require_accept?: boolean;
    require_accept_language?: boolean;
    require_accept_encoding?: boolean;
    score_per_anomaly?: number;
}

export interface BotSpec {
    score_threshold?: number;
    emit_score?: boolean;
    user_agent?: BotUaSpec;
    verified_bots?: BotVerifiedSpec[];
    tls_fingerprint?: BotTlsSpec;
    heuristics?: BotHeuristicsSpec;
}

export interface ApiKeyEntrySpec {
    sha256?: string;
    key?: string;
    subject?: string;
    scopes?: string[];
}

export interface ScopeBindingSpec {
    path_prefix?: string;
    scope?: string;
}

export interface ApiKeySpec {
    source?: string;
    name?: string;
    keys?: ApiKeyEntrySpec[];
    require_scope_for_path?: ScopeBindingSpec[];
}

export interface HmacSignSpec {
    secret?: string;
    secrets?: Record<string, string>;
    signature_header?: string;
    timestamp_header?: string;
    nonce_header?: string;
    key_id_header?: string;
    algorithm?: string;
    window?: string;
    nonce_ttl?: string;
    require_nonce?: boolean;
    require_body_digest?: boolean;
}

export interface HttpSignatureSpec {
    secret?: string;
    signature_name?: string;
    covered_components?: string[];
    max_age?: string;
}

export interface XfccSpec {
    header_name?: string;
    require_present?: boolean;
    uris?: string[];
    dns_names?: string[];
    subjects?: string[];
    hashes?: string[];
}

export interface GraphqlSpec {
    content_types?: string[];
    paths?: string[];
    max_depth?: number;
    max_aliases?: number;
    max_root_fields?: number;
    max_total_fields?: number;
    max_operations?: number;
    block_introspection?: boolean;
    max_fragment_depth?: number;
    max_complexity?: number;
}

export interface OpenApiSpec {
    spec_file?: string;
    validate_request_body?: boolean;
    reject_undeclared_path?: boolean;
}

export interface EnginesSpec {
    jwt?: JwtSpec;
    coraza?: CorazaSpec;
    rate_limit?: RateLimitSpec;
    ip_reputation?: IpReputationSpec;
    bot?: BotSpec;
    api_key?: ApiKeySpec;
    hmac_sign?: HmacSignSpec;
    http_signature?: HttpSignatureSpec;
    jwks?: JwksSpec;
    xfcc?: XfccSpec;
    graphql?: GraphqlSpec;
    openapi?: OpenApiSpec;
}

// ─── Built-in checks (spec.…​.checks) — DLP lives HERE, not under engines ────

export interface DlpSpec {
    direction?: string;
    block?: string[];
    redact?: string[];
}

export interface HeaderChecksSpec {
    forbidden?: string[];
    required?: string[];
    max_header_value_bytes?: number;
    enforce_valid_host?: boolean;
}

export interface BodyChecksSpec {
    require_json?: boolean;
    detect_sensitive_data?: boolean;
    dlp?: DlpSpec;
}

export interface ChecksSpec {
    headers?: HeaderChecksSpec;
    body?: BodyChecksSpec;
}

// ─── Policy / routing ────────────────────────────────────────────────────────

export interface PipelineSpec {
    request?: string[];
    response?: string[];
}

export interface PolicySpec {
    mode?: PolicyMode;
    fail_mode?: FailMode;
    inspect_request_body?: boolean;
    inspect_response_body?: boolean;
    max_request_body_bytes?: number;
    max_response_body_bytes?: number;
    max_header_bytes?: number;
    timeout?: string;
    log_level?: string;
    sampling_rate?: number;
    anomaly_threshold?: number;
    skip_checks?: string[];
    pipeline?: PipelineSpec;
    checks?: ChecksSpec;
    engines?: EnginesSpec;
}

export interface HeaderMatchSpec {
    name?: string;
    exact?: string;
    contains?: string;
    regex?: string;
    present?: boolean;
}

export interface MatchSpec {
    path_exact?: string;
    path_prefix?: string;
    path_regex?: string;
    methods?: string[];
    content_type?: string[];
    headers?: HeaderMatchSpec[];
}

export interface RouteSpec {
    /** Client-only stable id for React keys (stripped from the wire YAML). */
    _uid?: string;
    match?: MatchSpec;
    policy?: PolicySpec;
}

export interface DomainSpec {
    /** Client-only stable id for React keys (stripped from the wire YAML). */
    _uid?: string;
    hosts?: string[];
    policy?: PolicySpec;
    routes?: RouteSpec[];
}

export interface PolicyFileModel {
    apiVersion: string;
    kind: string;
    metadata?: { name?: string; labels?: Record<string, string> };
    spec: {
        defaults?: PolicySpec;
        domains?: DomainSpec[];
        exclude?: string[];
    };
}

export const SHIELD_API_VERSION = 'sentinel.elchi.io/v1';
export const SHIELD_KIND = 'SecurityPolicy';

export const newPolicyFile = (name: string): PolicyFileModel => ({
    apiVersion: SHIELD_API_VERSION,
    kind: SHIELD_KIND,
    metadata: { name },
    spec: {
        defaults: { mode: 'block', fail_mode: 'fail_open' },
        domains: [],
    },
});

// ─── Client-only stable ids (React keys; never serialized) ───────────────────

let _uidCounter = 0;
/** A short, session-unique id for keying domain/route rows. */
export const uid = (): string => `u${Date.now().toString(36)}${(_uidCounter++).toString(36)}`;

/**
 * Ensure every domain and route carries a stable `_uid` for React keys, WITHOUT
 * re-creating nodes that already have one (so memoized rows aren't invalidated).
 * Run once when a model enters the builder (parse/hydrate), not on every edit —
 * edits preserve `_uid` by spreading the existing node.
 */
export const ensureModelUids = (model: PolicyFileModel): PolicyFileModel => {
    const domains = model.spec?.domains;
    if (!domains || domains.length === 0) return model;
    let changed = false;
    const next = domains.map(d => {
        const routes = d.routes;
        let dChanged = !d._uid;
        let nextRoutes = routes;
        if (routes && routes.length > 0) {
            let rChanged = false;
            nextRoutes = routes.map(r => (r._uid ? r : ((rChanged = true), { ...r, _uid: uid() })));
            if (rChanged) dChanged = true;
        }
        if (!dChanged) return d;
        changed = true;
        return { ...d, _uid: d._uid ?? uid(), routes: nextRoutes };
    });
    return changed ? { ...model, spec: { ...model.spec, domains: next } } : model;
};

// ─── Schema map for unknown-key detection ────────────────────────────────────
// '*'  → map with arbitrary keys (values are leaves)
// '[]' suffix on a node → array of that node
// true → leaf (any scalar/array-of-scalars)

export type SchemaNode = true | '*' | { [key: string]: SchemaNode } | [SchemaNode];

const POLICY_SPEC_SCHEMA: { [key: string]: SchemaNode } = {
    mode: true,
    fail_mode: true,
    inspect_request_body: true,
    inspect_response_body: true,
    max_request_body_bytes: true,
    max_response_body_bytes: true,
    max_header_bytes: true,
    timeout: true,
    log_level: true,
    sampling_rate: true,
    anomaly_threshold: true,
    skip_checks: true,
    pipeline: { request: true, response: true },
    checks: {
        headers: { forbidden: true, required: true, max_header_value_bytes: true, enforce_valid_host: true },
        body: {
            require_json: true,
            detect_sensitive_data: true,
            dlp: { direction: true, block: true, redact: true },
        },
    },
    engines: {
        jwt: { issuer: true, audience: true, algorithms: true, hmac_secret: true, public_key_file: true, required_claims: true, header_name: true, leeway: true },
        coraza: { directives: true, directives_file: true, include_owasp: true, exclude_rule_ids: true, paranoia_level: true, detection_paranoia_level: true, inbound_anomaly_threshold: true, outbound_anomaly_threshold: true },
        rate_limit: { requests_per_second: true, burst: true, key: true, header: true },
        ip_reputation: {
            allow_cidrs: true,
            deny_cidrs: true,
            feeds: [{ name: true, file: true, format: true, severity: true }],
            geoip: { database_file: true, asn_database_file: true, block_countries: true, allow_countries: true, block_asns: true, on_missing: true },
        },
        bot: {
            score_threshold: true,
            emit_score: true,
            user_agent: { deny_substrings: true, block_empty: true, score_known_bot: true },
            verified_bots: [{ name: true, file: true, format: true, ua_match: true }],
            tls_fingerprint: { ja4_header: true, ja3_header: true, deny_ja4: true, deny_ja3: true, score_ja4: '*', tool_ja4: true },
            heuristics: { require_accept: true, require_accept_language: true, require_accept_encoding: true, score_per_anomaly: true },
        },
        api_key: {
            source: true,
            name: true,
            keys: [{ sha256: true, key: true, subject: true, scopes: true }],
            require_scope_for_path: [{ path_prefix: true, scope: true }],
        },
        hmac_sign: { secret: true, secrets: '*', signature_header: true, timestamp_header: true, nonce_header: true, key_id_header: true, algorithm: true, window: true, nonce_ttl: true, require_nonce: true, require_body_digest: true },
        http_signature: { secret: true, signature_name: true, covered_components: true, max_age: true },
        jwks: { file: true, url: true, issuer: true, audience: true, algorithms: true, required_claims: true, header_name: true, leeway: true, refresh_interval: true, http_timeout: true },
        xfcc: { header_name: true, require_present: true, uris: true, dns_names: true, subjects: true, hashes: true },
        graphql: { content_types: true, paths: true, max_depth: true, max_aliases: true, max_root_fields: true, max_total_fields: true, max_operations: true, block_introspection: true, max_fragment_depth: true, max_complexity: true },
        openapi: { spec_file: true, validate_request_body: true, reject_undeclared_path: true },
    },
};

const MATCH_SCHEMA: { [key: string]: SchemaNode } = {
    path_exact: true,
    path_prefix: true,
    path_regex: true,
    methods: true,
    content_type: true,
    headers: [{ name: true, exact: true, contains: true, regex: true, present: true }],
};

export const POLICY_FILE_SCHEMA: { [key: string]: SchemaNode } = {
    apiVersion: true,
    kind: true,
    metadata: { name: true, labels: '*' },
    spec: {
        defaults: POLICY_SPEC_SCHEMA,
        exclude: true,
        domains: [{
            hosts: true,
            policy: POLICY_SPEC_SCHEMA,
            routes: [{ match: MATCH_SCHEMA, policy: POLICY_SPEC_SCHEMA }],
        }],
    },
};

/** A supporting (non-config) file in the bundle, managed by the Data Files tab. */
export interface DataFileModel {
    /** Bundle-relative path, e.g. "files/blocklist.netset". */
    path: string;
    /** Inline content (base64) for uploaded files. */
    content?: string;
    /** Remote source (advanced) — requires sha256. */
    download_url?: string;
    sha256?: string;
    /** Display-only size in bytes (derived). */
    size?: number;
}

/** The edge directory the bundle lands in — used to build absolute file refs. */
export const SHIELD_EDGE_DIR = '/etc/elchi/elchi-shield';

/** Absolute edge path of a data file (what engine configs reference). */
export const edgePathOf = (dataFilePath: string): string =>
    `${SHIELD_EDGE_DIR}/${dataFilePath}`;
