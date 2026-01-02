/**
 * Formatting Utilities
 * Number, byte, time, and percentage formatters for dashboard metrics
 */

/**
 * Format number with K/M/B suffix
 */
export function formatNumber(num: number, decimals: number = 1): string {
  if (num === 0) return '0';
  if (isNaN(num) || !isFinite(num)) return 'N/A';

  const abs = Math.abs(num);
  const sign = num < 0 ? '-' : '';

  if (abs >= 1e9) {
    return sign + (abs / 1e9).toFixed(decimals) + 'B';
  }
  if (abs >= 1e6) {
    return sign + (abs / 1e6).toFixed(decimals) + 'M';
  }
  if (abs >= 1e3) {
    return sign + (abs / 1e3).toFixed(decimals) + 'K';
  }

  return sign + abs.toFixed(decimals);
}

/**
 * Format percentage with optional decimals
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  if (isNaN(value) || !isFinite(value)) return 'N/A';
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format relative time (e.g., "2 minutes ago")
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 10) return 'just now';
  if (diffSec < 60) return `${diffSec} seconds ago`;
  if (diffMin === 1) return '1 minute ago';
  if (diffMin < 60) return `${diffMin} minutes ago`;
  if (diffHour === 1) return '1 hour ago';
  if (diffHour < 24) return `${diffHour} hours ago`;
  if (diffDay === 1) return '1 day ago';
  if (diffDay < 7) return `${diffDay} days ago`;

  return date.toLocaleDateString();
}

/**
 * Format uptime percentage
 */
export function formatUptime(uptime: number): string {
  if (uptime >= 99.9) {
    return formatPercentage(uptime, 2);
  }
  return formatPercentage(uptime, 1);
}

/**
 * Format milliseconds for response time display
 * Converts to seconds if >= 1000ms
 */
export function formatMilliseconds(ms: number, decimals: number = 1): string {
  if (ms === 0) return '0ms';
  if (isNaN(ms) || !isFinite(ms)) return 'N/A';

  const abs = Math.abs(ms);
  const sign = ms < 0 ? '-' : '';

  // Convert to seconds if >= 1000ms
  if (abs >= 1000) {
    return sign + (abs / 1000).toFixed(decimals) + 's';
  }

  return sign + abs.toFixed(decimals) + 'ms';
}
