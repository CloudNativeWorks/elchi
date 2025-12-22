import type { CertificateStatus } from '../types';

export const CERTIFICATE_STATUS_CONFIG: Record<
  CertificateStatus,
  {
    color: string;
    label: string;
    icon: string;
  }
> = {
  pending_dns: {
    color: 'orange',
    label: 'Pending DNS',
    icon: 'ClockCircleOutlined',
  },
  pending_verification: {
    color: 'processing',
    label: 'Verifying',
    icon: 'SyncOutlined',
  },
  verifying: {
    color: 'processing',
    label: 'Verifying',
    icon: 'SyncOutlined',
  },
  verification_failed: {
    color: 'error',
    label: 'Verification Failed',
    icon: 'CloseCircleOutlined',
  },
  active: {
    color: 'success',
    label: 'Active',
    icon: 'CheckCircleOutlined',
  },
  renewal_pending: {
    color: 'processing',
    label: 'Renewal Pending',
    icon: 'SyncOutlined',
  },
  renewal_failed: {
    color: 'warning',
    label: 'Renewal Failed',
    icon: 'ExclamationCircleOutlined',
  },
  expired: {
    color: 'default',
    label: 'Expired',
    icon: 'StopOutlined',
  },
};
