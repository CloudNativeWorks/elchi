// API Discovery response types — mirrors backend models in
//   elchi-backend/pkg/clickhouse/models.go (RawEvent, RollupBucket)
//   elchi-collector/docs/schema.md (api_inventory MongoDB doc shape)
// Keep field names in lockstep with the server contract.

export type Protocol = 'http/1.0' | 'http/1.1' | 'http/2' | 'http/3' | 'tcp' | 'grpc';
export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'CONNECT' | 'TRACE';
export type Granularity = '1m' | '1h' | '1d';

export type SortOrder = 'asc' | 'desc';

export interface PaginatedResponse<T> {
    data: T[];
    count: number;
    total_count: number;
    total_pages: number;
    limit: number;
    offset: number;
    current_page: number;
    has_next: boolean;
    has_prev: boolean;
    /** Echoed back by sort-capable endpoints so the UI can confirm
     *  which ordering the server actually applied. */
    sort_by?: string;
    sort_order?: SortOrder;
    /** Present only on catalog lists requested with `with_current=true`:
     *  whether the current-vs-ever overlay (ClickHouse 1h rollup) succeeded.
     *  false → the per-row current_* fields are absent; render the monotonic
     *  "_ever" max_risk_score instead. */
    current_available?: boolean;
    /** Whether the current EXPOSURE axis is available. Always false for now —
     *  the collector ships risk_score (threat) to ClickHouse but not
     *  posture_score (exposure), so exposure stays "_ever" only. Read it so
     *  the UI flips automatically once the collector mirrors posture_score. */
    posture_current_available?: boolean;
}

export interface SingleResponse<T> {
    data: T;
}

// One row from GET /api/v3/inventory/listeners (Mongo aggregation result).
export interface ListenerSummary {
    listener_name: string;
    project_id: string;
    normalized_path_count: number;
    hostnames: string[];
    risk_flags: string[];
    last_seen: string;            // ISO-8601
    status_dist: Record<string, number>; // status code (string) → count
}

// One document from `api_inventory` collection (drives GET /api/v3/inventory & /:id).
export interface InventoryDoc {
    _id: string;
    project_id: string;
    listener_name: string;
    protocol: string;
    host: string;
    method: string;
    normalized_path: string;
    grpc_service: string;
    grpc_method: string;
    first_seen: string;
    last_seen: string;
    seen_count: number;
    response_bytes_total: number;
    response_bytes_max: number;
    latency_max_ms: number;
    latency_buckets: {
        lt5: number;
        lt25: number;
        lt100: number;
        lt500: number;
        lt2000: number;
        ge2000: number;
    };
    status_dist: Record<string, number>;
    risk_flags: string[];
    max_risk_score: number;       // THREAT axis — active attack/abuse (0–255)
    max_posture_score?: number;   // EXPOSURE axis — config hygiene (0–255)
    pii_categories: string[];
    endpoint_categories: string[];
    auth_observed: boolean;
    noauth_observed: boolean;
    /** Observed consumer auth schemes: jwt | mtls | apikey | none. Absent
     *  when the collector's consumer fingerprinting is disabled. */
    auth_schemes?: string[];
    consumers: string[];          // hashed
    sample_event_ids: string[];   // hex ObjectIDs (≤5)
    clusters: string[];
    routes: string[];
    content_types: string[];
    /** Web origins (SPA / site) observed calling this endpoint — from the
     *  request Origin header. Absent on docs written by older collectors. */
    origins?: string[];
    /** true = a real, confirmed endpoint; false = scanner / attack-surface
     *  noise. The main catalog returns only confirmed docs; the
     *  /attack-surface endpoint returns the rest. */
    confirmed?: boolean;
    /** Current (windowed) THREAT max from the 1h rollup — present only when
     *  the list was requested with `with_current=true` and the response's
     *  current_available is true. null = dormant (no traffic in the window);
     *  see current_dormant. Always ≤ max_risk_score (the lifetime max). */
    current_max_risk?: number | null;
    /** true = no traffic in the current window (dormant) → current_max_risk
     *  is null; show the "_ever" max greyed out. */
    current_dormant?: boolean;
}

// ---------- /inventory/:id/current-posture — current vs ever ----------
// The inventory doc only stores monotonic ($max) "ever observed" scores, so a
// remediated endpoint stays red forever. This endpoint answers "is it STILL
// bad?" by pairing the doc's "_ever" scores with a ClickHouse-windowed
// "current" snapshot. Always 200 (graceful) — never blocks the "_ever" answer.

export interface CurrentPosture {
    active: boolean;
    window_days: number;
    /** Windowed THREAT max — read from raw with the full host-precise key
     *  (sampling-safe: the collector only ever drops benign events). */
    max_risk_score: number;
    /** Windowed EXPOSURE max — absent until the collector ships posture_score
     *  to the time-series store (gated by posture_current_available). Read it
     *  now so current exposure renders automatically once it arrives. */
    max_posture_score?: number | null;
    /** Flags STILL seen in the window (raw, ≤ retention). */
    risk_flags: string[];
    pii_categories: string[];
    auth_observed: boolean;       // ≥1 authenticated request in window
    noauth_observed: boolean;     // ≥1 UNauthenticated request (posture signal)
    event_count: number;
    last_active: string;          // RFC3339
}

export interface CurrentPostureResponse {
    /** false → ClickHouse offline / query failed; `current` is null, fall
     *  back to `ever`. The request still returns 200. */
    current_available: boolean;
    /** true → ClickHouse is reachable but the window had no traffic; `current`
     *  is null. "clean because quiet" ≠ "clean because remediated". */
    dormant?: boolean;
    window_days?: number;
    /** Null when dormant or current_available is false. */
    current: CurrentPosture | null;
    /** Monotonic scores from the inventory doc (always present). */
    ever: {
        max_risk_score: number;
        max_posture_score: number;
    };
    /** Current EXPOSURE axis — always false for now (collector doesn't ship
     *  posture_score to ClickHouse). When it flips true, `current` gains a
     *  max_posture_score and the UI shows current exposure too. */
    posture_current_available: boolean;
    /** Set when current_available is false due to a query error (not a
     *  missing ClickHouse). */
    current_error?: string;
}

// One row from GET /api/v3/inventory/:id/events (api_events_raw via ClickHouse).
export interface RawEvent {
    event_id: string;
    ts: string;
    created_at: string;
    node_id: string;
    listener_name: string;
    project_id: string;
    listener_ip: string;
    instance_id: string;
    stream_id: string;
    protocol: string;
    method: string;
    normalized_path: string;
    host: string;
    grpc_service: string;
    grpc_method: string;
    status_code: number;
    grpc_status?: number;
    grpc_message?: string;
    request_id: string;
    redirect_location?: string;
    duration_ms: number;
    request_bytes: number;
    response_bytes: number;
    cluster?: string;
    route_name?: string;
    content_type?: string;
    user_agent_hash?: string;
    source_ip_hash?: string;
    /** Raw values — present when the collector's compliance config keeps
     *  them. Omitted (omitempty) when opt-out is on. */
    user_agent?: string;
    source_ip?: string;
    consumer_hash?: string;
    auth_observed: number;        // 0 | 1 from UInt8
    risk_flags?: string[];
    pii_categories?: string[];
    endpoint_categories?: string[];
    tls_version?: string;
    tls_sni?: string;
    tls_peer_subject?: string;
    tls_peer_issuer?: string;
    headers?: Record<string, string>;
    risk_score: number;
    tags?: Record<string, string>;
}

// One row from GET /api/v3/inventory/:id/stats (rollup table).
export interface RollupBucket {
    bucket_size: '1m' | '1h' | '1d';
    ts_bucket: string;
    project_id: string;
    listener_name: string;
    method?: string;
    normalized_path?: string;
    status_class: number;         // 1..5
    events_count: number;
    duration_p50_ms: number;
    duration_p95_ms: number;
    duration_p99_ms: number;
    duration_avg_ms: number;
    response_bytes_sum: number;
    response_bytes_max: number;
    max_risk_score: number;
    unique_consumers: number;
    unique_source_ips: number;
    error_count: number;
    client_error_count: number;
}

// ---------- Query parameter shapes ----------

export type ListenerSortField = 'last_seen' | 'normalized_path_count';

export interface InventoryListenersParams {
    listener_name?: string;
    /** Host prefix filter — applied to the pre-$group $match, so a listener
     *  surfaces only if it has ≥1 endpoint whose host starts with this. */
    host?: string;
    sort_by?: ListenerSortField;
    sort_order?: SortOrder;
    limit?: number;
    offset?: number;
}

// Backend `/inventory` sort whitelist (inventory.go parseInventoryListFilter).
// `error_count` is intentionally absent — it is not a stored field yet.
export type InventoryListSortField =
    | 'last_seen'
    | 'max_risk_score'
    | 'max_posture_score'
    | 'seen_count'
    | 'latency_max_ms';

export interface InventoryListParams {
    listener_name?: string;
    host?: string;
    normalized_path?: string;
    method?: string[];
    protocol?: string[];
    risk_flag?: string[];
    endpoint_category?: string[];
    pii_category?: string[];
    min_risk_score?: number;
    max_risk_score?: number;
    /** Read-side maturity gate (opt-in). Keeps only operations seen ≥ this
     *  many times — filters one-off scanner hits that route-aware `confirmed`
     *  promotes into the catalog. Omit / 0 = off. */
    min_seen?: number;
    /** Overlay each row with its current (windowed) THREAT max from the 1h
     *  rollup so the catalog defaults to CURRENT risk, not the monotonic
     *  "_ever" max. Adds current_max_risk / current_dormant per row +
     *  current_available at the response root. */
    with_current?: boolean;
    /** Window (days) for the with_current overlay. Default 7, max 7 — current
     *  is read from the raw event table, which is bounded by ~7d retention. */
    current_window_days?: number;
    last_seen_from?: string;
    last_seen_to?: string;
    sort_by?: InventoryListSortField;
    sort_order?: SortOrder;
    limit?: number;
    offset?: number;
    /** Geo cross-filter — narrows results to endpoints that have served
     *  traffic from this ISO α-2 country (resolved via ClickHouse). */
    country?: string;
    /** Geo cross-filter — ASN number (e.g. 12735). */
    asn?: string;
    /** Raw value cross-filter — exact-match source IP. Empty when the
     *  collector compliance config opts out of raw IP storage. */
    source_ip?: string;
    /** Raw value cross-filter — exact-match User-Agent string. */
    user_agent?: string;
}

// ---------- /inventory/operations — path-grouped catalog ----------
// Each row is one (host, normalized_path) path; its methods are nested
// under `operations[]`, one entry per HTTP method / gRPC operation.

export interface OperationEntry {
    /** Mongo _id (hex string) of the underlying per-operation inventory
     *  doc — deep-links into the endpoint detail page (/inventory/:id).
     *  Identity is at the operation level; the path group itself has no
     *  single _id. Optional only for forward-compat safety. */
    _id?: string;
    method: string;
    protocol: string;
    grpc_service: string;
    grpc_method: string;
    listener_name?: string;
    seen_count: number;
    max_risk_score: number;       // threat
    max_posture_score?: number;   // exposure
    risk_flags: string[];
    pii_categories: string[];
    endpoint_categories: string[];
    auth_observed: boolean;
    noauth_observed: boolean;
    auth_schemes?: string[];
    latency_max_ms: number;
    last_seen: string;
    /** Current (windowed) THREAT max for this operation — present only with
     *  `with_current=true`. null = dormant. See current_dormant. */
    current_max_risk?: number | null;
    current_dormant?: boolean;
}

export interface OperationGroup {
    host: string;
    normalized_path: string;
    /** The same (host, path) can exist under multiple listeners — the
     *  backend returns the full set, not a single listener_name. */
    listeners?: string[];
    methods: string[];            // the path's method set
    operation_count: number;
    total_seen: number;           // path-wide call count
    max_risk_score: number;       // threat (path rollup)
    max_posture_score?: number;   // exposure (path rollup)
    first_seen: string;
    last_seen: string;
    operations: OperationEntry[];
    /** Path-row current THREAT max = the max across this path's ACTIVE
     *  operations (null when every operation is dormant). Present only with
     *  `with_current=true`. */
    current_max_risk?: number | null;
    current_dormant?: boolean;
}

export type OperationsSortField =
    | 'last_seen'
    | 'total_seen'
    | 'max_risk_score'
    | 'max_posture_score'
    | 'operation_count';

// /operations shares the exact /inventory filter parser, so its params are
// identical (SINGULAR risk_flag / endpoint_category / pii_category) — only
// the sort_by whitelist differs.
export type OperationsListParams = Omit<InventoryListParams, 'sort_by'> & {
    sort_by?: OperationsSortField;
};

// /operations returns the standard pagination envelope (total_count, …).
export type OperationsResponse = PaginatedResponse<OperationGroup>;

// Backend `/inventory/:id/events` sort whitelist (rawEventsOrderBy).
export type EventsSortField = 'ts' | 'duration_ms' | 'status_code' | 'risk_score';

export interface InventoryEventsParams {
    from?: string;
    to?: string;
    method?: string;
    status_min?: number;
    status_max?: number;
    request_id?: string;
    limit?: number;
    offset?: number;
    include_total?: boolean;
    /** Response field set. `core` (default) excludes headers / tags /
     *  tls_* metadata, cutting wire size by ~60-80%. `full` brings them
     *  back — needed when the expand-row drawer is in use. */
    fields?: 'core' | 'full';
    /** `true` → cross-DB drill-down: backend reads the parent doc's
     *  `sample_event_ids[]` and auto-widens the time window to 7d so the
     *  captured samples are always in range. Ignores from/to. */
    sample?: boolean;
    sort_by?: EventsSortField;
    sort_order?: SortOrder;
    /** hasAny semantics — events carrying ≥1 of the listed risk flags. */
    risk_flag?: string[];
    /** hasAny semantics — events carrying ≥1 of the listed PII categories. */
    pii_category?: string[];
    /** Keep only events with risk_score ≥ this (1–255). */
    min_risk_score?: number;
}

export interface InventoryStatsParams {
    granularity: Granularity;
    from?: string;
    to?: string;
    method?: string;
}

// ---------- Geo summary (GET /api/v3/inventory/geo) ----------

export interface GeoKindBreakdown {
    internal: number;
    external: number;
    unknown: number;
}

export interface GeoCountry {
    code: string;        // ISO-3166-1 α-2
    name: string;        // English label
    count: number;
    percentage: number;  // 0–100, one decimal
}

export interface GeoASN {
    asn: string;         // e.g. "AS9121"
    org: string;
    count: number;
    percentage: number;
}

export interface GeoCity {
    city: string;
    country: string;     // ISO α-2 disambiguator
    count: number;
    percentage: number;
}

export interface UAFamily {
    family: string;      // tool/agent name (e.g. "Chrome", "curl")
    kind: string;        // taxonomy bucket (browser, cli, library, bot, …)
    count: number;
}

export interface UASummary {
    kinds: Record<string, number>; // ua.kind → count
    /** Backend may return `null` when no families had enough events. */
    top_families: UAFamily[] | null;
}

export interface TISource {
    source: string;      // threat-intel feed name
    count: number;
}

export interface TIHit {
    total_hits: number;
    percentage: number;
    /** Backend returns `null` when no threat-intel hits in the window. */
    top_sources: TISource[] | null;
}

/** Raw User-Agent string + occurrence counts. Empty/missing when the
 *  collector's compliance policy strips the raw value. */
export interface RawUserAgent {
    value: string;
    count: number;
    percentage: number;
}

/** Raw source IP + occurrence counts. Same compliance gating as above. */
export interface RawSourceIP {
    value: string;
    count: number;
    percentage: number;
}

export interface TimeSeriesByLabel {
    label: string;       // dimension value (country code, ua.kind)
    name?: string;       // optional friendly name
    values: number[];    // one number per bucket; aligned with buckets[]
}

export interface GeoTimeSeries {
    granularity: '1m' | '1h' | '1d';
    buckets: string[];                 // RFC3339 timestamps
    /** Each *_series may be `null` when the dimension has no data. */
    country_series: TimeSeriesByLabel[] | null;
    ua_kind_series: TimeSeriesByLabel[] | null;
    ti_hits_series: number[] | null;
}

export interface GeoSummary {
    total_events: number;
    internal_vs_external: GeoKindBreakdown;
    /** All top_* arrays may be `null` when nothing qualified. */
    top_countries: GeoCountry[] | null;
    top_asns: GeoASN[] | null;
    top_cities: GeoCity[] | null;
    /** Raw value dimensions. Backend returns `null` (or omits the key
     *  in older versions) when compliance opt-out strips raw storage. */
    top_user_agents?: RawUserAgent[] | null;
    top_source_ips?: RawSourceIP[] | null;
    user_agents: UASummary;
    threat_intel: TIHit;
    time_series?: GeoTimeSeries;
}

export interface InventoryGeoParams {
    from: string;        // RFC3339, required
    to: string;          // RFC3339, required
    listener_name?: string;
    inventory_id?: string;
    method?: string;
    top?: number;        // default 10 backend-side
    include_series?: boolean;
    series_granularity?: '1m' | '1h' | '1d';
    /** Opt in to top_user_agents + top_source_ips. Off by default —
     *  costs two extra ClickHouse full-scans. */
    include_raw_dims?: boolean;
}

// ---------- /inventory/discoveries — newly-seen endpoints ----------

export type DiscoveriesSortField = 'first_seen' | 'last_seen' | 'seen_count' | 'max_risk_score';

export interface DiscoveriesResponse {
    data: InventoryDoc[];
    window: string;           // human-readable window ("24h0m0s")
    window_start: string;     // RFC3339
    count: number;
    total_count: number;
    limit: number;
    offset: number;
    sort_by?: DiscoveriesSortField;
    sort_order?: SortOrder;
}

export interface InventoryDiscoveriesParams {
    /** 24h / 72h / 7d / 30d ... up to 90d. */
    window?: string;
    listener_name?: string;
    sort_by?: DiscoveriesSortField;
    sort_order?: SortOrder;
    limit?: number;
    offset?: number;
}

// ---------- /inventory/auth-coverage — unauthenticated endpoints ----------

export type AuthCoverageMode = 'unauthenticated' | 'inconsistent';

export type AuthCoverageSortField = 'seen_count' | 'last_seen' | 'max_risk_score';

export interface AuthCoverageResponse {
    data: InventoryDoc[];
    count: number;
    total_count: number;
    /** Echoes the requested mode. */
    mode: AuthCoverageMode;
    /** "write_methods" by default; "all_methods" when include_read=true. */
    scope: 'write_methods' | 'all_methods';
    sort_by?: AuthCoverageSortField;
    sort_order?: SortOrder;
}

export interface InventoryAuthCoverageParams {
    /** `unauthenticated` (default) — never saw an auth header.
     *  `inconsistent` — saw BOTH authed and unauthed traffic (misconfig). */
    mode?: AuthCoverageMode;
    include_read?: boolean;
    listener_name?: string;
    sort_by?: AuthCoverageSortField;
    sort_order?: SortOrder;
    limit?: number;
    offset?: number;
}

// ---------- /inventory/bot-scanner — heatmap (ClickHouse-backed) ----------

export interface BotScannerEntry {
    normalized_path: string;
    family: string;        // ua.family (e.g. "nmap", "googlebot")
    kind: string;          // ua.kind ("scanner" | "bot" | "browser" | ...)
    count: number;
}

export interface BotScannerResponse {
    data: BotScannerEntry[];
    count: number;
    from: string;
    to: string;
}

export interface InventoryBotScannerParams {
    from?: string;
    to?: string;
    listener_name?: string;
    top?: number;
}

// ---------- /inventory/pii — categories + flat endpoint list ----------

export interface PiiCategorySample {
    listener_name: string;
    normalized_path: string;
    method: string;
}

export interface PiiCategoryBreakdown {
    category: string;
    endpoint_count: number;
    samples: PiiCategorySample[];
}

export type PiiSortField = 'last_seen' | 'seen_count' | 'max_risk_score';

export interface PiiInventoryResponse {
    categories: PiiCategoryBreakdown[];
    endpoints: InventoryDoc[];
    count: number;
    total_count: number;
    sort_by?: PiiSortField;
    sort_order?: SortOrder;
}

export interface InventoryPiiParams {
    listener_name?: string;
    sort_by?: PiiSortField;
    sort_order?: SortOrder;
    limit?: number;
    offset?: number;
}

// ---------- /inventory/zombies — deprecation candidates ----------

export type ZombiesSortField = 'seen_count' | 'last_seen' | 'max_risk_score';

export interface ZombiesResponse {
    data: InventoryDoc[];
    count: number;
    total_count: number;
    inactive_days: number;
    inactive_since: string;
    min_seen_count: number;
    sort_by?: ZombiesSortField;
    sort_order?: SortOrder;
}

export interface InventoryZombiesParams {
    inactive_days?: number;   // default 30, max 365
    min_seen_count?: number;  // default 1000
    listener_name?: string;
    sort_by?: ZombiesSortField;
    sort_order?: SortOrder;
    limit?: number;
    offset?: number;
}

// ---------- /inventory/risk-summary — risk posture ----------

/** One row of `by_flag` — a single risk flag's spread across endpoints. */
export interface RiskFlagRow {
    flag: string;
    severity: number;             // 1 / 4 / 7 / 10 (0 for unknown flags)
    class: string;                // auth / transport / attack_pattern / … / unknown
    severity_band: 'critical' | 'high' | 'medium' | 'low' | string;
    endpoint_count: number;       // flag-occurrence count (not distinct endpoints)
}

/** One row of `by_class` — flags grouped by their taxonomy class. */
export interface RiskClassRow {
    class: string;
    endpoint_count: number;       // sum of flag occurrences in this class
    flags: string[];
}

export interface RiskSummaryResponse {
    total_endpoints: number;
    flagged_endpoints: number;    // distinct endpoints carrying ≥1 flag
    by_flag: RiskFlagRow[];       // desc by endpoint_count
    by_class: RiskClassRow[];     // desc by endpoint_count
    /** Keys: critical / high / medium / low (collector may add more). */
    by_severity: Record<string, number>;
}

export interface InventoryRiskSummaryParams {
    listener_name?: string;
}

// Note: the collector runtime config is no longer served under /inventory.
// It moved to Settings → API Discovery — see
// src/pages/settings/ApiDiscoveryConfig.tsx (GET/PUT /api/v3/setting/api_discovery).

// ---------- /inventory/security-score — A–F security grade ----------

export type SecurityGrade = 'A' | 'B' | 'C' | 'D' | 'F' | 'N/A';

export interface SecurityScoreComponent {
    key: string;          // auth_coverage / transport_security / risk_exposure / …
    label: string;
    score: number;        // 0–100
    grade: SecurityGrade;
    weight: number;       // 0–1, the 5 weights sum to 1
    summary: string;
}

export interface SecurityScoreResponse {
    /** 0–100 — null when there was no traffic in the window. */
    score: number | null;
    grade: SecurityGrade;
    computed_at: string;
    time_window: { from: string; to: string };
    components: SecurityScoreComponent[];
    totals: { endpoints: number; events_analyzed: number };
}

export interface InventorySecurityScoreParams {
    from?: string;
    to?: string;
}

// ---------- /inventory/transport — TLS / transport posture ----------

export interface TransportSummary {
    total_events: number;
    weak_tls_pct: number;
    plaintext_pct: number;
    legacy_protocol_pct: number;
    http2_adoption_pct: number;
}

export interface WeakTransportEntry {
    listener_name: string;
    normalized_path: string;
    host: string;
    tls_version: string;
    protocol: string;
    issues: string[];
    event_count: number;
}

export interface TransportResponse {
    summary: TransportSummary;
    /** TLS version → event count (e.g. TLSv1_3 / TLSv1_2 / TLSv1_0/1_1 / plaintext). */
    tls_versions: Record<string, number>;
    /** Protocol → event count (http/1.x / http/2 / http/3 / tcp). */
    protocols: Record<string, number>;
    weak_transport: WeakTransportEntry[];
    count: number;
    from: string;
    to: string;
}

export interface InventoryTransportParams {
    listener_name?: string;
    from?: string;
    to?: string;
    top?: number;
}

// ---------- /inventory/errors — 4xx / 5xx analysis ----------

export interface ErrorHotspot {
    listener_name: string;
    normalized_path: string;
    method: string;
    total_events: number;
    error_4xx: number;
    error_5xx: number;
    error_rate: number;          // 0–100
    // NOTE: no per-status breakdown — the backend's ErrorHotspot
    // (pkg/clickhouse/models.go) intentionally omits it; drill into
    // /inventory/:id/events?status_min=400 for exact codes.
}

export interface ErrorSummary {
    total_events: number;
    total_4xx: number;
    total_5xx: number;
    overall_error_rate: number;  // 0–100
}

export interface ErrorTimeSeriesPoint {
    bucket: string;
    total: number;
    error_4xx: number;
    error_5xx: number;
}

export interface ErrorsResponse {
    summary: ErrorSummary;
    hotspots: ErrorHotspot[];
    count: number;
    limit: number;
    offset: number;
    from: string;
    to: string;
    /** Present only when include_series=true and the series query succeeded. */
    time_series?: {
        granularity: '1m' | '1h' | '1d';
        points: ErrorTimeSeriesPoint[];
    };
}

export interface InventoryErrorsParams {
    listener_name?: string;
    from?: string;
    to?: string;
    min_error_rate?: number;
    limit?: number;
    offset?: number;
    include_series?: boolean;
    series_granularity?: '1m' | '1h' | '1d';
}

// ---------- /inventory/normalize-gaps — path-normalization gaps ----------

/** One suspicious un-normalized path prefix the collector has flagged. */
export interface NormalizeGap {
    /** The "ballooning" path prefix, e.g. /api/v1/tickets/by-ticket-number. */
    prefix: string;
    updated_at: string;
}

export interface NormalizeGapsResponse {
    data: NormalizeGap[];
    count: number;
}

// ---------- /inventory/changes — API drift / change detection ----------

export type DriftChangeType =
    | 'new_operation'
    | 'new_method'
    | 'removed_operation'
    | 'auth_downgrade'
    | 'new_pii_category'
    | 'new_risk_flag'
    | 'risk_increase'
    | 'status_regress'
    | 'zombie_resurrection';

export type DriftMode =
    | 'all'
    | 'new'
    | 'removed'
    | 'auth'
    | 'pii'
    | 'risk'
    | 'status'
    | 'zombie';

/** One drift signal. `detail` shape varies by `type` (see the guide). */
export interface DriftChange {
    type: DriftChangeType;
    listener_name: string;
    protocol: string;
    host: string;
    method: string;
    normalized_path: string;
    grpc_service?: string;
    grpc_method?: string;
    last_seen: string;
    detail?: Record<string, any>;
}

export interface DriftChangesResponse {
    data: DriftChange[];
    count: number;
    total_count: number;
    since: string;
    baseline_snapshot_id: string;
    baseline_snapshot_at: string;
    mode: string;
    limit: number;
    offset: number;
}

export interface DriftChangesParams {
    since?: string;
    mode?: DriftMode;
    limit?: number;
    offset?: number;
}

export interface InventorySnapshot {
    snapshot_id: string;
    snapshot_at: string;
    operation_count: number;
}

export interface SnapshotsResponse {
    data: InventorySnapshot[];
    count: number;
}

// ---------- /inventory/consumers — consumer (identity) analytics ----------

export interface ConsumerRow {
    consumer_hash: string;
    events: number;
    max_risk_score: number;
    distinct_ips: number;
    distinct_endpoints: number;
    ti_hits: number;
    first_seen: string;
    last_seen: string;
    percentage: number;          // share of NAMED (non-anonymous) events
}

export interface ConsumersResponse {
    total_events: number;
    anonymous_events: number;
    top_consumers: ConsumerRow[];
}

export interface ConsumerEndpoint {
    listener_name: string;
    normalized_path: string;
    method: string;
    count: number;
    max_risk_score: number;
}

export interface ConsumerSourceIP {
    /** Raw IP — only populated when collector Policy.StoreRawSourceIP is on;
     *  "" otherwise (fall back to `hash`). */
    ip: string;
    hash: string;        // source_ip_hash — always present
    count: number;
}

export interface ConsumerDetail {
    consumer_hash: string;
    total_events: number;
    distinct_endpoints: number;
    distinct_ips: number;
    max_risk_score: number;
    critical_events: number;     // risk_score >= 10
    ti_hits: number;
    first_seen: string;
    last_seen: string;
    geo_country?: string;
    geo_asn?: string;
    geo_asn_org?: string;
    method_dist: Record<string, number>;
    status_dist: Record<string, number>;
    top_endpoints: ConsumerEndpoint[];
    top_source_ips?: ConsumerSourceIP[];
}

export interface ConsumersParams {
    from?: string;
    to?: string;
    top?: number;
}
