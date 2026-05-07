import React, { useState } from 'react';
import { App, Badge, Button, Input, Space, Tag, Typography } from 'antd';
import { CheckOutlined, PlusOutlined } from '@ant-design/icons';
import { useWafEditor } from '../../state/wafEditorStore';

const { Text } = Typography;

const MetricLabelsEditor: React.FC = () => {
    const { state, dispatch } = useWafEditor();
    const { metricLabels } = state.editor;
    const { message } = App.useApp();

    const [k, setK] = useState('');
    const [v, setV] = useState('');

    const add = () => {
        if (!k.trim() || !v.trim()) return;
        dispatch({
            type: 'SET_METRIC_LABELS',
            labels: { ...metricLabels, [k.trim()]: v.trim() },
        });
        setK('');
        setV('');
        message.success({
            content: 'Metric label added',
            icon: <CheckOutlined style={{ color: 'var(--color-success)' }} />,
        });
    };

    const remove = (key: string) => {
        const next = { ...metricLabels };
        delete next[key];
        dispatch({ type: 'SET_METRIC_LABELS', labels: next });
    };

    return (
        <div>
            <Space style={{ marginBottom: 8 }}>
                <Text strong>Metric Labels</Text>
                <Badge count={Object.keys(metricLabels).length} style={{ backgroundColor: 'var(--color-success)' }} />
            </Space>
            <div style={{ marginBottom: 8, color: 'var(--text-secondary)', fontSize: 12 }}>
                Custom labels attached to WAF metrics for monitoring/observability.
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8, minHeight: 32 }}>
                {Object.entries(metricLabels).length === 0 ? (
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        No labels yet.
                    </Text>
                ) : (
                    Object.entries(metricLabels).map(([key, value]) => (
                        <Tag key={key} closable onClose={() => remove(key)} style={{ padding: '4px 8px' }}>
                            <code style={{ fontSize: 12 }}>{key}</code>={' '}
                            <strong style={{ fontSize: 12 }}>{value}</strong>
                        </Tag>
                    ))
                )}
            </div>

            <Space.Compact style={{ width: '100%' }}>
                <Input placeholder="Key" value={k} onChange={(e) => setK(e.target.value)} />
                <Input placeholder="Value" value={v} onChange={(e) => setV(e.target.value)} onPressEnter={add} />
                <Button type="primary" icon={<PlusOutlined />} onClick={add} disabled={!k.trim() || !v.trim()}>
                    Add
                </Button>
            </Space.Compact>
        </div>
    );
};

export default MetricLabelsEditor;
