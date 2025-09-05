import {OutType} from '@elchi/tags/tagsType';


export const ClusterCollection: OutType = { "ClusterCollection": [
  {
    "name": "entries",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CollectionEntry",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const Cluster_EdsClusterConfig: OutType = { "Cluster_EdsClusterConfig": [
  {
    "name": "eds_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ConfigSource",
    "enums": null,
    "comment": "Configuration for the source of EDS updates for this Cluster.",
    "notImp": false
  },
  {
    "name": "service_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Optional alternative to cluster name to present to EDS. This does not have the same restrictions as cluster name, i.e. it may be arbitrary length. This may be a xdstp:// URL.",
    "notImp": false
  }
] };

export const Cluster_EdsClusterConfig_SingleFields = [
  "service_name"
];

export const Cluster_RefreshRate: OutType = { "Cluster_RefreshRate": [
  {
    "name": "base_interval",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Specifies the base interval between refreshes. This parameter is required and must be greater than zero and less than `max_interval`.",
    "notImp": false
  },
  {
    "name": "max_interval",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Specifies the maximum interval between refreshes. This parameter is optional, but must be greater than or equal to the `base_interval`  if set. The default is 10 times the `base_interval`.",
    "notImp": false
  }
] };

export const Cluster_RefreshRate_SingleFields = [
  "base_interval",
  "max_interval"
];

export const Cluster_LbSubsetConfig: OutType = { "Cluster_LbSubsetConfig": [
  {
    "name": "fallback_policy",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Cluster_LbSubsetConfig_LbSubsetFallbackPolicy",
    "enums": [
      "NO_FALLBACK",
      "ANY_ENDPOINT",
      "DEFAULT_SUBSET"
    ],
    "comment": "The behavior used when no endpoint subset matches the selected route's metadata. The value defaults to `NO_FALLBACK`.",
    "notImp": false
  },
  {
    "name": "default_subset",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "{ [key: string]: any; }",
    "enums": null,
    "comment": "Specifies the default subset of endpoints used during fallback if fallback_policy is `DEFAULT_SUBSET`. Each field in default_subset is compared to the matching LbEndpoint.Metadata under the ``envoy.lb`` namespace. It is valid for no hosts to match, in which case the behavior is the same as a fallback_policy of `NO_FALLBACK`.",
    "notImp": false
  },
  {
    "name": "subset_selectors",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Cluster_LbSubsetConfig_LbSubsetSelector[]",
    "enums": null,
    "comment": "For each entry, LbEndpoint.Metadata's ``envoy.lb`` namespace is traversed and a subset is created for each unique combination of key and value. For example:\n\n```json\n\n  { \"subset_selectors\": [\n      { \"keys\": [ \"version\" ] },\n      { \"keys\": [ \"stage\", \"hardware_type\" ] }\n  ]}\n```\n\nA subset is matched when the metadata from the selected route and weighted cluster contains the same keys and values as the subset's metadata. The same host may appear in multiple subsets.",
    "notImp": false
  },
  {
    "name": "locality_weight_aware",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, routing to subsets will take into account the localities and locality weights of the endpoints when making the routing decision.\n\nThere are some potential pitfalls associated with enabling this feature, as the resulting traffic split after applying both a subset match and locality weights might be undesirable.\n\nConsider for example a situation in which you have 50/50 split across two localities X/Y which have 100 hosts each without subsetting. If the subset LB results in X having only 1 host selected but Y having 100, then a lot more load is being dumped on the single host in X than originally anticipated in the load balancing assignment delivered via EDS.",
    "notImp": false
  },
  {
    "name": "scale_locality_weight",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "When used with locality_weight_aware, scales the weight of each locality by the ratio of hosts in the subset vs hosts in the original subset. This aims to even out the load going to an individual locality if said locality is disproportionately affected by the subset predicate.",
    "notImp": false
  },
  {
    "name": "panic_mode_any",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, when a fallback policy is configured and its corresponding subset fails to find a host this will cause any host to be selected instead.\n\nThis is useful when using the default subset as the fallback policy, given the default subset might become empty. With this option enabled, if that happens the LB will attempt to select a host from the entire cluster.",
    "notImp": false
  },
  {
    "name": "list_as_any",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, metadata specified for a metadata key will be matched against the corresponding endpoint metadata if the endpoint metadata matches the value exactly OR it is a list value and any of the elements in the list matches the criteria.",
    "notImp": false
  },
  {
    "name": "metadata_fallback_policy",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Cluster_LbSubsetConfig_LbSubsetMetadataFallbackPolicy",
    "enums": [
      "METADATA_NO_FALLBACK",
      "FALLBACK_LIST"
    ],
    "comment": "Fallback mechanism that allows to try different route metadata until a host is found. If load balancing process, including all its mechanisms (like `fallback_policy`) fails to select a host, this policy decides if and how the process is repeated using another metadata.\n\nThe value defaults to `METADATA_NO_FALLBACK`.",
    "notImp": false
  }
] };

export const Cluster_LbSubsetConfig_SingleFields = [
  "fallback_policy",
  "locality_weight_aware",
  "scale_locality_weight",
  "panic_mode_any",
  "list_as_any",
  "metadata_fallback_policy"
];

export const Cluster_CommonLbConfig_ConsistentHashingLbConfig: OutType = { "Cluster_CommonLbConfig_ConsistentHashingLbConfig": [
  {
    "name": "use_hostname_for_hashing",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set to ``true``, the cluster will use hostname instead of the resolved address as the key to consistently hash to an upstream host. Only valid for StrictDNS clusters with hostnames which resolve to a single IP address.",
    "notImp": false
  },
  {
    "name": "hash_balance_factor",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Configures percentage of average cluster load to bound per upstream host. For example, with a value of 150 no upstream host will get a load more than 1.5 times the average load of all the hosts in the cluster. If not specified, the load is not bounded for any upstream host. Typical value for this parameter is between 120 and 200. Minimum is 100.\n\nApplies to both Ring Hash and Maglev load balancers.\n\nThis is implemented based on the method described in the paper https://arxiv.org/abs/1608.01350. For the specified ``hash_balance_factor``, requests to any upstream host are capped at ``hash_balance_factor/100`` times the average number of requests across the cluster. When a request arrives for an upstream host that is currently serving at its max capacity, linear probing is used to identify an eligible host. Further, the linear probe is implemented using a random jump in hosts ring/table to identify the eligible host (this technique is as described in the paper https://arxiv.org/abs/1908.08762 - the random jump avoids the cascading overflow effect when choosing the next host in the ring/table).\n\nIf weights are specified on the hosts, they are respected.\n\nThis is an O(N) algorithm, unlike other load balancers. Using a lower ``hash_balance_factor`` results in more hosts being probed, so use a higher value if you require better performance.",
    "notImp": false
  }
] };

export const Cluster_CommonLbConfig_ConsistentHashingLbConfig_SingleFields = [
  "use_hostname_for_hashing",
  "hash_balance_factor"
];

export const Cluster_CommonLbConfig: OutType = { "Cluster_CommonLbConfig": [
  {
    "name": "healthy_panic_threshold",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Percent",
    "enums": null,
    "comment": "Configures the `healthy panic threshold`. If not specified, the default is 50%. To disable panic mode, set to 0%.\n\n:::note\nThe specified percent will be truncated to the nearest 1%.",
    "notImp": false
  },
  {
    "name": "locality_config_specifier.zone_aware_lb_config",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Cluster_CommonLbConfig_ZoneAwareLbConfig",
    "enums": null,
    "comment": "Common configuration for all load balancer implementations. [#next-free-field: 9]",
    "notImp": false
  },
  {
    "name": "locality_config_specifier.locality_weighted_lb_config",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Cluster_CommonLbConfig_LocalityWeightedLbConfig",
    "enums": null,
    "comment": "Common configuration for all load balancer implementations. [#next-free-field: 9]",
    "notImp": false
  },
  {
    "name": "update_merge_window",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "If set, all health check/weight/metadata updates that happen within this duration will be merged and delivered in one shot when the duration expires. The start of the duration is when the first update happens. This is useful for big clusters, with potentially noisy deploys that might trigger excessive CPU usage due to a constant stream of healthcheck state changes or metadata updates. The first set of updates to be seen apply immediately (e.g.: a new cluster). Please always keep in mind that the use of sandbox technologies may change this behavior.\n\nIf this is not set, we default to a merge window of 1000ms. To disable it, set the merge window to 0.\n\n:::note\nMerging does not apply to cluster membership changes (e.g.: adds/removes); this is because merging those updates isn't currently safe. See https://github.com/envoyproxy/envoy/pull/3941.",
    "notImp": false
  },
  {
    "name": "ignore_new_hosts_until_first_hc",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set to true, Envoy will `exclude` new hosts when computing load balancing weights until they have been health checked for the first time. This will have no effect unless active health checking is also configured.",
    "notImp": false
  },
  {
    "name": "close_connections_on_host_set_change",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set to ``true``, the cluster manager will drain all existing connections to upstream hosts whenever hosts are added or removed from the cluster.",
    "notImp": false
  },
  {
    "name": "consistent_hashing_lb_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Cluster_CommonLbConfig_ConsistentHashingLbConfig",
    "enums": null,
    "comment": "Common Configuration for all consistent hashing load balancers (MaglevLb, RingHashLb, etc.)",
    "notImp": false
  },
  {
    "name": "override_host_status",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HealthStatusSet",
    "enums": null,
    "comment": "This controls what hosts are considered valid when using `host overrides`, which is used by some filters to modify the load balancing decision.\n\nIf this is unset then [UNKNOWN, HEALTHY, DEGRADED] will be applied by default. If this is set with an empty set of statuses then host overrides will be ignored by the load balancing.",
    "notImp": false
  }
] };

export const Cluster_CommonLbConfig_SingleFields = [
  "update_merge_window",
  "ignore_new_hosts_until_first_hc",
  "close_connections_on_host_set_change"
];

export const UpstreamConnectionOptions_HappyEyeballsConfig: OutType = { "UpstreamConnectionOptions_HappyEyeballsConfig": [
  {
    "name": "first_address_family_version",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "UpstreamConnectionOptions_FirstAddressFamilyVersion",
    "enums": [
      "DEFAULT",
      "V4",
      "V6"
    ],
    "comment": "Specify the IP address family to attempt connection first in happy eyeballs algorithm according to RFC8305#section-4.",
    "notImp": false
  },
  {
    "name": "first_address_family_count",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Specify the number of addresses of the first_address_family_version being attempted for connection before the other address family.",
    "notImp": false
  }
] };

export const UpstreamConnectionOptions_HappyEyeballsConfig_SingleFields = [
  "first_address_family_version",
  "first_address_family_count"
];

export const UpstreamConnectionOptions: OutType = { "UpstreamConnectionOptions": [
  {
    "name": "tcp_keepalive",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TcpKeepalive",
    "enums": null,
    "comment": "If set then set SO_KEEPALIVE on the socket to enable TCP Keepalives.",
    "notImp": false
  },
  {
    "name": "set_local_interface_name_on_upstream_connections",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If enabled, associates the interface name of the local address with the upstream connection. This can be used by extensions during processing of requests. The association mechanism is implementation specific. Defaults to false due to performance concerns.",
    "notImp": false
  },
  {
    "name": "happy_eyeballs_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "UpstreamConnectionOptions_HappyEyeballsConfig",
    "enums": null,
    "comment": "Configurations for happy eyeballs algorithm. Add configs for first_address_family_version and first_address_family_count when sorting destination ip addresses.",
    "notImp": false
  }
] };

export const UpstreamConnectionOptions_SingleFields = [
  "set_local_interface_name_on_upstream_connections"
];

export const LoadBalancingPolicy: OutType = { "LoadBalancingPolicy": [
  {
    "name": "policies",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "LoadBalancingPolicy_Policy[]",
    "enums": null,
    "comment": "Each client will iterate over the list in order and stop at the first policy that it supports. This provides a mechanism for starting to use new LB policies that are not yet supported by all clients.",
    "notImp": false
  }
] };

export const TrackClusterStats: OutType = { "TrackClusterStats": [
  {
    "name": "timeout_budgets",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If timeout_budgets is true, the `timeout budget histograms` will be published for each request. These show what percentage of a request's per try and global timeout was used. A value of 0 would indicate that none of the timeout was used or that the timeout was infinite. A value of 100 would indicate that the request took the entirety of the timeout given to it.",
    "notImp": false
  },
  {
    "name": "request_response_sizes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If request_response_sizes is true, then the `histograms`  tracking header and body sizes of requests and responses will be published. Additionally, number of headers in the requests and responses will be tracked.",
    "notImp": false
  },
  {
    "name": "per_endpoint_stats",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, some stats will be emitted per-endpoint, similar to the stats in admin ``/clusters`` output.\n\nThis does not currently output correct stats during a hot-restart.\n\nThis is not currently implemented by all stat sinks.\n\nThese stats do not honor filtering or tag extraction rules in `StatsConfig` (but fixed-value tags are supported). Admin endpoint filtering is supported.\n\nThis may not be used at the same time as `load_stats_config`.",
    "notImp": false
  }
] };

export const TrackClusterStats_SingleFields = [
  "timeout_budgets",
  "request_response_sizes",
  "per_endpoint_stats"
];

export const Cluster_PreconnectPolicy: OutType = { "Cluster_PreconnectPolicy": [
  {
    "name": "per_upstream_preconnect_ratio",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Indicates how many streams (rounded up) can be anticipated per-upstream for each incoming stream. This is useful for high-QPS or latency-sensitive services. Preconnecting will only be done if the upstream is healthy and the cluster has traffic.\n\nFor example if this is 2, for an incoming HTTP/1.1 stream, 2 connections will be established, one for the new incoming stream, and one for a presumed follow-up stream. For HTTP/2, only one connection would be established by default as one connection can serve both the original and presumed follow-up stream.\n\nIn steady state for non-multiplexed connections a value of 1.5 would mean if there were 100 active streams, there would be 100 connections in use, and 50 connections preconnected. This might be a useful value for something like short lived single-use connections, for example proxying HTTP/1.1 if keep-alive were false and each stream resulted in connection termination. It would likely be overkill for long lived connections, such as TCP proxying SMTP or regular HTTP/1.1 with keep-alive. For long lived traffic, a value of 1.05 would be more reasonable, where for every 100 connections, 5 preconnected connections would be in the queue in case of unexpected disconnects where the connection could not be reused.\n\nIf this value is not set, or set explicitly to one, Envoy will fetch as many connections as needed to serve streams in flight. This means in steady state if a connection is torn down, a subsequent streams will pay an upstream-rtt latency penalty waiting for a new connection.\n\nThis is limited somewhat arbitrarily to 3 because preconnecting too aggressively can harm latency more than the preconnecting helps.",
    "notImp": false
  },
  {
    "name": "predictive_preconnect_ratio",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Indicates how many streams (rounded up) can be anticipated across a cluster for each stream, useful for low QPS services. This is currently supported for a subset of deterministic non-hash-based load-balancing algorithms (weighted round robin, random). Unlike ``per_upstream_preconnect_ratio`` this preconnects across the upstream instances in a cluster, doing best effort predictions of what upstream would be picked next and pre-establishing a connection.\n\nPreconnecting will be limited to one preconnect per configured upstream in the cluster and will only be done if there are healthy upstreams and the cluster has traffic.\n\nFor example if preconnecting is set to 2 for a round robin HTTP/2 cluster, on the first incoming stream, 2 connections will be preconnected - one to the first upstream for this cluster, one to the second on the assumption there will be a follow-up stream.\n\nIf this value is not set, or set explicitly to one, Envoy will fetch as many connections as needed to serve streams in flight, so during warm up and in steady state if a connection is closed (and per_upstream_preconnect_ratio is not set), there will be a latency hit for connection establishment.\n\nIf both this and preconnect_ratio are set, Envoy will make sure both predicted needs are met, basically preconnecting max(predictive-preconnect, per-upstream-preconnect), for each upstream.",
    "notImp": false
  }
] };

export const Cluster_PreconnectPolicy_SingleFields = [
  "per_upstream_preconnect_ratio",
  "predictive_preconnect_ratio"
];

export const Cluster: OutType = { "Cluster": [
  {
    "name": "transport_socket_matches",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Cluster_TransportSocketMatch[]",
    "enums": null,
    "comment": "Configuration to use different transport sockets for different endpoints. The entry of ``envoy.transport_socket_match`` in the `LbEndpoint.Metadata` is used to match against the transport sockets as they appear in the list. If a match is not found, the search continues in `LocalityLbEndpoints.Metadata`. The first `match` is used. For example, with the following match\n\n```yaml\n\n transport_socket_matches:\n - name: \"enableMTLS\"\n   match:\n     acceptMTLS: true\n   transport_socket:\n     name: envoy.transport_sockets.tls\n     config: { ... } # tls socket configuration\n - name: \"defaultToPlaintext\"\n   match: {}\n   transport_socket:\n     name: envoy.transport_sockets.raw_buffer\n```\n\nConnections to the endpoints whose metadata value under ``envoy.transport_socket_match`` having \"acceptMTLS\"/\"true\" key/value pair use the \"enableMTLS\" socket configuration.\n\nIf a `socket match` with empty match criteria is provided, that always match any endpoint. For example, the \"defaultToPlaintext\" socket match in case above.\n\nIf an endpoint metadata's value under ``envoy.transport_socket_match`` does not match any ``TransportSocketMatch``, the locality metadata is then checked for a match. Barring any matches in the endpoint or locality metadata, the socket configuration fallbacks to use the ``tls_context`` or ``transport_socket`` specified in this cluster.\n\nThis field allows gradual and flexible transport socket configuration changes.\n\nThe metadata of endpoints in EDS can indicate transport socket capabilities. For example, an endpoint's metadata can have two key value pairs as \"acceptMTLS\": \"true\", \"acceptPlaintext\": \"true\". While some other endpoints, only accepting plaintext traffic has \"acceptPlaintext\": \"true\" metadata information.\n\nThen the xDS server can configure the CDS to a client, Envoy A, to send mutual TLS traffic for endpoints with \"acceptMTLS\": \"true\", by adding a corresponding ``TransportSocketMatch`` in this field. Other client Envoys receive CDS without ``transport_socket_match`` set, and still send plain text traffic to the same cluster.\n\nThis field can be used to specify custom transport socket configurations for health checks by adding matching key/value pairs in a health check's `transport socket match criteria` field.",
    "notImp": false
  },
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Supplies the name of the cluster which must be unique across all clusters. The cluster name is used when emitting `statistics` if `alt_stat_name` is not provided. Any ``:`` in the cluster name will be converted to ``_`` when emitting statistics.",
    "notImp": false
  },
  {
    "name": "alt_stat_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "An optional alternative to the cluster name to be used for observability. This name is used for emitting stats for the cluster and access logging the cluster name. This will appear as additional information in configuration dumps of a cluster's current status as `observability_name` and as an additional tag \"upstream_cluster.name\" while tracing.\n\n:::note\nAny ``:`` in the name will be converted to ``_`` when emitting statistics. This should not be confused with `Router Filter Header`.",
    "notImp": false
  },
  {
    "name": "cluster_discovery_type.type",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Cluster_DiscoveryType",
    "enums": [
      "STATIC",
      "STRICT_DNS",
      "LOGICAL_DNS",
      "EDS",
      "ORIGINAL_DST"
    ],
    "comment": "The `service discovery type` to use for resolving the cluster.",
    "notImp": false
  },
  {
    "name": "cluster_discovery_type.cluster_type",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Cluster_CustomClusterType",
    "enums": null,
    "comment": "The custom cluster type.",
    "notImp": false
  },
  {
    "name": "eds_cluster_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Cluster_EdsClusterConfig",
    "enums": null,
    "comment": "Configuration to use for EDS updates for the Cluster.",
    "notImp": false
  },
  {
    "name": "connect_timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The timeout for new network connections to hosts in the cluster. If not set, a default value of 5s will be used.",
    "notImp": false
  },
  {
    "name": "per_connection_buffer_limit_bytes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Soft limit on size of the cluster’s connections read and write buffers. If unspecified, an implementation defined default is applied (1MiB).",
    "notImp": false
  },
  {
    "name": "lb_policy",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Cluster_LbPolicy",
    "enums": [
      "ROUND_ROBIN",
      "LEAST_REQUEST",
      "RING_HASH",
      "RANDOM",
      "MAGLEV",
      "CLUSTER_PROVIDED",
      "LOAD_BALANCING_POLICY_CONFIG"
    ],
    "comment": "The `load balancer type` to use when picking a host in the cluster.",
    "notImp": false
  },
  {
    "name": "load_assignment",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ClusterLoadAssignment",
    "enums": null,
    "comment": "Setting this is required for specifying members of `STATIC`, `STRICT_DNS` or `LOGICAL_DNS` clusters. This field supersedes the ``hosts`` field in the v2 API.\n\n:::attention\n\nSetting this allows non-EDS cluster types to contain embedded EDS equivalent `endpoint assignments`.",
    "notImp": false
  },
  {
    "name": "health_checks",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HealthCheck[]",
    "enums": null,
    "comment": "Optional `active health checking` configuration for the cluster. If no configuration is specified no health checking will be done and all cluster members will be considered healthy at all times.",
    "notImp": false
  },
  {
    "name": "max_requests_per_connection",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "number",
    "enums": null,
    "comment": "Optional maximum requests for a single upstream connection. This parameter is respected by both the HTTP/1.1 and HTTP/2 connection pool implementations. If not specified, there is no limit. Setting this parameter to 1 will effectively disable keep alive.\n\n:::attention\nThis field has been deprecated in favor of the `max_requests_per_connection` field. \n:::",
    "notImp": false
  },
  {
    "name": "circuit_breakers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CircuitBreakers",
    "enums": null,
    "comment": "Optional `circuit breaking` for the cluster.",
    "notImp": false
  },
  {
    "name": "upstream_http_protocol_options",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "UpstreamHttpProtocolOptions",
    "enums": null,
    "comment": "HTTP protocol options that are applied only to upstream HTTP connections. These options apply to all HTTP versions. This has been deprecated in favor of `upstream_http_protocol_options` in the `http_protocol_options` message. upstream_http_protocol_options can be set via the cluster's `extension_protocol_options`. See `upstream_http_protocol_options` for example usage.",
    "notImp": false
  },
  {
    "name": "common_http_protocol_options",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "HttpProtocolOptions",
    "enums": null,
    "comment": "Additional options when handling HTTP requests upstream. These options will be applicable to both HTTP1 and HTTP2 requests. This has been deprecated in favor of `common_http_protocol_options` in the `http_protocol_options` message. common_http_protocol_options can be set via the cluster's `extension_protocol_options`. See `upstream_http_protocol_options` for example usage.",
    "notImp": false
  },
  {
    "name": "http_protocol_options",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "Http1ProtocolOptions",
    "enums": null,
    "comment": "Additional options when handling HTTP1 requests. This has been deprecated in favor of http_protocol_options fields in the `http_protocol_options` message. http_protocol_options can be set via the cluster's `extension_protocol_options`. See `upstream_http_protocol_options` for example usage.",
    "notImp": false
  },
  {
    "name": "http2_protocol_options",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "Http2ProtocolOptions",
    "enums": null,
    "comment": "Even if default HTTP2 protocol options are desired, this field must be set so that Envoy will assume that the upstream supports HTTP/2 when making new HTTP connection pool connections. Currently, Envoy only supports prior knowledge for upstream connections. Even if TLS is used with ALPN, ``http2_protocol_options`` must be specified. As an aside this allows HTTP/2 connections to happen over plain text. This has been deprecated in favor of http2_protocol_options fields in the `http_protocol_options` message. http2_protocol_options can be set via the cluster's `extension_protocol_options`. See `upstream_http_protocol_options` for example usage.",
    "notImp": false
  },
  {
    "name": "typed_extension_protocol_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, Any>",
    "enums": null,
    "comment": "The extension_protocol_options field is used to provide extension-specific protocol options for upstream connections. The key should match the extension filter name, such as \"envoy.filters.network.thrift_proxy\". See the extension's documentation for details on specific options.  extension-category: envoy.upstream_options",
    "notImp": false
  },
  {
    "name": "dns_refresh_rate",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "Duration",
    "enums": null,
    "comment": "If the DNS refresh rate is specified and the cluster type is either `STRICT_DNS`, or `LOGICAL_DNS`, this value is used as the cluster’s DNS refresh rate. The value configured must be at least 1ms. If this setting is not specified, the value defaults to 5000ms. For cluster types other than `STRICT_DNS` and `LOGICAL_DNS` this setting is ignored. This field is deprecated in favor of using the `cluster_type` extension point and configuring it with `DnsCluster`. If `cluster_type` is configured with `DnsCluster`, this field will be ignored.",
    "notImp": false
  },
  {
    "name": "dns_jitter",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "Duration",
    "enums": null,
    "comment": "DNS jitter can be optionally specified if the cluster type is either `STRICT_DNS`, or `LOGICAL_DNS`. DNS jitter causes the cluster to refresh DNS entries later by a random amount of time to avoid a stampede of DNS requests. This value sets the upper bound (exclusive) for the random amount. There will be no jitter if this value is omitted. For cluster types other than `STRICT_DNS` and `LOGICAL_DNS` this setting is ignored. This field is deprecated in favor of using the `cluster_type` extension point and configuring it with `DnsCluster`. If `cluster_type` is configured with `DnsCluster`, this field will be ignored.",
    "notImp": false
  },
  {
    "name": "dns_failure_refresh_rate",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "Cluster_RefreshRate",
    "enums": null,
    "comment": "If the DNS failure refresh rate is specified and the cluster type is either `STRICT_DNS`, or `LOGICAL_DNS`, this is used as the cluster’s DNS refresh rate when requests are failing. If this setting is not specified, the failure refresh rate defaults to the DNS refresh rate. For cluster types other than `STRICT_DNS` and `LOGICAL_DNS` this setting is ignored. This field is deprecated in favor of using the `cluster_type` extension point and configuring it with `DnsCluster`. If `cluster_type` is configured with `DnsCluster`, this field will be ignored.",
    "notImp": false
  },
  {
    "name": "respect_dns_ttl",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Optional configuration for setting cluster's DNS refresh rate. If the value is set to true, cluster's DNS refresh rate will be set to resource record's TTL which comes from DNS resolution. This field is deprecated in favor of using the `cluster_type` extension point and configuring it with `DnsCluster`. If `cluster_type` is configured with `DnsCluster`, this field will be ignored.",
    "notImp": false
  },
  {
    "name": "dns_lookup_family",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Cluster_DnsLookupFamily",
    "enums": [
      "AUTO",
      "V4_ONLY",
      "V6_ONLY",
      "V4_PREFERRED",
      "ALL"
    ],
    "comment": "The DNS IP address resolution policy. If this setting is not specified, the value defaults to `AUTO`. For logical and strict dns cluster, this field is deprecated in favor of using the `cluster_type` extension point and configuring it with `DnsCluster`. If `cluster_type` is configured with `DnsCluster`, this field will be ignored.",
    "notImp": false
  },
  {
    "name": "dns_resolvers",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "Address[]",
    "enums": null,
    "comment": "If DNS resolvers are specified and the cluster type is either `STRICT_DNS`, or `LOGICAL_DNS`, this value is used to specify the cluster’s dns resolvers. If this setting is not specified, the value defaults to the default resolver, which uses /etc/resolv.conf for configuration. For cluster types other than `STRICT_DNS` and `LOGICAL_DNS` this setting is ignored. This field is deprecated in favor of ``dns_resolution_config`` which aggregates all of the DNS resolver configuration in a single message.",
    "notImp": false
  },
  {
    "name": "use_tcp_for_dns_lookups",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Always use TCP queries instead of UDP queries for DNS lookups. This field is deprecated in favor of ``dns_resolution_config`` which aggregates all of the DNS resolver configuration in a single message.",
    "notImp": false
  },
  {
    "name": "dns_resolution_config",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "DnsResolutionConfig",
    "enums": null,
    "comment": "DNS resolution configuration which includes the underlying dns resolver addresses and options. This field is deprecated in favor of `typed_dns_resolver_config`.",
    "notImp": false
  },
  {
    "name": "typed_dns_resolver_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "DNS resolver type configuration extension. This extension can be used to configure c-ares, apple, or any other DNS resolver types and the related parameters. For example, an object of `CaresDnsResolverConfig` can be packed into this ``typed_dns_resolver_config``. This configuration replaces the `dns_resolution_config` configuration. During the transition period when both ``dns_resolution_config`` and ``typed_dns_resolver_config`` exists, when ``typed_dns_resolver_config`` is in place, Envoy will use it and ignore ``dns_resolution_config``. When ``typed_dns_resolver_config`` is missing, the default behavior is in place. Also note that this field is deprecated for logical dns and strict dns clusters and will be ignored when `cluster_type` is configured with `DnsCluster`. extension-category: envoy.network.dns_resolver",
    "notImp": false
  },
  {
    "name": "wait_for_warm_on_init",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Optional configuration for having cluster readiness block on warm-up. Currently, only applicable for `STRICT_DNS`, or `LOGICAL_DNS`, or `Redis Cluster`. If true, cluster readiness blocks on warm-up. If false, the cluster will complete initialization whether or not warm-up has completed. Defaults to true.",
    "notImp": false
  },
  {
    "name": "outlier_detection",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "OutlierDetection",
    "enums": null,
    "comment": "If specified, outlier detection will be enabled for this upstream cluster. Each of the configuration values can be overridden via `runtime values`.",
    "notImp": false
  },
  {
    "name": "cleanup_interval",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The interval for removing stale hosts from a cluster type `ORIGINAL_DST`. Hosts are considered stale if they have not been used as upstream destinations during this interval. New hosts are added to original destination clusters on demand as new connections are redirected to Envoy, causing the number of hosts in the cluster to grow over time. Hosts that are not stale (they are actively used as destinations) are kept in the cluster, which allows connections to them remain open, saving the latency that would otherwise be spent on opening new connections. If this setting is not specified, the value defaults to 5000ms. For cluster types other than `ORIGINAL_DST` this setting is ignored.",
    "notImp": false
  },
  {
    "name": "upstream_bind_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "BindConfig",
    "enums": null,
    "comment": "Optional configuration used to bind newly established upstream connections. This overrides any bind_config specified in the bootstrap proto. If the address and port are empty, no bind will be performed.",
    "notImp": false
  },
  {
    "name": "lb_subset_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Cluster_LbSubsetConfig",
    "enums": null,
    "comment": "Configuration for load balancing subsetting.",
    "notImp": false
  },
  {
    "name": "lb_config.ring_hash_lb_config",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Cluster_RingHashLbConfig",
    "enums": null,
    "comment": "Optional configuration for the Ring Hash load balancing policy.",
    "notImp": false
  },
  {
    "name": "lb_config.maglev_lb_config",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Cluster_MaglevLbConfig",
    "enums": null,
    "comment": "Optional configuration for the Maglev load balancing policy.",
    "notImp": false
  },
  {
    "name": "lb_config.original_dst_lb_config",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Cluster_OriginalDstLbConfig",
    "enums": null,
    "comment": "Optional configuration for the Original Destination load balancing policy.",
    "notImp": false
  },
  {
    "name": "lb_config.least_request_lb_config",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Cluster_LeastRequestLbConfig",
    "enums": null,
    "comment": "Optional configuration for the LeastRequest load balancing policy.",
    "notImp": false
  },
  {
    "name": "lb_config.round_robin_lb_config",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Cluster_RoundRobinLbConfig",
    "enums": null,
    "comment": "Optional configuration for the RoundRobin load balancing policy.",
    "notImp": false
  },
  {
    "name": "common_lb_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Cluster_CommonLbConfig",
    "enums": null,
    "comment": "Common configuration for all load balancer implementations.",
    "notImp": false
  },
  {
    "name": "transport_socket",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TransportSocket",
    "enums": null,
    "comment": "Optional custom transport socket implementation to use for upstream connections. To setup TLS, set a transport socket with name ``envoy.transport_sockets.tls`` and `UpstreamTlsContexts` in the ``typed_config``. If no transport socket configuration is specified, new connections will be set up with plaintext.",
    "notImp": false
  },
  {
    "name": "metadata",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Metadata",
    "enums": null,
    "comment": "The Metadata field can be used to provide additional information about the cluster. It can be used for stats, logging, and varying filter behavior. Fields should use reverse DNS notation to denote which entity within Envoy will need the information. For instance, if the metadata is intended for the Router filter, the filter name should be specified as ``envoy.filters.http.router``.",
    "notImp": false
  },
  {
    "name": "protocol_selection",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "Cluster_ClusterProtocolSelection",
    "enums": [
      "USE_CONFIGURED_PROTOCOL",
      "USE_DOWNSTREAM_PROTOCOL"
    ],
    "comment": "Determines how Envoy selects the protocol used to speak to upstream hosts. This has been deprecated in favor of setting explicit protocol selection in the `http_protocol_options` message. http_protocol_options can be set via the cluster's `extension_protocol_options`.",
    "notImp": false
  },
  {
    "name": "upstream_connection_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "UpstreamConnectionOptions",
    "enums": null,
    "comment": "Optional options for upstream connections.",
    "notImp": false
  },
  {
    "name": "close_connections_on_host_health_failure",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If an upstream host becomes unhealthy (as determined by the configured health checks or outlier detection), immediately close all connections to the failed host.\n\n:::note\n\nThis is currently only supported for connections created by tcp_proxy. \n:::\n\n:::note\n\nThe current implementation of this feature closes all connections immediately when the unhealthy status is detected. If there are a large number of connections open to an upstream host that becomes unhealthy, Envoy may spend a substantial amount of time exclusively closing these connections, and not processing any other traffic.",
    "notImp": false
  },
  {
    "name": "ignore_health_on_host_removal",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set to true, Envoy will ignore the health value of a host when processing its removal from service discovery. This means that if active health checking is used, Envoy will *not* wait for the endpoint to go unhealthy before removing it.",
    "notImp": false
  },
  {
    "name": "filters",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Filter[]",
    "enums": null,
    "comment": "An (optional) network filter chain, listed in the order the filters should be applied. The chain will be applied to all outgoing connections that Envoy makes to the upstream servers of this cluster.",
    "notImp": false
  },
  {
    "name": "load_balancing_policy",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "LoadBalancingPolicy",
    "enums": null,
    "comment": "If this field is set and is supported by the client, it will supersede the value of `lb_policy`.",
    "notImp": false
  },
  {
    "name": "lrs_server",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ConfigSource",
    "enums": null,
    "comment": "[#not-implemented-hide:] If present, tells the client where to send load reports via LRS. If not present, the client will fall back to a client-side default, which may be either (a) don't send any load reports or (b) send load reports for all clusters to a single default server (which may be configured in the bootstrap file).\n\nNote that if multiple clusters point to the same LRS server, the client may choose to create a separate stream for each cluster or it may choose to coalesce the data for multiple clusters onto a single stream. Either way, the client must make sure to send the data for any given cluster on no more than one stream.",
    "notImp": true
  },
  {
    "name": "lrs_report_endpoint_metrics",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "A list of metric names from `ORCA load reports` to propagate to LRS.\n\nIf not specified, then ORCA load reports will not be propagated to LRS.\n\nFor map fields in the ORCA proto, the string will be of the form ``<map_field_name>.<map_key>``. For example, the string ``named_metrics.foo`` will mean to look for the key ``foo`` in the ORCA `named_metrics` field.\n\nThe special map key ``*`` means to report all entries in the map (e.g., ``named_metrics.*`` means to report all entries in the ORCA named_metrics field). Note that this should be used only with trusted backends.\n\nThe metric names in LRS will follow the same semantics as this field. In other words, if this field contains ``named_metrics.foo``, then the LRS load report will include the data with that same string as the key.",
    "notImp": false
  },
  {
    "name": "track_timeout_budgets",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If track_timeout_budgets is true, the `timeout budget histograms` will be published for each request. These show what percentage of a request's per try and global timeout was used. A value of 0 would indicate that none of the timeout was used or that the timeout was infinite. A value of 100 would indicate that the request took the entirety of the timeout given to it.\n\n:::attention\n\nThis field has been deprecated in favor of ``timeout_budgets``, part of `track_cluster_stats`. \n:::",
    "notImp": false
  },
  {
    "name": "upstream_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "Optional customization and configuration of upstream connection pool, and upstream type.\n\nCurrently this field only applies for HTTP traffic but is designed for eventual use for custom TCP upstreams.\n\nFor HTTP traffic, Envoy will generally take downstream HTTP and send it upstream as upstream HTTP, using the http connection pool and the codec from ``http2_protocol_options``\n\nFor routes where CONNECT termination is configured, Envoy will take downstream CONNECT requests and forward the CONNECT payload upstream over raw TCP using the tcp connection pool.\n\nThe default pool used is the generic connection pool which creates the HTTP upstream for most HTTP requests, and the TCP upstream if CONNECT termination is configured.\n\nIf users desire custom connection pool or upstream behavior, for example terminating CONNECT only if a custom filter indicates it is appropriate, the custom factories can be registered and configured here. extension-category: envoy.upstreams",
    "notImp": false
  },
  {
    "name": "track_cluster_stats",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TrackClusterStats",
    "enums": null,
    "comment": "Configuration to track optional cluster stats.",
    "notImp": false
  },
  {
    "name": "preconnect_policy",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Cluster_PreconnectPolicy",
    "enums": null,
    "comment": "Preconnect configuration for this cluster.",
    "notImp": false
  },
  {
    "name": "connection_pool_per_downstream_connection",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If ``connection_pool_per_downstream_connection`` is true, the cluster will use a separate connection pool for every downstream connection",
    "notImp": false
  }
] };

export const Cluster_SingleFields = [
  "name",
  "alt_stat_name",
  "cluster_discovery_type.type",
  "connect_timeout",
  "per_connection_buffer_limit_bytes",
  "lb_policy",
  "dns_lookup_family",
  "wait_for_warm_on_init",
  "cleanup_interval",
  "close_connections_on_host_health_failure",
  "ignore_health_on_host_removal",
  "lrs_report_endpoint_metrics",
  "connection_pool_per_downstream_connection"
];

export const Cluster_TransportSocketMatch: OutType = { "Cluster_TransportSocketMatch": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the match, used in stats generation.",
    "notImp": false
  },
  {
    "name": "match",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "{ [key: string]: any; }",
    "enums": null,
    "comment": "Optional metadata match criteria. The connection to the endpoint with metadata matching what is set in this field will use the transport socket configuration specified here. The endpoint's metadata entry in ``envoy.transport_socket_match`` is used to match against the values specified in this field.",
    "notImp": false
  },
  {
    "name": "transport_socket",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TransportSocket",
    "enums": null,
    "comment": "The configuration of the transport socket. extension-category: envoy.transport_sockets.upstream",
    "notImp": false
  }
] };

export const Cluster_TransportSocketMatch_SingleFields = [
  "name"
];

export const Cluster_CustomClusterType: OutType = { "Cluster_CustomClusterType": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The type of the cluster to instantiate. The name must match a supported cluster type.",
    "notImp": false
  },
  {
    "name": "typed_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "Cluster specific configuration which depends on the cluster being instantiated. See the supported cluster for further documentation. extension-category: envoy.clusters",
    "notImp": false
  }
] };

export const Cluster_CustomClusterType_SingleFields = [
  "name"
];

export const Cluster_LbSubsetConfig_LbSubsetSelector: OutType = { "Cluster_LbSubsetConfig_LbSubsetSelector": [
  {
    "name": "keys",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "List of keys to match with the weighted cluster metadata.",
    "notImp": false
  },
  {
    "name": "single_host_per_subset",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Selects a mode of operation in which each subset has only one host. This mode uses the same rules for choosing a host, but updating hosts is faster, especially for large numbers of hosts.\n\nIf a match is found to a host, that host will be used regardless of priority levels.\n\nWhen this mode is enabled, configurations that contain more than one host with the same metadata value for the single key in ``keys`` will use only one of the hosts with the given key; no requests will be routed to the others. The cluster gauge `lb_subsets_single_host_per_subset_duplicate` indicates how many duplicates are present in the current configuration.",
    "notImp": false
  },
  {
    "name": "fallback_policy",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Cluster_LbSubsetConfig_LbSubsetSelector_LbSubsetSelectorFallbackPolicy",
    "enums": [
      "NOT_DEFINED",
      "NO_FALLBACK",
      "ANY_ENDPOINT",
      "DEFAULT_SUBSET",
      "KEYS_SUBSET"
    ],
    "comment": "The behavior used when no endpoint subset matches the selected route's metadata.",
    "notImp": false
  },
  {
    "name": "fallback_keys_subset",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Subset of `keys` used by `KEYS_SUBSET` fallback policy. It has to be a non empty list if KEYS_SUBSET fallback policy is selected. For any other fallback policy the parameter is not used and should not be set. Only values also present in `keys` are allowed, but ``fallback_keys_subset`` cannot be equal to ``keys``.",
    "notImp": false
  }
] };

export const Cluster_LbSubsetConfig_LbSubsetSelector_SingleFields = [
  "keys",
  "single_host_per_subset",
  "fallback_policy",
  "fallback_keys_subset"
];

export const Cluster_SlowStartConfig: OutType = { "Cluster_SlowStartConfig": [
  {
    "name": "slow_start_window",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Represents the size of slow start window. If set, the newly created host remains in slow start mode starting from its creation time for the duration of slow start window.",
    "notImp": false
  },
  {
    "name": "aggression",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RuntimeDouble",
    "enums": null,
    "comment": "This parameter controls the speed of traffic increase over the slow start window. Defaults to 1.0, so that endpoint would get linearly increasing amount of traffic. When increasing the value for this parameter, the speed of traffic ramp-up increases non-linearly. The value of aggression parameter should be greater than 0.0. By tuning the parameter, is possible to achieve polynomial or exponential shape of ramp-up curve.\n\nDuring slow start window, effective weight of an endpoint would be scaled with time factor and aggression: ``new_weight = weight * max(min_weight_percent, time_factor ^ (1 / aggression))``, where ``time_factor=(time_since_start_seconds / slow_start_time_seconds)``.\n\nAs time progresses, more and more traffic would be sent to endpoint, which is in slow start window. Once host exits slow start, time_factor and aggression no longer affect its weight.",
    "notImp": false
  },
  {
    "name": "min_weight_percent",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Percent",
    "enums": null,
    "comment": "Configures the minimum percentage of origin weight that avoids too small new weight, which may cause endpoints in slow start mode receive no traffic in slow start window. If not specified, the default is 10%.",
    "notImp": false
  }
] };

export const Cluster_SlowStartConfig_SingleFields = [
  "slow_start_window"
];

export const Cluster_RoundRobinLbConfig: OutType = { "Cluster_RoundRobinLbConfig": [
  {
    "name": "slow_start_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Cluster_SlowStartConfig",
    "enums": null,
    "comment": "Configuration for slow start mode. If this configuration is not set, slow start will not be not enabled.",
    "notImp": false
  }
] };

export const Cluster_LeastRequestLbConfig: OutType = { "Cluster_LeastRequestLbConfig": [
  {
    "name": "choice_count",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The number of random healthy hosts from which the host with the fewest active requests will be chosen. Defaults to 2 so that we perform two-choice selection if the field is not set.",
    "notImp": false
  },
  {
    "name": "active_request_bias",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RuntimeDouble",
    "enums": null,
    "comment": "The following formula is used to calculate the dynamic weights when hosts have different load balancing weights:\n\n``weight = load_balancing_weight / (active_requests + 1)^active_request_bias``\n\nThe larger the active request bias is, the more aggressively active requests will lower the effective weight when all host weights are not equal.\n\n``active_request_bias`` must be greater than or equal to 0.0.\n\nWhen ``active_request_bias == 0.0`` the Least Request Load Balancer doesn't consider the number of active requests at the time it picks a host and behaves like the Round Robin Load Balancer.\n\nWhen ``active_request_bias > 0.0`` the Least Request Load Balancer scales the load balancing weight by the number of active requests at the time it does a pick.\n\nThe value is cached for performance reasons and refreshed whenever one of the Load Balancer's host sets changes, e.g., whenever there is a host membership update or a host load balancing weight change.\n\n:::note\nThis setting only takes effect if all host weights are not equal.",
    "notImp": false
  },
  {
    "name": "slow_start_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Cluster_SlowStartConfig",
    "enums": null,
    "comment": "Configuration for slow start mode. If this configuration is not set, slow start will not be not enabled.",
    "notImp": false
  }
] };

export const Cluster_LeastRequestLbConfig_SingleFields = [
  "choice_count"
];

export const Cluster_RingHashLbConfig: OutType = { "Cluster_RingHashLbConfig": [
  {
    "name": "minimum_ring_size",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Minimum hash ring size. The larger the ring is (that is, the more hashes there are for each provided host) the better the request distribution will reflect the desired weights. Defaults to 1024 entries, and limited to 8M entries. See also `maximum_ring_size`.",
    "notImp": false
  },
  {
    "name": "hash_function",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Cluster_RingHashLbConfig_HashFunction",
    "enums": [
      "XX_HASH",
      "MURMUR_HASH_2"
    ],
    "comment": "The hash function used to hash hosts onto the ketama ring. The value defaults to `XX_HASH`.",
    "notImp": false
  },
  {
    "name": "maximum_ring_size",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Maximum hash ring size. Defaults to 8M entries, and limited to 8M entries, but can be lowered to further constrain resource use. See also `minimum_ring_size`.",
    "notImp": false
  }
] };

export const Cluster_RingHashLbConfig_SingleFields = [
  "minimum_ring_size",
  "hash_function",
  "maximum_ring_size"
];

export const Cluster_MaglevLbConfig: OutType = { "Cluster_MaglevLbConfig": [
  {
    "name": "table_size",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The table size for Maglev hashing. Maglev aims for \"minimal disruption\" rather than an absolute guarantee. Minimal disruption means that when the set of upstream hosts change, a connection will likely be sent to the same upstream as it was before. Increasing the table size reduces the amount of disruption. The table size must be prime number limited to 5000011. If it is not specified, the default is 65537.",
    "notImp": false
  }
] };

export const Cluster_MaglevLbConfig_SingleFields = [
  "table_size"
];

export const Cluster_OriginalDstLbConfig: OutType = { "Cluster_OriginalDstLbConfig": [
  {
    "name": "use_http_header",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "When true, a HTTP header can be used to override the original dst address. The default header is `x-envoy-original-dst-host`.\n\n:::attention\n\nThis header isn't sanitized by default, so enabling this feature allows HTTP clients to route traffic to arbitrary hosts and/or ports, which may have serious security consequences. \n:::\n\n:::note\n\nIf the header appears multiple times only the first value is used.",
    "notImp": false
  },
  {
    "name": "http_header_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The http header to override destination address if `use_http_header`. is set to true. If the value is empty, `x-envoy-original-dst-host` will be used.",
    "notImp": false
  },
  {
    "name": "upstream_port_override",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The port to override for the original dst address. This port will take precedence over filter state and header override ports",
    "notImp": false
  },
  {
    "name": "metadata_key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "MetadataKey",
    "enums": null,
    "comment": "The dynamic metadata key to override destination address. First the request metadata is considered, then the connection one.",
    "notImp": false
  }
] };

export const Cluster_OriginalDstLbConfig_SingleFields = [
  "use_http_header",
  "http_header_name",
  "upstream_port_override"
];

export const Cluster_CommonLbConfig_ZoneAwareLbConfig: OutType = { "Cluster_CommonLbConfig_ZoneAwareLbConfig": [
  {
    "name": "routing_enabled",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Percent",
    "enums": null,
    "comment": "Configures percentage of requests that will be considered for zone aware routing if zone aware routing is configured. If not specified, the default is 100%. * `runtime values`. * `Zone aware routing support`.",
    "notImp": false
  },
  {
    "name": "min_cluster_size",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Configures minimum upstream cluster size required for zone aware routing If upstream cluster size is less than specified, zone aware routing is not performed even if zone aware routing is configured. If not specified, the default is 6. * `runtime values`. * `Zone aware routing support`.",
    "notImp": false
  },
  {
    "name": "fail_traffic_on_panic",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set to true, Envoy will not consider any hosts when the cluster is in `panic mode`. Instead, the cluster will fail all requests as if all hosts are unhealthy. This can help avoid potentially overwhelming a failing service.",
    "notImp": false
  }
] };

export const Cluster_CommonLbConfig_ZoneAwareLbConfig_SingleFields = [
  "min_cluster_size",
  "fail_traffic_on_panic"
];

export const Cluster_TypedExtensionProtocolOptionsEntry: OutType = { "Cluster_TypedExtensionProtocolOptionsEntry": [
  {
    "name": "key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const Cluster_TypedExtensionProtocolOptionsEntry_SingleFields = [
  "key"
];

export const LoadBalancingPolicy_Policy: OutType = { "LoadBalancingPolicy_Policy": [
  {
    "name": "typed_extension_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "extension-category: envoy.load_balancing_policies",
    "notImp": false
  }
] };