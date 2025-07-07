import {OutType} from '@/elchi/tags/tagsType';


export const LuaConfig: OutType = { "LuaConfig": [
  {
    "name": "source_code",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DataSource",
    "enums": null,
    "comment": "The lua code that Envoy will execute to select cluster.",
    "notImp": false
  },
  {
    "name": "default_cluster",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Default cluster. It will be used when the lua code execute failure.",
    "notImp": false
  }
] };

export const LuaConfig_SingleFields = [
  "default_cluster"
];