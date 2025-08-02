import {OutType} from '@elchi/tags/tagsType';


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
    "name": "enabled_specifier.filter_enabled",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RuntimeFractionalPercent",
    "enums": null,
    "comment": "Specifies the % of requests for which the CORS filter is enabled.\n\nIf neither ``enabled``, ``filter_enabled``, nor ``shadow_enabled`` are specified, the CORS filter will be enabled for 100% of the requests.\n\nIf `runtime_key` is specified, Envoy will lookup the runtime key to get the percentage of requests to filter.",
    "notImp": false
  },
  {
    "name": "shadow_enabled",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RuntimeFractionalPercent",
    "enums": null,
    "comment": "Specifies the % of requests for which the CORS policies will be evaluated and tracked, but not enforced.\n\nThis field is intended to be used when ``filter_enabled`` and ``enabled`` are off. One of those fields have to explicitly disable the filter in order for this setting to take effect.\n\nIf `runtime_key` is specified, Envoy will lookup the runtime key to get the percentage of requests for which it will evaluate and track the request's ``Origin`` to determine if it's valid but will not enforce any policies.",
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

export const RetryPolicy_RetryPriority: OutType = { "RetryPolicy_RetryPriority": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "config_type.typed_config",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "extension-category: envoy.retry_priorities",
    "notImp": false
  }
] };

export const RetryPolicy_RetryPriority_SingleFields = [
  "name"
];

export const RetryPolicy_RetryBackOff: OutType = { "RetryPolicy_RetryBackOff": [
  {
    "name": "base_interval",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Specifies the base interval between retries. This parameter is required and must be greater than zero. Values less than 1 ms are rounded up to 1 ms. See `config_http_filters_router_x-envoy-max-retries` for a discussion of Envoy's back-off algorithm.",
    "notImp": false
  },
  {
    "name": "max_interval",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Specifies the maximum interval between retries. This parameter is optional, but must be greater than or equal to the ``base_interval`` if set. The default is 10 times the ``base_interval``. See `config_http_filters_router_x-envoy-max-retries` for a discussion of Envoy's back-off algorithm.",
    "notImp": false
  }
] };

export const RetryPolicy_RetryBackOff_SingleFields = [
  "base_interval",
  "max_interval"
];

export const RetryPolicy_RateLimitedRetryBackOff: OutType = { "RetryPolicy_RateLimitedRetryBackOff": [
  {
    "name": "reset_headers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RetryPolicy_ResetHeader[]",
    "enums": null,
    "comment": "Specifies the reset headers (like ``Retry-After`` or ``X-RateLimit-Reset``) to match against the response. Headers are tried in order, and matched case insensitive. The first header to be parsed successfully is used. If no headers match the default exponential back-off is used instead.",
    "notImp": false
  },
  {
    "name": "max_interval",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Specifies the maximum back off interval that Envoy will allow. If a reset header contains an interval longer than this then it will be discarded and the next header will be tried. Defaults to 300 seconds.",
    "notImp": false
  }
] };

export const RetryPolicy_RateLimitedRetryBackOff_SingleFields = [
  "max_interval"
];

export const RetryPolicy: OutType = { "RetryPolicy": [
  {
    "name": "retry_on",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Specifies the conditions under which retry takes place. These are the same conditions documented for `config_http_filters_router_x-envoy-retry-on` and `config_http_filters_router_x-envoy-retry-grpc-on`.",
    "notImp": false
  },
  {
    "name": "num_retries",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Specifies the allowed number of retries. This parameter is optional and defaults to 1. These are the same conditions documented for `config_http_filters_router_x-envoy-max-retries`.",
    "notImp": false
  },
  {
    "name": "per_try_timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Specifies a non-zero upstream timeout per retry attempt (including the initial attempt). This parameter is optional. The same conditions documented for `config_http_filters_router_x-envoy-upstream-rq-per-try-timeout-ms` apply.\n\n:::note\n\nIf left unspecified, Envoy will use the global `route timeout` for the request. Consequently, when using a `5xx` based retry policy, a request that times out will not be retried as the total timeout budget would have been exhausted.",
    "notImp": false
  },
  {
    "name": "per_try_idle_timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Specifies an upstream idle timeout per retry attempt (including the initial attempt). This parameter is optional and if absent there is no per try idle timeout. The semantics of the per try idle timeout are similar to the `route idle timeout` and `stream idle timeout` both enforced by the HTTP connection manager. The difference is that this idle timeout is enforced by the router for each individual attempt and thus after all previous filters have run, as opposed to *before* all previous filters run for the other idle timeouts. This timeout is useful in cases in which total request timeout is bounded by a number of retries and a `per_try_timeout`, but there is a desire to ensure each try is making incremental progress. Note also that similar to `per_try_timeout`, this idle timeout does not start until after both the entire request has been received by the router *and* a connection pool connection has been obtained. Unlike `per_try_timeout`, the idle timer continues once the response starts streaming back to the downstream client. This ensures that response data continues to make progress without using one of the HTTP connection manager idle timeouts.",
    "notImp": false
  },
  {
    "name": "retry_priority",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RetryPolicy_RetryPriority",
    "enums": null,
    "comment": "Specifies an implementation of a RetryPriority which is used to determine the distribution of load across priorities used for retries. Refer to `retry plugin configuration` for more details.",
    "notImp": false
  },
  {
    "name": "retry_host_predicate",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RetryPolicy_RetryHostPredicate[]",
    "enums": null,
    "comment": "Specifies a collection of RetryHostPredicates that will be consulted when selecting a host for retries. If any of the predicates reject the host, host selection will be reattempted. Refer to `retry plugin configuration` for more details.",
    "notImp": false
  },
  {
    "name": "retry_options_predicates",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig[]",
    "enums": null,
    "comment": "Retry options predicates that will be applied prior to retrying a request. These predicates allow customizing request behavior between retries.  when there are built-in extensions]",
    "notImp": false
  },
  {
    "name": "host_selection_retry_max_attempts",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The maximum number of times host selection will be reattempted before giving up, at which point the host that was last selected will be routed to. If unspecified, this will default to retrying once.",
    "notImp": false
  },
  {
    "name": "retriable_status_codes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number[]",
    "enums": null,
    "comment": "HTTP status codes that should trigger a retry in addition to those specified by retry_on.",
    "notImp": false
  },
  {
    "name": "retry_back_off",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RetryPolicy_RetryBackOff",
    "enums": null,
    "comment": "Specifies parameters that control exponential retry back off. This parameter is optional, in which case the default base interval is 25 milliseconds or, if set, the current value of the ``upstream.base_retry_backoff_ms`` runtime parameter. The default maximum interval is 10 times the base interval. The documentation for `config_http_filters_router_x-envoy-max-retries` describes Envoy's back-off algorithm.",
    "notImp": false
  },
  {
    "name": "rate_limited_retry_back_off",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RetryPolicy_RateLimitedRetryBackOff",
    "enums": null,
    "comment": "Specifies parameters that control a retry back-off strategy that is used when the request is rate limited by the upstream server. The server may return a response header like ``Retry-After`` or ``X-RateLimit-Reset`` to provide feedback to the client on how long to wait before retrying. If configured, this back-off strategy will be used instead of the default exponential back off strategy (configured using ``retry_back_off``) whenever a response includes the matching headers.",
    "notImp": false
  },
  {
    "name": "retriable_headers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderMatcher[]",
    "enums": null,
    "comment": "HTTP response headers that trigger a retry if present in the response. A retry will be triggered if any of the header matches match the upstream response headers. The field is only consulted if 'retriable-headers' retry policy is active.",
    "notImp": false
  },
  {
    "name": "retriable_request_headers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderMatcher[]",
    "enums": null,
    "comment": "HTTP headers which must be present in the request for retries to be attempted.",
    "notImp": false
  }
] };

export const RetryPolicy_SingleFields = [
  "retry_on",
  "num_retries",
  "per_try_timeout",
  "per_try_idle_timeout",
  "host_selection_retry_max_attempts",
  "retriable_status_codes"
];

export const HedgePolicy: OutType = { "HedgePolicy": [
  {
    "name": "initial_requests",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Specifies the number of initial requests that should be sent upstream. Must be at least 1. Defaults to 1. [#not-implemented-hide:]",
    "notImp": true
  },
  {
    "name": "additional_request_chance",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FractionalPercent",
    "enums": null,
    "comment": "Specifies a probability that an additional upstream request should be sent on top of what is specified by initial_requests. Defaults to 0. [#not-implemented-hide:]",
    "notImp": true
  },
  {
    "name": "hedge_on_per_try_timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Indicates that a hedged request should be sent when the per-try timeout is hit. This means that a retry will be issued without resetting the original request, leaving multiple upstream requests in flight. The first request to complete successfully will be the one returned to the caller.\n\n* At any time, a successful response (i.e. not triggering any of the retry-on conditions) would be returned to the client. * Before per-try timeout, an error response (per retry-on conditions) would be retried immediately or returned ot the client if there are no more retries left. * After per-try timeout, an error response would be discarded, as a retry in the form of a hedged request is already in progress.\n\nNote: For this to have effect, you must have a `RetryPolicy` that retries at least one error code and specifies a maximum number of retries.\n\nDefaults to false.",
    "notImp": false
  }
] };

export const HedgePolicy_SingleFields = [
  "initial_requests",
  "hedge_on_per_try_timeout"
];

export const VirtualHost: OutType = { "VirtualHost": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The logical name of the virtual host. This is used when emitting certain statistics but is not relevant for routing.",
    "notImp": false
  },
  {
    "name": "domains",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "A list of domains (host/authority header) that will be matched to this virtual host. Wildcard hosts are supported in the suffix or prefix form.\n\nDomain search order: 1. Exact domain names: ``www.foo.com``. 2. Suffix domain wildcards: ``*.foo.com`` or ``*-bar.foo.com``. 3. Prefix domain wildcards: ``foo.*`` or ``foo-*``. 4. Special wildcard ``*`` matching any domain.\n\n:::note\n\nThe wildcard will not match the empty string. e.g. ``*-bar.foo.com`` will match ``baz-bar.foo.com`` but not ``-bar.foo.com``. The longest wildcards match first. Only a single virtual host in the entire route configuration can match on ``*``. A domain must be unique across all virtual hosts or the config will fail to load. \n:::\n\nDomains cannot contain control characters. This is validated by the well_known_regex HTTP_HEADER_VALUE.",
    "notImp": false
  },
  {
    "name": "routes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Route[]",
    "enums": null,
    "comment": "The list of routes that will be matched, in order, for incoming requests. The first route that matches will be used. Only one of this and ``matcher`` can be specified.",
    "notImp": false
  },
  {
    "name": "matcher",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Matcher",
    "enums": null,
    "comment": "The match tree to use when resolving route actions for incoming requests. Only one of this and ``routes`` can be specified.",
    "notImp": false
  },
  {
    "name": "require_tls",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "VirtualHost_TlsRequirementType",
    "enums": [
      "NONE",
      "EXTERNAL_ONLY",
      "ALL"
    ],
    "comment": "Specifies the type of TLS enforcement the virtual host expects. If this option is not specified, there is no TLS requirement for the virtual host.",
    "notImp": false
  },
  {
    "name": "virtual_clusters",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "VirtualCluster[]",
    "enums": null,
    "comment": "A list of virtual clusters defined for this virtual host. Virtual clusters are used for additional statistics gathering.",
    "notImp": false
  },
  {
    "name": "rate_limits",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RateLimit[]",
    "enums": null,
    "comment": "Specifies a set of rate limit configurations that will be applied to the virtual host.",
    "notImp": false
  },
  {
    "name": "request_headers_to_add",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderValueOption[]",
    "enums": null,
    "comment": "Specifies a list of HTTP headers that should be added to each request handled by this virtual host. Headers specified at this level are applied after headers from enclosed `envoy_v3_api_msg_config.route.v3.Route` and before headers from the enclosing `envoy_v3_api_msg_config.route.v3.RouteConfiguration`. For more information, including details on header value syntax, see the documentation on `custom request headers`.",
    "notImp": false
  },
  {
    "name": "request_headers_to_remove",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Specifies a list of HTTP headers that should be removed from each request handled by this virtual host.",
    "notImp": false
  },
  {
    "name": "response_headers_to_add",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderValueOption[]",
    "enums": null,
    "comment": "Specifies a list of HTTP headers that should be added to each response handled by this virtual host. Headers specified at this level are applied after headers from enclosed `envoy_v3_api_msg_config.route.v3.Route` and before headers from the enclosing `envoy_v3_api_msg_config.route.v3.RouteConfiguration`. For more information, including details on header value syntax, see the documentation on `custom request headers`.",
    "notImp": false
  },
  {
    "name": "response_headers_to_remove",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Specifies a list of HTTP headers that should be removed from each response handled by this virtual host.",
    "notImp": false
  },
  {
    "name": "cors",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "CorsPolicy",
    "enums": null,
    "comment": "Indicates that the virtual host has a CORS policy. This field is ignored if related cors policy is found in the `VirtualHost.typed_per_filter_config`.\n\n:::attention\n\nThis option has been deprecated. Please use `VirtualHost.typed_per_filter_config` to configure the CORS HTTP filter. \n:::",
    "notImp": false
  },
  {
    "name": "typed_per_filter_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, Any>",
    "enums": null,
    "comment": "This field can be used to provide virtual host level per filter config. The key should match the `filter config name`. See `Http filter route specific config` for details.",
    "notImp": false
  },
  {
    "name": "include_request_attempt_count",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Decides whether the `x-envoy-attempt-count` header should be included in the upstream request. Setting this option will cause it to override any existing header value, so in the case of two Envoys on the request path with this option enabled, the upstream will see the attempt count as perceived by the second Envoy. Defaults to false. This header is unaffected by the `suppress_envoy_headers` flag.",
    "notImp": false
  },
  {
    "name": "include_attempt_count_in_response",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Decides whether the `x-envoy-attempt-count` header should be included in the downstream response. Setting this option will cause the router to override any existing header value, so in the case of two Envoys on the request path with this option enabled, the downstream will see the attempt count as perceived by the Envoy closest upstream from itself. Defaults to false. This header is unaffected by the `suppress_envoy_headers` flag.",
    "notImp": false
  },
  {
    "name": "retry_policy",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RetryPolicy",
    "enums": null,
    "comment": "Indicates the retry policy for all routes in this virtual host. Note that setting a route level entry will take precedence over this config and it'll be treated independently (e.g.: values are not inherited).",
    "notImp": false
  },
  {
    "name": "retry_policy_typed_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "[#not-implemented-hide:] Specifies the configuration for retry policy extension. Note that setting a route level entry will take precedence over this config and it'll be treated independently (e.g.: values are not inherited). `Retry policy` should not be set if this field is used.",
    "notImp": true
  },
  {
    "name": "hedge_policy",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HedgePolicy",
    "enums": null,
    "comment": "Indicates the hedge policy for all routes in this virtual host. Note that setting a route level entry will take precedence over this config and it'll be treated independently (e.g.: values are not inherited).",
    "notImp": false
  },
  {
    "name": "include_is_timeout_retry_header",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Decides whether to include the `x-envoy-is-timeout-retry` request header in retries initiated by per try timeouts.",
    "notImp": false
  },
  {
    "name": "per_request_buffer_limit_bytes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The maximum bytes which will be buffered for retries and shadowing. If set and a route-specific limit is not set, the bytes actually buffered will be the minimum value of this and the listener per_connection_buffer_limit_bytes.",
    "notImp": false
  },
  {
    "name": "request_mirror_policies",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RouteAction_RequestMirrorPolicy[]",
    "enums": null,
    "comment": "Specify a set of default request mirroring policies for every route under this virtual host. It takes precedence over the route config mirror policy entirely. That is, policies are not merged, the most specific non-empty one becomes the mirror policies.",
    "notImp": false
  },
  {
    "name": "metadata",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Metadata",
    "enums": null,
    "comment": "The metadata field can be used to provide additional information about the virtual host. It can be used for configuration, stats, and logging. The metadata should go under the filter namespace that will need it. For instance, if the metadata is intended for the Router filter, the filter name should be specified as ``envoy.filters.http.router``.",
    "notImp": false
  }
] };

export const VirtualHost_SingleFields = [
  "name",
  "domains",
  "require_tls",
  "request_headers_to_remove",
  "response_headers_to_remove",
  "include_request_attempt_count",
  "include_attempt_count_in_response",
  "include_is_timeout_retry_header",
  "per_request_buffer_limit_bytes"
];

export const VirtualHost_TypedPerFilterConfigEntry: OutType = { "VirtualHost_TypedPerFilterConfigEntry": [
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
    "fieldType": "Any",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const VirtualHost_TypedPerFilterConfigEntry_SingleFields = [
  "key"
];

export const FilterAction: OutType = { "FilterAction": [
  {
    "name": "action",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const RouteList: OutType = { "RouteList": [
  {
    "name": "routes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Route[]",
    "enums": null,
    "comment": "The list of routes that will be matched and run, in order. The first route that matches will be used.",
    "notImp": false
  }
] };

export const RouteMatch_TlsContextMatchOptions: OutType = { "RouteMatch_TlsContextMatchOptions": [
  {
    "name": "presented",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If specified, the route will match against whether or not a certificate is presented. If not specified, certificate presentation status (true or false) will not be considered when route matching.",
    "notImp": false
  },
  {
    "name": "validated",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If specified, the route will match against whether or not a certificate is validated. If not specified, certificate validation status (true or false) will not be considered when route matching.\n\n:::warning\n\nClient certificate validation is not currently performed upon TLS session resumption. For a resumed TLS session the route will match only when ``validated`` is false, regardless of whether the client TLS certificate is valid. \n:::\n\n   The only known workaround for this issue is to disable TLS session resumption entirely, by setting both `disable_stateless_session_resumption` and `disable_stateful_session_resumption` on the DownstreamTlsContext.",
    "notImp": false
  }
] };

export const RouteMatch_TlsContextMatchOptions_SingleFields = [
  "presented",
  "validated"
];

export const RouteMatch: OutType = { "RouteMatch": [
  {
    "name": "path_specifier.prefix",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "If specified, the route is a prefix rule meaning that the prefix must match the beginning of the ``:path`` header.",
    "notImp": false
  },
  {
    "name": "path_specifier.path",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "If specified, the route is an exact path rule meaning that the path must exactly match the ``:path`` header once the query string is removed.",
    "notImp": false
  },
  {
    "name": "path_specifier.safe_regex",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RegexMatcher",
    "enums": null,
    "comment": "If specified, the route is a regular expression rule meaning that the regex must match the ``:path`` header once the query string is removed. The entire path (without the query string) must match the regex. The rule will not match if only a subsequence of the ``:path`` header matches the regex.",
    "notImp": false
  },
  {
    "name": "path_specifier.connect_matcher",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RouteMatch_ConnectMatcher",
    "enums": null,
    "comment": "If this is used as the matcher, the matcher will only match CONNECT or CONNECT-UDP requests. Note that this will not match other Extended CONNECT requests (WebSocket and the like) as they are normalized in Envoy as HTTP/1.1 style upgrades. This is the only way to match CONNECT requests for HTTP/1.1. For HTTP/2 and HTTP/3, where Extended CONNECT requests may have a path, the path matchers will work if there is a path present. Note that CONNECT support is currently considered alpha in Envoy.",
    "notImp": false
  },
  {
    "name": "path_specifier.path_separated_prefix",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "If specified, the route is a path-separated prefix rule meaning that the ``:path`` header (without the query string) must either exactly match the ``path_separated_prefix`` or have it as a prefix, followed by ``/``\n\nFor example, ``/api/dev`` would match ``/api/dev``, ``/api/dev/``, ``/api/dev/v1``, and ``/api/dev?param=true`` but would not match ``/api/developer``\n\nExpect the value to not contain ``?`` or ``#`` and not to end in ``/``",
    "notImp": false
  },
  {
    "name": "path_specifier.path_match_policy",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "extension-category: envoy.path.match",
    "notImp": false
  },
  {
    "name": "case_sensitive",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Indicates that prefix/path matching should be case sensitive. The default is true. Ignored for safe_regex matching.",
    "notImp": false
  },
  {
    "name": "runtime_fraction",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RuntimeFractionalPercent",
    "enums": null,
    "comment": "Indicates that the route should additionally match on a runtime key. Every time the route is considered for a match, it must also fall under the percentage of matches indicated by this field. For some fraction N/D, a random number in the range [0,D) is selected. If the number is <= the value of the numerator N, or if the key is not present, the default value, the router continues to evaluate the remaining match criteria. A runtime_fraction route configuration can be used to roll out route changes in a gradual manner without full code/config deploys. Refer to the `traffic shifting` docs for additional documentation.\n\n:::note\n\nParsing this field is implemented such that the runtime key's data may be represented as a FractionalPercent proto represented as JSON/YAML and may also be represented as an integer with the assumption that the value is an integral percentage out of 100. For instance, a runtime key lookup returning the value \"42\" would parse as a FractionalPercent whose numerator is 42 and denominator is HUNDRED. This preserves legacy semantics.",
    "notImp": false
  },
  {
    "name": "headers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderMatcher[]",
    "enums": null,
    "comment": "Specifies a set of headers that the route should match on. The router will check the request’s headers against all the specified headers in the route config. A match will happen if all the headers in the route are present in the request with the same values (or based on presence if the value field is not in the config).",
    "notImp": false
  },
  {
    "name": "query_parameters",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "QueryParameterMatcher[]",
    "enums": null,
    "comment": "Specifies a set of URL query parameters on which the route should match. The router will check the query string from the ``path`` header against all the specified query parameters. If the number of specified query parameters is nonzero, they all must match the ``path`` header's query string for a match to occur. In the event query parameters are repeated, only the first value for each key will be considered.\n\n:::note\n\nIf query parameters are used to pass request message fields when `grpc_json_transcoder <https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_filters/grpc_json_transcoder_filter>`_ is used, the transcoded message fields maybe different. The query parameters are url encoded, but the message fields are not. For example, if a query parameter is \"foo%20bar\", the message field will be \"foo bar\".",
    "notImp": false
  },
  {
    "name": "grpc",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RouteMatch_GrpcRouteMatchOptions",
    "enums": null,
    "comment": "If specified, only gRPC requests will be matched. The router will check that the content-type header has a application/grpc or one of the various application/grpc+ values.",
    "notImp": false
  },
  {
    "name": "tls_context",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RouteMatch_TlsContextMatchOptions",
    "enums": null,
    "comment": "If specified, the client tls context will be matched against the defined match options.",
    "notImp": false
  },
  {
    "name": "dynamic_metadata",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "MetadataMatcher[]",
    "enums": null,
    "comment": "Specifies a set of dynamic metadata matchers on which the route should match. The router will check the dynamic metadata against all the specified dynamic metadata matchers. If the number of specified dynamic metadata matchers is nonzero, they all must match the dynamic metadata for a match to occur.",
    "notImp": false
  },
  {
    "name": "filter_state",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FilterStateMatcher[]",
    "enums": null,
    "comment": "Specifies a set of filter state matchers on which the route should match. The router will check the filter state against all the specified filter state matchers. If the number of specified filter state matchers is nonzero, they all must match the filter state for a match to occur.",
    "notImp": false
  }
] };

export const RouteMatch_SingleFields = [
  "path_specifier.prefix",
  "path_specifier.path",
  "path_specifier.path_separated_prefix",
  "case_sensitive"
];

export const Decorator: OutType = { "Decorator": [
  {
    "name": "operation",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The operation name associated with the request matched to this route. If tracing is enabled, this information will be used as the span name reported for this request.\n\n:::note\n\nFor ingress (inbound) requests, or egress (outbound) responses, this value may be overridden by the `x-envoy-decorator-operation` header.",
    "notImp": false
  },
  {
    "name": "propagate",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether the decorated details should be propagated to the other party. The default is true.",
    "notImp": false
  }
] };

export const Decorator_SingleFields = [
  "operation",
  "propagate"
];

export const Tracing: OutType = { "Tracing": [
  {
    "name": "client_sampling",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FractionalPercent",
    "enums": null,
    "comment": "Target percentage of requests managed by this HTTP connection manager that will be force traced if the `x-client-trace-id` header is set. This field is a direct analog for the runtime variable 'tracing.client_enabled' in the `HTTP Connection Manager`. Default: 100%",
    "notImp": false
  },
  {
    "name": "random_sampling",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FractionalPercent",
    "enums": null,
    "comment": "Target percentage of requests managed by this HTTP connection manager that will be randomly selected for trace generation, if not requested by the client or not forced. This field is a direct analog for the runtime variable 'tracing.random_sampling' in the `HTTP Connection Manager`. Default: 100%",
    "notImp": false
  },
  {
    "name": "overall_sampling",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FractionalPercent",
    "enums": null,
    "comment": "Target percentage of requests managed by this HTTP connection manager that will be traced after all other sampling checks have been applied (client-directed, force tracing, random sampling). This field functions as an upper limit on the total configured sampling rate. For instance, setting client_sampling to 100% but overall_sampling to 1% will result in only 1% of client requests with the appropriate headers to be force traced. This field is a direct analog for the runtime variable 'tracing.global_enabled' in the `HTTP Connection Manager`. Default: 100%",
    "notImp": false
  },
  {
    "name": "custom_tags",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CustomTag[]",
    "enums": null,
    "comment": "A list of custom tags with unique tag name to create tags for the active span. It will take effect after merging with the `corresponding configuration` configured in the HTTP connection manager. If two tags with the same name are configured each in the HTTP connection manager and the route level, the one configured here takes priority.",
    "notImp": false
  }
] };

export const Route: OutType = { "Route": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Name for the route.",
    "notImp": false
  },
  {
    "name": "match",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RouteMatch",
    "enums": null,
    "comment": "Route matching parameters.",
    "notImp": false
  },
  {
    "name": "action.route",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RouteAction",
    "enums": null,
    "comment": "Route request to some upstream cluster.",
    "notImp": false
  },
  {
    "name": "action.redirect",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RedirectAction",
    "enums": null,
    "comment": "Return a redirect.",
    "notImp": false
  },
  {
    "name": "action.direct_response",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "DirectResponseAction",
    "enums": null,
    "comment": "Return an arbitrary HTTP response directly, without proxying.",
    "notImp": false
  },
  {
    "name": "action.filter_action",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "FilterAction",
    "enums": null,
    "comment": "[#not-implemented-hide:] A filter-defined action (e.g., it could dynamically generate the RouteAction).",
    "notImp": true
  },
  {
    "name": "action.non_forwarding_action",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "NonForwardingAction",
    "enums": null,
    "comment": "[#not-implemented-hide:] An action used when the route will generate a response directly, without forwarding to an upstream host. This will be used in non-proxy xDS clients like the gRPC server. It could also be used in the future in Envoy for a filter that directly generates responses for requests.",
    "notImp": true
  },
  {
    "name": "metadata",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Metadata",
    "enums": null,
    "comment": "The Metadata field can be used to provide additional information about the route. It can be used for configuration, stats, and logging. The metadata should go under the filter namespace that will need it. For instance, if the metadata is intended for the Router filter, the filter name should be specified as ``envoy.filters.http.router``.",
    "notImp": false
  },
  {
    "name": "decorator",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Decorator",
    "enums": null,
    "comment": "Decorator for the matched route.",
    "notImp": false
  },
  {
    "name": "typed_per_filter_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, Any>",
    "enums": null,
    "comment": "This field can be used to provide route specific per filter config. The key should match the `filter config name`. See `Http filter route specific config` for details.",
    "notImp": false
  },
  {
    "name": "request_headers_to_add",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderValueOption[]",
    "enums": null,
    "comment": "Specifies a set of headers that will be added to requests matching this route. Headers specified at this level are applied before headers from the enclosing `envoy_v3_api_msg_config.route.v3.VirtualHost` and `envoy_v3_api_msg_config.route.v3.RouteConfiguration`. For more information, including details on header value syntax, see the documentation on `custom request headers`.",
    "notImp": false
  },
  {
    "name": "request_headers_to_remove",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Specifies a list of HTTP headers that should be removed from each request matching this route.",
    "notImp": false
  },
  {
    "name": "response_headers_to_add",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderValueOption[]",
    "enums": null,
    "comment": "Specifies a set of headers that will be added to responses to requests matching this route. Headers specified at this level are applied before headers from the enclosing `envoy_v3_api_msg_config.route.v3.VirtualHost` and `envoy_v3_api_msg_config.route.v3.RouteConfiguration`. For more information, including details on header value syntax, see the documentation on `custom request headers`.",
    "notImp": false
  },
  {
    "name": "response_headers_to_remove",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Specifies a list of HTTP headers that should be removed from each response to requests matching this route.",
    "notImp": false
  },
  {
    "name": "tracing",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Tracing",
    "enums": null,
    "comment": "Presence of the object defines whether the connection manager's tracing configuration is overridden by this route specific instance.",
    "notImp": false
  },
  {
    "name": "per_request_buffer_limit_bytes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The maximum bytes which will be buffered for retries and shadowing. If set, the bytes actually buffered will be the minimum value of this and the listener per_connection_buffer_limit_bytes.",
    "notImp": false
  },
  {
    "name": "stat_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The human readable prefix to use when emitting statistics for this endpoint. The statistics are rooted at vhost.<virtual host name>.route.<stat_prefix>. This should be set for highly critical endpoints that one wishes to get “per-route” statistics on. If not set, endpoint statistics are not generated.\n\nThe emitted statistics are the same as those documented for `virtual clusters`.\n\n:::warning\n\nWe do not recommend setting up a stat prefix for every application endpoint. This is both not easily maintainable and statistics use a non-trivial amount of memory(approximately 1KiB per route).",
    "notImp": false
  }
] };

export const Route_SingleFields = [
  "name",
  "request_headers_to_remove",
  "response_headers_to_remove",
  "per_request_buffer_limit_bytes",
  "stat_prefix"
];

export const Route_TypedPerFilterConfigEntry: OutType = { "Route_TypedPerFilterConfigEntry": [
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
    "fieldType": "Any",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const Route_TypedPerFilterConfigEntry_SingleFields = [
  "key"
];

export const WeightedCluster: OutType = { "WeightedCluster": [
  {
    "name": "clusters",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "WeightedCluster_ClusterWeight[]",
    "enums": null,
    "comment": "Specifies one or more upstream clusters associated with the route.",
    "notImp": false
  },
  {
    "name": "total_weight",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "number",
    "enums": null,
    "comment": "Specifies the total weight across all clusters. The sum of all cluster weights must equal this value, if this is greater than 0. This field is now deprecated, and the client will use the sum of all cluster weights. It is up to the management server to supply the correct weights.",
    "notImp": false
  },
  {
    "name": "runtime_key_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Specifies the runtime key prefix that should be used to construct the runtime keys associated with each cluster. When the ``runtime_key_prefix`` is specified, the router will look for weights associated with each upstream cluster under the key ``runtime_key_prefix`` + ``.`` + ``cluster[i].name`` where ``cluster[i]`` denotes an entry in the clusters array field. If the runtime key for the cluster does not exist, the value specified in the configuration file will be used as the default weight. See the `runtime documentation` for how key names map to the underlying implementation.",
    "notImp": false
  },
  {
    "name": "random_value_specifier.header_name",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Specifies the header name that is used to look up the random value passed in the request header. This is used to ensure consistent cluster picking across multiple proxy levels for weighted traffic. If header is not present or invalid, Envoy will fall back to use the internally generated random value. This header is expected to be single-valued header as we only want to have one selected value throughout the process for the consistency. And the value is a unsigned number between 0 and UINT64_MAX.",
    "notImp": false
  }
] };

export const WeightedCluster_SingleFields = [
  "runtime_key_prefix",
  "random_value_specifier.header_name"
];

export const WeightedCluster_ClusterWeight: OutType = { "WeightedCluster_ClusterWeight": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Only one of ``name`` and ``cluster_header`` may be specified.  Name of the upstream cluster. The cluster must exist in the `cluster manager configuration`.",
    "notImp": false
  },
  {
    "name": "cluster_header",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Only one of ``name`` and ``cluster_header`` may be specified.  Envoy will determine the cluster to route to by reading the value of the HTTP header named by cluster_header from the request headers. If the header is not found or the referenced cluster does not exist, Envoy will return a 404 response.\n\n:::attention\n\nInternally, Envoy always uses the HTTP/2 ``:authority`` header to represent the HTTP/1 ``Host`` header. Thus, if attempting to match on ``Host``, match on ``:authority`` instead. \n:::\n\n:::note\n\nIf the header appears multiple times only the first value is used.",
    "notImp": false
  },
  {
    "name": "weight",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The weight of the cluster. This value is relative to the other clusters' weights. When a request matches the route, the choice of an upstream cluster is determined by its weight. The sum of weights across all entries in the clusters array must be greater than 0, and must not exceed uint32_t maximal value (4294967295).",
    "notImp": false
  },
  {
    "name": "metadata_match",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Metadata",
    "enums": null,
    "comment": "Optional endpoint metadata match criteria used by the subset load balancer. Only endpoints in the upstream cluster with metadata matching what is set in this field will be considered for load balancing. Note that this will be merged with what's provided in `RouteAction.metadata_match`, with values here taking precedence. The filter name should be specified as ``envoy.lb``.",
    "notImp": false
  },
  {
    "name": "request_headers_to_add",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderValueOption[]",
    "enums": null,
    "comment": "Specifies a list of headers to be added to requests when this cluster is selected through the enclosing `envoy_v3_api_msg_config.route.v3.RouteAction`. Headers specified at this level are applied before headers from the enclosing `envoy_v3_api_msg_config.route.v3.Route`, `envoy_v3_api_msg_config.route.v3.VirtualHost`, and `envoy_v3_api_msg_config.route.v3.RouteConfiguration`. For more information, including details on header value syntax, see the documentation on `custom request headers`.",
    "notImp": false
  },
  {
    "name": "request_headers_to_remove",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Specifies a list of HTTP headers that should be removed from each request when this cluster is selected through the enclosing `envoy_v3_api_msg_config.route.v3.RouteAction`.",
    "notImp": false
  },
  {
    "name": "response_headers_to_add",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderValueOption[]",
    "enums": null,
    "comment": "Specifies a list of headers to be added to responses when this cluster is selected through the enclosing `envoy_v3_api_msg_config.route.v3.RouteAction`. Headers specified at this level are applied before headers from the enclosing `envoy_v3_api_msg_config.route.v3.Route`, `envoy_v3_api_msg_config.route.v3.VirtualHost`, and `envoy_v3_api_msg_config.route.v3.RouteConfiguration`. For more information, including details on header value syntax, see the documentation on `custom request headers`.",
    "notImp": false
  },
  {
    "name": "response_headers_to_remove",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Specifies a list of headers to be removed from responses when this cluster is selected through the enclosing `envoy_v3_api_msg_config.route.v3.RouteAction`.",
    "notImp": false
  },
  {
    "name": "typed_per_filter_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, Any>",
    "enums": null,
    "comment": "This field can be used to provide weighted cluster specific per filter config. The key should match the `filter config name`. See `Http filter route specific config` for details.",
    "notImp": false
  },
  {
    "name": "host_rewrite_specifier.host_rewrite_literal",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Indicates that during forwarding, the host header will be swapped with this value.",
    "notImp": false
  }
] };

export const WeightedCluster_ClusterWeight_SingleFields = [
  "name",
  "cluster_header",
  "weight",
  "request_headers_to_remove",
  "response_headers_to_remove",
  "host_rewrite_specifier.host_rewrite_literal"
];

export const WeightedCluster_ClusterWeight_TypedPerFilterConfigEntry: OutType = { "WeightedCluster_ClusterWeight_TypedPerFilterConfigEntry": [
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
    "fieldType": "Any",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const WeightedCluster_ClusterWeight_TypedPerFilterConfigEntry_SingleFields = [
  "key"
];

export const ClusterSpecifierPlugin: OutType = { "ClusterSpecifierPlugin": [
  {
    "name": "extension",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "The name of the plugin and its opaque configuration.",
    "notImp": false
  },
  {
    "name": "is_optional",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If is_optional is not set or is set to false and the plugin defined by this message is not a supported type, the containing resource is NACKed. If is_optional is set to true, the resource would not be NACKed for this reason. In this case, routes referencing this plugin's name would not be treated as an illegal configuration, but would result in a failure if the route is selected.",
    "notImp": false
  }
] };

export const ClusterSpecifierPlugin_SingleFields = [
  "is_optional"
];

export const InternalRedirectPolicy: OutType = { "InternalRedirectPolicy": [
  {
    "name": "max_internal_redirects",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "An internal redirect is not handled, unless the number of previous internal redirects that a downstream request has encountered is lower than this value. In the case where a downstream request is bounced among multiple routes by internal redirect, the first route that hits this threshold, or does not set `internal_redirect_policy` will pass the redirect back to downstream.\n\nIf not specified, at most one redirect will be followed.",
    "notImp": false
  },
  {
    "name": "redirect_response_codes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number[]",
    "enums": null,
    "comment": "Defines what upstream response codes are allowed to trigger internal redirect. If unspecified, only 302 will be treated as internal redirect. Only 301, 302, 303, 307 and 308 are valid values. Any other codes will be ignored.",
    "notImp": false
  },
  {
    "name": "predicates",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig[]",
    "enums": null,
    "comment": "Specifies a list of predicates that are queried when an upstream response is deemed to trigger an internal redirect by all other criteria. Any predicate in the list can reject the redirect, causing the response to be proxied to downstream. extension-category: envoy.internal_redirect_predicates",
    "notImp": false
  },
  {
    "name": "allow_cross_scheme_redirect",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Allow internal redirect to follow a target URI with a different scheme than the value of x-forwarded-proto. The default is false.",
    "notImp": false
  },
  {
    "name": "response_headers_to_copy",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Specifies a list of headers, by name, to copy from the internal redirect into the subsequent request. If a header is specified here but not present in the redirect, it will be cleared in the subsequent request.",
    "notImp": false
  }
] };

export const InternalRedirectPolicy_SingleFields = [
  "max_internal_redirects",
  "redirect_response_codes",
  "allow_cross_scheme_redirect",
  "response_headers_to_copy"
];

export const RouteAction_MaxStreamDuration: OutType = { "RouteAction_MaxStreamDuration": [
  {
    "name": "max_stream_duration",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Specifies the maximum duration allowed for streams on the route. If not specified, the value from the `max_stream_duration` field in `HttpConnectionManager.common_http_protocol_options` is used. If this field is set explicitly to zero, any HttpConnectionManager max_stream_duration timeout will be disabled for this route.",
    "notImp": false
  },
  {
    "name": "grpc_timeout_header_max",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "If present, and the request contains a `grpc-timeout header <https://github.com/grpc/grpc/blob/master/doc/PROTOCOL-HTTP2.md>`_, use that value as the ``max_stream_duration``, but limit the applied timeout to the maximum value specified here. If set to 0, the ``grpc-timeout`` header is used without modification.",
    "notImp": false
  },
  {
    "name": "grpc_timeout_header_offset",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "If present, Envoy will adjust the timeout provided by the ``grpc-timeout`` header by subtracting the provided duration from the header. This is useful for allowing Envoy to set its global timeout to be less than that of the deadline imposed by the calling client, which makes it more likely that Envoy will handle the timeout instead of having the call canceled by the client. If, after applying the offset, the resulting timeout is zero or negative, the stream will timeout immediately.",
    "notImp": false
  }
] };

export const RouteAction_MaxStreamDuration_SingleFields = [
  "max_stream_duration",
  "grpc_timeout_header_max",
  "grpc_timeout_header_offset"
];

export const RouteAction: OutType = { "RouteAction": [
  {
    "name": "cluster_specifier.cluster",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Indicates the upstream cluster to which the request should be routed to.",
    "notImp": false
  },
  {
    "name": "cluster_specifier.cluster_header",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Envoy will determine the cluster to route to by reading the value of the HTTP header named by cluster_header from the request headers. If the header is not found or the referenced cluster does not exist, Envoy will return a 404 response.\n\n:::attention\n\nInternally, Envoy always uses the HTTP/2 ``:authority`` header to represent the HTTP/1 ``Host`` header. Thus, if attempting to match on ``Host``, match on ``:authority`` instead. \n:::\n\n:::note\n\nIf the header appears multiple times only the first value is used.",
    "notImp": false
  },
  {
    "name": "cluster_specifier.weighted_clusters",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "WeightedCluster",
    "enums": null,
    "comment": "Multiple upstream clusters can be specified for a given route. The request is routed to one of the upstream clusters based on weights assigned to each cluster. See `traffic splitting` for additional documentation.",
    "notImp": false
  },
  {
    "name": "cluster_specifier.cluster_specifier_plugin",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Name of the cluster specifier plugin to use to determine the cluster for requests on this route. The cluster specifier plugin name must be defined in the associated `cluster specifier plugins` in the `name` field.",
    "notImp": false
  },
  {
    "name": "cluster_specifier.inline_cluster_specifier_plugin",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "ClusterSpecifierPlugin",
    "enums": null,
    "comment": "Custom cluster specifier plugin configuration to use to determine the cluster for requests on this route.",
    "notImp": false
  },
  {
    "name": "cluster_not_found_response_code",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RouteAction_ClusterNotFoundResponseCode",
    "enums": [
      "SERVICE_UNAVAILABLE",
      "NOT_FOUND",
      "INTERNAL_SERVER_ERROR"
    ],
    "comment": "The HTTP status code to use when configured cluster is not found. The default response code is 503 Service Unavailable.",
    "notImp": false
  },
  {
    "name": "metadata_match",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Metadata",
    "enums": null,
    "comment": "Optional endpoint metadata match criteria used by the subset load balancer. Only endpoints in the upstream cluster with metadata matching what's set in this field will be considered for load balancing. If using `weighted_clusters`, metadata will be merged, with values provided there taking precedence. The filter name should be specified as ``envoy.lb``.",
    "notImp": false
  },
  {
    "name": "prefix_rewrite",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Indicates that during forwarding, the matched prefix (or path) should be swapped with this value. This option allows application URLs to be rooted at a different path from those exposed at the reverse proxy layer. The router filter will place the original path before rewrite into the `x-envoy-original-path` header.\n\nOnly one of `regex_rewrite` `path_rewrite_policy`, or `prefix_rewrite` may be specified.\n\n:::attention\n\nPay careful attention to the use of trailing slashes in the `route's match` prefix value. Stripping a prefix from a path requires multiple Routes to handle all cases. For example, rewriting ``/prefix`` to ``/`` and ``/prefix/etc`` to ``/etc`` cannot be done in a single `Route`, as shown by the below config entries: \n:::\n\n```yaml\n\n    - match:\n        prefix: \"/prefix/\"\n      route:\n        prefix_rewrite: \"/\"\n    - match:\n        prefix: \"/prefix\"\n      route:\n        prefix_rewrite: \"/\"\n```\n\n  Having above entries in the config, requests to ``/prefix`` will be stripped to ``/``, while requests to ``/prefix/etc`` will be stripped to ``/etc``.",
    "notImp": false
  },
  {
    "name": "regex_rewrite",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RegexMatchAndSubstitute",
    "enums": null,
    "comment": "Indicates that during forwarding, portions of the path that match the pattern should be rewritten, even allowing the substitution of capture groups from the pattern into the new path as specified by the rewrite substitution string. This is useful to allow application paths to be rewritten in a way that is aware of segments with variable content like identifiers. The router filter will place the original path as it was before the rewrite into the `x-envoy-original-path` header.\n\nOnly one of `regex_rewrite`, `prefix_rewrite`, or `path_rewrite_policy`] may be specified.\n\nExamples using Google's `RE2 <https://github.com/google/re2>`_ engine:\n\n* The path pattern ``^/service/([^/]+)(/.*)$`` paired with a substitution string of ``\\2/instance/\\1`` would transform ``/service/foo/v1/api`` into ``/v1/api/instance/foo``.\n\n* The pattern ``one`` paired with a substitution string of ``two`` would transform ``/xxx/one/yyy/one/zzz`` into ``/xxx/two/yyy/two/zzz``.\n\n* The pattern ``^(.*?)one(.*)$`` paired with a substitution string of ``\\1two\\2`` would replace only the first occurrence of ``one``, transforming path ``/xxx/one/yyy/one/zzz`` into ``/xxx/two/yyy/one/zzz``.\n\n* The pattern ``(?i)/xxx/`` paired with a substitution string of ``/yyy/`` would do a case-insensitive match and transform path ``/aaa/XxX/bbb`` to ``/aaa/yyy/bbb``.",
    "notImp": false
  },
  {
    "name": "path_rewrite_policy",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "extension-category: envoy.path.rewrite",
    "notImp": false
  },
  {
    "name": "host_rewrite_specifier.host_rewrite_literal",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Indicates that during forwarding, the host header will be swapped with this value. Using this option will append the `config_http_conn_man_headers_x-forwarded-host` header if `append_x_forwarded_host` is set.",
    "notImp": false
  },
  {
    "name": "host_rewrite_specifier.auto_host_rewrite",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Indicates that during forwarding, the host header will be swapped with the hostname of the upstream host chosen by the cluster manager. This option is applicable only when the destination cluster for a route is of type ``strict_dns`` or ``logical_dns``, or when `hostname` field is not empty. Setting this to true with other cluster types has no effect. Using this option will append the `config_http_conn_man_headers_x-forwarded-host` header if `append_x_forwarded_host` is set.",
    "notImp": false
  },
  {
    "name": "host_rewrite_specifier.host_rewrite_header",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Indicates that during forwarding, the host header will be swapped with the content of given downstream or `custom` header. If header value is empty, host header is left intact. Using this option will append the `config_http_conn_man_headers_x-forwarded-host` header if `append_x_forwarded_host` is set.\n\n:::attention\n\nPay attention to the potential security implications of using this option. Provided header must come from trusted source. \n:::\n\n:::note\n\nIf the header appears multiple times only the first value is used.",
    "notImp": false
  },
  {
    "name": "host_rewrite_specifier.host_rewrite_path_regex",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RegexMatchAndSubstitute",
    "enums": null,
    "comment": "Indicates that during forwarding, the host header will be swapped with the result of the regex substitution executed on path value with query and fragment removed. This is useful for transitioning variable content between path segment and subdomain. Using this option will append the `config_http_conn_man_headers_x-forwarded-host` header if `append_x_forwarded_host` is set.\n\nFor example with the following config:\n\n```yaml\n\n    host_rewrite_path_regex:\n      pattern:\n        google_re2: {}\n        regex: \"^/(.+)/.+$\"\n      substitution: \\1\n```\n\nWould rewrite the host header to ``envoyproxy.io`` given the path ``/envoyproxy.io/some/path``.",
    "notImp": false
  },
  {
    "name": "append_x_forwarded_host",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set, then a host rewrite action (one of `host_rewrite_literal`, `auto_host_rewrite`, `host_rewrite_header`, or `host_rewrite_path_regex`) causes the original value of the host header, if any, to be appended to the `config_http_conn_man_headers_x-forwarded-host` HTTP header if it is different to the last value appended.",
    "notImp": false
  },
  {
    "name": "timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Specifies the upstream timeout for the route. If not specified, the default is 15s. This spans between the point at which the entire downstream request (i.e. end-of-stream) has been processed and when the upstream response has been completely processed. A value of 0 will disable the route's timeout.\n\n:::note\n\nThis timeout includes all retries. See also `config_http_filters_router_x-envoy-upstream-rq-timeout-ms`, `config_http_filters_router_x-envoy-upstream-rq-per-try-timeout-ms`, and the `retry overview`.",
    "notImp": false
  },
  {
    "name": "idle_timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Specifies the idle timeout for the route. If not specified, there is no per-route idle timeout, although the connection manager wide `stream_idle_timeout` will still apply. A value of 0 will completely disable the route's idle timeout, even if a connection manager stream idle timeout is configured.\n\nThe idle timeout is distinct to `timeout`, which provides an upper bound on the upstream response time; `idle_timeout` instead bounds the amount of time the request's stream may be idle.\n\nAfter header decoding, the idle timeout will apply on downstream and upstream request events. Each time an encode/decode event for headers or data is processed for the stream, the timer will be reset. If the timeout fires, the stream is terminated with a 408 Request Timeout error code if no upstream response header has been received, otherwise a stream reset occurs.\n\nIf the `overload action` \"envoy.overload_actions.reduce_timeouts\" is configured, this timeout is scaled according to the value for `HTTP_DOWNSTREAM_STREAM_IDLE`.",
    "notImp": false
  },
  {
    "name": "early_data_policy",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "Specifies how to send request over TLS early data. If absent, allows `safe HTTP requests <https://www.rfc-editor.org/rfc/rfc7231#section-4.2.1>`_ to be sent on early data. extension-category: envoy.route.early_data_policy",
    "notImp": false
  },
  {
    "name": "retry_policy",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RetryPolicy",
    "enums": null,
    "comment": "Indicates that the route has a retry policy. Note that if this is set, it'll take precedence over the virtual host level retry policy entirely (e.g.: policies are not merged, most internal one becomes the enforced policy).",
    "notImp": false
  },
  {
    "name": "retry_policy_typed_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "[#not-implemented-hide:] Specifies the configuration for retry policy extension. Note that if this is set, it'll take precedence over the virtual host level retry policy entirely (e.g.: policies are not merged, most internal one becomes the enforced policy). `Retry policy` should not be set if this field is used.",
    "notImp": true
  },
  {
    "name": "request_mirror_policies",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RouteAction_RequestMirrorPolicy[]",
    "enums": null,
    "comment": "Specify a set of route request mirroring policies. It takes precedence over the virtual host and route config mirror policy entirely. That is, policies are not merged, the most specific non-empty one becomes the mirror policies.",
    "notImp": false
  },
  {
    "name": "priority",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RoutingPriority",
    "enums": [
      "DEFAULT",
      "HIGH"
    ],
    "comment": "Optionally specifies the `routing priority`.",
    "notImp": false
  },
  {
    "name": "rate_limits",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RateLimit[]",
    "enums": null,
    "comment": "Specifies a set of rate limit configurations that could be applied to the route.",
    "notImp": false
  },
  {
    "name": "include_vh_rate_limits",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Specifies if the rate limit filter should include the virtual host rate limits. By default, if the route configured rate limits, the virtual host `rate_limits` are not applied to the request.\n\nThis field is deprecated. Please use `vh_rate_limits`",
    "notImp": false
  },
  {
    "name": "hash_policy",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RouteAction_HashPolicy[]",
    "enums": null,
    "comment": "Specifies a list of hash policies to use for ring hash load balancing. Each hash policy is evaluated individually and the combined result is used to route the request. The method of combination is deterministic such that identical lists of hash policies will produce the same hash. Since a hash policy examines specific parts of a request, it can fail to produce a hash (i.e. if the hashed header is not present). If (and only if) all configured hash policies fail to generate a hash, no hash will be produced for the route. In this case, the behavior is the same as if no hash policies were specified (i.e. the ring hash load balancer will choose a random backend). If a hash policy has the \"terminal\" attribute set to true, and there is already a hash generated, the hash is returned immediately, ignoring the rest of the hash policy list.",
    "notImp": false
  },
  {
    "name": "cors",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "CorsPolicy",
    "enums": null,
    "comment": "Indicates that the route has a CORS policy. This field is ignored if related cors policy is found in the `Route.typed_per_filter_config` or `WeightedCluster.ClusterWeight.typed_per_filter_config`.\n\n:::attention\n\nThis option has been deprecated. Please use `Route.typed_per_filter_config` or `WeightedCluster.ClusterWeight.typed_per_filter_config` to configure the CORS HTTP filter. \n:::",
    "notImp": false
  },
  {
    "name": "max_grpc_timeout",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Deprecated by `grpc_timeout_header_max` If present, and the request is a gRPC request, use the `grpc-timeout header <https://github.com/grpc/grpc/blob/master/doc/PROTOCOL-HTTP2.md>`_, or its default value (infinity) instead of `timeout`, but limit the applied timeout to the maximum value specified here. If configured as 0, the maximum allowed timeout for gRPC requests is infinity. If not configured at all, the ``grpc-timeout`` header is not used and gRPC requests time out like any other requests using `timeout` or its default. This can be used to prevent unexpected upstream request timeouts due to potentially long time gaps between gRPC request and response in gRPC streaming mode.\n\n:::note\n\nIf a timeout is specified using `config_http_filters_router_x-envoy-upstream-rq-timeout-ms`, it takes precedence over `grpc-timeout header <https://github.com/grpc/grpc/blob/master/doc/PROTOCOL-HTTP2.md>`_, when both are present. See also `config_http_filters_router_x-envoy-upstream-rq-timeout-ms`, `config_http_filters_router_x-envoy-upstream-rq-per-try-timeout-ms`, and the `retry overview`. \n:::",
    "notImp": false
  },
  {
    "name": "grpc_timeout_offset",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Deprecated by `grpc_timeout_header_offset`. If present, Envoy will adjust the timeout provided by the ``grpc-timeout`` header by subtracting the provided duration from the header. This is useful in allowing Envoy to set its global timeout to be less than that of the deadline imposed by the calling client, which makes it more likely that Envoy will handle the timeout instead of having the call canceled by the client. The offset will only be applied if the provided grpc_timeout is greater than the offset. This ensures that the offset will only ever decrease the timeout and never set it to 0 (meaning infinity).",
    "notImp": false
  },
  {
    "name": "upgrade_configs",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RouteAction_UpgradeConfig[]",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "internal_redirect_policy",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "InternalRedirectPolicy",
    "enums": null,
    "comment": "If present, Envoy will try to follow an upstream redirect response instead of proxying the response back to the downstream. An upstream redirect response is defined by `redirect_response_codes`.",
    "notImp": false
  },
  {
    "name": "internal_redirect_action",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "RouteAction_InternalRedirectAction",
    "enums": [
      "PASS_THROUGH_INTERNAL_REDIRECT",
      "HANDLE_INTERNAL_REDIRECT"
    ],
    "comment": "",
    "notImp": false
  },
  {
    "name": "max_internal_redirects",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "number",
    "enums": null,
    "comment": "An internal redirect is handled, iff the number of previous internal redirects that a downstream request has encountered is lower than this value, and `internal_redirect_action` is set to `HANDLE_INTERNAL_REDIRECT` In the case where a downstream request is bounced among multiple routes by internal redirect, the first route that hits this threshold, or has `internal_redirect_action` set to `PASS_THROUGH_INTERNAL_REDIRECT` will pass the redirect back to downstream.\n\nIf not specified, at most one redirect will be followed.",
    "notImp": false
  },
  {
    "name": "hedge_policy",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HedgePolicy",
    "enums": null,
    "comment": "Indicates that the route has a hedge policy. Note that if this is set, it'll take precedence over the virtual host level hedge policy entirely (e.g.: policies are not merged, most internal one becomes the enforced policy).",
    "notImp": false
  },
  {
    "name": "max_stream_duration",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RouteAction_MaxStreamDuration",
    "enums": null,
    "comment": "Specifies the maximum stream duration for this route.",
    "notImp": false
  }
] };

export const RouteAction_SingleFields = [
  "cluster_specifier.cluster",
  "cluster_specifier.cluster_header",
  "cluster_specifier.cluster_specifier_plugin",
  "cluster_not_found_response_code",
  "prefix_rewrite",
  "host_rewrite_specifier.host_rewrite_literal",
  "host_rewrite_specifier.auto_host_rewrite",
  "host_rewrite_specifier.host_rewrite_header",
  "append_x_forwarded_host",
  "timeout",
  "idle_timeout",
  "priority"
];

export const RouteAction_RequestMirrorPolicy: OutType = { "RouteAction_RequestMirrorPolicy": [
  {
    "name": "cluster",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Only one of ``cluster`` and ``cluster_header`` can be specified.  Specifies the cluster that requests will be mirrored to. The cluster must exist in the cluster manager configuration.",
    "notImp": false
  },
  {
    "name": "cluster_header",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Only one of ``cluster`` and ``cluster_header`` can be specified. Envoy will determine the cluster to route to by reading the value of the HTTP header named by cluster_header from the request headers. Only the first value in header is used, and no shadow request will happen if the value is not found in headers. Envoy will not wait for the shadow cluster to respond before returning the response from the primary cluster.\n\n:::attention\n\nInternally, Envoy always uses the HTTP/2 ``:authority`` header to represent the HTTP/1 ``Host`` header. Thus, if attempting to match on ``Host``, match on ``:authority`` instead. \n:::\n\n:::note\n\nIf the header appears multiple times only the first value is used.",
    "notImp": false
  },
  {
    "name": "runtime_fraction",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RuntimeFractionalPercent",
    "enums": null,
    "comment": "If not specified, all requests to the target cluster will be mirrored.\n\nIf specified, this field takes precedence over the ``runtime_key`` field and requests must also fall under the percentage of matches indicated by this field.\n\nFor some fraction N/D, a random number in the range [0,D) is selected. If the number is <= the value of the numerator N, or if the key is not present, the default value, the request will be mirrored.",
    "notImp": false
  },
  {
    "name": "trace_sampled",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Specifies whether the trace span for the shadow request should be sampled. If this field is not explicitly set, the shadow request will inherit the sampling decision of its parent span. This ensures consistency with the trace sampling policy of the original request and prevents oversampling, especially in scenarios where runtime sampling is disabled.",
    "notImp": false
  },
  {
    "name": "disable_shadow_host_suffix_append",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Disables appending the ``-shadow`` suffix to the shadowed ``Host`` header. Defaults to ``false``.",
    "notImp": false
  }
] };

export const RouteAction_RequestMirrorPolicy_SingleFields = [
  "cluster",
  "cluster_header",
  "trace_sampled",
  "disable_shadow_host_suffix_append"
];

export const RouteAction_HashPolicy: OutType = { "RouteAction_HashPolicy": [
  {
    "name": "policy_specifier.header",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RouteAction_HashPolicy_Header",
    "enums": null,
    "comment": "Header hash policy.",
    "notImp": false
  },
  {
    "name": "policy_specifier.cookie",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RouteAction_HashPolicy_Cookie",
    "enums": null,
    "comment": "Cookie hash policy.",
    "notImp": false
  },
  {
    "name": "policy_specifier.connection_properties",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RouteAction_HashPolicy_ConnectionProperties",
    "enums": null,
    "comment": "Connection properties hash policy.",
    "notImp": false
  },
  {
    "name": "policy_specifier.query_parameter",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RouteAction_HashPolicy_QueryParameter",
    "enums": null,
    "comment": "Query parameter hash policy.",
    "notImp": false
  },
  {
    "name": "policy_specifier.filter_state",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RouteAction_HashPolicy_FilterState",
    "enums": null,
    "comment": "Filter state hash policy.",
    "notImp": false
  },
  {
    "name": "terminal",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "The flag that short-circuits the hash computing. This field provides a 'fallback' style of configuration: \"if a terminal policy doesn't work, fallback to rest of the policy list\", it saves time when the terminal policy works.\n\nIf true, and there is already a hash computed, ignore rest of the list of hash polices. For example, if the following hash methods are configured:\n\n ========= ======== specifier terminal ========= ======== Header A  true Header B  false Header C  false ========= ========\n\nThe generateHash process ends if policy \"header A\" generates a hash, as it's a terminal policy.",
    "notImp": false
  }
] };

export const RouteAction_HashPolicy_SingleFields = [
  "terminal"
];

export const RouteAction_HashPolicy_Header: OutType = { "RouteAction_HashPolicy_Header": [
  {
    "name": "header_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the request header that will be used to obtain the hash key. If the request header is not present, no hash will be produced.",
    "notImp": false
  },
  {
    "name": "regex_rewrite",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RegexMatchAndSubstitute",
    "enums": null,
    "comment": "If specified, the request header value will be rewritten and used to produce the hash key.",
    "notImp": false
  }
] };

export const RouteAction_HashPolicy_Header_SingleFields = [
  "header_name"
];

export const RouteAction_HashPolicy_CookieAttribute: OutType = { "RouteAction_HashPolicy_CookieAttribute": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the cookie attribute.",
    "notImp": false
  },
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The optional value of the cookie attribute.",
    "notImp": false
  }
] };

export const RouteAction_HashPolicy_CookieAttribute_SingleFields = [
  "name",
  "value"
];

export const RouteAction_HashPolicy_Cookie: OutType = { "RouteAction_HashPolicy_Cookie": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the cookie that will be used to obtain the hash key. If the cookie is not present and ttl below is not set, no hash will be produced.",
    "notImp": false
  },
  {
    "name": "ttl",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "If specified, a cookie with the TTL will be generated if the cookie is not present. If the TTL is present and zero, the generated cookie will be a session cookie.",
    "notImp": false
  },
  {
    "name": "path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the path for the cookie. If no path is specified here, no path will be set for the cookie.",
    "notImp": false
  },
  {
    "name": "attributes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RouteAction_HashPolicy_CookieAttribute[]",
    "enums": null,
    "comment": "Additional attributes for the cookie. They will be used when generating a new cookie.",
    "notImp": false
  }
] };

export const RouteAction_HashPolicy_Cookie_SingleFields = [
  "name",
  "ttl",
  "path"
];

export const RouteAction_HashPolicy_ConnectionProperties: OutType = { "RouteAction_HashPolicy_ConnectionProperties": [
  {
    "name": "source_ip",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Hash on source IP address.",
    "notImp": false
  }
] };

export const RouteAction_HashPolicy_ConnectionProperties_SingleFields = [
  "source_ip"
];

export const RouteAction_HashPolicy_QueryParameter: OutType = { "RouteAction_HashPolicy_QueryParameter": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the URL query parameter that will be used to obtain the hash key. If the parameter is not present, no hash will be produced. Query parameter names are case-sensitive. If query parameters are repeated, only the first value will be considered.",
    "notImp": false
  }
] };

export const RouteAction_HashPolicy_QueryParameter_SingleFields = [
  "name"
];

export const RouteAction_HashPolicy_FilterState: OutType = { "RouteAction_HashPolicy_FilterState": [
  {
    "name": "key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the Object in the per-request filterState, which is an Envoy::Hashable object. If there is no data associated with the key, or the stored object is not Envoy::Hashable, no hash will be produced.",
    "notImp": false
  }
] };

export const RouteAction_HashPolicy_FilterState_SingleFields = [
  "key"
];

export const RouteAction_UpgradeConfig_ConnectConfig: OutType = { "RouteAction_UpgradeConfig_ConnectConfig": [
  {
    "name": "proxy_protocol_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ProxyProtocolConfig",
    "enums": null,
    "comment": "If present, the proxy protocol header will be prepended to the CONNECT payload sent upstream.",
    "notImp": false
  },
  {
    "name": "allow_post",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set, the route will also allow forwarding POST payload as raw TCP.",
    "notImp": false
  }
] };

export const RouteAction_UpgradeConfig_ConnectConfig_SingleFields = [
  "allow_post"
];

export const RouteAction_UpgradeConfig: OutType = { "RouteAction_UpgradeConfig": [
  {
    "name": "upgrade_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The case-insensitive name of this upgrade, e.g. \"websocket\". For each upgrade type present in upgrade_configs, requests with Upgrade: [upgrade_type] will be proxied upstream.",
    "notImp": false
  },
  {
    "name": "enabled",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Determines if upgrades are available on this route. Defaults to true.",
    "notImp": false
  },
  {
    "name": "connect_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RouteAction_UpgradeConfig_ConnectConfig",
    "enums": null,
    "comment": "Configuration for sending data upstream as a raw data payload. This is used for CONNECT requests, when forwarding CONNECT payload as raw TCP. Note that CONNECT support is currently considered alpha in Envoy.",
    "notImp": false
  }
] };

export const RouteAction_UpgradeConfig_SingleFields = [
  "upgrade_type",
  "enabled"
];

export const RetryPolicy_RetryHostPredicate: OutType = { "RetryPolicy_RetryHostPredicate": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "config_type.typed_config",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "extension-category: envoy.retry_host_predicates",
    "notImp": false
  }
] };

export const RetryPolicy_RetryHostPredicate_SingleFields = [
  "name"
];

export const RetryPolicy_ResetHeader: OutType = { "RetryPolicy_ResetHeader": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the reset header.\n\n:::note\n\nIf the header appears multiple times only the first value is used.",
    "notImp": false
  },
  {
    "name": "format",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RetryPolicy_ResetHeaderFormat",
    "enums": [
      "SECONDS",
      "UNIX_TIMESTAMP"
    ],
    "comment": "The format of the reset header.",
    "notImp": false
  }
] };

export const RetryPolicy_ResetHeader_SingleFields = [
  "name",
  "format"
];

export const RedirectAction: OutType = { "RedirectAction": [
  {
    "name": "scheme_rewrite_specifier.https_redirect",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "The scheme portion of the URL will be swapped with \"https\".",
    "notImp": false
  },
  {
    "name": "scheme_rewrite_specifier.scheme_redirect",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The scheme portion of the URL will be swapped with this value.",
    "notImp": false
  },
  {
    "name": "host_redirect",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The host portion of the URL will be swapped with this value.",
    "notImp": false
  },
  {
    "name": "port_redirect",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The port value of the URL will be swapped with this value.",
    "notImp": false
  },
  {
    "name": "path_rewrite_specifier.path_redirect",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The path portion of the URL will be swapped with this value. Please note that query string in path_redirect will override the request's query string and will not be stripped.\n\nFor example, let's say we have the following routes:\n\n- match: { path: \"/old-path-1\" } redirect: { path_redirect: \"/new-path-1\" } - match: { path: \"/old-path-2\" } redirect: { path_redirect: \"/new-path-2\", strip-query: \"true\" } - match: { path: \"/old-path-3\" } redirect: { path_redirect: \"/new-path-3?foo=1\", strip_query: \"true\" }\n\n1. if request uri is \"/old-path-1?bar=1\", users will be redirected to \"/new-path-1?bar=1\" 2. if request uri is \"/old-path-2?bar=1\", users will be redirected to \"/new-path-2\" 3. if request uri is \"/old-path-3?bar=1\", users will be redirected to \"/new-path-3?foo=1\"",
    "notImp": false
  },
  {
    "name": "path_rewrite_specifier.prefix_rewrite",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Indicates that during redirection, the matched prefix (or path) should be swapped with this value. This option allows redirect URLs be dynamically created based on the request.\n\n:::attention\n\nPay attention to the use of trailing slashes as mentioned in `RouteAction's prefix_rewrite`.",
    "notImp": false
  },
  {
    "name": "path_rewrite_specifier.regex_rewrite",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RegexMatchAndSubstitute",
    "enums": null,
    "comment": "Indicates that during redirect, portions of the path that match the pattern should be rewritten, even allowing the substitution of capture groups from the pattern into the new path as specified by the rewrite substitution string. This is useful to allow application paths to be rewritten in a way that is aware of segments with variable content like identifiers.\n\nExamples using Google's `RE2 <https://github.com/google/re2>`_ engine:\n\n* The path pattern ``^/service/([^/]+)(/.*)$`` paired with a substitution string of ``\\2/instance/\\1`` would transform ``/service/foo/v1/api`` into ``/v1/api/instance/foo``.\n\n* The pattern ``one`` paired with a substitution string of ``two`` would transform ``/xxx/one/yyy/one/zzz`` into ``/xxx/two/yyy/two/zzz``.\n\n* The pattern ``^(.*?)one(.*)$`` paired with a substitution string of ``\\1two\\2`` would replace only the first occurrence of ``one``, transforming path ``/xxx/one/yyy/one/zzz`` into ``/xxx/two/yyy/one/zzz``.\n\n* The pattern ``(?i)/xxx/`` paired with a substitution string of ``/yyy/`` would do a case-insensitive match and transform path ``/aaa/XxX/bbb`` to ``/aaa/yyy/bbb``.",
    "notImp": false
  },
  {
    "name": "response_code",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RedirectAction_RedirectResponseCode",
    "enums": [
      "MOVED_PERMANENTLY",
      "FOUND",
      "SEE_OTHER",
      "TEMPORARY_REDIRECT",
      "PERMANENT_REDIRECT"
    ],
    "comment": "The HTTP status code to use in the redirect response. The default response code is MOVED_PERMANENTLY (301).",
    "notImp": false
  },
  {
    "name": "strip_query",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Indicates that during redirection, the query portion of the URL will be removed. Default value is false.",
    "notImp": false
  }
] };

export const RedirectAction_SingleFields = [
  "scheme_rewrite_specifier.https_redirect",
  "scheme_rewrite_specifier.scheme_redirect",
  "host_redirect",
  "port_redirect",
  "path_rewrite_specifier.path_redirect",
  "path_rewrite_specifier.prefix_rewrite",
  "response_code",
  "strip_query"
];

export const DirectResponseAction: OutType = { "DirectResponseAction": [
  {
    "name": "status",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Specifies the HTTP response status to be returned.",
    "notImp": false
  },
  {
    "name": "body",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DataSource",
    "enums": null,
    "comment": "Specifies the content of the response body. If this setting is omitted, no body is included in the generated response.\n\n:::note\n\nHeaders can be specified using ``response_headers_to_add`` in the enclosing `envoy_v3_api_msg_config.route.v3.Route`, `envoy_v3_api_msg_config.route.v3.RouteConfiguration` or `envoy_v3_api_msg_config.route.v3.VirtualHost`.",
    "notImp": false
  }
] };

export const DirectResponseAction_SingleFields = [
  "status"
];

export const VirtualCluster: OutType = { "VirtualCluster": [
  {
    "name": "headers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderMatcher[]",
    "enums": null,
    "comment": "Specifies a list of header matchers to use for matching requests. Each specified header must match. The pseudo-headers ``:path`` and ``:method`` can be used to match the request path and method, respectively.",
    "notImp": false
  },
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Specifies the name of the virtual cluster. The virtual cluster name as well as the virtual host name are used when emitting statistics. The statistics are emitted by the router filter and are documented `here`.",
    "notImp": false
  }
] };

export const VirtualCluster_SingleFields = [
  "name"
];

export const RateLimit_Override: OutType = { "RateLimit_Override": [
  {
    "name": "override_specifier.dynamic_metadata",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RateLimit_Override_DynamicMetadata",
    "enums": null,
    "comment": "Limit override from dynamic metadata.",
    "notImp": false
  }
] };

export const RateLimit_HitsAddend: OutType = { "RateLimit_HitsAddend": [
  {
    "name": "number",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Fixed number of hits to add to the rate limit descriptor.\n\nOne of the ``number`` or ``format`` fields should be set but not both.",
    "notImp": false
  },
  {
    "name": "format",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Substitution format string to extract the number of hits to add to the rate limit descriptor. The same `format specifier` as used for `HTTP access logging` applies here.\n\n:::note\n\nThe format string must contains only single valid substitution field. If the format string not meets the requirement, the configuration will be rejected. \n:::\n\n  The substitution field should generates a non-negative number or string representation of a non-negative number. The value of the non-negative number should be less than or equal to 1000000000 like the ``number`` field. If the output of the substitution field not meet the requirement, this will be treated as an error and the current descriptor will be ignored.\n\nFor example, the ``%BYTES_RECEIVED%`` format string will be replaced with the number of bytes received in the request.\n\nOne of the ``number`` or ``format`` fields should be set but not both.",
    "notImp": false
  }
] };

export const RateLimit_HitsAddend_SingleFields = [
  "number",
  "format"
];

export const RateLimit: OutType = { "RateLimit": [
  {
    "name": "stage",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Refers to the stage set in the filter. The rate limit configuration only applies to filters with the same stage number. The default stage number is 0.\n\n:::note\n\nThe filter supports a range of 0 - 10 inclusively for stage numbers. \n:::\n\n:::note\nThis is not supported if the rate limit action is configured in the ``typed_per_filter_config`` like `VirtualHost.typed_per_filter_config` or `Route.typed_per_filter_config`, etc.",
    "notImp": false
  },
  {
    "name": "disable_key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The key to be set in runtime to disable this rate limit configuration.\n\n:::note\nThis is not supported if the rate limit action is configured in the ``typed_per_filter_config`` like `VirtualHost.typed_per_filter_config` or `Route.typed_per_filter_config`, etc.",
    "notImp": false
  },
  {
    "name": "actions",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RateLimit_Action[]",
    "enums": null,
    "comment": "A list of actions that are to be applied for this rate limit configuration. Order matters as the actions are processed sequentially and the descriptor is composed by appending descriptor entries in that sequence. If an action cannot append a descriptor entry, no descriptor is generated for the configuration. See `composing actions` for additional documentation.",
    "notImp": false
  },
  {
    "name": "limit",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RateLimit_Override",
    "enums": null,
    "comment": "An optional limit override to be appended to the descriptor produced by this rate limit configuration. If the override value is invalid or cannot be resolved from metadata, no override is provided. See `rate limit override` for more information.\n\n:::note\nThis is not supported if the rate limit action is configured in the ``typed_per_filter_config`` like `VirtualHost.typed_per_filter_config` or `Route.typed_per_filter_config`, etc.",
    "notImp": false
  },
  {
    "name": "hits_addend",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RateLimit_HitsAddend",
    "enums": null,
    "comment": "An optional hits addend to be appended to the descriptor produced by this rate limit configuration.\n\n:::note\nThis is only supported if the rate limit action is configured in the ``typed_per_filter_config`` like `VirtualHost.typed_per_filter_config` or `Route.typed_per_filter_config`, etc.",
    "notImp": false
  },
  {
    "name": "apply_on_stream_done",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, the rate limit request will be applied when the stream completes. The default value is false. This is useful when the rate limit budget needs to reflect the response context that is not available on the request path.\n\nFor example, let's say the upstream service calculates the usage statistics and returns them in the response body and we want to utilize these numbers to apply the rate limit action for the subsequent requests. Combined with another filter that can set the desired addend based on the response (e.g. Lua filter), this can be used to subtract the usage statistics from the rate limit budget.\n\nA rate limit applied on the stream completion is \"fire-and-forget\" by nature, and rate limit is not enforced by this config. In other words, the current request won't be blocked when this is true, but the budget will be updated for the subsequent requests based on the action with this field set to true. Users should ensure that the rate limit is enforced by the actions applied on the request path, i.e. the ones with this field set to false.\n\nCurrently, this is only supported by the HTTP global rate filter.",
    "notImp": false
  }
] };

export const RateLimit_SingleFields = [
  "stage",
  "disable_key",
  "apply_on_stream_done"
];

export const RateLimit_Action: OutType = { "RateLimit_Action": [
  {
    "name": "action_specifier.source_cluster",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RateLimit_Action_SourceCluster",
    "enums": null,
    "comment": "Rate limit on source cluster.",
    "notImp": false
  },
  {
    "name": "action_specifier.destination_cluster",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RateLimit_Action_DestinationCluster",
    "enums": null,
    "comment": "Rate limit on destination cluster.",
    "notImp": false
  },
  {
    "name": "action_specifier.request_headers",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RateLimit_Action_RequestHeaders",
    "enums": null,
    "comment": "Rate limit on request headers.",
    "notImp": false
  },
  {
    "name": "action_specifier.query_parameters",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RateLimit_Action_QueryParameters",
    "enums": null,
    "comment": "Rate limit on query parameters.",
    "notImp": false
  },
  {
    "name": "action_specifier.remote_address",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RateLimit_Action_RemoteAddress",
    "enums": null,
    "comment": "Rate limit on remote address.",
    "notImp": false
  },
  {
    "name": "action_specifier.generic_key",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RateLimit_Action_GenericKey",
    "enums": null,
    "comment": "Rate limit on a generic key.",
    "notImp": false
  },
  {
    "name": "action_specifier.header_value_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RateLimit_Action_HeaderValueMatch",
    "enums": null,
    "comment": "Rate limit on the existence of request headers.",
    "notImp": false
  },
  {
    "name": "action_specifier.dynamic_metadata",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RateLimit_Action_DynamicMetaData",
    "enums": null,
    "comment": "Rate limit on dynamic metadata.\n\n:::attention\nThis field has been deprecated in favor of the `metadata` field",
    "notImp": false
  },
  {
    "name": "action_specifier.metadata",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RateLimit_Action_MetaData",
    "enums": null,
    "comment": "Rate limit on metadata.",
    "notImp": false
  },
  {
    "name": "action_specifier.extension",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "Rate limit descriptor extension. See the rate limit descriptor extensions documentation.\n\n`HTTP matching input functions` are permitted as descriptor extensions. The input functions are only looked up if there is no rate limit descriptor extension matching the type URL.\n\nextension-category: envoy.rate_limit_descriptors",
    "notImp": false
  },
  {
    "name": "action_specifier.masked_remote_address",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RateLimit_Action_MaskedRemoteAddress",
    "enums": null,
    "comment": "Rate limit on masked remote address.",
    "notImp": false
  },
  {
    "name": "action_specifier.query_parameter_value_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RateLimit_Action_QueryParameterValueMatch",
    "enums": null,
    "comment": "Rate limit on the existence of query parameters.",
    "notImp": false
  }
] };

export const RateLimit_Action_RequestHeaders: OutType = { "RateLimit_Action_RequestHeaders": [
  {
    "name": "header_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The header name to be queried from the request headers. The header’s value is used to populate the value of the descriptor entry for the descriptor_key.",
    "notImp": false
  },
  {
    "name": "descriptor_key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The key to use in the descriptor entry.",
    "notImp": false
  },
  {
    "name": "skip_if_absent",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Controls the behavior when the specified header is not present in the request.\n\nIf set to ``false`` (default):\n\n* Envoy does **NOT** call the rate limiting service for this descriptor. * Useful if the header is optional and you prefer to skip rate limiting when it's absent.\n\nIf set to ``true``:\n\n* Envoy calls the rate limiting service but omits this descriptor if the header is missing. * Useful if you want Envoy to enforce rate limiting even when the header is not present.",
    "notImp": false
  }
] };

export const RateLimit_Action_RequestHeaders_SingleFields = [
  "header_name",
  "descriptor_key",
  "skip_if_absent"
];

export const RateLimit_Action_QueryParameters: OutType = { "RateLimit_Action_QueryParameters": [
  {
    "name": "query_parameter_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the query parameter to use for rate limiting. Value of this query parameter is used to populate the value of the descriptor entry for the descriptor_key.",
    "notImp": false
  },
  {
    "name": "descriptor_key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The key to use when creating the rate limit descriptor entry. his descriptor key will be used to identify the rate limit rule in the rate limiting service.",
    "notImp": false
  },
  {
    "name": "skip_if_absent",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Controls the behavior when the specified query parameter is not present in the request.\n\nIf set to ``false`` (default):\n\n* Envoy does **NOT** call the rate limiting service for this descriptor. * Useful if the query parameter is optional and you prefer to skip rate limiting when it's absent.\n\nIf set to ``true``:\n\n* Envoy calls the rate limiting service but omits this descriptor if the query parameter is missing. * Useful if you want Envoy to enforce rate limiting even when the query parameter is not present.",
    "notImp": false
  }
] };

export const RateLimit_Action_QueryParameters_SingleFields = [
  "query_parameter_name",
  "descriptor_key",
  "skip_if_absent"
];

export const RateLimit_Action_MaskedRemoteAddress: OutType = { "RateLimit_Action_MaskedRemoteAddress": [
  {
    "name": "v4_prefix_mask_len",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Length of prefix mask len for IPv4 (e.g. 0, 32). Defaults to 32 when unset. For example, trusted address from x-forwarded-for is ``192.168.1.1``, the descriptor entry is (\"masked_remote_address\", \"192.168.1.1/32\"); if mask len is 24, the descriptor entry is (\"masked_remote_address\", \"192.168.1.0/24\").",
    "notImp": false
  },
  {
    "name": "v6_prefix_mask_len",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Length of prefix mask len for IPv6 (e.g. 0, 128). Defaults to 128 when unset. For example, trusted address from x-forwarded-for is ``2001:abcd:ef01:2345:6789:abcd:ef01:234``, the descriptor entry is (\"masked_remote_address\", \"2001:abcd:ef01:2345:6789:abcd:ef01:234/128\"); if mask len is 64, the descriptor entry is (\"masked_remote_address\", \"2001:abcd:ef01:2345::/64\").",
    "notImp": false
  }
] };

export const RateLimit_Action_MaskedRemoteAddress_SingleFields = [
  "v4_prefix_mask_len",
  "v6_prefix_mask_len"
];

export const RateLimit_Action_GenericKey: OutType = { "RateLimit_Action_GenericKey": [
  {
    "name": "descriptor_value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The value to use in the descriptor entry.",
    "notImp": false
  },
  {
    "name": "descriptor_key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "An optional key to use in the descriptor entry. If not set it defaults to 'generic_key' as the descriptor key.",
    "notImp": false
  }
] };

export const RateLimit_Action_GenericKey_SingleFields = [
  "descriptor_value",
  "descriptor_key"
];

export const RateLimit_Action_HeaderValueMatch: OutType = { "RateLimit_Action_HeaderValueMatch": [
  {
    "name": "descriptor_key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The key to use in the descriptor entry. Defaults to ``header_match``.",
    "notImp": false
  },
  {
    "name": "descriptor_value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The value to use in the descriptor entry.",
    "notImp": false
  },
  {
    "name": "expect_match",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set to true, the action will append a descriptor entry when the request matches the headers. If set to false, the action will append a descriptor entry when the request does not match the headers. The default value is true.",
    "notImp": false
  },
  {
    "name": "headers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderMatcher[]",
    "enums": null,
    "comment": "Specifies a set of headers that the rate limit action should match on. The action will check the request’s headers against all the specified headers in the config. A match will happen if all the headers in the config are present in the request with the same values (or based on presence if the value field is not in the config).",
    "notImp": false
  }
] };

export const RateLimit_Action_HeaderValueMatch_SingleFields = [
  "descriptor_key",
  "descriptor_value",
  "expect_match"
];

export const RateLimit_Action_DynamicMetaData: OutType = { "RateLimit_Action_DynamicMetaData": [
  {
    "name": "descriptor_key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The key to use in the descriptor entry.",
    "notImp": false
  },
  {
    "name": "metadata_key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "MetadataKey",
    "enums": null,
    "comment": "Metadata struct that defines the key and path to retrieve the string value. A match will only happen if the value in the dynamic metadata is of type string.",
    "notImp": false
  },
  {
    "name": "default_value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "An optional value to use if ``metadata_key`` is empty. If not set and no value is present under the metadata_key then no descriptor is generated.",
    "notImp": false
  }
] };

export const RateLimit_Action_DynamicMetaData_SingleFields = [
  "descriptor_key",
  "default_value"
];

export const RateLimit_Action_MetaData: OutType = { "RateLimit_Action_MetaData": [
  {
    "name": "descriptor_key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The key to use in the descriptor entry.",
    "notImp": false
  },
  {
    "name": "metadata_key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "MetadataKey",
    "enums": null,
    "comment": "Metadata struct that defines the key and path to retrieve the string value. A match will only happen if the value in the metadata is of type string.",
    "notImp": false
  },
  {
    "name": "default_value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "An optional value to use if ``metadata_key`` is empty. If not set and no value is present under the metadata_key then ``skip_if_absent`` is followed to skip calling the rate limiting service or skip the descriptor.",
    "notImp": false
  },
  {
    "name": "source",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RateLimit_Action_MetaData_Source",
    "enums": [
      "DYNAMIC",
      "ROUTE_ENTRY"
    ],
    "comment": "Source of metadata",
    "notImp": false
  },
  {
    "name": "skip_if_absent",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Controls the behavior when the specified ``metadata_key`` is empty and ``default_value`` is not set.\n\nIf set to ``false`` (default):\n\n* Envoy does **NOT** call the rate limiting service for this descriptor. * Useful if the metadata is optional and you prefer to skip rate limiting when it's absent.\n\nIf set to ``true``:\n\n* Envoy calls the rate limiting service but omits this descriptor if the ``metadata_key`` is empty and ``default_value`` is missing. * Useful if you want Envoy to enforce rate limiting even when the metadata is not present.",
    "notImp": false
  }
] };

export const RateLimit_Action_MetaData_SingleFields = [
  "descriptor_key",
  "default_value",
  "source",
  "skip_if_absent"
];

export const RateLimit_Action_QueryParameterValueMatch: OutType = { "RateLimit_Action_QueryParameterValueMatch": [
  {
    "name": "descriptor_key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The key to use in the descriptor entry. Defaults to ``query_match``.",
    "notImp": false
  },
  {
    "name": "descriptor_value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The value to use in the descriptor entry.",
    "notImp": false
  },
  {
    "name": "expect_match",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set to true, the action will append a descriptor entry when the request matches the headers. If set to false, the action will append a descriptor entry when the request does not match the headers. The default value is true.",
    "notImp": false
  },
  {
    "name": "query_parameters",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "QueryParameterMatcher[]",
    "enums": null,
    "comment": "Specifies a set of query parameters that the rate limit action should match on. The action will check the request’s query parameters against all the specified query parameters in the config. A match will happen if all the query parameters in the config are present in the request with the same values (or based on presence if the value field is not in the config).",
    "notImp": false
  }
] };

export const RateLimit_Action_QueryParameterValueMatch_SingleFields = [
  "descriptor_key",
  "descriptor_value",
  "expect_match"
];

export const RateLimit_Override_DynamicMetadata: OutType = { "RateLimit_Override_DynamicMetadata": [
  {
    "name": "metadata_key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "MetadataKey",
    "enums": null,
    "comment": "Metadata struct that defines the key and path to retrieve the struct value. The value must be a struct containing an integer \"requests_per_unit\" property and a \"unit\" property with a value parseable to `RateLimitUnit enum`",
    "notImp": false
  }
] };

export const HeaderMatcher: OutType = { "HeaderMatcher": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Specifies the name of the header in the request.",
    "notImp": false
  },
  {
    "name": "header_match_specifier.exact_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "If specified, header match will be performed based on the value of the header. This field is deprecated. Please use `string_match`.",
    "notImp": false
  },
  {
    "name": "header_match_specifier.safe_regex_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RegexMatcher",
    "enums": null,
    "comment": "If specified, this regex string is a regular expression rule which implies the entire request header value must match the regex. The rule will not match if only a subsequence of the request header value matches the regex. This field is deprecated. Please use `string_match`.",
    "notImp": false
  },
  {
    "name": "header_match_specifier.range_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Int64Range",
    "enums": null,
    "comment": "If specified, header match will be performed based on range. The rule will match if the request header value is within this range. The entire request header value must represent an integer in base 10 notation: consisting of an optional plus or minus sign followed by a sequence of digits. The rule will not match if the header value does not represent an integer. Match will fail for empty values, floating point numbers or if only a subsequence of the header value is an integer.\n\nExamples:\n\n* For range [-10,0), route will match for header value -1, but not for 0, ``somestring``, 10.9, ``-1somestring``",
    "notImp": false
  },
  {
    "name": "header_match_specifier.present_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If specified as true, header match will be performed based on whether the header is in the request. If specified as false, header match will be performed based on whether the header is absent.",
    "notImp": false
  },
  {
    "name": "header_match_specifier.prefix_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "If specified, header match will be performed based on the prefix of the header value. Note: empty prefix is not allowed, please use present_match instead. This field is deprecated. Please use `string_match`.\n\nExamples:\n\n* The prefix ``abcd`` matches the value ``abcdxyz``, but not for ``abcxyz``.",
    "notImp": false
  },
  {
    "name": "header_match_specifier.suffix_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "If specified, header match will be performed based on the suffix of the header value. Note: empty suffix is not allowed, please use present_match instead. This field is deprecated. Please use `string_match`.\n\nExamples:\n\n* The suffix ``abcd`` matches the value ``xyzabcd``, but not for ``xyzbcd``.",
    "notImp": false
  },
  {
    "name": "header_match_specifier.contains_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "If specified, header match will be performed based on whether the header value contains the given value or not. Note: empty contains match is not allowed, please use present_match instead. This field is deprecated. Please use `string_match`.\n\nExamples:\n\n* The value ``abcd`` matches the value ``xyzabcdpqr``, but not for ``xyzbcdpqr``.",
    "notImp": false
  },
  {
    "name": "header_match_specifier.string_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "StringMatcher",
    "enums": null,
    "comment": "If specified, header match will be performed based on the string match of the header value.",
    "notImp": false
  },
  {
    "name": "invert_match",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If specified, the match result will be inverted before checking. Defaults to false.\n\nExamples:\n\n* The regex ``\\d{3}`` does not match the value ``1234``, so it will match when inverted. * The range [-10,0) will match the value -1, so it will not match when inverted.",
    "notImp": false
  },
  {
    "name": "treat_missing_header_as_empty",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If specified, for any header match rule, if the header match rule specified header does not exist, this header value will be treated as empty. Defaults to false.\n\nExamples:\n\n* The header match rule specified header \"header1\" to range match of [0, 10], `invert_match` is set to true and `treat_missing_header_as_empty` is set to true; The \"header1\" header is not present. The match rule will treat the \"header1\" as an empty header. The empty header does not match the range, so it will match when inverted. * The header match rule specified header \"header2\" to range match of [0, 10], `invert_match` is set to true and `treat_missing_header_as_empty` is set to false; The \"header2\" header is not present and the header matcher rule for \"header2\" will be ignored so it will not match. * The header match rule specified header \"header3\" to a string regex match ``^$`` which means an empty string, and `treat_missing_header_as_empty` is set to true; The \"header3\" header is not present. The match rule will treat the \"header3\" header as an empty header so it will match. * The header match rule specified header \"header4\" to a string regex match ``^$`` which means an empty string, and `treat_missing_header_as_empty` is set to false; The \"header4\" header is not present. The match rule for \"header4\" will be ignored so it will not match.",
    "notImp": false
  }
] };

export const HeaderMatcher_SingleFields = [
  "name",
  "header_match_specifier.exact_match",
  "header_match_specifier.present_match",
  "header_match_specifier.prefix_match",
  "header_match_specifier.suffix_match",
  "header_match_specifier.contains_match",
  "invert_match",
  "treat_missing_header_as_empty"
];

export const QueryParameterMatcher: OutType = { "QueryParameterMatcher": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Specifies the name of a key that must be present in the requested ``path``'s query string.",
    "notImp": false
  },
  {
    "name": "query_parameter_match_specifier.string_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "StringMatcher",
    "enums": null,
    "comment": "Specifies whether a query parameter value should match against a string.",
    "notImp": false
  },
  {
    "name": "query_parameter_match_specifier.present_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Specifies whether a query parameter should be present.",
    "notImp": false
  }
] };

export const QueryParameterMatcher_SingleFields = [
  "name",
  "query_parameter_match_specifier.present_match"
];

export const FilterConfig: OutType = { "FilterConfig": [
  {
    "name": "config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "The filter config.",
    "notImp": false
  },
  {
    "name": "is_optional",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, the filter is optional, meaning that if the client does not support the specified filter, it may ignore the map entry rather than rejecting the config.",
    "notImp": false
  },
  {
    "name": "disabled",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, the filter is disabled in the route or virtual host and the ``config`` field is ignored. See `route based filter chain` for more details.\n\n:::note\n\nThis field will take effect when the request arrive and filter chain is created for the request. If initial route is selected for the request and a filter is disabled in the initial route, then the filter will not be added to the filter chain. And if the request is mutated later and re-match to another route, the disabled filter by the initial route will not be added back to the filter chain because the filter chain is already created and it is too late to change the chain. \n:::\n\n  This field only make sense for the downstream HTTP filters for now.",
    "notImp": false
  }
] };

export const FilterConfig_SingleFields = [
  "is_optional",
  "disabled"
];