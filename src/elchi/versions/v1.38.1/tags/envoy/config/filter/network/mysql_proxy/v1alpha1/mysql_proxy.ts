import {OutType} from '@elchi/tags/tagsType';


export const MySQLProxy: OutType = { "MySQLProxy": [
  {
    "name": "stat_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The human readable prefix to use when emitting `statistics`.",
    "notImp": false
  },
  {
    "name": "access_log",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "[#not-implemented-hide:] The optional path to use for writing MySQL access logs. If the access log field is empty, access logs will not be written.",
    "notImp": true
  }
] };

export const MySQLProxy_SingleFields = [
  "stat_prefix",
  "access_log"
];