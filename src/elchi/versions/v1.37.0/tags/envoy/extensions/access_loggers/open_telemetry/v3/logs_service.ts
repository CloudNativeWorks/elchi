import {OutType} from '@elchi/tags/tagsType';


export const OpenTelemetryAccessLogConfig: OutType = { "OpenTelemetryAccessLogConfig": [
  {
    "name": "common_config",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "CommonGrpcAccessLogConfig",
    "enums": null,
    "comment": "Deprecated. Use ``grpc_service`` or ``http_service`` instead.",
    "notImp": false
  },
  {
    "name": "http_service",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HttpService",
    "enums": null,
    "comment": "The upstream HTTP cluster that will receive OTLP logs via `OTLP/HTTP <https://opentelemetry.io/docs/specs/otlp/#otlphttp>`_. Note: Only one of ``common_config``, ``grpc_service``, or ``http_service`` may be used.\n\n:::note\n\nThe ``request_headers_to_add`` property in the OTLP HTTP exporter service does not support the `format specifier` as used for `HTTP access logging`. The values configured are added as HTTP headers on the OTLP export request without any formatting applied.",
    "notImp": false
  },
  {
    "name": "grpc_service",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "GrpcService",
    "enums": null,
    "comment": "The upstream gRPC cluster that will receive OTLP logs. Note: Only one of ``common_config``, ``grpc_service``, or ``http_service`` may be used. This field is preferred over ``common_config.grpc_service``.",
    "notImp": false
  },
  {
    "name": "disable_builtin_labels",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If specified, Envoy will not generate built-in resource labels like ``log_name``, ``zone_name``, ``cluster_name``, ``node_name``.",
    "notImp": false
  },
  {
    "name": "resource_attributes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "KeyValueList",
    "enums": null,
    "comment": "OpenTelemetry `Resource <https://github.com/open-telemetry/opentelemetry-proto/blob/main/opentelemetry/proto/logs/v1/logs.proto#L51>`_ attributes are filled with Envoy node info. Example: ``resource_attributes { values { key: \"region\" value { string_value: \"cn-north-7\" } } }``.",
    "notImp": false
  },
  {
    "name": "body",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "AnyValue",
    "enums": null,
    "comment": "OpenTelemetry `LogResource <https://github.com/open-telemetry/opentelemetry-proto/blob/main/opentelemetry/proto/logs/v1/logs.proto>`_ fields, following `Envoy access logging formatting <https://www.envoyproxy.io/docs/envoy/latest/configuration/observability/access_log/usage>`_.\n\nSee 'body' in the LogResource proto for more details. Example: ``body { string_value: \"%PROTOCOL%\" }``.",
    "notImp": false
  },
  {
    "name": "attributes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "KeyValueList",
    "enums": null,
    "comment": "See 'attributes' in the LogResource proto for more details. Example: ``attributes { values { key: \"user_agent\" value { string_value: \"%REQ(USER-AGENT)%\" } } }``.",
    "notImp": false
  },
  {
    "name": "stat_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Optional. Additional prefix to use on OpenTelemetry access logger stats. If empty, the stats will be rooted at ``access_logs.open_telemetry_access_log.``. If non-empty, stats will be rooted at ``access_logs.open_telemetry_access_log.<stat_prefix>.``.",
    "notImp": false
  },
  {
    "name": "formatters",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig[]",
    "enums": null,
    "comment": "Specifies a collection of Formatter plugins that can be called from the access log configuration. See the formatters extensions documentation for details. extension-category: envoy.formatter",
    "notImp": false
  },
  {
    "name": "log_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "buffer_flush_interval",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The interval for flushing access logs to the transport. Default: 1 second.",
    "notImp": false
  },
  {
    "name": "buffer_size_bytes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Soft size limit in bytes for the access log buffer. When the buffer exceeds this limit, logs will be flushed. Default: 16KB.",
    "notImp": false
  },
  {
    "name": "filter_state_objects_to_log",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Additional filter state objects to log as attributes.",
    "notImp": false
  },
  {
    "name": "custom_tags",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CustomTag[]",
    "enums": null,
    "comment": "Custom tags to include as log attributes.",
    "notImp": false
  }
] };

export const OpenTelemetryAccessLogConfig_SingleFields = [
  "disable_builtin_labels",
  "stat_prefix",
  "log_name",
  "buffer_flush_interval",
  "buffer_size_bytes",
  "filter_state_objects_to_log"
];