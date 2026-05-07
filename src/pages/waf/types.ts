/**
 * WAF Config Types
 *
 * Backend (post-redesign, see backend `data_marshalling.go`) emits the modern
 * shape over JSON: `{ sets: [{name, description?, directives[]}], default_set }`.
 * It also accepts the legacy shape (`directives_map`, `default_directives`)
 * as a fallback for older clients — but since this FE was written against
 * the modern shape, we don't emit legacy.
 *
 * The editor state in `WafEditorState` mirrors this with stable client IDs
 * for drag-drop. `wafAdapter.ts` mediates between the two.
 */

// ─── Wire-format types (matches backend modernShape) ────────────────────────

export interface WafApiDirectiveSet {
    name: string;
    description?: string;
    directives: string[];
}

export interface MetricLabels {
    [key: string]: string;
}

export interface PerAuthorityDirectives {
    [domain: string]: string;
}

/**
 * The data envelope sent to / received from the backend.
 *
 * BE accepts either modern (this) or legacy on PUT/POST; we always emit modern.
 * BE always emits modern on GET regardless of how the row was originally written.
 */
export interface WafConfigData {
    sets: WafApiDirectiveSet[];
    default_set: string;
    metric_labels?: MetricLabels;
    per_authority_directives?: PerAuthorityDirectives;
}

export interface WafConfig {
    id: string;
    name: string;
    project: string;
    created_at: string;
    updated_at: string;
    data: WafConfigData;
}

export interface CreateWafConfigRequest {
    name: string;
    project: string;
    data: WafConfigData;
}

export interface UpdateWafConfigRequest {
    name: string;
    project: string;
    data: WafConfigData;
}

export interface WafFilter {
    project: string;
}

// ─── Versioning (backend §4.1, see version.go) ──────────────────────────────

export interface WafConfigVersion {
    id?: string;
    config_id: string;
    version: number;
    name: string;
    data: WafConfigData;
    author_id: string;
    author_name: string;
    message?: string;
    created_at: string;
}

export interface WafVersionsResponse {
    versions: WafConfigVersion[];
    total: number;
}

// ─── 409 error payloads ─────────────────────────────────────────────────────

export interface WafUsageRef {
    type: string; // currently always "wasm_extension"
    id: string;
    name: string;
}

export interface WafApiError {
    code?: 'WAF_NAME_TAKEN' | 'WAF_IN_USE' | string;
    error?: string;
    message?: string;
    references?: WafUsageRef[];
}

// ─── Normalized editor shape ────────────────────────────────────────────────

export interface DirectiveSet {
    id: string;            // client-side stable id (uuid-ish), used by drag-drop
    name: string;
    description?: string;  // forward-compatible; backend ignores until §3.2 ships
    directives: Directive[];
}

export interface Directive {
    id: string;            // client-side stable id, used by drag-drop
    text: string;          // raw directive line(s)
}

export interface WafEditorState {
    name: string;
    sets: DirectiveSet[];
    defaultSetId: string | null;
    metricLabels: MetricLabels;
    perAuthorityDirectives: PerAuthorityDirectives; // domain -> set name
}

// ─── CRS Types ──────────────────────────────────────────────────────────────

export interface CrsRuleCharacteristics {
    id: number;
    phase: number;
    paranoia_level: number;
    severity: string;
    file: string;
    tags: string[];
    targets: string[][];
    operator: string[];
    transformations: string[];
    capec: string[];
    chained?: string;
}

export interface CrsRuleDescription {
    short: string;
    extended: string;
    rule_logic: string;
    targets_info: string;
    rule: string;
    exploit?: string;
    rulelink?: string;
}

export interface CrsRule {
    title: string;
    description: CrsRuleDescription;
    crs_version: string;
    references?: string[];
    rule_type: string;
    characteristics: CrsRuleCharacteristics;
}

export interface CrsRulesResponse {
    rules: CrsRule[];
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
}

export interface CrsFilter {
    crs_version?: string;
    severity?: string;
    phase?: number;
    paranoia_level?: number;
    tags?: string;  // Comma-separated tags
    search?: string;
    rule_type?: string;
    page?: number;
    page_size?: number;
}

// ─── Lint diagnostics (client-side; BE endpoint deferred — see backend review C1) ──

export type LintSeverity = 'ok' | 'info' | 'warning' | 'error';

export interface LintDiagnostic {
    line: number;        // index into the directive list
    severity: LintSeverity;
    code: string;
    message: string;
    range?: { start: number; end: number };
}

export interface LintResult {
    diagnostics: LintDiagnostic[];
    summary: { ok: number; warnings: number; errors: number };
}
