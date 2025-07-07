import {OutType} from '@/elchi/tags/tagsType';


export const PickFirst: OutType = { "PickFirst": [
  {
    "name": "shuffle_address_list",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set to true, instructs the LB policy to shuffle the list of addresses received from the name resolver before attempting to connect to them.",
    "notImp": false
  }
] };

export const PickFirst_SingleFields = [
  "shuffle_address_list"
];