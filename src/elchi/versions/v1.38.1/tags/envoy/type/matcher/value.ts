import {OutType} from '@elchi/tags/tagsType';


export const ValueMatcher: OutType = { "ValueMatcher": [
  {
    "name": "match_pattern.null_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "ValueMatcher_NullMatch",
    "enums": null,
    "comment": "Specifies the way to match a Protobuf::Value. Primitive values and ListValue are supported. StructValue is not supported and is always not matched. [#next-free-field: 7]",
    "notImp": false
  },
  {
    "name": "match_pattern.double_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "DoubleMatcher",
    "enums": null,
    "comment": "Specifies the way to match a Protobuf::Value. Primitive values and ListValue are supported. StructValue is not supported and is always not matched. [#next-free-field: 7]",
    "notImp": false
  },
  {
    "name": "match_pattern.string_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "StringMatcher",
    "enums": null,
    "comment": "Specifies the way to match a Protobuf::Value. Primitive values and ListValue are supported. StructValue is not supported and is always not matched. [#next-free-field: 7]",
    "notImp": false
  },
  {
    "name": "match_pattern.bool_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Specifies the way to match a Protobuf::Value. Primitive values and ListValue are supported. StructValue is not supported and is always not matched. [#next-free-field: 7]",
    "notImp": false
  },
  {
    "name": "match_pattern.present_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Specifies the way to match a Protobuf::Value. Primitive values and ListValue are supported. StructValue is not supported and is always not matched. [#next-free-field: 7]",
    "notImp": false
  },
  {
    "name": "match_pattern.list_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "ListMatcher",
    "enums": null,
    "comment": "Specifies the way to match a Protobuf::Value. Primitive values and ListValue are supported. StructValue is not supported and is always not matched. [#next-free-field: 7]",
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
    "comment": "Specifies the way to match a list value.",
    "notImp": false
  }
] };