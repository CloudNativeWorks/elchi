import {OutType} from '@elchi/tags/tagsType';


export const MetricConfig: OutType = { "MetricConfig": [
  {
    "name": "dimensions",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, string>",
    "enums": null,
    "comment": "(Optional) Collection of tag names and tag expressions to include in the metric. Conflicts are resolved by the tag name by overriding previously supplied values.",
    "notImp": false
  },
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "(Optional) Metric name to restrict the override to a metric. If not specified, applies to all.",
    "notImp": false
  },
  {
    "name": "tags_to_remove",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "(Optional) A list of tags to remove.",
    "notImp": false
  },
  {
    "name": "match",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "NOT IMPLEMENTED. (Optional) Conditional enabling the override.",
    "notImp": false
  },
  {
    "name": "drop",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "(Optional) If this is set to true, the metric(s) selected by this configuration will not be generated or reported.",
    "notImp": false
  }
] };

export const MetricConfig_SingleFields = [
  "name",
  "tags_to_remove",
  "match",
  "drop"
];

export const MetricConfig_DimensionsEntry: OutType = { "MetricConfig_DimensionsEntry": [
  {
    "name": "key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const MetricConfig_DimensionsEntry_SingleFields = [
  "key",
  "value"
];

export const MetricDefinition: OutType = { "MetricDefinition": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Metric name.",
    "notImp": false
  },
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Metric value expression.",
    "notImp": false
  },
  {
    "name": "type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "MetricType",
    "enums": [
      "COUNTER",
      "GAUGE",
      "HISTOGRAM"
    ],
    "comment": "Metric type.",
    "notImp": false
  }
] };

export const MetricDefinition_SingleFields = [
  "name",
  "value",
  "type"
];

export const PluginConfig: OutType = { "PluginConfig": [
  {
    "name": "disable_host_header_fallback",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Optional: Disable using host header as a fallback if destination service is not available from the control plane. Disable the fallback if the host header originates outsides the mesh, like at ingress.",
    "notImp": false
  },
  {
    "name": "tcp_reporting_duration",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Optional. Allows configuration of the time between calls out to for TCP metrics reporting. The default duration is ``5s``.",
    "notImp": false
  },
  {
    "name": "metrics",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "MetricConfig[]",
    "enums": null,
    "comment": "Metric overrides.",
    "notImp": false
  },
  {
    "name": "definitions",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "MetricDefinition[]",
    "enums": null,
    "comment": "Metric definitions.",
    "notImp": false
  },
  {
    "name": "reporter",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Reporter",
    "enums": [
      "UNSPECIFIED",
      "SERVER_GATEWAY"
    ],
    "comment": "Proxy deployment type.",
    "notImp": false
  },
  {
    "name": "rotation_interval",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Metric scope rotation interval. Set to 0 to disable the metric scope rotation. Defaults to 0. DEPRECATED.",
    "notImp": false
  },
  {
    "name": "graceful_deletion_interval",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Metric expiry graceful deletion interval. No-op if the metric rotation is disabled. Defaults to 5m. Must be >=1s. DEPRECATED.",
    "notImp": false
  }
] };

export const PluginConfig_SingleFields = [
  "disable_host_header_fallback",
  "tcp_reporting_duration",
  "reporter",
  "rotation_interval",
  "graceful_deletion_interval"
];