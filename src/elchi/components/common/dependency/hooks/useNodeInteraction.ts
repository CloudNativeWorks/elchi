import { useState, useCallback } from 'react';
import { Node, Edge, useReactFlow } from '@xyflow/react';
import { ResourceNode, SelectedNodeInfo } from '../types';
import {
    getNeighborNodeIds,
    getConnectedEdgeIds,
    filterNodesBySearchTerm,
    filterNodesByCategory,
    nodeMatchesFilters,
} from '../utils';

/**
 * Custom hook for managing node interactions
 * Single responsibility: Node selection, highlighting, and filtering
 */
export const useNodeInteraction = () => {
    const { setNodes, setEdges } = useReactFlow();
    const [selectedNode, setSelectedNode] = useState<SelectedNodeInfo | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');

    /**
     * Highlight selected node and its neighbors
     */
    const highlightNode = useCallback(
        (nodeId: string | null, nodes: Node[], edges: Edge[]) => {
            if (!nodeId) {
                // Clear all highlights
                setNodes((nds) =>
                    nds.map((node) => ({
                        ...node,
                        data: {
                            ...node.data,
                            isHighlighted: undefined,
                            isNeighbor: undefined,
                            neighborType: undefined,
                        },
                    }))
                );
                setEdges((eds) =>
                    eds.map((edge) => ({
                        ...edge,
                        data: {
                            ...edge.data,
                            isHighlighted: undefined,
                            isAnimated: undefined,
                        },
                    }))
                );
                return;
            }

            // Get neighbors
            const { parents, children } = getNeighborNodeIds(nodeId, edges);
            const connectedEdgeIds = getConnectedEdgeIds(nodeId, edges);

            // Highlight nodes
            setNodes((nds) =>
                nds.map((node) => {
                    if (node.id === nodeId) {
                        return {
                            ...node,
                            data: {
                                ...node.data,
                                isHighlighted: true,
                                isNeighbor: undefined,
                                neighborType: undefined,
                            },
                        };
                    }
                    if (parents.includes(node.id)) {
                        return {
                            ...node,
                            data: {
                                ...node.data,
                                isHighlighted: undefined,
                                isNeighbor: true,
                                neighborType: 'parent',
                            },
                        };
                    }
                    if (children.includes(node.id)) {
                        return {
                            ...node,
                            data: {
                                ...node.data,
                                isHighlighted: undefined,
                                isNeighbor: true,
                                neighborType: 'child',
                            },
                        };
                    }
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            isHighlighted: false,
                            isNeighbor: undefined,
                            neighborType: undefined,
                        },
                    };
                })
            );

            // Highlight edges
            setEdges((eds) =>
                eds.map((edge) => ({
                    ...edge,
                    data: {
                        ...edge.data,
                        isHighlighted: connectedEdgeIds.includes(edge.id),
                        isAnimated: connectedEdgeIds.includes(edge.id),
                    },
                }))
            );
        },
        [setNodes, setEdges]
    );

    /**
     * Handle node click
     */
    const handleNodeClick = useCallback(
        (node: ResourceNode, allNodes: Node[], allEdges: Edge[]) => {
            const nodeInfo: SelectedNodeInfo = {
                id: node.id,
                label: node.data.label,
                category: node.data.category,
                gtype: node.data.gtype,
                link: node.data.link,
                version: node.data.version,
            };
            setSelectedNode(nodeInfo);
            highlightNode(node.id, allNodes, allEdges);
        },
        [highlightNode]
    );

    /**
     * Handle canvas click (deselect)
     */
    const handleCanvasClick = useCallback(
        (allNodes: Node[], allEdges: Edge[]) => {
            setSelectedNode(null);
            highlightNode(null, allNodes, allEdges);
        },
        [highlightNode]
    );

    /**
     * Apply search filter
     */
    const applySearchFilter = useCallback(
        (term: string, nodes: ResourceNode[]) => {
            setSearchTerm(term);
            const searchMatchIds = filterNodesBySearchTerm(nodes, term);
            const categoryMatchIds = filterNodesByCategory(nodes, filterCategory);

            // If no search term and no category filter, clear all highlights
            if (!term && filterCategory === 'all') {
                setNodes((nds) =>
                    nds.map((node) => ({
                        ...node,
                        data: {
                            ...node.data,
                            isHighlighted: undefined,
                        },
                    }))
                );
                setEdges((eds) =>
                    eds.map((edge) => ({
                        ...edge,
                        data: {
                            ...edge.data,
                            isHighlighted: undefined,
                        },
                    }))
                );
                return;
            }

            // Highlight matching nodes, dim non-matching nodes
            setNodes((nds) =>
                nds.map((node) => {
                    const matches = nodeMatchesFilters(node.id, searchMatchIds, categoryMatchIds);
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            isHighlighted: matches ? true : false,
                        },
                    };
                })
            );

            // Highlight edges connected to matching nodes
            setEdges((eds) =>
                eds.map((edge) => {
                    const sourceMatches = nodeMatchesFilters(edge.source, searchMatchIds, categoryMatchIds);
                    const targetMatches = nodeMatchesFilters(edge.target, searchMatchIds, categoryMatchIds);
                    return {
                        ...edge,
                        data: {
                            ...edge.data,
                            isHighlighted: sourceMatches && targetMatches ? true : false,
                        },
                    };
                })
            );
        },
        [filterCategory, setNodes, setEdges]
    );

    /**
     * Apply category filter
     */
    const applyCategoryFilter = useCallback(
        (category: string, nodes: ResourceNode[]) => {
            setFilterCategory(category);
            const searchMatchIds = filterNodesBySearchTerm(nodes, searchTerm);
            const categoryMatchIds = filterNodesByCategory(nodes, category);

            // If no search term and no category filter, clear all highlights
            if (!searchTerm && category === 'all') {
                setNodes((nds) =>
                    nds.map((node) => ({
                        ...node,
                        data: {
                            ...node.data,
                            isHighlighted: undefined,
                        },
                    }))
                );
                setEdges((eds) =>
                    eds.map((edge) => ({
                        ...edge,
                        data: {
                            ...edge.data,
                            isHighlighted: undefined,
                        },
                    }))
                );
                return;
            }

            // Highlight matching nodes, dim non-matching nodes
            setNodes((nds) =>
                nds.map((node) => {
                    const matches = nodeMatchesFilters(node.id, searchMatchIds, categoryMatchIds);
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            isHighlighted: matches ? true : false,
                        },
                    };
                })
            );

            // Highlight edges connected to matching nodes
            setEdges((eds) =>
                eds.map((edge) => {
                    const sourceMatches = nodeMatchesFilters(edge.source, searchMatchIds, categoryMatchIds);
                    const targetMatches = nodeMatchesFilters(edge.target, searchMatchIds, categoryMatchIds);
                    return {
                        ...edge,
                        data: {
                            ...edge.data,
                            isHighlighted: sourceMatches && targetMatches ? true : false,
                        },
                    };
                })
            );
        },
        [searchTerm, setNodes, setEdges]
    );

    /**
     * Clear all filters
     */
    const clearFilters = useCallback(
        () => {
            setSearchTerm('');
            setFilterCategory('all');

            setNodes((nds) =>
                nds.map((node) => ({
                    ...node,
                    data: {
                        ...node.data,
                        isHighlighted: undefined,
                    },
                }))
            );

            setEdges((eds) =>
                eds.map((edge) => ({
                    ...edge,
                    data: {
                        ...edge.data,
                        isHighlighted: undefined,
                    },
                }))
            );
        },
        [setNodes, setEdges]
    );

    return {
        selectedNode,
        searchTerm,
        filterCategory,
        handleNodeClick,
        handleCanvasClick,
        applySearchFilter,
        applyCategoryFilter,
        clearFilters,
    };
};
