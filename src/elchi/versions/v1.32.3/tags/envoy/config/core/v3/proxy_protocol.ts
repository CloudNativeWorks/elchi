import {OutType} from '@/elchi/tags/tagsType';


export const ProxyProtocolPassThroughTLVs: OutType = { "ProxyProtocolPassThroughTLVs": [
  {
    "name": "match_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ProxyProtocolPassThroughTLVs_PassTLVsMatchType",
    "enums": [
      "INCLUDE_ALL",
      "INCLUDE"
    ],
    "comment": "The strategy to pass through TLVs. Default is INCLUDE_ALL. If INCLUDE_ALL is set, all TLVs will be passed through no matter the tlv_type field.",
    "notImp": false
  },
  {
    "name": "tlv_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number[]",
    "enums": null,
    "comment": "The TLV types that are applied based on match_type. TLV type is defined as uint8_t in proxy protocol. See `the spec <https://www.haproxy.org/download/2.1/doc/proxy-protocol.txt>`_ for details.",
    "notImp": false
  }
] };

export const ProxyProtocolPassThroughTLVs_SingleFields = [
  "match_type",
  "tlv_type"
];

export const ProxyProtocolConfig: OutType = { "ProxyProtocolConfig": [
  {
    "name": "version",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ProxyProtocolConfig_Version",
    "enums": [
      "V1",
      "V2"
    ],
    "comment": "The PROXY protocol version to use. See https://www.haproxy.org/download/2.1/doc/proxy-protocol.txt for details",
    "notImp": false
  },
  {
    "name": "pass_through_tlvs",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ProxyProtocolPassThroughTLVs",
    "enums": null,
    "comment": "This config controls which TLVs can be passed to upstream if it is Proxy Protocol V2 header. If there is no setting for this field, no TLVs will be passed through.",
    "notImp": false
  }
] };

export const ProxyProtocolConfig_SingleFields = [
  "version"
];