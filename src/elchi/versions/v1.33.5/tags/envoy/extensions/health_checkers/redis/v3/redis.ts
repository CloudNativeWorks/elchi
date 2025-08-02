import {OutType} from '@elchi/tags/tagsType';


export const Redis: OutType = { "Redis": [
  {
    "name": "key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "If set, optionally perform ``EXISTS <key>`` instead of ``PING``. A return value from Redis of 0 (does not exist) is considered a passing healthcheck. A return value other than 0 is considered a failure. This allows the user to mark a Redis instance for maintenance by setting the specified key to any value and waiting for traffic to drain.",
    "notImp": false
  }
] };

export const Redis_SingleFields = [
  "key"
];