import {OutType} from '@/elchi/tags/tagsType';


export const OpenCensusConfig: OutType = { "OpenCensusConfig": [
  {
    "name": "trace_config",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "TraceConfig",
    "enums": null,
    "comment": "Configures tracing, e.g. the sampler, max number of annotations, etc.",
    "notImp": false
  },
  {
    "name": "stdout_exporter_enabled",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Enables the stdout exporter if set to true. This is intended for debugging purposes.",
    "notImp": false
  },
  {
    "name": "stackdriver_exporter_enabled",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Enables the Stackdriver exporter if set to true. The project_id must also be set.",
    "notImp": false
  },
  {
    "name": "stackdriver_project_id",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "string",
    "enums": null,
    "comment": "The Cloud project_id to use for Stackdriver tracing.",
    "notImp": false
  },
  {
    "name": "stackdriver_address",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "string",
    "enums": null,
    "comment": "(optional) By default, the Stackdriver exporter will connect to production Stackdriver. If stackdriver_address is non-empty, it will instead connect to this address, which is in the gRPC format: https://github.com/grpc/grpc/blob/master/doc/naming.md",
    "notImp": false
  },
  {
    "name": "stackdriver_grpc_service",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "GrpcService",
    "enums": null,
    "comment": "(optional) The gRPC server that hosts Stackdriver tracing service. Only Google gRPC is supported. If `target_uri` is not provided, the default production Stackdriver address will be used.",
    "notImp": false
  },
  {
    "name": "zipkin_exporter_enabled",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Enables the Zipkin exporter if set to true. The url and service name must also be set. This is deprecated, prefer to use Envoy's `native Zipkin tracer`.",
    "notImp": false
  },
  {
    "name": "zipkin_url",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "string",
    "enums": null,
    "comment": "The URL to Zipkin, e.g. \"http://127.0.0.1:9411/api/v2/spans\". This is deprecated, prefer to use Envoy's `native Zipkin tracer`.",
    "notImp": false
  },
  {
    "name": "ocagent_exporter_enabled",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Enables the OpenCensus Agent exporter if set to true. The ocagent_address or ocagent_grpc_service must also be set.",
    "notImp": false
  },
  {
    "name": "ocagent_address",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "string",
    "enums": null,
    "comment": "The address of the OpenCensus Agent, if its exporter is enabled, in gRPC format: https://github.com/grpc/grpc/blob/master/doc/naming.md",
    "notImp": false
  },
  {
    "name": "ocagent_grpc_service",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "GrpcService",
    "enums": null,
    "comment": "(optional) The gRPC server hosted by the OpenCensus Agent. Only Google gRPC is supported. This is only used if the ocagent_address is left empty.",
    "notImp": false
  },
  {
    "name": "incoming_trace_context",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "OpenCensusConfig_TraceContext[]",
    "enums": null,
    "comment": "List of incoming trace context headers we will accept. First one found wins.",
    "notImp": false
  },
  {
    "name": "outgoing_trace_context",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "OpenCensusConfig_TraceContext[]",
    "enums": null,
    "comment": "List of outgoing trace context headers we will produce.",
    "notImp": false
  }
] };