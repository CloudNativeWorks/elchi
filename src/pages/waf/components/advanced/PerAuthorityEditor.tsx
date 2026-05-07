import React, { useState } from 'react';
import { App, Badge, Button, Input, Select, Space, Tag, Typography } from 'antd';
import { CheckOutlined, PlusOutlined } from '@ant-design/icons';
import { useWafEditor } from '../../state/wafEditorStore';

const { Text } = Typography;

const PerAuthorityEditor: React.FC = () => {
    const { state, dispatch } = useWafEditor();
    const { perAuthorityDirectives, sets } = state.editor;
    const { message } = App.useApp();

    const [domain, setDomain] = useState('');
    const [setName, setSetName] = useState<string | undefined>(undefined);

    const add = () => {
        if (!domain.trim() || !setName) return;
        dispatch({
            type: 'SET_PER_AUTHORITY',
            map: { ...perAuthorityDirectives, [domain.trim()]: setName },
        });
        setDomain('');
        setSetName(undefined);
        message.success({
            content: 'Per-authority override added',
            icon: <CheckOutlined style={{ color: 'var(--color-success)' }} />,
        });
    };

    const remove = (d: string) => {
        const next = { ...perAuthorityDirectives };
        delete next[d];
        dispatch({ type: 'SET_PER_AUTHORITY', map: next });
    };

    return (
        <div>
            <Space style={{ marginBottom: 8 }}>
                <Text strong>Per-authority overrides</Text>
                <Badge
                    count={Object.keys(perAuthorityDirectives).length}
                    style={{ backgroundColor: 'var(--color-purple)' }}
                />
            </Space>
            <div style={{ marginBottom: 8, color: 'var(--text-secondary)', fontSize: 12 }}>
                Map a domain (HTTP authority) to a different directive set. Useful for multi-tenant deployments.
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8, minHeight: 32 }}>
                {Object.entries(perAuthorityDirectives).length === 0 ? (
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        No overrides — every request uses the default set.
                    </Text>
                ) : (
                    Object.entries(perAuthorityDirectives).map(([d, ref]) => (
                        <Tag key={d} closable color="purple" onClose={() => remove(d)} style={{ padding: '4px 8px' }}>
                            <code style={{ fontSize: 12 }}>{d}</code> → <strong style={{ fontSize: 12 }}>{ref}</strong>
                        </Tag>
                    ))
                )}
            </div>

            <Space.Compact style={{ width: '100%' }}>
                <Input
                    placeholder="Domain (e.g. api.example.com)"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                />
                <Select
                    placeholder="Directive set"
                    value={setName}
                    onChange={setSetName}
                    options={sets.map((s) => ({ label: s.name, value: s.name }))}
                    style={{ minWidth: 160 }}
                />
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={add}
                    disabled={!domain.trim() || !setName}
                >
                    Add
                </Button>
            </Space.Compact>
        </div>
    );
};

export default PerAuthorityEditor;
