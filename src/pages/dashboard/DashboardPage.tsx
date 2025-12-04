/**
 * Dashboard Page Component
 * Main command center dashboard with all widgets
 */

import React from 'react';
import { DashboardContainer } from './layout/DashboardContainer';
import { DashboardGrid } from './layout/DashboardGrid';
import { TrafficSection } from './sections/TrafficSection';
import { AnalyticsSection } from './sections/AnalyticsSection';
import { ChartsSection } from './sections/ChartsSection';
import { MetricsSection } from './sections/MetricsSection';
import { QuickStatsSection } from './sections/QuickStatsSection';
import { AdvancedSection } from './sections/AdvancedSection';
import { ResourcesOverview } from './widgets/ResourcesOverview';
import { useDashboardData } from './hooks/useDashboardData';
import { DashboardRefreshProvider } from './context/DashboardRefreshContext';
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
      <DashboardContainer>
        <DashboardGrid>
          {/* Traffic Section with TrafficOverview */}
          <TrafficSection />

          {/* Analytics Section with WAF Security and Service Health */}
          <AnalyticsSection />

          {/* NEW: Request Rate Timeline Chart */}
          <ChartsSection />

          {/* NEW: Top Services + Response Time Trends */}
          <MetricsSection />

          {/* NEW: Quick Metrics (4 mini cards) */}
          <QuickStatsSection />

          {/* NEW: Advanced Visualizations (Heatmap, Donut, Gauge, Timeline, Sankey) */}
          <AdvancedSection />

          {/* Resources Overview */}
          <div className={styles.resourcesSection}>
            <ResourcesOverview resources={data.resources} loading={loading} />
          </div>
        </DashboardGrid>
      </DashboardContainer>
    </DashboardRefreshProvider>
  );
};

export default DashboardPage;
