import {OutType} from '@elchi/tags/tagsType';


export const AddressMatcher: OutType = { "AddressMatcher": [
  {
    "name": "ranges",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CidrRange[]",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "invert_match",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, the match result will be inverted. Defaults to false.\n\n* If set to false (default), the matcher will return true if the IP matches any of the CIDR ranges. * If set to true, the matcher will return true if the IP does NOT match any of the CIDR ranges.",
    "notImp": false
  }
] };

export const AddressMatcher_SingleFields = [
  "invert_match"
];