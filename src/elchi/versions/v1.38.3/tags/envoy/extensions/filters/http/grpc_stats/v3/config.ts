import {OutType} from '@elchi/tags/tagsType';


export const FilterConfig: OutType = { "FilterConfig": [
  {
    "name": "emit_filter_state",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, the filter maintains a filter state object with the request and response message counts.",
    "notImp": false
  },
  {
    "name": "per_method_stat_specifier.individual_method_stats_allowlist",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "GrpcMethodList",
    "enums": null,
    "comment": "gRPC statistics filter configuration [#next-free-field: 6]",
    "notImp": false
  },
  {
    "name": "per_method_stat_specifier.stats_for_all_methods",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "gRPC statistics filter configuration [#next-free-field: 6]",
    "notImp": false
  },
  {
    "name": "enable_upstream_stats",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, the filter will gather a histogram for the request time of the upstream. It works with `stats_for_all_methods` and `individual_method_stats_allowlist` the same way request_message_count and response_message_count works.",
    "notImp": false
  },
  {
    "name": "replace_dots_in_grpc_service_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, the filter will replace dots in the grpc_service_name with underscores before emitting the metrics. Only works when `stats_for_all_methods` is set to true. It could cause metrics to be merged if the edited service name conflicts with an existing service. For example there are both service \"foo.bar\" & \"foo_bar\" running. This config can fix incorrect gRPC metrics with dots because the existing stats tag extractor assumes no dots in the gRPC service name. By default this is set as false.",
    "notImp": false
  }
] };

export const FilterConfig_SingleFields = [
  "emit_filter_state",
  "per_method_stat_specifier.stats_for_all_methods",
  "enable_upstream_stats",
  "replace_dots_in_grpc_service_name"
];

export const FilterObject: OutType = { "FilterObject": [
  {
    "name": "request_message_count",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Count of request messages in the request stream.",
    "notImp": false
  },
  {
    "name": "response_message_count",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Count of response messages in the response stream.",
    "notImp": false
  }
] };

export const FilterObject_SingleFields = [
  "request_message_count",
  "response_message_count"
];