export const modtag_ext_proc = [
    {
        alias: 'ep',
        relativePath: 'envoy/extensions/filters/http/ext_proc/v3/ext_proc',
        names: ['ExternalProcessor', 'ExternalProcessor_SingleFields'],
    },
];

export const modtag_ext_proc_per_route = [
    {
        alias: 'eppr',
        relativePath: 'envoy/extensions/filters/http/ext_proc/v3/ext_proc',
        names: ['ExtProcPerRoute', 'ExtProcPerRoute_SingleFields'],
    },
];

// Excluded tags for ExternalProcessor (not shown in CustomAnchor)
export const modtag_excluded_ext_proc = [
    'http_service',
    'filter_metadata',
    'metadata_options',
    'processing_request_modifier',
    'on_processing_response'
];
