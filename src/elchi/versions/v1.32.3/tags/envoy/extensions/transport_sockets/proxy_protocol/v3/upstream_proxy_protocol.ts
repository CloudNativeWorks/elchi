import {OutType} from '@/elchi/tags/tagsType';


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
  }
] };