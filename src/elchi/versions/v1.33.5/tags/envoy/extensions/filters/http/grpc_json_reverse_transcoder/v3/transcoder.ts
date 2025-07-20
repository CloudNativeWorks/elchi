import {OutType} from '@elchi/tags/tagsType';


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
  }
] };

export const GrpcJsonReverseTranscoder_SingleFields = [
  "descriptor_path",
  "max_request_body_size",
  "max_response_body_size",
  "api_version_header"
];