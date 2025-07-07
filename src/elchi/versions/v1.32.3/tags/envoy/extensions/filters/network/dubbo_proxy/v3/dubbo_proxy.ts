import {OutType} from '@/elchi/tags/tagsType';


export const Drds: OutType = { "Drds": [
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
    "comment": "The name of the multiple route configuration. This allows to use different multiple route configurations. Tells which multiple route configuration should be fetched from the configuration source. Leave unspecified is also valid and means the unnamed multiple route configuration.",
    "notImp": false
  }
] };

export const Drds_SingleFields = [
  "route_config_name"
];

export const DubboProxy: OutType = { "DubboProxy": [
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
    "name": "protocol_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ProtocolType",
    "enums": [],
    "comment": "Configure the protocol used.",
    "notImp": false
  },
  {
    "name": "serialization_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SerializationType",
    "enums": [],
    "comment": "Configure the serialization protocol used.",
    "notImp": false
  },
  {
    "name": "route_config",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "RouteConfiguration[]",
    "enums": null,
    "comment": "The route table for the connection manager is static and is specified in this property.\n\n:::note\n\nThis field is deprecated. Please use ``drds`` or ``multiple_route_config`` first. \n:::",
    "notImp": false
  },
  {
    "name": "route_specifier.drds",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Drds",
    "enums": null,
    "comment": "Use xDS to fetch the route configuration. It is invalid to define both ``route_config`` and ``drds``.",
    "notImp": false
  },
  {
    "name": "route_specifier.multiple_route_config",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "MultipleRouteConfiguration",
    "enums": null,
    "comment": "[#next-free-field: 8]",
    "notImp": false
  },
  {
    "name": "dubbo_filters",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DubboFilter[]",
    "enums": null,
    "comment": "A list of individual Dubbo filters that make up the filter chain for requests made to the Dubbo proxy. Order matters as the filters are processed sequentially. For backwards compatibility, if no dubbo_filters are specified, a default Dubbo router filter (``envoy.filters.dubbo.router``) is used.",
    "notImp": false
  }
] };

export const DubboProxy_SingleFields = [
  "stat_prefix",
  "protocol_type",
  "serialization_type"
];

export const DubboFilter: OutType = { "DubboFilter": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the filter to instantiate. The name must match a supported filter.",
    "notImp": false
  },
  {
    "name": "config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "Filter specific configuration which depends on the filter being instantiated. See the supported filters for further documentation.",
    "notImp": false
  }
] };

export const DubboFilter_SingleFields = [
  "name"
];