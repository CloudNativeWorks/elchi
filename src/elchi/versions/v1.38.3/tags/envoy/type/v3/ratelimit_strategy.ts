import {OutType} from '@elchi/tags/tagsType';


export const RateLimitStrategy: OutType = { "RateLimitStrategy": [
  {
    "name": "strategy.blanket_rule",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RateLimitStrategy_BlanketRule",
    "enums": [
      "ALLOW_ALL",
      "DENY_ALL"
    ],
    "comment": "",
    "notImp": false
  },
  {
    "name": "strategy.requests_per_time_unit",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RateLimitStrategy_RequestsPerTimeUnit",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "strategy.token_bucket",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "TokenBucket",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const RateLimitStrategy_SingleFields = [
  "strategy.blanket_rule"
];

export const RateLimitStrategy_RequestsPerTimeUnit: OutType = { "RateLimitStrategy_RequestsPerTimeUnit": [
  {
    "name": "requests_per_time_unit",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The desired number of requests per `time_unit` to allow. If set to ``0``, deny all (equivalent to ``BlanketRule.DENY_ALL``).\n\n:::note\nNote that the algorithm implementation determines the course of action for the requests over the limit. As long as the ``requests_per_time_unit`` converges on the desired value, it's allowed to treat this field as a soft-limit: allow bursts, redistribute the allowance over time, etc.",
    "notImp": false
  },
  {
    "name": "time_unit",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RateLimitUnit",
    "enums": [
      "UNKNOWN",
      "SECOND",
      "MINUTE",
      "HOUR",
      "DAY",
      "MONTH",
      "YEAR"
    ],
    "comment": "The unit of time. Ignored when `requests_per_time_unit` is ``0`` (deny all).",
    "notImp": false
  }
] };

export const RateLimitStrategy_RequestsPerTimeUnit_SingleFields = [
  "requests_per_time_unit",
  "time_unit"
];