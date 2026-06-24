import {OutType} from '@elchi/tags/tagsType';


export const DoubleMatcher: OutType = { "DoubleMatcher": [
  {
    "name": "match_pattern.range",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "DoubleRange",
    "enums": null,
    "comment": "Specifies the way to match a double value.",
    "notImp": false
  },
  {
    "name": "match_pattern.exact",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Specifies the way to match a double value.",
    "notImp": false
  }
] };

export const DoubleMatcher_SingleFields = [
  "match_pattern.exact"
];