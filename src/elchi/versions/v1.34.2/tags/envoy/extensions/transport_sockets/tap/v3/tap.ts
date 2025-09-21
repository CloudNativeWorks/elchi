import {OutType} from '@elchi/tags/tagsType';


export const SocketTapConfig: OutType = { "SocketTapConfig": [
  {
    "name": "set_connection_per_event",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Indicates to whether output the connection information per event This is only applicable if the streamed trace is enabled",
    "notImp": false
  }
] };

export const SocketTapConfig_SingleFields = [
  "set_connection_per_event"
];

export const Tap: OutType = { "Tap": [
  {
    "name": "common_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CommonExtensionConfig",
    "enums": null,
    "comment": "Common configuration for the tap transport socket.",
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
    "name": "socket_tap_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SocketTapConfig",
    "enums": null,
    "comment": "Additional configurations for the transport socket tap",
    "notImp": false
  }
] };