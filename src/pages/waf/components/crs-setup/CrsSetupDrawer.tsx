import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, App, Button, Drawer, Tag, Tooltip, Typography } from 'antd';
import { CopyOutlined, FileTextOutlined } from '@ant-design/icons';

// The example file shipped by coraza-proxy-wasm v0.6.0 — this is what
// `Include @crs-setup-conf` resolves to inside the WASM plugin
// (`wasmplugin/fs.go:23` mapping). Imported as raw text so the editor can
// render it verbatim with comments preserved.
//
// Refresh process when bumping CRS / Coraza versions: replace the file at
// `./crs-setup-4.14.0.conf` with the new example from
// https://github.com/corazawaf/coraza-proxy-wasm/blob/<tag>/wasmplugin/rules/crs-setup.conf.example
//
// Eventually the backend will serve this content via
// `GET /api/v3/waf/crs/:version/setup-conf` (see WAF backend plan addendum).
// At that point this file becomes a fallback and the drawer will fetch
// the canonical version on open.
import setupConfContent from './crs-setup-4.14.0.conf?raw';

const { Text, Paragraph } = Typography;

const MonacoEditor = React.lazy(() => import('@monaco-editor/react'));

const readTheme = (): 'vs' | 'vs-dark' =>
    document.documentElement.dataset.theme === 'dark' ? 'vs-dark' : 'vs';

interface CrsSetupDrawerProps {
    open: boolean;
    onClose: () => void;
}

/**
 * Read-only view of the upstream `crs-setup.conf.example` that the WASM
 * plugin loads when an `Include @crs-setup-conf` directive is encountered.
 *
 * Almost every `setvar:tx.X=...` line in this file is **commented out** by
 * design — the OWASP CRS expects users to uncomment and customise the
 * values they care about. From Elchi's UI, the practical move is to copy
 * the SecAction (without leading `#`) into the active directive set after
 * the include.
 */
const CrsSetupDrawer: React.FC<CrsSetupDrawerProps> = ({ open, onClose }) => {
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

    const lineCount = useMemo(() => setupConfContent.split('\n').length, []);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(setupConfContent);
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
                    CRS Setup Reference
                    <Tag color="blue" className='auto-width-tag' style={{ marginInlineStart: 8 }}>
                        v4.14.0
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
                            This is the upstream <code>crs-setup.conf.example</code> bundled with{' '}
                            <code>coraza-proxy-wasm v0.6.0</code>. When a directive set contains{' '}
                            <code>Include @crs-setup-conf</code>, the WASM plugin loads exactly
                            this file at runtime.
                        </Paragraph>
                        <Paragraph style={{ marginBottom: 6, fontSize: 12 }}>
                            <Text strong>Almost every line is commented out by design.</Text>{' '}
                            The CRS team ships defaults disabled so each deployment can opt into
                            the values it wants. Variables like <code>tx.allowed_methods</code>{' '}
                            are <strong>not</strong> set unless you uncomment the corresponding{' '}
                            <code>SecAction</code> here, or — preferably — add your own{' '}
                            <code>SecAction</code> with the value you want into your directive
                            set <em>after</em> the <code>Include</code>.
                        </Paragraph>
                        <Paragraph style={{ marginBottom: 0, fontSize: 12 }}>
                            Real default values (paranoia level 1, anomaly threshold 5, etc.)
                            come from <code>REQUEST-901-INITIALIZATION.conf</code>, which loads
                            after this file via <code>Include @owasp_crs/*.conf</code>.
                        </Paragraph>
                    </div>
                }
            />

            <div style={{ padding: '0 12px 8px', color: 'var(--text-secondary)', fontSize: 12 }}>
                <FileTextOutlined style={{ marginInlineEnd: 6 }} />
                {lineCount} lines · loaded as <code>@crs-setup-conf</code> by the WASM plugin
            </div>

            <div ref={wrapperRef} style={{ flex: 1, minHeight: 320 }}>
                <React.Suspense
                    fallback={<div style={{ padding: 16, color: 'var(--text-secondary)' }}>Loading editor…</div>}
                >
                    <MonacoEditor
                        height={editorHeight || 480}
                        defaultLanguage="apache"
                        value={setupConfContent}
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

export default CrsSetupDrawer;
