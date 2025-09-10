import {OutType} from '@elchi/tags/tagsType';


export const MatchPredicate: OutType = { "MatchPredicate": [
  {
    "name": "rule.or_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "MatchPredicate_MatchSet",
    "enums": null,
    "comment": "A set that describes a logical OR. If any member of the set matches, the match configuration matches.",
    "notImp": false
  },
  {
    "name": "rule.and_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "MatchPredicate_MatchSet",
    "enums": null,
    "comment": "A set that describes a logical AND. If all members of the set match, the match configuration matches.",
    "notImp": false
  },
  {
    "name": "rule.not_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "MatchPredicate",
    "enums": null,
    "comment": "A negation match. The match configuration will match if the negated match condition matches.",
    "notImp": false
  },
  {
    "name": "rule.any_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "The match configuration will always match.",
    "notImp": false
  },
  {
    "name": "rule.http_request_headers_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HttpHeadersMatch",
    "enums": null,
    "comment": "HTTP request headers match configuration.",
    "notImp": false
  },
  {
    "name": "rule.http_request_trailers_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HttpHeadersMatch",
    "enums": null,
    "comment": "HTTP request trailers match configuration.",
    "notImp": false
  },
  {
    "name": "rule.http_response_headers_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HttpHeadersMatch",
    "enums": null,
    "comment": "HTTP response headers match configuration.",
    "notImp": false
  },
  {
    "name": "rule.http_response_trailers_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HttpHeadersMatch",
    "enums": null,
    "comment": "HTTP response trailers match configuration.",
    "notImp": false
  },
  {
    "name": "rule.http_request_generic_body_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HttpGenericBodyMatch",
    "enums": null,
    "comment": "HTTP request generic body match configuration.",
    "notImp": false
  },
  {
    "name": "rule.http_response_generic_body_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HttpGenericBodyMatch",
    "enums": null,
    "comment": "HTTP response generic body match configuration.",
    "notImp": false
  }
] };

export const MatchPredicate_SingleFields = [
  "rule.any_match"
];

export const OutputConfig: OutType = { "OutputConfig": [
  {
    "name": "sinks",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "OutputSink[]",
    "enums": null,
    "comment": "Output sinks for tap data. Currently a single sink is allowed in the list. Once multiple sink types are supported this constraint will be relaxed.",
    "notImp": false
  },
  {
    "name": "max_buffered_rx_bytes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "For buffered tapping, the maximum amount of received body that will be buffered prior to truncation. If truncation occurs, the `truncated` field will be set. If not specified, the default is 1KiB.",
    "notImp": false
  },
  {
    "name": "max_buffered_tx_bytes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "For buffered tapping, the maximum amount of transmitted body that will be buffered prior to truncation. If truncation occurs, the `truncated` field will be set. If not specified, the default is 1KiB.",
    "notImp": false
  },
  {
    "name": "streaming",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Indicates whether taps produce a single buffered message per tap, or multiple streamed messages per tap in the emitted `TraceWrapper` messages. Note that streamed tapping does not mean that no buffering takes place. Buffering may be required if data is processed before a match can be determined. See the HTTP tap filter `streaming` documentation for more information.",
    "notImp": false
  },
  {
    "name": "min_streamed_sent_bytes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Tapped messages will be sent on each read/write event for streamed tapping by default. But this behavior could be controlled by setting this field. If set then the tapped messages will be send once the threshold is reached. This could be used to avoid high frequent sending.",
    "notImp": false
  }
] };

export const OutputConfig_SingleFields = [
  "max_buffered_rx_bytes",
  "max_buffered_tx_bytes",
  "streaming",
  "min_streamed_sent_bytes"
];

export const TapConfig: OutType = { "TapConfig": [
  {
    "name": "match_config",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "MatchPredicate",
    "enums": null,
    "comment": "The match configuration. If the configuration matches the data source being tapped, a tap will occur, with the result written to the configured output. Exactly one of `match` and `match_config` must be set. If both are set, the `match` will be used.",
    "notImp": false
  },
  {
    "name": "match",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "MatchPredicate",
    "enums": null,
    "comment": "The match configuration. If the configuration matches the data source being tapped, a tap will occur, with the result written to the configured output. Exactly one of `match` and `match_config` must be set. If both are set, the `match` will be used.",
    "notImp": false
  },
  {
    "name": "output_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "OutputConfig",
    "enums": null,
    "comment": "The tap output configuration. If a match configuration matches a data source being tapped, a tap will occur and the data will be written to the configured output.",
    "notImp": false
  },
  {
    "name": "tap_enabled",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RuntimeFractionalPercent",
    "enums": null,
    "comment": "[#not-implemented-hide:] Specify if Tap matching is enabled. The % of requests\\connections for which the tap matching is enabled. When not enabled, the request\\connection will not be recorded.\n\n:::note\n\nThis field defaults to 100/`HUNDRED`.",
    "notImp": true
  }
] };

export const MatchPredicate_MatchSet: OutType = { "MatchPredicate_MatchSet": [
  {
    "name": "rules",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "MatchPredicate[]",
    "enums": null,
    "comment": "The list of rules that make up the set.",
    "notImp": false
  }
] };

export const HttpHeadersMatch: OutType = { "HttpHeadersMatch": [
  {
    "name": "headers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderMatcher[]",
    "enums": null,
    "comment": "HTTP headers to match.",
    "notImp": false
  }
] };

export const HttpGenericBodyMatch: OutType = { "HttpGenericBodyMatch": [
  {
    "name": "bytes_limit",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Limits search to specified number of bytes - default zero (no limit - match entire captured buffer).",
    "notImp": false
  },
  {
    "name": "patterns",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HttpGenericBodyMatch_GenericTextMatch[]",
    "enums": null,
    "comment": "List of patterns to match.",
    "notImp": false
  }
] };

export const HttpGenericBodyMatch_SingleFields = [
  "bytes_limit"
];

export const HttpGenericBodyMatch_GenericTextMatch: OutType = { "HttpGenericBodyMatch_GenericTextMatch": [
  {
    "name": "rule.string_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Text string to be located in HTTP body.",
    "notImp": false
  },
  {
    "name": "rule.binary_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Uint8Array<ArrayBufferLike>",
    "enums": null,
    "comment": "Sequence of bytes to be located in HTTP body.",
    "notImp": false
  }
] };

export const HttpGenericBodyMatch_GenericTextMatch_SingleFields = [
  "rule.string_match"
];

export const OutputSink: OutType = { "OutputSink": [
  {
    "name": "format",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "OutputSink_Format",
    "enums": [
      "JSON_BODY_AS_BYTES",
      "JSON_BODY_AS_STRING",
      "PROTO_BINARY",
      "PROTO_BINARY_LENGTH_DELIMITED",
      "PROTO_TEXT"
    ],
    "comment": "Sink output format.",
    "notImp": false
  },
  {
    "name": "output_sink_type.streaming_admin",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "StreamingAdminSink",
    "enums": null,
    "comment": "Tap output will be streamed out the :http:post:`/tap` admin endpoint.\n\n:::attention\n\nIt is only allowed to specify the streaming admin output sink if the tap is being configured from the :http:post:`/tap` admin endpoint. Thus, if an extension has been configured to receive tap configuration from some other source (e.g., static file, XDS, etc.) configuring the streaming admin output type will fail.",
    "notImp": false
  },
  {
    "name": "output_sink_type.file_per_tap",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "FilePerTapSink",
    "enums": null,
    "comment": "Tap output will be written to a file per tap sink.",
    "notImp": false
  },
  {
    "name": "output_sink_type.streaming_grpc",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "StreamingGrpcSink",
    "enums": null,
    "comment": "[#not-implemented-hide:] GrpcService to stream data to. The format argument must be PROTO_BINARY.",
    "notImp": true
  },
  {
    "name": "output_sink_type.buffered_admin",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "BufferedAdminSink",
    "enums": null,
    "comment": "Tap output will be buffered in a single block before flushing to the :http:post:`/tap` admin endpoint\n\n:::attention\n\nIt is only allowed to specify the buffered admin output sink if the tap is being configured from the :http:post:`/tap` admin endpoint. Thus, if an extension has been configured to receive tap configuration from some other source (e.g., static file, XDS, etc.) configuring the buffered admin output type will fail.",
    "notImp": false
  },
  {
    "name": "output_sink_type.custom_sink",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "Tap output filter will be defined by an extension type",
    "notImp": false
  }
] };

export const OutputSink_SingleFields = [
  "format"
];

export const BufferedAdminSink: OutType = { "BufferedAdminSink": [
  {
    "name": "max_traces",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Stop collecting traces when the specified number are collected. If other criteria for ending collection are reached first, this value will not be used.",
    "notImp": false
  },
  {
    "name": "timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Acts as a fallback to prevent the client from waiting for long periods of time. After timeout has occurred, a buffer flush will be triggered, returning the traces buffered so far. This may result in returning fewer traces than were requested, and in the case that no traces are buffered during this time, no traces will be returned. Specifying 0 for the timeout value (or not specifying a value at all) indicates an infinite timeout.",
    "notImp": false
  }
] };

export const BufferedAdminSink_SingleFields = [
  "max_traces",
  "timeout"
];

export const FilePerTapSink: OutType = { "FilePerTapSink": [
  {
    "name": "path_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Path prefix. The output file will be of the form <path_prefix>_<id>.pb, where <id> is an identifier distinguishing the recorded trace for stream instances (the Envoy connection ID, HTTP stream ID, etc.).",
    "notImp": false
  }
] };

export const FilePerTapSink_SingleFields = [
  "path_prefix"
];

export const StreamingGrpcSink: OutType = { "StreamingGrpcSink": [
  {
    "name": "tap_id",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Opaque identifier, that will be sent back to the streaming grpc server.",
    "notImp": false
  },
  {
    "name": "grpc_service",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "GrpcService",
    "enums": null,
    "comment": "The gRPC server that hosts the Tap Sink Service.",
    "notImp": false
  }
] };

export const StreamingGrpcSink_SingleFields = [
  "tap_id"
];