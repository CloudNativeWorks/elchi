import React from 'react';
import { Tag, Tooltip, Space } from 'antd';

// Consumer auth schemes the collector fingerprints per operation.
// jwt / mtls / apikey are recognised schemes; `none` means anonymous OR
// a non-fingerprintable auth (Basic / opaque Bearer) — it is NOT proof of
// "no auth" (that needs noauth_observed). When the whole field is absent
// the collector's consumer fingerprinting is off → render nothing.
const SCHEME_META: Record<string, { label: string; color: string; tip: string }> = {
    jwt: { label: 'JWT', color: 'geekblue', tip: 'JWT bearer token (sub claim fingerprinted).' },
    mtls: { label: 'mTLS', color: 'green', tip: 'Mutual TLS — client peer certificate.' },
    apikey: { label: 'API Key', color: 'purple', tip: 'X-Api-Key header.' },
};

interface Props {
    schemes: string[] | undefined;
    size?: 'sm' | 'md';
}

// Renders the auth-scheme set as coloured chips. Returns null when the
// field is absent/empty (fingerprinting off) — never assume a posture.
const AuthSchemesBadge: React.FC<Props> = ({ schemes, size = 'md' }) => {
    if (!schemes || schemes.length === 0) return null;
    const fontSize = size === 'sm' ? 10 : 11;
    return (
        <Space size={4} wrap>
            {schemes.map((s) => {
                const meta = SCHEME_META[s];
                if (meta) {
                    return (
                        <Tooltip key={s} title={meta.tip}>
                            <Tag className="auto-width-tag" color={meta.color} style={{ margin: 0, fontSize, cursor: 'help' }}>
                                {meta.label}
                            </Tag>
                        </Tooltip>
                    );
                }
                // `none` (and any unknown scheme) → neutral chip.
                return (
                    <Tooltip
                        key={s}
                        title={
                            s === 'none'
                                ? 'Anonymous or non-fingerprintable auth (Basic / opaque Bearer). Not necessarily unauthenticated.'
                                : 'Unrecognised auth scheme.'
                        }
                    >
                        <Tag
                            className="auto-width-tag"
                            style={{
                                margin: 0,
                                fontSize,
                                cursor: 'help',
                                color: 'var(--text-tertiary)',
                                background: 'var(--bg-elevated)',
                                borderColor: 'var(--border-default)',
                            }}
                        >
                            {s === 'none' ? 'None' : s}
                        </Tag>
                    </Tooltip>
                );
            })}
        </Space>
    );
};

export default AuthSchemesBadge;
