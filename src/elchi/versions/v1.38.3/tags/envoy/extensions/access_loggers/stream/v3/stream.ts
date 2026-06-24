import {OutType} from '@elchi/tags/tagsType';


export const StdoutAccessLog: OutType = { "StdoutAccessLog": [
  {
    "name": "access_log_format.log_format",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "SubstitutionFormatString",
    "enums": null,
    "comment": "Custom configuration for an `AccessLog` that writes log entries directly to the operating system's standard output. [#extension: envoy.access_loggers.stdout]",
    "notImp": false
  }
] };

export const StderrAccessLog: OutType = { "StderrAccessLog": [
  {
    "name": "access_log_format.log_format",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "SubstitutionFormatString",
    "enums": null,
    "comment": "Custom configuration for an `AccessLog` that writes log entries directly to the operating system's standard error. [#extension: envoy.access_loggers.stderr]",
    "notImp": false
  }
] };