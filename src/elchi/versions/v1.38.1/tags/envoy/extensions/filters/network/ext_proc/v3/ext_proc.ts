import {OutType} from '@elchi/tags/tagsType';


export const ProcessingMode: OutType = { "ProcessingMode": [
  {
    "name": "process_read",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ProcessingMode_DataSendMode",
    "enums": [
      "STREAMED",
      "SKIP"
    ],
    "comment": "Controls whether inbound (read) data from the client is sent to the external processor. Default: STREAMED",
    "notImp": false
  },
  {
    "name": "process_write",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ProcessingMode_DataSendMode",
    "enums": [
      "STREAMED",
      "SKIP"
    ],
    "comment": "Controls whether outbound (write) data to the client is sent to the external processor. Default: STREAMED",
    "notImp": false
  }
] };

export const ProcessingMode_SingleFields = [
  "process_read",
  "process_write"
];

export const MetadataOptions_MetadataNamespaces: OutType = { "MetadataOptions_MetadataNamespaces": [
  {
    "name": "untyped",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Specifies a list of metadata namespaces whose values, if present, will be passed to the ext_proc service as an opaque *protobuf::Struct*.",
    "notImp": false
  },
  {
    "name": "typed",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Specifies a list of metadata namespaces whose values, if present, will be passed to the ext_proc service as a *protobuf::Any*. This allows envoy and the external processing server to share the protobuf message definition for safe parsing.",
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
  }
] };

export const NetworkExternalProcessor: OutType = { "NetworkExternalProcessor": [
  {
    "name": "grpc_service",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "GrpcService",
    "enums": null,
    "comment": "The gRPC service that will process network traffic. This service must implement the NetworkExternalProcessor service defined in the proto file /envoy/service/network_ext_proc/v3/external_processor.proto.",
    "notImp": false
  },
  {
    "name": "failure_mode_allow",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "By default, if the gRPC stream cannot be established, or if it is closed prematurely with an error, the filter will fail, leading to the close of connection. With this parameter set to true, however, then if the gRPC stream is prematurely closed or could not be opened, processing continues without error.",
    "notImp": false
  },
  {
    "name": "processing_mode",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ProcessingMode",
    "enums": null,
    "comment": "Options for controlling processing behavior.",
    "notImp": false
  },
  {
    "name": "message_timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Specifies the timeout for each individual message sent on the stream and when the filter is running in synchronous mode. Whenever the proxy sends a message on the stream that requires a response, it will reset this timer, and will stop processing and return an error (subject to the processing mode) if the timer expires. Default is 200 ms.",
    "notImp": false
  },
  {
    "name": "stat_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
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
  }
] };

export const NetworkExternalProcessor_SingleFields = [
  "failure_mode_allow",
  "message_timeout",
  "stat_prefix"
];