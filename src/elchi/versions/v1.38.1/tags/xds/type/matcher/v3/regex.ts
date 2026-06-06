import {OutType} from '@elchi/tags/tagsType';


export const RegexMatcher: OutType = { "RegexMatcher": [
  {
    "name": "engine_type.google_re2",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RegexMatcher_GoogleRE2",
    "enums": null,
    "comment": "A regex matcher designed for safety when used with untrusted input.",
    "notImp": false
  },
  {
    "name": "regex",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The regex match string. The string must be supported by the configured engine.",
    "notImp": false
  }
] };

export const RegexMatcher_SingleFields = [
  "regex"
];