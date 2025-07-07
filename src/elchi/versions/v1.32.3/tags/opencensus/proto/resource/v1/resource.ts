import {OutType} from '@/elchi/tags/tagsType';


export const Resource: OutType = { "Resource": [
  {
    "name": "type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Type identifier for the resource.",
    "notImp": false
  },
  {
    "name": "labels",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, string>",
    "enums": null,
    "comment": "Set of labels that describe the resource.",
    "notImp": false
  }
] };

export const Resource_SingleFields = [
  "type"
];

export const Resource_LabelsEntry: OutType = { "Resource_LabelsEntry": [
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

export const Resource_LabelsEntry_SingleFields = [
  "key",
  "value"
];