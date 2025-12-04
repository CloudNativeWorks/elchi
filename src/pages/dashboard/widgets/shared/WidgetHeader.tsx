/**
 * Widget Header Component
 * Consistent header for all widgets
 */

import React from 'react';
import { ReloadOutlined, ExpandOutlined } from '@ant-design/icons';
import { WidgetHeaderProps } from '../../types/widgets.types';
import { formatRelativeTime } from '../../utils/formatters';
import styles from '../../styles/widgets.module.scss';

export const WidgetHeader: React.FC<WidgetHeaderProps> = ({
  title,
  icon,
  lastUpdated,
  onRefresh,
  onExpand,
  loading = false,
}) => {
  return (
    <div className={styles.widgetHeader}>
      <div className={styles.widgetTitle}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <span>{title}</span>
      </div>

      <div className={styles.widgetActions}>
        {lastUpdated && (
          <span className={styles.lastUpdated}>
            {formatRelativeTime(lastUpdated)}
          </span>
        )}

        {onRefresh && (
          <button
            className={`${styles.actionButton} ${loading ? styles.loading : ''}`}
            onClick={onRefresh}
            disabled={loading}
            title="Refresh"
            type="button"
          >
            <ReloadOutlined />
          </button>
        )}

        {onExpand && (
          <button
            className={styles.actionButton}
            onClick={onExpand}
            title="Expand"
            type="button"
          >
            <ExpandOutlined />
          </button>
        )}
      </div>
    </div>
  );
};

export default WidgetHeader;
