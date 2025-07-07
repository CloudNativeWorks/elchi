import React from 'react';
import { Button } from 'antd';

interface CollapseButtonProps {
    collapsed: boolean;
    toggleCollapse: () => void;
    style?: React.CSSProperties; 
}

const CollapseButton: React.FC<CollapseButtonProps> = ({ collapsed, toggleCollapse, style }) => {
    return (
        <Button
            onClick={toggleCollapse}
            style={{
                ...style,
                background: 'transparent',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '5px',
            }}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                    transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)', // Ok yönünü değiştir
                    transition: 'transform 0.3s', // Dönüş animasyonu
                }}
            >
                <polyline points="15 18 9 12 15 6" />
            </svg>
        </Button>
    );
};

export default CollapseButton;