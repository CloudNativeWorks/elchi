/**
 * Calculation Utilities
 * Health scores, percentages, and metric calculations
 */

import { ComponentHealth } from '../types/dashboard.types';

/**
 * Calculate overall system health score (0-100)
 */
export function calculateSystemHealth(components: {
  envoy: ComponentHealth;
  database: ComponentHealth;
  victoriaMetrics: ComponentHealth;
}): number {
  const weights = {
    envoy: 0.5,        // 50% weight
    database: 0.3,     // 30% weight
    victoriaMetrics: 0.2, // 20% weight
  };

  const scores = {
    envoy: getComponentScore(components.envoy),
    database: getComponentScore(components.database),
    victoriaMetrics: getComponentScore(components.victoriaMetrics),
  };

  return Math.round(
    scores.envoy * weights.envoy +
    scores.database * weights.database +
    scores.victoriaMetrics * weights.victoriaMetrics
  );
}

/**
 * Get score for individual component
 */
function getComponentScore(component: ComponentHealth): number {
  switch (component.status) {
    case 'healthy':
      return 100;
    case 'degraded':
      return 50;
    case 'down':
      return 0;
    default:
      return 0;
  }
}

/**
 * Determine system status from health score
 */
export function getSystemStatus(score: number): 'healthy' | 'degraded' | 'critical' {
  if (score >= 80) return 'healthy';
  if (score >= 50) return 'degraded';
  return 'critical';
}

/**
 * Calculate error rate percentage
 */
export function calculateErrorRate(totalRequests: number, errors: number): number {
  if (totalRequests === 0) return 0;
  return (errors / totalRequests) * 100;
}

/**
 * Calculate success rate percentage
 */
export function calculateSuccessRate(total: number, successful: number): number {
  if (total === 0) return 0;
  return (successful / total) * 100;
}

/**
 * Calculate percentage change between two values
 */
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Calculate average from array of numbers
 */
export function calculateAverage(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
}

/**
 * Calculate sum of array of numbers
 */
export function calculateSum(values: number[]): number {
  return values.reduce((acc, val) => acc + val, 0);
}

/**
 * Calculate rate per second from total over time period
 */
export function calculateRate(total: number, durationMs: number): number {
  if (durationMs === 0) return 0;
  return (total / durationMs) * 1000; // per second
}

/**
 * Calculate uptime percentage
 */
export function calculateUptime(uptimeMs: number, totalMs: number): number {
  if (totalMs === 0) return 100;
  return (uptimeMs / totalMs) * 100;
}

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

/**
 * Calculate percentile from sorted array
 */
export function calculatePercentile(sortedValues: number[], percentile: number): number {
  if (sortedValues.length === 0) return 0;
  if (percentile <= 0) return sortedValues[0];
  if (percentile >= 100) return sortedValues[sortedValues.length - 1];

  const index = (percentile / 100) * (sortedValues.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;

  return sortedValues[lower] * (1 - weight) + sortedValues[upper] * weight;
}

/**
 * Normalize value to 0-100 scale
 */
export function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0;
  return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Calculate trend direction
 */
export function getTrendDirection(change: number): 'up' | 'down' | 'stable' {
  if (Math.abs(change) < 0.1) return 'stable';
  return change > 0 ? 'up' : 'down';
}

/**
 * Calculate moving average
 */
export function calculateMovingAverage(values: number[], window: number): number[] {
  if (values.length < window) return values;

  const result: number[] = [];
  for (let i = 0; i <= values.length - window; i++) {
    const windowValues = values.slice(i, i + window);
    result.push(calculateAverage(windowValues));
  }
  return result;
}

/**
 * Round to specified decimal places
 */
export function roundTo(value: number, decimals: number = 2): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}
