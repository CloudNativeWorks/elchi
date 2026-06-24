import {OutType} from '@elchi/tags/tagsType';


export const MetadataMatcher: OutType = { "MetadataMatcher": [
  {
    "name": "filter",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The filter name to retrieve the ``Struct`` from the ``Metadata``.",
    "notImp": false
  },
  {
    "name": "path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "MetadataMatcher_PathSegment[]",
    "enums": null,
    "comment": "The path to retrieve the ``Value`` from the ``Struct``.",
    "notImp": false
  },
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ValueMatcher",
    "enums": null,
    "comment": "The ``MetadataMatcher`` is matched if the value retrieved by path is matched to this value.",
    "notImp": false
  },
  {
    "name": "invert",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, the match result will be inverted.",
    "notImp": false
  }
] };

export const MetadataMatcher_SingleFields = [
  "filter",
  "invert"
];

export const MetadataMatcher_PathSegment: OutType = { "MetadataMatcher_PathSegment": [
  {
    "name": "segment.key",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Specifies the segment in a path to retrieve value from ``Metadata``.\n\n:::note\nCurrently it's not supported to retrieve a value from a list in ``Metadata``. This means that if the segment key refers to a list, it has to be the last segment in a path.",
    "notImp": false
  }
] };

export const MetadataMatcher_PathSegment_SingleFields = [
  "segment.key"
];