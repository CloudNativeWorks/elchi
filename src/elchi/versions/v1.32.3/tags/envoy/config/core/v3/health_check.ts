import {OutType} from '@/elchi/tags/tagsType';


export const HealthStatusSet: OutType = { "HealthStatusSet": [
  {
    "name": "statuses",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HealthStatus[]",
    "enums": null,
    "comment": "An order-independent set of health status.",
    "notImp": false
  }
] };

export const HealthCheck_TlsOptions: OutType = { "HealthCheck_TlsOptions": [
  {
    "name": "alpn_protocols",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Specifies the ALPN protocols for health check connections. This is useful if the corresponding upstream is using ALPN-based `FilterChainMatch` along with different protocols for health checks versus data connections. If empty, no ALPN protocols will be set on health check connections.",
    "notImp": false
  }
] };

export const HealthCheck_TlsOptions_SingleFields = [
  "alpn_protocols"
];

export const HealthCheck: OutType = { "HealthCheck": [
  {
    "name": "timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The time to wait for a health check response. If the timeout is reached the health check attempt will be considered a failure.",
    "notImp": false
  },
  {
    "name": "interval",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The interval between health checks.",
    "notImp": false
  },
  {
    "name": "initial_jitter",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "An optional jitter amount in milliseconds. If specified, Envoy will start health checking after for a random time in ms between 0 and initial_jitter. This only applies to the first health check.",
    "notImp": false
  },
  {
    "name": "interval_jitter",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "An optional jitter amount in milliseconds. If specified, during every interval Envoy will add interval_jitter to the wait time.",
    "notImp": false
  },
  {
    "name": "interval_jitter_percent",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "An optional jitter amount as a percentage of interval_ms. If specified, during every interval Envoy will add ``interval_ms`` * ``interval_jitter_percent`` / 100 to the wait time.\n\nIf interval_jitter_ms and interval_jitter_percent are both set, both of them will be used to increase the wait time.",
    "notImp": false
  },
  {
    "name": "unhealthy_threshold",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The number of unhealthy health checks required before a host is marked unhealthy. Note that for ``http`` health checking if a host responds with a code not in `expected_statuses` or `retriable_statuses`, this threshold is ignored and the host is considered immediately unhealthy.",
    "notImp": false
  },
  {
    "name": "healthy_threshold",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The number of healthy health checks required before a host is marked healthy. Note that during startup, only a single successful health check is required to mark a host healthy.",
    "notImp": false
  },
  {
    "name": "alt_port",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "[#not-implemented-hide:] Non-serving port for health checking.",
    "notImp": true
  },
  {
    "name": "reuse_connection",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Reuse health check connection between health checks. Default is true.",
    "notImp": false
  },
  {
    "name": "health_checker.http_health_check",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HealthCheck_HttpHealthCheck",
    "enums": null,
    "comment": "HTTP health check.",
    "notImp": false
  },
  {
    "name": "health_checker.tcp_health_check",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HealthCheck_TcpHealthCheck",
    "enums": null,
    "comment": "TCP health check.",
    "notImp": false
  },
  {
    "name": "health_checker.grpc_health_check",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HealthCheck_GrpcHealthCheck",
    "enums": null,
    "comment": "gRPC health check.",
    "notImp": false
  },
  {
    "name": "health_checker.custom_health_check",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HealthCheck_CustomHealthCheck",
    "enums": null,
    "comment": "Custom health check.",
    "notImp": false
  },
  {
    "name": "no_traffic_interval",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The \"no traffic interval\" is a special health check interval that is used when a cluster has never had traffic routed to it. This lower interval allows cluster information to be kept up to date, without sending a potentially large amount of active health checking traffic for no reason. Once a cluster has been used for traffic routing, Envoy will shift back to using the standard health check interval that is defined. Note that this interval takes precedence over any other.\n\nThe default value for \"no traffic interval\" is 60 seconds.",
    "notImp": false
  },
  {
    "name": "no_traffic_healthy_interval",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The \"no traffic healthy interval\" is a special health check interval that is used for hosts that are currently passing active health checking (including new hosts) when the cluster has received no traffic.\n\nThis is useful for when we want to send frequent health checks with ``no_traffic_interval`` but then revert to lower frequency ``no_traffic_healthy_interval`` once a host in the cluster is marked as healthy.\n\nOnce a cluster has been used for traffic routing, Envoy will shift back to using the standard health check interval that is defined.\n\nIf no_traffic_healthy_interval is not set, it will default to the no traffic interval and send that interval regardless of health state.",
    "notImp": false
  },
  {
    "name": "unhealthy_interval",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The \"unhealthy interval\" is a health check interval that is used for hosts that are marked as unhealthy. As soon as the host is marked as healthy, Envoy will shift back to using the standard health check interval that is defined.\n\nThe default value for \"unhealthy interval\" is the same as \"interval\".",
    "notImp": false
  },
  {
    "name": "unhealthy_edge_interval",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The \"unhealthy edge interval\" is a special health check interval that is used for the first health check right after a host is marked as unhealthy. For subsequent health checks Envoy will shift back to using either \"unhealthy interval\" if present or the standard health check interval that is defined.\n\nThe default value for \"unhealthy edge interval\" is the same as \"unhealthy interval\".",
    "notImp": false
  },
  {
    "name": "healthy_edge_interval",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The \"healthy edge interval\" is a special health check interval that is used for the first health check right after a host is marked as healthy. For subsequent health checks Envoy will shift back to using the standard health check interval that is defined.\n\nThe default value for \"healthy edge interval\" is the same as the default interval.",
    "notImp": false
  },
  {
    "name": "event_log_path",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "string",
    "enums": null,
    "comment": ":::attention\nThis field is deprecated in favor of the extension `event_logger` and `event_log_path` in the file sink extension. \n:::\n\nSpecifies the path to the `health check event log`.",
    "notImp": false
  },
  {
    "name": "event_logger",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig[]",
    "enums": null,
    "comment": "A list of event log sinks to process the health check event. extension-category: envoy.health_check.event_sinks",
    "notImp": false
  },
  {
    "name": "event_service",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "EventServiceConfig",
    "enums": null,
    "comment": "[#not-implemented-hide:] The gRPC service for the health check event service. If empty, health check events won't be sent to a remote endpoint.",
    "notImp": true
  },
  {
    "name": "always_log_health_check_failures",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set to true, health check failure events will always be logged. If set to false, only the initial health check failure event will be logged. The default value is false.",
    "notImp": false
  },
  {
    "name": "always_log_health_check_success",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set to true, health check success events will always be logged. If set to false, only host addition event will be logged if it is the first successful health check, or if the healthy threshold is reached. The default value is false.",
    "notImp": false
  },
  {
    "name": "tls_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HealthCheck_TlsOptions",
    "enums": null,
    "comment": "This allows overriding the cluster TLS settings, just for health check connections.",
    "notImp": false
  },
  {
    "name": "transport_socket_match_criteria",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "{ [key: string]: any; }",
    "enums": null,
    "comment": "Optional key/value pairs that will be used to match a transport socket from those specified in the cluster's `tranport socket matches`. For example, the following match criteria\n\n```yaml\n\n transport_socket_match_criteria:\n   useMTLS: true\n```\n\nWill match the following `cluster socket match`\n\n```yaml\n\n transport_socket_matches:\n - name: \"useMTLS\"\n   match:\n     useMTLS: true\n   transport_socket:\n     name: envoy.transport_sockets.tls\n     config: { ... } # tls socket configuration\n```\n\nIf this field is set, then for health checks it will supersede an entry of ``envoy.transport_socket`` in the `LbEndpoint.Metadata`. This allows using different transport socket capabilities for health checking versus proxying to the endpoint.\n\nIf the key/values pairs specified do not match any `transport socket matches`, the cluster's `transport socket` will be used for health check socket configuration.",
    "notImp": false
  }
] };

export const HealthCheck_SingleFields = [
  "timeout",
  "interval",
  "initial_jitter",
  "interval_jitter",
  "interval_jitter_percent",
  "unhealthy_threshold",
  "healthy_threshold",
  "alt_port",
  "reuse_connection",
  "no_traffic_interval",
  "no_traffic_healthy_interval",
  "unhealthy_interval",
  "unhealthy_edge_interval",
  "healthy_edge_interval",
  "always_log_health_check_failures",
  "always_log_health_check_success"
];

export const HealthCheck_Payload: OutType = { "HealthCheck_Payload": [
  {
    "name": "payload.text",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Hex encoded payload. E.g., \"000000FF\".",
    "notImp": false
  },
  {
    "name": "payload.binary",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Uint8Array<ArrayBufferLike>",
    "enums": null,
    "comment": "Binary payload.",
    "notImp": false
  }
] };

export const HealthCheck_Payload_SingleFields = [
  "payload.text"
];

export const HealthCheck_HttpHealthCheck: OutType = { "HealthCheck_HttpHealthCheck": [
  {
    "name": "host",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The value of the host header in the HTTP health check request. If left empty (default value), the name of the cluster this health check is associated with will be used. The host header can be customized for a specific endpoint by setting the `hostname` field.",
    "notImp": false
  },
  {
    "name": "path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Specifies the HTTP path that will be requested during health checking. For example ``/healthcheck``.",
    "notImp": false
  },
  {
    "name": "send",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HealthCheck_Payload",
    "enums": null,
    "comment": "[#not-implemented-hide:] HTTP specific payload.",
    "notImp": true
  },
  {
    "name": "receive",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HealthCheck_Payload[]",
    "enums": null,
    "comment": "Specifies a list of HTTP expected responses to match in the first ``response_buffer_size`` bytes of the response body. If it is set, both the expected response check and status code determine the health check. When checking the response, “fuzzy” matching is performed such that each payload block must be found, and in the order specified, but not necessarily contiguous.\n\n:::note\n\nIt is recommended to set ``response_buffer_size`` based on the total Payload size for efficiency. The default buffer size is 1024 bytes when it is not set.",
    "notImp": false
  },
  {
    "name": "response_buffer_size",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Specifies the size of response buffer in bytes that is used to Payload match. The default value is 1024. Setting to 0 implies that the Payload will be matched against the entire response.",
    "notImp": false
  },
  {
    "name": "request_headers_to_add",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderValueOption[]",
    "enums": null,
    "comment": "Specifies a list of HTTP headers that should be added to each request that is sent to the health checked cluster. For more information, including details on header value syntax, see the documentation on `custom request headers`.",
    "notImp": false
  },
  {
    "name": "request_headers_to_remove",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Specifies a list of HTTP headers that should be removed from each request that is sent to the health checked cluster.",
    "notImp": false
  },
  {
    "name": "expected_statuses",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Int64Range[]",
    "enums": null,
    "comment": "Specifies a list of HTTP response statuses considered healthy. If provided, replaces default 200-only policy - 200 must be included explicitly as needed. Ranges follow half-open semantics of `Int64Range`. The start and end of each range are required. Only statuses in the range [100, 600) are allowed.",
    "notImp": false
  },
  {
    "name": "retriable_statuses",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Int64Range[]",
    "enums": null,
    "comment": "Specifies a list of HTTP response statuses considered retriable. If provided, responses in this range will count towards the configured `unhealthy_threshold`, but will not result in the host being considered immediately unhealthy. Ranges follow half-open semantics of `Int64Range`. The start and end of each range are required. Only statuses in the range [100, 600) are allowed. The `expected_statuses` field takes precedence for any range overlaps with this field i.e. if status code 200 is both retriable and expected, a 200 response will be considered a successful health check. By default all responses not in `expected_statuses` will result in the host being considered immediately unhealthy i.e. if status code 200 is expected and there are no configured retriable statuses, any non-200 response will result in the host being marked unhealthy.",
    "notImp": false
  },
  {
    "name": "codec_client_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CodecClientType",
    "enums": [
      "HTTP1",
      "HTTP2",
      "HTTP3"
    ],
    "comment": "Use specified application protocol for health checks.",
    "notImp": false
  },
  {
    "name": "service_name_matcher",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "StringMatcher",
    "enums": null,
    "comment": "An optional service name parameter which is used to validate the identity of the health checked cluster using a `StringMatcher`. See the `architecture overview` for more information.",
    "notImp": false
  },
  {
    "name": "method",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RequestMethod",
    "enums": [
      "METHOD_UNSPECIFIED",
      "GET",
      "HEAD",
      "POST",
      "PUT",
      "DELETE",
      "CONNECT",
      "OPTIONS",
      "TRACE",
      "PATCH"
    ],
    "comment": "HTTP Method that will be used for health checking, default is \"GET\". GET, HEAD, POST, PUT, DELETE, OPTIONS, TRACE, PATCH methods are supported, but making request body is not supported. CONNECT method is disallowed because it is not appropriate for health check request. If a non-200 response is expected by the method, it needs to be set in `expected_statuses`.",
    "notImp": false
  }
] };

export const HealthCheck_HttpHealthCheck_SingleFields = [
  "host",
  "path",
  "response_buffer_size",
  "request_headers_to_remove",
  "codec_client_type",
  "method"
];

export const HealthCheck_TcpHealthCheck: OutType = { "HealthCheck_TcpHealthCheck": [
  {
    "name": "send",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HealthCheck_Payload",
    "enums": null,
    "comment": "Empty payloads imply a connect-only health check.",
    "notImp": false
  },
  {
    "name": "receive",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HealthCheck_Payload[]",
    "enums": null,
    "comment": "When checking the response, “fuzzy” matching is performed such that each payload block must be found, and in the order specified, but not necessarily contiguous.",
    "notImp": false
  },
  {
    "name": "proxy_protocol_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ProxyProtocolConfig",
    "enums": null,
    "comment": "When setting this value, it tries to attempt health check request with ProxyProtocol. When ``send`` is presented, they are sent after preceding ProxyProtocol header. Only ProxyProtocol header is sent when ``send`` is not presented. It allows to use both ProxyProtocol V1 and V2. In V1, it presents L3/L4. In V2, it includes LOCAL command and doesn't include L3/L4.",
    "notImp": false
  }
] };

export const HealthCheck_RedisHealthCheck: OutType = { "HealthCheck_RedisHealthCheck": [
  {
    "name": "key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "If set, optionally perform ``EXISTS <key>`` instead of ``PING``. A return value from Redis of 0 (does not exist) is considered a passing healthcheck. A return value other than 0 is considered a failure. This allows the user to mark a Redis instance for maintenance by setting the specified key to any value and waiting for traffic to drain.",
    "notImp": false
  }
] };

export const HealthCheck_RedisHealthCheck_SingleFields = [
  "key"
];

export const HealthCheck_GrpcHealthCheck: OutType = { "HealthCheck_GrpcHealthCheck": [
  {
    "name": "service_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "An optional service name parameter which will be sent to gRPC service in `grpc.health.v1.HealthCheckRequest <https://github.com/grpc/grpc/blob/master/src/proto/grpc/health/v1/health.proto#L20>`_. message. See `gRPC health-checking overview <https://github.com/grpc/grpc/blob/master/doc/health-checking.md>`_ for more information.",
    "notImp": false
  },
  {
    "name": "authority",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The value of the `:authority` header in the gRPC health check request. If left empty (default value), the name of the cluster this health check is associated with will be used. The authority header can be customized for a specific endpoint by setting the `hostname` field.",
    "notImp": false
  },
  {
    "name": "initial_metadata",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderValueOption[]",
    "enums": null,
    "comment": "Specifies a list of key-value pairs that should be added to the metadata of each GRPC call that is sent to the health checked cluster. For more information, including details on header value syntax, see the documentation on `custom request headers`.",
    "notImp": false
  }
] };

export const HealthCheck_GrpcHealthCheck_SingleFields = [
  "service_name",
  "authority"
];

export const HealthCheck_CustomHealthCheck: OutType = { "HealthCheck_CustomHealthCheck": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The registered name of the custom health checker.",
    "notImp": false
  },
  {
    "name": "config_type.typed_config",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "A custom health checker specific configuration which depends on the custom health checker being instantiated. See :api:`envoy/config/health_checker` for reference. extension-category: envoy.health_checkers",
    "notImp": false
  }
] };

export const HealthCheck_CustomHealthCheck_SingleFields = [
  "name"
];