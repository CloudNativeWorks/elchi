import {OutType} from '@/elchi/tags/tagsType';


export const StringMatcher: OutType = { "StringMatcher": [
  {
    "name": "match_pattern.exact",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The input string must match exactly the string specified here.\n\nExamples:\n\n* *abc* only matches the value *abc*.",
    "notImp": false
  },
  {
    "name": "match_pattern.prefix",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The input string must have the prefix specified here. Note: empty prefix is not allowed, please use regex instead.\n\nExamples:\n\n* *abc* matches the value *abc.xyz*",
    "notImp": false
  },
  {
    "name": "match_pattern.suffix",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The input string must have the suffix specified here. Note: empty prefix is not allowed, please use regex instead.\n\nExamples:\n\n* *abc* matches the value *xyz.abc*",
    "notImp": false
  },
  {
    "name": "match_pattern.regex",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The input string must match the regular expression specified here. The regex grammar is defined `here <https://en.cppreference.com/w/cpp/regex/ecmascript>`_.\n\nExamples:\n\n* The regex ``\\d{3}`` matches the value *123* * The regex ``\\d{3}`` does not match the value *1234* * The regex ``\\d{3}`` does not match the value *123.456*\n\n:::attention\nThis field has been deprecated in favor of `safe_regex` as it is not safe for use with untrusted input in all cases.",
    "notImp": false
  },
  {
    "name": "match_pattern.safe_regex",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RegexMatcher",
    "enums": null,
    "comment": "The input string must match the regular expression specified here.",
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
  "match_pattern.regex",
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