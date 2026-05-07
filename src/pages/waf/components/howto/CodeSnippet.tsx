import React from 'react';
import { App, Button, Tooltip } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { renderHighlightedDirective } from '../../utils/directiveSyntaxHighlight';

interface CodeSnippetProps {
    /** Single-line directive — will get syntax highlighting. */
    code: string;
    /** Multi-line directives are rendered as a plain code block. */
    block?: boolean;
    label?: string;
}

const CodeSnippet: React.FC<CodeSnippetProps> = ({ code, block = false, label }) => {
    const { message } = App.useApp();

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            message.success(label ? `${label} copied` : 'Copied');
        } catch {
            message.error('Could not copy');
        }
    };

    const isMulti = block || code.includes('\n');

    return (
        <div
            style={{
                position: 'relative',
                background: 'var(--bg-secondary, rgba(0,0,0,0.04))',
                border: '1px solid var(--border-default)',
                borderRadius: 6,
                padding: '8px 36px 8px 10px',
                margin: '6px 0',
                fontFamily: 'monospace',
                fontSize: 12,
                overflow: 'auto',
            }}
        >
            <Tooltip title="Copy">
                <Button
                    size="small"
                    type="text"
                    icon={<CopyOutlined />}
                    onClick={copy}
                    style={{ position: 'absolute', top: 4, right: 4, padding: '0 4px' }}
                />
            </Tooltip>
            {isMulti ? (
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {code}
                </pre>
            ) : (
                <div style={{ wordBreak: 'break-word' }}>{renderHighlightedDirective(code)}</div>
            )}
        </div>
    );
};

export default CodeSnippet;
