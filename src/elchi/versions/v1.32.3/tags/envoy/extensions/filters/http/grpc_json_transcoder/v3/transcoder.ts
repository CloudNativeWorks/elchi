import {OutType} from '@/elchi/tags/tagsType';


export const GrpcJsonTranscoder_PrintOptions: OutType = { "GrpcJsonTranscoder_PrintOptions": [
  {
    "name": "add_whitespace",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether to add spaces, line breaks and indentation to make the JSON output easy to read. Defaults to false.",
    "notImp": false
  },
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
    "name": "preserve_proto_field_names",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether to preserve proto field names. By default protobuf will generate JSON field names using the ``json_name`` option, or lower camel case, in that order. Setting this flag will preserve the original field names. Defaults to false.",
    "notImp": false
  },
  {
    "name": "stream_newline_delimited",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, return all streams as newline-delimited JSON messages instead of as a comma-separated array",
    "notImp": false
  }
] };

export const GrpcJsonTranscoder_PrintOptions_SingleFields = [
  "add_whitespace",
  "always_print_primitive_fields",
  "always_print_enums_as_ints",
  "preserve_proto_field_names",
  "stream_newline_delimited"
];

export const GrpcJsonTranscoder_RequestValidationOptions: OutType = { "GrpcJsonTranscoder_RequestValidationOptions": [
  {
    "name": "reject_unknown_method",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "By default, a request that cannot be mapped to any specified gRPC `services` will pass-through this filter. When set to true, the request will be rejected with a ``HTTP 404 Not Found``.",
    "notImp": false
  },
  {
    "name": "reject_unknown_query_parameters",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "By default, a request with query parameters that cannot be mapped to the gRPC request message will pass-through this filter. When set to true, the request will be rejected with a ``HTTP 400 Bad Request``.\n\nThe fields `ignore_unknown_query_parameters`, `capture_unknown_query_parameters`, and `ignored_query_parameters` have priority over this strict validation behavior.",
    "notImp": false
  },
  {
    "name": "reject_binding_body_field_collisions",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "\"id: 456\" in the body will override \"id=123\" in the binding.\n\nIf this field is set to true, the request will be rejected if the binding value is different from the body value.",
    "notImp": false
  }
] };

export const GrpcJsonTranscoder_RequestValidationOptions_SingleFields = [
  "reject_unknown_method",
  "reject_unknown_query_parameters",
  "reject_binding_body_field_collisions"
];

export const GrpcJsonTranscoder: OutType = { "GrpcJsonTranscoder": [
  {
    "name": "descriptor_set.proto_descriptor",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Supplies the filename of `the proto descriptor set` for the gRPC services.",
    "notImp": false
  },
  {
    "name": "descriptor_set.proto_descriptor_bin",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Uint8Array<ArrayBufferLike>",
    "enums": null,
    "comment": "Supplies the binary content of `the proto descriptor set` for the gRPC services.",
    "notImp": false
  },
  {
    "name": "services",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "A list of strings that supplies the fully qualified service names (i.e. \"package_name.service_name\") that the transcoder will translate. If the service name doesn't exist in ``proto_descriptor``, Envoy will fail at startup. The ``proto_descriptor`` may contain more services than the service names specified here, but they won't be translated.\n\nBy default, the filter will pass through requests that do not map to any specified services. If the list of services is empty, filter is considered disabled. However, this behavior changes if `reject_unknown_method` is enabled.",
    "notImp": false
  },
  {
    "name": "print_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "GrpcJsonTranscoder_PrintOptions",
    "enums": null,
    "comment": "Control options for response JSON. These options are passed directly to `JsonPrintOptions <https://developers.google.com/protocol-buffers/docs/reference/cpp/ google.protobuf.util.json_util#JsonPrintOptions>`_.",
    "notImp": false
  },
  {
    "name": "match_incoming_request_route",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether to keep the incoming request route after the outgoing headers have been transformed to the match the upstream gRPC service. Note: This means that routes for gRPC services that are not transcoded cannot be used in combination with ``match_incoming_request_route``.",
    "notImp": false
  },
  {
    "name": "ignored_query_parameters",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "A list of query parameters to be ignored for transcoding method mapping. By default, the transcoder filter will not transcode a request if there are any unknown/invalid query parameters.\n\nExample :\n\n.. code-block:: proto\n\n    service Bookstore { rpc GetShelf(GetShelfRequest) returns (Shelf) { option (google.api.http) = { get: \"/shelves/{shelf}\" }; } }\n\n    message GetShelfRequest { int64 shelf = 1; }\n\n    message Shelf {}\n\nThe request ``/shelves/100?foo=bar`` will not be mapped to ``GetShelf``` because variable binding for ``foo`` is not defined. Adding ``foo`` to ``ignored_query_parameters`` will allow the same request to be mapped to ``GetShelf``.",
    "notImp": false
  },
  {
    "name": "auto_mapping",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether to route methods without the ``google.api.http`` option.\n\nExample :\n\n.. code-block:: proto\n\n    package bookstore;\n\n    service Bookstore { rpc GetShelf(GetShelfRequest) returns (Shelf) {} }\n\n    message GetShelfRequest { int64 shelf = 1; }\n\n    message Shelf {}\n\nThe client could ``post`` a json body ``{\"shelf\": 1234}`` with the path of ``/bookstore.Bookstore/GetShelfRequest`` to call ``GetShelfRequest``.",
    "notImp": false
  },
  {
    "name": "ignore_unknown_query_parameters",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether to ignore query parameters that cannot be mapped to a corresponding protobuf field. Use this if you cannot control the query parameters and do not know them beforehand. Otherwise use ``ignored_query_parameters``. Defaults to false.",
    "notImp": false
  },
  {
    "name": "convert_grpc_status",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether to convert gRPC status headers to JSON. When trailer indicates a gRPC error and there was no HTTP body, take ``google.rpc.Status`` from the ``grpc-status-details-bin`` header and use it as JSON body. If there was no such header, make ``google.rpc.Status`` out of the ``grpc-status`` and ``grpc-message`` headers. The error details types must be present in the ``proto_descriptor``.\n\nFor example, if an upstream server replies with headers:\n\n.. code-block:: none\n\n    grpc-status: 5 grpc-status-details-bin: CAUaMwoqdHlwZS5nb29nbGVhcGlzLmNvbS9nb29nbGUucnBjLlJlcXVlc3RJbmZvEgUKA3ItMQ\n\nThe ``grpc-status-details-bin`` header contains a base64-encoded protobuf message ``google.rpc.Status``. It will be transcoded into:\n\n.. code-block:: none\n\n    HTTP/1.1 404 Not Found content-type: application/json\n\n    {\"code\":5,\"details\":[{\"@type\":\"type.googleapis.com/google.rpc.RequestInfo\",\"requestId\":\"r-1\"}]}\n\nIn order to transcode the message, the ``google.rpc.RequestInfo`` type from the ``google/rpc/error_details.proto`` should be included in the configured `proto descriptor set`.",
    "notImp": false
  },
  {
    "name": "url_unescape_spec",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "GrpcJsonTranscoder_UrlUnescapeSpec",
    "enums": [
      "ALL_CHARACTERS_EXCEPT_RESERVED",
      "ALL_CHARACTERS_EXCEPT_SLASH",
      "ALL_CHARACTERS"
    ],
    "comment": "URL unescaping policy. This spec is only applied when extracting variable with multiple segments in the URL path. For example, in case of ``/foo/{x=*}/bar/{y=prefix/*}/{z=**}`` ``x`` variable is single segment and ``y`` and ``z`` are multiple segments. For a path with ``/foo/first/bar/prefix/second/third/fourth``, ``x=first``, ``y=prefix/second``, ``z=third/fourth``. If this setting is not specified, the value defaults to `ALL_CHARACTERS_EXCEPT_RESERVED`.",
    "notImp": false
  },
  {
    "name": "query_param_unescape_plus",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, unescape '+' to space when extracting variables in query parameters. This is to support `HTML 2.0 <https://tools.ietf.org/html/rfc1866#section-8.2.1>`_",
    "notImp": false
  },
  {
    "name": "match_unregistered_custom_verb",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, try to match the custom verb even if it is unregistered. By default, only match when it is registered.\n\nAccording to the http template `syntax <https://github.com/googleapis/googleapis/blob/master/google/api/http.proto#L226-L231>`_, the custom verb is **\":\" LITERAL** at the end of http template.\n\nFor a request with ``/foo/bar:baz`` and ``:baz`` is not registered in any url_template, here is the behavior change - if the field is not set, ``:baz`` will not be treated as custom verb, so it will match ``/foo/{x=*}``. - if the field is set, ``:baz`` is treated as custom verb,  so it will NOT match ``/foo/{x=*}`` since the template doesn't use any custom verb.",
    "notImp": false
  },
  {
    "name": "request_validation_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "GrpcJsonTranscoder_RequestValidationOptions",
    "enums": null,
    "comment": "Configure the behavior when handling requests that cannot be transcoded.\n\nBy default, the transcoder will silently pass through HTTP requests that are malformed. This includes requests with unknown query parameters, unregister paths, etc.\n\nSet these options to enable strict HTTP request validation, resulting in the transcoder rejecting such requests with a ``HTTP 4xx``. See each individual option for more details on the validation. gRPC requests will still silently pass through without transcoding.\n\nThe benefit is a proper error message to the downstream. If the upstream is a gRPC server, it cannot handle the passed-through HTTP requests and will reset the TCP connection. The downstream will then receive a ``HTTP 503 Service Unavailable`` due to the upstream connection reset. This incorrect error message may conflict with other Envoy components, such as retry policies.",
    "notImp": false
  },
  {
    "name": "case_insensitive_enum_parsing",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Proto enum values are supposed to be in upper cases when used in JSON. Set this to true if your JSON request uses non uppercase enum values.",
    "notImp": false
  },
  {
    "name": "max_request_body_size",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The maximum size of a request body to be transcoded, in bytes. A body exceeding this size will provoke a ``HTTP 413 Request Entity Too Large`` response.\n\nLarge values may cause envoy to use a lot of memory if there are many concurrent requests.\n\nIf unset, the current stream buffer size is used.",
    "notImp": false
  },
  {
    "name": "max_response_body_size",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The maximum size of a response body to be transcoded, in bytes. A body exceeding this size will provoke a ``HTTP 500 Internal Server Error`` response.\n\nLarge values may cause envoy to use a lot of memory if there are many concurrent requests.\n\nIf unset, the current stream buffer size is used.",
    "notImp": false
  },
  {
    "name": "capture_unknown_query_parameters",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, query parameters that cannot be mapped to a corresponding protobuf field are captured in an HttpBody extension of UnknownQueryParams.",
    "notImp": false
  }
] };

export const GrpcJsonTranscoder_SingleFields = [
  "descriptor_set.proto_descriptor",
  "services",
  "match_incoming_request_route",
  "ignored_query_parameters",
  "auto_mapping",
  "ignore_unknown_query_parameters",
  "convert_grpc_status",
  "url_unescape_spec",
  "query_param_unescape_plus",
  "match_unregistered_custom_verb",
  "case_insensitive_enum_parsing",
  "max_request_body_size",
  "max_response_body_size",
  "capture_unknown_query_parameters"
];

export const UnknownQueryParams: OutType = { "UnknownQueryParams": [
  {
    "name": "key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, UnknownQueryParams_Values>",
    "enums": null,
    "comment": "A map from unrecognized query parameter keys, to the values associated with those keys.",
    "notImp": false
  }
] };

export const UnknownQueryParams_Values: OutType = { "UnknownQueryParams_Values": [
  {
    "name": "values",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const UnknownQueryParams_Values_SingleFields = [
  "values"
];

export const UnknownQueryParams_KeyEntry: OutType = { "UnknownQueryParams_KeyEntry": [
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
    "fieldType": "UnknownQueryParams_Values",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const UnknownQueryParams_KeyEntry_SingleFields = [
  "key"
];