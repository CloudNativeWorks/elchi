/**
 * Dependency Graph Wrapper for Dashboard Widget
 * Simplified version without search/filter controls
 */

import React, { useEffect, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import ResourceNode from '@/elchi/components/common/dependency/nodes/ResourceNode';
import AnimatedEdge from '@/elchi/components/common/dependency/edges/AnimatedEdge';
import { transformApiDataToFlowData } from '@/elchi/components/common/dependency/utils';
import { useGraphLayout } from '@/elchi/components/common/dependency/hooks/useGraphLayout';
import type { DependencyApiResponse } from '@/elchi/components/common/dependency/types';

interface DependencyGraphWrapperProps {
  dependencies: DependencyApiResponse;
}

export const DependencyGraphWrapper: React.FC<DependencyGraphWrapperProps> = ({ dependencies }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const { applyLayout } = useGraphLayout();

  // Memoize node and edge types to prevent re-renders
  const nodeTypes = useMemo(() => ({ resourceNode: ResourceNode as any }), []);
  const edgeTypes = useMemo(() => ({ animatedEdge: AnimatedEdge as any }), []);

  // Transform API data to React Flow format
  useEffect(() => {
    const { nodes: transformedNodes, edges: transformedEdges } = transformApiDataToFlowData(dependencies);

    // Filter edges to only include those with valid source and target nodes
    const nodeIds = new Set(transformedNodes.map(n => n.id));
    const validEdges = transformedEdges.filter(edge =>
      nodeIds.has(edge.source) && nodeIds.has(edge.target)
    );

    setNodes(transformedNodes);
    setEdges(validEdges);

    // Apply layout after data is set
    if (transformedNodes.length > 0) {
      setTimeout(() => {
        applyLayout(transformedNodes, validEdges);
      }, 100);
    }
  }, [dependencies, applyLayout, setNodes, setEdges]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.1 }}
        minZoom={0.1}
        maxZoom={2}
        defaultEdgeOptions={{
          type: 'animatedEdge',
          animated: false,
        }}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        preventScrolling={false}
      >
        <Background color="#e2e8f0" gap={16} size={1} />
      </ReactFlow>
    </div>
  );
};

export default DependencyGraphWrapper;
