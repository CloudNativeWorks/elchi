import {OutType} from '@/elchi/tags/tagsType';


export const TokenCacheConfig: OutType = { "TokenCacheConfig": [
  {
    "name": "cache_size",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The number of cache entries. The maximum number of entries is INT64_MAX as it is constrained by underlying cache implementation. Default value 0 (i.e., proto3 defaults) disables the cache by default. Other default values will enable the cache.",
    "notImp": false
  }
] };

export const TokenCacheConfig_SingleFields = [
  "cache_size"
];

export const TokenHeader: OutType = { "TokenHeader": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The HTTP header's name.",
    "notImp": false
  },
  {
    "name": "value_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The header's prefix. The format is \"value_prefix<token>\" For example, for \"Authorization: Bearer <token>\", value_prefix=\"Bearer \" with a space at the end.",
    "notImp": false
  }
] };

export const TokenHeader_SingleFields = [
  "name",
  "value_prefix"
];

export const GcpAuthnFilterConfig: OutType = { "GcpAuthnFilterConfig": [
  {
    "name": "http_uri",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "HttpUri",
    "enums": null,
    "comment": "The HTTP URI to fetch tokens from GCE Metadata Server(https://cloud.google.com/compute/docs/metadata/overview). The URL format is \"http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity?audience=[AUDIENCE]\"\n\nThis field is deprecated because it does not match the API surface provided by the google auth libraries. Control planes should not attempt to override the metadata server URI. The cluster and timeout can be configured using the ``cluster`` and ``timeout`` fields instead. For backward compatibility, the cluster and timeout configured in this field will be used if the new ``cluster`` and ``timeout`` fields are not set.",
    "notImp": false
  },
  {
    "name": "retry_policy",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RetryPolicy",
    "enums": null,
    "comment": "Retry policy for fetching tokens. Not supported by all data planes.",
    "notImp": false
  },
  {
    "name": "cache_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TokenCacheConfig",
    "enums": null,
    "comment": "Token cache configuration. This field is optional.",
    "notImp": false
  },
  {
    "name": "token_header",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TokenHeader",
    "enums": null,
    "comment": "Request header location to extract the token. By default (i.e. if this field is not specified), the token is extracted to the Authorization HTTP header, in the format \"Authorization: Bearer <token>\". Not supported by all data planes.",
    "notImp": false
  },
  {
    "name": "cluster",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Cluster to send traffic to the GCE metadata server. Not supported by all data planes; a data plane may instead have its own mechanism for contacting the metadata server.",
    "notImp": false
  },
  {
    "name": "timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Timeout for fetching the tokens from the GCE metadata server. Not supported by all data planes.",
    "notImp": false
  }
] };

export const GcpAuthnFilterConfig_SingleFields = [
  "cluster",
  "timeout"
];

export const Audience: OutType = { "Audience": [
  {
    "name": "url",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const Audience_SingleFields = [
  "url"
];