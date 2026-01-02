/**
 * Dashboard Grid Component
 * Responsive grid layout system
 */

import React from 'react';
import styles from '../styles/dashboard.module.scss';

interface DashboardGridProps {
  children: React.ReactNode;
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({ children }) => {
  return <div className={styles.dashboardGrid}>{children}</div>;
};
