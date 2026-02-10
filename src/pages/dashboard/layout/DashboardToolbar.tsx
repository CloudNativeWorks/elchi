/**
 * Dashboard Toolbar
 * Dashboard header with title and layout customization controls
 */

import React, { useState } from 'react';
import { Button, Tooltip, Space } from 'antd';
import {
  SettingOutlined,
  CheckOutlined,
  UndoOutlined,
  AppstoreOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import { useDashboardLayoutContext } from '../context/DashboardLayoutContext';
import { DashboardSettingsDrawer } from '../widgets/DashboardSettingsDrawer';
import styles from '../styles/dashboard.module.scss';

export const DashboardToolbar: React.FC = () => {
  const { editMode, setEditMode, resetToDefaults } = useDashboardLayoutContext();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className={styles.dashboardToolbar}>
      <div className={styles.toolbarLeft}>
        <DashboardOutlined className={styles.toolbarIcon} />
        <span className={styles.toolbarTitle}>Command Center</span>
      </div>

      <div className={styles.toolbarRight}>
        {editMode && (
          <Space size="small">
            <Tooltip title="Manage Widgets">
              <Button
                size="small"
                icon={<AppstoreOutlined />}
                onClick={() => setDrawerOpen(true)}
              >
                Widgets
              </Button>
            </Tooltip>
            <Tooltip title="Reset to Default Layout">
              <Button
                size="small"
                icon={<UndoOutlined />}
                onClick={resetToDefaults}
              />
            </Tooltip>
          </Space>
        )}

        <Tooltip title={editMode ? 'Save Layout' : 'Customize Dashboard'}>
          <Button
            type={editMode ? 'primary' : 'text'}
            size="small"
            icon={editMode ? <CheckOutlined /> : <SettingOutlined />}
            onClick={() => setEditMode(!editMode)}
            className={editMode ? '' : styles.customizeButton}
          >
            {editMode ? 'Done' : 'Customize'}
          </Button>
        </Tooltip>
      </div>

      <DashboardSettingsDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
};
