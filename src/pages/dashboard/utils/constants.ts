/**
 * Dashboard Constants
 * Colors, intervals, grid configurations
 */

// Space Command Center Color Palette
export const COLORS = {
  // Primary Colors
  PRIMARY: '#0a7fda',
  ACCENT: '#00c6fb',

  // Status Colors
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  DANGER: '#ef4444',
  INFO: '#06b6d4',

  // Additional Colors
  PURPLE: '#8b5cf6',
  INDIGO: '#6366f1',
  PINK: '#ec4899',
  GRAY: '#6b7280',

  // Background Colors
  BG_LIGHT: '#f8fafc',
  BG_SURFACE: '#ffffff',
  BG_GLASS: 'rgba(255, 255, 255, 0.95)',

  // Border Colors
  BORDER_LIGHT: 'rgba(255, 255, 255, 0.3)',
  BORDER_GRAY: '#e5e7eb',

  // Text Colors
  TEXT_PRIMARY: '#111827',
  TEXT_SECONDARY: '#6b7280',
  TEXT_TERTIARY: '#9ca3af',
} as const;

// Gradients
export const GRADIENTS = {
  PRIMARY: 'linear-gradient(135deg, #056ccd 0%, #00c6fb 100%)',
  SUCCESS: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
  WARNING: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
  DANGER: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
  INFO: 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)',
  PURPLE: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
  INDIGO: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
  BACKGROUND: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
} as const;

// Refresh Intervals (milliseconds)
export const REFRESH_INTERVALS = {
  CRITICAL: 10000,  // 10 seconds - Traffic, errors, health
  HIGH: 30000,      // 30 seconds - Services, connections
  MEDIUM: 60000,    // 1 minute - Resource counts, jobs
  LOW: 300000,      // 5 minutes - Audit stats, AI usage
} as const;

// Grid Configuration
export const GRID_CONFIG = {
  GUTTER: [24, 24] as [number, number],
  BREAKPOINTS: {
    xs: 480,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1600,
  },
  COLS: {
    xs: 1,
    sm: 2,
    md: 2,
    lg: 3,
    xl: 4,
    xxl: 4,
  },
} as const;

// Widget Sizes
export const WIDGET_SIZES = {
  SMALL: { span: 6, height: 200 },
  MEDIUM: { span: 12, height: 300 },
  LARGE: { span: 18, height: 400 },
  XLARGE: { span: 24, height: 500 },
} as const;

// Animation Durations (milliseconds)
export const ANIMATION = {
  FAST: 150,
  NORMAL: 250,
  SLOW: 350,
  LAZY: 500,
} as const;

// Chart Configuration
export const CHART_CONFIG = {
  DEFAULT_HEIGHT: 300,
  SPARKLINE_HEIGHT: 60,
  GAUGE_SIZE: 200,
  ANIMATION_DURATION: 300,
  ANIMATION_EASING: 'cubicOut',
  COLORS: [
    COLORS.PRIMARY,
    COLORS.SUCCESS,
    COLORS.WARNING,
    COLORS.DANGER,
    COLORS.INFO,
    COLORS.PURPLE,
    COLORS.INDIGO,
    COLORS.PINK,
  ],
} as const;

// Status Badge Configuration
export const STATUS_CONFIG = {
  healthy: {
    color: COLORS.SUCCESS,
    label: 'Healthy',
    dot: '●',
  },
  degraded: {
    color: COLORS.WARNING,
    label: 'Degraded',
    dot: '●',
  },
  down: {
    color: COLORS.DANGER,
    label: 'Down',
    dot: '●',
  },
  warning: {
    color: COLORS.WARNING,
    label: 'Warning',
    dot: '●',
  },
  critical: {
    color: COLORS.DANGER,
    label: 'Critical',
    dot: '●',
  },
  info: {
    color: COLORS.INFO,
    label: 'Info',
    dot: '●',
  },
} as const;

// Typography
export const TYPOGRAPHY = {
  FONT_FAMILY: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  FONT_MONO: 'JetBrains Mono, Monaco, Courier, monospace',

  SIZE: {
    HERO: 32,
    DISPLAY: 24,
    TITLE: 18,
    BODY: 14,
    CAPTION: 12,
    TINY: 10,
  },

  WEIGHT: {
    REGULAR: 400,
    MEDIUM: 500,
    SEMIBOLD: 600,
    BOLD: 700,
  },
} as const;

// Spacing
export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 16,
  LG: 24,
  XL: 32,
  XXL: 48,
} as const;

// Border Radius
export const RADIUS = {
  SM: 8,
  MD: 12,
  LG: 16,
  XL: 20,
  FULL: 9999,
} as const;

// Shadow
export const SHADOW = {
  SM: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  MD: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  LG: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  XL: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  GLASS: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
} as const;

// Z-Index
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  RESOURCE_COUNTS: '/api/v3/custom/count/all',
  ERROR_SUMMARY: '/api/v3/custom/error_summary',
  SERVICES: '/api/v3/services/',
  CLIENTS: '/api/v3/clients/',
  JOBS_STATS: '/api/v3/jobs/stats',
  AUDIT_STATS: '/api/v3/audit/stats',
  AI_USAGE: '/api/v3/ai/usage/stats',
  VICTORIA_METRICS: '/api/v1/query_range',
} as const;

// Time Ranges
export const TIME_RANGES = {
  LAST_5M: { label: 'Last 5 minutes', seconds: 300 },
  LAST_15M: { label: 'Last 15 minutes', seconds: 900 },
  LAST_30M: { label: 'Last 30 minutes', seconds: 1800 },
  LAST_1H: { label: 'Last 1 hour', seconds: 3600 },
  LAST_3H: { label: 'Last 3 hours', seconds: 10800 },
  LAST_6H: { label: 'Last 6 hours', seconds: 21600 },
  LAST_12H: { label: 'Last 12 hours', seconds: 43200 },
  LAST_24H: { label: 'Last 24 hours', seconds: 86400 },
} as const;

// Health Score Thresholds
export const HEALTH_THRESHOLDS = {
  EXCELLENT: 95,
  GOOD: 80,
  FAIR: 60,
  POOR: 40,
  CRITICAL: 20,
} as const;

// Error Rate Thresholds (percentage)
export const ERROR_THRESHOLDS = {
  LOW: 1,
  MEDIUM: 5,
  HIGH: 10,
  CRITICAL: 20,
} as const;

// Default Values
export const DEFAULTS = {
  STALE_TIME: 300000, // 5 minutes
  CACHE_TIME: 600000, // 10 minutes
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000,
  DEBOUNCE_DELAY: 300,
} as const;
