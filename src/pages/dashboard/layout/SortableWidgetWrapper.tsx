/**
 * Sortable Widget Wrapper
 * Wraps each dashboard widget with @dnd-kit sortable functionality
 */

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { HolderOutlined } from '@ant-design/icons';
import { useDashboardLayoutContext } from '../context/DashboardLayoutContext';
import { WidgetLayoutConfig } from '../types/layout.types';
import styles from '../styles/dashboard.module.scss';

interface SortableWidgetWrapperProps {
  widgetConfig: WidgetLayoutConfig;
  children: React.ReactNode;
}

export const SortableWidgetWrapper: React.FC<SortableWidgetWrapperProps> = ({
  widgetConfig,
  children,
}) => {
  const { editMode } = useDashboardLayoutContext();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: widgetConfig.id,
    disabled: !editMode,
  });

  const style: React.CSSProperties = {
    gridColumn: `span ${widgetConfig.span}`,
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 100 : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.sortableWidget} ${editMode ? styles.editing : ''} ${isDragging ? styles.dragging : ''}`}
      {...attributes}
    >
      {editMode && (
        <div className={styles.dragHandle} {...listeners}>
          <HolderOutlined />
        </div>
      )}
      {children}
    </div>
  );
};
