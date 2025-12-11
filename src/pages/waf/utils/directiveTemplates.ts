/**
 * WAF Directive Templates (Faz 3 - Enhanced)
 * Advanced template system for building Coraza directives
 */

import {
    CORAZA_OPERATORS,
    CORAZA_TRANSFORMATIONS,
    SEVERITY_LEVELS,
    CRS_CATEGORIES,
    SEC_RULE_VARIABLES
} from '../constants/corazaFeatures';

export type DirectiveType = 'Include' | 'SecRule' | 'SecAction' | 'Config' | 'SecRuleRemove' | 'SecRuleUpdate';

export interface DirectiveTemplate {
    type: DirectiveType;
    label: string;
    description: string;
    icon?: string;
    fields: TemplateField[];
    buildDirective: (_values: Record<string, any>) => string;
}

export interface TemplateField {
    name: string;
    label: string;
    type: 'text' | 'select' | 'textarea' | 'number' | 'multiselect' | 'tags';
    required?: boolean;
    placeholder?: string;
    options?: { label: string; value: string; description?: string }[];
    description?: string;
    dependsOn?: { field: string; value: any };
}

/**
 * Enhanced Include Template (Proxy-WASM specific)
 */
export const includeTemplate: DirectiveTemplate = {
    type: 'Include',
    label: 'Include CRS Rules',
    description: 'Include OWASP Core Rule Set',
    icon: '📚',
    fields: [
        {
            name: 'includeType',
            label: 'Include Type',
            type: 'select',
            required: true,
            options: [
                { label: 'CRS Setup Configuration', value: '@crs-setup-conf', description: 'Required CRS configuration' },
                { label: 'All CRS Rules', value: '@owasp_crs/*.conf', description: 'Include all OWASP CRS rules' },
                { label: 'Specific Category', value: 'category', description: 'Include specific attack category' }
            ]
        },
        {
            name: 'category',
            label: 'CRS Category',
            type: 'select',
            dependsOn: { field: 'includeType', value: 'category' },
            options: CRS_CATEGORIES
        }
    ],
    buildDirective: (values) => {
        if (values.includeType === 'category') {
            return `Include ${values.category}`;
        }
        return `Include ${values.includeType}`;
    }
};

// Continue with remaining templates...
export const secRuleTemplate: DirectiveTemplate = {
    type: 'SecRule',
    label: 'Security Rule (Advanced)',
    description: 'Create custom security rule',
    icon: '🛡️',
    fields: [
        { name: 'variables', label: 'Variables', type: 'multiselect', required: true, options: SEC_RULE_VARIABLES },
        { name: 'operator', label: 'Operator', type: 'select', required: true, options: CORAZA_OPERATORS },
        { name: 'pattern', label: 'Pattern', type: 'text', required: true, placeholder: 'e.g., <script' },
        { name: 'transformations', label: 'Transformations', type: 'multiselect', options: CORAZA_TRANSFORMATIONS },
        { name: 'id', label: 'Rule ID', type: 'number', required: true, placeholder: '100001' },
        { name: 'phase', label: 'Phase', type: 'select', required: true, options: [
            { label: 'Phase 1 - Request Headers', value: '1' },
            { label: 'Phase 2 - Request Body', value: '2' },
            { label: 'Phase 3 - Response Headers', value: '3' },
            { label: 'Phase 4 - Response Body', value: '4' }
        ]},
        { name: 'action', label: 'Action', type: 'select', required: true, options: [
            { label: 'deny', value: 'deny' },
            { label: 'pass', value: 'pass' },
            { label: 'drop', value: 'drop' }
        ]},
        { name: 'msg', label: 'Message', type: 'text', required: true, placeholder: 'Attack detected' },
        { name: 'severity', label: 'Severity', type: 'select', required: true, options: SEVERITY_LEVELS },
        { name: 'tags', label: 'Tags', type: 'tags', placeholder: 'attack-sqli' }
    ],
    buildDirective: (values) => {
        const vars = Array.isArray(values.variables) ? values.variables.join('|') : values.variables;
        const actions = [`id:'${values.id}'`, `phase:${values.phase}`];
        if (values.transformations?.length) {
            actions.push(`t:${values.transformations.join(',')}`);
        }
        actions.push(values.action, `msg:'${values.msg}'`, `severity:'${values.severity}'`);
        if (values.tags) {
            values.tags.split(' ').forEach((t: string) => t.trim() && actions.push(`tag:'${t.trim()}'`));
        }
        actions.push('log');
        return `SecRule ${vars} "${values.operator} ${values.pattern}" "${actions.join(',')}"`;
    }
};

export const secRuleRemoveTemplate: DirectiveTemplate = {
    type: 'SecRuleRemove',
    label: 'Remove Rules',
    description: 'Disable CRS rules',
    icon: '🗑️',
    fields: [
        { name: 'ruleIds', label: 'Rule IDs', type: 'text', required: true, placeholder: '941100 941110' }
    ],
    buildDirective: (values) => `SecRuleRemoveById ${values.ruleIds}`
};

export const secRuleUpdateTemplate: DirectiveTemplate = {
    type: 'SecRuleUpdate',
    label: 'Update Rule',
    description: 'Modify CRS rule action',
    icon: '🔄',
    fields: [
        { name: 'ruleId', label: 'Rule ID', type: 'number', required: true },
        { name: 'newAction', label: 'New Action', type: 'select', required: true, options: [
            { label: 'pass', value: 'pass' },
            { label: 'deny', value: 'deny' }
        ]}
    ],
    buildDirective: (values) => `SecRuleUpdateActionById ${values.ruleId} "${values.newAction},log"`
};

export const secActionTemplate: DirectiveTemplate = {
    type: 'SecAction',
    label: 'Action Rule',
    description: 'Unconditional action',
    icon: '⚡',
    fields: [
        { name: 'id', label: 'ID', type: 'number', required: true },
        { name: 'phase', label: 'Phase', type: 'select', required: true, options: [
            { label: 'Phase 1', value: '1' }, { label: 'Phase 2', value: '2' }
        ]},
        { name: 'actionType', label: 'Type', type: 'select', required: true, options: [
            { label: 'setvar', value: 'setvar' }, { label: 'pass', value: 'pass' }
        ]},
        { name: 'varName', label: 'Variable', type: 'text', placeholder: 'tx.score', dependsOn: { field: 'actionType', value: 'setvar' }},
        { name: 'varValue', label: 'Value', type: 'text', placeholder: '+1', dependsOn: { field: 'actionType', value: 'setvar' }}
    ],
    buildDirective: (values) => {
        const actions = [`id:'${values.id}'`, `phase:${values.phase}`];
        if (values.actionType === 'setvar' && values.varName) {
            actions.push(`setvar:'${values.varName}=${values.varValue || '1'}'`);
        } else {
            actions.push(values.actionType);
        }
        return `SecAction "${actions.join(',')}"`;
    }
};

export const configTemplate: DirectiveTemplate = {
    type: 'Config',
    label: 'Configuration',
    description: 'WAF config directive',
    icon: '⚙️',
    fields: [
        { name: 'directive', label: 'Directive', type: 'select', required: true, options: [
            { label: 'SecRuleEngine', value: 'SecRuleEngine' },
            { label: 'SecAuditEngine', value: 'SecAuditEngine' }
        ]},
        { name: 'value', label: 'Value', type: 'text', required: true, placeholder: 'On' }
    ],
    buildDirective: (values) => `${values.directive} ${values.value}`
};

export const DIRECTIVE_TEMPLATES: DirectiveTemplate[] = [
    includeTemplate,
    configTemplate,
    secRuleTemplate,
    secRuleRemoveTemplate,
    secRuleUpdateTemplate,
    secActionTemplate
];

export const getTemplateByType = (type: DirectiveType) => DIRECTIVE_TEMPLATES.find(t => t.type === type);

export const validateTemplateValues = (template: DirectiveTemplate, values: Record<string, any>) => {
    const errors: string[] = [];
    template.fields.forEach(field => {
        if (field.dependsOn && values[field.dependsOn.field] !== field.dependsOn.value) return;
        if (field.required && !values[field.name]) errors.push(`${field.label} is required`);
    });
    return { valid: errors.length === 0, errors };
};
