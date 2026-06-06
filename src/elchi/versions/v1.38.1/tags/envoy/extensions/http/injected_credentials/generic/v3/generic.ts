import {OutType} from '@elchi/tags/tagsType';


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
  },
  {
    "name": "header_value_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The prefix to prepend to the credential value before injecting it into the header. This is useful for adding a scheme such as ``Bearer `` or ``Basic `` to the credential. For example, if the credential is ``xyz123`` and the prefix is ``Bearer ``, the final header value will be ``Bearer xyz123``. If not set, the raw credential value will be injected without any prefix.",
    "notImp": false
  }
] };

export const Generic_SingleFields = [
  "header",
  "header_value_prefix"
];