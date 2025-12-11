import { TagsType } from "@/elchi/tags/tagsType";

export const modtag_file_access_log = [
    {
        alias: 'fal',
        relativePath: 'envoy/extensions/access_loggers/file/v3/file',
        names: ['FileAccessLog', 'FileAccessLog_SingleFields'],
    },
];

export const modtag_fluentd_access_log = [
    {
        alias: 'flual',
        relativePath: 'envoy/extensions/access_loggers/fluentd/v3/fluentd',
        names: ['FluentdAccessLogConfig', 'FluentdAccessLogConfig_SingleFields'],
    },
];

export const modtag_http_grpc_access_log = [
    {
        alias: 'hgal',
        relativePath: 'envoy/extensions/access_loggers/grpc/v3/als',
        names: ['HttpGrpcAccessLogConfig', 'HttpGrpcAccessLogConfig_SingleFields'],
    },
    {
        alias: 'cgal',
        relativePath: 'envoy/extensions/access_loggers/grpc/v3/als',
        names: ['CommonGrpcAccessLogConfig', 'CommonGrpcAccessLogConfig_SingleFields'],
    },
];

export const modtag_tcp_grpc_access_log = [
    {
        alias: 'tgal',
        relativePath: 'envoy/extensions/access_loggers/grpc/v3/als',
        names: ['TcpGrpcAccessLogConfig', 'TcpGrpcAccessLogConfig_SingleFields'],
    },
    {
        alias: 'cgal',
        relativePath: 'envoy/extensions/access_loggers/grpc/v3/als',
        names: ['CommonGrpcAccessLogConfig', 'CommonGrpcAccessLogConfig_SingleFields'],
    },
];

export const modtag_stdout_access_log = [
    {
        alias: 'outal',
        relativePath: 'envoy/extensions/access_loggers/stream/v3/stream',
        names: ['StdoutAccessLog'],
    },
];

export const modtag_stderr_access_log = [
    {
        alias: 'erral',
        relativePath: 'envoy/extensions/access_loggers/stream/v3/stream',
        names: ['StderrAccessLog'],
    },
];

export const modtag_substitution_format_string = [
    {
        alias: 'sfs',
        relativePath: 'envoy/config/core/v3/substitution_format_string',
        names: ['SubstitutionFormatString', 'SubstitutionFormatString_SingleFields'],
    },
];

export const modtag_us_accesslog: TagsType = {
    "file": [
        "access_log_format.format",
        "access_log_format.json_format",
        "access_log_format.typed_json_format",
    ],
    'fluentd': [
        'formatters',
        'retry_options',
    ],
}
