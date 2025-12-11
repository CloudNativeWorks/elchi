import {OutType} from '@elchi/tags/tagsType';


export const MappedAttributeBuilder: OutType = { "MappedAttributeBuilder": [
  {
    "name": "mapped_request_attributes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, string>",
    "enums": null,
    "comment": "A map of request attributes to set in the attributes struct. The key is the attribute name, the value is the attribute value, interpretable by CEL. This allows for the re-mapping of attributes, which is not supported by the native attribute building logic.",
    "notImp": false
  }
] };

export const MappedAttributeBuilder_MappedRequestAttributesEntry: OutType = { "MappedAttributeBuilder_MappedRequestAttributesEntry": [
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

export const MappedAttributeBuilder_MappedRequestAttributesEntry_SingleFields = [
  "key",
  "value"
];