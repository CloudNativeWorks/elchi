import {OutType} from '@elchi/tags/tagsType';


export const RateLimitServiceConfig: OutType = { "RateLimitServiceConfig": [
  {
    "name": "grpc_service",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "GrpcService",
    "enums": null,
    "comment": "Specifies the gRPC service that hosts the rate limit service. The client will connect to this cluster when it needs to make rate limit service requests.",
    "notImp": false
  },
  {
    "name": "transport_api_version",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ApiVersion",
    "enums": [
      "AUTO",
      "V2",
      "V3"
    ],
    "comment": "API version for rate limit transport protocol. This describes the rate limit gRPC endpoint and version of messages used on the wire.",
    "notImp": false
  }
] };

export const RateLimitServiceConfig_SingleFields = [
  "transport_api_version"
];