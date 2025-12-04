import { Edge } from '@xyflow/react';
import {
    ApiNode,
    ApiEdge,
    RouteMapApiResponse,
    RouteMapNode,
    RouteMapEdge,
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
    apiData: RouteMapApiResponse
): { nodes: RouteMapNode[]; edges: RouteMapEdge[] } => {
    const nodes: RouteMapNode[] = [];
    const edges: RouteMapEdge[] = [];

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

        // Determine category: prefer type over category for accurate categorization
        // If type is redirect/direct_response/retry/etc, use that as category
        // Otherwise fall back to category field
        let category: ResourceCategory;
        const typeValue = nodeData.type?.toLowerCase();
        const categoryValue = nodeData.category?.toLowerCase();

        // Map specific types to proper categories
        // Type field has priority for specific node types
        if (typeValue === 'redirect') {
            category = 'redirect';
        } else if (typeValue === 'direct_response' || typeValue === 'directresponse') {
            category = 'direct_response';
        } else if (typeValue === 'retry' || typeValue === 'timeout' || typeValue === 'cors') {
            category = 'policy';
        } else if (typeValue === 'cluster') {
            // Cluster type should always be cluster category (red color)
            category = 'cluster';
        } else if (typeValue === 'virtual_host' || typeValue === 'virtualhost') {
            category = 'virtual_host';
        } else if (typeValue === 'domain') {
            category = 'domain';
        } else if (typeValue === 'route') {
            category = 'route';
        } else if (typeValue === 'route_config' || typeValue === 'routeconfig') {
            category = 'route_config';
        } else if (typeValue === 'match') {
            category = 'match';
        } else if (typeValue === 'weighted_cluster' || typeValue === 'weightedcluster') {
            category = 'weighted_cluster';
        } else if (typeValue === 'vhds') {
            category = 'vhds';
        } else {
            // Use category field, or fall back to type, or default
            category = (categoryValue || typeValue || 'default') as ResourceCategory;
        }

        nodes.push({
            id: nodeData.id || `node-${Math.random().toString(36).substr(2, 9)}`,
            type: 'resourceNode',
            position: { x: 0, y: 0 }, // Will be set by layout
            data: {
                label,
                category,
                originalCategory: nodeData.category, // Preserve original category from API
                gtype: nodeData.gtype || '',
                link: nodeData.link || '',
                version: nodeData.version,
                first: nodeData.first || false,
                type: nodeData.type,
                source: nodeData.source,
                resource_id: nodeData.resource_id,
                properties: nodeData.properties,
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
    nodes: RouteMapNode[],
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
    nodes: RouteMapNode[],
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
export const getUniqueCategories = (nodes: RouteMapNode[]): string[] => {
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

/**
 * Generate unique ID
 * Single responsibility: ID generation
 */
export const generateId = (prefix: string = 'id'): string => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Calculate adaptive node dimensions based on count
 * Single responsibility: Dimension calculation
 */
export const calculateNodeDimensions = (nodeCount: number): { width: number; height: number } => {
    if (nodeCount === 1) return { width: 180, height: 100 };
    if (nodeCount <= 5) return { width: 160, height: 90 };
    if (nodeCount <= 15) return { width: 140, height: 80 };
    if (nodeCount <= 30) return { width: 120, height: 70 };
    return { width: 100, height: 60 };
};
