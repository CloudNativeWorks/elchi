/**
 * Chart Container Component
 * Wrapper for ECharts with loading, error states
 */

import React from 'react';
import { ChartContainerProps } from '../types/charts.types';
import styles from '../styles/widgets.module.scss';

export const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  subtitle,
  height = 300,
  loading = false,
  error = null,
  onRefresh,
  onExpand,
  children,
}) => {
  if (loading) {
    return (
      <div className={styles.widgetContainer}>
        {title && (
          <div className={styles.widgetHeader}>
            <div className={styles.widgetTitle}>{title}</div>
          </div>
        )}
        <div className={styles.skeleton} style={{ height }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.widgetContainer}>
        {title && (
          <div className={styles.widgetHeader}>
            <div className={styles.widgetTitle}>{title}</div>
          </div>
        )}
        <div className={styles.widgetError}>
          <span className={styles.errorIcon}>⚠</span>
          <p className={styles.errorMessage}>{error.message || 'Chart error'}</p>
          {onRefresh && (
            <button
              onClick={onRefresh}
              style={{
                marginTop: 16,
                padding: '8px 16px',
                background: '#0a7fda',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.widgetContainer}>
      {(title || subtitle) && (
        <div className={styles.widgetHeader}>
          <div>
            {title && <div className={styles.widgetTitle}>{title}</div>}
            {subtitle && (
              <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                {subtitle}
              </div>
            )}
          </div>
          <div className={styles.widgetActions}>
            {onRefresh && (
              <button
                className={styles.actionButton}
                onClick={onRefresh}
                title="Refresh"
                type="button"
              >
                ⟳
              </button>
            )}
            {onExpand && (
              <button
                className={styles.actionButton}
                onClick={onExpand}
                title="Expand"
                type="button"
              >
                ⤢
              </button>
            )}
          </div>
        </div>
      )}
      <div style={{ height }}>{children}</div>
    </div>
  );
};

export default ChartContainer;
