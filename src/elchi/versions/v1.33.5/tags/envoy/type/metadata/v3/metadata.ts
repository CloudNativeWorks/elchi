import {OutType} from '@elchi/tags/tagsType';


export const MetadataKey: OutType = { "MetadataKey": [
  {
    "name": "key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The key name of Metadata to retrieve the Struct from the metadata. Typically, it represents a builtin subsystem or custom extension.",
    "notImp": false
  },
  {
    "name": "path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "MetadataKey_PathSegment[]",
    "enums": null,
    "comment": "The path to retrieve the Value from the Struct. It can be a prefix or a full path, e.g. ``[prop, xyz]`` for a struct or ``[prop, foo]`` for a string in the example, which depends on the particular scenario.\n\nNote: Due to that only the key type segment is supported, the path can not specify a list unless the list is the last segment.",
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
    "comment": "If specified, use the key to retrieve the value in a Struct.",
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
    "comment": "Request kind of metadata.",
    "notImp": false
  },
  {
    "name": "kind.route",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "MetadataKind_Route",
    "enums": null,
    "comment": "Route kind of metadata.",
    "notImp": false
  },
  {
    "name": "kind.cluster",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "MetadataKind_Cluster",
    "enums": null,
    "comment": "Cluster kind of metadata.",
    "notImp": false
  },
  {
    "name": "kind.host",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "MetadataKind_Host",
    "enums": null,
    "comment": "Host kind of metadata.",
    "notImp": false
  }
] };