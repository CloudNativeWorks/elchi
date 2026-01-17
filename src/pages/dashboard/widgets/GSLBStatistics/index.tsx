/**
 * GSLB Statistics Widget
 * Full-width widget displaying GSLB health metrics with timeline charts
 * Supports controller filtering
 */

import React, { useState, useEffect, useCallback } from 'react';
import { GlobalOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Select, Button, Space, Typography, Tag } from 'antd';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { LineChart, PieChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { BaseWidget } from '../shared/BaseWidget';
import { useDashboardRefresh } from '../../context/DashboardRefreshContext';
import { api } from '@/common/api';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.scss';

echarts.use([
  LineChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  CanvasRenderer,
]);

const { Option } = Select;
const { Text } = Typography;

interface TimeRange {
  label: string;
  value: number;
}

const TIME_RANGES: TimeRange[] = [
  { label: '1 Hour', value: 3600 },
  { label: '6 Hours', value: 21600 },
  { label: '24 Hours', value: 86400 },
];

interface ErrorData {
  type: string;
  value: number;
  color: string;
}

interface GslbStats {
  totalIps: number;
  healthyIps: number;
  criticalIps: number;
  warningIps: number;
  successRate: number;
  latencyAvg: number;
  probesSuccess: number;
  probesFailure: number;
  successRateTrend: Array<[number, number]>;
  latencyTrend: Array<[number, number]>;
  errors: ErrorData[];
}

// Color palette for dynamic error types
const ERROR_COLORS = ['#ff7875', '#ffc069', '#95de64', '#69c0ff', '#b37feb', '#ff85c0', '#36cfc9', '#ffd666'];

// Build query with controller filter
const buildQuery = (metric: string, controller: string, aggregation: 'sum' | 'avg' | 'max' | 'min' = 'sum'): string => {
  if (controller === 'all') {
    return `${aggregation}(${metric})`;
  }
  return `${metric}{controller="${controller}"}`;
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

// Build counter query with additional labels using increase()
const buildCounterQueryWithLabels = (metric: string, labels: string, controller: string, timeRangeStr: string): string => {
  if (controller === 'all') {
    return `sum(increase(${metric}{${labels}}[${timeRangeStr}]))`;
  }
  return `increase(${metric}{controller="${controller}",${labels}}[${timeRangeStr}])`;
};

export const GSLBStatistics: React.FC = () => {
  const navigate = useNavigate();
  const { refreshTrigger } = useDashboardRefresh();
  const [timeRange, setTimeRange] = useState<number>(3600);
  const [controller, setController] = useState<string>('all');
  const [controllers, setControllers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [stats, setStats] = useState<GslbStats>({
    totalIps: 0,
    healthyIps: 0,
    criticalIps: 0,
    warningIps: 0,
    successRate: 0,
    latencyAvg: 0,
    probesSuccess: 0,
    probesFailure: 0,
    successRateTrend: [],
    latencyTrend: [],
    errors: [],
  });

  const extractLastValue = (response: any): number => {
    const values = response?.data?.data?.result?.[0]?.values;
    if (!values || values.length === 0) return 0;
    return parseFloat(values[values.length - 1][1]) || 0;
  };

  const extractTrend = (response: any): Array<[number, number]> => {
    const values = response?.data?.data?.result?.[0]?.values;
    if (!values || values.length === 0) return [];
    return values.map(([timestamp, value]: [number, string]) => [
      timestamp * 1000,
      parseFloat(value) || 0,
    ]);
  };

  // Fetch available controllers using query_range
  const fetchControllers = useCallback(async () => {
    try {
      const now = Math.floor(Date.now() / 1000);
      const start = now - 300; // Last 5 minutes
      const step = 60;

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

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const now = Math.floor(Date.now() / 1000);
      const start = now - timeRange;
      const step = Math.max(15, Math.floor(timeRange / 120));
      const timeRangeStr = timeRangeToString(timeRange); // For increase() queries

      // Build dynamic error query - sum by error_type to get all error types
      const errorQuery = controller === 'all'
        ? `sum by (error_type) (increase(elchi_gslb_probe_errors_total[${timeRangeStr}]))`
        : `sum by (error_type) (increase(elchi_gslb_probe_errors_total{controller="${controller}"}[${timeRangeStr}]))`;

      const [
        totalIpsRes,
        healthyIpsRes,
        criticalIpsRes,
        warningIpsRes,
        successRateRes,
        latencyAvgRes,
        probesSuccessRes,
        probesFailureRes,
        errorsRes,
      ] = await Promise.all([
        // Gauge metrics - show current value
        api.get('/api/v1/query_range', { params: { query: buildQuery('elchi_gslb_total_ips', controller, 'sum'), start, end: now, step } }),
        api.get('/api/v1/query_range', { params: { query: buildQuery('elchi_gslb_healthy_ips', controller, 'sum'), start, end: now, step } }),
        api.get('/api/v1/query_range', { params: { query: buildQuery('elchi_gslb_critical_ips', controller, 'sum'), start, end: now, step } }),
        api.get('/api/v1/query_range', { params: { query: buildQuery('elchi_gslb_warning_ips', controller, 'sum'), start, end: now, step } }),
        api.get('/api/v1/query_range', { params: { query: buildQuery('elchi_gslb_probe_success_rate_percent', controller, 'avg'), start, end: now, step } }),
        api.get('/api/v1/query_range', { params: { query: buildQuery('elchi_gslb_probe_latency_avg_seconds', controller, 'avg'), start, end: now, step } }),
        // Counter metrics - use increase() to show change over time period
        api.get('/api/v1/query_range', { params: { query: buildCounterQueryWithLabels('elchi_gslb_probes_total', 'result="success"', controller, timeRangeStr), start, end: now, step } }),
        api.get('/api/v1/query_range', { params: { query: buildCounterQueryWithLabels('elchi_gslb_probes_total', 'result="failure"', controller, timeRangeStr), start, end: now, step } }),
        // Dynamic errors - get all error types by label
        api.get('/api/v1/query_range', { params: { query: errorQuery, start, end: now, step } }),
      ]);

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

      setStats({
        totalIps: extractLastValue(totalIpsRes),
        healthyIps: extractLastValue(healthyIpsRes),
        criticalIps: extractLastValue(criticalIpsRes),
        warningIps: extractLastValue(warningIpsRes),
        successRate: extractLastValue(successRateRes),
        latencyAvg: extractLastValue(latencyAvgRes),
        probesSuccess: extractLastValue(probesSuccessRes),
        probesFailure: extractLastValue(probesFailureRes),
        successRateTrend: extractTrend(successRateRes),
        latencyTrend: extractTrend(latencyAvgRes),
        errors,
      });
    } catch (err) {
      console.error('Error fetching GSLB stats:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [timeRange, controller]);

  useEffect(() => {
    fetchControllers();
  }, [fetchControllers]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshTrigger]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
    return num.toFixed(0);
  };

  // Success Rate & Latency Timeline Chart
  const timelineChartOptions = {
    animation: false,
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const time = new Date(params[0].value[0]).toLocaleTimeString();
        let tooltip = `<strong>${time}</strong><br/>`;
        params.forEach((param: any) => {
          if (param.seriesName === 'Success Rate') {
            tooltip += `${param.marker} ${param.seriesName}: <strong>${param.value[1].toFixed(2)}%</strong><br/>`;
          } else {
            tooltip += `${param.marker} ${param.seriesName}: <strong>${(param.value[1] * 1000).toFixed(0)}ms</strong><br/>`;
          }
        });
        return tooltip;
      },
    },
    legend: {
      show: true,
      bottom: 0,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '40px',
      top: '10px',
      containLabel: true,
    },
    xAxis: {
      type: 'time',
      boundaryGap: false,
      axisLabel: {
        formatter: (value: number) => new Date(value).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      },
    },
    yAxis: [
      {
        type: 'value',
        name: '%',
        min: 0,
        max: 100,
        position: 'left',
        axisLabel: { formatter: '{value}%' },
      },
      {
        type: 'value',
        name: 'ms',
        position: 'right',
        axisLabel: { formatter: (value: number) => `${(value * 1000).toFixed(0)}ms` },
      },
    ],
    series: [
      {
        name: 'Success Rate',
        type: 'line',
        yAxisIndex: 0,
        data: stats.successRateTrend,
        smooth: true,
        showSymbol: false,
        lineStyle: { color: '#52c41a', width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(82, 196, 26, 0.3)' },
            { offset: 1, color: 'rgba(82, 196, 26, 0.05)' },
          ]),
        },
      },
      {
        name: 'Avg Latency',
        type: 'line',
        yAxisIndex: 1,
        data: stats.latencyTrend,
        smooth: true,
        showSymbol: false,
        lineStyle: { color: '#1890ff', width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
            { offset: 1, color: 'rgba(24, 144, 255, 0.05)' },
          ]),
        },
      },
    ],
    dataZoom: [{ type: 'inside', start: 0, end: 100 }],
  };

  // Error Distribution Pie Chart - dynamic from stats.errors
  // Filter out values < 1 (too small to display meaningfully)
  const visibleErrors = stats.errors.filter(e => e.value >= 1);
  const totalErrors = stats.errors.reduce((sum, e) => sum + e.value, 0);
  const errorPieOptions = {
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { show: false },
    series: [{
      type: 'pie',
      radius: ['45%', '75%'],
      center: ['50%', '50%'],
      minAngle: 5, // Minimum angle for small slices to be visible
      label: { show: false },
      data: visibleErrors.map(e => ({
        value: Math.round(e.value),
        name: e.type.replace(/_/g, ' '),
        itemStyle: { color: e.color },
      })),
    }],
  };

  return (
    <BaseWidget
      title="GSLB Health Check Statistics"
      icon={<GlobalOutlined />}
      loading={loading}
      error={error}
      onRefresh={fetchData}
    >
      <div className={styles.controls}>
        <Space>
          <Select
            value={controller}
            onChange={setController}
            style={{ width: 160 }}
            size="small"
          >
            <Option value="all">All Controllers</Option>
            {controllers.map((c) => (
              <Option key={c} value={c}>{c}</Option>
            ))}
          </Select>
          <Select value={timeRange} onChange={setTimeRange} style={{ width: 120 }} size="small">
            {TIME_RANGES.map((range) => (
              <Option key={range.value} value={range.value}>{range.label}</Option>
            ))}
          </Select>
          <Button
            type="link"
            size="small"
            icon={<ArrowRightOutlined />}
            onClick={() => navigate('/gslb/statistics')}
          >
            View Details
          </Button>
        </Space>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.primary}`}>
          <div className={styles.statValue}>{stats.totalIps}</div>
          <div className={styles.statLabel}>Total IPs</div>
        </div>
        <div className={`${styles.statCard} ${styles.success}`}>
          <div className={styles.statValue}>{stats.healthyIps}</div>
          <div className={styles.statLabel}>Healthy</div>
        </div>
        <div className={`${styles.statCard} ${styles.error}`}>
          <div className={styles.statValue}>{stats.criticalIps}</div>
          <div className={styles.statLabel}>Critical</div>
        </div>
        <div className={`${styles.statCard} ${styles.warning}`}>
          <div className={styles.statValue}>{stats.warningIps}</div>
          <div className={styles.statLabel}>Warning</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue} style={{ color: stats.successRate >= 70 ? '#52c41a' : stats.successRate >= 30 ? '#faad14' : '#ff4d4f' }}>
            {stats.successRate.toFixed(1)}%
          </div>
          <div className={styles.statLabel}>Success Rate</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue} style={{ color: '#1890ff' }}>
            {(stats.latencyAvg * 1000).toFixed(0)}ms
          </div>
          <div className={styles.statLabel}>Avg Latency</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className={styles.chartsRow}>
        {/* Timeline Chart */}
        <div className={styles.chartContainer}>
          <ReactEChartsCore
            echarts={echarts}
            option={timelineChartOptions}
            style={{ height: '200px', width: '100%' }}
            notMerge={true}
            lazyUpdate={true}
          />
        </div>

        {/* Error Distribution */}
        <div style={{ textAlign: 'center' }}>
          <Text type="secondary" style={{ fontSize: 12, marginBottom: 8, display: 'block' }}>
            Error Distribution ({formatNumber(totalErrors)} total)
          </Text>
          <ReactEChartsCore
            echarts={echarts}
            option={errorPieOptions}
            style={{ height: '180px', width: '100%' }}
          />
          <Space size={4} wrap style={{ marginTop: 8, justifyContent: 'center' }}>
            {visibleErrors.map(e => (
              <Tag key={e.type} color={e.color}>{e.type.replace(/_/g, ' ')}</Tag>
            ))}
          </Space>
        </div>
      </div>
    </BaseWidget>
  );
};
