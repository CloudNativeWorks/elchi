import {OutType} from '@elchi/tags/tagsType';


export const DownstreamReverseConnectionSocketInterface_HttpHandshakeConfig: OutType = { "DownstreamReverseConnectionSocketInterface_HttpHandshakeConfig": [
  {
    "name": "request_path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Request path used when issuing the HTTP reverse-connection handshake. Defaults to \"/reverse_connections/request\".",
    "notImp": false
  }
] };

export const DownstreamReverseConnectionSocketInterface_HttpHandshakeConfig_SingleFields = [
  "request_path"
];

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
    "comment": "Enable detailed per-host and per-cluster statistics. When enabled, emits hidden statistics for individual hosts and clusters. Defaults to ``false``.",
    "notImp": false
  },
  {
    "name": "http_handshake",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DownstreamReverseConnectionSocketInterface_HttpHandshakeConfig",
    "enums": null,
    "comment": "Optional HTTP handshake configuration. When unset, the initiator envoy uses the defaults provided by ``HttpHandshakeConfig``.",
    "notImp": false
  }
] };

export const DownstreamReverseConnectionSocketInterface_SingleFields = [
  "stat_prefix",
  "enable_detailed_stats"
];