import {OutType} from '@elchi/tags/tagsType';


export const GenericProxy: OutType = { "GenericProxy": [
  {
    "name": "stat_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The human readable prefix to use when emitting statistics.",
    "notImp": false
  },
  {
    "name": "codec_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "The codec which encodes and decodes the application protocol. extension-category: envoy.generic_proxy.codecs",
    "notImp": false
  },
  {
    "name": "route_specifier.generic_rds",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "GenericRds",
    "enums": null,
    "comment": "The generic proxies route table will be dynamically loaded via the meta RDS API.",
    "notImp": false
  },
  {
    "name": "route_specifier.route_config",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RouteConfiguration",
    "enums": null,
    "comment": "The route table for the generic proxy is static and is specified in this property.",
    "notImp": false
  },
  {
    "name": "filters",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig[]",
    "enums": null,
    "comment": "A list of individual Layer-7 filters that make up the filter chain for requests made to the proxy. Order matters as the filters are processed sequentially as request events happen. extension-category: envoy.generic_proxy.filters",
    "notImp": false
  },
  {
    "name": "tracing",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HttpConnectionManager_Tracing",
    "enums": null,
    "comment": "Tracing configuration for the generic proxy.",
    "notImp": false
  },
  {
    "name": "access_log",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "AccessLog[]",
    "enums": null,
    "comment": "Configuration for `access logs` emitted by generic proxy.",
    "notImp": false
  }
] };

export const GenericProxy_SingleFields = [
  "stat_prefix"
];

export const GenericRds: OutType = { "GenericRds": [
  {
    "name": "config_source",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ConfigSource",
    "enums": null,
    "comment": "Configuration source specifier for RDS.",
    "notImp": false
  },
  {
    "name": "route_config_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the route configuration. This name will be passed to the RDS API. This allows an Envoy configuration with multiple generic proxies to use different route configurations.",
    "notImp": false
  }
] };

export const GenericRds_SingleFields = [
  "route_config_name"
];