import {OutType} from '@elchi/tags/tagsType';


export const DynamicModuleBootstrapExtension: OutType = { "DynamicModuleBootstrapExtension": [
  {
    "name": "dynamic_module_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DynamicModuleConfig",
    "enums": null,
    "comment": "Specifies the shared-object level configuration.",
    "notImp": false
  },
  {
    "name": "extension_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name for this extension configuration.\n\nThis can be used to distinguish between different extension implementations inside a dynamic module. For example, a module can have completely different extension implementations. When Envoy receives this configuration, it passes the ``extension_name`` to the dynamic module's bootstrap extension config init function together with the ``extension_config``. That way a module can decide which in-module extension implementation to use based on the name at load time.\n\nIf not specified, defaults to an empty string.",
    "notImp": false
  },
  {
    "name": "extension_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "The configuration for the extension chosen by ``extension_name``.\n\nThis is passed to the module's bootstrap extension initialization function. Together with the ``extension_name``, the module can decide which in-module extension implementation to use and fine-tune the behavior of the extension.\n\nFor example, if a module has two extension implementations, one for configuration loading and one for metric initialization, ``extension_name`` is used to choose the implementation. The ``extension_config`` can be used to configure the specific behavior of each implementation.\n\n``google.protobuf.Struct`` is serialized as JSON before passing it to the module. ``google.protobuf.BytesValue`` and ``google.protobuf.StringValue`` are passed directly without the wrapper.\n\n```yaml\n\n # Passing a string value\n extension_config:\n   \"@type\": \"type.googleapis.com/google.protobuf.StringValue\"\n   value: hello\n```\n\n # Passing raw bytes extension_config: \"@type\": \"type.googleapis.com/google.protobuf.BytesValue\" value: aGVsbG8=  # echo -n \"hello\" | base64",
    "notImp": false
  }
] };

export const DynamicModuleBootstrapExtension_SingleFields = [
  "extension_name"
];