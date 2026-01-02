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
