import {OutType} from '@/elchi/tags/tagsType';


export const LightstepConfig: OutType = { "LightstepConfig": [
  {
    "name": "collector_cluster",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The cluster manager cluster that hosts the LightStep collectors.",
    "notImp": false
  },
  {
    "name": "access_token_file",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "string",
    "enums": null,
    "comment": "File containing the access token to the `LightStep <https://lightstep.com/>`_ API.",
    "notImp": false
  },
  {
    "name": "access_token",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DataSource",
    "enums": null,
    "comment": "Access token to the `LightStep <https://lightstep.com/>`_ API.",
    "notImp": false
  },
  {
    "name": "propagation_modes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "LightstepConfig_PropagationMode[]",
    "enums": null,
    "comment": "Propagation modes to use by LightStep's tracer.",
    "notImp": false
  }
] };

export const LightstepConfig_SingleFields = [
  "collector_cluster"
];