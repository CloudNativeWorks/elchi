/**
 * Service Card Component
 * Individual service health display
 */

import React from 'react';
import { CheckCircleOutlined, WarningOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { ServiceStatus } from '../../types/dashboard.types';
import { formatNumber, formatUptime, formatPercentage } from '../../utils/formatters';
import { COLORS } from '../../utils/constants';
import styles from './styles.module.scss';

interface ServiceCardProps {
  service: ServiceStatus;
  onClick?: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick }) => {
  const getStatusIcon = () => {
    switch (service.status) {
      case 'healthy':
        return <CheckCircleOutlined style={{ color: COLORS.SUCCESS }} />;
      case 'degraded':
        return <WarningOutlined style={{ color: COLORS.WARNING }} />;
      case 'down':
        return <CloseCircleOutlined style={{ color: COLORS.DANGER }} />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (service.status) {
      case 'healthy':
        return COLORS.SUCCESS;
      case 'degraded':
        return COLORS.WARNING;
      case 'down':
        return COLORS.DANGER;
      default:
        return COLORS.GRAY;
    }
  };

  return (
    <div
      className={styles.serviceCard}
      onClick={onClick}
      style={{ borderLeftColor: getStatusColor() }}
    >
      <div className={styles.serviceHeader}>
        <div className={styles.serviceName}>{service.name}</div>
        <div className={styles.serviceStatus}>{getStatusIcon()}</div>
      </div>

      <div className={styles.serviceMetrics}>
        <div className={styles.metric}>
          <div className={styles.metricLabel}>Uptime</div>
          <div className={styles.metricValue}>{formatUptime(service.uptime)}</div>
        </div>

        <div className={styles.metric}>
          <div className={styles.metricLabel}>Requests</div>
          <div className={styles.metricValue}>{formatNumber(service.requestCount)}</div>
        </div>

        <div className={styles.metric}>
          <div className={styles.metricLabel}>Error Rate</div>
          <div className={styles.metricValue}>{formatPercentage(service.errorRate)}</div>
        </div>

        <div className={styles.metric}>
          <div className={styles.metricLabel}>Avg Response</div>
          <div className={styles.metricValue}>{service.avgResponseTime}ms</div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
