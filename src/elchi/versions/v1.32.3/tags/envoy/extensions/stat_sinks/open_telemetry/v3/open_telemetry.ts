import {OutType} from '@/elchi/tags/tagsType';


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
  }
] };

export const SinkConfig_SingleFields = [
  "report_counters_as_deltas",
  "report_histograms_as_deltas",
  "emit_tags_as_attributes",
  "use_tag_extracted_name",
  "prefix"
];