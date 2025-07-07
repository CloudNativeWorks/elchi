import {OutType} from '@/elchi/tags/tagsType';


export const LeastRequest: OutType = { "LeastRequest": [
  {
    "name": "choice_count",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The number of random healthy hosts from which the host with the fewest active requests will be chosen. Defaults to 2 so that we perform two-choice selection if the field is not set. Only applies to the ``N_CHOICES`` selection method.",
    "notImp": false
  },
  {
    "name": "active_request_bias",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RuntimeDouble",
    "enums": null,
    "comment": "The following formula is used to calculate the dynamic weights when hosts have different load balancing weights:\n\n``weight = load_balancing_weight / (active_requests + 1)^active_request_bias``\n\nThe larger the active request bias is, the more aggressively active requests will lower the effective weight when all host weights are not equal.\n\n``active_request_bias`` must be greater than or equal to 0.0.\n\nWhen ``active_request_bias == 0.0`` the Least Request Load Balancer doesn't consider the number of active requests at the time it picks a host and behaves like the Round Robin Load Balancer.\n\nWhen ``active_request_bias > 0.0`` the Least Request Load Balancer scales the load balancing weight by the number of active requests at the time it does a pick.\n\nThe value is cached for performance reasons and refreshed whenever one of the Load Balancer's host sets changes, e.g., whenever there is a host membership update or a host load balancing weight change.\n\n:::note\nThis setting only takes effect if all host weights are not equal.",
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
  },
  {
    "name": "locality_lb_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "LocalityLbConfig",
    "enums": null,
    "comment": "Configuration for local zone aware load balancing or locality weighted load balancing.",
    "notImp": false
  },
  {
    "name": "enable_full_scan",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "boolean",
    "enums": null,
    "comment": "[#not-implemented-hide:] Unused. Replaced by the `selection_method` enum for better extensibility.",
    "notImp": true
  },
  {
    "name": "selection_method",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "LeastRequest_SelectionMethod",
    "enums": [
      "N_CHOICES",
      "FULL_SCAN"
    ],
    "comment": "Method for selecting the host set from which to return the host with the fewest active requests.\n\nDefaults to ``N_CHOICES``.",
    "notImp": false
  }
] };

export const LeastRequest_SingleFields = [
  "choice_count",
  "selection_method"
];