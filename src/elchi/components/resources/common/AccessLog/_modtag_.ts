import { TagsType } from "@/elchi/tags/tagsType";

export const modtag_accesslog = [
    {
        alias: 'al',
        relativePath: 'envoy/config/accesslog/v3/accesslog',
        names: ['AccessLog', 'AccessLogFilter'],
    },
];

export const modtag_accesslog_filter = [
    {
        alias: 'alf',
        relativePath: 'envoy/config/accesslog/v3/accesslog',
        names: ['AccessLogFilter'],
    },
];

export const modtag_us_accesslog: TagsType = {
    'filter': [
        'filter_specifier.extension_filter',
        'filter_specifier.metadata_filter',
        'filter_specifier.runtime_filter',
        'filter_specifier.not_health_check_filter',
        'filter_specifier.traceable_filter',
        'filter_specifier.and_filter',
        'filter_specifier.or_filter',
        'filter_specifier.header_filter',
        'filter_specifier.response_flag_filter',
        'filter_specifier.grpc_status_filter',
        'filter_specifier.log_type_filter',
    ]
}