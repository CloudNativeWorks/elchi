/**
 * Model ↔ YAML codec for shield SecurityPolicy documents.
 *
 * The builder state IS the (typed) YAML object, so serialization is a pruned
 * yaml.dump and parsing is yaml.load plus a schema walk that reports any key
 * the builder doesn't model (`unsupportedPaths`). shield itself strict-decodes
 * unknown fields into config errors, so unsupported paths are almost always
 * typos or version skew — the caller switches the policy into YAML mode and
 * shows them.
 */

import yaml from 'js-yaml';
import { PolicyFileModel, POLICY_FILE_SCHEMA, SchemaNode, SHIELD_API_VERSION, SHIELD_KIND } from '../state/model';

/** Recursively drop undefined/null, empty strings, empty arrays/objects. */
const prune = (value: unknown): unknown => {
    if (Array.isArray(value)) {
        const arr = value.map(prune).filter(v => v !== undefined);
        return arr.length ? arr : undefined;
    }
    if (value !== null && typeof value === 'object') {
        const out: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
            const pv = prune(v);
            if (pv !== undefined) out[k] = pv;
        }
        return Object.keys(out).length ? out : undefined;
    }
    if (value === undefined || value === null || value === '') return undefined;
    return value;
};

/** Serialize the model to clean YAML (defaults/empties omitted). */
export const modelToYaml = (model: PolicyFileModel): string => {
    const pruned = (prune(model) ?? {}) as Record<string, unknown>;
    // apiVersion/kind must always be present even if something pruned them.
    pruned.apiVersion = model.apiVersion || SHIELD_API_VERSION;
    pruned.kind = model.kind || SHIELD_KIND;
    return yaml.dump(pruned, {
        lineWidth: 120,
        noRefs: true,
        noCompatMode: true,
        quotingType: '"',
        sortKeys: false,
    });
};

/** Walk obj against the schema, collecting unknown-key paths. */
const walk = (node: SchemaNode, obj: unknown, path: string, out: string[]): void => {
    if (node === true || node === '*') return; // leaf / free-form map
    if (obj === null || obj === undefined) return;

    if (Array.isArray(node)) {
        if (!Array.isArray(obj)) {
            out.push(`${path} (expected a list)`);
            return;
        }
        obj.forEach((item, i) => walk(node[0], item, `${path}[${i}]`, out));
        return;
    }

    // node is an object schema
    if (typeof obj !== 'object' || Array.isArray(obj)) {
        out.push(`${path} (expected a mapping)`);
        return;
    }
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
        const child = (node as Record<string, SchemaNode>)[k];
        if (child === undefined) {
            out.push(path ? `${path}.${k}` : k);
            continue;
        }
        walk(child, v, path ? `${path}.${k}` : k, out);
    }
};

export interface ParseResult {
    model?: PolicyFileModel;
    /** YAML syntax / shape errors — nothing usable was produced. */
    errors: string[];
    /** Keys the builder doesn't model (shield would strict-reject them too). */
    unsupportedPaths: string[];
}

/** Parse YAML text into the model, reporting errors and unsupported keys. */
export const yamlToModel = (text: string): ParseResult => {
    let raw: unknown;
    try {
        raw = yaml.load(text);
    } catch (e) {
        return { errors: [(e as Error).message], unsupportedPaths: [] };
    }
    if (raw === null || raw === undefined) {
        return { errors: ['Empty document'], unsupportedPaths: [] };
    }
    if (typeof raw !== 'object' || Array.isArray(raw)) {
        return { errors: ['Top level must be a mapping (apiVersion/kind/spec)'], unsupportedPaths: [] };
    }

    const unsupported: string[] = [];
    walk(POLICY_FILE_SCHEMA, raw, '', unsupported);

    const obj = raw as Record<string, unknown>;
    const model: PolicyFileModel = {
        apiVersion: typeof obj.apiVersion === 'string' ? obj.apiVersion : SHIELD_API_VERSION,
        kind: typeof obj.kind === 'string' ? obj.kind : SHIELD_KIND,
        metadata: (obj.metadata as PolicyFileModel['metadata']) ?? {},
        spec: (obj.spec as PolicyFileModel['spec']) ?? { domains: [] },
    };

    return { model, errors: [], unsupportedPaths: unsupported };
};
