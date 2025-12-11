/**
 * WAF Config Types
 */

export interface WafDirectivesMap {
    [key: string]: string[];
}

export interface MetricLabels {
    [key: string]: string;
}

export interface PerAuthorityDirectives {
    [domain: string]: string;
}

export interface WafConfigData {
    directives_map: WafDirectivesMap;
    default_directives: string;
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

export interface WafConfigResponse {
    message: string;
    data: WafConfig;
}

export interface WafConfigListResponse {
    message: string;
    data: WafConfig[];
}

export interface WafFilter {
    project: string;
}

// CRS Types
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
