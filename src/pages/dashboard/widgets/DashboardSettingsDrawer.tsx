/**
 * Dashboard Settings Drawer
 * Widget visibility and size configuration panel
 */

import React from 'react';
import { Drawer, Switch, Button, Segmented } from 'antd';
import {
  DashboardOutlined,
  SafetyOutlined,
  CloudServerOutlined,
  TeamOutlined,
  GlobalOutlined,
  LineChartOutlined,
  FieldTimeOutlined,
  ThunderboltOutlined,
  PieChartOutlined,
  NodeIndexOutlined,
  DatabaseOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import { useDashboardLayoutContext } from '../context/DashboardLayoutContext';
import { WIDGET_REGISTRY } from '../config/widgetRegistry';
import { WidgetId, WidgetSpan } from '../types/layout.types';
import styles from '../styles/widgets.module.scss';

const ICON_MAP: Record<string, React.ReactNode> = {
  DashboardOutlined: <DashboardOutlined />,
  SafetyOutlined: <SafetyOutlined />,
  CloudServerOutlined: <CloudServerOutlined />,
  TeamOutlined: <TeamOutlined />,
  GlobalOutlined: <GlobalOutlined />,
  LineChartOutlined: <LineChartOutlined />,
  FieldTimeOutlined: <FieldTimeOutlined />,
  ThunderboltOutlined: <ThunderboltOutlined />,
  PieChartOutlined: <PieChartOutlined />,
  NodeIndexOutlined: <NodeIndexOutlined />,
  DatabaseOutlined: <DatabaseOutlined />,
};

const SPAN_OPTIONS: { value: WidgetSpan; label: string }[] = [
  { value: 6, label: '1/4' },
  { value: 8, label: '1/3' },
  { value: 12, label: '1/2' },
  { value: 16, label: '2/3' },
  { value: 24, label: 'Full' },
];

interface DashboardSettingsDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const DashboardSettingsDrawer: React.FC<DashboardSettingsDrawerProps> = ({
  open,
  onClose,
}) => {
  const {
    allWidgets,
    toggleWidgetVisibility,
    updateWidgetSpan,
    resetToDefaults,
  } = useDashboardLayoutContext();

  const getSpanOptions = (widgetId: WidgetId) => {
    const meta = WIDGET_REGISTRY[widgetId];
    return SPAN_OPTIONS.filter(
      (opt) => opt.value >= meta.minSpan && opt.value <= meta.maxSpan
    );
  };

  return (
    <Drawer
      title="Dashboard Widgets"
      placement="right"
      width={400}
      open={open}
      onClose={onClose}
      extra={
        <Button
          icon={<UndoOutlined />}
          size="small"
          onClick={() => {
            resetToDefaults();
            onClose();
          }}
        >
          Reset All
        </Button>
      }
    >
      <div className={styles.settingsList}>
        {allWidgets.map((widget) => {
          const meta = WIDGET_REGISTRY[widget.id];
          const spanOptions = getSpanOptions(widget.id);
          const canResize = spanOptions.length > 1;

          return (
            <div key={widget.id} className={styles.settingsItem}>
              <div className={styles.settingsItemHeader}>
                <div className={styles.settingsItemInfo}>
                  <span className={styles.settingsItemIcon}>
                    {ICON_MAP[meta.icon]}
                  </span>
                  <div>
                    <div className={styles.settingsItemTitle}>{meta.title}</div>
                    <div className={styles.settingsItemDescription}>
                      {meta.description}
                    </div>
                  </div>
                </div>
                <Switch
                  checked={widget.visible}
                  onChange={() => toggleWidgetVisibility(widget.id)}
                  size="small"
                />
              </div>

              {widget.visible && canResize && (
                <div className={styles.settingsItemResize}>
                  <span className={styles.resizeLabel}>Width:</span>
                  <Segmented
                    size="small"
                    value={widget.span}
                    options={spanOptions.map((opt) => ({
                      value: opt.value,
                      label: opt.label,
                    }))}
                    onChange={(value) =>
                      updateWidgetSpan(widget.id, value as WidgetSpan)
                    }
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Drawer>
  );
};
