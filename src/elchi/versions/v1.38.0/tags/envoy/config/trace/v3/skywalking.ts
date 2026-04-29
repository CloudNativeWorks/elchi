import {OutType} from '@elchi/tags/tagsType';


export const ClientConfig: OutType = { "ClientConfig": [
  {
    "name": "service_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Service name for SkyWalking tracer. If this field is empty, then local service cluster name that configured by `Bootstrap node` message's `cluster` field or command line option :option:`--service-cluster` will be used. If both this field and local service cluster name are empty, ``EnvoyProxy`` is used as the service name by default.",
    "notImp": false
  },
  {
    "name": "instance_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Service instance name for SkyWalking tracer. If this field is empty, then local service node that configured by `Bootstrap node` message's `id` field or command line  option :option:`--service-node` will be used. If both this field and local service node are empty, ``EnvoyProxy`` is used as the instance name by default.",
    "notImp": false
  },
  {
    "name": "backend_token_specifier.backend_token",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Inline authentication token string.",
    "notImp": false
  },
  {
    "name": "max_cache_size",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Envoy caches the segment in memory when the SkyWalking backend service is temporarily unavailable. This field specifies the maximum number of segments that can be cached. If not specified, the default is 1024.",
    "notImp": false
  }
] };

export const ClientConfig_SingleFields = [
  "service_name",
  "instance_name",
  "backend_token_specifier.backend_token",
  "max_cache_size"
];

export const SkyWalkingConfig: OutType = { "SkyWalkingConfig": [
  {
    "name": "grpc_service",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "GrpcService",
    "enums": null,
    "comment": "SkyWalking collector service.",
    "notImp": false
  },
  {
    "name": "client_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ClientConfig",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };