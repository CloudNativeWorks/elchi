import {OutType} from '@/elchi/tags/tagsType';


export const Status: OutType = { "Status": [
  {
    "name": "code",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The status code, which should be an enum value of [google.rpc.Code][google.rpc.Code].",
    "notImp": false
  },
  {
    "name": "message",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "A developer-facing error message, which should be in English. Any user-facing error message should be localized and sent in the [google.rpc.Status.details][google.rpc.Status.details] field, or localized by the client.",
    "notImp": false
  },
  {
    "name": "details",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Any[]",
    "enums": null,
    "comment": "A list of messages that carry the error details.  There is a common set of message types for APIs to use.",
    "notImp": false
  }
] };

export const Status_SingleFields = [
  "code",
  "message"
];