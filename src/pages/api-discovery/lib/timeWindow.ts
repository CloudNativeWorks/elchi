// Shared time-window selector for the ClickHouse-backed dashboards
// (Security Score / Transport / Errors / Bot-Scanner). The selected
// window is mirrored to the `?win=` URL param (minutes) so that a
// "View →" jump from one dashboard to another carries the exact same
// period — the destination shows numbers for the window the user was
// already looking at, not a reset default.

export interface WinOption {
    label: string;
    value: number; // minutes
}

export const WIN_OPTIONS: WinOption[] = [
    { label: '1h', value: 60 },
    { label: '6h', value: 360 },
    { label: '24h', value: 1440 },
    { label: '7d', value: 10080 },
];

const VALID = WIN_OPTIONS.map((o) => o.value);

// Read the `win` param, falling back to the dashboard's own default
// when it is absent or not one of the known options.
export const readWin = (sp: URLSearchParams, fallback = 1440): number => {
    const v = parseInt(sp.get('win') ?? '', 10);
    return VALID.includes(v) ? v : fallback;
};
