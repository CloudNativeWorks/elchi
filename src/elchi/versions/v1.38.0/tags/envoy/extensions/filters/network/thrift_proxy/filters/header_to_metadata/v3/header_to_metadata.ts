import {OutType} from '@elchi/tags/tagsType';


export const HeaderToMetadata: OutType = { "HeaderToMetadata": [
  {
    "name": "request_rules",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderToMetadata_Rule[]",
    "enums": null,
    "comment": "The list of rules to apply to requests.",
    "notImp": false
  }
] };

export const HeaderToMetadata_KeyValuePair: OutType = { "HeaderToMetadata_KeyValuePair": [
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
    "comment": "The value to pair with the given key.\n\nWhen used for on_present case, if value is non-empty it'll be used instead of the header value. If both are empty, the header value is used as-is.\n\nWhen used for on_missing case, a non-empty value must be provided.",
    "notImp": false
  },
  {
    "name": "value_type.regex_value_rewrite",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RegexMatchAndSubstitute",
    "enums": null,
    "comment": "If present, the header's value will be matched and substituted with this. If there is no match or substitution, the header value is used as-is.\n\nThis is only used for on_present.",
    "notImp": false
  },
  {
    "name": "type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderToMetadata_ValueType",
    "enums": [
      "STRING",
      "NUMBER",
      "PROTOBUF_VALUE"
    ],
    "comment": "The value's type — defaults to string.",
    "notImp": false
  },
  {
    "name": "encode",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderToMetadata_ValueEncode",
    "enums": [
      "NONE",
      "BASE64"
    ],
    "comment": "How is the value encoded, default is NONE (not encoded). The value will be decoded accordingly before storing to metadata.",
    "notImp": false
  }
] };

export const HeaderToMetadata_KeyValuePair_SingleFields = [
  "metadata_namespace",
  "key",
  "value_type.value",
  "type",
  "encode"
];

export const HeaderToMetadata_Rule: OutType = { "HeaderToMetadata_Rule": [
  {
    "name": "header",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Specifies that a match will be performed on the value of a header.\n\nThe header to be extracted.",
    "notImp": false
  },
  {
    "name": "on_present",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderToMetadata_KeyValuePair",
    "enums": null,
    "comment": "If the header is present, apply this metadata KeyValuePair.\n\nIf the value in the KeyValuePair is non-empty, it'll be used instead of the header value.",
    "notImp": false
  },
  {
    "name": "on_missing",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderToMetadata_KeyValuePair",
    "enums": null,
    "comment": "If the header is not present, apply this metadata KeyValuePair.\n\nThe value in the KeyValuePair must be set, since it'll be used in lieu of the missing header value.",
    "notImp": false
  },
  {
    "name": "remove",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether or not to remove the header after a rule is applied.\n\nThis prevents headers from leaking.",
    "notImp": false
  }
] };

export const HeaderToMetadata_Rule_SingleFields = [
  "header",
  "remove"
];