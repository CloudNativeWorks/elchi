/**
 * Traffic Section Component
 * Wraps existing TrafficOverview component
 */

import React from 'react';
import TrafficOverview from '@/components/dashboard/TrafficOverview';
import styles from '../styles/dashboard.module.scss';

export const TrafficSection: React.FC = () => {
  return (
    <div className={styles.trafficSection}>
      <TrafficOverview />
    </div>
  );
};

export default TrafficSection;
