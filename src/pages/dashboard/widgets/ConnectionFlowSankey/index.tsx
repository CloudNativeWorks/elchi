/**
 * Service Dependencies Graph
 * Shows random service dependencies using React Flow
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NodeIndexOutlined } from '@ant-design/icons';
import { ReactFlowProvider } from '@xyflow/react';
import { BaseWidget } from '../shared/BaseWidget';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { api } from '@/common/api';
import { useDashboardRefresh } from '../../context/DashboardRefreshContext';
import { DependencyGraphWrapper } from './DependencyGraphWrapper';
import type { DependencyApiResponse } from '@/elchi/components/common/dependency/types';

export const ConnectionFlowSankey: React.FC = () => {
  const navigate = useNavigate();
  const projectContext = useProjectVariable();
  const project = typeof projectContext === 'string' ? projectContext : projectContext.project;
  const { refreshTrigger } = useDashboardRefresh();
  const [loading, setLoading] = useState(true);
  const [dependencies, setDependencies] = useState<DependencyApiResponse | null>(null);
  const [listenerInfo, setListenerInfo] = useState<{ name: string; version: string } | null>(null);

  useEffect(() => {
    if (!project) return;

    const fetchDependencies = async () => {
      try {
        setLoading(true);
        // Clear previous data first
        setDependencies(null);
        setListenerInfo(null);

        // Get all listeners
        const listenersRes = await api.get(`/api/v3/xds/listeners?project=${project}`);
        const allListeners = listenersRes.data?.data?.data || [];

        if (!Array.isArray(allListeners) || allListeners.length === 0) {
          setLoading(false);
          return;
        }

        // Pick a random listener
        const randomListener = allListeners[Math.floor(Math.random() * allListeners.length)];
        const listenerName = randomListener.name;
        const version = randomListener.version || 'v1.33.5';

        // Save listener info for expand button
        setListenerInfo({ name: listenerName, version });

        // Fetch dependency graph for this listener
        const dependencyRes = await api.get(
          `/api/v3/dependency/${encodeURIComponent(listenerName)}?project=${project}&collection=listeners&gtype=envoy.config.listener.v3.Listener&version=${version}`
        );

        // Response is already { data: { nodes: [...], edges: [...] } }
        const dependencyData = dependencyRes.data;

        if (dependencyData && dependencyData.nodes && dependencyData.edges) {
          setDependencies(dependencyData);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching dependencies:', error);
        setDependencies(null);
        setListenerInfo(null);
        setLoading(false);
      }
    };

    fetchDependencies();
    // No interval - only fetches on mount or when global refresh triggered
  }, [project, refreshTrigger]);

  const handleExpand = () => {
    if (listenerInfo) {
      navigate(
        `/dependency/${encodeURIComponent(listenerInfo.name)}?collection=listeners&gtype=envoy.config.listener.v3.Listener&version=${listenerInfo.version}`
      );
    }
  };

  const widgetTitle = listenerInfo
    ? `Resource Dependencies (${listenerInfo.name})`
    : 'Resource Dependencies';

  return (
    <BaseWidget
      title={widgetTitle}
      icon={<NodeIndexOutlined />}
      loading={loading}
      onExpand={listenerInfo ? handleExpand : undefined}
    >
      {dependencies && dependencies.nodes && dependencies.nodes.length > 0 ? (
        <div style={{ height: '200px', width: '100%' }}>
          <ReactFlowProvider>
            <DependencyGraphWrapper dependencies={dependencies} />
          </ReactFlowProvider>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '200px',
          color: '#999'
        }}>
          No connection data available
        </div>
      )}
    </BaseWidget>
  );
};
