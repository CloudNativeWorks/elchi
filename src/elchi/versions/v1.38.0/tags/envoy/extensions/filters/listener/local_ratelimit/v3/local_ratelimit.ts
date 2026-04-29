import {OutType} from '@elchi/tags/tagsType';


export const LocalRateLimit: OutType = { "LocalRateLimit": [
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
    "name": "token_bucket",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TokenBucket",
    "enums": null,
    "comment": "The token bucket configuration to use for rate limiting all incoming sockets. If the token is available, the socket will be allowed. If no tokens are available, the socket will be immediately closed.\n\n:::note\nIn the current implementation the token bucket's `fill_interval` must be >= 50ms to avoid too aggressive refills.",
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

export const LocalRateLimit_SingleFields = [
  "stat_prefix"
];