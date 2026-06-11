/**
 * WAF Studio — a full-screen, NetScaler-style rule builder for the Coraza WAF
 * engine. Opened from the Coraza card in the Shield policy builder, it lets a
 * user tune the OWASP CRS with explained controls, browse/copy CRS rules from
 * the shared library, and assemble custom SecLang rules as a sortable,
 * lint-checked, syntax-highlighted list — never hand-typing into a blob.
 *
 * It edits a working copy of the engine's `CorazaSpec` and commits on Apply.
 * Custom rules round-trip through `directivesCodec` to/from `spec.directives`.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Button, Drawer, Space, Tag, Typography } from 'antd';
import { CheckOutlined, SafetyCertificateOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { CorazaSpec } from '../../../state/model';
import {
    CrsLibraryPane,
    Directive,
    VisualRuleBuilder,
} from '@/components/waf-studio';
import CrsTuningSection from './CrsTuningSection';
import CustomRulesSection from './CustomRulesSection';
import GeneratedPreview from './GeneratedPreview';
import { joinDirectives, parseDirectives } from './directivesCodec';

const { Text, Title } = Typography;

interface WafStudioDrawerProps {
    open: boolean;
    value: CorazaSpec;
    onApply: (next: CorazaSpec) => void;
    onClose: () => void;
    disabled?: boolean;
}

const Panel: React.FC<{ title: React.ReactNode; children: React.ReactNode; style?: React.CSSProperties }> = ({
    title,
    children,
    style,
}) => (
    <div
        style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-default)',
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            ...style,
        }}
    >
        <div style={{ marginBottom: 12 }}>{title}</div>
        {children}
    </div>
);

const WafStudioDrawer: React.FC<WafStudioDrawerProps> = ({ open, value, onApply, onClose, disabled }) => {
    const [draft, setDraft] = useState<CorazaSpec>(value);
    const [rules, setRules] = useState<Directive[]>([]);
    const [templateOpen, setTemplateOpen] = useState(false);
    const wasOpen = useRef(false);

    // Re-seed the working copy on the open transition only — not on every parent
    // re-render (which would clobber in-progress edits).
    useEffect(() => {
        if (open && !wasOpen.current) {
            setDraft(value);
            setRules(parseDirectives(value.directives));
        }
        wasOpen.current = open;
    }, [open, value]);

    const patch = (p: Partial<CorazaSpec>) => setDraft((d) => ({ ...d, ...p }));

    const addRules = (texts: string[]) => {
        setRules((prev) => {
            const existing = new Set(prev.map((r) => r.text));
            const fresh = texts
                .filter((t) => t.trim() && !existing.has(t))
                .map((text, i) => ({ id: `d_${Date.now().toString(36)}_${prev.length + i}`, text }));
            return [...prev, ...fresh];
        });
    };

    const specForPreview: CorazaSpec = { ...draft, directives: joinDirectives(rules) };

    // Rule ids already in the custom list, so the visual builder suggests a free
    // one and warns on a clash.
    const existingIds = rules
        .map((r) => r.text.match(/\bid\s*:\s*['"]?(\d+)/i)?.[1])
        .filter((s): s is string => !!s)
        .map(Number);

    const apply = () => {
        onApply({ ...draft, directives: joinDirectives(rules) });
        onClose();
    };

    const ruleCount = rules.filter((r) => !r.text.trim().startsWith('#')).length;

    return (
        <Drawer
            open={open}
            onClose={onClose}
            width="100%"
            destroyOnHidden
            title={
                <Space size={10} align="center">
                    <SafetyCertificateOutlined style={{ color: 'var(--color-primary)', fontSize: 20 }} />
                    <Title level={5} style={{ margin: 0 }}>WAF Studio</Title>
                    <Tag color={draft.include_owasp ? 'green' : 'default'}>
                        {draft.include_owasp ? 'OWASP CRS on' : 'CRS off'}
                    </Tag>
                    <Tag>{ruleCount} custom rule{ruleCount === 1 ? '' : 's'}</Tag>
                </Space>
            }
            extra={
                <Space>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="primary" icon={<CheckOutlined />} onClick={apply} disabled={disabled}>
                        Apply
                    </Button>
                </Space>
            }
            styles={{ body: { padding: 0, background: 'var(--bg-secondary, transparent)' } }}
        >
            <div style={{ display: 'flex', height: '100%', minHeight: 0 }}>
                {/* Left: tuning + custom rules + preview */}
                <div style={{ flex: '1 1 60%', minWidth: 0, overflow: 'auto', padding: 20 }}>
                    <Panel
                        title={
                            <Space>
                                <SafetyCertificateOutlined style={{ color: 'var(--color-primary)' }} />
                                <Text strong style={{ fontSize: 15 }}>Core Rule Set</Text>
                            </Space>
                        }
                    >
                        <CrsTuningSection value={draft} onChange={patch} disabled={disabled} />
                    </Panel>

                    <Panel
                        title={
                            <Space>
                                <ThunderboltOutlined style={{ color: 'var(--color-primary)' }} />
                                <Text strong style={{ fontSize: 15 }}>Custom Rules</Text>
                            </Space>
                        }
                    >
                        <CustomRulesSection
                            rules={rules}
                            onChange={setRules}
                            onOpenTemplate={() => setTemplateOpen(true)}
                            disabled={disabled}
                        />
                        <div style={{ marginTop: 12 }}>
                            <GeneratedPreview spec={specForPreview} />
                        </div>
                    </Panel>
                </div>

                {/* Right: CRS rule library (copy rules into the custom list) */}
                <div
                    style={{
                        flex: '1 1 40%',
                        minWidth: 360,
                        maxWidth: 560,
                        borderLeft: '1px solid var(--border-default)',
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: 0,
                        background: 'var(--card-bg)',
                    }}
                >
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-default)' }}>
                        <Text strong style={{ fontSize: 14 }}>CRS Rule Library</Text>
                        <div>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                Browse the Core Rule Set and copy a rule into your custom rules as a starting point.
                            </Text>
                        </div>
                    </div>
                    <div style={{ flex: 1, minHeight: 0 }}>
                        <CrsLibraryPane
                            activeTarget={{ id: 'custom', name: 'Custom Rules', existingTexts: rules.map((r) => r.text) }}
                            onAdd={(texts) => addRules(texts)}
                        />
                    </div>
                </div>
            </div>

            <VisualRuleBuilder
                open={templateOpen}
                existingIds={existingIds}
                onClose={() => setTemplateOpen(false)}
                onAdd={(directive) => {
                    addRules([directive]);
                    setTemplateOpen(false);
                }}
            />
        </Drawer>
    );
};

export default WafStudioDrawer;
