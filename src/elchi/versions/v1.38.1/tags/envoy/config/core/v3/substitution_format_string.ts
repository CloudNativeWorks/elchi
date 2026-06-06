import {OutType} from '@elchi/tags/tagsType';


export const JsonFormatOptions: OutType = { "JsonFormatOptions": [
  {
    "name": "sort_properties",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "boolean",
    "enums": null,
    "comment": "The output JSON string properties will be sorted.\n\n:::note\nAs the properties are always sorted, this option has no effect and is deprecated. \n:::",
    "notImp": false
  }
] };

export const SubstitutionFormatString: OutType = { "SubstitutionFormatString": [
  {
    "name": "format.text_format",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Configuration to use multiple `command operators` to generate a new string in either plain text or JSON format. [#next-free-field: 8]",
    "notImp": false
  },
  {
    "name": "format.json_format",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "{ [key: string]: any; }",
    "enums": null,
    "comment": "Configuration to use multiple `command operators` to generate a new string in either plain text or JSON format. [#next-free-field: 8]",
    "notImp": false
  },
  {
    "name": "format.text_format_source",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "DataSource",
    "enums": null,
    "comment": "Configuration to use multiple `command operators` to generate a new string in either plain text or JSON format. [#next-free-field: 8]",
    "notImp": false
  },
  {
    "name": "omit_empty_values",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set to true, when command operators are evaluated to null,\n\n* for ``text_format``, the output of the empty operator is changed from ``-`` to an empty string, so that empty values are omitted entirely. * for ``json_format`` the keys with null values are omitted in the output structure.\n\n:::note\nThis option does not work perfectly with ``json_format`` as keys with ``null`` values will still be included in the output. See https://github.com/envoyproxy/envoy/issues/37941 for more details.",
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