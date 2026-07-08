/**
 * Per-engine validation: flags engines that can't function, and only those.
 */

import { describe, expect, it } from 'vitest';
import { collectEngineProblems, validateEngineValue } from './validation';
import { newPolicyFile } from '../state/model';

describe('validateEngineValue', () => {
    it('flags a JWT engine with no issuer / key', () => {
        expect(validateEngineValue('jwt', {})).toEqual([
            'issuer is required',
            'a verification key is required (public key file or HMAC secret)',
        ]);
        expect(validateEngineValue('jwt', { issuer: 'x', public_key_file: '/k.pem' })).toEqual([]);
        expect(validateEngineValue('jwt', { issuer: 'x', hmac_secret: 's' })).toEqual([]);
    });

    it('flags engines missing their load-bearing field', () => {
        expect(validateEngineValue('jwks', {})).toHaveLength(1);
        expect(validateEngineValue('jwks', { url: 'https://x/jwks' })).toEqual([]);
        expect(validateEngineValue('api_key', {})).toHaveLength(1);
        expect(validateEngineValue('api_key', { keys: [{ sha256: 'a' }] })).toEqual([]);
        expect(validateEngineValue('openapi', {})).toHaveLength(1);
        expect(validateEngineValue('openapi', { spec_file: '/spec.yaml' })).toEqual([]);
        expect(validateEngineValue('rate_limit', { requests_per_second: 0 })).toHaveLength(1);
        expect(validateEngineValue('rate_limit', { requests_per_second: 50 })).toEqual([]);
        expect(validateEngineValue('coraza', {})).toHaveLength(1);
        expect(validateEngineValue('coraza', { include_owasp: true })).toEqual([]);
        // exclude_rule_ids must be numeric ids/ranges (the backend rejects otherwise).
        expect(validateEngineValue('coraza', { include_owasp: true, exclude_rule_ids: ['942100', '941000-941999'] })).toEqual([]);
        expect(validateEngineValue('coraza', { include_owasp: true, exclude_rule_ids: ['SecRuleEngine Off'] })).toHaveLength(1);
        expect(validateEngineValue('dlp', {})).toHaveLength(1);
        expect(validateEngineValue('dlp', { redact: ['email'] })).toEqual([]);
        expect(validateEngineValue('ip_reputation', {})).toHaveLength(1);
        expect(validateEngineValue('ip_reputation', { deny_cidrs: ['1.2.3.0/24'] })).toEqual([]);
    });

    it('is lenient where no field is load-bearing', () => {
        expect(validateEngineValue('bot', {})).toEqual([]);
        expect(validateEngineValue('graphql', {})).toEqual([]);
    });
});

describe('collectEngineProblems', () => {
    it('locates problems across defaults / domains / routes', () => {
        const m = newPolicyFile('t');
        m.spec.defaults = { mode: 'block', engines: { jwt: { audience: 'a' } } };
        m.spec.domains = [{
            hosts: ['api.example.com'],
            routes: [{ match: { path_prefix: '/v1/' }, policy: { engines: { openapi: {} } } }],
        }];
        const problems = collectEngineProblems(m);
        expect(problems.some(p => p.startsWith('Defaults · JWT:'))).toBe(true);
        expect(problems.some(p => p.includes('api.example.com /v1/ · OpenAPI Validation:'))).toBe(true);
    });

    it('returns nothing for a fully-configured policy', () => {
        const m = newPolicyFile('t');
        m.spec.domains = [{
            hosts: ['x'],
            routes: [{ match: { path_prefix: '/' }, policy: { engines: { jwt: { issuer: 'i', hmac_secret: 's' } } } }],
        }];
        expect(collectEngineProblems(m)).toEqual([]);
    });

    it('flags a host defined in more than one domain (Shield rejects duplicates)', () => {
        const m = newPolicyFile('t');
        m.spec.domains = [
            { hosts: ['*'], routes: [{ match: { path_prefix: '/' }, policy: {} }] },
            { hosts: ['API.example.com', '*'], routes: [{ match: { path_prefix: '/' }, policy: {} }] },
        ];
        const problems = collectEngineProblems(m);
        expect(problems.some(p => p.includes('"*"') && p.includes('already defined'))).toBe(true);
    });
});
