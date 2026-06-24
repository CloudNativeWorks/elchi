import {OutType} from '@elchi/tags/tagsType';


export const TransformStat_UpdateTag: OutType = { "TransformStat_UpdateTag": [
  {
    "name": "new_tag_value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The new tag value.",
    "notImp": false
  }
] };

export const TransformStat_UpdateTag_SingleFields = [
  "new_tag_value"
];

export const TransformStat: OutType = { "TransformStat": [
  {
    "name": "drop_stat",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TransformStat_DropStat",
    "enums": null,
    "comment": "If set, the stat will be dropped.",
    "notImp": false
  },
  {
    "name": "drop_tag",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TransformStat_DropTag",
    "enums": null,
    "comment": "If set, the tag ill be dropped. This removes the tag from the stat entirely.",
    "notImp": false
  },
  {
    "name": "update_tag",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TransformStat_UpdateTag",
    "enums": null,
    "comment": "If set, the tag will be updated.",
    "notImp": false
  }
] };