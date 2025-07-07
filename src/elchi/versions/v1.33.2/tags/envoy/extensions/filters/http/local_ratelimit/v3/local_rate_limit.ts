import {OutType} from '@elchi/tags/tagsType';


export const LocalRateLimit: OutType = { "LocalRateLimit": [
  {
    "name": "stat_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The human readable prefix to use when emitting stats.",
    "notImp": false
  },
  {
    "name": "status",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HttpStatus",
    "enums": null,
    "comment": "This field allows for a custom HTTP response status code to the downstream client when the request has been rate limited. Defaults to 429 (TooManyRequests).\n\n:::note\nIf this is set to < 400, 429 will be used instead.",
    "notImp": false
  },
  {
    "name": "token_bucket",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TokenBucket",
    "enums": null,
    "comment": "The token bucket configuration to use for rate limiting requests that are processed by this filter. Each request processed by the filter consumes a single token. If the token is available, the request will be allowed. If no tokens are available, the request will receive the configured rate limit status.\n\n:::note\nIt's fine for the token bucket to be unset for the global configuration since the rate limit can be applied at a the virtual host or route level. Thus, the token bucket must be set for the per route configuration otherwise the config will be rejected. \n:::\n\n:::note\nWhen using per route configuration, the bucket becomes unique to that route. \n:::\n\n:::note\nIn the current implementation the token bucket's `fill_interval` must be >= 50ms to avoid too aggressive refills.",
    "notImp": false
  },
  {
    "name": "filter_enabled",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RuntimeFractionalPercent",
    "enums": null,
    "comment": "If set, this will enable -- but not necessarily enforce -- the rate limit for the given fraction of requests. Defaults to 0% of requests for safety.",
    "notImp": false
  },
  {
    "name": "filter_enforced",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RuntimeFractionalPercent",
    "enums": null,
    "comment": "If set, this will enforce the rate limit decisions for the given fraction of requests.\n\nNote: this only applies to the fraction of enabled requests.\n\nDefaults to 0% of requests for safety.",
    "notImp": false
  },
  {
    "name": "request_headers_to_add_when_not_enforced",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderValueOption[]",
    "enums": null,
    "comment": "Specifies a list of HTTP headers that should be added to each request that has been rate limited and is also forwarded upstream. This can only occur when the filter is enabled but not enforced.",
    "notImp": false
  },
  {
    "name": "response_headers_to_add",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderValueOption[]",
    "enums": null,
    "comment": "Specifies a list of HTTP headers that should be added to each response for requests that have been rate limited. This occurs when the filter is enabled and fully enforced.",
    "notImp": false
  },
  {
    "name": "descriptors",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "LocalRateLimitDescriptor[]",
    "enums": null,
    "comment": "The rate limit descriptor list to use in the local rate limit to override on. The rate limit descriptor is selected by the first full match from the request descriptors.\n\nExample on how to use `this`.\n\n:::note\n\nIn the current implementation the descriptor's token bucket `fill_interval` must be a multiple global `token bucket's` fill interval. \n:::\n\n  The descriptors must match verbatim for rate limiting to apply. There is no partial match by a subset of descriptor entries in the current implementation.",
    "notImp": false
  },
  {
    "name": "stage",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Specifies the rate limit configurations to be applied with the same stage number. If not set, the default stage number is 0.\n\n:::note\n\nThe filter supports a range of 0 - 10 inclusively for stage numbers.",
    "notImp": false
  },
  {
    "name": "local_rate_limit_per_downstream_connection",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Specifies the scope of the rate limiter's token bucket. If set to false, the token bucket is shared across all worker threads, thus the rate limits are applied per Envoy process. If set to true, a token bucket is allocated for each connection. Thus the rate limits are applied per connection thereby allowing one to rate limit requests on a per connection basis. If unspecified, the default value is false.",
    "notImp": false
  },
  {
    "name": "local_cluster_rate_limit",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "LocalClusterRateLimit",
    "enums": null,
    "comment": "Enables the local cluster level rate limiting, iff this is set explicitly. For example, given an Envoy gateway that contains N Envoy instances and a rate limit rule X tokens per second. If this is set, the total rate limit of whole gateway will always be X tokens per second regardless of how N changes. If this is not set, the total rate limit of whole gateway will be N * X tokens per second.\n\n:::note\nThis should never be set if the ``local_rate_limit_per_downstream_connection`` is set to true. Because if per connection rate limiting is enabled, we assume that the token buckets should never be shared across Envoy instances. \n:::\n\n:::note\nThis only works when the `local cluster name` is set and the related cluster is defined in the bootstrap configuration.",
    "notImp": false
  },
  {
    "name": "enable_x_ratelimit_headers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "XRateLimitHeadersRFCVersion",
    "enums": [
      "OFF",
      "DRAFT_VERSION_03"
    ],
    "comment": "Defines the standard version to use for X-RateLimit headers emitted by the filter.\n\nDisabled by default.",
    "notImp": false
  },
  {
    "name": "vh_rate_limits",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "VhRateLimitsOptions",
    "enums": [
      "OVERRIDE",
      "INCLUDE",
      "IGNORE"
    ],
    "comment": "Specifies if the local rate limit filter should include the virtual host rate limits.",
    "notImp": false
  },
  {
    "name": "always_consume_default_token_bucket",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Specifies if default token bucket should be always consumed. If set to false, default token bucket will only be consumed when there is no matching descriptor. If set to true, default token bucket will always be consumed. Default is true.",
    "notImp": false
  },
  {
    "name": "rate_limited_as_resource_exhausted",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Specifies whether a ``RESOURCE_EXHAUSTED`` gRPC code must be returned instead of the default ``UNAVAILABLE`` gRPC code for a rate limited gRPC call. The HTTP code will be 200 for a gRPC response.",
    "notImp": false
  },
  {
    "name": "rate_limits",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RateLimit[]",
    "enums": null,
    "comment": "Rate limit configuration that is used to generate a list of descriptor entries based on the request context. The generated entries will be used to find one or multiple matched rate limit rule from the ``descriptors``. If this is set, then `VirtualHost.rate_limits` or `RouteAction.rate_limits` fields will be ignored.\n\n:::note\nNot all configuration fields of `rate limit config` is supported at here. Following fields are not supported: \n:::\n\n  1. `rate limit stage`. 2. `dynamic metadata`. 3. `disable_key`. 4. `override limit`.",
    "notImp": false
  }
] };

export const LocalRateLimit_SingleFields = [
  "stat_prefix",
  "stage",
  "local_rate_limit_per_downstream_connection",
  "enable_x_ratelimit_headers",
  "vh_rate_limits",
  "always_consume_default_token_bucket",
  "rate_limited_as_resource_exhausted"
];