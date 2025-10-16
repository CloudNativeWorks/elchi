import {OutType} from '@elchi/tags/tagsType';


export const FaultAbort: OutType = { "FaultAbort": [
  {
    "name": "error_type.http_status",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "HTTP status code to use to abort the HTTP request.",
    "notImp": false
  },
  {
    "name": "error_type.grpc_status",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "gRPC status code to use to abort the gRPC request.",
    "notImp": false
  },
  {
    "name": "error_type.header_abort",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "FaultAbort_HeaderAbort",
    "enums": null,
    "comment": "Fault aborts are controlled via an HTTP header (if applicable).",
    "notImp": false
  },
  {
    "name": "percentage",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FractionalPercent",
    "enums": null,
    "comment": "The percentage of requests/operations/connections that will be aborted with the error code provided.",
    "notImp": false
  }
] };

export const FaultAbort_SingleFields = [
  "error_type.http_status",
  "error_type.grpc_status"
];

export const HTTPFault: OutType = { "HTTPFault": [
  {
    "name": "delay",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FaultDelay",
    "enums": null,
    "comment": "If specified, the filter will inject delays based on the values in the object.",
    "notImp": false
  },
  {
    "name": "abort",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FaultAbort",
    "enums": null,
    "comment": "If specified, the filter will abort requests based on the values in the object. At least ``abort`` or ``delay`` must be specified.",
    "notImp": false
  },
  {
    "name": "upstream_cluster",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Specifies the name of the (destination) upstream cluster that the filter should match on. Fault injection will be restricted to requests bound to the specific upstream cluster.",
    "notImp": false
  },
  {
    "name": "headers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderMatcher[]",
    "enums": null,
    "comment": "Specifies a set of headers that the filter should match on. The fault injection filter can be applied selectively to requests that match a set of headers specified in the fault filter config. The chances of actual fault injection further depend on the value of the `percentage` field. The filter will check the request's headers against all the specified headers in the filter config. A match will happen if all the headers in the config are present in the request with the same values (or based on presence if the ``value`` field is not in the config).",
    "notImp": false
  },
  {
    "name": "downstream_nodes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Faults are injected for the specified list of downstream hosts. If this setting is not set, faults are injected for all downstream nodes. Downstream node name is taken from `the HTTP x-envoy-downstream-service-node` header and compared against downstream_nodes list.",
    "notImp": false
  },
  {
    "name": "max_active_faults",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The maximum number of faults that can be active at a single time via the configured fault filter. Note that because this setting can be overridden at the route level, it's possible for the number of active faults to be greater than this value (if injected via a different route). If not specified, defaults to unlimited. This setting can be overridden via ``runtime <config_http_filters_fault_injection_runtime>`` and any faults that are not injected due to overflow will be indicated via the ``faults_overflow <config_http_filters_fault_injection_stats>`` stat.\n\n:::attention\nLike other `circuit breakers` in Envoy, this is a fuzzy limit. It's possible for the number of active faults to rise slightly above the configured amount due to the implementation details.",
    "notImp": false
  },
  {
    "name": "response_rate_limit",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FaultRateLimit",
    "enums": null,
    "comment": "The response rate limit to be applied to the response body of the stream. When configured, the percentage can be overridden by the `fault.http.rate_limit.response_percent` runtime key.\n\n:::attention\nThis is a per-stream limit versus a connection level limit. This means that concurrent streams will each get an independent limit.",
    "notImp": false
  },
  {
    "name": "delay_percent_runtime",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The runtime key to override the `default` runtime. The default is: fault.http.delay.fixed_delay_percent",
    "notImp": false
  },
  {
    "name": "abort_percent_runtime",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The runtime key to override the `default` runtime. The default is: fault.http.abort.abort_percent",
    "notImp": false
  },
  {
    "name": "delay_duration_runtime",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The runtime key to override the `default` runtime. The default is: fault.http.delay.fixed_duration_ms",
    "notImp": false
  },
  {
    "name": "abort_http_status_runtime",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The runtime key to override the `default` runtime. The default is: fault.http.abort.http_status",
    "notImp": false
  },
  {
    "name": "max_active_faults_runtime",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The runtime key to override the `default` runtime. The default is: fault.http.max_active_faults",
    "notImp": false
  },
  {
    "name": "response_rate_limit_percent_runtime",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The runtime key to override the `default` runtime. The default is: fault.http.rate_limit.response_percent",
    "notImp": false
  },
  {
    "name": "abort_grpc_status_runtime",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The runtime key to override the `default` runtime. The default is: fault.http.abort.grpc_status",
    "notImp": false
  },
  {
    "name": "disable_downstream_cluster_stats",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "To control whether stats storage is allocated dynamically for each downstream server. If set to true, \"x-envoy-downstream-service-cluster\" field of header will be ignored by this filter. If set to false, dynamic stats storage will be allocated for the downstream cluster name. Default value is false.",
    "notImp": false
  },
  {
    "name": "filter_metadata",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "{ [key: string]: any; }",
    "enums": null,
    "comment": "When an abort or delay fault is executed, the metadata struct provided here will be added to the request's dynamic metadata under the namespace corresponding to the name of the fault filter. This data can be logged as part of Access Logs using the `command operator` %DYNAMIC_METADATA(NAMESPACE)%, where NAMESPACE is the name of the fault filter.",
    "notImp": false
  }
] };

export const HTTPFault_SingleFields = [
  "upstream_cluster",
  "downstream_nodes",
  "max_active_faults",
  "delay_percent_runtime",
  "abort_percent_runtime",
  "delay_duration_runtime",
  "abort_http_status_runtime",
  "max_active_faults_runtime",
  "response_rate_limit_percent_runtime",
  "abort_grpc_status_runtime",
  "disable_downstream_cluster_stats"
];