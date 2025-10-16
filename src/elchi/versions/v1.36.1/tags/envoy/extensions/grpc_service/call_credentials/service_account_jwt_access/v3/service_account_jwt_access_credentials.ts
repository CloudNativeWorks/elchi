import {OutType} from '@elchi/tags/tagsType';


export const ServiceAccountJwtAccessCredentials: OutType = { "ServiceAccountJwtAccessCredentials": [
  {
    "name": "json_key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "JSON key.",
    "notImp": false
  },
  {
    "name": "token_lifetime",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Token lifetime.",
    "notImp": false
  }
] };

export const ServiceAccountJwtAccessCredentials_SingleFields = [
  "json_key",
  "token_lifetime"
];