import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Empty, Spin, Typography } from 'antd';
import { CrsRule } from '../../types';
import { useActiveSet, useWafEditor } from '../../state/wafEditorStore';
import { useCrsLibrary } from './useCrsLibrary';
import CrsLibraryFilters from './CrsLibraryFilters';
import CrsRuleFileGroup from './CrsRuleFileGroup';
import CrsBulkActionBar from './CrsBulkActionBar';

const { Text } = Typography;

const decodeRule = (raw: string): string =>
    raw.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\"/g, '"').replace(/&/g, '&');

/**
 * The redesigned CRS browser:
 * - Sticky compact filter bar
 * - File-grouped, default-collapsed rule list (rule details lazy-rendered)
 * - Per-rule and per-file checkboxes for multi-select
 * - Sticky bottom bulk-action bar that adds N rules to a chosen set in one go
 */
const CrsLibraryPane: React.FC = () => {
    const { state: editorState, dispatch } = useWafEditor();
    const activeSet = useActiveSet();
    const { state, data } = useCrsLibrary();

    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [targetSetId, setTargetSetId] = useState<string | null>(activeSet?.id ?? null);

    // Keep the bulk-add target in sync with reality:
    //   - Default to the active set when nothing is picked yet.
    //   - If the previously-picked target gets removed elsewhere, fall back
    //     to the active set (or null) so the bar's button doesn't silently
    //     no-op.
    useEffect(() => {
        if (!targetSetId) {
            if (activeSet) setTargetSetId(activeSet.id);
            return;
        }
        const stillExists = editorState.editor.sets.some((s) => s.id === targetSetId);
        if (!stillExists) setTargetSetId(activeSet?.id ?? null);
    }, [activeSet, targetSetId, editorState.editor.sets]);

    // Build a quick id -> rule map so the bulk action can look rules up.
    const ruleById = useMemo(() => {
        const m = new Map<number, CrsRule>();
        data.filteredRules.forEach((r) => m.set(r.characteristics.id, r));
        return m;
    }, [data.filteredRules]);

    // Compute which rule IDs and which file Includes are already present in
    // the active set, so the +/Include buttons can render an "already added"
    // state and stop responding to repeated clicks.
    //
    // Wildcards: `Include @owasp_crs/*.conf` (or any `*` glob) marks ALL
    // available files as included, since the directive will pull them in
    // at runtime regardless.
    const { addedRuleIds, addedFiles, wildcardIncluded } = useMemo(() => {
        const ids = new Set<number>();
        const files = new Set<string>();
        let wildcard = false;
        if (!activeSet) return { addedRuleIds: ids, addedFiles: files, wildcardIncluded: false };
        const directiveTexts = new Set(activeSet.directives.map((d) => d.text));

        data.filteredRules.forEach((rule) => {
            if (rule.description.rule && directiveTexts.has(decodeRule(rule.description.rule))) {
                ids.add(rule.characteristics.id);
            }
        });

        // For files: any directive of the form `Include @owasp_crs/<name>` counts.
        // If <name> contains a `*`, treat as a wildcard covering every file.
        activeSet.directives.forEach((d) => {
            const match = d.text.match(/^\s*Include\s+@owasp_crs\/(.+?)\s*$/i);
            if (!match) return;
            const captured = match[1];
            if (captured.includes('*')) {
                wildcard = true;
            } else {
                files.add(captured);
            }
        });

        return { addedRuleIds: ids, addedFiles: files, wildcardIncluded: wildcard };
    }, [activeSet, data.filteredRules]);

    // If a wildcard include is present, treat every visible file as included.
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
        if (!activeSet || !rule.description.rule) return;
        dispatch({
            type: 'ADD_DIRECTIVE',
            setId: activeSet.id,
            text: decodeRule(rule.description.rule),
        });
    };

    const includeFile = (filename: string) => {
        if (!activeSet) return;
        dispatch({
            type: 'ADD_DIRECTIVE',
            setId: activeSet.id,
            text: `Include @owasp_crs/${filename}`,
        });
    };

    const applyBulk = () => {
        if (!targetSetId || selectedIds.size === 0) return;
        const texts: string[] = [];
        selectedIds.forEach((id) => {
            const rule = ruleById.get(id);
            if (rule?.description.rule) texts.push(decodeRule(rule.description.rule));
        });
        if (texts.length === 0) return;
        // Reducer dedupes against the target set; we just dispatch and clear.
        dispatch({ type: 'ADD_DIRECTIVES', setId: targetSetId, texts });
        setSelectedIds(new Set());
    };

    // Count how many of the currently-selected rules are already present in
    // the *target* set (which may differ from the active set). The bulk action
    // bar shows this so users know the dedupe will trim their batch.
    const targetSet = useMemo(
        () => editorState.editor.sets.find((s) => s.id === targetSetId) ?? null,
        [targetSetId, editorState],
    );
    const alreadyInTargetCount = useMemo(() => {
        if (!targetSet || selectedIds.size === 0) return 0;
        const existing = new Set(targetSet.directives.map((d) => d.text));
        let n = 0;
        selectedIds.forEach((id) => {
            const r = ruleById.get(id);
            if (r?.description.rule && existing.has(decodeRule(r.description.rule))) n += 1;
        });
        return n;
    }, [targetSet, selectedIds, ruleById]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, height: '100%' }}>
            <CrsLibraryFilters state={state} data={data} />

            {!activeSet && (
                <Alert
                    type="warning"
                    showIcon
                    style={{ margin: 12 }}
                    message="No active directive set"
                    description="Pick or create a set on the page first; rules and Include lines are appended to the active set."
                />
            )}

            {wildcardIncluded && (
                <Alert
                    type="info"
                    showIcon
                    style={{ margin: 12 }}
                    message={`A wildcard \`Include @owasp_crs/*\` is already in ${activeSet?.name ?? 'the active set'}`}
                    description="Every file below is effectively loaded by that wildcard. Add individual files only if you plan to remove the wildcard later."
                />
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
                            canAdd={!!activeSet}
                            addedRuleIds={addedRuleIds}
                            addedFiles={effectiveAddedFiles}
                            activeSetName={activeSet?.name}
                        />
                    ))
                )}
            </div>

            <CrsBulkActionBar
                selectedCount={selectedIds.size}
                alreadyInTargetCount={alreadyInTargetCount}
                targetSetId={targetSetId}
                onChangeTarget={setTargetSetId}
                onApply={applyBulk}
                onClear={() => setSelectedIds(new Set())}
            />
        </div>
    );
};

export default CrsLibraryPane;
