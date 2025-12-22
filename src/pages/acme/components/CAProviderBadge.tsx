import React from 'react';
import { Tag } from 'antd';
import {
  SafetyCertificateOutlined,
  GoogleOutlined,
  LockOutlined,
} from '@ant-design/icons';
import type { CAProvider } from '../types';

interface CAProviderBadgeProps {
  provider: CAProvider;
  showIcon?: boolean;
}

const providerConfig: Record<
  CAProvider,
  { label: string; color: string; icon: React.ReactNode }
> = {
  letsencrypt: {
    label: "Let's Encrypt",
    color: '#2c5aa0',
    icon: <SafetyCertificateOutlined />,
  },
  google: {
    label: 'Google Trust Services',
    color: '#4285f4',
    icon: <GoogleOutlined />,
  },
  zerossl: {
    label: 'ZeroSSL',
    color: '#00a4e0',
    icon: <LockOutlined />,
  },
  buypass: {
    label: 'Buypass',
    color: '#e63946',
    icon: <SafetyCertificateOutlined />,
  },
};

const CAProviderBadge: React.FC<CAProviderBadgeProps> = ({
  provider,
  showIcon = true,
}) => {
  const config = providerConfig[provider];

  return (
    <Tag color={config.color} icon={showIcon ? config.icon : undefined}>
      {config.label}
    </Tag>
  );
};

export default CAProviderBadge;
