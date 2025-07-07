import {OutType} from '@/elchi/tags/tagsType';


export const RateLimitQuotaUsageReports: OutType = { "RateLimitQuotaUsageReports": [
  {
    "name": "domain",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "All quota requests must specify the domain. This enables sharing the quota server between different applications without fear of overlap. E.g., \"envoy\".\n\nShould only be provided in the first report, all subsequent messages on the same stream are considered to be in the same domain. In case the domain needs to be changes, close the stream, and reopen a new one with the different domain.",
    "notImp": false
  },
  {
    "name": "bucket_quota_usages",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RateLimitQuotaUsageReports_BucketQuotaUsage[]",
    "enums": null,
    "comment": "A list of quota usage reports. The list is processed by the RLQS server in the same order it's provided by the client.",
    "notImp": false
  }
] };

export const RateLimitQuotaUsageReports_SingleFields = [
  "domain"
];

export const BucketId: OutType = { "BucketId": [
  {
    "name": "bucket",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, string>",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const RateLimitQuotaUsageReports_BucketQuotaUsage: OutType = { "RateLimitQuotaUsageReports_BucketQuotaUsage": [
  {
    "name": "bucket_id",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "BucketId",
    "enums": null,
    "comment": "``BucketId`` for which request quota usage is reported.",
    "notImp": false
  },
  {
    "name": "time_elapsed",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Time elapsed since the last report.",
    "notImp": false
  },
  {
    "name": "num_requests_allowed",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Requests the data plane has allowed through.",
    "notImp": false
  },
  {
    "name": "num_requests_denied",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Requests throttled.",
    "notImp": false
  }
] };

export const RateLimitQuotaUsageReports_BucketQuotaUsage_SingleFields = [
  "time_elapsed",
  "num_requests_allowed",
  "num_requests_denied"
];

export const RateLimitQuotaResponse: OutType = { "RateLimitQuotaResponse": [
  {
    "name": "bucket_action",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RateLimitQuotaResponse_BucketAction[]",
    "enums": null,
    "comment": "An ordered list of actions to be applied to the buckets. The actions are applied in the given order, from top to bottom.",
    "notImp": false
  }
] };

export const RateLimitQuotaResponse_BucketAction: OutType = { "RateLimitQuotaResponse_BucketAction": [
  {
    "name": "bucket_id",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "BucketId",
    "enums": null,
    "comment": "``BucketId`` for which request the action is applied.",
    "notImp": false
  },
  {
    "name": "bucket_action.quota_assignment_action",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RateLimitQuotaResponse_BucketAction_QuotaAssignmentAction",
    "enums": null,
    "comment": "Apply the quota assignment to the bucket.\n\nCommands the data plane to apply a rate limiting strategy to the bucket. The process of applying and expiring the rate limiting strategy is detailed in the `QuotaAssignmentAction` message.",
    "notImp": false
  },
  {
    "name": "bucket_action.abandon_action",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RateLimitQuotaResponse_BucketAction_AbandonAction",
    "enums": null,
    "comment": "Abandon the bucket.\n\nCommands the data plane to abandon the bucket. The process of abandoning the bucket is described in the `AbandonAction` message.",
    "notImp": false
  }
] };

export const RateLimitQuotaResponse_BucketAction_QuotaAssignmentAction: OutType = { "RateLimitQuotaResponse_BucketAction_QuotaAssignmentAction": [
  {
    "name": "assignment_time_to_live",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "A duration after which the assignment is be considered ``expired``. The process of the expiration is described `above`.\n\n* If unset, the assignment has no expiration date. * If set to ``0``, the assignment expires immediately, forcing the client into the `\"expired assignment\"` state. This may be used by the RLQS server in cases when it needs clients to proactively fall back to the pre-configured `ExpiredAssignmentBehavior`, f.e. before the server going into restart.\n\n:::attention\nNote that `expiring` the assignment is not the same as `abandoning` the assignment. While expiring the assignment just transitions the bucket to the \"expired assignment\" state; abandoning the assignment completely erases the bucket from the data plane memory, and stops the usage reports.",
    "notImp": false
  },
  {
    "name": "rate_limit_strategy",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RateLimitStrategy",
    "enums": null,
    "comment": "Configures the local rate limiter for the request matched to the bucket. If not set, allow all requests.",
    "notImp": false
  }
] };

export const RateLimitQuotaResponse_BucketAction_QuotaAssignmentAction_SingleFields = [
  "assignment_time_to_live"
];

export const BucketId_BucketEntry: OutType = { "BucketId_BucketEntry": [
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

export const BucketId_BucketEntry_SingleFields = [
  "key",
  "value"
];