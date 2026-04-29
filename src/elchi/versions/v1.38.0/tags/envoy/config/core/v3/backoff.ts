import {OutType} from '@elchi/tags/tagsType';


export const BackoffStrategy: OutType = { "BackoffStrategy": [
  {
    "name": "base_interval",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The base interval to be used for the next back off computation. It should be greater than zero and less than or equal to `max_interval`.",
    "notImp": false
  },
  {
    "name": "max_interval",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Specifies the maximum interval between retries. This parameter is optional, but must be greater than or equal to the `base_interval` if set. The default is 10 times the `base_interval`.",
    "notImp": false
  }
] };

export const BackoffStrategy_SingleFields = [
  "base_interval",
  "max_interval"
];