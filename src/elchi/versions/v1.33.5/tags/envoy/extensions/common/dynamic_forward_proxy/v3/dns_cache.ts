import {OutType} from '@elchi/tags/tagsType';


export const DnsCacheCircuitBreakers: OutType = { "DnsCacheCircuitBreakers": [
  {
    "name": "max_pending_requests",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The maximum number of pending requests that Envoy will allow to the resolver. If not specified, the default is 1024.",
    "notImp": false
  }
] };

export const DnsCacheCircuitBreakers_SingleFields = [
  "max_pending_requests"
];

export const DnsCacheConfig: OutType = { "DnsCacheConfig": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the cache. Multiple named caches allow independent dynamic forward proxy configurations to operate within a single Envoy process using different configurations. All configurations with the same name *must* otherwise have the same settings when referenced from different configuration components. Configuration will fail to load if this is not the case.",
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
    "comment": "The DNS lookup family to use during resolution.",
    "notImp": false
  },
  {
    "name": "dns_refresh_rate",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The DNS refresh rate for unresolved DNS hosts. If not specified defaults to 60s.\n\nThe refresh rate is rounded to the closest millisecond, and must be at least 1ms.\n\nOnce a host has been resolved, the refresh rate will be the DNS TTL, capped at a minimum of ``dns_min_refresh_rate``.",
    "notImp": false
  },
  {
    "name": "dns_min_refresh_rate",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The minimum rate that DNS resolution will occur. Per ``dns_refresh_rate``, once a host is resolved, the DNS TTL will be used, with a minimum set by ``dns_min_refresh_rate``. ``dns_min_refresh_rate`` defaults to 5s and must also be >= 1s.",
    "notImp": false
  },
  {
    "name": "host_ttl",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The TTL for hosts that are unused. Hosts that have not been used in the configured time interval will be purged. If not specified defaults to 5m.\n\n.. note:\n\n  The TTL is only checked at the time of DNS refresh, as specified by ``dns_refresh_rate``. This means that if the configured TTL is shorter than the refresh rate the host may not be removed immediately.\n\n .. note:\n\n  The TTL has no relation to DNS TTL and is only used to control Envoy's resource usage.",
    "notImp": false
  },
  {
    "name": "max_hosts",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The maximum number of hosts that the cache will hold. If not specified defaults to 1024.\n\n.. note:\n\n  The implementation is approximate and enforced independently on each worker thread, thus it is possible for the maximum hosts in the cache to go slightly above the configured value depending on timing. This is similar to how other circuit breakers work.",
    "notImp": false
  },
  {
    "name": "dns_failure_refresh_rate",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Cluster_RefreshRate",
    "enums": null,
    "comment": "If the DNS failure refresh rate is specified, this is used as the cache's DNS refresh rate when DNS requests are failing. If this setting is not specified, the failure refresh rate defaults to the dns_refresh_rate.",
    "notImp": false
  },
  {
    "name": "dns_cache_circuit_breaker",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DnsCacheCircuitBreakers",
    "enums": null,
    "comment": "The config of circuit breakers for resolver. It provides a configurable threshold. Envoy will use dns cache circuit breakers with default settings even if this value is not set.",
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
    "comment": "DNS resolver type configuration extension. This extension can be used to configure c-ares, apple, or any other DNS resolver types and the related parameters. For example, an object of `CaresDnsResolverConfig` can be packed into this ``typed_dns_resolver_config``. This configuration replaces the `dns_resolution_config` configuration. During the transition period when both ``dns_resolution_config`` and ``typed_dns_resolver_config`` exists, when ``typed_dns_resolver_config`` is in place, Envoy will use it and ignore ``dns_resolution_config``. When ``typed_dns_resolver_config`` is missing, the default behavior is in place. extension-category: envoy.network.dns_resolver",
    "notImp": false
  },
  {
    "name": "preresolve_hostnames",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SocketAddress[]",
    "enums": null,
    "comment": "Hostnames that should be preresolved into the cache upon creation. This might provide a performance improvement, in the form of cache hits, for hostnames that are going to be resolved during steady state and are known at config load time.",
    "notImp": false
  },
  {
    "name": "dns_query_timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The timeout used for DNS queries. This timeout is independent of any timeout and retry policy used by the underlying DNS implementation (e.g., c-areas and Apple DNS) which are opaque. Setting this timeout will ensure that queries succeed or fail within the specified time frame and are then retried using the standard refresh rates. Defaults to 5s if not set.",
    "notImp": false
  },
  {
    "name": "key_value_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "KeyValueStoreConfig",
    "enums": null,
    "comment": "Configuration to flush the DNS cache to long term storage.",
    "notImp": false
  }
] };

export const DnsCacheConfig_SingleFields = [
  "name",
  "dns_lookup_family",
  "dns_refresh_rate",
  "dns_min_refresh_rate",
  "host_ttl",
  "max_hosts",
  "dns_query_timeout"
];