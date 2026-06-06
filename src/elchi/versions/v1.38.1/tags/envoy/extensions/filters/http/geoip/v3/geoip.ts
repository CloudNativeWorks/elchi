import {OutType} from '@elchi/tags/tagsType';


export const Geoip_XffConfig: OutType = { "Geoip_XffConfig": [
  {
    "name": "xff_num_trusted_hops",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The number of additional ingress proxy hops from the right side of the `config_http_conn_man_headers_x-forwarded-for` HTTP header to trust when determining the origin client's IP address. See the documentation for `config_http_conn_man_headers_x-forwarded-for` for more information.\n\nDefaults to ``0``.",
    "notImp": false
  }
] };

export const Geoip_XffConfig_SingleFields = [
  "xff_num_trusted_hops"
];

export const Geoip_CustomHeaderConfig: OutType = { "Geoip_CustomHeaderConfig": [
  {
    "name": "header_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the request header to extract the client IP address from. The header value must contain a valid IP address (IPv4 or IPv6).\n\nIf the header is missing or contains an invalid IP address, the filter will fall back to using the immediate downstream connection source address.",
    "notImp": false
  }
] };

export const Geoip_CustomHeaderConfig_SingleFields = [
  "header_name"
];

export const Geoip: OutType = { "Geoip": [
  {
    "name": "xff_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Geoip_XffConfig",
    "enums": null,
    "comment": "Configuration for extracting the client IP address from the ``x-forwarded-for`` header. If set, the `xff_num_trusted_hops` field will be used to determine the trusted client address from the ``x-forwarded-for`` header. If not set, the immediate downstream connection source address will be used.\n\nOnly one of ``xff_config`` or `custom_header_config` can be set.",
    "notImp": false
  },
  {
    "name": "custom_header_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Geoip_CustomHeaderConfig",
    "enums": null,
    "comment": "Configuration for extracting the client IP address from a custom request header.\n\nIf set, the `header_name` field will be used to extract the client IP address from the specified request header.\n\nOnly one of ``custom_header_config`` or `xff_config` can be set.",
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