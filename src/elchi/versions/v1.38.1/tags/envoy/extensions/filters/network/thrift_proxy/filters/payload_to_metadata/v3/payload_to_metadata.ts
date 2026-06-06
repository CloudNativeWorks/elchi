import {OutType} from '@elchi/tags/tagsType';


export const PayloadToMetadata: OutType = { "PayloadToMetadata": [
  {
    "name": "request_rules",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "PayloadToMetadata_Rule[]",
    "enums": null,
    "comment": "The list of rules to apply to requests.",
    "notImp": false
  }
] };

export const PayloadToMetadata_KeyValuePair: OutType = { "PayloadToMetadata_KeyValuePair": [
  {
    "name": "metadata_namespace",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The namespace — if this is empty, the filter's namespace will be used.",
    "notImp": false
  },
  {
    "name": "key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The key to use within the namespace.",
    "notImp": false
  },
  {
    "name": "value_type.value",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "[#next-free-field: 6]",
    "notImp": false
  },
  {
    "name": "value_type.regex_value_rewrite",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RegexMatchAndSubstitute",
    "enums": null,
    "comment": "[#next-free-field: 6]",
    "notImp": false
  },
  {
    "name": "type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "PayloadToMetadata_ValueType",
    "enums": [
      "STRING",
      "NUMBER"
    ],
    "comment": "The value's type — defaults to string.",
    "notImp": false
  }
] };

export const PayloadToMetadata_KeyValuePair_SingleFields = [
  "metadata_namespace",
  "key",
  "value_type.value",
  "type"
];

export const PayloadToMetadata_FieldSelector: OutType = { "PayloadToMetadata_FieldSelector": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "field name to log",
    "notImp": false
  },
  {
    "name": "id",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "field id to match",
    "notImp": false
  },
  {
    "name": "child",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "PayloadToMetadata_FieldSelector",
    "enums": null,
    "comment": "next node of the field selector",
    "notImp": false
  }
] };

export const PayloadToMetadata_FieldSelector_SingleFields = [
  "name",
  "id"
];

export const PayloadToMetadata_Rule: OutType = { "PayloadToMetadata_Rule": [
  {
    "name": "match_specifier.method_name",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "A Rule defines what metadata to apply when a field is present or missing. [#next-free-field: 6]",
    "notImp": false
  },
  {
    "name": "match_specifier.service_name",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "A Rule defines what metadata to apply when a field is present or missing. [#next-free-field: 6]",
    "notImp": false
  },
  {
    "name": "field_selector",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "PayloadToMetadata_FieldSelector",
    "enums": null,
    "comment": "Specifies that a match will be performed on the value of a field.",
    "notImp": false
  },
  {
    "name": "on_present",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "PayloadToMetadata_KeyValuePair",
    "enums": null,
    "comment": "If the field is present, apply this metadata KeyValuePair.",
    "notImp": false
  },
  {
    "name": "on_missing",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "PayloadToMetadata_KeyValuePair",
    "enums": null,
    "comment": "If the field is missing, apply this metadata KeyValuePair.\n\nThe value in the KeyValuePair must be set, since it'll be used in lieu of the missing field value.",
    "notImp": false
  }
] };

export const PayloadToMetadata_Rule_SingleFields = [
  "match_specifier.method_name",
  "match_specifier.service_name"
];