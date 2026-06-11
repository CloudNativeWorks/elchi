/**
 * Visual SecRule builder — the "don't type syntax" core of WAF Studio.
 *
 * Composes a Coraza/ModSecurity `SecRule` from dropdowns (variables, operator,
 * transformations) and structured action fields (id, phase, severity, …),
 * driven entirely by the shared `corazaFeatures` vocabulary, with a live,
 * syntax-highlighted preview and lint. Returns the assembled rule string via
 * `onAdd`. Shareable across the WAF page and the Shield WAF Studio.
 */

import React, { useMemo, useState } from 'react';
import {
    Alert,
    Button,
    Drawer,
    Input,
    InputNumber,
    Segmented,
    Select,
    Space,
    Tag,
    Typography,
} from 'antd';
import { EyeOutlined, ThunderboltOutlined } from '@ant-design/icons';
import {
    CORAZA_OPERATORS,
    CORAZA_TRANSFORMATIONS,
    SEC_RULE_VARIABLES,
    SEVERITY_LEVELS,
} from '@/pages/waf/constants/corazaFeatures';
import { renderHighlightedDirective } from '@/pages/waf/utils/directiveSyntaxHighlight';
import { lintDirectives } from '@/pages/waf/utils/clientLint';

const { Text } = Typography;

/** Operators that take no operand (the second SecRule arg is just the operator). */
const NO_OPERAND = new Set([
    '@detectSQLi',
    '@detectXSS',
    '@unconditionalMatch',
    '@validateUrlEncoding',
    '@validateUtf8Encoding',
]);

const DISRUPTIVE_ACTIONS = [
    { label: 'deny — block the request', value: 'deny' },
    { label: 'block — apply the default disruptive action', value: 'block' },
    { label: 'drop — drop the connection', value: 'drop' },
    { label: 'pass — allow (detect/log only)', value: 'pass' },
];

const groupedOperators = () => {
    const byCat = new Map<string, { label: string; value: string }[]>();
    CORAZA_OPERATORS.forEach((o) => {
        if (!byCat.has(o.category)) byCat.set(o.category, []);
        byCat.get(o.category)!.push({ label: o.label, value: o.value });
    });
    return Array.from(byCat.entries()).map(([label, options]) => ({ label, title: label, options }));
};

export interface VisualRuleBuilderProps {
    open: boolean;
    onClose: () => void;
    onAdd: (directive: string) => void;
    /** Rule ids already in use, so the builder can suggest a free one and warn on clash. */
    existingIds?: number[];
}

const FieldLabel: React.FC<{ children: React.ReactNode; hint?: string }> = ({ children, hint }) => (
    <div style={{ marginBottom: 4, marginTop: 14 }}>
        <Text strong style={{ fontSize: 13 }}>{children}</Text>
        {hint && <span style={{ marginLeft: 6 }}><Text type="secondary" style={{ fontSize: 12 }}>{hint}</Text></span>}
    </div>
);

const VisualRuleBuilder: React.FC<VisualRuleBuilderProps> = ({ open, onClose, onAdd, existingIds = [] }) => {
    const suggestedId = useMemo(() => {
        const max = existingIds.length ? Math.max(...existingIds) : 1000;
        return Math.max(1000, max) + 1;
    }, [existingIds]);

    const [variables, setVariables] = useState<string[]>(['ARGS']);
    const [selector, setSelector] = useState('');
    const [operator, setOperator] = useState('@rx');
    const [operand, setOperand] = useState('');
    const [transformations, setTransformations] = useState<string[]>(['none']);
    const [id, setId] = useState<number>(suggestedId);
    const [phase, setPhase] = useState<number>(2);
    const [action, setAction] = useState('deny');
    const [status, setStatus] = useState<number | undefined>(403);
    const [severity, setSeverity] = useState<string | undefined>('CRITICAL');
    const [msg, setMsg] = useState('');
    const [tags, setTags] = useState<string[]>([]);

    // Re-suggest the id whenever the drawer (re)opens with a new id space.
    const lastOpen = React.useRef(false);
    React.useEffect(() => {
        if (open && !lastOpen.current) setId(suggestedId);
        lastOpen.current = open;
    }, [open, suggestedId]);

    const needsOperand = !NO_OPERAND.has(operator);
    const target =
        variables.join('|') + (variables.length === 1 && selector.trim() ? `:${selector.trim()}` : '');

    // The operator argument is wrapped in double quotes, so an operand that
    // itself contains a `"` would terminate it early and produce a SecRule
    // Coraza can't parse. Block it rather than silently emit a broken rule.
    const operandHasQuote = needsOperand && operand.includes('"');

    const directive = useMemo(() => {
        if (variables.length === 0 || !id || operandHasQuote) return '';
        const ops = needsOperand ? `${operator} ${operand}`.trim() : operator;
        // `t:none` resets the pipeline — it's a sentinel, not a peer. If any real
        // transformation is chosen, drop `none`; always de-dupe.
        const uniqT = transformations.filter((t, i) => transformations.indexOf(t) === i);
        const effT = uniqT.length > 1 ? uniqT.filter((t) => t !== 'none') : uniqT;
        // Strip the wrapping quote chars from free text so the action list can't
        // be broken (msg/severity are single-quoted, so a `'` would break out).
        const safe = (s: string) => s.replace(/['"]/g, '');
        const actionParts = [
            `id:${id}`,
            `phase:${phase}`,
            action,
            ...effT.map((t) => `t:${t}`),
            // status only carries meaning with a blocking action.
            action === 'deny' && status != null ? `status:${status}` : null,
            severity ? `severity:'${severity}'` : null,
            msg.trim() ? `msg:'${safe(msg.trim())}'` : null,
            ...tags.map((t) => `tag:'${safe(t)}'`),
        ].filter(Boolean);
        return `SecRule ${target} "${ops}" "${actionParts.join(',')}"`;
    }, [variables, target, needsOperand, operandHasQuote, operator, operand, id, phase, action, transformations, status, severity, msg, tags]);

    const idClash = existingIds.includes(id);
    const lint = useMemo(() => (directive ? lintDirectives([directive]) : null), [directive]);
    const lintError = lint && lint.summary.errors > 0;
    const valid = !!directive && (!needsOperand || operand.trim().length > 0) && !idClash && !lintError;

    const handleAdd = () => {
        if (!valid) return;
        onAdd(directive);
        onClose();
    };

    return (
        <Drawer
            title={
                <Space>
                    <ThunderboltOutlined style={{ color: 'var(--color-primary)' }} />
                    <Text strong style={{ fontSize: 16 }}>Visual Rule Builder</Text>
                </Space>
            }
            placement="right"
            width={Math.min(720, typeof window !== 'undefined' ? window.innerWidth - 40 : 720)}
            open={open}
            onClose={onClose}
            extra={
                <Space>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="primary" onClick={handleAdd} disabled={!valid}>Add rule</Button>
                </Space>
            }
        >
            <Alert
                type="info"
                showIcon
                style={{ marginBottom: 8 }}
                message="Pick what to inspect, how to match it, and what to do — the SecRule is written for you."
            />

            <FieldLabel hint="what the rule inspects (joined with |)">Variables</FieldLabel>
            <Select
                mode="multiple"
                style={{ width: '100%' }}
                value={variables}
                onChange={setVariables}
                placeholder="ARGS, REQUEST_HEADERS, …"
                optionFilterProp="label"
                options={SEC_RULE_VARIABLES.map((v) => ({ label: v.label, value: v.value, title: v.description }))}
            />

            <FieldLabel hint="optional, only when one variable is selected (e.g. ARGS:username)">Selector</FieldLabel>
            <Input
                value={selector}
                onChange={(e) => setSelector(e.target.value)}
                placeholder="username"
                disabled={variables.length !== 1}
            />

            <FieldLabel>Operator</FieldLabel>
            <Select
                style={{ width: '100%' }}
                value={operator}
                onChange={setOperator}
                showSearch
                optionFilterProp="label"
                options={groupedOperators()}
            />

            <FieldLabel hint={needsOperand ? 'pattern / value to match' : 'this operator takes no operand'}>Operand</FieldLabel>
            <Input
                value={operand}
                onChange={(e) => setOperand(e.target.value)}
                placeholder={needsOperand ? "e.g. (?i)union\\s+select" : '—'}
                disabled={!needsOperand}
                status={operandHasQuote ? 'error' : undefined}
                style={{ fontFamily: 'monospace' }}
            />
            {operandHasQuote && (
                <div><Text type="danger" style={{ fontSize: 12 }}>Remove the &quot; character — it breaks the SecRule operator.</Text></div>
            )}

            <FieldLabel hint="applied in order before matching">Transformations</FieldLabel>
            <Select
                mode="multiple"
                style={{ width: '100%' }}
                value={transformations}
                onChange={setTransformations}
                optionFilterProp="label"
                placeholder="none, lowercase, urlDecodeUni, …"
                options={CORAZA_TRANSFORMATIONS.map((t) => ({ label: t.label, value: t.value }))}
            />

            <FieldLabel hint="processing phase">Phase</FieldLabel>
            <Segmented
                value={phase}
                onChange={(v) => setPhase(Number(v))}
                options={[
                    { label: '1 · Req headers', value: 1 },
                    { label: '2 · Req body', value: 2 },
                    { label: '3 · Resp headers', value: 3 },
                    { label: '4 · Resp body', value: 4 },
                ]}
            />

            <Space style={{ width: '100%', marginTop: 14 }} size={16} wrap>
                <div>
                    <FieldLabel>Rule ID</FieldLabel>
                    <InputNumber min={1} value={id} onChange={(v) => setId(Number(v) || 0)} status={idClash ? 'error' : undefined} />
                    {idClash && <div><Text type="danger" style={{ fontSize: 12 }}>Already used by another rule</Text></div>}
                </div>
                <div>
                    <FieldLabel>Action</FieldLabel>
                    <Select style={{ width: 280 }} value={action} onChange={setAction} options={DISRUPTIVE_ACTIONS} />
                </div>
                <div>
                    <FieldLabel hint={action === 'deny' ? undefined : 'only with deny'}>Status</FieldLabel>
                    <InputNumber min={100} max={599} value={status} disabled={action !== 'deny'} onChange={(v) => setStatus(v == null ? undefined : Number(v))} placeholder="403" />
                </div>
                <div>
                    <FieldLabel>Severity</FieldLabel>
                    <Select allowClear style={{ width: 180 }} value={severity} onChange={setSeverity} options={SEVERITY_LEVELS.map((s) => ({ label: s.label, value: s.value }))} placeholder="optional" />
                </div>
            </Space>

            <FieldLabel hint="shown in logs/audit">Message</FieldLabel>
            <Input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Blocked: SQL injection attempt" />

            <FieldLabel hint="free-form labels">Tags</FieldLabel>
            <Select mode="tags" style={{ width: '100%' }} value={tags} onChange={setTags} tokenSeparators={[',', ' ']} placeholder="attack-sqli, custom" options={[]} />

            <div style={{ marginTop: 20 }}>
                <Space style={{ marginBottom: 8 }}>
                    <EyeOutlined style={{ color: 'var(--color-success)' }} />
                    <Text strong style={{ fontSize: 13 }}>Generated SecRule</Text>
                    {lint && !lintError && <Tag color="success">lint clean</Tag>}
                    {lintError && <Tag color="error">{lint!.summary.errors} lint error(s)</Tag>}
                </Space>
                <div
                    style={{
                        background: 'var(--code-bg, var(--bg-secondary, #f5f5f5))',
                        border: '1px solid var(--border-default)',
                        borderRadius: 8,
                        padding: 12,
                        fontFamily: 'monospace',
                        fontSize: 12,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-all',
                        minHeight: 44,
                    }}
                >
                    {directive ? renderHighlightedDirective(directive) : <Text type="secondary">Pick at least one variable and an id to preview the rule.</Text>}
                </div>
            </div>
        </Drawer>
    );
};

export default VisualRuleBuilder;
