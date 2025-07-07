import React from 'react';
import { Button } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import { PopoverContentProps } from './types';
import { getIconForResource, getNodeStyle } from './utils';

const PopoverContent: React.FC<PopoverContentProps> = ({ nodeLabel, category, gtype, link, id }) => {
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const url = `#${link}${nodeLabel}?resource_id=${id}`;
        window.location.href = url;
    };

    const iconUrl = getIconForResource(category);
    const nodeStyle = getNodeStyle(category);

    return (
        <div style={{ lineHeight: '1.5' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '16px', borderBottom: '1px solid #eee', paddingBottom: '5px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'space-between' }}>
                <span>{nodeLabel}</span>
                {iconUrl && (
                    <div style={{
                        width: 24,
                        height: 24,
                        background: nodeStyle.bg,
                        border: `2px solid ${nodeStyle.border}`,
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginLeft: 4
                    }}>
                        <img src={iconUrl} alt={category} style={{ width: '70%', height: '70%', objectFit: 'contain', display: 'block' }} />
                    </div>
                )}
            </div>
            <div>
                <strong>Resource:</strong> {category}
            </div>
            <div>
                <strong>Gtype:</strong> {gtype}
            </div>
            <div style={{ marginTop: '10px', position: 'relative', zIndex: 1011 }}>
                <Button 
                    type="link" 
                    onClick={handleClick}
                    icon={<LinkOutlined />}
                    size="small"
                    style={{ padding: 0 }}
                >
                    Go to Resource
                </Button>
            </div>
        </div>
    );
};

export default PopoverContent; 