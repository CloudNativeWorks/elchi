import {OutType} from '@elchi/tags/tagsType';


export const Cookie: OutType = { "Cookie": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name that will be used to obtain cookie value from downstream HTTP request or generate new cookie for downstream.",
    "notImp": false
  },
  {
    "name": "ttl",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Duration of cookie. This will be used to set the expiry time of a new cookie when it is generated. Set this to 0s to use a session cookie and disable cookie expiration.",
    "notImp": false
  },
  {
    "name": "path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Path of cookie. This will be used to set the path of a new cookie when it is generated. If no path is specified here, no path will be set for the cookie.",
    "notImp": false
  }
] };

export const Cookie_SingleFields = [
  "name",
  "ttl",
  "path"
];