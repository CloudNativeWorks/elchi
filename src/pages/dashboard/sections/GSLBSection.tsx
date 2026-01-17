/**
 * GSLB Section
 * Contains GSLB Health Check Statistics widget
 */

import React from 'react';
import { GSLBStatistics } from '../widgets/GSLBStatistics';
import styles from '../styles/dashboard.module.scss';

export const GSLBSection: React.FC = () => {
  return (
    <div className={styles.chartsSection}>
      <GSLBStatistics />
    </div>
  );
};
