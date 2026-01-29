/**
 * Response Time Trends Widget
 * Multi-line chart showing service response times
 */

import React, { useState, useEffect, useCallback } from 'react';
import { LineChartOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent, TitleComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { BaseWidget } from '../shared/BaseWidget';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { useDashboardRefresh } from '../../context/DashboardRefreshContext';
import { api } from '@/common/api';
import { formatMilliseconds } from '../../utils/formatters';
import { useChartTheme } from '@/utils/chartTheme';
import styles from './styles.module.scss';

echarts.use([LineChart, GridComponent, TooltipComponent, LegendComponent, TitleComponent, CanvasRenderer]);

const PERCENTILES = [
  { label: 'P50', value: 0.5 },
  { label: 'P90', value: 0.9 },
  { label: 'P95', value: 0.95 },
  { label: 'P99', value: 0.99 },
];

export const ResponseTimeTrends: React.FC = () => {
  const projectContext = useProjectVariable();
  const { refreshTrigger } = useDashboardRefresh();
  const { options: themeOptions } = useChartTheme();
  const project = typeof projectContext === 'string' ? projectContext : projectContext.project;
  const [percentile, setPercentile] = useState(0.95);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!project) return;

    try {
      setLoading(true);
      setError(null);

      const now = Math.floor(Date.now() / 1000);
      const start = now - 3600;
      const step = 120;

      const query = `histogram_quantile(${percentile}, sum by (envoy_cluster_name, le)(rate({__name__=~".*_${project}_cluster_upstream_rq_time_bucket", envoy_cluster_name!="elchi-control-plane"}[5m])))`;

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
      console.error('Error fetching response time trends:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [project, percentile]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshTrigger]);

  const chartOptions = {
    ...themeOptions,
    animation: true,
    animationDuration: 300,
    tooltip: {
      ...themeOptions.tooltip,
      trigger: 'axis',
      formatter: (params: any) => {
        const time = new Date(params[0].value[0] * 1000).toLocaleString();
        let tooltip = `<strong>${time}</strong><br/>`;
        params.forEach((param: any) => {
          tooltip += `${param.marker} ${param.seriesName}: <strong>${formatMilliseconds(param.value[1], 0)}</strong><br/>`;
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
    grid: { ...themeOptions.grid, left: '3%', right: '4%', bottom: '60px', top: '10px' },
    xAxis: { ...themeOptions.xAxis, type: 'time' },
    yAxis: {
      ...themeOptions.yAxis,
      type: 'value',
      axisLabel: {
        ...themeOptions.yAxis?.axisLabel,
        formatter: (v: number) => formatMilliseconds(v, 0)
      }
    },
    series: chartData.map((s) => ({
      name: s.metric.envoy_cluster_name || 'Unknown',
      type: 'line',
      showSymbol: false,
      data: s.values.map(([t, v]: [number, string]) => [t * 1000, parseFloat(v)]),
      smooth: true,
    })),
  };

  return (
    <BaseWidget title="Clusters Response Time Trends (Top 10)" icon={<LineChartOutlined />} loading={loading} error={error} onRefresh={fetchData}>
      <div className={styles.controls}>
        <Select value={percentile} onChange={setPercentile} style={{ width: 80 }} size="small">
          {PERCENTILES.map((p) => (
            <Select.Option key={p.value} value={p.value}>{p.label}</Select.Option>
          ))}
        </Select>
      </div>
      <ReactEChartsCore echarts={echarts} option={chartOptions} style={{ height: '200px', width: '100%' }} />
    </BaseWidget>
  );
};
