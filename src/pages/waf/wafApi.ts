/**
 * WAF API Client — backed by the modern (sets[]) wire shape.
 */

import { api } from '@/common/api';
import { handleApiResponse } from '@/common/notificationHandler';
import {
    WafConfig,
    WafFilter,
    CreateWafConfigRequest,
    UpdateWafConfigRequest,
    CrsRule,
    CrsRulesResponse,
    CrsFilter,
    WafConfigVersion,
    WafVersionsResponse,
    WafApiError,
    WafUsageRef,
} from './types';

const WAF_BASE_PATH = '/api/v3/waf/config';
const CRS_BASE_PATH = '/api/v3/waf/crs';

/**
 * Per-request axios config that suppresses the global error toast in
 * `api.tsx`'s response interceptor. WAF mutations render their own
 * structured 409 UIs; without this flag the user would see two
 * notifications (generic toast + our modal/toast).
 */
const SKIP_GLOBAL_ERROR = { _skipGlobalErrorNotification: true } as const;

/**
 * Discriminated error thrown by mutations so UI can branch on backend
 * status codes (409 WAF_NAME_TAKEN / WAF_IN_USE) without parsing strings.
 */
export class WafConfigError extends Error {
    code?: string;
    status?: number;
    references?: WafUsageRef[];

    constructor(message: string, code?: string, status?: number, references?: WafUsageRef[]) {
        super(message);
        this.name = 'WafConfigError';
        this.code = code;
        this.status = status;
        this.references = references;
    }

    /**
     * Build a WafConfigError from any thrown HTTP error. Preserves the
     * original message/status if the response shape is unexpected.
     */
    static from(err: unknown): WafConfigError {
        const ax = err as { response?: { status?: number; data?: WafApiError }; message?: string };
        const status = ax?.response?.status;
        const body = ax?.response?.data;
        const message = body?.error || body?.message || ax?.message || 'WAF API error';
        return new WafConfigError(message, body?.code, status, body?.references);
    }
}

class WafApiClient {
    /**
     * Get WAF configs with filters
     */
    async getWafConfigs(filter: WafFilter): Promise<WafConfig[]> {
        const params = new URLSearchParams();

        if (filter) {
            Object.entries(filter).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    params.append(key, String(value));
                }
            });
        }

        const queryString = params.toString();
        const path = `${WAF_BASE_PATH}${queryString ? `?${queryString}` : ''}`;

        const response = await api.get<{ configs: WafConfig[]; total: number }>(path);
        return response.data?.configs || [];
    }

    /**
     * Get single WAF config by ID
     */
    async getWafConfig(id: string, project: string): Promise<WafConfig> {
        const params = new URLSearchParams();
        params.append('project', project);

        const url = `${WAF_BASE_PATH}/${id}?${params.toString()}`;
        const response = await api.get<WafConfig>(url);
        return response.data;
    }

    /**
     * Create new WAF config. Surfaces structured WafConfigError on 409.
     */
    async createWafConfig(config: CreateWafConfigRequest): Promise<WafConfig> {
        const params = new URLSearchParams();
        params.append('project', config.project);

        const url = `${WAF_BASE_PATH}?${params.toString()}`;
        try {
            const response = await api.post<WafConfig>(url, config, SKIP_GLOBAL_ERROR);
            handleApiResponse(response.data, undefined, undefined, {
                showAutoSuccess: true,
                customSuccessMessage: `WAF config "${config.name}" created successfully`,
                successTitle: 'WAF Config Created'
            });
            return response.data;
        } catch (err) {
            throw WafConfigError.from(err);
        }
    }

    /**
     * Update existing WAF config. Note: post-redesign the response is
     * { config, old_config?, job?, message } — we return the inner config.
     */
    async updateWafConfig(
        id: string,
        config: UpdateWafConfigRequest,
        project: string
    ): Promise<WafConfig> {
        const params = new URLSearchParams();
        params.append('project', project);

        const url = `${WAF_BASE_PATH}/${id}?${params.toString()}`;
        try {
            const response = await api.put<{
                config: WafConfig;
                old_config?: WafConfig;
                job?: { affected_wasm?: number; status?: string };
                message?: string;
            }>(url, config, SKIP_GLOBAL_ERROR);
            const updated = response.data?.config ?? (response.data as unknown as WafConfig);
            const affected = response.data?.job?.affected_wasm ?? 0;
            const successMessage = affected > 0
                ? `WAF config saved · propagating to ${affected} WASM extension${affected === 1 ? '' : 's'}`
                : 'WAF config saved · no WASM extensions reference this WAF';
            handleApiResponse(response.data, undefined, undefined, {
                showAutoSuccess: true,
                customSuccessMessage: successMessage,
                successTitle: 'WAF Config Updated'
            });
            return updated;
        } catch (err) {
            throw WafConfigError.from(err);
        }
    }

    /**
     * Delete WAF config. Surfaces WAF_IN_USE references on 409.
     */
    async deleteWafConfig(id: string, project: string): Promise<void> {
        const params = new URLSearchParams();
        params.append('project', project);

        const url = `${WAF_BASE_PATH}/${id}?${params.toString()}`;
        try {
            const response = await api.delete(url, SKIP_GLOBAL_ERROR);
            handleApiResponse(response.data, undefined, undefined, {
                showAutoSuccess: true,
                customSuccessMessage: 'WAF config deleted successfully',
                successTitle: 'WAF Config Deleted'
            });
        } catch (err) {
            throw WafConfigError.from(err);
        }
    }

    // ─── Versioning (BE plan §4.1, see /controller/waf/version.go) ──────────

    /** GET /api/v3/waf/config/:id/versions[?limit=N] */
    async listWafVersions(id: string, limit = 20): Promise<WafConfigVersion[]> {
        const url = `${WAF_BASE_PATH}/${id}/versions?limit=${limit}`;
        const response = await api.get<WafVersionsResponse>(url);
        return response.data?.versions ?? [];
    }

    /** GET /api/v3/waf/config/:id/versions/:version */
    async getWafVersion(id: string, version: number): Promise<WafConfigVersion> {
        const url = `${WAF_BASE_PATH}/${id}/versions/${version}`;
        const response = await api.get<WafConfigVersion>(url);
        return response.data;
    }

    /** POST /api/v3/waf/config/:id/versions/:version/restore */
    async restoreWafVersion(id: string, version: number): Promise<WafConfig> {
        const url = `${WAF_BASE_PATH}/${id}/versions/${version}/restore`;
        try {
            const response = await api.post<{ config: WafConfig; restored_version: number; message?: string }>(url, undefined, SKIP_GLOBAL_ERROR);
            const restored = response.data?.config ?? (response.data as unknown as WafConfig);
            handleApiResponse(response.data, undefined, undefined, {
                showAutoSuccess: true,
                customSuccessMessage: `Restored from version ${version}`,
                successTitle: 'WAF Config Restored'
            });
            return restored;
        } catch (err) {
            throw WafConfigError.from(err);
        }
    }

    /**
     * Get CRS rules with filters
     */
    async getCrsRules(filter?: CrsFilter): Promise<CrsRulesResponse> {
        const params = new URLSearchParams();

        if (filter) {
            Object.entries(filter).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    params.append(key, String(value));
                }
            });
        }

        const queryString = params.toString();
        const path = `${CRS_BASE_PATH}${queryString ? `?${queryString}` : ''}`;

        const response = await api.get<CrsRulesResponse>(path);
        return response.data;
    }

    /**
     * Get single CRS rule by ID
     */
    async getCrsRule(crsVersion: string, ruleId: number): Promise<CrsRule> {
        const url = `${CRS_BASE_PATH}/${crsVersion}/${ruleId}`;
        const response = await api.get<CrsRule>(url);
        return response.data;
    }

    /**
     * Get available CRS versions
     */
    async getCrsVersions(): Promise<{
        versions: Array<{
            coraza_version: string;
            crs_version: string;
            total_rules: number;
            generated_at: string;
        }>;
    }> {
        const url = `${CRS_BASE_PATH}/versions`;
        const response = await api.get<{
            versions: Array<{
                coraza_version: string;
                crs_version: string;
                total_rules: number;
                generated_at: string;
            }>;
        }>(url);
        return response.data;
    }
}

// Export singleton instance
export const wafApi = new WafApiClient();
