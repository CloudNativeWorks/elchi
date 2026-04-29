import {OutType} from '@elchi/tags/tagsType';


export const GrpcJsonReverseTranscoder_PrintOptions: OutType = { "GrpcJsonReverseTranscoder_PrintOptions": [
  {
    "name": "always_print_primitive_fields",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether to always print primitive fields. By default primitive fields with default values will be omitted in JSON output. For example, an int32 field set to 0 will be omitted. Setting this flag to true will override the default behavior and print primitive fields regardless of their values. Defaults to false.",
    "notImp": false
  },
  {
    "name": "always_print_enums_as_ints",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether to always print enums as ints. By default they are rendered as strings. Defaults to false.",
    "notImp": false
  },
  {
    "name": "use_canonical_field_names",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether to convert the proto field names to ``json_name`` annotation value, or lower camel case, in absence of ``json_name``. By default the field names will be preserved after conversion. Setting this flag will convert the field names to their canonical form. Defaults to false.\n\nExample:\n\n.. code-block:: proto\n\n    message Author { int64 id = 1; enum Gender { UNKNOWN = 0; MALE = 1; FEMALE = 2; }; Gender gender = 2; string first_name = 3; string last_name = 4 [json_name = \"lname\"]; }\n\nThe above proto message after being transcoded to JSON with ``use_canonical_field_names`` set to ``false`` will have the field names same as in the proto message, as follows:\n\n```json\n\n    {\n      \"id\": \"12345\",\n      \"gender\": \"MALE\",\n      \"first_name\": \"John\",\n      \"last_name\": \"Doe\"\n    }\n```\n\nand with the ``use_canonical_field_names`` set to ``true``, the transcoded JSON will have ``first_name`` converted to camelCase and ``last_name`` converted to its ``json_name`` annotation value, as follows:\n\n```json\n\n    {\n      \"id\": \"12345\",\n      \"gender\": \"MALE\",\n      \"firstName\": \"John\",\n      \"lname\": \"Doe\"\n    }",
    "notImp": false
  }
] };

export const GrpcJsonReverseTranscoder_PrintOptions_SingleFields = [
  "always_print_primitive_fields",
  "always_print_enums_as_ints",
  "use_canonical_field_names"
];

export const GrpcJsonReverseTranscoder: OutType = { "GrpcJsonReverseTranscoder": [
  {
    "name": "descriptor_path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Supplies the filename of `the proto descriptor set` for the gRPC services. If set, takes precedence over the ``descriptor_binary`` field.",
    "notImp": false
  },
  {
    "name": "descriptor_binary",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Uint8Array<ArrayBufferLike>",
    "enums": null,
    "comment": "Supplies the binary content of `the proto descriptor set` for the gRPC services. If ``descriptor_path`` is set, this field is not used.",
    "notImp": false
  },
  {
    "name": "max_request_body_size",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The maximum size of a request body to be transcoded, in bytes. A body exceeding this size will provoke a ``gRPC status: ResourceExhausted`` response.\n\nLarge values may cause envoy to use a lot of memory if there are many concurrent requests.\n\nIf unset, the current stream buffer size is used.",
    "notImp": false
  },
  {
    "name": "max_response_body_size",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The maximum size of a response body to be transcoded, in bytes. A body exceeding this size will provoke a ``gRPC status: Internal`` response.\n\nLarge values may cause envoy to use a lot of memory if there are many concurrent requests.\n\nIf unset, the current stream buffer size is used.",
    "notImp": false
  },
  {
    "name": "api_version_header",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the header field that has the API version of the request.",
    "notImp": false
  },
  {
    "name": "request_json_print_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "GrpcJsonReverseTranscoder_PrintOptions",
    "enums": null,
    "comment": "Control options for upstream request JSON. These options are passed directly to `JsonPrintOptions <https://developers.google.com/protocol-buffers/docs/reference/cpp/ google.protobuf.util.json_util#JsonPrintOptions>`_.",
    "notImp": false
  }
] };

export const GrpcJsonReverseTranscoder_SingleFields = [
  "descriptor_path",
  "max_request_body_size",
  "max_response_body_size",
  "api_version_header"
];