import React from 'react';
import { Button, Space } from 'antd';
import { ZoomInOutlined, ZoomOutOutlined, FullscreenOutlined } from '@ant-design/icons';

interface GraphControlsProps {
    onZoomIn: () => void;
    onZoomOut: () => void;
    onFit: () => void;// eslint-disable-next-line
    onLayoutChange: (layout: string) => void;
}

const GraphControls: React.FC<GraphControlsProps> = ({ onZoomIn, onZoomOut, onFit, onLayoutChange }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Space size="small">
                <Button icon={<ZoomInOutlined />} onClick={onZoomIn} type="text" />
                <Button icon={<ZoomOutOutlined />} onClick={onZoomOut} type="text" />
                <Button icon={<FullscreenOutlined />} onClick={onFit} type="text" />
            </Space>
            <div>
                Layout Style:
                <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                    <Button 
                        size="small" 
                        onClick={() => onLayoutChange('dagre')}
                    >
                        Hierarchical
                    </Button>
                    <Button 
                        size="small" 
                        onClick={() => onLayoutChange('circle')}
                    >
                        Circular
                    </Button>
                    <Button 
                        size="small" 
                        onClick={() => onLayoutChange('grid')}
                    >
                        Grid
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default GraphControls; 