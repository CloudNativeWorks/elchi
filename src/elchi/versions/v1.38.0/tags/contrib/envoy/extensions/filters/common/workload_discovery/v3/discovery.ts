import {OutType} from '@elchi/tags/tagsType';


export const GatewayAddress: OutType = { "GatewayAddress": [
  {
    "name": "destination.hostname",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "NamespacedHostname",
    "enums": null,
    "comment": "TODO: add support for hostname lookup",
    "notImp": false
  },
  {
    "name": "destination.address",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "NetworkAddress",
    "enums": null,
    "comment": "address can either be a hostname (ex: gateway.example.com) or an IP (ex: 1.2.3.4).",
    "notImp": false
  },
  {
    "name": "hbone_mtls_port",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "port to reach the gateway at for mTLS HBONE connections",
    "notImp": false
  }
] };

export const GatewayAddress_SingleFields = [
  "hbone_mtls_port"
];

export const ApplicationTunnel: OutType = { "ApplicationTunnel": [
  {
    "name": "protocol",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ApplicationTunnel_Protocol",
    "enums": [
      "NONE",
      "PROXY"
    ],
    "comment": "A target natively handles this type of traffic.",
    "notImp": false
  },
  {
    "name": "port",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "optional: if set, traffic should be sent to this port after the last zTunnel hop",
    "notImp": false
  }
] };

export const ApplicationTunnel_SingleFields = [
  "protocol",
  "port"
];

export const Locality: OutType = { "Locality": [
  {
    "name": "region",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "zone",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "subzone",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const Locality_SingleFields = [
  "region",
  "zone",
  "subzone"
];

export const Workload: OutType = { "Workload": [
  {
    "name": "uid",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "UID represents a globally unique opaque identifier for this workload. For k8s resources, it is recommended to use the more readable format:\n\ncluster/group/kind/namespace/name/section-name\n\nAs an example, a ServiceEntry with two WorkloadEntries inlined could become two Workloads with the following UIDs: - cluster1/networking.istio.io/v1alpha3/ServiceEntry/default/external-svc/endpoint1 - cluster1/networking.istio.io/v1alpha3/ServiceEntry/default/external-svc/endpoint2\n\nFor VMs and other workloads other formats are also supported; for example, a single UID string: \"0ae5c03d-5fb3-4eb9-9de8-2bd4b51606ba\"",
    "notImp": false
  },
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Name represents the name for the workload. For Kubernetes, this is the pod name. This is just for debugging and may be elided as an optimization.",
    "notImp": false
  },
  {
    "name": "namespace",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Namespace represents the namespace for the workload. This is just for debugging and may be elided as an optimization.",
    "notImp": false
  },
  {
    "name": "addresses",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Uint8Array<ArrayBufferLike>[]",
    "enums": null,
    "comment": "Address represents the IPv4/IPv6 address for the workload. This should be globally unique. This should not have a port number. Each workload must have at least either an address or hostname; not both.",
    "notImp": false
  },
  {
    "name": "hostname",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The hostname for the workload to be resolved by the ztunnel. DNS queries are sent on-demand by default. If the resolved DNS query has several endpoints, the request will be forwarded to the first response.\n\nAt a minimum, each workload must have either an address or hostname. For example, a workload that backs a Kubernetes service will typically have only endpoints. A workload that backs a headless Kubernetes service, however, will have both addresses as well as a hostname used for direct access to the headless endpoint.",
    "notImp": false
  },
  {
    "name": "network",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Network represents the network this workload is on. This may be elided for the default network. A (network,address) pair makeup a unique key for a workload *at a point in time*.",
    "notImp": false
  },
  {
    "name": "tunnel_protocol",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TunnelProtocol",
    "enums": [
      "NONE",
      "HBONE"
    ],
    "comment": "Protocol that should be used to connect to this workload.",
    "notImp": false
  },
  {
    "name": "trust_domain",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The SPIFFE identity of the workload. The identity is joined to form spiffe://<trust_domain>/ns/<namespace>/sa/<service_account>. TrustDomain of the workload. May be elided if this is the mesh wide default (typically cluster.local)",
    "notImp": false
  },
  {
    "name": "service_account",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "ServiceAccount of the workload. May be elided if this is \"default\"",
    "notImp": false
  },
  {
    "name": "waypoint",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "GatewayAddress",
    "enums": null,
    "comment": "If present, the waypoint proxy for this workload. All incoming requests must go through the waypoint.",
    "notImp": false
  },
  {
    "name": "network_gateway",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "GatewayAddress",
    "enums": null,
    "comment": "If present, East West network gateway this workload can be reached through. Requests from remote networks should traverse this gateway.",
    "notImp": false
  },
  {
    "name": "node",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Name of the node the workload runs on",
    "notImp": false
  },
  {
    "name": "canonical_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "CanonicalName for the workload. Used for telemetry.",
    "notImp": false
  },
  {
    "name": "canonical_revision",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "CanonicalRevision for the workload. Used for telemetry.",
    "notImp": false
  },
  {
    "name": "workload_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "WorkloadType",
    "enums": [
      "DEPLOYMENT",
      "CRONJOB",
      "POD",
      "JOB"
    ],
    "comment": "WorkloadType represents the type of the workload. Used for telemetry.",
    "notImp": false
  },
  {
    "name": "workload_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "WorkloadName represents the name for the workload (of type WorkloadType). Used for telemetry.",
    "notImp": false
  },
  {
    "name": "native_tunnel",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set, this indicates a workload expects to directly receive tunnel traffic. In ztunnel, this means: * Requests *from* this workload do not need to be tunneled if they already are tunneled by the tunnel_protocol. * Requests *to* this workload, via the tunnel_protocol, do not need to be de-tunneled.",
    "notImp": false
  },
  {
    "name": "application_tunnel",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ApplicationTunnel",
    "enums": null,
    "comment": "If an application, such as a sandwiched waypoint proxy, supports directly receiving information from zTunnel they can set application_protocol.",
    "notImp": false
  },
  {
    "name": "services",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, PortList>",
    "enums": null,
    "comment": "The services for which this workload is an endpoint. The key is the NamespacedHostname string of the format namespace/hostname.",
    "notImp": false
  },
  {
    "name": "authorization_policies",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "A list of authorization policies applicable to this workload. NOTE: this *only* includes Selector based policies. Namespace and global polices are returned out of band. Authorization policies are only valid for workloads with ``addresses`` rather than ``hostname``.",
    "notImp": false
  },
  {
    "name": "status",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "WorkloadStatus",
    "enums": [
      "HEALTHY",
      "UNHEALTHY"
    ],
    "comment": "",
    "notImp": false
  },
  {
    "name": "cluster_id",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The cluster ID that the workload instance belongs to",
    "notImp": false
  },
  {
    "name": "locality",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Locality",
    "enums": null,
    "comment": "The Locality defines information about where a workload is geographically deployed",
    "notImp": false
  },
  {
    "name": "network_mode",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "NetworkMode",
    "enums": [
      "STANDARD",
      "HOST_NETWORK"
    ],
    "comment": "",
    "notImp": false
  }
] };

export const Workload_SingleFields = [
  "uid",
  "name",
  "namespace",
  "hostname",
  "network",
  "tunnel_protocol",
  "trust_domain",
  "service_account",
  "node",
  "canonical_name",
  "canonical_revision",
  "workload_type",
  "workload_name",
  "native_tunnel",
  "authorization_policies",
  "status",
  "cluster_id",
  "network_mode"
];

export const PortList: OutType = { "PortList": [
  {
    "name": "ports",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Port[]",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const Workload_ServicesEntry: OutType = { "Workload_ServicesEntry": [
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
    "fieldType": "PortList",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const Workload_ServicesEntry_SingleFields = [
  "key"
];

export const Port: OutType = { "Port": [
  {
    "name": "service_port",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Port the service is reached at (frontend).",
    "notImp": false
  },
  {
    "name": "target_port",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Port the service forwards to (backend).",
    "notImp": false
  }
] };

export const Port_SingleFields = [
  "service_port",
  "target_port"
];

export const NetworkAddress: OutType = { "NetworkAddress": [
  {
    "name": "network",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Network represents the network this address is on.",
    "notImp": false
  },
  {
    "name": "address",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Uint8Array<ArrayBufferLike>",
    "enums": null,
    "comment": "Address presents the IP (v4 or v6).",
    "notImp": false
  }
] };

export const NetworkAddress_SingleFields = [
  "network"
];

export const NamespacedHostname: OutType = { "NamespacedHostname": [
  {
    "name": "namespace",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The namespace the service is in.",
    "notImp": false
  },
  {
    "name": "hostname",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "hostname (ex: gateway.example.com)",
    "notImp": false
  }
] };

export const NamespacedHostname_SingleFields = [
  "namespace",
  "hostname"
];