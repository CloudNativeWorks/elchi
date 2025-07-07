import {OutType} from '@/elchi/tags/tagsType';


export const Config: OutType = { "Config": [
  {
    "name": "upgrade_protobuf_to_grpc",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true then requests with content type set to ``application/x-protobuf`` will be automatically converted to gRPC. This works by prepending the payload data with the gRPC header frame, as defined by the wiring format, and Content-Type will be updated accordingly before sending the request. For the requests that went through this upgrade the filter will also strip the frame before forwarding the response to the client.",
    "notImp": false
  },
  {
    "name": "ignore_query_parameters",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true then query parameters in request's URL path will be removed.",
    "notImp": false
  }
] };

export const Config_SingleFields = [
  "upgrade_protobuf_to_grpc",
  "ignore_query_parameters"
];