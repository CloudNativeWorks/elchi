import {OutType} from '@elchi/tags/tagsType';


export const DynamicModuleTracer: OutType = { "DynamicModuleTracer": [
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
    "name": "tracer_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name for this tracer configuration. If not specified, defaults to an empty string.\n\nThis can be used to distinguish between different tracer implementations inside a dynamic module. For example, a module can have completely different tracer implementations (e.g., Zipkin-compatible, OpenTelemetry-compatible). When Envoy receives this configuration, it passes the ``tracer_name`` to the dynamic module's tracer config init function together with the ``tracer_config``. That way a module can decide which in-module tracer implementation to use based on the name at load time.",
    "notImp": false
  },
  {
    "name": "tracer_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "The configuration for the tracer chosen by ``tracer_name``. If not specified, an empty configuration is passed to the module.\n\nThis is passed to the module's tracer initialization function. Together with the ``tracer_name``, the module can decide which in-module tracer implementation to use and fine-tune the behavior of the tracer.\n\n``google.protobuf.Struct`` is serialized as JSON before passing it to the module. ``google.protobuf.BytesValue`` and ``google.protobuf.StringValue`` are passed directly without the wrapper.\n\n```yaml\n\n # Passing a JSON struct configuration\n tracer_config:\n   \"@type\": \"type.googleapis.com/google.protobuf.Struct\"\n   value:\n     endpoint: \"http://tracing-backend:9411/api/v2/spans\"\n     sample_rate: 0.1\n```\n\n # Passing a simple string configuration tracer_config: \"@type\": \"type.googleapis.com/google.protobuf.StringValue\" value: \"http://tracing-backend:9411\"",
    "notImp": false
  }
] };

export const DynamicModuleTracer_SingleFields = [
  "tracer_name"
];