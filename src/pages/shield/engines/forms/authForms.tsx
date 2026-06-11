/**
 * Authentication engine forms: JWT, JWKS, API Key, HMAC Sign, HTTP Signature
 * (RFC 9421), XFCC (mTLS identity). Field names/semantics from elchi-shield
 * internal/config/types.go + docs/CONFIG-REFERENCE.md.
 */

import React, { useState } from 'react';
import { Button, Col, Input, Row, Space, Table, Typography } from 'antd';
import { DeleteOutlined, KeyOutlined, PlusOutlined } from '@ant-design/icons';
import {
    ApiKeyEntrySpec,
    ApiKeySpec,
    DataFileModel,
    HmacSignSpec,
    HttpSignatureSpec,
    JwksSpec,
    JwtSpec,
    XfccSpec,
} from '../../state/model';
import { sha256HexOfText } from '../../utils';
import {
    DataFilePathField,
    DurationField,
    FieldShell,
    SelectField,
    SwitchField,
    TagsField,
    TextField,
} from '../fields';

const { Text } = Typography;

export interface EngineFormProps<T> {
    value: T;
    onChange: (v: T) => void;
    disabled?: boolean;
    dataFiles: DataFileModel[];
}

const ALG_OPTIONS = ['RS256', 'RS384', 'RS512', 'ES256', 'ES384', 'HS256', 'HS384', 'HS512']
    .map(a => ({ value: a }));

export const JwtForm: React.FC<EngineFormProps<JwtSpec>> = ({ value, onChange, disabled, dataFiles }) => {
    const set = (patch: Partial<JwtSpec>) => onChange({ ...value, ...patch });
    return (
        <Row gutter={16}>
            <Col xs={24} md={12}>
                <TextField label="Issuer" tooltip="Expected `iss` claim — tokens from any other issuer are rejected." placeholder="https://auth.example.com/" disabled={disabled} value={value.issuer} onChange={v => set({ issuer: v })} />
                <TextField label="Audience" tooltip="Expected `aud` claim — the API this token must be intended for." placeholder="my-api" disabled={disabled} value={value.audience} onChange={v => set({ audience: v })} />
                <TagsField label="Algorithms" tooltip="Accepted signing algorithms; anything else is rejected." options={ALG_OPTIONS} placeholder="RS256" disabled={disabled} value={value.algorithms} onChange={v => set({ algorithms: v })} />
                <TagsField label="Required Claims" tooltip="Claims that must be present in the token (e.g. sub, scope)." placeholder="sub" disabled={disabled} value={value.required_claims} onChange={v => set({ required_claims: v })} />
            </Col>
            <Col xs={24} md={12}>
                <DataFilePathField label="Public Key File" tooltip="PEM public key on the edge that verifies RS*/ES* signatures. Upload it in the Data Files tab and pick it here." disabled={disabled} value={value.public_key_file} onChange={v => set({ public_key_file: v })} dataFiles={dataFiles} />
                <TextField label="HMAC Secret" tooltip="Shared secret for HS* algorithms (alternative to a public key)." password disabled={disabled} value={value.hmac_secret} onChange={v => set({ hmac_secret: v })} />
                <TextField label="Header Name" tooltip="Header carrying the token. Default: Authorization (Bearer <token>)." placeholder="Authorization" disabled={disabled} value={value.header_name} onChange={v => set({ header_name: v })} />
                <DurationField label="Leeway" tooltip="Clock-skew tolerance for exp/nbf/iat. Empty = strict." disabled={disabled} value={value.leeway} onChange={v => set({ leeway: v })} />
            </Col>
        </Row>
    );
};

export const JwksForm: React.FC<EngineFormProps<JwksSpec>> = ({ value, onChange, disabled, dataFiles }) => {
    const set = (patch: Partial<JwksSpec>) => onChange({ ...value, ...patch });
    return (
        <Row gutter={16}>
            <Col xs={24} md={12}>
                <TextField label="JWKS URL" tooltip="Remote JWK Set endpoint. Fetched at config load and refreshed in the background — never on the request path." placeholder="https://auth.example.com/.well-known/jwks.json" disabled={disabled} value={value.url} onChange={v => set({ url: v })} />
                <DataFilePathField label="JWKS File" tooltip="Local JWK Set file on the edge (alternative to URL; hot-reloaded, no network)." disabled={disabled} value={value.file} onChange={v => set({ file: v })} dataFiles={dataFiles} />
                <TextField label="Issuer" tooltip="Expected `iss` claim." placeholder="https://auth.example.com/" disabled={disabled} value={value.issuer} onChange={v => set({ issuer: v })} />
                <TextField label="Audience" tooltip="Expected `aud` claim." disabled={disabled} value={value.audience} onChange={v => set({ audience: v })} />
                <TagsField label="Algorithms" tooltip="Accepted algorithms (RS256/ES256 typical for JWKS)." options={ALG_OPTIONS} disabled={disabled} value={value.algorithms} onChange={v => set({ algorithms: v })} />
            </Col>
            <Col xs={24} md={12}>
                <TagsField label="Required Claims" tooltip="Claims that must be present in the token." disabled={disabled} value={value.required_claims} onChange={v => set({ required_claims: v })} />
                <TextField label="Header Name" tooltip="Header carrying the token. Default: Authorization." placeholder="Authorization" disabled={disabled} value={value.header_name} onChange={v => set({ header_name: v })} />
                <DurationField label="Leeway" tooltip="Clock-skew tolerance." disabled={disabled} value={value.leeway} onChange={v => set({ leeway: v })} />
                <DurationField label="Refresh Interval" tooltip="How often the remote JWKS is re-fetched in the background." placeholder="e.g. 5m" disabled={disabled} value={value.refresh_interval} onChange={v => set({ refresh_interval: v })} />
                <DurationField label="HTTP Timeout" tooltip="Timeout for the background JWKS fetch." placeholder="e.g. 10s" disabled={disabled} value={value.http_timeout} onChange={v => set({ http_timeout: v })} />
            </Col>
        </Row>
    );
};

/** API key entries table with a "hash my plaintext key" helper (WebCrypto). */
const ApiKeysEditor: React.FC<EngineFormProps<ApiKeySpec>> = ({ value, onChange, disabled }) => {
    const keys = value.keys ?? [];
    const [draftSubject, setDraftSubject] = useState('');
    const [draftKey, setDraftKey] = useState('');
    const [draftScopes, setDraftScopes] = useState('');

    const addKey = async () => {
        if (!draftKey.trim()) return;
        // Store the HASH, never the plaintext: the user pastes the real key once
        // and we derive sha256 client-side.
        const hashed = await sha256HexOfText(draftKey.trim());
        const entry: ApiKeyEntrySpec = {
            sha256: hashed,
            subject: draftSubject.trim() || undefined,
            scopes: draftScopes.trim() ? draftScopes.split(',').map(s => s.trim()).filter(Boolean) : undefined,
        };
        onChange({ ...value, keys: [...keys, entry] });
        setDraftSubject(''); setDraftKey(''); setDraftScopes('');
    };

    return (
        <FieldShell
            label="API Keys"
            tooltip="Configured credentials. Paste the plaintext key once — it is hashed (SHA-256) in your browser and only the hash is stored."
            hint="Subject names the consumer; scopes gate path bindings below."
        >
            <Table
                size="small"
                dataSource={keys.map((k, i) => ({ ...k, _idx: i }))}
                rowKey="_idx"
                pagination={false}
                locale={{ emptyText: 'No keys yet' }}
                columns={[
                    { title: 'Subject', dataIndex: 'subject', render: (s?: string) => s || <Text type="secondary">—</Text> },
                    { title: 'Key (sha256)', dataIndex: 'sha256', render: (s?: string) => <Text style={{ fontFamily: 'monospace', fontSize: 11 }}>{s ? `${s.slice(0, 12)}…` : '—'}</Text> },
                    { title: 'Scopes', dataIndex: 'scopes', render: (s?: string[]) => s?.join(', ') || <Text type="secondary">—</Text> },
                    {
                        title: '', width: 40,
                        render: (_: unknown, row: { _idx: number }) => !disabled && (
                            <Button type="text" danger size="small" icon={<DeleteOutlined />} onClick={() => onChange({ ...value, keys: keys.filter((_, i) => i !== row._idx) })} />
                        ),
                    },
                ]}
            />
            {!disabled && (
                <Space.Compact style={{ width: '100%', marginTop: 8 }}>
                    <Input size="small" placeholder="subject (optional)" value={draftSubject} onChange={e => setDraftSubject(e.target.value)} style={{ width: '25%' }} />
                    <Input.Password size="small" placeholder="plaintext key — hashed locally" value={draftKey} onChange={e => setDraftKey(e.target.value)} style={{ width: '45%' }} />
                    <Input size="small" placeholder="scopes, comma-sep" value={draftScopes} onChange={e => setDraftScopes(e.target.value)} style={{ width: '20%' }} />
                    <Button size="small" icon={<KeyOutlined />} onClick={addKey}>Add</Button>
                </Space.Compact>
            )}
        </FieldShell>
    );
};

export const ApiKeyForm: React.FC<EngineFormProps<ApiKeySpec>> = (props) => {
    const { value, onChange, disabled } = props;
    const set = (patch: Partial<ApiKeySpec>) => onChange({ ...value, ...patch });
    const bindings = value.require_scope_for_path ?? [];
    return (
        <>
            <Row gutter={16}>
                <Col xs={24} md={12}>
                    <SelectField label="Key Source" tooltip="Where the key is read from on the request." options={[{ value: 'header', label: 'Header (default)' }, { value: 'query', label: 'Query parameter' }]} disabled={disabled} value={value.source} onChange={v => set({ source: v })} />
                </Col>
                <Col xs={24} md={12}>
                    <TextField label="Parameter Name" tooltip="Header or query parameter carrying the key. Default: X-Api-Key." placeholder="X-Api-Key" disabled={disabled} value={value.name} onChange={v => set({ name: v })} />
                </Col>
            </Row>
            <ApiKeysEditor {...props} />
            <FieldShell label="Scope → Path Bindings" tooltip="Restrict a path prefix to keys carrying a scope (e.g. /admin/ requires scope 'admin')." hint="Requests under the prefix are rejected unless the presented key has the scope.">
                {bindings.map((b, i) => (
                    <Space.Compact key={i} style={{ width: '100%', marginBottom: 4 }}>
                        <Input size="small" placeholder="/admin/" value={b.path_prefix} disabled={disabled} style={{ width: '50%', fontFamily: 'monospace' }}
                            onChange={e => set({ require_scope_for_path: bindings.map((x, j) => j === i ? { ...x, path_prefix: e.target.value || undefined } : x) })} />
                        <Input size="small" placeholder="scope" value={b.scope} disabled={disabled} style={{ width: '40%' }}
                            onChange={e => set({ require_scope_for_path: bindings.map((x, j) => j === i ? { ...x, scope: e.target.value || undefined } : x) })} />
                        {!disabled && <Button size="small" danger icon={<DeleteOutlined />} onClick={() => set({ require_scope_for_path: bindings.filter((_, j) => j !== i) })} />}
                    </Space.Compact>
                ))}
                {!disabled && (
                    <Button size="small" type="dashed" icon={<PlusOutlined />} onClick={() => set({ require_scope_for_path: [...bindings, {}] })}>
                        Add binding
                    </Button>
                )}
            </FieldShell>
        </>
    );
};

export const HmacSignForm: React.FC<EngineFormProps<HmacSignSpec>> = ({ value, onChange, disabled }) => {
    const set = (patch: Partial<HmacSignSpec>) => onChange({ ...value, ...patch });
    const secrets = Object.entries(value.secrets ?? {});
    const [draftId, setDraftId] = useState('');
    const [draftSecret, setDraftSecret] = useState('');
    return (
        <Row gutter={16}>
            <Col xs={24} md={12}>
                <TextField label="Shared Secret" tooltip="Single shared HMAC secret (or use rotating per-key-id secrets on the right)." password disabled={disabled} value={value.secret} onChange={v => set({ secret: v })} />
                <SelectField label="Algorithm" tooltip="HMAC digest algorithm." options={[{ value: 'sha256', label: 'SHA-256 (default)' }, { value: 'sha512', label: 'SHA-512' }]} disabled={disabled} value={value.algorithm} onChange={v => set({ algorithm: v })} />
                <DurationField label="Timestamp Window" tooltip="Maximum allowed clock difference for the signed timestamp (replay protection)." placeholder="e.g. 5m" disabled={disabled} value={value.window} onChange={v => set({ window: v })} />
                <DurationField label="Nonce TTL" tooltip="How long seen nonces are remembered for replay rejection." placeholder="e.g. 10m" disabled={disabled} value={value.nonce_ttl} onChange={v => set({ nonce_ttl: v })} />
                <SwitchField label="Require Nonce" tooltip="Reject requests without a nonce header (strongest replay protection)." disabled={disabled} value={value.require_nonce} onChange={v => set({ require_nonce: v })} />
                <SwitchField label="Require Body Digest" tooltip="Require and verify a body digest so the body is covered by the signature." disabled={disabled} value={value.require_body_digest} onChange={v => set({ require_body_digest: v })} />
            </Col>
            <Col xs={24} md={12}>
                <FieldShell label="Rotating Secrets (key id → secret)" tooltip="Per-key-id secrets for zero-downtime rotation; the request names its key id." hint="Alternative to the single shared secret.">
                    {secrets.map(([id]) => (
                        <Space.Compact key={id} style={{ width: '100%', marginBottom: 4 }}>
                            <Input size="small" value={id} disabled style={{ width: '40%' }} />
                            <Input.Password size="small" value="••••••••" disabled style={{ width: '50%' }} />
                            {!disabled && <Button size="small" danger icon={<DeleteOutlined />} onClick={() => {
                                const next = { ...(value.secrets ?? {}) };
                                delete next[id];
                                set({ secrets: Object.keys(next).length ? next : undefined });
                            }} />}
                        </Space.Compact>
                    ))}
                    {!disabled && (
                        <Space.Compact style={{ width: '100%' }}>
                            <Input size="small" placeholder="key id" value={draftId} onChange={e => setDraftId(e.target.value)} style={{ width: '40%' }} />
                            <Input.Password size="small" placeholder="secret" value={draftSecret} onChange={e => setDraftSecret(e.target.value)} style={{ width: '50%' }} />
                            <Button size="small" icon={<PlusOutlined />} onClick={() => {
                                if (!draftId.trim() || !draftSecret) return;
                                set({ secrets: { ...(value.secrets ?? {}), [draftId.trim()]: draftSecret } });
                                setDraftId(''); setDraftSecret('');
                            }}>Add</Button>
                        </Space.Compact>
                    )}
                </FieldShell>
                <TextField label="Signature Header" tooltip="Header carrying the signature. Empty = engine default." disabled={disabled} value={value.signature_header} onChange={v => set({ signature_header: v })} />
                <TextField label="Timestamp Header" tooltip="Header carrying the signed timestamp." disabled={disabled} value={value.timestamp_header} onChange={v => set({ timestamp_header: v })} />
                <TextField label="Nonce Header" tooltip="Header carrying the nonce." disabled={disabled} value={value.nonce_header} onChange={v => set({ nonce_header: v })} />
                <TextField label="Key ID Header" tooltip="Header naming which rotating secret signed the request." disabled={disabled} value={value.key_id_header} onChange={v => set({ key_id_header: v })} />
            </Col>
        </Row>
    );
};

export const HttpSigForm: React.FC<EngineFormProps<HttpSignatureSpec>> = ({ value, onChange, disabled }) => {
    const set = (patch: Partial<HttpSignatureSpec>) => onChange({ ...value, ...patch });
    return (
        <Row gutter={16}>
            <Col xs={24} md={12}>
                <TextField label="Shared Secret" tooltip="HMAC-SHA256 shared key for RFC 9421 HTTP Message Signatures." password disabled={disabled} value={value.secret} onChange={v => set({ secret: v })} />
                <TextField label="Signature Name" tooltip="Label expected in Signature-Input. Default: sig1." placeholder="sig1" disabled={disabled} value={value.signature_name} onChange={v => set({ signature_name: v })} />
            </Col>
            <Col xs={24} md={12}>
                <TagsField label="Covered Components" tooltip="Message components the signature must cover. Default: @method, @authority, @path." placeholder="@method" disabled={disabled} value={value.covered_components} onChange={v => set({ covered_components: v })} />
                <DurationField label="Max Age" tooltip="Reject signatures whose `created` is older than this." placeholder="e.g. 5m" disabled={disabled} value={value.max_age} onChange={v => set({ max_age: v })} />
            </Col>
        </Row>
    );
};

export const XfccForm: React.FC<EngineFormProps<XfccSpec>> = ({ value, onChange, disabled }) => {
    const set = (patch: Partial<XfccSpec>) => onChange({ ...value, ...patch });
    return (
        <Row gutter={16}>
            <Col xs={24} md={12}>
                <SwitchField label="Require Certificate" tooltip="Reject requests without a forwarded mTLS client certificate (presence check)." disabled={disabled} value={value.require_present} onChange={v => set({ require_present: v })} />
                <TextField label="Header Name" tooltip="Header Envoy forwards the client-cert info in. Default: X-Forwarded-Client-Cert." placeholder="X-Forwarded-Client-Cert" disabled={disabled} value={value.header_name} onChange={v => set({ header_name: v })} />
                <TagsField label="Allowed SPIFFE/URIs" tooltip="Allowed certificate URI SANs (e.g. spiffe://cluster/ns/app). Allow-list dimensions are OR'd." placeholder="spiffe://…" disabled={disabled} value={value.uris} onChange={v => set({ uris: v })} />
            </Col>
            <Col xs={24} md={12}>
                <TagsField label="Allowed DNS Names" tooltip="Allowed certificate DNS SANs." placeholder="svc.example.internal" disabled={disabled} value={value.dns_names} onChange={v => set({ dns_names: v })} />
                <TagsField label="Allowed Subjects" tooltip="Allowed certificate subject strings." disabled={disabled} value={value.subjects} onChange={v => set({ subjects: v })} />
                <TagsField label="Allowed Fingerprints" tooltip="Allowed certificate hashes (as Envoy reports them)." disabled={disabled} value={value.hashes} onChange={v => set({ hashes: v })} />
            </Col>
        </Row>
    );
};
