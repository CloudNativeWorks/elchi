// ISO-3166-1 α-2 country code → Unicode regional indicator pair.
// Browsers/OSes that ship the emoji flag font (modern macOS, iOS, most
// Linux distros, recent Windows builds) render the resulting two-char
// string as a flag glyph (🇹🇷, 🇺🇸, …). On older Windows the OS shows the
// raw two letters as a fallback, which is still readable.
//
// Why emoji and not SVG/CDN: zero dependency, no network fetch, no
// asset bundling. Trade-off is OS-dependent rendering — acceptable for
// an internal dashboard.
export const countryFlag = (code?: string): string => {
    if (!code) return '';
    const trimmed = code.trim().toUpperCase();
    if (trimmed.length !== 2) return '';
    if (!/^[A-Z]{2}$/.test(trimmed)) return '';
    // Regional indicator letters start at U+1F1E6 (A), so codepoint =
    // base + (letter - 'A'). String.fromCodePoint stitches the pair.
    const A = 'A'.charCodeAt(0);
    const codePoints = [...trimmed].map((c) => 0x1f1e6 + (c.charCodeAt(0) - A));
    return String.fromCodePoint(...codePoints);
};

// Convenience: "🇹🇷 TR Turkey" composer for tooltips and table cells.
// Skips the flag glyph when code is missing/invalid so the layout stays
// stable.
export const countryWithFlag = (code?: string, name?: string): string => {
    const f = countryFlag(code);
    const label = name && name !== code ? `${code} ${name}` : code || name || '—';
    return f ? `${f} ${label}` : label;
};
