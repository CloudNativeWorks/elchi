import {OutType} from '@elchi/tags/tagsType';


export const OverrideHost: OutType = { "OverrideHost": [
  {
    "name": "override_host_sources",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "OverrideHost_OverrideHostSource[]",
    "enums": null,
    "comment": "A list of sources to get host addresses from. The host sources are searched in the order specified. The request is forwarded to the first address and subsequent addresses are used for request retries or hedging. Note that if an overridden host address is not present in the current endpoint set, it is skipped and the next found address is used. If there are not enough overridden addresses to satisfy all retry attempts the fallback load balancing policy is used to pick a host.",
    "notImp": false
  },
  {
    "name": "fallback_policy",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "LoadBalancingPolicy",
    "enums": null,
    "comment": "The child LB policy to use in case neither header nor metadata with selected hosts is present.",
    "notImp": false
  }
] };

export const OverrideHost_OverrideHostSource: OutType = { "OverrideHost_OverrideHostSource": [
  {
    "name": "header",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The header to get the override host addresses.\n\nOnly one of the header or metadata field could be set.",
    "notImp": false
  },
  {
    "name": "metadata",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "MetadataKey",
    "enums": null,
    "comment": "The metadata key to get the override host addresses from the request dynamic metadata. If set this field then it will take precedence over the header field.\n\nOnly one of the header or metadata field could be set.",
    "notImp": false
  }
] };

export const OverrideHost_OverrideHostSource_SingleFields = [
  "header"
];