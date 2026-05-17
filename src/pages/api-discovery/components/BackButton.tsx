import React, { useState } from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';

interface Props {
    onClick: () => void;
    label?: string;
}

// Custom back button styled to balance with the 44×44 icon box in the
// hero header. Uses a subtle elevated background + 1px border at rest,
// and a primary-tinted accent on hover. Native <button> for snappier
// focus/active feedback than antd's default Button gives us inside a
// gradient hero.
const BackButton: React.FC<Props> = ({ onClick, label = 'Back' }) => {
    const [hover, setHover] = useState(false);
    return (
        <button
            type="button"
            onClick={onClick}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                height: 38,
                padding: '0 16px',
                borderRadius: 10,
                background: hover ? 'var(--color-primary-light)' : 'var(--bg-elevated)',
                border: `1px solid ${hover ? 'var(--color-primary)' : 'var(--border-default)'}`,
                color: hover ? 'var(--color-primary)' : 'var(--text-primary)',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.18s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: hover ? 'translateX(-2px)' : 'translateX(0)',
                boxShadow: hover ? '0 2px 8px rgba(10, 127, 218, 0.15)' : 'none',
            }}
        >
            <ArrowLeftOutlined style={{ fontSize: 13 }} />
            {label}
        </button>
    );
};

export default BackButton;
