import React from 'react';
import { Button } from 'antd';


interface ElchiIconButtonProps extends React.ComponentProps<typeof Button> {
    style?: React.CSSProperties;
    disabled?: boolean;
}

const ElchiIconButton: React.FC<ElchiIconButtonProps> = ({ style, disabled, ...props }) => {
    const isDisabled = !!disabled;
    return (
        <Button
            type="primary"
            size="small"
            icon={
                <svg width={13} height={13} className="add-icon-shadow" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
            }
            style={{
                background: isDisabled
                    ? 'var(--btn-disabled-gradient, linear-gradient(90deg, #e0e0e0 0%, #bdbdbd 100%))'
                    : 'var(--gradient-primary)',
                border: 'none',
                color: 'var(--text-on-primary)',
                boxShadow: '0 2px 8px 0 rgba(5,117,230,0.10)',
                width: 26,
                height: 26,
                minWidth: 26,
                minHeight: 26,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 8,
                transition: 'all 0.18s',
                transform: 'scale(1.08)',
                pointerEvents: isDisabled ? 'none' : undefined,
                cursor: isDisabled ? 'not-allowed' : undefined,
                ...style,
            }}
            className={'modern-add-icon-btn'}
            disabled={isDisabled}
            {...props}
        />
    );
};

export default ElchiIconButton;