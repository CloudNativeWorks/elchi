// HTTP method → antd preset tag colour. Centralised so every dashboard
// renders methods with the same palette. Always use a real preset
// (never 'default') so dark mode keeps a solid filled chip.
export const METHOD_TAG_COLOR: Record<string, string> = {
    GET: 'blue',
    POST: 'green',
    PUT: 'orange',
    PATCH: 'purple',
    DELETE: 'red',
    HEAD: 'cyan',
    OPTIONS: 'geekblue',
    CONNECT: 'magenta',
    TRACE: 'lime',
};

// Subset of methods considered "write" (mutating) — used by the auth-coverage
// dashboard, BOLA detection, etc. for visual emphasis.
export const WRITE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

export const methodColor = (m?: string): string => METHOD_TAG_COLOR[m ?? ''] ?? 'default';
