import {OutType} from '@elchi/tags/tagsType';


export const RateLimitRequest: OutType = { "RateLimitRequest": [
  {
    "name": "domain",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "All rate limit requests must specify a domain. This enables the configuration to be per application without fear of overlap. E.g., \"envoy\".",
    "notImp": false
  },
  {
    "name": "descriptors",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RateLimitDescriptor[]",
    "enums": null,
    "comment": "All rate limit requests must specify at least one RateLimitDescriptor. Each descriptor is processed by the service (see below). If any of the descriptors are over limit, the entire request is considered to be over limit.",
    "notImp": false
  },
  {
    "name": "hits_addend",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Rate limit requests can optionally specify the number of hits a request adds to the matched limit. If the value is not set in the message, a request increases the matched limit by 1. This value can be overridden by setting filter state value ``envoy.ratelimit.hits_addend`` to the desired number. Invalid number (< 0) or number will be ignored.",
    "notImp": false
  }
] };

export const RateLimitRequest_SingleFields = [
  "domain",
  "hits_addend"
];

export const RateLimitResponse_Quota: OutType = { "RateLimitResponse_Quota": [
  {
    "name": "requests",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Number of matching requests granted in quota. Must be 1 or more.",
    "notImp": false
  },
  {
    "name": "expiration_specifier.valid_until",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Date",
    "enums": null,
    "comment": "Point in time at which the quota expires.",
    "notImp": false
  },
  {
    "name": "id",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The unique id that is associated with each Quota either at individual descriptor level or whole descriptor set level.\n\nFor a matching policy with boolean logic, for example, match: \"request.headers['environment'] == 'staging' || request.headers['environment'] == 'dev'\"), the request_headers action produces a distinct list of descriptors for each possible value of the ‘environment’ header even though the granted quota is same. Thus, the client will use this id information (returned from RLS server) to correctly correlate the multiple descriptors/descriptor sets that have been granted with same quota (i.e., share the same quota among multiple descriptors or descriptor sets.)\n\nIf id is empty, this id field will be ignored. If quota for the same id changes (e.g. due to configuration update), the old quota will be overridden by the new one. Shared quotas referenced by ID will still adhere to expiration after `valid_until`.",
    "notImp": false
  }
] };

export const RateLimitResponse_Quota_SingleFields = [
  "requests",
  "id"
];

export const RateLimitResponse: OutType = { "RateLimitResponse": [
  {
    "name": "overall_code",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RateLimitResponse_Code",
    "enums": [
      "UNKNOWN",
      "OK",
      "OVER_LIMIT"
    ],
    "comment": "The overall response code which takes into account all of the descriptors that were passed in the RateLimitRequest message.",
    "notImp": false
  },
  {
    "name": "statuses",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RateLimitResponse_DescriptorStatus[]",
    "enums": null,
    "comment": "A list of DescriptorStatus messages which matches the length of the descriptor list passed in the RateLimitRequest. This can be used by the caller to determine which individual descriptors failed and/or what the currently configured limits are for all of them.",
    "notImp": false
  },
  {
    "name": "response_headers_to_add",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderValue[]",
    "enums": null,
    "comment": "A list of headers to add to the response",
    "notImp": false
  },
  {
    "name": "request_headers_to_add",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderValue[]",
    "enums": null,
    "comment": "A list of headers to add to the request when forwarded",
    "notImp": false
  },
  {
    "name": "raw_body",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Uint8Array<ArrayBufferLike>",
    "enums": null,
    "comment": "A response body to send to the downstream client when the response code is not OK.",
    "notImp": false
  },
  {
    "name": "dynamic_metadata",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "{ [key: string]: any; }",
    "enums": null,
    "comment": "Optional response metadata that will be emitted as dynamic metadata to be consumed by the next filter. This metadata lives in a namespace specified by the canonical name of extension filter that requires it:\n\n- `envoy.filters.http.ratelimit` for HTTP filter. - `envoy.filters.network.ratelimit` for network filter. - `envoy.filters.thrift.rate_limit` for Thrift filter.",
    "notImp": false
  },
  {
    "name": "quota",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RateLimitResponse_Quota",
    "enums": null,
    "comment": "Quota is available for a request if its entire descriptor set has cached quota available. This is a union of all descriptors in the descriptor set. Clients can use the quota for future matches if and only if the descriptor set matches what was sent in the request that originated this response.\n\nIf quota is available, a RLS request will not be made and the quota will be reduced by 1. If quota is not available (i.e., a cached entry doesn't exist for a RLS descriptor set), a RLS request will be triggered. If the server did not provide a quota, such as the quota message is empty then the request admission is determined by the `overall_code`.\n\nIf there is not sufficient quota and the cached entry exists for a RLS descriptor set is out-of-quota but not expired, the request will be treated as OVER_LIMIT. [#not-implemented-hide:]",
    "notImp": true
  }
] };

export const RateLimitResponse_SingleFields = [
  "overall_code"
];

export const RateLimitResponse_RateLimit: OutType = { "RateLimitResponse_RateLimit": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "A name or description of this limit.",
    "notImp": false
  },
  {
    "name": "requests_per_unit",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The number of requests per unit of time.",
    "notImp": false
  },
  {
    "name": "unit",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RateLimitResponse_RateLimit_Unit",
    "enums": [
      "UNKNOWN",
      "SECOND",
      "MINUTE",
      "HOUR",
      "DAY",
      "WEEK",
      "MONTH",
      "YEAR"
    ],
    "comment": "The unit of time.",
    "notImp": false
  }
] };

export const RateLimitResponse_RateLimit_SingleFields = [
  "name",
  "requests_per_unit",
  "unit"
];

export const RateLimitResponse_DescriptorStatus: OutType = { "RateLimitResponse_DescriptorStatus": [
  {
    "name": "code",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RateLimitResponse_Code",
    "enums": [
      "UNKNOWN",
      "OK",
      "OVER_LIMIT"
    ],
    "comment": "The response code for an individual descriptor.",
    "notImp": false
  },
  {
    "name": "current_limit",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RateLimitResponse_RateLimit",
    "enums": null,
    "comment": "The current limit as configured by the server. Useful for debugging, etc.",
    "notImp": false
  },
  {
    "name": "limit_remaining",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The limit remaining in the current time unit.",
    "notImp": false
  },
  {
    "name": "duration_until_reset",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Duration until reset of the current limit window.",
    "notImp": false
  },
  {
    "name": "quota",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RateLimitResponse_Quota",
    "enums": null,
    "comment": "Quota is available for a request if its descriptor set has cached quota available for all descriptors. This is for each individual descriptor in the descriptor set. The client will perform matches for each individual descriptor against available per-descriptor quota.\n\nIf quota is available, a RLS request will not be made and the quota will be reduced by 1 for all matching descriptors.\n\nIf there is not sufficient quota, there are three cases: 1. A cached entry exists for a RLS descriptor that is out-of-quota, but not expired. In this case, the request will be treated as OVER_LIMIT. 2. Some RLS descriptors have a cached entry that has valid quota but some RLS descriptors have no cached entry. This will trigger a new RLS request. When the result is returned, a single unit will be consumed from the quota for all matching descriptors. If the server did not provide a quota, such as the quota message is empty for some of the descriptors, then the request admission is determined by the `overall_code`. 3. All RLS descriptors lack a cached entry, this will trigger a new RLS request, When the result is returned, a single unit will be consumed from the quota for all matching descriptors. If the server did not provide a quota, such as the quota message is empty for some of the descriptors, then the request admission is determined by the `overall_code`. [#not-implemented-hide:]",
    "notImp": true
  }
] };

export const RateLimitResponse_DescriptorStatus_SingleFields = [
  "code",
  "limit_remaining",
  "duration_until_reset"
];