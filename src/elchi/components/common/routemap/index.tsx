import React, { useState, useEffect } from 'react';
import { Button, Drawer, Spin, Tag, Space } from 'antd';
import { ShareAltOutlined, ReloadOutlined, TableOutlined, NodeIndexOutlined } from '@ant-design/icons';
import { useRouteMapOperations } from '@/hooks/useRouteMapOperations';
import ElchiButton from '../ElchiButton';
import { RouteMapProps, RouteMapData } from './types';
import RouteMapTableView from './RouteMapTableView';
import RouteMapGraphView from './RouteMapGraphView';

const RouteMap: React.FC<RouteMapProps> = ({ name, collection, gtype, visible, version, onClose }) => {
    const { getRouteMap } = useRouteMapOperations();
    const [showGraphDrawer, setShowGraphDrawer] = useState(false);

    const { isLoading, error, data: routeMapData, isFetching, refetch } = getRouteMap(name, gtype, collection, version);

    // Fetch data when drawer becomes visible
    useEffect(() => {
        if (visible) {
            refetch();
        }
    }, [visible, refetch]);

    const handleOpenGraphDrawer = () => {
        setShowGraphDrawer(true);
    };

    const handleCloseGraphDrawer = () => {
        setShowGraphDrawer(false);
    };

    const renderModalContent = () => {
        if (isLoading || isFetching) {
            return (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
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

        return (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Header with stats and graph toggle */}
                <div style={{ 
                    padding: '16px', 
                    borderBottom: '1px solid #f0f0f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Space>
                        <Tag color="blue" icon={<TableOutlined />}>
                            Table View
                        </Tag>
                        {routeMapData && routeMapData.stats && (
                            <>
                                <Tag color="blue">Nodes: {routeMapData.stats.nodes}</Tag>
                                <Tag color="green">Edges: {routeMapData.stats.edges}</Tag>
                            </>
                        )}
                    </Space>
                    <Space>
                        <Button
                            icon={<ReloadOutlined />}
                            size="small"
                            onClick={() => refetch()}
                            loading={isLoading || isFetching}
                        >
                            Refresh
                        </Button>
                        <Button
                            type="primary"
                            icon={<NodeIndexOutlined />}
                            onClick={handleOpenGraphDrawer}
                        >
                            View Graph
                        </Button>
                    </Space>
                </div>

                {/* Table View */}
                <div style={{ flex: 1, overflow: 'hidden' }}>
                    <RouteMapTableView data={routeMapData as RouteMapData} />
                </div>
            </div>
        );
    };

    return (
        <>
            <Drawer
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <ShareAltOutlined style={{ color: '#1890ff' }} />
                        <span>Route Map for {name}</span>
                        <Tag color="blue" style={{ fontSize: '11px' }}>{collection}</Tag>
                    </div>
                }
                open={visible}
                onClose={onClose}
                width="55vw"
                height="100vh"
                placement="right"
                footer={
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div></div>
                        <ElchiButton onlyText onClick={onClose}>Close</ElchiButton>
                    </div>
                }
                styles={{
                    body: {
                        padding: 0,
                        background: '#fafafa',
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

            {/* Graph Drawer */}
            <RouteMapGraphView
                name={name}
                collection={collection}
                gtype={gtype}
                visible={showGraphDrawer}
                version={version}
                onClose={handleCloseGraphDrawer}
            />
        </>
    );
};

export default RouteMap;