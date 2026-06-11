/**
 * Round-trip and schema-walk tests for the shield policy YAML codec — the
 * load-bearing guarantee behind the Builder↔YAML two-way sync: every template
 * must hydrate the builder without falling back to YAML mode, and the
 * generated YAML must re-parse to the same model.
 */

import { describe, expect, it } from 'vitest';
import { modelToYaml, yamlToModel } from './policyYaml';
import { EXAMPLES } from '../components/ShieldExamplesDrawer';
import { ENGINE_DEFS } from '../engines/registry';
import { ensureModelUids, newPolicyFile } from '../state/model';
import { configPathForName } from './bundleAdapter';

describe('yamlToModel / modelToYaml round-trip', () => {
    for (const ex of EXAMPLES) {
        it(`template "${ex.key}" hydrates the builder (no YAML-mode fallback)`, () => {
            const parsed = yamlToModel(ex.content);
            expect(parsed.errors).toEqual([]);
            expect(parsed.unsupportedPaths).toEqual([]);
            expect(parsed.model).toBeDefined();

            // Generated YAML must re-parse to a clean, equivalent model. Compare
            // the serialized form (which strips client-only `_uid` keys) so the
            // equality is independent of per-parse uid assignment.
            const regenerated = modelToYaml(parsed.model!);
            const second = yamlToModel(regenerated);
            expect(second.errors).toEqual([]);
            expect(second.unsupportedPaths).toEqual([]);
            expect(modelToYaml(second.model!)).toEqual(regenerated);
        });
    }

    it('never leaks client-only _uid keys to the serialized YAML', () => {
        const model = newPolicyFile('t');
        model.spec.domains = [{ hosts: ['a.example.com'], routes: [{ match: { path_prefix: '/' }, policy: {} }] }];
        const withUids = ensureModelUids(model);
        expect(withUids.spec.domains![0]._uid).toBeDefined();
        expect(withUids.spec.domains![0].routes![0]._uid).toBeDefined();
        expect(modelToYaml(withUids)).not.toContain('_uid');
    });

    it('reports unknown keys with their paths', () => {
        const parsed = yamlToModel(`
apiVersion: sentinel.elchi.io/v1
kind: SecurityPolicy
spec:
  defaults:
    mode: block
    totally_unknown: 1
  domains:
    - hosts: ["a.example.com"]
      routes:
        - match: { path_prefix: "/" }
          policy:
            engines:
              jwt: { issuer: "x", bogus_field: true }
`);
        expect(parsed.errors).toEqual([]);
        expect(parsed.unsupportedPaths).toContain('spec.defaults.totally_unknown');
        expect(parsed.unsupportedPaths.some(p => p.includes('bogus_field'))).toBe(true);
    });

    it('flags invalid known-enum values (mode / fail_mode / dlp direction)', () => {
        const parsed = yamlToModel(`
apiVersion: sentinel.elchi.io/v1
kind: SecurityPolicy
spec:
  defaults:
    mode: block
    fail_mode: fail_opent
  domains:
    - hosts: ["a.example.com"]
      routes:
        - match: { path_prefix: "/" }
          policy:
            mode: blockk
            checks:
              body:
                dlp: { direction: sideways, redact: ["email"] }
`);
        expect(parsed.errors).toEqual([]);
        expect(parsed.invalidValues.some(v => v.includes('fail_mode') && v.includes('fail_opent'))).toBe(true);
        expect(parsed.invalidValues.some(v => v.includes('blockk'))).toBe(true);
        expect(parsed.invalidValues.some(v => v.includes('direction') && v.includes('sideways'))).toBe(true);
    });

    it('accepts every valid enum value', () => {
        const parsed = yamlToModel(`
apiVersion: sentinel.elchi.io/v1
kind: SecurityPolicy
spec:
  defaults: { mode: detect, fail_mode: fail_close }
  domains:
    - hosts: ["a.example.com"]
      routes:
        - match: { path_prefix: "/" }
          policy: { mode: shadow }
`);
        expect(parsed.invalidValues).toEqual([]);
    });

    it('projects unknown keys OUT of the model (Back-to-Builder truly drops them)', () => {
        const parsed = yamlToModel(`
apiVersion: sentinel.elchi.io/v1
kind: SecurityPolicy
spec:
  defaults:
    mode: block
    totally_unknown: 1
  domains:
    - hosts: ["a.example.com"]
      routes:
        - match: { path_prefix: "/" }
          policy:
            engines:
              jwt: { issuer: "x", bogus_field: true }
`);
        // The unknown keys are reported…
        expect(parsed.unsupportedPaths).toContain('spec.defaults.totally_unknown');
        // …and NOT present in the model, so re-serializing can't leak them back.
        const out = modelToYaml(parsed.model!);
        expect(out).not.toContain('totally_unknown');
        expect(out).not.toContain('bogus_field');
        // Known siblings survive.
        expect(out).toContain('issuer');
        expect(out).toContain('mode: block');
    });

    it('reports YAML syntax errors without producing a model', () => {
        const parsed = yamlToModel('spec: : :\n  - ][');
        expect(parsed.errors.length).toBeGreaterThan(0);
        expect(parsed.model).toBeUndefined();
    });
});

describe('engine registry get/set', () => {
    it('every engine sets and clears its slot immutably', () => {
        for (const def of ENGINE_DEFS) {
            const empty = {};
            const withEngine = def.set(empty, { some: 'value' } as object);
            expect(def.get(withEngine)).toEqual({ some: 'value' });
            expect(def.get(empty)).toBeUndefined(); // original untouched
            const cleared = def.set(withEngine, undefined);
            expect(def.get(cleared)).toBeUndefined();
        }
    });

    it('DLP serializes under checks.body.dlp (not engines)', () => {
        const dlp = ENGINE_DEFS.find(d => d.key === 'dlp')!;
        const p = dlp.set({}, { redact: ['credit_card'] });
        expect(p.checks?.body?.dlp).toEqual({ redact: ['credit_card'] });
        expect(p.engines).toBeUndefined();

        // …and round-trips through YAML cleanly.
        const model = newPolicyFile('t');
        model.spec.defaults = p;
        const reparsed = yamlToModel(modelToYaml(model));
        expect(reparsed.unsupportedPaths).toEqual([]);
        expect(reparsed.model!.spec.defaults?.checks?.body?.dlp).toEqual({ redact: ['credit_card'] });
    });
});

describe('configPathForName', () => {
    it('slugifies policy names into safe file names', () => {
        expect(configPathForName('api-public')).toBe('api-public.yaml');
        expect(configPathForName('  My API Policy! ')).toBe('my-api-policy.yaml');
        expect(configPathForName('***')).toBe('policy.yaml');
    });
});
