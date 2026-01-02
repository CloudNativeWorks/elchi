/**
 * WAF Directive Formatter Utilities (Faz 2)
 * Auto-formats ModSecurity/Coraza directives for JSON storage
 */

export interface FormatResult {
    original: string;
    formatted: string;
    changes: string[];
}

/**
 * Remove line continuation backslashes from documentation copy-paste
 * Example: "SecRule ... \\\n     pattern" → "SecRule ... pattern"
 */
const removeContinuationBackslashes = (directive: string): { result: string; changed: boolean } => {
    const original = directive;
    // Remove backslash followed by whitespace (including newlines)
    const result = directive.replace(/\\\s+/g, ' ');
    return {
        result,
        changed: original !== result
    };
};

/**
 * Convert multi-line directive to single line
 */
const convertToSingleLine = (directive: string): { result: string; changed: boolean } => {
    const original = directive;
    // Replace newlines with spaces
    const result = directive.replace(/\n/g, ' ');
    return {
        result,
        changed: original !== result
    };
};

/**
 * Compress multiple consecutive spaces to single space
 */
const compressWhitespace = (directive: string): { result: string; changed: boolean } => {
    const original = directive;
    const result = directive.replace(/\s+/g, ' ').trim();
    return {
        result,
        changed: original !== result
    };
};

/**
 * Fix common quote escaping issues
 */
const fixQuoteEscaping = (directive: string): { result: string; changed: boolean } => {
    let result = directive;
    let changed = false;

    // Fix single quotes inside double-quoted strings (if needed)
    // This is context-aware and only for specific cases

    // Note: Most quote escaping is handled by JSON.stringify
    // This is just for pre-formatting

    return { result, changed };
};

/**
 * Normalize SecRule formatting
 */
const normalizeSecRule = (directive: string): { result: string; changed: boolean } => {
    if (!directive.startsWith('SecRule ')) {
        return { result: directive, changed: false };
    }

    let result = directive;
    let changed = false;

    // Ensure single space after SecRule
    const afterSecRule = result.replace(/^SecRule\s+/, 'SecRule ');
    if (afterSecRule !== result) {
        result = afterSecRule;
        changed = true;
    }

    return { result, changed };
};
