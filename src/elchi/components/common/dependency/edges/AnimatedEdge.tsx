import React, { memo } from 'react';
import { EdgeProps, getBezierPath } from '@xyflow/react';
import { ResourceEdge } from '../types';
import { ThemeColors } from '../themes';

/**
 * Animated Edge Component
 * Single responsibility: Render an animated edge with flow direction
 */
const AnimatedEdge: React.FC<EdgeProps<ResourceEdge>> = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
    selected,
    markerEnd,
}) => {
    const [edgePath] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    // Determine edge color based on state
    const getEdgeColor = () => {
        if (selected || data?.isHighlighted) {
            return ThemeColors.edge.highlighted;
        }
        return ThemeColors.edge.default;
    };

    const edgeColor = getEdgeColor();
    const strokeWidth = selected || data?.isHighlighted ? 3 : 2;

    return (
        <>
            {/* Glow effect for highlighted edges (behind) */}
            {(selected || data?.isHighlighted) && (
                <path
                    d={edgePath}
                    fill="none"
                    stroke={edgeColor}
                    strokeWidth={strokeWidth + 6}
                    style={{
                        opacity: 0.2,
                        filter: 'blur(4px)',
                        pointerEvents: 'none',
                    }}
                />
            )}

            {/* Main edge path with animation - always animated */}
            <path
                id={id}
                d={edgePath}
                fill="none"
                stroke={edgeColor}
                strokeWidth={strokeWidth}
                markerEnd={markerEnd}
                strokeDasharray="10 5"
                style={{
                    opacity: data?.isHighlighted === false ? 0.2 : 1,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    animation: 'flowAnimation 1.5s linear infinite',
                }}
            />

            {/* CSS for animation */}
            <style>
                {`
                    @keyframes flowAnimation {
                        0% {
                            stroke-dashoffset: 16;
                        }
                        100% {
                            stroke-dashoffset: 0;
                        }
                    }
                `}
            </style>
        </>
    );
};

export default memo(AnimatedEdge);
