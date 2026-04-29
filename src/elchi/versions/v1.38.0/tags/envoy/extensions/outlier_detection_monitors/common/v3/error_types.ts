import {OutType} from '@elchi/tags/tagsType';


export const HttpErrors: OutType = { "HttpErrors": [
  {
    "name": "range",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Int32Range",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const ErrorBuckets: OutType = { "ErrorBuckets": [
  {
    "name": "http_errors",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HttpErrors[]",
    "enums": null,
    "comment": "List of buckets \"catching\" HTTP codes.",
    "notImp": false
  },
  {
    "name": "local_origin_errors",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "LocalOriginErrors[]",
    "enums": null,
    "comment": "List of buckets \"catching\" locally originated errors.",
    "notImp": false
  },
  {
    "name": "database_errors",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DatabaseErrors[]",
    "enums": null,
    "comment": "List of buckets \"catching\" database errors.",
    "notImp": false
  }
] };