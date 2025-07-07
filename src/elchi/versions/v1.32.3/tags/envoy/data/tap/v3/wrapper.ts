import {OutType} from '@/elchi/tags/tagsType';


export const TraceWrapper: OutType = { "TraceWrapper": [
  {
    "name": "trace.http_buffered_trace",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HttpBufferedTrace",
    "enums": null,
    "comment": "An HTTP buffered tap trace.",
    "notImp": false
  },
  {
    "name": "trace.http_streamed_trace_segment",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HttpStreamedTraceSegment",
    "enums": null,
    "comment": "An HTTP streamed tap trace segment.",
    "notImp": false
  },
  {
    "name": "trace.socket_buffered_trace",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "SocketBufferedTrace",
    "enums": null,
    "comment": "A socket buffered tap trace.",
    "notImp": false
  },
  {
    "name": "trace.socket_streamed_trace_segment",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "SocketStreamedTraceSegment",
    "enums": null,
    "comment": "A socket streamed tap trace segment.",
    "notImp": false
  }
] };