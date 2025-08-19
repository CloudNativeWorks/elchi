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
                        background: isDisabled ? 'rgba(220,220,220,0.18)' : 'rgba(255,255,255,0.18)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 20,
                        height: 20,
                        marginRight: 8
                    }}>
                        <PlusOutlined style={{ fontSize: 14, color: isDisabled ? '#eee' : '#fff' }} />
                    </span>
                )
            }
            style={{
                background: isDisabled
                    ? 'linear-gradient(90deg, #e0e0e0 0%, #bdbdbd 100%)'
                    : 'linear-gradient(90deg, #056ccd 0%, #00c6fb 100%)',
                border: 'none',
                color: isDisabled ? '#eee' : '#fff',
                fontWeight: 600,
                fontSize: 12,
                borderRadius: 8,
                padding: '0 12px',
                height: 32,
                boxShadow: isDisabled
                    ? '0 4px 16px 0 rgba(180,180,180,0.10)'
                    : '0 4px 16px 0 rgba(5,117,230,0.10)',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.18s',
                pointerEvents: isDisabled ? 'none' : undefined,
                cursor: isDisabled ? 'not-allowed' : undefined,
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