import {OutType} from '@elchi/tags/tagsType';


export const ConnectionLimit: OutType = { "ConnectionLimit": [
  {
    "name": "stat_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The prefix to use when emitting `statistics`.",
    "notImp": false
  },
  {
    "name": "max_connections",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The max connections configuration to use for new incoming connections that are processed by the filter's filter chain. When max_connection is reached, the incoming connection will be closed after delay duration.",
    "notImp": false
  },
  {
    "name": "delay",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The delay configuration to use for rejecting the connection after some specified time duration instead of immediately rejecting the connection. That way, a malicious user is not able to retry as fast as possible which provides a better DoS protection for Envoy. If this is not present, the connection will be closed immediately.",
    "notImp": false
  },
  {
    "name": "runtime_enabled",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RuntimeFeatureFlag",
    "enums": null,
    "comment": "Runtime flag that controls whether the filter is enabled or not. If not specified, defaults to enabled.",
    "notImp": false
  }
] };

export const ConnectionLimit_SingleFields = [
  "stat_prefix",
  "max_connections",
  "delay"
];