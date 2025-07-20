import {OutType} from '@elchi/tags/tagsType';


export const DoubleMatcher: OutType = { "DoubleMatcher": [
  {
    "name": "match_pattern.range",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "DoubleRange",
    "enums": null,
    "comment": "If specified, the input double value must be in the range specified here. Note: The range is using half-open interval semantics [start, end).",
    "notImp": false
  },
  {
    "name": "match_pattern.exact",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "If specified, the input double value must be equal to the value specified here.",
    "notImp": false
  }
] };

export const DoubleMatcher_SingleFields = [
  "match_pattern.exact"
];