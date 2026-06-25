import React from 'react';
import { Card, Typography, Tag, Row, Col, Segmented, Empty } from 'antd';
import { CloudServerOutlined, SunOutlined, MoonOutlined, DesktopOutlined, BgColorsOutlined } from '@ant-design/icons';
import { getVersionAntdColor } from '@/utils/versionColors';
import { useTheme, ThemeMode } from '@/contexts/ThemeContext';
import { useLicenseStatus } from '@/hooks/useLicense';
import StorageStatsCard from './components/StorageStatsCard';

const { Text } = Typography;

// One stat block in the identity banner — tiny uppercase label + value.
const HeroStat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div
        style={{
            background: 'rgba(255, 255, 255, 0.14)',
            border: '1px solid rgba(255, 255, 255, 0.22)',
            borderRadius: 10,
            padding: '8px 16px',
            minWidth: 110,
        }}
    >
        <div style={{ fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)' }}>
            {label}
        </div>
        <div style={{ fontSize: 17, fontWeight: 700, color: '#fff', fontVariantNumeric: 'tabular-nums', lineHeight: 1.3 }}>
            {value}
        </div>
    </div>
);

// Shared card header — 44×44 gradient icon box + title + subtitle.
const CardHeader: React.FC<{
    icon: React.ReactNode;
    iconBg: string;
    title: string;
    subtitle: string;
}> = ({ icon, iconBg, title, subtitle }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
            style={{
                width: 44,
                height: 44,
                borderRadius: 11,
                background: iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
            }}
        >
            {icon}
        </div>
        <div>
            <Text style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</Text>
            <div>
                <Text type="secondary" style={{ fontSize: 12.5 }}>{subtitle}</Text>
            </div>
        </div>
    </div>
);

const CARD_STYLE: React.CSSProperties = {
    borderRadius: 12,
    border: '1px solid var(--border-default)',
    background: 'var(--card-bg)',
    height: '100%',
};

const General: React.FC<{ active?: boolean }> = ({ active = true }) => {
    const { mode, setMode, isDark } = useTheme();
    const { license } = useLicenseStatus();

    const uiVersion = window.APP_CONFIG?.VERSION ?? '—';
    const apiVersion = license?.api_version || '—';
    const envoyVersions = window.APP_CONFIG?.AVAILABLE_VERSIONS ?? [];

    return (
        <div style={{ width: '100%', padding: 12 }}>
            {/* ── Identity banner ──────────────────────────────────── */}
            <div
                style={{
                    borderRadius: 14,
                    background: 'linear-gradient(120deg, var(--color-primary) 0%, var(--color-accent) 100%)',
                    padding: '22px 26px',
                    marginBottom: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 18,
                    boxShadow: '0 6px 20px rgba(10, 127, 218, 0.18)',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div
                        style={{
                            width: 56,
                            height: 56,
                            borderRadius: 14,
                            background: 'rgba(255, 255, 255, 0.18)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}
                    >
                        <img src="/favicon.ico" alt="Elchi" style={{ width: 30, height: 30 }} />
                    </div>
                    <div>
                        <div style={{ fontSize: 24, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>Elchi</div>
                        <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.85)' }}>
                            Traffic Management Platform
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <HeroStat label="UI Version" value={uiVersion} />
                    <HeroStat label="API Version" value={apiVersion} />
                    <HeroStat label="Envoy Builds" value={String(envoyVersions.length)} />
                </div>
            </div>

            {/* ── Detail cards ─────────────────────────────────────── */}
            <Row gutter={[16, 16]}>
                {/* Supported Envoy Versions */}
                <Col xs={24} lg={12}>
                    <Card style={CARD_STYLE} styles={{ body: { padding: 20 } }}>
                        <CardHeader
                            icon={<CloudServerOutlined style={{ color: '#fff', fontSize: 20 }} />}
                            iconBg="linear-gradient(135deg, var(--color-success) 0%, #389e0d 100%)"
                            title="Supported Envoy Versions"
                            subtitle="Proxy server builds this control plane can manage"
                        />
                        <div
                            style={{
                                marginTop: 16,
                                paddingTop: 16,
                                borderTop: '1px solid var(--border-default)',
                            }}
                        >
                            {envoyVersions.length === 0 ? (
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description={<Text type="secondary">No Envoy versions configured.</Text>}
                                />
                            ) : (
                                <>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: 8,
                                            maxHeight: 160,
                                            overflowY: 'auto',
                                        }}
                                    >
                                        {envoyVersions.map((version) => (
                                            <Tag
                                                key={version}
                                                color={getVersionAntdColor(version)}
                                                style={{ margin: 0, fontSize: 12, fontWeight: 500, borderRadius: 6, padding: '2px 10px' }}
                                            >
                                                {version}
                                            </Tag>
                                        ))}
                                    </div>
                                    <div
                                        style={{
                                            marginTop: 14,
                                            padding: '8px 12px',
                                            background: 'var(--color-success-light)',
                                            borderRadius: 8,
                                            border: '1px solid var(--color-success)',
                                        }}
                                    >
                                        <Text style={{ fontSize: 12, color: 'var(--color-success)', fontWeight: 600 }}>
                                            {envoyVersions.length} version{envoyVersions.length === 1 ? '' : 's'} available
                                        </Text>
                                    </div>
                                </>
                            )}
                        </div>
                    </Card>
                </Col>

                {/* Appearance */}
                <Col xs={24} lg={12}>
                    <Card style={CARD_STYLE} styles={{ body: { padding: 20 } }}>
                        <CardHeader
                            icon={<BgColorsOutlined style={{ color: '#fff', fontSize: 20 }} />}
                            iconBg={
                                isDark
                                    ? 'linear-gradient(135deg, var(--color-primary) 0%, #1d4ed8 100%)'
                                    : 'linear-gradient(135deg, var(--color-warning) 0%, #d97706 100%)'
                            }
                            title="Appearance"
                            subtitle="Customize the application theme"
                        />
                        <div
                            style={{
                                marginTop: 16,
                                paddingTop: 16,
                                borderTop: '1px solid var(--border-default)',
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 11,
                                    letterSpacing: 0.6,
                                    textTransform: 'uppercase',
                                    color: 'var(--text-tertiary)',
                                    display: 'block',
                                    marginBottom: 8,
                                }}
                            >
                                Theme Mode
                            </Text>
                            <Segmented
                                value={mode}
                                onChange={(value) => setMode(value as ThemeMode)}
                                options={[
                                    { value: 'light', icon: <SunOutlined />, label: 'Light' },
                                    { value: 'dark', icon: <MoonOutlined />, label: 'Dark' },
                                    { value: 'system', icon: <DesktopOutlined />, label: 'System' },
                                ]}
                                block
                            />
                            <div
                                style={{
                                    marginTop: 14,
                                    padding: '8px 12px',
                                    background: 'var(--bg-hover)',
                                    borderRadius: 8,
                                    border: '1px solid var(--border-default)',
                                }}
                            >
                                <Text style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                                    {mode === 'system'
                                        ? `Following the system preference — currently ${isDark ? 'dark' : 'light'}.`
                                        : `${mode.charAt(0).toUpperCase() + mode.slice(1)} mode is active.`}
                                </Text>
                            </div>
                        </div>
                    </Card>
                </Col>

                {/* Storage (live ClickHouse + MongoDB usage) — owner/admin only */}
                <Col xs={24}>
                    <StorageStatsCard active={active} />
                </Col>
            </Row>
        </div>
    );
};

export default General;
