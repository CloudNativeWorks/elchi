import {OutType} from '@elchi/tags/tagsType';


export const Buffer: OutType = { "Buffer": [
  {
    "name": "max_request_bytes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The maximum request size that the filter will buffer before the connection manager will stop buffering and return a 413 response.",
    "notImp": false
  }
] };

export const Buffer_SingleFields = [
  "max_request_bytes"
];

export const BufferPerRoute: OutType = { "BufferPerRoute": [
  {
    "name": "override.disabled",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "override.buffer",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Buffer",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const BufferPerRoute_SingleFields = [
  "override.disabled"
];