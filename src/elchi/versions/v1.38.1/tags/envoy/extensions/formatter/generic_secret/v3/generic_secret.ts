import {OutType} from '@elchi/tags/tagsType';


export const GenericSecret: OutType = { "GenericSecret": [
  {
    "name": "secret_configs",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, SdsSecretConfig>",
    "enums": null,
    "comment": "Map from formatter lookup name to SDS secret configuration. The map key is the name used in the ``%SECRET(name)%`` command operator.",
    "notImp": false
  }
] };

export const GenericSecret_SecretConfigsEntry: OutType = { "GenericSecret_SecretConfigsEntry": [
  {
    "name": "key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SdsSecretConfig",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const GenericSecret_SecretConfigsEntry_SingleFields = [
  "key"
];