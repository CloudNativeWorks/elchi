/**
 * Client-side directive lint.
 *
 * The backend cannot run Coraza in-process today (no Go dependency, no
 * embedded .conf bodies). A regex-based server lint would have the same
 * depth as this file, so we stay client-only. If Coraza ever lands on the
 * backend, swap to a server call and keep the LintResult shape.
 *
 * Heuristics:
 *   - empty / pure-comment line → ok
 *   - duplicate directive ID across the set → error
 *   - SecRule without an `id:` action → warning
 *   - unknown leading keyword → info (verify spelling)
 */

import { LintDiagnostic, LintResult } from '../types';

const KNOWN_KEYWORDS = new Set([
    'SecRule',
    'SecAction',
    'Include',
    'SecRuleEngine',
    'SecAuditEngine',
    'SecAuditLog',
    'SecAuditLogParts',
    'SecAuditLogType',
    'SecAuditLogFormat',
    'SecDataDir',
    'SecTmpDir',
    'SecRequestBodyAccess',
    'SecRequestBodyLimit',
    'SecRequestBodyInMemoryLimit',
    'SecRequestBodyNoFilesLimit',
    'SecRequestBodyLimitAction',
    'SecResponseBodyAccess',
    'SecResponseBodyLimit',
    'SecResponseBodyLimitAction',
    'SecResponseBodyMimeType',
    'SecArgumentsLimit',
    'SecComponentSignature',
    'SecDebugLog',
    'SecDebugLogLevel',
    'SecDefaultAction',
    'SecMarker',
    'SecRuleRemoveByID',
    'SecRuleRemoveByTag',
    'SecRuleUpdateActionById',
    'SecRuleUpdateTargetById',
]);

const idRegex = /\bid\s*:\s*['"]?(\d+)['"]?/i;

export const lintDirectives = (lines: string[]): LintResult => {
    const diagnostics: LintDiagnostic[] = [];
    const seenIds = new Map<string, number>();

    lines.forEach((raw, line) => {
        const text = raw.trim();
        if (text === '') {
            diagnostics.push({
                line,
                severity: 'warning',
                code: 'EMPTY_LINE',
                message: 'Empty directive — remove or fill in.',
            });
            return;
        }
        if (text.startsWith('#')) return;

        const firstWord = text.split(/\s+/, 1)[0];

        if (!KNOWN_KEYWORDS.has(firstWord)) {
            diagnostics.push({
                line,
                severity: 'info',
                code: 'UNKNOWN_KEYWORD',
                message: `Unknown keyword "${firstWord}" — verify spelling.`,
            });
        }

        if (firstWord === 'SecRule' || firstWord === 'SecAction') {
            const m = text.match(idRegex);
            if (!m) {
                diagnostics.push({
                    line,
                    severity: 'warning',
                    code: 'MISSING_RULE_ID',
                    message: `${firstWord} should declare an id: action.`,
                });
            } else {
                const id = m[1];
                const previous = seenIds.get(id);
                if (previous != null) {
                    diagnostics.push({
                        line,
                        severity: 'error',
                        code: 'DUPLICATE_RULE_ID',
                        message: `Rule id ${id} already declared on line ${previous + 1}.`,
                    });
                } else {
                    seenIds.set(id, line);
                }
            }
        }
    });

    let warnings = 0;
    let errors = 0;
    diagnostics.forEach((d) => {
        if (d.severity === 'warning') warnings += 1;
        if (d.severity === 'error') errors += 1;
    });

    return {
        diagnostics,
        summary: {
            ok: lines.length - warnings - errors,
            warnings,
            errors,
        },
    };
};
