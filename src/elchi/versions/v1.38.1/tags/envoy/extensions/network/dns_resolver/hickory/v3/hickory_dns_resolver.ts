import {OutType} from '@elchi/tags/tagsType';


export const DnsOverTlsConfig: OutType = { "DnsOverTlsConfig": [
  {
    "name": "servers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Address[]",
    "enums": null,
    "comment": "The list of DNS-over-TLS server addresses. The port should typically be 853.",
    "notImp": false
  },
  {
    "name": "tls_server_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The SNI hostname to use for TLS verification. Required when ``servers`` are specified.",
    "notImp": false
  }
] };

export const DnsOverTlsConfig_SingleFields = [
  "tls_server_name"
];

export const DnsOverHttpsConfig: OutType = { "DnsOverHttpsConfig": [
  {
    "name": "server_urls",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "The list of DNS-over-HTTPS endpoint URLs (e.g., ``https://dns.google/dns-query``).",
    "notImp": false
  }
] };

export const DnsOverHttpsConfig_SingleFields = [
  "server_urls"
];

export const HickoryDnsResolverConfig: OutType = { "HickoryDnsResolverConfig": [
  {
    "name": "resolvers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Address[]",
    "enums": null,
    "comment": "A list of DNS resolver addresses for standard UDP/TCP resolution. If not specified and ``use_system_config`` is not explicitly set to ``false``, the system configuration (``/etc/resolv.conf`` on Unix) will be used.",
    "notImp": false
  },
  {
    "name": "dns_over_tls",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DnsOverTlsConfig",
    "enums": null,
    "comment": "Configuration for DNS-over-TLS (DoT). When specified, queries will be sent over TLS to the configured servers.",
    "notImp": false
  },
  {
    "name": "dns_over_https",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DnsOverHttpsConfig",
    "enums": null,
    "comment": "Configuration for DNS-over-HTTPS (DoH). When specified, queries will be sent over HTTPS to the configured endpoints.",
    "notImp": false
  },
  {
    "name": "enable_dnssec",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Enables ``DNSSEC`` validation for DNS responses. When enabled, the resolver will validate ``DNSSEC`` signatures and reject responses that fail validation.\n\nDefaults to ``false``.",
    "notImp": false
  },
  {
    "name": "cache_size",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Maximum number of entries in the DNS response cache. The cache uses an LRU eviction policy and supports negative caching (caching of ``NXDOMAIN``/``NODATA`` responses).\n\nDefaults to ``1024``.",
    "notImp": false
  },
  {
    "name": "num_resolver_threads",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Number of threads in the ``Tokio`` runtime used for asynchronous DNS resolution. Each resolver instance runs its own ``Tokio`` runtime.\n\nDefaults to ``2``. Maximum is ``16``.",
    "notImp": false
  },
  {
    "name": "use_system_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If ``true``, read the system DNS configuration (``/etc/resolv.conf`` on Unix) for name server addresses and search domains. When ``resolvers`` are also specified, they take precedence over the system configuration.\n\nIf not specified, defaults to ``true`` when no ``resolvers``, ``dns_over_tls``, or ``dns_over_https`` are configured.",
    "notImp": false
  },
  {
    "name": "query_timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Timeout for each individual DNS query attempt.\n\nDefaults to ``5`` seconds.",
    "notImp": false
  },
  {
    "name": "query_tries",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Maximum number of query attempts before the resolver gives up. Each attempt may use a different name server.\n\nDefaults to ``3``.",
    "notImp": false
  }
] };

export const HickoryDnsResolverConfig_SingleFields = [
  "enable_dnssec",
  "cache_size",
  "num_resolver_threads",
  "use_system_config",
  "query_timeout",
  "query_tries"
];