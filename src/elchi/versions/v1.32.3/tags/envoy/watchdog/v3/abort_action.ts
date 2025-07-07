import {OutType} from '@/elchi/tags/tagsType';


export const AbortActionConfig: OutType = { "AbortActionConfig": [
  {
    "name": "wait_duration",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "How long to wait for the thread to respond to the thread kill function before killing the process from this action. This is a blocking action. By default this is 5 seconds.",
    "notImp": false
  }
] };

export const AbortActionConfig_SingleFields = [
  "wait_duration"
];