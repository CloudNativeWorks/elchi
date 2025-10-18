import {OutType} from '@elchi/tags/tagsType';


export const ZipkinConfig: OutType = { "ZipkinConfig": [
  {
    "name": "collector_cluster",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The cluster manager cluster that hosts the Zipkin collectors. Note: This field will be deprecated in future releases in favor of `collector_service`. Either this field or collector_service must be specified.",
    "notImp": false
  },
  {
    "name": "collector_endpoint",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The API endpoint of the Zipkin service where the spans will be sent. When using a standard Zipkin installation. Note: This field will be deprecated in future releases in favor of `collector_service`. Required when using collector_cluster.",
    "notImp": false
  },
  {
    "name": "trace_id_128bit",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Determines whether a 128bit trace id will be used when creating a new trace instance. The default value is false, which will result in a 64 bit trace id being used.",
    "notImp": false
  },
  {
    "name": "shared_span_context",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Determines whether client and server spans will share the same span context. The default value is true.",
    "notImp": false
  },
  {
    "name": "collector_endpoint_version",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ZipkinConfig_CollectorEndpointVersion",
    "enums": [
      "DEPRECATED_AND_UNAVAILABLE_DO_NOT_USE",
      "HTTP_JSON",
      "HTTP_PROTO",
      "GRPC"
    ],
    "comment": "Determines the selected collector endpoint version.",
    "notImp": false
  },
  {
    "name": "collector_hostname",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Optional hostname to use when sending spans to the collector_cluster. Useful for collectors that require a specific hostname. Defaults to `collector_cluster` above. Note: This field will be deprecated in future releases in favor of `collector_service`.",
    "notImp": false
  },
  {
    "name": "split_spans_for_request",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If this is set to true, then Envoy will be treated as an independent hop in trace chain. A complete span pair will be created for a single request. Server span will be created for the downstream request and client span will be created for the related upstream request. This should be set to true in the following cases:\n\n* The Envoy Proxy is used as gateway or ingress. * The Envoy Proxy is used as sidecar but inbound traffic capturing or outbound traffic capturing is disabled. * Any case that the `start_child_span of router` is set to true.\n\n:::attention\n\nIf this is set to true, then the `start_child_span of router` SHOULD be set to true also to ensure the correctness of trace chain. \n:::\n\n  Both this field and ``start_child_span`` are deprecated by the `spawn_upstream_span`. Please use that ``spawn_upstream_span`` field to control the span creation.",
    "notImp": false
  },
  {
    "name": "trace_context_option",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ZipkinConfig_TraceContextOption",
    "enums": [
      "USE_B3",
      "USE_B3_WITH_W3C_PROPAGATION"
    ],
    "comment": "Determines which trace context format to use for trace header extraction and propagation. This controls both downstream request header extraction and upstream request header injection. Here is the spec for W3C trace headers: https://www.w3.org/TR/trace-context/ The default value is USE_B3 to maintain backward compatibility.",
    "notImp": false
  },
  {
    "name": "collector_service",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HttpService",
    "enums": null,
    "comment": "HTTP service configuration for the Zipkin collector. When specified, this configuration takes precedence over the legacy fields: collector_cluster, collector_endpoint, and collector_hostname. This provides a complete HTTP service configuration including cluster, URI, timeout, and headers. If not specified, the legacy fields above will be used for backward compatibility.\n\nRequired fields when using collector_service:\n\n* ``http_uri.cluster`` - Must be specified and non-empty * ``http_uri.uri`` - Must be specified and non-empty * ``http_uri.timeout`` - Optional\n\nFull URI Support with Automatic Parsing:\n\nThe ``uri`` field supports both path-only and full URI formats:\n\n```yaml\n\n  tracing:\n    provider:\n      name: envoy.tracers.zipkin\n      typed_config:\n        \"@type\": type.googleapis.com/envoy.config.trace.v3.ZipkinConfig\n        collector_service:\n          http_uri:\n            # Full URI format - hostname and path are extracted automatically\n            uri: \"https://zipkin-collector.example.com/api/v2/spans\"\n            cluster: zipkin\n            timeout: 5s\n          request_headers_to_add:\n            - header:\n                key: \"X-Custom-Token\"\n                value: \"your-custom-token\"\n            - header:\n                key: \"X-Service-ID\"\n                value: \"your-service-id\"\n```\n\nURI Parsing Behavior:\n\n* Full URI: ``\"https://zipkin-collector.example.com/api/v2/spans\"``\n\n  * Hostname: ``zipkin-collector.example.com`` (sets HTTP ``Host`` header) * Path: ``/api/v2/spans`` (sets HTTP request path)\n\n* Path only: ``\"/api/v2/spans\"``\n\n  * Hostname: Uses cluster name as fallback * Path: ``/api/v2/spans``",
    "notImp": false
  }
] };

export const ZipkinConfig_SingleFields = [
  "collector_cluster",
  "collector_endpoint",
  "trace_id_128bit",
  "shared_span_context",
  "collector_endpoint_version",
  "collector_hostname",
  "trace_context_option"
];