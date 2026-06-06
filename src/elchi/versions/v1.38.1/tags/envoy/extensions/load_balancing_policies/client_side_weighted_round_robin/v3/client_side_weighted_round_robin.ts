import {OutType} from '@elchi/tags/tagsType';


export const ClientSideWeightedRoundRobin: OutType = { "ClientSideWeightedRoundRobin": [
  {
    "name": "enable_oob_load_report",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether to enable out-of-band utilization reporting collection from the endpoints. By default, per-request utilization reporting is used.",
    "notImp": false
  },
  {
    "name": "oob_reporting_period",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Load reporting interval to request from the server. Note that the server may not provide reports as frequently as the client requests. Used only when enable_oob_load_report is true. Default is 10 seconds.",
    "notImp": false
  },
  {
    "name": "blackout_period",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "A given endpoint must report load metrics continuously for at least this long before the endpoint weight will be used. This avoids churn when the set of endpoint addresses changes. Takes effect both immediately after we establish a connection to an endpoint and after weight_expiration_period has caused us to stop using the most recent load metrics. Default is 10 seconds.",
    "notImp": false
  },
  {
    "name": "weight_expiration_period",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "If a given endpoint has not reported load metrics in this long, then we stop using the reported weight. This ensures that we do not continue to use very stale weights. Once we stop using a stale value, if we later start seeing fresh reports again, the blackout_period applies. Defaults to 3 minutes.",
    "notImp": false
  },
  {
    "name": "weight_update_period",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "How often endpoint weights are recalculated. Values less than 100ms are capped at 100ms. Default is 1 second.",
    "notImp": false
  },
  {
    "name": "error_utilization_penalty",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The multiplier used to adjust endpoint weights with the error rate calculated as eps/qps. Configuration is rejected if this value is negative. Default is 1.0.",
    "notImp": false
  },
  {
    "name": "metric_names_for_computing_utilization",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "By default, endpoint weight is computed based on the `application_utilization` field reported by the endpoint. If that field is not set, then utilization will instead be computed by taking the max of the values of the metrics specified here. For map fields in the ORCA proto, the string will be of the form ``<map_field_name>.<map_key>``. For example, the string ``named_metrics.foo`` will mean to look for the key ``foo`` in the ORCA `named_metrics` field. If none of the specified metrics are present in the load report, then `cpu_utilization` is used instead.",
    "notImp": false
  },
  {
    "name": "slow_start_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SlowStartConfig",
    "enums": null,
    "comment": "Configuration for slow start mode. If this configuration is not set, slow start will not be not enabled.",
    "notImp": false
  }
] };

export const ClientSideWeightedRoundRobin_SingleFields = [
  "enable_oob_load_report",
  "oob_reporting_period",
  "blackout_period",
  "weight_expiration_period",
  "weight_update_period",
  "error_utilization_penalty",
  "metric_names_for_computing_utilization"
];