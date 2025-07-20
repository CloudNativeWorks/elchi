import {OutType} from '@elchi/tags/tagsType';


export const ContextParams: OutType = { "ContextParams": [
  {
    "name": "params",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, string>",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const ContextParams_ParamsEntry: OutType = { "ContextParams_ParamsEntry": [
  {
    "name": "key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const ContextParams_ParamsEntry_SingleFields = [
  "key",
  "value"
];