import {OutType} from '@elchi/tags/tagsType';


export const TokenBucket: OutType = { "TokenBucket": [
  {
    "name": "max_tokens",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The maximum tokens that the bucket can hold. This is also the number of tokens that the bucket initially contains.",
    "notImp": false
  },
  {
    "name": "tokens_per_fill",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The number of tokens added to the bucket during each fill interval. If not specified, defaults to a single token.",
    "notImp": false
  },
  {
    "name": "fill_interval",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The fill interval that tokens are added to the bucket. During each fill interval ``tokens_per_fill`` are added to the bucket. The bucket will never contain more than ``max_tokens`` tokens.",
    "notImp": false
  }
] };

export const TokenBucket_SingleFields = [
  "max_tokens",
  "tokens_per_fill",
  "fill_interval"
];