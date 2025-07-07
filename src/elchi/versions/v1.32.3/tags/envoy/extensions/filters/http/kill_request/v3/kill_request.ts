import {OutType} from '@/elchi/tags/tagsType';


export const KillRequest: OutType = { "KillRequest": [
  {
    "name": "probability",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FractionalPercent",
    "enums": null,
    "comment": "The probability that a Kill request will be triggered.",
    "notImp": false
  },
  {
    "name": "kill_request_header",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the kill request header. If this field is not empty, it will override the `default header` name. Otherwise the default header name will be used.",
    "notImp": false
  },
  {
    "name": "direction",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "KillRequest_Direction",
    "enums": [
      "REQUEST",
      "RESPONSE"
    ],
    "comment": "",
    "notImp": false
  }
] };

export const KillRequest_SingleFields = [
  "kill_request_header",
  "direction"
];