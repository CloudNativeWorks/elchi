import {OutType} from '@/elchi/tags/tagsType';


export const ZooKeeperProxy: OutType = { "ZooKeeperProxy": [
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
    "comment": "[#not-implemented-hide:] The optional path to use for writing ZooKeeper access logs. If the access log field is empty, access logs will not be written.",
    "notImp": true
  },
  {
    "name": "max_packet_bytes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Messages — requests, responses and events — that are bigger than this value will be ignored. If it is not set, the default value is 1Mb.\n\nThe value here should match the jute.maxbuffer property in your cluster configuration:\n\nhttps://zookeeper.apache.org/doc/r3.4.10/zookeeperAdmin.html#Unsafe+Options\n\nif that is set. If it isn't, ZooKeeper's default is also 1Mb.",
    "notImp": false
  },
  {
    "name": "enable_latency_threshold_metrics",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether to emit latency threshold metrics. If not set, it defaults to false. If false, setting ``default_latency_threshold`` and ``latency_threshold_overrides`` will not have effect.",
    "notImp": false
  },
  {
    "name": "default_latency_threshold",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The default latency threshold to decide the fast/slow responses and emit metrics (used for error budget calculation).\n\nhttps://sre.google/workbook/implementing-slos/\n\nIf it is not set, the default value is 100 milliseconds.",
    "notImp": false
  },
  {
    "name": "latency_threshold_overrides",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "LatencyThresholdOverride[]",
    "enums": null,
    "comment": "List of latency threshold overrides for opcodes. If the threshold override of one opcode is not set, it will fallback to the default latency threshold. Specifying latency threshold overrides multiple times for one opcode is not allowed.",
    "notImp": false
  },
  {
    "name": "enable_per_opcode_request_bytes_metrics",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether to emit per opcode request bytes metrics. If not set, it defaults to false.",
    "notImp": false
  },
  {
    "name": "enable_per_opcode_response_bytes_metrics",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether to emit per opcode response bytes metrics. If not set, it defaults to false.",
    "notImp": false
  },
  {
    "name": "enable_per_opcode_decoder_error_metrics",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether to emit per opcode decoder error metrics. If not set, it defaults to false.",
    "notImp": false
  }
] };

export const ZooKeeperProxy_SingleFields = [
  "stat_prefix",
  "access_log",
  "max_packet_bytes",
  "enable_latency_threshold_metrics",
  "default_latency_threshold",
  "enable_per_opcode_request_bytes_metrics",
  "enable_per_opcode_response_bytes_metrics",
  "enable_per_opcode_decoder_error_metrics"
];

export const LatencyThresholdOverride: OutType = { "LatencyThresholdOverride": [
  {
    "name": "opcode",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "LatencyThresholdOverride_Opcode",
    "enums": [
      "Connect",
      "Create",
      "Delete",
      "Exists",
      "GetData",
      "SetData",
      "GetAcl",
      "SetAcl",
      "GetChildren",
      "Sync",
      "Ping",
      "GetChildren2",
      "Check",
      "Multi",
      "Create2",
      "Reconfig",
      "CheckWatches",
      "RemoveWatches",
      "CreateContainer",
      "CreateTtl",
      "Close",
      "SetAuth",
      "SetWatches",
      "GetEphemerals",
      "GetAllChildrenNumber",
      "SetWatches2",
      "AddWatch"
    ],
    "comment": "The ZooKeeper opcodes. Can be found as part of the ZooKeeper source code:\n\nhttps://github.com/apache/zookeeper/blob/master/zookeeper-server/src/main/java/org/apache/zookeeper/ZooDefs.java",
    "notImp": false
  },
  {
    "name": "threshold",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The latency threshold override of certain opcode.",
    "notImp": false
  }
] };

export const LatencyThresholdOverride_SingleFields = [
  "opcode",
  "threshold"
];