/**
 * Quick Stats Section
 * Contains Quick Metrics Dashboard (4 mini cards)
 */

import React from 'react';
import { QuickMetrics } from '../widgets/QuickMetrics';
import styles from '../styles/dashboard.module.scss';

export const QuickStatsSection: React.FC = () => {
  return (
    <div className={styles.quickStatsSection}>
      <QuickMetrics />
    </div>
  );
};
