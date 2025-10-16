import {OutType} from '@elchi/tags/tagsType';


export const DnsFilterConfig_ServerContextConfig: OutType = { "DnsFilterConfig_ServerContextConfig": [
  {
    "name": "config_source.inline_dns_table",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "DnsTable",
    "enums": null,
    "comment": "Load the configuration specified from the control plane",
    "notImp": false
  },
  {
    "name": "config_source.external_dns_table",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "DataSource",
    "enums": null,
    "comment": "Seed the filter configuration from an external path. This source is a yaml formatted file that contains the DnsTable driving Envoy's responses to DNS queries",
    "notImp": false
  }
] };

export const DnsFilterConfig_ClientContextConfig: OutType = { "DnsFilterConfig_ClientContextConfig": [
  {
    "name": "resolver_timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Sets the maximum time we will wait for the upstream query to complete We allow 5s for the upstream resolution to complete, so the minimum value here is 1. Note that the total latency for a failed query is the number of retries multiplied by the resolver_timeout.",
    "notImp": false
  },
  {
    "name": "upstream_resolvers",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "Address[]",
    "enums": null,
    "comment": "This field was used for `dns_resolution_config` in Envoy 1.19.0 and 1.19.1. Control planes that need to set this field for Envoy 1.19.0 and 1.19.1 clients should fork the protobufs and change the field type to `DnsResolutionConfig`. Control planes that need to simultaneously support Envoy 1.18.x and Envoy 1.19.x should avoid Envoy 1.19.0 and 1.19.1.\n\n[#not-implemented-hide:]",
    "notImp": true
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
    "name": "max_pending_lookups",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Controls how many outstanding external lookup contexts the filter tracks. The context structure allows the filter to respond to every query even if the external resolution times out or is otherwise unsuccessful",
    "notImp": false
  }
] };

export const DnsFilterConfig_ClientContextConfig_SingleFields = [
  "resolver_timeout",
  "max_pending_lookups"
];

export const DnsFilterConfig: OutType = { "DnsFilterConfig": [
  {
    "name": "stat_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The stat prefix used when emitting DNS filter statistics",
    "notImp": false
  },
  {
    "name": "server_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DnsFilterConfig_ServerContextConfig",
    "enums": null,
    "comment": "Server context configuration contains the data that the filter uses to respond to DNS requests.",
    "notImp": false
  },
  {
    "name": "client_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DnsFilterConfig_ClientContextConfig",
    "enums": null,
    "comment": "Client context configuration controls Envoy's behavior when it must use external resolvers to answer a query. This object is optional and if omitted instructs the filter to resolve queries from the data in the server_config. Also, if ``client_config`` is omitted, here is the Envoy's behavior to create DNS resolver:\n\n1. If `typed_dns_resolver_config` is not empty, uses it.\n\n2. Otherwise, uses the default c-ares DNS resolver.",
    "notImp": false
  }
] };

export const DnsFilterConfig_SingleFields = [
  "stat_prefix"
];