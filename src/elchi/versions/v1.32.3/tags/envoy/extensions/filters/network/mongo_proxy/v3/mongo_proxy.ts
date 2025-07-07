import {OutType} from '@/elchi/tags/tagsType';


export const MongoProxy: OutType = { "MongoProxy": [
  {
    "name": "stat_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The human readable prefix to use when emitting `statistics`.",
    "notImp": false
  },
  {
    "name": "access_log",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The optional path to use for writing Mongo access logs. If not access log path is specified no access logs will be written. Note that access log is also gated `runtime`.",
    "notImp": false
  },
  {
    "name": "delay",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FaultDelay",
    "enums": null,
    "comment": "Inject a fixed delay before proxying a Mongo operation. Delays are applied to the following MongoDB operations: Query, Insert, GetMore, and KillCursors. Once an active delay is in progress, all incoming data up until the timer event fires will be a part of the delay.",
    "notImp": false
  },
  {
    "name": "emit_dynamic_metadata",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Flag to specify whether `dynamic metadata` should be emitted. Defaults to false.",
    "notImp": false
  },
  {
    "name": "commands",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "List of commands to emit metrics for. Defaults to \"delete\", \"insert\", and \"update\". Note that metrics will not be emitted for \"find\" commands, since those are considered queries, and metrics for those are emitted under a dedicated \"query\" namespace.",
    "notImp": false
  }
] };

export const MongoProxy_SingleFields = [
  "stat_prefix",
  "access_log",
  "emit_dynamic_metadata",
  "commands"
];