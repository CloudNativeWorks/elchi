/**
 * Widget Renderer
 * Maps WidgetId to its React component
 */

import React from 'react';
import { WidgetId } from '../types/layout.types';
import { ResourceStats } from '../types/dashboard.types';
import TrafficOverview from '@/components/dashboard/TrafficOverview';
import { WAFSecurity } from './WAFSecurity';
import { ServiceHealth } from './ServiceHealth';
import ClientResources from './ClientResources';
import { GSLBStatistics } from './GSLBStatistics';
import { RequestRateTimeline } from './RequestRateTimeline';
import { ResponseTimeTrends } from './ResponseTimeTrends';
import { QuickMetrics } from './QuickMetrics';
import { ClusterHealthDonut } from './ClusterHealthDonut';
import { ConnectionFlowSankey } from './ConnectionFlowSankey';
import { ResourcesOverview } from './ResourcesOverview';

interface WidgetRendererProps {
  widgetId: WidgetId;
  resources?: ResourceStats;
  loading?: boolean;
}

export const WidgetRenderer: React.FC<WidgetRendererProps> = ({
  widgetId,
  resources,
  loading,
}) => {
  switch (widgetId) {
    case 'traffic-overview':
      return <TrafficOverview />;
    case 'waf-security':
      return <WAFSecurity />;
    case 'service-health':
      return <ServiceHealth />;
    case 'client-resources':
      return <ClientResources />;
    case 'gslb-statistics':
      return <GSLBStatistics />;
    case 'request-rate-timeline':
      return <RequestRateTimeline />;
    case 'response-time-trends':
      return <ResponseTimeTrends />;
    case 'quick-metrics':
      return <QuickMetrics />;
    case 'cluster-health-donut':
      return <ClusterHealthDonut />;
    case 'connection-flow-sankey':
      return <ConnectionFlowSankey />;
    case 'resources-overview':
      return <ResourcesOverview resources={resources} loading={loading} />;
    default:
      return null;
  }
};
