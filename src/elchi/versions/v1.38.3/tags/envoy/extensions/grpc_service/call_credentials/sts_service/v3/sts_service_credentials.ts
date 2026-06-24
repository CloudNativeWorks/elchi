import {OutType} from '@elchi/tags/tagsType';


export const StsServiceCredentials: OutType = { "StsServiceCredentials": [
  {
    "name": "token_exchange_service_uri",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "URI of the token exchange service that handles token exchange requests.",
    "notImp": false
  },
  {
    "name": "resource",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Location of the target service or resource where the client intends to use the requested security token.",
    "notImp": false
  },
  {
    "name": "audience",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Logical name of the target service where the client intends to use the requested security token.",
    "notImp": false
  },
  {
    "name": "scope",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The desired scope of the requested security token in the context of the service or resource where the token will be used.",
    "notImp": false
  },
  {
    "name": "requested_token_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Type of the requested security token.",
    "notImp": false
  },
  {
    "name": "subject_token_path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The path of subject token, a security token that represents the identity of the party on behalf of whom the request is being made.",
    "notImp": false
  },
  {
    "name": "subject_token_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Type of the subject token.",
    "notImp": false
  },
  {
    "name": "actor_token_path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The path of actor token, a security token that represents the identity of the acting party. The acting party is authorized to use the requested security token and act on behalf of the subject.",
    "notImp": false
  },
  {
    "name": "actor_token_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Type of the actor token.",
    "notImp": false
  }
] };

export const StsServiceCredentials_SingleFields = [
  "token_exchange_service_uri",
  "resource",
  "audience",
  "scope",
  "requested_token_type",
  "subject_token_path",
  "subject_token_type",
  "actor_token_path",
  "actor_token_type"
];