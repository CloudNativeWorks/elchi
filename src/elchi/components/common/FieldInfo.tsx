import React from 'react';
import { Typography } from 'antd';
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
    return (
        <div>
            {data.map((field) => {
                if (!field.comment) return null;

                const formattedComment = field.comment.replace(/\n/g, '  \n');
                if (field.comment.includes('[#not-implemented-hide:]')) {
                    return null;
                }

                return (
                    <div key={field.name} style={{ marginBottom: '0px' }}>
                        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '8px', borderRadius: '4px' }}>
                            <Text strong style={{ color: 'var(--text-primary)' }}>
                                {formatFieldName(field.name)}: ({field.fieldType})
                            </Text>
                            {field.isDeprecated && (
                                <Text type="danger" style={{ marginLeft: '8px' }}>
                                    Deprecated
                                </Text>
                            )}
                        </div>
                        <div style={{ marginTop: '1px', paddingBottom: '10px', display: 'block', textAlign: 'left', minHeight: '50px', justifyContent: 'center' }}>
                            <div style={{ borderLeft: '2px solid var(--border-default)', paddingLeft: '10px', width: '100%', backgroundColor: 'var(--card-bg)' }}>
                                <ReactMarkdown
                                    remarkPlugins={[remarkDirective, customNotesPlugin, remarkGfm]}
                                    rehypePlugins={[rehypeRaw, rehypeLinkifyCode]}
                                    components={components}
                                >
                                    {formattedComment}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default FieldInfo;