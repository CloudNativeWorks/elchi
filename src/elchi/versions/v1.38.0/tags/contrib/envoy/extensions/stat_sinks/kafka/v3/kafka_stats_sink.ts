import {OutType} from '@elchi/tags/tagsType';


export const KafkaStatsSinkConfig: OutType = { "KafkaStatsSinkConfig": [
  {
    "name": "broker_list",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Comma-separated list of Kafka broker addresses in host:port format. At least one broker must be specified.",
    "notImp": false
  },
  {
    "name": "topic",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Kafka topic to produce metrics to.",
    "notImp": false
  },
  {
    "name": "batch_size",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Number of metrics to batch into a single Kafka message. If 0 or unset, all metrics from a single flush are sent in one message. Setting a batch size helps control message sizes when there are many metrics.",
    "notImp": false
  },
  {
    "name": "report_counters_as_deltas",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, counters are reported as the delta since last flush rather than the absolute cumulative value. Defaults to false.",
    "notImp": false
  },
  {
    "name": "emit_tags_as_labels",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, tag-extracted metric names are used and tags are emitted as separate labels/JSON fields. If false, the full metric name (including tag values) is used. Defaults to true.",
    "notImp": false
  },
  {
    "name": "producer_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, string>",
    "enums": null,
    "comment": "Additional librdkafka producer configuration properties as key-value pairs. These are passed directly to librdkafka and can be used to configure compression (``compression.type``), authentication (``security.protocol``, ``sasl.mechanism``, etc.), batching (``batch.num.messages``), and more. See https://github.com/confluentinc/librdkafka/blob/master/CONFIGURATION.md",
    "notImp": false
  },
  {
    "name": "buffer_flush_timeout_ms",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Maximum time in milliseconds to buffer messages before forcing a produce. Maps to librdkafka's ``linger.ms``. If not set, defaults to 500ms.",
    "notImp": false
  },
  {
    "name": "format",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SerializationFormat",
    "enums": [
      "JSON",
      "PROTOBUF"
    ],
    "comment": "Serialization format for metric messages produced to Kafka. Defaults to JSON.",
    "notImp": false
  }
] };

export const KafkaStatsSinkConfig_SingleFields = [
  "broker_list",
  "topic",
  "batch_size",
  "report_counters_as_deltas",
  "emit_tags_as_labels",
  "buffer_flush_timeout_ms",
  "format"
];

export const KafkaStatsSinkConfig_ProducerConfigEntry: OutType = { "KafkaStatsSinkConfig_ProducerConfigEntry": [
  {
    "name": "key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const KafkaStatsSinkConfig_ProducerConfigEntry_SingleFields = [
  "key",
  "value"
];