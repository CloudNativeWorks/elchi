import {OutType} from '@elchi/tags/tagsType';


export const SinkConfig: OutType = { "SinkConfig": [
  {
    "name": "protocol_specifier.grpc_service",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "GrpcService",
    "enums": null,
    "comment": "The upstream gRPC cluster that implements the OTLP/gRPC collector.",
    "notImp": false
  },
  {
    "name": "resource_detectors",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig[]",
    "enums": null,
    "comment": "Attributes to be associated with the resource in the OTLP message. extension-category: envoy.tracers.opentelemetry.resource_detectors",
    "notImp": false
  },
  {
    "name": "report_counters_as_deltas",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set to true, counters will be emitted as deltas, and the OTLP message will have ``AGGREGATION_TEMPORALITY_DELTA`` set as AggregationTemporality.",
    "notImp": false
  },
  {
    "name": "report_histograms_as_deltas",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set to true, histograms will be emitted as deltas, and the OTLP message will have ``AGGREGATION_TEMPORALITY_DELTA`` set as AggregationTemporality.",
    "notImp": false
  },
  {
    "name": "emit_tags_as_attributes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set to true, metrics will have their tags emitted as OTLP attributes, which may contain values used by the tag extractor or additional tags added during stats creation. Otherwise, no attributes will be associated with the export message. Default value is true.",
    "notImp": false
  },
  {
    "name": "use_tag_extracted_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set to true, metric names will be represented as the tag extracted name instead of the full metric name. Default value is true.",
    "notImp": false
  },
  {
    "name": "prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "If set, emitted stats names will be prepended with a prefix, so full stat name will be <prefix>.<stats_name>. For example, if the stat name is \"foo.bar\" and prefix is \"pre\", the full stat name will be \"pre.foo.bar\". If this field is not set, there is no prefix added. According to the example, the full stat name will remain \"foo.bar\".",
    "notImp": false
  },
  {
    "name": "custom_metric_conversions",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Matcher",
    "enums": null,
    "comment": "The custom conversion from a stat to a metric. Currently, the only supported input is ``envoy.extensions.matching.common_inputs.stats.v3.StatFullNameMatchInput``. The supported actions are - ``envoy.extensions.stat_sinks.open_telemetry.v3.SinkConfig.DropAction``. - ``envoy.extensions.stat_sinks.open_telemetry.v3.SinkConfig.ConversionAction``. If stats are not matched, they will be directly converted to OTLP metrics as usual.",
    "notImp": false
  }
] };

export const SinkConfig_SingleFields = [
  "report_counters_as_deltas",
  "report_histograms_as_deltas",
  "emit_tags_as_attributes",
  "use_tag_extracted_name",
  "prefix"
];

export const SinkConfig_ConversionAction: OutType = { "SinkConfig_ConversionAction": [
  {
    "name": "metric_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The metric name to use for the stat.",
    "notImp": false
  },
  {
    "name": "static_metric_labels",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "KeyValue[]",
    "enums": null,
    "comment": "Static metric labels to use for the metric.",
    "notImp": false
  }
] };

export const SinkConfig_ConversionAction_SingleFields = [
  "metric_name"
];