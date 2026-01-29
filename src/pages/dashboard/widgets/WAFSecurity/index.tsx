/**
 * WAF Security Widget - Coraza WAF Metrics
 * Shows blocked requests, rule matches, and threat trends
 */

import React, { useState, useEffect, useCallback } from 'react';
import { SafetyOutlined } from '@ant-design/icons';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { BarChart, LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent, TitleComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { BaseWidget } from '../shared/BaseWidget';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { api } from '@/common/api';
import { useDashboardRefresh } from '../../context/DashboardRefreshContext';
import styles from './styles.module.scss';
import { useChartTheme } from '@/utils/chartTheme';

echarts.use([BarChart, LineChart, GridComponent, TooltipComponent, LegendComponent, TitleComponent, CanvasRenderer]);

interface WAFMetrics {
  blocked: number;
  allowed: number;
  uniqueRules: number;
  timeline: Array<{ time: string; blocked: number; allowed: number; total: number }>;
}

export const WAFSecurity: React.FC = () => {
  const projectContext = useProjectVariable();
  const project = typeof projectContext === 'string' ? projectContext : projectContext.project;
  const { refreshTrigger } = useDashboardRefresh();
  const { theme: chartTheme } = useChartTheme();

  const [metrics, setMetrics] = useState<WAFMetrics>({
    blocked: 0,
    allowed: 0,
    uniqueRules: 0,
    timeline: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!project) return;

    try {
      setLoading(true);
      setError(null);

      const now = Math.floor(Date.now() / 1000);
      const start = now - 3600; // Last 1 hour
      const step = 300; // 5 min intervals

      // Fetch WAF metrics in parallel
      const [totalRes, blockedRes, uniqueRulesRes] = await Promise.all([
        // Total transactions - use increase to get actual count over time window
        api.get('/api/v1/query_range', {
          params: {
            query: `sum(increase({__name__=~".*waf_filter_tx_total"}[5m]))`,
            start,
            end: now,
            step
          }
        }),
        // Blocked transactions (interruptions) - sum across all phases and rules
        api.get('/api/v1/query_range', {
          params: {
            query: `sum(increase({__name__=~".*waf_filter_tx_interruptions.*"}[5m]))`,
            start,
            end: now,
            step
          }
        }),
        // Count unique rule IDs that triggered
        api.get('/api/v1/query_range', {
          params: {
            query: `count(count by (rule_id) (increase({__name__=~".*waf_filter_tx_interruptions.*"}[5m])))`,
            start,
            end: now,
            step
          }
        })
      ]);

      // Extract values
      const totalValues = totalRes?.data?.data?.result?.[0]?.values || [];
      const blockedValues = blockedRes?.data?.data?.result?.[0]?.values || [];
      const uniqueRulesValues = uniqueRulesRes?.data?.data?.result?.[0]?.values || [];

      // Get the latest unique rules count (last value in the array)
      const uniqueRulesValue = uniqueRulesValues.length > 0
        ? parseFloat(uniqueRulesValues[uniqueRulesValues.length - 1][1])
        : 0;

      // Calculate totals - increase() already gives us the count, no need to multiply
      const totalTotal = totalValues.reduce((sum: number, [_, val]: [number, string]) =>
        sum + (parseFloat(val) || 0), 0);
      const totalBlocked = blockedValues.reduce((sum: number, [_, val]: [number, string]) =>
        sum + (parseFloat(val) || 0), 0);

      // Calculate allowed as total - blocked
      const totalAllowed = totalTotal - totalBlocked;

      // Build timeline - use total values as base (should be most complete)
      const timeline = totalValues.map(([timestamp, totalVal]: [number, string], idx: number) => {
        const total = parseFloat(totalVal) || 0;
        const blocked = parseFloat(blockedValues[idx]?.[1]) || 0;
        const allowed = total - blocked;

        return {
          time: new Date(timestamp * 1000).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          }),
          total,
          blocked,
          allowed
        };
      });

      setMetrics({
        blocked: Math.round(totalBlocked), // increase() already gives us the count
        allowed: Math.round(totalAllowed),
        uniqueRules: Math.round(uniqueRulesValue),
        timeline
      });
    } catch (err) {
      console.error('Error fetching WAF metrics:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [project]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshTrigger]); // Re-fetch when global refresh is triggered

  const chartOptions = {
    animation: true,
    animationDuration: 300,
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: chartTheme.tooltipBg,
      borderColor: chartTheme.tooltipBorder,
      textStyle: { color: chartTheme.tooltipTextColor }
    },
    legend: {
      data: ['Blocked', 'Allowed'],
      bottom: -3,
      textStyle: { fontSize: 11, color: chartTheme.legendTextColor }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '18%',
      top: '5%'
    },
    xAxis: {
      type: 'category',
      data: metrics.timeline.map(t => t.time),
      axisLabel: { fontSize: 10, rotate: 45, color: chartTheme.axisLabelColor },
      axisLine: { lineStyle: { color: chartTheme.axisLineColor } }
    },
    yAxis: {
      type: 'value',
      axisLabel: { fontSize: 10, color: chartTheme.axisLabelColor },
      axisLine: { lineStyle: { color: chartTheme.axisLineColor } },
      splitLine: { lineStyle: { color: chartTheme.axisSplitLineColor } }
    },
    series: [
      {
        name: 'Blocked',
        type: 'bar',
        stack: 'total',
        data: metrics.timeline.map(t => t.blocked),
        itemStyle: { color: chartTheme.dangerColor }
      },
      {
        name: 'Allowed',
        type: 'bar',
        stack: 'total',
        data: metrics.timeline.map(t => t.allowed),
        itemStyle: { color: chartTheme.successColor }
      }
    ]
  };

  return (
    <BaseWidget
      title="WAF Security - 1H"
      icon={<SafetyOutlined />}
      loading={loading}
      error={error}
      onRefresh={fetchData}
    >
      <div className={styles.container}>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <div className={styles.statLabel}>Blocked</div>
            <div className={styles.statValue} style={{ color: chartTheme.dangerColor }}>
              {metrics.blocked.toLocaleString()}
            </div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statLabel}>Allowed</div>
            <div className={styles.statValue} style={{ color: chartTheme.successColor }}>
              {metrics.allowed.toLocaleString()}
            </div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statLabel}>Unique Rules</div>
            <div className={styles.statValue} style={{ color: chartTheme.warningColor }}>
              {metrics.uniqueRules.toLocaleString()}
            </div>
          </div>
        </div>
        <ReactEChartsCore
          echarts={echarts}
          option={chartOptions}
          style={{ height: '150px', width: '100%' }}
        />
      </div>
    </BaseWidget>
  );
};
