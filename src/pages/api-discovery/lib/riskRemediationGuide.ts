// Static remediation guide for the API Discovery risk flags.
//
// Sibling of `riskFlagCatalog.ts` (which mirrors the elchi-collector
// catalog) — kept separate so the backend-mirrored catalog stays a
// pure data mirror. This file is purely educational UI content: for
// every flag it explains what the risk is, why it matters, how the
// collector detects it, and an ordered list of remediation steps —
// favouring Envoy-config fixes the operator can apply through this UI.
//
// `mitigationType` drives the "How to close it" presentation:
//   envoy-http-filter — add/tune an HTTP filter on the listener's HCM
//   envoy-tls         — fix at the listener transport socket / codec
//   app-side          — Envoy cannot fix it; the app / IdP must change
//   observational     — contextual signal, no action required

export type MitigationType =
    | 'envoy-http-filter'
    | 'envoy-tls'
    | 'app-side'
    | 'observational';

export interface RemediationStep {
    /** Imperative instruction for the operator. */
    text: string;
    /** Envoy filter this step refers to (rendered as a callout chip). */
    envoyFilter?: string;
    /** Optional deep-link button into an editor page. */
    link?: { to: string; label: string };
}

export interface RiskRemediation {
    /** 2–4 sentence plain-language explanation of the risk. */
    whatItIs: string;
    /** Impact — what an attacker gains, or what breaks. */
    whyItMatters: string;
    /** Brief mirror of the collector detection logic. */
    howDetected: string;
    /** OWASP API Security Top 10 (2023) reference, when applicable. */
    owaspRef?: string;
    mitigationType: MitigationType;
    /** Ordered remediation steps. */
    steps: RemediationStep[];
}

// Deep-link targets reused across entries.
const LISTENER = { to: '/resource/listener', label: 'Open Listener resources' };
const SETTINGS = { to: '/settings', label: 'Open API Discovery settings' };

export const MITIGATION_TYPE_META: Record<
    MitigationType,
    { label: string; color: string; description: string }
> = {
    'envoy-http-filter': {
        label: 'Envoy filter',
        color: '#0a7fda',
        description: 'Close it by adding or tuning an HTTP filter on the listener.',
    },
    'envoy-tls': {
        label: 'TLS / transport',
        color: '#f97316',
        description: 'Close it at the listener transport socket or protocol settings.',
    },
    'app-side': {
        label: 'App-side',
        color: '#a855f7',
        description: 'Envoy cannot fix this — the upstream application or IdP must change.',
    },
    observational: {
        label: 'Informational',
        color: '#9ca3af',
        description: 'A contextual signal — usually no action is required.',
    },
};

export const RISK_REMEDIATION_GUIDE: Record<string, RiskRemediation> = {
    // ── Critical ────────────────────────────────────────────────────
    brute_force_suspect: {
        whatItIs:
            'A single consumer or source IP produced an unusual number of failed authentication attempts against an auth endpoint within a short rolling window. This is the classic signature of a password- or token-guessing attack.',
        whyItMatters:
            'Unchecked, an attacker can iterate through credential lists until one works, taking over an account. Auth endpoints are the highest-value target on any API.',
        howDetected:
            'The collector counts auth-endpoint failures (401/403) per consumer and per source IP over a sliding window. When the count crosses the brute-force threshold the flag fires. Both the per-IP threshold and the window are tunable in Settings → API Discovery.',
        owaspRef: 'API2:2023 Broken Authentication',
        mitigationType: 'envoy-http-filter',
        steps: [
            {
                text: 'Add an HTTP Local Rate Limit filter to the HCM filter chain of the listener that serves your auth endpoints, and scope it to the login / token routes.',
                envoyFilter: 'HTTP Local Rate Limit',
                link: LISTENER,
            },
            {
                text: 'Set a low token bucket (e.g. 5–10 requests / minute / IP) so a single client cannot keep guessing. Use a 429 response for over-limit requests.',
            },
            {
                text: 'For a cluster-wide limiter shared across many Envoy instances, route auth requests through an Ext Authz filter pointing at your rate-limit / auth service.',
                envoyFilter: 'Ext Authz',
            },
            {
                text: 'Tune the brute-force detector threshold and window so the flag matches your real login volume.',
                link: SETTINGS,
            },
        ],
    },
    payment_abuse_suspect: {
        whatItIs:
            'A single consumer is calling a payment-related endpoint (checkout, charge, refund) far more often than a normal user would. This pattern points at card-testing bots or fraud automation.',
        whyItMatters:
            'Payment endpoints abused at scale lead to chargebacks, fraud losses, and processor penalties. Card-testing rings deliberately spread small charges across many calls.',
        howDetected:
            'The collector tracks per-consumer request volume on endpoints categorised as payment and flags consumers exceeding the payment-abuse threshold. The threshold is tunable in Settings → API Discovery.',
        owaspRef: 'API6:2023 Unrestricted Access to Sensitive Business Flows',
        mitigationType: 'envoy-http-filter',
        steps: [
            {
                text: 'Add an HTTP Local Rate Limit filter scoped to the payment routes on the serving listener, with a per-consumer bucket sized to a realistic checkout rate.',
                envoyFilter: 'HTTP Local Rate Limit',
                link: LISTENER,
            },
            {
                text: 'Require strong authentication on the flow (JWT Authentication or OAuth2) so anonymous bots cannot reach it at all.',
                envoyFilter: 'JWT Authentication',
            },
            {
                text: 'For fraud scoring, send payment requests through an Ext Authz filter to a service that can apply velocity / device checks.',
                envoyFilter: 'Ext Authz',
            },
            {
                text: 'Tune the payment-abuse threshold to your transaction volume.',
                link: SETTINGS,
            },
        ],
    },
    weak_tls_version: {
        whatItIs:
            'A connection negotiated TLS 1.0 or TLS 1.1. Both protocol versions are deprecated and carry known cryptographic weaknesses.',
        whyItMatters:
            'Weak TLS lets a network attacker downgrade or decrypt traffic, exposing credentials and data in transit. Modern compliance regimes (PCI-DSS) explicitly forbid TLS < 1.2.',
        howDetected:
            'The collector reads the negotiated TLS version from each event and flags any connection below TLS 1.2.',
        owaspRef: 'API8:2023 Security Misconfiguration',
        mitigationType: 'envoy-tls',
        steps: [
            {
                text: 'Open the affected listener and edit its TLS transport socket (DownstreamTlsContext).',
                link: LISTENER,
            },
            {
                text: 'Under TLS parameters set the minimum protocol version to TLSv1_2 (prefer TLSv1_3). Leave the maximum at TLSv1_3.',
            },
            {
                text: 'Save and push the listener. New handshakes will refuse the weak versions; re-check the flag once traffic flows.',
            },
        ],
    },
    threat_intel_hit: {
        whatItIs:
            'The source IP of a request matched an entry in a configured threat-intelligence feed (Spamhaus DROP, AbuseIPDB, or a custom list).',
        whyItMatters:
            'Traffic from a known-bad IP is rarely legitimate — it is typically a scanner, botnet node, or attack proxy. It deserves immediate scrutiny.',
        howDetected:
            'The collector resolves each source IP against the threat-intel feeds configured in Settings → API Discovery and flags any match.',
        owaspRef: 'API8:2023 Security Misconfiguration',
        mitigationType: 'envoy-http-filter',
        steps: [
            {
                text: 'Add an RBAC filter (HTTP or network) to the listener and create a deny policy whose principals are the offending source-IP CIDR ranges.',
                envoyFilter: 'RBAC',
                link: LISTENER,
            },
            {
                text: 'For a continuously-updated blocklist, front the listener with the WAF so feed-driven IP rules are enforced centrally.',
            },
            {
                text: 'Review and curate the threat-intel feeds so the flag stays accurate.',
                link: SETTINGS,
            },
        ],
    },
    bfla_suspect: {
        whatItIs:
            'Broken Function Level Authorization — a consumer reached a privileged function or operation it should not be able to call (the function-level counterpart of BOLA).',
        whyItMatters:
            'A regular user invoking admin-only operations can escalate privilege, alter other tenants’ data, or disable controls. Authorization gaps like this are among the most exploited API flaws.',
        howDetected:
            'The collector observes a consumer calling endpoints categorised as privileged / admin without the expected authorization context, across the detection window.',
        owaspRef: 'API5:2023 Broken Function Level Authorization',
        mitigationType: 'envoy-http-filter',
        steps: [
            {
                text: 'Add an RBAC filter to the HCM of the serving listener and define allow policies that bind privileged routes to the roles permitted to call them.',
                envoyFilter: 'RBAC',
                link: LISTENER,
            },
            {
                text: 'Drive RBAC principals from verified JWT claims — pair it with a JWT Authentication filter so the role comes from a trusted token, not a spoofable header.',
                envoyFilter: 'JWT Authentication',
            },
            {
                text: 'For per-object / per-tenant decisions that RBAC cannot express, delegate to an Ext Authz service that knows your authorization model.',
                envoyFilter: 'Ext Authz',
            },
        ],
    },

    // ── High ────────────────────────────────────────────────────────
    bola_suspect: {
        whatItIs:
            'A single consumer tried many distinct object identifiers ({id} values) on the same endpoint within the window — the signature of object enumeration, where an attacker walks IDs to read records that belong to others.',
        whyItMatters:
            'Broken Object Level Authorization is the #1 API risk. If the endpoint does not check ownership, enumeration leaks every record it serves.',
        howDetected:
            'The collector counts distinct path {id} placeholders seen per consumer on one endpoint and flags consumers exceeding the BOLA threshold. The threshold and window are tunable in Settings → API Discovery.',
        owaspRef: 'API1:2023 Broken Object Level Authorization',
        mitigationType: 'envoy-http-filter',
        steps: [
            {
                text: 'The real fix is an ownership check in the upstream service — every object lookup must verify the caller owns the requested id.',
            },
            {
                text: 'At the edge, add an RBAC filter to constrain who can reach the endpoint, and pair it with JWT Authentication so identity is trusted.',
                envoyFilter: 'RBAC',
                link: LISTENER,
            },
            {
                text: 'For per-object authorization decisions, route the endpoint through an Ext Authz filter to a service that enforces ownership.',
                envoyFilter: 'Ext Authz',
            },
            {
                text: 'Add an HTTP Local Rate Limit to slow enumeration even where authorization is imperfect.',
                envoyFilter: 'HTTP Local Rate Limit',
            },
        ],
    },
    rate_anomaly: {
        whatItIs:
            'A single consumer is exceeding the expected per-consumer request rate. It indicates an abusive client, a runaway integration, or scraping.',
        whyItMatters:
            'Unbounded request rates exhaust upstream capacity, inflate cost, and enable scraping or denial of service against other tenants.',
        howDetected:
            'The collector counts requests per consumer over the rate window and flags any consumer above the threshold. Both are tunable in Settings → API Discovery.',
        owaspRef: 'API4:2023 Unrestricted Resource Consumption',
        mitigationType: 'envoy-http-filter',
        steps: [
            {
                text: 'Add an HTTP Local Rate Limit filter to the serving listener’s HCM with a per-consumer token bucket sized to your fair-use policy.',
                envoyFilter: 'HTTP Local Rate Limit',
                link: LISTENER,
            },
            {
                text: 'Return 429 with a Retry-After header so well-behaved clients back off.',
            },
            {
                text: 'For a shared limit across instances, use an Ext Authz / global rate-limit service.',
                envoyFilter: 'Ext Authz',
            },
            {
                text: 'Tune the rate-anomaly threshold and window to match real traffic.',
                link: SETTINGS,
            },
        ],
    },
    weak_token_ttl: {
        whatItIs:
            'A JWT bearer token presented to the API had an unusually long lifetime — the gap between its issued-at (iat) and expiry (exp) claims exceeds the configured threshold.',
        whyItMatters:
            'A long-lived token that leaks stays valid for a long time. Short TTLs limit the blast radius of a stolen credential.',
        howDetected:
            'The collector decodes the bearer token’s exp − iat and flags tokens longer than the weak-token-TTL threshold in Settings → API Discovery.',
        owaspRef: 'API2:2023 Broken Authentication',
        mitigationType: 'app-side',
        steps: [
            {
                text: 'Shorten access-token lifetimes at your identity provider — minutes, not days — and rely on refresh tokens for continuity.',
            },
            {
                text: 'Enforce token validation at the edge with a JWT Authentication filter so expired or malformed tokens are rejected before reaching the upstream.',
                envoyFilter: 'JWT Authentication',
                link: LISTENER,
            },
            {
                text: 'Adjust the weak-token-TTL threshold to the maximum lifetime your policy allows.',
                link: SETTINGS,
            },
        ],
    },
    missing_hsts: {
        whatItIs:
            'A 2xx response served over TLS did not include the Strict-Transport-Security (HSTS) header.',
        whyItMatters:
            'Without HSTS a browser can be tricked into a first plain-HTTP request, opening an SSL-strip / downgrade attack window.',
        howDetected:
            'The collector inspects TLS 2xx responses and flags those missing the strict-transport-security header.',
        owaspRef: 'API8:2023 Security Misconfiguration',
        mitigationType: 'envoy-http-filter',
        steps: [
            {
                text: 'Add a Header Mutation filter to the serving listener’s HCM.',
                envoyFilter: 'Header Mutation',
                link: LISTENER,
            },
            {
                text: 'Add a response-header append rule: Strict-Transport-Security = max-age=31536000; includeSubDomains (add preload only once you are certain).',
            },
            {
                text: 'Apply only on TLS listeners — never advertise HSTS from a plain-HTTP listener.',
            },
        ],
    },
    plain_text_transport: {
        whatItIs:
            'The request was served over plain HTTP with no TLS at all.',
        whyItMatters:
            'Anyone on the network path can read or modify the traffic — credentials, tokens, and data are fully exposed.',
        howDetected:
            'The collector marks events whose connection had no TLS as plain-text transport.',
        owaspRef: 'API8:2023 Security Misconfiguration',
        mitigationType: 'envoy-tls',
        steps: [
            {
                text: 'Add a TLS transport socket (DownstreamTlsContext) with a valid certificate to the listener so it terminates HTTPS.',
                link: LISTENER,
            },
            {
                text: 'Keep the plain-HTTP listener only as a redirect: configure it to answer with a 301 to the https:// URL.',
            },
            {
                text: 'Once HTTPS is enforced, add HSTS via a Header Mutation filter to keep clients on TLS.',
                envoyFilter: 'Header Mutation',
            },
        ],
    },
    auth_inconsistent: {
        whatItIs:
            'The same endpoint has been observed both with and without authentication across different events. Usually a mid-rollout state, a conditional route, or an actual misconfiguration.',
        whyItMatters:
            'An auth-bypassed code path on an otherwise-protected endpoint is an open door. Inconsistency means at least one path reaches the data without a credential.',
        howDetected:
            'The collector records, per endpoint, whether auth headers were present; when both auth_observed and noauth_observed are true the flag fires.',
        owaspRef: 'API2:2023 Broken Authentication',
        mitigationType: 'envoy-http-filter',
        steps: [
            {
                text: 'Decide the intended posture. If the endpoint must be protected, enforce auth uniformly with a JWT Authentication (or OAuth2 / Basic Auth) filter on the serving listener.',
                envoyFilter: 'JWT Authentication',
                link: LISTENER,
            },
            {
                text: 'Add an RBAC filter so every route requires an authenticated principal — no implicit allow.',
                envoyFilter: 'RBAC',
            },
            {
                text: 'Check the events list for the unauthenticated calls to find the bypassed path (a stale route, health-check alias, or cache rule).',
            },
        ],
    },
    sensitive_path_keyword: {
        whatItIs:
            'The request path contains a keyword commonly tied to sensitive surfaces — admin, debug, .env, .git, actuator, pprof, and similar.',
        whyItMatters:
            'These surfaces expose configuration, internals, or management functions. If they are reachable from untrusted traffic they are a direct foothold.',
        howDetected:
            'The collector matches path segments against a keyword list of sensitive surfaces.',
        owaspRef: 'API8:2023 Security Misconfiguration',
        mitigationType: 'envoy-http-filter',
        steps: [
            {
                text: 'Confirm whether the surface should be reachable at all from this listener. Internal tooling should not sit behind a public listener.',
            },
            {
                text: 'Add an RBAC filter and deny these path prefixes for untrusted principals, or allow them only from internal source-IP ranges.',
                envoyFilter: 'RBAC',
                link: LISTENER,
            },
            {
                text: 'If the surface must stay, require strong authentication on it with a JWT Authentication filter.',
                envoyFilter: 'JWT Authentication',
            },
        ],
    },
    pii_observed: {
        whatItIs:
            'PII-shaped data (email, phone, SSN, credit card, IBAN) was observed in the request or response. The PII itself is never stored — only the category is recorded.',
        whyItMatters:
            'PII in URLs or unencrypted payloads leaks into logs, proxies, and browser history, and raises GDPR / PCI exposure.',
        howDetected:
            'The collector scans paths and payload metadata for PII patterns and records the matching categories. PII detection is toggled in Settings → API Discovery.',
        owaspRef: 'API3:2023 Broken Object Property Level Authorization',
        mitigationType: 'app-side',
        steps: [
            {
                text: 'Move PII out of URLs and query strings — never put identifiers like SSNs or card numbers in the path. Use POST bodies over TLS instead.',
            },
            {
                text: 'Have the upstream return only the object properties the caller needs; do not over-expose records.',
            },
            {
                text: 'Ensure the endpoint is TLS-only so the data is never in clear text; pair with the weak-TLS and plain-text remediations above.',
            },
        ],
    },
    replay_suspect: {
        whatItIs:
            'The same request_id was seen more than once inside the replay window — either a replay attack, a buggy client retrying unsafely, or a duplicated log pipeline.',
        whyItMatters:
            'Replayed state-changing requests can double-charge, double-submit, or re-trigger sensitive operations.',
        howDetected:
            'The collector tracks request_id values over the replay window and flags duplicates. The window is tunable in Settings → API Discovery.',
        owaspRef: 'API8:2023 Security Misconfiguration',
        mitigationType: 'app-side',
        steps: [
            {
                text: 'Make state-changing endpoints idempotent — require a client-supplied idempotency key or a one-time nonce and reject repeats.',
            },
            {
                text: 'If the duplicates are not real traffic, check for a duplicated access-log / collector pipeline producing the same request_id twice.',
            },
            {
                text: 'Add an HTTP Local Rate Limit filter to blunt high-volume replay bursts.',
                envoyFilter: 'HTTP Local Rate Limit',
                link: LISTENER,
            },
        ],
    },
    oversized_response: {
        whatItIs:
            'The response body is several times larger than this endpoint’s historical mean — a canary for bulk data extraction.',
        whyItMatters:
            'A sudden oversized response can mean an attacker dumped a whole table through an endpoint meant to return a single record.',
        howDetected:
            'The collector learns a per-endpoint response-size baseline and flags responses that exceed it by the configured multiplier (tunable in Settings → API Discovery).',
        owaspRef: 'API4:2023 Unrestricted Resource Consumption',
        mitigationType: 'app-side',
        steps: [
            {
                text: 'Review the upstream — enforce pagination and result caps so a single call cannot return an unbounded dataset.',
            },
            {
                text: 'Confirm object-level authorization: an oversized response often accompanies a BOLA-style bulk read.',
            },
            {
                text: 'As a backstop, cap payloads at the edge with a Buffer filter (max request bytes) or throttle egress with a Bandwidth Limit filter.',
                envoyFilter: 'Bandwidth Limit',
                link: LISTENER,
            },
            {
                text: 'Tune the response-size multiplier and baseline settings.',
                link: SETTINGS,
            },
        ],
    },
    scanner_user_agent: {
        whatItIs:
            'The User-Agent header matched a known security scanner or pen-test tool — sqlmap, nuclei, nikto, and similar.',
        whyItMatters:
            'It signals active reconnaissance against your API. The UA is trivially spoofable, so treat it as a corroborating signal rather than proof.',
        howDetected:
            'The collector matches the request User-Agent against a list of known scanner fingerprints.',
        owaspRef: 'API8:2023 Security Misconfiguration',
        mitigationType: 'envoy-http-filter',
        steps: [
            {
                text: 'Add an RBAC filter with a deny policy whose principal matches the scanner User-Agent header values.',
                envoyFilter: 'RBAC',
                link: LISTENER,
            },
            {
                text: 'Do not rely on UA blocking alone — it is easily spoofed. Combine it with rate limiting and the WAF for real coverage.',
            },
            {
                text: 'Correlate with behavioural flags (path scan, brute force) on the same source IP to confirm a genuine scan.',
            },
        ],
    },
    vuln_probe_path: {
        whatItIs:
            'The first path segment targets a well-known leak file or exploit path — .env, .git, .aws, wp-login.php, server-status, and similar. A request like this against an API is never legitimate.',
        whyItMatters:
            'These are automated probes hunting for leaked secrets or vulnerable software. A hit means your API is being actively scanned.',
        howDetected:
            'The collector matches the leading path segment against a list of well-known probe targets.',
        owaspRef: 'API8:2023 Security Misconfiguration',
        mitigationType: 'envoy-http-filter',
        steps: [
            {
                text: 'Add an RBAC filter to the serving listener and deny these probe path prefixes outright for all principals.',
                envoyFilter: 'RBAC',
                link: LISTENER,
            },
            {
                text: 'Confirm none of these files are actually served — a real .env or .git response is a critical leak that needs immediate cleanup.',
            },
            {
                text: 'Front the listener with the WAF for continuously-updated probe signatures.',
            },
        ],
    },
    path_scan_suspect: {
        whatItIs:
            'A single source IP or consumer hit many distinct paths that returned 4xx — the signature of content-discovery / directory-brute tools like gobuster, ffuf, and dirb.',
        whyItMatters:
            'The attacker is mapping your attack surface, looking for an unprotected or forgotten endpoint to exploit.',
        howDetected:
            'The collector counts distinct 4xx paths per source IP over the path-scan window and flags those above the threshold. Both are tunable in Settings → API Discovery.',
        owaspRef: 'API8:2023 Security Misconfiguration',
        mitigationType: 'envoy-http-filter',
        steps: [
            {
                text: 'Add an HTTP Local Rate Limit filter so a single IP cannot fan out across hundreds of paths quickly.',
                envoyFilter: 'HTTP Local Rate Limit',
                link: LISTENER,
            },
            {
                text: 'If the scan is sustained from fixed ranges, deny those CIDRs with an RBAC filter.',
                envoyFilter: 'RBAC',
            },
            {
                text: 'Tune the path-scan threshold and window to your traffic.',
                link: SETTINGS,
            },
        ],
    },
    impossible_travel: {
        whatItIs:
            'The same consumer or IP appeared from two locations too far apart to physically travel between in the elapsed time.',
        whyItMatters:
            'It strongly indicates a stolen credential or token being used from a second location while the legitimate user is still active.',
        howDetected:
            'The collector geolocates source IPs per consumer and computes the implied travel speed between consecutive events, flagging physically impossible jumps.',
        owaspRef: 'API2:2023 Broken Authentication',
        mitigationType: 'app-side',
        steps: [
            {
                text: 'Treat the affected consumer as potentially compromised — force a re-authentication and revoke active sessions / tokens at the IdP.',
            },
            {
                text: 'Add adaptive / step-up authentication (MFA) for sensitive operations so a stolen token alone is not enough.',
            },
            {
                text: 'Shorten token TTLs so a leaked credential expires quickly (see the weak-token-TTL guidance).',
            },
        ],
    },
    ip_rate_anomaly: {
        whatItIs:
            'A single source IP is exceeding the expected per-IP request rate — automated abuse or a misbehaving client.',
        whyItMatters:
            'Per-IP floods exhaust capacity and can be a denial-of-service vector, even when no single consumer stands out.',
        howDetected:
            'The collector counts requests per source IP over the IP-rate window and flags IPs above the threshold (tunable in Settings → API Discovery).',
        owaspRef: 'API4:2023 Unrestricted Resource Consumption',
        mitigationType: 'envoy-http-filter',
        steps: [
            {
                text: 'Add an HTTP Local Rate Limit filter with a per-source-IP descriptor so each client IP gets its own bucket.',
                envoyFilter: 'HTTP Local Rate Limit',
                link: LISTENER,
            },
            {
                text: 'For protection before the HTTP layer, add a Network Local Rate Limit or a Listener-level Local Rate Limit filter to cap connections per IP.',
                envoyFilter: 'Network Local Rate Limit',
            },
            {
                text: 'Tune the IP-rate threshold and window to real traffic.',
                link: SETTINGS,
            },
        ],
    },

    // ── Medium ──────────────────────────────────────────────────────
    unauthenticated: {
        whatItIs:
            'The request carried no authentication header (Authorization, Cookie, X-Api-Key, …). For genuinely public endpoints this is expected; the flag is informative.',
        whyItMatters:
            'If an endpoint that should be protected is being reached without a credential, it is exposed. Decide intent per endpoint.',
        howDetected:
            'The collector records the absence of any recognised auth header on the event.',
        owaspRef: 'API2:2023 Broken Authentication',
        mitigationType: 'envoy-http-filter',
        steps: [
            {
                text: 'If the endpoint is meant to be public, no action is needed — this flag is informational.',
            },
            {
                text: 'If it should be protected, add a JWT Authentication, OAuth2, or Basic Auth filter to the serving listener’s HCM.',
                envoyFilter: 'JWT Authentication',
                link: LISTENER,
            },
            {
                text: 'Add an RBAC filter requiring an authenticated principal so anonymous calls are rejected at the edge.',
                envoyFilter: 'RBAC',
            },
        ],
    },
    error_status: {
        whatItIs:
            'The response status was 5xx — a server-side failure. Concerning when it clusters on one endpoint.',
        whyItMatters:
            'Sustained 5xx means an outage or a bug; a sudden burst can also be the visible effect of an attack overwhelming the upstream.',
        howDetected:
            'The collector flags events whose response status is in the 5xx range.',
        mitigationType: 'app-side',
        steps: [
            {
                text: 'Investigate the upstream service — 5xx is generated by the application, not by Envoy. Check logs and recent deploys.',
            },
            {
                text: 'Use the Errors dashboard and this endpoint’s Events tab to see whether the failures cluster in time or by caller.',
            },
            {
                text: 'If the 5xx burst is attack-driven (e.g. resource exhaustion), apply the rate-limit remediations to protect the upstream.',
                envoyFilter: 'HTTP Local Rate Limit',
            },
        ],
    },
    legacy_protocol: {
        whatItIs:
            'The request used HTTP/1.0 or HTTP/1.1 instead of HTTP/2 or HTTP/3. This is an operational-hygiene signal, not an attack.',
        whyItMatters:
            'Legacy HTTP versions miss multiplexing and header compression and can be more exposed to request-smuggling classes of bug.',
        howDetected:
            'The collector reads the negotiated protocol from each event and flags HTTP/1.x.',
        mitigationType: 'envoy-tls',
        steps: [
            {
                text: 'Enable HTTP/2 on the listener’s HTTP Connection Manager (codec type AUTO or HTTP2).',
                link: LISTENER,
            },
            {
                text: 'Ensure the TLS transport socket advertises h2 via ALPN so modern clients negotiate up.',
            },
            {
                text: 'Some clients legitimately only speak HTTP/1.1 — treat this flag as hygiene, not an incident.',
            },
        ],
    },
    unsafe_method_on_readonly: {
        whatItIs:
            'A state-changing method (POST / PUT / DELETE / PATCH) hit a path conventionally reserved for read-only probes — /healthz, /metrics, /favicon.ico, /robots.txt.',
        whyItMatters:
            'It is either a misrouted client or someone probing for an unexpected write handler behind a benign-looking path.',
        howDetected:
            'The collector flags write methods observed on paths in its read-only-probe list.',
        owaspRef: 'API8:2023 Security Misconfiguration',
        mitigationType: 'envoy-http-filter',
        steps: [
            {
                text: 'Restrict the allowed methods on these routes. Add an RBAC filter that permits only GET / HEAD on probe paths.',
                envoyFilter: 'RBAC',
                link: LISTENER,
            },
            {
                text: 'Confirm the upstream does not actually expose a write handler on a probe path.',
            },
        ],
    },
    latency_anomaly: {
        whatItIs:
            'Request latency deviated significantly from this endpoint’s self-learned baseline — a behavioural anomaly.',
        whyItMatters:
            'A latency spike can mean upstream degradation, a slow dependency, or an abuse pattern dragging the service down.',
        howDetected:
            'The behavioural detector maintains a per-endpoint latency baseline and flags statistically significant deviations. Its sensitivity (sigma, consecutive breaches) is tunable in Settings → API Discovery.',
        mitigationType: 'app-side',
        steps: [
            {
                text: 'Investigate upstream performance — slow dependencies, GC pauses, database contention. Envoy reports the latency but does not cause it.',
            },
            {
                text: 'Check the Analytics tab for this endpoint to see when the deviation started and whether it correlates with a deploy.',
            },
            {
                text: 'If the latency is abuse-driven, apply rate limiting; otherwise tune the behavioural detector sensitivity.',
                link: SETTINGS,
            },
        ],
    },
    error_rate_spike: {
        whatItIs:
            'The endpoint’s error rate spiked well above its self-learned baseline — a behavioural anomaly.',
        whyItMatters:
            'A sudden error-rate jump usually means a bad deploy, an outage, or an attack pushing the endpoint into failure.',
        howDetected:
            'The behavioural detector tracks a per-endpoint error-rate baseline and flags significant spikes. Sensitivity is tunable in Settings → API Discovery.',
        mitigationType: 'app-side',
        steps: [
            {
                text: 'Check recent deploys and upstream health — the spike is generated by the application.',
            },
            {
                text: 'Use the Errors dashboard and Events tab to classify the errors (4xx vs 5xx) and find the trigger.',
            },
            {
                text: 'Tune the behavioural error-rate detector sensitivity if the baseline is too tight for this endpoint.',
                link: SETTINGS,
            },
        ],
    },
    permissive_cors: {
        whatItIs:
            'The endpoint returns an over-permissive CORS policy — Access-Control-Allow-Origin: * , or a reflected origin combined with credentials. Any website could call it from a browser.',
        whyItMatters:
            'A wildcard or reflected CORS policy with credentials lets a malicious site make authenticated requests on a victim’s behalf.',
        howDetected:
            'The collector inspects CORS response headers and flags wildcard or credential-bearing reflected-origin policies.',
        owaspRef: 'API8:2023 Security Misconfiguration',
        mitigationType: 'envoy-http-filter',
        steps: [
            {
                text: 'Add a CORS filter to the serving listener’s HCM (or fix the existing one).',
                envoyFilter: 'CORS',
                link: LISTENER,
            },
            {
                text: 'Set an explicit allow-origin list of the exact trusted front-end origins — never * when credentials are allowed.',
            },
            {
                text: 'Only enable allow-credentials when a concrete origin list is in place, and scope allowed methods / headers tightly.',
            },
        ],
    },

    // ── Low ─────────────────────────────────────────────────────────
    version_disclosure: {
        whatItIs:
            'A response header or body leaked a software or framework version — Server, X-Powered-By, or a banner string.',
        whyItMatters:
            'Knowing the exact version helps an attacker pick known CVEs to target. Removing it is cheap defence-in-depth.',
        howDetected:
            'The collector scans response headers and banners for version-bearing values.',
        owaspRef: 'API8:2023 Security Misconfiguration',
        mitigationType: 'envoy-http-filter',
        steps: [
            {
                text: 'Add a Header Mutation filter to the serving listener’s HCM.',
                envoyFilter: 'Header Mutation',
                link: LISTENER,
            },
            {
                text: 'Add response-header remove rules for Server, X-Powered-By, X-AspNet-Version, and any framework banner headers.',
            },
        ],
    },
    missing_x_content_type_options: {
        whatItIs:
            'The response lacks the X-Content-Type-Options: nosniff header, so browsers may MIME-sniff and mis-interpret the body.',
        whyItMatters:
            'MIME sniffing can turn a benign upload or response into executable script in the victim’s browser.',
        howDetected:
            'The collector flags responses missing the X-Content-Type-Options header.',
        owaspRef: 'API8:2023 Security Misconfiguration',
        mitigationType: 'envoy-http-filter',
        steps: [
            {
                text: 'Add a Header Mutation filter to the serving listener’s HCM.',
                envoyFilter: 'Header Mutation',
                link: LISTENER,
            },
            {
                text: 'Append the response header X-Content-Type-Options = nosniff.',
            },
        ],
    },
    missing_x_frame_options: {
        whatItIs:
            'The response lacks X-Frame-Options (or an equivalent frame-ancestors CSP directive), so the page can be embedded in a frame.',
        whyItMatters:
            'Framing enables clickjacking — overlaying your UI invisibly to trick users into unintended actions.',
        howDetected:
            'The collector flags responses with neither X-Frame-Options nor a frame-ancestors CSP.',
        owaspRef: 'API8:2023 Security Misconfiguration',
        mitigationType: 'envoy-http-filter',
        steps: [
            {
                text: 'Add a Header Mutation filter to the serving listener’s HCM.',
                envoyFilter: 'Header Mutation',
                link: LISTENER,
            },
            {
                text: 'Append X-Frame-Options = DENY (or SAMEORIGIN), and ideally a Content-Security-Policy with frame-ancestors.',
            },
        ],
    },
    missing_csp: {
        whatItIs:
            'The response lacks a Content-Security-Policy header — there is no defence-in-depth against injected or cross-site scripts.',
        whyItMatters:
            'A CSP is the last line of defence that contains an XSS bug even after one slips into the application.',
        howDetected:
            'The collector flags responses with no Content-Security-Policy header.',
        owaspRef: 'API8:2023 Security Misconfiguration',
        mitigationType: 'envoy-http-filter',
        steps: [
            {
                text: 'Add a Header Mutation filter to the serving listener’s HCM.',
                envoyFilter: 'Header Mutation',
                link: LISTENER,
            },
            {
                text: 'Append a Content-Security-Policy header. Start strict (default-src \'self\') and relax only as the app needs.',
            },
            {
                text: 'For pure JSON APIs a minimal policy such as default-src \'none\' is usually enough.',
            },
        ],
    },
    internal_host: {
        whatItIs:
            'The request Host resolved to an internal address — loopback, RFC1918, *.svc.cluster.local, *.local, and similar. This is context, not a threat.',
        whyItMatters:
            'It tells you the traffic is internal. Useful for separating east-west from north-south traffic when triaging other flags.',
        howDetected:
            'The collector classifies the Host value against internal address ranges and naming patterns.',
        mitigationType: 'observational',
        steps: [
            {
                text: 'No action required — this is a classification signal. Use it to decide whether a co-occurring risk flag is internal-only or internet-facing.',
            },
        ],
    },
    external_host: {
        whatItIs:
            'The request Host resolved to a public address or FQDN. This is context, not a threat.',
        whyItMatters:
            'It marks internet-facing traffic, which raises the priority of any other risk flag on the same endpoint.',
        howDetected:
            'The collector classifies the Host value as a public address / FQDN.',
        mitigationType: 'observational',
        steps: [
            {
                text: 'No action required — this is a classification signal. Treat co-occurring risk flags on external hosts as higher priority.',
            },
        ],
    },
    client_error_status: {
        whatItIs:
            'The response status was 4xx — a bad request from the caller. Common on healthy traffic; only meaningful when it clusters.',
        whyItMatters:
            'Isolated 4xx is normal. A cluster of 4xx from one source can indicate scanning, a broken integration, or an enumeration attempt.',
        howDetected:
            'The collector flags events whose response status is in the 4xx range.',
        mitigationType: 'observational',
        steps: [
            {
                text: 'No action needed for isolated 4xx. If they cluster from one source, cross-check the path-scan and brute-force flags on that IP.',
            },
        ],
    },
};

export const riskRemediation = (flag: string): RiskRemediation | undefined =>
    RISK_REMEDIATION_GUIDE[flag];

// ── Action-plan helpers ─────────────────────────────────────────────
// Used by the Risk Guide "Fix-it plan" section and the per-endpoint
// remediation summary. Both group a set of risk flags by the single
// canonical action that closes them.

export interface PrimaryFix {
    /** Stable grouping key. */
    key: string;
    /** Imperative label, e.g. "Add a Header Mutation filter". */
    label: string;
    kind: MitigationType;
    /** The Envoy filter name when kind is envoy-http-filter. */
    envoyFilter?: string;
    /** Deep-link into the editor that applies the fix. */
    link?: { to: string; label: string };
}

// The single canonical action used to group a flag in an action plan.
// envoy-tls / app-side collapse into one bucket each; envoy-http-filter
// flags group by the first Envoy filter their remediation names.
export const primaryFix = (flag: string): PrimaryFix | undefined => {
    const g = RISK_REMEDIATION_GUIDE[flag];
    if (!g) return undefined;
    switch (g.mitigationType) {
        case 'observational':
            return { key: 'observational', label: 'No action required', kind: 'observational' };
        case 'envoy-tls':
            return {
                key: 'envoy-tls',
                label: 'Harden the listener TLS / transport',
                kind: 'envoy-tls',
                link: LISTENER,
            };
        case 'app-side':
            return { key: 'app-side', label: 'Apply an application-side change', kind: 'app-side' };
        case 'envoy-http-filter': {
            const step = g.steps.find((s) => s.envoyFilter);
            const filter = step?.envoyFilter ?? 'HTTP';
            return {
                key: `filter:${filter}`,
                label: `Add a ${filter} filter`,
                kind: 'envoy-http-filter',
                envoyFilter: filter,
                link: step?.link ?? LISTENER,
            };
        }
        default:
            return undefined;
    }
};

export interface ActionGroup {
    fix: PrimaryFix;
    /** Flag ids closed by this fix. */
    flags: string[];
}

// Sort weight — Envoy fixes first (the operator can act now), then
// transport, then application-side changes.
const FIX_KIND_WEIGHT: Record<MitigationType, number> = {
    'envoy-http-filter': 0,
    'envoy-tls': 1,
    'app-side': 2,
    observational: 3,
};

// Group a set of flags by their canonical fix. Observational flags
// (no action) are dropped. Default order is Envoy-first, then by size.
export const buildActionPlan = (flags: string[]): ActionGroup[] => {
    const groups = new Map<string, ActionGroup>();
    for (const f of flags) {
        const fix = primaryFix(f);
        if (!fix || fix.kind === 'observational') continue;
        const g = groups.get(fix.key);
        if (g) {
            if (!g.flags.includes(f)) g.flags.push(f);
        } else {
            groups.set(fix.key, { fix, flags: [f] });
        }
    }
    return [...groups.values()].sort(
        (a, b) =>
            FIX_KIND_WEIGHT[a.fix.kind] - FIX_KIND_WEIGHT[b.fix.kind] ||
            b.flags.length - a.flags.length,
    );
};

// ── OWASP API Security Top 10 (2023) ────────────────────────────────

export const OWASP_API_TOP10: { id: string; label: string }[] = [
    { id: 'API1', label: 'Broken Object Level Authorization' },
    { id: 'API2', label: 'Broken Authentication' },
    { id: 'API3', label: 'Broken Object Property Level Authorization' },
    { id: 'API4', label: 'Unrestricted Resource Consumption' },
    { id: 'API5', label: 'Broken Function Level Authorization' },
    { id: 'API6', label: 'Unrestricted Access to Sensitive Business Flows' },
    { id: 'API7', label: 'Server Side Request Forgery' },
    { id: 'API8', label: 'Security Misconfiguration' },
    { id: 'API9', label: 'Improper Inventory Management' },
    { id: 'API10', label: 'Unsafe Consumption of APIs' },
];

// Parse the OWASP category id ("API2") out of a flag's owaspRef.
export const flagOwaspId = (flag: string): string | undefined => {
    const m = RISK_REMEDIATION_GUIDE[flag]?.owaspRef?.match(/^(API\d+)/);
    return m ? m[1] : undefined;
};
