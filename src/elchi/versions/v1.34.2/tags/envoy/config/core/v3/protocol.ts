import {OutType} from '@elchi/tags/tagsType';


export const QuicKeepAliveSettings: OutType = { "QuicKeepAliveSettings": [
  {
    "name": "max_interval",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The max interval for a connection to send keep-alive probing packets (with PING or PATH_RESPONSE). The value should be smaller than `connection idle_timeout` to prevent idle timeout while not less than 1s to avoid throttling the connection or flooding the peer with probes.\n\nIf `initial_interval` is absent or zero, a client connection will use this value to start probing.\n\nIf zero, disable keepalive probing. If absent, use the QUICHE default interval to probe.",
    "notImp": false
  },
  {
    "name": "initial_interval",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The interval to send the first few keep-alive probing packets to prevent connection from hitting the idle timeout. Subsequent probes will be sent, each one with an interval exponentially longer than previous one, till it reaches `max_interval`. And the probes afterwards will always use `max_interval`.\n\nThe value should be smaller than `connection idle_timeout` to prevent idle timeout and smaller than max_interval to take effect.\n\nIf absent, disable keepalive probing for a server connection. For a client connection, if `max_interval` is zero, do not keepalive, otherwise use max_interval or QUICHE default to probe all the time.",
    "notImp": false
  }
] };

export const QuicKeepAliveSettings_SingleFields = [
  "max_interval",
  "initial_interval"
];

export const QuicProtocolOptions: OutType = { "QuicProtocolOptions": [
  {
    "name": "max_concurrent_streams",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Maximum number of streams that the client can negotiate per connection. 100 if not specified.",
    "notImp": false
  },
  {
    "name": "initial_stream_window_size",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "`Initial stream-level flow-control receive window <https://tools.ietf.org/html/draft-ietf-quic-transport-34#section-4.1>`_ size. Valid values range from 1 to 16777216 (2^24, maximum supported by QUICHE) and defaults to 16777216 (16 * 1024 * 1024).\n\nNOTE: 16384 (2^14) is the minimum window size supported in Google QUIC. If configured smaller than it, we will use 16384 instead. QUICHE IETF Quic implementation supports 1 bytes window. We only support increasing the default window size now, so it's also the minimum.\n\nThis field also acts as a soft limit on the number of bytes Envoy will buffer per-stream in the QUIC stream send and receive buffers. Once the buffer reaches this pointer, watermark callbacks will fire to stop the flow of data to the stream buffers.",
    "notImp": false
  },
  {
    "name": "initial_connection_window_size",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Similar to ``initial_stream_window_size``, but for connection-level flow-control. Valid values rage from 1 to 25165824 (24MB, maximum supported by QUICHE) and defaults to 25165824 (24 * 1024 * 1024).\n\nNOTE: 16384 (2^14) is the minimum window size supported in Google QUIC. We only support increasing the default window size now, so it's also the minimum.",
    "notImp": false
  },
  {
    "name": "num_timeouts_to_trigger_port_migration",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The number of timeouts that can occur before port migration is triggered for QUIC clients. This defaults to 4. If set to 0, port migration will not occur on path degrading. Timeout here refers to QUIC internal path degrading timeout mechanism, such as PTO. This has no effect on server sessions.",
    "notImp": false
  },
  {
    "name": "connection_keepalive",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "QuicKeepAliveSettings",
    "enums": null,
    "comment": "Probes the peer at the configured interval to solicit traffic, i.e. ACK or PATH_RESPONSE, from the peer to push back connection idle timeout. If absent, use the default keepalive behavior of which a client connection sends PINGs every 15s, and a server connection doesn't do anything.",
    "notImp": false
  },
  {
    "name": "connection_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "A comma-separated list of strings representing QUIC connection options defined in `QUICHE <https://github.com/google/quiche/blob/main/quiche/quic/core/crypto/crypto_protocol.h>`_ and to be sent by upstream connections.",
    "notImp": false
  },
  {
    "name": "client_connection_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "A comma-separated list of strings representing QUIC client connection options defined in `QUICHE <https://github.com/google/quiche/blob/main/quiche/quic/core/crypto/crypto_protocol.h>`_ and to be sent by upstream connections.",
    "notImp": false
  },
  {
    "name": "idle_network_timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The duration that a QUIC connection stays idle before it closes itself. If this field is not present, QUICHE default 600s will be applied. For internal corporate network, a long timeout is often fine. But for client facing network, 30s is usually a good choice.",
    "notImp": false
  },
  {
    "name": "max_packet_length",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Maximum packet length for QUIC connections. It refers to the largest size of a QUIC packet that can be transmitted over the connection. If not specified, one of the `default values in QUICHE <https://github.com/google/quiche/blob/main/quiche/quic/core/quic_constants.h>`_ is used.",
    "notImp": false
  }
] };

export const QuicProtocolOptions_SingleFields = [
  "max_concurrent_streams",
  "initial_stream_window_size",
  "initial_connection_window_size",
  "num_timeouts_to_trigger_port_migration",
  "connection_options",
  "client_connection_options",
  "idle_network_timeout",
  "max_packet_length"
];

export const UpstreamHttpProtocolOptions: OutType = { "UpstreamHttpProtocolOptions": [
  {
    "name": "auto_sni",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Set transport socket `SNI <https://en.wikipedia.org/wiki/Server_Name_Indication>`_ for new upstream connections based on the downstream HTTP host/authority header or any other arbitrary header when `override_auto_sni_header` is set, as seen by the `router filter`. Does nothing if a filter before the http router filter sets the corresponding metadata.\n\nSee `SNI configuration` for details on how this interacts with other validation options.",
    "notImp": false
  },
  {
    "name": "auto_san_validation",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Automatic validate upstream presented certificate for new upstream connections based on the downstream HTTP host/authority header or any other arbitrary header when `override_auto_sni_header` is set, as seen by the `router filter`. This field is intended to be set with ``auto_sni`` field. Does nothing if a filter before the http router filter sets the corresponding metadata.\n\nSee `validation configuration` for how this interacts with other validation options.",
    "notImp": false
  },
  {
    "name": "override_auto_sni_header",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "An optional alternative to the host/authority header to be used for setting the SNI value. It should be a valid downstream HTTP header, as seen by the `router filter`. If unset, host/authority header will be used for populating the SNI. If the specified header is not found or the value is empty, host/authority header will be used instead. This field is intended to be set with ``auto_sni`` and/or ``auto_san_validation`` fields. If none of these fields are set then setting this would be a no-op. Does nothing if a filter before the http router filter sets the corresponding metadata.",
    "notImp": false
  }
] };

export const UpstreamHttpProtocolOptions_SingleFields = [
  "auto_sni",
  "auto_san_validation",
  "override_auto_sni_header"
];

export const AlternateProtocolsCacheOptions: OutType = { "AlternateProtocolsCacheOptions": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the cache. Multiple named caches allow independent alternate protocols cache configurations to operate within a single Envoy process using different configurations. All alternate protocols cache options with the same name *must* be equal in all fields when referenced from different configuration components. Configuration will fail to load if this is not the case.",
    "notImp": false
  },
  {
    "name": "max_entries",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The maximum number of entries that the cache will hold. If not specified defaults to 1024.\n\n.. note:\n\n  The implementation is approximate and enforced independently on each worker thread, thus it is possible for the maximum entries in the cache to go slightly above the configured value depending on timing. This is similar to how other circuit breakers work.",
    "notImp": false
  },
  {
    "name": "key_value_store_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "Allows configuring a persistent `key value store` to flush alternate protocols entries to disk. This function is currently only supported if concurrency is 1 Cached entries will take precedence over pre-populated entries below.",
    "notImp": false
  },
  {
    "name": "prepopulated_entries",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "AlternateProtocolsCacheOptions_AlternateProtocolsCacheEntry[]",
    "enums": null,
    "comment": "Allows pre-populating the cache with entries, as described above.",
    "notImp": false
  },
  {
    "name": "canonical_suffixes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Optional list of hostnames suffixes for which Alt-Svc entries can be shared. For example, if this list contained the value ``.c.example.com``, then an Alt-Svc entry for ``foo.c.example.com`` could be shared with ``bar.c.example.com`` but would not be shared with ``baz.example.com``. On the other hand, if the list contained the value ``.example.com`` then all three hosts could share Alt-Svc entries. Each entry must start with ``.``. If a hostname matches multiple suffixes, the first listed suffix will be used.\n\nSince lookup in this list is O(n), it is recommended that the number of suffixes be limited. [#not-implemented-hide:]",
    "notImp": true
  }
] };

export const AlternateProtocolsCacheOptions_SingleFields = [
  "name",
  "max_entries",
  "canonical_suffixes"
];

export const AlternateProtocolsCacheOptions_AlternateProtocolsCacheEntry: OutType = { "AlternateProtocolsCacheOptions_AlternateProtocolsCacheEntry": [
  {
    "name": "hostname",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The host name for the alternate protocol entry.",
    "notImp": false
  },
  {
    "name": "port",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The port for the alternate protocol entry.",
    "notImp": false
  }
] };

export const AlternateProtocolsCacheOptions_AlternateProtocolsCacheEntry_SingleFields = [
  "hostname",
  "port"
];

export const HttpProtocolOptions: OutType = { "HttpProtocolOptions": [
  {
    "name": "idle_timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The idle timeout for connections. The idle timeout is defined as the period in which there are no active requests. When the idle timeout is reached the connection will be closed. If the connection is an HTTP/2 downstream connection a drain sequence will occur prior to closing the connection, see `drain_timeout`. Note that request based timeouts mean that HTTP/2 PINGs will not keep the connection alive. If not specified, this defaults to 1 hour. To disable idle timeouts explicitly set this to 0.\n\n:::warning\nDisabling this timeout has a highly likelihood of yielding connection leaks due to lost TCP FIN packets, etc. \n:::\n\nIf the `overload action` \"envoy.overload_actions.reduce_timeouts\" is configured, this timeout is scaled for downstream connections according to the value for `HTTP_DOWNSTREAM_CONNECTION_IDLE`.",
    "notImp": false
  },
  {
    "name": "max_connection_duration",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The maximum duration of a connection. The duration is defined as a period since a connection was established. If not set, there is no max duration. When max_connection_duration is reached, the drain sequence will kick-in. The connection will be closed after the drain timeout period if there are no active streams. See `drain_timeout`.",
    "notImp": false
  },
  {
    "name": "max_headers_count",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The maximum number of headers (request headers if configured on HttpConnectionManager, response headers when configured on a cluster). If unconfigured, the default maximum number of headers allowed is 100. The default value for requests can be overridden by setting runtime key ``envoy.reloadable_features.max_request_headers_count``. The default value for responses can be overridden by setting runtime key ``envoy.reloadable_features.max_response_headers_count``. Downstream requests that exceed this limit will receive a 431 response for HTTP/1.x and cause a stream reset for HTTP/2. Upstream responses that exceed this limit will result in a 503 response.",
    "notImp": false
  },
  {
    "name": "max_response_headers_kb",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The maximum size of response headers. If unconfigured, the default is 60 KiB, except for HTTP/1 response headers which have a default of 80KiB. The default value can be overridden by setting runtime key ``envoy.reloadable_features.max_response_headers_size_kb``. Responses that exceed this limit will result in a 503 response. In Envoy, this setting is only valid when configured on an upstream cluster, not on the `HTTP Connection Manager`.\n\nNote: currently some protocol codecs impose limits on the maximum size of a single header: HTTP/2 (when using nghttp2) limits a single header to around 100kb. HTTP/3 limits a single header to around 1024kb.",
    "notImp": false
  },
  {
    "name": "max_stream_duration",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Total duration to keep alive an HTTP request/response stream. If the time limit is reached the stream will be reset independent of any other timeouts. If not specified, this value is not set.",
    "notImp": false
  },
  {
    "name": "headers_with_underscores_action",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HttpProtocolOptions_HeadersWithUnderscoresAction",
    "enums": [
      "ALLOW",
      "REJECT_REQUEST",
      "DROP_HEADER"
    ],
    "comment": "Action to take when a client request with a header name containing underscore characters is received. If this setting is not specified, the value defaults to ALLOW. Note: upstream responses are not affected by this setting. Note: this only affects client headers. It does not affect headers added by Envoy filters and does not have any impact if added to cluster config.",
    "notImp": false
  },
  {
    "name": "max_requests_per_connection",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Optional maximum requests for both upstream and downstream connections. If not specified, there is no limit. Setting this parameter to 1 will effectively disable keep alive. For HTTP/2 and HTTP/3, due to concurrent stream processing, the limit is approximate.",
    "notImp": false
  }
] };

export const HttpProtocolOptions_SingleFields = [
  "idle_timeout",
  "max_connection_duration",
  "max_headers_count",
  "max_response_headers_kb",
  "max_stream_duration",
  "headers_with_underscores_action",
  "max_requests_per_connection"
];

export const Http1ProtocolOptions_HeaderKeyFormat: OutType = { "Http1ProtocolOptions_HeaderKeyFormat": [
  {
    "name": "header_format.proper_case_words",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Http1ProtocolOptions_HeaderKeyFormat_ProperCaseWords",
    "enums": null,
    "comment": "Formats the header by proper casing words: the first character and any character following a special character will be capitalized if it's an alpha character. For example, \"content-type\" becomes \"Content-Type\", and \"foo$b#$are\" becomes \"Foo$B#$Are\". Note that while this results in most headers following conventional casing, certain headers are not covered. For example, the \"TE\" header will be formatted as \"Te\".",
    "notImp": false
  },
  {
    "name": "header_format.stateful_formatter",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "Configuration for stateful formatter extensions that allow using received headers to affect the output of encoding headers. E.g., preserving case during proxying. extension-category: envoy.http.stateful_header_formatters",
    "notImp": false
  }
] };

export const Http1ProtocolOptions: OutType = { "Http1ProtocolOptions": [
  {
    "name": "allow_absolute_url",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Handle HTTP requests with absolute URLs in the requests. These requests are generally sent by clients to forward/explicit proxies. This allows clients to configure envoy as their HTTP proxy. In Unix, for example, this is typically done by setting the ``http_proxy`` environment variable.",
    "notImp": false
  },
  {
    "name": "accept_http_10",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Handle incoming HTTP/1.0 and HTTP 0.9 requests. This is off by default, and not fully standards compliant. There is support for pre-HTTP/1.1 style connect logic, dechunking, and handling lack of client host iff ``default_host_for_http_10`` is configured.",
    "notImp": false
  },
  {
    "name": "default_host_for_http_10",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "A default host for HTTP/1.0 requests. This is highly suggested if ``accept_http_10`` is true as Envoy does not otherwise support HTTP/1.0 without a Host header. This is a no-op if ``accept_http_10`` is not true.",
    "notImp": false
  },
  {
    "name": "header_key_format",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Http1ProtocolOptions_HeaderKeyFormat",
    "enums": null,
    "comment": "Describes how the keys for response headers should be formatted. By default, all header keys are lower cased.",
    "notImp": false
  },
  {
    "name": "enable_trailers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Enables trailers for HTTP/1. By default the HTTP/1 codec drops proxied trailers.\n\n:::attention\n\nNote that this only happens when Envoy is chunk encoding which occurs when: - The request is HTTP/1.1. - Is neither a HEAD only request nor a HTTP Upgrade. - Not a response to a HEAD request. - The content length header is not present.",
    "notImp": false
  },
  {
    "name": "allow_chunked_length",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Allows Envoy to process requests/responses with both ``Content-Length`` and ``Transfer-Encoding`` headers set. By default such messages are rejected, but if option is enabled - Envoy will remove Content-Length header and process message. See `RFC7230, sec. 3.3.3 <https://tools.ietf.org/html/rfc7230#section-3.3.3>`_ for details.\n\n:::attention\nEnabling this option might lead to request smuggling vulnerability, especially if traffic is proxied via multiple layers of proxies.",
    "notImp": false
  },
  {
    "name": "override_stream_error_on_invalid_http_message",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Allows invalid HTTP messaging. When this option is false, then Envoy will terminate HTTP/1.1 connections upon receiving an invalid HTTP message. However, when this option is true, then Envoy will leave the HTTP/1.1 connection open where possible. If set, this overrides any HCM `stream_error_on_invalid_http_messaging`.",
    "notImp": false
  },
  {
    "name": "send_fully_qualified_url",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Allows sending fully qualified URLs when proxying the first line of the response. By default, Envoy will only send the path components in the first line. If this is true, Envoy will create a fully qualified URI composing scheme (inferred if not present), host (from the host/:authority header) and path (from first line or `:path` header).",
    "notImp": false
  },
  {
    "name": "use_balsa_parser",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "[#not-implemented-hide:] Hiding so that field can be removed after BalsaParser is rolled out. If set, force HTTP/1 parser: BalsaParser if true, http-parser if false. If unset, HTTP/1 parser is selected based on envoy.reloadable_features.http1_use_balsa_parser. See issue #21245.",
    "notImp": true
  },
  {
    "name": "allow_custom_methods",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "[#not-implemented-hide:] Hiding so that field can be removed. If true, and BalsaParser is used (either `use_balsa_parser` above is true, or `envoy.reloadable_features.http1_use_balsa_parser` is true and `use_balsa_parser` is unset), then every non-empty method with only valid characters is accepted. Otherwise, methods not on the hard-coded list are rejected. Once UHV is enabled, this field should be removed, and BalsaParser should allow any method. UHV validates the method, rejecting empty string or invalid characters, and provides `restrict_http_methods` to reject custom methods.",
    "notImp": true
  },
  {
    "name": "ignore_http_11_upgrade",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "StringMatcher[]",
    "enums": null,
    "comment": "Ignore HTTP/1.1 upgrade values matching any of the supplied matchers.\n\n:::note\n\n``h2c`` upgrades are always removed for backwards compatibility, regardless of the value in this setting.",
    "notImp": false
  }
] };

export const Http1ProtocolOptions_SingleFields = [
  "allow_absolute_url",
  "accept_http_10",
  "default_host_for_http_10",
  "enable_trailers",
  "allow_chunked_length",
  "override_stream_error_on_invalid_http_message",
  "send_fully_qualified_url",
  "use_balsa_parser",
  "allow_custom_methods"
];

export const KeepaliveSettings: OutType = { "KeepaliveSettings": [
  {
    "name": "interval",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Send HTTP/2 PING frames at this period, in order to test that the connection is still alive. If this is zero, interval PINGs will not be sent.",
    "notImp": false
  },
  {
    "name": "timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "How long to wait for a response to a keepalive PING. If a response is not received within this time period, the connection will be aborted. Note that in order to prevent the influence of Head-of-line (HOL) blocking the timeout period is extended when *any* frame is received on the connection, under the assumption that if a frame is received the connection is healthy.",
    "notImp": false
  },
  {
    "name": "interval_jitter",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Percent",
    "enums": null,
    "comment": "A random jitter amount as a percentage of interval that will be added to each interval. A value of zero means there will be no jitter. The default value is 15%.",
    "notImp": false
  },
  {
    "name": "connection_idle_interval",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "If the connection has been idle for this duration, send a HTTP/2 ping ahead of new stream creation, to quickly detect dead connections. If this is zero, this type of PING will not be sent. If an interval ping is outstanding, a second ping will not be sent as the interval ping will determine if the connection is dead.\n\nThe same feature for HTTP/3 is given by inheritance from QUICHE which uses `connection idle_timeout` and the current PTO of the connection to decide whether to probe before sending a new request.",
    "notImp": false
  }
] };

export const KeepaliveSettings_SingleFields = [
  "interval",
  "timeout",
  "connection_idle_interval"
];

export const Http2ProtocolOptions: OutType = { "Http2ProtocolOptions": [
  {
    "name": "hpack_table_size",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "`Maximum table size <https://httpwg.org/specs/rfc7541.html#rfc.section.4.2>`_ (in octets) that the encoder is permitted to use for the dynamic HPACK table. Valid values range from 0 to 4294967295 (2^32 - 1) and defaults to 4096. 0 effectively disables header compression.",
    "notImp": false
  },
  {
    "name": "max_concurrent_streams",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "`Maximum concurrent streams <https://httpwg.org/specs/rfc7540.html#rfc.section.5.1.2>`_ allowed for peer on one HTTP/2 connection. Valid values range from 1 to 2147483647 (2^31 - 1) and defaults to 2147483647.\n\nFor upstream connections, this also limits how many streams Envoy will initiate concurrently on a single connection. If the limit is reached, Envoy may queue requests or establish additional connections (as allowed per circuit breaker limits).\n\nThis acts as an upper bound: Envoy will lower the max concurrent streams allowed on a given connection based on upstream settings. Config dumps will reflect the configured upper bound, not the per-connection negotiated limits.",
    "notImp": false
  },
  {
    "name": "initial_stream_window_size",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "`Initial stream-level flow-control window <https://httpwg.org/specs/rfc7540.html#rfc.section.6.9.2>`_ size. Valid values range from 65535 (2^16 - 1, HTTP/2 default) to 2147483647 (2^31 - 1, HTTP/2 maximum) and defaults to 268435456 (256 * 1024 * 1024).\n\nNOTE: 65535 is the initial window size from HTTP/2 spec. We only support increasing the default window size now, so it's also the minimum.\n\nThis field also acts as a soft limit on the number of bytes Envoy will buffer per-stream in the HTTP/2 codec buffers. Once the buffer reaches this pointer, watermark callbacks will fire to stop the flow of data to the codec buffers.",
    "notImp": false
  },
  {
    "name": "initial_connection_window_size",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Similar to ``initial_stream_window_size``, but for connection-level flow-control window. Currently, this has the same minimum/maximum/default as ``initial_stream_window_size``.",
    "notImp": false
  },
  {
    "name": "allow_connect",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Allows proxying Websocket and other upgrades over H2 connect.",
    "notImp": false
  },
  {
    "name": "allow_metadata",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "[#not-implemented-hide:] Hiding until Envoy has full metadata support. Still under implementation. DO NOT USE.\n\nAllows sending and receiving HTTP/2 METADATA frames. See [metadata docs](https://github.com/envoyproxy/envoy/blob/main/source/docs/h2_metadata.md) for more information.",
    "notImp": true
  },
  {
    "name": "max_outbound_frames",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Limit the number of pending outbound downstream frames of all types (frames that are waiting to be written into the socket). Exceeding this limit triggers flood mitigation and connection is terminated. The ``http2.outbound_flood`` stat tracks the number of terminated connections due to flood mitigation. The default limit is 10000.",
    "notImp": false
  },
  {
    "name": "max_outbound_control_frames",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Limit the number of pending outbound downstream frames of types PING, SETTINGS and RST_STREAM, preventing high memory utilization when receiving continuous stream of these frames. Exceeding this limit triggers flood mitigation and connection is terminated. The ``http2.outbound_control_flood`` stat tracks the number of terminated connections due to flood mitigation. The default limit is 1000.",
    "notImp": false
  },
  {
    "name": "max_consecutive_inbound_frames_with_empty_payload",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Limit the number of consecutive inbound frames of types HEADERS, CONTINUATION and DATA with an empty payload and no end stream flag. Those frames have no legitimate use and are abusive, but might be a result of a broken HTTP/2 implementation. The `http2.inbound_empty_frames_flood`` stat tracks the number of connections terminated due to flood mitigation. Setting this to 0 will terminate connection upon receiving first frame with an empty payload and no end stream flag. The default limit is 1.",
    "notImp": false
  },
  {
    "name": "max_inbound_priority_frames_per_stream",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Limit the number of inbound PRIORITY frames allowed per each opened stream. If the number of PRIORITY frames received over the lifetime of connection exceeds the value calculated using this formula::\n\n  ``max_inbound_priority_frames_per_stream`` * (1 + ``opened_streams``)\n\nthe connection is terminated. For downstream connections the ``opened_streams`` is incremented when Envoy receives complete response headers from the upstream server. For upstream connection the ``opened_streams`` is incremented when Envoy send the HEADERS frame for a new stream. The ``http2.inbound_priority_frames_flood`` stat tracks the number of connections terminated due to flood mitigation. The default limit is 100.",
    "notImp": false
  },
  {
    "name": "max_inbound_window_update_frames_per_data_frame_sent",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Limit the number of inbound WINDOW_UPDATE frames allowed per DATA frame sent. If the number of WINDOW_UPDATE frames received over the lifetime of connection exceeds the value calculated using this formula::\n\n  5 + 2 * (``opened_streams`` + ``max_inbound_window_update_frames_per_data_frame_sent`` * ``outbound_data_frames``)\n\nthe connection is terminated. For downstream connections the ``opened_streams`` is incremented when Envoy receives complete response headers from the upstream server. For upstream connections the ``opened_streams`` is incremented when Envoy sends the HEADERS frame for a new stream. The ``http2.inbound_priority_frames_flood`` stat tracks the number of connections terminated due to flood mitigation. The default max_inbound_window_update_frames_per_data_frame_sent value is 10. Setting this to 1 should be enough to support HTTP/2 implementations with basic flow control, but more complex implementations that try to estimate available bandwidth require at least 2.",
    "notImp": false
  },
  {
    "name": "stream_error_on_invalid_http_messaging",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Allows invalid HTTP messaging and headers. When this option is disabled (default), then the whole HTTP/2 connection is terminated upon receiving invalid HEADERS frame. However, when this option is enabled, only the offending stream is terminated.\n\nThis is overridden by HCM `stream_error_on_invalid_http_messaging` iff present.\n\nThis is deprecated in favor of `override_stream_error_on_invalid_http_message`\n\nSee `RFC7540, sec. 8.1 <https://tools.ietf.org/html/rfc7540#section-8.1>`_ for details.",
    "notImp": false
  },
  {
    "name": "override_stream_error_on_invalid_http_message",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Allows invalid HTTP messaging and headers. When this option is disabled (default), then the whole HTTP/2 connection is terminated upon receiving invalid HEADERS frame. However, when this option is enabled, only the offending stream is terminated.\n\nThis overrides any HCM `stream_error_on_invalid_http_messaging`\n\nSee `RFC7540, sec. 8.1 <https://tools.ietf.org/html/rfc7540#section-8.1>`_ for details.",
    "notImp": false
  },
  {
    "name": "custom_settings_parameters",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Http2ProtocolOptions_SettingsParameter[]",
    "enums": null,
    "comment": "[#not-implemented-hide:] Specifies SETTINGS frame parameters to be sent to the peer, with two exceptions:\n\n1. SETTINGS_ENABLE_PUSH (0x2) is not configurable as HTTP/2 server push is not supported by Envoy.\n\n2. SETTINGS_ENABLE_CONNECT_PROTOCOL (0x8) is only configurable through the named field 'allow_connect'.\n\nNote that custom parameters specified through this field can not also be set in the corresponding named parameters:\n\n.. code-block:: text\n\n  ID    Field Name ---------------- 0x1   hpack_table_size 0x3   max_concurrent_streams 0x4   initial_stream_window_size\n\nCollisions will trigger config validation failure on load/update. Likewise, inconsistencies between custom parameters with the same identifier will trigger a failure.\n\nSee `IANA HTTP/2 Settings <https://www.iana.org/assignments/http2-parameters/http2-parameters.xhtml#settings>`_ for standardized identifiers.",
    "notImp": true
  },
  {
    "name": "connection_keepalive",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "KeepaliveSettings",
    "enums": null,
    "comment": "Send HTTP/2 PING frames to verify that the connection is still healthy. If the remote peer does not respond within the configured timeout, the connection will be aborted.",
    "notImp": false
  },
  {
    "name": "use_oghttp2_codec",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "[#not-implemented-hide:] Hiding so that the field can be removed after oghttp2 is rolled out. If set, force use of a particular HTTP/2 codec: oghttp2 if true, nghttp2 if false. If unset, HTTP/2 codec is selected based on envoy.reloadable_features.http2_use_oghttp2.",
    "notImp": true
  },
  {
    "name": "max_metadata_size",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Configure the maximum amount of metadata than can be handled per stream. Defaults to 1 MB.",
    "notImp": false
  }
] };

export const Http2ProtocolOptions_SingleFields = [
  "hpack_table_size",
  "max_concurrent_streams",
  "initial_stream_window_size",
  "initial_connection_window_size",
  "allow_connect",
  "allow_metadata",
  "max_outbound_frames",
  "max_outbound_control_frames",
  "max_consecutive_inbound_frames_with_empty_payload",
  "max_inbound_priority_frames_per_stream",
  "max_inbound_window_update_frames_per_data_frame_sent",
  "override_stream_error_on_invalid_http_message",
  "use_oghttp2_codec",
  "max_metadata_size"
];

export const Http2ProtocolOptions_SettingsParameter: OutType = { "Http2ProtocolOptions_SettingsParameter": [
  {
    "name": "identifier",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The 16 bit parameter identifier.",
    "notImp": false
  },
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The 32 bit parameter value.",
    "notImp": false
  }
] };

export const Http2ProtocolOptions_SettingsParameter_SingleFields = [
  "identifier",
  "value"
];

export const GrpcProtocolOptions: OutType = { "GrpcProtocolOptions": [
  {
    "name": "http2_protocol_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Http2ProtocolOptions",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const Http3ProtocolOptions: OutType = { "Http3ProtocolOptions": [
  {
    "name": "quic_protocol_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "QuicProtocolOptions",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "override_stream_error_on_invalid_http_message",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Allows invalid HTTP messaging and headers. When this option is disabled (default), then the whole HTTP/3 connection is terminated upon receiving invalid HEADERS frame. However, when this option is enabled, only the offending stream is terminated.\n\nIf set, this overrides any HCM `stream_error_on_invalid_http_messaging`.",
    "notImp": false
  },
  {
    "name": "allow_extended_connect",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Allows proxying Websocket and other upgrades over HTTP/3 CONNECT using the header mechanisms from the `HTTP/2 extended connect RFC <https://datatracker.ietf.org/doc/html/rfc8441>`_ and settings `proposed for HTTP/3 <https://datatracker.ietf.org/doc/draft-ietf-httpbis-h3-websockets/>`_ Note that HTTP/3 CONNECT is not yet an RFC.",
    "notImp": false
  },
  {
    "name": "allow_metadata",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "[#not-implemented-hide:] Hiding until Envoy has full metadata support. Still under implementation. DO NOT USE.\n\nAllows sending and receiving HTTP/3 METADATA frames. See [metadata docs](https://github.com/envoyproxy/envoy/blob/main/source/docs/h2_metadata.md) for more information.",
    "notImp": true
  },
  {
    "name": "disable_qpack",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "[#not-implemented-hide:] Hiding until Envoy has full HTTP/3 upstream support. Still under implementation. DO NOT USE.\n\nDisables QPACK compression related features for HTTP/3 including: No huffman encoding, zero dynamic table capacity and no cookie crumbing. This can be useful for trading off CPU vs bandwidth when an upstream HTTP/3 connection multiplexes multiple downstream connections.",
    "notImp": true
  }
] };

export const Http3ProtocolOptions_SingleFields = [
  "override_stream_error_on_invalid_http_message",
  "allow_extended_connect",
  "allow_metadata",
  "disable_qpack"
];

export const SchemeHeaderTransformation: OutType = { "SchemeHeaderTransformation": [
  {
    "name": "transformation.scheme_to_overwrite",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Overwrite any Scheme header with the contents of this string. If set, takes precedence over match_upstream.",
    "notImp": false
  },
  {
    "name": "match_upstream",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Set the Scheme header to match the upstream transport protocol. For example, should a request be sent to the upstream over TLS, the scheme header will be set to \"https\". Should the request be sent over plaintext, the scheme header will be set to \"http\". If scheme_to_overwrite is set, this field is not used.",
    "notImp": false
  }
] };

export const SchemeHeaderTransformation_SingleFields = [
  "transformation.scheme_to_overwrite",
  "match_upstream"
];