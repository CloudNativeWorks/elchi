/**
 * Bundle adapter: maps between the wire shape (ShieldPolicy with files[]) and
 * the builder's editor state. The wire format is unchanged — the builder just
 * stops exposing it: one auto-named config file (<policy-name>.yaml, sha
 * derived by the backend, mode = edge default) plus the Data Files entries.
 */

import { ShieldFile, ShieldPolicy, ShieldPolicyRequest } from '../types';
import { DataFileModel, PolicyFileModel, newPolicyFile } from '../state/model';
import { modelToYaml, yamlToModel } from './policyYaml';
import { base64ToText, textToBase64, base64ByteLength, tryDecodeText } from '../utils';

/** A bundle file is a shield CONFIG iff it is top-level .yaml/.yml/.json. */
const isConfigFile = (path: string): boolean =>
    !path.includes('/') && /\.(ya?ml|json)$/i.test(path);

/** Policy name → config file name ("Api Public!" → "api-public.yaml"). */
export const configPathForName = (name: string): string => {
    const slug = name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9._-]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'policy';
    return `${slug}.yaml`;
};

export interface HydratedBundle {
    model: PolicyFileModel;
    dataFiles: DataFileModel[];
    yamlMode: boolean;
    rawYaml: string;
    yamlModeReason: string[];
}

/** Wire policy → editor state (best effort; falls back to YAML mode). */
export const fromApi = (policy: ShieldPolicy): HydratedBundle => {
    const files = policy.files ?? [];
    const configs = files.filter(f => isConfigFile(f.path));
    const dataFiles: DataFileModel[] = files
        .filter(f => !isConfigFile(f.path))
        .map(f => ({
            path: f.path,
            content: f.content,
            download_url: f.download_url,
            sha256: f.sha256,
            size: f.content ? base64ByteLength(f.content) : undefined,
        }));

    const fallback = (rawYaml: string, reason: string[]): HydratedBundle => ({
        model: newPolicyFile(policy.name),
        dataFiles,
        yamlMode: true,
        rawYaml,
        yamlModeReason: reason,
    });

    if (configs.length === 0) {
        // No config yet (data-only legacy bundle) — start a fresh builder doc.
        return { model: newPolicyFile(policy.name), dataFiles, yamlMode: false, rawYaml: '', yamlModeReason: [] };
    }

    if (configs.length > 1) {
        // Legacy multi-config bundle: concatenate as YAML documents and manage raw.
        const joined = configs
            .map(f => `# ── ${f.path} ──\n${f.content ? (tryDecodeText(f.content) ?? '') : ''}`)
            .join('\n---\n');
        return fallback(joined, [
            `This policy contains ${configs.length} config files (legacy bundle) — managed as raw YAML documents separated by '---'.`,
        ]);
    }

    const cfg = configs[0];
    if (cfg.download_url || !cfg.content) {
        return fallback('', [`Config file "${cfg.path}" is a download reference — it cannot be edited here.`]);
    }
    let text: string;
    try {
        text = base64ToText(cfg.content);
    } catch {
        return fallback('', [`Config file "${cfg.path}" is not valid text.`]);
    }

    const parsed = yamlToModel(text);
    if (parsed.errors.length > 0) {
        return fallback(text, parsed.errors.map(e => `Parse error: ${e}`));
    }
    if (parsed.unsupportedPaths.length > 0) {
        return fallback(text, parsed.unsupportedPaths.map(p => `Unsupported field: ${p}`));
    }
    return { model: parsed.model!, dataFiles, yamlMode: false, rawYaml: '', yamlModeReason: [] };
};

interface ToApiInput {
    name: string;
    project: string;
    model: PolicyFileModel;
    yamlMode: boolean;
    rawYaml: string;
    dataFiles: DataFileModel[];
}

/**
 * Editor state → wire request. The config file's content is the generated (or
 * raw) YAML; NO mode and NO sha256 are sent for it (backend derives the sha,
 * edge applies the secure default mode). Data files keep their upload-derived
 * or user-supplied sha.
 */
export const toApi = (input: ToApiInput): ShieldPolicyRequest => {
    const yamlText = input.yamlMode ? input.rawYaml : modelToYaml(input.model);
    const configFile: ShieldFile = {
        path: configPathForName(input.name),
        content: textToBase64(yamlText),
    };
    const dataFiles: ShieldFile[] = input.dataFiles.map(df => ({
        path: df.path,
        content: df.content,
        download_url: df.download_url,
        sha256: df.sha256,
    }));
    return { name: input.name.trim(), project: input.project, files: [configFile, ...dataFiles] };
};
