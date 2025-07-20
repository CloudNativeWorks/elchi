import {OutType} from '@elchi/tags/tagsType';


export const HttpConnectionManager_Tracing: OutType = { "HttpConnectionManager_Tracing": [
  {
    "name": "client_sampling",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Percent",
    "enums": null,
    "comment": "Target percentage of requests managed by this HTTP connection manager that will be force traced if the `x-client-trace-id` header is set. This field is a direct analog for the runtime variable 'tracing.client_enabled' in the `HTTP Connection Manager`. Default: 100%",
    "notImp": false
  },
  {
    "name": "random_sampling",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Percent",
    "enums": null,
    "comment": "Target percentage of requests managed by this HTTP connection manager that will be randomly selected for trace generation, if not requested by the client or not forced. This field is a direct analog for the runtime variable 'tracing.random_sampling' in the `HTTP Connection Manager`. Default: 100%",
    "notImp": false
  },
  {
    "name": "overall_sampling",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Percent",
    "enums": null,
    "comment": "Target percentage of requests managed by this HTTP connection manager that will be traced after all other sampling checks have been applied (client-directed, force tracing, random sampling). This field functions as an upper limit on the total configured sampling rate. For instance, setting client_sampling to 100% but overall_sampling to 1% will result in only 1% of client requests with the appropriate headers to be force traced. This field is a direct analog for the runtime variable 'tracing.global_enabled' in the `HTTP Connection Manager`. Default: 100%",
    "notImp": false
  },
  {
    "name": "verbose",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether to annotate spans with additional data. If true, spans will include logs for stream events.",
    "notImp": false
  },
  {
    "name": "max_path_tag_length",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Maximum length of the request path to extract and include in the HttpUrl tag. Used to truncate lengthy request paths to meet the needs of a tracing backend. Default: 256",
    "notImp": false
  },
  {
    "name": "custom_tags",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CustomTag[]",
    "enums": null,
    "comment": "A list of custom tags with unique tag name to create tags for the active span.",
    "notImp": false
  },
  {
    "name": "provider",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Tracing_Http",
    "enums": null,
    "comment": "Configuration for an external tracing provider. If not specified, no tracing will be performed.",
    "notImp": false
  },
  {
    "name": "spawn_upstream_span",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Create separate tracing span for each upstream request if true. And if this flag is set to true, the tracing provider will assume that Envoy will be independent hop in the trace chain and may set span type to client or server based on this flag. This will deprecate the `start_child_span` in the router.\n\nUsers should set appropriate value based on their tracing provider and actual scenario:\n\n* If Envoy is used as sidecar and users want to make the sidecar and its application as only one hop in the trace chain, this flag should be set to false. And please also make sure the `start_child_span` in the router is not set to true. * If Envoy is used as gateway or independent proxy, or users want to make the sidecar and its application as different hops in the trace chain, this flag should be set to true. * If tracing provider that has explicit requirements on span creation (like SkyWalking), this flag should be set to true.\n\nThe default value is false for now for backward compatibility.",
    "notImp": false
  }
] };

export const HttpConnectionManager_Tracing_SingleFields = [
  "verbose",
  "max_path_tag_length",
  "spawn_upstream_span"
];

export const HttpConnectionManager_HcmAccessLogOptions: OutType = { "HttpConnectionManager_HcmAccessLogOptions": [
  {
    "name": "access_log_flush_interval",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The interval to flush the above access logs. By default, the HCM will flush exactly one access log on stream close, when the HTTP request is complete. If this field is set, the HCM will flush access logs periodically at the specified interval. This is especially useful in the case of long-lived requests, such as CONNECT and Websockets. Final access logs can be detected via the ``requestComplete()`` method of ``StreamInfo`` in access log filters, or through the ``%DURATION%`` substitution string. The interval must be at least 1 millisecond.",
    "notImp": false
  },
  {
    "name": "flush_access_log_on_new_request",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set to true, HCM will flush an access log when a new HTTP request is received, after request headers have been evaluated, before iterating through the HTTP filter chain. This log record, if enabled, does not depend on periodic log records or request completion log. Details related to upstream cluster, such as upstream host, will not be available for this log.",
    "notImp": false
  },
  {
    "name": "flush_log_on_tunnel_successfully_established",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, the HCM will flush an access log when a tunnel is successfully established. For example, this could be when an upstream has successfully returned 101 Switching Protocols, or when the proxy has returned 200 to a CONNECT request.",
    "notImp": false
  }
] };

export const HttpConnectionManager_HcmAccessLogOptions_SingleFields = [
  "access_log_flush_interval",
  "flush_access_log_on_new_request",
  "flush_log_on_tunnel_successfully_established"
];

export const HttpConnectionManager_InternalAddressConfig: OutType = { "HttpConnectionManager_InternalAddressConfig": [
  {
    "name": "unix_sockets",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether unix socket addresses should be considered internal.",
    "notImp": false
  },
  {
    "name": "cidr_ranges",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CidrRange[]",
    "enums": null,
    "comment": "List of CIDR ranges that are treated as internal. If unset, then RFC1918 / RFC4193 IP addresses will be considered internal.",
    "notImp": false
  }
] };

export const HttpConnectionManager_InternalAddressConfig_SingleFields = [
  "unix_sockets"
];

export const HttpConnectionManager_SetCurrentClientCertDetails: OutType = { "HttpConnectionManager_SetCurrentClientCertDetails": [
  {
    "name": "subject",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether to forward the subject of the client cert. Defaults to false.",
    "notImp": false
  },
  {
    "name": "cert",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether to forward the entire client cert in URL encoded PEM format. This will appear in the XFCC header comma separated from other values with the value Cert=\"PEM\". Defaults to false.",
    "notImp": false
  },
  {
    "name": "chain",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether to forward the entire client cert chain (including the leaf cert) in URL encoded PEM format. This will appear in the XFCC header comma separated from other values with the value Chain=\"PEM\". Defaults to false.",
    "notImp": false
  },
  {
    "name": "dns",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether to forward the DNS type Subject Alternative Names of the client cert. Defaults to false.",
    "notImp": false
  },
  {
    "name": "uri",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether to forward the URI type Subject Alternative Name of the client cert. Defaults to false.",
    "notImp": false
  }
] };

export const HttpConnectionManager_SetCurrentClientCertDetails_SingleFields = [
  "subject",
  "cert",
  "chain",
  "dns",
  "uri"
];

export const RequestIDExtension: OutType = { "RequestIDExtension": [
  {
    "name": "typed_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "Request ID extension specific configuration.",
    "notImp": false
  }
] };

export const LocalReplyConfig: OutType = { "LocalReplyConfig": [
  {
    "name": "mappers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ResponseMapper[]",
    "enums": null,
    "comment": "Configuration of list of mappers which allows to filter and change local response. The mappers will be checked by the specified order until one is matched.",
    "notImp": false
  },
  {
    "name": "body_format",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SubstitutionFormatString",
    "enums": null,
    "comment": "The configuration to form response body from the `command operators` and to specify response content type as one of: plain/text or application/json.\n\nExample one: \"plain/text\" ``body_format``.\n\n```yaml\n  :type-name: envoy.config.core.v3.SubstitutionFormatString\n\n  text_format: \"%LOCAL_REPLY_BODY%:%RESPONSE_CODE%:path=%REQ(:path)%\\n\"\n```\n The following response body in \"plain/text\" format will be generated for a request with local reply body of \"upstream connection error\", response_code=503 and path=/foo.\n\n.. code-block:: text\n\n  upstream connect error:503:path=/foo\n\nExample two: \"application/json\" ``body_format``.\n\n```yaml\n  :type-name: envoy.config.core.v3.SubstitutionFormatString\n\n  json_format:\n    status: \"%RESPONSE_CODE%\"\n    message: \"%LOCAL_REPLY_BODY%\"\n    path: \"%REQ(:path)%\"\n```\n The following response body in \"application/json\" format would be generated for a request with local reply body of \"upstream connection error\", response_code=503 and path=/foo.\n\n```json\n\n {\n   \"status\": 503,\n   \"message\": \"upstream connection error\",\n   \"path\": \"/foo\"\n }",
    "notImp": false
  }
] };

export const HttpConnectionManager_PathNormalizationOptions: OutType = { "HttpConnectionManager_PathNormalizationOptions": [
  {
    "name": "forwarding_transformation",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "PathTransformation",
    "enums": null,
    "comment": "[#not-implemented-hide:] Normalization applies internally before any processing of requests by HTTP filters, routing, and matching *and* will affect the forwarded ``:path`` header. Defaults to `NormalizePathRFC3986`. When not specified, this value may be overridden by the runtime variable `http_connection_manager.normalize_path`. Envoy will respond with 400 to paths that are malformed (e.g. for paths that fail RFC 3986 normalization due to disallowed characters.)",
    "notImp": true
  },
  {
    "name": "http_filter_transformation",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "PathTransformation",
    "enums": null,
    "comment": "[#not-implemented-hide:] Normalization only applies internally before any processing of requests by HTTP filters, routing, and matching. These will be applied after full transformation is applied. The ``:path`` header before this transformation will be restored in the router filter and sent upstream unless it was mutated by a filter. Defaults to no transformations. Multiple actions can be applied in the same Transformation, forming a sequential pipeline. The transformations will be performed in the order that they appear. Envoy will respond with 400 to paths that are malformed (e.g. for paths that fail RFC 3986 normalization due to disallowed characters.)",
    "notImp": true
  }
] };

export const HttpConnectionManager_ProxyStatusConfig: OutType = { "HttpConnectionManager_ProxyStatusConfig": [
  {
    "name": "remove_details",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, the details field of the Proxy-Status header is not populated with stream_info.response_code_details. This value defaults to ``false``, i.e. the ``details`` field is populated by default.",
    "notImp": false
  },
  {
    "name": "remove_connection_termination_details",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, the details field of the Proxy-Status header will not contain connection termination details. This value defaults to ``false``, i.e. the ``details`` field will contain connection termination details by default.",
    "notImp": false
  },
  {
    "name": "remove_response_flags",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, the details field of the Proxy-Status header will not contain an enumeration of the Envoy ResponseFlags. This value defaults to ``false``, i.e. the ``details`` field will contain a list of ResponseFlags by default.",
    "notImp": false
  },
  {
    "name": "set_recommended_response_code",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, overwrites the existing Status header with the response code recommended by the Proxy-Status spec. This value defaults to ``false``, i.e. the HTTP response code is not overwritten.",
    "notImp": false
  },
  {
    "name": "proxy_name.use_node_id",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If ``use_node_id`` is set, Proxy-Status headers will use the Envoy's node ID as the name of the proxy.",
    "notImp": false
  },
  {
    "name": "proxy_name.literal_proxy_name",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "If ``literal_proxy_name`` is set, Proxy-Status headers will use this value as the name of the proxy.",
    "notImp": false
  }
] };

export const HttpConnectionManager_ProxyStatusConfig_SingleFields = [
  "remove_details",
  "remove_connection_termination_details",
  "remove_response_flags",
  "set_recommended_response_code",
  "proxy_name.use_node_id",
  "proxy_name.literal_proxy_name"
];

export const HttpConnectionManager: OutType = { "HttpConnectionManager": [
  {
    "name": "codec_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HttpConnectionManager_CodecType",
    "enums": [
      "AUTO",
      "HTTP1",
      "HTTP2",
      "HTTP3"
    ],
    "comment": "Supplies the type of codec that the connection manager should use.",
    "notImp": false
  },
  {
    "name": "stat_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The human readable prefix to use when emitting statistics for the connection manager. See the `statistics documentation` for more information.",
    "notImp": false
  },
  {
    "name": "route_specifier.rds",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Rds",
    "enums": null,
    "comment": "The connection manager’s route table will be dynamically loaded via the RDS API.",
    "notImp": false
  },
  {
    "name": "route_specifier.route_config",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RouteConfiguration",
    "enums": null,
    "comment": "The route table for the connection manager is static and is specified in this property.",
    "notImp": false
  },
  {
    "name": "route_specifier.scoped_routes",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "ScopedRoutes",
    "enums": null,
    "comment": "A route table will be dynamically assigned to each request based on request attributes (e.g., the value of a header). The \"routing scopes\" (i.e., route tables) and \"scope keys\" are specified in this message.",
    "notImp": false
  },
  {
    "name": "http_filters",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HttpFilter[]",
    "enums": null,
    "comment": "A list of individual HTTP filters that make up the filter chain for requests made to the connection manager. `Order matters` as the filters are processed sequentially as request events happen.",
    "notImp": false
  },
  {
    "name": "add_user_agent",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether the connection manager manipulates the `config_http_conn_man_headers_user-agent` and `config_http_conn_man_headers_downstream-service-cluster` headers. See the linked documentation for more information. Defaults to false.",
    "notImp": false
  },
  {
    "name": "tracing",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HttpConnectionManager_Tracing",
    "enums": null,
    "comment": "Presence of the object defines whether the connection manager emits `tracing` data to the `configured tracing provider`.",
    "notImp": false
  },
  {
    "name": "common_http_protocol_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HttpProtocolOptions",
    "enums": null,
    "comment": "Additional settings for HTTP requests handled by the connection manager. These will be applicable to both HTTP1 and HTTP2 requests.",
    "notImp": false
  },
  {
    "name": "http1_safe_max_connection_duration",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set to true, Envoy will not start a drain timer for downstream HTTP1 connections after `common_http_protocol_options.max_connection_duration` passes. Instead, Envoy will wait for the next downstream request, add connection:close to the response headers, then close the connection after the stream ends.\n\nThis behavior is compliant with `RFC 9112 section 9.6 <https://www.rfc-editor.org/rfc/rfc9112#name-tear-down>`_\n\nIf set to false, ``max_connection_duration`` will cause Envoy to enter the normal drain sequence for HTTP1 with Envoy eventually closing the connection (once there are no active streams).\n\nHas no effect if ``max_connection_duration`` is unset. Defaults to false.",
    "notImp": false
  },
  {
    "name": "http_protocol_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Http1ProtocolOptions",
    "enums": null,
    "comment": "Additional HTTP/1 settings that are passed to the HTTP/1 codec.",
    "notImp": false
  },
  {
    "name": "http2_protocol_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Http2ProtocolOptions",
    "enums": null,
    "comment": "Additional HTTP/2 settings that are passed directly to the HTTP/2 codec.",
    "notImp": false
  },
  {
    "name": "http3_protocol_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Http3ProtocolOptions",
    "enums": null,
    "comment": "Additional HTTP/3 settings that are passed directly to the HTTP/3 codec.",
    "notImp": false
  },
  {
    "name": "server_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "An optional override that the connection manager will write to the server header in responses. If not set, the default is ``envoy``.",
    "notImp": false
  },
  {
    "name": "server_header_transformation",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HttpConnectionManager_ServerHeaderTransformation",
    "enums": [
      "OVERWRITE",
      "APPEND_IF_ABSENT",
      "PASS_THROUGH"
    ],
    "comment": "Defines the action to be applied to the Server header on the response path. By default, Envoy will overwrite the header with the value specified in server_name.",
    "notImp": false
  },
  {
    "name": "scheme_header_transformation",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SchemeHeaderTransformation",
    "enums": null,
    "comment": "Allows for explicit transformation of the `:scheme` header on the request path. If not set, Envoy's default `scheme ` handling applies.",
    "notImp": false
  },
  {
    "name": "max_request_headers_kb",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The maximum request headers size for incoming connections. If unconfigured, the default max request headers allowed is 60 KiB. The default value can be overridden by setting runtime key ``envoy.reloadable_features.max_request_headers_size_kb``. Requests that exceed this limit will receive a 431 response.\n\nNote: currently some protocol codecs impose limits on the maximum size of a single header: HTTP/2 (when using nghttp2) limits a single header to around 100kb. HTTP/3 limits a single header to around 1024kb.",
    "notImp": false
  },
  {
    "name": "stream_idle_timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The stream idle timeout for connections managed by the connection manager. If not specified, this defaults to 5 minutes. The default value was selected so as not to interfere with any smaller configured timeouts that may have existed in configurations prior to the introduction of this feature, while introducing robustness to TCP connections that terminate without a FIN.\n\nThis idle timeout applies to new streams and is overridable by the `route-level idle_timeout`. Even on a stream in which the override applies, prior to receipt of the initial request headers, the `stream_idle_timeout` applies. Each time an encode/decode event for headers or data is processed for the stream, the timer will be reset. If the timeout fires, the stream is terminated with a 408 Request Timeout error code if no upstream response header has been received, otherwise a stream reset occurs.\n\nThis timeout also specifies the amount of time that Envoy will wait for the peer to open enough window to write any remaining stream data once the entirety of stream data (local end stream is true) has been buffered pending available window. In other words, this timeout defends against a peer that does not release enough window to completely write the stream, even though all data has been proxied within available flow control windows. If the timeout is hit in this case, the `tx_flush_timeout` counter will be incremented. Note that `max_stream_duration` does not apply to this corner case.\n\nIf the `overload action` \"envoy.overload_actions.reduce_timeouts\" is configured, this timeout is scaled according to the value for `HTTP_DOWNSTREAM_STREAM_IDLE`.\n\nNote that it is possible to idle timeout even if the wire traffic for a stream is non-idle, due to the granularity of events presented to the connection manager. For example, while receiving very large request headers, it may be the case that there is traffic regularly arriving on the wire while the connection manage is only able to observe the end-of-headers event, hence the stream may still idle timeout.\n\nA value of 0 will completely disable the connection manager stream idle timeout, although per-route idle timeout overrides will continue to apply.",
    "notImp": false
  },
  {
    "name": "request_timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The amount of time that Envoy will wait for the entire request to be received. The timer is activated when the request is initiated, and is disarmed when the last byte of the request is sent upstream (i.e. all decoding filters have processed the request), OR when the response is initiated. If not specified or set to 0, this timeout is disabled.",
    "notImp": false
  },
  {
    "name": "request_headers_timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The amount of time that Envoy will wait for the request headers to be received. The timer is activated when the first byte of the headers is received, and is disarmed when the last byte of the headers has been received. If not specified or set to 0, this timeout is disabled.",
    "notImp": false
  },
  {
    "name": "drain_timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The time that Envoy will wait between sending an HTTP/2 “shutdown notification” (GOAWAY frame with max stream ID) and a final GOAWAY frame. This is used so that Envoy provides a grace period for new streams that race with the final GOAWAY frame. During this grace period, Envoy will continue to accept new streams. After the grace period, a final GOAWAY frame is sent and Envoy will start refusing new streams. Draining occurs either when a connection hits the idle timeout, when `max_connection_duration` is reached, or during general server draining. The default grace period is 5000 milliseconds (5 seconds) if this option is not specified.",
    "notImp": false
  },
  {
    "name": "delayed_close_timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The delayed close timeout is for downstream connections managed by the HTTP connection manager. It is defined as a grace period after connection close processing has been locally initiated during which Envoy will wait for the peer to close (i.e., a TCP FIN/RST is received by Envoy from the downstream connection) prior to Envoy closing the socket associated with that connection. NOTE: This timeout is enforced even when the socket associated with the downstream connection is pending a flush of the write buffer. However, any progress made writing data to the socket will restart the timer associated with this timeout. This means that the total grace period for a socket in this state will be <total_time_waiting_for_write_buffer_flushes>+<delayed_close_timeout>.\n\nDelaying Envoy's connection close and giving the peer the opportunity to initiate the close sequence mitigates a race condition that exists when downstream clients do not drain/process data in a connection's receive buffer after a remote close has been detected via a socket write(). This race leads to such clients failing to process the response code sent by Envoy, which could result in erroneous downstream processing.\n\nIf the timeout triggers, Envoy will close the connection's socket.\n\nThe default timeout is 1000 ms if this option is not specified.\n\n:::note\nTo be useful in avoiding the race condition described above, this timeout must be set to *at least* <max round trip time expected between clients and Envoy>+<100ms to account for a reasonable \"worst\" case processing time for a full iteration of Envoy's event loop>. \n:::\n\n:::warning\nA value of 0 will completely disable delayed close processing. When disabled, the downstream connection's socket will be closed immediately after the write flush is completed or will never close if the write flush does not complete.",
    "notImp": false
  },
  {
    "name": "access_log",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "AccessLog[]",
    "enums": null,
    "comment": "Configuration for `HTTP access logs` emitted by the connection manager.",
    "notImp": false
  },
  {
    "name": "access_log_flush_interval",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The interval to flush the above access logs.\n\n:::attention\n\nThis field is deprecated in favor of `access_log_flush_interval`. Note that if both this field and `access_log_flush_interval` are specified, the former (deprecated field) is ignored. \n:::",
    "notImp": false
  },
  {
    "name": "flush_access_log_on_new_request",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set to true, HCM will flush an access log once when a new HTTP request is received, after the request headers have been evaluated, and before iterating through the HTTP filter chain.\n\n:::attention\n\nThis field is deprecated in favor of `flush_access_log_on_new_request`. Note that if both this field and `flush_access_log_on_new_request` are specified, the former (deprecated field) is ignored. \n:::",
    "notImp": false
  },
  {
    "name": "access_log_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HttpConnectionManager_HcmAccessLogOptions",
    "enums": null,
    "comment": "Additional access log options for HTTP connection manager.",
    "notImp": false
  },
  {
    "name": "use_remote_address",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set to true, the connection manager will use the real remote address of the client connection when determining internal versus external origin and manipulating various headers. If set to false or absent, the connection manager will use the `config_http_conn_man_headers_x-forwarded-for` HTTP header. See the documentation for `config_http_conn_man_headers_x-forwarded-for`, `config_http_conn_man_headers_x-envoy-internal`, and `config_http_conn_man_headers_x-envoy-external-address` for more information.",
    "notImp": false
  },
  {
    "name": "xff_num_trusted_hops",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The number of additional ingress proxy hops from the right side of the `config_http_conn_man_headers_x-forwarded-for` HTTP header to trust when determining the origin client's IP address. The default is zero if this option is not specified. See the documentation for `config_http_conn_man_headers_x-forwarded-for` for more information.",
    "notImp": false
  },
  {
    "name": "original_ip_detection_extensions",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig[]",
    "enums": null,
    "comment": "The configuration for the original IP detection extensions.\n\nWhen configured the extensions will be called along with the request headers and information about the downstream connection, such as the directly connected address. Each extension will then use these parameters to decide the request's effective remote address. If an extension fails to detect the original IP address and isn't configured to reject the request, the HCM will try the remaining extensions until one succeeds or rejects the request. If the request isn't rejected nor any extension succeeds, the HCM will fallback to using the remote address.\n\n:::warning\nExtensions cannot be used in conjunction with `use_remote_address` nor `xff_num_trusted_hops`. \n:::\n\nextension-category: envoy.http.original_ip_detection",
    "notImp": false
  },
  {
    "name": "early_header_mutation_extensions",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig[]",
    "enums": null,
    "comment": "The configuration for the early header mutation extensions.\n\nWhen configured the extensions will be called before any routing, tracing, or any filter processing. Each extension will be applied in the order they are configured. If the same header is mutated by multiple extensions, then the last extension will win.\n\nextension-category: envoy.http.early_header_mutation",
    "notImp": false
  },
  {
    "name": "internal_address_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HttpConnectionManager_InternalAddressConfig",
    "enums": null,
    "comment": "Configures what network addresses are considered internal for stats and header sanitation purposes. If unspecified, only RFC1918 IP addresses will be considered internal. See the documentation for `config_http_conn_man_headers_x-envoy-internal` for more information about internal/external addresses.\n\n:::warning\nAs of Envoy 1.33.0 no IP addresses will be considered trusted. If you have tooling such as probes on your private network which need to be treated as trusted (e.g. changing arbitrary x-envoy headers) you will have to manually include those addresses or CIDR ranges like: \n:::\n\n```yaml\n  :type-name: envoy.extensions.filters.network.http_connection_manager.v3.InternalAddressConfig\n\n  cidr_ranges:\n      address_prefix: 10.0.0.0\n      prefix_len: 8\n  cidr_ranges:\n      address_prefix: 192.168.0.0\n      prefix_len: 16\n  cidr_ranges:\n      address_prefix: 172.16.0.0\n      prefix_len: 12\n  cidr_ranges:\n      address_prefix: 127.0.0.1\n      prefix_len: 32\n  cidr_ranges:\n      address_prefix: fd00::\n      prefix_len: 8\n  cidr_ranges:\n      address_prefix: ::1\n      prefix_len: 128",
    "notImp": false
  },
  {
    "name": "skip_xff_append",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set, Envoy will not append the remote address to the `config_http_conn_man_headers_x-forwarded-for` HTTP header. This may be used in conjunction with HTTP filters that explicitly manipulate XFF after the HTTP connection manager has mutated the request headers. While `use_remote_address` will also suppress XFF addition, it has consequences for logging and other Envoy uses of the remote address, so ``skip_xff_append`` should be used when only an elision of XFF addition is intended.",
    "notImp": false
  },
  {
    "name": "via",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Via header value to append to request and response headers. If this is empty, no via header will be appended.",
    "notImp": false
  },
  {
    "name": "generate_request_id",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether the connection manager will generate the `x-request-id` header if it does not exist. This defaults to true. Generating a random UUID4 is expensive so in high throughput scenarios where this feature is not desired it can be disabled.",
    "notImp": false
  },
  {
    "name": "preserve_external_request_id",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether the connection manager will keep the `x-request-id` header if passed for a request that is edge (Edge request is the request from external clients to front Envoy) and not reset it, which is the current Envoy behaviour. This defaults to false.",
    "notImp": false
  },
  {
    "name": "always_set_request_id_in_response",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set, Envoy will always set `x-request-id` header in response. If this is false or not set, the request ID is returned in responses only if tracing is forced using `x-envoy-force-trace` header.",
    "notImp": false
  },
  {
    "name": "forward_client_cert_details",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HttpConnectionManager_ForwardClientCertDetails",
    "enums": [
      "SANITIZE",
      "FORWARD_ONLY",
      "APPEND_FORWARD",
      "SANITIZE_SET",
      "ALWAYS_FORWARD_ONLY"
    ],
    "comment": "How to handle the `config_http_conn_man_headers_x-forwarded-client-cert` (XFCC) HTTP header.",
    "notImp": false
  },
  {
    "name": "set_current_client_cert_details",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HttpConnectionManager_SetCurrentClientCertDetails",
    "enums": null,
    "comment": "This field is valid only when `forward_client_cert_details` is APPEND_FORWARD or SANITIZE_SET and the client connection is mTLS. It specifies the fields in the client certificate to be forwarded. Note that in the `config_http_conn_man_headers_x-forwarded-client-cert` header, ``Hash`` is always set, and ``By`` is always set when the client certificate presents the URI type Subject Alternative Name value.",
    "notImp": false
  },
  {
    "name": "proxy_100_continue",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If proxy_100_continue is true, Envoy will proxy incoming \"Expect: 100-continue\" headers upstream, and forward \"100 Continue\" responses downstream. If this is false or not set, Envoy will instead strip the \"Expect: 100-continue\" header, and send a \"100 Continue\" response itself.",
    "notImp": false
  },
  {
    "name": "represent_ipv4_remote_address_as_ipv4_mapped_ipv6",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If `use_remote_address` is true and represent_ipv4_remote_address_as_ipv4_mapped_ipv6 is true and the remote address is an IPv4 address, the address will be mapped to IPv6 before it is appended to ``x-forwarded-for``. This is useful for testing compatibility of upstream services that parse the header value. For example, 50.0.0.1 is represented as ::FFFF:50.0.0.1. See `IPv4-Mapped IPv6 Addresses <https://tools.ietf.org/html/rfc4291#section-2.5.5.2>`_ for details. This will also affect the `config_http_conn_man_headers_x-envoy-external-address` header. See `http_connection_manager.represent_ipv4_remote_address_as_ipv4_mapped_ipv6` for runtime control. [#not-implemented-hide:]",
    "notImp": true
  },
  {
    "name": "upgrade_configs",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HttpConnectionManager_UpgradeConfig[]",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "normalize_path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Should paths be normalized according to RFC 3986 before any processing of requests by HTTP filters or routing? This affects the upstream ``:path`` header as well. For paths that fail this check, Envoy will respond with 400 to paths that are malformed. This defaults to false currently but will default true in the future. When not specified, this value may be overridden by the runtime variable `http_connection_manager.normalize_path`. See `Normalization and Comparison <https://tools.ietf.org/html/rfc3986#section-6>`_ for details of normalization. Note that Envoy does not perform `case normalization <https://tools.ietf.org/html/rfc3986#section-6.2.2.1>`_",
    "notImp": false
  },
  {
    "name": "merge_slashes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Determines if adjacent slashes in the path are merged into one before any processing of requests by HTTP filters or routing. This affects the upstream ``:path`` header as well. Without setting this option, incoming requests with path ``//dir///file`` will not match against route with ``prefix`` match set to ``/dir``. Defaults to ``false``. Note that slash merging is not part of `HTTP spec <https://tools.ietf.org/html/rfc3986>`_ and is provided for convenience.",
    "notImp": false
  },
  {
    "name": "path_with_escaped_slashes_action",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HttpConnectionManager_PathWithEscapedSlashesAction",
    "enums": [
      "IMPLEMENTATION_SPECIFIC_DEFAULT",
      "KEEP_UNCHANGED",
      "REJECT_REQUEST",
      "UNESCAPE_AND_REDIRECT",
      "UNESCAPE_AND_FORWARD"
    ],
    "comment": "Action to take when request URL path contains escaped slash sequences (%2F, %2f, %5C and %5c). The default value can be overridden by the `http_connection_manager.path_with_escaped_slashes_action` runtime variable. The `http_connection_manager.path_with_escaped_slashes_action_sampling` runtime variable can be used to apply the action to a portion of all requests.",
    "notImp": false
  },
  {
    "name": "request_id_extension",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RequestIDExtension",
    "enums": null,
    "comment": "The configuration of the request ID extension. This includes operations such as generation, validation, and associated tracing operations. If empty, the `UuidRequestIdConfig` default extension is used with default parameters. See the documentation for that extension for details on what it does. Customizing the configuration for the default extension can be achieved by configuring it explicitly here. For example, to disable trace reason packing, the following configuration can be used:\n\n```yaml\n  :type-name: envoy.extensions.filters.network.http_connection_manager.v3.RequestIDExtension\n\n  typed_config:\n    \"@type\": type.googleapis.com/envoy.extensions.request_id.uuid.v3.UuidRequestIdConfig\n    pack_trace_reason: false\n```\n extension-category: envoy.request_id",
    "notImp": false
  },
  {
    "name": "local_reply_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "LocalReplyConfig",
    "enums": null,
    "comment": "The configuration to customize local reply returned by Envoy. It can customize status code, body text and response content type. If not specified, status code and text body are hard coded in Envoy, the response content type is plain text.",
    "notImp": false
  },
  {
    "name": "strip_matching_host_port",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Determines if the port part should be removed from host/authority header before any processing of request by HTTP filters or routing. The port would be removed only if it is equal to the `listener's` local port. This affects the upstream host header unless the method is CONNECT in which case if no filter adds a port the original port will be restored before headers are sent upstream. Without setting this option, incoming requests with host ``example:443`` will not match against route with `domains` match set to ``example``. Defaults to ``false``. Note that port removal is not part of `HTTP spec <https://tools.ietf.org/html/rfc3986>`_ and is provided for convenience. Only one of ``strip_matching_host_port`` or ``strip_any_host_port`` can be set.",
    "notImp": false
  },
  {
    "name": "strip_port_mode.strip_any_host_port",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Determines if the port part should be removed from host/authority header before any processing of request by HTTP filters or routing. This affects the upstream host header unless the method is CONNECT in which case if no filter adds a port the original port will be restored before headers are sent upstream. Without setting this option, incoming requests with host ``example:443`` will not match against route with `domains` match set to ``example``. Defaults to ``false``. Note that port removal is not part of `HTTP spec <https://tools.ietf.org/html/rfc3986>`_ and is provided for convenience. Only one of ``strip_matching_host_port`` or ``strip_any_host_port`` can be set.",
    "notImp": false
  },
  {
    "name": "stream_error_on_invalid_http_message",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Governs Envoy's behavior when receiving invalid HTTP from downstream. If this option is false (default), Envoy will err on the conservative side handling HTTP errors, terminating both HTTP/1.1 and HTTP/2 connections when receiving an invalid request. If this option is set to true, Envoy will be more permissive, only resetting the invalid stream in the case of HTTP/2 and leaving the connection open where possible (if the entire request is read for HTTP/1.1) In general this should be true for deployments receiving trusted traffic (L2 Envoys, company-internal mesh) and false when receiving untrusted traffic (edge deployments).\n\nIf different behaviors for invalid_http_message for HTTP/1 and HTTP/2 are desired, one should use the new HTTP/1 option `override_stream_error_on_invalid_http_message` or the new HTTP/2 option `override_stream_error_on_invalid_http_message` ``not`` the deprecated but similarly named `stream_error_on_invalid_http_messaging`",
    "notImp": false
  },
  {
    "name": "path_normalization_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HttpConnectionManager_PathNormalizationOptions",
    "enums": null,
    "comment": "[#not-implemented-hide:] Path normalization configuration. This includes configurations for transformations (e.g. RFC 3986 normalization or merge adjacent slashes) and the policy to apply them. The policy determines whether transformations affect the forwarded ``:path`` header. RFC 3986 path normalization is enabled by default and the default policy is that the normalized header will be forwarded. See `PathNormalizationOptions` for details.",
    "notImp": true
  },
  {
    "name": "strip_trailing_host_dot",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Determines if trailing dot of the host should be removed from host/authority header before any processing of request by HTTP filters or routing. This affects the upstream host header. Without setting this option, incoming requests with host ``example.com.`` will not match against route with `domains` match set to ``example.com``. Defaults to ``false``. When the incoming request contains a host/authority header that includes a port number, setting this option will strip a trailing dot, if present, from the host section, leaving the port as is (e.g. host value ``example.com.:443`` will be updated to ``example.com:443``).",
    "notImp": false
  },
  {
    "name": "proxy_status_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HttpConnectionManager_ProxyStatusConfig",
    "enums": null,
    "comment": "Proxy-Status HTTP response header configuration. If this config is set, the Proxy-Status HTTP response header field is populated. By default, it is not.",
    "notImp": false
  },
  {
    "name": "typed_header_validation_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "Configuration options for Header Validation (UHV). UHV is an extensible mechanism for checking validity of HTTP requests as well as providing normalization for request attributes, such as URI path. If the typed_header_validation_config is present it overrides the following options: ``normalize_path``, ``merge_slashes``, ``path_with_escaped_slashes_action`` ``http_protocol_options.allow_chunked_length``, ``common_http_protocol_options.headers_with_underscores_action``.\n\nThe default UHV checks the following:\n\n#. HTTP/1 header map validity according to `RFC 7230 section 3.2<https://datatracker.ietf.org/doc/html/rfc7230#section-3.2>`_ #. Syntax of HTTP/1 request target URI and response status #. HTTP/2 header map validity according to `RFC 7540 section 8.1.2<https://datatracker.ietf.org/doc/html/rfc7540#section-8.1.2`_ #. Syntax of HTTP/2 pseudo headers #. HTTP/3 header map validity according to `RFC 9114 section 4.3 <https://www.rfc-editor.org/rfc/rfc9114.html>`_ #. Syntax of HTTP/3 pseudo headers #. Syntax of ``Content-Length`` and ``Transfer-Encoding`` #. Validation of HTTP/1 requests with both ``Content-Length`` and ``Transfer-Encoding`` headers #. Normalization of the URI path according to `Normalization and Comparison <https://datatracker.ietf.org/doc/html/rfc3986#section-6>`_ without `case normalization <https://datatracker.ietf.org/doc/html/rfc3986#section-6.2.2.1>`_\n\n[#not-implemented-hide:] extension-category: envoy.http.header_validators",
    "notImp": true
  },
  {
    "name": "append_x_forwarded_port",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Append the ``x-forwarded-port`` header with the port value client used to connect to Envoy. It will be ignored if the ``x-forwarded-port`` header has been set by any trusted proxy in front of Envoy.",
    "notImp": false
  },
  {
    "name": "append_local_overload",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Append the `config_http_conn_man_headers_x-envoy-local-overloaded` HTTP header in the scenario where the Overload Manager has been triggered.",
    "notImp": false
  },
  {
    "name": "add_proxy_protocol_connection_state",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether the HCM will add ProxyProtocolFilterState to the Connection lifetime filter state. Defaults to ``true``. This should be set to ``false`` in cases where Envoy's view of the downstream address may not correspond to the actual client address, for example, if there's another proxy in front of the Envoy.",
    "notImp": false
  }
] };

export const HttpConnectionManager_SingleFields = [
  "codec_type",
  "stat_prefix",
  "add_user_agent",
  "http1_safe_max_connection_duration",
  "server_name",
  "server_header_transformation",
  "max_request_headers_kb",
  "stream_idle_timeout",
  "request_timeout",
  "request_headers_timeout",
  "drain_timeout",
  "delayed_close_timeout",
  "use_remote_address",
  "xff_num_trusted_hops",
  "skip_xff_append",
  "via",
  "generate_request_id",
  "preserve_external_request_id",
  "always_set_request_id_in_response",
  "forward_client_cert_details",
  "proxy_100_continue",
  "represent_ipv4_remote_address_as_ipv4_mapped_ipv6",
  "normalize_path",
  "merge_slashes",
  "path_with_escaped_slashes_action",
  "strip_matching_host_port",
  "strip_port_mode.strip_any_host_port",
  "stream_error_on_invalid_http_message",
  "strip_trailing_host_dot",
  "append_x_forwarded_port",
  "append_local_overload",
  "add_proxy_protocol_connection_state"
];

export const HttpConnectionManager_UpgradeConfig: OutType = { "HttpConnectionManager_UpgradeConfig": [
  {
    "name": "upgrade_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The case-insensitive name of this upgrade, e.g. \"websocket\". For each upgrade type present in upgrade_configs, requests with Upgrade: [upgrade_type] will be proxied upstream.",
    "notImp": false
  },
  {
    "name": "filters",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HttpFilter[]",
    "enums": null,
    "comment": "If present, this represents the filter chain which will be created for this type of upgrade. If no filters are present, the filter chain for HTTP connections will be used for this upgrade type.",
    "notImp": false
  },
  {
    "name": "enabled",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Determines if upgrades are enabled or disabled by default. Defaults to true. This can be overridden on a per-route basis with `cluster` as documented in the `upgrade documentation`.",
    "notImp": false
  }
] };

export const HttpConnectionManager_UpgradeConfig_SingleFields = [
  "upgrade_type",
  "enabled"
];

export const ResponseMapper: OutType = { "ResponseMapper": [
  {
    "name": "filter",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "AccessLogFilter",
    "enums": null,
    "comment": "Filter to determine if this mapper should apply.",
    "notImp": false
  },
  {
    "name": "status_code",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The new response status code if specified.",
    "notImp": false
  },
  {
    "name": "body",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DataSource",
    "enums": null,
    "comment": "The new local reply body text if specified. It will be used in the ``%LOCAL_REPLY_BODY%`` command operator in the ``body_format``.",
    "notImp": false
  },
  {
    "name": "body_format_override",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SubstitutionFormatString",
    "enums": null,
    "comment": "A per mapper ``body_format`` to override the `body_format`. It will be used when this mapper is matched.",
    "notImp": false
  },
  {
    "name": "headers_to_add",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderValueOption[]",
    "enums": null,
    "comment": "HTTP headers to add to a local reply. This allows the response mapper to append, to add or to override headers of any local reply before it is sent to a downstream client.",
    "notImp": false
  }
] };

export const ResponseMapper_SingleFields = [
  "status_code"
];

export const Rds: OutType = { "Rds": [
  {
    "name": "config_source",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ConfigSource",
    "enums": null,
    "comment": "Configuration source specifier for RDS.",
    "notImp": false
  },
  {
    "name": "route_config_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the route configuration. This name will be passed to the RDS API. This allows an Envoy configuration with multiple HTTP listeners (and associated HTTP connection manager filters) to use different route configurations.",
    "notImp": false
  }
] };

export const Rds_SingleFields = [
  "route_config_name"
];

export const ScopedRouteConfigurationsList: OutType = { "ScopedRouteConfigurationsList": [
  {
    "name": "scoped_route_configurations",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ScopedRouteConfiguration[]",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const ScopedRoutes_ScopeKeyBuilder: OutType = { "ScopedRoutes_ScopeKeyBuilder": [
  {
    "name": "fragments",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ScopedRoutes_ScopeKeyBuilder_FragmentBuilder[]",
    "enums": null,
    "comment": "The final(built) scope key consists of the ordered union of these fragments, which are compared in order with the fragments of a `ScopedRouteConfiguration`. A missing fragment during comparison will make the key invalid, i.e., the computed key doesn't match any key.",
    "notImp": false
  }
] };

export const ScopedRoutes: OutType = { "ScopedRoutes": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name assigned to the scoped routing configuration.",
    "notImp": false
  },
  {
    "name": "scope_key_builder",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ScopedRoutes_ScopeKeyBuilder",
    "enums": null,
    "comment": "The algorithm to use for constructing a scope key for each request.",
    "notImp": false
  },
  {
    "name": "rds_config_source",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ConfigSource",
    "enums": null,
    "comment": "Configuration source specifier for RDS. This config source is used to subscribe to RouteConfiguration resources specified in ScopedRouteConfiguration messages.",
    "notImp": false
  },
  {
    "name": "config_specifier.scoped_route_configurations_list",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "ScopedRouteConfigurationsList",
    "enums": null,
    "comment": "The set of routing scopes corresponding to the HCM. A scope is assigned to a request by matching a key constructed from the request's attributes according to the algorithm specified by the `ScopeKeyBuilder` in this message.",
    "notImp": false
  },
  {
    "name": "config_specifier.scoped_rds",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "ScopedRds",
    "enums": null,
    "comment": "The set of routing scopes associated with the HCM will be dynamically loaded via the SRDS API. A scope is assigned to a request by matching a key constructed from the request's attributes according to the algorithm specified by the `ScopeKeyBuilder` in this message.",
    "notImp": false
  }
] };

export const ScopedRoutes_SingleFields = [
  "name"
];

export const ScopedRoutes_ScopeKeyBuilder_FragmentBuilder: OutType = { "ScopedRoutes_ScopeKeyBuilder_FragmentBuilder": [
  {
    "name": "type.header_value_extractor",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "ScopedRoutes_ScopeKeyBuilder_FragmentBuilder_HeaderValueExtractor",
    "enums": null,
    "comment": "Specifies how a header field's value should be extracted.",
    "notImp": false
  }
] };

export const ScopedRoutes_ScopeKeyBuilder_FragmentBuilder_HeaderValueExtractor: OutType = { "ScopedRoutes_ScopeKeyBuilder_FragmentBuilder_HeaderValueExtractor": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the header field to extract the value from.\n\n:::note\n\nIf the header appears multiple times only the first value is used.",
    "notImp": false
  },
  {
    "name": "element_separator",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The element separator (e.g., ';' separates 'a;b;c;d'). Default: empty string. This causes the entirety of the header field to be extracted. If this field is set to an empty string and 'index' is used in the oneof below, 'index' must be set to 0.",
    "notImp": false
  },
  {
    "name": "extract_type.index",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Specifies the zero based index of the element to extract. Note Envoy concatenates multiple values of the same header key into a comma separated string, the splitting always happens after the concatenation.",
    "notImp": false
  },
  {
    "name": "extract_type.element",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "ScopedRoutes_ScopeKeyBuilder_FragmentBuilder_HeaderValueExtractor_KvElement",
    "enums": null,
    "comment": "Specifies the key value pair to extract the value from.",
    "notImp": false
  }
] };

export const ScopedRoutes_ScopeKeyBuilder_FragmentBuilder_HeaderValueExtractor_SingleFields = [
  "name",
  "element_separator",
  "extract_type.index"
];

export const ScopedRoutes_ScopeKeyBuilder_FragmentBuilder_HeaderValueExtractor_KvElement: OutType = { "ScopedRoutes_ScopeKeyBuilder_FragmentBuilder_HeaderValueExtractor_KvElement": [
  {
    "name": "separator",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The separator between key and value (e.g., '=' separates 'k=v;...'). If an element is an empty string, the element is ignored. If an element contains no separator, the whole element is parsed as key and the fragment value is an empty string. If there are multiple values for a matched key, the first value is returned.",
    "notImp": false
  },
  {
    "name": "key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The key to match on.",
    "notImp": false
  }
] };

export const ScopedRoutes_ScopeKeyBuilder_FragmentBuilder_HeaderValueExtractor_KvElement_SingleFields = [
  "separator",
  "key"
];

export const ScopedRds: OutType = { "ScopedRds": [
  {
    "name": "scoped_rds_config_source",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ConfigSource",
    "enums": null,
    "comment": "Configuration source specifier for scoped RDS.",
    "notImp": false
  },
  {
    "name": "srds_resources_locator",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "xdstp:// resource locator for scoped RDS collection. [#not-implemented-hide:]",
    "notImp": true
  }
] };

export const ScopedRds_SingleFields = [
  "srds_resources_locator"
];

export const HttpFilter: OutType = { "HttpFilter": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the filter configuration. It also serves as a resource name in ExtensionConfigDS.",
    "notImp": false
  },
  {
    "name": "config_type.typed_config",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "Filter specific configuration which depends on the filter being instantiated. See the supported filters for further documentation.\n\nTo support configuring a `match tree`, use an `ExtensionWithMatcher` with the desired HTTP filter. extension-category: envoy.filters.http",
    "notImp": false
  },
  {
    "name": "config_type.config_discovery",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "ExtensionConfigSource",
    "enums": null,
    "comment": "Configuration source specifier for an extension configuration discovery service. In case of a failure and without the default configuration, the HTTP listener responds with code 500. Extension configs delivered through this mechanism are not expected to require warming (see https://github.com/envoyproxy/envoy/issues/12061).\n\nTo support configuring a `match tree`, use an `ExtensionWithMatcher` with the desired HTTP filter. This works for both the default filter configuration as well as for filters provided via the API.",
    "notImp": false
  },
  {
    "name": "is_optional",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, clients that do not support this filter may ignore the filter but otherwise accept the config. Otherwise, clients that do not support this filter must reject the config.",
    "notImp": false
  },
  {
    "name": "disabled",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, the filter is disabled by default and must be explicitly enabled by setting per filter configuration in the route configuration. See `route based filter chain` for more details.\n\nTerminal filters (e.g. ``envoy.filters.http.router``) cannot be marked as disabled.",
    "notImp": false
  }
] };

export const HttpFilter_SingleFields = [
  "name",
  "is_optional",
  "disabled"
];

export const EnvoyMobileHttpConnectionManager: OutType = { "EnvoyMobileHttpConnectionManager": [
  {
    "name": "config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HttpConnectionManager",
    "enums": null,
    "comment": "The configuration for the underlying HttpConnectionManager which will be instantiated for Envoy mobile.",
    "notImp": false
  }
] };