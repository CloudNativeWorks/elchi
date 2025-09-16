import {OutType} from '@elchi/tags/tagsType';


export const ProtocolConfiguration: OutType = { "ProtocolConfiguration": [
  {
    "name": "request_body_mode",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ProcessingMode_BodySendMode",
    "enums": [
      "NONE",
      "STREAMED",
      "BUFFERED",
      "BUFFERED_PARTIAL",
      "FULL_DUPLEX_STREAMED"
    ],
    "comment": "Specify the filter configuration `request_body_mode`",
    "notImp": false
  },
  {
    "name": "response_body_mode",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ProcessingMode_BodySendMode",
    "enums": [
      "NONE",
      "STREAMED",
      "BUFFERED",
      "BUFFERED_PARTIAL",
      "FULL_DUPLEX_STREAMED"
    ],
    "comment": "Specify the filter configuration `response_body_mode`",
    "notImp": false
  },
  {
    "name": "send_body_without_waiting_for_header_response",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Specify the filter configuration `send_body_without_waiting_for_header_response` If the client is waiting for a header response from the server, setting ``true`` means the client will send body to the server as they arrive. Setting ``false`` means the client will buffer the arrived data and not send it to the server immediately.",
    "notImp": false
  }
] };

export const ProtocolConfiguration_SingleFields = [
  "request_body_mode",
  "response_body_mode",
  "send_body_without_waiting_for_header_response"
];

export const ProcessingRequest: OutType = { "ProcessingRequest": [
  {
    "name": "request.request_headers",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HttpHeaders",
    "enums": null,
    "comment": "Information about the HTTP request headers, as well as peer info and additional properties. Unless ``observability_mode`` is ``true``, the server must send back a HeaderResponse message, an ImmediateResponse message, or close the stream.",
    "notImp": false
  },
  {
    "name": "request.response_headers",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HttpHeaders",
    "enums": null,
    "comment": "Information about the HTTP response headers, as well as peer info and additional properties. Unless ``observability_mode`` is ``true``, the server must send back a HeaderResponse message or close the stream.",
    "notImp": false
  },
  {
    "name": "request.request_body",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HttpBody",
    "enums": null,
    "comment": "A chunk of the HTTP request body. Unless ``observability_mode`` is true, the server must send back a BodyResponse message, an ImmediateResponse message, or close the stream.",
    "notImp": false
  },
  {
    "name": "request.response_body",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HttpBody",
    "enums": null,
    "comment": "A chunk of the HTTP response body. Unless ``observability_mode`` is ``true``, the server must send back a BodyResponse message or close the stream.",
    "notImp": false
  },
  {
    "name": "request.request_trailers",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HttpTrailers",
    "enums": null,
    "comment": "The HTTP trailers for the request path. Unless ``observability_mode`` is ``true``, the server must send back a TrailerResponse message or close the stream.\n\nThis message is only sent if the trailers processing mode is set to ``SEND`` and the original downstream request has trailers.",
    "notImp": false
  },
  {
    "name": "request.response_trailers",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HttpTrailers",
    "enums": null,
    "comment": "The HTTP trailers for the response path. Unless ``observability_mode`` is ``true``, the server must send back a TrailerResponse message or close the stream.\n\nThis message is only sent if the trailers processing mode is set to ``SEND`` and the original upstream response has trailers.",
    "notImp": false
  },
  {
    "name": "metadata_context",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Metadata",
    "enums": null,
    "comment": "Dynamic metadata associated with the request.",
    "notImp": false
  },
  {
    "name": "attributes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, { [key: string]: any; }>",
    "enums": null,
    "comment": "The values of properties selected by the ``request_attributes`` or ``response_attributes`` list in the configuration. Each entry in the list is populated from the standard `attributes` supported across Envoy.",
    "notImp": false
  },
  {
    "name": "observability_mode",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Specify whether the filter that sent this request is running in `observability_mode` and defaults to false.\n\n* A value of ``false`` indicates that the server must respond to this message by either sending back a matching ProcessingResponse message, or by closing the stream. * A value of ``true`` indicates that the server should not respond to this message, as any responses will be ignored. However, it may still close the stream to indicate that no more messages are needed.",
    "notImp": false
  },
  {
    "name": "protocol_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ProtocolConfiguration",
    "enums": null,
    "comment": "Specify the filter protocol configurations to be sent to the server. ``protocol_config`` is only encoded in the first ``ProcessingRequest`` message from the client to the server.",
    "notImp": false
  }
] };

export const ProcessingRequest_SingleFields = [
  "observability_mode"
];

export const ProcessingRequest_AttributesEntry: OutType = { "ProcessingRequest_AttributesEntry": [
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
    "fieldType": "{ [key: string]: any; }",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const ProcessingRequest_AttributesEntry_SingleFields = [
  "key"
];

export const ProcessingResponse: OutType = { "ProcessingResponse": [
  {
    "name": "response.request_headers",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HeadersResponse",
    "enums": null,
    "comment": "The server must send back this message in response to a message with the ``request_headers`` field set.",
    "notImp": false
  },
  {
    "name": "response.response_headers",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HeadersResponse",
    "enums": null,
    "comment": "The server must send back this message in response to a message with the ``response_headers`` field set.",
    "notImp": false
  },
  {
    "name": "response.request_body",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "BodyResponse",
    "enums": null,
    "comment": "The server must send back this message in response to a message with the ``request_body`` field set.",
    "notImp": false
  },
  {
    "name": "response.response_body",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "BodyResponse",
    "enums": null,
    "comment": "The server must send back this message in response to a message with the ``response_body`` field set.",
    "notImp": false
  },
  {
    "name": "response.request_trailers",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "TrailersResponse",
    "enums": null,
    "comment": "The server must send back this message in response to a message with the ``request_trailers`` field set.",
    "notImp": false
  },
  {
    "name": "response.response_trailers",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "TrailersResponse",
    "enums": null,
    "comment": "The server must send back this message in response to a message with the ``response_trailers`` field set.",
    "notImp": false
  },
  {
    "name": "response.immediate_response",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "ImmediateResponse",
    "enums": null,
    "comment": "If specified, attempt to create a locally generated response, send it downstream, and stop processing additional filters and ignore any additional messages received from the remote server for this request or response. If a response has already started -- for example, if this message is sent response to a ``response_body`` message -- then this will either ship the reply directly to the downstream codec, or reset the stream.",
    "notImp": false
  },
  {
    "name": "dynamic_metadata",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "{ [key: string]: any; }",
    "enums": null,
    "comment": "Optional metadata that will be emitted as dynamic metadata to be consumed by following filters. This metadata will be placed in the namespace(s) specified by the top-level field name(s) of the struct.",
    "notImp": false
  },
  {
    "name": "mode_override",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ProcessingMode",
    "enums": null,
    "comment": "Override how parts of the HTTP request and response are processed for the duration of this particular request/response only. Servers may use this to intelligently control how requests are processed based on the headers and other metadata that they see. This field is only applicable when servers responding to the header requests. If it is set in the response to the body or trailer requests, it will be ignored by Envoy. It is also ignored by Envoy when the ext_proc filter config `allow_mode_override` is set to false, or `send_body_without_waiting_for_header_response` is set to true.",
    "notImp": false
  },
  {
    "name": "override_message_timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "When ext_proc server receives a request message, in case it needs more time to process the message, it sends back a ProcessingResponse message with a new timeout value. When Envoy receives this response message, it ignores other fields in the response, just stop the original timer, which has the timeout value specified in `message_timeout` and start a new timer with this ``override_message_timeout`` value and keep the Envoy ext_proc filter state machine intact. Has to be >= 1ms and <= `max_message_timeout` Such message can be sent at most once in a particular Envoy ext_proc filter processing state. To enable this API, one has to set ``max_message_timeout`` to a number >= 1ms.",
    "notImp": false
  }
] };

export const ProcessingResponse_SingleFields = [
  "override_message_timeout"
];

export const HttpHeaders: OutType = { "HttpHeaders": [
  {
    "name": "headers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderMap",
    "enums": null,
    "comment": "The HTTP request headers. All header keys will be lower-cased, because HTTP header keys are case-insensitive. The header value is encoded in the `raw_value` field.",
    "notImp": false
  },
  {
    "name": "attributes",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "Map<string, { [key: string]: any; }>",
    "enums": null,
    "comment": "[#not-implemented-hide:] This field is deprecated and not implemented. Attributes will be sent in the  top-level `attributes <envoy_v3_api_field_service.ext_proc.v3.ProcessingRequest.attributes` field.",
    "notImp": true
  },
  {
    "name": "end_of_stream",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If ``true``, then there is no message body associated with this request or response.",
    "notImp": false
  }
] };

export const HttpHeaders_SingleFields = [
  "end_of_stream"
];

export const HttpHeaders_AttributesEntry: OutType = { "HttpHeaders_AttributesEntry": [
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
    "fieldType": "{ [key: string]: any; }",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const HttpHeaders_AttributesEntry_SingleFields = [
  "key"
];

export const HttpBody: OutType = { "HttpBody": [
  {
    "name": "body",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Uint8Array<ArrayBufferLike>",
    "enums": null,
    "comment": "The contents of the body in the HTTP request/response. Note that in streaming mode multiple ``HttpBody`` messages may be sent.",
    "notImp": false
  },
  {
    "name": "end_of_stream",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If ``true``, this will be the last ``HttpBody`` message that will be sent and no trailers will be sent for the current request/response.",
    "notImp": false
  }
] };

export const HttpBody_SingleFields = [
  "end_of_stream"
];

export const HttpTrailers: OutType = { "HttpTrailers": [
  {
    "name": "trailers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderMap",
    "enums": null,
    "comment": "The header value is encoded in the `raw_value` field.",
    "notImp": false
  }
] };

export const HeaderMutation: OutType = { "HeaderMutation": [
  {
    "name": "set_headers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderValueOption[]",
    "enums": null,
    "comment": "Add or replace HTTP headers. Attempts to set the value of any ``x-envoy`` header, and attempts to set the ``:method``, ``:authority``, ``:scheme``, or ``host`` headers will be ignored. The header value is encoded in the `raw_value` field.",
    "notImp": false
  },
  {
    "name": "remove_headers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Remove these HTTP headers. Attempts to remove system headers -- any header starting with ``:``, plus ``host`` -- will be ignored.",
    "notImp": false
  }
] };

export const HeaderMutation_SingleFields = [
  "remove_headers"
];

export const BodyMutation: OutType = { "BodyMutation": [
  {
    "name": "mutation.body",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Uint8Array<ArrayBufferLike>",
    "enums": null,
    "comment": "The entire body to replace. Should only be used when the corresponding ``BodySendMode`` in the `processing_mode` is not set to ``FULL_DUPLEX_STREAMED``.",
    "notImp": false
  },
  {
    "name": "mutation.clear_body",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Clear the corresponding body chunk. Should only be used when the corresponding ``BodySendMode`` in the `processing_mode` is not set to ``FULL_DUPLEX_STREAMED``. Clear the corresponding body chunk.",
    "notImp": false
  },
  {
    "name": "mutation.streamed_response",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "StreamedBodyResponse",
    "enums": null,
    "comment": "Must be used when the corresponding ``BodySendMode`` in the `processing_mode` is set to ``FULL_DUPLEX_STREAMED``.",
    "notImp": false
  }
] };

export const BodyMutation_SingleFields = [
  "mutation.clear_body"
];

export const CommonResponse: OutType = { "CommonResponse": [
  {
    "name": "status",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CommonResponse_ResponseStatus",
    "enums": [
      "CONTINUE",
      "CONTINUE_AND_REPLACE"
    ],
    "comment": "If set, provide additional direction on how the Envoy proxy should handle the rest of the HTTP filter chain.",
    "notImp": false
  },
  {
    "name": "header_mutation",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderMutation",
    "enums": null,
    "comment": "Instructions on how to manipulate the headers. When responding to an HttpBody request, header mutations will only take effect if the current processing mode for the body is BUFFERED.",
    "notImp": false
  },
  {
    "name": "body_mutation",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "BodyMutation",
    "enums": null,
    "comment": "Replace the body of the last message sent to the remote server on this stream. If responding to an HttpBody request, simply replace or clear the body chunk that was sent with that request. Body mutations may take effect in response either to ``header`` or ``body`` messages. When it is in response to ``header`` messages, it only take effect if the `status` is set to CONTINUE_AND_REPLACE.",
    "notImp": false
  },
  {
    "name": "trailers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderMap",
    "enums": null,
    "comment": "[#not-implemented-hide:] Add new trailers to the message. This may be used when responding to either a HttpHeaders or HttpBody message, but only if this message is returned along with the CONTINUE_AND_REPLACE status. The header value is encoded in the `raw_value` field.",
    "notImp": true
  },
  {
    "name": "clear_route_cache",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Clear the route cache for the current client request. This is necessary if the remote server modified headers that are used to calculate the route. This field is ignored in the response direction. This field is also ignored if the Envoy ext_proc filter is in the upstream filter chain.",
    "notImp": false
  }
] };

export const CommonResponse_SingleFields = [
  "status",
  "clear_route_cache"
];

export const HeadersResponse: OutType = { "HeadersResponse": [
  {
    "name": "response",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CommonResponse",
    "enums": null,
    "comment": "Details the modifications (if any) to be made by Envoy to the current request/response.",
    "notImp": false
  }
] };

export const BodyResponse: OutType = { "BodyResponse": [
  {
    "name": "response",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CommonResponse",
    "enums": null,
    "comment": "Details the modifications (if any) to be made by Envoy to the current request/response.",
    "notImp": false
  }
] };

export const TrailersResponse: OutType = { "TrailersResponse": [
  {
    "name": "header_mutation",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderMutation",
    "enums": null,
    "comment": "Details the modifications (if any) to be made by Envoy to the current request/response trailers.",
    "notImp": false
  }
] };

export const GrpcStatus: OutType = { "GrpcStatus": [
  {
    "name": "status",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The actual gRPC status.",
    "notImp": false
  }
] };

export const GrpcStatus_SingleFields = [
  "status"
];

export const ImmediateResponse: OutType = { "ImmediateResponse": [
  {
    "name": "status",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HttpStatus",
    "enums": null,
    "comment": "The response code to return.",
    "notImp": false
  },
  {
    "name": "headers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderMutation",
    "enums": null,
    "comment": "Apply changes to the default headers, which will include content-type.",
    "notImp": false
  },
  {
    "name": "body",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Uint8Array<ArrayBufferLike>",
    "enums": null,
    "comment": "The message body to return with the response which is sent using the text/plain content type, or encoded in the grpc-message header.",
    "notImp": false
  },
  {
    "name": "grpc_status",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "GrpcStatus",
    "enums": null,
    "comment": "If set, then include a gRPC status trailer.",
    "notImp": false
  },
  {
    "name": "details",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "A string detailing why this local reply was sent, which may be included in log and debug output (e.g. this populates the %RESPONSE_CODE_DETAILS% command operator field for use in access logging).",
    "notImp": false
  }
] };

export const ImmediateResponse_SingleFields = [
  "details"
];

export const StreamedBodyResponse: OutType = { "StreamedBodyResponse": [
  {
    "name": "body",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Uint8Array<ArrayBufferLike>",
    "enums": null,
    "comment": "The body response chunk that will be passed to the upstream/downstream by Envoy.",
    "notImp": false
  },
  {
    "name": "end_of_stream",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "The server sets this flag to true if it has received a body request with `end_of_stream` set to true, and this is the last chunk of body responses.",
    "notImp": false
  }
] };

export const StreamedBodyResponse_SingleFields = [
  "end_of_stream"
];