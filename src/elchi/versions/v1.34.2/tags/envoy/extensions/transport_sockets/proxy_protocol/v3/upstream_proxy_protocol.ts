import {OutType} from '@elchi/tags/tagsType';


export const ProxyProtocolUpstreamTransport: OutType = { "ProxyProtocolUpstreamTransport": [
  {
    "name": "config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ProxyProtocolConfig",
    "enums": null,
    "comment": "The PROXY protocol settings",
    "notImp": false
  },
  {
    "name": "transport_socket",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TransportSocket",
    "enums": null,
    "comment": "The underlying transport socket being wrapped.",
    "notImp": false
  },
  {
    "name": "allow_unspecified_address",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If this is set to true, the null addresses are allowed in the PROXY protocol header. The proxy protocol header encodes the null addresses to AF_UNSPEC. [#not-implemented-hide:]",
    "notImp": true
  },
  {
    "name": "tlv_as_pool_key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, all the TLVs are encoded in the connection pool key. [#not-implemented-hide:]",
    "notImp": true
  }
] };

export const ProxyProtocolUpstreamTransport_SingleFields = [
  "allow_unspecified_address",
  "tlv_as_pool_key"
];