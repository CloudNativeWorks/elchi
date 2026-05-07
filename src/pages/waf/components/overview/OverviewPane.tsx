import React from 'react';
import { Button, Card, Col, Empty, Row, Statistic, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useWafEditor } from '../../state/wafEditorStore';

const { Title, Text } = Typography;

/**
 * Read-only summary panel — what's in the WAF at a glance.
 * Shown when no set is selected. The user reaches this from the sidebar's
 * "Overview" entry.
 */
const OverviewPane: React.FC = () => {
    const { state, dispatch } = useWafEditor();
    const { sets, defaultSetId, metricLabels, perAuthorityDirectives } = state.editor;
    const totalDirectives = sets.reduce((acc, s) => acc + s.directives.length, 0);
    const defaultSet = sets.find((s) => s.id === defaultSetId);

    if (sets.length === 0) {
        return (
            <div style={{ padding: 48, textAlign: 'center' }}>
                <Empty
                    description={
                        <span>
                            No directive sets yet. <br />
                            Create one to start writing WAF rules.
                        </span>
                    }
                />
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    style={{ marginTop: 16 }}
                    onClick={() => dispatch({ type: 'ADD_SET', name: 'default', markDefault: true })}
                >
                    Create &ldquo;default&rdquo; set
                </Button>
            </div>
        );
    }

    return (
        <div style={{ padding: 24, overflow: 'auto' }}>
            <Title level={4} style={{ marginTop: 0 }}>
                Overview
            </Title>
            <Text type="secondary">
                Read-only summary of this WAF configuration. Use the sidebar to dive into a specific set.
            </Text>

            <Row gutter={16} style={{ marginTop: 24 }}>
                <Col span={6}>
                    <Card>
                        <Statistic title="Directive sets" value={sets.length} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="Total directives" value={totalDirectives} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="Metric labels" value={Object.keys(metricLabels).length} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="Per-authority overrides" value={Object.keys(perAuthorityDirectives).length} />
                    </Card>
                </Col>
            </Row>

            <Card style={{ marginTop: 16 }} title="Default set">
                {defaultSet ? (
                    <div>
                        <Text strong>{defaultSet.name}</Text>
                        <div style={{ color: 'var(--text-secondary)', marginTop: 4 }}>
                            {defaultSet.directives.length} directive{defaultSet.directives.length === 1 ? '' : 's'} ·{' '}
                            applied when no per-authority override matches.
                        </div>
                    </div>
                ) : (
                    <Text type="warning">No default set selected. Pick one in the sidebar before saving.</Text>
                )}
            </Card>
        </div>
    );
};

export default OverviewPane;
