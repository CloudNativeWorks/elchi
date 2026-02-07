import {OutType} from '@elchi/tags/tagsType';


export const DynamicModuleAccessLog: OutType = { "DynamicModuleAccessLog": [
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
    "name": "logger_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name for this logger configuration. If not specified, defaults to an empty string.\n\nThis can be used to distinguish between different logger implementations inside a dynamic module. For example, a module can have completely different logger implementations (e.g., file logger, gRPC logger, metrics logger). When Envoy receives this configuration, it passes the ``logger_name`` to the dynamic module's access logger config init function together with the ``logger_config``. That way a module can decide which in-module logger implementation to use based on the name at load time.",
    "notImp": false
  },
  {
    "name": "logger_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "The configuration for the logger chosen by ``logger_name``. If not specified, an empty configuration is passed to the module.\n\nThis is passed to the module's access logger initialization function. Together with the ``logger_name``, the module can decide which in-module logger implementation to use and fine-tune the behavior of the logger.\n\nFor example, if a module has two logger implementations, one for file output and one for sending to an external service, ``logger_name`` is used to choose either file or external. The ``logger_config`` can be used to configure file paths, service endpoints, batching parameters, format strings, etc.\n\n``google.protobuf.Struct`` is serialized as JSON before passing it to the module. ``google.protobuf.BytesValue`` and ``google.protobuf.StringValue`` are passed directly without the wrapper.\n\n```yaml\n\n # Passing a JSON struct configuration\n logger_config:\n   \"@type\": \"type.googleapis.com/google.protobuf.Struct\"\n   value:\n     output_path: \"/var/log/envoy/access.log\"\n     format: \"json\"\n     buffer_size: 1000\n```\n\n # Passing a simple string configuration logger_config: \"@type\": \"type.googleapis.com/google.protobuf.StringValue\" value: \"/var/log/envoy/access.log\"",
    "notImp": false
  }
] };

export const DynamicModuleAccessLog_SingleFields = [
  "logger_name"
];