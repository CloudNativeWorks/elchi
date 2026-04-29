import {OutType} from '@elchi/tags/tagsType';


export const DynamicModulesLoadBalancerConfig: OutType = { "DynamicModulesLoadBalancerConfig": [
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
    "name": "lb_policy_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name to identify the load balancer implementation within the module. This is passed to the module's ``envoy_dynamic_module_on_lb_config_new`` function.",
    "notImp": false
  },
  {
    "name": "lb_policy_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "The configuration for the module's load balancer implementation. This is passed to the module's ``envoy_dynamic_module_on_lb_config_new`` function. The configuration can be any protobuf message. However, it is recommended to use ``google.protobuf.Struct``, ``google.protobuf.StringValue``, or ``google.protobuf.BytesValue``. These types are passed directly as bytes to the module, so the module does not need to have knowledge of protobuf encoding. Otherwise, the serialized bytes of the type are passed. If not specified, an empty configuration is passed.",
    "notImp": false
  }
] };

export const DynamicModulesLoadBalancerConfig_SingleFields = [
  "lb_policy_name"
];