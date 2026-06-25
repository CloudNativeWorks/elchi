import React, { useMemo, useState } from 'react';
import { Typography, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import remarkDirective from 'remark-directive';
import { visit } from 'unist-util-visit';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/cjs/styles/prism';


const { Text } = Typography;

interface StringMatcherProps {
    data: any[];
}

function customNotesPlugin() {
    return function transformer(tree) {
        visit(tree, (node) => {
            if (node.type === 'containerDirective' || node.type === 'leafDirective') {
                if (node.name === 'note' || node.name === 'warning' || node.name === 'attention') {
                    const data = node.data || (node.data = {});
                    data.hName = 'div';
                    data.hProperties = {
                        className: node.name,
                    };
                }
            }
        });
    };
}

function rehypeLinkifyCode() {
    return (tree) => {
        visit(tree, 'element', (node) => {
            if (node.tagName === 'code' && node.children && node.children.length === 1) {
                const textNode = node.children[0];
                if (textNode.type === 'text') {
                    const match = textNode.value.match(/(.+?) <(https?:\/\/[^\s>]+)>/);
                    if (match) {
                        const description = match[1].trim();
                        const url = match[2];

                        node.tagName = 'span';
                        node.children = [
                            {
                                type: 'element',
                                tagName: 'span',
                                properties: {},
                                children: [{ type: 'text', value: description + ' ' }]
                            },
                            {
                                type: 'element',
                                tagName: 'a',
                                properties: {
                                    href: url,
                                    target: '_blank',
                                    rel: 'noopener noreferrer',
                                    style: 'color: var(--color-primary); text-decoration: underline;',
                                },
                                children: [{ type: 'text', value: url }]
                            },
                        ];
                    }
                }
            }
        });
    };
}



const components = {
    div({ className, children }) {
        if (className === 'note') {
            return (
                <div style={{
                    backgroundColor: 'var(--note-bg, #e0f7fa)',
                    padding: '10px',
                    borderLeft: '5px solid var(--note-border, #00796b)',
                    borderRadius: '4px',
                    margin: '10px 0',
                    color: 'var(--text-primary)',
                }}>
                    <strong>Note:</strong> {children}
                </div>
            );
        } else if (className === 'warning') {
            return (
                <div style={{
                    backgroundColor: 'var(--warning-bg, #dc4d05)',
                    padding: '10px',
                    borderLeft: '5px solid var(--warning-border, #b94003)',
                    color: 'var(--warning-text, #000000)',
                    borderRadius: '4px',
                    margin: '10px 0',
                }}>
                    <strong>Warning:</strong> {children}
                </div>
            );
        } else if (className === 'attention') {
            return (
                <div style={{
                    backgroundColor: 'var(--attention-bg, #f2e700)',
                    padding: '10px',
                    borderLeft: '5px solid var(--attention-border, #c2ba05)',
                    color: 'var(--attention-text, #000000)',
                    borderRadius: '4px',
                    margin: '10px 0',
                }}>
                    <strong>Attention:</strong> {children}
                </div>
            );
        }
        return <div>{children}</div>;
    },

    code({ className, children, inline }) {
        if (inline) {
            return (
                <code
                    style={{
                        backgroundColor: 'var(--code-inline-bg, #f5f6f7)',
                        padding: '2px 4px',
                        borderRadius: '4px',
                        fontFamily: 'monospace',
                        color: 'var(--code-inline-color, #d6336c)',
                        fontWeight: 'bold',
                    }}
                >
                    {children}
                </code>
            );
        }

        const match = /language-(\w+)/.exec(className || '');
        if (match) {
            return (
                <SyntaxHighlighter
                    style={dark}
                    language={match[1]}
                    PreTag="div"
                    wrapLongLines={true}
                    showLineNumbers={true}
                >
                    {children}
                </SyntaxHighlighter>
            );
        }

        return (
            <code
                style={{
                    backgroundColor: 'var(--code-block-bg, #185b9e)',
                    padding: '2px 4px',
                    borderRadius: '4px',
                    fontFamily: 'monospace',
                    color: 'var(--code-block-color, #ffffff)',
                    fontWeight: 'bold',
                }}
            >
                {children}
            </code>
        );
    },
};

function formatFieldName(name: string): string {
    const formattedName = name
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    if (formattedName.includes(".")) {
        return formattedName.split(".").slice(1).join(".").replace(/^./, str => str.toUpperCase());
    }

    return formattedName;
}

const FieldInfo: React.FC<StringMatcherProps> = ({ data }) => {
    const [query, setQuery] = useState('');

    // Only fields that actually have documentation to show.
    const visibleFields = useMemo(
        () => (data || []).filter(
            (f) => f.comment && !f.comment.includes('[#not-implemented-hide:]')
        ),
        [data]
    );

    const filteredFields = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return visibleFields;
        return visibleFields.filter((f) => {
            return (
                formatFieldName(f.name).toLowerCase().includes(q) ||
                (f.name || '').toLowerCase().includes(q) ||
                (f.fieldType || '').toLowerCase().includes(q) ||
                (f.comment || '').toLowerCase().includes(q)
            );
        });
    }, [visibleFields, query]);

    return (
        <div>
            {/* Tighten ReactMarkdown's default block spacing so descriptions
                stay compact inside each card. */}
            <style>{`
                .field-info-md p { margin: 0 0 6px; line-height: 1.55; }
                .field-info-md p:last-child { margin-bottom: 0; }
                .field-info-md ul, .field-info-md ol { margin: 4px 0 6px; padding-left: 18px; }
                .field-info-md li { margin: 2px 0; }
            `}</style>

            {/* Sticky search header — essential when a message has dozens of fields. */}
            <div style={{
                position: 'sticky',
                top: 0,
                zIndex: 2,
                background: 'var(--bg-surface)',
                paddingBottom: 12,
                marginBottom: 4,
            }}>
                <Input
                    allowClear
                    size="middle"
                    placeholder="Search fields by name, type or description..."
                    prefix={<SearchOutlined style={{ color: 'var(--text-tertiary)' }} />}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <Text style={{ display: 'block', marginTop: 6, fontSize: 12, color: 'var(--text-tertiary)' }}>
                    {filteredFields.length} / {visibleFields.length} fields
                </Text>
            </div>

            {filteredFields.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '48px 16px',
                    color: 'var(--text-secondary)',
                }}>
                    <SearchOutlined style={{ fontSize: 28, marginBottom: 12, opacity: 0.5 }} />
                    <div style={{ fontSize: 15, marginBottom: 4 }}>No fields found</div>
                    <div style={{ fontSize: 12 }}>
                        {query ? `Nothing matches "${query}".` : 'No documented fields available.'}
                    </div>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {filteredFields.map((field, idx) => {
                        const formattedComment = field.comment.replace(/\n/g, '  \n');
                        return (
                            <div
                                key={`${field.name}-${idx}`}
                                style={{
                                    border: '1px solid var(--border-default)',
                                    borderRadius: 10,
                                    overflow: 'hidden',
                                    background: 'var(--card-bg)',
                                }}
                            >
                                {/* Header: field name + type pill + deprecated flag */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    flexWrap: 'wrap',
                                    padding: '9px 14px',
                                    background: 'var(--bg-surface)',
                                    borderBottom: '1px solid var(--border-default)',
                                }}>
                                    <Text strong style={{ fontSize: 14, color: 'var(--text-primary)' }}>
                                        {formatFieldName(field.name)}
                                    </Text>
                                    {field.fieldType && (
                                        <span style={{
                                            fontFamily: 'Monaco, Consolas, monospace',
                                            fontSize: 11,
                                            fontWeight: 600,
                                            padding: '2px 8px',
                                            borderRadius: 6,
                                            background: 'var(--color-primary-bg)',
                                            border: '1px solid var(--color-primary-border)',
                                            color: 'var(--color-primary)',
                                        }}>
                                            {field.fieldType}
                                        </span>
                                    )}
                                    {field.isDeprecated && (
                                        <span style={{
                                            fontSize: 10,
                                            fontWeight: 700,
                                            letterSpacing: 0.4,
                                            padding: '2px 8px',
                                            borderRadius: 6,
                                            background: 'var(--color-danger-bg, rgba(245,34,45,0.12))',
                                            color: 'var(--color-danger)',
                                            textTransform: 'uppercase',
                                        }}>
                                            Deprecated
                                        </span>
                                    )}
                                </div>

                                {/* Body: markdown description */}
                                <div className="field-info-md" style={{
                                    padding: '10px 14px',
                                    color: 'var(--text-secondary)',
                                    fontSize: 13,
                                }}>
                                    <ReactMarkdown
                                        remarkPlugins={[remarkDirective, customNotesPlugin, remarkGfm]}
                                        rehypePlugins={[rehypeRaw, rehypeLinkifyCode]}
                                        components={components}
                                    >
                                        {formattedComment}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default FieldInfo;