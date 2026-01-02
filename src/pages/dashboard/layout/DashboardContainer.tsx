/**
 * Dashboard Container Component
 * Main container with background and padding
 */

import React from 'react';
import styles from '../styles/dashboard.module.scss';

interface DashboardContainerProps {
  children: React.ReactNode;
}

export const DashboardContainer: React.FC<DashboardContainerProps> = ({ children }) => {
  return <div className={styles.dashboardContainer}>{children}</div>;
};

