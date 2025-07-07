import {OutType} from '@/elchi/tags/tagsType';


export const CaresDnsResolverConfig: OutType = { "CaresDnsResolverConfig": [
  {
    "name": "resolvers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Address[]",
    "enums": null,
    "comment": "A list of dns resolver addresses. `use_resolvers_as_fallback` below dictates if the DNS client should override system defaults or only use the provided resolvers if the system defaults are not available, i.e., as a fallback.",
    "notImp": false
  },
  {
    "name": "use_resolvers_as_fallback",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true use the resolvers listed in the `resolvers` field only if c-ares is unable to obtain a nameserver from the system (e.g., /etc/resolv.conf). Otherwise, the resolvers listed in the resolvers list will override the default system resolvers. Defaults to false.",
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
    "comment": "This option allows for number of UDP based DNS queries to be capped. Note, this is only applicable to c-ares DNS resolver currently.",
    "notImp": false
  }
] };

export const CaresDnsResolverConfig_SingleFields = [
  "use_resolvers_as_fallback",
  "filter_unroutable_families",
  "udp_max_queries"
];