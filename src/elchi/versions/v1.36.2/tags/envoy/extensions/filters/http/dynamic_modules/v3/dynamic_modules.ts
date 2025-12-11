import {OutType} from '@elchi/tags/tagsType';


export const DynamicModuleFilter: OutType = { "DynamicModuleFilter": [
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
    "comment": "The name for this filter configuration. This can be used to distinguish between different filter implementations inside a dynamic module. For example, a module can have completely different filter implementations. When Envoy receives this configuration, it passes the filter_name to the dynamic module's HTTP filter config init function together with the filter_config. That way a module can decide which in-module filter implementation to use based on the name at load time.",
    "notImp": false
  },
  {
    "name": "filter_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "The configuration for the filter chosen by filter_name. This is passed to the module's HTTP filter initialization function. Together with the filter_name, the module can decide which in-module filter implementation to use and fine-tune the behavior of the filter.\n\nFor example, if a module has two filter implementations, one for logging and one for header manipulation, filter_name is used to choose either logging or header manipulation. The filter_config can be used to configure the logging level or the header manipulation behavior.\n\n``google.protobuf.Struct`` is serialized as JSON before passing it to the plugin. ``google.protobuf.BytesValue`` and ``google.protobuf.StringValue`` are passed directly without the wrapper.\n\n```yaml\n\n # Passing in a string\n filter_config:\n   \"@type\": \"type.googleapis.com/google.protobuf.StringValue\"\n   value: hello\n```\n\n # Passing in raw bytes filter_config: \"@type\": \"type.googleapis.com/google.protobuf.BytesValue\" value: aGVsbG8= # echo -n \"hello\" | base64",
    "notImp": false
  },
  {
    "name": "terminal_filter",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Set true if the dynamic module is a terminal filter to use without an upstream. The dynamic module is responsible for creating and sending the response to downstream.",
    "notImp": false
  }
] };

export const DynamicModuleFilter_SingleFields = [
  "filter_name",
  "terminal_filter"
];

export const DynamicModuleFilterPerRoute: OutType = { "DynamicModuleFilterPerRoute": [
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
    "name": "per_route_config_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name for this filter configuration. This can be used to distinguish between different filter implementations inside a dynamic module. For example, a module can have completely different filter implementations. When Envoy receives this configuration, it passes the filter_name to the dynamic module's HTTP per-route filter config init function together with the filter_config. That way a module can decide which in-module filter implementation to use based on the name at load time.",
    "notImp": false
  },
  {
    "name": "filter_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "The configuration for the filter chosen by filter_name. This is passed to the module's HTTP per-route filter initialization function. Together with the filter_name, the module can decide which in-module filter implementation to use and fine-tune the behavior of the filter on a specific route.\n\nFor example, if a module has two filter implementations, one for logging and one for header manipulation, filter_name is used to choose either logging or header manipulation. The filter_config can be used to configure the logging level or the header manipulation behavior.\n\n``google.protobuf.Struct`` is serialized as JSON before passing it to the plugin. ``google.protobuf.BytesValue`` and ``google.protobuf.StringValue`` are passed directly without the wrapper.\n\n```yaml\n\n # Passing in a string\n filter_config:\n   \"@type\": \"type.googleapis.com/google.protobuf.StringValue\"\n   value: hello\n```\n\n # Passing in raw bytes filter_config: \"@type\": \"type.googleapis.com/google.protobuf.BytesValue\" value: aGVsbG8= # echo -n \"hello\" | base64",
    "notImp": false
  }
] };

export const DynamicModuleFilterPerRoute_SingleFields = [
  "per_route_config_name"
];