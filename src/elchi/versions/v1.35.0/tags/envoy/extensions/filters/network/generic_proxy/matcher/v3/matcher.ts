import {OutType} from '@elchi/tags/tagsType';


export const PropertyMatchInput: OutType = { "PropertyMatchInput": [
  {
    "name": "property_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The property name to match on.",
    "notImp": false
  }
] };

export const PropertyMatchInput_SingleFields = [
  "property_name"
];

export const KeyValueMatchEntry: OutType = { "KeyValueMatchEntry": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The key name to match on.",
    "notImp": false
  },
  {
    "name": "string_match",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "StringMatcher",
    "enums": null,
    "comment": "The key value pattern.",
    "notImp": false
  }
] };

export const KeyValueMatchEntry_SingleFields = [
  "name"
];

export const RequestMatcher: OutType = { "RequestMatcher": [
  {
    "name": "host",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "StringMatcher",
    "enums": null,
    "comment": "Optional host pattern to match on. If not specified, any host will match.",
    "notImp": false
  },
  {
    "name": "path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "StringMatcher",
    "enums": null,
    "comment": "Optional path pattern to match on. If not specified, any path will match.",
    "notImp": false
  },
  {
    "name": "method",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "StringMatcher",
    "enums": null,
    "comment": "Optional method pattern to match on. If not specified, any method will match.",
    "notImp": false
  },
  {
    "name": "properties",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "KeyValueMatchEntry[]",
    "enums": null,
    "comment": "Optional arbitrary properties to match on. If not specified, any properties will match. The key is the property name and the value is the property value to match on.",
    "notImp": false
  }
] };