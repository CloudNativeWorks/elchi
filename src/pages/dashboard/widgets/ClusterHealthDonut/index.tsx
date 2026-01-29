/**
 * Cluster Health Distribution Donut Chart
 */

import React, { useState, useEffect, useCallback } from 'react';
import { PieChartOutlined } from '@ant-design/icons';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { TooltipComponent, LegendComponent, TitleComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { BaseWidget } from '../shared/BaseWidget';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { useDashboardRefresh } from '../../context/DashboardRefreshContext';
import { api } from '@/common/api';
import { useChartTheme } from '@/utils/chartTheme';

echarts.use([PieChart, TooltipComponent, LegendComponent, TitleComponent, CanvasRenderer]);

export const ClusterHealthDonut: React.FC = () => {
  const projectContext = useProjectVariable();
  const project = typeof projectContext === 'string' ? projectContext : projectContext.project;
  const { refreshTrigger } = useDashboardRefresh();
  const { theme: chartTheme } = useChartTheme();
  const [data, setData] = useState({ healthy: 0, unhealthy: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!project) return;
    try {
      setLoading(true);
      const now = Math.floor(Date.now() / 1000);
      const [healthyRes, totalRes] = await Promise.all([
        api.get('/api/v1/query_range', {
          params: {
            query: `sum({__name__=~".*_${project}_cluster_membership_healthy", envoy_cluster_name!="elchi-control-plane"})`,
            start: now - 300,
            end: now,
            step: 60
          }
        }),
        api.get('/api/v1/query_range', {
          params: {
            query: `sum({__name__=~".*_${project}_cluster_membership_total", envoy_cluster_name!="elchi-control-plane"})`,
            start: now - 300,
            end: now,
            step: 60
          }
        }),
      ]);

      // Get last value from query_range result
      const healthyValues = healthyRes?.data?.data?.result?.[0]?.values || [];
      const totalValues = totalRes?.data?.data?.result?.[0]?.values || [];
      const healthy = healthyValues.length > 0 ? parseFloat(healthyValues[healthyValues.length - 1][1]) : 0;
      const total = totalValues.length > 0 ? parseFloat(totalValues[totalValues.length - 1][1]) : 0;
      const healthyPercent = total > 0 ? (healthy / total) * 100 : 100;

      setData({
        healthy: Math.round(healthyPercent),
        unhealthy: Math.round(100 - healthyPercent),
      });
    } catch (err) {
      console.error('Error fetching cluster health:', err);
    } finally {
      setLoading(false);
    }
  }, [project]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshTrigger]);

  const chartOptions = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}% ({d}%)',
      backgroundColor: chartTheme.tooltipBg,
      borderColor: chartTheme.tooltipBorder,
      textStyle: { color: chartTheme.tooltipTextColor }
    },
    legend: {
      bottom: 0,
      left: 'center',
      textStyle: { fontSize: 11, color: chartTheme.legendTextColor }
    },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '40%'],
      label: { show: true, formatter: '{c}%', fontSize: 12, color: chartTheme.textColor },
      data: [
        { value: data.healthy, name: 'Healthy', itemStyle: { color: chartTheme.successColor } },
        { value: data.unhealthy, name: 'Unhealthy', itemStyle: { color: chartTheme.dangerColor } },
      ],
    }],
  };

  return (
    <BaseWidget title="Cluster Health" icon={<PieChartOutlined />} loading={loading} onRefresh={fetchData}>
      <ReactEChartsCore echarts={echarts} option={chartOptions} style={{ height: '200px', width: '100%' }} />
    </BaseWidget>
  );
};
