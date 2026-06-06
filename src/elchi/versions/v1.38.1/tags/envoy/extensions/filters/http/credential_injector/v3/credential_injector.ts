import {OutType} from '@elchi/tags/tagsType';


export const CredentialInjector: OutType = { "CredentialInjector": [
  {
    "name": "overwrite",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether to overwrite the value or not if the injected headers already exist. Value defaults to false.",
    "notImp": false
  },
  {
    "name": "allow_request_without_credential",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether to send the request to upstream if the credential is not present or if the credential injection to the request fails.\n\nBy default, a request will fail with ``401 Unauthorized`` if the credential is not present or the injection of the credential to the request fails. If set to true, the request will be sent to upstream without the credential.",
    "notImp": false
  },
  {
    "name": "credential",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "The credential to inject into the proxied requests extension-category: envoy.http.injected_credentials",
    "notImp": false
  }
] };

export const CredentialInjector_SingleFields = [
  "overwrite",
  "allow_request_without_credential"
];