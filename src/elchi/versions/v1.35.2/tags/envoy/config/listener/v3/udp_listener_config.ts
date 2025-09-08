import {OutType} from '@elchi/tags/tagsType';


export const UdpListenerConfig: OutType = { "UdpListenerConfig": [
  {
    "name": "downstream_socket_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "UdpSocketConfig",
    "enums": null,
    "comment": "UDP socket configuration for the listener. The default for `prefer_gro` is false for listener sockets. If receiving a large amount of datagrams from a small number of sources, it may be worthwhile to enable this option after performance testing.",
    "notImp": false
  },
  {
    "name": "quic_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "QuicProtocolOptions",
    "enums": null,
    "comment": "Configuration for QUIC protocol. If empty, QUIC will not be enabled on this listener. Set to the default object to enable QUIC without modifying any additional options.",
    "notImp": false
  },
  {
    "name": "udp_packet_packet_writer_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "Configuration for the UDP packet writer. If empty, HTTP/3 will use GSO if available (`UdpDefaultWriterFactory`) or the default kernel sendmsg if not, (`UdpDefaultWriterFactory`) and raw UDP will use kernel sendmsg. extension-category: envoy.udp_packet_writer",
    "notImp": false
  }
] };