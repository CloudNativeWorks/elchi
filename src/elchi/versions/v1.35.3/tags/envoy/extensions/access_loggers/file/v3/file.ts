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
    "comment": "Access log `format string`. Envoy supports `custom access log formats` as well as a `default format`. This field is deprecated. Please use `log_format`.",
    "notImp": false
  },
  {
    "name": "access_log_format.json_format",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "{ [key: string]: any; }",
    "enums": null,
    "comment": "Access log `format dictionary`. All values are rendered as strings. This field is deprecated. Please use `log_format`.",
    "notImp": false
  },
  {
    "name": "access_log_format.typed_json_format",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "{ [key: string]: any; }",
    "enums": null,
    "comment": "Access log `format dictionary`. Values are rendered as strings, numbers, or boolean values as appropriate. Nested JSON objects may be produced by some command operators (e.g.FILTER_STATE or DYNAMIC_METADATA). See the documentation for a specific command operator for details. This field is deprecated. Please use `log_format`.",
    "notImp": false
  },
  {
    "name": "access_log_format.log_format",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "SubstitutionFormatString",
    "enums": null,
    "comment": "Configuration to form access log data and format. If not specified, use `default format`.",
    "notImp": false
  }
] };

export const FileAccessLog_SingleFields = [
  "path",
  "access_log_format.format"
];