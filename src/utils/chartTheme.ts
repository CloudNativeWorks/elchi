/**
 * Chart Theme Utilities
 * Provides theme-aware colors and configurations for ECharts
 */

import { useMemo } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

// Light mode chart colors
const LIGHT_THEME = {
  // Background
  backgroundColor: 'transparent',

  // Text colors
  textColor: '#111827',
  textColorSecondary: '#6b7280',

  // Axis colors
  axisLineColor: '#e5e7eb',
  axisSplitLineColor: '#f3f4f6',
  axisLabelColor: '#6b7280',

  // Tooltip
  tooltipBg: 'rgba(255, 255, 255, 0.95)',
  tooltipBorder: '#e5e7eb',
  tooltipTextColor: '#111827',

  // Legend
  legendTextColor: '#6b7280',

  // Grid
  gridBorderColor: '#e5e7eb',

  // Series colors
  seriesColors: [
    '#0a7fda', // primary blue
    '#10b981', // success green
    '#f59e0b', // warning amber
    '#ef4444', // danger red
    '#8b5cf6', // purple
    '#06b6d4', // info cyan
    '#ec4899', // pink
    '#6366f1', // indigo
  ],

  // Status colors
  successColor: '#10b981',
  warningColor: '#f59e0b',
  dangerColor: '#ef4444',
  infoColor: '#06b6d4',
};

// Dark mode chart colors
const DARK_THEME = {
  // Background
  backgroundColor: 'transparent',

  // Text colors
  textColor: '#f1f5f9',
  textColorSecondary: '#94a3b8',

  // Axis colors
  axisLineColor: '#475569',
  axisSplitLineColor: '#334155',
  axisLabelColor: '#94a3b8',

  // Tooltip
  tooltipBg: 'rgba(30, 41, 59, 0.95)',
  tooltipBorder: '#475569',
  tooltipTextColor: '#f1f5f9',

  // Legend
  legendTextColor: '#94a3b8',

  // Grid
  gridBorderColor: '#334155',

  // Series colors - adjusted for dark mode visibility
  seriesColors: [
    '#3b9eff', // primary blue - brighter
    '#34d399', // success green - brighter
    '#fbbf24', // warning amber - brighter
    '#f87171', // danger red - brighter
    '#a78bfa', // purple - brighter
    '#22d3ee', // info cyan - brighter
    '#f472b6', // pink - brighter
    '#818cf8', // indigo - brighter
  ],

  // Status colors - brighter for dark mode
  successColor: '#34d399',
  warningColor: '#fbbf24',
  dangerColor: '#f87171',
  infoColor: '#22d3ee',
};

/**
 * Get theme configuration based on dark mode state
 */
export const getChartTheme = (isDark: boolean) => {
  return isDark ? DARK_THEME : LIGHT_THEME;
};

/**
 * Get common ECharts options with theme support
 */
export const getChartOptions = (isDark: boolean) => {
  const theme = getChartTheme(isDark);

  return {
    backgroundColor: theme.backgroundColor,
    textStyle: {
      color: theme.textColor,
    },
    title: {
      textStyle: {
        color: theme.textColor,
      },
      subtextStyle: {
        color: theme.textColorSecondary,
      },
    },
    legend: {
      textStyle: {
        color: theme.legendTextColor,
      },
    },
    tooltip: {
      backgroundColor: theme.tooltipBg,
      borderColor: theme.tooltipBorder,
      textStyle: {
        color: theme.tooltipTextColor,
      },
    },
    xAxis: {
      axisLine: {
        lineStyle: {
          color: theme.axisLineColor,
        },
      },
      axisTick: {
        lineStyle: {
          color: theme.axisLineColor,
        },
      },
      axisLabel: {
        color: theme.axisLabelColor,
      },
      splitLine: {
        lineStyle: {
          color: theme.axisSplitLineColor,
        },
      },
    },
    yAxis: {
      axisLine: {
        lineStyle: {
          color: theme.axisLineColor,
        },
      },
      axisTick: {
        lineStyle: {
          color: theme.axisLineColor,
        },
      },
      axisLabel: {
        color: theme.axisLabelColor,
      },
      splitLine: {
        lineStyle: {
          color: theme.axisSplitLineColor,
        },
      },
    },
    grid: {
      borderColor: theme.gridBorderColor,
    },
    color: theme.seriesColors,
  };
};

/**
 * Hook for getting chart theme in React components
 */
export const useChartTheme = () => {
  const { isDark } = useTheme();

  return useMemo(() => ({
    theme: getChartTheme(isDark),
    options: getChartOptions(isDark),
    isDark,
  }), [isDark]);
};

/**
 * Get status color based on value and theme
 */
export const getStatusColor = (status: 'success' | 'warning' | 'danger' | 'info', isDark: boolean) => {
  const theme = getChartTheme(isDark);
  const colorMap = {
    success: theme.successColor,
    warning: theme.warningColor,
    danger: theme.dangerColor,
    info: theme.infoColor,
  };
  return colorMap[status];
};

/**
 * Get series color by index
 */
export const getSeriesColor = (index: number, isDark: boolean) => {
  const theme = getChartTheme(isDark);
  return theme.seriesColors[index % theme.seriesColors.length];
};

export default {
  getChartTheme,
  getChartOptions,
  useChartTheme,
  getStatusColor,
  getSeriesColor,
};
