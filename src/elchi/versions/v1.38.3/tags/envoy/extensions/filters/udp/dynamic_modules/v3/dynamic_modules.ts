import {OutType} from '@elchi/tags/tagsType';


export const DynamicModuleUdpListenerFilter: OutType = { "DynamicModuleUdpListenerFilter": [
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
    "name": "filter_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name for this filter configuration.\n\nThis can be used to distinguish between different filter implementations inside a dynamic module. For example, a module can have completely different filter implementations. When Envoy receives this configuration, it passes the ``filter_name`` to the dynamic module's UDP listener filter config init function together with the ``filter_config``. That way a module can decide which in-module filter implementation to use based on the name at load time.",
    "notImp": false
  },
  {
    "name": "filter_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "The configuration for the filter chosen by ``filter_name``.\n\nThis is passed to the module's UDP listener filter initialization function. Together with the ``filter_name``, the module can decide which in-module filter implementation to use and fine-tune the behavior of the filter.\n\nFor example, if a module has two filter implementations, one for echo and one for rate limiting, ``filter_name`` is used to choose either echo or rate limiting. The ``filter_config`` can be used to configure the echo behavior or the rate limiting parameters.\n\n``google.protobuf.Struct`` is serialized as JSON before passing it to the module. ``google.protobuf.BytesValue`` and ``google.protobuf.StringValue`` are passed directly without the wrapper.\n\n```yaml\n\n # Passing a string value\n filter_config:\n   \"@type\": \"type.googleapis.com/google.protobuf.StringValue\"\n   value: hello\n```\n\n # Passing raw bytes filter_config: \"@type\": \"type.googleapis.com/google.protobuf.BytesValue\" value: aGVsbG8=  # echo -n \"hello\" | base64",
    "notImp": false
  }
] };

export const DynamicModuleUdpListenerFilter_SingleFields = [
  "filter_name"
];