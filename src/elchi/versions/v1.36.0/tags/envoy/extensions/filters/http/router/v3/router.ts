import {OutType} from '@elchi/tags/tagsType';


export const Router_UpstreamAccessLogOptions: OutType = { "Router_UpstreamAccessLogOptions": [
  {
    "name": "flush_upstream_log_on_upstream_stream",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set to true, an upstream access log will be recorded when an upstream stream is associated to an http request. Note: Each HTTP request received for an already established connection will result in an upstream access log record. This includes, for example, consecutive HTTP requests over the same connection or a request that is retried. In case a retry is applied, an upstream access log will be recorded for each retry.",
    "notImp": false
  },
  {
    "name": "upstream_log_flush_interval",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The interval to flush the upstream access logs. By default, the router will flush an upstream access log on stream close, when the HTTP request is complete. If this field is set, the router will flush access logs periodically at the specified interval. This is especially useful in the case of long-lived requests, such as CONNECT and Websockets. The interval must be at least 1 millisecond.",
    "notImp": false
  }
] };

export const Router_UpstreamAccessLogOptions_SingleFields = [
  "flush_upstream_log_on_upstream_stream",
  "upstream_log_flush_interval"
];

export const Router: OutType = { "Router": [
  {
    "name": "dynamic_stats",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether the router generates dynamic cluster statistics. Defaults to true. Can be disabled in high performance scenarios.",
    "notImp": false
  },
  {
    "name": "start_child_span",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether to start a child span for egress routed calls. This can be useful in scenarios where other filters (auth, ratelimit, etc.) make outbound calls and have child spans rooted at the same ingress parent. Defaults to false.\n\n:::attention\nThis field is deprecated by the `spawn_upstream_span`. Please use that ``spawn_upstream_span`` field to control the span creation. \n:::",
    "notImp": false
  },
  {
    "name": "upstream_log",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "AccessLog[]",
    "enums": null,
    "comment": "Configuration for HTTP upstream logs emitted by the router. Upstream logs are configured in the same way as access logs, but each log entry represents an upstream request. Presuming retries are configured, multiple upstream requests may be made for each downstream (inbound) request.",
    "notImp": false
  },
  {
    "name": "upstream_log_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Router_UpstreamAccessLogOptions",
    "enums": null,
    "comment": "Additional upstream access log options.",
    "notImp": false
  },
  {
    "name": "suppress_envoy_headers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Do not add any additional ``x-envoy-`` headers to requests or responses. This only affects the `router filter generated x-envoy- headers`, other Envoy filters and the HTTP connection manager may continue to set ``x-envoy-`` headers.",
    "notImp": false
  },
  {
    "name": "strict_check_headers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Specifies a list of HTTP headers to strictly validate. Envoy will reject a request and respond with HTTP status 400 if the request contains an invalid value for any of the headers listed in this field. Strict header checking is only supported for the following headers:\n\nValue must be a ','-delimited list (i.e. no spaces) of supported retry policy values:\n\n* `config_http_filters_router_x-envoy-retry-grpc-on` * `config_http_filters_router_x-envoy-retry-on`\n\nValue must be an integer:\n\n* `config_http_filters_router_x-envoy-max-retries` * `config_http_filters_router_x-envoy-upstream-rq-timeout-ms` * `config_http_filters_router_x-envoy-upstream-rq-per-try-timeout-ms`",
    "notImp": false
  },
  {
    "name": "respect_expected_rq_timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If not set, ingress Envoy will ignore `config_http_filters_router_x-envoy-expected-rq-timeout-ms` header, populated by egress Envoy, when deriving timeout for upstream cluster.",
    "notImp": false
  },
  {
    "name": "suppress_grpc_request_failure_code_stats",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set, Envoy will avoid incrementing HTTP failure code stats on gRPC requests. This includes the individual status code value (e.g. upstream_rq_504) and group stats (e.g. upstream_rq_5xx). This field is useful if interested in relying only on the gRPC stats filter to define success and failure metrics for gRPC requests as not all failed gRPC requests charge HTTP status code metrics. See `gRPC stats filter` documentation for more details.",
    "notImp": false
  },
  {
    "name": "upstream_http_filters",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HttpFilter[]",
    "enums": null,
    "comment": "Optional HTTP filters for the upstream HTTP filter chain.\n\n:::note\nUpstream HTTP filters are currently in alpha. \n:::\n\nThese filters will be applied for all requests that pass through the router. They will also be applied to shadowed requests. Upstream HTTP filters cannot change route or cluster. Upstream HTTP filters specified on the cluster will override these filters.\n\nIf using upstream HTTP filters, please be aware that local errors sent by upstream HTTP filters will not trigger retries, and local errors sent by upstream HTTP filters will count as a final response if hedging is configured. extension-category: envoy.filters.http.upstream",
    "notImp": false
  }
] };

export const Router_SingleFields = [
  "dynamic_stats",
  "suppress_envoy_headers",
  "strict_check_headers",
  "respect_expected_rq_timeout",
  "suppress_grpc_request_failure_code_stats"
];