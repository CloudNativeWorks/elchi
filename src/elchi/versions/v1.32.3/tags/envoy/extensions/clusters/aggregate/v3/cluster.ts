import {OutType} from '@/elchi/tags/tagsType';


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