import {OutType} from '@/elchi/tags/tagsType';


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
    "comment": "Defines the standard version to use for X-RateLimit headers emitted by the filter:\n\n* ``X-RateLimit-Limit`` - indicates the request-quota associated to the client in the current time-window followed by the description of the quota policy. The values are returned by the rate limiting service in `current_limit` field. Example: ``10, 10;w=1;name=\"per-ip\", 1000;w=3600``. * ``X-RateLimit-Remaining`` - indicates the remaining requests in the current time-window. The values are returned by the rate limiting service in `limit_remaining` field. * ``X-RateLimit-Reset`` - indicates the number of seconds until reset of the current time-window. The values are returned by the rate limiting service in `duration_until_reset` field.\n\nIn case rate limiting policy specifies more then one time window, the values above represent the window that is closest to reaching its limit.\n\nFor more information about the headers specification see selected version of the `draft RFC <https://tools.ietf.org/id/draft-polli-ratelimit-headers-03.html>`_.\n\nDisabled by default.",
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

export const RateLimitConfig_Override: OutType = { "RateLimitConfig_Override": [
  {
    "name": "override_specifier.dynamic_metadata",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RateLimitConfig_Override_DynamicMetadata",
    "enums": null,
    "comment": "Limit override from dynamic metadata.",
    "notImp": false
  }
] };

export const RateLimitConfig: OutType = { "RateLimitConfig": [
  {
    "name": "stage",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Refers to the stage set in the filter. The rate limit configuration only applies to filters with the same stage number. The default stage number is 0.\n\n:::note\n\nThe filter supports a range of 0 - 10 inclusively for stage numbers.",
    "notImp": false
  },
  {
    "name": "disable_key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The key to be set in runtime to disable this rate limit configuration.",
    "notImp": false
  },
  {
    "name": "actions",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RateLimitConfig_Action[]",
    "enums": null,
    "comment": "A list of actions that are to be applied for this rate limit configuration. Order matters as the actions are processed sequentially and the descriptor is composed by appending descriptor entries in that sequence. If an action cannot append a descriptor entry, no descriptor is generated for the configuration. See `composing actions` for additional documentation.",
    "notImp": false
  },
  {
    "name": "limit",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RateLimitConfig_Override",
    "enums": null,
    "comment": "An optional limit override to be appended to the descriptor produced by this rate limit configuration. If the override value is invalid or cannot be resolved from metadata, no override is provided. See `rate limit override` for more information.",
    "notImp": false
  }
] };

export const RateLimitConfig_SingleFields = [
  "stage",
  "disable_key"
];

export const RateLimitConfig_Action: OutType = { "RateLimitConfig_Action": [
  {
    "name": "action_specifier.source_cluster",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RateLimitConfig_Action_SourceCluster",
    "enums": null,
    "comment": "Rate limit on source cluster.",
    "notImp": false
  },
  {
    "name": "action_specifier.destination_cluster",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RateLimitConfig_Action_DestinationCluster",
    "enums": null,
    "comment": "Rate limit on destination cluster.",
    "notImp": false
  },
  {
    "name": "action_specifier.request_headers",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RateLimitConfig_Action_RequestHeaders",
    "enums": null,
    "comment": "Rate limit on request headers.",
    "notImp": false
  },
  {
    "name": "action_specifier.remote_address",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RateLimitConfig_Action_RemoteAddress",
    "enums": null,
    "comment": "Rate limit on remote address.",
    "notImp": false
  },
  {
    "name": "action_specifier.generic_key",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RateLimitConfig_Action_GenericKey",
    "enums": null,
    "comment": "Rate limit on a generic key.",
    "notImp": false
  },
  {
    "name": "action_specifier.header_value_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RateLimitConfig_Action_HeaderValueMatch",
    "enums": null,
    "comment": "Rate limit on the existence of request headers.",
    "notImp": false
  },
  {
    "name": "action_specifier.metadata",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RateLimitConfig_Action_MetaData",
    "enums": null,
    "comment": "Rate limit on metadata.",
    "notImp": false
  },
  {
    "name": "action_specifier.extension",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "Rate limit descriptor extension. See the rate limit descriptor extensions documentation. extension-category: envoy.rate_limit_descriptors",
    "notImp": false
  }
] };

export const RateLimitConfig_Action_RequestHeaders: OutType = { "RateLimitConfig_Action_RequestHeaders": [
  {
    "name": "header_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The header name to be queried from the request headers. The header’s value is used to populate the value of the descriptor entry for the descriptor_key.",
    "notImp": false
  },
  {
    "name": "descriptor_key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The key to use in the descriptor entry.",
    "notImp": false
  },
  {
    "name": "skip_if_absent",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set to true, Envoy skips the descriptor while calling rate limiting service when header is not present in the request. By default it skips calling the rate limiting service if this header is not present in the request.",
    "notImp": false
  }
] };

export const RateLimitConfig_Action_RequestHeaders_SingleFields = [
  "header_name",
  "descriptor_key",
  "skip_if_absent"
];

export const RateLimitConfig_Action_GenericKey: OutType = { "RateLimitConfig_Action_GenericKey": [
  {
    "name": "descriptor_value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The value to use in the descriptor entry.",
    "notImp": false
  },
  {
    "name": "descriptor_key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "An optional key to use in the descriptor entry. If not set it defaults to 'generic_key' as the descriptor key.",
    "notImp": false
  }
] };

export const RateLimitConfig_Action_GenericKey_SingleFields = [
  "descriptor_value",
  "descriptor_key"
];

export const RateLimitConfig_Action_HeaderValueMatch: OutType = { "RateLimitConfig_Action_HeaderValueMatch": [
  {
    "name": "descriptor_value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The value to use in the descriptor entry.",
    "notImp": false
  },
  {
    "name": "expect_match",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set to true, the action will append a descriptor entry when the request matches the headers. If set to false, the action will append a descriptor entry when the request does not match the headers. The default value is true.",
    "notImp": false
  },
  {
    "name": "headers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderMatcher[]",
    "enums": null,
    "comment": "Specifies a set of headers that the rate limit action should match on. The action will check the request’s headers against all the specified headers in the config. A match will happen if all the headers in the config are present in the request with the same values (or based on presence if the value field is not in the config).",
    "notImp": false
  }
] };

export const RateLimitConfig_Action_HeaderValueMatch_SingleFields = [
  "descriptor_value",
  "expect_match"
];

export const RateLimitConfig_Action_MetaData: OutType = { "RateLimitConfig_Action_MetaData": [
  {
    "name": "descriptor_key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The key to use in the descriptor entry.",
    "notImp": false
  },
  {
    "name": "metadata_key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "MetadataKey",
    "enums": null,
    "comment": "Metadata struct that defines the key and path to retrieve the string value. A match will only happen if the value in the metadata is of type string.",
    "notImp": false
  },
  {
    "name": "default_value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "An optional value to use if ``metadata_key`` is empty. If not set and no value is present under the metadata_key then ``skip_if_absent`` is followed to skip calling the rate limiting service or skip the descriptor.",
    "notImp": false
  },
  {
    "name": "source",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RateLimitConfig_Action_MetaData_Source",
    "enums": [
      "DYNAMIC",
      "ROUTE_ENTRY"
    ],
    "comment": "Source of metadata",
    "notImp": false
  },
  {
    "name": "skip_if_absent",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set to true, Envoy skips the descriptor while calling rate limiting service when ``metadata_key`` is empty and ``default_value`` is not set. By default it skips calling the rate limiting service in that case.",
    "notImp": false
  }
] };

export const RateLimitConfig_Action_MetaData_SingleFields = [
  "descriptor_key",
  "default_value",
  "source",
  "skip_if_absent"
];

export const RateLimitConfig_Override_DynamicMetadata: OutType = { "RateLimitConfig_Override_DynamicMetadata": [
  {
    "name": "metadata_key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "MetadataKey",
    "enums": null,
    "comment": "Metadata struct that defines the key and path to retrieve the struct value. The value must be a struct containing an integer \"requests_per_unit\" property and a \"unit\" property with a value parseable to `RateLimitUnit enum`",
    "notImp": false
  }
] };

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
    "fieldType": "RateLimitConfig[]",
    "enums": null,
    "comment": "Rate limit configuration. If not set, uses the `VirtualHost.rate_limits` or `RouteAction.rate_limits` fields instead. [#not-implemented-hide:]",
    "notImp": true
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