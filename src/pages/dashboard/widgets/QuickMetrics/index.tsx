/**
 * Quick Metrics Dashboard Widget
 * Displays 4 key metrics in mini cards
 */

import React from 'react';
import {
  ApiOutlined,
  WarningOutlined,
  ClockCircleOutlined,
  ClusterOutlined,
} from '@ant-design/icons';
import { MetricCard } from './MetricCard';
import { useQuickMetrics } from '../../hooks/useQuickMetrics';
import styles from './styles.module.scss';
import { useChartTheme } from '@/utils/chartTheme';

export const QuickMetrics: React.FC = () => {
  const { metrics, loading } = useQuickMetrics();
  const { theme: chartTheme } = useChartTheme();

  if (loading) {
    return (
      <div className={styles.quickMetrics}>
        <div className={styles.grid}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={styles.skeleton} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.quickMetrics}>
      <div className={styles.grid}>
        <MetricCard
          title="Active Connections"
          value={metrics.activeConnections.value}
          icon={<ApiOutlined />}
          trend={metrics.activeConnections.trend}
          type="number"
          color={chartTheme.seriesColors[0]}
        />
        <MetricCard
          title="Error Rate"
          value={`${metrics.errorRate.value.toFixed(2)} req/s`}
          icon={<WarningOutlined />}
          trend={metrics.errorRate.trend}
          type="number"
          color={chartTheme.dangerColor}
        />
        <MetricCard
          title="Avg Response Time"
          value={`${metrics.avgResponseTime.value}ms`}
          icon={<ClockCircleOutlined />}
          trend={metrics.avgResponseTime.trend}
          type="number"
          color={chartTheme.warningColor}
        />
        <MetricCard
          title="Healthy Clusters"
          value={metrics.healthyClusters.value}
          icon={<ClusterOutlined />}
          trend={metrics.healthyClusters.trend}
          type="percentage"
          color={chartTheme.successColor}
        />
      </div>
    </div>
  );
};
