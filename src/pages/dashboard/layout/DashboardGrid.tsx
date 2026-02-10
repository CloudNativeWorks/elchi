/**
 * Dashboard Grid Component
 * Responsive grid layout with drag-drop support
 */

import React, { useMemo, useState, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { useDashboardLayoutContext } from '../context/DashboardLayoutContext';
import { SortableWidgetWrapper } from './SortableWidgetWrapper';
import { WidgetRenderer } from '../widgets/WidgetRenderer';
import { WIDGET_REGISTRY } from '../config/widgetRegistry';
import { WidgetId } from '../types/layout.types';
import { ResourceStats } from '../types/dashboard.types';
import styles from '../styles/dashboard.module.scss';

interface DashboardGridProps {
  resources?: ResourceStats;
  loading?: boolean;
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({ resources, loading }) => {
  const { visibleWidgets, editMode, updateWidgetOrder } = useDashboardLayoutContext();
  const [activeId, setActiveId] = useState<WidgetId | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const widgetIds = useMemo(
    () => visibleWidgets.map((w) => w.id),
    [visibleWidgets]
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as WidgetId);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveId(null);
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = widgetIds.indexOf(active.id as WidgetId);
      const newIndex = widgetIds.indexOf(over.id as WidgetId);
      if (oldIndex === -1 || newIndex === -1) return;

      const newOrder = [...widgetIds];
      const [moved] = newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, moved);
      updateWidgetOrder(newOrder);
    },
    [widgetIds, updateWidgetOrder]
  );

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  const activeWidget = activeId ? WIDGET_REGISTRY[activeId] : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToWindowEdges]}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={widgetIds} strategy={rectSortingStrategy} disabled={!editMode}>
        <div className={styles.dashboardGrid}>
          {visibleWidgets.map((widget) => (
            <SortableWidgetWrapper key={widget.id} widgetConfig={widget}>
              <WidgetRenderer
                widgetId={widget.id}
                resources={resources}
                loading={loading}
              />
            </SortableWidgetWrapper>
          ))}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeWidget ? (
          <div className={styles.dragOverlay}>
            <div className={styles.dragOverlayContent}>
              <span className={styles.dragOverlayTitle}>{activeWidget.title}</span>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
