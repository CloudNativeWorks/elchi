import React, { useEffect, useMemo, useState } from 'react';
import { Card, Typography, Tag, Input, Space, Empty, Segmented, Button, Row, Col, Tooltip, Tabs } from 'antd';
import {
    SafetyCertificateOutlined,
    RightOutlined,
    ReloadOutlined,
    ToolOutlined,
    ExportOutlined,
    CheckCircleOutlined,
    AuditOutlined,
    UnorderedListOutlined,
} from '@ant-design/icons';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import ComponentLoadErrorBoundary from '@/components/ComponentLoadErrorBoundary';
import { useApiInventoryRiskSummary } from '@/hooks/useApiDiscovery';
import BackButton from './components/BackButton';
import { formatCompactNumber } from './lib/formatNumber';
import {
    RISK_FLAG_CATALOG,
    SEVERITY_SCORE,
    SEVERITY_TAG_COLOR,
    riskFlagLabel,
    riskClassMeta,
    type RiskSeverity,
} from './lib/riskFlagCatalog';
import {
    RISK_REMEDIATION_GUIDE,
    MITIGATION_TYPE_META,
    buildActionPlan,
    OWASP_API_TOP10,
    flagOwaspId,
    type MitigationType,
} from './lib/riskRemediationGuide';

const { Text, Title, Paragraph } = Typography;

// Severity sections, worst-first. Colours mirror RISK_SCORE_LEGEND.
const SEVERITY_ORDER: RiskSeverity[] = ['critical', 'high', 'medium', 'low'];
const SEVERITY_COLOR: Record<RiskSeverity, string> = {
    critical: '#ef4444',
    high: '#fa541c',
    medium: '#f59e0b',
    low: '#d4a012',
};

interface FlagEntry {
    id: string;
    label: string;
    severity: RiskSeverity;
    className: string;
    description: string;
    mitigationType: MitigationType;
}

// Flatten the catalog into a sortable list once.
const ALL_FLAGS: FlagEntry[] = Object.entries(RISK_FLAG_CATALOG).map(([id, meta]) => ({
    id,
    label: riskFlagLabel(id),
    severity: meta.severity,
    className: meta.class,
    description: meta.description,
    mitigationType: RISK_REMEDIATION_GUIDE[id]?.mitigationType ?? 'observational',
}));

// OWASP category id → flag ids (static, from the catalog).
const OWASP_FLAGS: Record<string, string[]> = (() => {
    const m: Record<string, string[]> = {};
    ALL_FLAGS.forEach((f) => {
        const id = flagOwaspId(f.id);
        if (!id) return;
        (m[id] ??= []).push(f.id);
    });
    return m;
})();

const MITIGATION_FILTERS: { label: string; value: MitigationType | 'all' }[] = [
    { label: 'All fixes', value: 'all' },
    { label: 'Envoy filter', value: 'envoy-http-filter' },
    { label: 'TLS / transport', value: 'envoy-tls' },
    { label: 'App-side', value: 'app-side' },
    { label: 'Informational', value: 'observational' },
];

const SEVERITY_FILTERS: { label: string; value: RiskSeverity | 'all' }[] = [
    { label: 'All', value: 'all' },
    { label: 'Critical', value: 'critical' },
    { label: 'High', value: 'high' },
    { label: 'Medium', value: 'medium' },
    { label: 'Low', value: 'low' },
];

const SEVERITY_SET = new Set(['critical', 'high', 'medium', 'low']);
const MITIGATION_SET = new Set(MITIGATION_FILTERS.map((m) => m.value));
const TAB_SET = new Set(['risks', 'remediation', 'owasp']);

// ── Remediation Action Plan ─────────────────────────────────────────
// Cross-references the live active flags with their canonical fix and
// groups them so one action closes several risks at once.
const ActionPlan: React.FC<{ affectedMap: Record<string, number> }> = ({ affectedMap }) => {
    const navigate = useNavigate();

    const groups = useMemo(() => {
        const active = Object.keys(affectedMap).filter(
            (f) => (affectedMap[f] ?? 0) > 0 && RISK_FLAG_CATALOG[f],
        );
        return buildActionPlan(active)
            .map((g) => {
                const findings = g.flags.reduce((s, f) => s + (affectedMap[f] ?? 0), 0);
                const impact = g.flags.reduce(
                    (s, f) =>
                        s + SEVERITY_SCORE[RISK_FLAG_CATALOG[f].severity] * (affectedMap[f] ?? 0),
                    0,
                );
                return { ...g, findings, impact };
            })
            .sort((a, b) => b.impact - a.impact);
    }, [affectedMap]);

    if (groups.length === 0) {
        return (
            <Card size="small" style={{ marginBottom: 12, borderRadius: 10 }}>
                <Space>
                    <CheckCircleOutlined style={{ color: 'var(--color-success)', fontSize: 18 }} />
                    <Text style={{ fontSize: 13 }}>
                        No active risks in this project — nothing to fix right now.
                    </Text>
                </Space>
            </Card>
        );
    }

    return (
        <Card
            size="small"
            style={{ marginBottom: 12, borderRadius: 10 }}
            title={
                <Space size={8}>
                    <ToolOutlined style={{ color: '#fff' }} />
                    <Text style={{ fontSize: 13.5, fontWeight: 600, color: '#fff' }}>
                        Remediation action plan
                    </Text>
                </Space>
            }
        >
            <Paragraph type="secondary" style={{ fontSize: 12, marginBottom: 12 }}>
                Each action below closes several active risks at once — ordered by impact
                (severity × findings).
            </Paragraph>
            {groups.map((g, i) => {
                const kindMeta = MITIGATION_TYPE_META[g.fix.kind];
                const { link } = g.fix;
                return (
                    <div
                        key={g.fix.key}
                        style={{
                            display: 'flex',
                            gap: 12,
                            padding: '12px 0',
                            borderTop: i === 0 ? 'none' : '1px solid var(--border-default)',
                        }}
                    >
                        <span
                            style={{
                                width: 26,
                                height: 26,
                                borderRadius: '50%',
                                background: 'var(--color-primary-light)',
                                color: 'var(--color-primary)',
                                fontSize: 13,
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                            }}
                        >
                            {i + 1}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <Space size={8} wrap style={{ marginBottom: 6 }}>
                                <Text style={{ fontSize: 13.5, fontWeight: 600 }}>{g.fix.label}</Text>
                                <Tag
                                    className="auto-width-tag"
                                    style={{
                                        margin: 0,
                                        fontSize: 10,
                                        color: kindMeta.color,
                                        borderColor: `${kindMeta.color}55`,
                                        background: `${kindMeta.color}14`,
                                    }}
                                >
                                    {kindMeta.label}
                                </Tag>
                                <Text type="secondary" style={{ fontSize: 11 }}>
                                    closes {g.flags.length} risk{g.flags.length === 1 ? '' : 's'} ·{' '}
                                    {formatCompactNumber(g.findings)} findings
                                </Text>
                            </Space>
                            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                {g.flags.map((f) => (
                                    <Link key={f} to={`/api-discovery/risks/${f}`}>
                                        <Tag
                                            className="auto-width-tag"
                                            color={SEVERITY_TAG_COLOR[RISK_FLAG_CATALOG[f].severity]}
                                            style={{ margin: 0, fontSize: 10, cursor: 'pointer' }}
                                        >
                                            {riskFlagLabel(f)} · {affectedMap[f] ?? 0}
                                        </Tag>
                                    </Link>
                                ))}
                            </div>
                        </div>
                        {link && (
                            <Button
                                size="small"
                                icon={<ExportOutlined />}
                                style={{ flexShrink: 0, alignSelf: 'flex-start' }}
                                onClick={() => navigate(link.to)}
                            >
                                {link.label}
                            </Button>
                        )}
                    </div>
                );
            })}
        </Card>
    );
};

// ── OWASP API Security Top 10 coverage ──────────────────────────────
const OwaspPanel: React.FC<{ affectedMap: Record<string, number> }> = ({ affectedMap }) => (
    <Card
        size="small"
        style={{ marginBottom: 12, borderRadius: 10 }}
        title={
            <Space size={8}>
                <AuditOutlined style={{ color: '#fff' }} />
                <Text style={{ fontSize: 13.5, fontWeight: 600, color: '#fff' }}>
                    OWASP API Security Top 10 (2023)
                </Text>
            </Space>
        }
    >
        <Row gutter={[10, 10]}>
            {OWASP_API_TOP10.map((cat) => {
                const flags = OWASP_FLAGS[cat.id] ?? [];
                const active = flags.filter((f) => (affectedMap[f] ?? 0) > 0);
                const triggered = active.length > 0;
                const accent = triggered ? '#ef4444' : 'var(--color-success)';
                return (
                    <Col key={cat.id} xs={12} sm={8} xl={6}>
                        <Tooltip
                            title={
                                flags.length ? (
                                    <div style={{ fontSize: 11, lineHeight: 1.6 }}>
                                        {flags.map((f) => (
                                            <div key={f}>
                                                {riskFlagLabel(f)}
                                                {(affectedMap[f] ?? 0) > 0
                                                    ? ` — ${affectedMap[f]} active`
                                                    : ''}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    'No mapped risk flags in this build.'
                                )
                            }
                        >
                            <div
                                style={{
                                    border: `1px solid ${triggered ? `${accent}55` : 'var(--border-default)'}`,
                                    background: triggered ? `${accent}0f` : 'var(--bg-elevated)',
                                    borderRadius: 8,
                                    padding: '8px 10px',
                                    height: '100%',
                                }}
                            >
                                <Space size={6} style={{ marginBottom: 2 }}>
                                    <Tag
                                        className="auto-width-tag"
                                        style={{
                                            margin: 0,
                                            fontSize: 10,
                                            fontWeight: 700,
                                            color: accent,
                                            borderColor: `${accent}55`,
                                            background: `${accent}14`,
                                        }}
                                    >
                                        {cat.id}
                                    </Tag>
                                    <Text style={{ fontSize: 11, color: accent, fontWeight: 600 }}>
                                        {triggered ? `${active.length} active` : 'clear'}
                                    </Text>
                                </Space>
                                <div
                                    style={{
                                        fontSize: 11.5,
                                        color: 'var(--text-secondary)',
                                        lineHeight: 1.4,
                                    }}
                                >
                                    {cat.label}
                                </div>
                                <Text type="secondary" style={{ fontSize: 10 }}>
                                    {flags.length} mapped flag{flags.length === 1 ? '' : 's'}
                                </Text>
                            </div>
                        </Tooltip>
                    </Col>
                );
            })}
        </Row>
    </Card>
);

const FlagRow: React.FC<{ flag: FlagEntry; affected: number }> = ({ flag, affected }) => {
    const cls = riskClassMeta(flag.className);
    const mit = MITIGATION_TYPE_META[flag.mitigationType];
    return (
        <Link
            to={`/api-discovery/risks/${flag.id}`}
            style={{ display: 'block', textDecoration: 'none' }}
        >
            <div className="risk-guide-row">
                <span
                    style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: SEVERITY_COLOR[flag.severity],
                        flexShrink: 0,
                    }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                    <Space size={8} wrap style={{ marginBottom: 2 }}>
                        <Text style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>
                            {flag.label}
                        </Text>
                        <Tag
                            className="auto-width-tag"
                            style={{
                                margin: 0,
                                fontSize: 10,
                                color: cls.color,
                                borderColor: `${cls.color}55`,
                                background: `${cls.color}14`,
                            }}
                        >
                            {cls.label}
                        </Tag>
                        <Tag
                            className="auto-width-tag"
                            style={{
                                margin: 0,
                                fontSize: 10,
                                color: mit.color,
                                borderColor: `${mit.color}55`,
                                background: `${mit.color}14`,
                            }}
                        >
                            {mit.label}
                        </Tag>
                    </Space>
                    <Text type="secondary" style={{ fontSize: 12, display: 'block', lineHeight: 1.5 }}>
                        {flag.description}
                    </Text>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, minWidth: 92 }}>
                    <div
                        style={{
                            fontSize: 15,
                            fontWeight: 700,
                            fontVariantNumeric: 'tabular-nums',
                            color: affected > 0 ? SEVERITY_COLOR[flag.severity] : 'var(--text-tertiary)',
                        }}
                    >
                        {formatCompactNumber(affected)}
                    </div>
                    <Text type="secondary" style={{ fontSize: 10 }}>
                        findings
                    </Text>
                </div>
                <RightOutlined style={{ fontSize: 11, color: 'var(--text-tertiary)', flexShrink: 0 }} />
            </div>
        </Link>
    );
};

const ApiDiscoveryRiskGuide: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // Active tab + filters hydrate from the URL so the view is shareable.
    const [activeTab, setActiveTab] = useState<string>(() => {
        const t = searchParams.get('tab');
        return t && TAB_SET.has(t) ? t : 'risks';
    });
    const [search, setSearch] = useState(searchParams.get('q') ?? '');
    const [severity, setSeverity] = useState<RiskSeverity | 'all'>(() => {
        const v = searchParams.get('sev');
        return v && SEVERITY_SET.has(v) ? (v as RiskSeverity) : 'all';
    });
    const [mitigation, setMitigation] = useState<MitigationType | 'all'>(() => {
        const v = searchParams.get('fix');
        return v && MITIGATION_SET.has(v as MitigationType) ? (v as MitigationType) : 'all';
    });

    // Mirror tab + filters back to the URL (replace — no history spam).
    useEffect(() => {
        const next = new URLSearchParams();
        if (activeTab !== 'risks') next.set('tab', activeTab);
        if (search) next.set('q', search);
        if (severity !== 'all') next.set('sev', severity);
        if (mitigation !== 'all') next.set('fix', mitigation);
        setSearchParams(next, { replace: true });
    }, [activeTab, search, severity, mitigation, setSearchParams]);

    const { data, isFetching, refetch } = useApiInventoryRiskSummary({});

    // flag id → current occurrence count, from the live risk summary.
    const affectedMap = useMemo(() => {
        const m: Record<string, number> = {};
        (data?.by_flag ?? []).forEach((r) => {
            m[r.flag] = r.endpoint_count;
        });
        return m;
    }, [data]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return ALL_FLAGS.filter((f) => {
            if (severity !== 'all' && f.severity !== severity) return false;
            if (mitigation !== 'all' && f.mitigationType !== mitigation) return false;
            if (!q) return true;
            return (
                f.label.toLowerCase().includes(q) ||
                f.id.toLowerCase().includes(q) ||
                f.className.toLowerCase().includes(q) ||
                f.description.toLowerCase().includes(q)
            );
        });
    }, [search, severity, mitigation]);

    return (
        <ComponentLoadErrorBoundary componentName="API Risk Guide">
            <style>{`
                .risk-guide-row {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 14px;
                    border-radius: 8px;
                    transition: background 0.15s ease;
                }
                .risk-guide-row:hover {
                    background: var(--bg-hover);
                }
            `}</style>
            <div style={{ padding: 0 }}>
                {/* Hero */}
                <div
                    style={{
                        background:
                            'linear-gradient(135deg, var(--color-primary-light) 0%, transparent 100%)',
                        border: '1px solid var(--border-default)',
                        borderRadius: 12,
                        padding: '20px 24px',
                        marginBottom: 16,
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: 16,
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <BackButton onClick={() => navigate('/api-discovery')} />
                            <div
                                style={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 10,
                                    background: 'var(--color-primary)',
                                    color: '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 22,
                                    boxShadow: '0 4px 12px rgba(10, 127, 218, 0.25)',
                                }}
                            >
                                <SafetyCertificateOutlined />
                            </div>
                            <div>
                                <Title level={3} style={{ margin: 0, lineHeight: 1.2 }}>
                                    API Risk Guide
                                </Title>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    What each risk flag means, why it fires, and how to close it —
                                    with step-by-step Envoy remediation.
                                </Text>
                            </div>
                        </div>
                        <Button
                            icon={<ReloadOutlined spin={isFetching} />}
                            onClick={() => refetch()}
                            loading={isFetching}
                        >
                            Refresh
                        </Button>
                    </div>
                </div>

                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={[
                        {
                            key: 'risks',
                            label: (
                                <Space size={6}>
                                    <UnorderedListOutlined />
                                    Risks
                                </Space>
                            ),
                            children: (
                                <>
                                    {/* Catalog toolbar */}
                                    <Card size="small" style={{ marginBottom: 12, borderRadius: 10 }}>
                                        <Space wrap size={12}>
                                            <Input.Search
                                                allowClear
                                                placeholder="Search risk, class, keyword…"
                                                style={{ width: 260 }}
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                            />
                                            <Segmented
                                                options={SEVERITY_FILTERS}
                                                value={severity}
                                                onChange={(v) => setSeverity(v as RiskSeverity | 'all')}
                                            />
                                            <Segmented
                                                options={MITIGATION_FILTERS}
                                                value={mitigation}
                                                onChange={(v) =>
                                                    setMitigation(v as MitigationType | 'all')
                                                }
                                            />
                                        </Space>
                                    </Card>

                                    {/* Severity sections */}
                                    {filtered.length === 0 ? (
                                        <Card size="small" style={{ borderRadius: 10 }}>
                                            <Empty
                                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                                description={
                                                    <Text type="secondary">
                                                        No risk matches the filters.
                                                    </Text>
                                                }
                                            />
                                        </Card>
                                    ) : (
                                        SEVERITY_ORDER.map((sev) => {
                                            const rows = filtered.filter((f) => f.severity === sev);
                                            if (rows.length === 0) return null;
                                            return (
                                                <Card
                                                    key={sev}
                                                    size="small"
                                                    style={{ marginBottom: 12, borderRadius: 10 }}
                                                    styles={{ body: { padding: 8 } }}
                                                    title={
                                                        <Space size={8}>
                                                            <Tag
                                                                color={SEVERITY_TAG_COLOR[sev]}
                                                                style={{ margin: 0 }}
                                                            >
                                                                {sev.toUpperCase()}
                                                            </Tag>
                                                            <Text
                                                                type="secondary"
                                                                style={{ fontSize: 12, fontWeight: 400 }}
                                                            >
                                                                {SEVERITY_SCORE[sev]} pts each ·{' '}
                                                                {rows.length} risk
                                                                {rows.length === 1 ? '' : 's'}
                                                            </Text>
                                                        </Space>
                                                    }
                                                >
                                                    {rows.map((f) => (
                                                        <FlagRow
                                                            key={f.id}
                                                            flag={f}
                                                            affected={affectedMap[f.id] ?? 0}
                                                        />
                                                    ))}
                                                </Card>
                                            );
                                        })
                                    )}

                                    <Paragraph
                                        type="secondary"
                                        style={{ fontSize: 11, marginTop: 4, textAlign: 'center' }}
                                    >
                                        “Findings” counts are live flag occurrences from the current
                                        project’s risk summary. Click any risk to open its detail page.
                                    </Paragraph>
                                </>
                            ),
                        },
                        {
                            key: 'remediation',
                            label: (
                                <Space size={6}>
                                    <ToolOutlined />
                                    Remediation
                                </Space>
                            ),
                            children: <ActionPlan affectedMap={affectedMap} />,
                        },
                        {
                            key: 'owasp',
                            label: (
                                <Space size={6}>
                                    <AuditOutlined />
                                    OWASP Top 10
                                </Space>
                            ),
                            children: <OwaspPanel affectedMap={affectedMap} />,
                        },
                    ]}
                />
            </div>
        </ComponentLoadErrorBoundary>
    );
};

export default ApiDiscoveryRiskGuide;
