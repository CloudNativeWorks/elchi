import {OutType} from '@elchi/tags/tagsType';


export const DataSourceServerPreferredAddressConfig_AddressFamilyConfig: OutType = { "DataSourceServerPreferredAddressConfig_AddressFamilyConfig": [
  {
    "name": "address",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DataSource",
    "enums": null,
    "comment": "The server preferred address sent to clients. The data must contain an IP address string.",
    "notImp": false
  },
  {
    "name": "port",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DataSource",
    "enums": null,
    "comment": "The server preferred address port sent to clients. The data must contain a integer port value.\n\nIf this is not specified, the listener's port is used.\n\nNote: Envoy currently must receive all packets for a QUIC connection on the same port, so unless `dnat_address` is configured, this must be left unset.",
    "notImp": false
  },
  {
    "name": "dnat_address",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DataSource",
    "enums": null,
    "comment": "If there is a DNAT between the client and Envoy, the address that Envoy will observe server preferred address packets being sent to. If this is not specified, it is assumed there is no DNAT and the server preferred address packets will be sent to the address advertised to clients for server preferred address.",
    "notImp": false
  }
] };

export const DataSourceServerPreferredAddressConfig: OutType = { "DataSourceServerPreferredAddressConfig": [
  {
    "name": "ipv4_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DataSourceServerPreferredAddressConfig_AddressFamilyConfig",
    "enums": null,
    "comment": "The IPv4 address to advertise to clients for Server Preferred Address.",
    "notImp": false
  },
  {
    "name": "ipv6_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DataSourceServerPreferredAddressConfig_AddressFamilyConfig",
    "enums": null,
    "comment": "The IPv6 address to advertise to clients for Server Preferred Address.",
    "notImp": false
  }
] };