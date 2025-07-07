import {OutType} from '@/elchi/tags/tagsType';


export const Endpoint_HealthCheckConfig: OutType = { "Endpoint_HealthCheckConfig": [
  {
    "name": "port_value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Optional alternative health check port value.\n\nBy default the health check address port of an upstream host is the same as the host's serving address port. This provides an alternative health check port. Setting this with a non-zero value allows an upstream host to have different health check address port.",
    "notImp": false
  },
  {
    "name": "hostname",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "By default, the host header for L7 health checks is controlled by cluster level configuration (see: `host` and `authority`). Setting this to a non-empty value allows overriding the cluster level configuration for a specific endpoint.",
    "notImp": false
  },
  {
    "name": "address",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Address",
    "enums": null,
    "comment": "Optional alternative health check host address.\n\n:::attention\n\nThe form of the health check host address is expected to be a direct IP address.",
    "notImp": false
  },
  {
    "name": "disable_active_health_check",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Optional flag to control if perform active health check for this endpoint. Active health check is enabled by default if there is a health checker.",
    "notImp": false
  }
] };

export const Endpoint_HealthCheckConfig_SingleFields = [
  "port_value",
  "hostname",
  "disable_active_health_check"
];

export const Endpoint: OutType = { "Endpoint": [
  {
    "name": "address",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Address",
    "enums": null,
    "comment": "The upstream host address.\n\n:::attention\n\nThe form of host address depends on the given cluster type. For STATIC or EDS, it is expected to be a direct IP address (or something resolvable by the specified `resolver` in the Address). For LOGICAL or STRICT DNS, it is expected to be hostname, and will be resolved via DNS.",
    "notImp": false
  },
  {
    "name": "health_check_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Endpoint_HealthCheckConfig",
    "enums": null,
    "comment": "The optional health check configuration is used as configuration for the health checker to contact the health checked host.\n\n:::attention\n\nThis takes into effect only for upstream clusters with `active health checking` enabled.",
    "notImp": false
  },
  {
    "name": "hostname",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The hostname associated with this endpoint. This hostname is not used for routing or address resolution. If provided, it will be associated with the endpoint, and can be used for features that require a hostname, like `auto_host_rewrite`.",
    "notImp": false
  },
  {
    "name": "additional_addresses",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Endpoint_AdditionalAddress[]",
    "enums": null,
    "comment": "An ordered list of addresses that together with ``address`` comprise the list of addresses for an endpoint. The address given in the ``address`` is prepended to this list. It is assumed that the list must already be sorted by preference order of the addresses. This will only be supported for STATIC and EDS clusters.",
    "notImp": false
  }
] };

export const Endpoint_SingleFields = [
  "hostname"
];

export const Endpoint_AdditionalAddress: OutType = { "Endpoint_AdditionalAddress": [
  {
    "name": "address",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Address",
    "enums": null,
    "comment": "Additional address that is associated with the endpoint.",
    "notImp": false
  }
] };

export const LbEndpoint: OutType = { "LbEndpoint": [
  {
    "name": "host_identifier.endpoint",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Endpoint",
    "enums": null,
    "comment": "Upstream host identifier or a named reference.",
    "notImp": false
  },
  {
    "name": "host_identifier.endpoint_name",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "[#not-implemented-hide:]",
    "notImp": true
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
    "comment": "Optional health status when known and supplied by EDS server.",
    "notImp": false
  },
  {
    "name": "metadata",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Metadata",
    "enums": null,
    "comment": "The endpoint metadata specifies values that may be used by the load balancer to select endpoints in a cluster for a given request. The filter name should be specified as ``envoy.lb``. An example boolean key-value pair is ``canary``, providing the optional canary status of the upstream host. This may be matched against in a route's `RouteAction` metadata_match field to subset the endpoints considered in cluster load balancing.",
    "notImp": false
  },
  {
    "name": "load_balancing_weight",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The optional load balancing weight of the upstream host; at least 1. Envoy uses the load balancing weight in some of the built in load balancers. The load balancing weight for an endpoint is divided by the sum of the weights of all endpoints in the endpoint's locality to produce a percentage of traffic for the endpoint. This percentage is then further weighted by the endpoint's locality's load balancing weight from LocalityLbEndpoints. If unspecified, will be treated as 1. The sum of the weights of all endpoints in the endpoint's locality must not exceed uint32_t maximal value (4294967295).",
    "notImp": false
  }
] };

export const LbEndpoint_SingleFields = [
  "host_identifier.endpoint_name",
  "health_status",
  "load_balancing_weight"
];

export const LedsClusterLocalityConfig: OutType = { "LedsClusterLocalityConfig": [
  {
    "name": "leds_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ConfigSource",
    "enums": null,
    "comment": "Configuration for the source of LEDS updates for a Locality.",
    "notImp": false
  },
  {
    "name": "leds_collection_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The xDS transport protocol glob collection resource name. The service is only supported in delta xDS (incremental) mode.",
    "notImp": false
  }
] };

export const LedsClusterLocalityConfig_SingleFields = [
  "leds_collection_name"
];

export const LocalityLbEndpoints: OutType = { "LocalityLbEndpoints": [
  {
    "name": "locality",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Locality",
    "enums": null,
    "comment": "Identifies location of where the upstream hosts run.",
    "notImp": false
  },
  {
    "name": "metadata",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Metadata",
    "enums": null,
    "comment": "Metadata to provide additional information about the locality endpoints in aggregate.",
    "notImp": false
  },
  {
    "name": "lb_endpoints",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "LbEndpoint[]",
    "enums": null,
    "comment": "The group of endpoints belonging to the locality specified.",
    "notImp": false
  },
  {
    "name": "lb_config.load_balancer_endpoints",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "LocalityLbEndpoints_LbEndpointList",
    "enums": null,
    "comment": "The group of endpoints belonging to the locality.",
    "notImp": false
  },
  {
    "name": "lb_config.leds_cluster_locality_config",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "LedsClusterLocalityConfig",
    "enums": null,
    "comment": "LEDS Configuration for the current locality.",
    "notImp": false
  },
  {
    "name": "load_balancing_weight",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Optional: Per priority/region/zone/sub_zone weight; at least 1. The load balancing weight for a locality is divided by the sum of the weights of all localities  at the same priority level to produce the effective percentage of traffic for the locality. The sum of the weights of all localities at the same priority level must not exceed uint32_t maximal value (4294967295).\n\nLocality weights are only considered when `locality weighted load balancing` is configured. These weights are ignored otherwise. If no weights are specified when locality weighted load balancing is enabled, the locality is assigned no load.",
    "notImp": false
  },
  {
    "name": "priority",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Optional: the priority for this LocalityLbEndpoints. If unspecified this will default to the highest priority (0).\n\nUnder usual circumstances, Envoy will only select endpoints for the highest priority (0). In the event that enough endpoints for a particular priority are unavailable/unhealthy, Envoy will fail over to selecting endpoints for the next highest priority group. Read more at `priority levels`.\n\nPriorities should range from 0 (highest) to N (lowest) without skipping.",
    "notImp": false
  },
  {
    "name": "proximity",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Optional: Per locality proximity value which indicates how close this locality is from the source locality. This value only provides ordering information (lower the value, closer it is to the source locality). This will be consumed by load balancing schemes that need proximity order to determine where to route the requests. [#not-implemented-hide:]",
    "notImp": true
  }
] };

export const LocalityLbEndpoints_SingleFields = [
  "load_balancing_weight",
  "priority",
  "proximity"
];

export const LocalityLbEndpoints_LbEndpointList: OutType = { "LocalityLbEndpoints_LbEndpointList": [
  {
    "name": "lb_endpoints",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "LbEndpoint[]",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };