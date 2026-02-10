/**
 * Dashboard Layout Hook
 * Manages layout state with localStorage persistence
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  WidgetId,
  WidgetSpan,
  WidgetLayoutConfig,
  DashboardLayoutPreferences,
} from '../types/layout.types';
import { WIDGET_REGISTRY, DEFAULT_LAYOUT } from '../config/widgetRegistry';

const STORAGE_KEY_PREFIX = 'elchi-dashboard-layout';
const CURRENT_VERSION = 1;
const DEBOUNCE_MS = 300;

function getStorageKey(): string {
  const hostname = window.location.hostname;
  return `${STORAGE_KEY_PREFIX}-${hostname}`;
}

function validateAndMigrate(
  stored: unknown
): DashboardLayoutPreferences | null {
  if (!stored || typeof stored !== 'object') return null;

  const data = stored as Record<string, unknown>;
  if (typeof data.version !== 'number' || !Array.isArray(data.widgets)) {
    return null;
  }

  const registryIds = new Set(Object.keys(WIDGET_REGISTRY));
  const validWidgets: WidgetLayoutConfig[] = [];

  for (const widget of data.widgets) {
    if (
      !widget ||
      typeof widget !== 'object' ||
      typeof (widget as Record<string, unknown>).id !== 'string' ||
      !registryIds.has((widget as Record<string, unknown>).id as string)
    ) {
      continue;
    }

    const w = widget as Record<string, unknown>;
    const meta = WIDGET_REGISTRY[w.id as WidgetId];

    validWidgets.push({
      id: w.id as WidgetId,
      visible: typeof w.visible === 'boolean' ? w.visible : true,
      span: isValidSpan(w.span) ? (w.span as WidgetSpan) : meta.defaultSpan,
      order: typeof w.order === 'number' ? w.order : meta.defaultOrder,
      minSpan: meta.minSpan,
      maxSpan: meta.maxSpan,
    });
  }

  // Add any new widgets not in stored preferences
  const storedIds = new Set(validWidgets.map((w) => w.id));
  const maxOrder = validWidgets.reduce(
    (max, w) => Math.max(max, w.order),
    -1
  );

  let nextOrder = maxOrder + 1;
  for (const id of Object.keys(WIDGET_REGISTRY) as WidgetId[]) {
    if (!storedIds.has(id)) {
      const meta = WIDGET_REGISTRY[id];
      validWidgets.push({
        id,
        visible: true,
        span: meta.defaultSpan,
        order: nextOrder++,
        minSpan: meta.minSpan,
        maxSpan: meta.maxSpan,
      });
    }
  }

  return {
    version: CURRENT_VERSION,
    widgets: validWidgets,
  };
}

function isValidSpan(value: unknown): value is WidgetSpan {
  return (
    typeof value === 'number' && [6, 8, 12, 16, 24].includes(value)
  );
}

function loadFromStorage(): DashboardLayoutPreferences {
  try {
    const raw = localStorage.getItem(getStorageKey());
    if (!raw) return DEFAULT_LAYOUT;

    const parsed = JSON.parse(raw);
    const validated = validateAndMigrate(parsed);
    return validated ?? DEFAULT_LAYOUT;
  } catch {
    return DEFAULT_LAYOUT;
  }
}

export function useDashboardLayout() {
  const [layout, setLayout] = useState<DashboardLayoutPreferences>(loadFromStorage);
  const [editMode, setEditMode] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const persistLayout = useCallback(
    (newLayout: DashboardLayoutPreferences) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        try {
          localStorage.setItem(getStorageKey(), JSON.stringify(newLayout));
        } catch {
          // localStorage full or unavailable
        }
      }, DEBOUNCE_MS);
    },
    []
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const updateLayout = useCallback(
    (updater: (prev: DashboardLayoutPreferences) => DashboardLayoutPreferences) => {
      setLayout((prev) => {
        const next = updater(prev);
        persistLayout(next);
        return next;
      });
    },
    [persistLayout]
  );

  const updateWidgetOrder = useCallback(
    (orderedIds: WidgetId[]) => {
      updateLayout((prev) => ({
        ...prev,
        widgets: prev.widgets.map((w) => {
          const newOrder = orderedIds.indexOf(w.id);
          return newOrder !== -1 ? { ...w, order: newOrder } : w;
        }),
      }));
    },
    [updateLayout]
  );

  const updateWidgetSpan = useCallback(
    (id: WidgetId, span: WidgetSpan) => {
      updateLayout((prev) => ({
        ...prev,
        widgets: prev.widgets.map((w) => {
          if (w.id !== id) return w;
          const clampedSpan = Math.max(w.minSpan, Math.min(w.maxSpan, span)) as WidgetSpan;
          return { ...w, span: clampedSpan };
        }),
      }));
    },
    [updateLayout]
  );

  const toggleWidgetVisibility = useCallback(
    (id: WidgetId) => {
      updateLayout((prev) => ({
        ...prev,
        widgets: prev.widgets.map((w) =>
          w.id === id ? { ...w, visible: !w.visible } : w
        ),
      }));
    },
    [updateLayout]
  );

  const resetToDefaults = useCallback(() => {
    setLayout(DEFAULT_LAYOUT);
    try {
      localStorage.removeItem(getStorageKey());
    } catch {
      // ignore
    }
  }, []);

  const visibleWidgets = layout.widgets
    .filter((w) => w.visible)
    .sort((a, b) => a.order - b.order);

  const allWidgets = [...layout.widgets].sort((a, b) => a.order - b.order);

  return {
    layout,
    editMode,
    setEditMode,
    visibleWidgets,
    allWidgets,
    updateWidgetOrder,
    updateWidgetSpan,
    toggleWidgetVisibility,
    resetToDefaults,
  };
}
