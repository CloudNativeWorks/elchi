import { Edge } from '@xyflow/react';
import {
    ApiNode,
    ApiEdge,
    DependencyApiResponse,
    ResourceNode,
    ResourceEdge,
    ResourceCategory,
} from './types';

/**
 * Type guard to check if element is ApiNode
 */
const isApiNode = (el: ApiNode | ApiEdge): el is ApiNode => {
    return el.group === 'nodes' || (!el.group && !('source' in el));
};

/**
 * Type guard to check if element is ApiEdge
 */
const isApiEdge = (el: ApiNode | ApiEdge): el is ApiEdge => {
    return el.group === 'edges' || ('source' in el && 'target' in el);
};

/**
 * Transform API response to React Flow compatible format
 * Single responsibility: Data transformation
 */
export const transformApiDataToFlowData = (
    apiData: DependencyApiResponse
): { nodes: ResourceNode[]; edges: ResourceEdge[] } => {
    const nodes: ResourceNode[] = [];
    const edges: ResourceEdge[] = [];

    // Extract nodes from API response
    let apiNodes: ApiNode[] = [];
    if (apiData.nodes && Array.isArray(apiData.nodes)) {
        apiNodes = apiData.nodes;
    } else if (apiData.elements && Array.isArray(apiData.elements)) {
        apiNodes = apiData.elements.filter(isApiNode);
    } else if (Array.isArray(apiData)) {
        apiNodes = (apiData as Array<ApiNode | ApiEdge>).filter(isApiNode);
    }

    // Extract edges from API response
    let apiEdges: ApiEdge[] = [];
    if (apiData.edges && Array.isArray(apiData.edges)) {
        apiEdges = apiData.edges;
    } else if (apiData.elements && Array.isArray(apiData.elements)) {
        apiEdges = apiData.elements.filter(isApiEdge);
    } else if (Array.isArray(apiData)) {
        apiEdges = (apiData as Array<ApiNode | ApiEdge>).filter(isApiEdge);
    }

    // Transform nodes
    apiNodes.forEach((apiNode) => {
        const nodeData = apiNode.data || apiNode;
        const label = nodeData.label || nodeData.name || nodeData.id || 'Unknown';
        const category = (nodeData.category || nodeData.type || 'default').toLowerCase() as ResourceCategory;

        nodes.push({
            id: nodeData.id || `node-${Math.random().toString(36).substr(2, 9)}`,
            type: 'resourceNode',
            position: { x: 0, y: 0 }, // Will be set by layout
            data: {
                label,
                category,
                gtype: nodeData.gtype || '',
                link: nodeData.link || '',
                version: nodeData.version,
                first: nodeData.first || false,
                count: nodeData.count,
            },
        });
    });

    // Transform edges
    apiEdges.forEach((apiEdge) => {
        const edgeData = apiEdge.data || apiEdge;
        if (!edgeData.source || !edgeData.target) {
            return; // Skip invalid edges
        }

        edges.push({
            id: edgeData.id || `edge-${edgeData.source}-${edgeData.target}`,
            source: edgeData.source,
            target: edgeData.target,
            type: 'animatedEdge',
            data: {
                label: edgeData.label || '',
            },
        });
    });

    return { nodes, edges };
};

/**
 * Get all neighbor node IDs (both incoming and outgoing)
 * Single responsibility: Graph traversal
 */
export const getNeighborNodeIds = (
    nodeId: string,
    edges: Edge[]
): { parents: string[]; children: string[] } => {
    const parents: string[] = [];
    const children: string[] = [];

    edges.forEach((edge) => {
        if (edge.target === nodeId) {
            parents.push(edge.source);
        }
        if (edge.source === nodeId) {
            children.push(edge.target);
        }
    });

    return { parents, children };
};

/**
 * Get all connected edge IDs for a node
 * Single responsibility: Edge filtering
 */
export const getConnectedEdgeIds = (nodeId: string, edges: Edge[]): string[] => {
    return edges
        .filter((edge) => edge.source === nodeId || edge.target === nodeId)
        .map((edge) => edge.id);
};

/**
 * Filter nodes by search term
 * Single responsibility: Search filtering
 */
export const filterNodesBySearchTerm = (
    nodes: ResourceNode[],
    searchTerm: string
): Set<string> => {
    if (!searchTerm) {
        return new Set(nodes.map((n) => n.id));
    }

    const term = searchTerm.toLowerCase();
    const matchingIds = new Set<string>();

    nodes.forEach((node) => {
        const label = node.data.label.toLowerCase();
        const category = node.data.category.toLowerCase();

        if (label.includes(term) || category.includes(term)) {
            matchingIds.add(node.id);
        }
    });

    return matchingIds;
};

/**
 * Filter nodes by category
 * Single responsibility: Category filtering
 */
export const filterNodesByCategory = (
    nodes: ResourceNode[],
    category: string
): Set<string> => {
    if (!category || category === 'all') {
        return new Set(nodes.map((n) => n.id));
    }

    const matchingIds = new Set<string>();
    const categoryLower = category.toLowerCase();

    nodes.forEach((node) => {
        if (node.data.category.toLowerCase().includes(categoryLower)) {
            matchingIds.add(node.id);
        }
    });

    return matchingIds;
};

/**
 * Get unique categories from nodes
 * Single responsibility: Category extraction
 */
export const getUniqueCategories = (nodes: ResourceNode[]): string[] => {
    const categories = new Set<string>();

    nodes.forEach((node) => {
        categories.add(node.data.category);
    });

    return Array.from(categories).sort();
};

/**
 * Check if node matches filters
 * Single responsibility: Filter matching
 */
export const nodeMatchesFilters = (
    nodeId: string,
    searchMatchIds: Set<string>,
    categoryMatchIds: Set<string>
): boolean => {
    return searchMatchIds.has(nodeId) && categoryMatchIds.has(nodeId);
};
