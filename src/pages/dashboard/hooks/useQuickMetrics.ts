/**
 * useQuickMetrics Hook
 * Fetches quick metrics data for dashboard cards
 */

import { useState, useEffect, useCallback } from 'react';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { useMetricsApiMutation } from '@/common/operations-api';
import { useDashboardRefresh } from '../context/DashboardRefreshContext';

interface QuickMetric {
  value: number;
  trend: number[];
}

interface QuickMetricsData {
  activeConnections: QuickMetric;
  errorRate: QuickMetric;
  avgResponseTime: QuickMetric;
  healthyClusters: QuickMetric;
}

export function useQuickMetrics() {
  const projectContext = useProjectVariable();
  const project = typeof projectContext === 'string' ? projectContext : projectContext.project;
  const metricsApiMutation = useMetricsApiMutation();
  const { refreshTrigger } = useDashboardRefresh();

  const [metrics, setMetrics] = useState<QuickMetricsData>({
    activeConnections: { value: 0, trend: [] },
    errorRate: { value: 0, trend: [] },
    avgResponseTime: { value: 0, trend: [] },
    healthyClusters: { value: 100, trend: [] },
  });
  const [loading, setLoading] = useState(true);

  const fetchMetrics = useCallback(async () => {
    if (!project) return;

    try {
      setLoading(true);

      const now = Math.floor(Date.now() / 1000);
      const windowSec = 300; // 5 minutes
      const start = now - windowSec;

      // Use the same mutation API pattern as TrafficOverview for error metrics
      const [connectionsRes, errors4xxRes, errors5xxRes, responseTimeRes, healthRes] = await Promise.all([
        // Active connections - use query_range to get trend data
        metricsApiMutation.mutateAsync({
          name: '.*',
          metric: 'http_downstream_cx_active',
          start,
          end: now,
          metricConfig: {
            queryTemplate: `sum({__name__=~".*_%{project}_%{metric}"})`,
            windowSecs: {
              default: 5,
              ranges: [],
            },
          },
        }),
        // 4xx errors
        metricsApiMutation.mutateAsync({
          name: '.*',
          metric: 'http_downstream_rq_xx_total',
          start,
          end: now,
          metricConfig: {
            queryTemplate: `sum(rate({__name__=~".*_%{project}_%{metric}", envoy_http_conn_manager_prefix!="admin", envoy_response_code_class="4"}[%{window}s]))`,
            windowSecs: {
              default: 5,
              ranges: [
                { threshold: 2 * 24 * 60 * 60, value: 300 },
                { threshold: 24 * 60 * 60, value: 60 },
                { threshold: 1 * 60 * 60, value: 15 },
              ],
            },
          },
        }),
        // 5xx errors
        metricsApiMutation.mutateAsync({
          name: '.*',
          metric: 'http_downstream_rq_xx_total',
          start,
          end: now,
          metricConfig: {
            queryTemplate: `sum(rate({__name__=~".*_%{project}_%{metric}", envoy_http_conn_manager_prefix!="admin", envoy_response_code_class="5"}[%{window}s]))`,
            windowSecs: {
              default: 5,
              ranges: [
                { threshold: 2 * 24 * 60 * 60, value: 300 },
                { threshold: 24 * 60 * 60, value: 60 },
                { threshold: 1 * 60 * 60, value: 15 },
              ],
            },
          },
        }),
        // Response time (p95)
        metricsApiMutation.mutateAsync({
          name: '.*',
          metric: 'cluster_upstream_rq_time_bucket',
          start,
          end: now,
          metricConfig: {
            queryTemplate: `histogram_quantile(0.95, sum(rate({__name__=~".*_%{project}_%{metric}", envoy_cluster_name!="elchi-control-plane"}[%{window}s])) by (le))`,
            windowSecs: {
              default: 5,
              ranges: [
                { threshold: 2 * 24 * 60 * 60, value: 300 },
                { threshold: 24 * 60 * 60, value: 60 },
                { threshold: 1 * 60 * 60, value: 15 },
              ],
            },
          },
        }),
        // Cluster health
        metricsApiMutation.mutateAsync({
          name: '.*',
          metric: 'cluster_membership_healthy',
          start,
          end: now,
          metricConfig: {
            queryTemplate: `(sum({__name__=~".*_%{project}_cluster_membership_healthy", envoy_cluster_name!="elchi-control-plane"}) / sum({__name__=~".*_%{project}_cluster_membership_total", envoy_cluster_name!="elchi-control-plane"})) * 100`,
          },
        }),
      ]);

      const extractMetric = (response: any): QuickMetric => {
        const result = response?.data?.result?.[0];

        if (!result || !result.values || result.values.length === 0) {
          return { value: 0, trend: [] };
        }

        const values = result.values.map(([_, val]: [number, string]) => parseFloat(val) || 0);
        const lastValue = values[values.length - 1] || 0;

        return {
          value: Math.round(lastValue * 100) / 100,
          trend: values,
        };
      };

      // Extract individual metrics
      const connections = extractMetric(connectionsRes);
      const errors4xx = extractMetric(errors4xxRes);
      const errors5xx = extractMetric(errors5xxRes);
      const responseTime = extractMetric(responseTimeRes);
      const health = extractMetric(healthRes);

      // Combine 4xx and 5xx error rates
      // These are already error rates in req/s, just sum them
      const totalErrorRate = errors4xx.value + errors5xx.value;

      // Use the longer trend array as base (handles case where one is empty)
      const baseTrend = errors4xx.trend.length >= errors5xx.trend.length ? errors4xx.trend : errors5xx.trend;
      const otherTrend = errors4xx.trend.length >= errors5xx.trend.length ? errors5xx.trend : errors4xx.trend;
      const errorRateTrend = baseTrend.map((val, idx) => val + (otherTrend[idx] || 0));

      setMetrics({
        activeConnections: connections,
        errorRate: { value: totalErrorRate, trend: errorRateTrend },
        avgResponseTime: responseTime,
        healthyClusters: health,
      });
    } catch (err) {
      console.error('Error fetching quick metrics:', err);
    } finally {
      setLoading(false);
    }
  }, [project, metricsApiMutation.mutateAsync]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics, refreshTrigger]); // Re-fetch when global refresh is triggered

  return { metrics, loading };
}

export default useQuickMetrics;
