import {OutType} from '@/elchi/tags/tagsType';


export const GradientControllerConfig_ConcurrencyLimitCalculationParams: OutType = { "GradientControllerConfig_ConcurrencyLimitCalculationParams": [
  {
    "name": "max_concurrency_limit",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The allowed upper-bound on the calculated concurrency limit. Defaults to 1000.",
    "notImp": false
  },
  {
    "name": "concurrency_update_interval",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The period of time samples are taken to recalculate the concurrency limit.",
    "notImp": false
  }
] };

export const GradientControllerConfig_ConcurrencyLimitCalculationParams_SingleFields = [
  "max_concurrency_limit",
  "concurrency_update_interval"
];

export const GradientControllerConfig_MinimumRTTCalculationParams: OutType = { "GradientControllerConfig_MinimumRTTCalculationParams": [
  {
    "name": "interval",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The time interval between recalculating the minimum request round-trip time. Has to be positive.",
    "notImp": false
  },
  {
    "name": "request_count",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The number of requests to aggregate/sample during the minRTT recalculation window before updating. Defaults to 50.",
    "notImp": false
  },
  {
    "name": "jitter",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Percent",
    "enums": null,
    "comment": "Randomized time delta that will be introduced to the start of the minRTT calculation window. This is represented as a percentage of the interval duration. Defaults to 15%.\n\nExample: If the interval is 10s and the jitter is 15%, the next window will begin somewhere in the range (10s - 11.5s).",
    "notImp": false
  },
  {
    "name": "min_concurrency",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The concurrency limit set while measuring the minRTT. Defaults to 3.",
    "notImp": false
  },
  {
    "name": "buffer",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Percent",
    "enums": null,
    "comment": "Amount added to the measured minRTT to add stability to the concurrency limit during natural variability in latency. This is expressed as a percentage of the measured value and can be adjusted to allow more or less tolerance to the sampled latency values.\n\nDefaults to 25%.",
    "notImp": false
  }
] };

export const GradientControllerConfig_MinimumRTTCalculationParams_SingleFields = [
  "interval",
  "request_count",
  "min_concurrency"
];

export const GradientControllerConfig: OutType = { "GradientControllerConfig": [
  {
    "name": "sample_aggregate_percentile",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Percent",
    "enums": null,
    "comment": "The percentile to use when summarizing aggregated samples. Defaults to p50.",
    "notImp": false
  },
  {
    "name": "concurrency_limit_params",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "GradientControllerConfig_ConcurrencyLimitCalculationParams",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "min_rtt_calc_params",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "GradientControllerConfig_MinimumRTTCalculationParams",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const AdaptiveConcurrency: OutType = { "AdaptiveConcurrency": [
  {
    "name": "concurrency_controller_config.gradient_controller_config",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "GradientControllerConfig",
    "enums": null,
    "comment": "Gradient concurrency control will be used.",
    "notImp": false
  },
  {
    "name": "enabled",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RuntimeFeatureFlag",
    "enums": null,
    "comment": "If set to false, the adaptive concurrency filter will operate as a pass-through filter. If the message is unspecified, the filter will be enabled.",
    "notImp": false
  },
  {
    "name": "concurrency_limit_exceeded_status",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HttpStatus",
    "enums": null,
    "comment": "This field allows for a custom HTTP response status code to the downstream client when the concurrency limit has been exceeded. Defaults to 503 (Service Unavailable).\n\n:::note\nIf this is set to < 400, 503 will be used instead.",
    "notImp": false
  }
] };