import {OutType} from '@elchi/tags/tagsType';


export const ClusterConfig: OutType = { "ClusterConfig": [
  {
    "name": "clusters",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ClusterConfig_ClusterEntry[]",
    "enums": null,
    "comment": "List of clusters to use for request routing. The first cluster is used for the initial request (attempt 1), the second cluster for the first retry (attempt 2), and so on. Must contain at least one cluster. When retry attempts exceed the number of configured clusters, requests will fail with no host available.",
    "notImp": false
  }
] };

export const ClusterConfig_ClusterEntry: OutType = { "ClusterConfig_ClusterEntry": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Name of the cluster. This cluster must be defined elsewhere in the configuration.",
    "notImp": false
  }
] };

export const ClusterConfig_ClusterEntry_SingleFields = [
  "name"
];