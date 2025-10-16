import {OutType} from '@elchi/tags/tagsType';


export const CustomTag: OutType = { "CustomTag": [
  {
    "name": "tag",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Used to populate the tag name.",
    "notImp": false
  },
  {
    "name": "type.literal",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "CustomTag_Literal",
    "enums": null,
    "comment": "A literal custom tag.",
    "notImp": false
  },
  {
    "name": "type.environment",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "CustomTag_Environment",
    "enums": null,
    "comment": "An environment custom tag.",
    "notImp": false
  },
  {
    "name": "type.request_header",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "CustomTag_Header",
    "enums": null,
    "comment": "A request header custom tag.",
    "notImp": false
  },
  {
    "name": "type.metadata",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "CustomTag_Metadata",
    "enums": null,
    "comment": "A custom tag to obtain tag value from the metadata.",
    "notImp": false
  }
] };

export const CustomTag_SingleFields = [
  "tag"
];

export const CustomTag_Literal: OutType = { "CustomTag_Literal": [
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Static literal value to populate the tag value.",
    "notImp": false
  }
] };

export const CustomTag_Literal_SingleFields = [
  "value"
];

export const CustomTag_Environment: OutType = { "CustomTag_Environment": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Environment variable name to obtain the value to populate the tag value.",
    "notImp": false
  },
  {
    "name": "default_value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "When the environment variable is not found, the tag value will be populated with this default value if specified, otherwise no tag will be populated.",
    "notImp": false
  }
] };

export const CustomTag_Environment_SingleFields = [
  "name",
  "default_value"
];

export const CustomTag_Header: OutType = { "CustomTag_Header": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Header name to obtain the value to populate the tag value.",
    "notImp": false
  },
  {
    "name": "default_value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "When the header does not exist, the tag value will be populated with this default value if specified, otherwise no tag will be populated.",
    "notImp": false
  }
] };

export const CustomTag_Header_SingleFields = [
  "name",
  "default_value"
];

export const CustomTag_Metadata: OutType = { "CustomTag_Metadata": [
  {
    "name": "kind",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "MetadataKind",
    "enums": null,
    "comment": "Specify what kind of metadata to obtain tag value from.",
    "notImp": false
  },
  {
    "name": "metadata_key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "MetadataKey",
    "enums": null,
    "comment": "Metadata key to define the path to retrieve the tag value.",
    "notImp": false
  },
  {
    "name": "default_value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "When no valid metadata is found, the tag value would be populated with this default value if specified, otherwise no tag would be populated.",
    "notImp": false
  }
] };

export const CustomTag_Metadata_SingleFields = [
  "default_value"
];