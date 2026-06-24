import {OutType} from '@elchi/tags/tagsType';


export const RateLimitDescriptor_RateLimitOverride: OutType = { "RateLimitDescriptor_RateLimitOverride": [
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
    "fieldType": "RateLimitUnit",
    "enums": [
      "UNKNOWN",
      "SECOND",
      "MINUTE",
      "HOUR",
      "DAY",
      "MONTH",
      "YEAR"
    ],
    "comment": "The unit of time.",
    "notImp": false
  }
] };

export const RateLimitDescriptor_RateLimitOverride_SingleFields = [
  "requests_per_unit",
  "unit"
];

export const RateLimitDescriptor: OutType = { "RateLimitDescriptor": [
  {
    "name": "entries",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RateLimitDescriptor_Entry[]",
    "enums": null,
    "comment": "Descriptor entries.",
    "notImp": false
  },
  {
    "name": "limit",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RateLimitDescriptor_RateLimitOverride",
    "enums": null,
    "comment": "Optional rate limit override to supply to the ratelimit service.",
    "notImp": false
  },
  {
    "name": "hits_addend",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Optional hits_addend for the rate limit descriptor. If set the value will override the request level hits_addend.",
    "notImp": false
  },
  {
    "name": "is_negative_hits",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, the hits_addend value will be treated as negative, effectively adding to the rate limit budget instead of consuming from it. This can be used to refill previously consumed rate limit tokens.",
    "notImp": false
  }
] };

export const RateLimitDescriptor_SingleFields = [
  "hits_addend",
  "is_negative_hits"
];

export const RateLimitDescriptor_Entry: OutType = { "RateLimitDescriptor_Entry": [
  {
    "name": "key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Descriptor key.",
    "notImp": false
  },
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Descriptor value. Blank value is treated as wildcard to create dynamic token buckets for each unique value. Blank Values as wild card is currently supported only with envoy server instance level HTTP local rate limiting and will not work if HTTP local rate limiting is enabled per connection level.",
    "notImp": false
  }
] };

export const RateLimitDescriptor_Entry_SingleFields = [
  "key",
  "value"
];

export const LocalRateLimitDescriptor: OutType = { "LocalRateLimitDescriptor": [
  {
    "name": "entries",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RateLimitDescriptor_Entry[]",
    "enums": null,
    "comment": "Descriptor entries.",
    "notImp": false
  },
  {
    "name": "token_bucket",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TokenBucket",
    "enums": null,
    "comment": "Token Bucket algorithm for local ratelimiting.",
    "notImp": false
  },
  {
    "name": "shadow_mode",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Mark the descriptor as shadow. When the values is true, envoy allow requests to the backend.",
    "notImp": false
  }
] };

export const LocalRateLimitDescriptor_SingleFields = [
  "shadow_mode"
];