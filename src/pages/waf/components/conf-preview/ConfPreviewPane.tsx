import React, { useEffect, useMemo, useRef, useState } from 'react';
import { App, Button, Empty, Tag, Tooltip, Typography } from 'antd';
import { CopyOutlined, FileTextOutlined } from '@ant-design/icons';
import { useWafEditor } from '../../state/wafEditorStore';
import { serializeEditor } from '../../utils/confSerializer';

const { Text } = Typography;

const MonacoEditor = React.lazy(() => import('@monaco-editor/react'));

const readTheme = (): 'vs' | 'vs-dark' =>
    document.documentElement.dataset.theme === 'dark' ? 'vs-dark' : 'vs';

/**
 * Read-only preview of the generated `.conf` file as Coraza would load it.
 *
 * Why we measure height with ResizeObserver instead of using `height="100%"`:
 * antd's Tabs doesn't propagate flex height down to its tabpane children, so
 * Monaco with `height="100%"` collapses to 0px. We measure the wrapper and
 * hand Monaco a pixel height directly, which always works.
 */
const ConfPreviewPane: React.FC = () => {
    const { state } = useWafEditor();
    const value = useMemo(() => serializeEditor(state.editor), [state.editor]);
    const [theme, setTheme] = useState<'vs' | 'vs-dark'>(() => readTheme());

    const wrapperRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState<number>(0);
    const { message } = App.useApp();

    useEffect(() => {
        const observer = new MutationObserver(() => setTheme(readTheme()));
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme', 'class'],
        });
        return () => observer.disconnect();
    }, []);

    // Measure wrapper height for Monaco. Falls back to 480px if the layout
    // is in a transient zero-height state (first paint, ancestor collapse).
    useEffect(() => {
        const el = wrapperRef.current;
        if (!el) return;
        const apply = () => setHeight(el.offsetHeight);
        apply();
        const ro = new ResizeObserver(apply);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const lineCount = value.split('\n').length;
    const byteSize = useMemo(() => new Blob([value]).size, [value]);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            message.success('Copied to clipboard');
        } catch {
            message.error('Could not copy — your browser blocked clipboard access');
        }
    };

    if (state.editor.sets.length === 0) {
        return (
            <Empty
                description="Add a set to see the .conf preview"
                style={{ padding: '64px 0' }}
            />
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 16px',
                    borderBottom: '1px solid var(--border-default)',
                    background: 'var(--card-bg)',
                }}
            >
                <FileTextOutlined style={{ color: 'var(--text-secondary)' }} />
                <Text strong style={{ fontSize: 13 }}>
                    {(state.editor.name || 'waf') + '.conf'}
                </Text>
                <Tag style={{ marginInlineEnd: 0 }}>{lineCount} lines</Tag>
                <Tag style={{ marginInlineEnd: 0 }}>{byteSize} B</Tag>
                <span style={{ flex: 1 }} />
                <Text type="secondary" style={{ fontSize: 12 }}>
                    Read-only · Monaco
                </Text>
                <Tooltip title="Copy to clipboard">
                    <Button size="small" icon={<CopyOutlined />} onClick={copy}>
                        Copy
                    </Button>
                </Tooltip>
            </div>

            <div ref={wrapperRef} style={{ flex: 1, minHeight: 320 }}>
                <React.Suspense
                    fallback={<div style={{ padding: 16, color: 'var(--text-secondary)' }}>Loading editor…</div>}
                >
                    <MonacoEditor
                        height={height || 480}
                        defaultLanguage="apache"
                        value={value}
                        theme={theme}
                        options={{
                            readOnly: true,
                            domReadOnly: true,
                            minimap: { enabled: false },
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
        </div>
    );
};

export default ConfPreviewPane;
