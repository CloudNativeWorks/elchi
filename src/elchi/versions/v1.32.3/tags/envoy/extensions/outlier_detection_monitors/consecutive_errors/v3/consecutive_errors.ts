import {OutType} from '@/elchi/tags/tagsType';


export const ConsecutiveErrors: OutType = { "ConsecutiveErrors": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Monitor name.",
    "notImp": false
  },
  {
    "name": "threshold",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The number of consecutive errors before ejection occurs.",
    "notImp": false
  },
  {
    "name": "enforcing",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The % chance that a host is actually ejected. Defaults to 100.",
    "notImp": false
  },
  {
    "name": "error_buckets",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ErrorBuckets",
    "enums": null,
    "comment": "Error buckets.",
    "notImp": false
  }
] };

export const ConsecutiveErrors_SingleFields = [
  "name",
  "threshold",
  "enforcing"
];