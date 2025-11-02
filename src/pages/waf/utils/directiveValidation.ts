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

/**
 * Main validation function for WAF directives
 */
export const validateDirective = (directive: string): ValidationResult => {
    const warnings: string[] = [];
    const errors: string[] = [];
    let suggestion: string | undefined;

    // Trim directive
    const trimmed = directive.trim();
    if (!trimmed) {
        return {
            valid: false,
            errors: ['Directive cannot be empty'],
            warnings: []
        };
    }

    // Check for multi-line content
    if (trimmed.includes('\n')) {
        warnings.push('Directive contains newlines - will be converted to single line');
    }

    // Check for continuation backslashes (from documentation copy-paste)
    if (/\\\s*\n/.test(directive)) {
        warnings.push('Directive contains line continuation backslashes (\\) - will be removed');
    }

    // Check directive length
    if (trimmed.length > 500) {
        warnings.push('Very long directive detected (>500 characters)');

        if (isCrsRule(trimmed)) {
            suggestion = 'This appears to be a CRS rule. Consider using "Include @owasp_crs/*.conf" instead of copying individual rules.';
        } else {
            suggestion = 'Consider splitting into multiple directives or using Include for rule files.';
        }
    }

    // CRS rule detection
    if (isCrsRule(trimmed)) {
        suggestion = suggestion || 'This looks like a CRS rule. Consider using "Include @owasp_crs/*.conf" to load all CRS rules automatically.';
    }

    // Validate SecRule specifically
    if (trimmed.startsWith('SecRule ')) {
        const secRuleValidation = validateSecRule(trimmed);
        errors.push(...secRuleValidation.errors);
        warnings.push(...secRuleValidation.warnings);
    }

    // Check for complex regex patterns
    if (hasComplexRegex(trimmed) && trimmed.length > 200) {
        warnings.push('Complex regex pattern detected - ensure it is properly escaped');
    }

    // Check for unescaped quotes in JSON context
    const quoteCount = (trimmed.match(/"/g) || []).length;
    if (quoteCount > 2 && quoteCount % 2 !== 0) {
        errors.push('Odd number of quotes detected - may cause JSON parsing errors');
    }

    // Check for common typos
    if (trimmed.includes('SecRulEngine')) {
        errors.push('Typo detected: "SecRulEngine" should be "SecRuleEngine"');
    }

    return {
        valid: errors.length === 0,
        warnings,
        errors,
        suggestion
    };
};

/**
 * Validate multiple directives at once
 */
export const validateDirectives = (directives: string[]): Map<number, ValidationResult> => {
    const results = new Map<number, ValidationResult>();

    directives.forEach((directive, index) => {
        results.set(index, validateDirective(directive));
    });

    return results;
};

/**
 * Get validation summary for UI display
 */
export const getValidationSummary = (result: ValidationResult): string => {
    if (result.valid && result.warnings.length === 0) {
        return 'Valid directive';
    }

    if (!result.valid) {
        return `${result.errors.length} error(s) found`;
    }

    return `${result.warnings.length} warning(s)`;
};
