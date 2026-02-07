import {OutType} from '@elchi/tags/tagsType';


export const QuicProtocolOptions: OutType = { "QuicProtocolOptions": [
  {
    "name": "quic_protocol_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "QuicProtocolOptions",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "idle_timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Maximum number of milliseconds that connection will be alive when there is no network activity.\n\nIf it is less than 1ms, Envoy will use 1ms. 300000ms if not specified.",
    "notImp": false
  },
  {
    "name": "crypto_handshake_timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Connection timeout in milliseconds before the crypto handshake is finished.\n\nIf it is less than 5000ms, Envoy will use 5000ms. 20000ms if not specified.",
    "notImp": false
  },
  {
    "name": "enabled",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RuntimeFeatureFlag",
    "enums": null,
    "comment": "Runtime flag that controls whether the listener is enabled or not. If not specified, defaults to enabled.",
    "notImp": false
  },
  {
    "name": "packets_to_read_to_connection_count_ratio",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "A multiplier to number of connections which is used to determine how many packets to read per event loop. A reasonable number should allow the listener to process enough payload but not starve TCP and other UDP sockets and also prevent long event loop duration. The default value is 32. This means if there are N QUIC connections, the total number of packets to read in each read event will be 32 * N. The actual number of packets to read in total by the UDP listener is also bound by 6000, regardless of this field or how many connections there are.",
    "notImp": false
  },
  {
    "name": "crypto_stream_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "Configure which implementation of ``quic::QuicCryptoClientStreamBase`` to be used for this listener. If not specified the `QUICHE default one configured by` will be used. extension-category: envoy.quic.server.crypto_stream",
    "notImp": false
  },
  {
    "name": "proof_source_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "Configure which implementation of ``quic::ProofSource`` to be used for this listener. If not specified the `default one configured by` will be used. extension-category: envoy.quic.proof_source",
    "notImp": false
  },
  {
    "name": "connection_id_generator_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "Config which implementation of ``quic::ConnectionIdGeneratorInterface`` to be used for this listener. If not specified the `default one configured by` will be used. extension-category: envoy.quic.connection_id_generator",
    "notImp": false
  },
  {
    "name": "server_preferred_address_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "Configure the server's preferred address to advertise so that client can migrate to it. See `example` which configures a pair of v4 and v6 preferred addresses. The current QUICHE implementation will advertise only one of the preferred IPv4 and IPv6 addresses based on the address family the client initially connects with. If not specified, Envoy will not advertise any server's preferred address. extension-category: envoy.quic.server_preferred_address",
    "notImp": false
  },
  {
    "name": "send_disable_active_migration",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Configure the server to send transport parameter `disable_active_migration <https://www.rfc-editor.org/rfc/rfc9000#section-18.2-4.30.1>`_. Defaults to false (do not send this transport parameter).",
    "notImp": false
  },
  {
    "name": "connection_debug_visitor_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "Configure which implementation of ``quic::QuicConnectionDebugVisitor`` to be used for this listener. If not specified, no debug visitor will be attached to connections. extension-category: envoy.quic.connection_debug_visitor",
    "notImp": false
  },
  {
    "name": "save_cmsg_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SocketCmsgHeaders[]",
    "enums": null,
    "comment": "Configure a type of UDP cmsg to pass to listener filters via QuicReceivedPacket. Both level and type must be specified for cmsg to be saved. Cmsg may be truncated or omitted if expected size is not set. If not specified, no cmsg will be saved to QuicReceivedPacket.",
    "notImp": false
  },
  {
    "name": "reject_new_connections",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, the listener will reject connection-establishing packets at the QUIC layer by replying with an empty version negotiation packet to the client.",
    "notImp": false
  },
  {
    "name": "max_sessions_per_event_loop",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Maximum number of QUIC sessions to create per event loop. If not specified, the default value is 16. This is an equivalent of the TCP listener option max_connections_to_accept_per_socket_event.",
    "notImp": false
  }
] };

export const QuicProtocolOptions_SingleFields = [
  "idle_timeout",
  "crypto_handshake_timeout",
  "packets_to_read_to_connection_count_ratio",
  "send_disable_active_migration",
  "reject_new_connections",
  "max_sessions_per_event_loop"
];