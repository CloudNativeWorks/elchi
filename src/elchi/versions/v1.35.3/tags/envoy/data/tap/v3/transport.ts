import {OutType} from '@elchi/tags/tagsType';


export const SocketEvent: OutType = { "SocketEvent": [
  {
    "name": "timestamp",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Date",
    "enums": null,
    "comment": "Timestamp for event.",
    "notImp": false
  },
  {
    "name": "event_selector.read",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "SocketEvent_Read",
    "enums": null,
    "comment": "Read or write with content as bytes string.",
    "notImp": false
  },
  {
    "name": "event_selector.write",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "SocketEvent_Write",
    "enums": null,
    "comment": "Read or write with content as bytes string.",
    "notImp": false
  },
  {
    "name": "event_selector.closed",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "SocketEvent_Closed",
    "enums": null,
    "comment": "Read or write with content as bytes string.",
    "notImp": false
  },
  {
    "name": "connection",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Connection",
    "enums": null,
    "comment": "Connection information per event",
    "notImp": false
  }
] };

export const SocketEvent_Read: OutType = { "SocketEvent_Read": [
  {
    "name": "data",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Body",
    "enums": null,
    "comment": "Binary data read.",
    "notImp": false
  }
] };

export const SocketEvent_Write: OutType = { "SocketEvent_Write": [
  {
    "name": "data",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Body",
    "enums": null,
    "comment": "Binary data written.",
    "notImp": false
  },
  {
    "name": "end_stream",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Stream was half closed after this write.",
    "notImp": false
  }
] };

export const SocketEvent_Write_SingleFields = [
  "end_stream"
];

export const SocketBufferedTrace: OutType = { "SocketBufferedTrace": [
  {
    "name": "trace_id",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Trace ID unique to the originating Envoy only. Trace IDs can repeat and should not be used for long term stable uniqueness. Matches connection IDs used in Envoy logs.",
    "notImp": false
  },
  {
    "name": "connection",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Connection",
    "enums": null,
    "comment": "Connection properties.",
    "notImp": false
  },
  {
    "name": "events",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SocketEvent[]",
    "enums": null,
    "comment": "Sequence of observed events.",
    "notImp": false
  },
  {
    "name": "read_truncated",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Set to true if read events were truncated due to the `max_buffered_rx_bytes` setting.",
    "notImp": false
  },
  {
    "name": "write_truncated",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Set to true if write events were truncated due to the `max_buffered_tx_bytes` setting.",
    "notImp": false
  }
] };

export const SocketBufferedTrace_SingleFields = [
  "trace_id",
  "read_truncated",
  "write_truncated"
];

export const SocketEvents: OutType = { "SocketEvents": [
  {
    "name": "events",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SocketEvent[]",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const SocketStreamedTraceSegment: OutType = { "SocketStreamedTraceSegment": [
  {
    "name": "trace_id",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Trace ID unique to the originating Envoy only. Trace IDs can repeat and should not be used for long term stable uniqueness. Matches connection IDs used in Envoy logs.",
    "notImp": false
  },
  {
    "name": "message_piece.connection",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Connection",
    "enums": null,
    "comment": "Connection properties.",
    "notImp": false
  },
  {
    "name": "message_piece.event",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "SocketEvent",
    "enums": null,
    "comment": "Socket event.",
    "notImp": false
  },
  {
    "name": "message_piece.events",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "SocketEvents",
    "enums": null,
    "comment": "Sequence of observed events.",
    "notImp": false
  }
] };

export const SocketStreamedTraceSegment_SingleFields = [
  "trace_id"
];