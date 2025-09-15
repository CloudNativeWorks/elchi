import {OutType} from '@elchi/tags/tagsType';


export const Runtime: OutType = { "Runtime": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Runtime resource name. This makes the Runtime a self-describing xDS resource.",
    "notImp": false
  },
  {
    "name": "layer",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "{ [key: string]: any; }",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const Runtime_SingleFields = [
  "name"
];