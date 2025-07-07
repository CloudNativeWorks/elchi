import {OutType} from '@/elchi/tags/tagsType';


export const StreamAccessLogsMessage_Identifier: OutType = { "StreamAccessLogsMessage_Identifier": [
  {
    "name": "node",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Node",
    "enums": null,
    "comment": "The node sending the access log messages over the stream.",
    "notImp": false
  },
  {
    "name": "log_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The friendly name of the log configured in `CommonGrpcAccessLogConfig`.",
    "notImp": false
  }
] };

export const StreamAccessLogsMessage_Identifier_SingleFields = [
  "log_name"
];

export const StreamAccessLogsMessage: OutType = { "StreamAccessLogsMessage": [
  {
    "name": "identifier",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "StreamAccessLogsMessage_Identifier",
    "enums": null,
    "comment": "Identifier data that will only be sent in the first message on the stream. This is effectively structured metadata and is a performance optimization.",
    "notImp": false
  },
  {
    "name": "log_entries.http_logs",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "StreamAccessLogsMessage_HTTPAccessLogEntries",
    "enums": null,
    "comment": "Batches of log entries of a single type. Generally speaking, a given stream should only ever include one type of log entry.",
    "notImp": false
  },
  {
    "name": "log_entries.tcp_logs",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "StreamAccessLogsMessage_TCPAccessLogEntries",
    "enums": null,
    "comment": "Batches of log entries of a single type. Generally speaking, a given stream should only ever include one type of log entry.",
    "notImp": false
  }
] };

export const StreamAccessLogsMessage_HTTPAccessLogEntries: OutType = { "StreamAccessLogsMessage_HTTPAccessLogEntries": [
  {
    "name": "log_entry",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HTTPAccessLogEntry[]",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const StreamAccessLogsMessage_TCPAccessLogEntries: OutType = { "StreamAccessLogsMessage_TCPAccessLogEntries": [
  {
    "name": "log_entry",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TCPAccessLogEntry[]",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };