import {OutType} from '@/elchi/tags/tagsType';


export const FluentdAccessLogConfig_RetryOptions: OutType = { "FluentdAccessLogConfig_RetryOptions": [
  {
    "name": "max_connect_attempts",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The number of times the logger will attempt to connect to the upstream during reconnects. By default, there is no limit. The logger will attempt to reconnect to the upstream each time connecting to the upstream failed or the upstream connection had been closed for any reason.",
    "notImp": false
  },
  {
    "name": "backoff_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "BackoffStrategy",
    "enums": null,
    "comment": "Sets the backoff strategy. If this value is not set, the default base backoff interval is 500 milliseconds and the default max backoff interval is 5 seconds (10 times the base interval).",
    "notImp": false
  }
] };

export const FluentdAccessLogConfig_RetryOptions_SingleFields = [
  "max_connect_attempts"
];

export const FluentdAccessLogConfig: OutType = { "FluentdAccessLogConfig": [
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
    "comment": "A tag is a string separated with '.' (e.g. log.type) to categorize events. See: https://github.com/fluent/fluentd/wiki/Forward-Protocol-Specification-v1#message-modes",
    "notImp": false
  },
  {
    "name": "stat_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The prefix to use when emitting `statistics`.",
    "notImp": false
  },
  {
    "name": "buffer_flush_interval",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Interval for flushing access logs to the TCP stream. Logger will flush requests every time this interval is elapsed, or when batch size limit is hit, whichever comes first. Defaults to 1 second.",
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
    "name": "record",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "{ [key: string]: any; }",
    "enums": null,
    "comment": "A struct that represents the record that is sent for each log entry. https://github.com/fluent/fluentd/wiki/Forward-Protocol-Specification-v1#entry Values are rendered as strings, numbers, or boolean values as appropriate. Nested JSON objects may be produced by some command operators (e.g. FILTER_STATE or DYNAMIC_METADATA). See `format string` documentation for a specific command operator details.\n\n```yaml\n  :type-name: envoy.extensions.access_loggers.fluentd.v3.FluentdAccessLogConfig\n\n  record:\n    status: \"%RESPONSE_CODE%\"\n    message: \"%LOCAL_REPLY_BODY%\"\n```\n The following msgpack record would be created:\n\n```json\n\n {\n   \"status\": 500,\n   \"message\": \"My error message\"\n }",
    "notImp": false
  },
  {
    "name": "retry_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FluentdAccessLogConfig_RetryOptions",
    "enums": null,
    "comment": "Optional retry, in case upstream connection has failed. If this field is not set, the default values will be applied, as specified in the `RetryOptions` configuration.",
    "notImp": false
  },
  {
    "name": "formatters",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig[]",
    "enums": null,
    "comment": "Specifies a collection of Formatter plugins that can be called from the access log configuration. See the formatters extensions documentation for details. extension-category: envoy.formatter",
    "notImp": false
  }
] };

export const FluentdAccessLogConfig_SingleFields = [
  "cluster",
  "tag",
  "stat_prefix",
  "buffer_flush_interval",
  "buffer_size_bytes"
];