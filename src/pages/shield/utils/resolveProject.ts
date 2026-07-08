/**
 * Project-wide (cross-policy) resolution + host-conflict detection.
 *
 * elchi-shield MERGES every policy file in its watched dir before it resolves a
 * request, so behavior is a property of the whole project, not one policy:
 *   • every file's `spec.defaults` is overlaid into ONE global default (merged in
 *     config-filename order, later file wins field-by-field) — a domain inherits the
 *     PROJECT-wide defaults, not only its own file's;
 *   • all domains are pooled and the most-specific matching host wins across ALL
 *     policies (exact ≫ "*.suffix" by length > "*");
 *   • all `spec.exclude` paths are unioned;
 *   • a host defined in two files/domains makes shield REJECT the whole config and
 *     keep the last valid one.
 *
 * We reproduce that here so the UI can (a) warn about host collisions before deploy
 * and (b) tell an operator exactly which policy/domain/route a request will hit. The
 * merge sort key is the config file each policy deploys as (`<slug>.yaml`).
 *
 * This layers on top of {@link simulateRequest} (the single-policy dry-run) — it does
 * not re-implement host/route matching or policy folding.
 */

import yaml from 'js-yaml';
import { PolicyFileModel, PolicySpec } from '../state/model';
import { ShieldPolicy } from '../types';
import { base64ToText } from '../utils';
import { SimInput, SimResult, simulateRequest } from './simulate';

export interface PolicyEntry {
    id: string;
    name: string;
    /** The config file this policy deploys as (`<slug>.yaml`); the merge sort key. */
    configPath: string;
    model: PolicyFileModel;
}

export interface DomainSource {
    policyId: string;
    policyName: string;
    /** Domain index within its own policy (not the merged index). */
    localIndex: number;
}

export interface MergedProject {
    /** A synthetic single-file model equivalent to shield's merged config. */
    model: PolicyFileModel;
    /** Parallel to model.spec.domains: which policy each merged domain came from. */
    domainSource: DomainSource[];
}

/**
 * Normalize a config host ENTRY for equality — MUST match shield's dedup key exactly
 * (internal/config/validate.go: strings.ToLower(strings.TrimSpace(h))). No trailing-dot
 * strip: shield treats "example.com." and "example.com" as distinct entries.
 */
const hostKey = (h: string): string => h.trim().toLowerCase();

/** A bundle file is a shield CONFIG iff it is a top-level .yaml/.yml/.json. */
const isConfigFile = (path: string): boolean => !path.includes('/') && /\.(ya?ml|json)$/i.test(path);

export interface PolicyParseResult {
    entry?: PolicyEntry;
    /** Set when the policy's config could not be analyzed (e.g. invalid YAML). */
    error?: string;
}

/**
 * Build a resolution-ready {@link PolicyEntry} straight from a policy's raw config
 * YAML — NOT from the builder model, which drops a policy's domains whenever it can't
 * fully round-trip it (raw-YAML mode, unsupported fields, multi-config bundles). Those
 * policies still resolve on the edge, so they MUST be included in cross-policy analysis;
 * parsing the YAML directly for just {defaults, domains, exclude} keeps the tools honest.
 * Returns an error only when the YAML is genuinely unreadable.
 */
export const parsePolicyForResolution = (policy: ShieldPolicy): PolicyParseResult => {
    const configs = (policy.files ?? []).filter(f => isConfigFile(f.path));
    if (configs.length === 0) {
        // Data-only bundle (no policy YAML yet): no domains to resolve — not an error.
        return { entry: { id: policy.id, name: policy.name, configPath: `${policy.name}.yaml`, model: emptyModel(policy.name) } };
    }
    if (configs.length > 1) {
        return { error: `${policy.name}: bundle has ${configs.length} config files — not analyzable here` };
    }
    const cfg = configs[0];
    if (!cfg.content) {
        return { error: `${policy.name}: config is a download reference (content not loaded)` };
    }
    let raw: unknown;
    try {
        raw = yaml.load(base64ToText(cfg.content));
    } catch {
        return { error: `${policy.name}: config is not valid YAML` };
    }
    const spec = (raw as { spec?: PolicyFileModel['spec'] } | null)?.spec ?? {};
    const meta = raw as { apiVersion?: string; kind?: string } | null;
    const model: PolicyFileModel = {
        apiVersion: meta?.apiVersion ?? '',
        kind: meta?.kind ?? '',
        metadata: { name: policy.name },
        spec: { defaults: spec.defaults, domains: spec.domains, exclude: spec.exclude },
    };
    return { entry: { id: policy.id, name: policy.name, configPath: cfg.path, model } };
};

const emptyModel = (name: string): PolicyFileModel => ({
    apiVersion: '', kind: '', metadata: { name }, spec: { domains: [] },
});

/** Last-defined value across the (filename-ordered) chain — mirrors overlaySpec. */
const overlayLast = <T>(vals: (T | undefined)[]): T | undefined => {
    let v: T | undefined;
    for (const x of vals) if (x !== undefined) v = x;
    return v;
};

/**
 * Merge all policies into one synthetic model, mirroring shield's file merge:
 * overlay defaults (filename order), pool domains, union excludes. Only the fields
 * the resolver actually reads are overlaid on defaults; engines / checks.body replace
 * wholesale (last file wins), exactly like the edge.
 */
export const mergeProject = (entries: PolicyEntry[]): MergedProject => {
    const sorted = [...entries].sort((a, b) => a.configPath.localeCompare(b.configPath));
    const defs = sorted.map(e => e.model.spec.defaults ?? {});
    const mergedDefaults: PolicySpec = {
        mode: overlayLast(defs.map(d => d.mode)),
        fail_mode: overlayLast(defs.map(d => d.fail_mode)),
        inspect_request_body: overlayLast(defs.map(d => d.inspect_request_body)),
        inspect_response_body: overlayLast(defs.map(d => d.inspect_response_body)),
        engines: overlayLast(defs.map(d => d.engines)),
        checks: { body: overlayLast(defs.map(d => d.checks?.body)) },
    };

    const domains: NonNullable<PolicyFileModel['spec']['domains']> = [];
    const domainSource: DomainSource[] = [];
    const excludeSeen = new Set<string>();
    const exclude: string[] = [];
    for (const e of sorted) {
        for (const x of e.model.spec.exclude ?? []) {
            if (!excludeSeen.has(x)) { excludeSeen.add(x); exclude.push(x); }
        }
        (e.model.spec.domains ?? []).forEach((d, li) => {
            domains.push(d);
            domainSource.push({ policyId: e.id, policyName: e.name, localIndex: li });
        });
    }

    const model: PolicyFileModel = {
        apiVersion: sorted[0]?.model.apiVersion ?? '',
        kind: sorted[0]?.model.kind ?? '',
        metadata: { name: '__merged__' },
        spec: { defaults: mergedDefaults, domains, exclude },
    };
    return { model, domainSource };
};

export interface ProjectResolveResult extends SimResult {
    /** Which policy the winning domain belongs to (absent when no domain matched). */
    policy?: { id: string; name: string };
}

/**
 * Resolve a request across ALL project policies — the answer to "which policy /
 * domain / route does this host hit, and what does it do?".
 */
export const resolveProject = (merged: MergedProject, input: SimInput): ProjectResolveResult => {
    const sim = simulateRequest(merged.model, input);
    if (sim.domain) {
        const src = merged.domainSource[sim.domain.index];
        if (src) {
            return {
                ...sim,
                policy: { id: src.policyId, name: src.policyName },
                // Report the domain index within its OWN policy, not the merged index.
                domain: { ...sim.domain, index: src.localIndex },
            };
        }
    }
    return sim;
};

export interface HostConflict {
    /** The normalized host (may be "*"). */
    host: string;
    where: { policyId: string; policyName: string; entry: string; domainIndex: number }[];
}

/**
 * Hosts (including "*") defined in more than one policy/domain across the project.
 * shield rejects the WHOLE config on any of these, so they must be surfaced before a
 * deploy that would blackhole the last-good config.
 */
export const findHostConflicts = (entries: PolicyEntry[]): HostConflict[] => {
    const byHost = new Map<string, HostConflict['where']>();
    for (const e of entries) {
        (e.model.spec.domains ?? []).forEach((d, domainIndex) => {
            for (const h of d.hosts ?? []) {
                const key = hostKey(h);
                if (!key) continue;
                const arr = byHost.get(key) ?? [];
                arr.push({ policyId: e.id, policyName: e.name, entry: h, domainIndex });
                byHost.set(key, arr);
            }
        });
    }
    const conflicts: HostConflict[] = [];
    byHost.forEach((where, host) => {
        // A conflict needs two DIFFERENT locations (same file listing a host twice is a
        // separate, in-policy problem caught by the builder validator).
        if (where.length > 1) conflicts.push({ host, where });
    });
    return conflicts.sort((a, b) => a.host.localeCompare(b.host));
};
