/**
 * Coraza WAF Features Constants
 * Complete list of operators, transformations, and options
 */

/**
 * All Coraza Operators (35+)
 */
export const CORAZA_OPERATORS = [
    // String Matching
    { label: '@rx - Regular Expression', value: '@rx', description: 'Regex pattern matching', category: 'String' },
    { label: '@contains - Contains String', value: '@contains', description: 'String contains check', category: 'String' },
    { label: '@beginsWith - Starts With', value: '@beginsWith', description: 'String starts with', category: 'String' },
    { label: '@endsWith - Ends With', value: '@endsWith', description: 'String ends with', category: 'String' },
    { label: '@streq - String Equals', value: '@streq', description: 'Exact string match', category: 'String' },
    { label: '@strmatch - String Match', value: '@strmatch', description: 'Wildcard string match', category: 'String' },
    { label: '@within - Within String', value: '@within', description: 'Input within provided string', category: 'String' },

    // Detection
    { label: '@detectSQLi - SQL Injection', value: '@detectSQLi', description: 'Detect SQL injection attempts', category: 'Detection' },
    { label: '@detectXSS - XSS Detection', value: '@detectXSS', description: 'Detect XSS attempts', category: 'Detection' },

    // Validation
    { label: '@validateUrlEncoding', value: '@validateUrlEncoding', description: 'Validate URL encoding', category: 'Validation' },
    { label: '@validateUtf8Encoding', value: '@validateUtf8Encoding', description: 'Validate UTF-8 encoding', category: 'Validation' },
    { label: '@validateByteRange', value: '@validateByteRange', description: 'Validate byte ranges', category: 'Validation' },
    { label: '@verifyCC - Credit Card', value: '@verifyCC', description: 'Detect credit card numbers', category: 'Validation' },
    { label: '@verifyCPF - CPF Number', value: '@verifyCPF', description: 'Verify CPF numbers', category: 'Validation' },
    { label: '@verifySSN - SSN Number', value: '@verifySSN', description: 'Verify SSN numbers', category: 'Validation' },

    // Numerical
    { label: '@eq - Equals', value: '@eq', description: 'Numerical equals', category: 'Numerical' },
    { label: '@gt - Greater Than', value: '@gt', description: 'Greater than', category: 'Numerical' },
    { label: '@lt - Less Than', value: '@lt', description: 'Less than', category: 'Numerical' },
    { label: '@ge - Greater or Equal', value: '@ge', description: 'Greater than or equal', category: 'Numerical' },
    { label: '@le - Less or Equal', value: '@le', description: 'Less than or equal', category: 'Numerical' },

    // Network
    { label: '@ipMatch - IP Match', value: '@ipMatch', description: 'Match IP addresses', category: 'Network' },
    { label: '@ipMatchFromFile', value: '@ipMatchFromFile', description: 'Match IPs from file', category: 'Network' },
    { label: '@rbl - RBL Check', value: '@rbl', description: 'Check against RBL', category: 'Network' },

    // Pattern Matching
    { label: '@pm - Phrase Match', value: '@pm', description: 'Phrase matching', category: 'Pattern' },
    { label: '@pmFromFile', value: '@pmFromFile', description: 'Phrase match from file', category: 'Pattern' },

    // Geo
    { label: '@geoLookup', value: '@geoLookup', description: 'Geographic lookup', category: 'Geo' },

    // Inspection
    { label: '@inspectFile', value: '@inspectFile', description: 'Inspect file uploads', category: 'Inspection' },
    { label: '@unconditionalMatch', value: '@unconditionalMatch', description: 'Always matches', category: 'Special' }
];

/**
 * All Coraza Transformations (30+)
 */
export const CORAZA_TRANSFORMATIONS = [
    { label: 'none - Clear transformations', value: 'none', category: 'Control' },
    { label: 'lowercase - To lowercase', value: 'lowercase', category: 'Case' },
    { label: 'uppercase - To uppercase', value: 'uppercase', category: 'Case' },
    { label: 'urlDecode - URL decode', value: 'urlDecode', category: 'Encoding' },
    { label: 'urlDecodeUni - Unicode URL decode', value: 'urlDecodeUni', category: 'Encoding' },
    { label: 'urlEncode - URL encode', value: 'urlEncode', category: 'Encoding' },
    { label: 'base64Decode - Base64 decode', value: 'base64Decode', category: 'Encoding' },
    { label: 'base64Encode - Base64 encode', value: 'base64Encode', category: 'Encoding' },
    { label: 'htmlEntityDecode - HTML decode', value: 'htmlEntityDecode', category: 'Encoding' },
    { label: 'jsDecode - JavaScript decode', value: 'jsDecode', category: 'Encoding' },
    { label: 'cssDecode - CSS decode', value: 'cssDecode', category: 'Encoding' },
    { label: 'hexDecode - Hex decode', value: 'hexDecode', category: 'Encoding' },
    { label: 'hexEncode - Hex encode', value: 'hexEncode', category: 'Encoding' },
    { label: 'removeWhitespace - Remove whitespace', value: 'removeWhitespace', category: 'Whitespace' },
    { label: 'compressWhitespace - Compress whitespace', value: 'compressWhitespace', category: 'Whitespace' },
    { label: 'trimLeft - Trim left', value: 'trimLeft', category: 'Whitespace' },
    { label: 'trimRight - Trim right', value: 'trimRight', category: 'Whitespace' },
    { label: 'trim - Trim both sides', value: 'trim', category: 'Whitespace' },
    { label: 'removeNulls - Remove null bytes', value: 'removeNulls', category: 'Cleanup' },
    { label: 'replaceNulls - Replace null bytes', value: 'replaceNulls', category: 'Cleanup' },
    { label: 'removeComments - Remove comments', value: 'removeComments', category: 'Cleanup' },
    { label: 'removeCommentsChar - Remove comment chars', value: 'removeCommentsChar', category: 'Cleanup' },
    { label: 'md5 - MD5 hash', value: 'md5', category: 'Hashing' },
    { label: 'sha1 - SHA1 hash', value: 'sha1', category: 'Hashing' },
    { label: 'normalisePath - Normalize path', value: 'normalisePath', category: 'Path' },
    { label: 'normalisePathWin - Normalize Windows path', value: 'normalisePathWin', category: 'Path' },
    { label: 'length - Get length', value: 'length', category: 'Special' },
    { label: 'utf8toUnicode - UTF-8 to Unicode', value: 'utf8toUnicode', category: 'Encoding' }
];

/**
 * Severity Levels
 */
export const SEVERITY_LEVELS = [
    { label: 'EMERGENCY (0)', value: 'EMERGENCY', description: 'System is unusable' },
    { label: 'ALERT (1)', value: 'ALERT', description: 'Immediate action required' },
    { label: 'CRITICAL (2)', value: 'CRITICAL', description: 'Critical conditions' },
    { label: 'ERROR (3)', value: 'ERROR', description: 'Error conditions' },
    { label: 'WARNING (4)', value: 'WARNING', description: 'Warning conditions' },
    { label: 'NOTICE (5)', value: 'NOTICE', description: 'Normal but significant' },
    { label: 'INFO (6)', value: 'INFO', description: 'Informational messages' },
    { label: 'DEBUG (7)', value: 'DEBUG', description: 'Debug-level messages' }
];

/**
 * CRS Categories
 */
export const CRS_CATEGORIES = [
    { label: 'SQL Injection - 942', value: '@owasp_crs/REQUEST-942-APPLICATION-ATTACK-SQLI.conf', description: 'SQL injection attacks' },
    { label: 'XSS - 941', value: '@owasp_crs/REQUEST-941-APPLICATION-ATTACK-XSS.conf', description: 'Cross-site scripting' },
    { label: 'RCE - 932', value: '@owasp_crs/REQUEST-932-APPLICATION-ATTACK-RCE.conf', description: 'Remote code execution' },
    { label: 'PHP Injection - 933', value: '@owasp_crs/REQUEST-933-APPLICATION-ATTACK-PHP.conf', description: 'PHP injection attacks' },
    { label: 'Session Fixation - 943', value: '@owasp_crs/REQUEST-943-APPLICATION-ATTACK-SESSION-FIXATION.conf', description: 'Session fixation' },
    { label: 'Java Attack - 944', value: '@owasp_crs/REQUEST-944-APPLICATION-ATTACK-JAVA.conf', description: 'Java attacks' },
    { label: 'Protocol Enforcement - 920', value: '@owasp_crs/REQUEST-920-PROTOCOL-ENFORCEMENT.conf', description: 'HTTP protocol enforcement' },
    { label: 'Protocol Attack - 921', value: '@owasp_crs/REQUEST-921-PROTOCOL-ATTACK.conf', description: 'Protocol-level attacks' },
    { label: 'LFI - 930', value: '@owasp_crs/REQUEST-930-APPLICATION-ATTACK-LFI.conf', description: 'Local file inclusion' },
    { label: 'RFI - 931', value: '@owasp_crs/REQUEST-931-APPLICATION-ATTACK-RFI.conf', description: 'Remote file inclusion' }
];

/**
 * Variables for SecRule
 */
export const SEC_RULE_VARIABLES = [
    { label: 'REQUEST_URI', value: 'REQUEST_URI', description: 'Request URI (normalized)' },
    { label: 'REQUEST_URI_RAW', value: 'REQUEST_URI_RAW', description: 'Request URI (raw)' },
    { label: 'REQUEST_HEADERS', value: 'REQUEST_HEADERS', description: 'All request headers' },
    { label: 'ARGS', value: 'ARGS', description: 'All arguments (GET/POST)' },
    { label: 'ARGS_NAMES', value: 'ARGS_NAMES', description: 'Argument names' },
    { label: 'ARGS_GET', value: 'ARGS_GET', description: 'GET arguments' },
    { label: 'ARGS_POST', value: 'ARGS_POST', description: 'POST arguments' },
    { label: 'REQUEST_COOKIES', value: 'REQUEST_COOKIES', description: 'Request cookies' },
    { label: 'REQUEST_COOKIES_NAMES', value: 'REQUEST_COOKIES_NAMES', description: 'Cookie names' },
    { label: 'REQUEST_BODY', value: 'REQUEST_BODY', description: 'Request body' },
    { label: 'REQUEST_METHOD', value: 'REQUEST_METHOD', description: 'HTTP method' },
    { label: 'REQUEST_PROTOCOL', value: 'REQUEST_PROTOCOL', description: 'HTTP protocol version' },
    { label: 'RESPONSE_HEADERS', value: 'RESPONSE_HEADERS', description: 'Response headers' },
    { label: 'RESPONSE_BODY', value: 'RESPONSE_BODY', description: 'Response body' },
    { label: 'RESPONSE_STATUS', value: 'RESPONSE_STATUS', description: 'Response status code' },
    { label: 'REMOTE_ADDR', value: 'REMOTE_ADDR', description: 'Client IP address' },
    { label: 'REQUEST_FILENAME', value: 'REQUEST_FILENAME', description: 'Requested filename' },
    { label: 'TX', value: 'TX', description: 'Transaction variables' }
];
