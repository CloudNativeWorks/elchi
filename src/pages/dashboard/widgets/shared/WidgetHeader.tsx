/**
 * Widget Header Component
 * Consistent header for all widgets with optional edit mode controls
 */

import React from 'react';
import { Segmented } from 'antd';
import { ReloadOutlined, ExpandOutlined, CloseOutlined } from '@ant-design/icons';
import { WidgetHeaderProps } from '../../types/widgets.types';
import { WidgetSpan } from '../../types/layout.types';
import { formatRelativeTime } from '../../utils/formatters';
import styles from '../../styles/widgets.module.scss';

const SPAN_OPTIONS: { value: WidgetSpan; label: string }[] = [
  { value: 6, label: '1/4' },
  { value: 8, label: '1/3' },
  { value: 12, label: '1/2' },
  { value: 16, label: '2/3' },
  { value: 24, label: 'Full' },
];

export const WidgetHeader: React.FC<WidgetHeaderProps> = ({
  title,
  icon,
  lastUpdated,
  onRefresh,
  onExpand,
  loading = false,
  editMode = false,
  onClose,
  onResize,
  currentSpan,
  minSpan,
  maxSpan,
}) => {
  const availableSpans = (minSpan && maxSpan)
    ? SPAN_OPTIONS.filter((opt) => opt.value >= minSpan && opt.value <= maxSpan)
    : [];
  const canResize = editMode && onResize && availableSpans.length > 1;

  return (
    <div className={styles.widgetHeader}>
      <div className={styles.widgetTitle}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <span>{title}</span>
      </div>

      <div className={styles.widgetActions}>
        {canResize && (
          <div className={styles.resizeControl}>
            <Segmented
              size="small"
              value={currentSpan}
              options={availableSpans.map((opt) => ({
                value: opt.value,
                label: opt.label,
              }))}
              onChange={(value) => onResize(value as WidgetSpan)}
            />
          </div>
        )}

        {!editMode && lastUpdated && (
          <span className={styles.lastUpdated}>
            {formatRelativeTime(lastUpdated)}
          </span>
        )}

        {!editMode && onRefresh && (
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

        {!editMode && onExpand && (
          <button
            className={styles.actionButton}
            onClick={onExpand}
            title="Expand"
            type="button"
          >
            <ExpandOutlined />
          </button>
        )}

        {editMode && onClose && (
          <button
            className={`${styles.actionButton} ${styles.closeButton}`}
            onClick={onClose}
            title="Hide widget"
            type="button"
          >
            <CloseOutlined />
          </button>
        )}
      </div>
    </div>
  );
};
