import {OutType} from '@elchi/tags/tagsType';


export const CpuUtilizationConfig: OutType = { "CpuUtilizationConfig": [
  {
    "name": "mode",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CpuUtilizationConfig_UtilizationComputeStrategy",
    "enums": [
      "HOST",
      "CONTAINER"
    ],
    "comment": "",
    "notImp": false
  }
] };

export const CpuUtilizationConfig_SingleFields = [
  "mode"
];