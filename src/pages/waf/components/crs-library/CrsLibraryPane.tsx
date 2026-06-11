import React, { useEffect, useMemo, useState } from 'react';
import { Empty, Spin, Typography } from 'antd';
import { CrsRule } from '../../types';
import { useCrsLibrary } from './useCrsLibrary';
import CrsLibraryFilters from './CrsLibraryFilters';
import CrsRuleFileGroup from './CrsRuleFileGroup';
import CrsBulkActionBar from './CrsBulkActionBar';

const { Text } = Typography;

const decodeRule = (raw: string): string =>
    raw.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\"/g, '"').replace(/&amp;/g, '&');

/** Pull the numeric rule id out of a SecRule line (`id:942100`, `id:'942100'`). */
const ruleIdOf = (text: string): number | null => {
    const m = text.match(/\bid\s*:\s*['"]?(\d+)/i);
    return m ? Number(m[1]) : null;
};

/** A place CRS rules can be added to (a WAF directive set, or Shield's rules blob). */
export interface CrsAddTarget {
    id: string;
    name: string;
    /** The target's current directive texts — drives the "already added" state. */
    existingTexts: string[];
}

export interface CrsLibraryPaneProps {
    /**
     * Where single "+"/Include adds go, and whose directives drive the
     * "already added" badges. `null` means adds aren't possible yet (e.g. the
     * WAF page has no active set selected) — see `notReadyAlert`.
     */
    activeTarget: CrsAddTarget | null;
    /** Append directive texts to a target id (dedupe is the host's job). */
    onAdd: (texts: string[], targetId: string) => void;
    /**
     * Optional set of targets the bulk-add can choose between. Defaults to just
     * the active target (single-target hosts like Shield get no picker; the WAF
     * page passes all its directive sets).
     */
    bulkTargets?: CrsAddTarget[];
    /** Rendered in place of the list header when `activeTarget` is null. */
    notReadyAlert?: React.ReactNode;
    /** Read-only: disable all add/include/bulk affordances. */
    disabled?: boolean;
}

/**
 * The redesigned CRS browser, callback-driven so both the WASM-WAF editor and
 * the Shield WAF Studio can host it:
 * - Sticky compact filter bar
 * - File-grouped, default-collapsed rule list (rule details lazy-rendered)
 * - Per-rule and per-file checkboxes for multi-select
 * - Sticky bottom bulk-action bar that adds N rules to a chosen target in one go
 */
const CrsLibraryPane: React.FC<CrsLibraryPaneProps> = ({
    activeTarget,
    onAdd,
    bulkTargets,
    notReadyAlert,
    disabled,
}) => {
    const canAdd = !!activeTarget && !disabled;
    const { state, data } = useCrsLibrary();

    const allTargets = useMemo<CrsAddTarget[]>(
        () => bulkTargets ?? (activeTarget ? [activeTarget] : []),
        [bulkTargets, activeTarget],
    );

    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [targetId, setTargetId] = useState<string | null>(activeTarget?.id ?? null);

    // Keep the bulk-add target valid: default to the active target, and if the
    // chosen target disappears, fall back to the active target (or null).
    useEffect(() => {
        if (!targetId) {
            if (activeTarget) setTargetId(activeTarget.id);
            return;
        }
        const stillExists = allTargets.some((t) => t.id === targetId);
        if (!stillExists) setTargetId(activeTarget?.id ?? null);
    }, [activeTarget, targetId, allTargets]);

    // Quick id -> rule map so the bulk action can look rules up.
    const ruleById = useMemo(() => {
        const m = new Map<number, CrsRule>();
        data.filteredRules.forEach((r) => m.set(r.characteristics.id, r));
        return m;
    }, [data.filteredRules]);

    // Which rule IDs and which file Includes are already present in the active
    // target, so the +/Include buttons can render an "already added" state.
    //
    // Wildcards: `Include @owasp_crs/*.conf` marks ALL files as included.
    const { addedRuleIds, addedFiles, wildcardIncluded } = useMemo(() => {
        const ids = new Set<number>();
        const files = new Set<string>();
        let wildcard = false;
        if (!activeTarget) return { addedRuleIds: ids, addedFiles: files, wildcardIncluded: false };

        // Match by rule id (not full text), so a copied rule the user has since
        // edited still reads as "already added" and can't be silently re-added
        // with a duplicate id.
        const presentIds = new Set<number>();
        activeTarget.existingTexts.forEach((t) => {
            const rid = ruleIdOf(t);
            if (rid !== null) presentIds.add(rid);
        });
        data.filteredRules.forEach((rule) => {
            if (presentIds.has(rule.characteristics.id)) ids.add(rule.characteristics.id);
        });

        activeTarget.existingTexts.forEach((text) => {
            const match = text.match(/^\s*Include\s+@owasp_crs\/(.+?)\s*$/i);
            if (!match) return;
            const captured = match[1];
            if (captured.includes('*')) wildcard = true;
            else files.add(captured);
        });

        return { addedRuleIds: ids, addedFiles: files, wildcardIncluded: wildcard };
    }, [activeTarget, data.filteredRules]);

    // A wildcard include effectively loads every visible file.
    const effectiveAddedFiles = useMemo(() => {
        if (!wildcardIncluded) return addedFiles;
        const all = new Set(addedFiles);
        data.rulesByFile.forEach((g) => all.add(g.filename));
        return all;
    }, [wildcardIncluded, addedFiles, data.rulesByFile]);

    const toggleRule = (id: number) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const toggleFile = (_filename: string, ruleIds: number[], select: boolean) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            ruleIds.forEach((id) => {
                if (select) next.add(id);
                else next.delete(id);
            });
            return next;
        });
    };

    const addOne = (rule: CrsRule) => {
        if (!activeTarget || !rule.description.rule) return;
        onAdd([decodeRule(rule.description.rule)], activeTarget.id);
    };

    const includeFile = (filename: string) => {
        if (!activeTarget) return;
        onAdd([`Include @owasp_crs/${filename}`], activeTarget.id);
    };

    const applyBulk = () => {
        if (disabled || !targetId || selectedIds.size === 0) return;
        const texts: string[] = [];
        selectedIds.forEach((id) => {
            const rule = ruleById.get(id);
            if (rule?.description.rule) texts.push(decodeRule(rule.description.rule));
        });
        if (texts.length === 0) return;
        onAdd(texts, targetId);
        setSelectedIds(new Set());
    };

    // How many selected rules already exist in the chosen bulk target, so the
    // action bar can show that the dedupe will trim the batch.
    const targetExistingIds = useMemo(() => {
        const t = allTargets.find((x) => x.id === targetId);
        const s = new Set<number>();
        t?.existingTexts.forEach((text) => {
            const rid = ruleIdOf(text);
            if (rid !== null) s.add(rid);
        });
        return s;
    }, [allTargets, targetId]);

    const alreadyInTargetCount = useMemo(() => {
        if (targetExistingIds.size === 0 || selectedIds.size === 0) return 0;
        let n = 0;
        selectedIds.forEach((id) => {
            if (targetExistingIds.has(id)) n += 1;
        });
        return n;
    }, [targetExistingIds, selectedIds]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, height: '100%' }}>
            <CrsLibraryFilters state={state} data={data} />

            {!activeTarget && notReadyAlert}

            {wildcardIncluded && (
                <div style={{ padding: '8px 16px 0' }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        A wildcard <code>Include @owasp_crs/*</code> is present in{' '}
                        {activeTarget?.name ?? 'the active rules'} — every file below is already loaded by it.
                    </Text>
                </div>
            )}

            <div style={{ padding: '8px 16px', color: 'var(--text-secondary)', fontSize: 12 }}>
                {data.isLoading ? (
                    <span><Spin size="small" /> Loading rules…</span>
                ) : (
                    <Text type="secondary">
                        {data.filteredRules.length}{' '}
                        {data.filteredRules.length !== data.totalRuleCount
                            ? `of ${data.totalRuleCount}`
                            : ''}{' '}
                        rule{data.filteredRules.length === 1 ? '' : 's'} ·{' '}
                        {data.rulesByFile.length} file{data.rulesByFile.length === 1 ? '' : 's'}
                    </Text>
                )}
            </div>

            <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
                {data.isLoading && data.rulesByFile.length === 0 ? (
                    <div style={{ padding: 32, textAlign: 'center' }}>
                        <Spin />
                    </div>
                ) : data.rulesByFile.length === 0 ? (
                    <Empty description="No rules match the current filters" style={{ padding: 48 }} />
                ) : (
                    data.rulesByFile.map((g) => (
                        <CrsRuleFileGroup
                            key={g.filename}
                            filename={g.filename}
                            rules={g.rules}
                            selectedIds={selectedIds}
                            onToggleRule={toggleRule}
                            onToggleAll={toggleFile}
                            onAddRule={addOne}
                            onIncludeFile={includeFile}
                            canAdd={canAdd}
                            addedRuleIds={addedRuleIds}
                            addedFiles={effectiveAddedFiles}
                            activeSetName={activeTarget?.name}
                        />
                    ))
                )}
            </div>

            <CrsBulkActionBar
                selectedCount={selectedIds.size}
                alreadyInTargetCount={alreadyInTargetCount}
                targetId={targetId}
                onChangeTarget={setTargetId}
                onApply={applyBulk}
                onClear={() => setSelectedIds(new Set())}
                targets={allTargets.map((t) => ({ label: t.name, value: t.id }))}
            />
        </div>
    );
};

export default CrsLibraryPane;
