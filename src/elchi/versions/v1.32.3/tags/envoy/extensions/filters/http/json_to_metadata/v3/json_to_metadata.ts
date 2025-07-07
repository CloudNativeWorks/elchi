import {OutType} from '@/elchi/tags/tagsType';


export const JsonToMetadata_MatchRules: OutType = { "JsonToMetadata_MatchRules": [
  {
    "name": "rules",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "JsonToMetadata_Rule[]",
    "enums": null,
    "comment": "The list of rules to apply.",
    "notImp": false
  },
  {
    "name": "allow_content_types",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Allowed content-type for json to metadata transformation. Default to ``{\"application/json\"}``.\n\nSet ``allow_empty_content_type`` if empty/missing content-type header is allowed.",
    "notImp": false
  },
  {
    "name": "allow_empty_content_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Allowed empty content-type for json to metadata transformation. Default to false.",
    "notImp": false
  },
  {
    "name": "allow_content_types_regex",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RegexMatcher",
    "enums": null,
    "comment": "Allowed content-type by regex match for json to metadata transformation. This can be used in parallel with ``allow_content_types``.",
    "notImp": false
  }
] };

export const JsonToMetadata_MatchRules_SingleFields = [
  "allow_content_types",
  "allow_empty_content_type"
];

export const JsonToMetadata: OutType = { "JsonToMetadata": [
  {
    "name": "request_rules",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "JsonToMetadata_MatchRules",
    "enums": null,
    "comment": "At least one of request_rules and response_rules must be provided. Rules to match json body of requests.",
    "notImp": false
  },
  {
    "name": "response_rules",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "JsonToMetadata_MatchRules",
    "enums": null,
    "comment": "Rules to match json body of responses.",
    "notImp": false
  }
] };

export const JsonToMetadata_KeyValuePair: OutType = { "JsonToMetadata_KeyValuePair": [
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
    "fieldType": "any",
    "enums": null,
    "comment": "The value to pair with the given key.\n\nWhen used for on_present case, if value is non-empty it'll be used instead of the the value of the JSON key. If both are empty, the the value of the JSON key is used as-is.\n\nWhen used for on_missing/on_error case, a non-empty value must be provided.\n\nIt ignores ValueType, i.e., not type casting.",
    "notImp": false
  },
  {
    "name": "type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "JsonToMetadata_ValueType",
    "enums": [
      "PROTOBUF_VALUE",
      "STRING",
      "NUMBER"
    ],
    "comment": "The value's type — defaults to protobuf.Value.",
    "notImp": false
  },
  {
    "name": "preserve_existing_metadata_value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "False if we want to overwrite the existing metadata value. Default to false.",
    "notImp": false
  }
] };

export const JsonToMetadata_KeyValuePair_SingleFields = [
  "metadata_namespace",
  "key",
  "value_type.value",
  "type",
  "preserve_existing_metadata_value"
];

export const JsonToMetadata_Selector: OutType = { "JsonToMetadata_Selector": [
  {
    "name": "selector.key",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "key to match",
    "notImp": false
  }
] };

export const JsonToMetadata_Selector_SingleFields = [
  "selector.key"
];

export const JsonToMetadata_Rule: OutType = { "JsonToMetadata_Rule": [
  {
    "name": "selectors",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "JsonToMetadata_Selector[]",
    "enums": null,
    "comment": "Specifies that a match will be performed on the value of a property. Here's an example to match on 1 in {\"foo\": {\"bar\": 1}, \"bar\": 2}\n\nselectors: - key: foo - key: bar",
    "notImp": false
  },
  {
    "name": "on_present",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "JsonToMetadata_KeyValuePair",
    "enums": null,
    "comment": "If the attribute is present, apply this metadata KeyValuePair.",
    "notImp": false
  },
  {
    "name": "on_missing",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "JsonToMetadata_KeyValuePair",
    "enums": null,
    "comment": "If the attribute is missing, apply this metadata KeyValuePair.\n\nThe value in the KeyValuePair must be set.",
    "notImp": false
  },
  {
    "name": "on_error",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "JsonToMetadata_KeyValuePair",
    "enums": null,
    "comment": "If the body is too large or fail to parse or content-type is mismatched, apply this metadata KeyValuePair.\n\nThe value in the KeyValuePair must be set.",
    "notImp": false
  }
] };