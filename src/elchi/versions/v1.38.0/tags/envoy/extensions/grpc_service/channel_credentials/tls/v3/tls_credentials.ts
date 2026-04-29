import {OutType} from '@elchi/tags/tagsType';


export const TlsCredentials: OutType = { "TlsCredentials": [
  {
    "name": "root_certificate_provider",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CommonTlsContext_CertificateProviderInstance",
    "enums": null,
    "comment": "The certificate provider instance for the root cert. Must be set.",
    "notImp": false
  },
  {
    "name": "identity_certificate_provider",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CommonTlsContext_CertificateProviderInstance",
    "enums": null,
    "comment": "The certificate provider instance for the identity cert. Optional; if unset, no identity certificate will be sent to the server.",
    "notImp": false
  }
] };