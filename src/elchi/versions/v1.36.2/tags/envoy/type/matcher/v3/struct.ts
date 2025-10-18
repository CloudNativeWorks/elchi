import {OutType} from '@elchi/tags/tagsType';


export const StructMatcher: OutType = { "StructMatcher": [
  {
    "name": "path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "StructMatcher_PathSegment[]",
    "enums": null,
    "comment": "The path to retrieve the Value from the Struct.",
    "notImp": false
  },
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ValueMatcher",
    "enums": null,
    "comment": "The StructMatcher is matched if the value retrieved by path is matched to this value.",
    "notImp": false
  }
] };

export const StructMatcher_PathSegment: OutType = { "StructMatcher_PathSegment": [
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

export const StructMatcher_PathSegment_SingleFields = [
  "segment.key"
];