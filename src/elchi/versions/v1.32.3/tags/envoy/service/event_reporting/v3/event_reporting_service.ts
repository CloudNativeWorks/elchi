import {OutType} from '@/elchi/tags/tagsType';


export const StreamEventsRequest_Identifier: OutType = { "StreamEventsRequest_Identifier": [
  {
    "name": "node",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Node",
    "enums": null,
    "comment": "The node sending the event messages over the stream.",
    "notImp": false
  }
] };

export const StreamEventsRequest: OutType = { "StreamEventsRequest": [
  {
    "name": "identifier",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "StreamEventsRequest_Identifier",
    "enums": null,
    "comment": "Identifier data that will only be sent in the first message on the stream. This is effectively structured metadata and is a performance optimization.",
    "notImp": false
  },
  {
    "name": "events",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Any[]",
    "enums": null,
    "comment": "Batch of events. When the stream is already active, it will be the events occurred since the last message had been sent. If the server receives unknown event type, it should silently ignore it.\n\nThe following events are supported:\n\n* `HealthCheckEvent` * `OutlierDetectionEvent`",
    "notImp": false
  }
] };