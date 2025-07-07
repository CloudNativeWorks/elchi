import {OutType} from '@/elchi/tags/tagsType';


export const JwtProvider_NormalizePayload: OutType = { "JwtProvider_NormalizePayload": [
  {
    "name": "space_delimited_claims",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Each claim in this list will be interpreted as a space-delimited string and converted to a list of strings based on the delimited values. Example: a token with a claim ``scope: \"email profile\"`` is translated to dynamic metadata  ``scope: [\"email\", \"profile\"]`` if this field is set value ``[\"scope\"]``. This special handling of ``scope`` is recommended by `RFC8693 <https://datatracker.ietf.org/doc/html/rfc8693#name-scope-scopes-claim>`_.",
    "notImp": false
  }
] };

export const JwtProvider_NormalizePayload_SingleFields = [
  "space_delimited_claims"
];

export const JwtCacheConfig: OutType = { "JwtCacheConfig": [
  {
    "name": "jwt_cache_size",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The unit is number of JWT tokens, default to 100.",
    "notImp": false
  }
] };

export const JwtCacheConfig_SingleFields = [
  "jwt_cache_size"
];

export const JwtProvider: OutType = { "JwtProvider": [
  {
    "name": "issuer",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Specify the `principal <https://tools.ietf.org/html/rfc7519#section-4.1.1>`_ that issued the JWT, usually a URL or an email address.\n\nIt is optional. If specified, it has to match the ``iss`` field in JWT, otherwise the JWT ``iss`` field is not checked.\n\nNote: ``JwtRequirement`` `allow_missing` and `allow_missing_or_failed` are implemented differently than other ``JwtRequirements``. Hence the usage of this field is different as follows if ``allow_missing`` or ``allow_missing_or_failed`` is used:\n\n* If a JWT has ``iss`` field, it needs to be specified by this field in one of ``JwtProviders``. * If a JWT doesn't have ``iss`` field, one of ``JwtProviders`` should fill this field empty. * Multiple ``JwtProviders`` should not have same value in this field.\n\nExample: https://securetoken.google.com Example: 1234567-compute@developer.gserviceaccount.com",
    "notImp": false
  },
  {
    "name": "audiences",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "The list of JWT `audiences <https://tools.ietf.org/html/rfc7519#section-4.1.3>`_ are allowed to access. A JWT containing any of these audiences will be accepted. If not specified, will not check audiences in the token.\n\nExample:\n\n```yaml\n\n    audiences:\n    - bookstore_android.apps.googleusercontent.com\n    - bookstore_web.apps.googleusercontent.com",
    "notImp": false
  },
  {
    "name": "subjects",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "StringMatcher",
    "enums": null,
    "comment": "Restrict the `subjects <https://tools.ietf.org/html/rfc7519#section-4.1.2>`_ that the JwtProvider can assert. For instance, this could implement JWT-SVID `subject restrictions <https://github.com/spiffe/spiffe/blob/main/standards/JWT-SVID.md#31-subject>`_. If not specified, will not check subjects in the token.\n\nExample:\n\n```yaml\n\n    subjects:\n      prefix: spiffe://spiffe.example.com/",
    "notImp": false
  },
  {
    "name": "require_expiration",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Requires that the credential contains an `expiration <https://tools.ietf.org/html/rfc7519#section-4.1.4>`_. For instance, this could implement JWT-SVID `expiration restrictions <https://github.com/spiffe/spiffe/blob/main/standards/JWT-SVID.md#33-expiration-time>`_. Unlike ``max_lifetime``, this only requires that expiration is present, where ``max_lifetime`` also checks the value.\n\nExample:\n\n```yaml\n\n    require_expiration: true",
    "notImp": false
  },
  {
    "name": "max_lifetime",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Restrict the maximum remaining lifetime of a credential from the JwtProvider. Credential lifetime is the difference between the current time and the expiration of the credential. For instance, the following example will reject credentials that have a lifetime longer than 24 hours. If not set, expiration checking still occurs, but there is no limit on credential lifetime. If set, takes precedence over ``require_expiration``.\n\nExample:\n\n```yaml\n\n    max_lifetime:\n      seconds: 86400",
    "notImp": false
  },
  {
    "name": "jwks_source_specifier.remote_jwks",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RemoteJwks",
    "enums": null,
    "comment": "JWKS can be fetched from remote server via HTTP/HTTPS. This field specifies the remote HTTP URI and how the fetched JWKS should be cached.\n\nExample:\n\n```yaml\n\n   remote_jwks:\n     http_uri:\n       uri: https://www.googleapis.com/oauth2/v1/certs\n       cluster: jwt.www.googleapis.com|443\n       timeout: 1s\n     cache_duration:\n       seconds: 300",
    "notImp": false
  },
  {
    "name": "jwks_source_specifier.local_jwks",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "DataSource",
    "enums": null,
    "comment": "JWKS is in local data source. It could be either in a local file or embedded in the inline_string.\n\nExample: local file\n\n```yaml\n\n   local_jwks:\n     filename: /etc/envoy/jwks/jwks1.txt\n```\n\nExample: inline_string\n\n```yaml\n\n   local_jwks:\n     inline_string: ACADADADADA",
    "notImp": false
  },
  {
    "name": "forward",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If false, the JWT is removed in the request after a success verification. If true, the JWT is not removed in the request. Default value is false. caveat: only works for from_header/from_params & has no effect for JWTs extracted through from_cookies.",
    "notImp": false
  },
  {
    "name": "from_headers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "JwtHeader[]",
    "enums": null,
    "comment": "Two fields below define where to extract the JWT from an HTTP request.\n\nIf no explicit location is specified, the following default locations are tried in order:\n\n1. The Authorization header using the `Bearer schema <https://tools.ietf.org/html/rfc6750#section-2.1>`_. Example::\n\n   Authorization: Bearer <token>.\n\n2. `access_token <https://tools.ietf.org/html/rfc6750#section-2.3>`_ query parameter.\n\nMultiple JWTs can be verified for a request. Each JWT has to be extracted from the locations its provider specified or from the default locations.\n\nSpecify the HTTP headers to extract JWT token. For examples, following config:\n\n```yaml\n\n  from_headers:\n  - name: x-goog-iap-jwt-assertion\n```\n\ncan be used to extract token from header::\n\n  ``x-goog-iap-jwt-assertion: <JWT>``.",
    "notImp": false
  },
  {
    "name": "from_params",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "JWT is sent in a query parameter. ``jwt_params`` represents the query parameter names.\n\nFor example, if config is:\n\n```yaml\n\n  from_params:\n  - jwt_token\n```\n\nThe JWT format in query parameter is::\n\n   /path?jwt_token=<JWT>",
    "notImp": false
  },
  {
    "name": "from_cookies",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "JWT is sent in a cookie. ``from_cookies`` represents the cookie names to extract from.\n\nFor example, if config is:\n\n```yaml\n\n  from_cookies:\n  - auth-token\n```\n\nThen JWT will be extracted from ``auth-token`` cookie in the request.",
    "notImp": false
  },
  {
    "name": "forward_payload_header",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "This field specifies the header name to forward a successfully verified JWT payload to the backend. The forwarded data is::\n\n   base64url_encoded(jwt_payload_in_JSON)\n\nIf it is not specified, the payload will not be forwarded.",
    "notImp": false
  },
  {
    "name": "pad_forward_payload_header",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "When `forward_payload_header` is specified, the base64 encoded payload will be added to the headers. Normally JWT based64 encode doesn't add padding. If this field is true, the header will be padded.\n\nThis field is only relevant if `forward_payload_header` is specified.",
    "notImp": false
  },
  {
    "name": "payload_in_metadata",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "If non empty, successfully verified JWT payloads will be written to StreamInfo DynamicMetadata in the format as: ``namespace`` is the jwt_authn filter name as ````envoy.filters.http.jwt_authn```` The value is the ``protobuf::Struct``. The value of this field will be the key for its ``fields`` and the value is the ``protobuf::Struct`` converted from JWT JSON payload.\n\nFor example, if payload_in_metadata is ``my_payload``:\n\n```yaml\n\n  envoy.filters.http.jwt_authn:\n    my_payload:\n      iss: https://example.com\n      sub: test@example.com\n      aud: https://example.com\n      exp: 1501281058",
    "notImp": false
  },
  {
    "name": "normalize_payload_in_metadata",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "JwtProvider_NormalizePayload",
    "enums": null,
    "comment": "Normalizes the payload representation in the request metadata.",
    "notImp": false
  },
  {
    "name": "header_in_metadata",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "If not empty, similar to `payload_in_metadata`, a successfully verified JWT header will be written to `Dynamic State` as an entry (``protobuf::Struct``) in ``envoy.filters.http.jwt_authn`` ``namespace`` with the value of this field as the key.\n\nFor example, if ``header_in_metadata`` is ``my_header``:\n\n```yaml\n\n  envoy.filters.http.jwt_authn:\n    my_header:\n      alg: JWT\n      kid: EF71iSaosbC5C4tC6Syq1Gm647M\n      alg: PS256\n```\n\nWhen the metadata has ``envoy.filters.http.jwt_authn`` entry already (for example if `payload_in_metadata` is not empty), it will be inserted as a new entry in the same ``namespace`` as shown below:\n\n```yaml\n\n  envoy.filters.http.jwt_authn:\n    my_payload:\n      iss: https://example.com\n      sub: test@example.com\n      aud: https://example.com\n      exp: 1501281058\n    my_header:\n      alg: JWT\n      kid: EF71iSaosbC5C4tC6Syq1Gm647M\n      alg: PS256\n```\n\n:::warning\nUsing the same key name for `header_in_metadata` and `payload_in_metadata` is not suggested due to potential override of existing entry, while it is not enforced during config validation.",
    "notImp": false
  },
  {
    "name": "failed_status_in_metadata",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "If non empty, the failure status ``::google::jwt_verify::Status`` for a non verified JWT will be written to StreamInfo DynamicMetadata in the format as: ``namespace`` is the jwt_authn filter name as ``envoy.filters.http.jwt_authn`` The value is the ``protobuf::Struct``. The values of this field will be ``code`` and ``message`` and they will contain the JWT authentication failure status code and a message describing the failure.\n\nFor example, if failed_status_in_metadata is ``my_auth_failure_status``:\n\n```yaml\n\n  envoy.filters.http.jwt_authn:\n    my_auth_failure_status:\n      code: 3\n      message: Jwt expired",
    "notImp": false
  },
  {
    "name": "clock_skew_seconds",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Specify the clock skew in seconds when verifying JWT time constraint, such as ``exp``, and ``nbf``. If not specified, default is 60 seconds.",
    "notImp": false
  },
  {
    "name": "jwt_cache_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "JwtCacheConfig",
    "enums": null,
    "comment": "Enables JWT cache, its size is specified by ``jwt_cache_size``. Only valid JWT tokens are cached.",
    "notImp": false
  },
  {
    "name": "claim_to_headers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "JwtClaimToHeader[]",
    "enums": null,
    "comment": "Add JWT claim to HTTP Header Specify the claim name you want to copy in which HTTP header. For examples, following config: The claim must be of type; string, int, double, bool. Array type claims are not supported\n\n.. literalinclude:: /_configs/repo/jwt_authn.yaml :language: yaml :lines: 44-48 :linenos: :lineno-start: 44 :caption: :download:`jwt_authn.yaml </_configs/repo/jwt_authn.yaml>`\n\nThis header is only reserved for jwt claim; any other value will be overwritten.",
    "notImp": false
  },
  {
    "name": "clear_route_cache",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Clears route cache in order to allow JWT token to correctly affect routing decisions. Filter clears all cached routes when:\n\n1. The field is set to ``true``.\n\n2. At least one ``claim_to_headers`` header is added to the request OR if ``payload_in_metadata`` is set.",
    "notImp": false
  }
] };

export const JwtProvider_SingleFields = [
  "issuer",
  "audiences",
  "require_expiration",
  "max_lifetime",
  "forward",
  "from_params",
  "from_cookies",
  "forward_payload_header",
  "pad_forward_payload_header",
  "payload_in_metadata",
  "header_in_metadata",
  "failed_status_in_metadata",
  "clock_skew_seconds",
  "clear_route_cache"
];

export const JwksAsyncFetch: OutType = { "JwksAsyncFetch": [
  {
    "name": "fast_listener",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If false, the listener is activated after the initial fetch is completed. The initial fetch result can be either successful or failed. If true, it is activated without waiting for the initial fetch to complete. Default is false.",
    "notImp": false
  },
  {
    "name": "failed_refetch_duration",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The duration to refetch after a failed fetch. If not specified, default is 1 second.",
    "notImp": false
  }
] };

export const JwksAsyncFetch_SingleFields = [
  "fast_listener",
  "failed_refetch_duration"
];

export const RemoteJwks: OutType = { "RemoteJwks": [
  {
    "name": "http_uri",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HttpUri",
    "enums": null,
    "comment": "The HTTP URI to fetch the JWKS. For example:\n\n```yaml\n\n   http_uri:\n     uri: https://www.googleapis.com/oauth2/v1/certs\n     cluster: jwt.www.googleapis.com|443\n     timeout: 1s",
    "notImp": false
  },
  {
    "name": "cache_duration",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Duration after which the cached JWKS should be expired. If not specified, default cache duration is 10 minutes.",
    "notImp": false
  },
  {
    "name": "async_fetch",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "JwksAsyncFetch",
    "enums": null,
    "comment": "Fetch Jwks asynchronously in the main thread before the listener is activated. Fetched Jwks can be used by all worker threads.\n\nIf this feature is not enabled:\n\n* The Jwks is fetched on-demand when the requests come. During the fetching, first few requests are paused until the Jwks is fetched. * Each worker thread fetches its own Jwks since Jwks cache is per worker thread.\n\nIf this feature is enabled:\n\n* Fetched Jwks is done in the main thread before the listener is activated. Its fetched Jwks can be used by all worker threads. Each worker thread doesn't need to fetch its own. * Jwks is ready when the requests come, not need to wait for the Jwks fetching.",
    "notImp": false
  },
  {
    "name": "retry_policy",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RetryPolicy",
    "enums": null,
    "comment": "Retry policy for fetching Jwks. optional. turned off by default.\n\nFor example:\n\n```yaml\n\n  retry_policy:\n    retry_back_off:\n      base_interval: 0.01s\n      max_interval: 20s\n    num_retries: 10\n```\n\nwill yield a randomized truncated exponential backoff policy with an initial delay of 10ms 10 maximum attempts spaced at most 20s seconds.\n\n```yaml\n\n  retry_policy:\n    num_retries:1\n```\n\nuses the default `retry backoff strategy`. with the default base interval is 1000 milliseconds. and the default maximum interval of 10 times the base interval.\n\nif num_retries is omitted, the default is to allow only one retry.\n\nIf enabled, the retry policy will apply to all Jwks fetching approaches, e.g. on demand or asynchronously in background.",
    "notImp": false
  }
] };

export const RemoteJwks_SingleFields = [
  "cache_duration"
];

export const JwtHeader: OutType = { "JwtHeader": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The HTTP header name.",
    "notImp": false
  },
  {
    "name": "value_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The value prefix. The value format is \"value_prefix<token>\" For example, for \"Authorization: Bearer <token>\", value_prefix=\"Bearer \" with a space at the end.",
    "notImp": false
  }
] };

export const JwtHeader_SingleFields = [
  "name",
  "value_prefix"
];

export const ProviderWithAudiences: OutType = { "ProviderWithAudiences": [
  {
    "name": "provider_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Specify a required provider name.",
    "notImp": false
  },
  {
    "name": "audiences",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "This field overrides the one specified in the JwtProvider.",
    "notImp": false
  }
] };

export const ProviderWithAudiences_SingleFields = [
  "provider_name",
  "audiences"
];

export const JwtRequirement: OutType = { "JwtRequirement": [
  {
    "name": "requires_type.provider_name",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Specify a required provider name.",
    "notImp": false
  },
  {
    "name": "requires_type.provider_and_audiences",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "ProviderWithAudiences",
    "enums": null,
    "comment": "Specify a required provider with audiences.",
    "notImp": false
  },
  {
    "name": "requires_type.requires_any",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "JwtRequirementOrList",
    "enums": null,
    "comment": "Specify list of JwtRequirement. Their results are OR-ed. If any one of them passes, the result is passed.",
    "notImp": false
  },
  {
    "name": "requires_type.requires_all",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "JwtRequirementAndList",
    "enums": null,
    "comment": "Specify list of JwtRequirement. Their results are AND-ed. All of them must pass, if one of them fails or missing, it fails.",
    "notImp": false
  },
  {
    "name": "requires_type.allow_missing_or_failed",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Empty",
    "enums": null,
    "comment": "The requirement is always satisfied even if JWT is missing or the JWT verification fails. A typical usage is: this filter is used to only verify JWTs and pass the verified JWT payloads to another filter, the other filter will make decision. In this mode, all JWT tokens will be verified.",
    "notImp": false
  },
  {
    "name": "requires_type.allow_missing",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Empty",
    "enums": null,
    "comment": "The requirement is satisfied if JWT is missing, but failed if JWT is presented but invalid. Similar to allow_missing_or_failed, this is used to only verify JWTs and pass the verified payload to another filter. The different is this mode will reject requests with invalid tokens.",
    "notImp": false
  }
] };

export const JwtRequirement_SingleFields = [
  "requires_type.provider_name"
];

export const JwtRequirementOrList: OutType = { "JwtRequirementOrList": [
  {
    "name": "requirements",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "JwtRequirement[]",
    "enums": null,
    "comment": "Specify a list of JwtRequirement.",
    "notImp": false
  }
] };

export const JwtRequirementAndList: OutType = { "JwtRequirementAndList": [
  {
    "name": "requirements",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "JwtRequirement[]",
    "enums": null,
    "comment": "Specify a list of JwtRequirement.",
    "notImp": false
  }
] };

export const RequirementRule: OutType = { "RequirementRule": [
  {
    "name": "match",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RouteMatch",
    "enums": null,
    "comment": "The route matching parameter. Only when the match is satisfied, the \"requires\" field will apply.\n\nFor example: following match will match all requests.\n\n```yaml\n\n   match:\n     prefix: /",
    "notImp": false
  },
  {
    "name": "requirement_type.requires",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "JwtRequirement",
    "enums": null,
    "comment": "Specify a Jwt requirement. Please see detail comment in message JwtRequirement.",
    "notImp": false
  },
  {
    "name": "requirement_type.requirement_name",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Use requirement_name to specify a Jwt requirement. This requirement_name MUST be specified at the `requirement_map` in ``JwtAuthentication``.",
    "notImp": false
  }
] };

export const RequirementRule_SingleFields = [
  "requirement_type.requirement_name"
];

export const FilterStateRule: OutType = { "FilterStateRule": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The filter state name to retrieve the ``Router::StringAccessor`` object.",
    "notImp": false
  },
  {
    "name": "requires",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, JwtRequirement>",
    "enums": null,
    "comment": "A map of string keys to requirements. The string key is the string value in the FilterState with the name specified in the ``name`` field above.",
    "notImp": false
  }
] };

export const FilterStateRule_SingleFields = [
  "name"
];

export const FilterStateRule_RequiresEntry: OutType = { "FilterStateRule_RequiresEntry": [
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
    "fieldType": "JwtRequirement",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const FilterStateRule_RequiresEntry_SingleFields = [
  "key"
];

export const JwtAuthentication: OutType = { "JwtAuthentication": [
  {
    "name": "providers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, JwtProvider>",
    "enums": null,
    "comment": "Map of provider names to JwtProviders.\n\n```yaml\n\n  providers:\n    provider1:\n       issuer: issuer1\n       audiences:\n       - audience1\n       - audience2\n       remote_jwks:\n         http_uri:\n           uri: https://example.com/.well-known/jwks.json\n           cluster: example_jwks_cluster\n           timeout: 1s\n     provider2:\n       issuer: provider2\n       local_jwks:\n         inline_string: jwks_string",
    "notImp": false
  },
  {
    "name": "rules",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RequirementRule[]",
    "enums": null,
    "comment": "Specifies requirements based on the route matches. The first matched requirement will be applied. If there are overlapped match conditions, please put the most specific match first.\n\nExamples\n\n```yaml\n\n  rules:\n    - match:\n        prefix: /healthz\n    - match:\n        prefix: /baz\n      requires:\n        provider_name: provider1\n    - match:\n        prefix: /foo\n      requires:\n        requires_any:\n          requirements:\n            - provider_name: provider1\n            - provider_name: provider2\n    - match:\n        prefix: /bar\n      requires:\n        requires_all:\n          requirements:\n            - provider_name: provider1\n            - provider_name: provider2",
    "notImp": false
  },
  {
    "name": "filter_state_rules",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FilterStateRule",
    "enums": null,
    "comment": "This message specifies Jwt requirements based on stream_info.filterState. Other HTTP filters can use it to specify Jwt requirements dynamically. The ``rules`` field above is checked first, if it could not find any matches, check this one.",
    "notImp": false
  },
  {
    "name": "bypass_cors_preflight",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "When set to true, bypass the `CORS preflight request <http://www.w3.org/TR/cors/#cross-origin-request-with-preflight>`_ regardless of JWT requirements specified in the rules.",
    "notImp": false
  },
  {
    "name": "requirement_map",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, JwtRequirement>",
    "enums": null,
    "comment": "A map of unique requirement_names to JwtRequirements. `requirement_name` in ``PerRouteConfig`` uses this map to specify a JwtRequirement.",
    "notImp": false
  },
  {
    "name": "strip_failure_response",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "A request failing the verification process will receive a 401 downstream with the failure response details in the body along with WWWAuthenticate header value set with \"invalid token\". If this value is set to true, the response details will be stripped and only a 401 response code will be returned. Default value is false",
    "notImp": false
  }
] };

export const JwtAuthentication_SingleFields = [
  "bypass_cors_preflight",
  "strip_failure_response"
];

export const JwtAuthentication_ProvidersEntry: OutType = { "JwtAuthentication_ProvidersEntry": [
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
    "fieldType": "JwtProvider",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const JwtAuthentication_ProvidersEntry_SingleFields = [
  "key"
];

export const JwtAuthentication_RequirementMapEntry: OutType = { "JwtAuthentication_RequirementMapEntry": [
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
    "fieldType": "JwtRequirement",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const JwtAuthentication_RequirementMapEntry_SingleFields = [
  "key"
];

export const PerRouteConfig: OutType = { "PerRouteConfig": [
  {
    "name": "requirement_specifier.disabled",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Disable Jwt Authentication for this route.",
    "notImp": false
  },
  {
    "name": "requirement_specifier.requirement_name",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Use requirement_name to specify a JwtRequirement. This requirement_name MUST be specified at the `requirement_map` in ``JwtAuthentication``. If no, the requests using this route will be rejected with 403.",
    "notImp": false
  }
] };

export const PerRouteConfig_SingleFields = [
  "requirement_specifier.disabled",
  "requirement_specifier.requirement_name"
];

export const JwtClaimToHeader: OutType = { "JwtClaimToHeader": [
  {
    "name": "header_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The HTTP header name to copy the claim to. The header name will be sanitized and replaced.",
    "notImp": false
  },
  {
    "name": "claim_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The field name for the JWT Claim : it can be a nested claim of type (eg. \"claim.nested.key\", \"sub\") String separated with \".\" in case of nested claims. The nested claim name must use dot \".\" to separate the JSON name path.",
    "notImp": false
  }
] };

export const JwtClaimToHeader_SingleFields = [
  "header_name",
  "claim_name"
];