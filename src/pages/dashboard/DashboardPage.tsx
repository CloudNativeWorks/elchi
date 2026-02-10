/**
 * Dashboard Page Component
 * Main command center dashboard with customizable widget layout
 */

import React from 'react';
import { DashboardContainer } from './layout/DashboardContainer';
import { DashboardGrid } from './layout/DashboardGrid';
import { useDashboardData } from './hooks/useDashboardData';
import { DashboardRefreshProvider } from './context/DashboardRefreshContext';
import { DashboardLayoutProvider } from './context/DashboardLayoutContext';
import { DashboardToolbar } from './layout/DashboardToolbar';
import styles from './styles/dashboard.module.scss';

export const DashboardPage: React.FC = () => {
  const { data, loading, error } = useDashboardData();

  if (loading) {
    return (
      <DashboardContainer>
        <div className={styles.loading}>
          <span className={styles.spinner}>⟳</span>
          <p>Loading Command Center...</p>
        </div>
      </DashboardContainer>
    );
  }

  if (error) {
    return (
      <DashboardContainer>
        <div className={styles.error}>
          <span className={styles.errorIcon}>⚠</span>
          <h2 className={styles.errorTitle}>Failed to Load Dashboard</h2>
          <p className={styles.errorMessage}>{error.message}</p>
          <button className={styles.retryButton} onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </DashboardContainer>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <DashboardRefreshProvider>
      <DashboardLayoutProvider>
        <DashboardContainer>
          <DashboardToolbar />
          <DashboardGrid resources={data.resources} loading={loading} />
        </DashboardContainer>
      </DashboardLayoutProvider>
    </DashboardRefreshProvider>
  );
};
