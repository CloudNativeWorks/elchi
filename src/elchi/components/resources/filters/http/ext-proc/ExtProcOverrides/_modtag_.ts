export const modtag_ext_proc_overrides = [
    {
        alias: 'epo',
        relativePath: 'envoy/extensions/filters/http/ext_proc/v3/ext_proc',
        names: ['ExtProcOverrides', 'ExtProcOverrides_SingleFields'],
    },
];

// Excluded tags for ExtProcOverrides
export const modtag_excluded_ext_proc_overrides = [
    'processing_request_modifier',
    'metadata_options'
];
