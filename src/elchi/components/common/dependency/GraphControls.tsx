import React from 'react';
import { Button, Space, Divider } from 'antd';
import {
    ZoomInOutlined,
    ZoomOutOutlined,
    FullscreenOutlined,
    ArrowRightOutlined,
    ArrowLeftOutlined,
    ArrowDownOutlined,
    ArrowUpOutlined,
} from '@ant-design/icons';
import { useReactFlow } from '@xyflow/react';
import { LayoutDirection } from './types';

interface GraphControlsProps {
    onLayoutChange?: (direction: LayoutDirection) => void;
}

/**
 * Graph Controls Component
 * Single responsibility: Provide graph interaction controls
 */
const GraphControls: React.FC<GraphControlsProps> = ({ onLayoutChange }) => {
    const { zoomIn, zoomOut, fitView } = useReactFlow();

    const handleZoomIn = () => {
        zoomIn({ duration: 300 });
    };

    const handleZoomOut = () => {
        zoomOut({ duration: 300 });
    };

    const handleFit = () => {
        fitView({ padding: 0.2, duration: 400 });
    };

    const handleLayoutChange = (direction: LayoutDirection) => {
        onLayoutChange?.(direction);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Zoom Controls */}
            <Space size="small">
                <Button
                    icon={<ZoomInOutlined />}
                    onClick={handleZoomIn}
                    type="text"
                    size="small"
                    title="Zoom In"
                />
                <Button
                    icon={<ZoomOutOutlined />}
                    onClick={handleZoomOut}
                    type="text"
                    size="small"
                    title="Zoom Out"
                />
                <Button
                    icon={<FullscreenOutlined />}
                    onClick={handleFit}
                    type="text"
                    size="small"
                    title="Fit to View"
                />
            </Space>

            {/* Layout Direction Controls */}
            {onLayoutChange && (
                <>
                    <Divider style={{ margin: '4px 0' }} />
                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>
                        Layout Direction
                    </div>
                    <Space size="small" wrap>
                        <Button
                            icon={<ArrowRightOutlined />}
                            onClick={() => handleLayoutChange('LR')}
                            size="small"
                            title="Left to Right"
                        >
                            LR
                        </Button>
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={() => handleLayoutChange('RL')}
                            size="small"
                            title="Right to Left"
                        >
                            RL
                        </Button>
                        <Button
                            icon={<ArrowDownOutlined />}
                            onClick={() => handleLayoutChange('TB')}
                            size="small"
                            title="Top to Bottom"
                        >
                            TB
                        </Button>
                        <Button
                            icon={<ArrowUpOutlined />}
                            onClick={() => handleLayoutChange('BT')}
                            size="small"
                            title="Bottom to Top"
                        >
                            BT
                        </Button>
                    </Space>
                </>
            )}
        </div>
    );
};

export default GraphControls;
