/**
 * Metrics Section
 * Contains Response Time Trends
 */

import React from 'react';
import { ResponseTimeTrends } from '../widgets/ResponseTimeTrends';
import styles from '../styles/dashboard.module.scss';

export const MetricsSection: React.FC = () => {
  return (
    <div className={styles.metricsSection}>
      <div className={styles.fullWidth}>
        <ResponseTimeTrends />
      </div>
    </div>
  );
};
