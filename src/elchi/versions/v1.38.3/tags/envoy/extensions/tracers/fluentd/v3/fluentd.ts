import {OutType} from '@elchi/tags/tagsType';


export const FluentdConfig: OutType = { "FluentdConfig": [
  {
    "name": "cluster",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The upstream cluster to connect to for streaming the Fluentd messages.",
    "notImp": false
  },
  {
    "name": "tag",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "A tag is a string separated with ``.`` (e.g. ``log.type``) to categorize events. See: https://github.com/fluent/fluentd/wiki/Forward-Protocol-Specification-v1#message-modes",
    "notImp": false
  },
  {
    "name": "stat_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The prefix to use when emitting tracer stats.",
    "notImp": false
  },
  {
    "name": "buffer_flush_interval",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Interval for flushing traces to the TCP stream. Tracer will flush requests every time this interval is elapsed, or when batch size limit is hit, whichever comes first. Defaults to 1 second.",
    "notImp": false
  },
  {
    "name": "buffer_size_bytes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Soft size limit in bytes for access log entries buffer. The logger will buffer requests until this limit it hit, or every time flush interval is elapsed, whichever comes first. When the buffer limit is hit, the logger will immediately flush the buffer contents. Setting it to zero effectively disables the batching. Defaults to 16384.",
    "notImp": false
  },
  {
    "name": "retry_policy",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RetryPolicy",
    "enums": null,
    "comment": "Optional retry, in case upstream connection has failed. If this field is not set, the default values will be applied.",
    "notImp": false
  }
] };

export const FluentdConfig_SingleFields = [
  "cluster",
  "tag",
  "stat_prefix",
  "buffer_flush_interval",
  "buffer_size_bytes"
];