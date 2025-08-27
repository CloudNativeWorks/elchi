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
    "comment": "By default, if the gRPC stream cannot be established, or if it is closed prematurely with an error, the filter will fail, leading to the close of connection. With this parameter set to true, however, then if the gRPC stream is prematurely closed or could not be opened, processing continues without error. [#not-implemented-hide:]",
    "notImp": true
  },
  {
    "name": "processing_mode",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ProcessingMode",
    "enums": null,
    "comment": "Options for controlling processing behavior. [#not-implemented-hide:]",
    "notImp": true
  },
  {
    "name": "message_timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Specifies the timeout for each individual message sent on the stream and when the filter is running in synchronous mode. Whenever the proxy sends a message on the stream that requires a response, it will reset this timer, and will stop processing and return an error (subject to the processing mode) if the timer expires. Default is 200 ms. [#not-implemented-hide:]",
    "notImp": true
  }
] };

export const NetworkExternalProcessor_SingleFields = [
  "failure_mode_allow",
  "message_timeout"
];