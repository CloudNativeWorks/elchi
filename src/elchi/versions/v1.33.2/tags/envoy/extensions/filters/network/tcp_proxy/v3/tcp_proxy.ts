import {OutType} from '@elchi/tags/tagsType';


export const TcpProxy_OnDemand: OutType = { "TcpProxy_OnDemand": [
  {
    "name": "odcds_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ConfigSource",
    "enums": null,
    "comment": "An optional configuration for on-demand cluster discovery service. If not specified, the on-demand cluster discovery will be disabled. When it's specified, the filter will pause a request to an unknown cluster and will begin a cluster discovery process. When the discovery is finished (successfully or not), the request will be resumed.",
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
    "comment": "The timeout for on demand cluster lookup. If the CDS cannot return the required cluster, the downstream request will be closed with the error code detail NO_CLUSTER_FOUND. [#not-implemented-hide:]",
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
    "comment": "The hostname to send in the synthesized CONNECT headers to the upstream proxy. This field evaluates command operators if set, otherwise returns hostname as is.\n\nExample: dynamically set hostname using downstream SNI\n\n```yaml\n\n   tunneling_config:\n     hostname: \"%REQUESTED_SERVER_NAME%:443\"\n```\n\nExample: dynamically set hostname using dynamic metadata\n\n```yaml\n\n   tunneling_config:\n     hostname: \"%DYNAMIC_METADATA(tunnel:address)%\"",
    "notImp": false
  },
  {
    "name": "use_post",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Use POST method instead of CONNECT method to tunnel the TCP stream. The 'protocol: bytestream' header is also NOT set for HTTP/2 to comply with the spec.\n\nThe upstream proxy is expected to convert POST payload as raw TCP.",
    "notImp": false
  },
  {
    "name": "headers_to_add",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderValueOption[]",
    "enums": null,
    "comment": "Additional request headers to upstream proxy. This is mainly used to trigger upstream to convert POST requests back to CONNECT requests.\n\nNeither ``:-prefixed`` pseudo-headers nor the Host: header can be overridden.",
    "notImp": false
  },
  {
    "name": "propagate_response_headers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Save the response headers to the downstream info filter state for consumption by the network filters. The filter state key is ``envoy.tcp_proxy.propagate_response_headers``.",
    "notImp": false
  },
  {
    "name": "post_path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The path used with POST method. Default path is ``/``. If post path is specified and `use_post field` isn't true, it will be rejected.",
    "notImp": false
  },
  {
    "name": "propagate_response_trailers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Save the response trailers to the downstream info filter state for consumption by the network filters. The filter state key is ``envoy.tcp_proxy.propagate_response_trailers``.",
    "notImp": false
  }
] };

export const TcpProxy_TunnelingConfig_SingleFields = [
  "hostname",
  "use_post",
  "propagate_response_headers",
  "post_path",
  "propagate_response_trailers"
];

export const TcpProxy_TcpAccessLogOptions: OutType = { "TcpProxy_TcpAccessLogOptions": [
  {
    "name": "access_log_flush_interval",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The interval to flush access log. The TCP proxy will flush only one access log when the connection is closed by default. If this field is set, the TCP proxy will flush access log periodically with the specified interval. The interval must be at least 1ms.",
    "notImp": false
  },
  {
    "name": "flush_access_log_on_connected",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set to true, access log will be flushed when the TCP proxy has successfully established a connection with the upstream. If the connection failed, the access log will not be flushed.",
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
    "comment": "Multiple upstream clusters can be specified for a given route. The request is routed to one of the upstream clusters based on weights assigned to each cluster.",
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
    "comment": "The idle timeout for connections managed by the TCP proxy filter. The idle timeout is defined as the period in which there are no bytes sent or received on either the upstream or downstream connection. If not set, the default idle timeout is 1 hour. If set to 0s, the timeout will be disabled. It is possible to dynamically override this configuration by setting a per-connection filter state object for the key ``envoy.tcp_proxy.per_connection_idle_timeout_ms``.\n\n:::warning\nDisabling this timeout has a highly likelihood of yielding connection leaks due to lost TCP FIN packets, etc.",
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
    "comment": "Configuration for `access logs` emitted by the this tcp_proxy.",
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
    "comment": "If set, this configures tunneling, e.g. configuration options to tunnel TCP payload over HTTP CONNECT. If this message is absent, the payload will be proxied upstream as per usual. It is possible to dynamically override this configuration and disable tunneling per connection, by setting a per-connection filter state object for the key ``envoy.tcp_proxy.disable_tunneling``.",
    "notImp": false
  },
  {
    "name": "max_downstream_connection_duration",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The maximum duration of a connection. The duration is defined as the period since a connection was established. If not set, there is no max duration. When max_downstream_connection_duration is reached the connection will be closed. Duration must be at least 1ms.",
    "notImp": false
  },
  {
    "name": "access_log_flush_interval",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "Duration",
    "enums": null,
    "comment": ":::attention\nThis field is deprecated in favor of `access_log_flush_interval`. Note that if both this field and `access_log_flush_interval` are specified, the former (deprecated field) is ignored. \n:::",
    "notImp": false
  },
  {
    "name": "flush_access_log_on_connected",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "boolean",
    "enums": null,
    "comment": ":::attention\nThis field is deprecated in favor of `flush_access_log_on_connected`. Note that if both this field and `flush_access_log_on_connected` are specified, the former (deprecated field) is ignored. \n:::",
    "notImp": false
  },
  {
    "name": "access_log_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TcpProxy_TcpAccessLogOptions",
    "enums": null,
    "comment": "Additional access log options for TCP Proxy.",
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
  "max_downstream_connection_duration"
];

export const TcpProxy_WeightedCluster: OutType = { "TcpProxy_WeightedCluster": [
  {
    "name": "clusters",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TcpProxy_WeightedCluster_ClusterWeight[]",
    "enums": null,
    "comment": "Specifies one or more upstream clusters associated with the route.",
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