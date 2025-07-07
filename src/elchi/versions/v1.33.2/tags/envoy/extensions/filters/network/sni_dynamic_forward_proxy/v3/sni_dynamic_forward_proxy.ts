import {OutType} from '@elchi/tags/tagsType';


export const FilterConfig: OutType = { "FilterConfig": [
  {
    "name": "dns_cache_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DnsCacheConfig",
    "enums": null,
    "comment": "The DNS cache configuration that the filter will attach to. Note this configuration must match that of associated `dynamic forward proxy cluster configuration`.",
    "notImp": false
  },
  {
    "name": "port_specifier.port_value",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The port number to connect to the upstream.",
    "notImp": false
  },
  {
    "name": "save_upstream_address",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "When this flag is set, the filter will add the resolved upstream address in the filter state. The state should be saved with key ``envoy.stream.upstream_address`` (See :repo:`upstream_address.h<source/common/stream_info/upstream_address.h>`).",
    "notImp": false
  }
] };

export const FilterConfig_SingleFields = [
  "port_specifier.port_value",
  "save_upstream_address"
];