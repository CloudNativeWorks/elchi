/**
 * Dashboard Data Hook
 * Aggregates all dashboard data from multiple sources
 */

import { useMemo } from 'react';
import { DashboardData, DashboardState, ResourceStats } from '../types/dashboard.types';
import { useErrorSummary } from '@/hooks/useErrorSummary';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { useCustomGetQuery } from '@/common/api';

/**
 * Dashboard data hook - integrates real data from Redux and APIs
 */
export function useDashboardData(): DashboardState {
  const projectContext = useProjectVariable();
  const project = typeof projectContext === 'string' ? projectContext : projectContext.project;

  // Get error summary from backend API
  const { data: errorData, isLoading: errorLoading, error: errorError } = useErrorSummary({
    project: project || '',
    enabled: !!project,
  });

  // Get resource counts from API
  const { data: resourceCountData } = useCustomGetQuery({
    queryKey: `count_all_${project}`,
    enabled: !!project,
    path: `custom/count/all?project=${project}`,
  });

  // Calculate resource counts from API data
  const resourceStats = useMemo((): ResourceStats => {
    if (!resourceCountData) {
      return {
        listeners: 0,
        routes: 0,
        virtualHosts: 0,
        clusters: 0,
        endpoints: 0,
        secrets: 0,
        filters: 0,
        extensions: 0,
        timestamp: new Date(),
      };
    }

    return {
      listeners: resourceCountData.listeners || 0,
      routes: resourceCountData.routes || 0,
      virtualHosts: resourceCountData.virtual_hosts || 0,
      clusters: resourceCountData.clusters || 0,
      endpoints: resourceCountData.endpoints || 0,
      secrets: resourceCountData.secrets || 0,
      filters: resourceCountData.filters || 0,
      extensions: resourceCountData.extensions || 0,
      timestamp: new Date(),
    };
  }, [resourceCountData]);

  // Aggregate all dashboard data
  const dashboardData = useMemo((): DashboardData | null => {
    if (!errorData) return null;

    const now = new Date();

    return {
      systemHealth: {
        overallScore: 92, // Will be calculated by useSystemHealth
        status: 'healthy',
        components: {
          envoy: { status: 'healthy' },
          database: { status: 'healthy' },
          victoriaMetrics: { status: 'healthy' },
        },
      },
      traffic: {
        downstreamConnections: 0, // From TrafficOverview
        upstreamConnections: 0, // From TrafficOverview
        incomingTrafficRate: 0,
        outgoingTrafficRate: 0,
        totalRequests: 0,
        requestRate: 0,
        errorRate: 0,
        timestamp: now,
      },
      errors: {
        totalErrors: errorData.total_error || 0,
        criticalCount: 0,
        errorCount: 0,
        warningCount: 0,
        errors4xx: 0,
        errors5xx: 0,
        topErrors: errorData.errors || [],
        errorsByService: {},
      },
      services: [], // From useServiceStatus hook
      resources: resourceStats,
      activity: [],
      jobs: {
        total24h: 0,
        running: 0,
        completed: 0,
        failed: 0,
        successRate: 0,
        avgDuration: 0,
      },
      audit: {
        changes24h: 0,
        activeUsers: 0,
        topUser: '',
        topResource: '',
        actionDistribution: {
          CREATE: 0,
          UPDATE: 0,
          DELETE: 0,
        },
      },
      clients: {
        total: 0,
        connected: 0,
        disconnected: 0,
        versionDistribution: {},
      },
      lastUpdated: now,
    };
  }, [errorData, resourceStats]);

  return {
    data: dashboardData,
    loading: errorLoading,
    error: errorError as Error | null,
    refreshing: false,
  };
}

export default useDashboardData;
