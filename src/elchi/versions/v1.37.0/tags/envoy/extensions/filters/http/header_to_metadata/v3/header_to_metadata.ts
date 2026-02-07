import {OutType} from '@elchi/tags/tagsType';


export const Config: OutType = { "Config": [
  {
    "name": "request_rules",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Config_Rule[]",
    "enums": null,
    "comment": "The list of rules to apply to requests.",
    "notImp": false
  },
  {
    "name": "response_rules",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Config_Rule[]",
    "enums": null,
    "comment": "The list of rules to apply to responses.",
    "notImp": false
  },
  {
    "name": "stat_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Optional prefix to use when emitting filter statistics. When configured, statistics are emitted with the prefix ``http_filter_name.<stat_prefix>``.\n\nThis emits statistics such as:\n\n- ``http_filter_name.my_header_converter.rules_processed`` - ``http_filter_name.my_header_converter.metadata_added``\n\nIf not configured, no statistics are emitted.",
    "notImp": false
  }
] };

export const Config_SingleFields = [
  "stat_prefix"
];

export const Config_KeyValuePair: OutType = { "Config_KeyValuePair": [
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
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The value to pair with the given key.\n\nWhen used for a `on_header_present` case, if value is non-empty it'll be used instead of the header value. If both are empty, no metadata is added.\n\nWhen used for a `on_header_missing` case, a non-empty value must be provided otherwise no metadata is added.",
    "notImp": false
  },
  {
    "name": "regex_value_rewrite",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RegexMatchAndSubstitute",
    "enums": null,
    "comment": "If present, the header's value will be matched and substituted with this. If there is no match or substitution, the header value is used as-is.\n\nThis is only used for `on_header_present`.\n\n:::note\n\nIf the ``value`` field is non-empty this field should be empty.",
    "notImp": false
  },
  {
    "name": "type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Config_ValueType",
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
    "fieldType": "Config_ValueEncode",
    "enums": [
      "NONE",
      "BASE64"
    ],
    "comment": "How is the value encoded, default is NONE (not encoded). The value will be decoded accordingly before storing to metadata.",
    "notImp": false
  }
] };

export const Config_KeyValuePair_SingleFields = [
  "metadata_namespace",
  "key",
  "value",
  "type",
  "encode"
];

export const Config_Rule: OutType = { "Config_Rule": [
  {
    "name": "header",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Specifies that a match will be performed on the value of a header or a cookie.\n\nThe header to be extracted.",
    "notImp": false
  },
  {
    "name": "cookie",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The cookie to be extracted.",
    "notImp": false
  },
  {
    "name": "on_header_present",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Config_KeyValuePair",
    "enums": null,
    "comment": "If the header or cookie is present, apply this metadata ``KeyValuePair``.\n\nIf the value in the ``KeyValuePair`` is non-empty, it'll be used instead of the header or cookie value.",
    "notImp": false
  },
  {
    "name": "on_header_missing",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Config_KeyValuePair",
    "enums": null,
    "comment": "If the header or cookie is not present, apply this metadata ``KeyValuePair``.\n\nThe value in the ``KeyValuePair`` must be set, since it'll be used in lieu of the missing header or cookie value.",
    "notImp": false
  },
  {
    "name": "remove",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether or not to remove the header after a rule is applied.\n\nThis prevents headers from leaking. This field is not supported in case of a cookie.",
    "notImp": false
  }
] };

export const Config_Rule_SingleFields = [
  "header",
  "cookie",
  "remove"
];