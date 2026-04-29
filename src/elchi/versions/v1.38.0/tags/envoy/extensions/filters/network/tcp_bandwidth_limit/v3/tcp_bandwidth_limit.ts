import {OutType} from '@elchi/tags/tagsType';


export const TcpBandwidthLimit: OutType = { "TcpBandwidthLimit": [
  {
    "name": "stat_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The human readable prefix to use when emitting stats.",
    "notImp": false
  },
  {
    "name": "read_limit_kbps",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The limit for read (onData) bandwidth in KiB/s. If not set, no limit is applied (unlimited bandwidth). If set to 0, all reads are blocked.",
    "notImp": false
  },
  {
    "name": "write_limit_kbps",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The limit for write (onWrite) bandwidth in KiB/s. If not set, no limit is applied (unlimited bandwidth). If set to 0, all writes are is blocked.",
    "notImp": false
  },
  {
    "name": "fill_interval",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The interval at which to process buffered data and check for available bandwidth. Defaults to 50ms. It must be at least 20ms to avoid too frequent processing.",
    "notImp": false
  },
  {
    "name": "runtime_enabled",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RuntimeFeatureFlag",
    "enums": null,
    "comment": "Runtime flag that controls whether the filter is enabled or not. If not specified, defaults to enabled.",
    "notImp": false
  }
] };

export const TcpBandwidthLimit_SingleFields = [
  "stat_prefix",
  "read_limit_kbps",
  "write_limit_kbps",
  "fill_interval"
];