import {OutType} from '@elchi/tags/tagsType';


export const AsyncFileManagerConfig: OutType = { "AsyncFileManagerConfig": [
  {
    "name": "id",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "An optional identifier for the manager. An empty string is a valid identifier for a common, default ``AsyncFileManager``.\n\nReusing the same id with different configurations in the same envoy instance is an error.",
    "notImp": false
  },
  {
    "name": "manager_type.thread_pool",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "AsyncFileManagerConfig_ThreadPool",
    "enums": null,
    "comment": "Configuration for a thread-pool based async file manager.",
    "notImp": false
  }
] };

export const AsyncFileManagerConfig_SingleFields = [
  "id"
];

export const AsyncFileManagerConfig_ThreadPool: OutType = { "AsyncFileManagerConfig_ThreadPool": [
  {
    "name": "thread_count",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The number of threads to use. If unset or zero, will default to the number of concurrent threads the hardware supports. This default is subject to change if performance analysis suggests it.",
    "notImp": false
  }
] };

export const AsyncFileManagerConfig_ThreadPool_SingleFields = [
  "thread_count"
];