import { TagsType } from "@/elchi/tags/tagsType";

export const modtag_opentelemetry = [
    {
        alias: 'otel',
        relativePath: 'envoy/extensions/stat_sinks/open_telemetry/v3/open_telemetry',
        names: ['SinkConfig', 'SinkConfig_SingleFields'],
    },
];

export const modtag_us_stats_sink: TagsType = {
    "open_telemetry": [
        "access_log_format.format",
        "access_log_format.json_format",
        "access_log_format.typed_json_format",
    ],
}
