import {OutType} from '@elchi/tags/tagsType';


export const RateLimit: OutType = { "RateLimit": [
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
    "name": "domain",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The rate limit domain to use in the rate limit service request.",
    "notImp": false
  },
  {
    "name": "descriptors",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RateLimitDescriptor[]",
    "enums": null,
    "comment": "The rate limit descriptor list to use in the rate limit service request.",
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
    "comment": "The filter's behaviour in case the rate limiting service does not respond back. When it is set to true, Envoy will not allow traffic in case of communication failure between rate limiting service and the proxy. Defaults to false.",
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
  }
] };

export const RateLimit_SingleFields = [
  "stat_prefix",
  "domain",
  "timeout",
  "failure_mode_deny"
];