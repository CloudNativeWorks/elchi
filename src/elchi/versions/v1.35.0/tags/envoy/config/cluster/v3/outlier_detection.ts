import {OutType} from '@elchi/tags/tagsType';


export const OutlierDetection: OutType = { "OutlierDetection": [
  {
    "name": "consecutive_5xx",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The number of consecutive server-side error responses (for HTTP traffic, 5xx responses; for TCP traffic, connection failures; for Redis, failure to respond PONG; etc.) before a consecutive 5xx ejection occurs. Defaults to 5.",
    "notImp": false
  },
  {
    "name": "interval",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The time interval between ejection analysis sweeps. This can result in both new ejections as well as hosts being returned to service. Defaults to 10000ms or 10s.",
    "notImp": false
  },
  {
    "name": "base_ejection_time",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The base time that a host is ejected for. The real time is equal to the base time multiplied by the number of times the host has been ejected and is capped by `max_ejection_time`. Defaults to 30000ms or 30s.",
    "notImp": false
  },
  {
    "name": "max_ejection_percent",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The maximum % of an upstream cluster that can be ejected due to outlier detection. Defaults to 10% . Will eject at least one host regardless of the value if `always_eject_one_host` is enabled.",
    "notImp": false
  },
  {
    "name": "enforcing_consecutive_5xx",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The % chance that a host will be actually ejected when an outlier status is detected through consecutive 5xx. This setting can be used to disable ejection or to ramp it up slowly. Defaults to 100.",
    "notImp": false
  },
  {
    "name": "enforcing_success_rate",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The % chance that a host will be actually ejected when an outlier status is detected through success rate statistics. This setting can be used to disable ejection or to ramp it up slowly. Defaults to 100.",
    "notImp": false
  },
  {
    "name": "success_rate_minimum_hosts",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The number of hosts in a cluster that must have enough request volume to detect success rate outliers. If the number of hosts is less than this setting, outlier detection via success rate statistics is not performed for any host in the cluster. Defaults to 5.",
    "notImp": false
  },
  {
    "name": "success_rate_request_volume",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The minimum number of total requests that must be collected in one interval (as defined by the interval duration above) to include this host in success rate based outlier detection. If the volume is lower than this setting, outlier detection via success rate statistics is not performed for that host. Defaults to 100.",
    "notImp": false
  },
  {
    "name": "success_rate_stdev_factor",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "This factor is used to determine the ejection threshold for success rate outlier ejection. The ejection threshold is the difference between the mean success rate, and the product of this factor and the standard deviation of the mean success rate: mean - (stdev * success_rate_stdev_factor). This factor is divided by a thousand to get a double. That is, if the desired factor is 1.9, the runtime value should be 1900. Defaults to 1900.",
    "notImp": false
  },
  {
    "name": "consecutive_gateway_failure",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The number of consecutive gateway failures (502, 503, 504 status codes) before a consecutive gateway failure ejection occurs. Defaults to 5.",
    "notImp": false
  },
  {
    "name": "enforcing_consecutive_gateway_failure",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The % chance that a host will be actually ejected when an outlier status is detected through consecutive gateway failures. This setting can be used to disable ejection or to ramp it up slowly. Defaults to 0.",
    "notImp": false
  },
  {
    "name": "split_external_local_origin_errors",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Determines whether to distinguish local origin failures from external errors. If set to true the following configuration parameters are taken into account: `consecutive_local_origin_failure`, `enforcing_consecutive_local_origin_failure` and `enforcing_local_origin_success_rate`. Defaults to false.",
    "notImp": false
  },
  {
    "name": "consecutive_local_origin_failure",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The number of consecutive locally originated failures before ejection occurs. Defaults to 5. Parameter takes effect only when `split_external_local_origin_errors` is set to true.",
    "notImp": false
  },
  {
    "name": "enforcing_consecutive_local_origin_failure",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The % chance that a host will be actually ejected when an outlier status is detected through consecutive locally originated failures. This setting can be used to disable ejection or to ramp it up slowly. Defaults to 100. Parameter takes effect only when `split_external_local_origin_errors` is set to true.",
    "notImp": false
  },
  {
    "name": "enforcing_local_origin_success_rate",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The % chance that a host will be actually ejected when an outlier status is detected through success rate statistics for locally originated errors. This setting can be used to disable ejection or to ramp it up slowly. Defaults to 100. Parameter takes effect only when `split_external_local_origin_errors` is set to true.",
    "notImp": false
  },
  {
    "name": "failure_percentage_threshold",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The failure percentage to use when determining failure percentage-based outlier detection. If the failure percentage of a given host is greater than or equal to this value, it will be ejected. Defaults to 85.",
    "notImp": false
  },
  {
    "name": "enforcing_failure_percentage",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The % chance that a host will be actually ejected when an outlier status is detected through failure percentage statistics. This setting can be used to disable ejection or to ramp it up slowly. Defaults to 0.",
    "notImp": false
  },
  {
    "name": "enforcing_failure_percentage_local_origin",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The % chance that a host will be actually ejected when an outlier status is detected through local-origin failure percentage statistics. This setting can be used to disable ejection or to ramp it up slowly. Defaults to 0.",
    "notImp": false
  },
  {
    "name": "failure_percentage_minimum_hosts",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The minimum number of hosts in a cluster in order to perform failure percentage-based ejection. If the total number of hosts in the cluster is less than this value, failure percentage-based ejection will not be performed. Defaults to 5.",
    "notImp": false
  },
  {
    "name": "failure_percentage_request_volume",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The minimum number of total requests that must be collected in one interval (as defined by the interval duration above) to perform failure percentage-based ejection for this host. If the volume is lower than this setting, failure percentage-based ejection will not be performed for this host. Defaults to 50.",
    "notImp": false
  },
  {
    "name": "max_ejection_time",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The maximum time that a host is ejected for. See `base_ejection_time` for more information. If not specified, the default value (300000ms or 300s) or `base_ejection_time` value is applied, whatever is larger.",
    "notImp": false
  },
  {
    "name": "max_ejection_time_jitter",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The maximum amount of jitter to add to the ejection time, in order to prevent a 'thundering herd' effect where all proxies try to reconnect to host at the same time. See `max_ejection_time_jitter` Defaults to 0s.",
    "notImp": false
  },
  {
    "name": "successful_active_health_check_uneject_host",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If active health checking is enabled and a host is ejected by outlier detection, a successful active health check unejects the host by default and considers it as healthy. Unejection also clears all the outlier detection counters. To change this default behavior set this config to ``false`` where active health checking will not uneject the host. Defaults to true.",
    "notImp": false
  },
  {
    "name": "monitors",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig[]",
    "enums": null,
    "comment": "Set of host's passive monitors. [#not-implemented-hide:]",
    "notImp": true
  },
  {
    "name": "always_eject_one_host",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If enabled, at least one host is ejected regardless of the value of `max_ejection_percent`. Defaults to false.",
    "notImp": false
  }
] };

export const OutlierDetection_SingleFields = [
  "consecutive_5xx",
  "interval",
  "base_ejection_time",
  "max_ejection_percent",
  "enforcing_consecutive_5xx",
  "enforcing_success_rate",
  "success_rate_minimum_hosts",
  "success_rate_request_volume",
  "success_rate_stdev_factor",
  "consecutive_gateway_failure",
  "enforcing_consecutive_gateway_failure",
  "split_external_local_origin_errors",
  "consecutive_local_origin_failure",
  "enforcing_consecutive_local_origin_failure",
  "enforcing_local_origin_success_rate",
  "failure_percentage_threshold",
  "enforcing_failure_percentage",
  "enforcing_failure_percentage_local_origin",
  "failure_percentage_minimum_hosts",
  "failure_percentage_request_volume",
  "max_ejection_time",
  "max_ejection_time_jitter",
  "successful_active_health_check_uneject_host",
  "always_eject_one_host"
];