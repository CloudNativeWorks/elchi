/**
 * Shield (elchi-shield edge API-security sidecar) policy types.
 * Wire shapes mirror elchi-backend /api/v3/shield/*.
 */

/** One file in a policy bundle as the API exchanges it. `content` is base64. */
export interface ShieldFile {
    path: string;
    /** Inline content, base64-encoded (encoding/json []byte). Omitted in list responses. */
    content?: string;
    download_url?: string;
    sha256?: string;
    mode?: string;
}

export interface ShieldPolicy {
    id: string;
    name: string;
    project: string;
    files: ShieldFile[];
    version: number;
    created_at: string;
    updated_at: string;
}

export interface ShieldPolicyRequest {
    name: string;
    project: string;
    files: ShieldFile[];
}

/**
 * Deploy outcome attached to every mutation response. The deploy itself is an
 * async SHIELD_DEPLOY background job; `deploy_job` is its human id ("EC-42").
 * `deduped` means an identical deploy was already queued (it reads the policy
 * store at execution time, so it will carry this change too).
 */
export interface DeployInfo {
    enqueued: boolean;
    deploy_job?: string;
    deduped?: boolean;
    message?: string;
    error?: string;
}

export interface ShieldMutationResponse {
    data?: ShieldPolicy;
    message?: string;
    deploy?: DeployInfo;
}

/** Per-client envelope returned by the status/files command dispatches. */
export interface ShieldClientResult {
    success: boolean;
    error?: string;
    client_id?: string;
    client_name?: string;
    shield?: {
        success: boolean;
        message?: string;
        error?: string;
        operation?: string;
        applied_version?: string;
        reload_ok?: boolean;
        service_status?: string;
        current_files?: Array<{ path: string; sha256: string; mode: string }>;
        logs?: Array<{ timestamp: string; level: string; component?: string; message: string }>;
    };
}

/**
 * One shield security decision row from the central ClickHouse audit table
 * (`elchi_shield_audit`), as the events read API returns it. Redacted by
 * construction on the shield side: no header/body values, query string stripped.
 */
export interface ShieldSecurityEvent {
    ts: string;
    instance: string;
    node_id: string;
    project_id: string;
    listener: string;
    request_id: string;
    phase: string;
    direction: string;
    action: string;   // block | detect | shadow | allow | continue
    severity: string; // none | info | low | medium | high | critical
    reason: string;
    rule_id: string;
    policy_id: string;
    engine: string;
    host: string;
    path: string;
    method: string;
    status_code: number;
    config_version: string;
}

/** Paginated events feed envelope (matches the backend buildPaginationResponse). */
export interface ShieldEventsPage {
    data: ShieldSecurityEvent[];
    count: number;
    total_count: number;
    total_pages: number;
    limit: number;
    offset: number;
    current_page: number;
    has_next: boolean;
    has_prev: boolean;
}

/** Optional filters for the events feed + summary. */
export interface ShieldEventsParams {
    node_id?: string;
    instance?: string;
    engine?: string;
    action?: string;
    severity?: string;
    host?: string;
    method?: string;
    path?: string;
    findings_only?: boolean;
    from?: string;
    to?: string;
    limit?: number;
    offset?: number;
    include_total?: boolean;
}

/** One (engine, action, severity) bucket count for the summary cards. */
export interface ShieldEventGroup {
    engine: string;
    action: string;
    severity: string;
    count: number;
}

/** One time-bucketed, per-action count for the summary chart. */
export interface ShieldEventTimeBucket {
    bucket: string;
    action: string;
    count: number;
}

/** Aggregate view backing the dashboard cards + chart. */
export interface ShieldEventsSummary {
    total: number;
    groups: ShieldEventGroup[];
    series: ShieldEventTimeBucket[];
}

/** UI-only form model: a discriminated source instead of the implicit XOR. */
export interface ShieldFileForm {
    path: string;
    source: 'inline' | 'download';
    /** Decoded text for the editor (inline + text). */
    contentText?: string;
    /** Raw base64 kept as-is when the content is binary (upload / undecodable). */
    contentBase64?: string;
    download_url?: string;
    sha256?: string;
    mode?: string;
}
