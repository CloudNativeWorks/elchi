import {OutType} from '@/elchi/tags/tagsType';


export const FixedServerPreferredAddressConfig_AddressFamilyConfig: OutType = { "FixedServerPreferredAddressConfig_AddressFamilyConfig": [
  {
    "name": "address",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SocketAddress",
    "enums": null,
    "comment": "The server preferred address sent to clients.\n\nNote: Envoy currently must receive all packets for a QUIC connection on the same port, so unless `dnat_address` is configured, the port for this address must be zero, and the listener's port will be used instead.",
    "notImp": false
  },
  {
    "name": "dnat_address",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SocketAddress",
    "enums": null,
    "comment": "If there is a DNAT between the client and Envoy, the address that Envoy will observe server preferred address packets being sent to. If this is not specified, it is assumed there is no DNAT and the server preferred address packets will be sent to the address advertised to clients for server preferred address.\n\nNote: Envoy currently must receive all packets for a QUIC connection on the same port, so the port for this address must be zero, and the listener's port will be used instead.",
    "notImp": false
  }
] };

export const FixedServerPreferredAddressConfig: OutType = { "FixedServerPreferredAddressConfig": [
  {
    "name": "ipv4_address",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "String representation of IPv4 address, i.e. \"127.0.0.2\". If not specified, none will be configured.",
    "notImp": false
  },
  {
    "name": "ipv4_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FixedServerPreferredAddressConfig_AddressFamilyConfig",
    "enums": null,
    "comment": "The IPv4 address to advertise to clients for Server Preferred Address. This field takes precedence over `ipv4_address`.",
    "notImp": false
  },
  {
    "name": "ipv6_address",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "String representation of IPv6 address, i.e. \"::1\". If not specified, none will be configured.",
    "notImp": false
  },
  {
    "name": "ipv6_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FixedServerPreferredAddressConfig_AddressFamilyConfig",
    "enums": null,
    "comment": "The IPv6 address to advertise to clients for Server Preferred Address. This field takes precedence over `ipv6_address`.",
    "notImp": false
  }
] };

export const FixedServerPreferredAddressConfig_SingleFields = [
  "ipv4_address",
  "ipv6_address"
];