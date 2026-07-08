/**
 * The dry-run must mirror the edge resolver — these tests pin the load-bearing
 * rules (exclude bypass, most-specific host, route specificity ordering, and the
 * wholesale engine replacement).
 */

import { describe, expect, it } from 'vitest';
import { normalizeHost, normalizePath, simulateRequest } from './simulate';
import { PolicyFileModel } from '../state/model';

const model = (spec: PolicyFileModel['spec']): PolicyFileModel => ({
    apiVersion: 'sentinel.elchi.io/v1', kind: 'SecurityPolicy', metadata: { name: 't' }, spec,
});

describe('normalization', () => {
    it('normalizes host (lowercase, strip port/userinfo/trailing dot)', () => {
        expect(normalizeHost('user@API.Example.com:8443.')).toBe('api.example.com');
    });
    it('normalizes path (decode, collapse dot-segments, keep trailing slash)', () => {
        expect(normalizePath('/api/../v1/%2E%2E/users/?q=1')).toBe('/users/');
        expect(normalizePath('/v1//a/./b')).toBe('/v1/a/b');
    });
});

describe('simulateRequest', () => {
    it('bypasses excluded paths', () => {
        const r = simulateRequest(model({ exclude: ['/healthz'], domains: [{ hosts: ['*'], routes: [] }] }),
            { host: 'x', method: 'GET', path: '/healthz?probe=1' });
        expect(r.excluded).toBe('/healthz');
        expect(r.engines).toEqual([]);
    });

    it('picks the most-specific matching host (exact over wildcard over catch-all)', () => {
        const r = simulateRequest(model({
            domains: [
                { hosts: ['*'], routes: [{ match: { path_prefix: '/' }, policy: {} }] },
                { hosts: ['*.example.com'], routes: [{ match: { path_prefix: '/' }, policy: {} }] },
                { hosts: ['api.example.com'], routes: [{ match: { path_prefix: '/' }, policy: {} }] },
            ],
        }), { host: 'api.example.com', method: 'GET', path: '/' });
        expect(r.domain?.matchedEntry).toBe('api.example.com');
    });

    it('tries routes most-specific first (exact beats prefix), regardless of order', () => {
        const r = simulateRequest(model({
            domains: [{
                hosts: ['api.example.com'],
                routes: [
                    { match: { path_prefix: '/' }, policy: { mode: 'detect' } },
                    { match: { path_exact: '/login' }, policy: { mode: 'block' } },
                ],
            }],
        }), { host: 'api.example.com', method: 'POST', path: '/login' });
        expect(r.route?.label).toBe('/login');
        expect(r.mode).toBe('block');
    });

    it('replaces engines wholesale — a route with engines does NOT inherit defaults', () => {
        const r = simulateRequest(model({
            defaults: { mode: 'block', engines: { jwt: { issuer: 'i', hmac_secret: 's' } } },
            domains: [{
                hosts: ['api.example.com'],
                routes: [{ match: { path_prefix: '/pub/' }, policy: { engines: { rate_limit: { requests_per_second: 10 } } } }],
            }],
        }), { host: 'api.example.com', method: 'GET', path: '/pub/x' });
        // Route engines (rate_limit) replace the defaults' jwt entirely.
        expect(r.engines.map(e => e.key)).toEqual(['rate_limit']);
    });

    it('falls back to the domain default policy when no route matches', () => {
        const r = simulateRequest(model({
            defaults: { mode: 'block' },
            domains: [{ hosts: ['api.example.com'], policy: { mode: 'detect' }, routes: [{ match: { path_exact: '/only' }, policy: {} }] }],
        }), { host: 'api.example.com', method: 'GET', path: '/other' });
        expect(r.usedDomainDefault).toBe(true);
        expect(r.mode).toBe('detect');
    });

    it('reports no-domain-match', () => {
        const r = simulateRequest(model({ domains: [{ hosts: ['api.example.com'], routes: [] }] }),
            { host: 'other.com', method: 'GET', path: '/' });
        expect(r.noDomainMatch).toBe(true);
    });
});

describe('body inspection (auto-derive + reason)', () => {
    const userPolicy = model({
        defaults: { mode: 'block', inspect_request_body: true, inspect_response_body: true },
        domains: [
            { hosts: ['*'], routes: [{ match: { path_prefix: '/' }, policy: { engines: { coraza: { include_owasp: true } }, checks: { body: { dlp: { direction: 'response', redact: ['email'] } } } } }] },
            { hosts: ['abc.com'], routes: [{ match: { path_prefix: '/' }, policy: { engines: { rate_limit: { requests_per_second: 3 } }, mode: 'block' } }] },
        ],
    });

    it('a header-only route shows body ON, attributed to the inherited defaults flag', () => {
        const r = simulateRequest(userPolicy, { host: 'abc.com', method: 'GET', path: '/api/users' });
        expect(r.requestBody).toEqual({ on: true, reason: 'set in defaults' });
        expect(r.responseBody).toEqual({ on: true, reason: 'set in defaults' });
    });

    it('without the defaults flags, a header-only (rate_limit) route buffers NOTHING', () => {
        const noDefaults = model({ ...userPolicy.spec, defaults: { mode: 'block' } });
        const r = simulateRequest(noDefaults, { host: 'abc.com', method: 'GET', path: '/x' });
        expect(r.requestBody.on).toBe(false);
        expect(r.responseBody.on).toBe(false);
    });

    it('a body engine auto-enables inspection and is named as the reason', () => {
        const noDefaults = model({ ...userPolicy.spec, defaults: { mode: 'block' } });
        const r = simulateRequest(noDefaults, { host: 'other.com', method: 'POST', path: '/g' }); // hits *
        expect(r.requestBody).toEqual({ on: true, reason: 'required by the Coraza WAF' });
        expect(r.responseBody.on).toBe(true);
        expect(r.responseBody.reason).toMatch(/Coraza|DLP/);
    });
});
