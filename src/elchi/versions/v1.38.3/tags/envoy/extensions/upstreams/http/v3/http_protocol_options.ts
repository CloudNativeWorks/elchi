import {OutType} from '@elchi/tags/tagsType';


export const HttpProtocolOptions_OutlierDetection: OutType = { "HttpProtocolOptions_OutlierDetection": [
  {
    "name": "error_matcher",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "MatchPredicate",
    "enums": null,
    "comment": "If specified, only responses matching the matcher will be treated by outlier detection as errors. If not specified, only 5xx codes are treated by outlier detection as errors.",
    "notImp": false
  }
] };

export const HttpProtocolOptions: OutType = { "HttpProtocolOptions": [
  {
    "name": "common_http_protocol_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HttpProtocolOptions",
    "enums": null,
    "comment": "This contains options common across HTTP/1 and HTTP/2",
    "notImp": false
  },
  {
    "name": "upstream_http_protocol_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "UpstreamHttpProtocolOptions",
    "enums": null,
    "comment": "This contains common protocol options which are only applied upstream.",
    "notImp": false
  },
  {
    "name": "upstream_protocol_options.explicit_http_config",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HttpProtocolOptions_ExplicitHttpConfig",
    "enums": null,
    "comment": "HttpProtocolOptions specifies Http upstream protocol options. This object is used in `typed_extension_protocol_options`, keyed by the name ``envoy.extensions.upstreams.http.v3.HttpProtocolOptions``.\n\nThis controls what protocol(s) should be used for upstream and how said protocol(s) are configured.\n\nThis replaces the prior pattern of explicit protocol configuration directly in the cluster. So a configuration like this, explicitly configuring the use of HTTP/2 upstream:\n\n.. code::\n\n  clusters: - name: some_service connect_timeout: 5s upstream_http_protocol_options: auto_sni: true common_http_protocol_options: idle_timeout: 1s http2_protocol_options: max_concurrent_streams: 100 .... [further cluster config]\n\nWould now look like this:\n\n.. code::\n\n  clusters: - name: some_service connect_timeout: 5s typed_extension_protocol_options: envoy.extensions.upstreams.http.v3.HttpProtocolOptions: \"@type\": type.googleapis.com/envoy.extensions.upstreams.http.v3.HttpProtocolOptions upstream_http_protocol_options: auto_sni: true common_http_protocol_options: idle_timeout: 1s explicit_http_config: http2_protocol_options: max_concurrent_streams: 100 .... [further cluster config] [#next-free-field: 12]",
    "notImp": false
  },
  {
    "name": "upstream_protocol_options.use_downstream_protocol_config",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HttpProtocolOptions_UseDownstreamHttpConfig",
    "enums": null,
    "comment": "HttpProtocolOptions specifies Http upstream protocol options. This object is used in `typed_extension_protocol_options`, keyed by the name ``envoy.extensions.upstreams.http.v3.HttpProtocolOptions``.\n\nThis controls what protocol(s) should be used for upstream and how said protocol(s) are configured.\n\nThis replaces the prior pattern of explicit protocol configuration directly in the cluster. So a configuration like this, explicitly configuring the use of HTTP/2 upstream:\n\n.. code::\n\n  clusters: - name: some_service connect_timeout: 5s upstream_http_protocol_options: auto_sni: true common_http_protocol_options: idle_timeout: 1s http2_protocol_options: max_concurrent_streams: 100 .... [further cluster config]\n\nWould now look like this:\n\n.. code::\n\n  clusters: - name: some_service connect_timeout: 5s typed_extension_protocol_options: envoy.extensions.upstreams.http.v3.HttpProtocolOptions: \"@type\": type.googleapis.com/envoy.extensions.upstreams.http.v3.HttpProtocolOptions upstream_http_protocol_options: auto_sni: true common_http_protocol_options: idle_timeout: 1s explicit_http_config: http2_protocol_options: max_concurrent_streams: 100 .... [further cluster config] [#next-free-field: 12]",
    "notImp": false
  },
  {
    "name": "upstream_protocol_options.auto_config",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HttpProtocolOptions_AutoHttpConfig",
    "enums": null,
    "comment": "HttpProtocolOptions specifies Http upstream protocol options. This object is used in `typed_extension_protocol_options`, keyed by the name ``envoy.extensions.upstreams.http.v3.HttpProtocolOptions``.\n\nThis controls what protocol(s) should be used for upstream and how said protocol(s) are configured.\n\nThis replaces the prior pattern of explicit protocol configuration directly in the cluster. So a configuration like this, explicitly configuring the use of HTTP/2 upstream:\n\n.. code::\n\n  clusters: - name: some_service connect_timeout: 5s upstream_http_protocol_options: auto_sni: true common_http_protocol_options: idle_timeout: 1s http2_protocol_options: max_concurrent_streams: 100 .... [further cluster config]\n\nWould now look like this:\n\n.. code::\n\n  clusters: - name: some_service connect_timeout: 5s typed_extension_protocol_options: envoy.extensions.upstreams.http.v3.HttpProtocolOptions: \"@type\": type.googleapis.com/envoy.extensions.upstreams.http.v3.HttpProtocolOptions upstream_http_protocol_options: auto_sni: true common_http_protocol_options: idle_timeout: 1s explicit_http_config: http2_protocol_options: max_concurrent_streams: 100 .... [further cluster config] [#next-free-field: 12]",
    "notImp": false
  },
  {
    "name": "http_filters",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HttpFilter[]",
    "enums": null,
    "comment": "Optional HTTP filters for the upstream HTTP filter chain.\n\n:::note\nUpstream HTTP filters are currently in alpha. \n:::\n\nThese filters will be applied for all HTTP streams which flow through this cluster. Unlike downstream HTTP filters, they will *not* be applied to terminated CONNECT requests.\n\nIf using upstream HTTP filters, please be aware that local errors sent by upstream HTTP filters will not trigger retries, and local errors sent by upstream HTTP filters will count as a final response if hedging is configured. extension-category: envoy.filters.http.upstream",
    "notImp": false
  },
  {
    "name": "header_validation_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "Configuration options for Unified Header Validation (UHV). UHV is an extensible mechanism for checking validity of HTTP responses.\n\n Leaving this field unspecified, selects the default header validator ``envoy.http.header_validators.envoy_default``.\n\n[#not-implemented-hide:] extension-category: envoy.http.header_validators",
    "notImp": true
  },
  {
    "name": "outlier_detection",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HttpProtocolOptions_OutlierDetection",
    "enums": null,
    "comment": "Defines http specific outlier detection parameters.",
    "notImp": false
  },
  {
    "name": "request_mirror_policies",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RouteAction_RequestMirrorPolicy[]",
    "enums": null,
    "comment": "Specifies a list of HTTP-level mirroring policies for requests routed to this cluster. Cluster-level policies override route-level policies when they both are configured.\n\n:::note\n\nMirroring will not be triggered if the `primary cluster` does not exist.",
    "notImp": false
  },
  {
    "name": "hash_policy",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RouteAction_HashPolicy[]",
    "enums": null,
    "comment": "Specifies a list of hash policies for consistent hashing load balancing (e.g., Ring Hash or Maglev) for requests routed to this cluster. When configured, cluster-level policies override route-level policies. When not configured, route-level policies (if any) will be used.\n\nThis enables consistent routing to the same upstream host for all requests to a cluster, which is particularly useful for stateful services like caching, session management, or sticky routing requirements.\n\n:::note\n\nHash policies are only effective when the cluster is configured with a hash-based load balancing policy (e.g., `RING_HASH` or `MAGLEV`).",
    "notImp": false
  },
  {
    "name": "retry_policy",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RetryPolicy",
    "enums": null,
    "comment": "Specifies the retry policy for requests routed to this cluster. When configured, cluster-level retry policy overrides route-level retry policy. When not configured, route-level retry policy (if any) will be used.\n\n:::note\n\nCluster-level retry policy will override route-level retry policy entirely. Policies are not merged.",
    "notImp": false
  }
] };

export const HttpProtocolOptions_ExplicitHttpConfig: OutType = { "HttpProtocolOptions_ExplicitHttpConfig": [
  {
    "name": "protocol_config.http_protocol_options",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Http1ProtocolOptions",
    "enums": null,
    "comment": "If this is used, the cluster will only operate on one of the possible upstream protocols. Note that HTTP/2 or above should generally be used for upstream gRPC clusters.",
    "notImp": false
  },
  {
    "name": "protocol_config.http2_protocol_options",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Http2ProtocolOptions",
    "enums": null,
    "comment": "If this is used, the cluster will only operate on one of the possible upstream protocols. Note that HTTP/2 or above should generally be used for upstream gRPC clusters.",
    "notImp": false
  },
  {
    "name": "protocol_config.http3_protocol_options",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Http3ProtocolOptions",
    "enums": null,
    "comment": "If this is used, the cluster will only operate on one of the possible upstream protocols. Note that HTTP/2 or above should generally be used for upstream gRPC clusters.",
    "notImp": false
  }
] };

export const HttpProtocolOptions_UseDownstreamHttpConfig: OutType = { "HttpProtocolOptions_UseDownstreamHttpConfig": [
  {
    "name": "http_protocol_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Http1ProtocolOptions",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "http2_protocol_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Http2ProtocolOptions",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "http3_protocol_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Http3ProtocolOptions",
    "enums": null,
    "comment": ":::warning\nQUIC upstream support is currently not ready for internet use. Please see `here` for details.",
    "notImp": false
  }
] };

export const HttpProtocolOptions_AutoHttpConfig: OutType = { "HttpProtocolOptions_AutoHttpConfig": [
  {
    "name": "http_protocol_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Http1ProtocolOptions",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "http2_protocol_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Http2ProtocolOptions",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "http3_protocol_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Http3ProtocolOptions",
    "enums": null,
    "comment": "Unlike HTTP/1 and HTTP/2, HTTP/3 will not be configured unless it is present, and (soon) only if there is an indication of server side support. See `here` for more information on when HTTP/3 will be used, and when Envoy will fail over to TCP.\n\n:::warning\nQUIC upstream support is currently not ready for internet use. Please see `here` for details.",
    "notImp": false
  },
  {
    "name": "alternate_protocols_cache_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "AlternateProtocolsCacheOptions",
    "enums": null,
    "comment": "The presence of alternate protocols cache options causes the use of the alternate protocols cache, which is responsible for parsing and caching HTTP Alt-Svc headers. This enables the use of HTTP/3 for origins that advertise supporting it.\n\n:::note\nThis is required when HTTP/3 is enabled.",
    "notImp": false
  }
] };