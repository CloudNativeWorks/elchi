/**
 * Smart policy suggestions: turn API-Discovery findings into a draft shield
 * SecurityPolicy. Calls the backend POST /api/v3/inventory/suggest-policy (which
 * maps each endpoint's risk_flags/auth_schemes/pii/categories into the matching
 * engines) and opens the result in the policy Builder for review — the draft is
 * never auto-saved.
 */

import { api } from '@/common/api';
import { ensureModelUids, type PolicyFileModel } from '../state/model';

/** Why a given engine was suggested for a route (surfaced in the Builder). */
export interface SuggestEngineWhy {
    key: string;
    why: string;
}

/** Per-route explanation of the suggestion. */
export interface SuggestRationale {
    host: string;
    path: string;
    methods: string[];
    mode: string;
    matched_flags: string[];
    engines: SuggestEngineWhy[];
    notes?: string[];
}

export interface PolicySuggestion {
    policy_name: string;
    yaml: string;
    rationale: SuggestRationale[];
}

/** The shape carried to ShieldDetail (create mode) via router state. */
export interface DiscoveryDraft extends PolicySuggestion {}

/** Call the suggestion endpoint for one or more inventory endpoint ids. */
export async function suggestPolicyFromEndpoints(
    endpointIds: string[],
    project: string,
): Promise<PolicySuggestion> {
    const res = await api.post(
        `/api/v3/inventory/suggest-policy?project=${project}`,
        { endpoint_ids: endpointIds },
    );
    return res?.data?.data as PolicySuggestion;
}

/**
 * mergeDiscoveryIntoModel grafts a suggested policy's domains/routes into an
 * already-open policy (used by the Builder's "Import from Discovery" drawer). A
 * suggested domain whose host already exists has its routes appended; otherwise
 * the whole domain is added. _uids are re-issued so the Builder tree stays stable.
 */
export function mergeDiscoveryIntoModel(current: PolicyFileModel, suggested: PolicyFileModel): PolicyFileModel {
    const next: PolicyFileModel = JSON.parse(JSON.stringify(current));
    if (!next.spec) next.spec = {} as PolicyFileModel['spec'];
    if (!next.spec.domains) next.spec.domains = [];
    for (const sd of suggested.spec?.domains ?? []) {
        const existing = next.spec.domains.find(d =>
            (d.hosts ?? []).some(h => (sd.hosts ?? []).includes(h)));
        if (existing) {
            existing.routes = [...(existing.routes ?? []), ...(sd.routes ?? [])];
        } else {
            next.spec.domains.push(sd);
        }
    }
    return ensureModelUids(next);
}
