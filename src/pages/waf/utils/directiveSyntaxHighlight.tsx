/**
 * Directive Syntax Highlighting Utility
 * Applies color highlighting to ModSecurity/Coraza directives
 */

import React from 'react';

export interface SyntaxToken {
    text: string;
    type: 'keyword' | 'operator' | 'action' | 'string' | 'number' | 'variable' | 'default';
}

const KEYWORDS = ['SecRule', 'SecAction', 'Include', 'SecRuleEngine', 'SecAuditEngine', 'SecDebugLogLevel',
                   'SecRequestBodyAccess', 'SecResponseBodyAccess', 'SecAuditLog', 'SecAuditLogParts',
                   'SecAuditLogType', 'SecAuditLogFormat', 'SecDataDir', 'SecTmpDir', 'SecRequestBodyLimit',
                   'SecResponseBodyLimit', 'SecRequestBodyLimitAction', 'SecResponseBodyLimitAction'];

const OPERATORS = ['@rx', '@pm', '@contains', '@streq', '@eq', '@gt', '@lt', '@beginsWith', '@endsWith',
                   '@within', '@validateByteRange', '@validateUrlEncoding', '@pmFromFile'];

const ACTIONS = ['deny', 'pass', 'drop', 'block', 'allow', 'log', 'nolog', 'phase:', 'id:', 'msg:',
                 'severity:', 't:', 'ctl:', 'setvar:', 'tag:'];

const VARIABLES = ['REQUEST_URI', 'REQUEST_HEADERS', 'REQUEST_BODY', 'ARGS', 'REQUEST_COOKIES',
                   'REQUEST_METHOD', 'RESPONSE_HEADERS', 'RESPONSE_BODY', 'REQBODY_ERROR',
                   'MULTIPART_STRICT_ERROR'];

/**
 * Tokenize directive string
 */
export const tokenizeDirective = (directive: string): SyntaxToken[] => {
    const tokens: SyntaxToken[] = [];

    // Simple regex-based tokenization
    const patterns = [
        { regex: new RegExp(`\\b(${KEYWORDS.join('|')})\\b`, 'g'), type: 'keyword' as const },
        { regex: new RegExp(`(${OPERATORS.join('|').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'g'), type: 'operator' as const },
        { regex: new RegExp(`(${ACTIONS.join('|').replace(/:/g, '\\:')})`, 'g'), type: 'action' as const },
        { regex: new RegExp(`\\b(${VARIABLES.join('|')})\\b`, 'g'), type: 'variable' as const },
        { regex: /"([^"]*)"/g, type: 'string' as const },
        { regex: /'([^']*)'/g, type: 'string' as const },
        { regex: /\b\d+\b/g, type: 'number' as const }
    ];

    // Find all matches
    const allMatches: Array<{ index: number; length: number; text: string; type: SyntaxToken['type'] }> = [];

    patterns.forEach(({ regex, type }) => {
        let match;
        const localRegex = new RegExp(regex);
        while ((match = localRegex.exec(directive)) !== null) {
            allMatches.push({
                index: match.index,
                length: match[0].length,
                text: match[0],
                type
            });
        }
    });

    // Sort by position
    allMatches.sort((a, b) => a.index - b.index);

    // Build tokens
    let lastIndex = 0;
    allMatches.forEach(match => {
        // Add text before match as default
        if (match.index > lastIndex) {
            tokens.push({
                text: directive.substring(lastIndex, match.index),
                type: 'default'
            });
        }

        // Add matched token
        tokens.push({
            text: match.text,
            type: match.type
        });

        lastIndex = match.index + match.length;
    });

    // Add remaining text
    if (lastIndex < directive.length) {
        tokens.push({
            text: directive.substring(lastIndex),
            type: 'default'
        });
    }

    return tokens.length > 0 ? tokens : [{ text: directive, type: 'default' }];
};

/**
 * Get color for token type
 */
export const getTokenColor = (type: SyntaxToken['type']): string => {
    const colors: Record<SyntaxToken['type'], string> = {
        keyword: '#1890ff',      // Blue
        operator: '#52c41a',     // Green
        action: '#fa8c16',       // Orange
        string: '#eb2f96',       // Pink
        number: '#722ed1',       // Purple
        variable: '#13c2c2',     // Cyan
        default: '#000000'       // Black
    };

    return colors[type];
};

/**
 * Render highlighted directive as React elements
 */
export const renderHighlightedDirective = (directive: string): React.ReactNode => {
    const tokens = tokenizeDirective(directive);

    return (
        <span style={{ fontFamily: 'monospace', fontSize: 12 }}>
            {tokens.map((token, idx) => (
                <span
                    key={idx}
                    style={{
                        color: getTokenColor(token.type),
                        fontWeight: token.type === 'keyword' ? 'bold' : 'normal'
                    }}
                >
                    {token.text}
                </span>
            ))}
        </span>
    );
};
