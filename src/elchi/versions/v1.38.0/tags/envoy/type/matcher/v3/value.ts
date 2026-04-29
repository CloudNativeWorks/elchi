import {OutType} from '@elchi/tags/tagsType';


export const ValueMatcher: OutType = { "ValueMatcher": [
  {
    "name": "match_pattern.null_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "ValueMatcher_NullMatch",
    "enums": null,
    "comment": "If specified, a match occurs if and only if the target value is a NullValue.",
    "notImp": false
  },
  {
    "name": "match_pattern.double_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "DoubleMatcher",
    "enums": null,
    "comment": "If specified, a match occurs if and only if the target value is a double value and is matched to this field.",
    "notImp": false
  },
  {
    "name": "match_pattern.string_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "StringMatcher",
    "enums": null,
    "comment": "If specified, a match occurs if and only if the target value is a string value and is matched to this field.",
    "notImp": false
  },
  {
    "name": "match_pattern.bool_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If specified, a match occurs if and only if the target value is a bool value and is equal to this field.",
    "notImp": false
  },
  {
    "name": "match_pattern.present_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If specified, value match will be performed based on whether the path is referring to a valid primitive value in the metadata. If the path is referring to a non-primitive value, the result is always not matched.",
    "notImp": false
  },
  {
    "name": "match_pattern.list_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "ListMatcher",
    "enums": null,
    "comment": "If specified, a match occurs if and only if the target value is a list value and is matched to this field.",
    "notImp": false
  },
  {
    "name": "match_pattern.or_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "OrMatcher",
    "enums": null,
    "comment": "If specified, a match occurs if and only if any of the alternatives in the match accept the value.",
    "notImp": false
  }
] };

export const ValueMatcher_SingleFields = [
  "match_pattern.bool_match",
  "match_pattern.present_match"
];

export const ListMatcher: OutType = { "ListMatcher": [
  {
    "name": "match_pattern.one_of",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "ValueMatcher",
    "enums": null,
    "comment": "If specified, at least one of the values in the list must match the value specified.",
    "notImp": false
  }
] };

export const OrMatcher: OutType = { "OrMatcher": [
  {
    "name": "value_matchers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ValueMatcher[]",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };