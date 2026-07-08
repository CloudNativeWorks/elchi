import { describe, expect, it } from 'vitest';
import { PolicyFileModel } from '../state/model';
import { ShieldPolicy } from '../types';
import { PolicyEntry, findHostConflicts, mergeProject, parsePolicyForResolution, resolveProject } from './resolveProject';

const b64 = (s: string): string => Buffer.from(s, 'utf-8').toString('base64');
const mkPolicy = (name: string, files: { path: string; content?: string }[]): ShieldPolicy => ({
    id: name, name, project: 'p', files, version: 1, created_at: '', updated_at: '',
});

const mk = (id: string, name: string, spec: PolicyFileModel['spec']): PolicyEntry => ({
    id, name, configPath: `${name}.yaml`,
    model: { apiVersion: 'sentinel.elchi.io/v1', kind: 'SecurityPolicy', metadata: { name }, spec },
});

describe('resolveProject', () => {
    const wildcard = mk('1', 'catch-all', {
        defaults: { mode: 'detect' },
        domains: [{ hosts: ['*'], routes: [{ match: { path_prefix: '/' }, policy: {} }] }],
    });
    const specific = mk('2', 'api', {
        domains: [{ hosts: ['api.example.com'], routes: [{ match: { path_prefix: '/' }, policy: { mode: 'block' } }] }],
    });

    it('the exact host beats the "*" catch-all across separate policies', () => {
        const merged = mergeProject([wildcard, specific]);
        const hit = resolveProject(merged, { host: 'api.example.com', method: 'GET', path: '/x' });
        expect(hit.policy?.name).toBe('api');
        expect(hit.domain?.matchedEntry).toBe('api.example.com');
        expect(hit.mode).toBe('block');
    });

    it('an unrelated host falls to the "*" policy', () => {
        const merged = mergeProject([wildcard, specific]);
        const hit = resolveProject(merged, { host: 'other.example.com', method: 'GET', path: '/x' });
        expect(hit.policy?.name).toBe('catch-all');
        expect(hit.domain?.matchedEntry).toBe('*');
    });

    it('precedence is by specificity, not creation/merge order', () => {
        // Reverse the input order — same winner.
        const merged = mergeProject([specific, wildcard]);
        const hit = resolveProject(merged, { host: 'api.example.com', method: 'GET', path: '/x' });
        expect(hit.policy?.name).toBe('api');
    });

    it('reports the source policy index within its own policy', () => {
        const merged = mergeProject([wildcard, specific]);
        const hit = resolveProject(merged, { host: 'api.example.com', method: 'GET', path: '/x' });
        expect(hit.domain?.index).toBe(0); // first (only) domain of the "api" policy
    });
});

describe('findHostConflicts', () => {
    it('flags the same host defined in two policies', () => {
        const a = mk('1', 'a', { domains: [{ hosts: ['*'], routes: [] }] });
        const b = mk('2', 'b', { domains: [{ hosts: ['*', 'API.example.com'], routes: [] }] });
        const c = mk('3', 'c', { domains: [{ hosts: ['api.example.com'], routes: [] }] });
        const conflicts = findHostConflicts([a, b, c]);
        // "*" is in a+b; "api.example.com" (case-insensitive) is in b+c.
        expect(conflicts.map(x => x.host).sort()).toEqual(['*', 'api.example.com']);
        expect(conflicts.find(x => x.host === '*')?.where.map(w => w.policyName).sort()).toEqual(['a', 'b']);
    });

    it('returns nothing when every host is unique', () => {
        const a = mk('1', 'a', { domains: [{ hosts: ['*'], routes: [] }] });
        const b = mk('2', 'b', { domains: [{ hosts: ['api.example.com'], routes: [] }] });
        expect(findHostConflicts([a, b])).toEqual([]);
    });

    it('case-insensitive, but does NOT strip a trailing dot (matches the edge dedup)', () => {
        const a = mk('1', 'a', { domains: [{ hosts: ['API.example.com'], routes: [] }] });
        const b = mk('2', 'b', { domains: [{ hosts: ['api.example.com.'], routes: [] }] }); // trailing dot ⇒ distinct
        expect(findHostConflicts([a, b])).toEqual([]);
    });
});

describe('parsePolicyForResolution', () => {
    const YAML = `apiVersion: sentinel.elchi.io/v1
kind: SecurityPolicy
metadata: { name: api }
spec:
  domains:
    - hosts: ["api.example.com"]
      routes: [{ match: { path_prefix: "/" }, policy: { mode: block } }]`;

    it('parses hosts straight from raw YAML (works even when the builder cannot)', () => {
        const { entry, error } = parsePolicyForResolution(mkPolicy('api', [{ path: 'api.yaml', content: b64(YAML) }]));
        expect(error).toBeUndefined();
        expect(entry?.model.spec.domains?.[0].hosts).toEqual(['api.example.com']);
        expect(entry?.configPath).toBe('api.yaml');
    });

    it('reports an error for invalid YAML (surfaced, not silently dropped)', () => {
        const { entry, error } = parsePolicyForResolution(mkPolicy('bad', [{ path: 'bad.yaml', content: b64('spec: [oops: :') }]));
        expect(entry).toBeUndefined();
        expect(error).toMatch(/not valid YAML/);
    });

    it('a data-only bundle (no config file) yields an empty, error-free entry', () => {
        const { entry, error } = parsePolicyForResolution(mkPolicy('data', [{ path: 'feeds/deny.txt', content: b64('1.2.3.0/24') }]));
        expect(error).toBeUndefined();
        expect(entry?.model.spec.domains).toEqual([]);
    });

    it('a download-reference config (no content) is reported, not skipped silently', () => {
        const { entry, error } = parsePolicyForResolution(mkPolicy('ref', [{ path: 'ref.yaml' }]));
        expect(entry).toBeUndefined();
        expect(error).toMatch(/download reference/);
    });
});
