import {OutType} from '@elchi/tags/tagsType';


export const FilterConfig: OutType = { "FilterConfig": [
  {
    "name": "implementation_specifier.dns_cache_config",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "DnsCacheConfig",
    "enums": null,
    "comment": "Configuration for the dynamic forward proxy HTTP filter. See the `architecture overview` for more information. [#extension: envoy.filters.http.dynamic_forward_proxy]",
    "notImp": false
  },
  {
    "name": "implementation_specifier.sub_cluster_config",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "SubClusterConfig",
    "enums": null,
    "comment": "Configuration for the dynamic forward proxy HTTP filter. See the `architecture overview` for more information. [#extension: envoy.filters.http.dynamic_forward_proxy]",
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
  },
  {
    "name": "allow_dynamic_host_from_filter_state",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "When this flag is set, the filter will check for the ``envoy.upstream.dynamic_host`` and/or ``envoy.upstream.dynamic_port`` filter state values before using the HTTP Host header for DNS resolution. This provides consistency with the `SNI dynamic forward proxy` and `UDP dynamic forward proxy` filters behavior when enabled.\n\nIf the flag is not set (default), the filter will use the HTTP Host header for DNS resolution, maintaining backward compatibility.",
    "notImp": false
  }
] };

export const FilterConfig_SingleFields = [
  "save_upstream_address",
  "allow_dynamic_host_from_filter_state"
];

export const PerRouteConfig: OutType = { "PerRouteConfig": [
  {
    "name": "host_rewrite_specifier.host_rewrite_literal",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Per route Configuration for the dynamic forward proxy HTTP filter.",
    "notImp": false
  },
  {
    "name": "host_rewrite_specifier.host_rewrite_header",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Per route Configuration for the dynamic forward proxy HTTP filter.",
    "notImp": false
  }
] };

export const PerRouteConfig_SingleFields = [
  "host_rewrite_specifier.host_rewrite_literal",
  "host_rewrite_specifier.host_rewrite_header"
];

export const SubClusterConfig: OutType = { "SubClusterConfig": [
  {
    "name": "cluster_init_timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The timeout used for sub cluster initialization. Defaults to **5s** if not set.",
    "notImp": false
  }
] };

export const SubClusterConfig_SingleFields = [
  "cluster_init_timeout"
];