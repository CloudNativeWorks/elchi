import {OutType} from '@/elchi/tags/tagsType';


export const SocketOption_SocketType: OutType = { "SocketOption_SocketType": [
  {
    "name": "stream",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SocketOption_SocketType_Stream",
    "enums": null,
    "comment": "Apply the socket option to the stream socket type.",
    "notImp": false
  },
  {
    "name": "datagram",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SocketOption_SocketType_Datagram",
    "enums": null,
    "comment": "Apply the socket option to the datagram socket type.",
    "notImp": false
  }
] };

export const SocketOption: OutType = { "SocketOption": [
  {
    "name": "description",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "An optional name to give this socket option for debugging, etc. Uniqueness is not required and no special meaning is assumed.",
    "notImp": false
  },
  {
    "name": "level",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Corresponding to the level value passed to setsockopt, such as IPPROTO_TCP",
    "notImp": false
  },
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The numeric name as passed to setsockopt",
    "notImp": false
  },
  {
    "name": "value.int_value",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Because many sockopts take an int value.",
    "notImp": false
  },
  {
    "name": "value.buf_value",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Uint8Array<ArrayBufferLike>",
    "enums": null,
    "comment": "Otherwise it's a byte buffer.",
    "notImp": false
  },
  {
    "name": "state",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SocketOption_SocketState",
    "enums": [
      "STATE_PREBIND",
      "STATE_BOUND",
      "STATE_LISTENING"
    ],
    "comment": "The state in which the option will be applied. When used in BindConfig STATE_PREBIND is currently the only valid value.",
    "notImp": false
  },
  {
    "name": "type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SocketOption_SocketType",
    "enums": null,
    "comment": "Apply the socket option to the specified `socket type <https://linux.die.net/man/2/socket>`_. If not specified, the socket option will be applied to all socket types.",
    "notImp": false
  }
] };

export const SocketOption_SingleFields = [
  "description",
  "level",
  "name",
  "value.int_value",
  "state"
];

export const SocketOptionsOverride: OutType = { "SocketOptionsOverride": [
  {
    "name": "socket_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SocketOption[]",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };