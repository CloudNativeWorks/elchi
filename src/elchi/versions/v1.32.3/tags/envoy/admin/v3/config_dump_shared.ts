import {OutType} from '@/elchi/tags/tagsType';


export const UpdateFailureState: OutType = { "UpdateFailureState": [
  {
    "name": "failed_configuration",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "What the component configuration would have been if the update had succeeded. This field may not be populated by xDS clients due to storage overhead.",
    "notImp": false
  },
  {
    "name": "last_update_attempt",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Date",
    "enums": null,
    "comment": "Time of the latest failed update attempt.",
    "notImp": false
  },
  {
    "name": "details",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Details about the last failed update attempt.",
    "notImp": false
  },
  {
    "name": "version_info",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "This is the version of the rejected resource. [#not-implemented-hide:]",
    "notImp": true
  }
] };

export const UpdateFailureState_SingleFields = [
  "details",
  "version_info"
];

export const ListenersConfigDump: OutType = { "ListenersConfigDump": [
  {
    "name": "version_info",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "This is the `version_info` in the last processed LDS discovery response. If there are only static bootstrap listeners, this field will be \"\".",
    "notImp": false
  },
  {
    "name": "static_listeners",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ListenersConfigDump_StaticListener[]",
    "enums": null,
    "comment": "The statically loaded listener configs.",
    "notImp": false
  },
  {
    "name": "dynamic_listeners",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ListenersConfigDump_DynamicListener[]",
    "enums": null,
    "comment": "State for any warming, active, or draining listeners.",
    "notImp": false
  }
] };

export const ListenersConfigDump_SingleFields = [
  "version_info"
];

export const ListenersConfigDump_StaticListener: OutType = { "ListenersConfigDump_StaticListener": [
  {
    "name": "listener",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "The listener config.",
    "notImp": false
  },
  {
    "name": "last_updated",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Date",
    "enums": null,
    "comment": "The timestamp when the Listener was last successfully updated.",
    "notImp": false
  }
] };

export const ListenersConfigDump_DynamicListenerState: OutType = { "ListenersConfigDump_DynamicListenerState": [
  {
    "name": "version_info",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "This is the per-resource version information. This version is currently taken from the `version_info` field at the time that the listener was loaded. In the future, discrete per-listener versions may be supported by the API.",
    "notImp": false
  },
  {
    "name": "listener",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "The listener config.",
    "notImp": false
  },
  {
    "name": "last_updated",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Date",
    "enums": null,
    "comment": "The timestamp when the Listener was last successfully updated.",
    "notImp": false
  }
] };

export const ListenersConfigDump_DynamicListenerState_SingleFields = [
  "version_info"
];

export const ListenersConfigDump_DynamicListener: OutType = { "ListenersConfigDump_DynamicListener": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name or unique id of this listener, pulled from the DynamicListenerState config.",
    "notImp": false
  },
  {
    "name": "active_state",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ListenersConfigDump_DynamicListenerState",
    "enums": null,
    "comment": "The listener state for any active listener by this name. These are listeners that are available to service data plane traffic.",
    "notImp": false
  },
  {
    "name": "warming_state",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ListenersConfigDump_DynamicListenerState",
    "enums": null,
    "comment": "The listener state for any warming listener by this name. These are listeners that are currently undergoing warming in preparation to service data plane traffic. Note that if attempting to recreate an Envoy configuration from a configuration dump, the warming listeners should generally be discarded.",
    "notImp": false
  },
  {
    "name": "draining_state",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ListenersConfigDump_DynamicListenerState",
    "enums": null,
    "comment": "The listener state for any draining listener by this name. These are listeners that are currently undergoing draining in preparation to stop servicing data plane traffic. Note that if attempting to recreate an Envoy configuration from a configuration dump, the draining listeners should generally be discarded.",
    "notImp": false
  },
  {
    "name": "error_state",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "UpdateFailureState",
    "enums": null,
    "comment": "Set if the last update failed, cleared after the next successful update. The ``error_state`` field contains the rejected version of this particular resource along with the reason and timestamp. For successfully updated or acknowledged resource, this field should be empty.",
    "notImp": false
  },
  {
    "name": "client_status",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ClientResourceStatus",
    "enums": [
      "UNKNOWN",
      "REQUESTED",
      "DOES_NOT_EXIST",
      "ACKED",
      "NACKED"
    ],
    "comment": "The client status of this resource. [#not-implemented-hide:]",
    "notImp": true
  }
] };

export const ListenersConfigDump_DynamicListener_SingleFields = [
  "name",
  "client_status"
];

export const ClustersConfigDump: OutType = { "ClustersConfigDump": [
  {
    "name": "version_info",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "This is the `version_info` in the last processed CDS discovery response. If there are only static bootstrap clusters, this field will be \"\".",
    "notImp": false
  },
  {
    "name": "static_clusters",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ClustersConfigDump_StaticCluster[]",
    "enums": null,
    "comment": "The statically loaded cluster configs.",
    "notImp": false
  },
  {
    "name": "dynamic_active_clusters",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ClustersConfigDump_DynamicCluster[]",
    "enums": null,
    "comment": "The dynamically loaded active clusters. These are clusters that are available to service data plane traffic.",
    "notImp": false
  },
  {
    "name": "dynamic_warming_clusters",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ClustersConfigDump_DynamicCluster[]",
    "enums": null,
    "comment": "The dynamically loaded warming clusters. These are clusters that are currently undergoing warming in preparation to service data plane traffic. Note that if attempting to recreate an Envoy configuration from a configuration dump, the warming clusters should generally be discarded.",
    "notImp": false
  }
] };

export const ClustersConfigDump_SingleFields = [
  "version_info"
];

export const ClustersConfigDump_StaticCluster: OutType = { "ClustersConfigDump_StaticCluster": [
  {
    "name": "cluster",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "The cluster config.",
    "notImp": false
  },
  {
    "name": "last_updated",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Date",
    "enums": null,
    "comment": "The timestamp when the Cluster was last updated.",
    "notImp": false
  }
] };

export const ClustersConfigDump_DynamicCluster: OutType = { "ClustersConfigDump_DynamicCluster": [
  {
    "name": "version_info",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "This is the per-resource version information. This version is currently taken from the `version_info` field at the time that the cluster was loaded. In the future, discrete per-cluster versions may be supported by the API.",
    "notImp": false
  },
  {
    "name": "cluster",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "The cluster config.",
    "notImp": false
  },
  {
    "name": "last_updated",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Date",
    "enums": null,
    "comment": "The timestamp when the Cluster was last updated.",
    "notImp": false
  },
  {
    "name": "error_state",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "UpdateFailureState",
    "enums": null,
    "comment": "Set if the last update failed, cleared after the next successful update. The ``error_state`` field contains the rejected version of this particular resource along with the reason and timestamp. For successfully updated or acknowledged resource, this field should be empty. [#not-implemented-hide:]",
    "notImp": true
  },
  {
    "name": "client_status",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ClientResourceStatus",
    "enums": [
      "UNKNOWN",
      "REQUESTED",
      "DOES_NOT_EXIST",
      "ACKED",
      "NACKED"
    ],
    "comment": "The client status of this resource. [#not-implemented-hide:]",
    "notImp": true
  }
] };

export const ClustersConfigDump_DynamicCluster_SingleFields = [
  "version_info",
  "client_status"
];

export const RoutesConfigDump: OutType = { "RoutesConfigDump": [
  {
    "name": "static_route_configs",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RoutesConfigDump_StaticRouteConfig[]",
    "enums": null,
    "comment": "The statically loaded route configs.",
    "notImp": false
  },
  {
    "name": "dynamic_route_configs",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RoutesConfigDump_DynamicRouteConfig[]",
    "enums": null,
    "comment": "The dynamically loaded route configs.",
    "notImp": false
  }
] };

export const RoutesConfigDump_StaticRouteConfig: OutType = { "RoutesConfigDump_StaticRouteConfig": [
  {
    "name": "route_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "The route config.",
    "notImp": false
  },
  {
    "name": "last_updated",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Date",
    "enums": null,
    "comment": "The timestamp when the Route was last updated.",
    "notImp": false
  }
] };

export const RoutesConfigDump_DynamicRouteConfig: OutType = { "RoutesConfigDump_DynamicRouteConfig": [
  {
    "name": "version_info",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "This is the per-resource version information. This version is currently taken from the `version_info` field at the time that the route configuration was loaded.",
    "notImp": false
  },
  {
    "name": "route_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "The route config.",
    "notImp": false
  },
  {
    "name": "last_updated",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Date",
    "enums": null,
    "comment": "The timestamp when the Route was last updated.",
    "notImp": false
  },
  {
    "name": "error_state",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "UpdateFailureState",
    "enums": null,
    "comment": "Set if the last update failed, cleared after the next successful update. The ``error_state`` field contains the rejected version of this particular resource along with the reason and timestamp. For successfully updated or acknowledged resource, this field should be empty. [#not-implemented-hide:]",
    "notImp": true
  },
  {
    "name": "client_status",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ClientResourceStatus",
    "enums": [
      "UNKNOWN",
      "REQUESTED",
      "DOES_NOT_EXIST",
      "ACKED",
      "NACKED"
    ],
    "comment": "The client status of this resource. [#not-implemented-hide:]",
    "notImp": true
  }
] };

export const RoutesConfigDump_DynamicRouteConfig_SingleFields = [
  "version_info",
  "client_status"
];

export const ScopedRoutesConfigDump: OutType = { "ScopedRoutesConfigDump": [
  {
    "name": "inline_scoped_route_configs",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ScopedRoutesConfigDump_InlineScopedRouteConfigs[]",
    "enums": null,
    "comment": "The statically loaded scoped route configs.",
    "notImp": false
  },
  {
    "name": "dynamic_scoped_route_configs",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ScopedRoutesConfigDump_DynamicScopedRouteConfigs[]",
    "enums": null,
    "comment": "The dynamically loaded scoped route configs.",
    "notImp": false
  }
] };

export const ScopedRoutesConfigDump_InlineScopedRouteConfigs: OutType = { "ScopedRoutesConfigDump_InlineScopedRouteConfigs": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name assigned to the scoped route configurations.",
    "notImp": false
  },
  {
    "name": "scoped_route_configs",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Any[]",
    "enums": null,
    "comment": "The scoped route configurations.",
    "notImp": false
  },
  {
    "name": "last_updated",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Date",
    "enums": null,
    "comment": "The timestamp when the scoped route config set was last updated.",
    "notImp": false
  }
] };

export const ScopedRoutesConfigDump_InlineScopedRouteConfigs_SingleFields = [
  "name"
];

export const ScopedRoutesConfigDump_DynamicScopedRouteConfigs: OutType = { "ScopedRoutesConfigDump_DynamicScopedRouteConfigs": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name assigned to the scoped route configurations.",
    "notImp": false
  },
  {
    "name": "version_info",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "This is the per-resource version information. This version is currently taken from the `version_info` field at the time that the scoped routes configuration was loaded.",
    "notImp": false
  },
  {
    "name": "scoped_route_configs",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Any[]",
    "enums": null,
    "comment": "The scoped route configurations.",
    "notImp": false
  },
  {
    "name": "last_updated",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Date",
    "enums": null,
    "comment": "The timestamp when the scoped route config set was last updated.",
    "notImp": false
  },
  {
    "name": "error_state",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "UpdateFailureState",
    "enums": null,
    "comment": "Set if the last update failed, cleared after the next successful update. The ``error_state`` field contains the rejected version of this particular resource along with the reason and timestamp. For successfully updated or acknowledged resource, this field should be empty. [#not-implemented-hide:]",
    "notImp": true
  },
  {
    "name": "client_status",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ClientResourceStatus",
    "enums": [
      "UNKNOWN",
      "REQUESTED",
      "DOES_NOT_EXIST",
      "ACKED",
      "NACKED"
    ],
    "comment": "The client status of this resource. [#not-implemented-hide:]",
    "notImp": true
  }
] };

export const ScopedRoutesConfigDump_DynamicScopedRouteConfigs_SingleFields = [
  "name",
  "version_info",
  "client_status"
];

export const EndpointsConfigDump: OutType = { "EndpointsConfigDump": [
  {
    "name": "static_endpoint_configs",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "EndpointsConfigDump_StaticEndpointConfig[]",
    "enums": null,
    "comment": "The statically loaded endpoint configs.",
    "notImp": false
  },
  {
    "name": "dynamic_endpoint_configs",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "EndpointsConfigDump_DynamicEndpointConfig[]",
    "enums": null,
    "comment": "The dynamically loaded endpoint configs.",
    "notImp": false
  }
] };

export const EndpointsConfigDump_StaticEndpointConfig: OutType = { "EndpointsConfigDump_StaticEndpointConfig": [
  {
    "name": "endpoint_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "The endpoint config.",
    "notImp": false
  },
  {
    "name": "last_updated",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Date",
    "enums": null,
    "comment": "[#not-implemented-hide:] The timestamp when the Endpoint was last updated.",
    "notImp": true
  }
] };

export const EndpointsConfigDump_DynamicEndpointConfig: OutType = { "EndpointsConfigDump_DynamicEndpointConfig": [
  {
    "name": "version_info",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "[#not-implemented-hide:] This is the per-resource version information. This version is currently taken from the `version_info` field at the time that the endpoint configuration was loaded.",
    "notImp": true
  },
  {
    "name": "endpoint_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "The endpoint config.",
    "notImp": false
  },
  {
    "name": "last_updated",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Date",
    "enums": null,
    "comment": "[#not-implemented-hide:] The timestamp when the Endpoint was last updated.",
    "notImp": true
  },
  {
    "name": "error_state",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "UpdateFailureState",
    "enums": null,
    "comment": "Set if the last update failed, cleared after the next successful update. The ``error_state`` field contains the rejected version of this particular resource along with the reason and timestamp. For successfully updated or acknowledged resource, this field should be empty. [#not-implemented-hide:]",
    "notImp": true
  },
  {
    "name": "client_status",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ClientResourceStatus",
    "enums": [
      "UNKNOWN",
      "REQUESTED",
      "DOES_NOT_EXIST",
      "ACKED",
      "NACKED"
    ],
    "comment": "The client status of this resource. [#not-implemented-hide:]",
    "notImp": true
  }
] };

export const EndpointsConfigDump_DynamicEndpointConfig_SingleFields = [
  "version_info",
  "client_status"
];

export const EcdsConfigDump: OutType = { "EcdsConfigDump": [
  {
    "name": "ecds_filters",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "EcdsConfigDump_EcdsFilterConfig[]",
    "enums": null,
    "comment": "The ECDS filter configs.",
    "notImp": false
  }
] };

export const EcdsConfigDump_EcdsFilterConfig: OutType = { "EcdsConfigDump_EcdsFilterConfig": [
  {
    "name": "version_info",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "This is the per-resource version information. This version is currently taken from the `version_info` field at the time that the ECDS filter was loaded.",
    "notImp": false
  },
  {
    "name": "ecds_filter",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "The ECDS filter config.",
    "notImp": false
  },
  {
    "name": "last_updated",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Date",
    "enums": null,
    "comment": "The timestamp when the ECDS filter was last updated.",
    "notImp": false
  },
  {
    "name": "error_state",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "UpdateFailureState",
    "enums": null,
    "comment": "Set if the last update failed, cleared after the next successful update. The ``error_state`` field contains the rejected version of this particular resource along with the reason and timestamp. For successfully updated or acknowledged resource, this field should be empty. [#not-implemented-hide:]",
    "notImp": true
  },
  {
    "name": "client_status",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ClientResourceStatus",
    "enums": [
      "UNKNOWN",
      "REQUESTED",
      "DOES_NOT_EXIST",
      "ACKED",
      "NACKED"
    ],
    "comment": "The client status of this resource. [#not-implemented-hide:]",
    "notImp": true
  }
] };

export const EcdsConfigDump_EcdsFilterConfig_SingleFields = [
  "version_info",
  "client_status"
];