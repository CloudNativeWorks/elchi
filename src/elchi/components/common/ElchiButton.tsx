import React from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface ElchiButtonProps extends React.ComponentProps<typeof Button> {
    children?: React.ReactNode;
    onlyText?: boolean;
    style?: React.CSSProperties;
}

const ElchiButton: React.FC<ElchiButtonProps> = ({ children = 'Add New', onlyText = false, style, disabled, ...props }) => {
    const isDisabled = !!disabled;
    return (
        <Button
            type="primary"
            size="middle"
            icon={
                onlyText ? undefined : (
                    <span style={{
                        background: isDisabled ? 'var(--bg-hover)' : 'var(--glass-white-medium)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 20,
                        height: 20,
                        marginRight: 8
                    }}>
                        <PlusOutlined style={{ fontSize: 14, color: isDisabled ? 'var(--text-disabled)' : 'var(--text-on-primary)' }} />
                    </span>
                )
            }
            style={{
                background: isDisabled
                    ? 'var(--btn-disabled-gradient, linear-gradient(90deg, #e0e0e0 0%, #bdbdbd 100%))'
                    : 'var(--gradient-primary)',
                border: 'none',
                color: isDisabled ? 'var(--text-disabled)' : 'var(--text-on-primary)',
                fontWeight: 600,
                fontSize: 12,
                borderRadius: 8,
                padding: '0 12px',
                height: 32,
                boxShadow: isDisabled
                    ? 'var(--shadow-sm)'
                    : '0 4px 16px 0 var(--shadow-primary-color)',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.18s',
                pointerEvents: isDisabled ? 'none' : undefined,
                cursor: isDisabled ? 'not-allowed' : undefined,
                opacity: isDisabled ? 0.6 : 1,
                ...style
            }}
            className={'modern-add-btn'}
            disabled={isDisabled}
            {...props}
        >
            {children}
        </Button>
    );
};

export default ElchiButton; 