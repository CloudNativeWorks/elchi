/**
 * useGslbMetrics Hook
 * Fetches GSLB metrics from Prometheus/Victoria Metrics
 * Supports controller filtering
 */

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/common/api';

export interface ErrorData {
  type: string;
  value: number;
  color: string;
}

export interface GslbMetrics {
  // IP Statistics
  totalIps: number;
  healthyIps: number;
  warningIps: number;
  criticalIps: number;
  backoffActiveIps: number;

  // Probe Statistics
  probesSuccess: number;
  probesFailure: number;
  successRate: number;

  // Probe Latency
  latencyAvg: number;
  latencyMin: number;
  latencyMax: number;

  // Error Breakdown - dynamic
  errors: ErrorData[];

  // Worker Stats
  workersActive: number;
  workersQueueDepth: number;

  // Timewheel Stats
  timewheelCurrentLoad: number;
  timewheelCurrentSlot: number;
  timewheelExecuted: number;
  timewheelScheduled: number;

  // Write Buffer Stats
  writeBufferSize: number;
  writeBufferCapacityPct: number;
  writeBufferFlushTotal: number;
  writeBufferFlushErrors: number;
  writeBufferAvgFlushDuration: number;
  writeBufferUpdatesTotal: number;

  // Queue Stats
  resultQueueDepth: number;
  resultQueueCapacityPct: number;

  // Shards
  ownedShards: number;

  // Trend data for charts
  successRateTrend: Array<[number, number]>;
  latencyTrend: Array<[number, number]>;
  probesTrend: Array<{ time: number; success: number; failure: number }>;
  errorTrend: Array<{ time: number; type: string; value: number }[]>;
}

// Color palette for dynamic error types
const ERROR_COLORS = ['#ff7875', '#ffc069', '#95de64', '#69c0ff', '#b37feb', '#ff85c0', '#36cfc9', '#ffd666'];

const defaultMetrics: GslbMetrics = {
  totalIps: 0,
  healthyIps: 0,
  warningIps: 0,
  criticalIps: 0,
  backoffActiveIps: 0,
  probesSuccess: 0,
  probesFailure: 0,
  successRate: 0,
  latencyAvg: 0,
  latencyMin: 0,
  latencyMax: 0,
  errors: [],
  workersActive: 0,
  workersQueueDepth: 0,
  timewheelCurrentLoad: 0,
  timewheelCurrentSlot: 0,
  timewheelExecuted: 0,
  timewheelScheduled: 0,
  writeBufferSize: 0,
  writeBufferCapacityPct: 0,
  writeBufferFlushTotal: 0,
  writeBufferFlushErrors: 0,
  writeBufferAvgFlushDuration: 0,
  writeBufferUpdatesTotal: 0,
  resultQueueDepth: 0,
  resultQueueCapacityPct: 0,
  ownedShards: 0,
  successRateTrend: [],
  latencyTrend: [],
  probesTrend: [],
  errorTrend: [],
};

// Helper to extract last value from query_range result
const extractLastValue = (response: any): number => {
  const values = response?.data?.data?.result?.[0]?.values;
  if (!values || values.length === 0) return 0;
  return parseFloat(values[values.length - 1][1]) || 0;
};

// Helper to extract trend data from query_range result
const extractTrend = (response: any): Array<[number, number]> => {
  const values = response?.data?.data?.result?.[0]?.values;
  if (!values || values.length === 0) return [];
  return values.map(([timestamp, value]: [number, string]) => [
    timestamp * 1000, // Convert to milliseconds for ECharts
    parseFloat(value) || 0,
  ]);
};

// Build query with controller filter
// For "all" controller, use sum/avg aggregation
// For specific controller, filter by controller label
const buildQuery = (metric: string, controller: string, aggregation: 'sum' | 'avg' | 'max' | 'min' = 'sum'): string => {
  if (controller === 'all') {
    return `${aggregation}(${metric})`;
  }
  return `${metric}{controller="${controller}"}`;
};

// Build query with additional labels (like result="success")
const buildQueryWithLabels = (metric: string, labels: string, controller: string, aggregation: 'sum' | 'avg' = 'sum'): string => {
  if (controller === 'all') {
    return `${aggregation}(${metric}{${labels}})`;
  }
  return `${metric}{controller="${controller}",${labels}}`;
};

// Convert seconds to PromQL time range string (e.g., 3600 -> "1h", 1800 -> "30m")
const timeRangeToString = (seconds: number): string => {
  if (seconds >= 3600 && seconds % 3600 === 0) {
    return `${seconds / 3600}h`;
  }
  if (seconds >= 60) {
    return `${Math.floor(seconds / 60)}m`;
  }
  return `${seconds}s`;
};

// Build query for counter metrics using increase() to show change over time period
const buildCounterQuery = (metric: string, controller: string, timeRangeStr: string): string => {
  if (controller === 'all') {
    return `sum(increase(${metric}[${timeRangeStr}]))`;
  }
  return `increase(${metric}{controller="${controller}"}[${timeRangeStr}])`;
};

// Build counter query with additional labels
const buildCounterQueryWithLabels = (metric: string, labels: string, controller: string, timeRangeStr: string): string => {
  if (controller === 'all') {
    return `sum(increase(${metric}{${labels}}[${timeRangeStr}]))`;
  }
  return `increase(${metric}{controller="${controller}",${labels}}[${timeRangeStr}])`;
};

export function useGslbMetrics(timeRange: number = 3600, controller: string = 'all') {
  const [metrics, setMetrics] = useState<GslbMetrics>(defaultMetrics);
  const [controllers, setControllers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch available controllers using query_range
  const fetchControllers = useCallback(async () => {
    try {
      const now = Math.floor(Date.now() / 1000);
      const start = now - 300; // Last 5 minutes
      const step = 60;

      // Query to get unique controller labels using query_range
      const response = await api.get('/api/v1/query_range', {
        params: {
          query: 'elchi_gslb_total_ips',
          start,
          end: now,
          step
        }
      });

      const results = response?.data?.data?.result || [];
      const controllerList = [...new Set(
        results
          .map((r: any) => r.metric?.controller)
          .filter((c: string) => c)
      )] as string[];

      setControllers(controllerList);
    } catch (err) {
      console.error('Error fetching controllers:', err);
      setControllers([]);
    }
  }, []);

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const now = Math.floor(Date.now() / 1000);
      const start = now - timeRange;
      const step = Math.max(15, Math.floor(timeRange / 120)); // ~120 data points
      const timeRangeStr = timeRangeToString(timeRange); // For increase() queries

      // Fetch all metrics in parallel
      const [
        totalIpsRes,
        healthyIpsRes,
        warningIpsRes,
        criticalIpsRes,
        backoffActiveRes,
        probesSuccessRes,
        probesFailureRes,
        successRateRes,
        latencyAvgRes,
        latencyMinRes,
        latencyMaxRes,
        errorsRes,
        workersActiveRes,
        workersQueueRes,
        timewheelLoadRes,
        timewheelSlotRes,
        timewheelExecutedRes,
        timewheelScheduledRes,
        writeBufferSizeRes,
        writeBufferCapacityRes,
        writeBufferFlushTotalRes,
        writeBufferFlushErrorsRes,
        writeBufferFlushDurationRes,
        writeBufferUpdatesRes,
        resultQueueDepthRes,
        resultQueueCapacityRes,
        ownedShardsRes,
      ] = await Promise.all([
        // IP Stats (sum for all)
        api.get('/api/v1/query_range', { params: { query: buildQuery('elchi_gslb_total_ips', controller, 'sum'), start, end: now, step } }),
        api.get('/api/v1/query_range', { params: { query: buildQuery('elchi_gslb_healthy_ips', controller, 'sum'), start, end: now, step } }),
        api.get('/api/v1/query_range', { params: { query: buildQuery('elchi_gslb_warning_ips', controller, 'sum'), start, end: now, step } }),
        api.get('/api/v1/query_range', { params: { query: buildQuery('elchi_gslb_critical_ips', controller, 'sum'), start, end: now, step } }),
        api.get('/api/v1/query_range', { params: { query: buildQuery('elchi_gslb_backoff_active_ips', controller, 'sum'), start, end: now, step } }),

        // Probe Stats (counter metrics - use increase() to show change over time period)
        api.get('/api/v1/query_range', { params: { query: buildCounterQueryWithLabels('elchi_gslb_probes_total', 'result="success"', controller, timeRangeStr), start, end: now, step } }),
        api.get('/api/v1/query_range', { params: { query: buildCounterQueryWithLabels('elchi_gslb_probes_total', 'result="failure"', controller, timeRangeStr), start, end: now, step } }),
        api.get('/api/v1/query_range', { params: { query: buildQuery('elchi_gslb_probe_success_rate_percent', controller, 'avg'), start, end: now, step } }),

        // Latency (avg/min/max appropriately)
        api.get('/api/v1/query_range', { params: { query: buildQuery('elchi_gslb_probe_latency_avg_seconds', controller, 'avg'), start, end: now, step } }),
        api.get('/api/v1/query_range', { params: { query: buildQuery('elchi_gslb_probe_latency_min_seconds', controller, 'min'), start, end: now, step } }),
        api.get('/api/v1/query_range', { params: { query: buildQuery('elchi_gslb_probe_latency_max_seconds', controller, 'max'), start, end: now, step } }),

        // Errors - dynamic query to get all error types by label
        api.get('/api/v1/query_range', { params: {
          query: controller === 'all'
            ? `sum by (error_type) (increase(elchi_gslb_probe_errors_total[${timeRangeStr}]))`
            : `sum by (error_type) (increase(elchi_gslb_probe_errors_total{controller="${controller}"}[${timeRangeStr}]))`,
          start, end: now, step
        } }),

        // Workers (sum for all)
        api.get('/api/v1/query_range', { params: { query: buildQuery('elchi_gslb_workers_current', controller, 'sum'), start, end: now, step } }),
        api.get('/api/v1/query_range', { params: { query: buildQuery('elchi_gslb_workers_queue_depth', controller, 'sum'), start, end: now, step } }),

        // Timewheel (gauges + counters)
        api.get('/api/v1/query_range', { params: { query: buildQuery('elchi_gslb_timewheel_current_load', controller, 'sum'), start, end: now, step } }),
        api.get('/api/v1/query_range', { params: { query: buildQuery('elchi_gslb_timewheel_current_slot', controller, 'avg'), start, end: now, step } }),
        // Counter metrics - use increase()
        api.get('/api/v1/query_range', { params: { query: buildCounterQuery('elchi_gslb_timewheel_executed_total', controller, timeRangeStr), start, end: now, step } }),
        api.get('/api/v1/query_range', { params: { query: buildCounterQuery('elchi_gslb_timewheel_scheduled_total', controller, timeRangeStr), start, end: now, step } }),

        // Write Buffer (gauges + counters)
        api.get('/api/v1/query_range', { params: { query: buildQuery('elchi_gslb_write_buffer_size', controller, 'sum'), start, end: now, step } }),
        api.get('/api/v1/query_range', { params: { query: buildQuery('elchi_gslb_write_buffer_capacity_pct', controller, 'avg'), start, end: now, step } }),
        // Counter metrics - use increase()
        api.get('/api/v1/query_range', { params: { query: buildCounterQuery('elchi_gslb_write_buffer_flush_total', controller, timeRangeStr), start, end: now, step } }),
        api.get('/api/v1/query_range', { params: { query: buildCounterQuery('elchi_gslb_write_buffer_flush_errors_total', controller, timeRangeStr), start, end: now, step } }),
        api.get('/api/v1/query_range', { params: { query: buildQuery('elchi_gslb_write_buffer_avg_flush_duration_seconds', controller, 'avg'), start, end: now, step } }),
        api.get('/api/v1/query_range', { params: { query: buildCounterQuery('elchi_gslb_write_buffer_updates_total', controller, timeRangeStr), start, end: now, step } }),

        // Queues (sum/avg)
        api.get('/api/v1/query_range', { params: { query: buildQuery('elchi_gslb_result_queue_depth', controller, 'sum'), start, end: now, step } }),
        api.get('/api/v1/query_range', { params: { query: buildQuery('elchi_gslb_result_queue_capacity_pct', controller, 'avg'), start, end: now, step } }),

        // Shards (sum)
        api.get('/api/v1/query_range', { params: { query: buildQuery('elchi_gslb_owned_shards', controller, 'sum'), start, end: now, step } }),
      ]);

      // Build probes trend data
      const successValues = probesSuccessRes?.data?.data?.result?.[0]?.values || [];
      const failureValues = probesFailureRes?.data?.data?.result?.[0]?.values || [];
      const probesTrend = successValues.map(([timestamp, value]: [number, string], index: number) => ({
        time: timestamp * 1000,
        success: parseFloat(value) || 0,
        failure: failureValues[index] ? parseFloat(failureValues[index][1]) || 0 : 0,
      }));

      // Parse dynamic errors from response
      const errorResults = errorsRes?.data?.data?.result || [];
      const errors: ErrorData[] = errorResults
        .map((result: any, index: number) => {
          const errorType = result.metric?.error_type || 'unknown';
          const values = result.values || [];
          const lastValue = values.length > 0 ? parseFloat(values[values.length - 1][1]) || 0 : 0;
          return {
            type: errorType,
            value: lastValue,
            color: ERROR_COLORS[index % ERROR_COLORS.length],
          };
        })
        .filter((e: ErrorData) => e.value > 0);

      // Build error trend data - dynamic per error type
      const errorTrend: Array<{ time: number; type: string; value: number }[]> = [];
      if (errorResults.length > 0) {
        const firstResult = errorResults[0];
        const timestamps = firstResult?.values?.map((v: any) => v[0] * 1000) || [];
        timestamps.forEach((time: number, timeIndex: number) => {
          const point: { time: number; type: string; value: number }[] = errorResults.map((result: any) => ({
            time,
            type: result.metric?.error_type || 'unknown',
            value: parseFloat(result.values?.[timeIndex]?.[1]) || 0,
          }));
          errorTrend.push(point);
        });
      }

      setMetrics({
        totalIps: extractLastValue(totalIpsRes),
        healthyIps: extractLastValue(healthyIpsRes),
        warningIps: extractLastValue(warningIpsRes),
        criticalIps: extractLastValue(criticalIpsRes),
        backoffActiveIps: extractLastValue(backoffActiveRes),
        probesSuccess: extractLastValue(probesSuccessRes),
        probesFailure: extractLastValue(probesFailureRes),
        successRate: extractLastValue(successRateRes),
        latencyAvg: extractLastValue(latencyAvgRes),
        latencyMin: extractLastValue(latencyMinRes),
        latencyMax: extractLastValue(latencyMaxRes),
        errors,
        workersActive: extractLastValue(workersActiveRes),
        workersQueueDepth: extractLastValue(workersQueueRes),
        timewheelCurrentLoad: extractLastValue(timewheelLoadRes),
        timewheelCurrentSlot: extractLastValue(timewheelSlotRes),
        timewheelExecuted: extractLastValue(timewheelExecutedRes),
        timewheelScheduled: extractLastValue(timewheelScheduledRes),
        writeBufferSize: extractLastValue(writeBufferSizeRes),
        writeBufferCapacityPct: extractLastValue(writeBufferCapacityRes),
        writeBufferFlushTotal: extractLastValue(writeBufferFlushTotalRes),
        writeBufferFlushErrors: extractLastValue(writeBufferFlushErrorsRes),
        writeBufferAvgFlushDuration: extractLastValue(writeBufferFlushDurationRes),
        writeBufferUpdatesTotal: extractLastValue(writeBufferUpdatesRes),
        resultQueueDepth: extractLastValue(resultQueueDepthRes),
        resultQueueCapacityPct: extractLastValue(resultQueueCapacityRes),
        ownedShards: extractLastValue(ownedShardsRes),
        successRateTrend: extractTrend(successRateRes),
        latencyTrend: extractTrend(latencyAvgRes),
        probesTrend,
        errorTrend,
      });
    } catch (err) {
      console.error('Error fetching GSLB metrics:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch GSLB metrics'));
    } finally {
      setLoading(false);
    }
  }, [timeRange, controller]);

  useEffect(() => {
    fetchControllers();
  }, [fetchControllers]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return { metrics, controllers, loading, error, refetch: fetchMetrics };
}
