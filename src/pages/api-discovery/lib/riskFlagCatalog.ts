// Static catalog of risk flags emitted by elchi-collector.
//
// Source-of-truth: `elchi-collector/internal/policy/{risk,severity,categories}.go`
//
// Each flag has:
//   - severity (Low=1, Medium=4, High=7, Critical=10) — the numeric weight
//     summed into `max_risk_score` (clamped to 255) on every event/inventory.
//   - class (the dimension the flag belongs to — auth/transport/attack…)
//   - description (1-line plain-language summary for the UI tooltip)
//
// Adding a flag here only affects rendering — the backend has its own
// catalog. If a new flag arrives from a newer collector it'll render with
// severity=low and a generic label, never crash.

export type RiskSeverity = 'low' | 'medium' | 'high' | 'critical';
export type RiskClass =
    | 'auth'
    | 'transport'
    | 'behavior'
    | 'attack_pattern'
    | 'data_leak'
    | 'discovery'
    | 'consistency'
    // `unknown` — emitted by the backend's risk-summary when a newer
    // collector ships a flag this build's taxonomy doesn't know yet.
    | 'unknown';

export interface RiskFlagMeta {
    severity: RiskSeverity;
    class: RiskClass;
    description: string;
}

export const RISK_FLAG_CATALOG: Record<string, RiskFlagMeta> = {
    // ── Critical (10) — attack-in-progress or top-tier posture failure ──
    brute_force_suspect: {
        severity: 'critical',
        class: 'attack_pattern',
        description:
            'Many auth-endpoint failures from a single consumer or source IP inside a rolling window. Possible password / token brute force (OWASP API2).',
    },
    payment_abuse_suspect: {
        severity: 'critical',
        class: 'attack_pattern',
        description:
            'A single consumer is hitting a payment endpoint more often than expected. Bot / fraud indicator (OWASP API6).',
    },
    weak_tls_version: {
        severity: 'critical',
        class: 'transport',
        description:
            'Connection negotiated TLS 1.0 or 1.1 — both have known weaknesses and should be rejected (OWASP API8).',
    },
    threat_intel_hit: {
        severity: 'critical',
        class: 'attack_pattern',
        description:
            'Source IP matched an entry in the configured threat-intel feed (Spamhaus DROP, AbuseIPDB, custom lists).',
    },
    bfla_suspect: {
        severity: 'critical',
        class: 'attack_pattern',
        description:
            'Broken Function Level Authorization — a consumer reached a privileged function/operation it should not be able to call (the function-level counterpart of BOLA, OWASP API5).',
    },

    // ── High (7) — confirmed attack pattern or hardened-posture failure ──
    bola_suspect: {
        severity: 'high',
        class: 'attack_pattern',
        description:
            'A single consumer tried many distinct {id} values on the same endpoint within the window. Possible object-enumeration (OWASP API1).',
    },
    rate_anomaly: {
        severity: 'high',
        class: 'attack_pattern',
        description:
            'A single consumer is exceeding the per-consumer request-rate threshold (OWASP API4).',
    },
    weak_token_ttl: {
        severity: 'high',
        class: 'auth',
        description:
            'A JWT bearer token had an unusually long expiry (exp − iat exceeds the configured threshold).',
    },
    missing_hsts: {
        severity: 'high',
        class: 'transport',
        description:
            'A 2xx response over TLS did not include the strict-transport-security header. Enables downgrade attacks (OWASP API8).',
    },
    plain_text_transport: {
        severity: 'high',
        class: 'transport',
        description:
            'Request was served over plain HTTP (no TLS). Anyone on the path can read or modify the traffic.',
    },
    auth_inconsistent: {
        severity: 'high',
        class: 'consistency',
        description:
            'The same endpoint has been seen with and without auth across events. Usually mid-rollout, conditional routes, or actual misconfig.',
    },
    sensitive_path_keyword: {
        severity: 'high',
        class: 'discovery',
        description:
            'Path contains a keyword commonly associated with sensitive surfaces (admin, debug, .env, .git, actuator, pprof, …).',
    },
    pii_observed: {
        severity: 'high',
        class: 'data_leak',
        description:
            'PII-shaped data observed in the request or response (email, phone, SSN, credit card, IBAN). The PII itself is never stored — only the categories.',
    },
    replay_suspect: {
        severity: 'high',
        class: 'attack_pattern',
        description:
            'The same request_id appeared more than once in the replay window. Replay attack, buggy client, or duplicated log pipeline.',
    },
    oversized_response: {
        severity: 'high',
        class: 'data_leak',
        description:
            'Response body is several times the endpoint historical mean. Canary for data-exfil patterns.',
    },
    scanner_user_agent: {
        severity: 'high',
        class: 'attack_pattern',
        description:
            'The User-Agent matched a known security scanner or pen-test tool (sqlmap, nuclei, nikto, …). Weak / spoofable on its own — corroborate with behavioural flags.',
    },
    vuln_probe_path: {
        severity: 'high',
        class: 'attack_pattern',
        description:
            'The first path segment targets a well-known leak file (.env, .git, .aws, wp-login.php, server-status, …). A request like this against an API is never legitimate.',
    },
    path_scan_suspect: {
        severity: 'high',
        class: 'attack_pattern',
        description:
            'A single source IP (or consumer) hit many distinct paths returning 4xx — the signature of content-discovery / directory-brute tools (gobuster, ffuf, dirb, nuclei).',
    },
    impossible_travel: {
        severity: 'high',
        class: 'attack_pattern',
        description:
            'The same consumer / IP appeared from two locations too far apart to travel between in the elapsed time. Strong indicator of a stolen credential or token replay.',
    },
    ip_rate_anomaly: {
        severity: 'high',
        class: 'attack_pattern',
        description:
            'A single source IP is exceeding the per-IP request-rate threshold — automated abuse or a misbehaving client (OWASP API4).',
    },

    // ── Medium (4) — suggestive states; normal at low volume ──
    unauthenticated: {
        severity: 'medium',
        class: 'auth',
        description:
            'Request had no auth header (Authorization, Cookie, X-Api-Key, …). Public endpoints are expected; flag is informative.',
    },
    error_status: {
        severity: 'medium',
        class: 'behavior',
        description:
            'Response status was 5xx — a server-side failure. Concerning when clustered.',
    },
    legacy_protocol: {
        severity: 'medium',
        class: 'transport',
        description:
            'Request used HTTP/1.0 or HTTP/1.1 instead of HTTP/2 or HTTP/3. Operational hygiene signal.',
    },
    unsafe_method_on_readonly: {
        severity: 'medium',
        class: 'attack_pattern',
        description:
            'A state-changing method (POST/PUT/DELETE/PATCH) hit a path conventionally reserved for read-only probes (/healthz, /metrics, /favicon.ico, /robots.txt).',
    },
    latency_anomaly: {
        severity: 'medium',
        class: 'behavior',
        description:
            'Request latency deviated significantly from the endpoint’s self-learned baseline (behavioural anomaly detector). Possible upstream degradation or abuse.',
    },
    error_rate_spike: {
        severity: 'medium',
        class: 'behavior',
        description:
            'The endpoint’s error rate spiked well above its self-learned baseline (behavioural anomaly detector). Possible outage, bad deploy, or attack.',
    },
    ua_mismatch: {
        severity: 'medium',
        class: 'attack_pattern',
        description:
            'The User-Agent changed within a single session / token — possible token theft or replay from a different client.',
    },
    permissive_cors: {
        severity: 'medium',
        class: 'transport',
        description:
            'The endpoint returns an over-permissive CORS policy (Access-Control-Allow-Origin: * or a reflected origin with credentials). Any website can call it from a browser.',
    },

    // ── Low (1) — informational, surfaces on most traffic ──
    version_disclosure: {
        severity: 'low',
        class: 'discovery',
        description:
            'A response header or body leaked a software / framework version (Server, X-Powered-By, banner). Helps attackers target known CVEs.',
    },
    missing_x_content_type_options: {
        severity: 'low',
        class: 'transport',
        description:
            'Response lacks the X-Content-Type-Options: nosniff header — browsers may MIME-sniff and mis-interpret the body.',
    },
    missing_x_frame_options: {
        severity: 'low',
        class: 'transport',
        description:
            'Response lacks X-Frame-Options (or a frame-ancestors CSP) — the page can be framed, enabling clickjacking.',
    },
    missing_csp: {
        severity: 'low',
        class: 'transport',
        description:
            'Response lacks a Content-Security-Policy header — no defence-in-depth against injected / cross-site scripts.',
    },

    internal_host: {
        severity: 'low',
        class: 'discovery',
        description:
            'Host resolved as an internal address (loopback, RFC1918, *.svc.cluster.local, *.local, …). Context, not threat.',
    },
    external_host: {
        severity: 'low',
        class: 'discovery',
        description:
            'Host resolved as a public address or FQDN. Context, not threat.',
    },
    client_error_status: {
        severity: 'low',
        class: 'behavior',
        description:
            'Response status was 4xx — bad request from the caller. Common on healthy traffic; only meaningful when clustered.',
    },
};

// ── Severity numerics (mirror the backend's policy/severity.go) ──

export const SEVERITY_SCORE: Record<RiskSeverity, number> = {
    low: 1,
    medium: 4,
    high: 7,
    critical: 10,
};

export const SEVERITY_TAG_COLOR: Record<RiskSeverity, string> = {
    critical: 'red',
    high: 'volcano',
    medium: 'orange',
    low: 'gold',
};

// Total risk_score bands the UI uses for sort badges + KPI gauge.
// `risk_score` is the SUM of flag severities on the single worst event
// (clamped to 255 by the collector). Bands are non-overlapping and kept
// in lockstep with `riskColor()` in ApiDiscoveryEndpointDetail.tsx:
//   0      → none      (no flag fired)
//   1–9    → low       (informational flags only)
//   10–24  → medium    (one High flag, or a few Mediums)
//   25–39  → high       (multiple High flags stacked)
//   40+    → critical   (Critical attack flags present)
export const scoreBand = (score: number): RiskSeverity | 'none' => {
    if (score <= 0) return 'none';
    if (score >= 40) return 'critical';
    if (score >= 25) return 'high';
    if (score >= 10) return 'medium';
    return 'low';
};

export const RISK_SCORE_LEGEND = [
    { label: 'None', range: '0', color: 'var(--text-tertiary)' },
    { label: 'Low', range: '1–9', color: '#d4a012' },
    { label: 'Medium', range: '10–24', color: 'var(--color-warning)' },
    { label: 'High', range: '25–39', color: '#fa541c' },
    { label: 'Critical', range: '40+', color: 'var(--color-error)' },
];

// ── Lookup helpers ──

export const riskFlagMeta = (flag: string): RiskFlagMeta | undefined =>
    RISK_FLAG_CATALOG[flag];

export const riskFlagColor = (flag: string): string => {
    const meta = RISK_FLAG_CATALOG[flag];
    return SEVERITY_TAG_COLOR[meta?.severity ?? 'low'];
};

// Null-safe: a malformed payload row may carry a missing/non-string
// flag — never let that throw inside a table render.
export const riskFlagLabel = (flag: unknown): string => {
    const s = typeof flag === 'string' ? flag : String(flag ?? '');
    if (!s) return '—';
    return s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};

export const KNOWN_RISK_FLAGS: string[] = Object.keys(RISK_FLAG_CATALOG);

// Backwards-compat alias for code still importing the old name.
export const RISK_FLAG_SEVERITY: Record<string, RiskSeverity> = Object.fromEntries(
    Object.entries(RISK_FLAG_CATALOG).map(([k, v]) => [k, v.severity]),
);

// ── Endpoint / PII category catalogs (mirror policy/categories.go) ──

export const ENDPOINT_CATEGORY_META: Record<string, { label: string; description: string }> = {
    auth_endpoint: {
        label: 'Auth',
        description:
            'Authentication / authorisation surface — login, logout, signup, oauth, sso, saml, token, password reset.',
    },
    admin_endpoint: {
        label: 'Admin',
        description:
            'Admin / management UI — admin, console, management, manage, dashboard.',
    },
    account_management: {
        label: 'Account',
        description:
            'User account management — email / phone / profile updates.',
    },
    payment_endpoint: {
        label: 'Payment',
        description:
            'Payment flow — checkout, payment, billing, charge, refund, invoice.',
    },
    data_export: {
        label: 'Data Export',
        description:
            'Bulk data egress — export, download, dump, backup, bulk endpoints.',
    },
    api_docs: {
        label: 'API Docs',
        description:
            'API documentation surfaces (swagger, openapi, api-docs, redoc, graphiql) — often unintended exposure.',
    },
    metadata_leak: {
        label: 'Metadata Leak',
        description:
            'Highly sensitive paths (.env, .git, .aws, .ssh, server-status, config). Critical if reachable from public traffic.',
    },
};

export const PII_CATEGORY_META: Record<string, { label: string; description: string }> = {
    email: { label: 'Email', description: 'Email address detected.' },
    phone: { label: 'Phone', description: 'Phone number detected.' },
    ssn: { label: 'SSN', description: 'US Social Security Number pattern detected (XXX-XX-XXXX).' },
    credit_card: { label: 'Credit Card', description: '13–19 digit payment-card pattern detected.' },
    iban: { label: 'IBAN', description: 'International Bank Account Number detected.' },
};

export const KNOWN_ENDPOINT_CATEGORIES: string[] = Object.keys(ENDPOINT_CATEGORY_META);
export const KNOWN_PII_CATEGORIES: string[] = Object.keys(PII_CATEGORY_META);

// ── Risk class taxonomy (mirrors backend risk-summary `class` values) ──
// Used by the Risk Posture dashboard to label/colour the by_class breakdown.

export const RISK_CLASS_META: Record<string, { label: string; color: string; description: string }> = {
    auth: {
        label: 'Auth',
        color: '#ef4444',
        description: 'Authentication / authorisation posture — missing, weak, or inconsistent credentials.',
    },
    attack_pattern: {
        label: 'Attack Pattern',
        color: '#dc2626',
        description: 'Behavioural detectors firing on probable abuse — brute force, enumeration, scanning, replay.',
    },
    transport: {
        label: 'Transport',
        color: '#f97316',
        description: 'Connection-layer hygiene — plain HTTP, weak TLS, missing HSTS, legacy protocol.',
    },
    data_leak: {
        label: 'Data Leak',
        color: '#a855f7',
        description: 'Sensitive data exposure — PII observed, oversized responses (exfil canary).',
    },
    discovery: {
        label: 'Discovery',
        color: '#3b82f6',
        description: 'Contextual surface signals — internal vs external host, sensitive path keywords.',
    },
    behavior: {
        label: 'Behavior',
        color: '#eab308',
        description: 'Response-status signals — 4xx / 5xx clustering.',
    },
    consistency: {
        label: 'Consistency',
        color: '#f59e0b',
        description: 'The same endpoint behaving differently across events — usually a misconfiguration.',
    },
    unknown: {
        label: 'Unknown',
        color: '#9ca3af',
        description: 'A risk flag from a newer collector that this UI build does not recognise yet.',
    },
};

export const riskClassMeta = (cls: string) =>
    RISK_CLASS_META[cls] ?? {
        label: riskFlagLabel(cls),
        color: '#9ca3af',
        description: 'Unrecognised risk class.',
    };

// severity_band (string from backend) → tag colour. Falls back to gold.
export const severityBandColor = (band: string): string =>
    SEVERITY_TAG_COLOR[(band as RiskSeverity)] ?? 'gold';
