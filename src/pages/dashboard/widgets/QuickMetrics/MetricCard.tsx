/**
 * Quick Metric Card Component
 * Individual metric card with sparkline/gauge
 */

import React from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { LineChart, GaugeChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { formatNumber, formatPercentage } from '../../utils/formatters';
import styles from './styles.module.scss';

echarts.use([LineChart, GaugeChart, CanvasRenderer]);

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: number[]; // Sparkline data
  type?: 'number' | 'percentage' | 'gauge';
  color?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  trend,
  type = 'number',
  color = 'var(--color-primary)',
}) => {
  const formattedValue =
    type === 'percentage'
      ? formatPercentage(Number(value), 1)
      : typeof value === 'number'
        ? formatNumber(value, 0)
        : value;

  const sparklineOptions = trend
    ? {
      animation: false,
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
      xAxis: {
        type: 'category',
        show: false,
      },
      yAxis: {
        type: 'value',
        show: false,
      },
      series: [
        {
          type: 'line',
          data: trend,
          smooth: true,
          symbol: 'none',
          lineStyle: {
            color: color,
            width: 2,
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: `${color}40` },
                { offset: 1, color: `${color}00` },
              ],
            },
          },
        },
      ],
    }
    : null;

  return (
    <div className={styles.metricCard} style={{ borderTopColor: color }}>
      <div className={styles.header}>
        <div className={styles.iconWrapper} style={{ backgroundColor: `${color}15` }}>
          <span style={{ color }}>{icon}</span>
        </div>
        <span className={styles.title}>{title}</span>
      </div>
      <div className={styles.value}>{formattedValue}</div>
      {sparklineOptions && (
        <div className={styles.sparkline}>
          <ReactEChartsCore
            echarts={echarts}
            option={sparklineOptions}
            style={{ height: '40px', width: '100%' }}
            opts={{ renderer: 'canvas' }}
          />
        </div>
      )}
    </div>
  );
};
