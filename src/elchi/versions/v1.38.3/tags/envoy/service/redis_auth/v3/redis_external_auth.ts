import {OutType} from '@elchi/tags/tagsType';


export const RedisProxyExternalAuthRequest: OutType = { "RedisProxyExternalAuthRequest": [
  {
    "name": "username",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Username, if applicable. Otherwise, empty.",
    "notImp": false
  },
  {
    "name": "password",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Password sent with the AUTH command.",
    "notImp": false
  }
] };

export const RedisProxyExternalAuthRequest_SingleFields = [
  "username",
  "password"
];

export const RedisProxyExternalAuthResponse: OutType = { "RedisProxyExternalAuthResponse": [
  {
    "name": "status",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Status",
    "enums": null,
    "comment": "Status of the authentication check.",
    "notImp": false
  },
  {
    "name": "expiration",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Date",
    "enums": null,
    "comment": "Optional expiration time for the authentication. If set, the authentication will be valid until this time. If not set, the authentication will be valid indefinitely.",
    "notImp": false
  },
  {
    "name": "message",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Optional message to be sent back to the client.",
    "notImp": false
  }
] };

export const RedisProxyExternalAuthResponse_SingleFields = [
  "message"
];