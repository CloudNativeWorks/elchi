import {OutType} from '@elchi/tags/tagsType';


export const FilterStateInput: OutType = { "FilterStateInput": [
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
    "name": "field",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Optional field name to retrieve from the filter state object. When set and the filter state object supports field access, the value of this specific field is returned instead of the serialized string representation of the whole object.",
    "notImp": false
  }
] };

export const FilterStateInput_SingleFields = [
  "key",
  "field"
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
    "comment": "Specifies the segment in a path to retrieve value from Metadata. Note: Currently it's not supported to retrieve a value from a list in Metadata. This means that if the segment key refers to a list, it has to be the last segment in a path.",
    "notImp": false
  }
] };

export const DynamicMetadataInput_PathSegment_SingleFields = [
  "segment.key"
];