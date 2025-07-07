import {OutType} from '@/elchi/tags/tagsType';


export const OpenTelemetryAccessLogConfig: OutType = { "OpenTelemetryAccessLogConfig": [
  {
    "name": "common_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CommonGrpcAccessLogConfig",
    "enums": null,
    "comment": "",
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
  }
] };

export const OpenTelemetryAccessLogConfig_SingleFields = [
  "disable_builtin_labels",
  "stat_prefix"
];