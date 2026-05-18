import React from 'react';
import { App, Card, Typography, Tag, Space, Empty, Table, Button, Divider } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    AlertOutlined,
    BulbOutlined,
    ToolOutlined,
    SearchOutlined,
    ExportOutlined,
    LeftOutlined,
    RightOutlined,
    CopyOutlined,
} from '@ant-design/icons';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import ComponentLoadErrorBoundary from '@/components/ComponentLoadErrorBoundary';
import { useApiInventory } from '@/hooks/useApiDiscovery';
import BackButton from './components/BackButton';
import EndpointPath from './components/EndpointPath';
import { methodColor } from './lib/methodColor';
import {
    RISK_FLAG_CATALOG,
    SEVERITY_SCORE,
    SEVERITY_TAG_COLOR,
    riskFlagLabel,
    riskClassMeta,
    type RiskFlagMeta,
} from './lib/riskFlagCatalog';
import {
    RISK_REMEDIATION_GUIDE,
    MITIGATION_TYPE_META,
    type RemediationStep,
    type RiskRemediation,
} from './lib/riskRemediationGuide';
import type { InventoryDoc } from './types';

// Build a Markdown remediation report for sharing in Slack / Jira / docs.
const buildReport = (flagId: string, meta: RiskFlagMeta, guide: RiskRemediation): string => {
    const bits = [
        `\`${flagId}\``,
        `${meta.severity} severity (+${SEVERITY_SCORE[meta.severity]} risk score)`,
        riskClassMeta(meta.class).label,
    ];
    if (guide.owaspRef) bits.push(guide.owaspRef);
    const lines = [
        `# ${riskFlagLabel(flagId)}`,
        '',
        bits.join(' · '),
        '',
        '## What it is',
        guide.whatItIs,
        '',
        '## Why it matters',
        guide.whyItMatters,
        '',
        "## How it's detected",
        guide.howDetected,
        '',
        `## How to close it — ${MITIGATION_TYPE_META[guide.mitigationType].label}`,
    ];
    guide.steps.forEach((s, i) => {
        lines.push(`${i + 1}. ${s.text}${s.envoyFilter ? ` _(Envoy filter: ${s.envoyFilter})_` : ''}`);
    });
    return lines.join('\n');
};

const { Text, Title, Paragraph } = Typography;

// Section card — consistent header (icon + title) across the page.
const Section: React.FC<{
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
}> = ({ icon, title, children }) => (
    <Card
        size="small"
        style={{ marginBottom: 12, borderRadius: 10 }}
        title={
            <Space size={8}>
                <span style={{ color: '#fff' }}>{icon}</span>
                <Text style={{ fontSize: 13.5, fontWeight: 600, color: '#fff' }}>{title}</Text>
            </Space>
        }
    >
        {children}
    </Card>
);

const StepRow: React.FC<{ index: number; step: RemediationStep }> = ({ index, step }) => {
    const navigate = useNavigate();
    const { link } = step;
    return (
        <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
            <span
                style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: 'var(--color-primary-light)',
                    color: 'var(--color-primary)',
                    fontSize: 12,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                }}
            >
                {index}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
                <Text style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6 }}>
                    {step.text}
                </Text>
                <div style={{ marginTop: 6, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {step.envoyFilter && (
                        <Tag
                            className="auto-width-tag"
                            style={{
                                margin: 0,
                                fontSize: 11,
                                color: 'var(--color-primary)',
                                borderColor: 'var(--color-primary)',
                                background: 'var(--color-primary-light)',
                            }}
                        >
                            Envoy filter · {step.envoyFilter}
                        </Tag>
                    )}
                    {link && (
                        <Button
                            size="small"
                            icon={<ExportOutlined />}
                            onClick={() => navigate(link.to)}
                        >
                            {link.label}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

const AFFECTED_LIMIT = 50;

const AffectedEndpoints: React.FC<{ flagId: string }> = ({ flagId }) => {
    const { data, isLoading, error } = useApiInventory({
        risk_flag: [flagId],
        sort_by: 'max_risk_score',
        sort_order: 'desc',
        limit: AFFECTED_LIMIT,
    });
    const rows = data?.data ?? [];
    const total = data?.total_count ?? 0;

    const columns: ColumnsType<InventoryDoc> = [
        {
            title: 'Method',
            dataIndex: 'method',
            key: 'method',
            width: 90,
            render: (m: string) =>
                m ? (
                    <Tag className="auto-width-tag" color={methodColor(m)} style={{ margin: 0, fontSize: 11 }}>
                        {m}
                    </Tag>
                ) : (
                    <Text type="secondary">—</Text>
                ),
        },
        {
            title: 'Path',
            dataIndex: 'normalized_path',
            key: 'normalized_path',
            render: (p: string, r) => (
                <Link to={`/api-discovery/${encodeURIComponent(r.listener_name)}/endpoints/${r._id}`}>
                    <EndpointPath path={p || '—'} />
                </Link>
            ),
        },
        {
            title: 'Host',
            dataIndex: 'host',
            key: 'host',
            width: 160,
            render: (h: string) => <Text style={{ fontSize: 12 }}>{h || '—'}</Text>,
        },
        {
            title: 'Listener',
            dataIndex: 'listener_name',
            key: 'listener_name',
            width: 160,
            render: (n: string) => (
                <Link to={`/api-discovery/${encodeURIComponent(n)}`} style={{ fontSize: 12 }}>
                    {n}
                </Link>
            ),
        },
        {
            title: 'Last seen',
            dataIndex: 'last_seen',
            key: 'last_seen',
            width: 130,
            render: (t: string) =>
                t ? (
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        {formatDistanceToNow(new Date(t), { addSuffix: true })}
                    </Text>
                ) : (
                    <Text type="secondary">—</Text>
                ),
        },
    ];

    return (
        <>
            {!error && total > 0 && (
                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>
                    {total.toLocaleString()} endpoint{total === 1 ? '' : 's'} carry this flag
                    {total > AFFECTED_LIMIT && ` — showing the top ${AFFECTED_LIMIT} by risk score`}.
                </Text>
            )}
            <Table<InventoryDoc>
                className="api-discovery-table"
                rowKey="_id"
                columns={columns}
                dataSource={rows}
                loading={isLoading}
                size="small"
                pagination={false}
                scroll={{ x: 'max-content', y: 360 }}
                locale={{
                    emptyText: (
                        <div style={{ padding: '32px 0' }}>
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description={
                                    <Text type="secondary">
                                        {error
                                            ? 'Could not load affected endpoints — try refreshing.'
                                            : 'No endpoints currently carry this flag — clean.'}
                                    </Text>
                                }
                            />
                        </div>
                    ),
                }}
            />
        </>
    );
};

const ApiDiscoveryRiskDetail: React.FC = () => {
    const navigate = useNavigate();
    const { message } = App.useApp();
    const { flagId = '' } = useParams<{ flagId: string }>();

    const meta = RISK_FLAG_CATALOG[flagId];
    const guide = RISK_REMEDIATION_GUIDE[flagId];

    // Unknown / unrecognised flag — friendly dead-end, never a crash.
    if (!meta || !guide) {
        return (
            <ComponentLoadErrorBoundary componentName="Risk Detail">
                <div style={{ padding: 0 }}>
                    <div style={{ marginBottom: 16 }}>
                        <BackButton onClick={() => navigate('/api-discovery/risks')} label="Risk Guide" />
                    </div>
                    <Card size="small" style={{ borderRadius: 10 }}>
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                <Text type="secondary">
                                    Unrecognised risk flag “{flagId}”. It may come from a newer
                                    collector build than this UI knows about.
                                </Text>
                            }
                        />
                    </Card>
                </div>
            </ComponentLoadErrorBoundary>
        );
    }

    const cls = riskClassMeta(meta.class);
    const mit = MITIGATION_TYPE_META[guide.mitigationType];

    // Prev / next within the catalog order (critical → low, as declared).
    const flagOrder = Object.keys(RISK_FLAG_CATALOG);
    const idx = flagOrder.indexOf(flagId);
    const prevFlag = idx > 0 ? flagOrder[idx - 1] : undefined;
    const nextFlag = idx >= 0 && idx < flagOrder.length - 1 ? flagOrder[idx + 1] : undefined;

    return (
        <ComponentLoadErrorBoundary componentName="Risk Detail">
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                        <BackButton onClick={() => navigate('/api-discovery/risks')} label="Risk Guide" />
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
                            <AlertOutlined />
                        </div>
                        <div style={{ flex: 1, minWidth: 240 }}>
                            <Title level={3} style={{ margin: 0, lineHeight: 1.2 }}>
                                {riskFlagLabel(flagId)}
                            </Title>
                            <Text
                                type="secondary"
                                style={{ fontSize: 11, fontFamily: 'Monaco, Menlo, monospace' }}
                            >
                                {flagId}
                            </Text>
                        </div>
                        <Button
                            icon={<CopyOutlined />}
                            onClick={() => {
                                navigator.clipboard
                                    .writeText(buildReport(flagId, meta, guide))
                                    .then(() =>
                                        message.success('Remediation report copied to clipboard'),
                                    )
                                    .catch(() => message.error('Could not copy to clipboard'));
                            }}
                        >
                            Copy report
                        </Button>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            gap: 8,
                            flexWrap: 'wrap',
                            marginTop: 14,
                            paddingTop: 14,
                            borderTop: '1px solid var(--border-default)',
                        }}
                    >
                        <Tag color={SEVERITY_TAG_COLOR[meta.severity]} style={{ margin: 0 }}>
                            {meta.severity.toUpperCase()} · +{SEVERITY_SCORE[meta.severity]} risk score
                        </Tag>
                        <Tag
                            className="auto-width-tag"
                            style={{
                                margin: 0,
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
                                color: mit.color,
                                borderColor: `${mit.color}55`,
                                background: `${mit.color}14`,
                            }}
                        >
                            {mit.label}
                        </Tag>
                        {guide.owaspRef && (
                            <Tag className="auto-width-tag" style={{ margin: 0 }} color="geekblue">
                                {guide.owaspRef}
                            </Tag>
                        )}
                    </div>
                </div>

                {/* What it is */}
                <Section icon={<BulbOutlined />} title="What it is">
                    <Paragraph style={{ fontSize: 13, lineHeight: 1.7, marginBottom: 0 }}>
                        {guide.whatItIs}
                    </Paragraph>
                </Section>

                {/* Why it matters */}
                <Section icon={<AlertOutlined />} title="Why it matters">
                    <Paragraph style={{ fontSize: 13, lineHeight: 1.7, marginBottom: 0 }}>
                        {guide.whyItMatters}
                    </Paragraph>
                </Section>

                {/* How it's detected */}
                <Section icon={<SearchOutlined />} title="How it's detected">
                    <Paragraph style={{ fontSize: 13, lineHeight: 1.7, marginBottom: 0 }}>
                        {guide.howDetected}
                    </Paragraph>
                </Section>

                {/* How to close it */}
                <Section icon={<ToolOutlined />} title="How to close it">
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            marginBottom: 14,
                            padding: '8px 12px',
                            borderRadius: 8,
                            background: `${mit.color}10`,
                            border: `1px solid ${mit.color}40`,
                        }}
                    >
                        <Tag
                            className="auto-width-tag"
                            style={{
                                margin: 0,
                                color: mit.color,
                                borderColor: `${mit.color}55`,
                                background: `${mit.color}1f`,
                            }}
                        >
                            {mit.label}
                        </Tag>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            {mit.description}
                        </Text>
                    </div>
                    {guide.steps.map((step, i) => (
                        <StepRow key={i} index={i + 1} step={step} />
                    ))}
                </Section>

                {/* Currently affected endpoints */}
                <Section icon={<AlertOutlined />} title="Currently affected endpoints">
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        Endpoints in this project that currently carry the{' '}
                        <Text code style={{ fontSize: 11 }}>
                            {flagId}
                        </Text>{' '}
                        flag. Click a path to drill into its events and analytics.
                    </Text>
                    <Divider style={{ margin: '10px 0' }} />
                    <AffectedEndpoints flagId={flagId} />
                </Section>

                {/* Prev / next flag navigation */}
                <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                    <div style={{ flex: 1 }}>
                        {prevFlag && (
                            <Link to={`/api-discovery/risks/${prevFlag}`}>
                                <Card size="small" hoverable style={{ borderRadius: 10 }}>
                                    <Space size={10}>
                                        <LeftOutlined style={{ color: 'var(--color-primary)' }} />
                                        <div>
                                            <Text
                                                type="secondary"
                                                style={{
                                                    fontSize: 10,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: 1,
                                                    display: 'block',
                                                }}
                                            >
                                                Previous risk
                                            </Text>
                                            <Text style={{ fontSize: 13, fontWeight: 600 }}>
                                                {riskFlagLabel(prevFlag)}
                                            </Text>
                                        </div>
                                    </Space>
                                </Card>
                            </Link>
                        )}
                    </div>
                    <div style={{ flex: 1 }}>
                        {nextFlag && (
                            <Link to={`/api-discovery/risks/${nextFlag}`}>
                                <Card size="small" hoverable style={{ borderRadius: 10 }}>
                                    <Space
                                        size={10}
                                        style={{ width: '100%', justifyContent: 'flex-end' }}
                                    >
                                        <div style={{ textAlign: 'right' }}>
                                            <Text
                                                type="secondary"
                                                style={{
                                                    fontSize: 10,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: 1,
                                                    display: 'block',
                                                }}
                                            >
                                                Next risk
                                            </Text>
                                            <Text style={{ fontSize: 13, fontWeight: 600 }}>
                                                {riskFlagLabel(nextFlag)}
                                            </Text>
                                        </div>
                                        <RightOutlined style={{ color: 'var(--color-primary)' }} />
                                    </Space>
                                </Card>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </ComponentLoadErrorBoundary>
    );
};

export default ApiDiscoveryRiskDetail;
