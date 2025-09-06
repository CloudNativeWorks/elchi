export interface RouteMapProps {
    name: string;
    collection: string;
    gtype: string;
    visible: boolean;
    version: string;
    onClose: () => void;
}

export interface RouteMapNode {
    data: {
        id: string;
        label: string;
        type: string;
        category: string;
        properties?: {
            description?: string;
            [key: string]: any;
        };
        metadata?: Record<string, any>;
        source?: string;
        resource_id?: string;
    };
}

export interface RouteMapEdge {
    data: {
        id: string;
        source: string;
        target: string;
        label: string;
        type: string;
        properties?: Record<string, any>;
    };
}

export interface RouteMapData {
    resource: {
        name: string;
        type: string;
        collection: string;
        project: string;
        version: string;
    };
    graph: {
        nodes: RouteMapNode[];
        edges: RouteMapEdge[];
    };
    stats: {
        nodes: number;
        edges: number;
    };
}