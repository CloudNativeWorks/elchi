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
    "comment": "If set, specifies an allowlist of service/methods that will have individual stats emitted for them. Any call that does not match the allowlist will be counted in a stat with no method specifier: ``cluster.<name>.grpc.*``.",
    "notImp": false
  },
  {
    "name": "per_method_stat_specifier.stats_for_all_methods",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set to true, emit stats for all service/method names.\n\nIf set to false, emit stats for all service/message types to the same stats without including the service/method in the name, with prefix ``cluster.<name>.grpc``. This can be useful if service/method granularity is not needed, or if each cluster only receives a single method.\n\n:::attention\nThis option is only safe if all clients are trusted. If this option is enabled with untrusted clients, the clients could cause unbounded growth in the number of stats in Envoy, using unbounded memory and potentially slowing down stats pipelines. \n:::\n\n:::attention\nIf neither ``individual_method_stats_allowlist`` nor ``stats_for_all_methods`` is set, the behavior will default to ``stats_for_all_methods=false``.",
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