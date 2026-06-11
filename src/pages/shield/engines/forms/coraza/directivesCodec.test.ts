/**
 * Round-trip tests for the Coraza directives codec — the guarantee behind the
 * WAF Studio custom-rules list: editing rules as a sortable list and writing
 * them back into `CorazaSpec.directives` must not corrupt the SecLang.
 */

import { describe, expect, it } from 'vitest';
import {
    buildGeneratedConf,
    countCustomRules,
    joinDirectives,
    parseDirectives,
    toggleExcludeId,
} from './directivesCodec';

describe('parseDirectives / joinDirectives round-trip', () => {
    it('round-trips a multi-rule blob byte-for-byte', () => {
        const blob = [
            'SecRule REQUEST_URI "@contains /old-api" "id:1001,phase:1,deny,status:410"',
            'SecRule ARGS "@detectSQLi" "id:1002,phase:2,deny,t:none,t:urlDecodeUni"',
            '# a comment line',
            'SecRuleEngine On',
        ].join('\n');
        expect(joinDirectives(parseDirectives(blob))).toBe(blob);
    });

    it('keeps a `\\`-continued directive as a single row', () => {
        const blob = 'SecRule ARGS "@rx attack" \\\n    "id:2001,phase:2,deny"';
        const rows = parseDirectives(blob);
        expect(rows).toHaveLength(1);
        expect(rows[0].text).toBe(blob);
        expect(joinDirectives(rows)).toBe(blob);
    });

    it('drops cosmetic blank lines but preserves content order', () => {
        const blob = 'SecRuleEngine On\n\n\nSecRule ARGS "@rx x" "id:3001,phase:2,deny"';
        const rows = parseDirectives(blob);
        expect(rows.map((r) => r.text)).toEqual([
            'SecRuleEngine On',
            'SecRule ARGS "@rx x" "id:3001,phase:2,deny"',
        ]);
    });

    it('treats undefined/empty as no rows', () => {
        expect(parseDirectives(undefined)).toEqual([]);
        expect(parseDirectives('')).toEqual([]);
        expect(joinDirectives([])).toBeUndefined();
    });

    it('assigns stable, unique ids per row', () => {
        const rows = parseDirectives('SecRuleEngine On\nSecRule ARGS "@rx y" "id:4001,phase:2,deny"');
        const ids = new Set(rows.map((r) => r.id));
        expect(ids.size).toBe(rows.length);
    });
});

describe('countCustomRules', () => {
    it('counts non-comment directive rows', () => {
        const blob = '# header\nSecRuleEngine On\nSecRule ARGS "@rx z" "id:5001,phase:2,deny"';
        expect(countCustomRules(blob)).toBe(2);
        expect(countCustomRules(undefined)).toBe(0);
    });
});

describe('toggleExcludeId', () => {
    it('adds, removes, and collapses to undefined when empty', () => {
        expect(toggleExcludeId(undefined, '942100')).toEqual(['942100']);
        expect(toggleExcludeId(['942100'], '942110')).toEqual(['942100', '942110']);
        expect(toggleExcludeId(['942100'], '942100')).toBeUndefined();
    });
});

describe('buildGeneratedConf', () => {
    it('emits a CRS marker with tuning comments when OWASP is on', () => {
        const conf = buildGeneratedConf({
            include_owasp: true,
            paranoia_level: 2,
            inbound_anomaly_threshold: 7,
            exclude_rule_ids: ['942100'],
            directives: 'SecRule ARGS "@rx q" "id:6001,phase:2,deny"',
        });
        expect(conf).toContain('OWASP Core Rule Set');
        expect(conf).toContain('paranoia_level: 2');
        expect(conf).toContain('inbound_anomaly_threshold: 7');
        expect(conf).toContain('disabled rule ids: 942100');
        expect(conf).toContain('Include @owasp_crs/*.conf');
        expect(conf).toContain('id:6001');
    });

    it('falls back to a placeholder when nothing is configured', () => {
        expect(buildGeneratedConf({})).toBe('# (no rules yet)');
    });
});
