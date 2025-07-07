import {OutType} from '@/elchi/tags/tagsType';


export const Trds: OutType = { "Trds": [
  {
    "name": "config_source",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ConfigSource",
    "enums": null,
    "comment": "Configuration source specifier. In case of ``api_config_source`` only aggregated ``api_type`` is supported.",
    "notImp": false
  },
  {
    "name": "route_config_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the route configuration. This allows to use different route configurations. Tells which route configuration should be fetched from the configuration source. Leave unspecified is also valid and means the unnamed route configuration.",
    "notImp": false
  }
] };

export const Trds_SingleFields = [
  "route_config_name"
];

export const ThriftProxy: OutType = { "ThriftProxy": [
  {
    "name": "transport",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TransportType",
    "enums": [
      "AUTO_TRANSPORT",
      "FRAMED",
      "UNFRAMED",
      "HEADER"
    ],
    "comment": "Supplies the type of transport that the Thrift proxy should use. Defaults to `AUTO_TRANSPORT`.",
    "notImp": false
  },
  {
    "name": "protocol",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ProtocolType",
    "enums": [
      "AUTO_PROTOCOL",
      "BINARY",
      "LAX_BINARY",
      "COMPACT",
      "TWITTER"
    ],
    "comment": "Supplies the type of protocol that the Thrift proxy should use. Defaults to `AUTO_PROTOCOL`.",
    "notImp": false
  },
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
    "name": "route_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RouteConfiguration",
    "enums": null,
    "comment": "The route table for the connection manager is static and is specified in this property. It is invalid to define both ``route_config`` and ``trds``.",
    "notImp": false
  },
  {
    "name": "trds",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Trds",
    "enums": null,
    "comment": "Use xDS to fetch the route configuration. It is invalid to define both ``route_config`` and ``trds``.",
    "notImp": false
  },
  {
    "name": "thrift_filters",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ThriftFilter[]",
    "enums": null,
    "comment": "A list of individual Thrift filters that make up the filter chain for requests made to the Thrift proxy. Order matters as the filters are processed sequentially. For backwards compatibility, if no thrift_filters are specified, a default Thrift router filter (``envoy.filters.thrift.router``) is used. extension-category: envoy.thrift_proxy.filters",
    "notImp": false
  },
  {
    "name": "payload_passthrough",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set to true, Envoy will try to skip decode data after metadata in the Thrift message. This mode will only work if the upstream and downstream protocols are the same and the transports are Framed or Header, and the protocol is not Twitter. Otherwise Envoy will fallback to decode the data.",
    "notImp": false
  },
  {
    "name": "max_requests_per_connection",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Optional maximum requests for a single downstream connection. If not specified, there is no limit.",
    "notImp": false
  },
  {
    "name": "access_log",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "AccessLog[]",
    "enums": null,
    "comment": "Configuration for `access logs` emitted by Thrift proxy.",
    "notImp": false
  },
  {
    "name": "header_keys_preserve_case",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set to true, Envoy will preserve the case of Thrift header keys instead of serializing them to lower case as per the default behavior. Note that NUL, CR and LF characters will also be preserved as mandated by the Thrift spec.\n\nMore info: https://github.com/apache/thrift/commit/e165fa3c85d00cb984f4d9635ed60909a1266ce1.",
    "notImp": false
  }
] };

export const ThriftProxy_SingleFields = [
  "transport",
  "protocol",
  "stat_prefix",
  "payload_passthrough",
  "max_requests_per_connection",
  "header_keys_preserve_case"
];

export const ThriftFilter: OutType = { "ThriftFilter": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the filter to instantiate. The name must match a supported filter. The built-in filters are:\n\n * `envoy.filters.thrift.router` * `envoy.filters.thrift.rate_limit`",
    "notImp": false
  },
  {
    "name": "config_type.typed_config",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "Filter specific configuration which depends on the filter being instantiated. See the supported filters for further documentation.",
    "notImp": false
  }
] };

export const ThriftFilter_SingleFields = [
  "name"
];

export const ThriftProtocolOptions: OutType = { "ThriftProtocolOptions": [
  {
    "name": "transport",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TransportType",
    "enums": [
      "AUTO_TRANSPORT",
      "FRAMED",
      "UNFRAMED",
      "HEADER"
    ],
    "comment": "Supplies the type of transport that the Thrift proxy should use for upstream connections. Selecting `AUTO_TRANSPORT`, which is the default, causes the proxy to use the same transport as the downstream connection.",
    "notImp": false
  },
  {
    "name": "protocol",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ProtocolType",
    "enums": [
      "AUTO_PROTOCOL",
      "BINARY",
      "LAX_BINARY",
      "COMPACT",
      "TWITTER"
    ],
    "comment": "Supplies the type of protocol that the Thrift proxy should use for upstream connections. Selecting `AUTO_PROTOCOL`, which is the default, causes the proxy to use the same protocol as the downstream connection.",
    "notImp": false
  }
] };

export const ThriftProtocolOptions_SingleFields = [
  "transport",
  "protocol"
];