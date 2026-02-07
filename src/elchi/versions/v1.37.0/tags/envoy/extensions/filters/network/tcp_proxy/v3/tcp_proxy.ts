import {OutType} from '@elchi/tags/tagsType';


export const TcpProxy_OnDemand: OutType = { "TcpProxy_OnDemand": [
  {
    "name": "odcds_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ConfigSource",
    "enums": null,
    "comment": "Optional configuration for the on-demand cluster discovery service. If not specified, on-demand cluster discovery is disabled. When specified, the filter pauses a request to an unknown cluster and begins a cluster discovery process. When discovery completes (successfully or not), the request is resumed.",
    "notImp": false
  },
  {
    "name": "resources_locator",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "xdstp:// resource locator for on-demand cluster collection. [#not-implemented-hide:]",
    "notImp": true
  },
  {
    "name": "timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The timeout for on-demand cluster lookup. If the CDS cannot return the required cluster, the downstream request will be closed with the error code detail NO_CLUSTER_FOUND. [#not-implemented-hide:]",
    "notImp": true
  }
] };

export const TcpProxy_OnDemand_SingleFields = [
  "resources_locator",
  "timeout"
];

export const TcpProxy_TunnelingConfig: OutType = { "TcpProxy_TunnelingConfig": [
  {
    "name": "hostname",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The hostname to send in the synthesized CONNECT headers to the upstream proxy. This field evaluates command operators if present; otherwise, the value is used as-is.\n\nFor example, dynamically set the hostname using downstream SNI:\n\n```yaml\n\n   tunneling_config:\n     hostname: \"%REQUESTED_SERVER_NAME%:443\"\n```\n\nFor example, dynamically set the hostname using dynamic metadata:\n\n```yaml\n\n   tunneling_config:\n     hostname: \"%DYNAMIC_METADATA(tunnel:address)%\"",
    "notImp": false
  },
  {
    "name": "use_post",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Use the ``POST`` method instead of the ``CONNECT`` method to tunnel the TCP stream. The ``protocol: bytestream`` header is not set for HTTP/2 to comply with the specification.\n\nThe upstream proxy is expected to interpret the POST payload as raw TCP.",
    "notImp": false
  },
  {
    "name": "headers_to_add",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderValueOption[]",
    "enums": null,
    "comment": "Additional request headers to send to the upstream proxy. This is mainly used to trigger the upstream to convert POST requests back to CONNECT requests.\n\nNeither ``:``-prefixed pseudo-headers like ``:path`` nor the ``host`` header can be overridden.",
    "notImp": false
  },
  {
    "name": "propagate_response_headers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Save response headers to the downstream connection's filter state for consumption by network filters. The filter state key is ``envoy.tcp_proxy.propagate_response_headers``.",
    "notImp": false
  },
  {
    "name": "post_path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The path used with the POST method. The default path is ``/``. If this field is specified and `use_post field` is not set to true, the configuration will be rejected.",
    "notImp": false
  },
  {
    "name": "propagate_response_trailers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Save response trailers to the downstream connection's filter state for consumption by network filters. The filter state key is ``envoy.tcp_proxy.propagate_response_trailers``.",
    "notImp": false
  },
  {
    "name": "request_id_extension",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RequestIDExtension",
    "enums": null,
    "comment": "The configuration of the request ID extension used for generation, validation, and associated tracing operations when tunneling.\n\nIf this field is set, a request ID is generated using the specified extension. If this field is not set, no request ID is generated.\n\nWhen a request ID is generated, it is also stored in the downstream connection's dynamic metadata under the namespace ``envoy.filters.network.tcp_proxy`` with the key ``tunnel_request_id`` to allow emission from TCP proxy access logs via the ``%DYNAMIC_METADATA(envoy.filters.network.tcp_proxy:tunnel_request_id)%`` formatter. extension-category: envoy.request_id",
    "notImp": false
  },
  {
    "name": "request_id_header",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The request header name to use for emitting the generated request ID on the tunneling HTTP request.\n\nIf not specified or set to an empty string, the default header name ``x-request-id`` is used.\n\n:::note\nThis setting does not alter the internal request ID handling elsewhere in Envoy and only controls the header emitted on the tunneling request.",
    "notImp": false
  },
  {
    "name": "request_id_metadata_key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The dynamic metadata key to use when storing the generated request ID. The metadata is stored under the namespace ``envoy.filters.network.tcp_proxy``.\n\nIf not specified or set to an empty string, the default key ``tunnel_request_id`` is used. This enables customizing the key used by access log formatters such as ``%DYNAMIC_METADATA(envoy.filters.network.tcp_proxy:<key>)%``.",
    "notImp": false
  }
] };

export const TcpProxy_TunnelingConfig_SingleFields = [
  "hostname",
  "use_post",
  "propagate_response_headers",
  "post_path",
  "propagate_response_trailers",
  "request_id_header",
  "request_id_metadata_key"
];

export const TcpProxy_TcpAccessLogOptions: OutType = { "TcpProxy_TcpAccessLogOptions": [
  {
    "name": "access_log_flush_interval",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The interval for flushing access logs. By default, the TCP proxy flushes a single access log when the connection is closed. If this field is set, the TCP proxy flushes access logs periodically at the specified interval. The interval must be at least 1ms.",
    "notImp": false
  },
  {
    "name": "flush_access_log_on_connected",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set to true, the access log is flushed when the TCP proxy successfully establishes a connection with the upstream. If the connection fails, the access log is not flushed.",
    "notImp": false
  }
] };

export const TcpProxy_TcpAccessLogOptions_SingleFields = [
  "access_log_flush_interval",
  "flush_access_log_on_connected"
];

export const TcpProxy: OutType = { "TcpProxy": [
  {
    "name": "stat_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The prefix to use when emitting `statistics`.",
    "notImp": false
  },
  {
    "name": "cluster_specifier.cluster",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The upstream cluster to connect to.",
    "notImp": false
  },
  {
    "name": "cluster_specifier.weighted_clusters",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "TcpProxy_WeightedCluster",
    "enums": null,
    "comment": "Multiple upstream clusters can be specified. The request is routed to one of the upstream clusters based on the weights assigned to each cluster.",
    "notImp": false
  },
  {
    "name": "on_demand",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TcpProxy_OnDemand",
    "enums": null,
    "comment": "The on demand policy for the upstream cluster. It applies to both `TcpProxy.cluster` and `TcpProxy.weighted_clusters`.",
    "notImp": false
  },
  {
    "name": "metadata_match",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Metadata",
    "enums": null,
    "comment": "Optional endpoint metadata match criteria used by the subset load balancer. Only endpoints in the upstream cluster with metadata matching what is set in this field will be considered for load balancing. The filter name should be specified as ``envoy.lb``.",
    "notImp": false
  },
  {
    "name": "idle_timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The idle timeout for connections managed by the TCP proxy filter. The idle timeout is defined as the period in which there are no bytes sent or received on either the upstream or downstream connection. If not set, the default idle timeout is 1 hour. If set to ``0s``, the timeout is disabled. It is possible to dynamically override this configuration by setting a per-connection filter state object for the key ``envoy.tcp_proxy.per_connection_idle_timeout_ms``.\n\n:::warning\nDisabling this timeout is likely to yield connection leaks due to lost TCP FIN packets, etc.",
    "notImp": false
  },
  {
    "name": "downstream_idle_timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "[#not-implemented-hide:] The idle timeout for connections managed by the TCP proxy filter. The idle timeout is defined as the period in which there is no active traffic. If not set, there is no idle timeout. When the idle timeout is reached the connection will be closed. The distinction between downstream_idle_timeout/upstream_idle_timeout provides a means to set timeout based on the last byte sent on the downstream/upstream connection.",
    "notImp": true
  },
  {
    "name": "upstream_idle_timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "[#not-implemented-hide:]",
    "notImp": true
  },
  {
    "name": "access_log",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "AccessLog[]",
    "enums": null,
    "comment": "Configuration for `access logs` emitted by this TCP proxy.",
    "notImp": false
  },
  {
    "name": "max_connect_attempts",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The maximum number of unsuccessful connection attempts that will be made before giving up. If the parameter is not specified, 1 connection attempt will be made.",
    "notImp": false
  },
  {
    "name": "backoff_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "BackoffStrategy",
    "enums": null,
    "comment": "Sets the backoff strategy. If not set, the retries are performed without backoff.",
    "notImp": false
  },
  {
    "name": "hash_policy",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HashPolicy[]",
    "enums": null,
    "comment": "Optional configuration for TCP proxy hash policy. If hash_policy is not set, the hash-based load balancing algorithms will select a host randomly. Currently the number of hash policies is limited to 1.",
    "notImp": false
  },
  {
    "name": "tunneling_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TcpProxy_TunnelingConfig",
    "enums": null,
    "comment": "If set, this configures tunneling, for example configuration options to tunnel TCP payload over HTTP CONNECT. If this message is absent, the payload is proxied upstream as usual. It is possible to dynamically override this configuration and disable tunneling per connection by setting a per-connection filter state object for the key ``envoy.tcp_proxy.disable_tunneling``.",
    "notImp": false
  },
  {
    "name": "max_downstream_connection_duration",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The maximum duration of a connection. The duration is defined as the period since a connection was established. If not set, there is no maximum duration. When ``max_downstream_connection_duration`` is reached, the connection is closed. The duration must be at least ``1ms``.",
    "notImp": false
  },
  {
    "name": "max_downstream_connection_duration_jitter_percentage",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Percent",
    "enums": null,
    "comment": "Percentage-based jitter for ``max_downstream_connection_duration``. The jitter increases the ``max_downstream_connection_duration`` by a random duration up to the provided percentage. This field is ignored if ``max_downstream_connection_duration`` is not set. If not set, no jitter is added.",
    "notImp": false
  },
  {
    "name": "access_log_flush_interval",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "Duration",
    "enums": null,
    "comment": "If both this field and `access_log_flush_interval` are specified, the former (deprecated field) is ignored.\n\n:::attention\nThis field is deprecated in favor of `access_log_flush_interval`. \n:::",
    "notImp": false
  },
  {
    "name": "flush_access_log_on_connected",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If both this field and `flush_access_log_on_connected` are specified, the former (deprecated field) is ignored.\n\n:::attention\nThis field is deprecated in favor of `flush_access_log_on_connected`. \n:::",
    "notImp": false
  },
  {
    "name": "access_log_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TcpProxy_TcpAccessLogOptions",
    "enums": null,
    "comment": "Additional access log options for the TCP proxy.",
    "notImp": false
  },
  {
    "name": "proxy_protocol_tlvs",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TlvEntry[]",
    "enums": null,
    "comment": "If set, the specified ``PROXY`` protocol TLVs (Type-Length-Value) are added to the ``PROXY`` protocol state created by the TCP proxy filter. These TLVs are sent in the PROXY protocol v2 header to the upstream.\n\nThis field only takes effect when the TCP proxy filter is creating new ``PROXY`` protocol state and an upstream proxy protocol transport socket is configured in the cluster. If the connection already contains ``PROXY`` protocol state (including any TLVs) parsed by a downstream proxy protocol listener upstream proxy protocol transport socket is configured in the cluster. If the connection already contains PROXY protocol state (including any TLVs) parsed by a downstream proxy protocol listener filter, the TLVs specified here are ignored.\n\n:::note\nTo ensure the specified TLVs are allowed in the upstream ``PROXY`` protocol header, you must also configure passthrough TLVs on the upstream proxy protocol transport. See `core.v3.ProxyProtocolConfig.pass_through_tlvs` for details.",
    "notImp": false
  },
  {
    "name": "upstream_connect_mode",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "UpstreamConnectMode",
    "enums": [
      "IMMEDIATE",
      "ON_DOWNSTREAM_DATA",
      "ON_DOWNSTREAM_TLS_HANDSHAKE"
    ],
    "comment": "Specifies when to establish the upstream connection.\n\nWhen not specified, defaults to ``IMMEDIATE`` for backward compatibility.\n\n:::attention\nServer-first protocols (e.g., SMTP, MySQL, POP3) require ``IMMEDIATE`` mode.",
    "notImp": false
  },
  {
    "name": "max_early_data_bytes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Maximum bytes of early data to buffer from the downstream connection before the upstream connection is established.\n\nIf not set, the TCP proxy will read-disable the downstream connection until the upstream connection is established (legacy behavior).\n\nIf set, enables ``receive_before_connect`` mode where the filter allows the filter chain to read downstream data before the upstream connection exists. The data is buffered and forwarded once the upstream connection is ready. When the buffer exceeds this limit, the downstream connection is read-disabled to prevent excessive memory usage.\n\nThis field is required when ``upstream_connect_mode`` is ``ON_DOWNSTREAM_DATA``.\n\n:::note\nUse this carefully with server-first protocols. The upstream may send data before receiving anything from downstream, which could fill the early data buffer.",
    "notImp": false
  }
] };

export const TcpProxy_SingleFields = [
  "stat_prefix",
  "cluster_specifier.cluster",
  "idle_timeout",
  "downstream_idle_timeout",
  "upstream_idle_timeout",
  "max_connect_attempts",
  "max_downstream_connection_duration",
  "upstream_connect_mode",
  "max_early_data_bytes"
];

export const TcpProxy_WeightedCluster: OutType = { "TcpProxy_WeightedCluster": [
  {
    "name": "clusters",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TcpProxy_WeightedCluster_ClusterWeight[]",
    "enums": null,
    "comment": "Specifies the upstream clusters associated with this configuration.",
    "notImp": false
  }
] };

export const TcpProxy_WeightedCluster_ClusterWeight: OutType = { "TcpProxy_WeightedCluster_ClusterWeight": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Name of the upstream cluster.",
    "notImp": false
  },
  {
    "name": "weight",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "When a request matches the route, the choice of an upstream cluster is determined by its weight. The sum of weights across all entries in the clusters array determines the total weight.",
    "notImp": false
  },
  {
    "name": "metadata_match",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Metadata",
    "enums": null,
    "comment": "Optional endpoint metadata match criteria used by the subset load balancer. Only endpoints in the upstream cluster with metadata matching what is set in this field will be considered for load balancing. Note that this will be merged with what's provided in `TcpProxy.metadata_match`, with values here taking precedence. The filter name should be specified as ``envoy.lb``.",
    "notImp": false
  }
] };

export const TcpProxy_WeightedCluster_ClusterWeight_SingleFields = [
  "name",
  "weight"
];