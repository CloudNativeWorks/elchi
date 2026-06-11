/**
 * Codec between a Coraza `directives` blob (a single newline-joined SecLang
 * string, the wire shape in `CorazaSpec.directives`) and the editable row model
 * the WAF Studio custom-rules list works with.
 *
 * Shield stores custom rules as ONE string; the Studio edits them as a sortable
 * list of rows. `parseDirectives` splits the blob into rows (honoring `\` line
 * continuation and dropping cosmetic blank lines); `joinDirectives` puts them
 * back. The pair round-trips a blank-line-free blob byte-for-byte.
 */

import { newId } from '@/pages/waf/utils/wafAdapter';
import type { Directive } from '@/components/waf-studio';
import type { CorazaSpec } from '../../../state/model';

/** Split a SecLang blob into editable rows (one logical directive per row). */
export const parseDirectives = (blob?: string): Directive[] => {
    if (!blob) return [];
    const rows: string[] = [];
    let acc: string | null = null;
    for (const line of blob.split('\n')) {
        // A trailing backslash continues the directive onto the next line.
        const continued = /\\\s*$/.test(line);
        acc = acc === null ? line : `${acc}\n${line}`;
        if (!continued) {
            rows.push(acc);
            acc = null;
        }
    }
    if (acc !== null) rows.push(acc);
    return rows
        .filter((t) => t.trim().length > 0)
        .map((text) => ({ id: newId('d'), text }));
};

/** Re-join editable rows into the wire blob (undefined when empty). */
export const joinDirectives = (rows: Directive[]): string | undefined => {
    const text = rows
        .map((r) => r.text)
        .filter((t) => t.trim().length > 0)
        .join('\n');
    return text.length ? text : undefined;
};

/** Custom rule rows that aren't pure comments — what the summary/count cares about. */
export const countCustomRules = (blob?: string): number =>
    parseDirectives(blob).filter((r) => !r.text.trim().startsWith('#')).length;

/** Toggle a CRS rule id in the exclude list (used by the tuning section). */
export const toggleExcludeId = (
    ids: string[] | undefined,
    id: string,
): string[] | undefined => {
    const set = new Set(ids ?? []);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    const arr = [...set];
    return arr.length ? arr : undefined;
};

/**
 * Render the full SecLang the edge will effectively load, for the read-only
 * preview pane: an OWASP-CRS marker + tuning as comments (the numeric knobs are
 * applied by shield, not raw directives) followed by the custom rules verbatim.
 */
export const buildGeneratedConf = (spec: CorazaSpec): string => {
    const out: string[] = [];

    if (spec.include_owasp) {
        out.push('# OWASP Core Rule Set (embedded) — loaded by shield');
        if (spec.paranoia_level != null) out.push(`#   paranoia_level: ${spec.paranoia_level}`);
        if (spec.detection_paranoia_level != null)
            out.push(`#   detection_paranoia_level: ${spec.detection_paranoia_level}`);
        if (spec.inbound_anomaly_threshold != null)
            out.push(`#   inbound_anomaly_threshold: ${spec.inbound_anomaly_threshold}`);
        if (spec.outbound_anomaly_threshold != null)
            out.push(`#   outbound_anomaly_threshold: ${spec.outbound_anomaly_threshold}`);
        if (spec.exclude_rule_ids?.length)
            out.push(`#   disabled rule ids: ${spec.exclude_rule_ids.join(', ')}`);
        out.push('Include @owasp_crs/*.conf');
        out.push('');
    }

    const custom = spec.directives?.trim();
    if (custom) {
        out.push('# Custom rules');
        out.push(custom);
    }

    return out.join('\n').trim() || '# (no rules yet)';
};
