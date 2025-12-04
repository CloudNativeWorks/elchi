import React, { useState } from 'react';
import { Card, Spin, Button } from 'antd';
import { useCustomGetQuery } from '@/common/api';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { ReactFlowProvider } from '@xyflow/react';
import RouteMapFlowGraph from './RouteMapFlowGraph';
import SearchFilter from './SearchFilter';
import PopoverContent from './PopoverContent';
import { RouteMapGraphProps, RouteMapNode } from './types';
import { ThemeColors } from './themes';
import { transformApiDataToFlowData, getUniqueCategories } from './utils';
import { useNodeInteraction } from './hooks/useNodeInteraction';

/**
 * Inner Content Component (with React Flow context)
 * Single responsibility: Render graph content with controls
 */
const RouteMapGraphContent: React.FC<{
    routeMapData: any;
}> = ({ routeMapData }) => {
    const [selectedNode, setSelectedNode] = useState<RouteMapNode | null>(null);
    const { applySearchFilter, applyCategoryFilter, clearFilters } = useNodeInteraction();

    // Transform data for category extraction
    const { nodes: transformedNodes } = transformApiDataToFlowData(routeMapData);
    const nodeTypes = getUniqueCategories(transformedNodes);

    const handleNodeSelect = (node: RouteMapNode | null) => {
        setSelectedNode(node);
    };

    const handleSearch = (term: string) => {
        applySearchFilter(term, transformedNodes);
    };

    const handleFilter = (category: string) => {
        applyCategoryFilter(category, transformedNodes);
    };

    const handleClearFilters = () => {
        clearFilters();
    };

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                background: ThemeColors.background,
                borderRadius: '12px',
                overflow: 'hidden',
            }}
        >
            {/* React Flow Graph */}
            <div style={{ width: '100%', height: '100%' }}>
                <RouteMapFlowGraph
                    routeMapData={routeMapData}
                    onNodeSelect={handleNodeSelect}
                />
            </div>

            {/* Search & Filter Controls */}
            <div
                style={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    zIndex: 1000,
                }}
            >
                <Card
                    size="small"
                    style={{
                        background: ThemeColors.glass.background,
                        backdropFilter: ThemeColors.glass.backdrop,
                        boxShadow: ThemeColors.glass.shadow,
                        border: `1px solid ${ThemeColors.glass.border}`,
                        borderRadius: '12px',
                    }}
                    styles={{
                        body: {
                            padding: '12px',
                        },
                    }}
                >
                    <SearchFilter
                        onSearch={handleSearch}
                        onFilter={handleFilter}
                        onClear={handleClearFilters}
                        nodeTypes={nodeTypes}
                    />
                </Card>
            </div>

            {/* Selected Node Details */}
            {selectedNode && (
                <div
                    style={{
                        position: 'absolute',
                        bottom: 16,
                        left: 16,
                        zIndex: 1010,
                    }}
                >
                    <PopoverContent
                        nodeLabel={selectedNode.data.label}
                        category={selectedNode.data.category}
                        originalCategory={selectedNode.data.originalCategory}
                        gtype={selectedNode.data.gtype}
                        link={selectedNode.data.link}
                        id={selectedNode.id}
                        version={selectedNode.data.version}
                        type={selectedNode.data.type}
                        source={selectedNode.data.source}
                        resource_id={selectedNode.data.resource_id}
                        properties={selectedNode.data.properties}
                    />
                </div>
            )}
        </div>
    );
};

/**
 * Main RouteMap Graph Page Component
 * Single responsibility: Manage data fetching and full page display
 */
const RouteMapGraph: React.FC<RouteMapGraphProps> = ({
    name,
    collection,
    gtype,
    version,
}) => {
    const { project } = useProjectVariable();

    const {
        isLoading,
        error,
        data: routeMapData,
        isFetching,
        refetch,
    } = useCustomGetQuery({
        queryKey: `query_${name}_${collection}`,
        enabled: true,
        path: `routemap/${name}?project=${project}&collection=${collection}&gtype=${gtype}&version=${version}`,
    });

    // Render loading state
    if (isLoading || isFetching) {
        return (
            <div
                style={{
                    width: '100%',
                    height: 'calc(100vh - 120px)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: ThemeColors.backgroundSolid,
                }}
            >
                <div style={{ textAlign: 'center' }}>
                    <Spin size="large" />
                    <p style={{ marginTop: 15, color: '#64748b', fontSize: '14px' }}>
                        Loading route map graph...
                    </p>
                </div>
            </div>
        );
    }

    // Render error state
    if (error) {
        return (
            <div
                style={{
                    width: '100%',
                    height: 'calc(100vh - 120px)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: ThemeColors.backgroundSolid,
                }}
            >
                <div
                    style={{
                        textAlign: 'center',
                        padding: '40px',
                        background: ThemeColors.glass.background,
                        backdropFilter: ThemeColors.glass.backdrop,
                        border: `1px solid ${ThemeColors.glass.border}`,
                        borderRadius: '16px',
                        boxShadow: ThemeColors.glass.shadow,
                        maxWidth: '500px',
                    }}
                >
                    <div style={{ color: '#ef4444', marginBottom: '20px', fontSize: '16px', fontWeight: 600 }}>
                        Failed to load route map data
                    </div>
                    <div style={{ color: '#64748b', marginBottom: '24px', fontSize: '14px' }}>
                        {error.toString()}
                    </div>
                    <Button onClick={() => refetch()} type="primary" size="large">
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    // Check if data exists
    const hasData =
        routeMapData &&
        routeMapData.graph &&
        ((routeMapData.graph.nodes && routeMapData.graph.nodes.length > 0) ||
            (routeMapData.graph.edges && routeMapData.graph.edges.length > 0));

    if (!hasData) {
        return (
            <div
                style={{
                    width: '100%',
                    height: 'calc(100vh - 120px)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: ThemeColors.backgroundSolid,
                }}
            >
                <div
                    style={{
                        textAlign: 'center',
                        padding: '40px',
                        background: ThemeColors.glass.background,
                        backdropFilter: ThemeColors.glass.backdrop,
                        border: `1px solid ${ThemeColors.glass.border}`,
                        borderRadius: '16px',
                        boxShadow: ThemeColors.glass.shadow,
                        maxWidth: '500px',
                    }}
                >
                    <div style={{ marginBottom: '16px', fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>
                        No Route Map Found
                    </div>
                    <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '8px' }}>
                        No route map data found for this resource.
                    </p>
                    <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '24px' }}>
                        Resource: {name} | Collection: {collection} | Type: {gtype}
                    </p>
                    <Button onClick={() => refetch()} type="primary" size="large">
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    // Render main graph
    return (
        <div
            style={{
                width: '100%',
                height: 'calc(100vh - 120px)',
                background: ThemeColors.backgroundSolid,
                overflow: 'hidden',
            }}
        >
            <ReactFlowProvider>
                <RouteMapGraphContent routeMapData={routeMapData.graph} />
            </ReactFlowProvider>
        </div>
    );
};

export default RouteMapGraph;
