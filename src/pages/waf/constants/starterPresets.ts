/**
 * Starter directive-set presets for the WAF detail page.
 *
 * Surfaced in two places:
 *   - `PresetPickerModal` on the create flow (one-time welcome modal)
 *   - `LoadPresetDrawer` from the sidebar (anytime, replace or add)
 *
 * Naming intent-first (Detect / Block / Utility) instead of CRS-label-first
 * (Strict / Permissive). Operational mode + paranoia level are the two
 * questions every operator asks when picking a starting point — those drive
 * the labels here.
 *
 * **Coraza-proxy-wasm v0.6.0 safety:** every directive in every preset has
 * been validated against the WASM runtime's actual capabilities. Specifically
 * we DO NOT include:
 *   - `SecArgumentsLimit` — parsed but not enforced (Coraza issue #1752)
 *   - Custom `SecAuditLogParts` strings — parts D/G/I/J are silent no-ops
 *   - File-system directives (`SecDataDir`, `SecDebugLog <path>`,
 *     `SecUploadDir`, `SecUploadKeepFiles`, `SecUploadFileMode`) — WASM
 *     filesystem is read-only
 *   - `SecCookieFormat`, `SecArgumentSeparator` — not supported by Coraza
 *
 * The blocking presets all use the **modern CRS variable name**
 * `tx.blocking_paranoia_level` (CRS 4.0+). The older `tx.paranoia_level` is
 * deprecated; we don't ship it.
 *
 * `@demo-conf` is included before `@owasp_crs/*.conf` in every CRS-loading
 * preset so request body parsing is set up — without it, most CRS rules
 * can't fire on POST/JSON/XML payloads.
 */

export type PresetCategory = 'detect' | 'block' | 'utility';
export type PresetMode = 'DetectionOnly' | 'On' | 'None';

export interface StarterPreset {
    id: string;
    name: string;
    description: string;
    /** Visual grouping in the picker. */
    category: PresetCategory;
    /** Engine mode badge. */
    mode: PresetMode;
    /** CRS paranoia level the preset targets. Omitted for utility presets. */
    paranoiaLevel?: 1 | 2 | 4;
    /** Default name of the directive set when the preset is added. */
    setName: string;
    directives: string[];
}

export const STARTER_PRESETS: StarterPreset[] = [
    // ─── Detect ──────────────────────────────────────────────────────────────
    {
        id: 'detect-only-light',
        name: 'Detect-only — light',
        description:
            'Engine in DetectionOnly mode at paranoia level 1. Logs likely attacks without blocking. Best for the first week of a new deployment while you watch what would have been blocked.',
        category: 'detect',
        mode: 'DetectionOnly',
        paranoiaLevel: 1,
        setName: 'detect-only',
        directives: [
            'SecRuleEngine DetectionOnly',
            'Include @demo-conf',
            'Include @crs-setup-conf',
            'Include @owasp_crs/*.conf',
        ],
    },
    {
        id: 'detect-everything',
        name: 'Detect-everything',
        description:
            'DetectionOnly at paranoia level 4 — every CRS rule evaluates and logs. Use this for tuning: see exactly what each rule would catch, then ship a stricter blocking config once the noise is filtered.',
        category: 'detect',
        mode: 'DetectionOnly',
        paranoiaLevel: 4,
        setName: 'detect-everything',
        directives: [
            'SecRuleEngine DetectionOnly',
            'Include @demo-conf',
            'Include @crs-setup-conf',
            'SecAction "id:900000,phase:1,nolog,pass,t:none,setvar:tx.blocking_paranoia_level=4"',
            'SecAction "id:900100,phase:1,nolog,pass,t:none,setvar:tx.detection_paranoia_level=4"',
            'Include @owasp_crs/*.conf',
        ],
    },

    // ─── Block ───────────────────────────────────────────────────────────────
    {
        id: 'block-known-threats',
        name: 'Block known threats',
        description:
            'Engine On at the default paranoia level (1). Only high-confidence rules block. Conservative starting point for production traffic where false positives are unacceptable.',
        category: 'block',
        mode: 'On',
        paranoiaLevel: 1,
        setName: 'block-known',
        directives: [
            'SecRuleEngine On',
            'Include @demo-conf',
            'Include @crs-setup-conf',
            'Include @owasp_crs/*.conf',
        ],
    },
    {
        id: 'balanced',
        name: 'Balanced',
        description:
            'Engine On at paranoia level 2. Common attacks plus some heuristic checks. A reasonable middle ground for most production apps after a tuning pass.',
        category: 'block',
        mode: 'On',
        paranoiaLevel: 2,
        setName: 'balanced',
        directives: [
            'SecRuleEngine On',
            'Include @demo-conf',
            'Include @crs-setup-conf',
            'SecAction "id:900000,phase:1,nolog,pass,t:none,setvar:tx.blocking_paranoia_level=2"',
            'Include @owasp_crs/*.conf',
        ],
    },
    {
        id: 'strict',
        name: 'Strict — block everything',
        description:
            'Engine On at paranoia level 4 with anomaly thresholds tightened (inbound 3, outbound 2). Most aggressive blocking. Expect false positives — only suitable for hardened apps with a tuning budget.',
        category: 'block',
        mode: 'On',
        paranoiaLevel: 4,
        setName: 'strict',
        directives: [
            'SecRuleEngine On',
            'Include @demo-conf',
            'Include @crs-setup-conf',
            'SecAction "id:900000,phase:1,nolog,pass,t:none,setvar:tx.blocking_paranoia_level=4"',
            'SecAction "id:900110,phase:1,nolog,pass,t:none,setvar:tx.inbound_anomaly_score_threshold=3,setvar:tx.outbound_anomaly_score_threshold=2"',
            'Include @owasp_crs/*.conf',
        ],
    },

    // ─── Utility ─────────────────────────────────────────────────────────────
    {
        id: 'minimal',
        name: 'Minimal',
        description:
            'Engine On with no CRS rules. A blank slate to write your own SecRules from scratch without inheriting anything from OWASP CRS.',
        category: 'utility',
        mode: 'On',
        setName: 'minimal',
        directives: ['SecRuleEngine On'],
    },
    {
        id: 'blank',
        name: 'Blank',
        description: 'Empty directive set. Start completely from scratch.',
        category: 'utility',
        mode: 'None',
        setName: 'blank',
        directives: [],
    },
];
