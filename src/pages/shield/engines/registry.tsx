/**
 * Engine registry: every shield security engine as a toggleable card with a
 * dedicated form. Each def knows how to read/write its value inside a
 * PolicySpec immutably — note DLP lives at checks.body.dlp on the wire (it is
 * a built-in body check), but is presented alongside engines for UX.
 */

import React from 'react';
import { EnginesSpec, PolicySpec } from '../state/model';
import type { EngineFormProps } from './forms/authForms';
import { ApiKeyForm, HmacSignForm, HttpSigForm, JwksForm, JwtForm, XfccForm } from './forms/authForms';
import { BotForm, IpReputationForm, RateLimitForm } from './forms/trafficForms';
import { CorazaForm, DlpForm, GraphqlForm, OpenApiForm } from './forms/contentForms';

export interface EngineDef {
    key: string;
    label: string;
    /** header = cheap, never buffers the body; body = buffers/inspects bodies. */
    phase: 'header' | 'body';
    group: 'Authentication' | 'Traffic Control' | 'Content Inspection';
    description: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Form: React.FC<EngineFormProps<any>>;
    get: (p: PolicySpec) => object | undefined;
    set: (p: PolicySpec, v: object | undefined) => PolicySpec;
}

/** Helper for the 12 real engines living under spec.engines.<key>. */
const engineSlot = (key: keyof EnginesSpec) => ({
    get: (p: PolicySpec) => p.engines?.[key] as object | undefined,
    set: (p: PolicySpec, v: object | undefined): PolicySpec => {
        const engines = { ...(p.engines ?? {}) } as EnginesSpec;
        if (v === undefined) {
            delete engines[key];
        } else {
            (engines as Record<string, object>)[key] = v;
        }
        return { ...p, engines: Object.keys(engines).length ? engines : undefined };
    },
});

export const ENGINE_DEFS: EngineDef[] = [
    {
        key: 'jwt', label: 'JWT', phase: 'header', group: 'Authentication',
        description: 'Require a valid JWT (issuer/audience/algorithm/claims) verified against a public key or HMAC secret.',
        Form: JwtForm, ...engineSlot('jwt'),
    },
    {
        key: 'jwks', label: 'JWKS', phase: 'header', group: 'Authentication',
        description: 'Validate RS256/ES256 JWTs against a JWK Set from a URL (background-refreshed) or a local file.',
        Form: JwksForm, ...engineSlot('jwks'),
    },
    {
        key: 'api_key', label: 'API Key', phase: 'header', group: 'Authentication',
        description: 'Authenticate by API key (stored hashed) with optional scope→path restrictions.',
        Form: ApiKeyForm, ...engineSlot('api_key'),
    },
    {
        key: 'hmac_sign', label: 'HMAC Signing', phase: 'header', group: 'Authentication',
        description: 'Require HMAC-signed requests: timestamp window + nonce replay protection + optional body digest.',
        Form: HmacSignForm, ...engineSlot('hmac_sign'),
    },
    {
        key: 'http_signature', label: 'HTTP Signature (RFC 9421)', phase: 'header', group: 'Authentication',
        description: 'Verify standard HTTP Message Signatures (hmac-sha256) over selected message components.',
        Form: HttpSigForm, ...engineSlot('http_signature'),
    },
    {
        key: 'xfcc', label: 'mTLS Identity (XFCC)', phase: 'header', group: 'Authentication',
        description: "Authenticate by the client certificate Envoy forwards: SPIFFE/DNS/subject/fingerprint allow-lists.",
        Form: XfccForm, ...engineSlot('xfcc'),
    },
    {
        key: 'ip_reputation', label: 'IP Reputation', phase: 'header', group: 'Traffic Control',
        description: 'Block by source IP: CIDR deny/allow lists, threat-intel feed files, GeoIP country/ASN rules.',
        Form: IpReputationForm, ...engineSlot('ip_reputation'),
    },
    {
        key: 'rate_limit', label: 'Rate Limit', phase: 'header', group: 'Traffic Control',
        description: 'Token-bucket rate limiting per client IP, host, or header value.',
        Form: RateLimitForm, ...engineSlot('rate_limit'),
    },
    {
        key: 'bot', label: 'Bot Detection', phase: 'header', group: 'Traffic Control',
        description: 'Layered bot scoring: User-Agent rules, verified-crawler IP checks, JA3/JA4 TLS fingerprints, header heuristics.',
        Form: BotForm, ...engineSlot('bot'),
    },
    {
        key: 'coraza', label: 'WAF — Coraza / OWASP CRS', phase: 'body', group: 'Content Inspection',
        description: 'Full web application firewall with the embedded OWASP Core Rule Set. Inspects request (and response) bodies.',
        Form: CorazaForm, ...engineSlot('coraza'),
    },
    {
        key: 'graphql', label: 'GraphQL Guard', phase: 'body', group: 'Content Inspection',
        description: 'Bound GraphQL query depth/aliases/fields/batch size and block introspection.',
        Form: GraphqlForm, ...engineSlot('graphql'),
    },
    {
        key: 'openapi', label: 'OpenAPI Validation', phase: 'body', group: 'Content Inspection',
        description: 'Positive security: only requests matching your OpenAPI 3.x spec are allowed.',
        Form: OpenApiForm, ...engineSlot('openapi'),
    },
    {
        // DLP is a built-in body CHECK on the wire (checks.body.dlp), surfaced
        // as an engine card because users think of it as one.
        key: 'dlp', label: 'DLP — Data Loss Prevention', phase: 'body', group: 'Content Inspection',
        description: 'Block hard secrets (private keys, cloud credentials) and redact PII (cards, SSN, emails) in message bodies.',
        Form: DlpForm,
        get: (p) => p.checks?.body?.dlp,
        set: (p, v) => {
            const body = { ...(p.checks?.body ?? {}) };
            if (v === undefined) delete body.dlp;
            else body.dlp = v;
            const checks = { ...(p.checks ?? {}) };
            if (Object.keys(body).length) checks.body = body; else delete checks.body;
            return { ...p, checks: Object.keys(checks).length ? checks : undefined };
        },
    },
];

export const engineDefByKey = (key: string): EngineDef | undefined =>
    ENGINE_DEFS.find(d => d.key === key);

/** Engines currently enabled on a PolicySpec (in registry order). */
export const enabledEngines = (p: PolicySpec): EngineDef[] =>
    ENGINE_DEFS.filter(d => d.get(p) !== undefined);
