/**
 * CRS Library state hook.
 *
 * Owns: filters, query, client-side ID/description search, file grouping,
 * selection set (rule IDs), and a "recently added" memory.
 *
 * Caller composes these into the visible UI.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { wafApi } from '../../wafApi';
import { CrsFilter, CrsRule } from '../../types';
import { shieldApi } from '@/pages/shield/shieldApi';

// CrsLibraryOptions lets the SAME library hook back two independent CRS stores: the
// default WASM path (/api/v3/waf/crs, fixed 4.14.0) and the shield path
// (/api/v3/shield/crs, keyed by the coreruleset version each edge's binary embeds).
// The WASM behavior is unchanged when no options are passed.
export interface CrsLibraryOptions {
    source?: 'wasm' | 'shield';
    /** Auto-pin the version to this (the shield fleet's primary) once versions load. */
    pinnedVersion?: string;
}

export interface CrsLibraryState {
    crsVersion: string;
    setCrsVersion: (v: string) => void;
    severity?: string;
    setSeverity: (v: string | undefined) => void;
    phase?: number;
    setPhase: (v: number | undefined) => void;
    paranoia?: number;
    setParanoia: (v: number | undefined) => void;
    tags: string[];
    setTags: (v: string[]) => void;
    search: string;
    setSearch: (v: string) => void;
}

export interface CrsLibraryData {
    versions: { crs_version: string; coraza_version: string; total_rules: number }[];
    isLoading: boolean;
    /** True when the CRS rules request failed (API down / unreachable). */
    isError: boolean;
    /** Human-readable error message when isError. */
    errorMessage?: string;
    rules: CrsRule[];
    filteredRules: CrsRule[];
    rulesByFile: { filename: string; rules: CrsRule[] }[];
    availableTags: { label: string; value: string }[];
    availablePhases: { label: string; value: number }[];
    availableSeverities: { label: string; value: string }[];
    availableParanoiaLevels: { label: string; value: number }[];
    totalRuleCount: number;
}

const PHASE_NAMES: Record<number, string> = {
    1: 'Request Headers',
    2: 'Request Body',
    3: 'Response Headers',
    4: 'Response Body',
    5: 'Logging',
};

export const useCrsLibrary = (opts?: CrsLibraryOptions): { state: CrsLibraryState; data: CrsLibraryData } => {
    const source = opts?.source ?? 'wasm';
    const pinnedVersion = opts?.pinnedVersion;
    // Shield starts empty (the version resolves from the fleet, and the rules query is
    // gated on a non-empty version so we never fire a 404 for '4.14.0' against the shield
    // store). WASM keeps its historical 4.14.0 default.
    const [crsVersion, setCrsVersion] = useState<string>(pinnedVersion || (source === 'shield' ? '' : '4.14.0'));
    // Tracks the pinnedVersion we've already auto-applied, so the pin is ONE-SHOT and a
    // manual "browse another version" pick isn't snapped back on the next render.
    const autoPinnedFor = useRef<string | undefined>(undefined);
    const [severity, setSeverity] = useState<string | undefined>();
    const [phase, setPhase] = useState<number | undefined>();
    const [paranoia, setParanoia] = useState<number | undefined>();
    const [tags, setTags] = useState<string[]>([]);
    const [search, setSearch] = useState<string>('');

    const { data: versionsData } = useQuery({
        queryKey: ['crs-versions', source],
        queryFn: () => (source === 'shield' ? shieldApi.getShieldCrsVersions() : wafApi.getCrsVersions()),
    });

    // Auto-pin (ONE-SHOT) to the caller's pinnedVersion when the backend has a library
    // for it; otherwise ensure the current selection actually exists. The one-shot guard
    // lets a manual browse-override stick instead of being forced back to the primary.
    useEffect(() => {
        const versions = versionsData?.versions;
        if (!versions || versions.length === 0) return;
        if (pinnedVersion && autoPinnedFor.current !== pinnedVersion && versions.some((v) => v.crs_version === pinnedVersion)) {
            autoPinnedFor.current = pinnedVersion;
            if (crsVersion !== pinnedVersion) setCrsVersion(pinnedVersion);
            return;
        }
        const known = versions.find((v) => v.crs_version === crsVersion);
        if (!known) setCrsVersion(versions[0].crs_version);
    }, [versionsData, crsVersion, pinnedVersion]);

    const filterPayload = useMemo<CrsFilter>(
        () => ({
            crs_version: crsVersion,
            severity,
            phase,
            paranoia_level: paranoia,
            tags: tags.length > 0 ? tags.join(',') : undefined,
        }),
        [crsVersion, severity, phase, paranoia, tags],
    );

    const { data: rulesData, isLoading, isError, error } = useQuery({
        queryKey: ['crs-rules', source, filterPayload],
        queryFn: () => (source === 'shield' ? shieldApi.getShieldCrsRules(filterPayload) : wafApi.getCrsRules(filterPayload)),
        enabled: !!crsVersion,
    });

    const rules = rulesData?.rules ?? [];

    const filteredRules = useMemo(() => {
        if (!search.trim()) return rules;
        const q = search.toLowerCase();
        return rules.filter((r) => {
            if (String(r.characteristics.id).toLowerCase().includes(q)) return true;
            if (r.title?.toLowerCase().includes(q)) return true;
            if (r.description?.short?.toLowerCase().includes(q)) return true;
            if (r.description?.extended?.toLowerCase().includes(q)) return true;
            if (r.characteristics.file?.toLowerCase().includes(q)) return true;
            return false;
        });
    }, [rules, search]);

    const rulesByFile = useMemo(() => {
        const map = new Map<string, CrsRule[]>();
        filteredRules.forEach((r) => {
            const file = r.characteristics.file || '(no file)';
            if (!map.has(file)) map.set(file, []);
            map.get(file)!.push(r);
        });
        return Array.from(map.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([filename, list]) => ({ filename, rules: list }));
    }, [filteredRules]);

    const availableTags = useMemo(() => {
        const set = new Set<string>();
        rules.forEach((r) => r.characteristics.tags?.forEach((t) => set.add(t)));
        return Array.from(set)
            .sort()
            .map((t) => ({
                label: t.split('-').map((w) => w[0]?.toUpperCase() + w.slice(1)).join(' '),
                value: t,
            }));
    }, [rules]);

    const availablePhases = useMemo(() => {
        const s = new Set<number>();
        rules.forEach((r) => {
            if (r.characteristics.phase != null) s.add(r.characteristics.phase);
        });
        return Array.from(s)
            .sort()
            .map((p) => ({ label: `${p} — ${PHASE_NAMES[p] ?? 'Unknown'}`, value: p }));
    }, [rules]);

    const availableSeverities = useMemo(() => {
        const s = new Set<string>();
        rules.forEach((r) => r.characteristics.severity && s.add(r.characteristics.severity));
        return Array.from(s)
            .sort()
            .map((v) => ({ label: v[0] + v.slice(1).toLowerCase(), value: v }));
    }, [rules]);

    const availableParanoiaLevels = useMemo(() => {
        const s = new Set<number>();
        rules.forEach((r) => {
            if (r.characteristics.paranoia_level != null) s.add(r.characteristics.paranoia_level);
        });
        return Array.from(s)
            .sort()
            .map((p) => ({ label: `Level ${p}`, value: p }));
    }, [rules]);

    return {
        state: {
            crsVersion,
            setCrsVersion,
            severity,
            setSeverity,
            phase,
            setPhase,
            paranoia,
            setParanoia,
            tags,
            setTags,
            search,
            setSearch,
        },
        data: {
            versions: versionsData?.versions ?? [],
            isLoading,
            isError,
            errorMessage: isError ? ((error as Error)?.message || 'Request failed') : undefined,
            rules,
            filteredRules,
            rulesByFile,
            availableTags,
            availablePhases,
            availableSeverities,
            availableParanoiaLevels,
            totalRuleCount: rulesData?.total ?? rules.length,
        },
    };
};

export const PHASE_LABEL = (p: number): string => PHASE_NAMES[p] ?? 'Unknown';
