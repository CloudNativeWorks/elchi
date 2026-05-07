import React from 'react';
import { Alert, Anchor, Drawer, Space, Tag, Typography } from 'antd';
import {
    BookOutlined,
    BulbOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    ReadOutlined,
    RocketOutlined,
    SafetyOutlined,
    StopOutlined,
    ToolOutlined,
} from '@ant-design/icons';
import CodeSnippet from './CodeSnippet';

const { Text, Paragraph, Title } = Typography;

const SectionHeader: React.FC<{
    id: string;
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
}> = ({ id, icon, title, subtitle }) => (
    <div
        id={id}
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '20px 0 8px',
            borderBottom: '1px solid var(--border-default)',
            marginBottom: 14,
            scrollMarginTop: 8,
        }}
    >
        <span style={{ color: 'var(--color-primary)', fontSize: 18 }}>{icon}</span>
        <Title level={5} style={{ margin: 0 }}>
            {title}
        </Title>
        {subtitle && (
            <Text type="secondary" style={{ fontSize: 12 }}>
                — {subtitle}
            </Text>
        )}
    </div>
);

const Pill: React.FC<{ color?: string; children: React.ReactNode }> = ({ color = 'blue', children }) => (
    <Tag color={color} style={{ marginInlineEnd: 4 }}>
        {children}
    </Tag>
);

const AnchorLabel: React.FC<{ emoji: string; text: string }> = ({ emoji, text }) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 6px' }}>
        <span style={{ fontSize: 14, width: 18, textAlign: 'center', flexShrink: 0 }}>{emoji}</span>
        <span>{text}</span>
    </span>
);

interface HowToDrawerProps {
    open: boolean;
    onClose: () => void;
}

/**
 * "How to write WAF rules" — distilled from Coraza SecLang docs, OWASP CRS
 * guides, and the coraza-proxy-wasm v0.6.0 README.
 *
 * All sections render inline (no Collapse) so the left Anchor TOC can
 * jump-scroll into any section reliably. Collapse with hidden children
 * would mean the anchor target IDs aren't in the DOM until expanded.
 */
const HowToDrawer: React.FC<HowToDrawerProps> = ({ open, onClose }) => {
    return (
        <Drawer
            title={
                <span>
                    <BookOutlined style={{ marginInlineEnd: 8 }} />
                    How to write WAF rules
                    <Tag color="purple" className="auto-width-tag" style={{ marginInlineStart: 8 }}>
                        Coraza · CRS 4.14
                    </Tag>
                </span>
            }
            placement="right"
            width={Math.min(1040, typeof window !== 'undefined' ? window.innerWidth - 80 : 1040)}
            open={open}
            onClose={onClose}
            styles={{ body: { padding: 0, display: 'flex', height: '100%' } }}
            destroyOnHidden={false}
        >
            {/* Side anchor TOC */}
            <div
                style={{
                    width: 220,
                    borderInlineEnd: '1px solid var(--border-default)',
                    background: 'var(--card-bg)',
                    overflow: 'auto',
                    padding: '16px 4px',
                    flexShrink: 0,
                }}
            >
                <Anchor
                    affix={false}
                    targetOffset={20}
                    getContainer={() => {
                        return (
                            (typeof document !== 'undefined' &&
                                (document.getElementById('howto-scroll-container') as HTMLElement)) ||
                            window
                        );
                    }}
                    items={[
                        {
                            key: 'quick-start',
                            href: '#howto-quick-start',
                            title: <AnchorLabel emoji="⚡" text="Quick start" />,
                        },
                        {
                            key: 'big-picture',
                            href: '#howto-big-picture',
                            title: <AnchorLabel emoji="🗺️" text="Big picture" />,
                        },
                        {
                            key: 'anatomy',
                            href: '#howto-anatomy',
                            title: <AnchorLabel emoji="🔬" text="SecRule anatomy" />,
                        },
                        {
                            key: 'variables',
                            href: '#howto-variables',
                            title: <AnchorLabel emoji="📥" text="Variables" />,
                        },
                        {
                            key: 'operators',
                            href: '#howto-operators',
                            title: <AnchorLabel emoji="⚙️" text="Operators" />,
                        },
                        {
                            key: 'transforms',
                            href: '#howto-transforms',
                            title: <AnchorLabel emoji="🔁" text="Transformations" />,
                        },
                        {
                            key: 'actions',
                            href: '#howto-actions',
                            title: <AnchorLabel emoji="🎬" text="Actions" />,
                        },
                        {
                            key: 'crs',
                            href: '#howto-crs',
                            title: <AnchorLabel emoji="🛡️" text="CRS in 60s" />,
                        },
                        {
                            key: 'recipes',
                            href: '#howto-recipes',
                            title: <AnchorLabel emoji="📖" text="Recipes" />,
                        },
                        {
                            key: 'wasm',
                            href: '#howto-wasm',
                            title: <AnchorLabel emoji="⚠️" text="WASM v0.6.0" />,
                        },
                        {
                            key: 'glossary',
                            href: '#howto-glossary',
                            title: <AnchorLabel emoji="🔤" text="Glossary" />,
                        },
                    ]}
                />
                <div
                    style={{
                        marginTop: 16,
                        padding: '0 12px',
                        fontSize: 11,
                        color: 'var(--text-secondary)',
                    }}
                >
                    Drilling deeper?{' '}
                    <a href="https://www.coraza.io/docs/" target="_blank" rel="noopener noreferrer">
                        Coraza docs
                    </a>{' '}
                    ·{' '}
                    <a href="https://coreruleset.org/docs/" target="_blank" rel="noopener noreferrer">
                        CRS docs
                    </a>
                </div>
            </div>

            {/* Scrollable content */}
            <div
                id="howto-scroll-container"
                style={{
                    flex: 1,
                    overflow: 'auto',
                    padding: '4px 24px 60px',
                    minWidth: 0,
                }}
            >
                {/* Quick start */}
                <SectionHeader
                    id="howto-quick-start"
                    icon={<RocketOutlined />}
                    title="Quick start"
                    subtitle="A working WAF in 3 lines"
                />
                <Paragraph>
                    Drop these directives into your <strong>default set</strong> in this order. Engine on,
                    CRS defaults loaded, all OWASP rule files included. Baseline WAF.
                </Paragraph>
                <CodeSnippet
                    block
                    label="Quick start"
                    code={`SecRuleEngine On
Include @crs-setup-conf
Include @owasp_crs/*.conf`}
                />
                <Alert
                    type="info"
                    showIcon
                    message="What just happened?"
                    description={
                        <Text style={{ fontSize: 12 }}>
                            <code>@crs-setup-conf</code> resolves to the CRS example file inside the WASM
                            plugin (see <strong>CRS Setup</strong> in the sidebar) — almost everything in
                            there is commented out, so you inherit the rule files&rsquo; built-in defaults:
                            paranoia level 1, anomaly threshold 5. To change either, add a{' '}
                            <code>SecAction</code> after the includes.
                        </Text>
                    }
                />

                {/* Big picture */}
                <SectionHeader
                    id="howto-big-picture"
                    icon={<ReadOutlined />}
                    title="Big picture"
                    subtitle="What runs when"
                />
                <Paragraph>
                    Coraza walks each request through <strong>5 phases</strong>. Each rule runs in exactly
                    one phase. Pick the phase with <code>phase:N</code>.
                </Paragraph>
                <ul style={{ paddingInlineStart: 18, fontSize: 13 }}>
                    <li>
                        <strong>Phase 1 — Request Headers</strong>: method, path, headers (no body yet).
                        Cheap pre-checks: bad methods, malformed URIs, header probes.
                    </li>
                    <li>
                        <strong>Phase 2 — Request Body</strong>: full body buffered. SQLi, XSS, RCE,
                        file-upload checks. Most CRS rules.
                    </li>
                    <li>
                        <strong>Phase 3 — Response Headers</strong>: backend has replied. Status code /
                        content-type checks.
                    </li>
                    <li>
                        <strong>Phase 4 — Response Body</strong>: data leak detection, error fingerprinting.
                    </li>
                    <li>
                        <strong>Phase 5 — Logging</strong>: emit audit logs. No blocking.
                    </li>
                </ul>
                <Paragraph type="secondary" style={{ fontSize: 12 }}>
                    OWASP CRS uses an <strong>anomaly score</strong> model: every rule adds points instead
                    of blocking immediately. A late rule (<code>949110</code> / <code>959100</code>)
                    compares the running score against a threshold and blocks if exceeded.
                </Paragraph>

                {/* Anatomy */}
                <SectionHeader
                    id="howto-anatomy"
                    icon={<BulbOutlined />}
                    title="Anatomy of a SecRule"
                    subtitle="VAR · operator · actions"
                />
                <Paragraph>
                    Every <code>SecRule</code> is three things glued together:
                </Paragraph>
                <CodeSnippet
                    block
                    code={`SecRule  VARIABLES   "OPERATOR"   "ACTIONS"
         └─ what     └─ how       └─ what to do
         to inspect    to compare   when matched`}
                />
                <Paragraph>A real one:</Paragraph>
                <CodeSnippet
                    code={`SecRule REQUEST_URI "@contains /admin" "id:1001,phase:1,deny,status:403,msg:'Admin path blocked'"`}
                />
                <Paragraph type="secondary" style={{ fontSize: 12 }}>
                    Read it: <em>"if the request URI contains <code>/admin</code>, deny with 403 and log
                    the message."</em> The <code>id</code> is mandatory and must be unique. Custom rule
                    IDs should live in <code>1–99999</code>; OWASP CRS reserves <code>900000–999999</code>.
                </Paragraph>
                <Alert
                    type="warning"
                    showIcon
                    style={{ marginTop: 8 }}
                    message="Use SecAction for unconditional things"
                    description={
                        <Text style={{ fontSize: 12 }}>
                            <code>SecAction</code> is a <code>SecRule</code> with no variable/operator —
                            it always runs. Use it to flip variables like <code>tx.paranoia_level</code>{' '}
                            or to remove a CRS rule from the chain.
                        </Text>
                    }
                />

                {/* Variables */}
                <SectionHeader
                    id="howto-variables"
                    icon={<BulbOutlined />}
                    title="Variables"
                    subtitle="What you inspect"
                />
                <Paragraph>
                    Variables tell Coraza what part of the request to look at. Combine them with{' '}
                    <code>|</code>:
                </Paragraph>
                <CodeSnippet code={`SecRule ARGS|REQUEST_HEADERS "@rx <script" "id:200,phase:2,deny"`} />
                <table
                    style={{
                        width: '100%',
                        fontSize: 12,
                        borderCollapse: 'collapse',
                        marginTop: 8,
                    }}
                >
                    <thead>
                        <tr style={{ background: 'var(--bg-secondary, rgba(0,0,0,0.04))' }}>
                            <th style={{ textAlign: 'left', padding: 6 }}>Variable</th>
                            <th style={{ textAlign: 'left', padding: 6 }}>What it is</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ padding: 6 }}><code>ARGS</code></td>
                            <td style={{ padding: 6 }}>Query string + body params combined</td>
                        </tr>
                        <tr>
                            <td style={{ padding: 6 }}><code>ARGS_NAMES</code></td>
                            <td style={{ padding: 6 }}>Just parameter names (not values)</td>
                        </tr>
                        <tr>
                            <td style={{ padding: 6 }}><code>REQUEST_URI</code></td>
                            <td style={{ padding: 6 }}>Full URI including query</td>
                        </tr>
                        <tr>
                            <td style={{ padding: 6 }}><code>REQUEST_METHOD</code></td>
                            <td style={{ padding: 6 }}>GET, POST, …</td>
                        </tr>
                        <tr>
                            <td style={{ padding: 6 }}><code>REQUEST_HEADERS:Header</code></td>
                            <td style={{ padding: 6 }}>
                                One header by name (<code>REQUEST_HEADERS:User-Agent</code>)
                            </td>
                        </tr>
                        <tr>
                            <td style={{ padding: 6 }}><code>REQUEST_BODY</code></td>
                            <td style={{ padding: 6 }}>
                                Raw body (requires <code>SecRequestBodyAccess On</code>)
                            </td>
                        </tr>
                        <tr>
                            <td style={{ padding: 6 }}><code>REQUEST_COOKIES</code></td>
                            <td style={{ padding: 6 }}>All cookie values</td>
                        </tr>
                        <tr>
                            <td style={{ padding: 6 }}><code>REMOTE_ADDR</code></td>
                            <td style={{ padding: 6 }}>Client IP (as Envoy sees it)</td>
                        </tr>
                        <tr>
                            <td style={{ padding: 6 }}><code>RESPONSE_HEADERS</code></td>
                            <td style={{ padding: 6 }}>
                                Phase 3+. Inspect what you&rsquo;re sending back.
                            </td>
                        </tr>
                        <tr>
                            <td style={{ padding: 6 }}><code>TX:varname</code></td>
                            <td style={{ padding: 6 }}>
                                Transaction-scoped variables you set with <code>setvar:</code>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <Paragraph type="secondary" style={{ fontSize: 12, marginTop: 8 }}>
                    Negation: <code>!REQUEST_HEADERS:User-Agent</code> = "header is missing or empty".
                    Counts: <code>&amp;ARGS</code> = "number of args".
                </Paragraph>

                {/* Operators */}
                <SectionHeader
                    id="howto-operators"
                    icon={<ToolOutlined />}
                    title="Operators"
                    subtitle="How you compare"
                />
                <Paragraph>Most-used operators (full list in Coraza docs):</Paragraph>
                <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'var(--bg-secondary, rgba(0,0,0,0.04))' }}>
                            <th style={{ textAlign: 'left', padding: 6 }}>Operator</th>
                            <th style={{ textAlign: 'left', padding: 6 }}>Matches when…</th>
                            <th style={{ textAlign: 'left', padding: 6 }}>Example</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ padding: 6 }}><code>@rx</code></td>
                            <td style={{ padding: 6 }}>Regex matches</td>
                            <td style={{ padding: 6 }}><code>@rx ^/admin</code></td>
                        </tr>
                        <tr>
                            <td style={{ padding: 6 }}><code>@contains</code></td>
                            <td style={{ padding: 6 }}>Substring</td>
                            <td style={{ padding: 6 }}><code>@contains evil</code></td>
                        </tr>
                        <tr>
                            <td style={{ padding: 6 }}><code>@beginsWith</code> / <code>@endsWith</code></td>
                            <td style={{ padding: 6 }}>Prefix / suffix</td>
                            <td style={{ padding: 6 }}><code>@beginsWith /api/</code></td>
                        </tr>
                        <tr>
                            <td style={{ padding: 6 }}><code>@streq</code></td>
                            <td style={{ padding: 6 }}>Exact string equality</td>
                            <td style={{ padding: 6 }}><code>@streq POST</code></td>
                        </tr>
                        <tr>
                            <td style={{ padding: 6 }}><code>@eq</code> / <code>@gt</code> / <code>@lt</code></td>
                            <td style={{ padding: 6 }}>Numeric compare</td>
                            <td style={{ padding: 6 }}><code>@gt 5</code></td>
                        </tr>
                        <tr>
                            <td style={{ padding: 6 }}><code>@within</code></td>
                            <td style={{ padding: 6 }}>Value is one of a space-separated list</td>
                            <td style={{ padding: 6 }}><code>@within GET POST</code></td>
                        </tr>
                        <tr>
                            <td style={{ padding: 6 }}><code>@pm</code> / <code>@pmFromFile</code></td>
                            <td style={{ padding: 6 }}>Multi-pattern match (Aho-Corasick, fast)</td>
                            <td style={{ padding: 6 }}><code>@pm cmd.exe boot.ini</code></td>
                        </tr>
                        <tr>
                            <td style={{ padding: 6 }}><code>@detectSQLi</code> / <code>@detectXSS</code></td>
                            <td style={{ padding: 6 }}>libinjection-based attack detection</td>
                            <td style={{ padding: 6 }}><code>@detectSQLi</code></td>
                        </tr>
                    </tbody>
                </table>
                <Paragraph type="secondary" style={{ fontSize: 12, marginTop: 8 }}>
                    Negate by prefixing <code>!</code>:{' '}
                    <code>"!@within GET POST"</code> = "method is NOT in this list".
                </Paragraph>

                {/* Transformations */}
                <SectionHeader
                    id="howto-transforms"
                    icon={<ToolOutlined />}
                    title="Transformations"
                    subtitle="Normalize before compare"
                />
                <Paragraph>
                    Transformations sit between the variable and the operator. They run in order with{' '}
                    <code>t:...</code>:
                </Paragraph>
                <CodeSnippet
                    code={`SecRule ARGS "@contains script" "id:300,phase:2,t:lowercase,t:urlDecode,deny"`}
                />
                <ul style={{ fontSize: 13, paddingInlineStart: 18 }}>
                    <li>
                        <code>t:none</code> — explicit "no transforms". Use it to override inherited{' '}
                        <code>SecDefaultAction</code>.
                    </li>
                    <li>
                        <code>t:lowercase</code> — lowercase the value before matching.
                    </li>
                    <li>
                        <code>t:urlDecode</code> / <code>t:urlDecodeUni</code> — decode percent-encoding
                        (and Unicode variant).
                    </li>
                    <li>
                        <code>t:htmlEntityDecode</code> — decode HTML entities like <code>&amp;lt;</code>.
                    </li>
                    <li>
                        <code>t:base64Decode</code> — decode base64 first.
                    </li>
                    <li>
                        <code>t:removeWhitespace</code>, <code>t:compressWhitespace</code> — strip /
                        collapse spaces.
                    </li>
                    <li>
                        <code>t:replaceComments</code> — replace SQL/JS comments with a single space
                        (anti-evasion).
                    </li>
                    <li>
                        <code>t:cmdLine</code> — normalize shell-evasion tricks like <code>{`l\\s`}</code>.
                    </li>
                </ul>

                {/* Actions */}
                <SectionHeader
                    id="howto-actions"
                    icon={<SafetyOutlined />}
                    title="Actions"
                    subtitle="What happens on match"
                />
                <Paragraph>
                    Actions cluster into <Pill color="geekblue">disruptive</Pill>{' '}
                    <Pill color="purple">non-disruptive</Pill>{' '}
                    <Pill color="cyan">flow-control</Pill>{' '}
                    <Pill color="green">metadata</Pill>:
                </Paragraph>
                <ul style={{ fontSize: 13, paddingInlineStart: 18 }}>
                    <li>
                        <strong>Disruptive (one per rule):</strong> <code>deny</code>,{' '}
                        <code>block</code>, <code>drop</code>, <code>redirect:URL</code>,{' '}
                        <code>pass</code>, <code>allow</code>. Pair with <code>status:403</code> for
                        explicit code.
                    </li>
                    <li>
                        <strong>Logging:</strong> <code>log</code> / <code>nolog</code>,{' '}
                        <code>auditlog</code>, <code>msg:&lsquo;…&rsquo;</code>,{' '}
                        <code>logdata:&lsquo;%{`{MATCHED_VAR}`}&rsquo;</code>.
                    </li>
                    <li>
                        <strong>Metadata:</strong> <code>id:N</code> (required),{' '}
                        <code>phase:N</code> (required),{' '}
                        <code>severity:&lsquo;CRITICAL&rsquo;</code>,{' '}
                        <code>tag:&lsquo;attack-sqli&rsquo;</code>, <code>ver:&lsquo;1.0&rsquo;</code>.
                    </li>
                    <li>
                        <strong>Variable manipulation:</strong>{' '}
                        <code>setvar:&lsquo;tx.score=+5&rsquo;</code> (increment),{' '}
                        <code>setvar:!tx.score</code> (delete).
                    </li>
                    <li>
                        <strong>Flow:</strong> <code>chain</code> (next rule must also match),{' '}
                        <code>skipAfter:MARKER</code>, <code>ctl:ruleEngine=DetectionOnly</code>.
                    </li>
                </ul>

                {/* CRS */}
                <SectionHeader
                    id="howto-crs"
                    icon={<SafetyOutlined />}
                    title="OWASP CRS in 60 seconds"
                    subtitle="Paranoia · anomaly score"
                />
                <Paragraph>
                    CRS rules don&rsquo;t block individually. Each match adds points to a{' '}
                    <strong>running anomaly score</strong>; a final rule blocks if the score exceeds the
                    threshold. Two knobs to know:
                </Paragraph>
                <Paragraph>
                    <strong>Paranoia level (1–4)</strong> — how many rules are turned on. Higher = more
                    rules = more false positives. Defaults to <code>1</code>.
                </Paragraph>
                <CodeSnippet
                    code={`SecAction "id:900000,phase:1,nolog,pass,t:none,setvar:tx.paranoia_level=2"`}
                />
                <Paragraph style={{ marginTop: 12 }}>
                    <strong>Anomaly threshold</strong> — score at which to block. Default is <code>5</code>{' '}
                    inbound, <code>4</code> outbound. Lower = block sooner = more aggressive.
                </Paragraph>
                <CodeSnippet
                    code={`SecAction "id:900110,phase:1,nolog,pass,t:none,setvar:tx.inbound_anomaly_score_threshold=3,setvar:tx.outbound_anomaly_score_threshold=2"`}
                />
                <Alert
                    type="info"
                    showIcon
                    style={{ marginTop: 8 }}
                    message="Need detection-only mode while tuning?"
                    description={
                        <Text style={{ fontSize: 12 }}>
                            Set <code>SecRuleEngine DetectionOnly</code> at the top of your set. Rules
                            still match and log, but nothing is blocked. Run a week, then promote to{' '}
                            <code>On</code>.
                        </Text>
                    }
                />

                {/* Recipes */}
                <SectionHeader
                    id="howto-recipes"
                    icon={<BookOutlined />}
                    title="Recipes"
                    subtitle="Common things you'll want to do"
                />

                <Title level={5} style={{ marginTop: 0 }}>
                    Allow only specific HTTP methods
                </Title>
                <CodeSnippet
                    code={`SecAction "id:900200,phase:1,nolog,pass,t:none,setvar:'tx.allowed_methods=GET HEAD POST OPTIONS PUT DELETE'"`}
                />

                <Title level={5}>Disable a CRS rule by ID</Title>
                <CodeSnippet code={`SecRuleRemoveById 920100`} />

                <Title level={5}>Disable a whole CRS category</Title>
                <CodeSnippet code={`SecRuleRemoveByTag "attack-injection-php"`} />

                <Title level={5}>Whitelist an IP from all CRS</Title>
                <CodeSnippet
                    block
                    code={`SecRule REMOTE_ADDR "@ipMatch 10.0.0.0/8" \\
    "id:1000,phase:1,pass,nolog,ctl:ruleEngine=Off"`}
                />

                <Title level={5}>Block a known-bad user agent</Title>
                <CodeSnippet
                    code={`SecRule REQUEST_HEADERS:User-Agent "@rx (?:sqlmap|nikto|nmap)" "id:1100,phase:1,deny,status:403,msg:'Scanner blocked',tag:'attack-recon'"`}
                />

                <Title level={5}>Custom rule that adds anomaly score</Title>
                <CodeSnippet
                    block
                    code={`SecRule REQUEST_URI "@contains /wp-login.php" \\
    "id:1200,phase:1,pass,t:lowercase,\\
    msg:'WordPress login probed',\\
    setvar:'tx.inbound_anomaly_score_pl1=+3'"`}
                />

                <Title level={5}>Tighten paranoia for one set, leave another permissive</Title>
                <Paragraph type="secondary" style={{ fontSize: 12 }}>
                    Create two sets in the sidebar (e.g. <code>strict</code> and <code>permissive</code>)
                    and use <strong>Per-authority</strong> in Advanced to map domains to each.
                </Paragraph>

                <Title level={5}>Limit body size</Title>
                <CodeSnippet
                    block
                    code={`SecRequestBodyAccess On
SecRequestBodyLimit 5242880
SecRequestBodyLimitAction Reject`}
                />

                {/* WASM */}
                <SectionHeader
                    id="howto-wasm"
                    icon={<ExclamationCircleOutlined />}
                    title="coraza-proxy-wasm v0.6.0"
                    subtitle="Caveats & gotchas"
                />
                <Paragraph>The runtime that loads your rules. Things worth knowing:</Paragraph>
                <ul style={{ fontSize: 13, paddingInlineStart: 18 }}>
                    <li>
                        <CheckCircleOutlined style={{ color: 'var(--color-success)' }} /> CRS{' '}
                        <strong>v4.14.0</strong> is bundled — same set you see in the CRS Library here.
                    </li>
                    <li>
                        <CheckCircleOutlined style={{ color: 'var(--color-success)' }} /> Multiphase
                        evaluation enabled by default — rules run as soon as their variables are ready.
                    </li>
                    <li>
                        <CheckCircleOutlined style={{ color: 'var(--color-success)' }} /> Prometheus
                        metrics with phase + rule-id labels are exposed by the filter.
                    </li>
                    <li>
                        <ExclamationCircleOutlined style={{ color: 'var(--color-warning)' }} />{' '}
                        <strong>Tuning required.</strong> Out-of-the-box CRS will false-positive on
                        legitimate traffic. Start in <code>DetectionOnly</code>, watch logs, add
                        exceptions, then promote.
                    </li>
                    <li>
                        <ExclamationCircleOutlined style={{ color: 'var(--color-warning)' }} /> Built with{' '}
                        <strong>TinyGo 0.34</strong>. Memory pressure / GC quirks can show under load —
                        load-test before production.
                    </li>
                    <li>
                        <StopOutlined style={{ color: 'var(--color-danger)' }} /> Audit log Parts D, G, I,
                        J are not implemented yet — expect <code>SecAuditLogParts ABCFHZ</code> as the
                        safe set.
                    </li>
                    <li>
                        <StopOutlined style={{ color: 'var(--color-danger)' }} />{' '}
                        <code>SecRequestBodyNoFilesLimit</code> is parsed but not enforced — rely on{' '}
                        <code>SecRequestBodyLimit</code> instead.
                    </li>
                </ul>

                {/* Glossary */}
                <SectionHeader
                    id="howto-glossary"
                    icon={<BookOutlined />}
                    title="Glossary"
                    subtitle="Terms in 1 line"
                />
                <ul style={{ fontSize: 13, paddingInlineStart: 18 }}>
                    <li>
                        <strong>Phase</strong> — slot in the request lifecycle when a rule runs (1: req
                        hdrs, 2: req body, 3: resp hdrs, 4: resp body, 5: log).
                    </li>
                    <li>
                        <strong>tx.X</strong> — transaction-scoped variable, lives only for one request.
                        Set with <code>setvar:</code>.
                    </li>
                    <li>
                        <strong>Anomaly score</strong> — running counter of suspicious-rule matches. CRS
                        blocks when it exceeds the threshold.
                    </li>
                    <li>
                        <strong>Paranoia level (1–4)</strong> — gates how many CRS rules evaluate. Higher
                        = stricter + more false positives.
                    </li>
                    <li>
                        <strong>Disruptive action</strong> — <code>deny</code>, <code>block</code>,{' '}
                        <code>drop</code>, <code>redirect</code>, <code>pass</code>, <code>allow</code>.
                        One per rule.
                    </li>
                    <li>
                        <strong>Chain</strong> — link rules together so all must match before the action
                        fires.
                    </li>
                    <li>
                        <strong>SecMarker</strong> — labelled jump target for <code>skipAfter</code>.
                    </li>
                    <li>
                        <strong>libinjection</strong> — purpose-built parser used by{' '}
                        <code>@detectSQLi</code> / <code>@detectXSS</code> instead of regex.
                    </li>
                </ul>
                <Space style={{ marginTop: 24 }}>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                        Need more depth? See{' '}
                        <a
                            href="https://www.coraza.io/docs/seclang/directives/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Coraza SecLang reference
                        </a>{' '}
                        and{' '}
                        <a href="https://coreruleset.org/docs/" target="_blank" rel="noopener noreferrer">
                            CRS docs
                        </a>
                        .
                    </Text>
                </Space>
            </div>
        </Drawer>
    );
};

export default HowToDrawer;
