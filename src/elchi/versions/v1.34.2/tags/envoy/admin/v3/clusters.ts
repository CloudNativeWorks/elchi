import {OutType} from '@elchi/tags/tagsType';


export const Clusters: OutType = { "Clusters": [
  {
    "name": "cluster_statuses",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ClusterStatus[]",
    "enums": null,
    "comment": "Mapping from cluster name to each cluster's status.",
    "notImp": false
  }
] };

export const ClusterStatus: OutType = { "ClusterStatus": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Name of the cluster.",
    "notImp": false
  },
  {
    "name": "added_via_api",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Denotes whether this cluster was added via API or configured statically.",
    "notImp": false
  },
  {
    "name": "success_rate_ejection_threshold",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Percent",
    "enums": null,
    "comment": "The success rate threshold used in the last interval.\n\n* If `outlier_detection.split_external_local_origin_errors` is ``false``, all errors: externally and locally generated were used to calculate the threshold. * If `outlier_detection.split_external_local_origin_errors` is ``true``, only externally generated errors were used to calculate the threshold.\n\nThe threshold is used to eject hosts based on their success rate. For more information, see the `Cluster outlier detection` documentation.\n\n:::note\n\nThis field may be omitted in any of the three following cases: \n:::\n\n  1. There were not enough hosts with enough request volume to proceed with success rate based outlier ejection. 2. The threshold is computed to be < 0 because a negative value implies that there was no threshold for that interval. 3. Outlier detection is not enabled for this cluster.",
    "notImp": false
  },
  {
    "name": "host_statuses",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HostStatus[]",
    "enums": null,
    "comment": "Mapping from host address to the host's current status.",
    "notImp": false
  },
  {
    "name": "local_origin_success_rate_ejection_threshold",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Percent",
    "enums": null,
    "comment": "The success rate threshold used in the last interval when only locally originated failures were taken into account and externally originated errors were treated as success. This field should be interpreted only when `outlier_detection.split_external_local_origin_errors` is ``true``. The threshold is used to eject hosts based on their success rate.\n\nFor more information, see the `Cluster outlier detection` documentation.\n\n:::note\n\nThis field may be omitted in any of the three following cases: \n:::\n\n  1. There were not enough hosts with enough request volume to proceed with success rate based outlier ejection. 2. The threshold is computed to be < 0 because a negative value implies that there was no threshold for that interval. 3. Outlier detection is not enabled for this cluster.",
    "notImp": false
  },
  {
    "name": "circuit_breakers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CircuitBreakers",
    "enums": null,
    "comment": "`Circuit breaking` settings of the cluster.",
    "notImp": false
  },
  {
    "name": "observability_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Observability name of the cluster.",
    "notImp": false
  },
  {
    "name": "eds_service_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The `EDS service name` if the cluster is an EDS cluster.",
    "notImp": false
  }
] };

export const ClusterStatus_SingleFields = [
  "name",
  "added_via_api",
  "observability_name",
  "eds_service_name"
];

export const HostHealthStatus: OutType = { "HostHealthStatus": [
  {
    "name": "failed_active_health_check",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "The host is currently failing active health checks.",
    "notImp": false
  },
  {
    "name": "failed_outlier_check",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "The host is currently considered an outlier and has been ejected.",
    "notImp": false
  },
  {
    "name": "failed_active_degraded_check",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "The host is currently being marked as degraded through active health checking.",
    "notImp": false
  },
  {
    "name": "pending_dynamic_removal",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "The host has been removed from service discovery, but is being stabilized due to active health checking.",
    "notImp": false
  },
  {
    "name": "pending_active_hc",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "The host has not yet been health checked.",
    "notImp": false
  },
  {
    "name": "excluded_via_immediate_hc_fail",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "The host should be excluded from panic, spillover, etc. calculations because it was explicitly taken out of rotation via protocol signal and is not meant to be routed to.",
    "notImp": false
  },
  {
    "name": "active_hc_timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "The host failed active HC due to timeout.",
    "notImp": false
  },
  {
    "name": "eds_health_status",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HealthStatus",
    "enums": [
      "UNKNOWN",
      "HEALTHY",
      "UNHEALTHY",
      "DRAINING",
      "TIMEOUT",
      "DEGRADED"
    ],
    "comment": "Health status as reported by EDS. Note: only HEALTHY and UNHEALTHY are currently supported here.",
    "notImp": false
  }
] };

export const HostHealthStatus_SingleFields = [
  "failed_active_health_check",
  "failed_outlier_check",
  "failed_active_degraded_check",
  "pending_dynamic_removal",
  "pending_active_hc",
  "excluded_via_immediate_hc_fail",
  "active_hc_timeout",
  "eds_health_status"
];

export const HostStatus: OutType = { "HostStatus": [
  {
    "name": "address",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Address",
    "enums": null,
    "comment": "Address of this host.",
    "notImp": false
  },
  {
    "name": "stats",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SimpleMetric[]",
    "enums": null,
    "comment": "List of stats specific to this host.",
    "notImp": false
  },
  {
    "name": "health_status",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HostHealthStatus",
    "enums": null,
    "comment": "The host's current health status.",
    "notImp": false
  },
  {
    "name": "success_rate",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Percent",
    "enums": null,
    "comment": "The success rate for this host during the last measurement interval.\n\n* If `outlier_detection.split_external_local_origin_errors` is ``false``, all errors: externally and locally generated were used in success rate calculation. * If `outlier_detection.split_external_local_origin_errors` is ``true``, only externally generated errors were used in success rate calculation.\n\nFor more information, see the `Cluster outlier detection` documentation.\n\n:::note\n\nThe message will be missing if the host didn't receive enough traffic to calculate a reliable success rate, or if the cluster had too few hosts to apply outlier ejection based on success rate.",
    "notImp": false
  },
  {
    "name": "weight",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The host's weight. If not configured, the value defaults to 1.",
    "notImp": false
  },
  {
    "name": "hostname",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The hostname of the host, if applicable.",
    "notImp": false
  },
  {
    "name": "priority",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The host's priority. If not configured, the value defaults to 0 (highest priority).",
    "notImp": false
  },
  {
    "name": "local_origin_success_rate",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Percent",
    "enums": null,
    "comment": "The success rate for this host during the last interval, considering only locally generated errors. Externally generated errors are treated as successes.\n\nThis field is only relevant when `outlier_detection.split_external_local_origin_errors` is set to ``true``.\n\nFor more information, see the `Cluster outlier detection` documentation.\n\n:::note\n\nThe message will be missing if the host didn’t receive enough traffic to compute a success rate, or if the cluster didn’t have enough hosts to perform outlier ejection based on success rate.",
    "notImp": false
  },
  {
    "name": "locality",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Locality",
    "enums": null,
    "comment": "locality of the host.",
    "notImp": false
  }
] };

export const HostStatus_SingleFields = [
  "weight",
  "hostname",
  "priority"
];