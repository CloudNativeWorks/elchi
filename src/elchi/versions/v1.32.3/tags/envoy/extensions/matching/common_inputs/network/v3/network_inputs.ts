import {OutType} from '@/elchi/tags/tagsType';


export const FilterStateInput: OutType = { "FilterStateInput": [
  {
    "name": "key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const FilterStateInput_SingleFields = [
  "key"
];

export const DynamicMetadataInput: OutType = { "DynamicMetadataInput": [
  {
    "name": "filter",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The filter name to retrieve the Struct from the Metadata.",
    "notImp": false
  },
  {
    "name": "path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DynamicMetadataInput_PathSegment[]",
    "enums": null,
    "comment": "The path to retrieve the Value from the Struct.",
    "notImp": false
  }
] };

export const DynamicMetadataInput_SingleFields = [
  "filter"
];

export const DynamicMetadataInput_PathSegment: OutType = { "DynamicMetadataInput_PathSegment": [
  {
    "name": "segment.key",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "If specified, use the key to retrieve the value in a Struct.",
    "notImp": false
  }
] };

export const DynamicMetadataInput_PathSegment_SingleFields = [
  "segment.key"
];