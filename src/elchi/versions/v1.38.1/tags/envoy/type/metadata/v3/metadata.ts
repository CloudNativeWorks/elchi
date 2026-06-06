import {OutType} from '@elchi/tags/tagsType';


export const MetadataKey: OutType = { "MetadataKey": [
  {
    "name": "key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The key name of the Metadata from which to retrieve the Struct. This typically represents a builtin subsystem or custom extension.",
    "notImp": false
  },
  {
    "name": "path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "MetadataKey_PathSegment[]",
    "enums": null,
    "comment": "The path used to retrieve a specific Value from the Struct. This can be either a prefix or a full path, depending on the use case. For example, ``[prop, xyz]`` would retrieve a struct or ``[prop, foo]`` would retrieve a string in the example above.\n\n:::note\nSince only key-type segments are supported, a path cannot specify a list unless the list is the last segment.",
    "notImp": false
  }
] };

export const MetadataKey_SingleFields = [
  "key"
];

export const MetadataKey_PathSegment: OutType = { "MetadataKey_PathSegment": [
  {
    "name": "segment.key",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Specifies a segment in a path for retrieving values from Metadata. Currently, only key-based segments (field names) are supported.",
    "notImp": false
  }
] };

export const MetadataKey_PathSegment_SingleFields = [
  "segment.key"
];

export const MetadataKind: OutType = { "MetadataKind": [
  {
    "name": "kind.request",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "MetadataKind_Request",
    "enums": null,
    "comment": "Describes different types of metadata sources.",
    "notImp": false
  },
  {
    "name": "kind.route",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "MetadataKind_Route",
    "enums": null,
    "comment": "Describes different types of metadata sources.",
    "notImp": false
  },
  {
    "name": "kind.cluster",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "MetadataKind_Cluster",
    "enums": null,
    "comment": "Describes different types of metadata sources.",
    "notImp": false
  },
  {
    "name": "kind.host",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "MetadataKind_Host",
    "enums": null,
    "comment": "Describes different types of metadata sources.",
    "notImp": false
  }
] };