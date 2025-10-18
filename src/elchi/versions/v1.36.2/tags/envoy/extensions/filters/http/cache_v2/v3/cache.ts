import {OutType} from '@elchi/tags/tagsType';


export const CacheV2Config_KeyCreatorParams: OutType = { "CacheV2Config_KeyCreatorParams": [
  {
    "name": "exclude_scheme",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, exclude the URL scheme from the cache key. Set to true if your origins always produce the same response for http and https requests.",
    "notImp": false
  },
  {
    "name": "exclude_host",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, exclude the host from the cache key. Set to true if your origins' responses don't ever depend on host.",
    "notImp": false
  },
  {
    "name": "query_parameters_included",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "QueryParameterMatcher[]",
    "enums": null,
    "comment": "If ``query_parameters_included`` is nonempty, only query parameters matched by one or more of its matchers are included in the cache key. Any other query params will not affect cache lookup.",
    "notImp": false
  },
  {
    "name": "query_parameters_excluded",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "QueryParameterMatcher[]",
    "enums": null,
    "comment": "If ``query_parameters_excluded`` is nonempty, query parameters matched by one or more of its matchers are excluded from the cache key (even if also matched by ``query_parameters_included``), and will not affect cache lookup.",
    "notImp": false
  }
] };

export const CacheV2Config_KeyCreatorParams_SingleFields = [
  "exclude_scheme",
  "exclude_host"
];

export const CacheV2Config: OutType = { "CacheV2Config": [
  {
    "name": "typed_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "Config specific to the cache storage implementation. Required unless ``disabled`` is true. extension-category: envoy.http.cache_v2",
    "notImp": false
  },
  {
    "name": "disabled",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "When true, the cache filter is a no-op filter.\n\nPossible use-cases for this include: - Turning a filter on and off with `ECDS`.",
    "notImp": false
  },
  {
    "name": "allowed_vary_headers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "StringMatcher[]",
    "enums": null,
    "comment": "[#not-implemented-hide:] List of matching rules that defines allowed ``Vary`` headers.\n\nThe ``vary`` response header holds a list of header names that affect the contents of a response, as described by https://httpwg.org/specs/rfc7234.html#caching.negotiated.responses.\n\nDuring insertion, ``allowed_vary_headers`` acts as a allowlist: if a response's ``vary`` header mentions any header names that aren't matched by any rules in ``allowed_vary_headers``, that response will not be cached.\n\nDuring lookup, ``allowed_vary_headers`` controls what request headers will be sent to the cache storage implementation.",
    "notImp": true
  },
  {
    "name": "key_creator_params",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CacheV2Config_KeyCreatorParams",
    "enums": null,
    "comment": "[#not-implemented-hide:] <TODO(toddmgreer) implement key customization>\n\nModifies cache key creation by restricting which parts of the URL are included.",
    "notImp": true
  },
  {
    "name": "max_body_bytes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "[#not-implemented-hide:] <TODO(toddmgreer) implement size limit>\n\nMax body size the cache filter will insert into a cache. 0 means unlimited (though the cache storage implementation may have its own limit beyond which it will reject insertions).",
    "notImp": true
  },
  {
    "name": "ignore_request_cache_control_header",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "By default, a ``cache-control: no-cache`` or ``pragma: no-cache`` header in the request causes the cache to validate with its upstream even if the lookup is a hit. Setting this to true will ignore these headers.",
    "notImp": false
  },
  {
    "name": "override_upstream_cluster",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "If this is set, requests sent upstream to populate the cache will go to the specified cluster rather than the cluster selected by the vhost and route.\n\nIf you have actions to be taken by the router filter - either ``upstream_http_filters`` or one of the ``RouteConfiguration`` actions such as ``response_headers_to_add`` - then the cache's side-channel going directly to the routed cluster will bypass these actions. You can set ``override_upstream_cluster`` to an internal listener which duplicates the relevant ``RouteConfiguration``, to replicate the desired behavior on the side-channel upstream request issued by the cache.\n\nThis is a workaround for implementation constraints which it is hoped will at some point become unnecessary, then unsupported and this field will be removed.",
    "notImp": false
  }
] };

export const CacheV2Config_SingleFields = [
  "disabled",
  "max_body_bytes",
  "ignore_request_cache_control_header",
  "override_upstream_cluster"
];