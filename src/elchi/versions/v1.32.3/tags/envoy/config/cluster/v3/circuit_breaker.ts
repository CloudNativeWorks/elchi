import {OutType} from '@/elchi/tags/tagsType';


export const CircuitBreakers: OutType = { "CircuitBreakers": [
  {
    "name": "thresholds",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CircuitBreakers_Thresholds[]",
    "enums": null,
    "comment": "If multiple `Thresholds` are defined with the same `RoutingPriority`, the first one in the list is used. If no Thresholds is defined for a given `RoutingPriority`, the default values are used.",
    "notImp": false
  },
  {
    "name": "per_host_thresholds",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CircuitBreakers_Thresholds[]",
    "enums": null,
    "comment": "Optional per-host limits which apply to each individual host in a cluster.\n\n:::note\ncurrently only the `max_connections` field is supported for per-host limits. \n:::\n\nIf multiple per-host `Thresholds` are defined with the same `RoutingPriority`, the first one in the list is used. If no per-host Thresholds are defined for a given `RoutingPriority`, the cluster will not have per-host limits.",
    "notImp": false
  }
] };

export const CircuitBreakers_Thresholds_RetryBudget: OutType = { "CircuitBreakers_Thresholds_RetryBudget": [
  {
    "name": "budget_percent",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Percent",
    "enums": null,
    "comment": "Specifies the limit on concurrent retries as a percentage of the sum of active requests and active pending requests. For example, if there are 100 active requests and the budget_percent is set to 25, there may be 25 active retries.\n\nThis parameter is optional. Defaults to 20%.",
    "notImp": false
  },
  {
    "name": "min_retry_concurrency",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Specifies the minimum retry concurrency allowed for the retry budget. The limit on the number of active retries may never go below this number.\n\nThis parameter is optional. Defaults to 3.",
    "notImp": false
  }
] };

export const CircuitBreakers_Thresholds_RetryBudget_SingleFields = [
  "min_retry_concurrency"
];

export const CircuitBreakers_Thresholds: OutType = { "CircuitBreakers_Thresholds": [
  {
    "name": "priority",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RoutingPriority",
    "enums": [
      "DEFAULT",
      "HIGH"
    ],
    "comment": "The `RoutingPriority` the specified CircuitBreaker settings apply to.",
    "notImp": false
  },
  {
    "name": "max_connections",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The maximum number of connections that Envoy will make to the upstream cluster. If not specified, the default is 1024.",
    "notImp": false
  },
  {
    "name": "max_pending_requests",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The maximum number of pending requests that Envoy will allow to the upstream cluster. If not specified, the default is 1024. This limit is applied as a connection limit for non-HTTP traffic.",
    "notImp": false
  },
  {
    "name": "max_requests",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The maximum number of parallel requests that Envoy will make to the upstream cluster. If not specified, the default is 1024. This limit does not apply to non-HTTP traffic.",
    "notImp": false
  },
  {
    "name": "max_retries",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The maximum number of parallel retries that Envoy will allow to the upstream cluster. If not specified, the default is 3.",
    "notImp": false
  },
  {
    "name": "retry_budget",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CircuitBreakers_Thresholds_RetryBudget",
    "enums": null,
    "comment": "Specifies a limit on concurrent retries in relation to the number of active requests. This parameter is optional.\n\n:::note\n\nIf this field is set, the retry budget will override any configured retry circuit breaker.",
    "notImp": false
  },
  {
    "name": "track_remaining",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If track_remaining is true, then stats will be published that expose the number of resources remaining until the circuit breakers open. If not specified, the default is false.\n\n:::note\n\nIf a retry budget is used in lieu of the max_retries circuit breaker, the remaining retry resources remaining will not be tracked.",
    "notImp": false
  },
  {
    "name": "max_connection_pools",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The maximum number of connection pools per cluster that Envoy will concurrently support at once. If not specified, the default is unlimited. Set this for clusters which create a large number of connection pools. See `Circuit Breaking` for more details.",
    "notImp": false
  }
] };

export const CircuitBreakers_Thresholds_SingleFields = [
  "priority",
  "max_connections",
  "max_pending_requests",
  "max_requests",
  "max_retries",
  "track_remaining",
  "max_connection_pools"
];