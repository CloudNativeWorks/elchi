/**
 * Analytics Section Component
 * Wraps WAF Security and Service Health widgets
 */

import React from 'react';
import { WAFSecurity } from '../widgets/WAFSecurity';
import { ServiceHealth } from '../widgets/ServiceHealth';
import styles from '../styles/dashboard.module.scss';
import ClientResources from '../widgets/ClientResources';

export const AnalyticsSection: React.FC = () => {
  return (
    <div className={styles.analyticsSection}>
      <WAFSecurity />
      <ServiceHealth />
      <div className={styles.fullWidth}>
        <ClientResources />
      </div>
    </div>
  );
};
