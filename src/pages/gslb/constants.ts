/**
 * GSLB Constants
 */

export const PROBE_TYPES = [
  { label: 'HTTP', value: 'http' },
  { label: 'HTTPS', value: 'https' },
  { label: 'TCP', value: 'tcp' }
];

export const PROBE_INTERVALS = [
  { label: '10 seconds', value: 10 },
  { label: '20 seconds', value: 20 },
  { label: '30 seconds', value: 30 },
  { label: '60 seconds', value: 60 },
  { label: '90 seconds', value: 90 },
  { label: '120 seconds', value: 120 },
  { label: '180 seconds', value: 180 },
  { label: '300 seconds', value: 300 }
];

export const DEFAULT_PROBE_VALUES = {
  type: 'https' as const,
  port: 443,
  path: '/health',
  interval: 30 as const,
  timeout: 0.5,
  warning_threshold: 1,
  critical_threshold: 3,
  passing_threshold: 1
};

export const DNS_SECRET_MIN_LENGTH = 8;
export const DEFAULT_VERSION = 'v1';

// Health status types
export const HEALTH_STATUS = {
  ALL_HEALTHY: 'all_healthy',
  SOME_UNHEALTHY: 'some_unhealthy',
  ALL_UNHEALTHY: 'all_unhealthy',
  NO_PROBE: 'no_probe'
} as const;
