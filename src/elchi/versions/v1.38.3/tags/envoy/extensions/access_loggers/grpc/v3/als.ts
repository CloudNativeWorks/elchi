import {OutType} from '@elchi/tags/tagsType';


export const CommonGrpcAccessLogConfig: OutType = { "CommonGrpcAccessLogConfig": [
  {
    "name": "log_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The friendly name of the access log to be returned in `StreamAccessLogsMessage.Identifier`. This allows the access log server to differentiate between different access logs coming from the same Envoy.",
    "notImp": false
  },
  {
    "name": "grpc_service",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "GrpcService",
    "enums": null,
    "comment": "The gRPC service for the access log service.",
    "notImp": false
  },
  {
    "name": "transport_api_version",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ApiVersion",
    "enums": [
      "AUTO",
      "V2",
      "V3"
    ],
    "comment": "API version for access logs service transport protocol. This describes the access logs service gRPC endpoint and version of messages used on the wire.",
    "notImp": false
  },
  {
    "name": "buffer_flush_interval",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Interval for flushing access logs to the gRPC stream. Logger will flush requests every time this interval is elapsed, or when batch size limit is hit, whichever comes first. Defaults to 1 second.",
    "notImp": false
  },
  {
    "name": "buffer_size_bytes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Soft size limit in bytes for access log entries buffer. Logger will buffer requests until this limit it hit, or every time flush interval is elapsed, whichever comes first. Setting it to zero effectively disables the batching. Defaults to 16384.",
    "notImp": false
  },
  {
    "name": "filter_state_objects_to_log",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Additional filter state objects to log in `filter_state_objects`. Logger will call ``FilterState::Object::serializeAsProto`` to serialize the filter state object.",
    "notImp": false
  },
  {
    "name": "grpc_stream_retry_policy",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RetryPolicy",
    "enums": null,
    "comment": "Sets the retry policy when the establishment of a gRPC stream fails. If the stream succeeds at least once in establishing itself, no retry will be performed no matter what gRPC status is received. Note that only `num_retries` will be used in this configuration. This feature is used only when you are using `Envoy gRPC client`.",
    "notImp": false
  },
  {
    "name": "custom_tags",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CustomTag[]",
    "enums": null,
    "comment": "A list of custom tags with unique tag name to create tags for the logs.",
    "notImp": false
  }
] };

export const CommonGrpcAccessLogConfig_SingleFields = [
  "log_name",
  "transport_api_version",
  "buffer_flush_interval",
  "buffer_size_bytes",
  "filter_state_objects_to_log"
];

export const HttpGrpcAccessLogConfig: OutType = { "HttpGrpcAccessLogConfig": [
  {
    "name": "common_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CommonGrpcAccessLogConfig",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "additional_request_headers_to_log",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Additional request headers to log in `HTTPRequestProperties.request_headers`.",
    "notImp": false
  },
  {
    "name": "additional_response_headers_to_log",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Additional response headers to log in `HTTPResponseProperties.response_headers`.",
    "notImp": false
  },
  {
    "name": "additional_response_trailers_to_log",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Additional response trailers to log in `HTTPResponseProperties.response_trailers`.",
    "notImp": false
  }
] };

export const HttpGrpcAccessLogConfig_SingleFields = [
  "additional_request_headers_to_log",
  "additional_response_headers_to_log",
  "additional_response_trailers_to_log"
];

export const TcpGrpcAccessLogConfig: OutType = { "TcpGrpcAccessLogConfig": [
  {
    "name": "common_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CommonGrpcAccessLogConfig",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };