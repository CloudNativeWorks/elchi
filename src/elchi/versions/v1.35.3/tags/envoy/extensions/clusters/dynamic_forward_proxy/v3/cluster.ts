import {OutType} from '@elchi/tags/tagsType';


export const ClusterConfig: OutType = { "ClusterConfig": [
  {
    "name": "cluster_implementation_specifier.dns_cache_config",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "DnsCacheConfig",
    "enums": null,
    "comment": "The DNS cache configuration that the cluster will attach to. Note this configuration must match that of associated `dynamic forward proxy HTTP filter configuration`.",
    "notImp": false
  },
  {
    "name": "cluster_implementation_specifier.sub_clusters_config",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "SubClustersConfig",
    "enums": null,
    "comment": "Configuration for sub clusters, when this configuration is enabled, Envoy will create an independent sub cluster dynamically for each host:port. Most of the configuration of a sub cluster is inherited from the current cluster, i.e. health_checks, dns_resolvers and etc. And the load_assignment will be set to the only one endpoint, host:port.\n\nCompared to the dns_cache_config, it has the following advantages:\n\n1. sub clusters will be created with the STRICT_DNS DiscoveryType, so that Envoy will use all of the IPs resolved from the host.\n\n2. each sub cluster is full featured cluster, with lb_policy and health check and etc enabled.",
    "notImp": false
  },
  {
    "name": "allow_insecure_cluster_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true allow the cluster configuration to disable the auto_sni and auto_san_validation options in the `cluster's upstream_http_protocol_options`",
    "notImp": false
  },
  {
    "name": "allow_coalesced_connections",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true allow HTTP/2 and HTTP/3 connections to be reused for requests to different origins than the connection was initially created for. This will only happen when the resolved address for the new connection matches the peer address of the connection and the TLS certificate is also valid for the new hostname. For example, if a connection has previously been established to foo.example.com at IP 1.2.3.4 with a certificate that is valid for ``*.example.com``, then this connection could be used for requests to bar.example.com if that also resolved to 1.2.3.4.\n\n:::note\nBy design, this feature will maximize reuse of connections. This means that instead opening a new connection when an existing connection reaches the maximum number of concurrent streams, requests will instead be sent to the existing connection. \n:::\n\n:::note\nThe coalesced connections might be to upstreams that would not be otherwise selected by Envoy. See the section `Connection Reuse in RFC 7540 <https://datatracker.ietf.org/doc/html/rfc7540#section-9.1.1>`_",
    "notImp": false
  }
] };

export const ClusterConfig_SingleFields = [
  "allow_insecure_cluster_options",
  "allow_coalesced_connections"
];

export const SubClustersConfig: OutType = { "SubClustersConfig": [
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
    "comment": "The `load balancer type` to use when picking a host in a sub cluster. Note that CLUSTER_PROVIDED is not allowed here.",
    "notImp": false
  },
  {
    "name": "max_sub_clusters",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The maximum number of sub clusters that the DFP cluster will hold. If not specified defaults to 1024.",
    "notImp": false
  },
  {
    "name": "sub_cluster_ttl",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The TTL for sub clusters that are unused. Sub clusters that have not been used in the configured time interval will be purged. If not specified defaults to 5m.",
    "notImp": false
  },
  {
    "name": "preresolve_clusters",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SocketAddress[]",
    "enums": null,
    "comment": "Sub clusters that should be created & warmed upon creation. This might provide a performance improvement, in the form of cache hits, for sub clusters that are going to be warmed during steady state and are known at config load time.",
    "notImp": false
  }
] };

export const SubClustersConfig_SingleFields = [
  "lb_policy",
  "max_sub_clusters",
  "sub_cluster_ttl"
];