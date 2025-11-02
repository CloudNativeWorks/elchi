/**
 * Common WAF Directives Templates
 * Pre-configured ModSecurity/Coraza directive options for quick setup
 */

export interface DirectiveOption {
    label: string;
    value: string;
}

export interface CommonDirective {
    key: string;
    label: string;
    description: string;
    recommended?: boolean;
    options: DirectiveOption[];
}

export const COMMON_DIRECTIVES: CommonDirective[] = [
    {
        key: 'SecRuleEngine',
        label: 'SecRuleEngine',
        description: 'WAF engine status',
        options: [
            { label: 'On', value: 'SecRuleEngine On' },
            { label: 'Off', value: 'SecRuleEngine Off' },
            { label: 'DetectionOnly', value: 'SecRuleEngine DetectionOnly' }
        ]
    },
    {
        key: 'Include',
        label: 'Include',
        description: 'Include rule file (Recommended for CRS)',
        recommended: true,
        options: [
            { label: 'CRS Setup Conf', value: 'Include @crs-setup-conf' },
            { label: 'OWASP CRS', value: 'Include @owasp_crs/*.conf' }
        ]
    },
    {
        key: 'SecDebugLogLevel',
        label: 'SecDebugLogLevel',
        description: 'Debug log verbosity level',
        options: [
            { label: 'Level 0 - No logging', value: 'SecDebugLogLevel 0' },
            { label: 'Level 3 - Info', value: 'SecDebugLogLevel 3' },
            { label: 'Level 5 - Debug', value: 'SecDebugLogLevel 5' },
            { label: 'Level 9 - Trace', value: 'SecDebugLogLevel 9' }
        ]
    },
    {
        key: 'SecRequestBodyAccess',
        label: 'SecRequestBodyAccess',
        description: 'Analyze request body',
        options: [
            { label: 'On', value: 'SecRequestBodyAccess On' },
            { label: 'Off', value: 'SecRequestBodyAccess Off' }
        ]
    },
    {
        key: 'XMLRequestBodyParser',
        label: 'XML Request Body Parser',
        description: 'Enable XML request body parser',
        options: [
            { label: 'XML Content-Type Rule', value: 'SecRule REQUEST_HEADERS:Content-Type "^(?:application(?:/soap\\+|/)|text/)xml" \\\n     "id:\'200000\',phase:1,t:none,t:lowercase,pass,nolog,ctl:requestBodyProcessor=XML"' }
        ]
    },
    {
        key: 'JSONRequestBodyParser',
        label: 'JSON Request Body Parser',
        description: 'Enable JSON request body parser',
        options: [
            { label: 'JSON Content-Type Rule', value: 'SecRule REQUEST_HEADERS:Content-Type "^application/json" \\\n     "id:\'200001\',phase:1,t:none,t:lowercase,pass,nolog,ctl:requestBodyProcessor=JSON"' }
        ]
    },
    {
        key: 'JSONSubtypesParser',
        label: 'JSON Subtypes Parser',
        description: 'Enable JSON parser for +json subtypes',
        options: [
            { label: 'JSON Subtypes Rule', value: 'SecRule REQUEST_HEADERS:Content-Type "^application/[a-z0-9.-]+[+]json" \\\n     "id:\'200006\',phase:1,t:none,t:lowercase,pass,nolog,ctl:requestBodyProcessor=JSON"' }
        ]
    },
    {
        key: 'SecRequestBodyLimit',
        label: 'SecRequestBodyLimit',
        description: 'Maximum request body size',
        options: [
            { label: '128 KB (131072)', value: 'SecRequestBodyLimit 131072' },
            { label: '1 MB (1048576)', value: 'SecRequestBodyLimit 1048576' },
            { label: '10 MB (10485760)', value: 'SecRequestBodyLimit 10485760' }
        ]
    },
    {
        key: 'SecRequestBodyInMemoryLimit',
        label: 'SecRequestBodyInMemoryLimit',
        description: 'Max request body size stored in memory',
        options: [
            { label: '128 KB (131072)', value: 'SecRequestBodyInMemoryLimit 131072' },
            { label: '256 KB (262144)', value: 'SecRequestBodyInMemoryLimit 262144' }
        ]
    },
    {
        key: 'SecRequestBodyLimitAction',
        label: 'SecRequestBodyLimitAction',
        description: 'Action when request body exceeds limit',
        options: [
            { label: 'Reject', value: 'SecRequestBodyLimitAction Reject' },
            { label: 'ProcessPartial', value: 'SecRequestBodyLimitAction ProcessPartial' }
        ]
    },
    {
        key: 'RequestBodyErrorValidation',
        label: 'Request Body Error Validation',
        description: 'Validate request body parsing',
        options: [
            { label: 'Error Validation Rule', value: 'SecRule REQBODY_ERROR "!@eq 0" \\\n"id:\'200002\', phase:2,t:none,log,deny,status:400,msg:\'Failed to parse request body.\',logdata:\'%{reqbody_error_msg}\',severity:2"' }
        ]
    },
    {
        key: 'MultipartStrictValidation',
        label: 'Multipart Strict Validation',
        description: 'Strict validation for multipart/form-data',
        options: [
            { label: 'Strict Validation Rule', value: 'SecRule MULTIPART_STRICT_ERROR "!@eq 0" \\\n"id:\'200003\',phase:2,t:none,log,deny,status:400, msg:\'Multipart request body failed strict validation.\'"' }
        ]
    },
    {
        key: 'SecResponseBodyAccess',
        label: 'SecResponseBodyAccess',
        description: 'Analyze response body',
        options: [
            { label: 'On', value: 'SecResponseBodyAccess On' },
            { label: 'Off', value: 'SecResponseBodyAccess Off' }
        ]
    },
    {
        key: 'SecResponseBodyMimeType',
        label: 'SecResponseBodyMimeType',
        description: 'Response MIME types to inspect',
        options: [
            { label: 'Text Types', value: 'SecResponseBodyMimeType text/plain text/html text/xml' },
            { label: 'Text + JSON', value: 'SecResponseBodyMimeType text/plain text/html text/xml application/json' }
        ]
    },
    {
        key: 'SecResponseBodyLimit',
        label: 'SecResponseBodyLimit',
        description: 'Maximum response body size',
        options: [
            { label: '512 KB (524288)', value: 'SecResponseBodyLimit 524288' },
            { label: '1 MB (1048576)', value: 'SecResponseBodyLimit 1048576' }
        ]
    },
    {
        key: 'SecResponseBodyLimitAction',
        label: 'SecResponseBodyLimitAction',
        description: 'Action when response body exceeds limit',
        options: [
            { label: 'ProcessPartial', value: 'SecResponseBodyLimitAction ProcessPartial' },
            { label: 'Reject', value: 'SecResponseBodyLimitAction Reject' }
        ]
    },
    {
        key: 'SecDefaultAction',
        label: 'SecDefaultAction',
        description: 'Default action',
        options: [
            { label: 'Phase 1 - Log & Deny', value: 'SecDefaultAction "phase:1,log,deny,status:403"' },
            { label: 'Phase 2 - Log & Deny', value: 'SecDefaultAction "phase:2,log,deny,status:403"' },
            { label: 'Phase 1 - Log & Pass', value: 'SecDefaultAction "phase:1,log,pass"' }
        ]
    },
    {
        key: 'SecAuditEngine',
        label: 'SecAuditEngine',
        description: 'Audit log policy',
        options: [
            { label: 'On', value: 'SecAuditEngine On' },
            { label: 'Off', value: 'SecAuditEngine Off' },
            { label: 'RelevantOnly', value: 'SecAuditEngine RelevantOnly' }
        ]
    },
    {
        key: 'SecAuditLogRelevantStatus',
        label: 'SecAuditLogRelevantStatus',
        description: 'Status codes to log in audit',
        options: [
            { label: '4xx and 5xx (excluding 404)', value: 'SecAuditLogRelevantStatus "^(?:(5|4)(0|1)[0-9])$"' },
            { label: '5xx only', value: 'SecAuditLogRelevantStatus "^5[0-9]{2}$"' }
        ]
    },
    {
        key: 'SecAuditLogParts',
        label: 'SecAuditLogParts',
        description: 'Parts of transaction to log',
        options: [
            { label: 'ABCFHZ (Minimal - Headers only)', value: 'SecAuditLogParts ABCFHZ' },
            { label: 'ABCEFHKZ (Recommended - No request body)', value: 'SecAuditLogParts ABCEFHKZ' },
            { label: 'ABCFHIJKZ (Standard - All parts)', value: 'SecAuditLogParts ABCFHIJKZ' },
            { label: 'ABCDEFHIJKZ (Full - Everything)', value: 'SecAuditLogParts ABCDEFHIJKZ' }
        ]
    },
    {
        key: 'SecAuditLogType',
        label: 'SecAuditLogType',
        description: 'Audit log type',
        options: [
            { label: 'Serial', value: 'SecAuditLogType Serial' },
            { label: 'Concurrent', value: 'SecAuditLogType Concurrent' }
        ]
    },
    {
        key: 'SecAuditLogFormat',
        label: 'SecAuditLogFormat',
        description: 'Audit log format',
        options: [
            { label: 'JSON', value: 'SecAuditLogFormat JSON' },
            { label: 'Native', value: 'SecAuditLogFormat Native' },
            { label: 'JsonLegacy', value: 'SecAuditLogFormat JsonLegacy' },
            { label: 'OCSF', value: 'SecAuditLogFormat OCSF' }
        ]
    },
    {
        key: 'SecComponentSignature',
        label: 'SecComponentSignature',
        description: 'Log signature info',
        options: [
            { label: 'Elchi WAF', value: 'SecComponentSignature "Elchi WAF"' }
        ]
    }
];
