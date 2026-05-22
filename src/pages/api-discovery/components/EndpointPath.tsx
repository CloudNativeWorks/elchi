import React from 'react';
import { Typography, Tooltip } from 'antd';

const { Text } = Typography;

// A segment wrapped in braces — a collector path-normalisation placeholder
// ({id}, {uuid}, {objectid}, {ulid}, {token}, {dynamic}, {traversal}, {pii}).
const PLACEHOLDER_RE = /^\{.+\}$/;

const MONO = 'Monaco, Menlo, "Ubuntu Mono", monospace';

interface Props {
    /** The normalized path, e.g. "/api/v1/users/{id}". */
    path: string;
    /** Base font size in px. Default 13.5. */
    size?: number;
    /** Wrap so no line exceeds this many monospace chars. Default 40. */
    maxChars?: number;
    /** Hard-truncate paths longer than this many chars with "…" (full path
     *  shown on hover). Default 100. */
    truncateAt?: number;
}

// Renders a normalized API path as an inline code chip:
//   - the whole path sits in a subtle shaded code box (monospace),
//   - `/` separators are slightly muted so segments stay distinguishable,
//   - the leaf segment is bold — the endpoint name reads first,
//   - templated placeholders ({id}, {pii}, …) are tinted.
const EndpointPath: React.FC<Props> = ({ path, size = 13, maxChars = 40, truncateAt = 100 }) => {
    if (!path) return <Text type="secondary">—</Text>;

    const truncated = path.length > truncateAt;
    const shown = truncated ? path.slice(0, truncateAt) : path;

    const segments = shown.split('/');
    // Last non-empty segment — so a trailing slash doesn't steal emphasis.
    let leafIdx = -1;
    for (let i = segments.length - 1; i >= 0; i -= 1) {
        if (segments[i] !== '') {
            leafIdx = i;
            break;
        }
    }

    const chip = (
        <span
            style={{
                fontFamily: MONO,
                fontSize: size,
                color: 'var(--text-primary)',
                wordBreak: 'break-all',
                lineHeight: 1.5,
                display: 'inline-block',
                maxWidth: `${maxChars}ch`,
                background: 'var(--code-bg, var(--bg-elevated))',
                border: '1px solid var(--border-default)',
                borderRadius: 6,
                padding: '3px 9px',
            }}
        >
            {segments.map((seg, i) => {
                const sep =
                    i > 0 ? (
                        <span key={`sep${i}`} style={{ color: 'var(--text-tertiary)' }}>
                            /
                        </span>
                    ) : null;
                if (seg === '') return sep;

                const isPlaceholder = PLACEHOLDER_RE.test(seg);
                const isLeaf = i === leafIdx;
                return (
                    <React.Fragment key={i}>
                        {sep}
                        <span
                            style={
                                isPlaceholder
                                    ? { color: '#a855f7', fontWeight: isLeaf ? 700 : 600 }
                                    : { color: 'var(--text-primary)', fontWeight: isLeaf ? 700 : 400 }
                            }
                        >
                            {seg}
                        </span>
                    </React.Fragment>
                );
            })}
            {truncated && <span style={{ color: 'var(--text-tertiary)' }}>…</span>}
        </span>
    );

    // Over the truncate threshold → reveal the full path on hover.
    return truncated ? (
        <Tooltip title={path} styles={{ body: { maxWidth: 520, wordBreak: 'break-all', fontFamily: MONO, fontSize: 11 } }}>
            {chip}
        </Tooltip>
    ) : (
        chip
    );
};

export default EndpointPath;
