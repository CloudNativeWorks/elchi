import {OutType} from '@elchi/tags/tagsType';


export const DynamicModuleMatcher: OutType = { "DynamicModuleMatcher": [
  {
    "name": "dynamic_module_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DynamicModuleConfig",
    "enums": null,
    "comment": "Specifies the shared-object level configuration. This field is required.",
    "notImp": false
  },
  {
    "name": "matcher_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name for this matcher configuration. If not specified, defaults to an empty string.\n\nThis can be used to distinguish between different matcher implementations inside a dynamic module. For example, a module can have completely different matcher implementations (e.g., OAuth token matcher, geo-IP matcher). When Envoy receives this configuration, it passes the ``matcher_name`` to the dynamic module's matcher config init function together with the ``matcher_config``. That way a module can decide which in-module matcher implementation to use based on the name at load time.",
    "notImp": false
  },
  {
    "name": "matcher_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "The configuration for the matcher chosen by ``matcher_name``. If not specified, an empty configuration is passed to the module.\n\nThis is passed to the module's matcher initialization function. Together with the ``matcher_name``, the module can decide which in-module matcher implementation to use and fine-tune the behavior of the matcher.\n\n``google.protobuf.Struct`` is serialized as JSON before passing it to the module. ``google.protobuf.BytesValue`` and ``google.protobuf.StringValue`` are passed directly without the wrapper.",
    "notImp": false
  }
] };

export const DynamicModuleMatcher_SingleFields = [
  "matcher_name"
];