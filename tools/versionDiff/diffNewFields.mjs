#!/usr/bin/env node
/**
 * diffNewFields.mjs — Standalone version-diff coverage report.
 *
 * Compares the auto-generated TAG bundles of two Envoy versions and lists every
 * field that is NEW in the target version, classifying each one by whether the
 * UI can actually render an editor for it:
 *
 *   [GAP]    visible in the UI but has NO editor → clicking does nothing
 *            (not a primitive single-field, not marked notImp, not in any
 *             modtag_us_* unsupported list). These are the real problems —
 *             e.g. listener.tcp_keepalive added in 1.38.3.
 *   [auto]   primitive single-field → rendered automatically, fine.
 *   [unsup]  appears in some modtag_us_* list → intentionally hidden, fine.
 *   [notImp] marked notImp in the tag → filtered out of the UI, fine.
 *
 * This script ONLY reads files and prints a report. It changes nothing.
 *
 * Usage:
 *   node tools/versionDiff/diffNewFields.mjs                 # defaults below
 *   node tools/versionDiff/diffNewFields.mjs v1.36.2 v1.38.3 # explicit
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../../');

const FROM = process.argv[2] || 'v1.36.2';
const TO = process.argv[3] || 'v1.38.3';

const tagsDir = (v) => path.join(ROOT, 'src', 'elchi', 'versions', v, 'tags');

// ---- ANSI helpers (respect NO_COLOR) -------------------------------------
const noColor = !!process.env.NO_COLOR || !process.stdout.isTTY;
const c = (code) => (s) => (noColor ? s : `\x1b[${code}m${s}\x1b[0m`);
const red = c('31;1');
const green = c('32');
const yellow = c('33');
const dim = c('2');
const cyan = c('36');
const bold = c('1');

// ---- Balanced-delimiter extractor (string/escape aware) ------------------
function extractBalanced(str, startIdx, open, close) {
    let depth = 0, inStr = false, esc = false;
    for (let i = startIdx; i < str.length; i++) {
        const ch = str[i];
        if (inStr) {
            if (esc) esc = false;
            else if (ch === '\\') esc = true;
            else if (ch === '"') inStr = false;
            continue;
        }
        if (ch === '"') { inStr = true; continue; }
        if (ch === open) depth++;
        else if (ch === close) {
            depth--;
            if (depth === 0) return str.slice(startIdx, i + 1);
        }
    }
    return null;
}

// ---- Parse one tag file → { interfaces, singleFields } --------------------
// interfaces: { [InterfaceName]: Field[] }   singleFields: { [InterfaceName]: string[] }
function parseTagFile(content) {
    const interfaces = {};
    const singleFields = {};
    const re = /export const (\w+)\s*(?::\s*OutType\s*)?=\s*/g;
    let m;
    while ((m = re.exec(content))) {
        const name = m[1];
        let idx = re.lastIndex;
        while (idx < content.length && /\s/.test(content[idx])) idx++;
        const ch = content[idx];
        try {
            if (ch === '{') {
                const objStr = extractBalanced(content, idx, '{', '}');
                if (!objStr) continue;
                const obj = JSON.parse(objStr); // { "Iface": [ ...fields ] }
                const iface = Object.keys(obj)[0];
                if (Array.isArray(obj[iface])) interfaces[iface] = obj[iface];
            } else if (ch === '[' && name.endsWith('_SingleFields')) {
                const arrStr = extractBalanced(content, idx, '[', ']');
                if (!arrStr) continue;
                singleFields[name.replace(/_SingleFields$/, '')] = JSON.parse(arrStr);
            }
        } catch {
            // Skip anything that doesn't cleanly parse; report stays best-effort.
        }
    }
    return { interfaces, singleFields };
}

// ---- Recursively collect *.ts tag files keyed by path relative to tagsDir --
function collectTagFiles(dir, base = dir, out = {}) {
    if (!fs.existsSync(dir)) return out;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) collectTagFiles(full, base, out);
        else if (entry.isFile() && entry.name.endsWith('.ts') && entry.name !== 'tagMap.ts') {
            out[path.relative(base, full).replace(/\\/g, '/')] = full;
        }
    }
    return out;
}

// ---- Build the flat set of "unsupported" field names from _modtag_.ts -----
// Heuristic: collect every string literal inside a `modtag_us_*` object so we
// can flag fields the team already hid on purpose. Cross-resource collisions
// are possible (e.g. "metadata"); this only DOWNGRADES noise, it never hides a
// real concern silently — flagged items are still printed under [unsup].
function buildUnsupportedSet() {
    const set = new Set();
    const compDir = path.join(ROOT, 'src', 'elchi', 'components');
    const walk = (dir) => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) walk(full);
            else if (entry.name === '_modtag_.ts') {
                const content = fs.readFileSync(full, 'utf8');
                const re = /export const modtag_us_\w+\s*:\s*TagsType\s*=\s*/g;
                let m;
                while ((m = re.exec(content))) {
                    let idx = re.lastIndex;
                    while (idx < content.length && /\s/.test(content[idx])) idx++;
                    if (content[idx] !== '{') continue;
                    const block = extractBalanced(content, idx, '{', '}');
                    if (!block) continue;
                    for (const lit of block.matchAll(/['"]([^'"]+)['"]/g)) {
                        const v = lit[1];
                        set.add(v);
                        set.add(v.split('.').pop()); // also the leaf segment
                    }
                }
            }
        }
    };
    if (fs.existsSync(compDir)) walk(compDir);
    return set;
}

// ---- Build the set of SUPPORTED (relativePath::Interface) pairs -----------
// Source of truth: every component declares the tags it actually consumes in a
// `_modtag_.ts` via `{ relativePath, names: [...] }`. The union of these across
// the whole component tree IS the set of message types the UI renders. Anything
// not referenced by a modtag (mcp, dynamic_modules, istio_stats, kafka,
// google/protobuf/descriptor, ...) is unsupported BY DESIGN — not a gap.
function buildSupportedSet() {
    const set = new Set();
    const compDir = path.join(ROOT, 'src', 'elchi', 'components');
    const re = /relativePath:\s*['"]([^'"]+)['"][\s\S]*?names:\s*\[([^\]]*)\]/g;
    const walk = (dir) => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) walk(full);
            else if (entry.name === '_modtag_.ts') {
                const content = fs.readFileSync(full, 'utf8');
                let m;
                while ((m = re.exec(content))) {
                    const rel = m[1];
                    const names = m[2]
                        .split(',')
                        .map((s) => s.trim().replace(/['"]/g, ''))
                        .filter(Boolean)
                        .map((n) => n.replace(/_SingleFields$/, ''));
                    for (const n of names) set.add(`${rel}::${n}`);
                }
            }
        }
    };
    if (fs.existsSync(compDir)) walk(compDir);
    return set;
}

// ---- Classification -------------------------------------------------------
function classify(field, ifaceSingleFields, unsupportedSet) {
    if (field.notImp) return 'notImp';
    const name = field.name;
    const leaf = name.split('.').pop();
    if (unsupportedSet.has(name) || unsupportedSet.has(leaf)) return 'unsup';
    if (ifaceSingleFields.includes(name)) return 'auto';
    return 'gap';
}

// ===========================================================================
const fromFiles = collectTagFiles(tagsDir(FROM));
const toFiles = collectTagFiles(tagsDir(TO));

if (Object.keys(toFiles).length === 0) {
    console.error(red(`Tag klasörü bulunamadı: ${tagsDir(TO)}`));
    process.exit(1);
}

const unsupportedSet = buildUnsupportedSet();
const supportedSet = buildSupportedSet();

const gaps = [];          // { rel, iface, field }
const counts = { gap: 0, auto: 0, unsup: 0, notImp: 0 };
let skippedIfaces = 0;    // interfaces with new fields but unsupported by design
const fileReports = [];   // { rel, isNewFile, ifaces: [{ iface, isNewIface, fields:[{field, cat}] }] }

for (const rel of Object.keys(toFiles).sort()) {
    const relNoExt = rel.replace(/\.ts$/, '');
    const isNewFile = !fromFiles[rel];
    const toParsed = parseTagFile(fs.readFileSync(toFiles[rel], 'utf8'));
    const fromParsed = fromFiles[rel]
        ? parseTagFile(fs.readFileSync(fromFiles[rel], 'utf8'))
        : { interfaces: {}, singleFields: {} };

    const ifaceReports = [];
    for (const iface of Object.keys(toParsed.interfaces).sort()) {
        const toFields = toParsed.interfaces[iface];
        const fromFields = fromParsed.interfaces[iface] || null;
        const isNewIface = fromFields === null;
        const oldNames = new Set((fromFields || []).map((f) => f.name));
        const sf = toParsed.singleFields[iface] || [];

        // Only consider message types the UI actually renders (declared in a
        // _modtag_). Everything else is excluded by design, not a gap.
        if (!supportedSet.has(`${relNoExt}::${iface}`)) {
            if (toFields.some((f) => !oldNames.has(f.name))) skippedIfaces++;
            continue;
        }

        const newFields = toFields.filter((f) => !oldNames.has(f.name));
        if (newFields.length === 0) continue;

        const fieldReports = newFields.map((f) => {
            const cat = classify(f, sf, unsupportedSet);
            counts[cat]++;
            if (cat === 'gap') gaps.push({ rel, iface, name: f.name, fieldType: f.fieldType, deprecated: f.isDeprecated });
            return { f, cat };
        });
        ifaceReports.push({ iface, isNewIface, fieldReports });
    }
    if (ifaceReports.length > 0) fileReports.push({ rel, isNewFile, ifaceReports });
}

// ---- Print ----------------------------------------------------------------
const catTag = {
    gap: red('[GAP]'),
    auto: green('[auto]'),
    unsup: dim('[unsup]'),
    notImp: dim('[notImp]'),
};

console.log(bold(`\n  Envoy tag diff: ${cyan(FROM)} → ${cyan(TO)}\n`));
console.log(dim('  [GAP] = UI\'da görünür ama editör yok (tıklayınca ölü). [auto]=primitive otomatik. [unsup]=modtag_us\'te gizli. [notImp]=notImp filtreli.\n'));

for (const fr of fileReports) {
    const header = fr.isNewFile ? `${fr.rel} ${yellow('(YENİ DOSYA)')}` : fr.rel;
    console.log(bold(`  ${header}`));
    for (const ir of fr.ifaceReports) {
        const ifaceLabel = ir.isNewIface ? `${ir.iface} ${yellow('(yeni interface)')}` : ir.iface;
        console.log(`    ${cyan(ifaceLabel)}`);
        for (const { f, cat } of ir.fieldReports) {
            const dep = f.isDeprecated ? yellow(' (deprecated)') : '';
            const ft = dim(`(${f.fieldType})`);
            const line = `      ${catTag[cat]} ${f.name} ${ft}${dep}`;
            console.log(cat === 'gap' ? line : dim(line));
        }
    }
    console.log('');
}

// ---- Summary --------------------------------------------------------------
console.log(bold('  ── Özet ──'));
console.log(dim(`  (Sadece UI'da desteklenen mesaj tipleri; ${skippedIfaces} desteklenmeyen interface tasarım gereği atlandı.)`));
console.log(`  Desteklenenlerde yeni alan: ${counts.gap + counts.auto + counts.unsup + counts.notImp}`);
console.log(`    ${red('GAP (component gerekli)')}: ${counts.gap}`);
console.log(`    ${green('auto (primitive)')}      : ${counts.auto}`);
console.log(`    ${dim('unsup (gizli)')}          : ${counts.unsup}`);
console.log(`    ${dim('notImp (filtreli)')}      : ${counts.notImp}`);

if (gaps.length > 0) {
    console.log(red(bold(`\n  ⚠️  Component bekleyen ${gaps.length} alan:`)));
    for (const g of gaps) {
        const dep = g.deprecated ? yellow(' (deprecated)') : '';
        console.log(`    • ${g.rel}  →  ${cyan(g.iface)}.${bold(g.name)} ${dim(`(${g.fieldType})`)}${dep}`);
    }
    console.log('');
} else {
    console.log(green('\n  ✓ Component bekleyen yeni alan yok.\n'));
}
