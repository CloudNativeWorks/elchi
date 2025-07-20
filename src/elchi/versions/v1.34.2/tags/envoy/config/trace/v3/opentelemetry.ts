import {OutType} from '@elchi/tags/tagsType';


export const OpenTelemetryConfig: OutType = { "OpenTelemetryConfig": [
  {
    "name": "grpc_service",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "GrpcService",
    "enums": null,
    "comment": "The upstream gRPC cluster that will receive OTLP traces. Note that the tracer drops traces if the server does not read data fast enough. This field can be left empty to disable reporting traces to the gRPC service. Only one of ``grpc_service``, ``http_service`` may be used.",
    "notImp": false
  },
  {
    "name": "http_service",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HttpService",
    "enums": null,
    "comment": "The upstream HTTP cluster that will receive OTLP traces. This field can be left empty to disable reporting traces to the HTTP service. Only one of ``grpc_service``, ``http_service`` may be used.\n\n:::note\n\nNote: The ``request_headers_to_add`` property in the OTLP HTTP exporter service does not support the `format specifier` as used for `HTTP access logging`. The values configured are added as HTTP headers on the OTLP export request without any formatting applied.",
    "notImp": false
  },
  {
    "name": "service_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name for the service. This will be populated in the ResourceSpan Resource attributes. If it is not provided, it will default to \"unknown_service:envoy\".",
    "notImp": false
  },
  {
    "name": "resource_detectors",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig[]",
    "enums": null,
    "comment": "An ordered list of resource detectors extension-category: envoy.tracers.opentelemetry.resource_detectors",
    "notImp": false
  },
  {
    "name": "sampler",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "Specifies the sampler to be used by the OpenTelemetry tracer. The configured sampler implements the Sampler interface defined by the OpenTelemetry specification. This field can be left empty. In this case, the default Envoy sampling decision is used.\n\nSee: `OpenTelemetry sampler specification <https://opentelemetry.io/docs/specs/otel/trace/sdk/#sampler>`_ extension-category: envoy.tracers.opentelemetry.samplers",
    "notImp": false
  }
] };

export const OpenTelemetryConfig_SingleFields = [
  "service_name"
];