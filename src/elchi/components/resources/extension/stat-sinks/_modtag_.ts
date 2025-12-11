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
        "resource_detectors",
        "custom_metric_conversions"
    ],
}
