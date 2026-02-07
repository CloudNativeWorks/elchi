import {OutType} from '@elchi/tags/tagsType';


export const Config: OutType = { "Config": [
  {
    "name": "config_source",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ConfigSource",
    "enums": null,
    "comment": "Defines the configuration source of the secrets.",
    "notImp": false
  },
  {
    "name": "certificate_mapper",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "Extension point to specify a function to compute the secret name. The extension is called during the TLS handshake after receiving the \"CLIENT HELLO\" message from the client. extension-category: envoy.tls.certificate_mappers",
    "notImp": false
  },
  {
    "name": "prefetch_secret_names",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "A list of secret resource names to start fetching on configuration load (prior to receiving any requests). The parent resource initializes immediately without waiting for the fetch to complete.",
    "notImp": false
  }
] };

export const Config_SingleFields = [
  "prefetch_secret_names"
];