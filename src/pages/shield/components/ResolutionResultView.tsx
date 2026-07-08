/**
 * A scannable, user-friendly render of a resolution/dry-run result — shared by the
 * per-policy DryRun tab and the project-wide resolution tester. Leads with a plain
 * verdict ("Blocked · domain · route"), then a compact fact box, and — crucially —
 * says WHY each body is (or isn't) buffered, so an inherited `inspect_*_body` from
 * `spec.defaults` or an engine-driven auto-enable is never a mystery.
 */

import React from 'react';
import { Alert, Space, Tag, Typography } from 'antd';
import { EyeFilled, MinusCircleFilled, StopFilled } from '@ant-design/icons';
import { BodyInspection, SimResult } from '../utils/simulate';

const { Text } = Typography;

const MODE_META: Record<string, { tag: string; verb: string; alert: 'error' | 'warning' | 'info'; icon: React.ReactNode }> = {
    block: { tag: 'red', verb: 'Blocked', alert: 'error', icon: <StopFilled /> },
    detect: { tag: 'orange', verb: 'Detected — logged, request allowed', alert: 'warning', icon: <EyeFilled /> },
    shadow: { tag: 'purple', verb: 'Shadowed — logged as if blocked, request allowed', alert: 'warning', icon: <EyeFilled /> },
    off: { tag: 'default', verb: 'Passed through — no inspection', alert: 'info', icon: <MinusCircleFilled /> },
};

const BORDER = '1px solid rgba(140,140,140,0.25)';

const Line: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'baseline', padding: '4px 0' }}>
        <Text type="secondary" style={{ fontSize: 12, flex: '0 0 104px' }}>{label}</Text>
        <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    </div>
);

const BodyLine: React.FC<{ label: string; b: BodyInspection }> = ({ label, b }) => (
    <Line label={label}>
        {b.on
            ? <Space size={6} wrap><Tag color="orange" style={{ margin: 0 }}>buffered</Tag>{b.reason && <Text type="secondary" style={{ fontSize: 12 }}>{b.reason}</Text>}</Space>
            : <Tag style={{ margin: 0 }}>not buffered</Tag>}
    </Line>
);

export interface ResolutionResult extends SimResult {
    /** Present for cross-policy (project) resolution. */
    policy?: { id: string; name: string };
}

const ResolutionResultView: React.FC<{ r: ResolutionResult }> = ({ r }) => {
    if (r.excluded !== undefined) {
        return (
            <Alert type="warning" showIcon message="Passed through — all inspection skipped"
                description={<>The path matches an <code>exclude</code> entry (<code>{r.excluded}</code>), so the edge forwards it without inspection.</>} />
        );
    }
    if (r.noDomainMatch) {
        return (
            <Alert type="info" showIcon message="No policy matches this host"
                description="No domain matches — the no-policy default posture applies (allow, unless the sidecar runs with --default-allow=false)." />
        );
    }

    const mm = MODE_META[r.mode] ?? { tag: 'blue', verb: r.mode, alert: 'info' as const, icon: null };
    const trail = [r.policy?.name, r.domain?.matchedEntry, r.usedDomainDefault ? 'domain default' : r.route?.label]
        .filter(Boolean).join('  ·  ');

    return (
        <Space direction="vertical" size={10} style={{ width: '100%' }}>
            <Alert
                type={mm.alert} showIcon icon={mm.icon}
                message={<Text strong>{mm.verb}</Text>}
                description={trail ? <Text type="secondary" style={{ fontSize: 12 }}>{trail}</Text> : undefined}
            />

            <div style={{ border: BORDER, borderRadius: 8, padding: '6px 12px' }}>
                {r.policy && <Line label="Policy"><Text strong>{r.policy.name}</Text></Line>}
                <Line label="Domain">
                    {r.domain
                        ? <Space size={4} wrap>
                            {r.domain.hosts.map(h => <Tag key={h} color={h === r.domain!.matchedEntry ? 'blue' : undefined} style={{ margin: 0 }}>{h}</Tag>)}
                            <Text type="secondary" style={{ fontSize: 12 }}>matched via <code>{r.domain.matchedEntry}</code></Text>
                          </Space>
                        : '—'}
                </Line>
                <Line label="Route">
                    {r.usedDomainDefault
                        ? <Text type="secondary">domain default — no route matched</Text>
                        : (r.route ? <code>{r.route.label}</code> : '—')}
                </Line>
                <Line label="Enforcement">
                    <Space size={6}><Tag color={mm.tag} style={{ margin: 0 }}>{r.mode}</Tag><Text type="secondary" style={{ fontSize: 12 }}>fail {r.failMode}</Text></Space>
                </Line>
                <BodyLine label="Request body" b={r.requestBody} />
                <BodyLine label="Response body" b={r.responseBody} />
                <Line label="Engines">
                    {r.engines.length
                        ? <Space size={4} wrap>{r.engines.map((e, i) => <Tag key={e.key} color={e.phase === 'body' ? 'purple' : 'geekblue'} style={{ margin: 0 }}>{i + 1}. {e.label}</Tag>)}</Space>
                        : <Text type="secondary">none</Text>}
                </Line>
            </div>

            {r.caveats.length > 0 && (
                <Alert type="info" showIcon message="Notes"
                    description={<ul style={{ margin: 0, paddingLeft: 18 }}>{r.caveats.map((c, i) => <li key={i}>{c}</li>)}</ul>} />
            )}
        </Space>
    );
};

export default ResolutionResultView;
