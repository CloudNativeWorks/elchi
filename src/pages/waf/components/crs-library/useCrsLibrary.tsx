/**
 * CRS Library state hook.
 *
 * Owns: filters, query, client-side ID/description search, file grouping,
 * selection set (rule IDs), and a "recently added" memory.
 *
 * Caller composes these into the visible UI.
 */

import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { wafApi } from '../../wafApi';
import { CrsFilter, CrsRule } from '../../types';

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

export const useCrsLibrary = (): { state: CrsLibraryState; data: CrsLibraryData } => {
    const [crsVersion, setCrsVersion] = useState<string>('4.14.0');
    const [severity, setSeverity] = useState<string | undefined>();
    const [phase, setPhase] = useState<number | undefined>();
    const [paranoia, setParanoia] = useState<number | undefined>();
    const [tags, setTags] = useState<string[]>([]);
    const [search, setSearch] = useState<string>('');

    const { data: versionsData } = useQuery({
        queryKey: ['crs-versions'],
        queryFn: () => wafApi.getCrsVersions(),
    });

    // Auto-pin to first available version once versions load.
    useEffect(() => {
        if (versionsData?.versions && versionsData.versions.length > 0) {
            const known = versionsData.versions.find((v) => v.crs_version === crsVersion);
            if (!known) setCrsVersion(versionsData.versions[0].crs_version);
        }
    }, [versionsData, crsVersion]);

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

    const { data: rulesData, isLoading } = useQuery({
        queryKey: ['crs-rules', filterPayload],
        queryFn: () => wafApi.getCrsRules(filterPayload),
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
