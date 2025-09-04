import {OutType} from '@elchi/tags/tagsType';


export const Capability: OutType = { "Capability": [
  {
    "name": "health_check_protocols",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Capability_Protocol[]",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const HealthCheckRequest: OutType = { "HealthCheckRequest": [
  {
    "name": "node",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Node",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "capability",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Capability",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const EndpointHealth: OutType = { "EndpointHealth": [
  {
    "name": "endpoint",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Endpoint",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "health_status",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HealthStatus",
    "enums": [
      "UNKNOWN",
      "HEALTHY",
      "UNHEALTHY",
      "DRAINING",
      "TIMEOUT",
      "DEGRADED"
    ],
    "comment": "",
    "notImp": false
  }
] };

export const EndpointHealth_SingleFields = [
  "health_status"
];

export const LocalityEndpointsHealth: OutType = { "LocalityEndpointsHealth": [
  {
    "name": "locality",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Locality",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "endpoints_health",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "EndpointHealth[]",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const ClusterEndpointsHealth: OutType = { "ClusterEndpointsHealth": [
  {
    "name": "cluster_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "locality_endpoints_health",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "LocalityEndpointsHealth[]",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const ClusterEndpointsHealth_SingleFields = [
  "cluster_name"
];

export const EndpointHealthResponse: OutType = { "EndpointHealthResponse": [
  {
    "name": "endpoints_health",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "EndpointHealth[]",
    "enums": null,
    "comment": "Deprecated - Flat list of endpoint health information.",
    "notImp": false
  },
  {
    "name": "cluster_endpoints_health",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ClusterEndpointsHealth[]",
    "enums": null,
    "comment": "Organize Endpoint health information by cluster.",
    "notImp": false
  }
] };

export const HealthCheckRequestOrEndpointHealthResponse: OutType = { "HealthCheckRequestOrEndpointHealthResponse": [
  {
    "name": "request_type.health_check_request",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HealthCheckRequest",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "request_type.endpoint_health_response",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "EndpointHealthResponse",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const LocalityEndpoints: OutType = { "LocalityEndpoints": [
  {
    "name": "locality",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Locality",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "endpoints",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Endpoint[]",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const ClusterHealthCheck: OutType = { "ClusterHealthCheck": [
  {
    "name": "cluster_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "health_checks",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HealthCheck[]",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "locality_endpoints",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "LocalityEndpoints[]",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "transport_socket_matches",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Cluster_TransportSocketMatch[]",
    "enums": null,
    "comment": "Optional map that gets filtered by `health_checks.transport_socket_match_criteria` on connection when health checking. For more details, see `config.cluster.v3.Cluster.transport_socket_matches`.",
    "notImp": false
  },
  {
    "name": "upstream_bind_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "BindConfig",
    "enums": null,
    "comment": "Optional configuration used to bind newly established upstream connections. If the address and port are empty, no bind will be performed.",
    "notImp": false
  }
] };

export const ClusterHealthCheck_SingleFields = [
  "cluster_name"
];

export const HealthCheckSpecifier: OutType = { "HealthCheckSpecifier": [
  {
    "name": "cluster_health_checks",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ClusterHealthCheck[]",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "interval",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The default is 1 second.",
    "notImp": false
  }
] };

export const HealthCheckSpecifier_SingleFields = [
  "interval"
];