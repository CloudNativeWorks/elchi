import {OutType} from '@elchi/tags/tagsType';


export const DynamicTokenBucket: OutType = { "DynamicTokenBucket": [
  {
    "name": "resource_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "the key used to find the token bucket in the singleton map.",
    "notImp": false
  },
  {
    "name": "config_source",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ConfigSource",
    "enums": null,
    "comment": "The configuration source for the `token_bucket`. It should stay the same through the process lifetime.",
    "notImp": false
  }
] };

export const DynamicTokenBucket_SingleFields = [
  "resource_name"
];

export const ProcessRateLimitFilter: OutType = { "ProcessRateLimitFilter": [
  {
    "name": "dynamic_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DynamicTokenBucket",
    "enums": null,
    "comment": "The dynamic config for the token bucket.",
    "notImp": false
  }
] };