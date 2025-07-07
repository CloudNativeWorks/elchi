import {OutType} from '@/elchi/tags/tagsType';


export const RateLimit: OutType = { "RateLimit": [
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
    "name": "stage",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Specifies the rate limit configuration stage. Each configured rate limit filter performs a rate limit check using descriptors configured in the `envoy_v3_api_msg_extensions.filters.network.thrift_proxy.v3.RouteAction` for the request. Only those entries with a matching stage number are used for a given filter. If not set, the default stage number is 0.\n\n:::note\n\nThe filter supports a range of 0 - 10 inclusively for stage numbers.",
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
  "domain",
  "stage",
  "timeout",
  "failure_mode_deny"
];