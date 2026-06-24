import {OutType} from '@elchi/tags/tagsType';


export const FileAccessLog: OutType = { "FileAccessLog": [
  {
    "name": "path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "A path to a local file to which to write the access log entries.",
    "notImp": false
  },
  {
    "name": "access_log_format.format",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Custom configuration for an `AccessLog` that writes log entries directly to a file. Configures the built-in ``envoy.access_loggers.file`` AccessLog. [#next-free-field: 6]",
    "notImp": false
  },
  {
    "name": "access_log_format.json_format",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "{ [key: string]: any; }",
    "enums": null,
    "comment": "Custom configuration for an `AccessLog` that writes log entries directly to a file. Configures the built-in ``envoy.access_loggers.file`` AccessLog. [#next-free-field: 6]",
    "notImp": false
  },
  {
    "name": "access_log_format.typed_json_format",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "{ [key: string]: any; }",
    "enums": null,
    "comment": "Custom configuration for an `AccessLog` that writes log entries directly to a file. Configures the built-in ``envoy.access_loggers.file`` AccessLog. [#next-free-field: 6]",
    "notImp": false
  },
  {
    "name": "access_log_format.log_format",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "SubstitutionFormatString",
    "enums": null,
    "comment": "Custom configuration for an `AccessLog` that writes log entries directly to a file. Configures the built-in ``envoy.access_loggers.file`` AccessLog. [#next-free-field: 6]",
    "notImp": false
  }
] };

export const FileAccessLog_SingleFields = [
  "path",
  "access_log_format.format"
];