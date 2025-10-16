import {OutType} from '@elchi/tags/tagsType';


export const CaresDnsResolverConfig: OutType = { "CaresDnsResolverConfig": [
  {
    "name": "resolvers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Address[]",
    "enums": null,
    "comment": "A list of DNS resolver addresses. `use_resolvers_as_fallback` below dictates if the DNS client should override system defaults or only use the provided resolvers if the system defaults are not available, i.e., as a fallback.",
    "notImp": false
  },
  {
    "name": "use_resolvers_as_fallback",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true use the resolvers listed in the `resolvers` field only if c-ares is unable to obtain a nameserver from the system (e.g., ``/etc/resolv.conf``). Otherwise, the resolvers listed in the resolvers list will override the default system resolvers. Defaults to false.",
    "notImp": false
  },
  {
    "name": "filter_unroutable_families",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "The resolver will query available network interfaces and determine if there are no available interfaces for a given IP family. It will then filter these addresses from the results it presents. e.g., if there are no available IPv4 network interfaces, the resolver will not provide IPv4 addresses.",
    "notImp": false
  },
  {
    "name": "dns_resolver_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DnsResolverOptions",
    "enums": null,
    "comment": "Configuration of DNS resolver option flags which control the behavior of the DNS resolver.",
    "notImp": false
  },
  {
    "name": "udp_max_queries",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "This option allows the number of UDP based DNS queries to be capped.\n\n:::note\nThis is only applicable to c-ares DNS resolver currently.",
    "notImp": false
  },
  {
    "name": "query_timeout_seconds",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The number of seconds each name server is given to respond to a query on the first try of any given server.\n\n:::note\nWhile the c-ares library defaults to 2 seconds, Envoy's default (if this field is unset) is 5 seconds. This adjustment was made to maintain the previous behavior after users reported an increase in DNS resolution times.",
    "notImp": false
  },
  {
    "name": "query_tries",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The maximum number of query attempts the resolver will make before giving up. Each attempt may use a different name server.\n\n:::note\nWhile the c-ares library defaults to 3 attempts, Envoy's default (if this field is unset) is 4 attempts. This adjustment was made to maintain the previous behavior after users reported an increase in DNS resolution times.",
    "notImp": false
  },
  {
    "name": "rotate_nameservers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Enable round-robin selection of name servers for DNS resolution. When enabled, the resolver will cycle through the list of name servers for each resolution request. This can help distribute the query load across multiple name servers. If disabled (default), the resolver will try name servers in the order they are configured.\n\n:::note\nThis setting overrides any system configuration for name server rotation.",
    "notImp": false
  },
  {
    "name": "edns0_max_payload_size",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Maximum EDNS0 UDP payload size in bytes. If set, c-ares will include EDNS0 in DNS queries and use this value as the maximum UDP response size.\n\nRecommended values:\n\n* **1232**: Safe default (avoids fragmentation). * **4096**: Maximum allowed.\n\nIf unset, c-ares uses its internal default (usually 1232).",
    "notImp": false
  },
  {
    "name": "max_udp_channel_duration",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The maximum duration for which a UDP channel will be kept alive before being refreshed.\n\nIf set, the DNS resolver will periodically reinitialize its c-ares channel after the specified duration. This can help with avoiding stale socket states, and providing better load distribution across UDP ports.\n\nIf not specified, no periodic refresh will be performed.",
    "notImp": false
  }
] };

export const CaresDnsResolverConfig_SingleFields = [
  "use_resolvers_as_fallback",
  "filter_unroutable_families",
  "udp_max_queries",
  "query_timeout_seconds",
  "query_tries",
  "rotate_nameservers",
  "edns0_max_payload_size",
  "max_udp_channel_duration"
];