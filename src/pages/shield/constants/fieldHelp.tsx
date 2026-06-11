/**
 * Single source of truth for the shield policy form's field documentation and
 * client-side protections: every field gets a label, a "what does this do"
 * tooltip, an allowed-values hint (extra), a placeholder, and antd rules that
 * mirror the backend's validation (controller/shield/crud.go) exactly — so the
 * operator learns the constraint inline instead of via a 400 round-trip.
 */

import type { Rule } from 'antd/es/form';
import {
    validateFilePath,
    validateSha256,
    validateMode,
    validateDownloadUrl,
    RESERVED_CLEAR_MARKER,
} from '../utils';

export interface FieldHelp {
    label: string;
    tooltip: string;
    extra?: string;
    placeholder?: string;
    rules: Rule[];
}

/** Wrap a string-returning validator into an antd rule. */
const ruleOf = (fn: (value?: string) => string | null): Rule => ({
    validator: (_, value) => {
        const msg = fn(value);
        return msg ? Promise.reject(new Error(msg)) : Promise.resolve();
    },
});

// Offered via AutoComplete: pick a preset or type any octal (e.g. 0700).
// Leaving the field empty = the edge's secure default (0600).
export const MODE_PRESETS = [
    { value: '0600', label: '0600 — owner rw (default)' },
    { value: '0640', label: '0640 — owner rw, group r' },
    { value: '0644', label: '0644 — owner rw, world r' },
    { value: '0755', label: '0755 — executable' },
];

export const shieldFieldHelp: Record<string, FieldHelp> = {
    name: {
        label: 'Policy Name',
        tooltip:
            'Unique name of this policy within the project. All of a project\'s policies are MERGED into one config bundle and synced to every connected edge.',
        extra: 'Unique per project (duplicate names are rejected with 409).',
        placeholder: 'api-public-protection',
        rules: [{ required: true, whitespace: true, message: 'Policy name is required' }],
    },

    path: {
        label: 'File Path',
        tooltip:
            'Relative path the file is written to under the edge\'s shield config directory (/etc/elchi/elchi-shield). Top-level .yaml/.json files are shield CONFIGS (hot-reloaded); files in subdirectories are DATA files (e.g. IP feeds) referenced by configs.',
        extra: `Examples: "api-public.yaml", "feeds/blocklist.json". Must be relative, no "..", unique across ALL of the project's policies. "${RESERVED_CLEAR_MARKER}" is reserved.`,
        placeholder: 'api-public.yaml',
        rules: [ruleOf(validateFilePath)],
    },

    source: {
        label: 'Content Source',
        tooltip:
            'Inline: the content is stored with the policy and shipped in the deploy (good for configs, max 3 MiB total per project). Download URL: the edge downloads the file itself and verifies it against the SHA-256 (use for large artifacts like GeoIP/feed databases — up to 512 MiB, 2 min fetch budget).',
        rules: [],
    },

    content: {
        label: 'Content',
        tooltip:
            'The shield config (YAML/JSON) or data file content the edge will load. Top-level configs are validated on the edge with the real shield binary BEFORE going live — a bad config is rejected with a precise file:field error and never touches live traffic.',
        extra: 'Total inline content across the project\'s policies must stay under 3 MiB; switch large files to a Download URL.',
        rules: [],
    },

    download_url: {
        label: 'Download URL',
        tooltip:
            'The edge agent fetches the file from this URL during deploy (bounded: 2 minutes, 512 MiB) and verifies the SHA-256 before activating it.',
        extra: 'Must start with http:// or https://. SHA-256 is REQUIRED for downloads.',
        placeholder: 'https://artifacts.example.com/feeds/GeoLite2.mmdb',
        rules: [ruleOf(validateDownloadUrl)],
    },

    sha256: {
        label: 'SHA-256',
        tooltip:
            'Integrity check of the file content. Required for downloads (the fetch is rejected on mismatch). Optional for inline content — the backend derives it automatically.',
        extra: 'Exactly 64 hex characters, e.g. e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        placeholder: '64 hex characters',
        rules: [ruleOf(validateSha256)],
    },

    mode: {
        label: 'File Mode',
        tooltip:
            'Unix permission the file gets on the edge. Leave empty for the secure default (0600, owner-only). Configs rarely need anything else; use 0644 only if other local processes must read the file.',
        extra: 'Octal up to 0777, e.g. 0644. Empty = 0600 default.',
        placeholder: '0600',
        rules: [ruleOf(validateMode)],
    },
};

/** Page-level explainer shown at the top of the policy editor. */
export const SHIELD_POLICY_INFO =
    'Shield policies define the config files of the elchi-shield API-security sidecar on each edge. ' +
    'All policies of a project are merged into ONE bundle (file paths must be unique across them) and ' +
    'synced to every connected edge automatically on save — the deploy runs as a background job whose ' +
    'per-edge result (applied version, reload confirmation, precise config errors) you can follow from the Jobs page. ' +
    'Edges that are offline catch up automatically when they reconnect. Deleting the last policy pushes an ' +
    'explicit "inspection off" config (a true clear).';
