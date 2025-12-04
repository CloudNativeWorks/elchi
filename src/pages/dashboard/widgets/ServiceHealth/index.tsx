/**
 * Service Health Widget
 * Displays service health matrix
 */

import React from 'react';
import { CloudServerOutlined } from '@ant-design/icons';
import { BaseWidget } from '../shared/BaseWidget';
import { ServiceCard } from './ServiceCard';
import { useServiceStatus } from '../../hooks/useServiceStatus';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.scss';

interface ServiceHealthProps {
  loading?: boolean;
}

export const ServiceHealth: React.FC<ServiceHealthProps> = ({ loading: externalLoading = false }) => {
  const { services, loading, error, refresh } = useServiceStatus();
  const navigate = useNavigate();

  const isLoading = loading || externalLoading;

  const handleServiceClick = (serviceId: string) => {
    // TODO: Navigate to service detail page
    console.log('Navigate to service:', serviceId);
  };

  if (error) {
    return (
      <BaseWidget
        title="Service Health"
        icon={<CloudServerOutlined />}
        size="medium"
        error={error}
        onRefresh={refresh}
      >
        <div />
      </BaseWidget>
    );
  }

  return (
    <BaseWidget
      title="Service Health - 5m"
      icon={<CloudServerOutlined />}
      size="medium"
      loading={isLoading}
      onRefresh={refresh}
    >
      <div className={styles.serviceHealth}>
        {services.length === 0 && !isLoading ? (
          <div className={styles.emptyState}>
            <CloudServerOutlined style={{ fontSize: 48, opacity: 0.3 }} />
            <p>No services found</p>
          </div>
        ) : (
          <div className={styles.serviceGrid}>
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onClick={() => handleServiceClick(service.id)}
              />
            ))}
          </div>
        )}
      </div>
    </BaseWidget>
  );
};

export default ServiceHealth;
