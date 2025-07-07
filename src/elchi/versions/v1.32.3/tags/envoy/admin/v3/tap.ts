import {OutType} from '@/elchi/tags/tagsType';


export const TapRequest: OutType = { "TapRequest": [
  {
    "name": "config_id",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The opaque configuration ID used to match the configuration to a loaded extension. A tap extension configures a similar opaque ID that is used to match.",
    "notImp": false
  },
  {
    "name": "tap_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TapConfig",
    "enums": null,
    "comment": "The tap configuration to load.",
    "notImp": false
  }
] };

export const TapRequest_SingleFields = [
  "config_id"
];