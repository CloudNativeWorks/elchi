import {OutType} from '@/elchi/tags/tagsType';


export const ScopedRouteConfiguration_Key: OutType = { "ScopedRouteConfiguration_Key": [
  {
    "name": "fragments",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ScopedRouteConfiguration_Key_Fragment[]",
    "enums": null,
    "comment": "The ordered set of fragments to match against. The order must match the fragments in the corresponding `scope_key_builder`.",
    "notImp": false
  }
] };

export const ScopedRouteConfiguration: OutType = { "ScopedRouteConfiguration": [
  {
    "name": "on_demand",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether the RouteConfiguration should be loaded on demand.",
    "notImp": false
  },
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name assigned to the routing scope.",
    "notImp": false
  },
  {
    "name": "route_configuration_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The resource name to use for a `envoy_v3_api_msg_service.discovery.v3.DiscoveryRequest` to an RDS server to fetch the `envoy_v3_api_msg_config.route.v3.RouteConfiguration` associated with this scope.",
    "notImp": false
  },
  {
    "name": "route_configuration",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RouteConfiguration",
    "enums": null,
    "comment": "The `envoy_v3_api_msg_config.route.v3.RouteConfiguration` associated with the scope.",
    "notImp": false
  },
  {
    "name": "key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ScopedRouteConfiguration_Key",
    "enums": null,
    "comment": "The key to match against.",
    "notImp": false
  }
] };

export const ScopedRouteConfiguration_SingleFields = [
  "on_demand",
  "name",
  "route_configuration_name"
];

export const ScopedRouteConfiguration_Key_Fragment: OutType = { "ScopedRouteConfiguration_Key_Fragment": [
  {
    "name": "type.string_key",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "A string to match against.",
    "notImp": false
  }
] };

export const ScopedRouteConfiguration_Key_Fragment_SingleFields = [
  "type.string_key"
];