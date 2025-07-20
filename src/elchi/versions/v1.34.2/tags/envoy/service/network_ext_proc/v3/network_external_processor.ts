import {OutType} from '@elchi/tags/tagsType';


export const Data: OutType = { "Data": [
  {
    "name": "data",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Uint8Array<ArrayBufferLike>",
    "enums": null,
    "comment": "The raw payload data",
    "notImp": false
  },
  {
    "name": "end_of_stream",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Indicates whether this is the last data frame in the current direction. The external processor should still respond to this message even if there is no more data expected in this direction.",
    "notImp": false
  }
] };

export const Data_SingleFields = [
  "end_of_stream"
];

export const ProcessingRequest: OutType = { "ProcessingRequest": [
  {
    "name": "read_data",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Data",
    "enums": null,
    "comment": "ReadData contains the network data intercepted in the request path (client to server). This is sent to the external processor when data arrives from the downstream client. If this is set, write_data should not be set.",
    "notImp": false
  },
  {
    "name": "write_data",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Data",
    "enums": null,
    "comment": "WriteData contains the network data intercepted in the response path (server to client). This is sent to the external processor when data arrives from the upstream server. If this is set, read_data should not be set.",
    "notImp": false
  },
  {
    "name": "metadata",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Metadata",
    "enums": null,
    "comment": "Optional metadata associated with the request. This can include connection properties, filter configuration, and any other contextual information that might be useful for processing decisions.\n\nThe metadata is not automatically propagated from request to response. The external processor must include any needed metadata in its response.",
    "notImp": false
  }
] };

export const ProcessingResponse: OutType = { "ProcessingResponse": [
  {
    "name": "read_data",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Data",
    "enums": null,
    "comment": "The processed ReadData containing potentially modified data for the request path. This should be sent in response to a ProcessingRequest with read_data, and the previous data in ProcessingRequest will be replaced by the new data in Envoy's data plane. If this is set, write_data should not be set.",
    "notImp": false
  },
  {
    "name": "write_data",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Data",
    "enums": null,
    "comment": "The processed WriteData containing potentially modified data for the response path. This should be sent in response to a ProcessingRequest with write_data, and the previous data in ProcessingRequest will be replaced by the new data in Envoy's data plane. If this is set, read_data should not be set.",
    "notImp": false
  },
  {
    "name": "data_processing_status",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ProcessingResponse_DataProcessedStatus",
    "enums": [
      "UNKNOWN",
      "UNMODIFIED",
      "MODIFIED"
    ],
    "comment": "Indicates whether the data was modified or not. This is mandatory and tells Envoy whether to use the original or modified data.",
    "notImp": false
  },
  {
    "name": "connection_status",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ProcessingResponse_ConnectionStatus",
    "enums": [
      "CONTINUE",
      "CLOSE",
      "CLOSE_RST"
    ],
    "comment": "Optional: Determines the connection behavior after processing. If not specified, CONTINUE is assumed, and the connection proceeds normally. Use CLOSE or CLOSE_RST to terminate the connection based on processing results.",
    "notImp": false
  },
  {
    "name": "dynamic_metadata",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "{ [key: string]: any; }",
    "enums": null,
    "comment": "Optional metadata associated with the request. This can include connection properties, filter configuration, and any other contextual information that might be useful for processing decisions.\n\nThe metadata is not automatically propagated from request to response. The external processor must include any needed metadata in its response.",
    "notImp": false
  }
] };

export const ProcessingResponse_SingleFields = [
  "data_processing_status",
  "connection_status"
];