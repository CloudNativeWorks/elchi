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
                            key: 'includes',
                            href: '#howto-includes',
                            title: <AnchorLabel emoji="📦" text="Includes you need" />,
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
                            title: <AnchorLabel emoji="⚠️" text="WASM limits" />,
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
                    subtitle="A working WAF in 4 lines"
                />
                <Paragraph>
                    Drop these directives into your <strong>default set</strong> in this order. Engine on,
                    body parsing configured, CRS defaults loaded, all OWASP rule files included. Baseline
                    WAF.
                </Paragraph>
                <CodeSnippet
                    block
                    label="Quick start"
                    code={`SecRuleEngine On
Include @demo-conf
Include @crs-setup-conf
Include @owasp_crs/*.conf`}
                />
                <Alert
                    type="info"
                    showIcon
                    message="Order matters"
                    description={
                        <Text style={{ fontSize: 12 }}>
                            <code>@demo-conf</code> turns on body parsing and registers JSON/XML
                            processors — without it, most CRS rules silently miss attacks in POST bodies.
                            <code>@crs-setup-conf</code> is the CRS setup file (almost everything is
                            commented out, see <strong>CRS Setup</strong> in the sidebar); you inherit
                            paranoia 1 + anomaly threshold 5 from CRS&rsquo; init rules. Override with a{' '}
                            <code>SecAction</code> after the includes. See <strong>Includes you need</strong>{' '}
                            below for the full breakdown.
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

                {/* Includes you need */}
                <SectionHeader
                    id="howto-includes"
                    icon={<ReadOutlined />}
                    title="Includes you need"
                    subtitle="@demo-conf vs @crs-setup-conf vs @owasp_crs"
                />
                <Paragraph>
                    <code>Include</code> directives pull in pre-bundled config files. The WASM plugin
                    resolves three magic paths to embedded files:
                </Paragraph>
                <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse', marginBottom: 8 }}>
                    <thead>
                        <tr style={{ background: 'var(--bg-secondary, rgba(0,0,0,0.04))' }}>
                            <th style={{ textAlign: 'left', padding: 6 }}>Include</th>
                            <th style={{ textAlign: 'left', padding: 6 }}>What it loads</th>
                            <th style={{ textAlign: 'left', padding: 6 }}>Required for</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ padding: 6, verticalAlign: 'top' }}>
                                <code>@demo-conf</code>
                            </td>
                            <td style={{ padding: 6, verticalAlign: 'top' }}>
                                Live config: <code>SecRequestBodyAccess On</code>, body limits,
                                JSON/XML processor selection rules (id 200000/200001/200006),
                                request-body parse-error reject (id 200002/200003), response body
                                inspection, audit log defaults pointing to <code>/dev/stdout</code>.
                            </td>
                            <td style={{ padding: 6, verticalAlign: 'top' }}>
                                Any setup that wants OWASP CRS to inspect <strong>POST/JSON/XML
                                bodies</strong>. Without it, body-targeting rules silently miss
                                attacks. <strong>Skip only if you replicate the body-parser bits
                                manually.</strong>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ padding: 6, verticalAlign: 'top' }}>
                                <code>@crs-setup-conf</code>
                            </td>
                            <td style={{ padding: 6, verticalAlign: 'top' }}>
                                The upstream <code>crs-setup.conf.example</code>. Almost every line is{' '}
                                <strong>commented out</strong>; only <code>id:900990</code> is active
                                and stamps <code>tx.crs_setup_version=4140</code>.
                            </td>
                            <td style={{ padding: 6, verticalAlign: 'top' }}>
                                Loading <code>@owasp_crs/*.conf</code>. CRS&rsquo; init file
                                refuses to run if <code>tx.crs_setup_version</code> is unset,
                                showing a config error. <strong>Required when you load CRS rules.</strong>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ padding: 6, verticalAlign: 'top' }}>
                                <code>@owasp_crs/*.conf</code>
                            </td>
                            <td style={{ padding: 6, verticalAlign: 'top' }}>
                                The actual OWASP CRS rule files (REQUEST-901, REQUEST-911, …,
                                REQUEST-949 + RESPONSE-9xx). The defenses themselves.
                            </td>
                            <td style={{ padding: 6, verticalAlign: 'top' }}>
                                Any time you want OWASP CRS attack detection. Skip if you&rsquo;re
                                writing a fully custom ruleset.
                            </td>
                        </tr>
                    </tbody>
                </table>
                <Alert
                    type="warning"
                    showIcon
                    style={{ marginTop: 4 }}
                    message="Order is part of correctness"
                    description={
                        <Text style={{ fontSize: 12 }}>
                            Always: <code>@demo-conf</code> → <code>@crs-setup-conf</code> →
                            (your <code>SecAction</code> overrides) → <code>@owasp_crs/*.conf</code>.
                            Your <code>setvar</code> SecActions must run <em>before</em> CRS init
                            so its &ldquo;set if unset&rdquo; defaults don&rsquo;t overwrite you.
                        </Text>
                    }
                />
                <Paragraph type="secondary" style={{ fontSize: 12, marginTop: 8 }}>
                    Open <strong>CRS Setup</strong> and <strong>Demo Conf</strong> in the sidebar to
                    read either file verbatim. Use <strong>Load template</strong> to apply a curated
                    set that wires all three correctly.
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

                <Title level={5}>Rate limiting / brute-force counting</Title>
                <Alert
                    type="warning"
                    showIcon
                    style={{ marginTop: 4 }}
                    message="Don't use SecRule + IP collection here"
                    description={
                        <Text style={{ fontSize: 12 }}>
                            ModSecurity tutorials reach for <code>initcol</code> +{' '}
                            <code>setvar:ip.failed_attempts</code> for rate limiting. In
                            coraza-proxy-wasm those collections don&rsquo;t persist across
                            requests, so the counter resets every request and the rule is a
                            no-op. Use Envoy&rsquo;s <strong>local_ratelimit</strong> /{' '}
                            <strong>ratelimit</strong> filter instead — it&rsquo;s native and
                            actually works.
                        </Text>
                    }
                />

                {/* WASM */}
                <SectionHeader
                    id="howto-wasm"
                    icon={<ExclamationCircleOutlined />}
                    title="coraza-proxy-wasm v0.6.0"
                    subtitle="What works · what doesn't"
                />
                <Paragraph>
                    The runtime is a Proxy-Wasm filter compiled with TinyGo 0.34. The WebAssembly
                    sandbox has{' '}
                    <strong>no filesystem writes, no shell, no outbound network beyond the proxy</strong>,
                    and no shared memory between requests by default. Coraza features that depend on
                    those facilities are silently no-ops or rejected.
                </Paragraph>

                <Title level={5} style={{ marginTop: 12 }}>
                    <CheckCircleOutlined style={{ color: 'var(--color-success)' }} /> What works
                </Title>
                <ul style={{ fontSize: 13, paddingInlineStart: 18 }}>
                    <li>
                        OWASP CRS <strong>v4.14.0</strong> bundled — same rules you see in CRS Library.
                    </li>
                    <li>
                        <strong>Multiphase evaluation</strong> on by default — rules run as soon as
                        their variables are ready, blocks happen earlier.
                    </li>
                    <li>
                        Operators <code>@rx</code>, <code>@pm</code>, <code>@detectSQLi</code>,{' '}
                        <code>@detectXSS</code> (libinjection) ship via <code>coraza-wasilibs</code>.
                        <code>@contains</code>, <code>@beginsWith</code>, <code>@streq</code>,{' '}
                        <code>@within</code>, <code>@eq/gt/lt</code>, <code>@ipMatch</code>,{' '}
                        <code>@validateByteRange</code> work — they&rsquo;re stateless / pure compute.
                    </li>
                    <li>
                        Prometheus metrics with phase + rule-id labels are exposed by the filter.
                    </li>
                    <li>
                        Audit log routed to Envoy stdout (<code>/dev/stdout</code>) in JSON format —
                        scrapeable from the proxy logs.
                    </li>
                </ul>

                <Title level={5} style={{ marginTop: 12 }}>
                    <ExclamationCircleOutlined style={{ color: 'var(--color-warning)' }} /> Partial / parsed-but-not-enforced
                </Title>
                <ul style={{ fontSize: 13, paddingInlineStart: 18 }}>
                    <li>
                        <strong>Tuning required.</strong> Out-of-the-box CRS false-positives on
                        legitimate traffic. Start in <code>DetectionOnly</code>, watch logs, add
                        exceptions, then promote to <code>On</code>.
                    </li>
                    <li>
                        <strong>TinyGo 0.34 memory pressure.</strong> GC quirks can surface under load.
                        Load-test before production.
                    </li>
                    <li>
                        <code>SecArgumentsLimit</code> — parsed but the limit is not enforced
                        (Coraza issue #1752). Rely on <code>SecRequestBodyLimit</code> for size caps.
                    </li>
                    <li>
                        <code>SecResponseBodyAccess</code> — partial: some CRS rules can&rsquo;t
                        access response body in WASM.
                    </li>
                    <li>
                        <code>SecDefaultAction</code> — applies only to rules in the same phase.
                    </li>
                    <li>
                        <code>SecAction</code> — only the <code>tx</code> collection is supported
                        for <code>setvar</code>. <code>setvar:ip.X</code>, <code>setvar:session.X</code>,
                        etc. don&rsquo;t persist (see below).
                    </li>
                </ul>

                <Title level={5} style={{ marginTop: 12 }}>
                    <StopOutlined style={{ color: 'var(--color-danger)' }} /> Not supported in WASM
                </Title>
                <Paragraph type="secondary" style={{ fontSize: 12 }}>
                    Don&rsquo;t bother writing rules that depend on these — they&rsquo;ll be parsed
                    silently or rejected, and the security control you intended will quietly not exist.
                </Paragraph>
                <ul style={{ fontSize: 13, paddingInlineStart: 18 }}>
                    <li>
                        <strong>Persistent collections.</strong> <code>initcol</code>,{' '}
                        <code>setsid</code>, <code>setuid</code>, and writes to{' '}
                        <code>IP</code>, <code>SESSION</code>, <code>USER</code>, <code>GLOBAL</code>,
                        <code>RESOURCE</code> collections do <em>not persist across requests</em> in
                        coraza-proxy-wasm — the WASM VM has no host filesystem and no built-in memcache
                        backend. <strong>Rate limiting / brute-force counters built on these don&rsquo;t
                        actually count anything past a single request.</strong> Use Envoy&rsquo;s native
                        rate-limit filter for that.
                    </li>
                    <li>
                        <strong>Lua / external scripts.</strong> The <code>exec</code> action and{' '}
                        <code>SecRuleScript</code> directive require running Lua or shell scripts —
                        no execution surface in WASM. Any rule using these will fail to load.
                    </li>
                    <li>
                        <code>@pmFromFile</code> with an external path — the WASM plugin only sees
                        its embedded read-only filesystem (<code>@owasp_crs/...</code>,{' '}
                        <code>@demo-conf</code>, <code>@crs-setup-conf</code>). External pattern
                        files can&rsquo;t be loaded. Use <code>@pm pattern1 pattern2 ...</code> inline.
                    </li>
                    <li>
                        <code>@geoLookup</code> — needs a GeoIP database on disk. Not bundled.
                    </li>
                    <li>
                        <code>@inspectFile</code> — runs an external binary against uploaded files.
                        No exec surface.
                    </li>
                    <li>
                        <code>SecRemoteRules</code>, <code>SecRemoteRulesFailAction</code> — fetching
                        rules over HTTP at start-up isn&rsquo;t wired in coraza-proxy-wasm.
                    </li>
                    <li>
                        <strong>Audit log file output.</strong> <code>SecAuditLog /var/log/...</code>{' '}
                        and <code>SecAuditLogStorageDir</code> are silent no-ops; logs always go to
                        Envoy stdout. <code>SecAuditLogType Concurrent</code> is unusable.
                    </li>
                    <li>
                        <code>SecAuditLogParts</code> — parts <strong>D, G, I, J</strong> are not
                        generated. Safe set: <code>ABCFHZ</code> (or <code>ABCEFHKZ</code> with
                        request body if you need it).
                    </li>
                    <li>
                        <code>SecRequestBodyNoFilesLimit</code> — parsed but not enforced.
                    </li>
                    <li>
                        <code>SecUploadDir</code>, <code>SecUploadKeepFiles</code>,{' '}
                        <code>SecUploadFileMode</code> — file-system-bound, no place to put files.
                    </li>
                    <li>
                        <code>SecCookieFormat</code>, <code>SecArgumentSeparator</code> — Coraza
                        doesn&rsquo;t implement these.
                    </li>
                    <li>
                        <code>hashEngine</code> / <code>hashEnforcement</code> ctl options — TBI in
                        Coraza upstream.
                    </li>
                </ul>

                <Alert
                    type="info"
                    showIcon
                    style={{ marginTop: 8 }}
                    message="Mental model"
                    description={
                        <Text style={{ fontSize: 12 }}>
                            Anything that needs to <strong>remember state across requests</strong>{' '}
                            (counters, sessions, IP-based throttling) or{' '}
                            <strong>touch external resources</strong> (files, scripts, remote URLs,
                            GeoIP) is unsupported here. Coraza-proxy-wasm is best at{' '}
                            <em>per-request, content-inspection</em> rules — exactly what OWASP CRS
                            uses it for.
                        </Text>
                    }
                />

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
                    <li>
                        <strong>Persistent collection</strong> — <code>IP</code>, <code>SESSION</code>,
                        <code>USER</code>, <code>GLOBAL</code>, <code>RESOURCE</code> in ModSecurity:
                        store data across requests. <strong>Not functional in WASM</strong> — no
                        backing store. Don&rsquo;t build rate-limiting on these.
                    </li>
                    <li>
                        <strong>Proxy-Wasm</strong> — the WebAssembly ABI that Envoy uses to load
                        filters like coraza. Sandboxed: no filesystem writes, no shell, no arbitrary
                        outbound network.
                    </li>
                    <li>
                        <strong>libinjection / wasilibs</strong> — <code>coraza-wasilibs</code> ports
                        the heavy operators (<code>@rx</code>, <code>@pm</code>, libinjection
                        SQLi/XSS) to WASM with C-bindings; everything else falls back to pure-Go
                        which TinyGo compiles directly.
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
