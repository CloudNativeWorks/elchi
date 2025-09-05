import {OutType} from '@elchi/tags/tagsType';


export const KeyValuePair: OutType = { "KeyValuePair": [
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
    "fieldType": "any",
    "enums": null,
    "comment": "When used for on_present case, if value is non-empty it'll be used instead of the field value.\n\nWhen used for on_missing case, a non-empty value must be provided.",
    "notImp": false
  }
] };

export const KeyValuePair_SingleFields = [
  "metadata_namespace",
  "key",
  "value"
];

export const FieldSelector: OutType = { "FieldSelector": [
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
    "fieldType": "FieldSelector",
    "enums": null,
    "comment": "next node of the field selector",
    "notImp": false
  }
] };

export const FieldSelector_SingleFields = [
  "name",
  "id"
];

export const Rule: OutType = { "Rule": [
  {
    "name": "field",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Field",
    "enums": [
      "METHOD_NAME",
      "PROTOCOL",
      "TRANSPORT",
      "HEADER_FLAGS",
      "SEQUENCE_ID",
      "MESSAGE_TYPE",
      "REPLY_TYPE"
    ],
    "comment": "The field to match on. If set, takes precedence over field_selector.",
    "notImp": false
  },
  {
    "name": "field_selector",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FieldSelector",
    "enums": null,
    "comment": "Specifies that a match will be performed on the value of a field in the thrift body. If set, the whole http body will be buffered to extract the field value, which may have performance implications.\n\nIt's a thrift over http version of `field_selector`.\n\nSee also `payload-to-metadata <https://www.envoyproxy.io/docs/envoy/latest/configuration/other_protocols/thrift_filters/payload_to_metadata_filter>`_ for more reference.\n\nExample:\n\n```yaml\n\n   method_name: foo\n   field_selector:\n     name: info\n     id: 2\n     child:\n       name: version\n       id: 1\n```\n\nThe above yaml will match on value of ``info.version`` in the below thrift schema as input of `on_present` or `on_missing` while we are processing ``foo`` method. This rule won't be applied to ``bar`` method.\n\n.. code-block:: thrift\n\n   struct Info { 1: required string version; } service Server { bool foo(1: i32 id, 2: Info info); bool bar(1: i32 id, 2: Info info); }",
    "notImp": false
  },
  {
    "name": "method_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "If specified, `field_selector` will be used to extract the field value *only* on the thrift message with method name.",
    "notImp": false
  },
  {
    "name": "on_present",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "KeyValuePair",
    "enums": null,
    "comment": "The key-value pair to set in the *filter metadata* if the field is present in *thrift metadata*.\n\nIf the value in the KeyValuePair is non-empty, it'll be used instead of field value.",
    "notImp": false
  },
  {
    "name": "on_missing",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "KeyValuePair",
    "enums": null,
    "comment": "The key-value pair to set in the *filter metadata* if the field is missing in *thrift metadata*.\n\nThe value in the KeyValuePair must be set, since it'll be used in lieu of the missing field value.",
    "notImp": false
  }
] };

export const Rule_SingleFields = [
  "field",
  "method_name"
];

export const ThriftToMetadata: OutType = { "ThriftToMetadata": [
  {
    "name": "request_rules",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Rule[]",
    "enums": null,
    "comment": "The list of rules to apply to http request body to extract thrift metadata.",
    "notImp": false
  },
  {
    "name": "response_rules",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Rule[]",
    "enums": null,
    "comment": "The list of rules to apply to http response body to extract thrift metadata.",
    "notImp": false
  },
  {
    "name": "transport",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TransportType",
    "enums": [
      "AUTO_TRANSPORT",
      "FRAMED",
      "UNFRAMED",
      "HEADER"
    ],
    "comment": "Supplies the type of transport that the Thrift proxy should use. Defaults to `AUTO_TRANSPORT`.",
    "notImp": false
  },
  {
    "name": "protocol",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ProtocolType",
    "enums": [
      "AUTO_PROTOCOL",
      "BINARY",
      "LAX_BINARY",
      "COMPACT",
      "TWITTER"
    ],
    "comment": "Supplies the type of protocol that the Thrift proxy should use. Defaults to `AUTO_PROTOCOL`. Note that `LAX_BINARY` is not distinguished by `AUTO_PROTOCOL`, which is the same with `thrift_proxy network filter`. Note that `TWITTER` is not supported due to deprecation in envoy.",
    "notImp": false
  },
  {
    "name": "allow_content_types",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Allowed content-type for thrift payload to filter metadata transformation. Default to ``{\"application/x-thrift\"}``.\n\nSet ``allow_empty_content_type`` if empty/missing content-type header is allowed.",
    "notImp": false
  },
  {
    "name": "allow_empty_content_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Allowed empty content-type for thrift payload to filter metadata transformation. Default to false.",
    "notImp": false
  }
] };

export const ThriftToMetadata_SingleFields = [
  "transport",
  "protocol",
  "allow_content_types",
  "allow_empty_content_type"
];

export const ThriftToMetadataPerRoute: OutType = { "ThriftToMetadataPerRoute": [
  {
    "name": "request_rules",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Rule[]",
    "enums": null,
    "comment": "The list of rules to apply to http request body to extract thrift metadata.",
    "notImp": false
  },
  {
    "name": "response_rules",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Rule[]",
    "enums": null,
    "comment": "The list of rules to apply to http response body to extract thrift metadata.",
    "notImp": false
  }
] };