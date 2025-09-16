import {OutType} from '@elchi/tags/tagsType';


export const GenericSecret: OutType = { "GenericSecret": [
  {
    "name": "secret",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DataSource",
    "enums": null,
    "comment": "Secret of generic type and is available to filters. It is expected that only only one of secret and secrets is set.",
    "notImp": false
  },
  {
    "name": "secrets",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, DataSource>",
    "enums": null,
    "comment": "For cases where multiple associated secrets need to be distributed together. It is expected that only only one of secret and secrets is set.",
    "notImp": false
  }
] };

export const GenericSecret_SecretsEntry: OutType = { "GenericSecret_SecretsEntry": [
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
    "fieldType": "DataSource",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const GenericSecret_SecretsEntry_SingleFields = [
  "key"
];

export const SdsSecretConfig: OutType = { "SdsSecretConfig": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Name by which the secret can be uniquely referred to. When both name and config are specified, then secret can be fetched and/or reloaded via SDS. When only name is specified, then secret will be loaded from static resources.",
    "notImp": false
  },
  {
    "name": "sds_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ConfigSource",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const SdsSecretConfig_SingleFields = [
  "name"
];

export const Secret: OutType = { "Secret": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Name (FQDN, UUID, SPKI, SHA256, etc.) by which the secret can be uniquely referred to.",
    "notImp": false
  },
  {
    "name": "type.tls_certificate",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "TlsCertificate",
    "enums": null,
    "comment": "[#next-free-field: 6]",
    "notImp": false
  },
  {
    "name": "type.session_ticket_keys",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "TlsSessionTicketKeys",
    "enums": null,
    "comment": "[#next-free-field: 6]",
    "notImp": false
  },
  {
    "name": "type.validation_context",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "CertificateValidationContext",
    "enums": null,
    "comment": "[#next-free-field: 6]",
    "notImp": false
  },
  {
    "name": "type.generic_secret",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "GenericSecret",
    "enums": null,
    "comment": "[#next-free-field: 6]",
    "notImp": false
  }
] };

export const Secret_SingleFields = [
  "name"
];