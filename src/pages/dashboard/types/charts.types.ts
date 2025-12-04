/**
 * Chart Type Definitions
 * Configurations for chart components
 */

import { EChartsOption } from 'echarts';

// Chart Types
export type ChartType =
  | 'line'
  | 'area'
  | 'bar'
  | 'horizontalBar'
  | 'gauge'
  | 'sparkline'
  | 'donut'
  | 'pie'
  | 'heatmap';

// Chart Data Point
export interface ChartDataPoint {
  timestamp: number | string;
  value: number;
  label?: string;
}

// Chart Series
export interface ChartSeries {
  name: string;
  data: ChartDataPoint[];
  color?: string;
  type?: ChartType;
}

// Chart Configuration
export interface ChartConfig {
  type: ChartType;
  height?: number;
  width?: string | number;
  title?: string;
  subtitle?: string;
  series: ChartSeries[];
  xAxis?: {
    type?: 'category' | 'time' | 'value';
    label?: string;
  };
  yAxis?: {
    type?: 'value' | 'category';
    label?: string;
    format?: 'number' | 'bytes' | 'duration' | 'percentage';
  };
  legend?: {
    show?: boolean;
    position?: 'top' | 'bottom' | 'left' | 'right';
  };
  tooltip?: {
    show?: boolean;
    format?: (value: any) => string;
  };
  grid?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  animation?: boolean;
  zoom?: boolean;
}

// Chart Container Props
export interface ChartContainerProps {
  title?: string;
  subtitle?: string;
  height?: number;
  loading?: boolean;
  error?: Error | null;
  onRefresh?: () => void;
  onExpand?: () => void;
  children: React.ReactNode;
}

// ECharts Wrapper Props
export interface EChartsWrapperProps {
  option: EChartsOption;
  height?: number;
  loading?: boolean;
  notMerge?: boolean;
  lazyUpdate?: boolean;
  onChartReady?: (chart: any) => void;
}

// Time Series Chart Props
export interface TimeSeriesChartProps {
  series: ChartSeries[];
  height?: number;
  showLegend?: boolean;
  showZoom?: boolean;
  smooth?: boolean;
  area?: boolean;
  yAxisFormat?: 'number' | 'bytes' | 'duration' | 'percentage';
}

// Bar Chart Props
export interface BarChartProps {
  data: Array<{ name: string; value: number }>;
  height?: number;
  horizontal?: boolean;
  color?: string;
  showValues?: boolean;
  yAxisFormat?: 'number' | 'bytes' | 'duration' | 'percentage';
}

// Gauge Chart Props
export interface GaugeChartProps {
  value: number;
  min?: number;
  max?: number;
  title?: string;
  unit?: string;
  thresholds?: Array<{ value: number; color: string }>;
  height?: number;
}

// Sparkline Chart Props
export interface SparklineChartProps {
  data: number[];
  height?: number;
  width?: string | number;
  color?: string;
  area?: boolean;
  showTooltip?: boolean;
}

// Donut Chart Props
export interface DonutChartProps {
  data: Array<{ name: string; value: number }>;
  height?: number;
  innerRadius?: string;
  showLegend?: boolean;
  showPercentage?: boolean;
}

// Heatmap Chart Props
export interface HeatmapChartProps {
  data: Array<[number, number, number]>; // [x, y, value]
  xLabels: string[];
  yLabels: string[];
  height?: number;
  colorRange?: [string, string];
}

// Chart Color Palette
export const CHART_COLORS = {
  primary: '#0a7fda',
  accent: '#00c6fb',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
  purple: '#8b5cf6',
  gray: '#6b7280',
} as const;

// Chart Theme
export const CHART_THEME = {
  colors: Object.values(CHART_COLORS),
  backgroundColor: 'transparent',
  textStyle: {
    fontFamily: 'Inter, -apple-system, sans-serif',
    fontSize: 12,
    color: '#6b7280',
  },
  grid: {
    top: 40,
    right: 20,
    bottom: 40,
    left: 60,
    containLabel: true,
  },
  animation: true,
  animationDuration: 300,
  animationEasing: 'cubicOut',
} as const;
