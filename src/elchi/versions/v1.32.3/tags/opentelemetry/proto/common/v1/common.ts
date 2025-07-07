import {OutType} from '@/elchi/tags/tagsType';


export const AnyValue: OutType = { "AnyValue": [
  {
    "name": "value.string_value",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The value is one of the listed fields. It is valid for all values to be unspecified in which case this AnyValue is considered to be \"empty\".",
    "notImp": false
  },
  {
    "name": "value.bool_value",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "The value is one of the listed fields. It is valid for all values to be unspecified in which case this AnyValue is considered to be \"empty\".",
    "notImp": false
  },
  {
    "name": "value.int_value",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The value is one of the listed fields. It is valid for all values to be unspecified in which case this AnyValue is considered to be \"empty\".",
    "notImp": false
  },
  {
    "name": "value.double_value",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The value is one of the listed fields. It is valid for all values to be unspecified in which case this AnyValue is considered to be \"empty\".",
    "notImp": false
  },
  {
    "name": "value.array_value",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "ArrayValue",
    "enums": null,
    "comment": "The value is one of the listed fields. It is valid for all values to be unspecified in which case this AnyValue is considered to be \"empty\".",
    "notImp": false
  },
  {
    "name": "value.kvlist_value",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "KeyValueList",
    "enums": null,
    "comment": "The value is one of the listed fields. It is valid for all values to be unspecified in which case this AnyValue is considered to be \"empty\".",
    "notImp": false
  },
  {
    "name": "value.bytes_value",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Uint8Array<ArrayBufferLike>",
    "enums": null,
    "comment": "The value is one of the listed fields. It is valid for all values to be unspecified in which case this AnyValue is considered to be \"empty\".",
    "notImp": false
  }
] };

export const AnyValue_SingleFields = [
  "value.string_value",
  "value.bool_value",
  "value.int_value",
  "value.double_value"
];

export const ArrayValue: OutType = { "ArrayValue": [
  {
    "name": "values",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "AnyValue[]",
    "enums": null,
    "comment": "Array of values. The array may be empty (contain 0 elements).",
    "notImp": false
  }
] };

export const KeyValueList: OutType = { "KeyValueList": [
  {
    "name": "values",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "KeyValue[]",
    "enums": null,
    "comment": "A collection of key/value pairs of key-value pairs. The list may be empty (may contain 0 elements). The keys MUST be unique (it is not allowed to have more than one value with the same key).",
    "notImp": false
  }
] };

export const KeyValue: OutType = { "KeyValue": [
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
    "fieldType": "AnyValue",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const KeyValue_SingleFields = [
  "key"
];

export const InstrumentationScope: OutType = { "InstrumentationScope": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "An empty instrumentation scope name means the name is unknown.",
    "notImp": false
  },
  {
    "name": "version",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "attributes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "KeyValue[]",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "dropped_attributes_count",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const InstrumentationScope_SingleFields = [
  "name",
  "version",
  "dropped_attributes_count"
];