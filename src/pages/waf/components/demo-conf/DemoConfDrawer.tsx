import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, App, Button, Drawer, Tag, Tooltip, Typography } from 'antd';
import { CopyOutlined, FileTextOutlined } from '@ant-design/icons';

// The base config file shipped by coraza-proxy-wasm v0.6.0 — what
// `Include @demo-conf` resolves to inside the WASM plugin
// (`wasmplugin/fs.go:19` mapping). Imported as raw text so the editor can
// render it verbatim with comments preserved.
//
// Refresh process when bumping the Coraza WASM version: replace the file at
// `./coraza-demo-0.6.0.conf` with the new copy from
// https://github.com/corazawaf/coraza-proxy-wasm/blob/<tag>/wasmplugin/rules/coraza-demo.conf
//
// Eventually the backend will serve this content via
// `GET /api/v3/waf/crs/:version/demo-conf` (see backend plan addendum).
// Until then the drawer reads from this bundled copy.
import demoConfContent from './coraza-demo-0.6.0.conf?raw';

const { Text, Paragraph } = Typography;

const MonacoEditor = React.lazy(() => import('@monaco-editor/react'));

const readTheme = (): 'vs' | 'vs-dark' =>
    document.documentElement.dataset.theme === 'dark' ? 'vs-dark' : 'vs';

interface DemoConfDrawerProps {
    open: boolean;
    onClose: () => void;
}

/**
 * Read-only view of the upstream `coraza-demo.conf` that the WASM plugin
 * loads when an `Include @demo-conf` directive is encountered.
 *
 * Unlike `crs-setup.conf.example` (which is mostly comments), this file is
 * the live baseline configuration — engine on, body parsing, audit log
 * defaults, processor selection rules, etc. It's what gives every CRS rule
 * the body access it needs to fire.
 *
 * The drawer mirrors `CrsSetupDrawer` for consistency.
 */
const DemoConfDrawer: React.FC<DemoConfDrawerProps> = ({ open, onClose }) => {
    const { message } = App.useApp();
    const [theme, setTheme] = useState<'vs' | 'vs-dark'>(() => readTheme());

    useEffect(() => {
        const observer = new MutationObserver(() => setTheme(readTheme()));
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme', 'class'],
        });
        return () => observer.disconnect();
    }, []);

    const wrapperRef = useRef<HTMLDivElement>(null);
    const [editorHeight, setEditorHeight] = useState<number>(0);
    useEffect(() => {
        const el = wrapperRef.current;
        if (!el) return;
        const apply = () => setEditorHeight(el.offsetHeight);
        apply();
        const ro = new ResizeObserver(apply);
        ro.observe(el);
        return () => ro.disconnect();
    }, [open]);

    const lineCount = useMemo(() => demoConfContent.split('\n').length, []);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(demoConfContent);
            message.success('Copied to clipboard');
        } catch {
            message.error('Could not copy — your browser blocked clipboard access');
        }
    };

    return (
        <Drawer
            title={
                <span>
                    <FileTextOutlined style={{ marginInlineEnd: 8 }} />
                    Demo Conf Reference
                    <Tag color="blue" style={{ marginInlineStart: 8 }}>
                        coraza-proxy-wasm v0.6.0
                    </Tag>
                </span>
            }
            placement="right"
            width={Math.min(960, typeof window !== 'undefined' ? window.innerWidth - 80 : 960)}
            open={open}
            onClose={onClose}
            styles={{ body: { padding: 0, display: 'flex', flexDirection: 'column' } }}
            extra={
                <Tooltip title="Copy entire file">
                    <Button size="small" icon={<CopyOutlined />} onClick={copy}>
                        Copy
                    </Button>
                </Tooltip>
            }
            destroyOnHidden={false}
        >
            <Alert
                type="info"
                showIcon
                style={{ margin: 12 }}
                message="What this is"
                description={
                    <div style={{ fontSize: 12 }}>
                        <Paragraph style={{ marginBottom: 6, fontSize: 12 }}>
                            This is the upstream <code>coraza-demo.conf</code> bundled with{' '}
                            <code>coraza-proxy-wasm v0.6.0</code>. When a directive set contains{' '}
                            <code>Include @demo-conf</code>, the WASM plugin loads exactly this
                            file at runtime.
                        </Paragraph>
                        <Paragraph style={{ marginBottom: 6, fontSize: 12 }}>
                            <Text strong>Most lines are active configuration</Text>, not comments
                            (the opposite of <code>@crs-setup-conf</code>). It turns the engine
                            on, configures request/response body parsing, sets audit-log defaults,
                            and registers JSON/XML processors via three SecRules
                            (<code>200000</code>, <code>200001</code>, <code>200006</code>).
                        </Paragraph>
                        <Paragraph style={{ marginBottom: 0, fontSize: 12 }}>
                            <Text strong>Why this matters for CRS:</Text> without{' '}
                            <code>SecRequestBodyAccess On</code> + the JSON/XML processor rules,
                            most OWASP CRS rules can&rsquo;t inspect POST bodies, so SQLi/XSS
                            checks silently pass through. That&rsquo;s why our presets always
                            include this file before <code>@owasp_crs/*.conf</code>.
                        </Paragraph>
                    </div>
                }
            />

            <div style={{ padding: '0 12px 8px', color: 'var(--text-secondary)', fontSize: 12 }}>
                <FileTextOutlined style={{ marginInlineEnd: 6 }} />
                {lineCount} lines · loaded as <code>@demo-conf</code> by the WASM plugin
            </div>

            <div ref={wrapperRef} style={{ flex: 1, minHeight: 320 }}>
                <React.Suspense
                    fallback={<div style={{ padding: 16, color: 'var(--text-secondary)' }}>Loading editor…</div>}
                >
                    <MonacoEditor
                        height={editorHeight || 480}
                        defaultLanguage="apache"
                        value={demoConfContent}
                        theme={theme}
                        options={{
                            readOnly: true,
                            domReadOnly: true,
                            minimap: { enabled: true },
                            fontSize: 12.5,
                            scrollBeyondLastLine: false,
                            wordWrap: 'on',
                            renderWhitespace: 'none',
                            lineNumbers: 'on',
                            folding: true,
                        }}
                    />
                </React.Suspense>
            </div>
        </Drawer>
    );
};

export default DemoConfDrawer;
