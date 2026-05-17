import React from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

// A segment wrapped in braces — a collector path-normalisation placeholder
// ({id}, {uuid}, {objectid}, {ulid}, {token}, {dynamic}, {traversal}, {pii}).
const PLACEHOLDER_RE = /^\{.+\}$/;

interface Props {
    /** The normalized path, e.g. "/api/v1/users/{id}". */
    path: string;
    /** Font size in px. Default 12.5. */
    size?: number;
}

// Renders a normalized API path with visual hierarchy so long paths read
// at a glance:
//   - `/` separators dimmed,
//   - intermediate segments in secondary text colour,
//   - the leaf segment emphasised (primary colour, bold),
//   - templated placeholders ({id}, {pii}, …) as accent pills.
// Designed to sit inside a <Link> — the inner spans set explicit colours
// so they win over the link's default blue while the link keeps its
// hover affordance.
const EndpointPath: React.FC<Props> = ({ path, size = 12.5 }) => {
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
                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                fontSize: size,
                wordBreak: 'break-all',
                lineHeight: 1.5,
            }}
        >
            {segments.map((seg, i) => {
                const sep =
                    i > 0 ? (
                        <span key={`sep${i}`} style={{ color: 'var(--text-tertiary)', opacity: 0.6 }}>
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
                                    ? {
                                        color: '#a855f7',
                                        background: 'rgba(168, 85, 247, 0.14)',
                                        borderRadius: 3,
                                        padding: '0 4px',
                                        fontWeight: 600,
                                    }
                                    : {
                                        color: isLeaf ? 'var(--text-primary)' : 'var(--text-secondary)',
                                        fontWeight: isLeaf ? 600 : 400,
                                    }
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
