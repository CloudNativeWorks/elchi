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

const EXAMPLES: ShieldExample[] = [
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
