import { Node, Edge } from '@xyflow/react';

/**
 * Resource category types for Envoy proxy configuration
 */
export type ResourceCategory =
    | 'listeners'
    | 'clusters'
    | 'routes'
    | 'filters'
    | 'endpoints'
    | 'tls'
    | 'secrets'
    | 'bootstrap'
    | 'extensions'
    | 'virtual_hosts'
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
 * API response structure for dependency graph
 */
export interface DependencyApiResponse {
    nodes?: ApiNode[];
    edges?: ApiEdge[];
    elements?: Array<ApiNode | ApiEdge>;
}

/**
 * Custom data attached to React Flow nodes
 */
export interface ResourceNodeData extends Record<string, unknown> {
    label: string;
    category: ResourceCategory;
    gtype: string;
    link: string;
    version?: string;
    first?: boolean;
    isHighlighted?: boolean;
    isNeighbor?: boolean;
    neighborType?: 'parent' | 'child';
}

/**
 * Custom data attached to React Flow edges
 */
export interface ResourceEdgeData extends Record<string, unknown> {
    label?: string;
    isHighlighted?: boolean;
    isAnimated?: boolean;
}

/**
 * React Flow node type with custom data
 */
export type ResourceNode = Node<ResourceNodeData>;

/**
 * React Flow edge type with custom data
 */
export type ResourceEdge = Edge<ResourceEdgeData>;

/**
 * Layout direction options
 */
export type LayoutDirection = 'LR' | 'RL' | 'TB' | 'BT';

/**
 * Layout algorithm options
 */
export type LayoutAlgorithm = 'elk' | 'dagre';

/**
 * Component props for the main dependency graph page
 */
export interface DependencyGraphProps {
    name: string;
    collection: string;
    gtype: string;
    version: string;
}

/**
 * Props for the React Flow graph component
 */
export interface DependencyFlowGraphProps {
    dependencies: DependencyApiResponse;
    onNodeClick?: (node: ResourceNode) => void;
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
 * Graph controls props
 */
export interface GraphControlsProps {
    onZoomIn: () => void;
    onZoomOut: () => void;
    onFit: () => void;
    onLayoutChange?: (direction: LayoutDirection) => void;
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
    gtype: string;
    link: string;
    id: string;
    version?: string;
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

/**
 * Graph interaction state
 */
export interface GraphInteractionState {
    selectedNodeId: string | null;
    highlightedNodeIds: Set<string>;
    highlightedEdgeIds: Set<string>;
    searchTerm: string;
    filterCategory: string;
}
