import {OutType} from '@/elchi/tags/tagsType';


export const RateLimitQuotaFilterConfig: OutType = { "RateLimitQuotaFilterConfig": [
  {
    "name": "rlqs_server",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "GrpcService",
    "enums": null,
    "comment": "Configures the gRPC Rate Limit Quota Service (RLQS) RateLimitQuotaService.",
    "notImp": false
  },
  {
    "name": "domain",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The application domain to use when calling the service. This enables sharing the quota server between different applications without fear of overlap. E.g., \"envoy\".",
    "notImp": false
  },
  {
    "name": "bucket_matchers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Matcher",
    "enums": null,
    "comment": "The match tree to use for grouping incoming requests into buckets.\n\nExample:\n\n```yaml\n  :type-name: xds.type.matcher.v3.Matcher\n\n  matcher_list:\n    matchers:\n    # Assign requests with header['env'] set to 'staging' to the bucket { name: 'staging' }\n    - predicate:\n        single_predicate:\n          input:\n            typed_config:\n              '@type': type.googleapis.com/envoy.type.matcher.v3.HttpRequestHeaderMatchInput\n              header_name: env\n          value_match:\n            exact: staging\n      on_match:\n        action:\n          typed_config:\n            '@type': type.googleapis.com/envoy.extensions.filters.http.rate_limit_quota.v3.RateLimitQuotaBucketSettings\n            bucket_id_builder:\n              bucket_id_builder:\n                name:\n                  string_value: staging\n```\n # Assign requests with header['user_group'] set to 'admin' to the bucket { acl: 'admin_users' } - predicate: single_predicate: input: typed_config: '@type': type.googleapis.com/xds.type.matcher.v3.HttpAttributesCelMatchInput custom_match: typed_config: '@type': type.googleapis.com/xds.type.matcher.v3.CelMatcher expr_match: # Shortened for illustration purposes. Here should be parsed CEL expression: # request.headers['user_group'] == 'admin' parsed_expr: {} on_match: action: typed_config: '@type': type.googleapis.com/envoy.extensions.filters.http.rate_limit_quota.v3.RateLimitQuotaBucketSettings bucket_id_builder: bucket_id_builder: acl: string_value: admin_users\n\n  # Catch-all clause for the requests not matched by any of the matchers. # In this example, deny all requests. on_no_match: action: typed_config: '@type': type.googleapis.com/envoy.extensions.filters.http.rate_limit_quota.v3.RateLimitQuotaBucketSettings no_assignment_behavior: fallback_rate_limit: blanket_rule: DENY_ALL\n\n:::attention\nThe first matched group wins. Once the request is matched into a bucket, matcher evaluation ends. \n:::\n\nUse ``on_no_match`` field to assign the catch-all bucket. If a request is not matched into any bucket, and there's no  ``on_no_match`` field configured, the request will be ALLOWED by default. It will NOT be reported to the RLQS server.\n\nRefer to `Unified Matcher API` documentation for more information on the matcher trees.",
    "notImp": false
  },
  {
    "name": "filter_enabled",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RuntimeFractionalPercent",
    "enums": null,
    "comment": "If set, this will enable -- but not necessarily enforce -- the rate limit for the given fraction of requests.\n\nDefaults to 100% of requests.",
    "notImp": false
  },
  {
    "name": "filter_enforced",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RuntimeFractionalPercent",
    "enums": null,
    "comment": "If set, this will enforce the rate limit decisions for the given fraction of requests. For requests that are not enforced the filter will still obtain the quota and include it in the load computation, however the request will always be allowed regardless of the outcome of quota application. This allows validation or testing of the rate limiting service infrastructure without disrupting existing traffic.\n\nNote: this only applies to the fraction of enabled requests.\n\nDefaults to 100% of requests.",
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
  }
] };

export const RateLimitQuotaFilterConfig_SingleFields = [
  "domain"
];

export const RateLimitQuotaOverride: OutType = { "RateLimitQuotaOverride": [
  {
    "name": "domain",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The application domain to use when calling the service. This enables sharing the quota server between different applications without fear of overlap. E.g., \"envoy\".\n\nIf empty, inherits the value from the less specific definition.",
    "notImp": false
  },
  {
    "name": "bucket_matchers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Matcher",
    "enums": null,
    "comment": "The match tree to use for grouping incoming requests into buckets.\n\nIf set, fully overrides the bucket matchers provided on the less specific definition. If not set, inherits the value from the less specific definition.\n\nSee usage example: `RateLimitQuotaFilterConfig.bucket_matchers`.",
    "notImp": false
  }
] };

export const RateLimitQuotaOverride_SingleFields = [
  "domain"
];

export const RateLimitQuotaBucketSettings_BucketIdBuilder: OutType = { "RateLimitQuotaBucketSettings_BucketIdBuilder": [
  {
    "name": "bucket_id_builder",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, RateLimitQuotaBucketSettings_BucketIdBuilder_ValueBuilder>",
    "enums": null,
    "comment": "The map translated into the ``BucketId`` map.\n\nThe ``string key`` of this map and becomes the key of ``BucketId`` map as is.\n\nThe ``ValueBuilder value`` for the key can be:\n\n* static ``StringValue string_value`` — becomes the value in the ``BucketId`` map as is. * dynamic ``TypedExtensionConfig custom_value`` — evaluated for each request. Must produce a string output, which becomes the value in the the ``BucketId`` map.\n\nSee usage examples in the docs to `bucket_id_builder` field.",
    "notImp": false
  }
] };

export const RateLimitQuotaBucketSettings_DenyResponseSettings: OutType = { "RateLimitQuotaBucketSettings_DenyResponseSettings": [
  {
    "name": "http_status",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HttpStatus",
    "enums": null,
    "comment": "HTTP response code to deny for HTTP requests (gRPC excluded). Defaults to 429 (`StatusCode.TooManyRequests`).",
    "notImp": false
  },
  {
    "name": "http_body",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Uint8Array<ArrayBufferLike>",
    "enums": null,
    "comment": "HTTP response body used to deny for HTTP requests (gRPC excluded). If not set, an empty body is returned.",
    "notImp": false
  },
  {
    "name": "grpc_status",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Status",
    "enums": null,
    "comment": "Configure the deny response for gRPC requests over the rate limit. Allows to specify the `RPC status code <https://cloud.google.com/natural-language/docs/reference/rpc/google.rpc#google.rpc.Code>`_, and the error message. Defaults to the Status with the RPC Code ``UNAVAILABLE`` and empty message.\n\nTo identify gRPC requests, Envoy checks that the ``Content-Type`` header is ``application/grpc``, or one of the various ``application/grpc+`` values.\n\n:::note\nThe HTTP code for a gRPC response is always 200.",
    "notImp": false
  },
  {
    "name": "response_headers_to_add",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderValueOption[]",
    "enums": null,
    "comment": "Specifies a list of HTTP headers that should be added to each response for requests that have been rate limited. Applies both to plain HTTP, and gRPC requests. The headers are added even when the rate limit quota was not enforced.",
    "notImp": false
  }
] };

export const RateLimitQuotaBucketSettings_NoAssignmentBehavior: OutType = { "RateLimitQuotaBucketSettings_NoAssignmentBehavior": [
  {
    "name": "no_assignment_behavior.fallback_rate_limit",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RateLimitStrategy",
    "enums": null,
    "comment": "Apply pre-configured rate limiting strategy until the server sends the first assignment.",
    "notImp": false
  }
] };

export const RateLimitQuotaBucketSettings_ExpiredAssignmentBehavior: OutType = { "RateLimitQuotaBucketSettings_ExpiredAssignmentBehavior": [
  {
    "name": "expired_assignment_behavior_timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Limit the time `ExpiredAssignmentBehavior` is applied. If the server doesn't respond within this duration:\n\n1. Selected ``ExpiredAssignmentBehavior`` is no longer applied. 2. The bucket is abandoned. The process of abandoning the bucket is described in the `AbandonAction` message. 3. If a new request is matched into the bucket that has become abandoned, the data plane restarts the subscription to the bucket. The process of restarting the subscription is described in the `AbandonAction` message.\n\nIf not set, defaults to zero, and the bucket is abandoned immediately.",
    "notImp": false
  },
  {
    "name": "expired_assignment_behavior.fallback_rate_limit",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RateLimitStrategy",
    "enums": null,
    "comment": "Apply the rate limiting strategy to all requests matched into the bucket until the RLQS server sends a new assignment, or the `expired_assignment_behavior_timeout` runs out.",
    "notImp": false
  },
  {
    "name": "expired_assignment_behavior.reuse_last_assignment",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RateLimitQuotaBucketSettings_ExpiredAssignmentBehavior_ReuseLastAssignment",
    "enums": null,
    "comment": "Reuse the last ``active`` assignment until the RLQS server sends a new assignment, or the `expired_assignment_behavior_timeout` runs out.",
    "notImp": false
  }
] };

export const RateLimitQuotaBucketSettings_ExpiredAssignmentBehavior_SingleFields = [
  "expired_assignment_behavior_timeout"
];

export const RateLimitQuotaBucketSettings: OutType = { "RateLimitQuotaBucketSettings": [
  {
    "name": "bucket_id_builder",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RateLimitQuotaBucketSettings_BucketIdBuilder",
    "enums": null,
    "comment": "``BucketId`` builder.\n\n`BucketId` is a map from the string key to the string value which serves as bucket identifier common for on the control plane and the data plane.\n\nWhile ``BucketId`` is always static, ``BucketIdBuilder`` allows to populate map values with the dynamic properties associated with the each individual request.\n\nExample 1: static fields only\n\n``BucketIdBuilder``:\n\n```yaml\n  :type-name: envoy.extensions.filters.http.rate_limit_quota.v3.RateLimitQuotaBucketSettings.BucketIdBuilder\n\n  bucket_id_builder:\n    name:\n      string_value: my_bucket\n    hello:\n      string_value: world\n```\n Produces the following ``BucketId`` for all requests:\n\n```yaml\n  :type-name: envoy.service.rate_limit_quota.v3.BucketId\n\n  bucket:\n    name: my_bucket\n    hello: world\n```\n Example 2: static and dynamic fields\n\n```yaml\n  :type-name: envoy.extensions.filters.http.rate_limit_quota.v3.RateLimitQuotaBucketSettings.BucketIdBuilder\n\n  bucket_id_builder:\n    name:\n      string_value: my_bucket\n    env:\n      custom_value:\n        typed_config:\n          '@type': type.googleapis.com/envoy.type.matcher.v3.HttpRequestHeaderMatchInput\n          header_name: environment\n```\n In this example, the value of ``BucketId`` key ``env`` is substituted from the ``environment`` request header.\n\nThis is equivalent to the following ``pseudo-code``:\n\n```yaml\n\n   name: 'my_bucket'\n   env: $header['environment']\n```\n\nFor example, the request with the HTTP header ``env`` set to ``staging`` will produce the following ``BucketId``:\n\n```yaml\n  :type-name: envoy.service.rate_limit_quota.v3.BucketId\n\n  bucket:\n    name: my_bucket\n    env: staging\n```\n For the request with the HTTP header ``environment`` set to ``prod``, will produce:\n\n```yaml\n  :type-name: envoy.service.rate_limit_quota.v3.BucketId\n\n  bucket:\n    name: my_bucket\n    env: prod\n```\n:::note\nThe order of ``BucketId`` keys do not matter. Buckets ``{ a: 'A', b: 'B' }`` and ``{ b: 'B', a: 'A' }`` are identical. \n:::\n\nIf not set, requests will NOT be reported to the server, and will always limited according to `no_assignment_behavior` configuration.",
    "notImp": false
  },
  {
    "name": "reporting_interval",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The interval at which the data plane (RLQS client) is to report quota usage for this bucket.\n\nWhen the first request is matched to a bucket with no assignment, the data plane is to report the request immediately in the `RateLimitQuotaUsageReports` message. For the RLQS server, this signals that the data plane is now subscribed to the quota assignments in this bucket, and will start sending the assignment as described in the `RLQS documentation`.\n\nAfter sending the initial report, the data plane is to continue reporting the bucket usage with the internal specified in this field.\n\nIf for any reason RLQS client doesn't receive the initial assignment for the reported bucket, the data plane will eventually consider the bucket abandoned and stop sending the usage reports. This is explained in more details at `Rate Limit Quota Service (RLQS)`.",
    "notImp": false
  },
  {
    "name": "deny_response_settings",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RateLimitQuotaBucketSettings_DenyResponseSettings",
    "enums": null,
    "comment": "Customize the deny response to the requests over the rate limit. If not set, the filter will be configured as if an empty message is set, and will behave according to the defaults specified in `DenyResponseSettings`.",
    "notImp": false
  },
  {
    "name": "no_assignment_behavior",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RateLimitQuotaBucketSettings_NoAssignmentBehavior",
    "enums": null,
    "comment": "Configures the behavior in the \"no assignment\" state: after the first request has been matched to the bucket, and before the the RLQS server returns the first quota assignment.\n\nIf not set, the default behavior is to allow all requests.",
    "notImp": false
  },
  {
    "name": "expired_assignment_behavior",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RateLimitQuotaBucketSettings_ExpiredAssignmentBehavior",
    "enums": null,
    "comment": "Configures the behavior in the \"expired assignment\" state: the bucket's assignment has expired, and cannot be refreshed.\n\nIf not set, the bucket is abandoned when its ``active`` assignment expires. The process of abandoning the bucket, and restarting the subscription is described in the `AbandonAction` message.",
    "notImp": false
  }
] };

export const RateLimitQuotaBucketSettings_SingleFields = [
  "reporting_interval"
];

export const RateLimitQuotaBucketSettings_BucketIdBuilder_ValueBuilder: OutType = { "RateLimitQuotaBucketSettings_BucketIdBuilder_ValueBuilder": [
  {
    "name": "value_specifier.string_value",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Static string value — becomes the value in the `BucketId` map as is.",
    "notImp": false
  },
  {
    "name": "value_specifier.custom_value",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "Dynamic value — evaluated for each request. Must produce a string output, which becomes the value in the `BucketId` map. For example, extensions with the ``envoy.matching.http.input`` category can be used.",
    "notImp": false
  }
] };

export const RateLimitQuotaBucketSettings_BucketIdBuilder_ValueBuilder_SingleFields = [
  "value_specifier.string_value"
];

export const RateLimitQuotaBucketSettings_BucketIdBuilder_BucketIdBuilderEntry: OutType = { "RateLimitQuotaBucketSettings_BucketIdBuilder_BucketIdBuilderEntry": [
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
    "fieldType": "RateLimitQuotaBucketSettings_BucketIdBuilder_ValueBuilder",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const RateLimitQuotaBucketSettings_BucketIdBuilder_BucketIdBuilderEntry_SingleFields = [
  "key"
];