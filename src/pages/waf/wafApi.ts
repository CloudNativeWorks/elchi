/**
 * WAF API Client - Using project's existing API structure
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
    CrsFilter
} from './types';

const WAF_BASE_PATH = '/api/v3/waf/config';
const CRS_BASE_PATH = '/api/v3/waf/crs';

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
     * Create new WAF config
     */
    async createWafConfig(config: CreateWafConfigRequest): Promise<WafConfig> {
        const params = new URLSearchParams();
        params.append('project', config.project);

        const url = `${WAF_BASE_PATH}?${params.toString()}`;
        const response = await api.post<WafConfig>(url, config);

        handleApiResponse(response.data, undefined, undefined, {
            showAutoSuccess: true,
            customSuccessMessage: `WAF config "${config.name}" created successfully`,
            successTitle: 'WAF Config Created'
        });

        return response.data;
    }

    /**
     * Update existing WAF config
     */
    async updateWafConfig(
        id: string,
        config: UpdateWafConfigRequest,
        project: string
    ): Promise<WafConfig> {
        const params = new URLSearchParams();
        params.append('project', project);

        const url = `${WAF_BASE_PATH}/${id}?${params.toString()}`;
        const response = await api.put<WafConfig>(url, config);

        handleApiResponse(response.data, undefined, undefined, {
            showAutoSuccess: true,
            customSuccessMessage: 'WAF config updated successfully',
            successTitle: 'WAF Config Updated'
        });

        return response.data;
    }

    /**
     * Delete WAF config
     */
    async deleteWafConfig(id: string, project: string): Promise<void> {
        const params = new URLSearchParams();
        params.append('project', project);

        const url = `${WAF_BASE_PATH}/${id}?${params.toString()}`;
        const response = await api.delete(url);

        handleApiResponse(response.data, undefined, undefined, {
            showAutoSuccess: true,
            customSuccessMessage: 'WAF config deleted successfully',
            successTitle: 'WAF Config Deleted'
        });
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
