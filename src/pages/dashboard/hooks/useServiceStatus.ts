/**
 * Service Status Hook
 * Fetches service health and status information from Victoria Metrics
 */

import { useState, useEffect, useCallback } from 'react';
import { ServiceStatus } from '../types/dashboard.types';
import { REFRESH_INTERVALS } from '../utils/constants';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { api } from '@/common/api';
import { determineServiceStatus } from '../utils/calculations';
import { useDashboardRefresh } from '../context/DashboardRefreshContext';

interface UseServiceStatusOptions {
  refreshInterval?: number;
  enabled?: boolean;
  limit?: number;
}

interface UseServiceStatusReturn {
  services: ServiceStatus[];
  loading: boolean;
  error: Error | null;
  refresh: () => void;
}

/**
 * Hook to fetch top services from Victoria Metrics
 * Gets request counts, error rates, and response times
 */
export function useServiceStatus(
  options: UseServiceStatusOptions = {}
): UseServiceStatusReturn {
  const {
    refreshInterval = REFRESH_INTERVALS.HIGH,
    enabled = true,
    limit = 10,
  } = options;

  const projectContext = useProjectVariable();
  const project = typeof projectContext === 'string' ? projectContext : projectContext.project;
  const { refreshTrigger } = useDashboardRefresh();

  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchServices = useCallback(async () => {
    if (!project || !enabled) return;

    try {
      setLoading(true);

      const now = Date.now();
      const windowSec = 300; // 5 minutes
      const start = Math.floor((now - windowSec * 1000) / 1000);
      const end = Math.floor(now / 1000);
      const step = Math.floor(windowSec / 2);

      // Query 1: Get total requests per service (top 10) - using downstream metrics
      const requestQuery = `topk(${limit}, sum by (envoy_http_conn_manager_prefix) (rate({__name__=~".*_${project}_http_downstream_rq_total", envoy_http_conn_manager_prefix!="admin"}[${windowSec}s])))`;

      const requestsResult = await api.get('/api/v1/query_range', {
        params: { query: requestQuery, start, end, step }
      });

      // Query 2: Get error requests per service - using downstream metrics
      const errorQuery = `sum by (envoy_http_conn_manager_prefix) (rate({__name__=~".*_${project}_http_downstream_rq_xx", envoy_http_conn_manager_prefix!="admin", envoy_response_code_class=~"4|5"}[${windowSec}s]))`;

      const errorsResult = await api.get('/api/v1/query_range', {
        params: { query: errorQuery, start, end, step }
      });

      // Query 3: Get response times (p95) - using downstream metrics
      const responseTimeQuery = `histogram_quantile(0.95, sum by (envoy_http_conn_manager_prefix, le) (rate({__name__=~".*_${project}_http_downstream_rq_time_bucket", envoy_http_conn_manager_prefix!="admin"}[${windowSec}s])))`;

      const responseTimeResult = await api.get('/api/v1/query_range', {
        params: { query: responseTimeQuery, start, end, step }
      });

      // Process results
      const servicesMap = new Map<string, ServiceStatus>();

      // Process request counts
      if (requestsResult?.data?.data?.result) {
        requestsResult.data.data.result.forEach((series: any) => {
          const serviceName = series.metric.envoy_http_conn_manager_prefix || 'unknown';
          const values = series.values || [];
          const lastValue = values.length > 0 ? parseFloat(values[values.length - 1][1]) : 0;
          const requestRate = lastValue || 0;
          const requestCount = Math.floor(requestRate * windowSec); // Approximate count

          servicesMap.set(serviceName, {
            id: serviceName,
            name: serviceName,
            status: 'healthy',
            uptime: 99.9, // Default, calculated from errors
            requestCount,
            errorRate: 0,
            avgResponseTime: 0,
            timestamp: new Date(),
          });
        });
      }

      // Process error rates
      if (errorsResult?.data?.data?.result) {
        errorsResult.data.data.result.forEach((series: any) => {
          const serviceName = series.metric.envoy_http_conn_manager_prefix || 'unknown';
          const values = series.values || [];
          const lastValue = values.length > 0 ? parseFloat(values[values.length - 1][1]) : 0;
          const errorRate = lastValue || 0;

          const service = servicesMap.get(serviceName);
          if (service) {
            const totalRate = service.requestCount / windowSec;
            service.errorRate = totalRate > 0 ? (errorRate / totalRate) * 100 : 0;
            service.uptime = 100 - service.errorRate;
            service.status = determineServiceStatus(service.errorRate, service.avgResponseTime);
          }
        });
      }

      // Process response times
      if (responseTimeResult?.data?.data?.result) {
        responseTimeResult.data.data.result.forEach((series: any) => {
          const serviceName = series.metric.envoy_http_conn_manager_prefix || 'unknown';
          const values = series.values || [];
          const lastValue = values.length > 0 ? parseFloat(values[values.length - 1][1]) : 0;
          const responseTime = Math.floor(lastValue) || 0; // Convert to ms

          const service = servicesMap.get(serviceName);
          if (service) {
            service.avgResponseTime = responseTime;
            service.status = determineServiceStatus(service.errorRate, service.avgResponseTime);
          }
        });
      }

      // Convert map to array and sort by request count
      const servicesArray = Array.from(servicesMap.values())
        .sort((a, b) => b.requestCount - a.requestCount)
        .slice(0, limit);

      setServices(servicesArray);
      setError(null);
    } catch (err) {
      console.error('Error fetching service status:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [project, enabled, limit]);

  const refresh = () => {
    fetchServices();
  };

  useEffect(() => {
    if (!enabled || !project) return;

    fetchServices();

    // No auto-refresh - only fetch once on mount or when global refresh triggered
  }, [enabled, project, fetchServices, refreshTrigger]);

  return { services, loading, error, refresh };
}

/**
 * Get mock service data
 * TODO: Replace with actual API call
 */
function getMockServices(): ServiceStatus[] {
  const now = new Date();

  return [
    {
      id: '1',
      name: 'api-gateway',
      status: 'healthy',
      uptime: 99.8,
      requestCount: 125847,
      errorRate: 1.2,
      avgResponseTime: 45,
      timestamp: now,
    },
    {
      id: '2',
      name: 'auth-service',
      status: 'healthy',
      uptime: 99.9,
      requestCount: 45623,
      errorRate: 0.5,
      avgResponseTime: 32,
      timestamp: now,
    },
    {
      id: '3',
      name: 'payment-service',
      status: 'degraded',
      uptime: 97.5,
      requestCount: 12456,
      errorRate: 8.3,
      avgResponseTime: 156,
      timestamp: now,
    },
    {
      id: '4',
      name: 'notification-service',
      status: 'healthy',
      uptime: 99.6,
      requestCount: 78945,
      errorRate: 2.1,
      avgResponseTime: 28,
      timestamp: now,
    },
  ];
}

export default useServiceStatus;
