/**
 * Dashboard Type Definitions
 * Core data structures for the command center dashboard
 */

// System Health
export interface SystemHealth {
  overallScore: number; // 0-100
  status: 'healthy' | 'degraded' | 'critical';
  components: {
    envoy: ComponentHealth;
    database: ComponentHealth;
    victoriaMetrics: ComponentHealth;
  };
}

export interface ComponentHealth {
  status: 'healthy' | 'degraded' | 'down';
  message?: string;
}

// Traffic Metrics
export interface TrafficMetrics {
  downstreamConnections: number;
  upstreamConnections: number;
  incomingTrafficRate: number; // bytes/s
  outgoingTrafficRate: number; // bytes/s
  totalRequests: number;
  requestRate: number; // requests/s
  errorRate: number; // percentage
  timestamp: Date;
}

// Error Summary
export interface ErrorSummary {
  totalErrors: number;
  criticalCount: number;
  errorCount: number;
  warningCount: number;
  errors4xx: number;
  errors5xx: number;
  topErrors: ErrorDetail[];
  errorsByService: Record<string, number>;
}

export interface ErrorDetail {
  id: string;
  message: string;
  severity: 'critical' | 'error' | 'warning';
  count: number;
  timestamp: Date;
  affectedServices: string[];
}

// Service Status
export interface ServiceStatus {
  id: string;
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  uptime: number; // percentage
  requestCount: number;
  errorRate: number;
  avgResponseTime: number;
  timestamp: Date;
}

// Resource Statistics
export interface ResourceStats {
  listeners: number;
  routes: number;
  virtualHosts: number;
  clusters: number;
  endpoints: number;
  secrets: number;
  filters: number;
  extensions: number;
  timestamp: Date;
}

// Activity Event
export interface ActivityEvent {
  id: string;
  type: 'config_change' | 'job_complete' | 'job_fail' | 'service_change' | 'error_spike' | 'resource_add' | 'resource_delete';
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'error';
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Job Statistics
export interface JobStats {
  total24h: number;
  running: number;
  completed: number;
  failed: number;
  successRate: number;
  avgDuration: number;
}

// Audit Statistics
export interface AuditStats {
  changes24h: number;
  activeUsers: number;
  topUser: string;
  topResource: string;
  actionDistribution: Record<string, number>;
}

// Client Statistics
export interface ClientStats {
  total: number;
  connected: number;
  disconnected: number;
  versionDistribution: Record<string, number>;
}

// AI Usage Statistics (optional)
export interface AIStats {
  requests24h: number;
  tokensUsed: number;
  topModel: string;
  avgResponseTime: number;
}

// Main Dashboard Data
export interface DashboardData {
  systemHealth: SystemHealth;
  traffic: TrafficMetrics;
  errors: ErrorSummary;
  services: ServiceStatus[];
  resources: ResourceStats;
  activity: ActivityEvent[];
  jobs: JobStats;
  audit: AuditStats;
  clients: ClientStats;
  ai?: AIStats;
  lastUpdated: Date;
}

// Dashboard State
export interface DashboardState {
  data: DashboardData | null;
  loading: boolean;
  error: Error | null;
  refreshing: boolean;
}

// Refresh Intervals (ms)
export enum RefreshInterval {
  CRITICAL = 10000,  // 10s
  HIGH = 30000,      // 30s
  MEDIUM = 60000,    // 1m
  LOW = 300000,      // 5m
}

// Time Range for Charts
export interface TimeRange {
  start: Date;
  end: Date;
  label: string;
}
