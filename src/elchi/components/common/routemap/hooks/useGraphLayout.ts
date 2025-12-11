import { useState, useCallback } from 'react';
import { Node, Edge, useReactFlow } from '@xyflow/react';
import { LayoutDirection } from '../types';
import { applyElkLayout, calculateOptimalSpacing, getNodeDimensions } from '../layout/elkLayout';

/**
 * Custom hook for managing graph layout
 * Single responsibility: Layout state and operations
 */
export const useGraphLayout = () => {
    const { setNodes, fitView } = useReactFlow();
    const [layoutDirection, setLayoutDirection] = useState<LayoutDirection>('LR');
    const [isLayouting, setIsLayouting] = useState(false);

    /**
     * Apply layout to nodes
     */
    const applyLayout = useCallback(
        async (nodes: Node[], edges: Edge[], direction?: LayoutDirection) => {
            setIsLayouting(true);

            try {
                const targetDirection = direction || layoutDirection;
                const nodeCount = nodes.length;

                // Calculate optimal spacing
                const spacing = calculateOptimalSpacing(nodeCount);
                const dimensions = getNodeDimensions(nodeCount);

                // Set node dimensions
                const nodesWithDimensions = nodes.map((node) => ({
                    ...node,
                    width: dimensions.width,
                    height: dimensions.height,
                }));

                // Apply ELK layout
                const layoutedNodes = await applyElkLayout(nodesWithDimensions, edges, {
                    direction: targetDirection,
                    ...spacing,
                });

                // Update nodes
                setNodes(layoutedNodes);

                // Fit view after a short delay to ensure layout is applied
                setTimeout(() => {
                    fitView({ padding: 0.2, duration: 400 });
                }, 100);
            } catch (error) {
                console.error('Layout error:', error);
            } finally {
                setIsLayouting(false);
            }
        },
        [layoutDirection, setNodes, fitView]
    );

    /**
     * Change layout direction
     */
    const changeLayoutDirection = useCallback(
        async (direction: LayoutDirection, nodes: Node[], edges: Edge[]) => {
            setLayoutDirection(direction);
            await applyLayout(nodes, edges, direction);
        },
        [applyLayout]
    );

    return {
        layoutDirection,
        isLayouting,
        applyLayout,
        changeLayoutDirection,
    };
};
