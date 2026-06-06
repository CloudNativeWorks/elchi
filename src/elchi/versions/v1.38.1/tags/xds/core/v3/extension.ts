import {OutType} from '@elchi/tags/tagsType';


export const TypedExtensionConfig: OutType = { "TypedExtensionConfig": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of an extension. This is not used to select the extension, instead it serves the role of an opaque identifier.",
    "notImp": false
  },
  {
    "name": "typed_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "The typed config for the extension. The type URL will be used to identify the extension. In the case that the type URL is *xds.type.v3.TypedStruct* (or, for historical reasons, *udpa.type.v1.TypedStruct*), the inner type URL of *TypedStruct* will be utilized. See the `extension configuration overview` for further details.",
    "notImp": false
  }
] };

export const TypedExtensionConfig_SingleFields = [
  "name"
];