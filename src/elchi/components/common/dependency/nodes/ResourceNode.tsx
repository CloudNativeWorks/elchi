import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import {
    GlobalOutlined,
    ClusterOutlined,
    FilterOutlined,
    ShareAltOutlined,
    AimOutlined,
    SafetyOutlined,
    CodeOutlined,
    KeyOutlined,
    AppstoreOutlined,
    CloudOutlined,
    QuestionCircleOutlined,
    StarFilled,
} from '@ant-design/icons';
import { ResourceNode as ResourceNodeType } from '../types';
import { getNodeStyleByCategory, getIconForCategory } from '../themes';

/**
 * Icon component mapper
 * Single responsibility: Icon rendering
 */
const IconComponent: React.FC<{ iconName: string }> = ({ iconName }) => {
    const iconMap: Record<string, React.ReactElement> = {
        GlobalOutlined: <GlobalOutlined />,
        ClusterOutlined: <ClusterOutlined />,
        FilterOutlined: <FilterOutlined />,
        ShareAltOutlined: <ShareAltOutlined />,
        AimOutlined: <AimOutlined />,
        SafetyOutlined: <SafetyOutlined />,
        CodeOutlined: <CodeOutlined />,
        KeyOutlined: <KeyOutlined />,
        AppstoreOutlined: <AppstoreOutlined />,
        CloudOutlined: <CloudOutlined />,
        QuestionCircleOutlined: <QuestionCircleOutlined />,
    };

    return iconMap[iconName] || iconMap['QuestionCircleOutlined'];
};

/**
 * Resource Node Component
 * Single responsibility: Render a single resource node
 */
const ResourceNode: React.FC<NodeProps<ResourceNodeType>> = ({ data, selected }) => {
    const nodeStyle = getNodeStyleByCategory(data.category);
    const iconName = getIconForCategory(data.category);

    // Determine border style based on state
    const getBorderStyle = () => {
        if (selected || data.isHighlighted) {
            return {
                borderColor: '#fbbf24',
                borderWidth: '3px',
                boxShadow: '0 0 30px rgba(251, 191, 36, 0.8)',
            };
        }
        if (data.isNeighbor) {
            const neighborColor = data.neighborType === 'parent' ? '#10b981' : '#3b82f6';
            return {
                borderColor: neighborColor,
                borderWidth: '2px',
                boxShadow: `0 0 20px ${neighborColor}40`,
            };
        }
        return {
            borderColor: nodeStyle.border,
            borderWidth: '2px',
            boxShadow: nodeStyle.shadow,
        };
    };

    const borderStyle = getBorderStyle();

    return (
        <div
            style={{
                padding: '8px 12px',
                borderRadius: '10px',
                background: nodeStyle.gradient,
                border: `${borderStyle.borderWidth} solid ${borderStyle.borderColor}`,
                boxShadow: borderStyle.boxShadow,
                minWidth: '110px',
                maxWidth: '140px',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '8px',
                position: 'relative',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: data.isHighlighted === false ? 0.3 : 1,
            }}
        >
            {/* Connection Handles */}
            <Handle
                type="target"
                position={Position.Left}
                style={{
                    background: nodeStyle.border,
                    width: '8px',
                    height: '8px',
                    border: '2px solid white',
                }}
            />
            <Handle
                type="source"
                position={Position.Right}
                style={{
                    background: nodeStyle.border,
                    width: '8px',
                    height: '8px',
                    border: '2px solid white',
                }}
            />

            {/* First node badge */}
            {data.first && (
                <div
                    style={{
                        position: 'absolute',
                        top: '-6px',
                        right: '-6px',
                        background: '#fbbf24',
                        borderRadius: '50%',
                        width: '18px',
                        height: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(251, 191, 36, 0.6)',
                        zIndex: 10,
                    }}
                >
                    <StarFilled style={{ fontSize: '10px', color: '#fff' }} />
                </div>
            )}

            {/* Icon */}
            <div
                style={{
                    fontSize: '20px',
                    color: nodeStyle.text,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                }}
            >
                <IconComponent iconName={iconName} />
            </div>

            {/* Content */}
            <div
                style={{
                    flex: 1,
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                }}
            >
                {/* Label */}
                <div
                    style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: nodeStyle.text,
                        lineHeight: '1.2',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                    title={data.label}
                >
                    {data.label}
                </div>

                {/* Category badge */}
                <div
                    style={{
                        fontSize: '6px',
                        fontWeight: 600,
                        color: nodeStyle.text,
                        textTransform: 'uppercase',
                        letterSpacing: '0.3px',
                        opacity: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'wrap',
                    }}
                >
                    {data.gtype.split('.').pop()}
                </div>
            </div>
        </div>
    );
};

export default memo(ResourceNode);
