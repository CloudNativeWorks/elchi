/**
 * Calculation Utilities
 * Health scores, percentages, and metric calculations
 */

/**
 * Determine service status from metrics
 */
export function determineServiceStatus(
  errorRate: number,
  avgResponseTime: number
): 'healthy' | 'degraded' | 'down' {
  // Service is down if error rate is extremely high
  if (errorRate > 50) return 'down';

  // Service is degraded if error rate is high or response time is slow
  if (errorRate > 10 || avgResponseTime > 5000) return 'degraded';

  // Service is healthy
  return 'healthy';
}
