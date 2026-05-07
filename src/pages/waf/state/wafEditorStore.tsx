/**
 * WAF editor store — useReducer + Context.
 *
 * Holds the normalized editor state (DirectiveSet[]) plus UI cursors
 * (active set, active tab, dirty flag, undo stack).
 *
 * Why a reducer instead of redux/zustand:
 *   - The state is page-scoped; it doesn't need to leak into other pages.
 *   - All mutations are well-typed actions, which makes the undo stack trivial.
 *   - No new dependency.
 */

import React, {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useReducer,
    useRef,
} from 'react';
import {
    Directive,
    DirectiveSet,
    LintResult,
    MetricLabels,
    PerAuthorityDirectives,
    WafEditorState,
} from '../types';
import { newId } from '../utils/wafAdapter';

// ─── State ───────────────────────────────────────────────────────────────────

export type WafTab = 'editor' | 'preview' | 'history';

export interface WafUiState {
    activeSetId: string | null;
    activeTab: WafTab;
    dirty: boolean;
    lint: LintResult | null;
}

export interface WafStoreState {
    editor: WafEditorState;
    ui: WafUiState;
    /** Stack of editor snapshots to UNDO into. Capped at HISTORY_LIMIT. */
    past: WafEditorState[];
    /** Stack of editor snapshots to REDO into. Cleared on any new mutation. */
    future: WafEditorState[];
}

const HISTORY_LIMIT = 50;

const initialState: WafStoreState = {
    editor: {
        name: '',
        sets: [],
        defaultSetId: null,
        metricLabels: {},
        perAuthorityDirectives: {},
    },
    ui: {
        activeSetId: null,
        activeTab: 'editor',
        dirty: false,
        lint: null,
    },
    past: [],
    future: [],
};

// ─── Actions ────────────────────────────────────────────────────────────────

export type WafAction =
    | { type: 'HYDRATE'; state: WafEditorState }
    | { type: 'SET_NAME'; name: string }
    | { type: 'ADD_SET'; name: string; description?: string; directives?: string[]; markDefault?: boolean }
    | { type: 'RENAME_SET'; id: string; name: string }
    | { type: 'SET_SET_DESCRIPTION'; id: string; description: string }
    | { type: 'REMOVE_SET'; id: string }
    | { type: 'SET_DEFAULT_SET'; id: string }
    | { type: 'SELECT_SET'; id: string | null }
    | { type: 'SET_ACTIVE_TAB'; tab: WafTab }
    | { type: 'ADD_DIRECTIVE'; setId: string; text: string }
    | { type: 'ADD_DIRECTIVES'; setId: string; texts: string[] }
    | { type: 'UPDATE_DIRECTIVE'; setId: string; directiveId: string; text: string }
    | { type: 'REMOVE_DIRECTIVE'; setId: string; directiveId: string }
    | { type: 'REORDER_DIRECTIVES'; setId: string; orderedIds: string[] }
    | { type: 'SET_METRIC_LABELS'; labels: MetricLabels }
    | { type: 'SET_PER_AUTHORITY'; map: PerAuthorityDirectives }
    | { type: 'SET_LINT'; result: LintResult | null }
    | { type: 'CLEAR_DIRTY' }
    | { type: 'UNDO' }
    | { type: 'REDO' };

/**
 * Action types whose effect should be recorded into the undo stack.
 * Excludes UI-only changes (selection, tab, lint, dirty flag) and HYDRATE
 * (which establishes a fresh baseline rather than being undoable).
 */
const UNDOABLE_ACTIONS = new Set<WafAction['type']>([
    'SET_NAME',
    'ADD_SET',
    'RENAME_SET',
    'SET_SET_DESCRIPTION',
    'REMOVE_SET',
    'SET_DEFAULT_SET',
    'ADD_DIRECTIVE',
    'ADD_DIRECTIVES',
    'UPDATE_DIRECTIVE',
    'REMOVE_DIRECTIVE',
    'REORDER_DIRECTIVES',
    'SET_METRIC_LABELS',
    'SET_PER_AUTHORITY',
]);

// ─── Reducer ────────────────────────────────────────────────────────────────

const markDirty = (state: WafStoreState): WafStoreState => ({
    ...state,
    ui: { ...state.ui, dirty: true },
});

const updateSet = (
    state: WafStoreState,
    setId: string,
    fn: (set: DirectiveSet) => DirectiveSet,
): WafStoreState => {
    const sets = state.editor.sets.map((s) => (s.id === setId ? fn(s) : s));
    return { ...state, editor: { ...state.editor, sets } };
};

/**
 * Wrap any reducer that produces a new editor state so undoable mutations
 * automatically push a snapshot of the *previous* editor state onto `past`
 * and clear `future`. Non-undoable mutations (UI-only) bypass this.
 */
const withHistory = (
    prev: WafStoreState,
    next: WafStoreState,
    action: WafAction,
): WafStoreState => {
    if (!UNDOABLE_ACTIONS.has(action.type)) return next;
    if (next.editor === prev.editor) return next;
    const past = [...prev.past, prev.editor].slice(-HISTORY_LIMIT);
    return { ...next, past, future: [] };
};

export const wafReducer = (state: WafStoreState, action: WafAction): WafStoreState => {
    switch (action.type) {
        case 'HYDRATE': {
            const defaultSetId = action.state.defaultSetId
                ?? action.state.sets[0]?.id
                ?? null;
            return {
                editor: action.state,
                ui: {
                    activeSetId: defaultSetId,
                    activeTab: 'editor',
                    dirty: false,
                    lint: null,
                },
                past: [],
                future: [],
            };
        }

        case 'UNDO': {
            if (state.past.length === 0) return state;
            const previous = state.past[state.past.length - 1];
            const remaining = state.past.slice(0, -1);
            return {
                ...state,
                editor: previous,
                past: remaining,
                future: [state.editor, ...state.future],
                ui: { ...state.ui, dirty: true },
            };
        }

        case 'REDO': {
            if (state.future.length === 0) return state;
            const next = state.future[0];
            const remainingFuture = state.future.slice(1);
            return {
                ...state,
                editor: next,
                past: [...state.past, state.editor].slice(-HISTORY_LIMIT),
                future: remainingFuture,
                ui: { ...state.ui, dirty: true },
            };
        }

        case 'SET_NAME':
            return markDirty({
                ...state,
                editor: { ...state.editor, name: action.name },
            });

        case 'ADD_SET': {
            const newSet: DirectiveSet = {
                id: newId('s'),
                name: action.name,
                description: action.description,
                directives: (action.directives ?? []).map((text) => ({ id: newId('d'), text })),
            };
            const sets = [...state.editor.sets, newSet];
            const shouldBeDefault = action.markDefault || state.editor.sets.length === 0;
            return markDirty({
                ...state,
                editor: {
                    ...state.editor,
                    sets,
                    defaultSetId: shouldBeDefault ? newSet.id : state.editor.defaultSetId,
                },
                ui: { ...state.ui, activeSetId: newSet.id },
            });
        }

        case 'RENAME_SET': {
            // Cascade rename to per-authority refs which point at sets by NAME,
            // not by ID. Without this, renaming silently leaves dangling
            // references that fail validation at save time.
            const oldName = state.editor.sets.find((s) => s.id === action.id)?.name;
            const updated = updateSet(state, action.id, (s) => ({ ...s, name: action.name }));
            if (!oldName || oldName === action.name) return markDirty(updated);
            const newAuthority: PerAuthorityDirectives = {};
            for (const [domain, ref] of Object.entries(updated.editor.perAuthorityDirectives)) {
                newAuthority[domain] = ref === oldName ? action.name : ref;
            }
            return markDirty({
                ...updated,
                editor: { ...updated.editor, perAuthorityDirectives: newAuthority },
            });
        }

        case 'SET_SET_DESCRIPTION':
            return markDirty(updateSet(state, action.id, (s) => ({ ...s, description: action.description })));

        case 'REMOVE_SET': {
            const remaining = state.editor.sets.filter((s) => s.id !== action.id);
            // If we removed the default, pick a new one (first remaining, if any).
            const wasDefault = state.editor.defaultSetId === action.id;
            const newDefaultId = wasDefault ? (remaining[0]?.id ?? null) : state.editor.defaultSetId;
            // Active set fallback
            const newActiveId =
                state.ui.activeSetId === action.id
                    ? (remaining[0]?.id ?? null)
                    : state.ui.activeSetId;
            // Drop per-authority refs that point to the removed set.
            const removedName = state.editor.sets.find((s) => s.id === action.id)?.name;
            const filteredAuthority: PerAuthorityDirectives = {};
            for (const [k, v] of Object.entries(state.editor.perAuthorityDirectives)) {
                if (v !== removedName) filteredAuthority[k] = v;
            }
            return markDirty({
                ...state,
                editor: {
                    ...state.editor,
                    sets: remaining,
                    defaultSetId: newDefaultId,
                    perAuthorityDirectives: filteredAuthority,
                },
                ui: { ...state.ui, activeSetId: newActiveId },
            });
        }

        case 'SET_DEFAULT_SET':
            return markDirty({
                ...state,
                editor: { ...state.editor, defaultSetId: action.id },
            });

        case 'SELECT_SET':
            return { ...state, ui: { ...state.ui, activeSetId: action.id } };

        case 'SET_ACTIVE_TAB':
            return { ...state, ui: { ...state.ui, activeTab: action.tab } };

        case 'ADD_DIRECTIVE': {
            // Idempotent: if the exact text already exists in the target set,
            // return state unchanged so the CRS Library "+ already added"
            // visual indicator stays truthful and we don't accumulate dupes.
            const target = state.editor.sets.find((s) => s.id === action.setId);
            if (!target) return state;
            if (target.directives.some((d) => d.text === action.text)) return state;
            return markDirty(
                updateSet(state, action.setId, (s) => ({
                    ...s,
                    directives: [...s.directives, { id: newId('d'), text: action.text }],
                })),
            );
        }

        case 'ADD_DIRECTIVES': {
            const target = state.editor.sets.find((s) => s.id === action.setId);
            if (!target) return state;
            const existing = new Set(target.directives.map((d) => d.text));
            const fresh = action.texts.filter((t) => !existing.has(t));
            if (fresh.length === 0) return state;
            return markDirty(
                updateSet(state, action.setId, (s) => ({
                    ...s,
                    directives: [
                        ...s.directives,
                        ...fresh.map((text) => ({ id: newId('d'), text })),
                    ],
                })),
            );
        }

        case 'UPDATE_DIRECTIVE':
            return markDirty(
                updateSet(state, action.setId, (s) => ({
                    ...s,
                    directives: s.directives.map((d) =>
                        d.id === action.directiveId ? { ...d, text: action.text } : d,
                    ),
                })),
            );

        case 'REMOVE_DIRECTIVE':
            return markDirty(
                updateSet(state, action.setId, (s) => ({
                    ...s,
                    directives: s.directives.filter((d) => d.id !== action.directiveId),
                })),
            );

        case 'REORDER_DIRECTIVES': {
            return markDirty(
                updateSet(state, action.setId, (s) => {
                    const lookup = new Map<string, Directive>(s.directives.map((d) => [d.id, d]));
                    const reordered = action.orderedIds
                        .map((id) => lookup.get(id))
                        .filter((d): d is Directive => Boolean(d));
                    return { ...s, directives: reordered };
                }),
            );
        }

        case 'SET_METRIC_LABELS':
            return markDirty({
                ...state,
                editor: { ...state.editor, metricLabels: action.labels },
            });

        case 'SET_PER_AUTHORITY':
            return markDirty({
                ...state,
                editor: { ...state.editor, perAuthorityDirectives: action.map },
            });

        case 'SET_LINT':
            return { ...state, ui: { ...state.ui, lint: action.result } };

        case 'CLEAR_DIRTY':
            return { ...state, ui: { ...state.ui, dirty: false } };

        default:
            return state;
    }
};

/**
 * Outer reducer: dispatches to `wafReducer` and applies the history rule.
 */
const historyAwareReducer = (state: WafStoreState, action: WafAction): WafStoreState => {
    const next = wafReducer(state, action);
    return withHistory(state, next, action);
};

// ─── Context ────────────────────────────────────────────────────────────────

interface WafEditorContextValue {
    state: WafStoreState;
    dispatch: React.Dispatch<WafAction>;
    /** Stable accessor for current state, useful inside async/event handlers. */
    getState: () => WafStoreState;
    canUndo: boolean;
    canRedo: boolean;
}

const WafEditorContext = createContext<WafEditorContextValue | null>(null);

export const WafEditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(historyAwareReducer, initialState);
    const stateRef = useRef(state);
    stateRef.current = state;
    const getState = useCallback(() => stateRef.current, []);

    const value = useMemo<WafEditorContextValue>(
        () => ({
            state,
            dispatch,
            getState,
            canUndo: state.past.length > 0,
            canRedo: state.future.length > 0,
        }),
        [state, getState],
    );

    return <WafEditorContext.Provider value={value}>{children}</WafEditorContext.Provider>;
};

export const useWafEditor = (): WafEditorContextValue => {
    const ctx = useContext(WafEditorContext);
    if (!ctx) throw new Error('useWafEditor must be used inside <WafEditorProvider>');
    return ctx;
};

// ─── Selectors ──────────────────────────────────────────────────────────────

export const useActiveSet = (): DirectiveSet | undefined => {
    const { state } = useWafEditor();
    return state.editor.sets.find((s) => s.id === state.ui.activeSetId);
};

export const useDefaultSet = (): DirectiveSet | undefined => {
    const { state } = useWafEditor();
    return state.editor.sets.find((s) => s.id === state.editor.defaultSetId);
};
