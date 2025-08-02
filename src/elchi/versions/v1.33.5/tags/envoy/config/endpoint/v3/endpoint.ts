import {OutType} from '@elchi/tags/tagsType';


export const ClusterLoadAssignment_Policy: OutType = { "ClusterLoadAssignment_Policy": [
  {
    "name": "drop_overloads",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ClusterLoadAssignment_Policy_DropOverload[]",
    "enums": null,
    "comment": "Action to trim the overall incoming traffic to protect the upstream hosts. This action allows protection in case the hosts are unable to recover from an outage, or unable to autoscale or unable to handle incoming traffic volume for any reason.\n\nAt the client each category is applied one after the other to generate the 'actual' drop percentage on all outgoing traffic. For example:\n\n```json\n\n { \"drop_overloads\": [\n     { \"category\": \"throttle\", \"drop_percentage\": 60 }\n     { \"category\": \"lb\", \"drop_percentage\": 50 }\n ]}\n```\n\nThe actual drop percentages applied to the traffic at the clients will be \"throttle\"_drop = 60% \"lb\"_drop = 20%  // 50% of the remaining 'actual' load, which is 40%. actual_outgoing_load = 20% // remaining after applying all categories.\n\nEnvoy supports only one element and will NACK if more than one element is present. Other xDS-capable data planes will not necessarily have this limitation.\n\nIn Envoy, this ``drop_overloads`` config can be overridden by a runtime key \"load_balancing_policy.drop_overload_limit\" setting. This runtime key can be set to any integer number between 0 and 100. 0 means drop 0%. 100 means drop 100%. When both ``drop_overloads`` config and \"load_balancing_policy.drop_overload_limit\" setting are in place, the min of these two wins.",
    "notImp": false
  },
  {
    "name": "overprovisioning_factor",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Priority levels and localities are considered overprovisioned with this factor (in percentage). This means that we don't consider a priority level or locality unhealthy until the fraction of healthy hosts multiplied by the overprovisioning factor drops below 100. With the default value 140(1.4), Envoy doesn't consider a priority level or a locality unhealthy until their percentage of healthy hosts drops below 72%. For example:\n\n```json\n\n { \"overprovisioning_factor\": 100 }\n```\n\nRead more at `priority levels` and `localities`.",
    "notImp": false
  },
  {
    "name": "endpoint_stale_after",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The max time until which the endpoints from this assignment can be used. If no new assignments are received before this time expires the endpoints are considered stale and should be marked unhealthy. Defaults to 0 which means endpoints never go stale.",
    "notImp": false
  },
  {
    "name": "weighted_priority_health",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, use the `load balancing weight` of healthy and unhealthy hosts to determine the health of the priority level. If false, use the number of healthy and unhealthy hosts to determine the health of the priority level, or in other words assume each host has a weight of 1 for this calculation.\n\nNote: this is not currently implemented for `locality weighted load balancing`.",
    "notImp": false
  }
] };

export const ClusterLoadAssignment_Policy_SingleFields = [
  "overprovisioning_factor",
  "endpoint_stale_after",
  "weighted_priority_health"
];

export const ClusterLoadAssignment: OutType = { "ClusterLoadAssignment": [
  {
    "name": "cluster_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Name of the cluster. This will be the `service_name` value if specified in the cluster `EdsClusterConfig`.",
    "notImp": false
  },
  {
    "name": "endpoints",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "LocalityLbEndpoints[]",
    "enums": null,
    "comment": "List of endpoints to load balance to.",
    "notImp": false
  },
  {
    "name": "named_endpoints",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, Endpoint>",
    "enums": null,
    "comment": "Map of named endpoints that can be referenced in LocalityLbEndpoints. [#not-implemented-hide:]",
    "notImp": true
  },
  {
    "name": "policy",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ClusterLoadAssignment_Policy",
    "enums": null,
    "comment": "Load balancing policy settings.",
    "notImp": false
  }
] };

export const ClusterLoadAssignment_SingleFields = [
  "cluster_name"
];

export const ClusterLoadAssignment_Policy_DropOverload: OutType = { "ClusterLoadAssignment_Policy_DropOverload": [
  {
    "name": "category",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Identifier for the policy specifying the drop.",
    "notImp": false
  },
  {
    "name": "drop_percentage",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FractionalPercent",
    "enums": null,
    "comment": "Percentage of traffic that should be dropped for the category.",
    "notImp": false
  }
] };

export const ClusterLoadAssignment_Policy_DropOverload_SingleFields = [
  "category"
];

export const ClusterLoadAssignment_NamedEndpointsEntry: OutType = { "ClusterLoadAssignment_NamedEndpointsEntry": [
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
    "fieldType": "Endpoint",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const ClusterLoadAssignment_NamedEndpointsEntry_SingleFields = [
  "key"
];