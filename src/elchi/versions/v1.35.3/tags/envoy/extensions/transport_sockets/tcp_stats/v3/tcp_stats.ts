import {OutType} from '@elchi/tags/tagsType';


export const Config: OutType = { "Config": [
  {
    "name": "transport_socket",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TransportSocket",
    "enums": null,
    "comment": "The underlying transport socket being wrapped.",
    "notImp": false
  },
  {
    "name": "update_period",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Period to update stats while the connection is open. If unset, updates only happen when the connection is closed. Stats are always updated one final time when the connection is closed.",
    "notImp": false
  }
] };

export const Config_SingleFields = [
  "update_period"
];