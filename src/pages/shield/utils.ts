/**
 * Shield UI helpers: UTF-8-safe base64 codecs for file content, role check,
 * and the client-side validators that mirror the backend's shield rules
 * (controller/shield/crud.go validate + collisionCheck).
 */

import Cookies from 'js-cookie';
import { DecodeToken } from '@/utils/tools';

/** Reserved auto-generated clear-marker file name — rejected by the backend. */
export const RESERVED_CLEAR_MARKER = '00-elchi-default.yaml';

/** Backend cap on a project's TOTAL inline content (3 MiB). */
export const MAX_INLINE_BUNDLE_BYTES = 3 * 1024 * 1024;

/** Encode editor text to the API's base64 content (UTF-8 safe). */
export const textToBase64 = (text: string): string =>
    btoa(unescape(encodeURIComponent(text)));

/** Decode API base64 content to editor text. Throws on invalid base64. */
export const base64ToText = (b64: string): string =>
    decodeURIComponent(escape(atob(b64)));

/** Byte length of a base64 payload without decoding it. */
export const base64ByteLength = (b64: string): number => {
    const len = b64.length;
    if (len === 0) return 0;
    let padding = 0;
    if (b64.endsWith('==')) padding = 2;
    else if (b64.endsWith('=')) padding = 1;
    return (len * 3) / 4 - padding;
};

/**
 * Best-effort "is this decodable, displayable text" check so binary uploads
 * (e.g. .mmdb feeds) render as a size summary instead of garbage in Monaco.
 */
export const tryDecodeText = (b64: string): string | null => {
    try {
        const text = base64ToText(b64);
        // Control chars (minus \n \r \t) signal binary content.
        if (/[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(text.slice(0, 4096))) return null;
        return text;
    } catch {
        return null;
    }
};

/** SHA-256 hex of a buffer via WebCrypto — used to auto-derive data-file hashes
 * on upload (the user never types a hash) and the api-key "hash my key" helper. */
export const sha256Hex = async (buffer: ArrayBuffer): Promise<string> => {
    const digest = await crypto.subtle.digest('SHA-256', buffer);
    return Array.from(new Uint8Array(digest))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
};

/** SHA-256 hex of a UTF-8 string. */
export const sha256HexOfText = async (text: string): Promise<string> =>
    sha256Hex(new TextEncoder().encode(text).buffer as ArrayBuffer);

/** Shield mutations are admin/owner-only on the backend; mirror that in the UI. */
export const isShieldAdmin = (): boolean => {
    const detail = DecodeToken(Cookies.get('bb_token'));
    return ['owner', 'admin'].includes(detail?.role);
};

// ─── Field validators (must stay in lockstep with backend crud.validate) ────

/** Safe relative path: non-empty, not absolute, no `..` escape, not reserved. */
export const validateFilePath = (value?: string): string | null => {
    const v = (value ?? '').trim();
    if (!v) return 'File path is required';
    if (v.startsWith('/')) return 'Path must be relative (it is written under the edge config directory)';
    const segments = v.split('/');
    if (segments.some(s => s === '..')) return 'Path must not contain ".." segments';
    if (segments.some(s => s === '' )) return 'Path must not contain empty segments ("//")';
    if (v === RESERVED_CLEAR_MARKER) return `"${RESERVED_CLEAR_MARKER}" is reserved (auto-generated when the policy set is empty)`;
    return null;
};

/** 64 hex chars. */
export const validateSha256 = (value?: string): string | null => {
    const v = (value ?? '').trim();
    if (!v) return null; // requiredness is contextual (download yes, inline no)
    if (!/^[0-9a-fA-F]{64}$/.test(v)) return 'SHA-256 must be exactly 64 hex characters';
    return null;
};

/** Octal permission like "0644"/"640", ≤ 0777. Empty = edge default (0600). */
export const validateMode = (value?: string): string | null => {
    const v = (value ?? '').trim();
    if (!v) return null;
    if (!/^[0-7]{3,4}$/.test(v)) return 'Mode must be an octal permission like "0644"';
    if (parseInt(v, 8) > 0o777) return 'Mode must not exceed 0777 (permission bits only)';
    return null;
};

export const validateDownloadUrl = (value?: string): string | null => {
    const v = (value ?? '').trim();
    if (!v) return 'Download URL is required for the Download source';
    if (!/^https?:\/\//.test(v)) return 'Download URL must start with http:// or https://';
    return null;
};
