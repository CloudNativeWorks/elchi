/**
 * Dashboard Layout Type Definitions
 * Types for customizable dashboard layout preferences
 */

export type WidgetId =
  | 'traffic-overview'
  | 'waf-security'
  | 'service-health'
  | 'client-resources'
  | 'gslb-statistics'
  | 'request-rate-timeline'
  | 'response-time-trends'
  | 'quick-metrics'
  | 'cluster-health-donut'
  | 'connection-flow-sankey'
  | 'resources-overview';

export type WidgetSpan = 6 | 8 | 12 | 16 | 24;

export interface WidgetLayoutConfig {
  id: WidgetId;
  visible: boolean;
  span: WidgetSpan;
  order: number;
  minSpan: WidgetSpan;
  maxSpan: WidgetSpan;
}

export interface DashboardLayoutPreferences {
  version: number;
  widgets: WidgetLayoutConfig[];
}

export interface WidgetMeta {
  id: WidgetId;
  title: string;
  icon: string;
  description: string;
  defaultSpan: WidgetSpan;
  minSpan: WidgetSpan;
  maxSpan: WidgetSpan;
  defaultOrder: number;
}
