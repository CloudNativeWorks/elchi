/**
 * Charts Section
 * Contains Request Rate Timeline chart
 */

import React from 'react';
import { RequestRateTimeline } from '../widgets/RequestRateTimeline';
import styles from '../styles/dashboard.module.scss';

export const ChartsSection: React.FC = () => {
  return (
    <div className={styles.chartsSection}>
      <RequestRateTimeline />
    </div>
  );
};
