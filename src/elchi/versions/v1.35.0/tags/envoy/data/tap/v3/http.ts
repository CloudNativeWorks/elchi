import {OutType} from '@elchi/tags/tagsType';


export const HttpBufferedTrace_Message: OutType = { "HttpBufferedTrace_Message": [
  {
    "name": "headers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderValue[]",
    "enums": null,
    "comment": "Message headers.",
    "notImp": false
  },
  {
    "name": "body",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Body",
    "enums": null,
    "comment": "Message body.",
    "notImp": false
  },
  {
    "name": "trailers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderValue[]",
    "enums": null,
    "comment": "Message trailers.",
    "notImp": false
  },
  {
    "name": "headers_received_time",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Date",
    "enums": null,
    "comment": "The timestamp after receiving the message headers.",
    "notImp": false
  }
] };

export const HttpBufferedTrace: OutType = { "HttpBufferedTrace": [
  {
    "name": "request",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HttpBufferedTrace_Message",
    "enums": null,
    "comment": "Request message.",
    "notImp": false
  },
  {
    "name": "response",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HttpBufferedTrace_Message",
    "enums": null,
    "comment": "Response message.",
    "notImp": false
  },
  {
    "name": "downstream_connection",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Connection",
    "enums": null,
    "comment": "downstream connection",
    "notImp": false
  }
] };

export const HttpStreamedTraceSegment: OutType = { "HttpStreamedTraceSegment": [
  {
    "name": "trace_id",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Trace ID unique to the originating Envoy only. Trace IDs can repeat and should not be used for long term stable uniqueness.",
    "notImp": false
  },
  {
    "name": "message_piece.request_headers",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HeaderMap",
    "enums": null,
    "comment": "Request headers.",
    "notImp": false
  },
  {
    "name": "message_piece.request_body_chunk",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Body",
    "enums": null,
    "comment": "Request body chunk.",
    "notImp": false
  },
  {
    "name": "message_piece.request_trailers",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HeaderMap",
    "enums": null,
    "comment": "Request trailers.",
    "notImp": false
  },
  {
    "name": "message_piece.response_headers",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HeaderMap",
    "enums": null,
    "comment": "Response headers.",
    "notImp": false
  },
  {
    "name": "message_piece.response_body_chunk",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Body",
    "enums": null,
    "comment": "Response body chunk.",
    "notImp": false
  },
  {
    "name": "message_piece.response_trailers",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HeaderMap",
    "enums": null,
    "comment": "Response trailers.",
    "notImp": false
  }
] };

export const HttpStreamedTraceSegment_SingleFields = [
  "trace_id"
];