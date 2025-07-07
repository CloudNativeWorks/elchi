import {OutType} from '@/elchi/tags/tagsType';


export const Generic: OutType = { "Generic": [
  {
    "name": "credential",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SdsSecretConfig",
    "enums": null,
    "comment": "The SDS configuration for the credential that will be injected to the specified HTTP request header. It must be a generic secret.",
    "notImp": false
  },
  {
    "name": "header",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The header that will be injected to the HTTP request with the provided credential. If not set, filter will default to: ``Authorization``",
    "notImp": false
  }
] };

export const Generic_SingleFields = [
  "header"
];