import {OutType} from '@elchi/tags/tagsType';


export const ResourceLocator: OutType = { "ResourceLocator": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The resource name to subscribe to.",
    "notImp": false
  },
  {
    "name": "dynamic_parameters",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, string>",
    "enums": null,
    "comment": "A set of dynamic parameters used to match against the dynamic parameter constraints on the resource. This allows clients to select between multiple variants of the same resource.",
    "notImp": false
  }
] };

export const ResourceLocator_SingleFields = [
  "name"
];

export const ResourceLocator_DynamicParametersEntry: OutType = { "ResourceLocator_DynamicParametersEntry": [
  {
    "name": "key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const ResourceLocator_DynamicParametersEntry_SingleFields = [
  "key",
  "value"
];

export const DynamicParameterConstraints: OutType = { "DynamicParameterConstraints": [
  {
    "name": "type.constraint",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "DynamicParameterConstraints_SingleConstraint",
    "enums": null,
    "comment": "A single constraint to evaluate.",
    "notImp": false
  },
  {
    "name": "type.or_constraints",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "DynamicParameterConstraints_ConstraintList",
    "enums": null,
    "comment": "A list of constraints that match if any one constraint in the list matches.",
    "notImp": false
  },
  {
    "name": "type.and_constraints",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "DynamicParameterConstraints_ConstraintList",
    "enums": null,
    "comment": "A list of constraints that must all match.",
    "notImp": false
  },
  {
    "name": "type.not_constraints",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "DynamicParameterConstraints",
    "enums": null,
    "comment": "The inverse (NOT) of a set of constraints.",
    "notImp": false
  }
] };

export const ResourceName: OutType = { "ResourceName": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the resource.",
    "notImp": false
  },
  {
    "name": "dynamic_parameter_constraints",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DynamicParameterConstraints",
    "enums": null,
    "comment": "Dynamic parameter constraints associated with this resource. To be used by client-side caches (including xDS proxies) when matching subscribed resource locators.",
    "notImp": false
  }
] };

export const ResourceName_SingleFields = [
  "name"
];

export const ResourceError: OutType = { "ResourceError": [
  {
    "name": "resource_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ResourceName",
    "enums": null,
    "comment": "The name of the resource.",
    "notImp": false
  },
  {
    "name": "error_detail",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Status",
    "enums": null,
    "comment": "The error reported for the resource.",
    "notImp": false
  }
] };

export const DiscoveryRequest: OutType = { "DiscoveryRequest": [
  {
    "name": "version_info",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The ``version_info`` provided in the request messages will be the ``version_info`` received with the most recent successfully processed response or empty on the first request. It is expected that no new request is sent after a response is received until the Envoy instance is ready to ACK/NACK the new configuration. ACK/NACK takes place by returning the new API config version as applied or the previous API config version respectively. Each ``type_url`` (see below) has an independent version associated with it.",
    "notImp": false
  },
  {
    "name": "node",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Node",
    "enums": null,
    "comment": "The node making the request.",
    "notImp": false
  },
  {
    "name": "resource_names",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "List of resources to subscribe to, e.g. list of cluster names or a route configuration name. If this is empty, all resources for the API are returned. LDS/CDS may have empty ``resource_names``, which will cause all resources for the Envoy instance to be returned. The LDS and CDS responses will then imply a number of resources that need to be fetched via EDS/RDS, which will be explicitly enumerated in ``resource_names``.",
    "notImp": false
  },
  {
    "name": "resource_locators",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ResourceLocator[]",
    "enums": null,
    "comment": "[#not-implemented-hide:] Alternative to ``resource_names`` field that allows specifying dynamic parameters along with each resource name. Clients that populate this field must be able to handle responses from the server where resources are wrapped in a Resource message.\n\n:::note\nIt is legal for a request to have some resources listed in ``resource_names`` and others in ``resource_locators``.",
    "notImp": true
  },
  {
    "name": "type_url",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Type of the resource that is being requested, e.g. ``type.googleapis.com/envoy.api.v2.ClusterLoadAssignment``. This is implicit in requests made via singleton xDS APIs such as CDS, LDS, etc. but is required for ADS.",
    "notImp": false
  },
  {
    "name": "response_nonce",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "nonce corresponding to ``DiscoveryResponse`` being ACK/NACKed. See above discussion on ``version_info`` and the ``DiscoveryResponse`` nonce comment. This may be empty only if:\n\n* This is a non-persistent-stream xDS such as HTTP, or * The client has not yet accepted an update in this xDS stream (unlike delta, where it is populated only for new explicit ACKs).",
    "notImp": false
  },
  {
    "name": "error_detail",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Status",
    "enums": null,
    "comment": "This is populated when the previous `DiscoveryResponse` failed to update configuration. The ``message`` field in ``error_details`` provides the Envoy internal exception related to the failure. It is only intended for consumption during manual debugging, the string provided is not guaranteed to be stable across Envoy versions.",
    "notImp": false
  }
] };

export const DiscoveryRequest_SingleFields = [
  "version_info",
  "resource_names",
  "type_url",
  "response_nonce"
];

export const DiscoveryResponse: OutType = { "DiscoveryResponse": [
  {
    "name": "version_info",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The version of the response data.",
    "notImp": false
  },
  {
    "name": "resources",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Any[]",
    "enums": null,
    "comment": "The response resources. These resources are typed and depend on the API being called.",
    "notImp": false
  },
  {
    "name": "canary",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "[#not-implemented-hide:] Canary is used to support two Envoy command line flags:\n\n* ``--terminate-on-canary-transition-failure``. When set, Envoy is able to terminate if it detects that configuration is stuck at canary. Consider this example sequence of updates:\n\n  * Management server applies a canary config successfully. * Management server rolls back to a production config. * Envoy rejects the new production config.\n\n  Since there is no sensible way to continue receiving configuration updates, Envoy will then terminate and apply production config from a clean slate.\n\n* ``--dry-run-canary``. When set, a canary response will never be applied, only validated via a dry run.",
    "notImp": true
  },
  {
    "name": "type_url",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Type URL for resources. Identifies the xDS API when muxing over ADS. Must be consistent with the ``type_url`` in the 'resources' repeated Any (if non-empty).",
    "notImp": false
  },
  {
    "name": "nonce",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "For gRPC based subscriptions, the nonce provides a way to explicitly ack a specific ``DiscoveryResponse`` in a following ``DiscoveryRequest``. Additional messages may have been sent by Envoy to the management server for the previous version on the stream prior to this ``DiscoveryResponse``, that were unprocessed at response send time. The nonce allows the management server to ignore any further ``DiscoveryRequests`` for the previous version until a ``DiscoveryRequest`` bearing the nonce. The nonce is optional and is not required for non-stream based xDS implementations.",
    "notImp": false
  },
  {
    "name": "control_plane",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ControlPlane",
    "enums": null,
    "comment": "The control plane instance that sent the response.",
    "notImp": false
  },
  {
    "name": "resource_errors",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ResourceError[]",
    "enums": null,
    "comment": "[#not-implemented-hide:] Errors associated with specific resources. Clients are expected to remember the most recent error for a given resource across responses; the error condition is not considered to be cleared until a response is received that contains the resource in the 'resources' field.",
    "notImp": true
  }
] };

export const DiscoveryResponse_SingleFields = [
  "version_info",
  "canary",
  "type_url",
  "nonce"
];

export const DeltaDiscoveryRequest: OutType = { "DeltaDiscoveryRequest": [
  {
    "name": "node",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Node",
    "enums": null,
    "comment": "The node making the request.",
    "notImp": false
  },
  {
    "name": "type_url",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Type of the resource that is being requested, e.g. ``type.googleapis.com/envoy.api.v2.ClusterLoadAssignment``. This does not need to be set if resources are only referenced via ``xds_resource_subscribe`` and ``xds_resources_unsubscribe``.",
    "notImp": false
  },
  {
    "name": "resource_names_subscribe",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "DeltaDiscoveryRequests allow the client to add or remove individual resources to the set of tracked resources in the context of a stream. All resource names in the ``resource_names_subscribe`` list are added to the set of tracked resources and all resource names in the ``resource_names_unsubscribe`` list are removed from the set of tracked resources.\n\n*Unlike* state-of-the-world xDS, an empty ``resource_names_subscribe`` or ``resource_names_unsubscribe`` list simply means that no resources are to be added or removed to the resource list. *Like* state-of-the-world xDS, the server must send updates for all tracked resources, but can also send updates for resources the client has not subscribed to.\n\n:::note\nThe server must respond with all resources listed in ``resource_names_subscribe``, even if it believes the client has the most recent version of them. The reason: the client may have dropped them, but then regained interest before it had a chance to send the unsubscribe message. See DeltaSubscriptionStateTest.RemoveThenAdd. \n:::\n\nThese two fields can be set in any ``DeltaDiscoveryRequest``, including ACKs and ``initial_resource_versions``.\n\nA list of Resource names to add to the list of tracked resources.",
    "notImp": false
  },
  {
    "name": "resource_names_unsubscribe",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "A list of Resource names to remove from the list of tracked resources.",
    "notImp": false
  },
  {
    "name": "resource_locators_subscribe",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ResourceLocator[]",
    "enums": null,
    "comment": "[#not-implemented-hide:] Alternative to ``resource_names_subscribe`` field that allows specifying dynamic parameters along with each resource name.\n\n:::note\nIt is legal for a request to have some resources listed in ``resource_names_subscribe`` and others in ``resource_locators_subscribe``.",
    "notImp": true
  },
  {
    "name": "resource_locators_unsubscribe",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ResourceLocator[]",
    "enums": null,
    "comment": "[#not-implemented-hide:] Alternative to ``resource_names_unsubscribe`` field that allows specifying dynamic parameters along with each resource name.\n\n:::note\nIt is legal for a request to have some resources listed in ``resource_names_unsubscribe`` and others in ``resource_locators_unsubscribe``.",
    "notImp": true
  },
  {
    "name": "initial_resource_versions",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, string>",
    "enums": null,
    "comment": "Informs the server of the versions of the resources the xDS client knows of, to enable the client to continue the same logical xDS session even in the face of gRPC stream reconnection. It will not be populated:\n\n* In the very first stream of a session, since the client will not yet have any resources. * In any message after the first in a stream (for a given ``type_url``), since the server will already be correctly tracking the client's state.\n\n(In ADS, the first message ``of each type_url`` of a reconnected stream populates this map.) The map's keys are names of xDS resources known to the xDS client. The map's values are opaque resource versions.",
    "notImp": false
  },
  {
    "name": "response_nonce",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "When the ``DeltaDiscoveryRequest`` is a ACK or NACK message in response to a previous ``DeltaDiscoveryResponse``, the ``response_nonce`` must be the nonce in the ``DeltaDiscoveryResponse``. Otherwise (unlike in ``DiscoveryRequest``) ``response_nonce`` must be omitted.",
    "notImp": false
  },
  {
    "name": "error_detail",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Status",
    "enums": null,
    "comment": "This is populated when the previous `DiscoveryResponse` failed to update configuration. The ``message`` field in ``error_details`` provides the Envoy internal exception related to the failure.",
    "notImp": false
  }
] };

export const DeltaDiscoveryRequest_SingleFields = [
  "type_url",
  "resource_names_subscribe",
  "resource_names_unsubscribe",
  "response_nonce"
];

export const DeltaDiscoveryRequest_InitialResourceVersionsEntry: OutType = { "DeltaDiscoveryRequest_InitialResourceVersionsEntry": [
  {
    "name": "key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const DeltaDiscoveryRequest_InitialResourceVersionsEntry_SingleFields = [
  "key",
  "value"
];

export const DeltaDiscoveryResponse: OutType = { "DeltaDiscoveryResponse": [
  {
    "name": "system_version_info",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The version of the response data (used for debugging).",
    "notImp": false
  },
  {
    "name": "resources",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Resource[]",
    "enums": null,
    "comment": "The response resources. These are typed resources, whose types must match the ``type_url`` field.",
    "notImp": false
  },
  {
    "name": "type_url",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Type URL for resources. Identifies the xDS API when muxing over ADS. Must be consistent with the ``type_url`` in the Any within 'resources' if 'resources' is non-empty.",
    "notImp": false
  },
  {
    "name": "removed_resources",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Resource names of resources that have been deleted and to be removed from the xDS Client. Removed resources for missing resources can be ignored.",
    "notImp": false
  },
  {
    "name": "removed_resource_names",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ResourceName[]",
    "enums": null,
    "comment": "Alternative to ``removed_resources`` that allows specifying which variant of a resource is being removed. This variant must be used for any resource for which dynamic parameter constraints were sent to the client.",
    "notImp": false
  },
  {
    "name": "nonce",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The nonce provides a way for ``DeltaDiscoveryRequests`` to uniquely reference a ``DeltaDiscoveryResponse`` when (N)ACKing. The nonce is required.",
    "notImp": false
  },
  {
    "name": "control_plane",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ControlPlane",
    "enums": null,
    "comment": "[#not-implemented-hide:] The control plane instance that sent the response.",
    "notImp": true
  },
  {
    "name": "resource_errors",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ResourceError[]",
    "enums": null,
    "comment": "[#not-implemented-hide:] Errors associated with specific resources.\n\n:::note\nA resource in this field with a status of NOT_FOUND should be treated the same as a resource listed in the ``removed_resources`` or ``removed_resource_names`` fields.",
    "notImp": true
  }
] };

export const DeltaDiscoveryResponse_SingleFields = [
  "system_version_info",
  "type_url",
  "removed_resources",
  "nonce"
];

export const DynamicParameterConstraints_SingleConstraint: OutType = { "DynamicParameterConstraints_SingleConstraint": [
  {
    "name": "key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The key to match against.",
    "notImp": false
  },
  {
    "name": "constraint_type.value",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Matches this exact value.",
    "notImp": false
  },
  {
    "name": "constraint_type.exists",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "DynamicParameterConstraints_SingleConstraint_Exists",
    "enums": null,
    "comment": "Key is present (matches any value except for the key being absent). This allows setting a default constraint for clients that do not send a key at all, while there may be other clients that need special configuration based on that key.",
    "notImp": false
  }
] };

export const DynamicParameterConstraints_SingleConstraint_SingleFields = [
  "key",
  "constraint_type.value"
];

export const DynamicParameterConstraints_ConstraintList: OutType = { "DynamicParameterConstraints_ConstraintList": [
  {
    "name": "constraints",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DynamicParameterConstraints[]",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const Resource_CacheControl: OutType = { "Resource_CacheControl": [
  {
    "name": "do_not_cache",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, xDS proxies may not cache this resource.\n\n:::note\nThis does not apply to clients other than xDS proxies, which must cache resources for their own use, regardless of the value of this field.",
    "notImp": false
  }
] };

export const Resource_CacheControl_SingleFields = [
  "do_not_cache"
];

export const Resource: OutType = { "Resource": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The resource's name, to distinguish it from others of the same type of resource. Only one of ``name`` or ``resource_name`` may be set.",
    "notImp": false
  },
  {
    "name": "resource_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ResourceName",
    "enums": null,
    "comment": "Alternative to the ``name`` field, to be used when the server supports multiple variants of the named resource that are differentiated by dynamic parameter constraints. Only one of ``name`` or ``resource_name`` may be set.",
    "notImp": false
  },
  {
    "name": "aliases",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "The aliases are a list of other names that this resource can go by.",
    "notImp": false
  },
  {
    "name": "version",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The resource level version. It allows xDS to track the state of individual resources.",
    "notImp": false
  },
  {
    "name": "resource",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "The resource being tracked.",
    "notImp": false
  },
  {
    "name": "ttl",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Time-to-live value for the resource. For each resource, a timer is started. The timer is reset each time the resource is received with a new TTL. If the resource is received with no TTL set, the timer is removed for the resource. Upon expiration of the timer, the configuration for the resource will be removed.\n\nThe TTL can be refreshed or changed by sending a response that doesn't change the resource version. In this case the ``resource`` field does not need to be populated, which allows for light-weight \"heartbeat\" updates to keep a resource with a TTL alive.\n\nThe TTL feature is meant to support configurations that should be removed in the event of a management server failure. For example, the feature may be used for fault injection testing where the fault injection should be terminated in the event that Envoy loses contact with the management server.",
    "notImp": false
  },
  {
    "name": "cache_control",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Resource_CacheControl",
    "enums": null,
    "comment": "Cache control properties for the resource. [#not-implemented-hide:]",
    "notImp": true
  },
  {
    "name": "metadata",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Metadata",
    "enums": null,
    "comment": "The Metadata field can be used to provide additional information for the resource. E.g. the trace data for debugging.",
    "notImp": false
  }
] };

export const Resource_SingleFields = [
  "name",
  "aliases",
  "version",
  "ttl"
];