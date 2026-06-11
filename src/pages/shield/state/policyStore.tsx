/**
 * Page-scoped store for the shield policy builder (mirrors the WAF editor's
 * useReducer + Context + undo/redo pattern). The builder state IS the typed
 * YAML object (PolicyFileModel); edits go through PATCH with a pure updater so
 * every dispatch is one undo step.
 */

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { PolicyFileModel, DataFileModel, newPolicyFile } from './model';

const UNDO_CAP = 50;

export interface PolicyEditorState {
    model: PolicyFileModel;
    dataFiles: DataFileModel[];
    /** True when the document contains constructs the builder can't represent. */
    yamlMode: boolean;
    /** The raw document text while in YAML mode (source of truth there). */
    rawYaml: string;
    /** Why the policy is in YAML mode (unsupported paths / legacy bundle note). */
    yamlModeReason: string[];
    dirty: boolean;
    past: Snapshot[];
    future: Snapshot[];
}

export type Snapshot = Omit<PolicyEditorState, 'past' | 'future'>;

const snap = (s: PolicyEditorState): Snapshot => ({
    model: s.model,
    dataFiles: s.dataFiles,
    yamlMode: s.yamlMode,
    rawYaml: s.rawYaml,
    yamlModeReason: s.yamlModeReason,
    dirty: s.dirty,
});

export type PolicyAction =
    | { type: 'HYDRATE'; state: Snapshot }
    | { type: 'PATCH'; update: (m: PolicyFileModel) => PolicyFileModel }
    | { type: 'SET_DATA_FILES'; files: DataFileModel[] }
    | { type: 'ENTER_YAML_MODE'; rawYaml: string; reason: string[] }
    | { type: 'SET_RAW_YAML'; rawYaml: string }
    | { type: 'EXIT_YAML_MODE'; model: PolicyFileModel }
    | { type: 'MARK_SAVED' }
    | { type: 'UNDO' }
    | { type: 'REDO' };

const initialState = (name = ''): PolicyEditorState => ({
    model: newPolicyFile(name),
    dataFiles: [],
    yamlMode: false,
    rawYaml: '',
    yamlModeReason: [],
    dirty: false,
    past: [],
    future: [],
});

const pushPast = (s: PolicyEditorState): Snapshot[] =>
    [...s.past.slice(-(UNDO_CAP - 1)), snap(s)];

const reducer = (s: PolicyEditorState, a: PolicyAction): PolicyEditorState => {
    switch (a.type) {
        case 'HYDRATE':
            return { ...a.state, past: [], future: [] };
        case 'PATCH':
            return {
                ...s,
                model: a.update(s.model),
                dirty: true,
                past: pushPast(s),
                future: [],
            };
        case 'SET_DATA_FILES':
            return { ...s, dataFiles: a.files, dirty: true, past: pushPast(s), future: [] };
        case 'ENTER_YAML_MODE':
            return {
                ...s,
                yamlMode: true,
                rawYaml: a.rawYaml,
                yamlModeReason: a.reason,
                dirty: true,
                past: pushPast(s),
                future: [],
            };
        case 'SET_RAW_YAML':
            return { ...s, rawYaml: a.rawYaml, dirty: true, past: pushPast(s), future: [] };
        case 'EXIT_YAML_MODE':
            return {
                ...s,
                yamlMode: false,
                rawYaml: '',
                yamlModeReason: [],
                model: a.model,
                dirty: true,
                past: pushPast(s),
                future: [],
            };
        case 'MARK_SAVED':
            return { ...s, dirty: false };
        case 'UNDO': {
            const prev = s.past[s.past.length - 1];
            if (!prev) return s;
            return { ...prev, past: s.past.slice(0, -1), future: [snap(s), ...s.future].slice(0, UNDO_CAP) };
        }
        case 'REDO': {
            const next = s.future[0];
            if (!next) return s;
            return { ...next, past: pushPast(s), future: s.future.slice(1) };
        }
        default:
            return s;
    }
};

interface PolicyEditorContextValue {
    state: PolicyEditorState;
    dispatch: React.Dispatch<PolicyAction>;
}

const PolicyEditorContext = createContext<PolicyEditorContextValue | undefined>(undefined);

export const PolicyEditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, undefined, () => initialState());
    return (
        <PolicyEditorContext.Provider value={{ state, dispatch }}>
            {children}
        </PolicyEditorContext.Provider>
    );
};

export const usePolicyEditor = (): PolicyEditorContextValue => {
    const ctx = useContext(PolicyEditorContext);
    if (!ctx) throw new Error('usePolicyEditor must be used within PolicyEditorProvider');
    return ctx;
};

/** Immutable deep-ish helpers for PATCH updaters. */
export const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));
