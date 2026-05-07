/**
 * Adapters between the backend wire shape (sets[]) and the editor's
 * normalized state.
 *
 * The backend (post-redesign) always emits the modern shape on GET and
 * accepts it on POST/PUT. This adapter:
 *   - lifts a fetched WafConfig into the editor's WafEditorState (with
 *     fresh client IDs so drag-drop has stable handles)
 *   - serializes the editor state back into a WafConfig payload for save
 */

import {
    DirectiveSet,
    Directive,
    WafConfig,
    WafConfigData,
    WafEditorState,
} from '../types';

/**
 * Generate a short, stable-enough client id. We don't need cryptographic
 * uniqueness — only collision-free within a single editor session.
 */
let _idCounter = 0;
export const newId = (prefix: string): string => {
    _idCounter += 1;
    return `${prefix}_${Date.now().toString(36)}_${_idCounter.toString(36)}`;
};

const toDirectives = (lines: string[] | undefined): Directive[] =>
    (lines ?? []).map((text) => ({ id: newId('d'), text }));

/**
 * Build editor state from a backend WafConfig. Returns a sensible empty
 * baseline for create mode (config = null).
 */
export const normalizeFromApi = (config: WafConfig | null | undefined): WafEditorState => {
    if (!config) {
        return {
            name: '',
            sets: [],
            defaultSetId: null,
            metricLabels: {},
            perAuthorityDirectives: {},
        };
    }

    const data = config.data;
    const apiSets = data?.sets ?? [];
    const defaultName = data?.default_set ?? '';

    const sets: DirectiveSet[] = apiSets.map((s) => ({
        id: newId('s'),
        name: s.name,
        description: s.description,
        directives: toDirectives(s.directives),
    }));

    const defaultSet = sets.find((s) => s.name === defaultName);

    return {
        name: config.name ?? '',
        sets,
        defaultSetId: defaultSet?.id ?? sets[0]?.id ?? null,
        metricLabels: data?.metric_labels ?? {},
        perAuthorityDirectives: data?.per_authority_directives ?? {},
    };
};

/**
 * Convert editor state back to the wire shape, ready for POST/PUT.
 * Throws on inconsistent state so callers can surface a friendly error.
 */
export const serializeToApi = (
    state: WafEditorState,
    project: string,
): { name: string; project: string; data: WafConfigData } => {
    if (!state.name.trim()) {
        throw new Error('Name is required');
    }
    if (state.sets.length === 0) {
        throw new Error('At least one directive set is required');
    }

    const seen = new Set<string>();
    for (const set of state.sets) {
        const trimmed = set.name.trim();
        if (!trimmed) throw new Error('Directive set name cannot be empty');
        if (seen.has(trimmed)) throw new Error(`Duplicate directive set name: "${trimmed}"`);
        seen.add(trimmed);
    }

    const defaultSet = state.sets.find((s) => s.id === state.defaultSetId);
    if (!defaultSet) {
        throw new Error('A default directive set must be selected');
    }

    if (Object.keys(state.perAuthorityDirectives).length > 0) {
        const setNames = new Set(state.sets.map((s) => s.name));
        for (const [domain, refName] of Object.entries(state.perAuthorityDirectives)) {
            if (!setNames.has(refName)) {
                throw new Error(
                    `Per-authority directive for "${domain}" references missing set "${refName}"`,
                );
            }
        }
    }

    const data: WafConfigData = {
        sets: state.sets.map((s) => ({
            name: s.name,
            ...(s.description ? { description: s.description } : {}),
            directives: s.directives.map((d) => d.text),
        })),
        default_set: defaultSet.name,
    };

    if (Object.keys(state.metricLabels).length > 0) {
        data.metric_labels = state.metricLabels;
    }
    if (Object.keys(state.perAuthorityDirectives).length > 0) {
        data.per_authority_directives = state.perAuthorityDirectives;
    }

    return {
        name: state.name.trim(),
        project,
        data,
    };
};

/**
 * Lookup helpers used by reducers and selectors.
 */
export const findSetById = (sets: DirectiveSet[], id: string | null): DirectiveSet | undefined =>
    id ? sets.find((s) => s.id === id) : undefined;

export const findDirectiveIndex = (set: DirectiveSet, directiveId: string): number =>
    set.directives.findIndex((d) => d.id === directiveId);
