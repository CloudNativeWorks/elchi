import {OutType} from '@elchi/tags/tagsType';


export const HealthCheckEventFileSink: OutType = { "HealthCheckEventFileSink": [
  {
    "name": "event_log_path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Specifies the path to the health check event log.",
    "notImp": false
  }
] };

export const HealthCheckEventFileSink_SingleFields = [
  "event_log_path"
];