import {OutType} from '@/elchi/tags/tagsType';


export const MinimumClustersValidator: OutType = { "MinimumClustersValidator": [
  {
    "name": "min_clusters_num",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The minimal clusters threshold. Any CDS config update leading to less than this number will be rejected. Default value is 0.",
    "notImp": false
  }
] };

export const MinimumClustersValidator_SingleFields = [
  "min_clusters_num"
];