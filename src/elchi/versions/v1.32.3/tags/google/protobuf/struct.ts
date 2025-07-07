import {OutType} from '@/elchi/tags/tagsType';


export const Struct: OutType = { "Struct": [
  {
    "name": "fields",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, any>",
    "enums": null,
    "comment": "Unordered map of dynamically typed values.",
    "notImp": false
  }
] };

export const Struct_FieldsEntry: OutType = { "Struct_FieldsEntry": [
  {
    "name": "key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "any",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const Struct_FieldsEntry_SingleFields = [
  "key",
  "value"
];

export const Value: OutType = { "Value": [
  {
    "name": "kind.null_value",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "NullValue",
    "enums": [],
    "comment": "Represents a null value.",
    "notImp": false
  },
  {
    "name": "kind.number_value",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Represents a double value.",
    "notImp": false
  },
  {
    "name": "kind.string_value",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Represents a string value.",
    "notImp": false
  },
  {
    "name": "kind.bool_value",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Represents a boolean value.",
    "notImp": false
  },
  {
    "name": "kind.struct_value",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "{ [key: string]: any; }",
    "enums": null,
    "comment": "Represents a structured value.",
    "notImp": false
  },
  {
    "name": "kind.list_value",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "any[]",
    "enums": null,
    "comment": "Represents a repeated `Value`.",
    "notImp": false
  }
] };

export const Value_SingleFields = [
  "kind.null_value",
  "kind.number_value",
  "kind.string_value",
  "kind.bool_value"
];

export const ListValue: OutType = { "ListValue": [
  {
    "name": "values",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "any[]",
    "enums": null,
    "comment": "Repeated field of dynamically typed values.",
    "notImp": false
  }
] };