import {OutType} from '@elchi/tags/tagsType';


export const AdmissionControl: OutType = { "AdmissionControl": [
  {
    "name": "enabled",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RuntimeFeatureFlag",
    "enums": null,
    "comment": "If set to false, the admission control filter will operate as a pass-through filter. If the message is unspecified, the filter will be enabled.",
    "notImp": false
  },
  {
    "name": "evaluation_criteria.success_criteria",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "AdmissionControl_SuccessCriteria",
    "enums": null,
    "comment": "Defines how a request is considered a success/failure.",
    "notImp": false
  },
  {
    "name": "sampling_window",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The sliding time window over which the success rate is calculated. The window is rounded to the nearest second. Defaults to 30s.",
    "notImp": false
  },
  {
    "name": "aggression",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RuntimeDouble",
    "enums": null,
    "comment": "Rejection probability is defined by the formula::\n\n    max(0, (rq_count -  rq_success_count / sr_threshold) / (rq_count + 1)) ^ (1 / aggression)\n\nThe aggression dictates how heavily the admission controller will throttle requests upon SR dropping at or below the threshold. A value of 1 will result in a linear increase in rejection probability as SR drops. Any values less than 1.0, will be set to 1.0. If the message is unspecified, the aggression is 1.0. See `the admission control documentation <https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_filters/admission_control_filter.html>`_ for a diagram illustrating this.",
    "notImp": false
  },
  {
    "name": "sr_threshold",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RuntimePercent",
    "enums": null,
    "comment": "Dictates the success rate at which the rejection probability is non-zero. As success rate drops below this threshold, rejection probability will increase. Any success rate above the threshold results in a rejection probability of 0. Defaults to 95%.",
    "notImp": false
  },
  {
    "name": "rps_threshold",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RuntimeUInt32",
    "enums": null,
    "comment": "If the average RPS of the sampling window is below this threshold, the request will not be rejected, even if the success rate is lower than sr_threshold. Defaults to 0.",
    "notImp": false
  },
  {
    "name": "max_rejection_probability",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RuntimePercent",
    "enums": null,
    "comment": "The probability of rejection will never exceed this value, even if the failure rate is rising. Defaults to 80%.",
    "notImp": false
  }
] };

export const AdmissionControl_SingleFields = [
  "sampling_window"
];

export const AdmissionControl_SuccessCriteria_HttpCriteria: OutType = { "AdmissionControl_SuccessCriteria_HttpCriteria": [
  {
    "name": "http_success_status",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Int32Range[]",
    "enums": null,
    "comment": "Status code ranges that constitute a successful request. Configurable codes are in the range [100, 600).",
    "notImp": false
  }
] };

export const AdmissionControl_SuccessCriteria_GrpcCriteria: OutType = { "AdmissionControl_SuccessCriteria_GrpcCriteria": [
  {
    "name": "grpc_success_status",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number[]",
    "enums": null,
    "comment": "Status codes that constitute a successful request. Mappings can be found at: https://github.com/grpc/grpc/blob/master/doc/statuscodes.md.",
    "notImp": false
  }
] };

export const AdmissionControl_SuccessCriteria_GrpcCriteria_SingleFields = [
  "grpc_success_status"
];

export const AdmissionControl_SuccessCriteria: OutType = { "AdmissionControl_SuccessCriteria": [
  {
    "name": "http_criteria",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "AdmissionControl_SuccessCriteria_HttpCriteria",
    "enums": null,
    "comment": "If HTTP criteria are unspecified, all HTTP status codes below 500 are treated as successful responses.\n\n:::note\n\nThe default HTTP codes considered successful by the admission controller are done so due to the unlikelihood that sending fewer requests would change their behavior (for example: redirects, unauthorized access, or bad requests won't be alleviated by sending less traffic).",
    "notImp": false
  },
  {
    "name": "grpc_criteria",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "AdmissionControl_SuccessCriteria_GrpcCriteria",
    "enums": null,
    "comment": "GRPC status codes to consider as request successes. If unspecified, defaults to: Ok, Cancelled, Unknown, InvalidArgument, NotFound, AlreadyExists, Unauthenticated, FailedPrecondition, OutOfRange, PermissionDenied, and Unimplemented.\n\n:::note\n\nThe default gRPC codes that are considered successful by the admission controller are chosen because of the unlikelihood that sending fewer requests will change the behavior.",
    "notImp": false
  }
] };