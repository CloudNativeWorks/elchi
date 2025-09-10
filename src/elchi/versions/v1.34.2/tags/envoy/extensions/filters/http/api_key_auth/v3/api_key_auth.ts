import {OutType} from '@elchi/tags/tagsType';


export const ApiKeyAuth: OutType = { "ApiKeyAuth": [
  {
    "name": "credentials",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Credential[]",
    "enums": null,
    "comment": "The credentials that are used to authenticate the clients.",
    "notImp": false
  },
  {
    "name": "key_sources",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "KeySource[]",
    "enums": null,
    "comment": "The key sources to fetch the key from the coming request.",
    "notImp": false
  }
] };

export const ApiKeyAuthPerRoute: OutType = { "ApiKeyAuthPerRoute": [
  {
    "name": "credentials",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Credential[]",
    "enums": null,
    "comment": "The credentials that are used to authenticate the clients. If this field is non-empty, then the credentials in the filter level configuration will be ignored and the credentials in this configuration will be used.",
    "notImp": false
  },
  {
    "name": "key_sources",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "KeySource[]",
    "enums": null,
    "comment": "The key sources to fetch the key from the coming request. If this field is non-empty, then the key sources in the filter level configuration will be ignored and the key sources in this configuration will be used.",
    "notImp": false
  },
  {
    "name": "allowed_clients",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "A list of clients that are allowed to access the route or vhost. The clients listed here should be subset of the clients listed in the ``credentials`` to provide authorization control after the authentication is successful. If the list is empty, then all authenticated clients are allowed. This provides very limited but simple authorization. If more complex authorization is required, then use the `HTTP RBAC filter` instead.\n\n:::note\nSetting this field and ``credentials`` at the same configuration entry is not an error but also makes no much sense because they provide similar functionality. Please only use one of them at same configuration entry except for the case that you want to share the same credentials list across multiple routes but still use different allowed clients for each route.",
    "notImp": false
  }
] };

export const ApiKeyAuthPerRoute_SingleFields = [
  "allowed_clients"
];

export const Credential: OutType = { "Credential": [
  {
    "name": "key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The value of the unique API key.",
    "notImp": false
  },
  {
    "name": "client",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The unique id or identity that used to identify the client or consumer.",
    "notImp": false
  }
] };

export const Credential_SingleFields = [
  "key",
  "client"
];

export const KeySource: OutType = { "KeySource": [
  {
    "name": "header",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The header name to fetch the key. If multiple header values are present, the first one will be used. If the header value starts with 'Bearer ', this prefix will be stripped to get the key value.\n\nIf set, takes precedence over ``query`` and ``cookie``.",
    "notImp": false
  },
  {
    "name": "query",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The query parameter name to fetch the key. If multiple query values are present, the first one will be used.\n\nThe field will be used if ``header`` is not set. If set, takes precedence over ``cookie``.",
    "notImp": false
  },
  {
    "name": "cookie",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The cookie name to fetch the key.\n\nThe field will be used if the ``header`` and ``query`` are not set.",
    "notImp": false
  }
] };

export const KeySource_SingleFields = [
  "header",
  "query",
  "cookie"
];