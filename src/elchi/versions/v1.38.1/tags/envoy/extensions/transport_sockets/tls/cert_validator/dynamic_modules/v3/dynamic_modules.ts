import {OutType} from '@elchi/tags/tagsType';


export const DynamicModuleCertValidatorConfig: OutType = { "DynamicModuleCertValidatorConfig": [
  {
    "name": "dynamic_module_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DynamicModuleConfig",
    "enums": null,
    "comment": "Dynamic module configuration. See `dynamic module configuration` for details.",
    "notImp": false
  },
  {
    "name": "validator_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the cert validator implementation in the dynamic module. This is passed to the module's ``envoy_dynamic_module_on_cert_validator_config_new`` function.",
    "notImp": false
  },
  {
    "name": "validator_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "Optional configuration for the cert validator. This is passed as bytes to the dynamic module.",
    "notImp": false
  }
] };

export const DynamicModuleCertValidatorConfig_SingleFields = [
  "validator_name"
];