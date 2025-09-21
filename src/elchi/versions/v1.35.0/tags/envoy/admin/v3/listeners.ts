import {OutType} from '@elchi/tags/tagsType';


export const Listeners: OutType = { "Listeners": [
  {
    "name": "listener_statuses",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ListenerStatus[]",
    "enums": null,
    "comment": "List of listener statuses.",
    "notImp": false
  }
] };

export const ListenerStatus: OutType = { "ListenerStatus": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Name of the listener",
    "notImp": false
  },
  {
    "name": "local_address",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Address",
    "enums": null,
    "comment": "The actual local address that the listener is listening on. If a listener was configured to listen on port 0, then this address has the port that was allocated by the OS.",
    "notImp": false
  },
  {
    "name": "additional_local_addresses",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Address[]",
    "enums": null,
    "comment": "The additional addresses the listener is listening on as specified via the `additional_addresses` configuration.",
    "notImp": false
  }
] };

export const ListenerStatus_SingleFields = [
  "name"
];