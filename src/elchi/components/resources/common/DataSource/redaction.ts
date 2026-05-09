/**
 * Sentinel values returned by the backend for redacted secret fields.
 *
 * - `inline_string` (proto string) is replaced with the literal `***REDACTED***`.
 * - `inline_bytes` (proto bytes, base64-encoded over JSON) is replaced with
 *   `KioqUkVEQUNURUQqKio=`, which is base64('***REDACTED***').
 *
 * The PUT path on the backend is sentinel-aware: if it sees one of these in
 * a field that is otherwise unchanged, it re-injects the original stored
 * value before validation. The frontend's responsibility is twofold:
 *   1. Don't strip these from the body (they MUST flow back unchanged for
 *      the preserve-on-no-op contract to work).
 *   2. Don't render them as if they were the user's value (they're not —
 *      they're a placeholder marker).
 */

export const REDACTION_SENTINEL = '***REDACTED***';
export const REDACTION_SENTINEL_BASE64 = 'KioqUkVEQUNURUQqKio='; // base64('***REDACTED***')

export type RedactionField = 'inline_string' | 'inline_bytes';

/**
 * True when the value is one of the two redaction sentinels. Tolerant of
 * `undefined`/`null`/non-strings — returns false in those cases so callers
 * can pass arbitrary redux subtree slices without pre-checking.
 */
export const isRedactedValue = (v: unknown): boolean =>
    typeof v === 'string' && (v === REDACTION_SENTINEL || v === REDACTION_SENTINEL_BASE64);

/** Sentinel literal that should round-trip on save for the given specifier. */
export const sentinelFor = (field: RedactionField): string =>
    field === 'inline_bytes' ? REDACTION_SENTINEL_BASE64 : REDACTION_SENTINEL;
