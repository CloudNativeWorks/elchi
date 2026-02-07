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
    "comment": "The token bucket configuration to use for rate limiting connections that are processed by the filter's filter chain. Each incoming connection processed by the filter consumes a single token. If the token is available, the connection will be allowed. If no tokens are available, the connection will be immediately closed.\n\n:::note\nIn the current implementation each filter and filter chain has an independent rate limit, unless a shared rate limit is configured via `share_key`. \n:::\n\n:::note\nIn the current implementation the token bucket's `fill_interval` must be >= 50ms to avoid too aggressive refills.",
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
  },
  {
    "name": "share_key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Specifies that the token bucket used for rate limiting should be shared with other local_rate_limit filters with a matching `token_bucket` and ``share_key`` configuration. All fields of ``token_bucket`` must match exactly for the token bucket to be shared. If this field is empty, this filter will not share a token bucket with any other filter.",
    "notImp": false
  }
] };

export const LocalRateLimit_SingleFields = [
  "stat_prefix",
  "share_key"
];