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
        description: 'WAF engine status (Fully supported)',
        recommended: true,
        options: [
            { label: 'On', value: 'SecRuleEngine On' },
            { label: 'Off', value: 'SecRuleEngine Off' },
            { label: 'DetectionOnly', value: 'SecRuleEngine DetectionOnly' }
        ]
    },
    {
        key: 'Include',
        label: 'Include',
        description: 'Include CRS rule files (Embedded @crs-setup-conf and @owasp_crs supported)',
        recommended: true,
        options: [
            { label: 'CRS Setup Conf', value: 'Include @crs-setup-conf' },
            { label: 'OWASP CRS', value: 'Include @owasp_crs/*.conf' }
        ]
    },
    {
        key: 'SecRequestBodyAccess',
        label: 'SecRequestBodyAccess',
        description: 'Enable request body inspection (Fully supported)',
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
        description: 'Maximum request body size (Fully supported, default: 13107200)',
        options: [
            { label: '128 KB (131072)', value: 'SecRequestBodyLimit 131072' },
            { label: '1 MB (1048576)', value: 'SecRequestBodyLimit 1048576' },
            { label: '10 MB (10485760)', value: 'SecRequestBodyLimit 10485760' }
        ]
    },
    {
        key: 'SecRequestBodyInMemoryLimit',
        label: 'SecRequestBodyInMemoryLimit',
        description: 'Max request body size in memory (Fully supported)',
        options: [
            { label: '128 KB (131072)', value: 'SecRequestBodyInMemoryLimit 131072' },
            { label: '256 KB (262144)', value: 'SecRequestBodyInMemoryLimit 262144' }
        ]
    },
    {
        key: 'SecRequestBodyLimitAction',
        label: 'SecRequestBodyLimitAction',
        description: 'Action when body exceeds limit (Fully supported)',
        options: [
            { label: 'Reject', value: 'SecRequestBodyLimitAction Reject' },
            { label: 'ProcessPartial', value: 'SecRequestBodyLimitAction ProcessPartial' }
        ]
    },
    {
        key: 'SecRequestBodyNoFilesLimit',
        label: 'SecRequestBodyNoFilesLimit',
        description: 'Max request body size without files (Fully supported)',
        options: [
            { label: '64 KB (65536)', value: 'SecRequestBodyNoFilesLimit 65536' },
            { label: '128 KB (131072)', value: 'SecRequestBodyNoFilesLimit 131072' },
            { label: '256 KB (262144)', value: 'SecRequestBodyNoFilesLimit 262144' }
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
        description: 'Analyze response body (Partial: some CRS rules may not access response body in WASM)',
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
        key: 'SecDefaultAction',
        label: 'SecDefaultAction',
        description: 'Default action (Partial: only applies to same phase rules)',
        options: [
            { label: 'Phase 1 - Log & Deny', value: 'SecDefaultAction "phase:1,log,deny,status:403"' },
            { label: 'Phase 2 - Log & Deny', value: 'SecDefaultAction "phase:2,log,deny,status:403"' },
            { label: 'Phase 1 - Log & Pass', value: 'SecDefaultAction "phase:1,log,pass"' }
        ]
    },
    {
        key: 'SecAuditEngine',
        label: 'SecAuditEngine',
        description: 'Audit log policy (Partial: parsed but logs sent to Envoy metrics/logs only, no file output)',
        options: [
            { label: 'On', value: 'SecAuditEngine On' },
            { label: 'Off', value: 'SecAuditEngine Off' },
            { label: 'RelevantOnly', value: 'SecAuditEngine RelevantOnly' }
        ]
    },
    {
        key: 'SecAuditLogRelevantStatus',
        label: 'SecAuditLogRelevantStatus',
        description: 'Status codes to log (Partial: parsed but does not affect logging behavior)',
        options: [
            { label: '4xx and 5xx (excluding 404)', value: 'SecAuditLogRelevantStatus "^(?:(5|4)(0|1)[0-9])$"' },
            { label: '5xx only', value: 'SecAuditLogRelevantStatus "^5[0-9]{2}$"' }
        ]
    },
    {
        key: 'SecAuditLogParts',
        label: 'SecAuditLogParts',
        description: 'Transaction log parts (Partial: parser recognizes but A-Z parts not generated)',
        options: [
            { label: 'ABCFHZ (Minimal - Headers only)', value: 'SecAuditLogParts ABCFHZ' },
            { label: 'ABCEFHKZ (Recommended - No request body)', value: 'SecAuditLogParts ABCEFHKZ' },
            { label: 'ABCFHIJKZ (Standard - All parts)', value: 'SecAuditLogParts ABCFHIJKZ' },
            { label: 'ABCDEFHIJKZ (Full - Everything)', value: 'SecAuditLogParts ABCDEFHIJKZ' }
        ]
    },
    {
        key: 'SecComponentSignature',
        label: 'SecComponentSignature',
        description: 'Log signature info',
        options: [
            { label: 'Elchi WAF', value: 'SecComponentSignature "Elchi WAF"' }
        ]
    },
    {
        key: 'SecAction',
        label: 'SecAction',
        description: 'Unconditional action (Partial: only TX collection supported, setvar:tx.* works)',
        options: [
            { label: 'Phase 1 - Initialize Variables', value: 'SecAction "id:900110,phase:1,nolog,pass,t:none,setvar:\'tx.inbound_anomaly_score_threshold=5\'"' },
            { label: 'Phase 2 - Set Collection', value: 'SecAction "id:900120,phase:2,nolog,pass,t:none,setvar:\'tx.allowed_methods=GET HEAD POST OPTIONS\'"' }
        ]
    },
    {
        key: 'SecArgumentsLimit',
        label: 'SecArgumentsLimit',
        description: 'Max request arguments (Partial: value parsed but limit not enforced, Coraza issue #1752)',
        options: [
            { label: '255 arguments', value: 'SecArgumentsLimit 255' },
            { label: '1000 arguments', value: 'SecArgumentsLimit 1000' },
            { label: 'Unlimited', value: 'SecArgumentsLimit 0' }
        ]
    },
    {
        key: 'SecRule',
        label: 'SecRule',
        description: 'Custom security rule (Fully supported: REQUEST_*, RESPONSE_*, TX, ARGS collections work)',
        recommended: true,
        options: [
            { label: 'Block SQL Injection', value: 'SecRule ARGS "@detectSQLi" "id:1001,phase:2,block,t:none,t:urlDecodeUni,msg:\'SQL Injection Attack Detected\',severity:\'CRITICAL\'"' },
            { label: 'Block XSS', value: 'SecRule ARGS "@detectXSS" "id:1002,phase:2,block,t:none,t:urlDecodeUni,msg:\'XSS Attack Detected\',severity:\'CRITICAL\'"' },
            { label: 'Rate Limit Example', value: 'SecRule IP:bf_counter "@gt 20" "id:1003,phase:1,block,msg:\'Brute Force Attack\'"' }
        ]
    },
    {
        key: 'SecRuleRemoveByID',
        label: 'SecRuleRemoveByID',
        description: 'Remove rules by ID (Fully supported: works after Include @owasp_crs)',
        options: [
            { label: 'Remove Single Rule', value: 'SecRuleRemoveByID 920100' },
            { label: 'Remove Multiple Rules', value: 'SecRuleRemoveByID 920100 920120 920121' },
            { label: 'Remove Range', value: 'SecRuleRemoveByID 920100-920199' }
        ]
    },
    {
        key: 'SecRuleRemoveByTag',
        label: 'SecRuleRemoveByTag',
        description: 'Remove rules by tag (Fully supported: works with CRS tags)',
        options: [
            { label: 'Remove by attack-sqli', value: 'SecRuleRemoveByTag "attack-sqli"' },
            { label: 'Remove by attack-xss', value: 'SecRuleRemoveByTag "attack-xss"' },
            { label: 'Remove by OWASP_CRS', value: 'SecRuleRemoveByTag "OWASP_CRS"' }
        ]
    }
];
