/**
 * A lightweight titled container for the builder — calmer than an antd Card
 * (no heavy header band), so stacked sections read as a quiet hierarchy rather
 * than a wall of boxes.
 */

import React from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

interface SectionProps {
    title?: React.ReactNode;
    extra?: React.ReactNode;
    children: React.ReactNode;
    style?: React.CSSProperties;
    bodyStyle?: React.CSSProperties;
}

const Section: React.FC<SectionProps> = ({ title, extra, children, style, bodyStyle }) => (
    <div
        style={{
            border: '1px solid var(--border-default)',
            borderRadius: 12,
            background: 'var(--card-bg)',
            marginBottom: 12,
            ...style,
        }}
    >
        {(title || extra) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px 0' }}>
                {title && <Text strong style={{ fontSize: 13 }}>{title}</Text>}
                <div style={{ flex: 1 }} />
                {extra}
            </div>
        )}
        <div style={{ padding: 14, ...bodyStyle }}>{children}</div>
    </div>
);

export default Section;
