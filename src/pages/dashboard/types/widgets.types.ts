/**
 * Widget Type Definitions
 * Props and configurations for dashboard widgets
 */

import { ReactNode } from 'react';
import { RefreshInterval } from './dashboard.types';

// Base Widget Props
export interface BaseWidgetProps {
  title: string;
  icon?: ReactNode;
  gradient?: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  refreshInterval?: RefreshInterval;
  loading?: boolean;
  error?: Error | null;
  lastUpdated?: Date;
  onRefresh?: () => void;
  onExpand?: () => void;
  className?: string;
  children: ReactNode;
}

// Widget Header Props
export interface WidgetHeaderProps {
  title: string;
  icon?: ReactNode;
  lastUpdated?: Date;
  onRefresh?: () => void;
  onExpand?: () => void;
  loading?: boolean;
}

// Widget Container Props
export interface WidgetContainerProps {
  gradient?: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  loading?: boolean;
  error?: Error | null;
  className?: string;
  children: ReactNode;
}

// Hero Metric Card Props
export interface HeroMetricCardProps {
  title: string;
  value: number | string;
  unit?: string;
  icon: ReactNode;
  trend?: number; // percentage change
  status?: 'success' | 'warning' | 'danger' | 'info';
  loading?: boolean;
  onClick?: () => void;
}

// Status Badge Props
export interface StatusBadgeProps {
  status: 'healthy' | 'degraded' | 'down' | 'warning' | 'critical' | 'info';
  size?: 'small' | 'medium' | 'large';
  showDot?: boolean;
  children?: ReactNode;
}

// Metric Display Props
export interface MetricDisplayProps {
  label: string;
  value: number | string;
  unit?: string;
  format?: 'number' | 'bytes' | 'duration' | 'percentage';
  decimals?: number;
  loading?: boolean;
}

// Loading Skeleton Props
export interface LoadingSkeletonProps {
  type?: 'card' | 'metric' | 'chart' | 'list' | 'text';
  rows?: number;
  height?: number | string;
  width?: number | string;
}

// Empty State Props
export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Error State Props
export interface ErrorStateProps {
  error: Error;
  onRetry?: () => void;
}

// Widget Size Mapping
export const WIDGET_SIZES = {
  small: { span: 6, height: 200 },
  medium: { span: 12, height: 300 },
  large: { span: 18, height: 400 },
  xlarge: { span: 24, height: 500 },
} as const;

// Widget Gradient Presets
export const WIDGET_GRADIENTS = {
  primary: 'linear-gradient(135deg, #056ccd 0%, #00c6fb 100%)',
  success: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
  warning: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
  danger: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
  info: 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)',
  purple: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
} as const;
