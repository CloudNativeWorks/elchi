import React from 'react';
import { Tooltip, Typography } from 'antd';

const { Text } = Typography;

interface Props {
    statusDist: Record<string, number>;
    height?: number;
    width?: number | string;
}

interface Bucket {
    label: '2xx' | '3xx' | '4xx' | '5xx' | '1xx';
    count: number;
    color: string;
}

const StatusDistBar: React.FC<Props> = ({ statusDist, height = 8, width = 140 }) => {
    const buckets: Bucket[] = [
        { label: '1xx', count: 0, color: '#9ca3af' },
        { label: '2xx', count: 0, color: '#10b981' },
        { label: '3xx', count: 0, color: '#3b82f6' },
        { label: '4xx', count: 0, color: '#f59e0b' },
        { label: '5xx', count: 0, color: '#ef4444' },
    ];

    for (const [code, n] of Object.entries(statusDist ?? {})) {
        const c = parseInt(code, 10);
        if (Number.isNaN(c)) continue;
        const idx = Math.min(Math.max(Math.floor(c / 100), 1), 5) - 1;
        buckets[idx].count += n;
    }

    const total = buckets.reduce((sum, b) => sum + b.count, 0);

    if (total === 0) {
        return <Text type="secondary" style={{ fontSize: 11 }}>—</Text>;
    }

    return (
        <Tooltip
            title={
                <div style={{ fontSize: 11, lineHeight: 1.7 }}>
                    {buckets
                        .filter((b) => b.count > 0)
                        .map((b) => (
                            <div key={b.label}>
                                <span
                                    style={{
                                        display: 'inline-block',
                                        width: 8,
                                        height: 8,
                                        background: b.color,
                                        borderRadius: 2,
                                        marginRight: 6,
                                    }}
                                />
                                {b.label}: {b.count.toLocaleString()}
                            </div>
                        ))}
                    <div style={{ marginTop: 4, opacity: 0.7 }}>Total: {total.toLocaleString()}</div>
                </div>
            }
        >
            <div
                style={{
                    display: 'flex',
                    width,
                    height,
                    borderRadius: 4,
                    overflow: 'hidden',
                    border: '1px solid var(--border-default)',
                    cursor: 'help',
                }}
            >
                {buckets.map((b) =>
                    b.count > 0 ? (
                        <div
                            key={b.label}
                            style={{
                                width: `${(b.count / total) * 100}%`,
                                background: b.color,
                                height: '100%',
                            }}
                        />
                    ) : null,
                )}
            </div>
        </Tooltip>
    );
};

export default StatusDistBar;
