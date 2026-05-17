import React from 'react';
import { Tag, Tooltip } from 'antd';
import {
    riskFlagColor,
    riskFlagLabel,
    riskFlagMeta,
    SEVERITY_SCORE,
    type RiskFlagMeta,
} from '../lib/riskFlagCatalog';

interface Props {
    flags: string[] | undefined;
    max?: number;
    size?: 'sm' | 'md';
}

const FlagTooltipBody: React.FC<{ flag: string; meta?: RiskFlagMeta }> = ({ flag, meta }) => {
    return (
        <div style={{ fontSize: 11, lineHeight: 1.5, maxWidth: 280 }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>{riskFlagLabel(flag)}</div>
            {meta ? (
                <>
                    <div style={{ opacity: 0.75, marginBottom: 4 }}>
                        <span style={{ textTransform: 'capitalize' }}>{meta.severity}</span> · {SEVERITY_SCORE[meta.severity]} pts
                        {' · '}
                        <span style={{ textTransform: 'capitalize' }}>
                            {meta.class.replace('_', ' ')}
                        </span>
                    </div>
                    <div style={{ opacity: 0.9 }}>{meta.description}</div>
                </>
            ) : (
                <div style={{ opacity: 0.75 }}>Unknown flag — no catalog entry on the UI side.</div>
            )}
        </div>
    );
};

const RiskFlagChips: React.FC<Props> = ({ flags, max = 3, size = 'sm' }) => {
    if (!flags || flags.length === 0) {
        return <span style={{ color: 'var(--text-tertiary)', fontSize: 11 }}>—</span>;
    }

    const visible = flags.slice(0, max);
    const overflow = flags.slice(max);
    const fontSize = size === 'sm' ? 10 : 12;

    return (
        <span style={{ display: 'inline-flex', flexWrap: 'wrap', gap: 4, alignItems: 'center' }}>
            {visible.map((f) => (
                <Tooltip key={f} title={<FlagTooltipBody flag={f} meta={riskFlagMeta(f)} />}>
                    <Tag
                        className="auto-width-tag"
                        color={riskFlagColor(f)}
                        style={{ fontSize, margin: 0, cursor: 'help' }}
                    >
                        {riskFlagLabel(f)}
                    </Tag>
                </Tooltip>
            ))}
            {overflow.length > 0 && (
                <Tooltip
                    title={
                        <div style={{ fontSize: 11, lineHeight: 1.6, maxWidth: 320 }}>
                            <div style={{ fontWeight: 600, marginBottom: 6 }}>
                                {overflow.length} more risk flag{overflow.length > 1 ? 's' : ''}
                            </div>
                            {overflow.map((f) => {
                                const m = riskFlagMeta(f);
                                return (
                                    <div key={f} style={{ marginBottom: 4 }}>
                                        <span style={{ fontWeight: 500 }}>{riskFlagLabel(f)}</span>
                                        {m ? (
                                            <span style={{ opacity: 0.7 }}>
                                                {' '}
                                                — {m.severity} ({SEVERITY_SCORE[m.severity]})
                                            </span>
                                        ) : null}
                                    </div>
                                );
                            })}
                        </div>
                    }
                >
                    <Tag
                        className="auto-width-tag"
                        style={{
                            fontSize,
                            margin: 0,
                            cursor: 'help',
                            background: 'var(--bg-elevated)',
                            borderColor: 'var(--border-default)',
                        }}
                    >
                        +{overflow.length}
                    </Tag>
                </Tooltip>
            )}
        </span>
    );
};

export default RiskFlagChips;
