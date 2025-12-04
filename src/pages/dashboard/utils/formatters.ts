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
 * Format bytes to human-readable format
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 B';
  if (isNaN(bytes) || !isFinite(bytes)) return 'N/A';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(decimals)} ${sizes[i]}`;
}

/**
 * Format bytes/second to rate
 */
export function formatBytesPerSecond(bytesPerSec: number): string {
  return `${formatBytes(bytesPerSec)}/s`;
}

/**
 * Format duration in milliseconds to human-readable format
 */
export function formatDuration(ms: number): string {
  if (ms === 0) return '0ms';
  if (isNaN(ms) || !isFinite(ms)) return 'N/A';

  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  if (seconds > 0) {
    return `${seconds}s`;
  }
  return `${ms}ms`;
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
 * Format timestamp to readable string
 */
export function formatTimestamp(date: Date, includeTime: boolean = true): string {
  if (!date || !(date instanceof Date)) return 'N/A';

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }

  return date.toLocaleString('en-US', options);
}

/**
 * Format number with commas (e.g., 1,234,567)
 */
export function formatWithCommas(num: number): string {
  if (isNaN(num) || !isFinite(num)) return 'N/A';
  return num.toLocaleString('en-US');
}

/**
 * Format rate (e.g., requests/second)
 */
export function formatRate(value: number, unit: string = 'req/s', decimals: number = 1): string {
  if (isNaN(value) || !isFinite(value)) return 'N/A';

  if (value >= 1000) {
    return `${formatNumber(value, decimals)} ${unit}`;
  }

  return `${value.toFixed(decimals)} ${unit}`;
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
 * Get color for percentage value (for thresholds)
 */
export function getPercentageColor(value: number, reversed: boolean = false): string {
  if (reversed) {
    // For error rates (lower is better)
    if (value >= 10) return '#ef4444'; // danger
    if (value >= 5) return '#f59e0b';  // warning
    return '#10b981'; // success
  } else {
    // For health/uptime (higher is better)
    if (value >= 95) return '#10b981'; // success
    if (value >= 80) return '#f59e0b'; // warning
    return '#ef4444'; // danger
  }
}

/**
 * Truncate string with ellipsis
 */
export function truncateString(str: string, maxLength: number = 30): string {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + '...';
}
