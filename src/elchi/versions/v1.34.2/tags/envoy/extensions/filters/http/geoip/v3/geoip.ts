import {OutType} from '@elchi/tags/tagsType';


export const Geoip_XffConfig: OutType = { "Geoip_XffConfig": [
  {
    "name": "xff_num_trusted_hops",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The number of additional ingress proxy hops from the right side of the `config_http_conn_man_headers_x-forwarded-for` HTTP header to trust when determining the origin client's IP address. The default is zero if this option is not specified. See the documentation for `config_http_conn_man_headers_x-forwarded-for` for more information.",
    "notImp": false
  }
] };

export const Geoip_XffConfig_SingleFields = [
  "xff_num_trusted_hops"
];

export const Geoip: OutType = { "Geoip": [
  {
    "name": "xff_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Geoip_XffConfig",
    "enums": null,
    "comment": "If set, the `xff_num_trusted_hops` field will be used to determine trusted client address from ``x-forwarded-for`` header. Otherwise, the immediate downstream connection source address will be used. [#next-free-field: 2]",
    "notImp": false
  },
  {
    "name": "provider",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "Geoip driver specific configuration which depends on the driver being instantiated. See the geoip drivers for examples:\n\n- `MaxMindConfig` extension-category: envoy.geoip_providers",
    "notImp": false
  }
] };