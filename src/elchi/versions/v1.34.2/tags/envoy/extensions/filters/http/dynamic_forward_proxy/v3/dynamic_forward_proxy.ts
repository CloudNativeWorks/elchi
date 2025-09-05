import {OutType} from '@elchi/tags/tagsType';


export const FilterConfig: OutType = { "FilterConfig": [
  {
    "name": "implementation_specifier.dns_cache_config",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "DnsCacheConfig",
    "enums": null,
    "comment": "The DNS cache configuration that the filter will attach to. Note this configuration must match that of associated `dynamic forward proxy cluster configuration`.",
    "notImp": false
  },
  {
    "name": "implementation_specifier.sub_cluster_config",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "SubClusterConfig",
    "enums": null,
    "comment": "The configuration that the filter will use, when the related dynamic forward proxy cluster enabled sub clusters.",
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
  "save_upstream_address"
];

export const PerRouteConfig: OutType = { "PerRouteConfig": [
  {
    "name": "host_rewrite_specifier.host_rewrite_literal",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Indicates that before DNS lookup, the host header will be swapped with this value. If not set or empty, the original host header value will be used and no rewrite will happen.\n\nNote: this rewrite affects both DNS lookup and host header forwarding. However, this option shouldn't be used with `HCM host rewrite` given that the value set here would be used for DNS lookups whereas the value set in the HCM would be used for host header forwarding which is not the desired outcome.",
    "notImp": false
  },
  {
    "name": "host_rewrite_specifier.host_rewrite_header",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Indicates that before DNS lookup, the host header will be swapped with the value of this header. If not set or empty, the original host header value will be used and no rewrite will happen.\n\nNote: this rewrite affects both DNS lookup and host header forwarding. However, this option shouldn't be used with `HCM host rewrite header` given that the value set here would be used for DNS lookups whereas the value set in the HCM would be used for host header forwarding which is not the desired outcome.\n\n:::note\n\nIf the header appears multiple times only the first value is used.",
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
    "comment": "The timeout used for sub cluster initialization. Defaults to 5s if not set.",
    "notImp": false
  }
] };

export const SubClusterConfig_SingleFields = [
  "cluster_init_timeout"
];