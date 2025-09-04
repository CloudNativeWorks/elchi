import {OutType} from '@elchi/tags/tagsType';


export const RedisClusterConfig: OutType = { "RedisClusterConfig": [
  {
    "name": "cluster_refresh_rate",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Interval between successive topology refresh requests. If not set, this defaults to 5s.",
    "notImp": false
  },
  {
    "name": "cluster_refresh_timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Timeout for topology refresh request. If not set, this defaults to 3s.",
    "notImp": false
  },
  {
    "name": "redirect_refresh_interval",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The minimum interval that must pass after triggering a topology refresh request before a new request can possibly be triggered again. Any errors received during one of these time intervals are ignored. If not set, this defaults to 5s.",
    "notImp": false
  },
  {
    "name": "redirect_refresh_threshold",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The number of redirection errors that must be received before triggering a topology refresh request. If not set, this defaults to 5. If this is set to 0, topology refresh after redirect is disabled.",
    "notImp": false
  },
  {
    "name": "failure_refresh_threshold",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The number of failures that must be received before triggering a topology refresh request. If not set, this defaults to 0, which disables the topology refresh due to failure.",
    "notImp": false
  },
  {
    "name": "host_degraded_refresh_threshold",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The number of hosts became degraded or unhealthy before triggering a topology refresh request. If not set, this defaults to 0, which disables the topology refresh due to degraded or unhealthy host.",
    "notImp": false
  }
] };

export const RedisClusterConfig_SingleFields = [
  "cluster_refresh_rate",
  "cluster_refresh_timeout",
  "redirect_refresh_interval",
  "redirect_refresh_threshold",
  "failure_refresh_threshold",
  "host_degraded_refresh_threshold"
];