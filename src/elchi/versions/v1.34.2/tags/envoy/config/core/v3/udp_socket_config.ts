import {OutType} from '@elchi/tags/tagsType';


export const UdpSocketConfig: OutType = { "UdpSocketConfig": [
  {
    "name": "max_rx_datagram_size",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The maximum size of received UDP datagrams. Using a larger size will cause Envoy to allocate more memory per socket. Received datagrams above this size will be dropped. If not set defaults to 1500 bytes.",
    "notImp": false
  },
  {
    "name": "prefer_gro",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Configures whether Generic Receive Offload (GRO) <https://en.wikipedia.org/wiki/Large_receive_offload>_ is preferred when reading from the UDP socket. The default is context dependent and is documented where UdpSocketConfig is used. This option affects performance but not functionality. If GRO is not supported by the operating system, non-GRO receive will be used.",
    "notImp": false
  }
] };

export const UdpSocketConfig_SingleFields = [
  "max_rx_datagram_size",
  "prefer_gro"
];