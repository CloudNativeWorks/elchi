import {OutType} from '@/elchi/tags/tagsType';


export const CorsPolicy: OutType = { "CorsPolicy": [
  {
    "name": "allow_origin_string_match",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "StringMatcher[]",
    "enums": null,
    "comment": "Specifies string patterns that match allowed origins. An origin is allowed if any of the string matchers match.",
    "notImp": false
  },
  {
    "name": "allow_methods",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Specifies the content for the ``access-control-allow-methods`` header.",
    "notImp": false
  },
  {
    "name": "allow_headers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Specifies the content for the ``access-control-allow-headers`` header.",
    "notImp": false
  },
  {
    "name": "expose_headers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Specifies the content for the ``access-control-expose-headers`` header.",
    "notImp": false
  },
  {
    "name": "max_age",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Specifies the content for the ``access-control-max-age`` header.",
    "notImp": false
  },
  {
    "name": "allow_credentials",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Specifies whether the resource allows credentials.",
    "notImp": false
  },
  {
    "name": "filter_enabled",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RuntimeFractionalPercent",
    "enums": null,
    "comment": "Specifies the % of requests for which the CORS filter is enabled.\n\nIf neither ``filter_enabled``, nor ``shadow_enabled`` are specified, the CORS filter will be enabled for 100% of the requests.\n\nIf `runtime_key` is specified, Envoy will lookup the runtime key to get the percentage of requests to filter.",
    "notImp": false
  },
  {
    "name": "shadow_enabled",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RuntimeFractionalPercent",
    "enums": null,
    "comment": "Specifies the % of requests for which the CORS policies will be evaluated and tracked, but not enforced.\n\nThis field is intended to be used when ``filter_enabled`` is off. That field have to explicitly disable the filter in order for this setting to take effect.\n\nIf `runtime_key` is specified, Envoy will lookup the runtime key to get the percentage of requests for which it will evaluate and track the request's ``Origin`` to determine if it's valid but will not enforce any policies.",
    "notImp": false
  },
  {
    "name": "allow_private_network_access",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Specify whether allow requests whose target server's IP address is more private than that from which the request initiator was fetched.\n\nMore details refer to https://developer.chrome.com/blog/private-network-access-preflight.",
    "notImp": false
  },
  {
    "name": "forward_not_matching_preflights",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Specifies if preflight requests not matching the configured allowed origin should be forwarded to the upstream. Default is true.",
    "notImp": false
  }
] };

export const CorsPolicy_SingleFields = [
  "allow_methods",
  "allow_headers",
  "expose_headers",
  "max_age",
  "allow_credentials",
  "allow_private_network_access",
  "forward_not_matching_preflights"
];