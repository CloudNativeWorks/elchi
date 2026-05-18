/**
 * API Discovery — elchi-collector runtime config editor.
 *
 * Edits the `api_collector_config` singleton via the backend settings
 * endpoint (GET / PUT /api/v3/setting/api_discovery). The collector
 * polls that Mongo document and hot-reloads policy + detection.
 *
 * Contract notes (enforced by backend / collector):
 *  - The backend bumps `version` on every PUT — the collector's watch
 *    only reacts to a version change, so we never send `version`.
 *  - Pointer fields (store_raw_*, missing_hsts, weak_tls, response_size)
 *    treat "absent" as ENABLED for backwards compatibility. We always
 *    send explicit values so a user's "off" is never lost.
 *  - The collector runs Doc.Validate() and silently rejects an invalid
 *    doc — so we mirror the validation client-side before PUT.
 */

import React, { useEffect, useState } from 'react';
import {
    Card,
    Switch,
    InputNumber,
    Select,
    Input,
    Button,
    Typography,
    Spin,
    Space,
    Row,
    Col,
    Tag,
    Alert,
    Tooltip,
    Divider,
    message,
} from 'antd';
import {
    SaveOutlined,
    ReloadOutlined,
    ApiOutlined,
    InfoCircleOutlined,
    PlusOutlined,
    DeleteOutlined,
} from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { api, useCustomGetQuery } from '@/common/api';
import ComponentLoadErrorBoundary from '@/components/ComponentLoadErrorBoundary';
import ThreatIntelConfig from './ThreatIntelConfig';
import GeoIpConfig from './GeoIpConfig';

const { Title, Text } = Typography;

// ─── Types ───────────────────────────────────────────────────────────

interface DetectorWindow {
    enabled: boolean;
    threshold: number;
    window_seconds: number;
    // Detector-specific extras (only the named detector carries each).
    threshold_ip?: number;   // brute_force — IP-fallback threshold
    min_forbidden?: number;  // bola — 403/404s required before flagging
    skip_mtls?: boolean;     // geo_spread — exclude mTLS machine identities
}
interface ResponseSizeConfig {
    enabled: boolean;
    multiplier: number;
    min_baseline_bytes: number;
    min_event_bytes: number;
    warmup_samples: number;
    sigma: number;
    consecutive_n: number;
}
interface ToggleConfig {
    enabled: boolean;
}
// Self-learning anomaly detector — baselines latency + error-rate per
// endpoint and flags deviations.
interface BehaviorLatency {
    enabled: boolean;
    sigma: number;
    min_latency_ms: number;
    consecutive_n: number;
}
interface BehaviorErrorRate {
    enabled: boolean;
    fast_alpha: number;
    slow_alpha: number;
    multiplier: number;
    min_rate: number;
    consecutive_n: number;
}
interface BehaviorConfig {
    enabled: boolean;
    warmup_samples: number;
    startup_suppress_seconds: number;
    latency: BehaviorLatency;
    error_rate: BehaviorErrorRate;
}
// Operator-defined rule that rewrites a literal path segment matching
// `regex` into the chosen `{placeholder}` token.
interface PathNormalizePattern {
    regex: string;
    placeholder: string;
}
interface PolicyConfig {
    store_headers: boolean;
    header_allowlist: string[];
    hash_source_ip: boolean;
    hash_user_agent: boolean;
    store_raw_source_ip: boolean;
    store_raw_user_agent: boolean;
    ingest_deny_patterns: string[];
    trusted_proxy_cidrs: string[];
    path_normalize_patterns: PathNormalizePattern[];
}

// Placeholders the collector accepts (traversal is detector-only).
const NORMALIZE_PLACEHOLDERS = ['id', 'uuid', 'objectid', 'ulid', 'token', 'dynamic'] as const;
const MAX_NORMALIZE_PATTERNS = 64;
const MAX_NORMALIZE_REGEX_LEN = 256;
const MAX_NORMALIZE_QUANTIFIERS = 4;
interface DetectionConfig {
    detect_pii: boolean;
    extract_consumer_fingerprint: boolean;
    service_account_patterns: string[];
    bola: DetectorWindow;
    brute_force: DetectorWindow;
    rate_anomaly: DetectorWindow;
    payment_abuse: DetectorWindow;
    replay: DetectorWindow;
    path_scan: DetectorWindow;
    geo_spread: DetectorWindow;
    ip_rate: DetectorWindow;
    response_size: ResponseSizeConfig;
    behavior: BehaviorConfig;
    missing_hsts: ToggleConfig;
    weak_tls: ToggleConfig;
    weak_token_ttl_seconds: number;
}

interface SchemaEntry {
    _id?: string | number;
    id?: string | number;
    name?: string;
    applied_at?: string;
    [k: string]: unknown;
}
interface ApiDiscoveryConfigResponse {
    config: Record<string, unknown> | null;
    schema: { mongo: SchemaEntry | null; clickhouse: SchemaEntry | null };
}

// ─── Defaults (used when the collector has never written a config) ───

const win = (enabled: boolean, threshold: number, window_seconds: number): DetectorWindow => ({
    enabled,
    threshold,
    window_seconds,
});

const DEFAULT_POLICY: PolicyConfig = {
    store_headers: false,
    header_allowlist: ['content-type', 'user-agent', 'x-request-id'],
    hash_source_ip: true,
    hash_user_agent: true,
    store_raw_source_ip: true,
    store_raw_user_agent: true,
    ingest_deny_patterns: [],
    trusted_proxy_cidrs: [],
    path_normalize_patterns: [],
};

const DEFAULT_DETECTION: DetectionConfig = {
    detect_pii: true,
    extract_consumer_fingerprint: true,
    service_account_patterns: [],
    bola: { ...win(true, 50, 60), min_forbidden: 3 },
    brute_force: { ...win(true, 10, 60), threshold_ip: 100 },
    rate_anomaly: win(false, 1000, 60),
    payment_abuse: win(true, 10, 60),
    replay: win(true, 3, 300),
    path_scan: win(true, 40, 60),
    geo_spread: { ...win(true, 2, 3600), skip_mtls: true },
    ip_rate: win(false, 1000, 60),
    response_size: {
        enabled: true,
        multiplier: 10,
        min_baseline_bytes: 1024,
        min_event_bytes: 65536,
        warmup_samples: 10,
        sigma: 4,
        consecutive_n: 2,
    },
    behavior: {
        enabled: true,
        warmup_samples: 50,
        startup_suppress_seconds: 600,
        latency: { enabled: true, sigma: 5, min_latency_ms: 200, consecutive_n: 3 },
        error_rate: {
            enabled: true,
            fast_alpha: 0.3,
            slow_alpha: 0.02,
            multiplier: 3,
            min_rate: 0.25,
            consecutive_n: 2,
        },
    },
    missing_hsts: { enabled: true },
    weak_tls: { enabled: true },
    weak_token_ttl_seconds: 2592000,
};

// One detector-specific extra control beyond {enabled, threshold, window}.
interface DetectorExtra {
    field: 'threshold_ip' | 'min_forbidden' | 'skip_mtls';
    label: string;
    kind: 'number' | 'switch';
    hint: string;
}

// The 8 sliding-window behavioural detectors — each {enabled, threshold,
// window_seconds}. `unit` labels what the threshold counts; `extra` is an
// optional detector-specific knob.
const DETECTORS: {
    key: keyof DetectionConfig;
    label: string;
    unit: string;
    desc: string;
    extra?: DetectorExtra;
}[] = [
    {
        key: 'bola', label: 'BOLA', unit: 'distinct IDs',
        desc: 'One consumer enumerating many object IDs on a single endpoint (OWASP API1).',
        extra: { field: 'min_forbidden', label: 'Min forbidden', kind: 'number', hint: '403/404 responses required before enumeration is flagged.' },
    },
    {
        key: 'brute_force', label: 'Brute Force', unit: 'auth 4xx',
        desc: 'Repeated auth-endpoint failures from one consumer / IP (OWASP API2).',
        extra: { field: 'threshold_ip', label: 'IP threshold', kind: 'number', hint: 'Fallback threshold when no consumer identity is available — counts per source IP.' },
    },
    { key: 'rate_anomaly', label: 'Rate Anomaly', unit: 'requests', desc: 'A consumer exceeding the per-consumer request-rate threshold (OWASP API4).' },
    { key: 'payment_abuse', label: 'Payment Abuse', unit: 'requests', desc: 'A consumer hammering a payment endpoint beyond expected volume (OWASP API6).' },
    { key: 'replay', label: 'Replay', unit: 'duplicates', desc: 'The same request_id seen more than threshold times in the window.' },
    { key: 'path_scan', label: 'Path Scan', unit: 'distinct 4xx paths', desc: 'One IP/consumer hitting many distinct paths returning 4xx — content discovery.' },
    {
        key: 'geo_spread', label: 'Geo Spread', unit: 'countries',
        desc: 'One consumer/IP appearing from too many countries — impossible travel.',
        extra: { field: 'skip_mtls', label: 'Skip mTLS identities', kind: 'switch', hint: 'Exclude mTLS machine identities — they legitimately appear from many regions.' },
    },
    { key: 'ip_rate', label: 'IP Rate', unit: 'requests', desc: 'A single source IP exceeding the per-IP request-rate threshold.' },
];

// ─── Validation (mirrors collector Doc.Validate) ─────────────────────

const validate = (policy: PolicyConfig, detection: DetectionConfig): string | null => {
    for (const d of DETECTORS) {
        const w = detection[d.key] as DetectorWindow;
        if (w.threshold < 0 || w.window_seconds < 0) {
            return `${d.label}: threshold and window must not be negative.`;
        }
        if (w.enabled && (w.threshold <= 0 || w.window_seconds <= 0)) {
            return `${d.label} is enabled — threshold and window must both be greater than 0.`;
        }
    }
    const rs = detection.response_size;
    if (rs.enabled && (rs.multiplier <= 0 || rs.min_baseline_bytes < 0 || rs.min_event_bytes < 0 || rs.warmup_samples < 0)) {
        return 'Response Size: multiplier must be > 0 and the byte / warmup fields must not be negative.';
    }
    if (detection.weak_token_ttl_seconds < 0) {
        return 'Weak token TTL must be 0 (disabled) or a positive number of seconds.';
    }
    for (const p of policy.ingest_deny_patterns) {
        try {
            RegExp(p);
        } catch {
            return `Ingest deny pattern is not a valid regex: ${p}`;
        }
    }
    const normPatterns = policy.path_normalize_patterns.filter((p) => p.regex.trim() !== '');
    if (normPatterns.length > MAX_NORMALIZE_PATTERNS) {
        return `Path normalization: at most ${MAX_NORMALIZE_PATTERNS} patterns are allowed.`;
    }
    for (const p of normPatterns) {
        if (!(NORMALIZE_PLACEHOLDERS as readonly string[]).includes(p.placeholder)) {
            return `Path normalization: "${p.placeholder}" is not a valid placeholder.`;
        }
        if (p.regex.length > MAX_NORMALIZE_REGEX_LEN) {
            return `Path normalization: regex must be ${MAX_NORMALIZE_REGEX_LEN} characters or fewer.`;
        }
        if ((p.regex.match(/[+*?{]/g) ?? []).length > MAX_NORMALIZE_QUANTIFIERS) {
            return `Path normalization: regex "${p.regex}" has too many quantifiers (max ${MAX_NORMALIZE_QUANTIFIERS}).`;
        }
        try {
            RegExp(p.regex);
        } catch {
            return `Path normalization: not a valid regex: ${p.regex}`;
        }
    }
    return null;
};

// ─── Helpers ─────────────────────────────────────────────────────────

// Fill any missing keys from a partial server object with the defaults
// so the form always has every control bound. `fallback` carries the
// detector-specific extras (min_forbidden / threshold_ip / skip_mtls);
// the raw server values override when present.
const mergeWindow = (raw: unknown, fallback: DetectorWindow): DetectorWindow => {
    const r = (raw && typeof raw === 'object' ? raw : {}) as Partial<DetectorWindow>;
    return {
        ...fallback,
        ...r,
        enabled: r.enabled ?? fallback.enabled,
        threshold: r.threshold ?? fallback.threshold,
        window_seconds: r.window_seconds ?? fallback.window_seconds,
    };
};

const formatSeconds = (s: number): string => {
    if (s <= 0) return 'disabled';
    if (s % 86400 === 0) return `${s / 86400} day${s / 86400 === 1 ? '' : 's'}`;
    if (s % 3600 === 0) return `${s / 3600} hour${s / 3600 === 1 ? '' : 's'}`;
    if (s % 60 === 0) return `${s / 60} min`;
    return `${s} s`;
};

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
    typeof v === 'object' && v !== null && !Array.isArray(v);

// Deep-merge — form edits win, but any key the form does not render (a
// newer collector field) is carried through at every nesting level so a
// whole-sub-tree $set never silently drops it. Arrays are leaves.
const deepMerge = (raw: unknown, edited: unknown): unknown => {
    if (!isPlainObject(raw) || !isPlainObject(edited)) return edited;
    const out: Record<string, unknown> = { ...raw };
    for (const k of Object.keys(edited)) {
        out[k] =
            isPlainObject(raw[k]) && isPlainObject(edited[k])
                ? deepMerge(raw[k], edited[k])
                : edited[k];
    }
    return out;
};

// ─── Sub-components ──────────────────────────────────────────────────

const DetectorCard: React.FC<{
    label: string;
    unit: string;
    desc: string;
    value: DetectorWindow;
    disabled: boolean;
    extra?: DetectorExtra;
    // eslint-disable-next-line no-unused-vars
    onChange: (next: DetectorWindow) => void;
}> = ({ label, unit, desc, value, disabled, extra, onChange }) => (
    <Card
        size="small"
        style={{
            borderRadius: 8,
            height: '100%',
            opacity: value.enabled ? 1 : 0.7,
        }}
        styles={{ body: { padding: 12 } }}
    >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Space size={6}>
                <Text strong style={{ fontSize: 13 }}>{label}</Text>
                <Tooltip title={desc}>
                    <InfoCircleOutlined style={{ color: 'var(--text-tertiary)', fontSize: 12 }} />
                </Tooltip>
            </Space>
            <Switch
                size="small"
                checked={value.enabled}
                disabled={disabled}
                onChange={(v) => onChange({ ...value, enabled: v })}
            />
        </div>
        <Row gutter={8}>
            <Col span={12}>
                <Text type="secondary" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Threshold
                </Text>
                <InputNumber
                    size="small"
                    min={0}
                    style={{ width: '100%' }}
                    value={value.threshold}
                    disabled={disabled || !value.enabled}
                    onChange={(v) => onChange({ ...value, threshold: typeof v === 'number' ? v : 0 })}
                />
                <Text type="secondary" style={{ fontSize: 10 }}>{unit}</Text>
            </Col>
            <Col span={12}>
                <Text type="secondary" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Window
                </Text>
                <InputNumber
                    size="small"
                    min={0}
                    style={{ width: '100%' }}
                    value={value.window_seconds}
                    disabled={disabled || !value.enabled}
                    onChange={(v) => onChange({ ...value, window_seconds: typeof v === 'number' ? v : 0 })}
                />
                <Text type="secondary" style={{ fontSize: 10 }}>{formatSeconds(value.window_seconds)}</Text>
            </Col>
        </Row>
        {extra && (
            <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--border-default)' }}>
                {extra.kind === 'switch' ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Space size={6}>
                            <Text style={{ fontSize: 11.5 }}>{extra.label}</Text>
                            <Tooltip title={extra.hint}>
                                <InfoCircleOutlined style={{ color: 'var(--text-tertiary)', fontSize: 11 }} />
                            </Tooltip>
                        </Space>
                        <Switch
                            size="small"
                            checked={!!value[extra.field]}
                            disabled={disabled || !value.enabled}
                            onChange={(v) => onChange({ ...value, [extra.field]: v })}
                        />
                    </div>
                ) : (
                    <>
                        <Space size={6}>
                            <Text type="secondary" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                {extra.label}
                            </Text>
                            <Tooltip title={extra.hint}>
                                <InfoCircleOutlined style={{ color: 'var(--text-tertiary)', fontSize: 11 }} />
                            </Tooltip>
                        </Space>
                        <InputNumber
                            size="small"
                            min={0}
                            style={{ width: '100%' }}
                            value={(value[extra.field] as number) ?? 0}
                            disabled={disabled || !value.enabled}
                            onChange={(v) => onChange({ ...value, [extra.field]: typeof v === 'number' ? v : 0 })}
                        />
                    </>
                )}
            </div>
        )}
    </Card>
);

const ToggleRow: React.FC<{
    label: string;
    desc: string;
    checked: boolean;
    disabled: boolean;
    // eslint-disable-next-line no-unused-vars
    onChange: (v: boolean) => void;
}> = ({ label, desc, checked, disabled, onChange }) => (
    <div
        style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 0',
            borderBottom: '1px solid var(--border-default)',
            gap: 12,
        }}
    >
        <div>
            <Text style={{ fontSize: 13, fontWeight: 500 }}>{label}</Text>
            <div>
                <Text type="secondary" style={{ fontSize: 11 }}>{desc}</Text>
            </div>
        </div>
        <Switch checked={checked} disabled={disabled} onChange={onChange} />
    </div>
);

// ─── Main component ──────────────────────────────────────────────────

const ApiDiscoveryConfigInner: React.FC = () => {
    const [messageApi, contextHolder] = message.useMessage();

    const { data, isLoading, refetch, isFetching } = useCustomGetQuery({
        queryKey: 'setting-api-discovery',
        enabled: true,
        path: 'setting/api_discovery',
        refetchOnWindowFocus: false,
    }) as { data?: ApiDiscoveryConfigResponse; isLoading: boolean; refetch: () => void; isFetching: boolean };

    const [policy, setPolicy] = useState<PolicyConfig>(DEFAULT_POLICY);
    const [detection, setDetection] = useState<DetectionConfig>(DEFAULT_DETECTION);
    // Raw server sub-trees — kept so unknown / future keys round-trip
    // untouched on save.
    const [rawPolicy, setRawPolicy] = useState<Record<string, unknown>>({});
    const [rawDetection, setRawDetection] = useState<Record<string, unknown>>({});

    // Seed form state from the server document (or defaults when null).
    useEffect(() => {
        if (!data) return;
        const cfg = data.config;
        const p = (cfg?.policy ?? {}) as Record<string, unknown>;
        const d = (cfg?.detection ?? {}) as Record<string, unknown>;
        setRawPolicy(p);
        setRawDetection(d);
        setPolicy({
            store_headers: (p.store_headers as boolean) ?? DEFAULT_POLICY.store_headers,
            header_allowlist: (p.header_allowlist as string[]) ?? DEFAULT_POLICY.header_allowlist,
            hash_source_ip: (p.hash_source_ip as boolean) ?? DEFAULT_POLICY.hash_source_ip,
            hash_user_agent: (p.hash_user_agent as boolean) ?? DEFAULT_POLICY.hash_user_agent,
            store_raw_source_ip: (p.store_raw_source_ip as boolean) ?? DEFAULT_POLICY.store_raw_source_ip,
            store_raw_user_agent: (p.store_raw_user_agent as boolean) ?? DEFAULT_POLICY.store_raw_user_agent,
            ingest_deny_patterns: (p.ingest_deny_patterns as string[]) ?? [],
            trusted_proxy_cidrs: (p.trusted_proxy_cidrs as string[]) ?? [],
            path_normalize_patterns: Array.isArray(p.path_normalize_patterns)
                ? (p.path_normalize_patterns as unknown[]).map((e) => {
                      const o = (e && typeof e === 'object' ? e : {}) as Record<string, unknown>;
                      return {
                          regex: typeof o.regex === 'string' ? o.regex : '',
                          placeholder: typeof o.placeholder === 'string' ? o.placeholder : 'id',
                      };
                  })
                : [],
        });
        const rs = (d.response_size ?? {}) as Partial<ResponseSizeConfig>;
        const bh = (d.behavior ?? {}) as Partial<BehaviorConfig>;
        const bhLat = (bh.latency ?? {}) as Partial<BehaviorLatency>;
        const bhErr = (bh.error_rate ?? {}) as Partial<BehaviorErrorRate>;
        const DB = DEFAULT_DETECTION.behavior;
        setDetection({
            detect_pii: (d.detect_pii as boolean) ?? DEFAULT_DETECTION.detect_pii,
            extract_consumer_fingerprint:
                (d.extract_consumer_fingerprint as boolean) ?? DEFAULT_DETECTION.extract_consumer_fingerprint,
            service_account_patterns: (d.service_account_patterns as string[]) ?? [],
            bola: mergeWindow(d.bola, DEFAULT_DETECTION.bola),
            brute_force: mergeWindow(d.brute_force, DEFAULT_DETECTION.brute_force),
            rate_anomaly: mergeWindow(d.rate_anomaly, DEFAULT_DETECTION.rate_anomaly),
            payment_abuse: mergeWindow(d.payment_abuse, DEFAULT_DETECTION.payment_abuse),
            replay: mergeWindow(d.replay, DEFAULT_DETECTION.replay),
            path_scan: mergeWindow(d.path_scan, DEFAULT_DETECTION.path_scan),
            geo_spread: mergeWindow(d.geo_spread, DEFAULT_DETECTION.geo_spread),
            ip_rate: mergeWindow(d.ip_rate, DEFAULT_DETECTION.ip_rate),
            response_size: {
                enabled: rs.enabled ?? DEFAULT_DETECTION.response_size.enabled,
                multiplier: rs.multiplier ?? DEFAULT_DETECTION.response_size.multiplier,
                min_baseline_bytes: rs.min_baseline_bytes ?? DEFAULT_DETECTION.response_size.min_baseline_bytes,
                min_event_bytes: rs.min_event_bytes ?? DEFAULT_DETECTION.response_size.min_event_bytes,
                warmup_samples: rs.warmup_samples ?? DEFAULT_DETECTION.response_size.warmup_samples,
                sigma: rs.sigma ?? DEFAULT_DETECTION.response_size.sigma,
                consecutive_n: rs.consecutive_n ?? DEFAULT_DETECTION.response_size.consecutive_n,
            },
            behavior: {
                enabled: bh.enabled ?? DB.enabled,
                warmup_samples: bh.warmup_samples ?? DB.warmup_samples,
                startup_suppress_seconds: bh.startup_suppress_seconds ?? DB.startup_suppress_seconds,
                latency: {
                    enabled: bhLat.enabled ?? DB.latency.enabled,
                    sigma: bhLat.sigma ?? DB.latency.sigma,
                    min_latency_ms: bhLat.min_latency_ms ?? DB.latency.min_latency_ms,
                    consecutive_n: bhLat.consecutive_n ?? DB.latency.consecutive_n,
                },
                error_rate: {
                    enabled: bhErr.enabled ?? DB.error_rate.enabled,
                    fast_alpha: bhErr.fast_alpha ?? DB.error_rate.fast_alpha,
                    slow_alpha: bhErr.slow_alpha ?? DB.error_rate.slow_alpha,
                    multiplier: bhErr.multiplier ?? DB.error_rate.multiplier,
                    min_rate: bhErr.min_rate ?? DB.error_rate.min_rate,
                    consecutive_n: bhErr.consecutive_n ?? DB.error_rate.consecutive_n,
                },
            },
            missing_hsts: {
                enabled: ((d.missing_hsts ?? {}) as ToggleConfig).enabled ?? DEFAULT_DETECTION.missing_hsts.enabled,
            },
            weak_tls: {
                enabled: ((d.weak_tls ?? {}) as ToggleConfig).enabled ?? DEFAULT_DETECTION.weak_tls.enabled,
            },
            weak_token_ttl_seconds:
                (d.weak_token_ttl_seconds as number) ?? DEFAULT_DETECTION.weak_token_ttl_seconds,
        });
    }, [data]);

    const cfgVersion = (data?.config?.version as number) ?? null;
    const updatedBy = (data?.config?.updated_by as string) ?? null;
    const updatedAt = (data?.config?.updated_at as string) ?? null;

    const saveMutation = useMutation({
        mutationFn: async () => {
            // Whole-object PUT — the backend $sets each sub-tree verbatim
            // and bumps `version`. deepMerge the raw server objects with
            // the form state so any key the form does not render (a newer
            // collector field) survives the round-trip at every depth.
            const detectionBody = deepMerge(rawDetection, detection) as Record<string, unknown>;
            // custom_rules was removed from the collector — drop it so the
            // whole-sub-tree $set clears any leftover from an old document.
            delete detectionBody.custom_rules;
            // Drop blank-regex rows — the collector skips them anyway.
            const cleanedPolicy: PolicyConfig = {
                ...policy,
                path_normalize_patterns: policy.path_normalize_patterns
                    .filter((p) => p.regex.trim() !== '')
                    .map((p) => ({ regex: p.regex.trim(), placeholder: p.placeholder })),
            };
            const body = {
                policy: deepMerge(rawPolicy, cleanedPolicy),
                detection: detectionBody,
            };
            const res = await api.put('/api/v3/setting/api_discovery', body);
            return res.data;
        },
        onSuccess: () => {
            messageApi.success('Collector configuration saved — the collector applies it within ~2 min.');
            refetch();
        },
        onError: (error: any) => {
            const status = error?.response?.status;
            if (status === 403) {
                messageApi.error('Only an Admin or Owner can change the collector configuration.');
                return;
            }
            messageApi.error(
                error?.response?.data?.message || error?.message || 'Failed to save configuration',
            );
        },
    });

    const onSave = () => {
        const err = validate(policy, detection);
        if (err) {
            messageApi.error(err);
            return;
        }
        saveMutation.mutate();
    };

    if (isLoading) {
        return (
            <div style={{ textAlign: 'center', padding: 80 }}>
                <Spin />
            </div>
        );
    }

    const saving = saveMutation.isPending;

    return (
        <div>
            {contextHolder}

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
                <Space>
                    <ApiOutlined style={{ color: 'var(--color-primary)', fontSize: 20 }} />
                    <div>
                        <Title level={5} style={{ margin: 0 }}>API Discovery — Collector Config</Title>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Runtime policy &amp; detection for elchi-collector. Applied within ~2 min of saving.
                        </Text>
                    </div>
                </Space>
                <Space wrap>
                    {cfgVersion !== null && (
                        <Tag color="geekblue" style={{ margin: 0 }}>version {cfgVersion}</Tag>
                    )}
                    <Button icon={<ReloadOutlined spin={isFetching} />} onClick={() => refetch()}>
                        Reload
                    </Button>
                </Space>
            </div>

            {!data?.config && (
                <Alert
                    type="info"
                    showIcon
                    style={{ marginBottom: 12 }}
                    message="The collector has not written a config yet"
                    description="The form below is pre-filled with the collector defaults. Saving creates the configuration document (version 1)."
                />
            )}
            {updatedBy && (
                <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 12 }}>
                    Last updated by <strong>{updatedBy}</strong>
                    {updatedAt ? ` · ${new Date(updatedAt).toLocaleString()}` : ''}
                </Text>
            )}

            <Row gutter={[12, 12]}>
                {/* ── Policy ────────────────────────────────────────── */}
                <Col xs={24} lg={10}>
                    <Card
                        size="small"
                        title="Policy"
                        style={{ borderRadius: 10, height: '100%' }}
                        styles={{ body: { padding: '4px 14px 14px' } }}
                    >
                        <ToggleRow
                            label="Store request headers"
                            desc="Persist the allow-listed request headers on each event."
                            checked={policy.store_headers}
                            disabled={saving}
                            onChange={(v) => setPolicy({ ...policy, store_headers: v })}
                        />
                        <div style={{ padding: '10px 0', borderBottom: '1px solid var(--border-default)' }}>
                            <Text style={{ fontSize: 13, fontWeight: 500 }}>Header allow-list</Text>
                            <div>
                                <Text type="secondary" style={{ fontSize: 11 }}>
                                    Only these headers are stored (when "Store request headers" is on).
                                </Text>
                            </div>
                            <Select
                                mode="tags"
                                style={{ width: '100%', marginTop: 6 }}
                                placeholder="content-type, user-agent…"
                                value={policy.header_allowlist}
                                disabled={saving}
                                tokenSeparators={[',', ' ']}
                                onChange={(v) =>
                                    setPolicy({ ...policy, header_allowlist: v.map((h) => h.toLowerCase()) })
                                }
                            />
                        </div>
                        <ToggleRow
                            label="Hash source IP"
                            desc="Store a salted hash instead of the raw client IP."
                            checked={policy.hash_source_ip}
                            disabled={saving}
                            onChange={(v) => setPolicy({ ...policy, hash_source_ip: v })}
                        />
                        <ToggleRow
                            label="Hash user-agent"
                            desc="Store a salted hash instead of the raw User-Agent string."
                            checked={policy.hash_user_agent}
                            disabled={saving}
                            onChange={(v) => setPolicy({ ...policy, hash_user_agent: v })}
                        />
                        <ToggleRow
                            label="Store raw source IP"
                            desc="Keep the un-hashed source IP (needed for the geo / raw-IP filters). Compliance-sensitive."
                            checked={policy.store_raw_source_ip}
                            disabled={saving}
                            onChange={(v) => setPolicy({ ...policy, store_raw_source_ip: v })}
                        />
                        <ToggleRow
                            label="Store raw user-agent"
                            desc="Keep the un-hashed User-Agent string (needed for the raw-UA filters)."
                            checked={policy.store_raw_user_agent}
                            disabled={saving}
                            onChange={(v) => setPolicy({ ...policy, store_raw_user_agent: v })}
                        />
                        <div style={{ paddingTop: 10 }}>
                            <Text style={{ fontSize: 13, fontWeight: 500 }}>Ingest deny patterns</Text>
                            <div>
                                <Text type="secondary" style={{ fontSize: 11 }}>
                                    Regular expressions — matching paths are dropped before storage.
                                </Text>
                            </div>
                            <Select
                                mode="tags"
                                style={{ width: '100%', marginTop: 6 }}
                                placeholder="^/healthz$ …"
                                value={policy.ingest_deny_patterns}
                                disabled={saving}
                                tokenSeparators={['\n']}
                                onChange={(v) => setPolicy({ ...policy, ingest_deny_patterns: v })}
                            />
                        </div>
                        <div style={{ paddingTop: 14 }}>
                            <Text style={{ fontSize: 13, fontWeight: 500 }}>Trusted proxy CIDRs</Text>
                            <div>
                                <Text type="secondary" style={{ fontSize: 11 }}>
                                    NAT / CGNAT / load-balancer egress ranges — IPs inside them are not
                                    treated as distinct clients (IPv4 / IPv6 CIDR).
                                </Text>
                            </div>
                            <Select
                                mode="tags"
                                style={{ width: '100%', marginTop: 6 }}
                                placeholder="10.0.0.0/8, 2001:db8::/32 …"
                                value={policy.trusted_proxy_cidrs}
                                disabled={saving}
                                tokenSeparators={[',', ' ', '\n']}
                                onChange={(v) => setPolicy({ ...policy, trusted_proxy_cidrs: v })}
                            />
                        </div>
                        <div style={{ paddingTop: 14 }}>
                            <Text style={{ fontSize: 13, fontWeight: 500 }}>
                                Path normalization patterns
                            </Text>
                            <div>
                                <Text type="secondary" style={{ fontSize: 11 }}>
                                    When the built-in detectors leave an ID-like segment literal,
                                    your regex rewrites it to the chosen placeholder. Matches a whole
                                    segment — no <code>^</code>/<code>$</code> needed. Example:{' '}
                                    <code>TK-\d+</code> → <code>{'/api/orders/{id}'}</code>
                                </Text>
                            </div>
                            {policy.path_normalize_patterns.map((p, i) => (
                                <Space.Compact key={i} style={{ display: 'flex', marginTop: 6 }}>
                                    <Input
                                        placeholder="TK-\d+"
                                        value={p.regex}
                                        disabled={saving}
                                        onChange={(e) => {
                                            const next = [...policy.path_normalize_patterns];
                                            next[i] = { ...next[i], regex: e.target.value };
                                            setPolicy({ ...policy, path_normalize_patterns: next });
                                        }}
                                    />
                                    <Select
                                        style={{ width: 132 }}
                                        value={p.placeholder}
                                        disabled={saving}
                                        options={NORMALIZE_PLACEHOLDERS.map((v) => ({
                                            value: v,
                                            label: `{${v}}`,
                                        }))}
                                        onChange={(v) => {
                                            const next = [...policy.path_normalize_patterns];
                                            next[i] = { ...next[i], placeholder: v };
                                            setPolicy({ ...policy, path_normalize_patterns: next });
                                        }}
                                    />
                                    <Button
                                        icon={<DeleteOutlined />}
                                        disabled={saving}
                                        onClick={() =>
                                            setPolicy({
                                                ...policy,
                                                path_normalize_patterns:
                                                    policy.path_normalize_patterns.filter(
                                                        (_, j) => j !== i,
                                                    ),
                                            })
                                        }
                                    />
                                </Space.Compact>
                            ))}
                            <Button
                                size="small"
                                icon={<PlusOutlined />}
                                disabled={
                                    saving ||
                                    policy.path_normalize_patterns.length >= MAX_NORMALIZE_PATTERNS
                                }
                                style={{ marginTop: 8 }}
                                onClick={() =>
                                    setPolicy({
                                        ...policy,
                                        path_normalize_patterns: [
                                            ...policy.path_normalize_patterns,
                                            { regex: '', placeholder: 'id' },
                                        ],
                                    })
                                }
                            >
                                Add pattern
                            </Button>
                        </div>
                    </Card>
                </Col>

                {/* ── Detection ─────────────────────────────────────── */}
                <Col xs={24} lg={14}>
                    <Card
                        size="small"
                        title="Detection"
                        style={{ borderRadius: 10, height: '100%' }}
                        styles={{ body: { padding: '4px 14px 14px' } }}
                    >
                        <ToggleRow
                            label="PII detection"
                            desc="Scan request paths for email, phone, SSN, credit-card, IBAN patterns."
                            checked={detection.detect_pii}
                            disabled={saving}
                            onChange={(v) => setDetection({ ...detection, detect_pii: v })}
                        />
                        <ToggleRow
                            label="Consumer fingerprinting"
                            desc="Derive a consumer identity from JWT sub / mTLS subject for per-consumer detectors."
                            checked={detection.extract_consumer_fingerprint}
                            disabled={saving}
                            onChange={(v) => setDetection({ ...detection, extract_consumer_fingerprint: v })}
                        />
                        <div style={{ padding: '10px 0 2px' }}>
                            <Text style={{ fontSize: 13, fontWeight: 500 }}>Service-account patterns</Text>
                            <div>
                                <Text type="secondary" style={{ fontSize: 11 }}>
                                    JWT-subject substrings — matching consumers are excluded from
                                    geo-spread (machine identities legitimately roam regions).
                                </Text>
                            </div>
                            <Select
                                mode="tags"
                                style={{ width: '100%', marginTop: 6 }}
                                placeholder="svc-, -worker, ci@ …"
                                value={detection.service_account_patterns}
                                disabled={saving}
                                tokenSeparators={[',', ' ', '\n']}
                                onChange={(v) => setDetection({ ...detection, service_account_patterns: v })}
                            />
                        </div>

                        <Divider style={{ margin: '12px 0 10px' }} orientation="left" orientationMargin={0}>
                            <Text type="secondary" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                Behavioural detectors
                            </Text>
                        </Divider>
                        <Row gutter={[10, 10]}>
                            {DETECTORS.map((d) => (
                                <Col key={d.key} xs={24} sm={12}>
                                    <DetectorCard
                                        label={d.label}
                                        unit={d.unit}
                                        desc={d.desc}
                                        extra={d.extra}
                                        value={detection[d.key] as DetectorWindow}
                                        disabled={saving}
                                        onChange={(next) => setDetection({ ...detection, [d.key]: next })}
                                    />
                                </Col>
                            ))}
                        </Row>

                        <Divider style={{ margin: '14px 0 10px' }} orientation="left" orientationMargin={0}>
                            <Text type="secondary" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                Response-size anomaly
                            </Text>
                        </Divider>
                        <Card size="small" style={{ borderRadius: 8, opacity: detection.response_size.enabled ? 1 : 0.7 }} styles={{ body: { padding: 12 } }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                <Space size={6}>
                                    <Text strong style={{ fontSize: 13 }}>Oversized response</Text>
                                    <Tooltip title="Flags a response whose body is `multiplier`× the endpoint's rolling baseline — a data-exfiltration canary.">
                                        <InfoCircleOutlined style={{ color: 'var(--text-tertiary)', fontSize: 12 }} />
                                    </Tooltip>
                                </Space>
                                <Switch
                                    size="small"
                                    checked={detection.response_size.enabled}
                                    disabled={saving}
                                    onChange={(v) =>
                                        setDetection({ ...detection, response_size: { ...detection.response_size, enabled: v } })
                                    }
                                />
                            </div>
                            <Row gutter={[8, 8]}>
                                {([
                                    ['multiplier', 'Multiplier', '×'],
                                    ['sigma', 'Sigma', 'σ'],
                                    ['consecutive_n', 'Consecutive', 'events'],
                                    ['min_baseline_bytes', 'Min baseline', 'bytes'],
                                    ['min_event_bytes', 'Min event', 'bytes'],
                                    ['warmup_samples', 'Warm-up', 'samples'],
                                ] as const).map(([field, label, unit]) => (
                                    <Col key={field} xs={12} md={8}>
                                        <Text type="secondary" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                            {label}
                                        </Text>
                                        <InputNumber
                                            size="small"
                                            min={0}
                                            style={{ width: '100%' }}
                                            value={detection.response_size[field]}
                                            disabled={saving || !detection.response_size.enabled}
                                            onChange={(v) =>
                                                setDetection({
                                                    ...detection,
                                                    response_size: {
                                                        ...detection.response_size,
                                                        [field]: typeof v === 'number' ? v : 0,
                                                    },
                                                })
                                            }
                                        />
                                        <Text type="secondary" style={{ fontSize: 10 }}>{unit}</Text>
                                    </Col>
                                ))}
                            </Row>
                        </Card>

                        <Divider style={{ margin: '14px 0 10px' }} orientation="left" orientationMargin={0}>
                            <Text type="secondary" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                Behavioural anomaly (self-learning)
                            </Text>
                        </Divider>
                        <Card size="small" style={{ borderRadius: 8, opacity: detection.behavior.enabled ? 1 : 0.7 }} styles={{ body: { padding: 12 } }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                <Space size={6}>
                                    <Text strong style={{ fontSize: 13 }}>Behavioural baseline</Text>
                                    <Tooltip title="Per-endpoint self-learning detector — baselines latency and error-rate over a warm-up window, then flags statistically significant deviations.">
                                        <InfoCircleOutlined style={{ color: 'var(--text-tertiary)', fontSize: 12 }} />
                                    </Tooltip>
                                </Space>
                                <Switch
                                    size="small"
                                    checked={detection.behavior.enabled}
                                    disabled={saving}
                                    onChange={(v) =>
                                        setDetection({ ...detection, behavior: { ...detection.behavior, enabled: v } })
                                    }
                                />
                            </div>
                            <Row gutter={[8, 8]}>
                                <Col xs={12} md={6}>
                                    <Text type="secondary" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                        Warm-up
                                    </Text>
                                    <InputNumber
                                        size="small"
                                        min={0}
                                        style={{ width: '100%' }}
                                        value={detection.behavior.warmup_samples}
                                        disabled={saving || !detection.behavior.enabled}
                                        onChange={(v) =>
                                            setDetection({
                                                ...detection,
                                                behavior: { ...detection.behavior, warmup_samples: typeof v === 'number' ? v : 0 },
                                            })
                                        }
                                    />
                                    <Text type="secondary" style={{ fontSize: 10 }}>samples</Text>
                                </Col>
                                <Col xs={12} md={9}>
                                    <Space size={6}>
                                        <Text type="secondary" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                            Startup suppress
                                        </Text>
                                        <Tooltip title="After a config reload the detector only learns — no alerts — for this many seconds.">
                                            <InfoCircleOutlined style={{ color: 'var(--text-tertiary)', fontSize: 11 }} />
                                        </Tooltip>
                                    </Space>
                                    <InputNumber
                                        size="small"
                                        min={0}
                                        style={{ width: '100%' }}
                                        value={detection.behavior.startup_suppress_seconds}
                                        disabled={saving || !detection.behavior.enabled}
                                        onChange={(v) =>
                                            setDetection({
                                                ...detection,
                                                behavior: { ...detection.behavior, startup_suppress_seconds: typeof v === 'number' ? v : 0 },
                                            })
                                        }
                                    />
                                    <Text type="secondary" style={{ fontSize: 10 }}>
                                        {formatSeconds(detection.behavior.startup_suppress_seconds)}
                                    </Text>
                                </Col>
                            </Row>

                            {/* Latency sub-detector */}
                            <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid var(--border-default)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                    <Text style={{ fontSize: 12, fontWeight: 500 }}>Latency baseline</Text>
                                    <Switch
                                        size="small"
                                        checked={detection.behavior.latency.enabled}
                                        disabled={saving || !detection.behavior.enabled}
                                        onChange={(v) =>
                                            setDetection({
                                                ...detection,
                                                behavior: {
                                                    ...detection.behavior,
                                                    latency: { ...detection.behavior.latency, enabled: v },
                                                },
                                            })
                                        }
                                    />
                                </div>
                                <Row gutter={[8, 8]}>
                                    {([
                                        ['sigma', 'Sigma', 'σ', 0.1],
                                        ['min_latency_ms', 'Min latency', 'ms', 1],
                                        ['consecutive_n', 'Consecutive', 'breaches', 1],
                                    ] as const).map(([field, label, unit, step]) => (
                                        <Col key={field} xs={12} md={8}>
                                            <Text type="secondary" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                                {label}
                                            </Text>
                                            <InputNumber
                                                size="small"
                                                min={0}
                                                step={step}
                                                style={{ width: '100%' }}
                                                value={detection.behavior.latency[field]}
                                                disabled={saving || !detection.behavior.enabled || !detection.behavior.latency.enabled}
                                                onChange={(v) =>
                                                    setDetection({
                                                        ...detection,
                                                        behavior: {
                                                            ...detection.behavior,
                                                            latency: {
                                                                ...detection.behavior.latency,
                                                                [field]: typeof v === 'number' ? v : 0,
                                                            },
                                                        },
                                                    })
                                                }
                                            />
                                            <Text type="secondary" style={{ fontSize: 10 }}>{unit}</Text>
                                        </Col>
                                    ))}
                                </Row>
                            </div>

                            {/* Error-rate sub-detector */}
                            <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid var(--border-default)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                    <Text style={{ fontSize: 12, fontWeight: 500 }}>Error-rate baseline</Text>
                                    <Switch
                                        size="small"
                                        checked={detection.behavior.error_rate.enabled}
                                        disabled={saving || !detection.behavior.enabled}
                                        onChange={(v) =>
                                            setDetection({
                                                ...detection,
                                                behavior: {
                                                    ...detection.behavior,
                                                    error_rate: { ...detection.behavior.error_rate, enabled: v },
                                                },
                                            })
                                        }
                                    />
                                </div>
                                <Row gutter={[8, 8]}>
                                    {([
                                        ['fast_alpha', 'Fast α', '', 0.01],
                                        ['slow_alpha', 'Slow α', '', 0.01],
                                        ['multiplier', 'Multiplier', '×', 0.1],
                                        ['min_rate', 'Min rate', '', 0.01],
                                        ['consecutive_n', 'Consecutive', 'breaches', 1],
                                    ] as const).map(([field, label, unit, step]) => (
                                        <Col key={field} xs={12} md={6}>
                                            <Text type="secondary" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                                {label}
                                            </Text>
                                            <InputNumber
                                                size="small"
                                                min={0}
                                                step={step}
                                                style={{ width: '100%' }}
                                                value={detection.behavior.error_rate[field]}
                                                disabled={saving || !detection.behavior.enabled || !detection.behavior.error_rate.enabled}
                                                onChange={(v) =>
                                                    setDetection({
                                                        ...detection,
                                                        behavior: {
                                                            ...detection.behavior,
                                                            error_rate: {
                                                                ...detection.behavior.error_rate,
                                                                [field]: typeof v === 'number' ? v : 0,
                                                            },
                                                        },
                                                    })
                                                }
                                            />
                                            {unit && <Text type="secondary" style={{ fontSize: 10 }}>{unit}</Text>}
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        </Card>

                        <Divider style={{ margin: '14px 0 10px' }} orientation="left" orientationMargin={0}>
                            <Text type="secondary" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                Transport &amp; token checks
                            </Text>
                        </Divider>
                        <ToggleRow
                            label="Missing HSTS"
                            desc="Flag 2xx HTTPS responses that omit the Strict-Transport-Security header."
                            checked={detection.missing_hsts.enabled}
                            disabled={saving}
                            onChange={(v) => setDetection({ ...detection, missing_hsts: { enabled: v } })}
                        />
                        <ToggleRow
                            label="Weak TLS"
                            desc="Flag connections negotiated over TLS 1.0 / 1.1."
                            checked={detection.weak_tls.enabled}
                            disabled={saving}
                            onChange={(v) => setDetection({ ...detection, weak_tls: { enabled: v } })}
                        />
                        <div style={{ paddingTop: 10 }}>
                            <Space size={6}>
                                <Text style={{ fontSize: 13, fontWeight: 500 }}>Weak token TTL threshold</Text>
                                <Tooltip title="A JWT whose lifetime (exp − iat) exceeds this many seconds is flagged. 0 disables the check.">
                                    <InfoCircleOutlined style={{ color: 'var(--text-tertiary)', fontSize: 12 }} />
                                </Tooltip>
                            </Space>
                            <div style={{ marginTop: 4 }}>
                                <InputNumber
                                    min={0}
                                    style={{ width: 200 }}
                                    value={detection.weak_token_ttl_seconds}
                                    disabled={saving}
                                    addonAfter="seconds"
                                    onChange={(v) =>
                                        setDetection({
                                            ...detection,
                                            weak_token_ttl_seconds: typeof v === 'number' ? v : 0,
                                        })
                                    }
                                />
                                <Text type="secondary" style={{ fontSize: 11, marginLeft: 8 }}>
                                    {formatSeconds(detection.weak_token_ttl_seconds)}
                                </Text>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Save bar */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
                <Button onClick={() => refetch()} disabled={saving}>
                    Discard changes
                </Button>
                <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={onSave}>
                    Save configuration
                </Button>
            </div>

            {/* Threat-Intel feeds — a separate collector singleton with its
                own version / save flow; grouped under the same tab. */}
            <Divider style={{ margin: '28px 0 16px' }} />
            <ThreatIntelConfig />

            {/* GeoIP MMDB databases — GridFS-backed, also self-managed. */}
            <Divider style={{ margin: '28px 0 16px' }} />
            <GeoIpConfig />
        </div>
    );
};

// Isolate the editor behind an error boundary — a malformed config
// document must never take down the whole Settings page.
const ApiDiscoveryConfig: React.FC = () => (
    <ComponentLoadErrorBoundary componentName="API Discovery Settings">
        <ApiDiscoveryConfigInner />
    </ComponentLoadErrorBoundary>
);

export default ApiDiscoveryConfig;
