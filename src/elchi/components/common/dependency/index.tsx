import React, { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import { useCustomGetQuery } from '@/common/api';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { Button, Card, Modal, Spin } from 'antd';
import { ThemeColors } from './themes';
import GraphControls from './GraphControls';
import NodeIcons from './NodeIcons';
import { CustomCardProps } from './types';
import PopoverContent from './PopoverContent';
import { createDependencyGraph } from './DependencyGraph';
import { icons } from './icon';
import ElchiButton from '../ElchiButton';

cytoscape.use(dagre);

const Dependencies: React.FC<CustomCardProps> = ({ name, collection, gtype, visible, version, onClose }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const cyRef = useRef<cytoscape.Core | null>(null);
    const { project } = useProjectVariable();
    const [selectedNode, setSelectedNode] = useState<{
        label: string;
        category: string;
        gtype: string;
        link: string;
        id: string;
    } | null>(null);
    const [graphInitialized, setGraphInitialized] = useState(false);
    const [forceRender, setForceRender] = useState(0);
    const { isLoading, error, data: dependencies, isFetching, refetch } = useCustomGetQuery({
        queryKey: `query_${name}_${collection}`,
        enabled: false,
        path: `dependency/${name}?project=${project}&collection=${collection}&gtype=${gtype}&version=${version}`,
    });

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
                        spacingFactor: 1.5,
                        nodeSep: 180,
                        edgeSep: 120,
                        rankSep: 250,
                        rankDir: 'LR',
                        align: 'UL',
                        ranker: 'network-simplex',
                        fit: true,
                        padding: 60,
                        animate: true,
                        animationDuration: 800,
                        acyclicer: 'greedy',
                        separation: (a, b) => {
                            if (a.data('first') || b.data('first')) {
                                return 2;
                            }
                            return 1;
                        },
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

    useEffect(() => {
        if (visible) {
            setGraphInitialized(false);
            setSelectedNode(null);

            if (cyRef.current) {
                cyRef.current.destroy();
                cyRef.current = null;
            }

            const iconElements = document.querySelectorAll('.node-icon-container');
            iconElements.forEach(el => {
                el.remove();
            });

            refetch().then(() => {
                setForceRender(prev => prev + 1);
            }).catch(() => {
                //
            });
        } else {
            setSelectedNode(null);
            if (cyRef.current) {
                cyRef.current.destroy();
                cyRef.current = null;
            }

            const iconElements = document.querySelectorAll('.node-icon-container');
            iconElements.forEach(el => {
                el.remove();
            });
        }

        return () => {
            setSelectedNode(null);
            if (cyRef.current) {
                cyRef.current.destroy();
                cyRef.current = null;
            }

            const iconElements = document.querySelectorAll('.node-icon-container');
            iconElements.forEach(el => {
                el.remove();
            });
        };
    }, [visible, refetch]);

    useEffect(() => {
        if (dependencies && containerRef.current && visible && !graphInitialized) {
            try {
                setGraphInitialized(true);

                cyRef.current = createDependencyGraph(
                    containerRef.current,
                    dependencies,
                    {
                        onNodeTap: (node) => {
                            setSelectedNode({
                                label: node.data('label'),
                                category: node.data('category'),
                                gtype: node.data('gtype'),
                                link: node.data('link'),
                                id: node.id()
                            });
                        },
                        onCanvasTap: () => {
                            setSelectedNode(null);
                        }
                    }
                );
            } catch (error) {
                console.error("Error creating dependency graph:", error);
                setGraphInitialized(false);
            }
        }
    }, [dependencies, visible, graphInitialized, forceRender]);

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
                        <p style={{ marginTop: 15, color: '#666' }}>Loading dependency graph...</p>
                    </div>
                </div>
            );
        }

        if (error) {
            return (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                    <div style={{ color: 'red', marginBottom: '15px' }}>
                        Error loading dependency data: {error.toString()}
                    </div>
                    <Button onClick={() => refetch()} type="primary">
                        Retry
                    </Button>
                </div>
            );
        }

        const hasData = dependencies && (
            (dependencies.nodes && dependencies.nodes.length > 0) ||
            (dependencies.elements && dependencies.elements.length > 0) ||
            (Array.isArray(dependencies) && dependencies.length > 0)
        );

        if (!hasData) {
            return (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                    <div style={{ marginBottom: '15px' }}>
                        <p>No dependency data found for this resource.</p>
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
                            <p style={{ marginTop: 15, color: '#666' }}>Preparing graph...</p>
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
                    backgroundColor: ThemeColors.background,
                    border: '1px solid #eee',
                    minHeight: '600px'
                }}
            >
                {selectedNode && (
                    <div
                        style={{
                            position: 'absolute',
                            top: 10,
                            left: 10,
                            zIndex: 1010,
                        }}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                        onMouseUp={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                    >
                        <Card
                            size="small"
                            title="Resource Details"
                            style={{
                                width: 300,
                                backgroundColor: 'white',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                pointerEvents: 'all'
                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            onMouseUp={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                        >
                            <div
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                                onMouseUp={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                            >
                                <PopoverContent
                                    nodeLabel={selectedNode.label}
                                    category={selectedNode.category}
                                    gtype={selectedNode.gtype}
                                    link={selectedNode.link}
                                    id={selectedNode.id}
                                />
                            </div>
                        </Card>
                    </div>
                )}

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
                            backgroundColor: 'white',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
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
                <NodeIcons icons={icons} />
            </div>
        );
    };

    return (
        <Modal
            title={<h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: 'bold', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>Dependencies for {name}</h3>}
            open={visible}
            onCancel={onClose}
            footer={
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div></div>
                    <ElchiButton onlyText onClick={onClose}>Close</ElchiButton>
                </div>
            }
            width="94vw"
            style={{ top: 20, height: '94vh', padding: 0 }}
            styles={{
                body: {
                    height: 'calc(94vh - 105px)',
                    overflow: 'hidden',
                    padding: 0,
                    backgroundColor: ThemeColors.background
                },
                header: {
                    borderBottom: '1px solid #e8e8e8',
                    padding: '16px 24px',
                    fontSize: '18px',
                    fontWeight: 'bold'
                },
                mask: {
                    backgroundColor: 'rgba(0, 0, 0, 0.65)'
                }
            }}
            destroyOnHidden
        >
            {renderModalContent()}
        </Modal>
    );
};

export default Dependencies; 