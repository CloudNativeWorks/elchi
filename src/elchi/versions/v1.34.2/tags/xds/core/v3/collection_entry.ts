import {OutType} from '@elchi/tags/tagsType';


export const CollectionEntry: OutType = { "CollectionEntry": [
  {
    "name": "resource_specifier.locator",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "ResourceLocator",
    "enums": null,
    "comment": "A resource locator describing how the member resource is to be located.",
    "notImp": false
  },
  {
    "name": "resource_specifier.inline_entry",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "CollectionEntry_InlineEntry",
    "enums": null,
    "comment": "The resource is inlined in the list collection.",
    "notImp": false
  }
] };

export const CollectionEntry_InlineEntry: OutType = { "CollectionEntry_InlineEntry": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Optional name to describe the inlined resource. Resource names must match ``[a-zA-Z0-9_-\\./]+`` (TODO(htuch): turn this into a PGV constraint once finalized, probably should be a RFC3986 pchar). This name allows reference via the #entry directive in ResourceLocator.",
    "notImp": false
  },
  {
    "name": "version",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The resource's logical version. It is illegal to have the same named xDS resource name at a given version with different resource payloads.",
    "notImp": false
  },
  {
    "name": "resource",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "The resource payload, including type URL.",
    "notImp": false
  }
] };

export const CollectionEntry_InlineEntry_SingleFields = [
  "name",
  "version"
];