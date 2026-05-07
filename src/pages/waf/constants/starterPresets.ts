/**
 * Hard-coded starter presets shown in the create flow.
 *
 * BE plan §3.4 contemplated a `/api/v3/waf/presets` endpoint, but for v1 the
 * marginal value of moving these server-side is low (presets are static,
 * curated, and read-only). Keep here unless we need per-project presets.
 */

export interface StarterPreset {
    id: string;
    name: string;
    description: string;
    setName: string;
    directives: string[];
}

export const STARTER_PRESETS: StarterPreset[] = [
    {
        id: 'owasp-crs-strict',
        name: 'OWASP CRS — Strict',
        description: 'Paranoia 4, low anomaly threshold, blocks aggressively. Best for hardened apps.',
        setName: 'strict',
        directives: [
            'SecRuleEngine On',
            'Include @crs-setup-conf',
            'SecAction "id:900110,phase:1,nolog,pass,t:none,setvar:tx.inbound_anomaly_score_threshold=3"',
            'SecAction "id:900000,phase:1,nolog,pass,t:none,setvar:tx.paranoia_level=4"',
            'Include @owasp_crs/*.conf',
        ],
    },
    {
        id: 'owasp-crs-permissive',
        name: 'OWASP CRS — Permissive',
        description: 'Paranoia 1, anomaly threshold 10. High-confidence detections only.',
        setName: 'permissive',
        directives: [
            'SecRuleEngine On',
            'Include @crs-setup-conf',
            'SecAction "id:900110,phase:1,nolog,pass,t:none,setvar:tx.inbound_anomaly_score_threshold=10"',
            'SecAction "id:900000,phase:1,nolog,pass,t:none,setvar:tx.paranoia_level=1"',
            'Include @owasp_crs/*.conf',
        ],
    },
    {
        id: 'detection-only',
        name: 'Detection Only',
        description: 'Audit/log mode — identifies threats without blocking. Great for staging.',
        setName: 'detection',
        directives: [
            'SecRuleEngine DetectionOnly',
            'Include @crs-setup-conf',
            'Include @owasp_crs/*.conf',
        ],
    },
    {
        id: 'minimal',
        name: 'Minimal',
        description: 'Engine on, no rule includes. Starting point for fully custom setups.',
        setName: 'default',
        directives: ['SecRuleEngine On'],
    },
    {
        id: 'blank',
        name: 'Blank',
        description: 'Start from scratch with an empty default set.',
        setName: 'default',
        directives: [],
    },
];
