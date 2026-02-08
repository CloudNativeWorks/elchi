import React, { memo, useMemo, useCallback, useState } from 'react';
import {
    ReactFlow,
    ReactFlowProvider,
    Background,
    type Node,
    type Edge,
    Position,
    Handle,
    type EdgeProps,
    getBezierPath,
    EdgeLabelRenderer,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Modal, Typography, Space, Spin, Empty } from 'antd';
import {
    UpOutlined,
    DownOutlined,
    DeleteOutlined,
    ReloadOutlined,
    ExclamationCircleOutlined,
    CloudServerOutlined,
    ClusterOutlined,
    ApartmentOutlined,
} from '@ant-design/icons';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { gslbApi } from '../gslbApi';
import type { GSLBNode } from '../types';

const { Text } = Typography;

// ── Utilities ──

function formatCount(n: number): string {
    if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return String(n);
}

function formatTimeAgo(dateStr: string): string {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return `${diffSec}s ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDay = Math.floor(diffHr / 24);
    return `${diffDay}d ago`;
}

// ── Layout Constants ──

const CONTROLLER_X = 50;
const NODE_START_X = 650;
const NODE_SPACING_Y = 110;
const NODE_START_Y = 20;

// ── Custom Nodes ──

interface ControllerNodeData extends Record<string, unknown> {
    label: string;
}

const ControllerNode = memo(({ data }: { data: ControllerNodeData }) => (
    <div style={{
        background: 'var(--gradient-primary)',
        borderRadius: 10,
        padding: '12px 18px',
        minWidth: 130,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        boxShadow: '0 3px 12px var(--shadow-primary-color)',
    }}>
        <CloudServerOutlined style={{ fontSize: 18, color: 'var(--text-on-primary)' }} />
        <div>
            <div style={{ color: 'var(--text-on-primary)', fontWeight: 700, fontSize: 12 }}>
                {data.label}
            </div>
            <div style={{ color: 'var(--text-on-primary)', opacity: 0.8, fontSize: 9 }}>
                Elchi GSLB
            </div>
        </div>
        <Handle type="source" position={Position.Right} style={{ background: 'var(--color-success)', width: 8, height: 8, border: '2px solid var(--text-on-primary)' }} />
    </div>
));
ControllerNode.displayName = 'ControllerNode';

interface GslbNodeData extends Record<string, unknown> {
    nodeIp: string;
    zone: string;
    lastSeen: string;
    requestCount: number;
    versionHash: string;
    nodeId: string;
    onDelete: (nodeId: string, nodeIp: string) => void;
}

const GslbNodeComponent = memo(({ data }: { data: GslbNodeData }) => {
    const isStale = (Date.now() - new Date(data.lastSeen).getTime()) / 60000 > 5;
    const handleColor = isStale ? 'var(--color-danger)' : 'var(--color-success)';

    return (
        <div
            className="gslb-topology-node"
            style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border-default)',
                borderRadius: 8,
                padding: '10px 14px',
                minWidth: 150,
                position: 'relative',
                boxShadow: 'var(--shadow-sm)',
            }}
        >
            <Handle type="target" position={Position.Left} style={{ background: handleColor, width: 8, height: 8, border: '2px solid var(--bg-surface)' }} />

            <button
                className="gslb-node-delete-btn"
                onClick={(e) => { e.stopPropagation(); data.onDelete(data.nodeId, data.nodeIp); }}
                style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 3,
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.2s',
                }}
            >
                <DeleteOutlined style={{ fontSize: 10, color: 'var(--color-danger)' }} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div>
                    <div style={{ fontWeight: 600, fontSize: 12, color: 'var(--text-primary)' }}>
                        {data.nodeIp}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 1 }}>
                        zone: {data.zone}
                    </div>
                </div>
            </div>
            <div style={{ fontSize: 9, color: 'var(--text-tertiary)', marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
                <span>{formatCount(data.requestCount)} reqs</span>
                <span>#{data.versionHash.slice(-6)}</span>
            </div>
        </div>
    );
});
GslbNodeComponent.displayName = 'GslbNodeComponent';

// ── Custom Edge ──

const SyncEdge = memo(({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data }: EdgeProps) => {
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition,
    });

    const lastSeen = (data as { lastSeen?: string })?.lastSeen;
    const isStale = lastSeen ? (Date.now() - new Date(lastSeen).getTime()) / 60000 > 5 : false;
    const edgeColor = isStale ? 'var(--color-danger)' : 'var(--color-success)';

    return (
        <>
            <path
                id={id}
                d={edgePath}
                stroke={edgeColor}
                strokeWidth={1.5}
                strokeDasharray="6 3"
                fill="none"
                style={{ opacity: isStale ? 0.8 : 0.6 }}
            />
            {lastSeen && (
                <EdgeLabelRenderer>
                    <div
                        style={{
                            position: 'absolute',
                            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                            pointerEvents: 'none',
                            background: 'var(--card-bg)',
                            border: `1px solid ${isStale ? 'var(--color-danger)' : 'var(--border-default)'}`,
                            borderRadius: 10,
                            padding: '2px 10px',
                            fontSize: 10,
                            color: isStale ? 'var(--color-danger)' : 'var(--text-secondary)',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        last sync: {formatTimeAgo(lastSeen as string)}
                    </div>
                </EdgeLabelRenderer>
            )}
        </>
    );
});
SyncEdge.displayName = 'SyncEdge';

// ── Node & Edge Types ──

const nodeTypes = {
    controllerNode: ControllerNode,
    gslbNode: GslbNodeComponent,
};

const edgeTypes = {
    syncEdge: SyncEdge,
};

// ── Inner Flow Component ──

interface GslbTopologyInnerProps {
    gslbNodes: GSLBNode[];
}

const GslbTopologyInner: React.FC<GslbTopologyInnerProps> = ({ gslbNodes }) => {
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: (nodeId: string) => gslbApi.deleteGslbNode(nodeId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gslb-nodes'] });
        },
    });

    const handleDelete = useCallback((nodeId: string, nodeIp: string) => {
        Modal.confirm({
            title: 'Remove GSLB Node',
            icon: <ExclamationCircleOutlined />,
            content: `Remove node ${nodeIp}? This is typically used for stale node cleanup.`,
            okText: 'Remove',
            okType: 'danger',
            onOk: () => deleteMutation.mutate(nodeId),
        });
    }, [deleteMutation]);

    const { nodes, edges } = useMemo(() => {
        if (!gslbNodes.length) return { nodes: [], edges: [] };

        const totalHeight = (gslbNodes.length - 1) * NODE_SPACING_Y;
        const controllerY = NODE_START_Y + totalHeight / 2;

        const controllerNode: Node = {
            id: 'controller',
            type: 'controllerNode',
            position: { x: CONTROLLER_X, y: controllerY },
            data: { label: 'Controller' },
            draggable: false,
        };

        const flowNodes: Node[] = gslbNodes.map((node, index) => ({
            id: node.id,
            type: 'gslbNode',
            position: { x: NODE_START_X, y: NODE_START_Y + index * NODE_SPACING_Y },
            data: {
                nodeIp: node.node_ip,
                zone: node.zone,
                lastSeen: node.last_seen,
                requestCount: node.request_count,
                versionHash: node.last_version_hash,
                nodeId: node.id,
                onDelete: handleDelete,
            } satisfies GslbNodeData,
            draggable: false,
        }));

        const flowEdges: Edge[] = gslbNodes.map((node) => ({
            id: `ctrl-${node.id}`,
            source: 'controller',
            target: node.id,
            type: 'syncEdge',
            data: { lastSeen: node.last_seen },
        }));

        return { nodes: [controllerNode, ...flowNodes], edges: flowEdges };
    }, [gslbNodes, handleDelete]);

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            fitViewOptions={{ padding: 0.3 }}
            minZoom={0.5}
            maxZoom={1.5}
            nodesDraggable={false}
            nodesConnectable={false}
            panOnDrag={false}
            zoomOnScroll={false}
            zoomOnDoubleClick={false}
            preventScrolling={false}
            proOptions={{ hideAttribution: true }}
        >
            <Background gap={20} size={1} color="var(--border-default)" style={{ opacity: 0.4 }} />
        </ReactFlow>
    );
};

// ── Exported Component ──

const GslbTopology: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const queryClient = useQueryClient();
    const { project } = useProjectVariable();

    const { data: gslbNodes, isLoading, dataUpdatedAt } = useQuery({
        queryKey: ['gslb-nodes', project],
        queryFn: () => gslbApi.getGslbNodes(),
        enabled: !!project,
    });

    return (
        <div style={{
            background: 'var(--card-bg)',
            borderRadius: 12,
            border: '1px solid var(--border-default)',
            boxShadow: 'var(--shadow-sm)',
            overflow: 'hidden',
            marginBottom: 16,
        }}>
            {/* Header */}
            <div
                style={{
                    background: 'var(--bg-surface)',
                    borderBottom: collapsed ? 'none' : '1px solid var(--border-default)',
                    padding: '10px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                }}
                onClick={() => setCollapsed(c => !c)}
            >
                <Space>
                    <ApartmentOutlined style={{ color: 'var(--color-primary)' }} />
                    <Text strong>Node Topology</Text>
                    {gslbNodes && (
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            ({gslbNodes.length} node{gslbNodes.length !== 1 ? 's' : ''})
                        </Text>
                    )}
                </Space>
                <Space size={4}>
                    {!collapsed && (
                        <Button
                            type="text"
                            size="small"
                            icon={<ReloadOutlined spin={isLoading} />}
                            onClick={(e) => {
                                e.stopPropagation();
                                queryClient.invalidateQueries({ queryKey: ['gslb-nodes'] });
                            }}
                        />
                    )}
                    <Button type="text" size="small" icon={collapsed ? <DownOutlined /> : <UpOutlined />} />
                </Space>
            </div>

            {/* Graph Container */}
            {!collapsed && (() => {
                const graphHeight = gslbNodes && gslbNodes.length > 0
                    ? Math.max(200, gslbNodes.length * NODE_SPACING_Y + 60)
                    : 200;
                return (
                <div style={{ height: graphHeight }}>
                    {isLoading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: graphHeight }}>
                            <Spin />
                        </div>
                    ) : !gslbNodes || gslbNodes.length === 0 ? (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: graphHeight }}>
                            <Empty
                                image={<ClusterOutlined style={{ fontSize: 40, color: 'var(--text-tertiary)' }} />}
                                description={<Text type="secondary">No GSLB nodes registered yet</Text>}
                            />
                        </div>
                    ) : (
                        <ReactFlowProvider key={dataUpdatedAt}>
                            <GslbTopologyInner gslbNodes={gslbNodes} />
                        </ReactFlowProvider>
                    )}
                </div>
                );
            })()}

            <style>{`
                .gslb-topology-node:hover .gslb-node-delete-btn {
                    opacity: 1 !important;
                }
                .gslb-node-delete-btn:hover {
                    background: var(--color-danger-bg) !important;
                }
            `}</style>
        </div>
    );
};

export default GslbTopology;
