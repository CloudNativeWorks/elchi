import React from 'react';
import { Card, Space, Typography, Tooltip, Tag, Spin } from 'antd';
import {
    ThunderboltOutlined,
    CheckCircleOutlined,
    MoonOutlined,
    DisconnectOutlined,
    ArrowDownOutlined,
} from '@ant-design/icons';
import { formatDistanceToNow } from 'date-fns';
import RiskFlagChips from './RiskFlagChips';
import InfoLabel from './InfoLabel';
import type { CurrentPostureResponse, InventoryDoc } from '../types';

const { Text } = Typography;

// Threat ramp (red family) — matches the catalog / overview threat colours.
const threatColor = (s: number): string =>
    s >= 40 ? '#ef4444' : s >= 25 ? '#fa541c' : s >= 10 ? '#f59e0b' : s > 0 ? '#fbbf24' : '#9ca3af';
// Exposure ramp (blue / purple family) — distinct from threat.
const postureColor = (s: number): string =>
    s >= 40 ? '#c41d7f' : s >= 25 ? '#722ed1' : s >= 10 ? '#1677ff' : s > 0 ? '#69b1ff' : '#9ca3af';

const POSTURE_INFO = (
    <div style={{ maxWidth: 320 }}>
        <div style={{ fontWeight: 600, marginBottom: 4 }}>Current vs ever</div>
        <div style={{ marginBottom: 6 }}>
            The catalog stores only the <strong>lifetime maximum</strong> score (it never
            self-lowers), so a remediated endpoint stays red forever. This panel pairs that{' '}
            <em>ever</em> max with a <strong>current</strong> snapshot from the last few days, so you
            can tell <em>“still bad”</em> from <em>“historically bad, now fixed”</em>.
        </div>
        <div style={{ opacity: 0.85 }}>
            <strong>Dormant</strong> = no traffic in the window (clean because quiet, not
            necessarily remediated). Both <strong>threat</strong> and <strong>exposure</strong> show
            their current windowed value when the endpoint has recent traffic, and fall back to the
            lifetime max when it's dormant.
        </div>
    </div>
);

// Big score readout — number + axis tag, coloured by band.
const ScoreReadout: React.FC<{
    value: number;
    color: string;
    axis: 'T' | 'E';
    muted?: boolean;
}> = ({ value, color, axis, muted }) => (
    <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 4, opacity: muted ? 0.6 : 1 }}>
        <span style={{ fontSize: 30, fontWeight: 700, lineHeight: 1, color }}>{value}</span>
        <Text type="secondary" style={{ fontSize: 11 }}>{axis}</Text>
    </span>
);

const Stat: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
        <Text type="secondary" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.6 }}>
            {label}
        </Text>
        <div style={{ fontSize: 13 }}>{children}</div>
    </div>
);

interface Props {
    doc: InventoryDoc;
    posture?: CurrentPostureResponse;
    loading?: boolean;
}

// "Current posture" panel for the endpoint detail Overview — renders the three
// states of GET /inventory/:id/current-posture (active · dormant · unavailable)
// next to the doc's monotonic "_ever" scores.
const CurrentPostureCard: React.FC<Props> = ({ doc, posture, loading }) => {
    const everThreat = doc.max_risk_score ?? 0;
    const everExposure = doc.max_posture_score ?? 0;

    const available = posture?.current_available === true;
    const dormant = available && posture?.dormant === true;
    const cur = available && !dormant ? posture?.current ?? null : null;
    const windowDays = posture?.window_days ?? posture?.current?.window_days ?? 7;

    const curThreat = cur?.max_risk_score ?? 0;
    const improved = !!cur && curThreat < everThreat;

    // Current EXPOSURE — rendered when posture_current_available is true (the
    // collector now ships posture_score to the time-series store) AND the window
    // has traffic. Falls back to the lifetime max when the endpoint is dormant.
    const postureCurrentAvailable = posture?.posture_current_available === true;
    const curExposure = cur?.max_posture_score;
    const showCurExposure = postureCurrentAvailable && !!cur && typeof curExposure === 'number';
    const exposureImproved = showCurExposure && (curExposure as number) < everExposure;

    // Header banner — one line summarising which of the three states we're in.
    let banner: React.ReactNode;
    if (loading) {
        banner = null;
    } else if (!available) {
        banner = (
            <Space size={6}>
                <DisconnectOutlined style={{ color: 'var(--text-tertiary)' }} />
                <Text type="secondary" style={{ fontSize: 12 }}>
                    Current window unavailable (ClickHouse offline) — showing lifetime max only.
                </Text>
            </Space>
        );
    } else if (dormant) {
        banner = (
            <Space size={6}>
                <MoonOutlined style={{ color: '#8c8c8c' }} />
                <Text style={{ fontSize: 12 }}>
                    Dormant — no traffic in the last {windowDays}d.
                </Text>
                {doc.last_seen && (
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        Last seen {formatDistanceToNow(new Date(doc.last_seen), { addSuffix: true })}.
                    </Text>
                )}
            </Space>
        );
    } else if (improved && curThreat === 0) {
        banner = (
            <Space size={6}>
                <CheckCircleOutlined style={{ color: 'var(--color-success)' }} />
                <Text style={{ fontSize: 12, color: 'var(--color-success)' }}>
                    No active threat in the last {windowDays}d — looks remediated (was {everThreat}).
                </Text>
            </Space>
        );
    } else if (improved) {
        banner = (
            <Space size={6}>
                <ArrowDownOutlined style={{ color: 'var(--color-success)' }} />
                <Text style={{ fontSize: 12 }}>
                    Improved — current threat {curThreat} is below the lifetime max {everThreat}.
                </Text>
            </Space>
        );
    } else {
        banner = (
            <Space size={6}>
                <ThunderboltOutlined style={{ color: threatColor(curThreat) }} />
                <Text style={{ fontSize: 12 }}>
                    Active in the last {windowDays}d — current threat at the lifetime max.
                </Text>
            </Space>
        );
    }

    return (
        <Card
            size="small"
            title={<InfoLabel info={POSTURE_INFO}>Current posture</InfoLabel>}
            style={{ borderRadius: 8, marginBottom: 16 }}
            extra={
                <Text type="secondary" style={{ fontSize: 11 }}>
                    {available ? `last ${windowDays}d vs lifetime` : 'lifetime max'}
                </Text>
            }
        >
            {loading ? (
                <div style={{ textAlign: 'center', padding: 20 }}>
                    <Spin size="small" />
                </div>
            ) : (
                <Space direction="vertical" size={12} style={{ width: '100%' }}>
                    {banner}

                    {/* Score row — Threat (current|ever) + Exposure (ever). */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'flex-end' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <Text type="secondary" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.6 }}>
                                Threat {cur ? `· current (${windowDays}d)` : '· lifetime'}
                            </Text>
                            <Space size={14} align="baseline">
                                {cur ? (
                                    <Tooltip title={`Highest threat sum seen in the last ${windowDays}d (sampling-safe rollup max).`}>
                                        <span><ScoreReadout value={curThreat} color={threatColor(curThreat)} axis="T" /></span>
                                    </Tooltip>
                                ) : (
                                    <Tooltip title="Lifetime maximum threat score (monotonic — never lowers).">
                                        <span><ScoreReadout value={everThreat} color={threatColor(everThreat)} axis="T" muted={dormant} /></span>
                                    </Tooltip>
                                )}
                                {cur && (
                                    <Tooltip title="Lifetime maximum — for comparison.">
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            ever {everThreat}
                                            {improved && (
                                                <ArrowDownOutlined style={{ color: 'var(--color-success)', marginLeft: 4 }} />
                                            )}
                                        </Text>
                                    </Tooltip>
                                )}
                            </Space>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <Text type="secondary" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.6 }}>
                                {showCurExposure ? (
                                    `Exposure · current (${windowDays}d)`
                                ) : (
                                    <InfoLabel info="No traffic in the current window — showing the lifetime max (config-hygiene exposure). Current exposure appears again once the endpoint sees traffic.">
                                        Exposure · lifetime
                                    </InfoLabel>
                                )}
                            </Text>
                            {showCurExposure ? (
                                <Space size={14} align="baseline">
                                    <ScoreReadout value={curExposure as number} color={postureColor(curExposure as number)} axis="E" />
                                    <Tooltip title="Lifetime maximum — for comparison.">
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            ever {everExposure}
                                            {exposureImproved && (
                                                <ArrowDownOutlined style={{ color: 'var(--color-success)', marginLeft: 4 }} />
                                            )}
                                        </Text>
                                    </Tooltip>
                                </Space>
                            ) : (
                                <ScoreReadout value={everExposure} color={postureColor(everExposure)} axis="E" />
                            )}
                        </div>
                    </div>

                    {/* Active-only detail strip. */}
                    {cur && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28, paddingTop: 8, borderTop: '1px solid var(--border-default)' }}>
                            <Stat label="Requests (window)">
                                <Text style={{ fontVariantNumeric: 'tabular-nums' }}>
                                    {(cur.event_count ?? 0).toLocaleString()}
                                </Text>
                            </Stat>
                            <Stat label="Last active">
                                {cur.last_active ? (
                                    <Tooltip title={new Date(cur.last_active).toLocaleString()}>
                                        <Text>{formatDistanceToNow(new Date(cur.last_active), { addSuffix: true })}</Text>
                                    </Tooltip>
                                ) : (
                                    <Text type="secondary">—</Text>
                                )}
                            </Stat>
                            <Stat label="Auth (window)">
                                {cur.noauth_observed ? (
                                    <Tag color={cur.auth_observed ? 'warning' : 'error'} className="auto-width-tag" style={{ margin: 0 }}>
                                        {cur.auth_observed ? 'Mixed' : 'Unauthenticated'}
                                    </Tag>
                                ) : cur.auth_observed ? (
                                    <Tag color="success" className="auto-width-tag" style={{ margin: 0 }}>Authenticated</Tag>
                                ) : (
                                    <Text type="secondary">—</Text>
                                )}
                            </Stat>
                            {cur.risk_flags?.length > 0 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
                                    <Text type="secondary" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.6 }}>
                                        <InfoLabel info="Risk flags STILL appearing in the current window (not just historically).">
                                            Still active
                                        </InfoLabel>
                                    </Text>
                                    <RiskFlagChips flags={cur.risk_flags} max={6} size="sm" />
                                </div>
                            )}
                        </div>
                    )}
                </Space>
            )}
        </Card>
    );
};

export default CurrentPostureCard;
