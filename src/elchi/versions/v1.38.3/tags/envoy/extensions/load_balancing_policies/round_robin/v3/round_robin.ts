import {OutType} from '@elchi/tags/tagsType';


export const RoundRobin: OutType = { "RoundRobin": [
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
  }
] };