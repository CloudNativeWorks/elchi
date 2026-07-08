/**
 * Shield API Client — elchi-shield policy store + async deploy + edge read-back.
 * Mirrors the WAF client pattern (singleton class over the shared axios `api`).
 */

import { api } from '@/common/api';
import { CrsFilter, CrsRulesResponse } from '@/pages/waf/types';
import {
    ShieldPolicy,
    ShieldPolicyRequest,
    ShieldMutationResponse,
    DeployInfo,
    ShieldClientResult,
    ShieldEventsParams,
    ShieldEventsPage,
    ShieldEventsSummary,
    ShieldEventsFacets,
} from './types';

/** One coreruleset version present across a project's shield fleet. */
export interface ShieldCrsFleetVersion {
    version: string;
    nodes: number;
    connected: number;
}

/** Which CRS versions a project's shield fleet compiled in — the ground truth the UI
 *  auto-pins its CRS library to (shield's CRS is embedded per binary). */
export interface ShieldCrsFleet {
    project: string;
    versions: ShieldCrsFleetVersion[];
    primary: string;
    mixed: boolean;
    unreported: number;
}

/** Versions the backend has a shield CRS library for (same shape as the WASM list). */
export interface ShieldCrsVersionsResponse {
    versions: Array<{ coraza_version: string; crs_version: string; total_rules: number; generated_at: string }>;
}

const SHIELD_BASE_PATH = '/api/v3/shield';

/**
 * Suppress the global error toast: shield mutations surface the backend's
 * precise 400/409 messages (e.g. "file path X already used by policy Y")
 * inline, so the generic toast would duplicate them.
 */
const SKIP_GLOBAL_ERROR = { _skipGlobalErrorNotification: true } as const;

/** Discriminated error so the UI can branch on backend status codes. */
export class ShieldApiError extends Error {
    status?: number;

    constructor(message: string, status?: number) {
        super(message);
        this.name = 'ShieldApiError';
        this.status = status;
    }

    static from(err: unknown): ShieldApiError {
        const ax = err as { response?: { status?: number; data?: { message?: string } }; message?: string };
        const message = ax?.response?.data?.message || ax?.message || 'Shield API error';
        return new ShieldApiError(message, ax?.response?.status);
    }
}

class ShieldApiClient {
    /** List the project's policies. File contents are omitted by the backend. */
    async listPolicies(project: string): Promise<ShieldPolicy[]> {
        const response = await api.get<{ data: ShieldPolicy[] }>(
            `${SHIELD_BASE_PATH}/policies?project=${encodeURIComponent(project)}`
        );
        return response.data?.data || [];
    }

    /** Get one policy with full file contents (base64). */
    async getPolicy(id: string, project: string): Promise<ShieldPolicy> {
        const response = await api.get<{ data: ShieldPolicy }>(
            `${SHIELD_BASE_PATH}/policies/${id}?project=${encodeURIComponent(project)}`
        );
        return response.data?.data;
    }

    /** Create a policy. The response carries the async deploy outcome. */
    async createPolicy(body: ShieldPolicyRequest): Promise<ShieldMutationResponse> {
        try {
            const response = await api.post<ShieldMutationResponse>(
                `${SHIELD_BASE_PATH}/policies`, body, SKIP_GLOBAL_ERROR
            );
            return response.data;
        } catch (err) {
            throw ShieldApiError.from(err);
        }
    }

    /** Update a policy. The response carries the async deploy outcome. */
    async updatePolicy(id: string, body: ShieldPolicyRequest): Promise<ShieldMutationResponse> {
        try {
            const response = await api.put<ShieldMutationResponse>(
                `${SHIELD_BASE_PATH}/policies/${id}`, body, SKIP_GLOBAL_ERROR
            );
            return response.data;
        } catch (err) {
            throw ShieldApiError.from(err);
        }
    }

    /** Delete a policy; the remaining merged set re-deploys (async). */
    async deletePolicy(id: string, project: string): Promise<ShieldMutationResponse> {
        try {
            const response = await api.delete<ShieldMutationResponse>(
                `${SHIELD_BASE_PATH}/policies/${id}?project=${encodeURIComponent(project)}`,
                SKIP_GLOBAL_ERROR
            );
            return response.data;
        } catch (err) {
            throw ShieldApiError.from(err);
        }
    }

    /** Re-push the project's merged policy set to its connected edges (async). */
    async syncProject(project: string): Promise<DeployInfo | undefined> {
        try {
            const response = await api.post<{ data: DeployInfo }>(
                `${SHIELD_BASE_PATH}/sync`, { project }, SKIP_GLOBAL_ERROR
            );
            return response.data?.data;
        } catch (err) {
            throw ShieldApiError.from(err);
        }
    }

    /** Live edge shield service status + recent logs (admin-only, command dispatch). */
    async getClientStatus(clientId: string, project: string): Promise<ShieldClientResult | undefined> {
        const response = await api.get<{ data: ShieldClientResult[] }>(
            `${SHIELD_BASE_PATH}/status?client_id=${encodeURIComponent(clientId)}&project=${encodeURIComponent(project)}`
        );
        return response.data?.data?.[0];
    }

    /** Live edge on-disk shield file set (admin-only, command dispatch). */
    async getClientFiles(clientId: string, project: string): Promise<ShieldClientResult | undefined> {
        const response = await api.get<{ data: ShieldClientResult[] }>(
            `${SHIELD_BASE_PATH}/files?client_id=${encodeURIComponent(clientId)}&project=${encodeURIComponent(project)}`
        );
        return response.data?.data?.[0];
    }

    /**
     * Security events feed (what shield is blocking/detecting) from the central
     * ClickHouse, project-scoped + filterable. Admin/Owner-gated on the backend.
     */
    async getSecurityEvents(project: string, params: ShieldEventsParams = {}): Promise<ShieldEventsPage> {
        // The page renders its own inline error Alert, so suppress the global
        // toast (avoids the double-notification the WAF/mutation reads also dodge).
        const response = await api.get<ShieldEventsPage>(
            `${SHIELD_BASE_PATH}/events?${buildEventsQuery(project, params)}`, SKIP_GLOBAL_ERROR
        );
        return response.data;
    }

    /** Aggregate counts + per-action time series for the events dashboard. */
    async getSecurityEventsSummary(project: string, params: ShieldEventsParams = {}): Promise<ShieldEventsSummary> {
        const response = await api.get<{ data: ShieldEventsSummary }>(
            `${SHIELD_BASE_PATH}/events/summary?${buildEventsQuery(project, params)}`, SKIP_GLOBAL_ERROR
        );
        return response.data?.data ?? { total: 0, groups: [], series: [] };
    }

    /** Distinct filter values in the window (for filter dropdowns). */
    async getSecurityEventsFacets(project: string, params: ShieldEventsParams = {}): Promise<ShieldEventsFacets> {
        const response = await api.get<{ data: ShieldEventsFacets }>(
            `${SHIELD_BASE_PATH}/events/facets?${buildEventsQuery(project, params)}`, SKIP_GLOBAL_ERROR
        );
        return response.data?.data ?? { engines: [], actions: [], severities: [], hosts: [], nodes: [] };
    }

    // ─── CRS library (shield-embedded coreruleset; separate from the WASM path) ──

    /** The CRS versions the project's shield fleet actually runs (embedded per binary),
     *  with node counts + a `primary`. Drives the auto-pinned CRS library + mixed warning. */
    async getShieldCrsFleet(project: string): Promise<ShieldCrsFleet> {
        // Best-effort context: the drawer degrades gracefully when it's unavailable, so
        // suppress the global toast (like the events reads).
        const response = await api.get<ShieldCrsFleet>(
            `${SHIELD_BASE_PATH}/crs/fleet?project=${encodeURIComponent(project)}`, SKIP_GLOBAL_ERROR
        );
        return response.data;
    }

    /** CRS versions the backend has a shield rule library for. */
    async getShieldCrsVersions(): Promise<ShieldCrsVersionsResponse> {
        const response = await api.get<ShieldCrsVersionsResponse>(`${SHIELD_BASE_PATH}/crs/versions`, SKIP_GLOBAL_ERROR);
        return response.data;
    }

    /** Just the rule ids present in a coreruleset version (cheap) — to flag
     *  exclude_rule_ids that don't exist in the version the fleet runs. A 404 (no library
     *  for that version yet) is an expected condition, so suppress the global toast. */
    async getShieldCrsRuleIds(crsVersion: string): Promise<{ crs_version: string; ids: number[] }> {
        const response = await api.get<{ crs_version: string; ids: number[] }>(
            `${SHIELD_BASE_PATH}/crs/ids?crs_version=${encodeURIComponent(crsVersion)}`, SKIP_GLOBAL_ERROR
        );
        return response.data;
    }

    /** Shield CRS rules for a coreruleset version — the exact ruleset a shield binary
     *  embeds, filtered server-side (same params/shape as the WASM CRS endpoint). */
    async getShieldCrsRules(filter?: CrsFilter): Promise<CrsRulesResponse> {
        const params = new URLSearchParams();
        if (filter) {
            Object.entries(filter).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    params.append(key, String(value));
                }
            });
        }
        const queryString = params.toString();
        const response = await api.get<CrsRulesResponse>(
            `${SHIELD_BASE_PATH}/crs${queryString ? `?${queryString}` : ''}`
        );
        return response.data;
    }
}

/** Serialise the project + optional event filters into a query string. */
function buildEventsQuery(project: string, params: ShieldEventsParams): string {
    const sp = new URLSearchParams();
    sp.set('project', project);
    for (const [k, v] of Object.entries(params)) {
        if (v === undefined || v === null || v === '') continue;
        sp.set(k, String(v));
    }
    return sp.toString();
}

export const shieldApi = new ShieldApiClient();
