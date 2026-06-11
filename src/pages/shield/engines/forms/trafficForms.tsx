/**
 * Traffic-control engine forms: Rate Limit, IP Reputation (+GeoIP/feeds), Bot.
 */

import React from 'react';
import { Button, Col, Collapse, Row, Select, Space, Typography } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {
    BotSpec,
    FeedSpec,
    IpReputationSpec,
    RateLimitSpec,
} from '../../state/model';
import {
    DataFilePathField,
    FieldShell,
    NumberField,
    SelectField,
    SwitchField,
    TagsField,
    TextField,
} from '../fields';
import type { EngineFormProps } from './authForms';

const { Text } = Typography;

/** Loose CIDR/IP shape check for tag inputs (full validation happens on the edge). */
const looksLikeCidr = (v: string): boolean =>
    /^[0-9a-fA-F:.]+(\/\d{1,3})?$/.test(v.trim());

const CidrTags: React.FC<{
    label: string; tooltip: string; hint?: string; disabled?: boolean;
    value?: string[]; onChange: (v?: string[]) => void;
}> = ({ label, tooltip, hint, disabled, value, onChange }) => (
    <FieldShell label={label} tooltip={tooltip} hint={hint ?? 'CIDR notation, e.g. 10.0.0.0/8, 192.0.2.7/32, 2001:db8::/48'}>
        <Select
            size="small"
            mode="tags"
            style={{ width: '100%' }}
            value={value ?? []}
            disabled={disabled}
            placeholder="192.0.2.0/24"
            tokenSeparators={[',', ' ']}
            onChange={(v: string[]) => {
                const cleaned = v.map(s => s.trim()).filter(Boolean);
                const bad = cleaned.filter(s => !looksLikeCidr(s));
                onChange(cleaned.length ? cleaned : undefined);
                if (bad.length) {
                    // Visual nudge only; edge-side validation is authoritative.
                    console.warn('shield: suspicious CIDR entries', bad);
                }
            }}
            options={[]}
        />
    </FieldShell>
);

export const RateLimitForm: React.FC<EngineFormProps<RateLimitSpec>> = ({ value, onChange, disabled }) => {
    const set = (patch: Partial<RateLimitSpec>) => onChange({ ...value, ...patch });
    return (
        <Row gutter={16}>
            <Col xs={24} md={12}>
                <NumberField label="Requests / Second" tooltip="Sustained allowed rate per key (token bucket refill rate). Must be > 0." min={0.1} placeholder="10" disabled={disabled} value={value.requests_per_second} onChange={v => set({ requests_per_second: v })} />
                <NumberField label="Burst" tooltip="Bucket capacity — short bursts above the sustained rate. Empty = ceil(requests/second)." min={1} disabled={disabled} value={value.burst} onChange={v => set({ burst: v })} />
            </Col>
            <Col xs={24} md={12}>
                <SelectField label="Limit Key" tooltip="The dimension requests are counted per." options={[
                    { value: 'ip', label: 'Client IP (default)' },
                    { value: 'host', label: 'Host' },
                    { value: 'header', label: 'Header value' },
                ]} disabled={disabled} value={value.key} onChange={v => set({ key: v })} />
                <TextField label="Header" tooltip="For key=header: the header to count by. For key=ip: the header carrying the client IP (default X-Forwarded-For)." disabled={disabled} value={value.header} onChange={v => set({ header: v })} />
            </Col>
        </Row>
    );
};

const FEED_FORMATS = [
    { value: 'cidr_lines', label: 'cidr_lines — one CIDR per line' },
    { value: 'firehol_netset', label: 'firehol_netset — FireHOL .netset' },
    { value: 'spamhaus_json', label: 'spamhaus_json — Spamhaus DROP JSON' },
];
const SEVERITIES = ['low', 'medium', 'high', 'critical'].map(s => ({ value: s, label: s }));

export const IpReputationForm: React.FC<EngineFormProps<IpReputationSpec>> = ({ value, onChange, disabled, dataFiles }) => {
    const set = (patch: Partial<IpReputationSpec>) => onChange({ ...value, ...patch });
    const feeds = value.feeds ?? [];
    const setFeed = (i: number, patch: Partial<FeedSpec>) =>
        set({ feeds: feeds.map((f, j) => (j === i ? { ...f, ...patch } : f)) });
    const geo = value.geoip ?? {};
    const setGeo = (patch: Partial<NonNullable<IpReputationSpec['geoip']>>) => {
        const next = { ...geo, ...patch };
        set({ geoip: Object.values(next).some(v => v !== undefined && (!Array.isArray(v) || v.length)) ? next : undefined });
    };

    return (
        <>
            <Row gutter={16}>
                <Col xs={24} md={12}>
                    <CidrTags label="Deny CIDRs" tooltip="Explicitly blocked source networks — a match is rejected immediately." disabled={disabled} value={value.deny_cidrs} onChange={v => set({ deny_cidrs: v })} />
                </Col>
                <Col xs={24} md={12}>
                    <CidrTags label="Allow CIDRs (default-deny!)" tooltip="CAREFUL: when non-empty the policy becomes default-DENY — any source IP NOT in this list is blocked." disabled={disabled} value={value.allow_cidrs} onChange={v => set({ allow_cidrs: v })} />
                </Col>
            </Row>

            <FieldShell label="Threat Feeds" tooltip="Block lists loaded from files on the edge (never fetched at request time). Upload the feed in the Data Files tab, then reference it here." hint="A match blocks with the feed's severity.">
                {feeds.map((f, i) => (
                    <div key={i} style={{ border: '1px solid var(--border-default)', borderRadius: 8, padding: 8, marginBottom: 8 }}>
                        <Row gutter={8}>
                            <Col xs={24} md={5}>
                                <TextField label="Name" tooltip="Feed name shown in block reasons and metrics." placeholder="spamhaus" disabled={disabled} value={f.name} onChange={v => setFeed(i, { name: v })} />
                            </Col>
                            <Col xs={24} md={9}>
                                <DataFilePathField label="File" tooltip="Feed file path on the edge." disabled={disabled} value={f.file} onChange={v => setFeed(i, { file: v })} dataFiles={dataFiles} />
                            </Col>
                            <Col xs={24} md={5}>
                                <SelectField label="Format" tooltip="Feed file format." options={FEED_FORMATS} disabled={disabled} value={f.format} onChange={v => setFeed(i, { format: v })} />
                            </Col>
                            <Col xs={24} md={4}>
                                <SelectField label="Severity" tooltip="Rank of a match (default medium)." options={SEVERITIES} disabled={disabled} value={f.severity} onChange={v => setFeed(i, { severity: v })} />
                            </Col>
                            <Col xs={24} md={1} style={{ display: 'flex', alignItems: 'center' }}>
                                {!disabled && <Button type="text" danger size="small" icon={<DeleteOutlined />} onClick={() => set({ feeds: feeds.filter((_, j) => j !== i) })} />}
                            </Col>
                        </Row>
                    </div>
                ))}
                {!disabled && (
                    <Button size="small" type="dashed" icon={<PlusOutlined />} onClick={() => set({ feeds: [...feeds, {}] })}>
                        Add feed
                    </Button>
                )}
            </FieldShell>

            <Collapse
                size="small"
                ghost
                items={[{
                    key: 'geo',
                    label: <Text strong style={{ fontSize: 13 }}>GeoIP / ASN blocking{value.geoip ? ' (configured)' : ''}</Text>,
                    children: (
                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <DataFilePathField label="Country Database (.mmdb)" tooltip="MaxMind GeoLite2/GeoIP2 Country database on the edge." disabled={disabled} value={geo.database_file} onChange={v => setGeo({ database_file: v })} dataFiles={dataFiles} />
                                <TagsField label="Block Countries" tooltip="ISO 3166-1 alpha-2 codes to block (e.g. KP, RU)." placeholder="KP" disabled={disabled} value={geo.block_countries} onChange={v => setGeo({ block_countries: v })} />
                                <TagsField label="Allow Countries (default-deny!)" tooltip="When non-empty, any OTHER country is blocked." disabled={disabled} value={geo.allow_countries} onChange={v => setGeo({ allow_countries: v })} />
                            </Col>
                            <Col xs={24} md={12}>
                                <DataFilePathField label="ASN Database (.mmdb)" tooltip="MaxMind ASN database for AS-number blocking." disabled={disabled} value={geo.asn_database_file} onChange={v => setGeo({ asn_database_file: v })} dataFiles={dataFiles} />
                                <TagsField label="Block ASNs" tooltip="Autonomous system numbers to block (e.g. 64496)." disabled={disabled}
                                    value={geo.block_asns?.map(String)}
                                    onChange={v => setGeo({ block_asns: v?.map(Number).filter(n => !Number.isNaN(n)) })} />
                                <SelectField label="On Missing" tooltip="Behavior when an IP is not in the database." options={[
                                    { value: 'continue', label: 'continue (default)' },
                                    { value: 'block', label: 'block' },
                                ]} disabled={disabled} value={geo.on_missing} onChange={v => setGeo({ on_missing: v })} />
                            </Col>
                        </Row>
                    ),
                }]}
            />
        </>
    );
};

export const BotForm: React.FC<EngineFormProps<BotSpec>> = ({ value, onChange, disabled, dataFiles }) => {
    const set = (patch: Partial<BotSpec>) => onChange({ ...value, ...patch });
    const ua = value.user_agent ?? {};
    const tls = value.tls_fingerprint ?? {};
    const heur = value.heuristics ?? {};
    const verified = value.verified_bots ?? [];

    return (
        <>
            <Row gutter={16}>
                <Col xs={24} md={12}>
                    <NumberField label="Score Threshold" tooltip="Block when the accumulated bot score reaches this. 0/empty disables score-based blocking (hard-block layers still apply)." min={0} disabled={disabled} value={value.score_threshold} onChange={v => set({ score_threshold: v })} />
                </Col>
                <Col xs={24} md={12}>
                    <SwitchField label="Emit Score (anomaly mode)" tooltip="Instead of blocking at the threshold, contribute the bot score to the policy's anomaly aggregator." disabled={disabled} value={value.emit_score} onChange={v => set({ emit_score: v })} />
                </Col>
            </Row>
            <Row gutter={16}>
                <Col xs={24} md={12}>
                    <TagsField label="Deny User-Agent Substrings" tooltip="Requests whose UA contains any of these are hard-blocked (e.g. sqlmap, nikto)." placeholder="sqlmap" disabled={disabled} value={ua.deny_substrings} onChange={v => set({ user_agent: { ...ua, deny_substrings: v } })} />
                    <SwitchField label="Block Empty User-Agent" tooltip="Hard-block requests without a User-Agent header." disabled={disabled} value={ua.block_empty} onChange={v => set({ user_agent: { ...ua, block_empty: v } })} />
                    <NumberField label="Known-Bot Score" tooltip="Score added when the UA matches a known bot signature." min={0} disabled={disabled} value={ua.score_known_bot} onChange={v => set({ user_agent: { ...ua, score_known_bot: v } })} />
                </Col>
                <Col xs={24} md={12}>
                    <TagsField label="Deny JA4 Fingerprints" tooltip="TLS JA4 fingerprints to hard-block (supplied by Envoy via header)." disabled={disabled} value={tls.deny_ja4} onChange={v => set({ tls_fingerprint: { ...tls, deny_ja4: v } })} />
                    <TagsField label="Deny JA3 Fingerprints" tooltip="TLS JA3 fingerprints to hard-block." disabled={disabled} value={tls.deny_ja3} onChange={v => set({ tls_fingerprint: { ...tls, deny_ja3: v } })} />
                    <TagsField label="Tool JA4s" tooltip="JA4s of known tooling — matching adds score instead of hard-blocking." disabled={disabled} value={tls.tool_ja4} onChange={v => set({ tls_fingerprint: { ...tls, tool_ja4: v } })} />
                </Col>
            </Row>
            <Collapse
                size="small"
                ghost
                items={[
                    {
                        key: 'heuristics',
                        label: <Text strong style={{ fontSize: 13 }}>Header heuristics</Text>,
                        children: (
                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <SwitchField label="Require Accept" tooltip="Real browsers always send Accept — its absence adds score." disabled={disabled} value={heur.require_accept} onChange={v => set({ heuristics: { ...heur, require_accept: v } })} />
                                    <SwitchField label="Require Accept-Language" tooltip="Absence adds score." disabled={disabled} value={heur.require_accept_language} onChange={v => set({ heuristics: { ...heur, require_accept_language: v } })} />
                                </Col>
                                <Col xs={24} md={12}>
                                    <SwitchField label="Require Accept-Encoding" tooltip="Absence adds score." disabled={disabled} value={heur.require_accept_encoding} onChange={v => set({ heuristics: { ...heur, require_accept_encoding: v } })} />
                                    <NumberField label="Score per Anomaly" tooltip="Score added for each missing header above." min={0} disabled={disabled} value={heur.score_per_anomaly} onChange={v => set({ heuristics: { ...heur, score_per_anomaly: v } })} />
                                </Col>
                            </Row>
                        ),
                    },
                    {
                        key: 'verified',
                        label: <Text strong style={{ fontSize: 13 }}>Verified crawlers ({verified.length})</Text>,
                        children: (
                            <>
                                {verified.map((vb, i) => (
                                    <div key={i} style={{ border: '1px solid var(--border-default)', borderRadius: 8, padding: 8, marginBottom: 8 }}>
                                        <Row gutter={8}>
                                            <Col xs={24} md={5}>
                                                <TextField label="Name" tooltip="Crawler name (e.g. googlebot)." disabled={disabled} value={vb.name} onChange={v => set({ verified_bots: verified.map((x, j) => j === i ? { ...x, name: v } : x) })} />
                                            </Col>
                                            <Col xs={24} md={9}>
                                                <DataFilePathField label="IP Feed File" tooltip="The crawler's official IP ranges — a UA claiming this crawler from outside them is blocked." disabled={disabled} value={vb.file} onChange={v => set({ verified_bots: verified.map((x, j) => j === i ? { ...x, file: v } : x) })} dataFiles={dataFiles} />
                                            </Col>
                                            <Col xs={24} md={4}>
                                                <SelectField label="Format" tooltip="Feed format." options={FEED_FORMATS} disabled={disabled} value={vb.format} onChange={v => set({ verified_bots: verified.map((x, j) => j === i ? { ...x, format: v } : x) })} />
                                            </Col>
                                            <Col xs={24} md={5}>
                                                <TextField label="UA Match" tooltip="Substring identifying the crawler's User-Agent." placeholder="Googlebot" disabled={disabled} value={vb.ua_match} onChange={v => set({ verified_bots: verified.map((x, j) => j === i ? { ...x, ua_match: v } : x) })} />
                                            </Col>
                                            <Col xs={24} md={1} style={{ display: 'flex', alignItems: 'center' }}>
                                                {!disabled && <Button type="text" danger size="small" icon={<DeleteOutlined />} onClick={() => set({ verified_bots: verified.filter((_, j) => j !== i) })} />}
                                            </Col>
                                        </Row>
                                    </div>
                                ))}
                                {!disabled && (
                                    <Button size="small" type="dashed" icon={<PlusOutlined />} onClick={() => set({ verified_bots: [...verified, {}] })}>
                                        Add verified crawler
                                    </Button>
                                )}
                            </>
                        ),
                    },
                ]}
            />
        </>
    );
};
