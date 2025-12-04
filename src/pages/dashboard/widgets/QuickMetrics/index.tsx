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

export const QuickMetrics: React.FC = () => {
  const { metrics, loading } = useQuickMetrics();

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
          color="#0a7fda"
        />
        <MetricCard
          title="Error Rate"
          value={`${metrics.errorRate.value.toFixed(2)} req/s`}
          icon={<WarningOutlined />}
          trend={metrics.errorRate.trend}
          type="number"
          color="#ef4444"
        />
        <MetricCard
          title="Avg Response Time"
          value={`${metrics.avgResponseTime.value}ms`}
          icon={<ClockCircleOutlined />}
          trend={metrics.avgResponseTime.trend}
          type="number"
          color="#f59e0b"
        />
        <MetricCard
          title="Healthy Clusters"
          value={metrics.healthyClusters.value}
          icon={<ClusterOutlined />}
          trend={metrics.healthyClusters.trend}
          type="percentage"
          color="#10b981"
        />
      </div>
    </div>
  );
};

export default QuickMetrics;
