/**
 * Contract test: a policy YAML produced by the backend suggestion engine
 * (POST /api/v3/inventory/suggest-policy) MUST hydrate the structured Builder
 * with no unsupported fields — otherwise the user lands in raw-YAML mode and the
 * whole "smart suggestion" UX is lost. The sample below is a verbatim capture of
 * the backend output (controller/handlers/inventory_suggest_map.go) for a mixed
 * findings set; keep it in sync if the mapping changes.
 */

import { describe, expect, it } from 'vitest';
import { modelToYaml, yamlToModel } from './policyYaml';

// Verbatim backend output (auth/rate/coraza on /login; api_key/bot/coraza/dlp on /users/{id}).
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
                path_exact: /login
                methods:
                    - POST
              policy:
                mode: block
                fail_mode: fail_close
                inspect_request_body: true
                max_request_body_bytes: 1048576
                engines:
                    jwt:
                        issuer: https://issuer.example.com/
                        audience: api
                        algorithms:
                            - RS256
                        public_key_file: /etc/elchi/elchi-shield/keys/jwt-pub.pem
                    rate_limit:
                        requests_per_second: 10
                        burst: 20
                        key: ip
                    coraza:
                        include_owasp: true
            - match:
                path_prefix: /users/
                methods:
                    - GET
              policy:
                mode: block
                fail_mode: fail_close
                inspect_request_body: true
                inspect_response_body: true
                max_request_body_bytes: 1048576
                max_response_body_bytes: 1048576
                engines:
                    api_key:
                        source: header
                        name: X-Api-Key
                    bot:
                        score_threshold: 100
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
                    coraza:
                        include_owasp: true
                checks:
                    body:
                        dlp:
                            direction: response
                            redact:
                                - email
                                - ssn
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
});
