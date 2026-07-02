// @vitest-environment jsdom
/**
 * Contract test: a policy YAML produced by the backend suggestion engine
 * (POST /api/v3/inventory/suggest-policy) MUST hydrate the structured Builder
 * with no unsupported fields — otherwise the user lands in raw-YAML mode and the
 * whole "smart suggestion" UX is lost. The sample below is a verbatim capture of
 * the backend output (controller/handlers/inventory_suggest_map.go) covering every
 * engine the mapper emits (jwt/api_key/xfcc/bot/ip_reputation/coraza/dlp/rate_limit)
 * plus the case-insensitive, trailing-slash-tolerant path_regex; keep it in sync if
 * the mapping changes.
 */

import { describe, expect, it } from 'vitest';
import { modelToYaml, yamlToModel } from './policyYaml';
import { mergeDiscoveryIntoModel } from './suggestPolicy';
import type { PolicyFileModel } from '../state/model';

// Verbatim backend output — maximal engine coverage.
const SAMPLE = `apiVersion: sentinel.elchi.io/v1
kind: SecurityPolicy
metadata:
    name: discovery-api.example.com
spec:
    defaults:
        mode: detect
        fail_mode: fail_open
    domains:
        - hosts:
            - api.example.com
          routes:
            - match:
                path_regex: (?i)^/users/[^/]+/?$
              policy:
                mode: block
                fail_mode: fail_close
                inspect_request_body: true
                inspect_response_body: true
                max_request_body_bytes: 1048576
                max_response_body_bytes: 1048576
                engines:
                    jwt:
                        issuer: https://issuer.example.com/
                        audience: api
                        algorithms:
                            - HS256
                        hmac_secret: CHANGE_ME__set_a_real_HS256_secret_or_switch_to_public_key_file_or_jwks
                    bot:
                        score_threshold: 50
                        user_agent:
                            deny_substrings:
                                - sqlmap
                                - nikto
                                - masscan
                                - nuclei
                            block_empty: true
                        heuristics:
                            require_accept: true
                            require_accept_language: true
                            score_per_anomaly: 25
                    ip_reputation:
                        deny_cidrs:
                            - 192.0.2.0/24
                    coraza:
                        include_owasp: true
                checks:
                    body:
                        dlp:
                            direction: both
                            block:
                                - private_key
                                - aws_access_key
                                - google_api_key
                                - slack_token
                                - github_token
                            redact:
                                - email
                                - ssn
            - match:
                path_regex: (?i)^/pay/?$
              policy:
                mode: block
                fail_mode: fail_close
                inspect_request_body: true
                max_request_body_bytes: 1048576
                engines:
                    api_key:
                        source: header
                        name: X-Api-Key
                        keys:
                            - sha256: "0000000000000000000000000000000000000000000000000000000000000000"
                              subject: placeholder-replace-me
                    rate_limit:
                        requests_per_second: 10
                        burst: 20
                        key: ip
                    coraza:
                        include_owasp: true
            - match:
                path_regex: (?i)^/mtls/?$
              policy:
                mode: block
                fail_mode: fail_close
                inspect_request_body: true
                max_request_body_bytes: 1048576
                engines:
                    xfcc:
                        require_present: true
                    coraza:
                        include_owasp: true
`;


describe('suggested policy hydrates the Builder', () => {
    it('parses with no errors and no unsupported fields', () => {
        const parsed = yamlToModel(SAMPLE);
        expect(parsed.errors).toEqual([]);
        expect(parsed.unsupportedPaths).toEqual([]);
        expect(parsed.model).toBeDefined();
    });

    it('round-trips: re-serialised YAML re-parses to an equivalent model', () => {
        const first = yamlToModel(SAMPLE);
        const regen = modelToYaml(first.model!);
        const second = yamlToModel(regen);
        expect(second.errors).toEqual([]);
        expect(second.unsupportedPaths).toEqual([]);
        expect(modelToYaml(second.model!)).toEqual(regen);
    });

    // The SAVE payload is modelToYaml(model) (via toApi). A field the Builder can
    // parse but modelToYaml silently drops would be lost on save WITHOUT the pure
    // round-trip test above catching it (both sides would just lack the field).
    // Assert every field the suggestion emits actually survives serialization —
    // especially falsy-but-meaningful values (block_empty, require_present) that
    // are classic prune() casualties.
    it('save serialization (modelToYaml) preserves every emitted field', () => {
        const saved = modelToYaml(yamlToModel(SAMPLE).model!);
        for (const token of [
            'path_regex', '(?i)^/users/[^/]+/?$', '(?i)^/pay/?$',
            'hmac_secret', 'HS256',
            'api_key', 'sha256', 'subject',
            'xfcc', 'require_present',
            'bot', 'block_empty', 'deny_substrings', 'score_per_anomaly',
            'ip_reputation', 'deny_cidrs', '192.0.2.0/24',
            'coraza', 'include_owasp',
            'checks', 'dlp', 'direction', 'redact', 'block', 'private_key',
            'inspect_response_body',
        ]) {
            expect(saved, `dropped on save: ${token}`).toContain(token);
        }
    });
});

describe('mergeDiscoveryIntoModel', () => {
    const suggested = yamlToModel(SAMPLE).model!;

    it('merges into an existing domain whose host differs only in CASE (shield matches hosts case-insensitively)', () => {
        const existing: PolicyFileModel = {
            apiVersion: 'sentinel.elchi.io/v1',
            kind: 'SecurityPolicy',
            metadata: { name: 'existing' },
            spec: {
                defaults: { mode: 'block' },
                exclude: ['/healthz'],
                domains: [{ hosts: ['API.Example.com'], routes: [{ match: { path_prefix: '/existing' }, policy: { mode: 'block' } }] }],
            },
        };
        const merged = mergeDiscoveryIntoModel(existing, suggested);
        // One domain (not two), and it keeps the existing route + gains the suggested ones.
        expect(merged.spec.domains).toHaveLength(1);
        expect(merged.spec.domains![0].routes!.length).toBeGreaterThan(1);
        // Original untouched (deep clone), defaults/exclude preserved.
        expect(existing.spec.domains![0].routes).toHaveLength(1);
        expect(merged.spec.exclude).toEqual(['/healthz']);
        expect(merged.spec.defaults).toEqual({ mode: 'block' });
    });

    it('adds a new domain when the host does not exist, leaving others intact', () => {
        const existing: PolicyFileModel = {
            apiVersion: 'sentinel.elchi.io/v1', kind: 'SecurityPolicy', metadata: { name: 'e' },
            spec: { domains: [{ hosts: ['other.com'], routes: [] }] },
        };
        const merged = mergeDiscoveryIntoModel(existing, suggested);
        expect(merged.spec.domains).toHaveLength(2);
    });
});
