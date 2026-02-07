import {OutType} from '@elchi/tags/tagsType';


export const UpstreamReverseConnectionSocketInterface: OutType = { "UpstreamReverseConnectionSocketInterface": [
  {
    "name": "stat_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Stat prefix for upstream reverse connection socket interface stats.",
    "notImp": false
  },
  {
    "name": "ping_failure_threshold",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Number of consecutive ping failures before an idle reverse connection socket is marked dead. Defaults to 3 if unset. Must be at least 1.",
    "notImp": false
  },
  {
    "name": "enable_detailed_stats",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Enable detailed per-node and per-cluster statistics. When enabled, emits hidden statistics for individual nodes and clusters. Defaults to false.",
    "notImp": false
  },
  {
    "name": "reporter_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "Optional configuration for a tunnel reporting extension. When provided, the socket interface instantiates a reporter via the configured factory. If unset, no reporting is done.",
    "notImp": false
  }
] };

export const UpstreamReverseConnectionSocketInterface_SingleFields = [
  "stat_prefix",
  "ping_failure_threshold",
  "enable_detailed_stats"
];