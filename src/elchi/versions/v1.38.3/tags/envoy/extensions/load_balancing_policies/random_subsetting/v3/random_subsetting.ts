import {OutType} from '@elchi/tags/tagsType';


export const RandomSubsetting: OutType = { "RandomSubsetting": [
  {
    "name": "subset_size",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "subset_size indicates how many backends every client will be connected to. The value must be greater than 0.",
    "notImp": false
  },
  {
    "name": "child_policy",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "LoadBalancingPolicy",
    "enums": null,
    "comment": "The config for the child policy. The value is required.",
    "notImp": false
  }
] };

export const RandomSubsetting_SingleFields = [
  "subset_size"
];