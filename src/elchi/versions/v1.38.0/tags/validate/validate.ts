import {OutType} from '@elchi/tags/tagsType';


export const MessageRules: OutType = { "MessageRules": [
  {
    "name": "skip",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Skip specifies that the validation rules of this field should not be evaluated",
    "notImp": false
  },
  {
    "name": "required",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Required specifies that this field must be set",
    "notImp": false
  }
] };

export const MessageRules_SingleFields = [
  "skip",
  "required"
];

export const FieldRules: OutType = { "FieldRules": [
  {
    "name": "message",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "MessageRules",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "type.float",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "FloatRules",
    "enums": null,
    "comment": "Scalar Field Types",
    "notImp": false
  },
  {
    "name": "type.double",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "DoubleRules",
    "enums": null,
    "comment": "FieldRules encapsulates the rules for each type of field. Depending on the field, the correct set should be used to ensure proper validations.",
    "notImp": false
  },
  {
    "name": "type.int32",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Int32Rules",
    "enums": null,
    "comment": "FieldRules encapsulates the rules for each type of field. Depending on the field, the correct set should be used to ensure proper validations.",
    "notImp": false
  },
  {
    "name": "type.int64",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Int64Rules",
    "enums": null,
    "comment": "FieldRules encapsulates the rules for each type of field. Depending on the field, the correct set should be used to ensure proper validations.",
    "notImp": false
  },
  {
    "name": "type.uint32",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "UInt32Rules",
    "enums": null,
    "comment": "FieldRules encapsulates the rules for each type of field. Depending on the field, the correct set should be used to ensure proper validations.",
    "notImp": false
  },
  {
    "name": "type.uint64",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "UInt64Rules",
    "enums": null,
    "comment": "FieldRules encapsulates the rules for each type of field. Depending on the field, the correct set should be used to ensure proper validations.",
    "notImp": false
  },
  {
    "name": "type.sint32",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "SInt32Rules",
    "enums": null,
    "comment": "FieldRules encapsulates the rules for each type of field. Depending on the field, the correct set should be used to ensure proper validations.",
    "notImp": false
  },
  {
    "name": "type.sint64",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "SInt64Rules",
    "enums": null,
    "comment": "FieldRules encapsulates the rules for each type of field. Depending on the field, the correct set should be used to ensure proper validations.",
    "notImp": false
  },
  {
    "name": "type.fixed32",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Fixed32Rules",
    "enums": null,
    "comment": "FieldRules encapsulates the rules for each type of field. Depending on the field, the correct set should be used to ensure proper validations.",
    "notImp": false
  },
  {
    "name": "type.fixed64",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Fixed64Rules",
    "enums": null,
    "comment": "FieldRules encapsulates the rules for each type of field. Depending on the field, the correct set should be used to ensure proper validations.",
    "notImp": false
  },
  {
    "name": "type.sfixed32",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "SFixed32Rules",
    "enums": null,
    "comment": "FieldRules encapsulates the rules for each type of field. Depending on the field, the correct set should be used to ensure proper validations.",
    "notImp": false
  },
  {
    "name": "type.sfixed64",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "SFixed64Rules",
    "enums": null,
    "comment": "FieldRules encapsulates the rules for each type of field. Depending on the field, the correct set should be used to ensure proper validations.",
    "notImp": false
  },
  {
    "name": "type.bool",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "BoolRules",
    "enums": null,
    "comment": "FieldRules encapsulates the rules for each type of field. Depending on the field, the correct set should be used to ensure proper validations.",
    "notImp": false
  },
  {
    "name": "type.string",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "StringRules",
    "enums": null,
    "comment": "FieldRules encapsulates the rules for each type of field. Depending on the field, the correct set should be used to ensure proper validations.",
    "notImp": false
  },
  {
    "name": "type.bytes",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "BytesRules",
    "enums": null,
    "comment": "FieldRules encapsulates the rules for each type of field. Depending on the field, the correct set should be used to ensure proper validations.",
    "notImp": false
  },
  {
    "name": "type.enum",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "EnumRules",
    "enums": null,
    "comment": "Complex Field Types",
    "notImp": false
  },
  {
    "name": "type.repeated",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RepeatedRules",
    "enums": null,
    "comment": "FieldRules encapsulates the rules for each type of field. Depending on the field, the correct set should be used to ensure proper validations.",
    "notImp": false
  },
  {
    "name": "type.map",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "MapRules",
    "enums": null,
    "comment": "FieldRules encapsulates the rules for each type of field. Depending on the field, the correct set should be used to ensure proper validations.",
    "notImp": false
  },
  {
    "name": "type.any",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "AnyRules",
    "enums": null,
    "comment": "Well-Known Field Types",
    "notImp": false
  },
  {
    "name": "type.duration",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "DurationRules",
    "enums": null,
    "comment": "FieldRules encapsulates the rules for each type of field. Depending on the field, the correct set should be used to ensure proper validations.",
    "notImp": false
  },
  {
    "name": "type.timestamp",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "TimestampRules",
    "enums": null,
    "comment": "FieldRules encapsulates the rules for each type of field. Depending on the field, the correct set should be used to ensure proper validations.",
    "notImp": false
  }
] };

export const FloatRules: OutType = { "FloatRules": [
  {
    "name": "const",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Const specifies that this field must be exactly the specified value",
    "notImp": false
  },
  {
    "name": "lt",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Lt specifies that this field must be less than the specified value, exclusive",
    "notImp": false
  },
  {
    "name": "lte",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Lte specifies that this field must be less than or equal to the specified value, inclusive",
    "notImp": false
  },
  {
    "name": "gt",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Gt specifies that this field must be greater than the specified value, exclusive. If the value of Gt is larger than a specified Lt or Lte, the range is reversed.",
    "notImp": false
  },
  {
    "name": "gte",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Gte specifies that this field must be greater than or equal to the specified value, inclusive. If the value of Gte is larger than a specified Lt or Lte, the range is reversed.",
    "notImp": false
  },
  {
    "name": "in",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number[]",
    "enums": null,
    "comment": "In specifies that this field must be equal to one of the specified values",
    "notImp": false
  },
  {
    "name": "not_in",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number[]",
    "enums": null,
    "comment": "NotIn specifies that this field cannot be equal to one of the specified values",
    "notImp": false
  },
  {
    "name": "ignore_empty",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "IgnoreEmpty specifies that the validation rules of this field should be evaluated only if the field is not empty",
    "notImp": false
  }
] };

export const FloatRules_SingleFields = [
  "const",
  "lt",
  "lte",
  "gt",
  "gte",
  "in",
  "not_in",
  "ignore_empty"
];

export const DoubleRules: OutType = { "DoubleRules": [
  {
    "name": "const",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Const specifies that this field must be exactly the specified value",
    "notImp": false
  },
  {
    "name": "lt",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Lt specifies that this field must be less than the specified value, exclusive",
    "notImp": false
  },
  {
    "name": "lte",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Lte specifies that this field must be less than or equal to the specified value, inclusive",
    "notImp": false
  },
  {
    "name": "gt",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Gt specifies that this field must be greater than the specified value, exclusive. If the value of Gt is larger than a specified Lt or Lte, the range is reversed.",
    "notImp": false
  },
  {
    "name": "gte",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Gte specifies that this field must be greater than or equal to the specified value, inclusive. If the value of Gte is larger than a specified Lt or Lte, the range is reversed.",
    "notImp": false
  },
  {
    "name": "in",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number[]",
    "enums": null,
    "comment": "In specifies that this field must be equal to one of the specified values",
    "notImp": false
  },
  {
    "name": "not_in",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number[]",
    "enums": null,
    "comment": "NotIn specifies that this field cannot be equal to one of the specified values",
    "notImp": false
  },
  {
    "name": "ignore_empty",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "IgnoreEmpty specifies that the validation rules of this field should be evaluated only if the field is not empty",
    "notImp": false
  }
] };

export const DoubleRules_SingleFields = [
  "const",
  "lt",
  "lte",
  "gt",
  "gte",
  "in",
  "not_in",
  "ignore_empty"
];

export const Int32Rules: OutType = { "Int32Rules": [
  {
    "name": "const",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Const specifies that this field must be exactly the specified value",
    "notImp": false
  },
  {
    "name": "lt",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Lt specifies that this field must be less than the specified value, exclusive",
    "notImp": false
  },
  {
    "name": "lte",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Lte specifies that this field must be less than or equal to the specified value, inclusive",
    "notImp": false
  },
  {
    "name": "gt",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Gt specifies that this field must be greater than the specified value, exclusive. If the value of Gt is larger than a specified Lt or Lte, the range is reversed.",
    "notImp": false
  },
  {
    "name": "gte",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Gte specifies that this field must be greater than or equal to the specified value, inclusive. If the value of Gte is larger than a specified Lt or Lte, the range is reversed.",
    "notImp": false
  },
  {
    "name": "in",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number[]",
    "enums": null,
    "comment": "In specifies that this field must be equal to one of the specified values",
    "notImp": false
  },
  {
    "name": "not_in",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number[]",
    "enums": null,
    "comment": "NotIn specifies that this field cannot be equal to one of the specified values",
    "notImp": false
  },
  {
    "name": "ignore_empty",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "IgnoreEmpty specifies that the validation rules of this field should be evaluated only if the field is not empty",
    "notImp": false
  }
] };

export const Int32Rules_SingleFields = [
  "const",
  "lt",
  "lte",
  "gt",
  "gte",
  "in",
  "not_in",
  "ignore_empty"
];

export const Int64Rules: OutType = { "Int64Rules": [
  {
    "name": "const",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Const specifies that this field must be exactly the specified value",
    "notImp": false
  },
  {
    "name": "lt",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Lt specifies that this field must be less than the specified value, exclusive",
    "notImp": false
  },
  {
    "name": "lte",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Lte specifies that this field must be less than or equal to the specified value, inclusive",
    "notImp": false
  },
  {
    "name": "gt",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Gt specifies that this field must be greater than the specified value, exclusive. If the value of Gt is larger than a specified Lt or Lte, the range is reversed.",
    "notImp": false
  },
  {
    "name": "gte",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Gte specifies that this field must be greater than or equal to the specified value, inclusive. If the value of Gte is larger than a specified Lt or Lte, the range is reversed.",
    "notImp": false
  },
  {
    "name": "in",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number[]",
    "enums": null,
    "comment": "In specifies that this field must be equal to one of the specified values",
    "notImp": false
  },
  {
    "name": "not_in",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number[]",
    "enums": null,
    "comment": "NotIn specifies that this field cannot be equal to one of the specified values",
    "notImp": false
  },
  {
    "name": "ignore_empty",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "IgnoreEmpty specifies that the validation rules of this field should be evaluated only if the field is not empty",
    "notImp": false
  }
] };

export const Int64Rules_SingleFields = [
  "const",
  "lt",
  "lte",
  "gt",
  "gte",
  "in",
  "not_in",
  "ignore_empty"
];

export const UInt32Rules: OutType = { "UInt32Rules": [
  {
    "name": "const",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Const specifies that this field must be exactly the specified value",
    "notImp": false
  },
  {
    "name": "lt",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Lt specifies that this field must be less than the specified value, exclusive",
    "notImp": false
  },
  {
    "name": "lte",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Lte specifies that this field must be less than or equal to the specified value, inclusive",
    "notImp": false
  },
  {
    "name": "gt",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Gt specifies that this field must be greater than the specified value, exclusive. If the value of Gt is larger than a specified Lt or Lte, the range is reversed.",
    "notImp": false
  },
  {
    "name": "gte",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Gte specifies that this field must be greater than or equal to the specified value, inclusive. If the value of Gte is larger than a specified Lt or Lte, the range is reversed.",
    "notImp": false
  },
  {
    "name": "in",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number[]",
    "enums": null,
    "comment": "In specifies that this field must be equal to one of the specified values",
    "notImp": false
  },
  {
    "name": "not_in",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number[]",
    "enums": null,
    "comment": "NotIn specifies that this field cannot be equal to one of the specified values",
    "notImp": false
  },
  {
    "name": "ignore_empty",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "IgnoreEmpty specifies that the validation rules of this field should be evaluated only if the field is not empty",
    "notImp": false
  }
] };

export const UInt32Rules_SingleFields = [
  "const",
  "lt",
  "lte",
  "gt",
  "gte",
  "in",
  "not_in",
  "ignore_empty"
];

export const UInt64Rules: OutType = { "UInt64Rules": [
  {
    "name": "const",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Const specifies that this field must be exactly the specified value",
    "notImp": false
  },
  {
    "name": "lt",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Lt specifies that this field must be less than the specified value, exclusive",
    "notImp": false
  },
  {
    "name": "lte",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Lte specifies that this field must be less than or equal to the specified value, inclusive",
    "notImp": false
  },
  {
    "name": "gt",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Gt specifies that this field must be greater than the specified value, exclusive. If the value of Gt is larger than a specified Lt or Lte, the range is reversed.",
    "notImp": false
  },
  {
    "name": "gte",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Gte specifies that this field must be greater than or equal to the specified value, inclusive. If the value of Gte is larger than a specified Lt or Lte, the range is reversed.",
    "notImp": false
  },
  {
    "name": "in",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number[]",
    "enums": null,
    "comment": "In specifies that this field must be equal to one of the specified values",
    "notImp": false
  },
  {
    "name": "not_in",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number[]",
    "enums": null,
    "comment": "NotIn specifies that this field cannot be equal to one of the specified values",
    "notImp": false
  },
  {
    "name": "ignore_empty",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "IgnoreEmpty specifies that the validation rules of this field should be evaluated only if the field is not empty",
    "notImp": false
  }
] };

export const UInt64Rules_SingleFields = [
  "const",
  "lt",
  "lte",
  "gt",
  "gte",
  "in",
  "not_in",
  "ignore_empty"
];

export const SInt32Rules: OutType = { "SInt32Rules": [
  {
    "name": "const",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Const specifies that this field must be exactly the specified value",
    "notImp": false
  },
  {
    "name": "lt",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Lt specifies that this field must be less than the specified value, exclusive",
    "notImp": false
  },
  {
    "name": "lte",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Lte specifies that this field must be less than or equal to the specified value, inclusive",
    "notImp": false
  },
  {
    "name": "gt",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Gt specifies that this field must be greater than the specified value, exclusive. If the value of Gt is larger than a specified Lt or Lte, the range is reversed.",
    "notImp": false
  },
  {
    "name": "gte",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Gte specifies that this field must be greater than or equal to the specified value, inclusive. If the value of Gte is larger than a specified Lt or Lte, the range is reversed.",
    "notImp": false
  },
  {
    "name": "in",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number[]",
    "enums": null,
    "comment": "In specifies that this field must be equal to one of the specified values",
    "notImp": false
  },
  {
    "name": "not_in",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number[]",
    "enums": null,
    "comment": "NotIn specifies that this field cannot be equal to one of the specified values",
    "notImp": false
  },
  {
    "name": "ignore_empty",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "IgnoreEmpty specifies that the validation rules of this field should be evaluated only if the field is not empty",
    "notImp": false
  }
] };

export const SInt32Rules_SingleFields = [
  "const",
  "lt",
  "lte",
  "gt",
  "gte",
  "in",
  "not_in",
  "ignore_empty"
];

export const SInt64Rules: OutType = { "SInt64Rules": [
  {
    "name": "const",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Const specifies that this field must be exactly the specified value",
    "notImp": false
  },
  {
    "name": "lt",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Lt specifies that this field must be less than the specified value, exclusive",
    "notImp": false
  },
  {
    "name": "lte",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Lte specifies that this field must be less than or equal to the specified value, inclusive",
    "notImp": false
  },
  {
    "name": "gt",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Gt specifies that this field must be greater than the specified value, exclusive. If the value of Gt is larger than a specified Lt or Lte, the range is reversed.",
    "notImp": false
  },
  {
    "name": "gte",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Gte specifies that this field must be greater than or equal to the specified value, inclusive. If the value of Gte is larger than a specified Lt or Lte, the range is reversed.",
    "notImp": false
  },
  {
    "name": "in",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number[]",
    "enums": null,
    "comment": "In specifies that this field must be equal to one of the specified values",
    "notImp": false
  },
  {
    "name": "not_in",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number[]",
    "enums": null,
    "comment": "NotIn specifies that this field cannot be equal to one of the specified values",
    "notImp": false
  },
  {
    "name": "ignore_empty",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "IgnoreEmpty specifies that the validation rules of this field should be evaluated only if the field is not empty",
    "notImp": false
  }
] };

export const SInt64Rules_SingleFields = [
  "const",
  "lt",
  "lte",
  "gt",
  "gte",
  "in",
  "not_in",
  "ignore_empty"
];

export const Fixed32Rules: OutType = { "Fixed32Rules": [
  {
    "name": "const",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Const specifies that this field must be exactly the specified value",
    "notImp": false
  },
  {
    "name": "lt",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Lt specifies that this field must be less than the specified value, exclusive",
    "notImp": false
  },
  {
    "name": "lte",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Lte specifies that this field must be less than or equal to the specified value, inclusive",
    "notImp": false
  },
  {
    "name": "gt",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Gt specifies that this field must be greater than the specified value, exclusive. If the value of Gt is larger than a specified Lt or Lte, the range is reversed.",
    "notImp": false
  },
  {
    "name": "gte",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Gte specifies that this field must be greater than or equal to the specified value, inclusive. If the value of Gte is larger than a specified Lt or Lte, the range is reversed.",
    "notImp": false
  },
  {
    "name": "in",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number[]",
    "enums": null,
    "comment": "In specifies that this field must be equal to one of the specified values",
    "notImp": false
  },
  {
    "name": "not_in",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number[]",
    "enums": null,
    "comment": "NotIn specifies that this field cannot be equal to one of the specified values",
    "notImp": false
  },
  {
    "name": "ignore_empty",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "IgnoreEmpty specifies that the validation rules of this field should be evaluated only if the field is not empty",
    "notImp": false
  }
] };

export const Fixed32Rules_SingleFields = [
  "const",
  "lt",
  "lte",
  "gt",
  "gte",
  "in",
  "not_in",
  "ignore_empty"
];

export const Fixed64Rules: OutType = { "Fixed64Rules": [
  {
    "name": "const",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Const specifies that this field must be exactly the specified value",
    "notImp": false
  },
  {
    "name": "lt",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Lt specifies that this field must be less than the specified value, exclusive",
    "notImp": false
  },
  {
    "name": "lte",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Lte specifies that this field must be less than or equal to the specified value, inclusive",
    "notImp": false
  },
  {
    "name": "gt",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Gt specifies that this field must be greater than the specified value, exclusive. If the value of Gt is larger than a specified Lt or Lte, the range is reversed.",
    "notImp": false
  },
  {
    "name": "gte",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Gte specifies that this field must be greater than or equal to the specified value, inclusive. If the value of Gte is larger than a specified Lt or Lte, the range is reversed.",
    "notImp": false
  },
  {
    "name": "in",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number[]",
    "enums": null,
    "comment": "In specifies that this field must be equal to one of the specified values",
    "notImp": false
  },
  {
    "name": "not_in",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number[]",
    "enums": null,
    "comment": "NotIn specifies that this field cannot be equal to one of the specified values",
    "notImp": false
  },
  {
    "name": "ignore_empty",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "IgnoreEmpty specifies that the validation rules of this field should be evaluated only if the field is not empty",
    "notImp": false
  }
] };

export const Fixed64Rules_SingleFields = [
  "const",
  "lt",
  "lte",
  "gt",
  "gte",
  "in",
  "not_in",
  "ignore_empty"
];

export const SFixed32Rules: OutType = { "SFixed32Rules": [
  {
    "name": "const",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Const specifies that this field must be exactly the specified value",
    "notImp": false
  },
  {
    "name": "lt",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Lt specifies that this field must be less than the specified value, exclusive",
    "notImp": false
  },
  {
    "name": "lte",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Lte specifies that this field must be less than or equal to the specified value, inclusive",
    "notImp": false
  },
  {
    "name": "gt",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Gt specifies that this field must be greater than the specified value, exclusive. If the value of Gt is larger than a specified Lt or Lte, the range is reversed.",
    "notImp": false
  },
  {
    "name": "gte",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Gte specifies that this field must be greater than or equal to the specified value, inclusive. If the value of Gte is larger than a specified Lt or Lte, the range is reversed.",
    "notImp": false
  },
  {
    "name": "in",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number[]",
    "enums": null,
    "comment": "In specifies that this field must be equal to one of the specified values",
    "notImp": false
  },
  {
    "name": "not_in",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number[]",
    "enums": null,
    "comment": "NotIn specifies that this field cannot be equal to one of the specified values",
    "notImp": false
  },
  {
    "name": "ignore_empty",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "IgnoreEmpty specifies that the validation rules of this field should be evaluated only if the field is not empty",
    "notImp": false
  }
] };

export const SFixed32Rules_SingleFields = [
  "const",
  "lt",
  "lte",
  "gt",
  "gte",
  "in",
  "not_in",
  "ignore_empty"
];

export const SFixed64Rules: OutType = { "SFixed64Rules": [
  {
    "name": "const",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Const specifies that this field must be exactly the specified value",
    "notImp": false
  },
  {
    "name": "lt",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Lt specifies that this field must be less than the specified value, exclusive",
    "notImp": false
  },
  {
    "name": "lte",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Lte specifies that this field must be less than or equal to the specified value, inclusive",
    "notImp": false
  },
  {
    "name": "gt",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Gt specifies that this field must be greater than the specified value, exclusive. If the value of Gt is larger than a specified Lt or Lte, the range is reversed.",
    "notImp": false
  },
  {
    "name": "gte",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Gte specifies that this field must be greater than or equal to the specified value, inclusive. If the value of Gte is larger than a specified Lt or Lte, the range is reversed.",
    "notImp": false
  },
  {
    "name": "in",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number[]",
    "enums": null,
    "comment": "In specifies that this field must be equal to one of the specified values",
    "notImp": false
  },
  {
    "name": "not_in",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number[]",
    "enums": null,
    "comment": "NotIn specifies that this field cannot be equal to one of the specified values",
    "notImp": false
  },
  {
    "name": "ignore_empty",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "IgnoreEmpty specifies that the validation rules of this field should be evaluated only if the field is not empty",
    "notImp": false
  }
] };

export const SFixed64Rules_SingleFields = [
  "const",
  "lt",
  "lte",
  "gt",
  "gte",
  "in",
  "not_in",
  "ignore_empty"
];

export const BoolRules: OutType = { "BoolRules": [
  {
    "name": "const",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Const specifies that this field must be exactly the specified value",
    "notImp": false
  }
] };

export const BoolRules_SingleFields = [
  "const"
];

export const StringRules: OutType = { "StringRules": [
  {
    "name": "const",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Const specifies that this field must be exactly the specified value",
    "notImp": false
  },
  {
    "name": "len",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Len specifies that this field must be the specified number of characters (Unicode code points). Note that the number of characters may differ from the number of bytes in the string.",
    "notImp": false
  },
  {
    "name": "min_len",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "MinLen specifies that this field must be the specified number of characters (Unicode code points) at a minimum. Note that the number of characters may differ from the number of bytes in the string.",
    "notImp": false
  },
  {
    "name": "max_len",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "MaxLen specifies that this field must be the specified number of characters (Unicode code points) at a maximum. Note that the number of characters may differ from the number of bytes in the string.",
    "notImp": false
  },
  {
    "name": "len_bytes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "LenBytes specifies that this field must be the specified number of bytes",
    "notImp": false
  },
  {
    "name": "min_bytes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "MinBytes specifies that this field must be the specified number of bytes at a minimum",
    "notImp": false
  },
  {
    "name": "max_bytes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "MaxBytes specifies that this field must be the specified number of bytes at a maximum",
    "notImp": false
  },
  {
    "name": "pattern",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Pattern specifes that this field must match against the specified regular expression (RE2 syntax). The included expression should elide any delimiters.",
    "notImp": false
  },
  {
    "name": "prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Prefix specifies that this field must have the specified substring at the beginning of the string.",
    "notImp": false
  },
  {
    "name": "suffix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Suffix specifies that this field must have the specified substring at the end of the string.",
    "notImp": false
  },
  {
    "name": "contains",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Contains specifies that this field must have the specified substring anywhere in the string.",
    "notImp": false
  },
  {
    "name": "not_contains",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "NotContains specifies that this field cannot have the specified substring anywhere in the string.",
    "notImp": false
  },
  {
    "name": "in",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "In specifies that this field must be equal to one of the specified values",
    "notImp": false
  },
  {
    "name": "not_in",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "NotIn specifies that this field cannot be equal to one of the specified values",
    "notImp": false
  },
  {
    "name": "well_known.email",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Email specifies that the field must be a valid email address as defined by RFC 5322",
    "notImp": false
  },
  {
    "name": "well_known.hostname",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Hostname specifies that the field must be a valid hostname as defined by RFC 1034. This constraint does not support internationalized domain names (IDNs).",
    "notImp": false
  },
  {
    "name": "well_known.ip",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Ip specifies that the field must be a valid IP (v4 or v6) address. Valid IPv6 addresses should not include surrounding square brackets.",
    "notImp": false
  },
  {
    "name": "well_known.ipv4",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Ipv4 specifies that the field must be a valid IPv4 address.",
    "notImp": false
  },
  {
    "name": "well_known.ipv6",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Ipv6 specifies that the field must be a valid IPv6 address. Valid IPv6 addresses should not include surrounding square brackets.",
    "notImp": false
  },
  {
    "name": "well_known.uri",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Uri specifies that the field must be a valid, absolute URI as defined by RFC 3986",
    "notImp": false
  },
  {
    "name": "well_known.uri_ref",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "UriRef specifies that the field must be a valid URI as defined by RFC 3986 and may be relative or absolute.",
    "notImp": false
  },
  {
    "name": "well_known.address",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Address specifies that the field must be either a valid hostname as defined by RFC 1034 (which does not support internationalized domain names or IDNs), or it can be a valid IP (v4 or v6).",
    "notImp": false
  },
  {
    "name": "well_known.uuid",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Uuid specifies that the field must be a valid UUID as defined by RFC 4122",
    "notImp": false
  },
  {
    "name": "well_known.well_known_regex",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "KnownRegex",
    "enums": [
      "UNKNOWN",
      "HTTP_HEADER_NAME",
      "HTTP_HEADER_VALUE"
    ],
    "comment": "WellKnownRegex specifies a common well known pattern defined as a regex.",
    "notImp": false
  },
  {
    "name": "strict",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "This applies to regexes HTTP_HEADER_NAME and HTTP_HEADER_VALUE to enable strict header validation. By default, this is true, and HTTP header validations are RFC-compliant. Setting to false will enable a looser validations that only disallows \\r\\n\\0 characters, which can be used to bypass header matching rules.",
    "notImp": false
  },
  {
    "name": "ignore_empty",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "IgnoreEmpty specifies that the validation rules of this field should be evaluated only if the field is not empty",
    "notImp": false
  }
] };

export const StringRules_SingleFields = [
  "const",
  "len",
  "min_len",
  "max_len",
  "len_bytes",
  "min_bytes",
  "max_bytes",
  "pattern",
  "prefix",
  "suffix",
  "contains",
  "not_contains",
  "in",
  "not_in",
  "well_known.email",
  "well_known.hostname",
  "well_known.ip",
  "well_known.ipv4",
  "well_known.ipv6",
  "well_known.uri",
  "well_known.uri_ref",
  "well_known.address",
  "well_known.uuid",
  "well_known.well_known_regex",
  "strict",
  "ignore_empty"
];

export const BytesRules: OutType = { "BytesRules": [
  {
    "name": "const",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Uint8Array<ArrayBufferLike>",
    "enums": null,
    "comment": "Const specifies that this field must be exactly the specified value",
    "notImp": false
  },
  {
    "name": "len",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Len specifies that this field must be the specified number of bytes",
    "notImp": false
  },
  {
    "name": "min_len",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "MinLen specifies that this field must be the specified number of bytes at a minimum",
    "notImp": false
  },
  {
    "name": "max_len",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "MaxLen specifies that this field must be the specified number of bytes at a maximum",
    "notImp": false
  },
  {
    "name": "pattern",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Pattern specifes that this field must match against the specified regular expression (RE2 syntax). The included expression should elide any delimiters.",
    "notImp": false
  },
  {
    "name": "prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Uint8Array<ArrayBufferLike>",
    "enums": null,
    "comment": "Prefix specifies that this field must have the specified bytes at the beginning of the string.",
    "notImp": false
  },
  {
    "name": "suffix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Uint8Array<ArrayBufferLike>",
    "enums": null,
    "comment": "Suffix specifies that this field must have the specified bytes at the end of the string.",
    "notImp": false
  },
  {
    "name": "contains",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Uint8Array<ArrayBufferLike>",
    "enums": null,
    "comment": "Contains specifies that this field must have the specified bytes anywhere in the string.",
    "notImp": false
  },
  {
    "name": "in",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Uint8Array<ArrayBufferLike>[]",
    "enums": null,
    "comment": "In specifies that this field must be equal to one of the specified values",
    "notImp": false
  },
  {
    "name": "not_in",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Uint8Array<ArrayBufferLike>[]",
    "enums": null,
    "comment": "NotIn specifies that this field cannot be equal to one of the specified values",
    "notImp": false
  },
  {
    "name": "well_known.ip",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Ip specifies that the field must be a valid IP (v4 or v6) address in byte format",
    "notImp": false
  },
  {
    "name": "well_known.ipv4",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Ipv4 specifies that the field must be a valid IPv4 address in byte format",
    "notImp": false
  },
  {
    "name": "well_known.ipv6",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Ipv6 specifies that the field must be a valid IPv6 address in byte format",
    "notImp": false
  },
  {
    "name": "ignore_empty",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "IgnoreEmpty specifies that the validation rules of this field should be evaluated only if the field is not empty",
    "notImp": false
  }
] };

export const BytesRules_SingleFields = [
  "len",
  "min_len",
  "max_len",
  "pattern",
  "well_known.ip",
  "well_known.ipv4",
  "well_known.ipv6",
  "ignore_empty"
];

export const EnumRules: OutType = { "EnumRules": [
  {
    "name": "const",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Const specifies that this field must be exactly the specified value",
    "notImp": false
  },
  {
    "name": "defined_only",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "DefinedOnly specifies that this field must be only one of the defined values for this enum, failing on any undefined value.",
    "notImp": false
  },
  {
    "name": "in",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number[]",
    "enums": null,
    "comment": "In specifies that this field must be equal to one of the specified values",
    "notImp": false
  },
  {
    "name": "not_in",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number[]",
    "enums": null,
    "comment": "NotIn specifies that this field cannot be equal to one of the specified values",
    "notImp": false
  }
] };

export const EnumRules_SingleFields = [
  "const",
  "defined_only",
  "in",
  "not_in"
];

export const RepeatedRules: OutType = { "RepeatedRules": [
  {
    "name": "min_items",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "MinItems specifies that this field must have the specified number of items at a minimum",
    "notImp": false
  },
  {
    "name": "max_items",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "MaxItems specifies that this field must have the specified number of items at a maximum",
    "notImp": false
  },
  {
    "name": "unique",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Unique specifies that all elements in this field must be unique. This contraint is only applicable to scalar and enum types (messages are not supported).",
    "notImp": false
  },
  {
    "name": "items",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FieldRules",
    "enums": null,
    "comment": "Items specifies the contraints to be applied to each item in the field. Repeated message fields will still execute validation against each item unless skip is specified here.",
    "notImp": false
  },
  {
    "name": "ignore_empty",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "IgnoreEmpty specifies that the validation rules of this field should be evaluated only if the field is not empty",
    "notImp": false
  }
] };

export const RepeatedRules_SingleFields = [
  "min_items",
  "max_items",
  "unique",
  "ignore_empty"
];

export const MapRules: OutType = { "MapRules": [
  {
    "name": "min_pairs",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "MinPairs specifies that this field must have the specified number of KVs at a minimum",
    "notImp": false
  },
  {
    "name": "max_pairs",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "MaxPairs specifies that this field must have the specified number of KVs at a maximum",
    "notImp": false
  },
  {
    "name": "no_sparse",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "NoSparse specifies values in this field cannot be unset. This only applies to map's with message value types.",
    "notImp": false
  },
  {
    "name": "keys",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FieldRules",
    "enums": null,
    "comment": "Keys specifies the constraints to be applied to each key in the field.",
    "notImp": false
  },
  {
    "name": "values",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FieldRules",
    "enums": null,
    "comment": "Values specifies the constraints to be applied to the value of each key in the field. Message values will still have their validations evaluated unless skip is specified here.",
    "notImp": false
  },
  {
    "name": "ignore_empty",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "IgnoreEmpty specifies that the validation rules of this field should be evaluated only if the field is not empty",
    "notImp": false
  }
] };

export const MapRules_SingleFields = [
  "min_pairs",
  "max_pairs",
  "no_sparse",
  "ignore_empty"
];

export const AnyRules: OutType = { "AnyRules": [
  {
    "name": "required",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Required specifies that this field must be set",
    "notImp": false
  },
  {
    "name": "in",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "In specifies that this field's `type_url` must be equal to one of the specified values.",
    "notImp": false
  },
  {
    "name": "not_in",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "NotIn specifies that this field's `type_url` must not be equal to any of the specified values.",
    "notImp": false
  }
] };

export const AnyRules_SingleFields = [
  "required",
  "in",
  "not_in"
];

export const DurationRules: OutType = { "DurationRules": [
  {
    "name": "required",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Required specifies that this field must be set",
    "notImp": false
  },
  {
    "name": "const",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Const specifies that this field must be exactly the specified value",
    "notImp": false
  },
  {
    "name": "lt",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Lt specifies that this field must be less than the specified value, exclusive",
    "notImp": false
  },
  {
    "name": "lte",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Lt specifies that this field must be less than the specified value, inclusive",
    "notImp": false
  },
  {
    "name": "gt",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Gt specifies that this field must be greater than the specified value, exclusive",
    "notImp": false
  },
  {
    "name": "gte",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Gte specifies that this field must be greater than the specified value, inclusive",
    "notImp": false
  },
  {
    "name": "in",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration[]",
    "enums": null,
    "comment": "In specifies that this field must be equal to one of the specified values",
    "notImp": false
  },
  {
    "name": "not_in",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration[]",
    "enums": null,
    "comment": "NotIn specifies that this field cannot be equal to one of the specified values",
    "notImp": false
  }
] };

export const DurationRules_SingleFields = [
  "required",
  "const",
  "lt",
  "lte",
  "gt",
  "gte"
];

export const TimestampRules: OutType = { "TimestampRules": [
  {
    "name": "required",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Required specifies that this field must be set",
    "notImp": false
  },
  {
    "name": "const",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Date",
    "enums": null,
    "comment": "Const specifies that this field must be exactly the specified value",
    "notImp": false
  },
  {
    "name": "lt",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Date",
    "enums": null,
    "comment": "Lt specifies that this field must be less than the specified value, exclusive",
    "notImp": false
  },
  {
    "name": "lte",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Date",
    "enums": null,
    "comment": "Lte specifies that this field must be less than the specified value, inclusive",
    "notImp": false
  },
  {
    "name": "gt",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Date",
    "enums": null,
    "comment": "Gt specifies that this field must be greater than the specified value, exclusive",
    "notImp": false
  },
  {
    "name": "gte",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Date",
    "enums": null,
    "comment": "Gte specifies that this field must be greater than the specified value, inclusive",
    "notImp": false
  },
  {
    "name": "lt_now",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "LtNow specifies that this must be less than the current time. LtNow can only be used with the Within rule.",
    "notImp": false
  },
  {
    "name": "gt_now",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "GtNow specifies that this must be greater than the current time. GtNow can only be used with the Within rule.",
    "notImp": false
  },
  {
    "name": "within",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Within specifies that this field must be within this duration of the current time. This constraint can be used alone or with the LtNow and GtNow rules.",
    "notImp": false
  }
] };

export const TimestampRules_SingleFields = [
  "required",
  "lt_now",
  "gt_now",
  "within"
];