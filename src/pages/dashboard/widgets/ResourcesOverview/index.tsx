/**
 * Resources Overview Widget
 * Displays count of all Envoy resources in a modern grid
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DatabaseOutlined,
  GlobalOutlined,
  ShareAltOutlined,
  CloudOutlined,
  ClusterOutlined,
  AimOutlined,
  KeyOutlined,
  FilterOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { ResourceStats } from '../../types/dashboard.types';
import styles from './styles.module.scss';

interface ResourcesOverviewProps {
  resources?: ResourceStats;
  loading?: boolean;
}

const RESOURCE_CONFIG: Record<
  string,
  { icon: React.ReactNode; label: string; path: string }
> = {
  listeners: {
    icon: <GlobalOutlined />,
    label: 'Listeners',
    path: '/resource/listener',
  },
  routes: {
    icon: <ShareAltOutlined />,
    label: 'Routes',
    path: '/resource/route',
  },
  virtualHosts: {
    icon: <CloudOutlined />,
    label: 'Virtual Hosts',
    path: '/resource/virtual_host',
  },
  clusters: {
    icon: <ClusterOutlined />,
    label: 'Clusters',
    path: '/resource/cluster',
  },
  endpoints: {
    icon: <AimOutlined />,
    label: 'Endpoints',
    path: '/resource/endpoint',
  },
  secrets: {
    icon: <KeyOutlined />,
    label: 'Secrets',
    path: '/resource/secret',
  },
  filters: {
    icon: <FilterOutlined />,
    label: 'Filters',
    path: '/filters',
  },
  extensions: {
    icon: <AppstoreOutlined />,
    label: 'Extensions',
    path: '/extensions',
  },
};

export const ResourcesOverview: React.FC<ResourcesOverviewProps> = ({
  resources,
  loading = false,
}) => {
  const navigate = useNavigate();

  if (!resources) return null;

  const resourceEntries = Object.entries(resources).filter(
    ([key]) => key !== 'timestamp'
  );

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <DatabaseOutlined className={styles.headerIcon} />
        <h3 className={styles.headerTitle}>Resources Overview</h3>
      </div>
      <div className={styles.resourcesGrid}>
        {resourceEntries.map(([key, value]) => {
          const config = RESOURCE_CONFIG[key];
          if (!config) return null;

          return (
            <div
              key={key}
              className={styles.resourceCard}
              onClick={() => handleCardClick(config.path)}
            >
              <div className={styles.resourceIcon}>{config.icon}</div>
              <div className={styles.resourceInfo}>
                <div className={styles.resourceLabel}>{config.label}</div>
                <div className={styles.resourceCount}>{value}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResourcesOverview;
