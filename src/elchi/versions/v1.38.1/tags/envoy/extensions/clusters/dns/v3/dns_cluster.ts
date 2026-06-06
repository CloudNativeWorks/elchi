import {OutType} from '@elchi/tags/tagsType';


export const DnsCluster_RefreshRate: OutType = { "DnsCluster_RefreshRate": [
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

export const DnsCluster_RefreshRate_SingleFields = [
  "base_interval",
  "max_interval"
];

export const DnsCluster: OutType = { "DnsCluster": [
  {
    "name": "dns_refresh_rate",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "This value is the cluster’s DNS refresh rate. The value configured must be at least 1ms. If this setting is not specified, the value defaults to 5000ms.",
    "notImp": false
  },
  {
    "name": "dns_failure_refresh_rate",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DnsCluster_RefreshRate",
    "enums": null,
    "comment": "This is the cluster’s DNS refresh rate when requests are failing. If this setting is not specified, the failure refresh rate defaults to the DNS refresh rate.",
    "notImp": false
  },
  {
    "name": "respect_dns_ttl",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Optional configuration for setting cluster's DNS refresh rate. If the value is set to true, cluster's DNS refresh rate will be set to resource record's TTL which comes from DNS resolution.",
    "notImp": false
  },
  {
    "name": "dns_jitter",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "DNS jitter causes the cluster to refresh DNS entries later by a random amount of time to avoid a stampede of DNS requests. This value sets the upper bound (exclusive) for the random amount. There will be no jitter if this value is omitted.",
    "notImp": false
  },
  {
    "name": "typed_dns_resolver_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "DNS resolver type configuration extension. This extension can be used to configure c-ares, apple, or any other DNS resolver types and the related parameters. For example, an object of `CaresDnsResolverConfig` can be packed into this ``typed_dns_resolver_config``. This configuration replaces the `Cluster.typed_dns_resolver_config` configuration which replaces `Cluster.dns_resolution_config`. During the transition period when `DnsCluster.typed_dns_resolver_config`, `Cluster.typed_dns_resolver_config`, and `Cluster.dns_resolution_config` exist, Envoy will use `DnsCluster.typed_dns_resolver_config` and ignore DNS resolver-related fields in `Cluster` if the cluster is configured via the `Cluster.cluster_type` extension point with the `DnsCluster` extension type. Otherwise, see  `Cluster.typed_dns_resolver_config`. extension-category: envoy.network.dns_resolver",
    "notImp": false
  },
  {
    "name": "dns_lookup_family",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DnsLookupFamily",
    "enums": [
      "UNSPECIFIED",
      "AUTO",
      "V4_ONLY",
      "V6_ONLY",
      "V4_PREFERRED",
      "ALL"
    ],
    "comment": "The DNS IP address resolution policy. If this setting is not specified, the value defaults to `AUTO`.",
    "notImp": false
  },
  {
    "name": "all_addresses_in_single_endpoint",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, all returned addresses are considered to be associated with a single endpoint, which maps to `logical DNS discovery` semantics. Otherwise, each address is considered to be a separate endpoint, which maps to `strict DNS discovery` semantics.",
    "notImp": false
  }
] };

export const DnsCluster_SingleFields = [
  "dns_refresh_rate",
  "respect_dns_ttl",
  "dns_jitter",
  "dns_lookup_family",
  "all_addresses_in_single_endpoint"
];