import {OutType} from '@elchi/tags/tagsType';


export const TraceWrapper: OutType = { "TraceWrapper": [
  {
    "name": "trace.http_buffered_trace",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HttpBufferedTrace",
    "enums": null,
    "comment": "Wrapper for all fully buffered and streamed tap traces that Envoy emits. This is required for sending traces over gRPC APIs or more easily persisting binary messages to files.",
    "notImp": false
  },
  {
    "name": "trace.http_streamed_trace_segment",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HttpStreamedTraceSegment",
    "enums": null,
    "comment": "Wrapper for all fully buffered and streamed tap traces that Envoy emits. This is required for sending traces over gRPC APIs or more easily persisting binary messages to files.",
    "notImp": false
  },
  {
    "name": "trace.socket_buffered_trace",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "SocketBufferedTrace",
    "enums": null,
    "comment": "Wrapper for all fully buffered and streamed tap traces that Envoy emits. This is required for sending traces over gRPC APIs or more easily persisting binary messages to files.",
    "notImp": false
  },
  {
    "name": "trace.socket_streamed_trace_segment",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "SocketStreamedTraceSegment",
    "enums": null,
    "comment": "Wrapper for all fully buffered and streamed tap traces that Envoy emits. This is required for sending traces over gRPC APIs or more easily persisting binary messages to files.",
    "notImp": false
  }
] };