import { Node, Edge } from '@xyflow/react';

/**
 * Route map node types
 */
export type ResourceCategory =
    | 'virtual_host'
    | 'domain'
    | 'route'
    | 'route_config'
    | 'match'
    | 'cluster'
    | 'weighted_cluster'
    | 'redirect'
    | 'direct_response'
    | 'action'
    | 'policy'
    | 'vhds'
    | 'default';

/**
 * API response node structure
 */
export interface ApiNode {
    id: string;
    label?: string;
    name?: string;
    category?: string;
    type?: string;
    gtype?: string;
    first?: boolean;
    link?: string;
    version?: string;
    source?: string;
    resource_id?: string;
    properties?: Record<string, any>;
    data?: ApiNodeData;
    group?: string;
}

export interface ApiNodeData {
    id: string;
    label?: string;
    name?: string;
    category?: string;
    type?: string;
    gtype?: string;
    first?: boolean;
    link?: string;
    version?: string;
    source?: string;
    resource_id?: string;
    properties?: Record<string, any>;
}

/**
 * API response edge structure
 */
export interface ApiEdge {
    id?: string;
    source: string;
    target: string;
    label?: string;
    data?: ApiEdgeData;
    group?: string;
}

export interface ApiEdgeData {
    id?: string;
    source: string;
    target: string;
    label?: string;
}

/**
 * API response structure for route map graph
 */
export interface RouteMapApiResponse {
    resource?: {
        name: string;
        type: string;
        collection: string;
        project: string;
        version: string;
    };
    graph?: {
        nodes?: ApiNode[];
        edges?: ApiEdge[];
        elements?: Array<ApiNode | ApiEdge>;
    };
    stats?: {
        nodes: number;
        edges: number;
    };
    // Direct properties for backward compatibility
    nodes?: ApiNode[];
    edges?: ApiEdge[];
    elements?: Array<ApiNode | ApiEdge>;
}

/**
 * Custom data attached to React Flow nodes
 */
export interface RouteMapNodeData extends Record<string, unknown> {
    label: string;
    category: ResourceCategory;
    originalCategory?: string;
    gtype: string;
    link: string;
    version?: string;
    first?: boolean;
    isHighlighted?: boolean;
    isNeighbor?: boolean;
    neighborType?: 'parent' | 'child';
    source?: string;
    resource_id?: string;
    properties?: Record<string, any>;
    type?: string;
}

/**
 * Custom data attached to React Flow edges
 */
export interface RouteMapEdgeData extends Record<string, unknown> {
    label?: string;
    isHighlighted?: boolean;
    isAnimated?: boolean;
}

/**
 * React Flow node type with custom data
 */
export type RouteMapNode = Node<RouteMapNodeData>;

/**
 * React Flow edge type with custom data
 */
export type RouteMapEdge = Edge<RouteMapEdgeData>;

/**
 * Layout direction options
 */
export type LayoutDirection = 'LR' | 'RL' | 'TB' | 'BT';

/**
 * Component props for the main route map graph page
 */
export interface RouteMapGraphProps {
    name: string;
    collection: string;
    gtype: string;
    version: string;
}

/**
 * Props for the React Flow graph component
 */
export interface RouteMapFlowGraphProps {
    routeMapData: {
        nodes?: ApiNode[];
        edges?: ApiEdge[];
        elements?: Array<ApiNode | ApiEdge>;
    };
    onNodeClick?: (node: RouteMapNode) => void;
    onCanvasClick?: () => void;
}

/**
 * Selected node information
 */
export interface SelectedNodeInfo {
    id: string;
    label: string;
    category: ResourceCategory;
    gtype: string;
    link: string;
    version?: string;
}

/**
 * Search filter props
 */
export interface SearchFilterProps {
    onSearch: (term: string) => void;
    onFilter: (category: string) => void;
    onClear: () => void;
    nodeTypes: string[];
}

/**
 * Node popover content props
 */
export interface PopoverContentProps {
    nodeLabel: string;
    category: string;
    originalCategory?: string;
    gtype: string;
    link: string;
    id: string;
    version?: string;
    type?: string;
    source?: string;
    resource_id?: string;
    properties?: Record<string, any>;
}

/**
 * ELK layout options
 */
export interface ElkLayoutOptions {
    direction: LayoutDirection;
    nodeSpacing?: number;
    layerSpacing?: number;
    edgeSpacing?: number;
}
