import {OutType} from '@elchi/tags/tagsType';


export const Body: OutType = { "Body": [
  {
    "name": "body_type.as_bytes",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Uint8Array<ArrayBufferLike>",
    "enums": null,
    "comment": "Body data as bytes. By default, tap body data will be present in this field, as the proto ``bytes`` type can contain any valid byte.",
    "notImp": false
  },
  {
    "name": "body_type.as_string",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Body data as string. This field is only used when the `JSON_BODY_AS_STRING` sink format type is selected. See the documentation for that option for why this is useful.",
    "notImp": false
  },
  {
    "name": "truncated",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Specifies whether body data has been truncated to fit within the specified `max_buffered_rx_bytes` and `max_buffered_tx_bytes` settings.",
    "notImp": false
  }
] };

export const Body_SingleFields = [
  "body_type.as_string",
  "truncated"
];

export const Connection: OutType = { "Connection": [
  {
    "name": "local_address",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Address",
    "enums": null,
    "comment": "Local address.",
    "notImp": false
  },
  {
    "name": "remote_address",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Address",
    "enums": null,
    "comment": "Remote address.",
    "notImp": false
  }
] };