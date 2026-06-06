import {OutType} from '@elchi/tags/tagsType';


export const StringMatcher: OutType = { "StringMatcher": [
  {
    "name": "match_pattern.exact",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Specifies the way to match a string. [#next-free-field: 8]",
    "notImp": false
  },
  {
    "name": "match_pattern.prefix",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Specifies the way to match a string. [#next-free-field: 8]",
    "notImp": false
  },
  {
    "name": "match_pattern.suffix",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Specifies the way to match a string. [#next-free-field: 8]",
    "notImp": false
  },
  {
    "name": "match_pattern.safe_regex",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RegexMatcher",
    "enums": null,
    "comment": "Specifies the way to match a string. [#next-free-field: 8]",
    "notImp": false
  },
  {
    "name": "match_pattern.contains",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Specifies the way to match a string. [#next-free-field: 8]",
    "notImp": false
  },
  {
    "name": "ignore_case",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, indicates the exact/prefix/suffix matching should be case insensitive. This has no effect for the safe_regex match. For example, the matcher *data* will match both input string *Data* and *data* if set to true.",
    "notImp": false
  }
] };

export const StringMatcher_SingleFields = [
  "match_pattern.exact",
  "match_pattern.prefix",
  "match_pattern.suffix",
  "match_pattern.contains",
  "ignore_case"
];

export const ListStringMatcher: OutType = { "ListStringMatcher": [
  {
    "name": "patterns",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "StringMatcher[]",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };