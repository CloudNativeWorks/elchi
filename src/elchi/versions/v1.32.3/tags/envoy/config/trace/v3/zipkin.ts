import {OutType} from '@/elchi/tags/tagsType';


export const ZipkinConfig: OutType = { "ZipkinConfig": [
  {
    "name": "collector_cluster",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The cluster manager cluster that hosts the Zipkin collectors.",
    "notImp": false
  },
  {
    "name": "collector_endpoint",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The API endpoint of the Zipkin service where the spans will be sent. When using a standard Zipkin installation.",
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
    "comment": "Optional hostname to use when sending spans to the collector_cluster. Useful for collectors that require a specific hostname. Defaults to `collector_cluster` above.",
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
  }
] };

export const ZipkinConfig_SingleFields = [
  "collector_cluster",
  "collector_endpoint",
  "trace_id_128bit",
  "shared_span_context",
  "collector_endpoint_version",
  "collector_hostname"
];