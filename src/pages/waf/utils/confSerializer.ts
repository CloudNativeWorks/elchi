/**
 * Serialize editor state to a ModSecurity-style .conf preview.
 * The output mimics what would actually be loaded by Coraza, so users
 * can read/copy/diff against the real config.
 */

import { DirectiveSet, WafEditorState } from '../types';

const HEADER_BANNER = (name: string, isDefault: boolean): string => {
    const tag = isDefault ? ' (default)' : '';
    return [
        '# ──────────────────────────────────────────────────',
        `# ${name}${tag}`,
        '# ──────────────────────────────────────────────────',
    ].join('\n');
};

/**
 * Serialize a single set to a .conf string.
 */
export const serializeSet = (set: DirectiveSet, isDefault = false): string => {
    const banner = HEADER_BANNER(set.name, isDefault);
    if (set.directives.length === 0) {
        return `${banner}\n# (empty — add directives to populate this set)\n`;
    }
    const lines = set.directives.map((d) => d.text).join('\n');
    return `${banner}\n${lines}\n`;
};

/**
 * Serialize the entire editor state into one consolidated .conf.
 * The default set is emitted first; remaining sets follow.
 */
export const serializeEditor = (state: WafEditorState): string => {
    if (state.sets.length === 0) {
        return '# (no directive sets — add one to begin)\n';
    }

    const ordered: DirectiveSet[] = [];
    const def = state.sets.find((s) => s.id === state.defaultSetId);
    if (def) ordered.push(def);
    for (const s of state.sets) if (s.id !== def?.id) ordered.push(s);

    const blocks = ordered.map((s) => serializeSet(s, s.id === state.defaultSetId));

    const advanced: string[] = [];
    if (Object.keys(state.metricLabels).length > 0) {
        advanced.push('# Metric labels:');
        for (const [k, v] of Object.entries(state.metricLabels)) {
            advanced.push(`#   ${k} = ${v}`);
        }
    }
    if (Object.keys(state.perAuthorityDirectives).length > 0) {
        advanced.push('# Per-authority directive overrides:');
        for (const [domain, set] of Object.entries(state.perAuthorityDirectives)) {
            advanced.push(`#   ${domain} -> ${set}`);
        }
    }

    return [...blocks, advanced.join('\n')].filter(Boolean).join('\n');
};
