import {OutType} from '@elchi/tags/tagsType';


export const StartTlsConfig: OutType = { "StartTlsConfig": [
  {
    "name": "cleartext_socket_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RawBuffer",
    "enums": null,
    "comment": "(optional) Configuration for clear-text socket used at the beginning of the session.",
    "notImp": false
  },
  {
    "name": "tls_socket_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DownstreamTlsContext",
    "enums": null,
    "comment": "Configuration for a downstream TLS socket.",
    "notImp": false
  }
] };

export const UpstreamStartTlsConfig: OutType = { "UpstreamStartTlsConfig": [
  {
    "name": "cleartext_socket_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RawBuffer",
    "enums": null,
    "comment": "(optional) Configuration for clear-text socket used at the beginning of the session.",
    "notImp": false
  },
  {
    "name": "tls_socket_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "UpstreamTlsContext",
    "enums": null,
    "comment": "Configuration for an upstream TLS socket.",
    "notImp": false
  }
] };