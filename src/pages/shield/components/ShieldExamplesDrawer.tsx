/**
 * Read-only example/template browser for shield policy config files, mirroring
 * NetplanExamplesDrawer. Templates are adapted from the elchi-shield repo's
 * configs/examples/ and embedded here (no runtime dependency).
 */

import React, { useState } from 'react';
import { Drawer, List, Typography, Button, Space, Tag } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import MonacoEditor from '@monaco-editor/react';
import { useTheme } from '@/contexts/ThemeContext';

const { Text } = Typography;

interface ShieldExample {
    key: string;
    title: string;
    description: string;
    tags: string[];
    content: string;
}

export const EXAMPLES: ShieldExample[] = [
    {
        key: 'minimal',
        title: 'Minimal blocking policy',
        description: 'Block mode with the built-in header/body checks for one domain. The smallest useful config.',
        tags: ['starter', 'block'],
        content: `apiVersion: sentinel.elchi.io/v1
kind: SecurityPolicy
metadata:
  name: api-public
spec:
  defaults:
    mode: block          # block | detect | shadow | off
    fail_mode: fail_open # a shield bug must never blackhole traffic

  domains:
    - hosts: ["api.example.com"]
      routes:
        - match:
            path_prefix: "/"
          policy:
            mode: block
`,
    },
    {
        key: 'jwt',
        title: 'JWT authentication',
        description: 'Require a valid JWT on the API surface; keep the health endpoint cheap.',
        tags: ['auth', 'jwt'],
        content: `apiVersion: sentinel.elchi.io/v1
kind: SecurityPolicy
metadata:
  name: api-jwt
spec:
  defaults:
    mode: block
    fail_mode: fail_close   # auth failures should fail closed

  domains:
    - hosts: ["secure.example.com"]
      routes:
        # Protected API: every request must carry a valid JWT.
        - match:
            path_prefix: "/api/"
          policy:
            mode: block
            engines:
              jwt:
                issuer: "https://auth.example.com/"
                audience: "secure-api"
                algorithms: ["RS256"]
                public_key_file: "/etc/elchi/elchi-shield/keys/jwt-pub.pem"
                required_claims: ["sub", "scope"]

        # Health endpoint: fast header checks only.
        - match:
            path_exact: "/healthz"
            methods: [GET]
          policy:
            mode: detect
            pipeline:
              request: ["fast_pre_checks"]
`,
    },
    {
        key: 'ipreputation',
        title: 'IP reputation / threat feeds',
        description: 'Block by source IP using explicit CIDRs and threat-intel feed files (ship the feed as a second, data file in this policy).',
        tags: ['ip', 'feeds'],
        content: `apiVersion: sentinel.elchi.io/v1
kind: SecurityPolicy
metadata:
  name: api-ipreputation
spec:
  defaults:
    mode: block
    fail_mode: fail_open

  domains:
    - hosts: ["edge.example.com"]
      routes:
        - match:
            path_prefix: "/v1/"
          policy:
            mode: block
            engines:
              ip_reputation:
                deny_cidrs:
                  - "192.0.2.0/24"
                  - "2001:db8:bad::/48"
                feeds:
                  # Add the feed file to this policy too, e.g. path "feeds/blocklist.netset"
                  - name: blocklist
                    file: "/etc/elchi/elchi-shield/feeds/blocklist.netset"
                    format: firehol_netset   # cidr_lines | firehol_netset | spamhaus_json
                    severity: high
`,
    },
    {
        key: 'coraza',
        title: 'Coraza WAF + OWASP CRS',
        description: 'Full OWASP Core Rule Set (embedded in shield, no rule files needed). Start in detect mode, watch detections, then switch to block.',
        tags: ['waf', 'owasp'],
        content: `apiVersion: sentinel.elchi.io/v1
kind: SecurityPolicy
metadata:
  name: api-coraza
spec:
  defaults:
    mode: block
    fail_mode: fail_open
    inspect_request_body: true
    max_request_body_bytes: 1048576   # 1 MiB

  domains:
    - hosts: ["app.example.com"]
      routes:
        # Roll the CRS out in detect first; switch to block once tuned.
        - match:
            path_prefix: "/api/"
          policy:
            mode: detect
            engines:
              coraza:
                include_owasp: true
                # paranoia_level: 2
                # inbound_anomaly_threshold: 5
`,
    },
    {
        key: 'ratelimit',
        title: 'Rate limiting (token bucket)',
        description: 'Throttle by client IP, host, or a header value (e.g. API key). Absorbs short bursts, then enforces a steady rate; over-limit requests get 429.',
        tags: ['ratelimit', 'throttle'],
        content: `apiVersion: sentinel.elchi.io/v1
kind: SecurityPolicy
metadata:
  name: api-ratelimit
spec:
  defaults:
    mode: block
    fail_mode: fail_open      # a limiter outage must never blackhole traffic

  domains:
    - hosts: ["gateway.example.com"]
      routes:
        # Public API — per-IP throttle. The token bucket refills at
        # requests_per_second and absorbs momentary spikes up to "burst".
        - match:
            path_prefix: "/v1/"
          policy:
            mode: block
            engines:
              rate_limit:
                requests_per_second: 100   # sustained rate, per key
                burst: 200                 # bucket size (max instantaneous spike)
                key: ip                    # ip | host | header
                # key: ip reads the client IP from X-Forwarded-For. Envoy must add
                # it — set use_remote_address: true on the HCM, otherwise the IP is
                # empty and the limit never triggers.

        # Partner API — one bucket per distinct API-key header value.
        - match:
            path_prefix: "/partner/"
          policy:
            mode: block
            engines:
              rate_limit:
                requests_per_second: 10
                burst: 20
                key: header
                header: "X-Api-Key"        # bucket key = this header's value

        # Beta surface — monitor only: log would-be-429s without enforcing.
        - match:
            path_prefix: "/beta/"
          policy:
            mode: detect
            engines:
              rate_limit:
                requests_per_second: 5
                key: ip
`,
    },
    {
        key: 'bot',
        title: 'Bot defense (UA + JA4 + verified crawlers)',
        description: 'Layered bot scoring: hard-block bad user-agents/fingerprints, allow-list real crawlers (Googlebot) by IP+UA, and score browser-shape anomalies. Start in detect.',
        tags: ['bot', 'ja4'],
        content: `apiVersion: sentinel.elchi.io/v1
kind: SecurityPolicy
metadata:
  name: api-bot
spec:
  defaults:
    mode: block
    fail_mode: fail_open

  domains:
    - hosts: ["shop.example.com"]
      routes:
        - match:
            path_prefix: "/"
          policy:
            mode: detect                  # watch the score first, then switch to block
            engines:
              bot:
                score_threshold: 100      # block once the summed bot score crosses this
                user_agent:
                  deny_substrings:        # hard block — UA contains any of these
                    - "sqlmap"
                    - "nikto"
                    - "masscan"
                    - "python-requests"
                    - "Go-http-client"
                  block_empty: true       # block requests with NO User-Agent
                  score_known_bot: 40     # add to score for generic/library bot UAs
                verified_bots:            # allow real crawlers (verify IP belongs to them)
                  - name: googlebot
                    file: "/etc/elchi/elchi-shield/feeds/googlebot.json"
                    format: cidr_lines    # cidr_lines | firehol_netset | spamhaus_json
                    ua_match: "(?i)googlebot|google-inspectiontool"
                tls_fingerprint:          # JA4 client fingerprint (Envoy supplies it)
                  ja4_header: "x-shield-ja4"
                  deny_ja4:               # hard block known-bad TLS fingerprints
                    - "t13d1516h2_8daaf6152771_b186095e22b6"
                  score_ja4:              # add to score for suspicious fingerprints
                    "t13d1516h2_8daaf6152771_b0da82dd1658": 60
                heuristics:               # real browsers send these headers
                  require_accept: true
                  require_accept_language: true
                  require_accept_encoding: true
                  score_per_anomaly: 25   # add per missing/odd header
`,
    },
    {
        key: 'graphql',
        title: 'GraphQL guard (query DoS limits)',
        description: 'Bound query depth, aliases, field counts, batching and fragment cycles to stop GraphQL DoS / response-amplification, and hide the schema in production.',
        tags: ['graphql', 'dos'],
        content: `apiVersion: sentinel.elchi.io/v1
kind: SecurityPolicy
metadata:
  name: api-graphql
spec:
  defaults:
    mode: block
    fail_mode: fail_close     # a malformed/over-limit query should fail closed

  domains:
    - hosts: ["graph.example.com"]
      routes:
        - match:
            path_prefix: "/graphql"
          policy:
            mode: block
            inspect_request_body: true
            max_request_body_bytes: 524288        # 512 KiB — cap the query size
            engines:
              graphql:
                content_types: ["application/json", "application/graphql"]
                paths: ["/graphql"]               # only parse the GraphQL endpoint
                max_depth: 10                     # reject deeply-nested queries
                max_aliases: 15                   # alias overload → amplification
                max_root_fields: 20               # top-level field fan-out
                max_total_fields: 500             # whole-document field budget
                max_operations: 10                # cap batched-array operations
                max_fragment_depth: 32            # fragment-cycle / recursion bound
                block_introspection: true         # hide the schema in prod
`,
    },
    {
        key: 'openapi',
        title: 'OpenAPI positive security',
        description: 'Validate every request against your OpenAPI 3.x contract: reject undeclared paths/methods and non-conforming bodies. Whitelist model — only what the spec allows passes.',
        tags: ['openapi', 'schema'],
        content: `apiVersion: sentinel.elchi.io/v1
kind: SecurityPolicy
metadata:
  name: api-openapi
spec:
  defaults:
    mode: block
    fail_mode: fail_close     # non-conforming requests fail closed (positive security)

  domains:
    - hosts: ["contract.example.com"]
      routes:
        - match:
            path_prefix: "/v1/"
          policy:
            mode: block
            inspect_request_body: true
            max_request_body_bytes: 1048576
            engines:
              openapi:
                # Ship the spec as a Data File in this same policy bundle.
                spec_file: "/etc/elchi/elchi-shield/openapi/api.yaml"
                validate_request_body: true     # body must match the schema (buffers it)
                reject_undeclared_path: true     # block any path/op not in the spec
`,
    },
    {
        key: 'dlp',
        title: 'DLP — block secrets & redact PII',
        description: 'Scan the response body: hard-block leaked secrets (private keys, cloud tokens) and mask PII (cards, SSNs, emails) in-flight before it reaches the client.',
        tags: ['dlp', 'pii'],
        content: `apiVersion: sentinel.elchi.io/v1
kind: SecurityPolicy
metadata:
  name: api-dlp
spec:
  defaults:
    mode: block
    fail_mode: fail_close

  domains:
    - hosts: ["dlp.example.com"]
      routes:
        - match:
            path_prefix: "/"
          policy:
            mode: block
            inspect_response_body: true
            max_response_body_bytes: 1048576
            checks:
              body:
                dlp:
                  direction: response       # response (default) | request | both
                  block:                    # leaked secrets → block the whole response
                    - private_key
                    - aws_access_key
                    - google_api_key
                    - slack_token
                    - github_token
                  redact:                   # PII → masked in the body (not blocked)
                    - credit_card
                    - ssn
                    - email
                    - jwt
`,
    },
    {
        key: 'anomaly',
        title: 'Anomaly scoring (multi-signal)',
        description: 'Combine weak signals instead of single hard rules: each engine contributes a score, and shield blocks only when the per-request total crosses a threshold. Fewer false positives.',
        tags: ['anomaly', 'scoring'],
        content: `apiVersion: sentinel.elchi.io/v1
kind: SecurityPolicy
metadata:
  name: api-anomaly
spec:
  defaults:
    mode: block
    fail_mode: fail_open

  domains:
    - hosts: ["scored.example.com"]
      routes:
        - match:
            path_prefix: "/"
          policy:
            mode: block
            anomaly_threshold: 70         # block when the SUMMED engine score >= this
            engines:
              bot:
                emit_score: true          # contribute to the score, don't self-block
                user_agent:
                  score_known_bot: 30
                  deny_substrings: ["sqlmap", "nikto"]   # these stay a hard block
                heuristics:
                  require_accept: true
                  require_accept_language: true
                  require_accept_encoding: true
                  score_per_anomaly: 25   # 3 missing headers (75) alone crosses 70
`,
    },
    {
        key: 'zerotrust',
        title: 'Zero-trust: JWKS + mTLS identity',
        description: 'Verify bearer JWTs against a remote JWK Set (auto-refreshed) for the public API, and require an mTLS client-cert identity (SPIFFE/DNS) on the internal surface.',
        tags: ['jwks', 'mtls'],
        content: `apiVersion: sentinel.elchi.io/v1
kind: SecurityPolicy
metadata:
  name: api-zerotrust
spec:
  defaults:
    mode: block
    fail_mode: fail_close     # auth failures fail closed

  domains:
    - hosts: ["mtls.example.com"]
      routes:
        # Public API — validate JWT against the IdP's rotating JWKS.
        - match:
            path_prefix: "/api/"
          policy:
            mode: block
            engines:
              jwks:
                url: "https://idp.example.com/.well-known/jwks.json"
                refresh_interval: 10m     # background refresh; unknown kid => block
                http_timeout: 5s
                issuer: "https://idp.example.com/"
                audience: "secure-api"
                algorithms: ["RS256", "ES256"]
                required_claims: ["sub"]
                leeway: 30s               # clock-skew tolerance

        # Internal API — require a verified mTLS client cert (Envoy forwards XFCC).
        - match:
            path_prefix: "/internal/"
          policy:
            mode: block
            engines:
              xfcc:
                require_present: true     # reject if no client cert
                uris:                     # allow-list by SPIFFE id...
                  - "spiffe://cluster.local/ns/payments/sa/checkout"
                dns_names:                # ...or by cert SAN DNS name
                  - "checkout.payments.svc"
`,
    },
    {
        key: 'apikey-hmac',
        title: 'API keys + signed webhooks (HMAC)',
        description: 'Scope-based API-key auth (sha256-hashed keys, per-path scope rules) for partners, plus HMAC request signing with a timestamp window + nonce replay protection for webhooks.',
        tags: ['apikey', 'hmac'],
        content: `apiVersion: sentinel.elchi.io/v1
kind: SecurityPolicy
metadata:
  name: api-keys
spec:
  defaults:
    mode: block
    fail_mode: fail_close

  domains:
    - hosts: ["auth.example.com"]
      routes:
        # Partner API — keys are stored sha256-hashed; each key carries scopes,
        # and a path can require a specific scope (least privilege).
        - match:
            path_prefix: "/v1/"
          policy:
            mode: block
            engines:
              api_key:
                source: header            # header | query
                name: "X-Api-Key"
                keys:
                  - sha256: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"
                    subject: "partner-a"
                    scopes: ["read"]
                  - key: "rotate-me-in-prod"   # raw key, hashed at load (dev only)
                    subject: "partner-b"
                    scopes: ["read", "write"]
                require_scope_for_path:
                  - { path_prefix: "/v1/admin", scope: "write" }

        # Inbound webhooks — verify an HMAC signature over the body, bounded by a
        # timestamp window, with a nonce cache to reject replays.
        - match:
            path_prefix: "/webhook/"
          policy:
            mode: block
            engines:
              hmac_sign:
                secrets:                  # key-id => secret (supports rotation)
                  "2024": "old-shared-secret"
                  "2025": "current-shared-secret"
                algorithm: sha256         # sha256 | sha512
                window: 300s              # max clock skew on the signed timestamp
                nonce_ttl: 600s
                require_nonce: true       # mandate a nonce (replay protection)
                require_body_digest: true # signature must cover the body
`,
    },
    {
        key: 'layered',
        title: 'Defense-in-depth (advanced, layered)',
        description: 'Production-shaped stack: bypass health/metrics, run IP-rep → rate-limit → bot → WAF on the public API, and a stricter JWT + PL2 WAF posture on /admin. Roll out per-route.',
        tags: ['advanced', 'layered'],
        content: `apiVersion: sentinel.elchi.io/v1
kind: SecurityPolicy
metadata:
  name: api-defense-in-depth
spec:
  defaults:
    mode: block
    fail_mode: fail_open
    inspect_request_body: true
    max_request_body_bytes: 1048576
    sampling_rate: 0.05            # audit 5% of ALLOWs (blocks/detects always audited)

  # Paths that skip ALL inspection (probes, scrape endpoints).
  exclude:
    - "/healthz"
    - "/metrics"

  domains:
    - hosts: ["app.example.com"]
      routes:
        # Public API — full stack, cheap checks first, WAF last.
        - match:
            path_prefix: "/api/"
          policy:
            mode: block
            engines:
              ip_reputation:                  # 1) drop known-bad source IPs
                deny_cidrs: ["192.0.2.0/24"]
                feeds:
                  - name: blocklist
                    file: "/etc/elchi/elchi-shield/feeds/blocklist.netset"
                    format: firehol_netset
                    severity: high
              rate_limit:                     # 2) throttle abusive clients
                requests_per_second: 100
                burst: 200
                key: ip
              bot:                            # 3) score automated traffic
                score_threshold: 100
                user_agent:
                  deny_substrings: ["sqlmap", "nikto", "masscan"]
                  block_empty: true
                heuristics:
                  require_accept: true
                  require_accept_language: true
                  score_per_anomaly: 25
              coraza:                         # 4) full WAF on the payload
                include_owasp: true
                paranoia_level: 1

        # Admin surface — stricter: require JWT + a higher WAF paranoia level.
        - match:
            path_prefix: "/admin/"
          policy:
            mode: block
            fail_mode: fail_close            # admin auth must fail closed
            engines:
              jwt:
                issuer: "https://auth.example.com/"
                audience: "admin"
                algorithms: ["RS256"]
                public_key_file: "/etc/elchi/elchi-shield/keys/jwt-pub.pem"
                required_claims: ["sub", "scope"]
              coraza:
                include_owasp: true
                paranoia_level: 2             # stricter rule set for admin
`,
    },
];

interface ShieldExamplesDrawerProps {
    open: boolean;
    onClose: () => void;
    onUseTemplate: (content: string) => void;
}

const ShieldExamplesDrawer: React.FC<ShieldExamplesDrawerProps> = ({ open, onClose, onUseTemplate }) => {
    const { isDark } = useTheme();
    const [selected, setSelected] = useState<ShieldExample>(EXAMPLES[0]);

    return (
        <Drawer
            title="Shield Config Examples"
            width={860}
            open={open}
            onClose={onClose}
        >
            <div style={{ display: 'flex', gap: 16, height: '100%' }}>
                <div style={{ width: 280, overflowY: 'auto' }}>
                    <List
                        dataSource={EXAMPLES}
                        renderItem={(item) => (
                            <List.Item
                                onClick={() => setSelected(item)}
                                style={{
                                    cursor: 'pointer',
                                    borderRadius: 8,
                                    padding: 12,
                                    marginBottom: 8,
                                    border: item.key === selected.key
                                        ? '1px solid var(--color-primary)'
                                        : '1px solid var(--border-default)',
                                }}
                            >
                                <List.Item.Meta
                                    avatar={<FileTextOutlined style={{ fontSize: 18 }} />}
                                    title={item.title}
                                    description={
                                        <>
                                            <Text type="secondary" style={{ fontSize: 12 }}>{item.description}</Text>
                                            <div style={{ marginTop: 4 }}>
                                                {item.tags.map(t => <Tag className='auto-width-tag' key={t}>{t}</Tag>)}
                                            </div>
                                        </>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                        <Text strong>{selected.title}</Text>
                        <Button type="primary" size="small" onClick={() => onUseTemplate(selected.content)}>
                            Use this template
                        </Button>
                    </Space>
                    <MonacoEditor
                        height="520px"
                        language="yaml"
                        theme={isDark ? 'vs-dark' : 'light'}
                        value={selected.content}
                        options={{
                            readOnly: true,
                            minimap: { enabled: false },
                            fontSize: 12,
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                        }}
                    />
                </div>
            </div>
        </Drawer>
    );
};

export default ShieldExamplesDrawer;
