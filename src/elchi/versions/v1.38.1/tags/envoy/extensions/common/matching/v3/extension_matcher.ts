import {OutType} from '@elchi/tags/tagsType';


export const ExtensionWithMatcher: OutType = { "ExtensionWithMatcher": [
  {
    "name": "matcher",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "Matcher",
    "enums": null,
    "comment": "The associated matcher. This is deprecated in favor of xds_matcher.",
    "notImp": false
  },
  {
    "name": "xds_matcher",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Matcher",
    "enums": null,
    "comment": "The associated matcher.",
    "notImp": false
  },
  {
    "name": "extension_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "The underlying extension config.",
    "notImp": false
  }
] };

export const ExtensionWithMatcherPerRoute: OutType = { "ExtensionWithMatcherPerRoute": [
  {
    "name": "xds_matcher",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Matcher",
    "enums": null,
    "comment": "Matcher override.",
    "notImp": false
  }
] };