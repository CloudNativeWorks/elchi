/**
 * WAF Directive Validation Utilities (Faz 1)
 * Validates ModSecurity/Coraza directives for common issues
 */

export interface ValidationResult {
    valid: boolean;
    warnings: string[];
    errors: string[];
    suggestion?: string;
    formatted?: string;
}

/**
 * Check if regex pattern has balanced parentheses
 */
const hasBalancedParentheses = (pattern: string): { balanced: boolean; open: number; close: number } => {
    const open = (pattern.match(/\(/g) || []).length;
    const close = (pattern.match(/\)/g) || []).length;
    return {
        balanced: open === close,
        open,
        close
    };
};

/**
 * Check if regex pattern has balanced square brackets
 */
const hasBalancedBrackets = (pattern: string): { balanced: boolean; open: number; close: number } => {
    const open = (pattern.match(/\[/g) || []).length;
    const close = (pattern.match(/\]/g) || []).length;
    return {
        balanced: open === close,
        open,
        close
    };
};

/**
 * Detect if directive is likely a CRS rule
 */
const isCrsRule = (directive: string): boolean => {
    // CRS rules typically have IDs starting with 9xxxxx
    const crsIdPattern = /id:\s*['"]?9\d{5}/i;
    return crsIdPattern.test(directive);
};

/**
 * Detect if directive contains complex regex
 */
const hasComplexRegex = (directive: string): boolean => {
    const regexOperators = ['@rx', '@pm', '@pmf', '@pmFromFile'];
    return regexOperators.some(op => directive.includes(op));
};

/**
 * Validate SecRule directive structure
 */
const validateSecRule = (directive: string): Pick<ValidationResult, 'errors' | 'warnings'> => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for regex operators
    const regexMatch = directive.match(/"@rx\s+([^"]+)"/);
    if (regexMatch) {
        const pattern = regexMatch[1];

        // Check balanced parentheses
        const parenCheck = hasBalancedParentheses(pattern);
        if (!parenCheck.balanced) {
            errors.push(
                `Regex pattern has ${parenCheck.open} opening but ${parenCheck.close} closing parentheses. ` +
                `Pattern may be incomplete.`
            );
        }

        // Check balanced brackets
        const bracketCheck = hasBalancedBrackets(pattern);
        if (!bracketCheck.balanced) {
            errors.push(
                `Regex pattern has ${bracketCheck.open} opening but ${bracketCheck.close} closing square brackets. ` +
                `Pattern may be incomplete.`
            );
        }

        // Check for common regex errors
        if (pattern.includes('(?i') && !pattern.includes('(?i)')) {
            warnings.push('Case-insensitive flag "(?i" should be "(?i)" with closing parenthesis');
        }
    }

    // Check for required SecRule components
    if (directive.startsWith('SecRule ')) {
        const hasVariable = /SecRule\s+[A-Z_]+/.test(directive);
        const hasOperator = /@[a-z]+/.test(directive);
        const hasAction = /phase:\d/.test(directive) || /pass|deny|drop|allow|block/.test(directive);

        if (!hasVariable) {
            errors.push('SecRule missing variable (e.g., REQUEST_URI, ARGS)');
        }
        if (!hasOperator) {
            errors.push('SecRule missing operator (e.g., @rx, @contains, @eq)');
        }
        if (!hasAction) {
            warnings.push('SecRule should have actions (e.g., phase:1, deny, pass)');
        }
    }

    return { errors, warnings };
};
