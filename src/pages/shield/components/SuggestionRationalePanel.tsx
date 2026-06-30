/**
 * Shows WHY a policy was suggested from API-Discovery findings: per route, the
 * matched risk flags, the engines that mitigate them (with a one-line reason),
 * and any posture findings that need Envoy-level (not shield) handling. Rendered
 * above the Builder when a draft arrives from the discovery "Suggest policy" flow.
 */

import React from 'react';
import { Alert, Collapse, Space, Tag, Typography } from 'antd';
import { BulbOutlined, InfoCircleOutlined } from '@ant-design/icons';
import type { SuggestRationale } from '../utils/suggestPolicy';

const { Text } = Typography;

const modeColor = (m: string) => (m === 'block' ? 'error' : m === 'detect' ? 'warning' : 'default');

const SuggestionRationalePanel: React.FC<{
    rationale: SuggestRationale[];
    onDismiss?: () => void;
}> = ({ rationale, onDismiss }) => {
    if (!rationale?.length) return null;

    return (
        <Alert
            type="info"
            showIcon
            icon={<BulbOutlined />}
            closable={!!onDismiss}
            onClose={onDismiss}
            style={{ marginBottom: 12, borderRadius: 10 }}
            message={<Text strong>Suggested from API Discovery — review the engines below, then edit & save</Text>}
            description={
                <Collapse
                    ghost
                    size="small"
                    defaultActiveKey={rationale.length === 1 ? ['0'] : []}
                    items={rationale.map((r, i) => ({
                        key: String(i),
                        label: (
                            <Space size={6} wrap>
                                <Text code>{(r.methods?.join(', ') || 'ANY')}</Text>
                                <Text strong>{r.host}{r.path}</Text>
                                <Tag className="auto-width-tag" color={modeColor(r.mode)}>{r.mode}</Tag>
                                <Text type="secondary" style={{ fontSize: 12 }}>{r.engines?.length || 0} engine(s)</Text>
                            </Space>
                        ),
                        children: (
                            <div style={{ fontSize: 12.5 }}>
                                {r.matched_flags?.length > 0 && (
                                    <div style={{ marginBottom: 8, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 4 }}>
                                        <Text type="secondary" style={{ fontSize: 12 }}>Findings:</Text>
                                        {r.matched_flags.map(f => (
                                            <Tag key={f} className="auto-width-tag" style={{ fontSize: 11, margin: 0 }}>{f}</Tag>
                                        ))}
                                    </div>
                                )}
                                {r.engines?.map(e => (
                                    <div key={e.key} style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 5 }}>
                                        <Tag className="auto-width-tag" color="blue" style={{ margin: 0, flex: 'none' }}>{e.key}</Tag>
                                        <Text type="secondary" style={{ fontSize: 12 }}>{e.why}</Text>
                                    </div>
                                ))}
                                {r.notes?.map((n, j) => (
                                    <div key={j} style={{ marginTop: 4, color: 'var(--text-tertiary)', fontSize: 12 }}>
                                        <InfoCircleOutlined /> {n}
                                    </div>
                                ))}
                            </div>
                        ),
                    }))}
                />
            }
        />
    );
};

export default SuggestionRationalePanel;
