import React from 'react';
import { Button } from 'antd';
import { LinkOutlined, GlobalOutlined, ClusterOutlined, FilterOutlined, ShareAltOutlined, AimOutlined, SafetyOutlined, CodeOutlined, KeyOutlined, AppstoreOutlined, CloudOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { PopoverContentProps } from './types';
import { getIconForResource, getNodeStyle } from './utils';

const PopoverContent: React.FC<PopoverContentProps> = ({ nodeLabel, category, gtype, link, id }) => {
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const url = `#${link}${nodeLabel}?resource_id=${id}`;
        window.location.href = url;
    };

    const iconName = getIconForResource(category);
    const nodeStyle = getNodeStyle(category);

    // Icon mapping
    const iconMap: { [key: string]: React.ReactNode } = {
        'GlobalOutlined': <GlobalOutlined />,
        'ClusterOutlined': <ClusterOutlined />,
        'FilterOutlined': <FilterOutlined />,
        'ShareAltOutlined': <ShareAltOutlined />,
        'AimOutlined': <AimOutlined />,
        'SafetyOutlined': <SafetyOutlined />,
        'CodeOutlined': <CodeOutlined />,
        'KeyOutlined': <KeyOutlined />,
        'AppstoreOutlined': <AppstoreOutlined />,
        'CloudOutlined': <CloudOutlined />,
        'QuestionCircleOutlined': <QuestionCircleOutlined />
    };

    const IconComponent = iconMap[iconName] || iconMap['QuestionCircleOutlined'];

    return (
        <div style={{ lineHeight: '1.5' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '16px', borderBottom: '1px solid #eee', paddingBottom: '5px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'space-between' }}>
                <span>{nodeLabel}</span>
                <div style={{
                    width: 28,
                    height: 28,
                    background: nodeStyle.bg,
                    border: `2px solid ${nodeStyle.border}`,
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: 4,
                    fontSize: '16px',
                    color: '#fff'
                }}>
                    {IconComponent}
                </div>
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