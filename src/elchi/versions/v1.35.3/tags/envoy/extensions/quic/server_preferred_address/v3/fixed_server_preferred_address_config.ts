import {OutType} from '@elchi/tags/tagsType';


export const FixedServerPreferredAddressConfig_AddressFamilyConfig: OutType = { "FixedServerPreferredAddressConfig_AddressFamilyConfig": [
  {
    "name": "address",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SocketAddress",
    "enums": null,
    "comment": "The server preferred address sent to clients.\n\n:::note\n\nEnvoy currently requires all packets for a QUIC connection to arrive on the same port. Therefore, unless a `dnat_address` is explicitly configured, the port specified here must be set to zero. In such cases, Envoy will automatically use the listener's port.",
    "notImp": false
  },
  {
    "name": "dnat_address",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SocketAddress",
    "enums": null,
    "comment": "If a DNAT exists between the client and Envoy, this is the address where Envoy will observe incoming server preferred address packets. If unspecified, Envoy assumes there is no DNAT, and packets will be sent directly to the address advertised to clients as the server preferred address.\n\n:::note\n\nEnvoy currently requires all packets for a QUIC connection to arrive on the same port. Consequently, the port for this address must be set to zero, with Envoy defaulting to the listener's port instead.",
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