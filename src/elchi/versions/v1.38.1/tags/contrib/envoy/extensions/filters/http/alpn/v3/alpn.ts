import {OutType} from '@elchi/tags/tagsType';


export const FilterConfig: OutType = { "FilterConfig": [
  {
    "name": "alpn_override",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FilterConfig_AlpnOverride[]",
    "enums": null,
    "comment": "Map from upstream protocol to list of ALPN",
    "notImp": false
  }
] };

export const FilterConfig_AlpnOverride: OutType = { "FilterConfig_AlpnOverride": [
  {
    "name": "upstream_protocol",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FilterConfig_Protocol",
    "enums": [
      "HTTP10",
      "HTTP11",
      "HTTP2"
    ],
    "comment": "Upstream protocol",
    "notImp": false
  },
  {
    "name": "alpn_override",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "A list of ALPN that will override the ALPN for upstream TLS connections.",
    "notImp": false
  }
] };

export const FilterConfig_AlpnOverride_SingleFields = [
  "upstream_protocol",
  "alpn_override"
];