import {OutType} from '@/elchi/tags/tagsType';


export const OutlierDetectionEvent: OutType = { "OutlierDetectionEvent": [
  {
    "name": "type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "OutlierEjectionType",
    "enums": [
      "CONSECUTIVE_5XX",
      "CONSECUTIVE_GATEWAY_FAILURE",
      "SUCCESS_RATE",
      "CONSECUTIVE_LOCAL_ORIGIN_FAILURE",
      "SUCCESS_RATE_LOCAL_ORIGIN",
      "FAILURE_PERCENTAGE",
      "FAILURE_PERCENTAGE_LOCAL_ORIGIN"
    ],
    "comment": "In case of eject represents type of ejection that took place.",
    "notImp": false
  },
  {
    "name": "timestamp",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Date",
    "enums": null,
    "comment": "Timestamp for event.",
    "notImp": false
  },
  {
    "name": "secs_since_last_action",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The time in seconds since the last action (either an ejection or unejection) took place.",
    "notImp": false
  },
  {
    "name": "cluster_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The `cluster` that owns the ejected host.",
    "notImp": false
  },
  {
    "name": "upstream_url",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The URL of the ejected host. E.g., ``tcp://1.2.3.4:80``.",
    "notImp": false
  },
  {
    "name": "action",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Action",
    "enums": [
      "EJECT",
      "UNEJECT"
    ],
    "comment": "The action that took place.",
    "notImp": false
  },
  {
    "name": "num_ejections",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "If ``action`` is ``eject``, specifies the number of times the host has been ejected (local to that Envoy and gets reset if the host gets removed from the upstream cluster for any reason and then re-added).",
    "notImp": false
  },
  {
    "name": "enforced",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If ``action`` is ``eject``, specifies if the ejection was enforced. ``true`` means the host was ejected. ``false`` means the event was logged but the host was not actually ejected.",
    "notImp": false
  },
  {
    "name": "event.eject_success_rate_event",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "OutlierEjectSuccessRate",
    "enums": null,
    "comment": "[#next-free-field: 12]",
    "notImp": false
  },
  {
    "name": "event.eject_consecutive_event",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "OutlierEjectConsecutive",
    "enums": null,
    "comment": "[#next-free-field: 12]",
    "notImp": false
  },
  {
    "name": "event.eject_failure_percentage_event",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "OutlierEjectFailurePercentage",
    "enums": null,
    "comment": "[#next-free-field: 12]",
    "notImp": false
  }
] };

export const OutlierDetectionEvent_SingleFields = [
  "type",
  "secs_since_last_action",
  "cluster_name",
  "upstream_url",
  "action",
  "num_ejections",
  "enforced"
];

export const OutlierEjectSuccessRate: OutType = { "OutlierEjectSuccessRate": [
  {
    "name": "host_success_rate",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Host’s success rate at the time of the ejection event on a 0-100 range.",
    "notImp": false
  },
  {
    "name": "cluster_average_success_rate",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Average success rate of the hosts in the cluster at the time of the ejection event on a 0-100 range.",
    "notImp": false
  },
  {
    "name": "cluster_success_rate_ejection_threshold",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Success rate ejection threshold at the time of the ejection event.",
    "notImp": false
  }
] };

export const OutlierEjectSuccessRate_SingleFields = [
  "host_success_rate",
  "cluster_average_success_rate",
  "cluster_success_rate_ejection_threshold"
];

export const OutlierEjectFailurePercentage: OutType = { "OutlierEjectFailurePercentage": [
  {
    "name": "host_success_rate",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Host's success rate at the time of the ejection event on a 0-100 range.",
    "notImp": false
  }
] };

export const OutlierEjectFailurePercentage_SingleFields = [
  "host_success_rate"
];