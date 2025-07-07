import {OutType} from '@/elchi/tags/tagsType';


export const GrpcMethodList: OutType = { "GrpcMethodList": [
  {
    "name": "services",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "GrpcMethodList_Service[]",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const GrpcMethodList_Service: OutType = { "GrpcMethodList_Service": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the gRPC service.",
    "notImp": false
  },
  {
    "name": "method_names",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "The names of the gRPC methods in this service.",
    "notImp": false
  }
] };

export const GrpcMethodList_Service_SingleFields = [
  "name",
  "method_names"
];