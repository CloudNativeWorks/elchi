import {OutType} from '@elchi/tags/tagsType';


export const RingHash: OutType = { "RingHash": [
  {
    "name": "hash_function",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RingHash_HashFunction",
    "enums": [
      "DEFAULT_HASH",
      "XX_HASH",
      "MURMUR_HASH_2"
    ],
    "comment": "The hash function used to hash hosts onto the ketama ring. The value defaults to `XX_HASH`.",
    "notImp": false
  },
  {
    "name": "minimum_ring_size",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Minimum hash ring size. The larger the ring is (that is, the more hashes there are for each provided host) the better the request distribution will reflect the desired weights. Defaults to 1024 entries, and limited to 8M entries. See also `maximum_ring_size`.",
    "notImp": false
  },
  {
    "name": "maximum_ring_size",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Maximum hash ring size. Defaults to 8M entries, and limited to 8M entries, but can be lowered to further constrain resource use. See also `minimum_ring_size`.",
    "notImp": false
  },
  {
    "name": "use_hostname_for_hashing",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set to ``true``, the cluster will use hostname instead of the resolved address as the key to consistently hash to an upstream host. Only valid for StrictDNS clusters with hostnames which resolve to a single IP address.\n\n:::note\nThis is deprecated and please use `consistent_hashing_lb_config` instead. \n:::",
    "notImp": false
  },
  {
    "name": "hash_balance_factor",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "number",
    "enums": null,
    "comment": "Configures percentage of average cluster load to bound per upstream host. For example, with a value of 150 no upstream host will get a load more than 1.5 times the average load of all the hosts in the cluster. If not specified, the load is not bounded for any upstream host. Typical value for this parameter is between 120 and 200. Minimum is 100.\n\nThis is implemented based on the method described in the paper https://arxiv.org/abs/1608.01350. For the specified ``hash_balance_factor``, requests to any upstream host are capped at ``hash_balance_factor/100`` times the average number of requests across the cluster. When a request arrives for an upstream host that is currently serving at its max capacity, linear probing is used to identify an eligible host. Further, the linear probe is implemented using a random jump in hosts ring/table to identify the eligible host (this technique is as described in the paper https://arxiv.org/abs/1908.08762 - the random jump avoids the cascading overflow effect when choosing the next host in the ring/table).\n\nIf weights are specified on the hosts, they are respected.\n\nThis is an O(N) algorithm, unlike other load balancers. Using a lower ``hash_balance_factor`` results in more hosts being probed, so use a higher value if you require better performance.\n\n:::note\nThis is deprecated and please use `consistent_hashing_lb_config` instead. \n:::",
    "notImp": false
  },
  {
    "name": "consistent_hashing_lb_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ConsistentHashingLbConfig",
    "enums": null,
    "comment": "Common configuration for hashing-based load balancing policies.",
    "notImp": false
  },
  {
    "name": "locality_weighted_lb_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "LocalityLbConfig_LocalityWeightedLbConfig",
    "enums": null,
    "comment": "Enable locality weighted load balancing for ring hash lb explicitly.",
    "notImp": false
  }
] };

export const RingHash_SingleFields = [
  "hash_function",
  "minimum_ring_size",
  "maximum_ring_size"
];