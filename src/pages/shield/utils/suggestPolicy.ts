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

// A discovery draft can be large (up to ~500 routes ≈ hundreds of KB). Passing it
// through React Router's location.state serializes into history.pushState, which
// is size-capped in some browsers (Firefox ~640KB) and would throw, losing the
// draft. Instead we stash it in sessionStorage and carry only a tiny key in the
// router state. sessionStorage is per-tab and cleared on close — right for a
// one-hop handoff.
const DRAFT_STASH_PREFIX = 'shield-discovery-draft:';

/** Stash a draft and return a key to pass via router state. */
export function stashDiscoveryDraft(draft: DiscoveryDraft): string {
    const key = DRAFT_STASH_PREFIX + String(Date.now()) + ':' + Math.random().toString(36).slice(2);
    try {
        sessionStorage.setItem(key, JSON.stringify(draft));
        return key;
    } catch {
        return ''; // quota/unavailable — caller falls back to passing the draft inline
    }
}

/** Retrieve and remove a stashed draft by key (one-shot). */
export function popDiscoveryDraft(key: string | undefined | null): DiscoveryDraft | null {
    if (!key || !key.startsWith(DRAFT_STASH_PREFIX)) return null;
    try {
        const raw = sessionStorage.getItem(key);
        sessionStorage.removeItem(key);
        return raw ? (JSON.parse(raw) as DiscoveryDraft) : null;
    } catch {
        return null;
    }
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
    // Identity of a route's selector, so importing the same endpoint twice (or an
    // overlap with an existing route) doesn't append a duplicate.
    const routeKey = (r: any) =>
        `${r?.match?.path_exact ?? ''}|${r?.match?.path_prefix ?? ''}|${r?.match?.path_regex ?? ''}|${[...(r?.match?.methods ?? [])].sort().join(',')}`;
    // Shield matches hosts case-insensitively, so compare that way when deciding
    // whether a suggested domain merges into an existing one — otherwise
    // "API.example.com" and "api.example.com" would become two domains shield
    // treats as identical.
    for (const sd of suggested.spec?.domains ?? []) {
        const sdLower = (sd.hosts ?? []).map(h => h.toLowerCase());
        const existing = next.spec.domains.find(d =>
            (d.hosts ?? []).some(h => sdLower.includes(h.toLowerCase())));
        if (existing) {
            const seen = new Set((existing.routes ?? []).map(routeKey));
            const fresh = (sd.routes ?? []).filter(r => !seen.has(routeKey(r)));
            existing.routes = [...(existing.routes ?? []), ...fresh];
        } else {
            next.spec.domains.push(sd);
        }
    }
    return ensureModelUids(next);
}
