import {OutType} from '@/elchi/tags/tagsType';


export const UnreadyTargetsDumps: OutType = { "UnreadyTargetsDumps": [
  {
    "name": "unready_targets_dumps",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "UnreadyTargetsDumps_UnreadyTargetsDump[]",
    "enums": null,
    "comment": "You can choose specific component to dump unready targets with mask query parameter. See `/init_dump?mask={}` for more information. The dumps of unready targets of all init managers.",
    "notImp": false
  }
] };

export const UnreadyTargetsDumps_UnreadyTargetsDump: OutType = { "UnreadyTargetsDumps_UnreadyTargetsDump": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Name of the init manager. Example: \"init_manager_xxx\".",
    "notImp": false
  },
  {
    "name": "target_names",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Names of unready targets of the init manager. Example: \"target_xxx\".",
    "notImp": false
  }
] };

export const UnreadyTargetsDumps_UnreadyTargetsDump_SingleFields = [
  "name",
  "target_names"
];