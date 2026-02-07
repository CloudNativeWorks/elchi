import {OutType} from '@elchi/tags/tagsType';


export const BufferSettings: OutType = { "BufferSettings": [
  {
    "name": "max_request_bytes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Sets the maximum size of a message body that the filter will hold in memory. Envoy will return ``HTTP 413`` and will *not* initiate the authorization process when the buffer reaches the size set in this field.\n\n:::note\nThis setting will have precedence over `failure_mode_allow`.",
    "notImp": false
  },
  {
    "name": "allow_partial_message",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "When this field is ``true``, Envoy will buffer the message until ``max_request_bytes`` is reached. The authorization request will be dispatched and no 413 HTTP error will be returned by the filter.\n\nDefaults to ``false``.",
    "notImp": false
  },
  {
    "name": "pack_as_bytes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If ``true``, the body sent to the external authorization service is set as raw bytes and populates `raw_body` in the HTTP request attribute context. Otherwise, `body` will be populated with a UTF-8 string request body.\n\nThis field only affects configurations using a `grpc_service`. In configurations that use an `http_service`, this has no effect.\n\nDefaults to ``false``.",
    "notImp": false
  }
] };

export const BufferSettings_SingleFields = [
  "max_request_bytes",
  "allow_partial_message",
  "pack_as_bytes"
];

export const ExtAuthz: OutType = { "ExtAuthz": [
  {
    "name": "services.grpc_service",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "GrpcService",
    "enums": null,
    "comment": "gRPC service configuration (default timeout: 200ms).",
    "notImp": false
  },
  {
    "name": "services.http_service",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HttpService",
    "enums": null,
    "comment": "HTTP service configuration (default timeout: 200ms).",
    "notImp": false
  },
  {
    "name": "transport_api_version",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ApiVersion",
    "enums": [
      "AUTO",
      "V2",
      "V3"
    ],
    "comment": "API version for ext_authz transport protocol. This describes the ext_authz gRPC endpoint and version of messages used on the wire.",
    "notImp": false
  },
  {
    "name": "failure_mode_allow",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Changes the filter's behavior on errors:\n\n* When set to ``true``, the filter will ``accept`` the client request even if communication with the authorization service has failed, or if the authorization service has returned an HTTP 5xx error.\n\n* When set to ``false``, the filter will ``reject`` client requests and return ``Forbidden`` if communication with the authorization service has failed, or if the authorization service has returned an HTTP 5xx error.\n\nErrors can always be tracked in the `stats`.\n\nDefaults to ``false``.",
    "notImp": false
  },
  {
    "name": "failure_mode_allow_header_add",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "When ``failure_mode_allow`` and ``failure_mode_allow_header_add`` are both set to ``true``, ``x-envoy-auth-failure-mode-allowed: true`` will be added to request headers if the communication with the authorization service has failed, or if the authorization service has returned a HTTP 5xx error.",
    "notImp": false
  },
  {
    "name": "with_request_body",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "BufferSettings",
    "enums": null,
    "comment": "Enables the filter to buffer the client request body and send it within the authorization request. The ``x-envoy-auth-partial-body: false|true`` metadata header will be added to the authorization request indicating whether the body data is partial.",
    "notImp": false
  },
  {
    "name": "clear_route_cache",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Clears the route cache in order to allow the external authorization service to correctly affect routing decisions. The filter clears all cached routes when all of the following holds:\n\n* This field is set to ``true``. * The status returned from the authorization service is an HTTP 200 or gRPC 0. * At least one ``authorization response header`` is added to the client request, or is used to alter another client request header.\n\nDefaults to ``false``.",
    "notImp": false
  },
  {
    "name": "status_on_error",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HttpStatus",
    "enums": null,
    "comment": "Sets the HTTP status that is returned to the client when the authorization server returns an error or cannot be reached.\n\nThe default status is ``HTTP 403 Forbidden``.",
    "notImp": false
  },
  {
    "name": "validate_mutations",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "When set to ``true``, the filter will check the `ext_authz response` for invalid header and query parameter mutations. If the response is invalid, the filter will send a local reply to the downstream request with status ``HTTP 500 Internal Server Error``.\n\n:::note\nBoth ``headers_to_remove`` and ``query_parameters_to_remove`` are validated, but invalid elements in those fields should not affect any headers and thus will not cause the filter to send a local reply. \n:::\n\nWhen set to ``false``, any invalid mutations will be visible to the rest of Envoy and may cause unexpected behavior.\n\nIf you are using ext_authz with an untrusted ext_authz server, you should set this to ``true``.\n\nDefaults to ``false``.",
    "notImp": false
  },
  {
    "name": "metadata_context_namespaces",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Specifies a list of metadata namespaces whose values, if present, will be passed to the ext_authz service. The `filter_metadata` is passed as an opaque ``protobuf::Struct``.\n\n:::note\nThis field applies exclusively to the gRPC ext_authz service and has no effect on the HTTP service. \n:::\n\nFor example, if the ``jwt_authn`` filter is used and `payload_in_metadata` is set, then the following will pass the jwt payload to the authorization server.\n\n```yaml\n\n   metadata_context_namespaces:\n   - envoy.filters.http.jwt_authn",
    "notImp": false
  },
  {
    "name": "typed_metadata_context_namespaces",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Specifies a list of metadata namespaces whose values, if present, will be passed to the ext_authz service. `typed_filter_metadata` is passed as a ``protobuf::Any``.\n\n:::note\nThis field applies exclusively to the gRPC ext_authz service and has no effect on the HTTP service. \n:::\n\nThis works similarly to ``metadata_context_namespaces`` but allows Envoy and the ext_authz server to share the protobuf message definition in order to perform safe parsing.",
    "notImp": false
  },
  {
    "name": "route_metadata_context_namespaces",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Specifies a list of route metadata namespaces whose values, if present, will be passed to the ext_authz service at `route_metadata_context` in `CheckRequest`. `filter_metadata` is passed as an opaque ``protobuf::Struct``.",
    "notImp": false
  },
  {
    "name": "route_typed_metadata_context_namespaces",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Specifies a list of route metadata namespaces whose values, if present, will be passed to the ext_authz service at `route_metadata_context` in `CheckRequest`. `typed_filter_metadata` is passed as a ``protobuf::Any``.",
    "notImp": false
  },
  {
    "name": "filter_enabled",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RuntimeFractionalPercent",
    "enums": null,
    "comment": "Specifies if the filter is enabled.\n\nIf `runtime_key` is specified, Envoy will lookup the runtime key to get the percentage of requests to filter.\n\nIf this field is not specified, the filter will be enabled for all requests.",
    "notImp": false
  },
  {
    "name": "filter_enabled_metadata",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "MetadataMatcher",
    "enums": null,
    "comment": "Specifies if the filter is enabled with metadata matcher. If this field is not specified, the filter will be enabled for all requests.\n\n:::note\n\nThis field is only evaluated if the filter is instantiated. If the filter is marked with ``disabled: true`` in the `HttpFilter` configuration or in per-route configuration via `ExtAuthzPerRoute`, the filter will not be instantiated and this field will have no effect. \n:::\n\n.. tip::\n\n  For dynamic filter activation based on metadata (such as metadata set by a preceding filter), consider using `ExtensionWithMatcher` instead. This provides a more flexible matching framework that can evaluate conditions before filter instantiation. See the `ext_authz filter documentation` for examples.",
    "notImp": false
  },
  {
    "name": "deny_at_disable",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RuntimeFeatureFlag",
    "enums": null,
    "comment": "Specifies whether to deny the requests when the filter is disabled. If `runtime_key` is specified, Envoy will lookup the runtime key to determine whether to deny requests for filter-protected paths when the filter is disabled. If the filter is disabled in ``typed_per_filter_config`` for the path, requests will not be denied.\n\nIf this field is not specified, all requests will be allowed when disabled.\n\nIf a request is denied due to this setting, the response code in `status_on_error` will be returned.",
    "notImp": false
  },
  {
    "name": "include_peer_certificate",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Specifies if the peer certificate is sent to the external service.\n\nWhen this field is ``true``, Envoy will include the peer X.509 certificate, if available, in the `certificate`.",
    "notImp": false
  },
  {
    "name": "stat_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Optional additional prefix to use when emitting statistics. This allows distinguishing emitted statistics between configured ``ext_authz`` filters in an HTTP filter chain. For example:\n\n```yaml\n\n  http_filters:\n    - name: envoy.filters.http.ext_authz\n      typed_config:\n        \"@type\": type.googleapis.com/envoy.extensions.filters.http.ext_authz.v3.ExtAuthz\n        stat_prefix: waf # This emits ext_authz.waf.ok, ext_authz.waf.denied, etc.\n    - name: envoy.filters.http.ext_authz\n      typed_config:\n        \"@type\": type.googleapis.com/envoy.extensions.filters.http.ext_authz.v3.ExtAuthz\n        stat_prefix: blocker # This emits ext_authz.blocker.ok, ext_authz.blocker.denied, etc.",
    "notImp": false
  },
  {
    "name": "bootstrap_metadata_labels_key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Optional labels that will be passed to `labels` in `destination`. The labels will be read from `metadata` with the specified key.",
    "notImp": false
  },
  {
    "name": "allowed_headers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ListStringMatcher",
    "enums": null,
    "comment": "Check request to authorization server will include the client request headers that have a correspondent match in the list. If this option isn't specified, then all client request headers are included in the check request to a gRPC authorization server, whereas no client request headers (besides the ones allowed by default - see note below) are included in the check request to an HTTP authorization server. This inconsistency between gRPC and HTTP servers is to maintain backwards compatibility with legacy behavior.\n\n:::note\n\nFor requests to an HTTP authorization server: in addition to the user's supplied matchers, ``Host``, ``Method``, ``Path``, ``Content-Length``, and ``Authorization`` are **additionally included** in the list. \n:::\n\n:::note\n\nFor requests to an HTTP authorization server: the value of ``Content-Length`` will be set to ``0`` and the request to the authorization server will not have a message body. However, the check request can include the buffered client request body (controlled by `with_request_body` setting); consequently, the value of ``Content-Length`` in the authorization request reflects the size of its payload. \n:::\n\n:::note\n\nThis can be overridden by the field ``disallowed_headers`` below. That is, if a header matches for both ``allowed_headers`` and ``disallowed_headers``, the header will NOT be sent.",
    "notImp": false
  },
  {
    "name": "disallowed_headers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ListStringMatcher",
    "enums": null,
    "comment": "If set, specifically disallow any header in this list to be forwarded to the external authentication server. This overrides the above ``allowed_headers`` if a header matches both.",
    "notImp": false
  },
  {
    "name": "include_tls_session",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Specifies if the TLS session level details like SNI are sent to the external service.\n\nWhen this field is ``true``, Envoy will include the SNI name used for TLSClientHello, if available, in the `tls_session`.",
    "notImp": false
  },
  {
    "name": "charge_cluster_response_stats",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether to increment cluster statistics (e.g. cluster.<cluster_name>.upstream_rq_*) on authorization failure. Defaults to ``true``.",
    "notImp": false
  },
  {
    "name": "encode_raw_headers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether to encode the raw headers (i.e., unsanitized values and unconcatenated multi-line headers) in the authorization request. Works with both HTTP and gRPC clients.\n\nWhen this is set to ``true``, header values are not sanitized. Headers with the same key will also not be combined into a single, comma-separated header. Requests to gRPC services will populate the field `header_map`. Requests to HTTP services will be constructed with the unsanitized header values and preserved multi-line headers with the same key.\n\nIf this field is set to ``false``, header values will be sanitized, with any non-UTF-8-compliant bytes replaced with ``'!'``. Headers with the same key will have their values concatenated into a single comma-separated header value. Requests to gRPC services will populate the field `headers`. Requests to HTTP services will have their header values sanitized and will not preserve multi-line headers with the same key.\n\nIt is recommended to set this to ``true`` unless you rely on the previous behavior.\n\nIt is set to ``false`` by default for backwards compatibility.",
    "notImp": false
  },
  {
    "name": "decoder_header_mutation_rules",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderMutationRules",
    "enums": null,
    "comment": "Rules for what modifications an ext_authz server may make to the request headers before continuing decoding or forwarding upstream.\n\nIf set, enables header mutation checking against the configured rules. Note that `HeaderMutationRules` has defaults that change ext_authz behavior. Also note that if this field is set, ext_authz can no longer append to ``:``-prefixed headers.\n\nIf unset, header mutation rule checking is completely disabled.\n\nRegardless of what is configured here, ext_authz cannot remove ``:``-prefixed headers.\n\nThis field and ``validate_mutations`` have different use cases. ``validate_mutations`` enables correctness checks for all header and query parameter mutations (for example, invalid characters). This field allows the filter to reject mutations to specific headers.",
    "notImp": false
  },
  {
    "name": "enable_dynamic_metadata_ingestion",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Enable or disable ingestion of dynamic metadata from the ext_authz service.\n\nIf ``false``, the filter will ignore dynamic metadata injected by the ext_authz service. If the ext_authz service tries injecting dynamic metadata, the filter will log, increment the ``ignored_dynamic_metadata`` stat, then continue handling the response.\n\nIf ``true``, the filter will ingest dynamic metadata entries as normal.\n\nIf unset, defaults to ``true``.",
    "notImp": false
  },
  {
    "name": "filter_metadata",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "{ [key: string]: any; }",
    "enums": null,
    "comment": "Additional metadata to be added to the filter state for logging purposes. The metadata will be added to StreamInfo's filter state under the namespace corresponding to the ext_authz filter name.",
    "notImp": false
  },
  {
    "name": "emit_filter_state_stats",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "When set to ``true``, the filter will emit per-stream stats for access logging. The filter state key will be the same as the filter name.\n\nIf using Envoy gRPC, emits latency, bytes sent / received, upstream info, and upstream cluster info. If not using Envoy gRPC, emits only latency.\n\n:::note\nStats are ONLY added to filter state if a check request is actually made to an ext_authz service. \n:::\n\nIf this is ``false`` the filter will not emit stats, but filter_metadata will still be respected if it has a value.\n\nField ``latency_us`` is exposed for CEL and logging when using gRPC or HTTP service. Fields ``bytesSent`` and ``bytesReceived`` are exposed for CEL and logging only when using gRPC service.",
    "notImp": false
  },
  {
    "name": "max_denied_response_body_bytes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Sets the maximum size (in bytes) of the response body that the filter will send downstream when a request is denied by the external authorization service.\n\nIf the authorization server returns a response body larger than this configured limit, the body will be truncated to ``max_denied_response_body_bytes`` before being sent to the downstream client.\n\nIf this field is not set or is set to 0, no truncation will occur, and the entire denied response body will be forwarded.",
    "notImp": false
  },
  {
    "name": "enforce_response_header_limits",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "When set to ``true``, the filter will enforce the response header map's count and size limits by sending a local reply when those limits are violated.\n\nWhen set to ``false``, the filter will ignore the response header map's limits and add / set all response headers as specified by the external authorization service.\n\nRecommendation: enable if the external authorization service is not trusted. Otherwise, leave it ``false``.\n\nDefaults to ``false``.",
    "notImp": false
  }
] };

export const ExtAuthz_SingleFields = [
  "transport_api_version",
  "failure_mode_allow",
  "failure_mode_allow_header_add",
  "clear_route_cache",
  "validate_mutations",
  "metadata_context_namespaces",
  "typed_metadata_context_namespaces",
  "route_metadata_context_namespaces",
  "route_typed_metadata_context_namespaces",
  "include_peer_certificate",
  "stat_prefix",
  "bootstrap_metadata_labels_key",
  "include_tls_session",
  "charge_cluster_response_stats",
  "encode_raw_headers",
  "enable_dynamic_metadata_ingestion",
  "emit_filter_state_stats",
  "max_denied_response_body_bytes",
  "enforce_response_header_limits"
];

export const AuthorizationRequest: OutType = { "AuthorizationRequest": [
  {
    "name": "allowed_headers",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "ListStringMatcher",
    "enums": null,
    "comment": "Authorization request includes the client request headers that have a corresponding match in the list. This field has been deprecated in favor of `allowed_headers`.\n\n:::note\n\nIn addition to the user's supplied matchers, ``Host``, ``Method``, ``Path``, ``Content-Length``, and ``Authorization`` are **automatically included** in the list. \n:::\n\n:::note\n\nBy default, the ``Content-Length`` header is set to ``0`` and the request to the authorization service has no message body. However, the authorization request *may* include the buffered client request body (controlled by `with_request_body` setting); hence the value of its ``Content-Length`` reflects the size of its payload. \n:::",
    "notImp": false
  },
  {
    "name": "headers_to_add",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderValue[]",
    "enums": null,
    "comment": "Sets a list of headers that will be included in the request to the authorization service.\n\n:::note\nClient request headers with the same key will be overridden.",
    "notImp": false
  }
] };

export const AuthorizationResponse: OutType = { "AuthorizationResponse": [
  {
    "name": "allowed_upstream_headers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ListStringMatcher",
    "enums": null,
    "comment": "When this list is set, authorization response headers that have a correspondent match will be added to the original client request.\n\n:::note\nExisting headers will be overridden.",
    "notImp": false
  },
  {
    "name": "allowed_upstream_headers_to_append",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ListStringMatcher",
    "enums": null,
    "comment": "When this list is set, authorization response headers that have a correspondent match will be added to the original client request.\n\n:::note\nExisting headers will be appended.",
    "notImp": false
  },
  {
    "name": "allowed_client_headers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ListStringMatcher",
    "enums": null,
    "comment": "When this list is set, authorization response headers that have a correspondent match will be added to the client's response. When a header is included in this list, ``Path``, ``Status``, ``Content-Length``, ``WWW-Authenticate`` and ``Location`` are automatically added.\n\n:::note\nWhen this list is *not* set, all the authorization response headers, except ``Authority (Host)``, will be in the response to the client.",
    "notImp": false
  },
  {
    "name": "allowed_client_headers_on_success",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ListStringMatcher",
    "enums": null,
    "comment": "When this list is set, authorization response headers that have a correspondent match will be added to the client's response when the authorization response itself is successful, i.e. not failed or denied. When this list is *not* set, no additional headers will be added to the client's response on success.",
    "notImp": false
  },
  {
    "name": "dynamic_metadata_from_headers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ListStringMatcher",
    "enums": null,
    "comment": "When this list is set, authorization response headers that have a correspondent match will be emitted as dynamic metadata to be consumed by the next filter. This metadata lives in a namespace specified by the canonical name of extension filter that requires it:\n\n- `envoy.filters.http.ext_authz` for HTTP filter. - `envoy.filters.network.ext_authz` for network filter.",
    "notImp": false
  }
] };

export const HttpService: OutType = { "HttpService": [
  {
    "name": "server_uri",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HttpUri",
    "enums": null,
    "comment": "Sets the HTTP server URI which the authorization requests must be sent to.",
    "notImp": false
  },
  {
    "name": "path_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Sets a prefix to the value of authorization request header ``Path``.",
    "notImp": false
  },
  {
    "name": "authorization_request",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "AuthorizationRequest",
    "enums": null,
    "comment": "Settings used for controlling authorization request metadata.",
    "notImp": false
  },
  {
    "name": "authorization_response",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "AuthorizationResponse",
    "enums": null,
    "comment": "Settings used for controlling authorization response metadata.",
    "notImp": false
  },
  {
    "name": "retry_policy",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RetryPolicy",
    "enums": null,
    "comment": "Optional retry policy for requests to the authorization server. If not set, no retries will be performed.\n\n:::note\nWhen this field is set, the ``ext_authz`` filter will buffer the request body for retry purposes.",
    "notImp": false
  }
] };

export const HttpService_SingleFields = [
  "path_prefix"
];

export const ExtAuthzPerRoute: OutType = { "ExtAuthzPerRoute": [
  {
    "name": "override.disabled",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Disable the ext auth filter for this particular vhost or route. If disabled is specified in multiple per-filter-configs, the most specific one will be used. If the filter is disabled by default and this is set to ``false``, the filter will be enabled for this vhost or route.",
    "notImp": false
  },
  {
    "name": "override.check_settings",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "CheckSettings",
    "enums": null,
    "comment": "Check request settings for this route.",
    "notImp": false
  }
] };

export const ExtAuthzPerRoute_SingleFields = [
  "override.disabled"
];

export const CheckSettings: OutType = { "CheckSettings": [
  {
    "name": "context_extensions",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, string>",
    "enums": null,
    "comment": "Context extensions to set on the CheckRequest's `AttributeContext.context_extensions`\n\nYou can use this to provide extra context for the external authorization server on specific virtual hosts/routes. For example, adding a context extension on the virtual host level can give the ext-authz server information on what virtual host is used without needing to parse the host header. If CheckSettings is specified in multiple per-filter-configs, they will be merged in order, and the result will be used.\n\nMerge semantics for this field are such that keys from more specific configs override.\n\n:::note\nThese settings are only applied to a filter configured with a `grpc_service`.",
    "notImp": false
  },
  {
    "name": "disable_request_body_buffering",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "When set to ``true``, disable the configured `with_request_body` for a specific route.\n\nOnly one of ``disable_request_body_buffering`` and `with_request_body` may be specified.",
    "notImp": false
  },
  {
    "name": "with_request_body",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "BufferSettings",
    "enums": null,
    "comment": "Enable or override request body buffering, which is configured using the `with_request_body` option for a specific route.\n\nOnly one of ``with_request_body`` and `disable_request_body_buffering` may be specified.",
    "notImp": false
  },
  {
    "name": "service_override.grpc_service",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "GrpcService",
    "enums": null,
    "comment": "Override with a gRPC service configuration.",
    "notImp": false
  },
  {
    "name": "service_override.http_service",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HttpService",
    "enums": null,
    "comment": "Override with an HTTP service configuration.",
    "notImp": false
  }
] };

export const CheckSettings_SingleFields = [
  "disable_request_body_buffering"
];

export const CheckSettings_ContextExtensionsEntry: OutType = { "CheckSettings_ContextExtensionsEntry": [
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
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const CheckSettings_ContextExtensionsEntry_SingleFields = [
  "key",
  "value"
];