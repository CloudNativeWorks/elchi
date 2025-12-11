import {OutType} from '@elchi/tags/tagsType';


export const CookieConfig: OutType = { "CookieConfig": [
  {
    "name": "same_site",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CookieConfig_SameSite",
    "enums": [
      "DISABLED",
      "STRICT",
      "LAX",
      "NONE"
    ],
    "comment": "The value used for the SameSite cookie attribute.",
    "notImp": false
  }
] };

export const CookieConfig_SingleFields = [
  "same_site"
];

export const CookieConfigs: OutType = { "CookieConfigs": [
  {
    "name": "bearer_token_cookie_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CookieConfig",
    "enums": null,
    "comment": "Configuration for the bearer token cookie.",
    "notImp": false
  },
  {
    "name": "oauth_hmac_cookie_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CookieConfig",
    "enums": null,
    "comment": "Configuration for the OAuth HMAC cookie.",
    "notImp": false
  },
  {
    "name": "oauth_expires_cookie_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CookieConfig",
    "enums": null,
    "comment": "Configuration for the OAuth expires cookie.",
    "notImp": false
  },
  {
    "name": "id_token_cookie_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CookieConfig",
    "enums": null,
    "comment": "Configuration for the ID token cookie.",
    "notImp": false
  },
  {
    "name": "refresh_token_cookie_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CookieConfig",
    "enums": null,
    "comment": "Configuration for the refresh token cookie.",
    "notImp": false
  },
  {
    "name": "oauth_nonce_cookie_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CookieConfig",
    "enums": null,
    "comment": "Configuration for the OAuth nonce cookie.",
    "notImp": false
  },
  {
    "name": "code_verifier_cookie_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CookieConfig",
    "enums": null,
    "comment": "Configuration for the code verifier cookie.",
    "notImp": false
  }
] };

export const OAuth2Credentials_CookieNames: OutType = { "OAuth2Credentials_CookieNames": [
  {
    "name": "bearer_token",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Cookie name to hold OAuth bearer token value. When the authentication server validates the client and returns an authorization token back to the OAuth filter, no matter what format that token is, if `forward_bearer_token` is set to true the filter will send over the bearer token as a cookie with this name to the upstream. Defaults to ``BearerToken``.",
    "notImp": false
  },
  {
    "name": "oauth_hmac",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Cookie name to hold OAuth HMAC value. Defaults to ``OauthHMAC``.",
    "notImp": false
  },
  {
    "name": "oauth_expires",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Cookie name to hold OAuth expiry value. Defaults to ``OauthExpires``.",
    "notImp": false
  },
  {
    "name": "id_token",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Cookie name to hold the id token. Defaults to ``IdToken``.",
    "notImp": false
  },
  {
    "name": "refresh_token",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Cookie name to hold the refresh token. Defaults to ``RefreshToken``.",
    "notImp": false
  },
  {
    "name": "oauth_nonce",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Cookie name to hold the nonce value. Defaults to ``OauthNonce``.",
    "notImp": false
  },
  {
    "name": "code_verifier",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Cookie name to hold the PKCE code verifier. Defaults to ``OauthCodeVerifier``.",
    "notImp": false
  }
] };

export const OAuth2Credentials_CookieNames_SingleFields = [
  "bearer_token",
  "oauth_hmac",
  "oauth_expires",
  "id_token",
  "refresh_token",
  "oauth_nonce",
  "code_verifier"
];

export const OAuth2Credentials: OutType = { "OAuth2Credentials": [
  {
    "name": "client_id",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The client_id to be used in the authorize calls. This value will be URL encoded when sent to the OAuth server.",
    "notImp": false
  },
  {
    "name": "token_secret",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SdsSecretConfig",
    "enums": null,
    "comment": "The secret used to retrieve the access token. This value will be URL encoded when sent to the OAuth server.",
    "notImp": false
  },
  {
    "name": "token_formation.hmac_secret",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "SdsSecretConfig",
    "enums": null,
    "comment": "If present, the secret token will be a HMAC using the provided secret.",
    "notImp": false
  },
  {
    "name": "cookie_names",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "OAuth2Credentials_CookieNames",
    "enums": null,
    "comment": "The cookie names used in OAuth filters flow.",
    "notImp": false
  },
  {
    "name": "cookie_domain",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The domain to set the cookie on. If not set, the cookie will default to the host of the request, not including the subdomains. This is useful when token cookies need to be shared across multiple subdomains.",
    "notImp": false
  }
] };

export const OAuth2Credentials_SingleFields = [
  "client_id",
  "cookie_domain"
];

export const OAuth2Config: OutType = { "OAuth2Config": [
  {
    "name": "token_endpoint",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HttpUri",
    "enums": null,
    "comment": "Endpoint on the authorization server to retrieve the access token from.",
    "notImp": false
  },
  {
    "name": "retry_policy",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RetryPolicy",
    "enums": null,
    "comment": "Specifies the retry policy for requests to the OAuth server. If not specified, then no retries will be performed.",
    "notImp": false
  },
  {
    "name": "authorization_endpoint",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The endpoint redirect to for authorization in response to unauthorized requests.",
    "notImp": false
  },
  {
    "name": "end_session_endpoint",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The endpoint at the authorization server to request the user be logged out of the Authorization server. This field is optional and should be set only if openid is in the auth_scopes and the authorization server supports the OpenID Connect RP-Initiated Logout specification. For more information, see https://openid.net/specs/openid-connect-rpinitiated-1_0.html\n\nIf configured, the OAuth2 filter will redirect users to this endpoint when they access the signout_path.",
    "notImp": false
  },
  {
    "name": "credentials",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "OAuth2Credentials",
    "enums": null,
    "comment": "Credentials used for OAuth.",
    "notImp": false
  },
  {
    "name": "redirect_uri",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The redirect URI passed to the authorization endpoint. Supports header formatting tokens. For more information, including details on header value syntax, see the documentation on `custom request headers`.\n\nThis URI should not contain any query parameters.",
    "notImp": false
  },
  {
    "name": "redirect_path_matcher",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "PathMatcher",
    "enums": null,
    "comment": "Matching criteria used to determine whether a path appears to be the result of a redirect from the authorization server.",
    "notImp": false
  },
  {
    "name": "signout_path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "PathMatcher",
    "enums": null,
    "comment": "The path to sign a user out, clearing their credential cookies.",
    "notImp": false
  },
  {
    "name": "forward_bearer_token",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Forward the OAuth token as a Bearer to upstream web service.",
    "notImp": false
  },
  {
    "name": "preserve_authorization_header",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set to true, preserve the existing authorization header. By default the client strips the existing authorization header before forwarding upstream. Can not be set to true if forward_bearer_token is already set to true. Default value is false.",
    "notImp": false
  },
  {
    "name": "pass_through_matcher",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderMatcher[]",
    "enums": null,
    "comment": "Any request that matches any of the provided matchers will be passed through without OAuth validation.",
    "notImp": false
  },
  {
    "name": "auth_scopes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Optional list of OAuth scopes to be claimed in the authorization request. If not specified, defaults to \"user\" scope. OAuth RFC https://tools.ietf.org/html/rfc6749#section-3.3",
    "notImp": false
  },
  {
    "name": "resources",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Optional resource parameter for authorization request RFC: https://tools.ietf.org/html/rfc8707",
    "notImp": false
  },
  {
    "name": "auth_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "OAuth2Config_AuthType",
    "enums": [
      "URL_ENCODED_BODY",
      "BASIC_AUTH"
    ],
    "comment": "Defines how ``client_id`` and ``client_secret`` are sent in OAuth client to OAuth server requests. RFC https://datatracker.ietf.org/doc/html/rfc6749#section-2.3.1",
    "notImp": false
  },
  {
    "name": "use_refresh_token",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set to true, allows automatic access token refresh using the associated refresh token (see `RFC 6749 section 6 <https://datatracker.ietf.org/doc/html/rfc6749#section-6>`_), provided that the OAuth server supports that. Default value is true.",
    "notImp": false
  },
  {
    "name": "default_expires_in",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The default lifetime in seconds of the access token, if omitted by the authorization server.\n\nIf this value is not set, it will default to ``0s``. In this case, the expiry must be set by the authorization server or the OAuth flow will fail.",
    "notImp": false
  },
  {
    "name": "deny_redirect_matcher",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderMatcher[]",
    "enums": null,
    "comment": "Any request that matches any of the provided matchers won't be redirected to OAuth server when tokens are not valid. Automatic access token refresh will be performed for these requests, if enabled. This behavior can be useful for AJAX requests.",
    "notImp": false
  },
  {
    "name": "default_refresh_token_expires_in",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The default lifetime in seconds of the refresh token, if the exp (expiration time) claim is omitted in the refresh token or the refresh token is not JWT.\n\nIf this value is not set, it will default to ``604800s``. In this case, the cookie with the refresh token will be expired in a week. This setting is only considered if ``use_refresh_token`` is set to true, otherwise the authorization server expiration or ``default_expires_in`` is used.",
    "notImp": false
  },
  {
    "name": "disable_id_token_set_cookie",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set to true, the client will not set a cookie for ID Token even if one is received from the Identity Provider. This may be useful in cases where the ID Token is too large for HTTP cookies (longer than 4096 characters). Enabling this option will only disable setting the cookie response header, the filter will still process incoming ID Tokens as part of the HMAC if they are there. This is to ensure compatibility while switching this setting on. Future sessions would not set the IdToken cookie header.",
    "notImp": false
  },
  {
    "name": "disable_access_token_set_cookie",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set to true, the client will not set a cookie for Access Token even if one is received from the Identity Provider. Enabling this option will only disable setting the cookie response header, the filter will still process incoming Access Tokens as part of the HMAC if they are there. This is to ensure compatibility while switching this setting on. Future sessions would not set the Access Token cookie header.",
    "notImp": false
  },
  {
    "name": "disable_refresh_token_set_cookie",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set to true, the client will not set a cookie for Refresh Token even if one is received from the Identity Provider. Enabling this option will only disable setting the cookie response header, the filter will still process incoming Refresh Tokens as part of the HMAC if they are there. This is to ensure compatibility while switching this setting on. Future sessions would not set the Refresh Token cookie header.",
    "notImp": false
  },
  {
    "name": "cookie_configs",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CookieConfigs",
    "enums": null,
    "comment": "Controls for attributes that can be set on the cookies.",
    "notImp": false
  },
  {
    "name": "stat_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Optional additional prefix to use when emitting statistics.",
    "notImp": false
  },
  {
    "name": "csrf_token_expires_in",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Optional expiration time for the CSRF protection token cookie. The CSRF token prevents cross-site request forgery attacks during the OAuth2 flow. If not specified, defaults to ``600s`` (10 minutes), which should provide sufficient time for users to complete the OAuth2 authorization flow.",
    "notImp": false
  },
  {
    "name": "code_verifier_token_expires_in",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Optional expiration time for the code verifier cookie. The code verifier is stored in a secure, HTTP-only cookie during the OAuth2 authorization process. If not specified, defaults to ``600s`` (10 minutes), which should provide sufficient time for users to complete the OAuth2 authorization flow.",
    "notImp": false
  },
  {
    "name": "disable_token_encryption",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Disable token encryption. When set to true, both the access token and the ID token will be stored in plain text. This option should only be used in secure environments where token encryption is not required. Default is false (tokens are encrypted).",
    "notImp": false
  }
] };

export const OAuth2Config_SingleFields = [
  "authorization_endpoint",
  "end_session_endpoint",
  "redirect_uri",
  "forward_bearer_token",
  "preserve_authorization_header",
  "auth_scopes",
  "resources",
  "auth_type",
  "use_refresh_token",
  "default_expires_in",
  "default_refresh_token_expires_in",
  "disable_id_token_set_cookie",
  "disable_access_token_set_cookie",
  "disable_refresh_token_set_cookie",
  "stat_prefix",
  "csrf_token_expires_in",
  "code_verifier_token_expires_in",
  "disable_token_encryption"
];

export const OAuth2: OutType = { "OAuth2": [
  {
    "name": "config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "OAuth2Config",
    "enums": null,
    "comment": "Leave this empty to disable OAuth2 for a specific route, using per filter config.",
    "notImp": false
  }
] };