import React from 'react';
import { Space, Tooltip, Typography } from 'antd';
import { SafetyCertificateOutlined, WarningOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
    LicenseInfo,
    getDaysUntilExpiry,
    getPlanColors,
    getPlanDisplayName,
    getPlanLimitLabel,
    useLicenseStatus,
} from '@/hooks/useLicense';

const { Text } = Typography;

const formatDate = (iso?: string): string => {
    if (!iso) return '—';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString();
};

interface TooltipBodyProps {
    license: LicenseInfo;
}

const TooltipBody: React.FC<TooltipBodyProps> = ({ license }) => {
    const planName = getPlanDisplayName(license);
    const limit = license.client_limit === 0 ? 'Unlimited' : `${license.client_limit} client${license.client_limit === 1 ? '' : 's'}`;
    const days = getDaysUntilExpiry(license);

    return (
        <div style={{ minWidth: 220, fontSize: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text strong style={{ color: 'inherit' }}>{planName} plan</Text>
                <Text style={{ color: 'inherit', opacity: 0.85 }}>{limit}</Text>
            </div>
            {!license.valid && license.reason && (
                <div style={{ marginTop: 4 }}>License invalid: {license.reason}</div>
            )}
            {license.expires_at && (
                <div style={{ opacity: 0.85 }}>
                    Expires: {formatDate(license.expires_at)}
                    {typeof days === 'number' && days >= 0 && days <= 30 && ` (${days} day${days === 1 ? '' : 's'})`}
                </div>
            )}
            {license.last_checked_at && (
                <div style={{ opacity: 0.7, marginTop: 2 }}>
                    Last checked: {new Date(license.last_checked_at).toLocaleString()}
                </div>
            )}
            {license.last_error && (
                <div style={{ marginTop: 6, color: '#ffa940' }}>
                    ⚠ Last sync failed; cached license still in use.
                </div>
            )}
            <div style={{ marginTop: 8, opacity: 0.7 }}>Click to open License settings</div>
        </div>
    );
};

const LicenseBadge: React.FC = () => {
    const navigate = useNavigate();
    const { license } = useLicenseStatus({ polling: true, pollingIntervalMs: 60_000 });

    if (!license) return null;

    const colors = getPlanColors(license);
    const planName = getPlanDisplayName(license);
    const limitLabel = getPlanLimitLabel(license);
    const days = getDaysUntilExpiry(license);
    const expiringSoon = typeof days === 'number' && days >= 0 && days <= 7;
    const expired = typeof days === 'number' && days < 0;
    const showWarning = !!license.last_error || expiringSoon || expired || !license.valid;

    const handleClick = () => {
        navigate('/settings?tab=license');
    };

    return (
        <Tooltip title={<TooltipBody license={license} />} placement="bottom">
            <button
                type="button"
                onClick={handleClick}
                aria-label="License status"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    height: 32,
                    padding: '0 10px',
                    borderRadius: 8,
                    background: colors.bg,
                    border: `1px solid ${colors.border}`,
                    color: colors.fg,
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 600,
                    lineHeight: 1,
                    transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                }}
            >
                <SafetyCertificateOutlined style={{ fontSize: 14 }} />
                <Space size={4} align="center">
                    <span>{planName}</span>
                    {license.client_limit > 0 && (
                        <span style={{ opacity: 0.75, fontWeight: 500 }}>· {limitLabel}</span>
                    )}
                </Space>
                {showWarning && (
                    <WarningOutlined
                        style={{
                            fontSize: 12,
                            color: expired || !license.valid ? 'var(--color-danger)' : 'var(--color-warning)',
                        }}
                    />
                )}
            </button>
        </Tooltip>
    );
};

export default LicenseBadge;
