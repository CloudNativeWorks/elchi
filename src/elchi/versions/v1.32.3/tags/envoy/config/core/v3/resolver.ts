import {OutType} from '@/elchi/tags/tagsType';


export const DnsResolverOptions: OutType = { "DnsResolverOptions": [
  {
    "name": "use_tcp_for_dns_lookups",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Use TCP for all DNS queries instead of the default protocol UDP.",
    "notImp": false
  },
  {
    "name": "no_default_search_domain",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Do not use the default search domains; only query hostnames as-is or as aliases.",
    "notImp": false
  }
] };

export const DnsResolverOptions_SingleFields = [
  "use_tcp_for_dns_lookups",
  "no_default_search_domain"
];

export const DnsResolutionConfig: OutType = { "DnsResolutionConfig": [
  {
    "name": "resolvers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Address[]",
    "enums": null,
    "comment": "A list of dns resolver addresses. If specified, the DNS client library will perform resolution via the underlying DNS resolvers. Otherwise, the default system resolvers (e.g., /etc/resolv.conf) will be used.",
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
  }
] };