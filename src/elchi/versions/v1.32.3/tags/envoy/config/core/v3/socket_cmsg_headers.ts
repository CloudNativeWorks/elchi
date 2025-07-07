import {OutType} from '@/elchi/tags/tagsType';


export const SocketCmsgHeaders: OutType = { "SocketCmsgHeaders": [
  {
    "name": "level",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "cmsg level. Default is unset.",
    "notImp": false
  },
  {
    "name": "type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "cmsg type. Default is unset.",
    "notImp": false
  },
  {
    "name": "expected_size",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Expected size of cmsg value. Default is zero.",
    "notImp": false
  }
] };

export const SocketCmsgHeaders_SingleFields = [
  "level",
  "type",
  "expected_size"
];