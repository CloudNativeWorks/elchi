import {OutType} from '@/elchi/tags/tagsType';


export const HealthCheckEvent: OutType = { "HealthCheckEvent": [
  {
    "name": "health_checker_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HealthCheckerType",
    "enums": [
      "HTTP",
      "TCP",
      "GRPC",
      "REDIS",
      "THRIFT"
    ],
    "comment": "",
    "notImp": false
  },
  {
    "name": "host",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Address",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "cluster_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "event.eject_unhealthy_event",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HealthCheckEjectUnhealthy",
    "enums": null,
    "comment": "Host ejection.",
    "notImp": false
  },
  {
    "name": "event.add_healthy_event",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HealthCheckAddHealthy",
    "enums": null,
    "comment": "Host addition.",
    "notImp": false
  },
  {
    "name": "event.successful_health_check_event",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HealthCheckSuccessful",
    "enums": null,
    "comment": "A health check was successful. Note: a host will be considered healthy either if it is the first ever health check, or if the healthy threshold is reached. This kind of event indicate that a health check was successful, but does not indicates that the host is considered healthy. A host is considered healthy if HealthCheckAddHealthy kind of event is sent.",
    "notImp": false
  },
  {
    "name": "event.health_check_failure_event",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HealthCheckFailure",
    "enums": null,
    "comment": "Host failure.",
    "notImp": false
  },
  {
    "name": "event.degraded_healthy_host",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "DegradedHealthyHost",
    "enums": null,
    "comment": "Healthy host became degraded.",
    "notImp": false
  },
  {
    "name": "event.no_longer_degraded_host",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "NoLongerDegradedHost",
    "enums": null,
    "comment": "A degraded host returned to being healthy.",
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
    "name": "metadata",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Metadata",
    "enums": null,
    "comment": "Host metadata",
    "notImp": false
  },
  {
    "name": "locality",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Locality",
    "enums": null,
    "comment": "Host locality",
    "notImp": false
  }
] };

export const HealthCheckEvent_SingleFields = [
  "health_checker_type",
  "cluster_name"
];

export const HealthCheckEjectUnhealthy: OutType = { "HealthCheckEjectUnhealthy": [
  {
    "name": "failure_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HealthCheckFailureType",
    "enums": [
      "ACTIVE",
      "PASSIVE",
      "NETWORK",
      "NETWORK_TIMEOUT"
    ],
    "comment": "The type of failure that caused this ejection.",
    "notImp": false
  }
] };

export const HealthCheckEjectUnhealthy_SingleFields = [
  "failure_type"
];

export const HealthCheckAddHealthy: OutType = { "HealthCheckAddHealthy": [
  {
    "name": "first_check",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether this addition is the result of the first ever health check on a host, in which case the configured `healthy threshold` is bypassed and the host is immediately added.",
    "notImp": false
  }
] };

export const HealthCheckAddHealthy_SingleFields = [
  "first_check"
];

export const HealthCheckFailure: OutType = { "HealthCheckFailure": [
  {
    "name": "failure_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HealthCheckFailureType",
    "enums": [
      "ACTIVE",
      "PASSIVE",
      "NETWORK",
      "NETWORK_TIMEOUT"
    ],
    "comment": "The type of failure that caused this event.",
    "notImp": false
  },
  {
    "name": "first_check",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether this event is the result of the first ever health check on a host.",
    "notImp": false
  }
] };

export const HealthCheckFailure_SingleFields = [
  "failure_type",
  "first_check"
];