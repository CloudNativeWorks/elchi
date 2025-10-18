import {OutType} from '@elchi/tags/tagsType';


export const DownstreamReverseConnectionSocketInterface: OutType = { "DownstreamReverseConnectionSocketInterface": [
  {
    "name": "stat_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Stat prefix to be used for downstream reverse connection socket interface stats.",
    "notImp": false
  },
  {
    "name": "enable_detailed_stats",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Enable detailed per-host and per-cluster statistics. When enabled, emits hidden statistics for individual hosts and clusters. Defaults to false.",
    "notImp": false
  }
] };

export const DownstreamReverseConnectionSocketInterface_SingleFields = [
  "stat_prefix",
  "enable_detailed_stats"
];