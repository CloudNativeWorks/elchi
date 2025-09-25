import {OutType} from '@elchi/tags/tagsType';


export const RateLimit: OutType = { "RateLimit": [
  {
    "name": "domain",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The rate limit domain to use when calling the rate limit service.",
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
    "name": "request_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The type of requests the filter should apply to. The supported types are ``internal``, ``external`` or ``both``. A request is considered internal if `x-envoy-internal` is set to true. If `x-envoy-internal` is not set or false, a request is considered external. The filter defaults to ``both``, and it will apply to all request types.",
    "notImp": false
  },
  {
    "name": "timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The timeout in milliseconds for the rate limit service RPC. If not set, this defaults to 20ms.",
    "notImp": false
  },
  {
    "name": "failure_mode_deny",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "The filter's behaviour in case the rate limiting service does not respond back. When it is set to true, Envoy will not allow traffic in case of communication failure between rate limiting service and the proxy.",
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
    "name": "rate_limit_service",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RateLimitServiceConfig",
    "enums": null,
    "comment": "Configuration for an external rate limit service provider. If not specified, any calls to the rate limit service will immediately return success.",
    "notImp": false
  },
  {
    "name": "enable_x_ratelimit_headers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RateLimit_XRateLimitHeadersRFCVersion",
    "enums": [
      "OFF",
      "DRAFT_VERSION_03"
    ],
    "comment": "Defines the standard version to use for X-RateLimit headers emitted by the filter:\n\n* ``X-RateLimit-Limit`` - indicates the request-quota associated to the client in the current time-window followed by the description of the quota policy. The values are returned by the rate limiting service in `current_limit` field. Example: ``10, 10;w=1;name=\"per-ip\", 1000;w=3600``. * ``X-RateLimit-Remaining`` - indicates the remaining requests in the current time-window. The values are returned by the rate limiting service in `limit_remaining` field. * ``X-RateLimit-Reset`` - indicates the number of seconds until reset of the current time-window. The values are returned by the rate limiting service in `duration_until_reset` field.\n\nIn case rate limiting policy specifies more than one time window, the values above represent the window that is closest to reaching its limit.\n\nFor more information about the headers specification see selected version of the `draft RFC <https://tools.ietf.org/id/draft-polli-ratelimit-headers-03.html>`_.\n\nDisabled by default.",
    "notImp": false
  },
  {
    "name": "disable_x_envoy_ratelimited_header",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Disables emitting the `x-envoy-ratelimited` header in case of rate limiting (i.e. 429 responses). Having this header not present potentially makes the request retriable.",
    "notImp": false
  },
  {
    "name": "rate_limited_status",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HttpStatus",
    "enums": null,
    "comment": "This field allows for a custom HTTP response status code to the downstream client when the request has been rate limited. Defaults to 429 (TooManyRequests).\n\n:::note\nIf this is set to < 400, 429 will be used instead.",
    "notImp": false
  },
  {
    "name": "response_headers_to_add",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderValueOption[]",
    "enums": null,
    "comment": "Specifies a list of HTTP headers that should be added to each response for requests that have been rate limited.",
    "notImp": false
  },
  {
    "name": "status_on_error",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HttpStatus",
    "enums": null,
    "comment": "Sets the HTTP status that is returned to the client when the ratelimit server returns an error or cannot be reached. The default status is 500.",
    "notImp": false
  },
  {
    "name": "stat_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Optional additional prefix to use when emitting statistics. This allows to distinguish emitted statistics between configured ``ratelimit`` filters in an HTTP filter chain.",
    "notImp": false
  },
  {
    "name": "filter_enabled",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RuntimeFractionalPercent",
    "enums": null,
    "comment": "If set, this will enable -- but not necessarily enforce -- the rate limit for the given fraction of requests.\n\nIf not set then ``ratelimit.http_filter_enabled`` runtime key will be used to determine the fraction of requests to enforce rate limits on. And the default percentage of the runtime key is 100% for backwards compatibility.",
    "notImp": false
  },
  {
    "name": "filter_enforced",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RuntimeFractionalPercent",
    "enums": null,
    "comment": "If set, this will enforce the rate limit decisions for the given fraction of requests.\n\nNote: this only applies to the fraction of enabled requests.\n\nIf not set then ``ratelimit.http_filter_enforcing`` runtime key will be used to determine the fraction of requests to enforce rate limits on. And the default percentage of the runtime key is 100% for backwards compatibility.",
    "notImp": false
  },
  {
    "name": "failure_mode_deny_percent",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RuntimeFractionalPercent",
    "enums": null,
    "comment": "If set, this will override the failure_mode_deny parameter with a runtime fraction. If the runtime key is not specified, the value of failure_mode_deny will be used.\n\nExample:\n\n```yaml\n\n  failure_mode_deny: true\n  failure_mode_deny_percent:\n    default_value:\n      numerator: 50\n      denominator: HUNDRED\n    runtime_key: ratelimit.failure_mode_deny_percent\n```\n\nThis means that when the rate limit service is unavailable, 50% of requests will be denied (fail closed) and 50% will be allowed (fail open).",
    "notImp": false
  }
] };

export const RateLimit_SingleFields = [
  "domain",
  "stage",
  "request_type",
  "timeout",
  "failure_mode_deny",
  "rate_limited_as_resource_exhausted",
  "enable_x_ratelimit_headers",
  "disable_x_envoy_ratelimited_header",
  "stat_prefix"
];

export const RateLimitPerRoute: OutType = { "RateLimitPerRoute": [
  {
    "name": "vh_rate_limits",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RateLimitPerRoute_VhRateLimitsOptions",
    "enums": [
      "OVERRIDE",
      "INCLUDE",
      "IGNORE"
    ],
    "comment": "Specifies if the rate limit filter should include the virtual host rate limits.",
    "notImp": false
  },
  {
    "name": "override_option",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RateLimitPerRoute_OverrideOptions",
    "enums": [
      "DEFAULT",
      "OVERRIDE_POLICY",
      "INCLUDE_POLICY",
      "IGNORE_POLICY"
    ],
    "comment": "Specifies if the rate limit filter should include the lower levels (route level, virtual host level or cluster weight level) rate limits override options. [#not-implemented-hide:]",
    "notImp": true
  },
  {
    "name": "rate_limits",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RateLimit[]",
    "enums": null,
    "comment": "Rate limit configuration that is used to generate a list of descriptor entries based on the request context. The generated entries will be used to find one or multiple matched rate limit rule from the ``descriptors``. If this is set, then `VirtualHost.rate_limits` or `RouteAction.rate_limits` fields will be ignored.\n\n:::note\nNot all configuration fields of `rate limit config` is supported at here. Following fields are not supported: \n:::\n\n  1. `rate limit stage`. 2. `dynamic metadata`. 3. `disable_key`. 4. `override limit`.",
    "notImp": false
  },
  {
    "name": "domain",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Overrides the domain. If not set, uses the filter-level domain instead.",
    "notImp": false
  }
] };

export const RateLimitPerRoute_SingleFields = [
  "vh_rate_limits",
  "override_option",
  "domain"
];