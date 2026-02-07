import {OutType} from '@elchi/tags/tagsType';


export const Config: OutType = { "Config": [
  {
    "name": "downstream_discovery",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Config_DiscoveryMethod[]",
    "enums": null,
    "comment": "The order of the derivation of the downstream peer metadata, in the precedence order. First successful lookup wins.",
    "notImp": false
  },
  {
    "name": "upstream_discovery",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Config_DiscoveryMethod[]",
    "enums": null,
    "comment": "The order of the derivation of the upstream peer metadata, in the precedence order. First successful lookup wins.",
    "notImp": false
  },
  {
    "name": "downstream_propagation",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Config_PropagationMethod[]",
    "enums": null,
    "comment": "Downstream injection of the metadata via a response header.",
    "notImp": false
  },
  {
    "name": "upstream_propagation",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Config_PropagationMethod[]",
    "enums": null,
    "comment": "Upstream injection of the metadata via a request header.",
    "notImp": false
  },
  {
    "name": "shared_with_upstream",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "True to enable sharing with the upstream.",
    "notImp": false
  },
  {
    "name": "additional_labels",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Additional labels to be added to the peer metadata to help your understand the traffic. e.g. ``role``, ``location`` etc.",
    "notImp": false
  }
] };

export const Config_SingleFields = [
  "shared_with_upstream",
  "additional_labels"
];

export const Config_IstioHeaders: OutType = { "Config_IstioHeaders": [
  {
    "name": "skip_external_clusters",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Strip ``x-envoy-peer-metadata`` and ``x-envoy-peer-metadata-id`` headers on HTTP requests to services outside the mesh. Detects upstream clusters with ``istio`` and ``external`` filter metadata fields",
    "notImp": false
  }
] };

export const Config_IstioHeaders_SingleFields = [
  "skip_external_clusters"
];

export const Config_DiscoveryMethod: OutType = { "Config_DiscoveryMethod": [
  {
    "name": "method_specifier.baggage",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Config_Baggage",
    "enums": null,
    "comment": "An exhaustive list of the derivation methods.",
    "notImp": false
  },
  {
    "name": "method_specifier.workload_discovery",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Config_WorkloadDiscovery",
    "enums": null,
    "comment": "An exhaustive list of the derivation methods.",
    "notImp": false
  },
  {
    "name": "method_specifier.istio_headers",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Config_IstioHeaders",
    "enums": null,
    "comment": "An exhaustive list of the derivation methods.",
    "notImp": false
  }
] };

export const Config_PropagationMethod: OutType = { "Config_PropagationMethod": [
  {
    "name": "method_specifier.istio_headers",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Config_IstioHeaders",
    "enums": null,
    "comment": "An exhaustive list of the metadata propagation methods.",
    "notImp": false
  }
] };