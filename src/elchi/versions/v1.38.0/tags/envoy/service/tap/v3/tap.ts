import {OutType} from '@elchi/tags/tagsType';


export const StreamTapsRequest_Identifier: OutType = { "StreamTapsRequest_Identifier": [
  {
    "name": "node",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Node",
    "enums": null,
    "comment": "The node sending taps over the stream.",
    "notImp": false
  },
  {
    "name": "tap_id",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The opaque identifier that was set in the `output config`.",
    "notImp": false
  }
] };

export const StreamTapsRequest_Identifier_SingleFields = [
  "tap_id"
];

export const StreamTapsRequest: OutType = { "StreamTapsRequest": [
  {
    "name": "identifier",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "StreamTapsRequest_Identifier",
    "enums": null,
    "comment": "Identifier data effectively is a structured metadata. As a performance optimization this will only be sent in the first message on the stream.",
    "notImp": false
  },
  {
    "name": "trace_id",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The trace id. this can be used to merge together a streaming trace. Note that the trace_id is not guaranteed to be spatially or temporally unique.",
    "notImp": false
  },
  {
    "name": "trace",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TraceWrapper",
    "enums": null,
    "comment": "The trace data.",
    "notImp": false
  }
] };

export const StreamTapsRequest_SingleFields = [
  "trace_id"
];