import React from 'react';
import { Tag } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { CERTIFICATE_STATUS_CONFIG } from '../constants/statuses';
import type { CertificateStatus } from '../types';

interface Props {
  status: CertificateStatus;
}

const iconMap: Record<string, React.ComponentType> = {
  CheckCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  StopOutlined,
};

const CertificateStatusBadge: React.FC<Props> = ({ status }) => {
  const config = CERTIFICATE_STATUS_CONFIG[status];
  const IconComponent = iconMap[config.icon];

  return (
    <Tag color={config.color} icon={<IconComponent />}>
      {config.label}
    </Tag>
  );
};

export default CertificateStatusBadge;
