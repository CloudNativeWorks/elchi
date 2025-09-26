import {OutType} from '@elchi/tags/tagsType';


export const ExtProcHttpService: OutType = { "ExtProcHttpService": [
  {
    "name": "http_service",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HttpService",
    "enums": null,
    "comment": "Sets the HTTP service which the external processing requests must be sent to.",
    "notImp": false
  }
] };

export const HeaderForwardingRules: OutType = { "HeaderForwardingRules": [
  {
    "name": "allowed_headers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ListStringMatcher",
    "enums": null,
    "comment": "If set, specifically allow any header in this list to be forwarded to the external processing server. This can be overridden by the below ``disallowed_headers``.",
    "notImp": false
  },
  {
    "name": "disallowed_headers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ListStringMatcher",
    "enums": null,
    "comment": "If set, specifically disallow any header in this list to be forwarded to the external processing server. This overrides the above ``allowed_headers`` if a header matches both.",
    "notImp": false
  }
] };

export const MetadataOptions_MetadataNamespaces: OutType = { "MetadataOptions_MetadataNamespaces": [
  {
    "name": "untyped",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Specifies a list of metadata namespaces whose values, if present, will be passed to the ``ext_proc`` service as an opaque ``protobuf::Struct``.",
    "notImp": false
  },
  {
    "name": "typed",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Specifies a list of metadata namespaces whose values, if present, will be passed to the ``ext_proc`` service as a ``protobuf::Any``. This allows envoy and the external processing server to share the protobuf message definition for safe parsing.",
    "notImp": false
  }
] };

export const MetadataOptions_MetadataNamespaces_SingleFields = [
  "untyped",
  "typed"
];

export const MetadataOptions: OutType = { "MetadataOptions": [
  {
    "name": "forwarding_namespaces",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "MetadataOptions_MetadataNamespaces",
    "enums": null,
    "comment": "Describes which typed or untyped dynamic metadata namespaces to forward to the external processing server.",
    "notImp": false
  },
  {
    "name": "receiving_namespaces",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "MetadataOptions_MetadataNamespaces",
    "enums": null,
    "comment": "Describes which typed or untyped dynamic metadata namespaces to accept from the external processing server. Set to empty or leave unset to disallow writing any received dynamic metadata. Receiving of typed metadata is not supported.",
    "notImp": false
  }
] };

export const ExternalProcessor: OutType = { "ExternalProcessor": [
  {
    "name": "grpc_service",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "GrpcService",
    "enums": null,
    "comment": "Configuration for the gRPC service that the filter will communicate with. The filter supports both the \"Envoy\" and \"Google\" gRPC clients. Only one of ``grpc_service`` or ``http_service`` can be set. It is required that one of them must be set.",
    "notImp": false
  },
  {
    "name": "http_service",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ExtProcHttpService",
    "enums": null,
    "comment": "Configuration for the HTTP service that the filter will communicate with. Only one of ``http_service`` or `grpc_service` can be set. It is required that one of them must be set.\n\nIf ``http_service`` is set, the `processing_mode` cannot be configured to send any body or trailers. i.e., ``http_service`` only supports sending request or response headers to the side stream server.\n\nWith this configuration, Envoy behavior:\n\n1. The headers are first put in a proto message `ProcessingRequest`.\n\n2. This proto message is then transcoded into a JSON text.\n\n3. Envoy then sends an HTTP POST message with content-type as \"application/json\", and this JSON text as body to the side stream server.\n\nAfter the side-stream receives this HTTP request message, it is expected to do as follows:\n\n1. It converts the body, which is a JSON string, into a ``ProcessingRequest`` proto message to examine and mutate the headers.\n\n2. It then sets the mutated headers into a new proto message `ProcessingResponse`.\n\n3. It converts the ``ProcessingResponse`` proto message into a JSON text.\n\n4. It then sends an HTTP response back to Envoy with status code as ``\"200\"``, ``content-type`` as ``\"application/json\"`` and sets the JSON text as the body.",
    "notImp": false
  },
  {
    "name": "failure_mode_allow",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If the ``BodySendMode`` in the `processing_mode` is set to ``FULL_DUPLEX_STREAMED``, ``failure_mode_allow`` can not be set to true.\n\nOtherwise, by default, if in the following cases:\n\n1. The gRPC stream cannot be established.\n\n2. The gRPC stream is closed prematurely with an error.\n\n3. The external processing timeouts.\n\n4. The ext_proc server sends back spurious response messages.\n\nThe filter will fail and a local reply with error code 504(for timeout case) or 500(for all other cases), will be sent to the downstream.\n\nHowever, with this parameter set to true and if the above cases happen, the processing continues without error.",
    "notImp": false
  },
  {
    "name": "processing_mode",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ProcessingMode",
    "enums": null,
    "comment": "Specifies default options for how HTTP headers, trailers, and bodies are sent. See ``ProcessingMode`` for details.",
    "notImp": false
  },
  {
    "name": "request_attributes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Envoy provides a number of `attributes` for expressive policies. Each attribute name provided in this field will be matched against that list and populated in the ``request_headers`` message. See the `attribute documentation` for the list of supported attributes and their types.",
    "notImp": false
  },
  {
    "name": "response_attributes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Envoy provides a number of `attributes` for expressive policies. Each attribute name provided in this field will be matched against that list and populated in the ``response_headers`` message. See the `attribute documentation` for the list of supported attributes and their types.",
    "notImp": false
  },
  {
    "name": "message_timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Specifies the timeout for each individual message sent on the stream and when the filter is running in synchronous mode. Whenever the proxy sends a message on the stream that requires a response, it will reset this timer, and will stop processing and return an error (subject to the processing mode) if the timer expires before a matching response is received. There is no timeout when the filter is running in asynchronous mode. Zero is a valid config which means the timer will be triggered immediately. If not configured, default is 200 milliseconds.",
    "notImp": false
  },
  {
    "name": "stat_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Optional additional prefix to use when emitting statistics. This allows to distinguish emitted statistics between configured ``ext_proc`` filters in an HTTP filter chain.",
    "notImp": false
  },
  {
    "name": "mutation_rules",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderMutationRules",
    "enums": null,
    "comment": "Rules that determine what modifications an external processing server may make to message headers. If not set, all headers may be modified except for \"host\", \":authority\", \":scheme\", \":method\", and headers that start with the header prefix set via `header_prefix` (which is usually \"x-envoy\"). Note that changing headers such as \"host\" or \":authority\" may not in itself change Envoy's routing decision, as routes can be cached. To also force the route to be recomputed, set the `clear_route_cache` field to true in the same response.",
    "notImp": false
  },
  {
    "name": "max_message_timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Specify the upper bound of `override_message_timeout` If not specified, by default it is 0, which will effectively disable the ``override_message_timeout`` API.",
    "notImp": false
  },
  {
    "name": "forward_rules",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderForwardingRules",
    "enums": null,
    "comment": "Allow headers matching the ``forward_rules`` to be forwarded to the external processing server. If not set, all headers are forwarded to the external processing server.",
    "notImp": false
  },
  {
    "name": "filter_metadata",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "{ [key: string]: any; }",
    "enums": null,
    "comment": "Additional metadata to be added to the filter state for logging purposes. The metadata will be added to StreamInfo's filter state under the namespace corresponding to the ext_proc filter name.",
    "notImp": false
  },
  {
    "name": "allow_mode_override",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If ``allow_mode_override`` is set to true, the filter config `processing_mode` can be overridden by the response message from the external processing server `mode_override`. If not set, ``mode_override`` API in the response message will be ignored.",
    "notImp": false
  },
  {
    "name": "disable_immediate_response",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set to true, ignore the `immediate_response` message in an external processor response. In such case, no local reply will be sent. Instead, the stream to the external processor will be closed. There will be no more external processing for this stream from now on.",
    "notImp": false
  },
  {
    "name": "metadata_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "MetadataOptions",
    "enums": null,
    "comment": "Options related to the sending and receiving of dynamic metadata.",
    "notImp": false
  },
  {
    "name": "observability_mode",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, send each part of the HTTP request or response specified by ``ProcessingMode`` without pausing on filter chain iteration. It is \"Send and Go\" mode that can be used by external processor to observe Envoy data and status. In this mode:\n\n1. Only ``STREAMED`` body processing mode is supported and any other body processing modes will be ignored. ``NONE`` mode (i.e., skip body processing) will still work as expected.\n\n2. External processor should not send back processing response, as any responses will be ignored. This also means that `message_timeout` restriction doesn't apply to this mode.\n\n3. External processor may still close the stream to indicate that no more messages are needed.\n\n:::warning\n\nFlow control is a necessary mechanism to prevent the fast sender (either downstream client or upstream server) from overwhelming the external processor when its processing speed is slower. This protective measure is being explored and developed but has not been ready yet, so please use your own discretion when enabling this feature. This work is currently tracked under https://github.com/envoyproxy/envoy/issues/33319.",
    "notImp": false
  },
  {
    "name": "disable_clear_route_cache",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Prevents clearing the route-cache when the `clear_route_cache` field is set in an external processor response. Only one of ``disable_clear_route_cache`` or ``route_cache_action`` can be set. It is recommended to set ``route_cache_action`` which supersedes ``disable_clear_route_cache``.",
    "notImp": false
  },
  {
    "name": "route_cache_action",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ExternalProcessor_RouteCacheAction",
    "enums": [
      "DEFAULT",
      "CLEAR",
      "RETAIN"
    ],
    "comment": "Specifies the action to be taken when an external processor response is received in response to request headers. It is recommended to set this field rather than set `disable_clear_route_cache`. Only one of ``disable_clear_route_cache`` or ``route_cache_action`` can be set.",
    "notImp": false
  },
  {
    "name": "deferred_close_timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Specifies the deferred closure timeout for gRPC stream that connects to external processor. Currently, the deferred stream closure is only used in `observability_mode`. In observability mode, gRPC streams may be held open to the external processor longer than the lifetime of the regular client to backend stream lifetime. In this case, Envoy will eventually timeout the external processor stream according to this time limit. The default value is 5000 milliseconds (5 seconds) if not specified.",
    "notImp": false
  },
  {
    "name": "send_body_without_waiting_for_header_response",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Send body to the side stream server once it arrives without waiting for the header response from that server. It only works for ``STREAMED`` body processing mode. For any other body processing modes, it is ignored. The server has two options upon receiving a header request:\n\n1. Instant Response: send the header response as soon as the header request is received.\n\n2. Delayed Response: wait for the body before sending any response.\n\nIn all scenarios, the header-body ordering must always be maintained.\n\nIf enabled Envoy will ignore the `mode_override` value that the server sends in the header response. This is because Envoy may have already sent the body to the server, prior to processing the header response.",
    "notImp": false
  },
  {
    "name": "allowed_override_modes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ProcessingMode[]",
    "enums": null,
    "comment": "When `allow_mode_override` is enabled and ``allowed_override_modes`` is configured, the filter config `processing_mode` can only be overridden by the response message from the external processing server iff the `mode_override` is allowed by the ``allowed_override_modes`` allow-list below. Since ``request_header_mode`` is not applicable in any way, it's ignored in comparison.",
    "notImp": false
  },
  {
    "name": "on_processing_response",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "Decorator to introduce custom logic that runs after a message received from the External Processor is processed, but before continuing filter chain iteration.\n\n:::note\nResponse processors are currently in alpha. \n:::\n\nextension-category: envoy.http.ext_proc.response_processors",
    "notImp": false
  }
] };

export const ExternalProcessor_SingleFields = [
  "failure_mode_allow",
  "request_attributes",
  "response_attributes",
  "message_timeout",
  "stat_prefix",
  "max_message_timeout",
  "allow_mode_override",
  "disable_immediate_response",
  "observability_mode",
  "disable_clear_route_cache",
  "route_cache_action",
  "deferred_close_timeout",
  "send_body_without_waiting_for_header_response"
];

export const ExtProcPerRoute: OutType = { "ExtProcPerRoute": [
  {
    "name": "override.disabled",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Disable the filter for this particular vhost or route. If disabled is specified in multiple per-filter-configs, the most specific one will be used.",
    "notImp": false
  },
  {
    "name": "override.overrides",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "ExtProcOverrides",
    "enums": null,
    "comment": "Override aspects of the configuration for this route. A set of overrides in a more specific configuration will override a \"disabled\" flag set in a less-specific one.",
    "notImp": false
  }
] };

export const ExtProcPerRoute_SingleFields = [
  "override.disabled"
];

export const ExtProcOverrides: OutType = { "ExtProcOverrides": [
  {
    "name": "processing_mode",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ProcessingMode",
    "enums": null,
    "comment": "Set a different processing mode for this route than the default.",
    "notImp": false
  },
  {
    "name": "async_mode",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "[#not-implemented-hide:] Set a different asynchronous processing option than the default.",
    "notImp": true
  },
  {
    "name": "request_attributes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "[#not-implemented-hide:] Set different optional attributes than the default setting of the ``request_attributes`` field.",
    "notImp": true
  },
  {
    "name": "response_attributes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "[#not-implemented-hide:] Set different optional properties than the default setting of the ``response_attributes`` field.",
    "notImp": true
  },
  {
    "name": "grpc_service",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "GrpcService",
    "enums": null,
    "comment": "Set a different gRPC service for this route than the default.",
    "notImp": false
  },
  {
    "name": "metadata_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "MetadataOptions",
    "enums": null,
    "comment": "Options related to the sending and receiving of dynamic metadata. Lists of forwarding and receiving namespaces will be overridden in their entirety, meaning the most-specific config that specifies this override will be the final config used. It is the prerogative of the control plane to ensure this most-specific config contains the correct final overrides.",
    "notImp": false
  },
  {
    "name": "grpc_initial_metadata",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderValue[]",
    "enums": null,
    "comment": "Additional metadata to include into streams initiated to the ``ext_proc`` gRPC service. This can be used for scenarios in which additional ad hoc authorization headers (e.g. ``x-foo-bar: baz-key``) are to be injected or when a route needs to partially override inherited metadata.",
    "notImp": false
  },
  {
    "name": "failure_mode_allow",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, the filter will not fail closed if the gRPC stream is prematurely closed or could not be opened. This field is the per-route override of `failure_mode_allow`.",
    "notImp": false
  }
] };

export const ExtProcOverrides_SingleFields = [
  "async_mode",
  "request_attributes",
  "response_attributes",
  "failure_mode_allow"
];