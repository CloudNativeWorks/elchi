import React from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

interface Props {
    label: string;
    value: string;
    accent: string;
}

// Compact right-aligned mini-stat used in API Discovery hero headers.
// Pattern: small uppercase label + large accent-colored number, stacked
// vertically. Replicated across listener / endpoint / detail pages for a
// single visual rhythm.
const KpiPill: React.FC<Props> = ({ label, value, accent }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: 70 }}>
        <Text style={{ fontSize: 10, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: 1 }}>
            {label}
        </Text>
        <Text strong style={{ fontSize: 20, lineHeight: 1.2, color: accent }}>
            {value}
        </Text>
    </div>
);

export default KpiPill;
