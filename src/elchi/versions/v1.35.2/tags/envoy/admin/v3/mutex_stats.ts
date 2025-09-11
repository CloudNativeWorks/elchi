import {OutType} from '@elchi/tags/tagsType';


export const MutexStats: OutType = { "MutexStats": [
  {
    "name": "num_contentions",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The number of individual mutex contentions which have occurred since startup.",
    "notImp": false
  },
  {
    "name": "current_wait_cycles",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The length of the current contention wait cycle.",
    "notImp": false
  },
  {
    "name": "lifetime_wait_cycles",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The lifetime total of all contention wait cycles.",
    "notImp": false
  }
] };

export const MutexStats_SingleFields = [
  "num_contentions",
  "current_wait_cycles",
  "lifetime_wait_cycles"
];