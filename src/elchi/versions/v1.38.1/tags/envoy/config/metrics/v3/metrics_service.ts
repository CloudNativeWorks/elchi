import {OutType} from '@elchi/tags/tagsType';


export const MetricsServiceConfig: OutType = { "MetricsServiceConfig": [
  {
    "name": "grpc_service",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "GrpcService",
    "enums": null,
    "comment": "The upstream gRPC cluster that hosts the metrics service.",
    "notImp": false
  },
  {
    "name": "transport_api_version",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ApiVersion",
    "enums": [
      "AUTO",
      "V2",
      "V3"
    ],
    "comment": "API version for metric service transport protocol. This describes the metric service gRPC endpoint and version of messages used on the wire.",
    "notImp": false
  },
  {
    "name": "report_counters_as_deltas",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, counters are reported as the delta between flushing intervals. Otherwise, the current counter value is reported. Defaults to false. Eventually (https://github.com/envoyproxy/envoy/issues/10968) if this value is not set, the sink will take updates from the `MetricsResponse`.",
    "notImp": false
  },
  {
    "name": "emit_tags_as_labels",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, metrics will have their tags emitted as labels on the metrics objects sent to the MetricsService, and the tag extracted name will be used instead of the full name, which may contain values used by the tag extractor or additional tags added during stats creation.",
    "notImp": false
  },
  {
    "name": "histogram_emit_mode",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HistogramEmitMode",
    "enums": [
      "SUMMARY_AND_HISTOGRAM",
      "SUMMARY",
      "HISTOGRAM"
    ],
    "comment": "Specify which metrics types to emit for histograms. Defaults to SUMMARY_AND_HISTOGRAM.",
    "notImp": false
  },
  {
    "name": "batch_size",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The maximum number of metrics to send in a single gRPC message. If not set or set to 0, all metrics will be sent in a single message (current behavior). When set to a positive value, metrics will be batched into multiple messages, with each message containing at most batch_size metric families. This helps avoid hitting gRPC message size limits (typically 4MB) when sending large numbers of metrics.",
    "notImp": false
  }
] };

export const MetricsServiceConfig_SingleFields = [
  "transport_api_version",
  "report_counters_as_deltas",
  "emit_tags_as_labels",
  "histogram_emit_mode",
  "batch_size"
];