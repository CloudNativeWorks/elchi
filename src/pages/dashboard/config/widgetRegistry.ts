/**
 * Widget Registry
 * Central metadata for all dashboard widgets and default layout
 */

import { WidgetId, WidgetMeta, DashboardLayoutPreferences } from '../types/layout.types';

export const WIDGET_REGISTRY: Record<WidgetId, WidgetMeta> = {
  'traffic-overview': {
    id: 'traffic-overview',
    title: 'Traffic Overview',
    icon: 'DashboardOutlined',
    description: 'Live traffic metrics',
    defaultSpan: 24,
    minSpan: 24,
    maxSpan: 24,
    defaultOrder: 0,
  },
  'waf-security': {
    id: 'waf-security',
    title: 'WAF Security',
    icon: 'SafetyOutlined',
    description: 'WAF metrics and blocked requests',
    defaultSpan: 12,
    minSpan: 8,
    maxSpan: 24,
    defaultOrder: 1,
  },
  'service-health': {
    id: 'service-health',
    title: 'Service Health',
    icon: 'CloudServerOutlined',
    description: 'Service health matrix',
    defaultSpan: 12,
    minSpan: 8,
    maxSpan: 24,
    defaultOrder: 2,
  },
  'client-resources': {
    id: 'client-resources',
    title: 'Client Resources',
    icon: 'TeamOutlined',
    description: 'Connected clients',
    defaultSpan: 24,
    minSpan: 12,
    maxSpan: 24,
    defaultOrder: 3,
  },
  'gslb-statistics': {
    id: 'gslb-statistics',
    title: 'GSLB Statistics',
    icon: 'GlobalOutlined',
    description: 'GSLB health check statistics',
    defaultSpan: 24,
    minSpan: 12,
    maxSpan: 24,
    defaultOrder: 4,
  },
  'request-rate-timeline': {
    id: 'request-rate-timeline',
    title: 'Request Rate Timeline',
    icon: 'LineChartOutlined',
    description: 'Request rate over time',
    defaultSpan: 24,
    minSpan: 12,
    maxSpan: 24,
    defaultOrder: 5,
  },
  'response-time-trends': {
    id: 'response-time-trends',
    title: 'Response Time Trends',
    icon: 'FieldTimeOutlined',
    description: 'Response time analysis',
    defaultSpan: 24,
    minSpan: 12,
    maxSpan: 24,
    defaultOrder: 6,
  },
  'quick-metrics': {
    id: 'quick-metrics',
    title: 'Quick Metrics',
    icon: 'ThunderboltOutlined',
    description: 'Key performance indicators',
    defaultSpan: 24,
    minSpan: 24,
    maxSpan: 24,
    defaultOrder: 7,
  },
  'cluster-health-donut': {
    id: 'cluster-health-donut',
    title: 'Cluster Health',
    icon: 'PieChartOutlined',
    description: 'Cluster health distribution',
    defaultSpan: 8,
    minSpan: 8,
    maxSpan: 12,
    defaultOrder: 8,
  },
  'connection-flow-sankey': {
    id: 'connection-flow-sankey',
    title: 'Service Dependencies',
    icon: 'NodeIndexOutlined',
    description: 'Service dependency graph',
    defaultSpan: 16,
    minSpan: 12,
    maxSpan: 24,
    defaultOrder: 9,
  },
  'resources-overview': {
    id: 'resources-overview',
    title: 'Resources Overview',
    icon: 'DatabaseOutlined',
    description: 'Resource counts grid',
    defaultSpan: 24,
    minSpan: 12,
    maxSpan: 24,
    defaultOrder: 10,
  },
};

export const ALL_WIDGET_IDS: WidgetId[] = Object.values(WIDGET_REGISTRY)
  .sort((a, b) => a.defaultOrder - b.defaultOrder)
  .map((meta) => meta.id);

export const DEFAULT_LAYOUT: DashboardLayoutPreferences = {
  version: 1,
  widgets: Object.values(WIDGET_REGISTRY)
    .sort((a, b) => a.defaultOrder - b.defaultOrder)
    .map((meta) => ({
      id: meta.id,
      visible: true,
      span: meta.defaultSpan,
      order: meta.defaultOrder,
      minSpan: meta.minSpan,
      maxSpan: meta.maxSpan,
    })),
};
