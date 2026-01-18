/**
 * Request Rate Timeline Widget
 * Displays request rate over time with ECharts line chart
 */

import React, { useState, useEffect, useCallback } from 'react';
import { LineChartOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { BaseWidget } from '../shared/BaseWidget';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { useDashboardRefresh } from '../../context/DashboardRefreshContext';
import { api } from '@/common/api';
import { formatNumber } from '../../utils/formatters';
import { useChartTheme } from '@/utils/chartTheme';
import styles from './styles.module.scss';

echarts.use([
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  CanvasRenderer,
]);

const { Option } = Select;

interface TimeRange {
  label: string;
  value: number; // seconds
}

const TIME_RANGES: TimeRange[] = [
  { label: '1 Hour', value: 3600 },
  { label: '6 Hours', value: 21600 },
  { label: '24 Hours', value: 86400 },
];

export const RequestRateTimeline: React.FC = () => {
  const projectContext = useProjectVariable();
  const { refreshTrigger } = useDashboardRefresh();
  const { options: themeOptions } = useChartTheme();
  const project = typeof projectContext === 'string' ? projectContext : projectContext.project;

  const [timeRange, setTimeRange] = useState<number>(3600); // Default: 1 hour
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!project) return;

    try {
      setLoading(true);
      setError(null);

      const now = Math.floor(Date.now() / 1000);
      const start = now - timeRange;
      const step = Math.floor(timeRange / 120); // ~120 data points

      const query = `sum by (envoy_cluster_name)(rate({__name__=~".*_${project}_cluster_upstream_rq_total", envoy_cluster_name!="elchi-control-plane"}[5m]))`;

      const response = await api.get('/api/v1/query_range', {
        params: { query, start, end: now, step },
      });

      if (response?.data?.data?.result) {
        // Sort by average value and take top 10
        const sorted = response.data.data.result
          .map((series: any) => {
            const avg = series.values.reduce((sum: number, [_, val]: [number, string]) =>
              sum + parseFloat(val), 0) / series.values.length;
            return { ...series, avg };
          })
          .sort((a: any, b: any) => b.avg - a.avg)
          .slice(0, 10);

        setChartData(sorted);
      }
    } catch (err) {
      console.error('Error fetching request rate data:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [project, timeRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshTrigger]);

  const chartOptions = {
    ...themeOptions,
    animation: false,
    tooltip: {
      ...themeOptions.tooltip,
      trigger: 'axis',
      formatter: (params: any) => {
        const time = new Date(params[0].value[0] * 1000).toLocaleString();
        let tooltip = `<strong>${time}</strong><br/>`;
        params.forEach((param: any) => {
          const value = formatNumber(param.value[1], 2);
          tooltip += `${param.marker} ${param.seriesName}: <strong>${value} req/s</strong><br/>`;
        });
        return tooltip;
      },
    },
    legend: {
      ...themeOptions.legend,
      show: true,
      bottom: 0,
      type: 'scroll',
    },
    grid: {
      ...themeOptions.grid,
      left: '3%',
      right: '4%',
      bottom: '60px',
      top: '10px'
    },
    xAxis: {
      ...themeOptions.xAxis,
      type: 'time',
      boundaryGap: false,
    },
    yAxis: {
      ...themeOptions.yAxis,
      type: 'value',
      name: 'req/s',
      axisLabel: {
        ...themeOptions.yAxis?.axisLabel,
        formatter: (value: number) => formatNumber(value, 1),
      },
    },
    series: chartData.map((series) => ({
      name: series.metric.envoy_cluster_name || 'Unknown',
      type: 'line',
      showSymbol: false,
      data: series.values.map(([timestamp, value]: [number, string]) => [
        timestamp * 1000,
        parseFloat(value),
      ]),
      smooth: true,
      areaStyle: {
        opacity: 0.1,
      },
    })),
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100,
      },
    ],
  };

  return (
    <BaseWidget
      title="Clusters Request Rate (Top 10)"
      icon={<LineChartOutlined />}
      loading={loading}
      error={error}
      onRefresh={fetchData}
    >
      <div className={styles.controls}>
        <Select
          value={timeRange}
          onChange={setTimeRange}
          style={{ width: 120 }}
          size="small"
        >
          {TIME_RANGES.map((range) => (
            <Option key={range.value} value={range.value}>
              {range.label}
            </Option>
          ))}
        </Select>
      </div>
      <div className={styles.chartContainer}>
        <ReactEChartsCore
          echarts={echarts}
          option={chartOptions}
          style={{ height: '200px', width: '100%' }}
          notMerge={true}
          lazyUpdate={true}
        />
      </div>
    </BaseWidget>
  );
};
