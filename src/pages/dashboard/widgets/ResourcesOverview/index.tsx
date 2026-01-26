/**
 * Resources Overview Widget
 * Displays count of all Envoy resources in a modern grid
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Collapse } from 'antd';
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
  InfoCircleOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import { ResourceStats } from '../../types/dashboard.types';
import styles from './styles.module.scss';
import {
  D_LISTENER,
  D_ROUTE,
  D_VIRTUAL_HOST,
  D_CLUSTER,
  D_ENDPOINT,
  D_TLS,
  D_SECRET,
  D_FILTER,
  D_EXTENSION,
} from '@/common/statics/ResourceDescriptions';
import ReactMarkdown from 'react-markdown';

interface ResourcesOverviewProps {
  resources?: ResourceStats;
  loading?: boolean;
}

const RESOURCE_CONFIG: Record<
  string,
  { icon: React.ReactNode; label: string; path: string; description: string }
> = {
  listeners: {
    icon: <GlobalOutlined />,
    label: 'Listeners',
    path: '/resource/listener',
    description: D_LISTENER,
  },
  routes: {
    icon: <ShareAltOutlined />,
    label: 'Routes',
    path: '/resource/route',
    description: D_ROUTE,
  },
  virtualHosts: {
    icon: <CloudOutlined />,
    label: 'Virtual Hosts',
    path: '/resource/virtual_host',
    description: D_VIRTUAL_HOST,
  },
  clusters: {
    icon: <ClusterOutlined />,
    label: 'Clusters',
    path: '/resource/cluster',
    description: D_CLUSTER,
  },
  endpoints: {
    icon: <AimOutlined />,
    label: 'Endpoints',
    path: '/resource/endpoint',
    description: D_ENDPOINT,
  },
  tls: {
    icon: <SafetyOutlined />,
    label: 'TLS',
    path: '/resource/transport-socket',
    description: D_TLS,
  },
  secrets: {
    icon: <KeyOutlined />,
    label: 'Secrets',
    path: '/resource/secret',
    description: D_SECRET,
  },
  filters: {
    icon: <FilterOutlined />,
    label: 'Filters',
    path: '/filters',
    description: D_FILTER,
  },
  extensions: {
    icon: <AppstoreOutlined />,
    label: 'Extensions',
    path: '/extensions',
    description: D_EXTENSION,
  },
};

export const ResourcesOverview: React.FC<ResourcesOverviewProps> = ({
  resources,
  loading = false,
}) => {
  const navigate = useNavigate();
  const [infoModalOpen, setInfoModalOpen] = useState(false);

  if (!resources) return null;

  const resourceEntries = Object.entries(resources).filter(
    ([key]) => key !== 'timestamp'
  );

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  // Build collapse items from RESOURCE_CONFIG
  const collapseItems = Object.entries(RESOURCE_CONFIG).map(([key, config]) => ({
    key,
    label: (
      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ color: 'var(--color-primary)' }}>{config.icon}</span>
        <span style={{ fontWeight: 600 }}>{config.label}</span>
      </span>
    ),
    children: (
      <div style={{ lineHeight: 1.7 }}>
        <ReactMarkdown>{config.description}</ReactMarkdown>
      </div>
    ),
  }));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <DatabaseOutlined className={styles.headerIcon} />
        <h3 className={styles.headerTitle}>Resources Overview</h3>
        <div style={{ marginLeft: 'auto' }}>
          <InfoCircleOutlined
            style={{
              fontSize: 18,
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'color 0.2s',
            }}
            onClick={(e) => {
              e.stopPropagation();
              setInfoModalOpen(true);
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
            title="Resource Descriptions"
          />
        </div>
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

      {/* Resource Descriptions Modal */}
      <Modal
        title={
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <DatabaseOutlined style={{ color: 'var(--color-primary)' }} />
            Resource Descriptions
          </span>
        }
        open={infoModalOpen}
        onCancel={() => setInfoModalOpen(false)}
        footer={null}
        width={800}
        styles={{
          body: {
            maxHeight: '70vh',
            overflowY: 'auto',
            padding: '16px 24px',
          },
        }}
      >
        <Collapse
          accordion
          items={collapseItems}
          style={{ background: 'transparent' }}
          expandIconPosition="end"
        />
      </Modal>
    </div>
  );
};
