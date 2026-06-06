import {OutType} from '@elchi/tags/tagsType';


export const Config: OutType = { "Config": [
  {
    "name": "dynamic_module_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DynamicModuleConfig",
    "enums": null,
    "comment": "The dynamic module configuration.",
    "notImp": false
  },
  {
    "name": "bridge_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name to identify the bridge implementation within the module. This is passed to the module's ``envoy_dynamic_module_on_upstream_http_tcp_bridge_config_new`` function.",
    "notImp": false
  },
  {
    "name": "bridge_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "The configuration for the module's bridge implementation. This is passed to the module's ``envoy_dynamic_module_on_upstream_http_tcp_bridge_config_new`` function. The configuration can be any protobuf message. However, it is recommended to use ``google.protobuf.Struct``, ``google.protobuf.StringValue``, or ``google.protobuf.BytesValue``. These types are passed directly as bytes to the module, so the module does not need to have knowledge of protobuf encoding. Otherwise, the serialized bytes of the type are passed. If not specified, an empty configuration is passed.",
    "notImp": false
  }
] };

export const Config_SingleFields = [
  "bridge_name"
];