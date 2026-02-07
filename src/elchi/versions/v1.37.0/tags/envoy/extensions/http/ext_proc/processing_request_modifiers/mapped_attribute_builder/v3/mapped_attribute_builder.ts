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
  },
  {
    "name": "mapped_response_attributes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, string>",
    "enums": null,
    "comment": "Similar to ``mapped_request_attributes``, but for response attributes. The response nomenclature here just indicates that the attributes, whatever they may be, are sent with a response headers, body, or trailers ext_proc call. If a value contains a request key, e.g., ``request.host``, then the attribute would just be sent along in the response. This is useful if a given ext_proc extension is only enabled for response handling, e.g., ``RESPONSE_HEADERS`` but the backend wants to access request metadata.",
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

export const MappedAttributeBuilder_MappedResponseAttributesEntry: OutType = { "MappedAttributeBuilder_MappedResponseAttributesEntry": [
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

export const MappedAttributeBuilder_MappedResponseAttributesEntry_SingleFields = [
  "key",
  "value"
];