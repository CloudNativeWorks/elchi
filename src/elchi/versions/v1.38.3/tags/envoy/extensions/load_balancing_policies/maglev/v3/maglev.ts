import {OutType} from '@elchi/tags/tagsType';


export const Maglev: OutType = { "Maglev": [
  {
    "name": "table_size",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The table size for Maglev hashing. Maglev aims for \"minimal disruption\" rather than an absolute guarantee. Minimal disruption means that when the set of upstream hosts change, a connection will likely be sent to the same upstream as it was before. Increasing the table size reduces the amount of disruption. The table size must be prime number limited to 5000011. If it is not specified, the default is 65537.",
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
    "comment": "Enable locality weighted load balancing for maglev lb explicitly.",
    "notImp": false
  }
] };

export const Maglev_SingleFields = [
  "table_size"
];