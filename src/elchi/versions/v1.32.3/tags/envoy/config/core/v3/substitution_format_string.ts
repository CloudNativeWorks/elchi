import {OutType} from '@/elchi/tags/tagsType';


export const JsonFormatOptions: OutType = { "JsonFormatOptions": [
  {
    "name": "sort_properties",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "The output JSON string properties will be sorted.",
    "notImp": false
  }
] };

export const JsonFormatOptions_SingleFields = [
  "sort_properties"
];

export const SubstitutionFormatString: OutType = { "SubstitutionFormatString": [
  {
    "name": "format.text_format",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Specify a format with command operators to form a text string. Its details is described in `format string`.\n\nFor example, setting ``text_format`` like below,\n\n```yaml\n  :type-name: envoy.config.core.v3.SubstitutionFormatString\n\n  text_format: \"%LOCAL_REPLY_BODY%:%RESPONSE_CODE%:path=%REQ(:path)%\\n\"\n```\n generates plain text similar to:\n\n.. code-block:: text\n\n  upstream connect error:503:path=/foo\n\nDeprecated in favor of `text_format_source`. To migrate text format strings, use the `inline_string` field.",
    "notImp": false
  },
  {
    "name": "format.json_format",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "{ [key: string]: any; }",
    "enums": null,
    "comment": "Specify a format with command operators to form a JSON string. Its details is described in `format dictionary`. Values are rendered as strings, numbers, or boolean values as appropriate. Nested JSON objects may be produced by some command operators (e.g. FILTER_STATE or DYNAMIC_METADATA). See the documentation for a specific command operator for details.\n\n```yaml\n  :type-name: envoy.config.core.v3.SubstitutionFormatString\n\n  json_format:\n    status: \"%RESPONSE_CODE%\"\n    message: \"%LOCAL_REPLY_BODY%\"\n```\n The following JSON object would be created:\n\n```json\n\n {\n   \"status\": 500,\n   \"message\": \"My error message\"\n }",
    "notImp": false
  },
  {
    "name": "format.text_format_source",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "DataSource",
    "enums": null,
    "comment": "Specify a format with command operators to form a text string. Its details is described in `format string`.\n\nFor example, setting ``text_format`` like below,\n\n```yaml\n  :type-name: envoy.config.core.v3.SubstitutionFormatString\n\n  text_format_source:\n    inline_string: \"%LOCAL_REPLY_BODY%:%RESPONSE_CODE%:path=%REQ(:path)%\\n\"\n```\n generates plain text similar to:\n\n.. code-block:: text\n\n  upstream connect error:503:path=/foo",
    "notImp": false
  },
  {
    "name": "omit_empty_values",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set to true, when command operators are evaluated to null,\n\n* for ``text_format``, the output of the empty operator is changed from ``-`` to an empty string, so that empty values are omitted entirely. * for ``json_format`` the keys with null values are omitted in the output structure.",
    "notImp": false
  },
  {
    "name": "content_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Specify a ``content_type`` field. If this field is not set then ``text/plain`` is used for ``text_format`` and ``application/json`` is used for ``json_format``.\n\n```yaml\n  :type-name: envoy.config.core.v3.SubstitutionFormatString\n\n  content_type: \"text/html; charset=UTF-8\"",
    "notImp": false
  },
  {
    "name": "formatters",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig[]",
    "enums": null,
    "comment": "Specifies a collection of Formatter plugins that can be called from the access log configuration. See the formatters extensions documentation for details. extension-category: envoy.formatter",
    "notImp": false
  },
  {
    "name": "json_format_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "JsonFormatOptions",
    "enums": null,
    "comment": "If json_format is used, the options will be applied to the output JSON string.",
    "notImp": false
  }
] };

export const SubstitutionFormatString_SingleFields = [
  "format.text_format",
  "omit_empty_values",
  "content_type"
];