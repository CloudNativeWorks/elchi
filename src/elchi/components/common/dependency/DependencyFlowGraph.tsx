import React, { useEffect, useCallback, useMemo } from 'react';
import {
    ReactFlow,
    Background,
    MiniMap,
    Controls,
    ControlButton,
    useNodesState,
    useEdgesState,
    useReactFlow,
    getNodesBounds,
    getViewportForBounds,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { DownloadOutlined } from '@ant-design/icons';
import ResourceNode from './nodes/ResourceNode';
import AnimatedEdge from './edges/AnimatedEdge';
import { DependencyFlowGraphProps, ResourceNode as ResourceNodeType } from './types';
import { transformApiDataToFlowData } from './utils';
import { useGraphLayout } from './hooks/useGraphLayout';
import { useNodeInteraction } from './hooks/useNodeInteraction';
import { ThemeColors } from './themes';

/**
 * Internal Flow Component
 * Single responsibility: Render React Flow with data
 */
const FlowInner: React.FC<DependencyFlowGraphProps & { onNodeSelect: (node: ResourceNodeType | null) => void }> = ({
    dependencies,
    onNodeSelect,
}) => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const { applyLayout } = useGraphLayout();
    const { selectedNode, handleNodeClick, handleCanvasClick } = useNodeInteraction();
    const { getNodes } = useReactFlow();

    // Memoize node and edge types to prevent re-renders
    const nodeTypes = useMemo(() => ({ resourceNode: ResourceNode as any }), []);
    const edgeTypes = useMemo(() => ({ animatedEdge: AnimatedEdge as any }), []);

    // Transform API data to React Flow format
    useEffect(() => {
        const { nodes: transformedNodes, edges: transformedEdges } = transformApiDataToFlowData(dependencies);
        setNodes(transformedNodes);
        setEdges(transformedEdges);

        // Apply layout after data is set
        if (transformedNodes.length > 0) {
            setTimeout(() => {
                applyLayout(transformedNodes, transformedEdges);
            }, 100);
        }
    }, [dependencies, applyLayout, setNodes, setEdges]);

    // Notify parent of selected node
    useEffect(() => {
        if (selectedNode) {
            const foundNode = nodes.find((n) => n.id === selectedNode.id) as ResourceNodeType | undefined;
            onNodeSelect(foundNode || null);
        } else {
            onNodeSelect(null);
        }
    }, [selectedNode, nodes, onNodeSelect]);

    // Handle node click
    const onNodeClick = useCallback(
        (_event: React.MouseEvent, node: ResourceNodeType) => {
            handleNodeClick(node, nodes, edges);
        },
        [handleNodeClick, nodes, edges]
    );

    // Handle pane click (canvas click)
    const onPaneClick = useCallback(() => {
        handleCanvasClick(nodes, edges);
    }, [handleCanvasClick, nodes, edges]);

    // Minimap node color
    const minimapNodeColor = useCallback((node: any) => {
        if (node?.data?.category) {
            const nodeStyle = ThemeColors.node[node.data.category as string] || ThemeColors.node.default;
            return nodeStyle.border;
        }
        return ThemeColors.node.default.border;
    }, []);

    // Download graph as PNG image
    const handleDownload = useCallback(() => {
        const currentNodes = getNodes();
        const nodesBounds = getNodesBounds(currentNodes);
        const imageWidth = 2560;
        const imageHeight = 1440;

        // Calculate viewport to center all nodes
        const viewport = getViewportForBounds(
            nodesBounds,
            imageWidth,
            imageHeight,
            0.1, // min zoom - allow more flexibility
            4, // max zoom - allow closer view
            0.1 // less padding for tighter fit
        );

        // Get the wrapper element
        const reactFlowWrapper = document.querySelector('.react-flow') as HTMLElement;
        if (!reactFlowWrapper) return;

        // Temporarily apply the calculated viewport transform
        const viewportElement = document.querySelector('.react-flow__viewport') as HTMLElement;
        if (!viewportElement) return;

        const originalTransform = viewportElement.style.transform;

        // Apply centered transform
        viewportElement.style.transform = `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`;

        // Wait a moment for transform to apply, then capture
        setTimeout(() => {
            import('html-to-image').then(({ toPng }) => {
                toPng(reactFlowWrapper, {
                    backgroundColor: 'var(--dependency-bg, #f8fafc)',
                    width: imageWidth,
                    height: imageHeight,
                    pixelRatio: 3, // High quality: 3x pixel density
                    quality: 1.0,
                    filter: (node) => {
                        // Exclude controls, minimap
                        if (node.classList) {
                            return (
                                !node.classList.contains('react-flow__controls') &&
                                !node.classList.contains('react-flow__minimap')
                            );
                        }
                        return true;
                    },
                })
                    .then((dataUrl) => {
                        // Restore original transform
                        viewportElement.style.transform = originalTransform;

                        const link = document.createElement('a');
                        link.download = `dependency-${new Date().toISOString().split('T')[0]}.png`;
                        link.href = dataUrl;
                        link.click();
                    })
                    .catch((err) => {
                        // Restore original transform on error
                        viewportElement.style.transform = originalTransform;
                        console.error('Failed to download image:', err);
                    });
            });
        }, 100);
    }, [getNodes]);

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            minZoom={0.1}
            maxZoom={2}
            defaultEdgeOptions={{
                type: 'animatedEdge',
                animated: false,
            }}
            proOptions={{ hideAttribution: true }}
        >
            <Background color="var(--dependency-grid, #e2e8f0)" gap={16} size={1} />
            <Controls position="bottom-left">
                <ControlButton onClick={handleDownload} title="Download as PNG image">
                    <DownloadOutlined style={{ fontSize: '16px' }} />
                </ControlButton>
            </Controls>
            <MiniMap
                nodeColor={minimapNodeColor}
                position="bottom-right"
                style={{
                    background: ThemeColors.glass.background,
                    border: `1px solid ${ThemeColors.glass.border}`,
                    borderRadius: '8px',
                }}
                pannable
                zoomable
            />
        </ReactFlow>
    );
};

/**
 * Dependency Flow Graph Component
 * Single responsibility: Export FlowInner (Provider is in parent)
 */
const DependencyFlowGraph: React.FC<DependencyFlowGraphProps & { onNodeSelect: (node: ResourceNodeType | null) => void }> = (props) => {
    return <FlowInner {...props} />;
};

export default DependencyFlowGraph;
