import React from 'react';
import { Typography } from 'antd';

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
}

// Renders a normalized API path as an inline code chip:
//   - the whole path sits in a subtle shaded code box (monospace),
//   - `/` separators are slightly muted so segments stay distinguishable,
//   - the leaf segment is bold — the endpoint name reads first,
//   - templated placeholders ({id}, {pii}, …) are tinted.
const EndpointPath: React.FC<Props> = ({ path, size = 13 }) => {
    if (!path) return <Text type="secondary">—</Text>;

    const segments = path.split('/');
    // Last non-empty segment — so a trailing slash doesn't steal emphasis.
    let leafIdx = -1;
    for (let i = segments.length - 1; i >= 0; i -= 1) {
        if (segments[i] !== '') {
            leafIdx = i;
            break;
        }
    }

    return (
        <span
            style={{
                fontFamily: MONO,
                fontSize: size,
                color: 'var(--text-primary)',
                wordBreak: 'break-all',
                lineHeight: 1.5,
                display: 'inline-block',
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
        </span>
    );
};

export default EndpointPath;
