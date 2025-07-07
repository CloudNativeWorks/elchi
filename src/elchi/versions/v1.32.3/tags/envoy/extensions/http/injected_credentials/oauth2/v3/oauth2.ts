import {OutType} from '@/elchi/tags/tagsType';


export const OAuth2: OutType = { "OAuth2": [
  {
    "name": "token_endpoint",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HttpUri",
    "enums": null,
    "comment": "Endpoint on the authorization server to retrieve the access token from. Refer to [RFC 6749: The OAuth 2.0 Authorization Framework](https://www.rfc-editor.org/rfc/rfc6749#section-3.2) for details.",
    "notImp": false
  },
  {
    "name": "scopes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Optional list of OAuth scopes to be claimed in the authorization request. Refer to [RFC 6749: The OAuth 2.0 Authorization Framework](https://www.rfc-editor.org/rfc/rfc6749#section-4.4.2) for details.",
    "notImp": false
  },
  {
    "name": "flow_type.client_credentials",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "OAuth2_ClientCredentials",
    "enums": null,
    "comment": "Client Credentials Grant. Refer to [RFC 6749: The OAuth 2.0 Authorization Framework](https://www.rfc-editor.org/rfc/rfc6749#section-4.4) for details.",
    "notImp": false
  },
  {
    "name": "token_fetch_retry_interval",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The interval between two successive retries to fetch token from Identity Provider. Default is 2 secs. The interval must be at least 1 second.",
    "notImp": false
  }
] };

export const OAuth2_SingleFields = [
  "scopes",
  "token_fetch_retry_interval"
];

export const OAuth2_ClientCredentials: OutType = { "OAuth2_ClientCredentials": [
  {
    "name": "client_id",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Client ID. Refer to [RFC 6749: The OAuth 2.0 Authorization Framework](https://www.rfc-editor.org/rfc/rfc6749#section-2.3.1) for details.",
    "notImp": false
  },
  {
    "name": "client_secret",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SdsSecretConfig",
    "enums": null,
    "comment": "Client secret. Refer to [RFC 6749: The OAuth 2.0 Authorization Framework](https://www.rfc-editor.org/rfc/rfc6749#section-2.3.1) for details.",
    "notImp": false
  },
  {
    "name": "auth_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "OAuth2_AuthType",
    "enums": [
      "BASIC_AUTH",
      "URL_ENCODED_BODY"
    ],
    "comment": "The method to use when sending credentials to the authorization server. Refer to [RFC 6749: The OAuth 2.0 Authorization Framework](https://www.rfc-editor.org/rfc/rfc6749#section-2.3.1) for details.",
    "notImp": false
  }
] };

export const OAuth2_ClientCredentials_SingleFields = [
  "client_id",
  "auth_type"
];