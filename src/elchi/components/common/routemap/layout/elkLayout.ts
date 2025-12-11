import ELK, { ElkNode, ElkExtendedEdge } from 'elkjs/lib/elk.bundled.js';
import { Node, Edge } from '@xyflow/react';
import { LayoutDirection, ElkLayoutOptions } from '../types';

const elk = new ELK();

/**
 * Default ELK layout options
 */
const DEFAULT_OPTIONS: ElkLayoutOptions = {
    direction: 'LR',
    nodeSpacing: 80,
    layerSpacing: 150,
    edgeSpacing: 40,
};

/**
 * Convert layout direction to ELK direction format
 * Single responsibility: Direction mapping
 */
const getElkDirection = (direction: LayoutDirection): string => {
    const directionMap: Record<LayoutDirection, string> = {
        LR: 'RIGHT',
        RL: 'LEFT',
        TB: 'DOWN',
        BT: 'UP',
    };
    return directionMap[direction] || 'RIGHT';
};

/**
 * Apply ELK layout to React Flow nodes and edges
 * Single responsibility: Layout calculation
 */
export const applyElkLayout = async (
    nodes: Node[],
    edges: Edge[],
    options: Partial<ElkLayoutOptions> = {}
): Promise<Node[]> => {
    const layoutOptions = { ...DEFAULT_OPTIONS, ...options };

    // Build ELK graph structure
    const elkNodes: ElkNode[] = nodes.map((node) => ({
        id: node.id,
        width: node.width || 140,
        height: node.height || 80,
    }));

    const elkEdges: ElkExtendedEdge[] = edges.map((edge) => ({
        id: edge.id,
        sources: [edge.source],
        targets: [edge.target],
    }));

    const elkGraph: ElkNode = {
        id: 'root',
        layoutOptions: {
            'elk.algorithm': 'layered',
            'elk.direction': getElkDirection(layoutOptions.direction),
            'elk.spacing.nodeNode': String(layoutOptions.nodeSpacing),
            'elk.layered.spacing.nodeNodeBetweenLayers': String(layoutOptions.layerSpacing),
            'elk.spacing.edgeEdge': String(layoutOptions.edgeSpacing),
            'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
            'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
            'elk.edgeRouting': 'ORTHOGONAL',
            'elk.layered.unnecessaryBendpoints': 'true',
            'elk.layered.spacing.edgeNodeBetweenLayers': '40',
        },
        children: elkNodes,
        edges: elkEdges,
    };

    try {
        // Calculate layout using ELK
        const layoutedGraph = await elk.layout(elkGraph);

        // Apply calculated positions to nodes
        const layoutedNodes = nodes.map((node) => {
            const elkNode = layoutedGraph.children?.find((n) => n.id === node.id);
            if (elkNode) {
                return {
                    ...node,
                    position: {
                        x: elkNode.x || 0,
                        y: elkNode.y || 0,
                    },
                };
            }
            return node;
        });

        return layoutedNodes;
    } catch (error) {
        console.error('ELK layout error:', error);
        return nodes; // Return original nodes if layout fails
    }
};

/**
 * Get default node dimensions based on node count
 * Single responsibility: Dimension calculation
 */
export const getNodeDimensions = (nodeCount: number): { width: number; height: number } => {
    if (nodeCount === 1) return { width: 180, height: 100 };
    if (nodeCount <= 5) return { width: 160, height: 90 };
    if (nodeCount <= 15) return { width: 140, height: 80 };
    if (nodeCount <= 30) return { width: 120, height: 70 };
    return { width: 100, height: 60 };
};

/**
 * Calculate optimal spacing based on node count
 * Single responsibility: Spacing calculation
 */
export const calculateOptimalSpacing = (nodeCount: number): Partial<ElkLayoutOptions> => {
    if (nodeCount <= 5) {
        return {
            nodeSpacing: 100,
            layerSpacing: 200,
            edgeSpacing: 50,
        };
    }
    if (nodeCount <= 15) {
        return {
            nodeSpacing: 80,
            layerSpacing: 150,
            edgeSpacing: 40,
        };
    }
    if (nodeCount <= 30) {
        return {
            nodeSpacing: 60,
            layerSpacing: 120,
            edgeSpacing: 30,
        };
    }
    return {
        nodeSpacing: 50,
        layerSpacing: 100,
        edgeSpacing: 25,
    };
};
