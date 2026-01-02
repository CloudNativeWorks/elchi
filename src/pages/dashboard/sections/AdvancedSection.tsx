/**
 * Advanced Visualizations Section
 * Contains Donut, Sankey, and Client Resources
 */

import React from 'react';
import { ClusterHealthDonut } from '../widgets/ClusterHealthDonut';
import { ConnectionFlowSankey } from '../widgets/ConnectionFlowSankey';
import styles from '../styles/dashboard.module.scss';

export const AdvancedSection: React.FC = () => {
  return (
    <>
      {/* 1/3 - 2/3 Grid: Donut + Dependency Graph */}
      <div className={styles.oneThirdWidth}>
        <ClusterHealthDonut />
      </div>
      <div className={styles.twoThirdsWidth}>
        <ConnectionFlowSankey />
      </div>
    </>
  );
};
