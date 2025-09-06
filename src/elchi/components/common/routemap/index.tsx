import React, { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import { Button, Card, Drawer, Spin, Tag, Space, Typography } from 'antd';
import { ShareAltOutlined, ReloadOutlined } from '@ant-design/icons';
import { useRouteMapOperations } from '@/hooks/useRouteMapOperations';
import { ThemeColors } from '../dependency/themes';
import GraphControls from '../dependency/GraphControls';
import SearchFilter from '../dependency/SearchFilter';
import ElchiButton from '../ElchiButton';
import { RouteMapProps, RouteMapData } from './types';
import { createRouteMapGraph } from './RouteMapGraph';

const { Text } = Typography;

cytoscape.use(dagre);

const RouteMap: React.FC<RouteMapProps> = ({ name, collection, gtype, visible, version, onClose }) => {
    
    const handleClose = () => {        
        // Clear state first to trigger React updates
        setSelectedNode(null);
        setGraphInitialized(false);
        
        // Use setTimeout to defer cleanup until after React's render cycle
        setTimeout(() => {
            if (cyRef.current) {
                try {
                    cyRef.current.removeAllListeners();
                    cyRef.current.unmount();
                    cyRef.current.destroy();
                } catch (error) {
                    console.error('[RouteMap] Error destroying cytoscape on close:', error);
                } finally {
                    cyRef.current = null;
                }
            }
            
            if (containerRef.current) {
                // Clone and replace container to avoid React DOM conflicts
                const parent = containerRef.current.parentNode;
                if (parent) {
                    const newContainer = containerRef.current.cloneNode(false) as HTMLDivElement;
                    parent.replaceChild(newContainer, containerRef.current);
                    containerRef.current = newContainer;
                }
            }
        }, 0);
        
        onClose();
    };
    const containerRef = useRef<HTMLDivElement | null>(null);
    const cyRef = useRef<cytoscape.Core | null>(null);
    const { getRouteMap } = useRouteMapOperations();
    const [selectedNode, setSelectedNode] = useState<{
        label: string;
        category: string;
        gtype: string;
        link: string;
        id: string;
        description?: string;
    } | null>(null);
    const [graphInitialized, setGraphInitialized] = useState(false);
    const [forceRender, setForceRender] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    const { isLoading, error, data: routeMapData, isFetching, refetch } = getRouteMap(name, gtype, collection, version);

    const handleZoomIn = () => {
        if (cyRef.current) {
            cyRef.current.zoom(cyRef.current.zoom() * 1.2);
            cyRef.current.center();
        }
    };

    const handleZoomOut = () => {
        if (cyRef.current) {
            cyRef.current.zoom(cyRef.current.zoom() * 0.8);
            cyRef.current.center();
        }
    };

    const handleFit = () => {
        if (cyRef.current) {
            cyRef.current.fit();
            cyRef.current.center();
        }
    };

    const handleLayoutChange = (layout: string) => {
        if (cyRef.current) {
            let layoutOptions: cytoscape.LayoutOptions;

            switch (layout) {
                case 'circle':
                    layoutOptions = {
                        name: 'circle',
                        padding: 50,
                        animate: true,
                        nodeSep: 180,
                        edgeSep: 120,
                        spacingFactor: 1.5,
                        animationDuration: 500
                    } as cytoscape.LayoutOptions;
                    break;
                case 'grid':
                    layoutOptions = {
                        name: 'grid',
                        padding: 50,
                        animate: true,
                        nodeSep: 180,
                        edgeSep: 120,
                        spacingFactor: 1.5,
                        animationDuration: 500
                    } as cytoscape.LayoutOptions;
                    break;
                default: // dagre
                    layoutOptions = {
                        name: 'dagre',
                        spacingFactor: 1.8,
                        nodeSep: 200,
                        edgeSep: 150,
                        rankSep: 300,
                        rankDir: 'TB',
                        align: 'UL',
                        ranker: 'network-simplex',
                        fit: true,
                        padding: 60,
                        animate: true,
                        animationDuration: 800,
                        acyclicer: 'greedy',
                        stop: function () {
                            if (cyRef.current) {
                                cyRef.current.fit();
                                cyRef.current.center();
                            }
                        }
                    } as cytoscape.LayoutOptions;
            }

            if (cyRef.current) {
                cyRef.current.zoom(1);
                cyRef.current.center();

                const layout = cyRef.current.layout(layoutOptions);
                layout.run();
                layout.on('layoutstop', () => {
                    if (cyRef.current) {
                        cyRef.current.fit();
                        cyRef.current.center();
                    }
                });
            }
        }
    };

    const handleSearch = (searchValue: string) => {
        setSearchTerm(searchValue);
        if (cyRef.current) {
            cyRef.current.nodes().forEach(node => {
                const label = node.data('label').toLowerCase();
                const category = node.data('category').toLowerCase();
                const isMatch = label.includes(searchValue.toLowerCase()) ||
                    category.includes(searchValue.toLowerCase());

                if (searchValue === '' || isMatch) {
                    node.style({ 'opacity': 1 });
                } else {
                    node.style({ 'opacity': 0.2 });
                }
            });
        }
    };

    const handleFilter = (filterValue: string) => {
        setFilterType(filterValue);
        if (cyRef.current) {
            cyRef.current.nodes().forEach(node => {
                const category = node.data('category').toLowerCase();
                const isMatch = filterValue === 'all' || category.includes(filterValue.toLowerCase());

                if (isMatch) {
                    node.style({ 'display': 'element' });
                } else {
                    node.style({ 'display': 'none' });
                }
            });
        }
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setFilterType('all');
        if (cyRef.current) {
            cyRef.current.nodes().forEach(node => {
                node.style({
                    'opacity': 1,
                    'display': 'element'
                });
            });
        }
    };

    const getUniqueNodeTypes = () => {
        if (!routeMapData || !routeMapData.graph) return [];

        const nodes = routeMapData.graph.nodes || [];
        const types = new Set<string>();

        nodes.forEach((node: any) => {
            const category = node.data.category || node.data.type || 'default';
            types.add(category.toLowerCase());
        });

        return Array.from(types);
    };

    useEffect(() => {
        
        if (visible) {
            setGraphInitialized(false);
            setSelectedNode(null);

            // Clean up any existing Cytoscape instance
            if (cyRef.current) {
                try {
                    cyRef.current.removeAllListeners();
                    cyRef.current.unmount();
                    cyRef.current.destroy();
                } catch (error) {
                    console.error('[RouteMap useEffect] Error destroying cytoscape:', error);
                }
                cyRef.current = null;
            }

            // Clean container if it exists
            if (containerRef.current) {
                // Clean up labels
                const labels = containerRef.current.querySelectorAll('.routemap-node-label');
                labels.forEach(label => label.remove());
                containerRef.current.innerHTML = '';
            }

            refetch().then(() => {
                setForceRender(prev => prev + 1);
            }).catch(() => {
                //
            });
        } else if (!visible && cyRef.current) {
            setSelectedNode(null);
            setGraphInitialized(false);
            
            // Defer cleanup to avoid React DOM conflicts
            const cleanup = () => {
                if (cyRef.current) {
                    try {
                        cyRef.current.removeAllListeners();
                        cyRef.current.unmount();
                        cyRef.current.destroy();
                    } catch (error) {
                        console.error('[RouteMap useEffect] Error destroying cytoscape on hide:', error);
                    }
                    cyRef.current = null;
                }
            };
            
            setTimeout(cleanup, 0);
        }

        return () => {            
            // Clear state immediately
            setSelectedNode(null);
            setGraphInitialized(false);
            
            // Store references for cleanup
            const cy = cyRef.current;
            const container = containerRef.current;
            
            // Clear refs immediately to prevent further access
            cyRef.current = null;
            containerRef.current = null;
            
            // Defer actual cleanup to avoid React DOM conflicts
            setTimeout(() => {
                if (cy) {
                    try {
                        cy.removeAllListeners();
                        cy.unmount();
                        cy.destroy();
                    } catch (error) {
                        console.error('[RouteMap useEffect cleanup] Error destroying cytoscape in cleanup:', error);
                    }
                }
                
                if (container && container.parentNode) {
                    container.innerHTML = '';
                }
            }, 0);
        };
    }, [visible, refetch]);

    useEffect(() => {        
        if (routeMapData && containerRef.current && visible && !graphInitialized) {
            
            try {
                setGraphInitialized(true);

                cyRef.current = createRouteMapGraph(
                    containerRef.current,
                    routeMapData as RouteMapData,
                    {
                        onNodeTap: (node) => {
                            setSelectedNode({
                                label: node.data('label'),
                                category: node.data('category') || node.data('type'),
                                gtype: gtype, // Use the main resource gtype
                                link: '', // Route map doesn't have direct links
                                id: node.id(),
                                description: node.data('properties')?.description
                            });
                        },
                        onCanvasTap: () => {
                            setSelectedNode(null);
                        }
                    }
                );
            } catch (error) {
                console.error("[RouteMap graph creation] Error creating route map graph:", error);
                setGraphInitialized(false);
            }
        }
    }, [routeMapData, visible, graphInitialized, forceRender, gtype]);

    const renderModalContent = () => {
        if (isLoading || isFetching) {
            return (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    zIndex: 1000
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <Spin size="large" />
                        <p style={{ marginTop: 15, color: '#666' }}>Loading route map...</p>
                    </div>
                </div>
            );
        }

        if (error) {
            return (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                    <div style={{ color: 'red', marginBottom: '15px' }}>
                        Error loading route map data: {error.toString()}
                    </div>
                    <Button onClick={() => refetch()} type="primary">
                        Retry
                    </Button>
                </div>
            );
        }

        const hasData = routeMapData && routeMapData.graph && (
            (routeMapData.graph.nodes && routeMapData.graph.nodes.length > 0) ||
            (routeMapData.graph.edges && routeMapData.graph.edges.length > 0)
        );

        if (!hasData) {
            return (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                    <div style={{ marginBottom: '15px' }}>
                        <p>No route map data found for this resource.</p>
                        <p>Resource: {name}, Collection: {collection}, Type: {gtype}</p>
                    </div>
                    <Button onClick={() => refetch()} type="primary">
                        Retry
                    </Button>
                </div>
            );
        }

        if (!graphInitialized && hasData) {
            return (
                <div
                    ref={containerRef}
                    style={{
                        width: '100%',
                        height: '100%',
                        position: 'relative',
                        backgroundColor: ThemeColors.background,
                        border: '1px solid #eee',
                        minHeight: '600px'
                    }}
                >
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        zIndex: 1000
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <Spin size="large" />
                            <p style={{ marginTop: 15, color: '#666' }}>Preparing route map graph...</p>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div
                ref={containerRef}
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    background: ThemeColors.background,
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    minHeight: '600px',
                    overflow: 'hidden'
                }}
            >
                {/* Stats Bar */}
                {routeMapData && routeMapData.stats && (
                    <div style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        zIndex: 1000,
                        display: 'flex',
                        gap: 8
                    }}>
                        <Tag color="blue">Nodes: {routeMapData.stats.nodes}</Tag>
                        <Tag color="green">Edges: {routeMapData.stats.edges}</Tag>
                        <Button
                            icon={<ReloadOutlined />}
                            size="small"
                            onClick={() => refetch()}
                            loading={isLoading || isFetching}
                        >
                            Refresh
                        </Button>
                    </div>
                )}

                {selectedNode && (
                    <div
                        style={{
                            position: 'absolute',
                            bottom: 10,
                            left: 10,
                            zIndex: 1010,
                        }}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                    >
                        <Card
                            size="small"
                            title="Node Details"
                            style={{
                                width: 300,
                                backgroundColor: ThemeColors.glass.background,
                                backdropFilter: ThemeColors.glass.backdrop,
                                boxShadow: ThemeColors.glass.shadow,
                                border: `1px solid ${ThemeColors.glass.border}`,
                                borderRadius: '12px',
                                pointerEvents: 'all'
                            }}
                        >
                            <div>
                                <Space direction="vertical" size={8} style={{ width: '100%' }}>
                                    <div>
                                        <Text strong style={{ fontSize: '14px', color: '#1890ff' }}>
                                            {selectedNode.label}
                                        </Text>
                                    </div>
                                    
                                    <div style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                                        <Text type="secondary" style={{ fontSize: '11px', fontWeight: 'bold' }}>
                                            Type:
                                        </Text>
                                        <Text style={{ fontSize: '12px', marginLeft: '8px' }}>
                                            {selectedNode.category}
                                        </Text>
                                    </div>
                                    
                                    {selectedNode.description && (
                                        <div style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                                            <Text type="secondary" style={{ fontSize: '11px', fontWeight: 'bold' }}>
                                                Description:
                                            </Text>
                                            <div style={{ marginTop: '4px' }}>
                                                <Text style={{ fontSize: '12px', lineHeight: '1.4' }}>
                                                    {selectedNode.description}
                                                </Text>
                                            </div>
                                        </div>
                                    )}
                                    
                                </Space>
                            </div>
                        </Card>
                    </div>
                )}

                <div style={{
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    zIndex: 1000,
                }}>
                    <SearchFilter
                        onSearch={handleSearch}
                        onFilter={handleFilter}
                        onClear={handleClearFilters}
                        nodeTypes={getUniqueNodeTypes()}
                    />
                </div>

                {!selectedNode && (
                    <div style={{
                        position: 'absolute',
                        bottom: 10,
                        left: 10,
                        zIndex: 1000,
                    }}>
                        <Card
                            size="small"
                            title="Graph Controls"
                            style={{
                                width: 'auto',
                                backgroundColor: ThemeColors.glass.background,
                                backdropFilter: ThemeColors.glass.backdrop,
                                boxShadow: ThemeColors.glass.shadow,
                                border: `1px solid ${ThemeColors.glass.border}`,
                                borderRadius: '12px'
                            }}
                            styles={{
                                body: {
                                    padding: '12px',
                                    paddingBottom: '12px'
                                }
                            }}
                        >
                            <GraphControls
                                onZoomIn={handleZoomIn}
                                onZoomOut={handleZoomOut}
                                onFit={handleFit}
                                onLayoutChange={handleLayoutChange}
                            />
                        </Card>
                    </div>
                )}

                {selectedNode && (
                    <div style={{
                        position: 'absolute',
                        bottom: 10,
                        right: 10,
                        zIndex: 1000,
                    }}>
                        <Card
                            size="small"
                            title="Graph Controls"
                            style={{
                                width: 'auto',
                                backgroundColor: ThemeColors.glass.background,
                                backdropFilter: ThemeColors.glass.backdrop,
                                boxShadow: ThemeColors.glass.shadow,
                                border: `1px solid ${ThemeColors.glass.border}`,
                                borderRadius: '12px'
                            }}
                            styles={{
                                body: {
                                    padding: '12px',
                                    paddingBottom: '12px'
                                }
                            }}
                        >
                            <GraphControls
                                onZoomIn={handleZoomIn}
                                onZoomOut={handleZoomOut}
                                onFit={handleFit}
                                onLayoutChange={handleLayoutChange}
                            />
                        </Card>
                    </div>
                )}
            </div>
        );
    };

    return (
        <Drawer
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ShareAltOutlined style={{ color: '#1890ff' }} />
                    <span>Route Map for {name}</span>
                    <Tag color="blue" style={{ fontSize: '11px' }}>{collection}</Tag>
                </div>
            }
            open={visible}
            onClose={handleClose}
            width="95vw"
            height="100vh"
            placement="right"
            footer={
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div></div>
                    <ElchiButton onlyText onClick={handleClose}>Close</ElchiButton>
                </div>
            }
            styles={{
                body: {
                    padding: 0,
                    background: ThemeColors.backgroundSolid,
                    overflow: 'hidden'
                },
                mask: {
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    backdropFilter: 'blur(4px)'
                }
            }}
            destroyOnHidden={true}
        >
            {renderModalContent()}
        </Drawer>
    );
};

export default RouteMap;