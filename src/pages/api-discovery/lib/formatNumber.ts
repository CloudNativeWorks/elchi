// Compact-notation number formatter for KPI pills and overview tiles
// where a 13-char "203,169,127,117" would blow out the column width.
//
// 999 → "999"
// 1234 → "1.2K"
// 1_500_000 → "1.5M"
// 203_169_127_117 → "203B"
//
// Uses Intl with `notation: 'compact'` so locale-aware suffixes come
// for free (M, B for `en`; Mio, Mrd for `de`, etc.). One decimal
// place is enough to disambiguate "1.2K" from "1.9K" without giving
// up the visual gain.

const compactFormatter = new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
});

export const formatCompactNumber = (n: number | null | undefined): string => {
    if (n === null || n === undefined || Number.isNaN(n)) return '—';
    return compactFormatter.format(n);
};

// Human-readable byte size — base-1024 (KiB/MiB/…), one decimal.
//   0 → "0 B"   ·   1536 → "1.5 KB"   ·   5_242_880 → "5 MB"
export const formatBytes = (n: number | null | undefined): string => {
    if (n === null || n === undefined || Number.isNaN(n)) return '—';
    if (n < 1024) return `${n} B`;
    const units = ['KB', 'MB', 'GB', 'TB', 'PB'];
    let v = n / 1024;
    let i = 0;
    while (v >= 1024 && i < units.length - 1) {
        v /= 1024;
        i += 1;
    }
    return `${v.toFixed(v >= 100 || Number.isInteger(v) ? 0 : 1)} ${units[i]}`;
};
