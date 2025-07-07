import {OutType} from '@elchi/tags/tagsType';


export const LocalityLbConfig: OutType = { "LocalityLbConfig": [
  {
    "name": "locality_config_specifier.zone_aware_lb_config",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "LocalityLbConfig_ZoneAwareLbConfig",
    "enums": null,
    "comment": "Configuration for local zone aware load balancing.",
    "notImp": false
  },
  {
    "name": "locality_config_specifier.locality_weighted_lb_config",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "LocalityLbConfig_LocalityWeightedLbConfig",
    "enums": null,
    "comment": "Enable locality weighted load balancing.",
    "notImp": false
  }
] };

export const LocalityLbConfig_ZoneAwareLbConfig: OutType = { "LocalityLbConfig_ZoneAwareLbConfig": [
  {
    "name": "routing_enabled",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Percent",
    "enums": null,
    "comment": "Configures percentage of requests that will be considered for zone aware routing if zone aware routing is configured. If not specified, the default is 100%. * `runtime values`. * `Zone aware routing support`.",
    "notImp": false
  },
  {
    "name": "min_cluster_size",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Configures minimum upstream cluster size required for zone aware routing If upstream cluster size is less than specified, zone aware routing is not performed even if zone aware routing is configured. If not specified, the default is 6. * `runtime values`. * `Zone aware routing support`.",
    "notImp": false
  },
  {
    "name": "fail_traffic_on_panic",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set to true, Envoy will not consider any hosts when the cluster is in `panic mode`. Instead, the cluster will fail all requests as if all hosts are unhealthy. This can help avoid potentially overwhelming a failing service.",
    "notImp": false
  }
] };

export const LocalityLbConfig_ZoneAwareLbConfig_SingleFields = [
  "min_cluster_size",
  "fail_traffic_on_panic"
];

export const SlowStartConfig: OutType = { "SlowStartConfig": [
  {
    "name": "slow_start_window",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Represents the size of slow start window. If set, the newly created host remains in slow start mode starting from its creation time for the duration of slow start window.",
    "notImp": false
  },
  {
    "name": "aggression",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RuntimeDouble",
    "enums": null,
    "comment": "This parameter controls the speed of traffic increase over the slow start window. Defaults to 1.0, so that endpoint would get linearly increasing amount of traffic. When increasing the value for this parameter, the speed of traffic ramp-up increases non-linearly. The value of aggression parameter should be greater than 0.0. By tuning the parameter, is possible to achieve polynomial or exponential shape of ramp-up curve.\n\nDuring slow start window, effective weight of an endpoint would be scaled with time factor and aggression: ``new_weight = weight * max(min_weight_percent, time_factor ^ (1 / aggression))``, where ``time_factor=(time_since_start_seconds / slow_start_time_seconds)``.\n\nAs time progresses, more and more traffic would be sent to endpoint, which is in slow start window. Once host exits slow start, time_factor and aggression no longer affect its weight.",
    "notImp": false
  },
  {
    "name": "min_weight_percent",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Percent",
    "enums": null,
    "comment": "Configures the minimum percentage of origin weight that avoids too small new weight, which may cause endpoints in slow start mode receive no traffic in slow start window. If not specified, the default is 10%.",
    "notImp": false
  }
] };

export const SlowStartConfig_SingleFields = [
  "slow_start_window"
];

export const ConsistentHashingLbConfig: OutType = { "ConsistentHashingLbConfig": [
  {
    "name": "use_hostname_for_hashing",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set to ``true``, the cluster will use hostname instead of the resolved address as the key to consistently hash to an upstream host. Only valid for StrictDNS clusters with hostnames which resolve to a single IP address.",
    "notImp": false
  },
  {
    "name": "hash_balance_factor",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Configures percentage of average cluster load to bound per upstream host. For example, with a value of 150 no upstream host will get a load more than 1.5 times the average load of all the hosts in the cluster. If not specified, the load is not bounded for any upstream host. Typical value for this parameter is between 120 and 200. Minimum is 100.\n\nApplies to both Ring Hash and Maglev load balancers.\n\nThis is implemented based on the method described in the paper https://arxiv.org/abs/1608.01350. For the specified ``hash_balance_factor``, requests to any upstream host are capped at ``hash_balance_factor/100`` times the average number of requests across the cluster. When a request arrives for an upstream host that is currently serving at its max capacity, linear probing is used to identify an eligible host. Further, the linear probe is implemented using a random jump in hosts ring/table to identify the eligible host (this technique is as described in the paper https://arxiv.org/abs/1908.08762 - the random jump avoids the cascading overflow effect when choosing the next host in the ring/table).\n\nIf weights are specified on the hosts, they are respected.\n\nThis is an O(N) algorithm, unlike other load balancers. Using a lower ``hash_balance_factor`` results in more hosts being probed, so use a higher value if you require better performance.",
    "notImp": false
  }
] };

export const ConsistentHashingLbConfig_SingleFields = [
  "use_hostname_for_hashing",
  "hash_balance_factor"
];