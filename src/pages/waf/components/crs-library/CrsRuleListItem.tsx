import React, { useState } from 'react';
import { Button, Checkbox, Tag, Tooltip, Typography } from 'antd';
import {
    CaretRightOutlined,
    CheckCircleFilled,
    DownOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import { CrsRule } from '../../types';
import { PHASE_LABEL } from './useCrsLibrary';
import { renderHighlightedDirective } from '../../utils/directiveSyntaxHighlight';

const { Text } = Typography;

const SEVERITY_COLOR: Record<string, string> = {
    CRITICAL: 'red',
    ERROR: 'orange',
    WARNING: 'gold',
    NOTICE: 'blue',
};

interface CrsRuleListItemProps {
    rule: CrsRule;
    selected: boolean;
    /** True when this rule's directive text already exists in the active set. */
    added: boolean;
    /** Used in tooltips to clarify which set the rule is already in. */
    activeSetName?: string;
    onToggle: () => void;
    onAddOne: () => void;
}

const decodeRule = (raw: string): string =>
    raw.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\"/g, '"').replace(/&/g, '&');

/**
 * Compact rule row. Shows ID, title, severity/phase/paranoia tags.
 * Click "Show details" to lazily expand the heavy content (rule body, refs, etc.)
 */
const CrsRuleListItem: React.FC<CrsRuleListItemProps> = ({
    rule,
    selected,
    added,
    activeSetName,
    onToggle,
    onAddOne,
}) => {
    const [expanded, setExpanded] = useState(false);
    const c = rule.characteristics;

    const rowBg = added
        ? 'var(--color-success-bg, rgba(34,197,94,0.08))'
        : selected
            ? 'var(--color-primary-bg)'
            : undefined;

    return (
        <div
            style={{
                display: 'flex',
                gap: 8,
                padding: '8px 12px',
                borderBottom: '1px solid var(--border-light)',
                background: rowBg,
                opacity: added ? 0.85 : 1,
            }}
        >
            <div style={{ paddingTop: 4 }}>
                <Checkbox checked={selected} onChange={onToggle} aria-label={`Select rule ${c.id}`} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <Text code style={{ fontSize: 12 }}>
                        {c.id}
                    </Text>
                    <Text strong style={{ fontSize: 13 }}>
                        {rule.title}
                    </Text>
                    {added && (
                        <Tooltip
                            title={`This rule is already in ${activeSetName ?? 'the active set'}`}
                        >
                            <Tag
                                color="success"
                                icon={<CheckCircleFilled />}
                                style={{ margin: 0 }}
                            >
                                Added
                            </Tag>
                        </Tooltip>
                    )}
                    {c.severity && (
                        <Tag color={SEVERITY_COLOR[c.severity]} style={{ margin: 0 }}>
                            {c.severity}
                        </Tag>
                    )}
                    {c.phase != null && (
                        <Tooltip title={PHASE_LABEL(c.phase)}>
                            <Tag style={{ margin: 0 }}>P{c.phase}</Tag>
                        </Tooltip>
                    )}
                    {c.paranoia_level != null && (
                        <Tag color="purple" style={{ margin: 0 }}>
                            PL{c.paranoia_level}
                        </Tag>
                    )}
                    {rule.rule_type && (
                        <Tag color="blue" style={{ margin: 0 }}>
                            {rule.rule_type}
                        </Tag>
                    )}
                </div>

                {rule.description.short && (
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                        {rule.description.short}
                    </div>
                )}

                <button
                    onClick={() => setExpanded((v) => !v)}
                    style={{
                        marginTop: 4,
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-secondary)',
                        fontSize: 11,
                        padding: 0,
                    }}
                >
                    {expanded ? <DownOutlined /> : <CaretRightOutlined />} Details
                </button>

                {expanded && (
                    <div style={{ marginTop: 6, fontSize: 12, lineHeight: 1.5 }}>
                        {rule.description.extended && (
                            <div style={{ marginBottom: 6 }}>
                                <strong>Description:</strong>{' '}
                                <span style={{ whiteSpace: 'pre-wrap' }}>{rule.description.extended}</span>
                            </div>
                        )}
                        {rule.description.rule_logic && (
                            <div style={{ marginBottom: 6 }}>
                                <strong>Logic:</strong>{' '}
                                <span style={{ whiteSpace: 'pre-wrap' }}>{rule.description.rule_logic}</span>
                            </div>
                        )}
                        {rule.description.rule && (
                            <div style={{ marginBottom: 6 }}>
                                <strong>Directive:</strong>
                                <pre
                                    style={{
                                        margin: '4px 0 0',
                                        padding: 8,
                                        background: 'var(--code-bg, var(--bg-secondary, #f5f5f5))',
                                        borderRadius: 6,
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-all',
                                        fontSize: 11.5,
                                    }}
                                >
                                    {renderHighlightedDirective(decodeRule(rule.description.rule))}
                                </pre>
                            </div>
                        )}
                        {c.transformations?.length > 0 && (
                            <div style={{ marginBottom: 6 }}>
                                <strong>Transformations:</strong>{' '}
                                {c.transformations.map((t, i) => (
                                    <Tag key={i} color="cyan" style={{ marginInlineEnd: 4 }}>
                                        {t}
                                    </Tag>
                                ))}
                            </div>
                        )}
                        {rule.description.rulelink && (
                            <div>
                                <a href={rule.description.rulelink} target="_blank" rel="noopener noreferrer">
                                    View source on GitHub →
                                </a>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {added ? (
                <Tooltip title={`Already in ${activeSetName ?? 'the active set'}`}>
                    <Button
                        type="text"
                        size="small"
                        icon={<CheckCircleFilled style={{ color: 'var(--color-success)' }} />}
                        disabled
                        aria-label="Already added"
                    />
                </Tooltip>
            ) : (
                <Tooltip title="Add this rule to the active set">
                    <Button
                        type="text"
                        size="small"
                        icon={<PlusOutlined />}
                        onClick={onAddOne}
                        aria-label="Add rule"
                    />
                </Tooltip>
            )}
        </div>
    );
};

export default React.memo(CrsRuleListItem);
