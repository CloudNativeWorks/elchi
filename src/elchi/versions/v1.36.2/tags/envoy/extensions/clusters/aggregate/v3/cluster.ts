import {OutType} from '@elchi/tags/tagsType';


export const ClusterConfig: OutType = { "ClusterConfig": [
  {
    "name": "clusters",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Load balancing clusters in aggregate cluster. Clusters are prioritized based on the order they appear in this list.",
    "notImp": false
  }
] };

export const ClusterConfig_SingleFields = [
  "clusters"
];

export const AggregateClusterResource: OutType = { "AggregateClusterResource": [
  {
    "name": "config_source",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ConfigSource",
    "enums": null,
    "comment": "Configuration source specifier for the ClusterConfig resource. Only the aggregated protocol variants are supported; if configured otherwise, the cluster resource will be NACKed.",
    "notImp": false
  },
  {
    "name": "resource_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the ClusterConfig resource to subscribe to.",
    "notImp": false
  }
] };

export const AggregateClusterResource_SingleFields = [
  "resource_name"
];