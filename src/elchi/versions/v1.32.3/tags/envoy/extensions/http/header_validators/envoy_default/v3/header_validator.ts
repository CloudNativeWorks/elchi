import {OutType} from '@/elchi/tags/tagsType';


export const HeaderValidatorConfig_Http1ProtocolOptions: OutType = { "HeaderValidatorConfig_Http1ProtocolOptions": [
  {
    "name": "allow_chunked_length",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Allows Envoy to process HTTP/1 requests/responses with both ``Content-Length`` and ``Transfer-Encoding`` headers set. By default such messages are rejected, but if option is enabled - Envoy will remove the ``Content-Length`` header and process the message. See `RFC7230, sec. 3.3.3 <https://datatracker.ietf.org/doc/html/rfc7230#section-3.3.3>`_ for details.\n\n:::attention\nEnabling this option might lead to request smuggling vulnerabilities, especially if traffic is proxied via multiple layers of proxies.",
    "notImp": false
  }
] };

export const HeaderValidatorConfig_Http1ProtocolOptions_SingleFields = [
  "allow_chunked_length"
];

export const HeaderValidatorConfig_UriPathNormalizationOptions: OutType = { "HeaderValidatorConfig_UriPathNormalizationOptions": [
  {
    "name": "skip_path_normalization",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Should paths be normalized according to RFC 3986? This operation overwrites the original request URI path and the new path is used for processing of the request by HTTP filters and proxied to the upstream service. Envoy will respond with 400 to requests with malformed paths that fail path normalization. The default behavior is to normalize the path. This value may be overridden by the runtime variable `http_connection_manager.normalize_path`. See `Normalization and Comparison <https://datatracker.ietf.org/doc/html/rfc3986#section-6>`_ for details of normalization. Note that Envoy does not perform `case normalization <https://datatracker.ietf.org/doc/html/rfc3986#section-6.2.2.1>`_ URI path normalization can be applied to a portion of requests by setting the ``envoy_default_header_validator.path_normalization`` runtime value.",
    "notImp": false
  },
  {
    "name": "skip_merging_slashes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Determines if adjacent slashes in the path are merged into one. This operation overwrites the original request URI path and the new path is used for processing of the request by HTTP filters and proxied to the upstream service. Setting this option to true will cause incoming requests with path ``//dir///file`` to not match against route with ``prefix`` match set to ``/dir``. Defaults to ``false``. Note that slash merging is not part of `HTTP spec <https://datatracker.ietf.org/doc/html/rfc3986>`_ and is provided for convenience. Merging of slashes in URI path can be applied to a portion of requests by setting the ``envoy_default_header_validator.merge_slashes`` runtime value.",
    "notImp": false
  },
  {
    "name": "path_with_escaped_slashes_action",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderValidatorConfig_UriPathNormalizationOptions_PathWithEscapedSlashesAction",
    "enums": [
      "IMPLEMENTATION_SPECIFIC_DEFAULT",
      "KEEP_UNCHANGED",
      "REJECT_REQUEST",
      "UNESCAPE_AND_REDIRECT",
      "UNESCAPE_AND_FORWARD"
    ],
    "comment": "The action to take when request URL path contains escaped slash sequences (``%2F``, ``%2f``, ``%5C`` and ``%5c``). This operation may overwrite the original request URI path and the new path is used for processing of the request by HTTP filters and proxied to the upstream service.",
    "notImp": false
  }
] };

export const HeaderValidatorConfig_UriPathNormalizationOptions_SingleFields = [
  "skip_path_normalization",
  "skip_merging_slashes",
  "path_with_escaped_slashes_action"
];

export const HeaderValidatorConfig: OutType = { "HeaderValidatorConfig": [
  {
    "name": "http1_protocol_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderValidatorConfig_Http1ProtocolOptions",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "uri_path_normalization_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderValidatorConfig_UriPathNormalizationOptions",
    "enums": null,
    "comment": "The URI path normalization options. By default Envoy normalizes URI path using the default values of the `UriPathNormalizationOptions`. URI path transformations specified by the ``uri_path_normalization_options`` configuration can be applied to a portion of requests by setting the ``envoy_default_header_validator.uri_path_transformations`` runtime value. Caution: disabling path normalization may lead to path confusion vulnerabilities in access control or incorrect service selection.",
    "notImp": false
  },
  {
    "name": "restrict_http_methods",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Restrict HTTP methods to these defined in the `RFC 7231 section 4.1 <https://datatracker.ietf.org/doc/html/rfc7231#section-4.1>`_ Envoy will respond with 400 to requests with disallowed methods. By default methods with arbitrary names are accepted.",
    "notImp": false
  },
  {
    "name": "headers_with_underscores_action",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderValidatorConfig_HeadersWithUnderscoresAction",
    "enums": [
      "ALLOW",
      "REJECT_REQUEST",
      "DROP_HEADER"
    ],
    "comment": "Action to take when a client request with a header name containing underscore characters is received. If this setting is not specified, the value defaults to ALLOW.",
    "notImp": false
  },
  {
    "name": "strip_fragment_from_path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Allow requests with fragment in URL path and strip the fragment before request processing. By default Envoy rejects requests with fragment in URL path.",
    "notImp": false
  }
] };

export const HeaderValidatorConfig_SingleFields = [
  "restrict_http_methods",
  "headers_with_underscores_action",
  "strip_fragment_from_path"
];